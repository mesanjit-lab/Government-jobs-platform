// Offline only. Generated synthetic keys/JWTs, mocked fetch, no env-file loading.
import assert from "node:assert/strict";
import { generateKeyPairSync, sign, verify } from "node:crypto";
import { readFileSync } from "node:fs";
import { EventEmitter } from "node:events";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { format } from "node:util";

let assertions = 0;
let scenarios = 0;
let stage = "initialization";
let failed = false;
const check = (fn) => { fn(); assertions++; };
const scenario = (name) => { stage = name; scenarios++; };
const ref = "abcdefghijklmnopqrst";
const otherRef = "zyxwvutsrqponmlkjihg";
const url = `https://${ref}.supabase.co`;
const key = "sb_publishable_OFFLINE_AUTH_READER_CANARY";
const secret = "OFFLINE_PASSWORD_REFRESH_TOKEN_RAW_BODY_CANARY";
const session = "11111111-1111-4111-8111-111111111111";
const previous = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, fetch: globalThis.fetch };
const originals = { log: console.log, error: console.error, stdout: process.stdout.write, stderr: process.stderr.write };
const captured = [];
console.log = (...args) => captured.push(format(...args));
console.error = (...args) => captured.push(format(...args));
const captureWrite = (chunk, encoding, callback) => {
  captured.push(String(chunk));
  const done = typeof encoding === "function" ? encoding : callback;
  if (done) done();
  return true;
};
process.stdout.write = captureWrite;
process.stderr.write = captureWrite;
let realFetchAttempts = 0;
globalThis.fetch = () => { realFetchAttempts++; throw new Error(secret); };
process.env.NEXT_PUBLIC_SUPABASE_URL = url;
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;
const secrets = [ref, otherRef, url, key, secret];
function clean(value) {
  const output = typeof value === "string" ? value : JSON.stringify(value);
  for (const canary of secrets) check(() => assert.ok(!output.includes(canary), "Synthetic secret output detected."));
}

