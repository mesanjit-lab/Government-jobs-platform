// Operator-only JWT acceptance / zero-row reader checks. NOT application auth.
// No acquisition, SDK, persistence, refresh, Auth user query, SQL or write path.
import { createPublicKey, verify as verifySignature } from "node:crypto";
import { pathToFileURL } from "node:url";
import { getSupabasePublicEnv } from "../lib/supabase/env.ts";
import { anonymousChecks, buildReaderRequest, classifyReaderResponse } from "./verify-supabase-readers.mjs";

export const EXPECTED_SUBJECT = "2306a291-106e-4add-b342-ed89050de689";
export const INVALID_TOKEN_CONTROL = "OFFLINE_INVALID_JWT_CONTROL";
const MAX_TOKEN = 16_384;
const MAX_RUN = 180_000;
// JWT/JWKS payloads are already byte-bounded. These independent limits avoid
// relying on JavaScript stack exhaustion or large container allocation: depth is
// measured from root value zero; nodes count every container and scalar value.
export const JSON_PARSE_LIMITS = Object.freeze({ maxDepth: 32, maxNodes: 1_024 });
const LIMITS = "JWT acceptance and zero-row reader grants only; NOT independent database role, auth.uid, identity RLS, ownership, staff authorization, row visibility, HTTP writes or application sessions.";
const fail = () => { throw new Error("Token/key validation failed; details withheld."); };
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// JSON.parse accepts duplicate member names. Check every object level before
// accepting untrusted JWT/JWKS JSON, including ignored nested metadata.
function parseUniqueJson(bytes) {
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  let index = 0;
  let nodes = 0;
  const whitespace = () => { while (/[\t\n\r ]/.test(text[index] ?? "")) index++; };
  const string = () => {
    if (text[index++] !== '"') fail();
    let result = "";
    while (index < text.length) {
      const character = text[index++];
      if (character === '"') return result;
      if (character < " ") fail();
      if (character !== "\\") { result += character; continue; }
      const escape = text[index++];
      if (escape === '"' || escape === "\\" || escape === "/") result += escape;
      else if (escape === "b") result += "\b";
      else if (escape === "f") result += "\f";
      else if (escape === "n") result += "\n";
      else if (escape === "r") result += "\r";
      else if (escape === "t") result += "\t";
      else if (escape === "u") {
        const hex = text.slice(index, index + 4);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) fail();
        result += String.fromCharCode(Number.parseInt(hex, 16));
        index += 4;
      } else fail();
    }
    fail();
  };
  const value = (depth = 0) => {
    if (depth > JSON_PARSE_LIMITS.maxDepth || ++nodes > JSON_PARSE_LIMITS.maxNodes) fail();
    whitespace();
    if (text[index] === '"') return string();
    if (text[index] === "{") {
      index++;
      const result = Object.create(null);
      const names = new Set();
      whitespace();
      if (text[index] === "}") { index++; return result; }
      while (true) {
        whitespace();
        if (text[index] !== '"') fail();
        const name = string();
        if (names.has(name)) fail();
        names.add(name);
        whitespace();
        if (text[index++] !== ":") fail();
        result[name] = value(depth + 1);
        whitespace();
        if (text[index] === "}") { index++; return result; }
        if (text[index++] !== ",") fail();
      }
    }
    if (text[index] === "[") {
      index++;
      const result = [];
      whitespace();
      if (text[index] === "]") { index++; return result; }
      while (true) {
        result.push(value(depth + 1));
        whitespace();
        if (text[index] === "]") { index++; return result; }
        if (text[index++] !== ",") fail();
      }
    }
    for (const [literal, parsed] of [["true", true], ["false", false], ["null", null]]) {
      if (text.startsWith(literal, index)) { index += literal.length; return parsed; }
    }
    const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(index));
    if (!match) fail();
    index += match[0].length;
    const parsed = Number(match[0]);
    if (!Number.isFinite(parsed)) fail();
    return parsed;
  };
  const parsed = value();
  whitespace();
  if (index !== text.length) fail();
  return parsed;
}

function decodePart(part, maxBytes) {
  if (typeof part !== "string" || !/^[A-Za-z0-9_-]+$/.test(part) || part.length > MAX_TOKEN) fail();
  const bytes = Buffer.from(part, "base64url");
  if (!bytes.length || bytes.length > maxBytes || bytes.toString("base64url") !== part) fail();
  return bytes;
}