try {
  const moduleUrl = new URL("./verify-supabase-authenticated-reader.mjs", import.meta.url);
  const { verifyAuthenticatedReaders, classifyInvalidTokenResponse, readConcealedToken, EXPECTED_SUBJECT, INVALID_TOKEN_CONTROL, JSON_PARSE_LIMITS } = await import(moduleUrl.href);
  const { readerManifest, anonymousChecks, classifyReaderResponse, buildReaderRequest } = await import("./verify-supabase-readers.mjs");
  const ec = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const rsa = generateKeyPairSync("rsa", { modulusLength: 2_048 });
  const ecJwk = { ...ec.publicKey.export({ format: "jwk" }), kid: "TEST_EC_KEY", alg: "ES256", use: "sig", key_ops: ["verify"] };
  const rsaJwk = { ...rsa.publicKey.export({ format: "jwk" }), kid: "TEST_RSA_KEY", alg: "RS256", use: "sig" };
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = () => Math.floor(Date.now() / 1_000);
  const baseClaims = () => ({ iss: `${url}/auth/v1`, sub: EXPECTED_SUBJECT, aud: "authenticated", role: "authenticated",
    exp: now() + 3_600, iat: now(), is_anonymous: false, session_id: session, email: secret, user_metadata: { canary: secret } });
  function tokenFor(claimOverrides = {}, headerOverrides = {}, algorithm = "ES256") {
    const header = { alg: algorithm, kid: algorithm === "ES256" ? ecJwk.kid : rsaJwk.kid, typ: "JWT", ...headerOverrides };
    const claims = { ...baseClaims(), ...claimOverrides };
    const input = `${encode(header)}.${encode(claims)}`;
    const signature = sign("sha256", Buffer.from(input), algorithm === "ES256" ? { key: ec.privateKey, dsaEncoding: "ieee-p1363" } : rsa.privateKey);
    const token = `${input}.${signature.toString("base64url")}`;
    secrets.push(token, token.split(".")[1], JSON.stringify(claims), `Bearer ${token}`);
    return token;
  }
  function rawToken(headerJson, claimsJson, algorithm = "ES256") {
    const input = `${Buffer.from(headerJson).toString("base64url")}.${Buffer.from(claimsJson).toString("base64url")}`;
    const signature = sign("sha256", Buffer.from(input), algorithm === "ES256" ? { key: ec.privateKey, dsaEncoding: "ieee-p1363" } : rsa.privateKey);
    const token = `${input}.${signature.toString("base64url")}`;
    // The signed token itself is the relevant output canary. Raw fragments can
    // be short JSON punctuation and would make generic output scans meaningless.
    secrets.push(token);
    return token;
  }
  const token = tokenFor();
  const rsaToken = tokenFor({}, {}, "RS256");
  const options = { allowNetwork: true, confirmedProject: "myresult", expectedProjectRef: ref, accessToken: token };
  const forbiddenMethods = ["POST", "PATCH", "PUT", "DELETE", "OPTIONS"];
  let calls = [];
  function goodFetchFor(validToken = token, jwk = ecJwk, denialStatus = 403) {
    return async (requestUrl, init) => {
      calls.push({ url: requestUrl.href, init });
      check(() => assert.equal(init.method, "GET"));
      check(() => assert.equal(init.redirect, "error"));
      check(() => assert.equal(init.credentials, "omit"));
      check(() => assert.equal(init.cache, "no-store"));
      check(() => assert.equal(requestUrl.hostname, `${ref}.supabase.co`));
      check(() => assert.equal(init.headers.apikey, key));
      check(() => assert.ok(init.signal instanceof AbortSignal));
      check(() => assert.ok(!("body" in init)));
      check(() => assert.ok(!Object.keys(init.headers).some((name) => /cookie/i.test(name))));
      if (requestUrl.pathname === "/auth/v1/.well-known/jwks.json") {
        check(() => assert.ok(!("Authorization" in init.headers)));
        return Response.json({ keys: [jwk] });
      }
      check(() => assert.equal(init.headers["Accept-Profile"], "public"));
      check(() => assert.equal(requestUrl.searchParams.get("limit"), "0"));
      check(() => assert.deepEqual([...requestUrl.searchParams.keys()], ["select", "limit"]));
      const entry = readerManifest.find((item) => requestUrl.pathname === `/rest/v1/${item.table}`);
      check(() => assert.ok(entry));
      const authorization = init.headers.Authorization;
      check(() => assert.ok(typeof authorization === "string" && authorization.startsWith("Bearer ")));
      if (authorization !== `Bearer ${validToken}`) {
        check(() => assert.equal(requestUrl.pathname, "/rest/v1/organizations"));
        check(() => assert.equal(requestUrl.searchParams.get("select"), readerManifest[0].approved.join(",")));
        if (authorization !== `Bearer ${INVALID_TOKEN_CONTROL}`) {
          const altered = authorization.slice(7).split(".");
          const original = validToken.split(".");
          check(() => assert.equal(altered[0], original[0]));
          check(() => assert.equal(altered[1], original[1]));
          check(() => assert.notEqual(altered[2], original[2]));
          check(() => assert.equal(verify("sha256", Buffer.from(`${altered[0]}.${altered[1]}`),
            jwk.alg === "ES256" ? { key: ec.publicKey, dsaEncoding: "ieee-p1363" } : rsa.publicKey,
            Buffer.from(altered[2], "base64url")), false));
          secrets.push(authorization, authorization.slice(7));
        }
        return Response.json({ code: "PGRST301", message: secret, details: validToken }, { status: 401 });
      }
      const approved = entry.approved.length && requestUrl.searchParams.get("select") === entry.approved.join(",");
      return Response.json(approved ? [] : { code: "42501", message: secret, details: validToken, hint: url }, { status: approved ? 200 : denialStatus });
    };
  }
  const run = async (overrides = {}, fetchImpl = goodFetchFor()) => {
    calls = [];
    const result = await verifyAuthenticatedReaders({ ...options, ...overrides, fetchImpl });
    clean(result);
    check(() => assert.ok(JSON.stringify(result).length < 2_000));
    check(() => assert.ok(!("results" in result)));
    return result;
  };

  scenario("migration-derived manifest");
  const sql = readFileSync(new URL("../supabase/migrations/20261002000100_recruitment_foundation.sql", import.meta.url), "utf8");
  const definitions = new Map([...sql.matchAll(/create table public\.(\w+) \(([\s\S]*?)\n\);/g)]
    .map((match) => [match[1], [...match[2].matchAll(/^  (?!unique\b|check\b|foreign\b|primary\b)(\w+) /gm)].map((column) => column[1])]));
  const grants = new Map([...sql.matchAll(/grant select \(([\s\S]*?)\) on public\.(\w+) to anon, authenticated;/g)]
    .map((match) => [match[2], match[1].split(",").map((column) => column.trim())]));
  check(() => assert.equal(definitions.size, 17));
  check(() => assert.equal(grants.size, 14));
  check(() => assert.deepEqual([...definitions.keys()].sort(), readerManifest.map((item) => item.table).sort()));
  for (const entry of readerManifest) {
    check(() => assert.deepEqual([...entry.approved].sort(), [...(grants.get(entry.table) ?? [])].sort()));
    check(() => assert.deepEqual([...entry.restricted].sort(), definitions.get(entry.table).filter((name) => !entry.approved.includes(name)).sort()));
  }
  for (const [category, count] of [["approved", 14], ["excluded", 52], ["private", 25], ["wildcard", 17]]) {
    check(() => assert.equal(anonymousChecks(true).filter((item) => item.category === category).length, count));
  }
  const source = readFileSync(moduleUrl, "utf8");
  check(() => assert.ok(!/from ["']@supabase|\.getUser\(|signInWith|\.signOut\(|\.refreshSession\(|\/auth\/v1\/(user|token|logout)/.test(source)));
  check(() => assert.ok(!/readFile|writeFile|process\.env\.[^\s;]*(?:TOKEN|PASSWORD)/.test(source)));
  for (const method of forbiddenMethods) check(() => assert.throws(() => buildReaderRequest({ url, publishableKey: key }, anonymousChecks()[0], method)));

  for (const overrides of [{ allowNetwork: false }, { confirmedProject: "other" }, { expectedProjectRef: undefined },
    { expectedProjectRef: url }, { accessToken: undefined }, { accessToken: "" }, { token: secret }, { method: "POST" },
    { path: "/rpc/test" }, { requestTimeoutMs: 10_001 }, { runTimeoutMs: 180_001 }, { requestTimeoutMs: 0 },
    { runTimeoutMs: Infinity }, { fetchImpl: "invalid" }]) {
    scenario("opt-in / options / no token gates");
    const result = overrides.fetchImpl === "invalid"
      ? await verifyAuthenticatedReaders({ ...options, ...overrides }) : await run(overrides);
    check(() => assert.equal(result.status, "NOT_RUN"));
    check(() => assert.equal(result.completed, 0));
    if (overrides.fetchImpl !== "invalid") check(() => assert.equal(calls.length, 0));
    clean(result);
  }
  scenario("missing all options");
  const missingOptions = await verifyAuthenticatedReaders();
  check(() => assert.equal(missingOptions.status, "NOT_RUN"));
  for (const badToken of ["invalid", token + " ", "x".repeat(16_385), token.split(".").slice(0, 2).join(".") + ".", token.replace(/\./, "..")]) {
    scenario("JWT structural rejection");
    const result = await run({ accessToken: badToken });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(calls.length, 0));
  }
  const standardClaims = JSON.stringify(baseClaims());
  const standardHeader = JSON.stringify({ alg: "ES256", kid: ecJwk.kid, typ: "JWT" });
  const minimumClaims = () => ({ iss: `${url}/auth/v1`, sub: EXPECTED_SUBJECT, aud: "authenticated", role: "authenticated",
    exp: now() + 3_600, iat: now(), is_anonymous: false, session_id: session });
  const claimsWith = (name, rawValue) => `${JSON.stringify(minimumClaims()).slice(0, -1)},${JSON.stringify(name)}:${rawValue}}`;
  const nestedJson = (layers, form) => {
    let value = "0";
    for (let index = 0; index < layers; index++) value = form(index, value);
    return value;
  };
  const jwksThenStop = async (accessToken, rawJwks) => {
    let count = 0;
    const result = await run({ accessToken }, async () => {
      count++;
      return count === 1
        ? new Response(rawJwks, { status: 200 })
        : Response.json({ code: "PGRST205" }, { status: 404 });
    });
    return { result, count };
  };
  for (const [label, badToken] of [
    ["duplicate header alg", rawToken(`{"alg":"ES256","alg":"ES256","kid":"${ecJwk.kid}","typ":"JWT"}`, standardClaims)],
    ["duplicate header kid", rawToken(`{"alg":"ES256","kid":"${ecJwk.kid}","kid":"${ecJwk.kid}","typ":"JWT"}`, standardClaims)],
    ["duplicate claim iss", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"iss":"${url}/auth/v1"}`)],
    ["duplicate claim sub", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"sub":"${EXPECTED_SUBJECT}"}`)],
    ["duplicate claim role", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"role":"authenticated"}`)],
    ["duplicate claim exp", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"exp":${now() + 3_600}}`)],
    ["duplicate nested claim", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"nested":{"one":1,"one":2}}`)],
    ["malformed JSON", rawToken("{", standardClaims)],
  ]) {
    scenario(`duplicate/malformed JWT JSON rejection: ${label}`);
    const result = await run({ accessToken: badToken });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(result.completed, 0));
    check(() => assert.equal(calls.length, 0));
  }
  for (const [label, badToken] of [
    ["escaped-equivalent header key", rawToken(String.raw`{"alg":"ES256","\u0061lg":"ES256","kid":"${ecJwk.kid}","typ":"JWT"}`, standardClaims)],
    ["Unicode-equivalent claim key", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"\\u0069ss":"${url}/auth/v1"}`)],
    ["duplicate key inside array object", rawToken(standardHeader, `${standardClaims.slice(0, -1)},"nested":[{"a":1,"\\u0061":2}]}`)],
  ]) {
    scenario(`escaped duplicate JSON rejection: ${label}`);
    const result = await run({ accessToken: badToken });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(result.completed, 0));
    check(() => assert.equal(calls.length, 0));
  }
  for (const [label, badJson] of [
    ["malformed Unicode", `${standardClaims.slice(0, -1)},"x":"\\u12G4"}`],
    ["malformed escape", `${standardClaims.slice(0, -1)},"x":"\\q"}`],
    ["leading zero", `${standardClaims.slice(0, -1)},"x":01}`],
    ["malformed exponent", `${standardClaims.slice(0, -1)},"x":1e+}`],
    ["trailing garbage", `${standardClaims}x`],
    ["premature EOF", standardClaims.slice(0, -1)],
    ["missing comma", `${standardClaims.slice(0, -1)} "x":1}`],
    ["missing colon", `${standardClaims.slice(0, -1)},"x" 1}`],
  ]) {
    scenario(`JSON grammar rejection: ${label}`);
    const result = await run({ accessToken: rawToken(standardHeader, badJson) });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(result.completed, 0));
    check(() => assert.equal(calls.length, 0));
  }
  const maximumNestedLayers = JSON_PARSE_LIMITS.maxDepth - 1;
  for (const [label, form] of [
    ["array", (_index, value) => `[${value}]`],
    ["object", (index, value) => `{"n${index}":${value}}`],
    ["mixed", (index, value) => index % 2 ? `{"n${index}":${value}}` : `[${value}]`],
  ]) {
    scenario(`maximum parser depth accepted: ${label}`);
    const accepted = await jwksThenStop(rawToken(standardHeader, claimsWith("nested", nestedJson(maximumNestedLayers, form))), JSON.stringify({ keys: [ecJwk] }));
    check(() => assert.equal(accepted.result.signatureValidated, true));
    check(() => assert.equal(accepted.count, 2));
    scenario(`parser depth beyond maximum rejected: ${label}`);
    const rejected = await run({ accessToken: rawToken(standardHeader, claimsWith("nested", nestedJson(maximumNestedLayers + 1, form))) });
    check(() => assert.equal(rejected.status, "FAIL"));
    check(() => assert.equal(rejected.completed, 0));
    check(() => assert.equal(calls.length, 0));
  }
  const requiredClaimValues = 8;
  const rootAndArrayNodes = 2 + requiredClaimValues;
  const arrayElementsAtLimit = JSON_PARSE_LIMITS.maxNodes - rootAndArrayNodes;
  scenario("maximum array complexity accepted");
  const arrayAccepted = await jwksThenStop(rawToken(standardHeader, claimsWith("items", `[${new Array(arrayElementsAtLimit).fill("0").join(",")}]`)), JSON.stringify({ keys: [ecJwk] }));
  check(() => assert.equal(arrayAccepted.result.signatureValidated, true));
  check(() => assert.equal(arrayAccepted.count, 2));
  scenario("array complexity beyond maximum rejected before JWKS");
  const arrayRejected = await run({ accessToken: rawToken(standardHeader, claimsWith("items", `[${new Array(arrayElementsAtLimit + 1).fill("0").join(",")}]`)) });
  check(() => assert.equal(arrayRejected.status, "FAIL"));
  check(() => assert.equal(arrayRejected.completed, 0));
  check(() => assert.equal(calls.length, 0));
  const nestedElementsAtLimit = Math.floor((JSON_PARSE_LIMITS.maxNodes - rootAndArrayNodes) / 2);
  scenario("nested values share global complexity budget");
  const nestedAccepted = await jwksThenStop(rawToken(standardHeader, claimsWith("items", `[${new Array(nestedElementsAtLimit).fill('{"x":0}').join(",")}]`)), JSON.stringify({ keys: [ecJwk] }));
  check(() => assert.equal(nestedAccepted.result.signatureValidated, true));
  check(() => assert.equal(nestedAccepted.count, 2));
  scenario("nested values beyond global complexity rejected");
  const nestedRejected = await run({ accessToken: rawToken(standardHeader, claimsWith("items", `[${new Array(nestedElementsAtLimit + 1).fill('{"x":0}').join(",")}]`)) });
  check(() => assert.equal(nestedRejected.status, "FAIL"));
  check(() => assert.equal(nestedRejected.completed, 0));
  check(() => assert.equal(calls.length, 0));
  const jwkJson = JSON.stringify(ecJwk);
  const jwksBaseNodes = 13;
  const jwksMembersAtLimit = JSON_PARSE_LIMITS.maxNodes - jwksBaseNodes;
  const jwksWithMembers = (count) => `{"keys":[${jwkJson}],"metadata":{${new Array(count).fill(0).map((_value, index) => `"m${index}":0`).join(",")}}}`;
  scenario("many JWKS object members accepted within global budget");
  const jwksAccepted = await jwksThenStop(token, jwksWithMembers(jwksMembersAtLimit));
  check(() => assert.equal(jwksAccepted.result.signatureValidated, true));
  check(() => assert.equal(jwksAccepted.count, 2));
  scenario("many JWKS object members beyond budget reject before Data API");
  let jwksCalls = 0;
  const jwksRejected = await run({}, async () => { jwksCalls++; return new Response(jwksWithMembers(jwksMembersAtLimit + 1), { status: 200 }); });
  check(() => assert.equal(jwksRejected.signatureValidated, false));
  check(() => assert.equal(jwksRejected.completed, 1));
  check(() => assert.equal(jwksCalls, 1));
  scenario("valid JSON grammar values remain accepted");
  const grammarClaims = `${JSON.stringify(minimumClaims()).slice(0, -1)},"negative":-1,"decimal":1.25,"exponent":1e+2,"truth":true,"falsy":false,"nothing":null,"emptyObject":{},"emptyArray":[],"escaped":"\\\"\\\\","unicode":"\\u0061"}`;
  const grammarAccepted = await jwksThenStop(rawToken(standardHeader, grammarClaims), JSON.stringify({ keys: [ecJwk] }));
  check(() => assert.equal(grammarAccepted.result.signatureValidated, true));
  check(() => assert.equal(grammarAccepted.count, 2));
  scenario("escaped/nested JSON values remain valid");
  const nestedClaims = JSON.stringify({ ...baseClaims(), nested: { text: "comma, colon: braces {} and a quote \\\" are data" } });
  const escapedToken = rawToken(standardHeader, nestedClaims);
  const escapedResult = await run({ accessToken: escapedToken }, goodFetchFor(escapedToken));
  check(() => assert.equal(escapedResult.status, "PASS"));

  for (const [claimIndex, claimChanges] of [
    { exp: now() - 1 }, { exp: now() + 239 }, { exp: "9999999999" }, { iat: now() + 600 }, { iat: now() - 90_000 },
    { exp: now() + 90_000 }, { nbf: now() + 600 }, { nbf: "future" }, { sub: session }, { iss: `https://${otherRef}.supabase.co/auth/v1` },
    { aud: "anon" }, { aud: ["authenticated"] }, { role: "anon" }, { role: "service_role" }, { role: "administrator" },
    { is_anonymous: true }, { is_anonymous: undefined }, { session_id: undefined }, { session_id: "bad" },
  ].entries()) {
    scenario(`JWT claim rejection ${claimIndex + 1}`);
    const result = await run({ accessToken: tokenFor(claimChanges) });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(calls.length, 0));
  }
  for (const headerChanges of [{ alg: "none" }, { alg: "HS256" }, { alg: "PS256" }, { kid: "" },
    { typ: "other" }, { jku: url }, { x5u: url }, { jwk: ecJwk }, { crit: ["unknown"] }]) {
    scenario("JWT header rejection");
    const result = await run({ accessToken: tokenFor({}, headerChanges) });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(calls.length, 0));
  }
  scenario("independent project mismatch");
  const mismatchedProject = await run({ expectedProjectRef: otherRef });
  check(() => assert.equal(mismatchedProject.status, "FAIL"));
  check(() => assert.equal(calls.length, 0));
  for (const badUrl of [`https://${otherRef}.supabase.co`, "https://example.invalid", url + "/auth/v1/user", "http://localhost:54321"]) {
    scenario("effective origin mismatch");
    process.env.NEXT_PUBLIC_SUPABASE_URL = badUrl;
    const badOrigin = await run();
    check(() => assert.equal(badOrigin.status, "FAIL"));
    check(() => assert.equal(calls.length, 0));
  }
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;

  scenario("malformed public configuration stops before JWKS");
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_secret_OFFLINE_ONLY";
  const invalidPublicKey = await run();
  check(() => assert.equal(invalidPublicKey.status, "FAIL"));
  check(() => assert.equal(calls.length, 0));
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;

  for (const payload of [null, { keys: [] }, { keys: [{ ...ecJwk, kid: "missing" }] }, { keys: [ecJwk, ecJwk] },
    { keys: [{ ...ecJwk, alg: "RS256" }] }, { keys: [{ ...ecJwk, use: "enc" }] }, { keys: [{ ...ecJwk, d: secret }] },
    { keys: [{ ...ecJwk, key_ops: ["sign"] }] }, { keys: [{ ...ecJwk, crv: "P-384" }] }, { keys: [{ ...ecJwk, x: "bad" }] },
    { keys: [{ ...rsaJwk, kid: ecJwk.kid }] }, { keys: new Array(17).fill(ecJwk) }]) {
    scenario("signing-key rejection");
    let count = 0;
    const result = await run({}, async () => { count++; return Response.json(payload); });
    check(() => assert.equal(result.firstNonPass.outcome, "FAIL_SIGNING_KEY_OR_SIGNATURE"));
    check(() => assert.equal(count, 1));
    check(() => assert.equal(result.signatureValidated, false));
  }
  for (const [label, payload] of [
    ["duplicate JWKS top-level member", `{"keys":[${JSON.stringify(ecJwk)}],"keys":[${JSON.stringify(ecJwk)}]}`],
    ["duplicate JWK kid", `{"keys":[{"kid":"${ecJwk.kid}","kid":"${ecJwk.kid}","kty":"EC","crv":"P-256","x":"${ecJwk.x}","y":"${ecJwk.y}"}]}`],
    ["duplicate JWK kty", `{"keys":[{"kid":"${ecJwk.kid}","kty":"EC","kty":"EC","crv":"P-256","x":"${ecJwk.x}","y":"${ecJwk.y}"}]}`],
    ["duplicate JWK alg", `{"keys":[{"kid":"${ecJwk.kid}","alg":"ES256","alg":"ES256","kty":"EC","crv":"P-256","x":"${ecJwk.x}","y":"${ecJwk.y}"}]}`],
  ]) {
    scenario(`duplicate JWKS JSON rejection: ${label}`);
    let count = 0;
    const result = await run({}, async () => { count++; return new Response(payload, { status: 200 }); });
    check(() => assert.equal(result.firstNonPass.outcome, "FAIL_SIGNING_KEY_OR_SIGNATURE"));
    check(() => assert.equal(result.completed, 1));
    check(() => assert.equal(count, 1)); // JWKS only: zero Data API requests.
  }
  scenario("wrong signature stops before Data API");
  const signatureParts = token.split(".");
  const signature = Buffer.from(signatureParts[2], "base64url");
  signature[0] ^= 1;
  const wrongSignature = `${signatureParts[0]}.${signatureParts[1]}.${signature.toString("base64url")}`;
  secrets.push(wrongSignature);
  const badSignature = await run({ accessToken: wrongSignature });
  check(() => assert.equal(badSignature.status, "FAIL"));
  check(() => assert.equal(calls.length, 1));

  for (const [accessToken, jwk, includeWildcards, denial] of [[token, ecJwk, false, 401], [token, ecJwk, true, 403], [rsaToken, rsaJwk, false, 403]]) {
    scenario("successful bounded synthetic run");
    const result = await run({ accessToken, includeWildcards }, goodFetchFor(accessToken, jwk, denial));
    check(() => assert.equal(result.status, "PASS"));
    check(() => assert.equal(result.ok, true));
    check(() => assert.equal(result.signatureValidated, true));
    check(() => assert.equal(result.jwtAcceptance, "PASS_WITHIN_LIMITS"));
    check(() => assert.equal(result.planned, includeWildcards ? 111 : 94));
    check(() => assert.equal(result.completed, result.planned));
    check(() => assert.equal(result.passed, result.planned));
    check(() => assert.equal(calls.length, result.planned));
    check(() => assert.equal(result.firstNonPass, null));
  }

  for (const [status, payload, expected] of [[401, { code: "PGRST301", message: secret }, "PASS_INVALID_JWT_REJECTED"],
    [401, { code: "42501" }, "FAIL_INVALID_JWT_CONTROL"], [403, { code: "42501" }, "FAIL_INVALID_JWT_CONTROL"],
    [401, { code: "PGRST302" }, "FAIL_INVALID_JWT_CONTROL"], [401, {}, "FAIL_INVALID_JWT_CONTROL"],
    [403, { code: "PGRST301" }, "FAIL_INVALID_JWT_CONTROL"], [200, [], "FAIL_INVALID_JWT_ACCEPTED"],
    [204, null, "FAIL_INVALID_JWT_ACCEPTED"], [429, { code: "PGRST301" }, "INCONCLUSIVE_RATE_LIMIT"],
    [503, { code: "PGRST301" }, "INCONCLUSIVE_SERVER"], [302, null, "FAIL_REDIRECT"]]) {
    scenario("invalid-token classifier");
    const result = classifyInvalidTokenResponse(status, payload);
    check(() => assert.equal(result.outcome, expected));
    clean(result);
  }
  for (const [allowed, status, payload, expected] of [[false, 401, { code: "42501" }, "PASS_PERMISSION_DENIED"],
    [false, 403, { code: "42501" }, "PASS_PERMISSION_DENIED"], [true, 403, { code: "42501" }, "FAIL_UNEXPECTED_DENY"],
    [false, 403, {}, "FAIL_AUTH_OR_API_KEY"], [false, 401, { code: "PGRST301" }, "FAIL_AUTH_OR_API_KEY"],
    [false, 200, [], "FAIL_UNEXPECTED_ALLOW"], [false, 404, { code: "42P01" }, "FAIL_SCHEMA_MISMATCH"]]) {
    scenario("reader permission classifier");
    const result = classifyReaderResponse(allowed, status, payload);
    check(() => assert.equal(result.outcome, expected));
    clean(result);
  }
  for (const [at, status, payload, expected] of [[3, 200, [], "FAIL_INVALID_JWT_ACCEPTED"],
    [4, 200, [], "FAIL_INVALID_JWT_ACCEPTED"], [3, 401, { code: "42501" }, "FAIL_INVALID_JWT_CONTROL"],
    [3, 401, {}, "FAIL_INVALID_JWT_CONTROL"], [2, 401, { code: "PGRST301" }, "FAIL_AUTH_OR_API_KEY"],
    [18, 200, [], "FAIL_UNEXPECTED_ALLOW"], [18, 401, { code: "PGRST301" }, "FAIL_AUTH_OR_API_KEY"]]) {
    scenario("paired controls / fail-fast / no fallback");
    const good = goodFetchFor();
    let count = 0;
    const result = await run({}, async (...args) => {
      count++;
      if (count === at) return Response.json(payload, { status });
      return good(...args);
    });
    check(() => assert.equal(result.firstNonPass.outcome, expected));
    check(() => assert.equal(count, at));
    check(() => assert.equal(result.ok, false));
  }
  for (const [mock, expected] of [
    [async () => new Response("not-json-" + secret), "FAIL_RESPONSE_FORMAT"],
    [async () => Response.json([{ canary: secret }]), "FAIL_RESPONSE_FORMAT"],
    [async () => new Response("[" + " ".repeat(16_385) + "]"), "FAIL_RESPONSE_FORMAT"],
    [async () => Response.json({ code: "PGRST205", message: secret }, { status: 404 }), "FAIL_SCHEMA_MISMATCH"],
    [async () => ({ redirected: false, status: 200, url: url + "/rest/v1/recruitments" }), "FAIL_REDIRECT"],
  ]) {
    scenario("Data API format / schema / endpoint checks");
    const good = goodFetchFor();
    let count = 0;
    const result = await run({}, (...args) => { count++; return count === 2 ? mock(...args) : good(...args); });
    check(() => assert.equal(result.firstNonPass.outcome, expected));
    check(() => assert.equal(count, 2));
  }
  for (const [mock, outcome] of [[async () => { throw new Error(secrets.join(" ")); }, "INCONCLUSIVE_NETWORK"],
    [async () => new Response(new ReadableStream({ start(controller) { controller.error(new Error(secret)); } })), "INCONCLUSIVE_NETWORK"],
    [async () => new Response(null, { status: 302 }), "FAIL_REDIRECT"],
    [async () => ({ redirected: true, status: 200, url: url + "/auth/v1/user" }), "FAIL_REDIRECT"],
    [async () => Response.json([], { status: 429 }), "INCONCLUSIVE_RATE_LIMIT"],
    [async () => Response.json([], { status: 500 }), "INCONCLUSIVE_SERVER"],
    [async () => new Response(secret), "FAIL_SIGNING_KEY_OR_SIGNATURE"],
    [async () => new Response("[" + " ".repeat(65_537) + "]"), "FAIL_SIGNING_KEY_OR_SIGNATURE"]]) {
    scenario("transport / body / redacted exception handling");
    let count = 0;
    const result = await run({}, (...args) => { count++; return mock(...args); });
    check(() => assert.equal(result.firstNonPass.outcome, outcome));
    check(() => assert.equal(count, 1));
  }
  for (const mock of [() => new Promise(() => {}), async () => new Response(new ReadableStream({ start() {} }))]) {
    scenario("request / whole-run timeout");
    const started = performance.now();
    const result = await run({ requestTimeoutMs: 15, runTimeoutMs: 30 }, mock);
    check(() => assert.equal(result.status, "INCONCLUSIVE"));
    check(() => assert.ok(performance.now() - started < 2_000));
  }
  scenario("deadline clamps request");
  const deadlineResult = await run({ runTimeoutMs: 15 }, () => new Promise(() => {}));
  check(() => assert.equal(deadlineResult.status, "INCONCLUSIVE"));
  scenario("sequential / snapshot binding");
  let active = 0, maxActive = 0;
  const good = goodFetchFor();
  const result = await run({}, async (...args) => {
    active++;
    maxActive = Math.max(active, maxActive);
    process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${otherRef}.supabase.co`;
    await new Promise((resolve) => setTimeout(resolve, 1));
    try { return await good(...args); } finally { active--; }
  });
  check(() => assert.equal(result.status, "PASS"));
  check(() => assert.equal(maxActive, 1));
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  scenario("token input snapshot survives caller mutation");
  const mutableOptions = { ...options };
  const stableTokenFetch = goodFetchFor();
  mutableOptions.fetchImpl = async (...args) => {
    mutableOptions.accessToken = INVALID_TOKEN_CONTROL;
    return stableTokenFetch(...args);
  };
  const tokenSnapshot = await verifyAuthenticatedReaders(mutableOptions);
  check(() => assert.equal(tokenSnapshot.status, "PASS"));
  clean(tokenSnapshot);

  class ConcealedInput extends EventEmitter {
    constructor(chunks, event = "data") { super(); this.isTTY = true; this.isRaw = false; this.paused = true; this.chunks = chunks; this.event = event; this.rawModes = []; }
    isPaused() { return this.paused; }
    pause() { this.paused = true; }
    setRawMode(raw) { this.isRaw = raw; this.rawModes.push(raw); }
    resume() { this.paused = false; queueMicrotask(() => {
      if (this.event !== "data") this.emit(this.event, new Error(secret));
      else for (const chunk of this.chunks) this.emit("data", Buffer.from(chunk));
    }); }
  }
  class ConcealedRuntime extends EventEmitter {
    constructor() { super(); this.pid = 1; this.killCalls = []; }
    kill(pid, signal) { this.killCalls.push([pid, signal]); }
  }
  for (const [chunks, event, expected] of [[[token + "\r"], "data", token], [[token + "x\b\n"], "data", token],
    [["\x03"], "data", undefined], [[token + "\n" + secret], "data", undefined],
    [["x".repeat(16_385)], "data", undefined], [[], "end", undefined], [[], "error", undefined], [[], "data", undefined]]) {
    scenario("concealed intake / cancellation / timeout / cleanup");
    const input = new ConcealedInput(chunks, event);
    const output = { isTTY: true, write: (value) => captured.push(value) };
    const runtime = new ConcealedRuntime();
    const intake = await readConcealedToken(input, output, 15, runtime);
    check(() => assert.equal(intake, expected));
    check(() => assert.equal(input.isRaw, false));
    check(() => assert.equal(input.isPaused(), true));
    check(() => assert.equal(input.eventNames().length, 0));
    for (const eventName of ["SIGINT", "SIGTERM", "exit"]) check(() => assert.equal(runtime.listenerCount(eventName), 0));
  }
  scenario("refuse non-TTY and invalid intake bounds");
  const nonTty = await readConcealedToken({ isTTY: false });
  const invalidIntakeBounds = await readConcealedToken(new ConcealedInput([]), { isTTY: true }, 60_001);
  check(() => assert.equal(nonTty, undefined));
  check(() => assert.equal(invalidIntakeBounds, undefined));
  scenario("concealed intake refuses other data listeners");
  const observedInput = new ConcealedInput([token]);
  observedInput.on("data", () => { throw new Error(secret); });
  const observedIntake = await readConcealedToken(observedInput, { isTTY: true });
  check(() => assert.equal(observedIntake, undefined));
  check(() => assert.equal(observedInput.isRaw, false));
  scenario("concealed prompt failure restores raw mode");
  const brokenInput = new ConcealedInput([]);
  const brokenRuntime = new ConcealedRuntime();
  const brokenPrompt = await readConcealedToken(brokenInput, { isTTY: true, write: () => { throw new Error(secret); } }, 60_000, brokenRuntime);
  check(() => assert.equal(brokenPrompt, undefined));
  check(() => assert.equal(brokenInput.isRaw, false));
  check(() => assert.equal(brokenInput.isPaused(), true));
  check(() => assert.equal(brokenInput.eventNames().length, 0));
  for (const eventName of ["SIGINT", "SIGTERM", "exit"]) check(() => assert.equal(brokenRuntime.listenerCount(eventName), 0));

  for (const signal of ["SIGINT", "SIGTERM"]) {
    scenario(`${signal} concealed terminal cleanup`);
    const input = new ConcealedInput([], "manual");
    const runtime = new ConcealedRuntime();
    const intake = readConcealedToken(input, { isTTY: true, write: (value) => captured.push(value) }, 60_000, runtime);
    check(() => assert.equal(runtime.listenerCount(signal), 1));
    runtime.emit(signal, signal);
    runtime.emit(signal, signal); // Cleanup is idempotent; the second is ignored.
    const settled = await intake;
    check(() => assert.equal(settled, undefined));
    check(() => assert.equal(input.isRaw, false));
    check(() => assert.deepEqual(input.rawModes, [true, false]));
    check(() => assert.equal(runtime.listenerCount("SIGINT"), 0));
    check(() => assert.equal(runtime.listenerCount("SIGTERM"), 0));
    check(() => assert.equal(runtime.listenerCount("exit"), 0));
    check(() => assert.deepEqual(runtime.killCalls, [])); // Fake runtimes never re-signal.
  }
  scenario("exit concealed terminal cleanup");
  const exitInput = new ConcealedInput([], "manual");
  const exitRuntime = new ConcealedRuntime();
  const exitIntake = readConcealedToken(exitInput, { isTTY: true, write: (value) => captured.push(value) }, 60_000, exitRuntime);
  exitRuntime.emit("exit", 0);
  const exitSettled = await exitIntake;
  check(() => assert.equal(exitSettled, undefined));
  check(() => assert.equal(exitInput.isRaw, false));
  for (const eventName of ["SIGINT", "SIGTERM", "exit"]) check(() => assert.equal(exitRuntime.listenerCount(eventName), 0));
  scenario("pre-existing signal listener remains untouched");
  const preservedInput = new ConcealedInput([], "manual");
  const preservedRuntime = new ConcealedRuntime();
  let preservedCalls = 0;
  const preservedListener = () => { preservedCalls++; };
  preservedRuntime.on("SIGINT", preservedListener);
  const preservedIntake = readConcealedToken(preservedInput, { isTTY: true, write: (value) => captured.push(value) }, 60_000, preservedRuntime);
  check(() => assert.equal(preservedRuntime.listenerCount("SIGINT"), 2));
  preservedRuntime.emit("SIGINT", "SIGINT");
  const preservedSettled = await preservedIntake;
  check(() => assert.equal(preservedSettled, undefined));
  check(() => assert.equal(preservedCalls, 1));
  check(() => assert.equal(preservedRuntime.listenerCount("SIGINT"), 1));
  preservedRuntime.emit("SIGINT", "SIGINT");
  check(() => assert.equal(preservedCalls, 2));

  // Actual CLI entry, with synthetic TTY/fetch installed before import. No actual
  // terminal input, inherited credentials, env-file or native network in children.
  const cliFile = fileURLToPath(moduleUrl);
  const flags = ["--allow-network", "--confirm-project=myresult", `--expected-project-ref=${ref}`, "--concealed-token"];
  for (const [cliIndex, [args, inputToken, mode, status, expectedCalls]] of [[[], token, "blocked", "NOT_RUN", 0],
    [flags.slice(0, 3), token, "blocked", "NOT_RUN", 0], [[...flags, "--token=" + token], token, "blocked", "NOT_RUN", 0],
    [[...flags, `--expected-project-ref=${otherRef}`], token, "blocked", "NOT_RUN", 0],
    [[...flags.filter((flag) => !flag.startsWith("--expected-project-ref=")), `--expected-project-ref=${otherRef}`], token, "blocked", "NOT_RUN", 0],
    [flags, "invalid", "blocked", "FAIL", 0], [flags, token, "pass", "PASS", 94],
    [[...flags, "--include-wildcards"], token, "pass", "PASS", 111],
    [flags, token, "fallback", "FAIL", 3], [flags, token, "throw", "INCONCLUSIVE", 1],
    [flags, "", "blocked", "NOT_RUN", 0], [flags, token, "nonTTY", "NOT_RUN", 0]].entries()) {
    scenario(`isolated actual CLI case ${cliIndex + 1}`);
    const prelude = `
      import {EventEmitter} from 'node:events';
      let calls = 0;
      const token = ${JSON.stringify(inputToken)};
      const input = new EventEmitter();
      input.isTTY = ${JSON.stringify(mode !== "nonTTY")}; input.isRaw = false;
      input.isPaused = () => true; input.pause = () => {};
      input.setRawMode = value => { input.isRaw = value; };
      input.resume = () => queueMicrotask(() => input.emit('data', Buffer.from(token + '\\r')));
      Object.defineProperty(process, 'stdin', {value: input});
      Object.defineProperty(process.stderr, 'isTTY', {value:true});
      globalThis.fetch = async (requestUrl, init) => {
        calls++;
        const mode = ${JSON.stringify(mode)};
        if (mode === 'blocked' || mode === 'throw') throw new Error(${JSON.stringify([token, key, url, secret].join(" "))});
        if (init.method !== 'GET' || init.redirect !== 'error' || 'body' in init) throw new Error('OFFLINE_UNSAFE_REQUEST');
        if (requestUrl.pathname === '/auth/v1/.well-known/jwks.json') return Response.json({keys:[${JSON.stringify(ecJwk)}]});
        if (init.headers.Authorization !== 'Bearer ' + token) return mode === 'fallback' ? Response.json([]) : Response.json({code:'PGRST301'}, {status:401});
        const approved = calls === 2 || (calls >= 5 && calls <= 17);
        return approved ? Response.json([]) : Response.json({code:'42501'}, {status:403});
      };
      process.argv = [process.execPath, ${JSON.stringify(cliFile)}, ...${JSON.stringify(args)}];
      await import(${JSON.stringify(moduleUrl.href)});
      process.stderr.write('\\nOFFLINE_FETCH_COUNT=' + calls + '\\n');
    `;
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", prelude], {
      env: { SystemRoot: process.env.SystemRoot, PATH: process.env.PATH, NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key },
      encoding: "utf8", timeout: 15_000, maxBuffer: 64_000,
    });
    check(() => assert.ok(!child.error, "Offline CLI subprocess failed."));
    clean(child.stdout); clean(child.stderr);
    const report = JSON.parse(child.stdout);
    check(() => assert.equal(report.status, status));
    check(() => assert.equal(child.status, status === "PASS" ? 0 : 1));
    check(() => assert.ok(child.stderr.includes(`OFFLINE_FETCH_COUNT=${expectedCalls}\n`)));
  }
  for (const output of captured) clean(output);
  check(() => assert.equal(realFetchAttempts, 0));
} catch {
  // Even assertion failures must never dump actual/expected synthetic credentials.
  failed = true;
} finally {
  if (previous.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = previous.url;
  if (previous.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previous.key;
  globalThis.fetch = previous.fetch;
  console.log = originals.log; console.error = originals.error;
  process.stdout.write = originals.stdout; process.stderr.write = originals.stderr;
}
console.log(failed ? `Offline authenticated checks FAILED at fixed stage: ${stage}; details withheld.` :
  `${assertions} offline authenticated reader assertions passed across ${scenarios} scenarios; zero real network requests.`);
console.log("Real authenticated execution NOT RUN. No token acquisition, Auth operation, SQL or database mutation.");
process.exitCode = failed ? 1 : 0;