// Sanity checks only. This result remains UNTRUSTED until verifyTokenKey succeeds.
function inspectToken(token, issuer, lifetimeSeconds) {
  if (typeof token !== "string" || token.length > MAX_TOKEN) fail();
  const parts = token.split(".");
  if (parts.length !== 3) fail();
  const header = parseUniqueJson(decodePart(parts[0], 1_024));
  const claims = parseUniqueJson(decodePart(parts[1], 8_192));
  const signature = decodePart(parts[2], 512);
  if (!object(header) || !object(claims) || !["ES256", "RS256"].includes(header.alg) ||
      Object.keys(header).some((key) => !["alg", "kid", "typ"].includes(key)) ||
      (header.typ !== undefined && header.typ !== "JWT") ||
      typeof header.kid !== "string" || !/^[A-Za-z0-9_.-]{1,128}$/.test(header.kid) ||
      (header.alg === "ES256" ? signature.length !== 64 : signature.length < 256)) fail();
  const now = Math.floor(Date.now() / 1_000);
  if (claims.iss !== issuer || claims.sub !== EXPECTED_SUBJECT || claims.aud !== "authenticated" ||
      claims.role !== "authenticated" || claims.is_anonymous !== false ||
      typeof claims.session_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(claims.session_id) ||
      !Number.isSafeInteger(claims.exp) || !Number.isSafeInteger(claims.iat) ||
      claims.exp - now < lifetimeSeconds || claims.iat > now + 30 || claims.iat < now - 86_400 ||
      claims.exp <= claims.iat || claims.exp - claims.iat > 86_400 ||
      (claims.nbf !== undefined && (!Number.isSafeInteger(claims.nbf) || claims.nbf > now || claims.nbf >= claims.exp))) fail();
  return { header, signature, parts };
}

function verifyTokenKey(inspected, jwks) {
  if (!object(jwks) || !Array.isArray(jwks.keys) || !jwks.keys.length || jwks.keys.length > 16) fail();
  const matches = jwks.keys.filter((key) => object(key) && key.kid === inspected.header.kid);
  if (matches.length !== 1) fail();
  const key = matches[0];
  if ((key.alg !== undefined && key.alg !== inspected.header.alg) ||
      (key.use !== undefined && key.use !== "sig") ||
      (key.key_ops !== undefined && (!Array.isArray(key.key_ops) || key.key_ops.length !== 1 || key.key_ops[0] !== "verify")) ||
      ["d", "p", "q", "dp", "dq", "qi", "oth"].some((name) => name in key)) fail();
  let publicJwk;
  if (inspected.header.alg === "ES256") {
    if (key.kty !== "EC" || key.crv !== "P-256" || decodePart(key.x, 32).length !== 32 || decodePart(key.y, 32).length !== 32) fail();
    publicJwk = { kty: "EC", crv: "P-256", x: key.x, y: key.y };
  } else {
    if (key.kty !== "RSA" || decodePart(key.n, 512).length < 256 || decodePart(key.e, 8).length > 8) fail();
    publicJwk = { kty: "RSA", n: key.n, e: key.e };
  }
  const publicKey = createPublicKey({ key: publicJwk, format: "jwk" });
  if (inspected.header.alg === "RS256" &&
      (publicKey.asymmetricKeyDetails.modulusLength < 2_048 || publicKey.asymmetricKeyDetails.modulusLength > 4_096)) fail();
  const settings = inspected.header.alg === "ES256" ? { key: publicKey, dsaEncoding: "ieee-p1363" } : publicKey;
  if (!verifySignature("sha256", Buffer.from(`${inspected.parts[0]}.${inspected.parts[1]}`), settings, inspected.signature)) fail();
}

// Fixed controls only; callers cannot supply another endpoint or control token.
function corruptedSignature(inspected) {
  const signature = Buffer.from(inspected.signature);
  signature[0] ^= 1;
  return `${inspected.parts[0]}.${inspected.parts[1]}.${signature.toString("base64url")}`;
}

export function classifyInvalidTokenResponse(status, payload) {
  const baseline = classifyReaderResponse(true, status, payload);
  if (baseline.outcome.startsWith("INCONCLUSIVE_") || baseline.outcome === "FAIL_REDIRECT") return baseline;
  // PGRST301 is a JWT validation failure. Missing-token/API-key/42501 denials
  // and raw message text are NOT proof that the invalid JWT was rejected.
  return {
    outcome: status === 401 && baseline.code === "PGRST301" ? "PASS_INVALID_JWT_REJECTED" :
      status >= 200 && status <= 299 ? "FAIL_INVALID_JWT_ACCEPTED" : "FAIL_INVALID_JWT_CONTROL",
    httpStatus: status, code: baseline.code,
  };
}

async function readJson(response, maxBytes) {
  const reader = response.body?.getReader();
  if (!reader) return null;
  let size = 0;
  let text = "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) return null;
      text += decoder.decode(value, { stream: true });
    }
    try { return parseUniqueJson(Buffer.from(text + decoder.decode())); } catch { return null; }
  } finally { void reader.cancel().catch(() => {}); }
}

// Entire fetch AND body handling are bounded, even for mocks ignoring abort.
async function boundedGet(request, fetchImpl, timeoutMs, consume, maxBytes) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve({ outcome: "INCONCLUSIVE_NETWORK", httpStatus: null, code: null });
    }, timeoutMs);
  });
  const operation = (async () => {
    try {
      const response = await fetchImpl(request.url, { ...request.init, signal: controller.signal });
      if (response.redirected || (response.url && response.url !== request.url.href)) {
        return { outcome: "FAIL_REDIRECT", httpStatus: response.status, code: null };
      }
      if (response.status === 408 || response.status === 429 || response.status >= 500 ||
          (response.status >= 300 && response.status < 400)) {
        void response.body?.cancel().catch(() => {});
        return classifyReaderResponse(true, response.status, null);
      }
      return consume(response.status, await readJson(response, maxBytes));
    } catch { return { outcome: "INCONCLUSIVE_NETWORK", httpStatus: null, code: null }; }
  })();
  try { return await Promise.race([operation, timeout]); }
  finally { clearTimeout(timer); controller.abort(); }
}

export async function verifyAuthenticatedReaders(options = {}) {
  const probes = anonymousChecks(options.includeWildcards === true);
  const summary = {
    mode: "AUTHENTICATED_JWT_READER", status: "NOT_RUN", ok: false,
    planned: probes.length + 3, completed: 0, passed: 0,
    categories: { approved: 14, excluded: 52, private: 25, wildcard: options.includeWildcards === true ? 17 : 0, jwtControls: 2, jwks: 1 },
    signatureValidated: false, jwtAcceptance: "NOT RUN", firstNonPass: null, limits: LIMITS,
  };
  const supported = ["allowNetwork", "confirmedProject", "expectedProjectRef", "includeWildcards", "accessToken", "fetchImpl", "requestTimeoutMs", "runTimeoutMs"];
  if (Object.keys(options).some((name) => !supported.includes(name)) || options.allowNetwork !== true ||
      options.confirmedProject !== "myresult" || typeof options.expectedProjectRef !== "string" ||
      !/^[a-z0-9]{20}$/.test(options.expectedProjectRef)) return summary;
  const requestTimeout = options.requestTimeoutMs ?? 10_000;
  const runTimeout = options.runTimeoutMs ?? MAX_RUN;
  if (!Number.isFinite(requestTimeout) || requestTimeout <= 0 || requestTimeout > 10_000 ||
      !Number.isFinite(runTimeout) || runTimeout <= 0 || runTimeout > MAX_RUN ||
      (options.fetchImpl !== undefined && typeof options.fetchImpl !== "function")) return summary;
  const accessToken = options.accessToken;
  if (accessToken === undefined || accessToken === "") return summary;
  let config, requests, inspected;
  const requiredLifetime = Math.ceil(runTimeout / 1_000) + 60;
  try {
    config = getSupabasePublicEnv();
    requests = probes.map((probe) => buildReaderRequest(config, probe));
    if (requests.some(({ url }) => url.hostname !== `${options.expectedProjectRef}.supabase.co`)) fail();
    inspected = inspectToken(accessToken, `${config.url}/auth/v1`, requiredLifetime);
  } catch { return { ...summary, status: "FAIL", firstNonPass: { check: "LOCAL_PREFLIGHT", outcome: "FAIL_CONFIG_OR_TOKEN" } }; }
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const started = performance.now();
  const record = (check, result) => {
    // Only internally fixed labels and classifier output; no request/raw data.
    summary.completed++;
    if (result.outcome.startsWith("PASS_")) { summary.passed++; return true; }
    summary.status = result.outcome.startsWith("INCONCLUSIVE_") ? "INCONCLUSIVE" : "FAIL";
    summary.firstNonPass = { check, ...result };
    return false;
  };
  const run = async (request, consume, maxBytes = 16_384) => {
    const remaining = runTimeout - (performance.now() - started);
    if (remaining <= 0) return { outcome: "INCONCLUSIVE_DEADLINE", httpStatus: null, code: null };
    return boundedGet(request, fetchImpl, Math.min(requestTimeout, remaining), consume, maxBytes);
  };
  // No token is sent to the public signing-key discovery endpoint. No SDK fallback.
  const jwksRequest = {
    url: new URL("/auth/v1/.well-known/jwks.json", config.url),
    init: { method: "GET", redirect: "error", credentials: "omit", cache: "no-store",
      headers: { apikey: config.publishableKey, Accept: "application/json" } },
  };
  const jwksResult = await run(jwksRequest, (status, payload) => {
    if (status !== 200) return { outcome: "FAIL_JWKS_RESPONSE", httpStatus: status, code: null };
    try {
      verifyTokenKey(inspected, payload);
      return { outcome: "PASS_SIGNATURE_VALIDATED", httpStatus: status, code: null };
    } catch { return { outcome: "FAIL_SIGNING_KEY_OR_SIGNATURE", httpStatus: status, code: null }; }
  }, 65_536);
  if (!record("JWKS_SIGNATURE", jwksResult)) return summary;
  summary.signatureValidated = true;
  const authorizedRequest = (request, token) => ({ url: request.url, init: { ...request.init,
    headers: { ...request.init.headers, Authorization: `Bearer ${token}` } } });
  // A successful public read alone is NEVER the final PASS. Validate paired
  // controls on the exact same approved projection before the rest of the matrix.
  if (!record("APPROVED_VALID_JWT", await run(authorizedRequest(requests[0], accessToken),
    (status, payload) => classifyReaderResponse(true, status, payload)))) return summary;
  for (const [label, token] of [["CORRUPTED_SIGNATURE", corruptedSignature(inspected)], ["INVALID_SYNTHETIC_JWT", INVALID_TOKEN_CONTROL]]) {
    if (!record(label, await run(authorizedRequest(requests[0], token), classifyInvalidTokenResponse))) return summary;
  }
  summary.jwtAcceptance = "PASS_WITHIN_LIMITS";
  for (let index = 1; index < probes.length; index++) {
    // No automatic refresh or fallback if the token ages during the run.
    try { inspectToken(accessToken, `${config.url}/auth/v1`, 30); }
    catch {
      record("TOKEN_LIFETIME", { outcome: "FAIL_TOKEN_LIFETIME", httpStatus: null, code: null });
      return summary;
    }
    const probe = probes[index];
    if (!record(`${probe.category}:${probe.table}:${probe.projection}`, await run(authorizedRequest(requests[index], accessToken),
      (status, payload) => classifyReaderResponse(probe.allowed, status, payload)))) return summary;
  }
  return { ...summary, ok: true, status: "PASS" };
}

// Concealed TTY only: no argv/env/file intake, no echo, no token length output.
// Raw mode avoids terminal line echo; all listeners/mode/state restored on exit.
export async function readConcealedToken(input = process.stdin, output = process.stderr, timeoutMs = 60_000, runtime = process) {
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== "function" ||
      typeof input.listenerCount !== "function" || input.listenerCount("data") !== 0 ||
      !runtime || typeof runtime.on !== "function" || typeof runtime.once !== "function" || typeof runtime.removeListener !== "function" ||
      typeof runtime.listenerCount !== "function" ||
      !Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 60_000) return undefined;
  return new Promise((resolve) => {
    let text = "";
    let finished = false;
    const wasRaw = input.isRaw === true;
    const wasPaused = input.isPaused();
    let timer;
    let signalCleanup = false;
    const restore = () => {
      try { input.setRawMode(wasRaw); } catch { return false; }
      if (wasPaused) input.pause();
      return true;
    };
    const finish = (value) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      for (const [event, listener] of [["data", onData], ["error", onStop], ["end", onStop], ["close", onStop]]) input.removeListener(event, listener);
      runtime.removeListener("SIGINT", onSignal);
      runtime.removeListener("SIGTERM", onSignal);
      runtime.removeListener("exit", onExit);
      if (!restore()) value = undefined;
      text = "";
      resolve(value);
    };
    const onStop = () => finish(undefined);
    const onExit = () => finish(undefined);
    const onSignal = (signal) => {
      // Ctrl-C in raw mode normally arrives as input data; this is only for an
      // external signal. Restore first, then preserve ordinary Node semantics.
      const hadOtherListeners = runtime.listenerCount(signal) > 1;
      finish(undefined);
      if (!signalCleanup && runtime === process && !hadOtherListeners && typeof runtime.kill === "function") {
        signalCleanup = true;
        try { runtime.kill(runtime.pid, signal); } catch { runtime.exitCode = signal === "SIGINT" ? 130 : 143; }
      }
    };
    const onData = (chunk) => {
      try {
        if (chunk.length > MAX_TOKEN + 2) return finish(undefined);
        const value = String(chunk);
        for (let index = 0; index < value.length; index++) {
          const char = value[index];
          if (char === "\r" || char === "\n") {
            if (!/^[\r\n]*$/.test(value.slice(index + 1))) return finish(undefined);
            return finish(text || undefined);
          }
          if (char === "\b" || char === "\x7f") text = text.slice(0, -1);
          else if (/^[A-Za-z0-9_.-]$/.test(char)) text += char;
          else return finish(undefined); // includes Ctrl-C/D/Z and escape sequences
          if (text.length > MAX_TOKEN) return finish(undefined);
        }
      } catch { finish(undefined); }
    };
    try {
      input.setRawMode(true);
      runtime.on("SIGINT", onSignal);
      runtime.on("SIGTERM", onSignal);
      runtime.once("exit", onExit);
      output.write("Access token (concealed; Enter to finish, Ctrl-C to cancel): ");
      input.on("data", onData).on("error", onStop).on("end", onStop).on("close", onStop);
      timer = setTimeout(onStop, timeoutMs);
      input.resume();
    } catch { finish(undefined); }
  });
}

// Exported for offline CLI testing; production entry uses only concealed TTY.
export async function authenticatedReaderCli(args = process.argv.slice(2)) {
  const known = ["--allow-network", "--confirm-project=myresult", "--include-wildcards", "--concealed-token"];
  const refs = args.filter((arg) => arg.startsWith("--expected-project-ref="));
  const refuse = { mode: "AUTHENTICATED_JWT_READER", ok: false, status: "NOT_RUN", message: "No request sent. Configuration/input withheld; separate approvals and concealed TTY intake required." };
  if (refs.length !== 1 || new Set(args).size !== args.length ||
      args.some((arg) => !known.includes(arg) && !arg.startsWith("--expected-project-ref=")) ||
      !args.includes("--allow-network") || !args.includes("--confirm-project=myresult") || !args.includes("--concealed-token")) return refuse;
  const expectedProjectRef = refs[0].slice("--expected-project-ref=".length);
  try {
    if (!/^[a-z0-9]{20}$/.test(expectedProjectRef)) return refuse;
    const request = buildReaderRequest(getSupabasePublicEnv(), anonymousChecks()[0]);
    if (request.url.hostname !== `${expectedProjectRef}.supabase.co`) return refuse;
    const accessToken = await readConcealedToken();
    if (!accessToken) return refuse;
    return await verifyAuthenticatedReaders({ allowNetwork: true, confirmedProject: "myresult", expectedProjectRef,
      includeWildcards: args.includes("--include-wildcards"), accessToken });
  } catch { return { ...refuse, status: "FAIL", message: "Verifier failed; all details withheld." }; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // No uncaught exception text or serialized credential-bearing objects.
  let result;
  try { result = await authenticatedReaderCli(); }
  catch { result = { ok: false, status: "FAIL", message: "Verifier failed; details withheld." }; }
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
