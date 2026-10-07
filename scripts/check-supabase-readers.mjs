// Offline only: synthetic env, mocked HTTP, no .env.local loading or real requests.
// Run: node scripts/check-supabase-readers.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { format } from "node:util";
let checks = 0;
function check(fn) { fn(); checks++; }
let scenarios = 0;
const fakeUrl = "https://abcdefghijklmnopqrst.supabase.co";
const fakeRef = "abcdefghijklmnopqrst";
const otherRef = "zyxwvutsrqponmlkjihg";
const fakeKey = "sb_publishable_OFFLINE_SENTINEL_ONLY";
const sensitive = "PRIVATE_SENTINEL_PASSWORD_JWT_BODY";
const authorization = "Bearer OFFLINE_AUTHORIZATION_SENTINEL";
const jwt = "eyJhbGciOiJOT05FIn0.eyJzdWIiOiJPRkZMSU5FIn0.OFFLINE_SIGNATURE";
const secrets = [fakeUrl, fakeRef, otherRef, fakeKey, sensitive, authorization, jwt];
const captured = { log: [], error: [], stdout: [], stderr: [] };
const originalLog = console.log;
const originalError = console.error;
const originalStdout = process.stdout.write;
const originalStderr = process.stderr.write;
console.log = (...args) => captured.log.push(format(...args));
console.error = (...args) => captured.error.push(format(...args));
function captureWrite(channel) {
  return (chunk, encoding, callback) => {
    captured[channel].push(String(chunk));
    const done = typeof encoding === "function" ? encoding : callback;
    if (done) done();
    return true;
  };
}
process.stdout.write = captureWrite("stdout");
process.stderr.write = captureWrite("stderr");
function cleanOutput(text) {
  for (const secret of secrets) check(() => assert.ok(!text.includes(secret), "Sensitive synthetic value leaked to output."));
}
const config = { url: fakeUrl, publishableKey: fakeKey };
const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const previousFetch = globalThis.fetch;
let attemptedRealRequests = 0;
// Guard import-time regressions too, before loading any project module.
globalThis.fetch = () => { attemptedRealRequests++; throw new Error(sensitive); };
process.env.NEXT_PUBLIC_SUPABASE_URL = fakeUrl;
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = fakeKey;
const {
  readerManifest, anonymousChecks, buildReaderRequest,
  classifyReaderResponse, verifyAnonymousReaders, readerReport,
} = await import("./verify-supabase-readers.mjs");
const { PUBLIC_RECRUITMENT_PROJECTION } = await import("../lib/repositories/public-recruitments.ts");
function redacted(value) {
  const text = JSON.stringify(value);
  cleanOutput(text);
  if ("results" in value) {
    const report = readerReport(value);
    const output = JSON.stringify(report);
    check(() => assert.ok(!("results" in report)));
    check(() => assert.ok(output.length < 2_000));
    cleanOutput(output);
  }
}

// Compare every explicit column with the actual local migration; no SQL execution.
const foundationSql = readFileSync(new URL("../supabase/migrations/20261002000100_recruitment_foundation.sql", import.meta.url), "utf8");
const orderingSql = readFileSync(new URL("../supabase/migrations/20261006000100_public_recruitment_listing_order.sql", import.meta.url), "utf8");
const definitions = new Map([...foundationSql.matchAll(/create table public\.(\w+) \(([\s\S]*?)\n\);/g)]
  .map((match) => [match[1], [...match[2].matchAll(/^  (?!unique\b|check\b|foreign\b|primary\b)(\w+) /gm)].map((column) => column[1])]));
const grants = new Map();
for (const sql of [foundationSql, orderingSql]) {
  for (const match of sql.matchAll(/grant select \(([\s\S]*?)\) on public\.(\w+) to anon, authenticated;/g)) {
    const columns = match[1].split(",").map((column) => column.trim());
    grants.set(match[2], [...new Set([...(grants.get(match[2]) ?? []), ...columns])]);
  }
}
check(() => assert.equal(definitions.size, 17));
check(() => assert.equal(grants.size, 14));
check(() => assert.deepEqual(readerManifest.map((entry) => entry.table).sort(), [...definitions.keys()].sort()));
for (const entry of readerManifest) {
  const expectedApproved = grants.get(entry.table) ?? [];
  const expectedRestricted = definitions.get(entry.table).filter((column) => !expectedApproved.includes(column));
  check(() => assert.deepEqual([...entry.approved].sort(), [...expectedApproved].sort()));
  check(() => assert.deepEqual([...entry.restricted].sort(), expectedRestricted.sort()));
  check(() => assert.equal(new Set([...entry.approved, ...entry.restricted]).size, definitions.get(entry.table).length));
  check(() => assert.ok(Object.isFrozen(entry) && Object.isFrozen(entry.approved) && Object.isFrozen(entry.restricted)));
}
check(() => assert.ok(Object.isFrozen(readerManifest)));
check(() => assert.throws(() => readerManifest[0].restricted.push("fake"), TypeError));
const baseChecks = anonymousChecks();
const wildcardChecks = anonymousChecks(true);
check(() => assert.equal(baseChecks.length, 90));
check(() => assert.equal(wildcardChecks.length, 107));
for (const [category, count] of [["approved", 14], ["excluded", 51], ["private", 25], ["wildcard", 17]]) {
  check(() => assert.equal(wildcardChecks.filter((item) => item.category === category).length, count));
}
check(() => assert.deepEqual(readerManifest.filter((entry) => !entry.approved.length).map((entry) => entry.table).sort(),
  ["editor_memberships", "recruitment_reviews", "recruitment_sources"]));
const recruitmentManifest = readerManifest.find((entry) => entry.table === "recruitments");
check(() => assert.ok(recruitmentManifest.approved.includes("published_at")));
check(() => assert.ok(!recruitmentManifest.restricted.includes("published_at")));
check(() => assert.equal(recruitmentManifest.approved.join(","), PUBLIC_RECRUITMENT_PROJECTION));
check(() => assert.ok(!readerManifest.find((entry) => entry.table === "recruitment_reviews").restricted.includes("created_at")));
check(() => assert.ok(!readerManifest.find((entry) => entry.table === "recruitment_salary").approved.includes("id")));
check(() => assert.ok(!readerManifest.find((entry) => entry.table === "post_vacancy_counts").approved.includes("id")));

for (const probe of wildcardChecks) {
  const request = buildReaderRequest(config, probe);
  check(() => assert.equal(request.url.origin, fakeUrl));
  check(() => assert.equal(request.url.pathname, `/rest/v1/${probe.table}`));
  check(() => assert.deepEqual([...request.url.searchParams.keys()], ["select", "limit"]));
  check(() => assert.equal(request.url.searchParams.get("select"), probe.projection));
  check(() => assert.equal(request.url.searchParams.get("limit"), "0"));
  check(() => assert.equal(request.init.method, "GET"));
  check(() => assert.equal(request.init.redirect, "error"));
  check(() => assert.equal(request.init.credentials, "omit"));
  check(() => assert.deepEqual(request.init.headers, { apikey: fakeKey, Accept: "application/json", "Accept-Profile": "public" }));
  check(() => assert.ok(!("body" in request.init)));
}
check(() => assert.equal(buildReaderRequest(config, baseChecks[0], "HEAD").init.method, "HEAD"));
for (const method of ["POST", "PATCH", "PUT", "DELETE", "OPTIONS", "TRACE", "CONNECT", "get", ""]) {
  check(() => assert.throws(() => buildReaderRequest(config, baseChecks[0], method), /Unsupported reader method/));
}
for (const probe of [
  { ...baseChecks[0], table: "rpc/is_public_recruitment" },
  { ...baseChecks[0], table: "../auth/v1/user" },
  { ...baseChecks[0], table: "auth.users" },
  { ...baseChecks[0], table: "organizations?select=*" },
  { ...baseChecks[0], projection: "id,recruitments(*)" },
  { ...baseChecks[0], projection: "not_a_column" },
  { ...baseChecks[0], path: "/rest/v1/rpc/test" },
  { ...baseChecks[0], allowed: false },
  { ...baseChecks[0], category: "private" },
]) check(() => assert.throws(() => buildReaderRequest(config, probe), /Unsupported reader projection\/path/));
for (const invalidConfig of [
  { ...config, publishableKey: "sb_secret_OFFLINE_ONLY" },
  { ...config, publishableKey: "eyJ_OFFLINE_ONLY" },
  { ...config, url: "http://localhost:54321" },
  { ...config, url: "https://example.invalid" },
  { ...config, url: fakeUrl + "/rpc/test" },
]) check(() => assert.throws(() => buildReaderRequest(invalidConfig, baseChecks[0])));

for (const [allowed, status, payload, outcome] of [
  [true, 200, [], "PASS_ALLOWED_EMPTY"],
  [false, 401, { code: "42501", message: sensitive }, "PASS_PERMISSION_DENIED"],
  [false, 200, [], "FAIL_UNEXPECTED_ALLOW"],
  [false, 204, null, "FAIL_UNEXPECTED_ALLOW"],
  [true, 401, { code: "42501" }, "FAIL_UNEXPECTED_DENY"],
  [true, 200, [{ secret: sensitive }], "FAIL_RESPONSE_FORMAT"],
  [true, 200, { code: "42501" }, "FAIL_RESPONSE_FORMAT"],
  [false, 401, { code: "PGRST301" }, "FAIL_AUTH_OR_API_KEY"],
  [false, 401, { message: "Invalid API key " + sensitive }, "FAIL_AUTH_OR_API_KEY"],
  [false, 403, { code: "42501" }, "PASS_PERMISSION_DENIED"],
  [true, 403, { code: "42501" }, "FAIL_UNEXPECTED_DENY"],
  [false, 403, {}, "FAIL_AUTH_OR_API_KEY"],
  [false, 403, { code: "PGRST301" }, "FAIL_AUTH_OR_API_KEY"],
  [false, 400, { code: "42703" }, "FAIL_SCHEMA_MISMATCH"],
  [false, 404, { code: "42P01" }, "FAIL_SCHEMA_MISMATCH"],
  [false, 404, { code: "PGRST205" }, "FAIL_SCHEMA_MISMATCH"],
  [false, 400, { code: "PGRST204" }, "FAIL_SCHEMA_MISMATCH"],
  [true, 408, null, "INCONCLUSIVE_NETWORK"],
  [true, 429, { code: "42501" }, "INCONCLUSIVE_RATE_LIMIT"],
  [false, 503, { code: "42501" }, "INCONCLUSIVE_SERVER"],
  [false, 302, null, "FAIL_REDIRECT"],
  [false, 400, { code: "42501" }, "FAIL_RESPONSE_FORMAT"],
  [false, 400, { code: sensitive, details: fakeKey }, "FAIL_RESPONSE_FORMAT"],
]) {
  scenarios++;
  const result = classifyReaderResponse(allowed, status, payload);
  check(() => assert.equal(result.outcome, outcome));
  redacted(result);
}

const approvedOptions = { allowNetwork: true, confirmedProject: "myresult", expectedProjectRef: fakeRef };
let mockedRequests = 0;
const goodFetch = async (url, init) => {
  mockedRequests++;
  check(() => assert.equal(init.method, "GET"));
  check(() => assert.equal(init.redirect, "error"));
  check(() => assert.ok(init.signal instanceof AbortSignal));
  const entry = readerManifest.find((item) => `/rest/v1/${item.table}` === url.pathname);
  const approved = url.searchParams.get("select") === entry.approved.join(",") && entry.approved.length > 0;
  return Response.json(approved ? [] : { code: "42501", message: sensitive, details: fakeKey, hint: fakeUrl }, { status: approved ? 200 : 401 });
};
try {
  process.env.NEXT_PUBLIC_SUPABASE_URL = fakeUrl;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = fakeKey;
  for (const options of [{}, { confirmedProject: "myresult" }, { allowNetwork: true }, { allowNetwork: true, confirmedProject: "other" }]) {
    scenarios++;
    const result = await verifyAnonymousReaders({ ...options, fetchImpl: goodFetch });
    check(() => assert.equal(result.status, "NOT_RUN"));
    check(() => assert.equal(result.completed, 0));
    redacted(result);
  }
  check(() => assert.equal(mockedRequests, 0));
  // Project pinning validates the effective inherited env, not a claimed file.
  for (const expectedProjectRef of [undefined, "", "bad", fakeRef.toUpperCase(), fakeUrl, otherRef]) {
    scenarios++;
    const result = await verifyAnonymousReaders({ ...approvedOptions, expectedProjectRef, fetchImpl: goodFetch });
    check(() => assert.equal(result.completed, 0));
    check(() => assert.equal(result.status, expectedProjectRef === otherRef ? "FAIL" : "NOT_RUN"));
    check(() => assert.equal(mockedRequests, 0));
    redacted(result);
  }
  for (const url of ["not a URL", "https://example.invalid", "http://localhost:54321", `https://${otherRef}.supabase.co`]) {
    scenarios++;
    process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    const result = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: goodFetch });
    check(() => assert.equal(result.status, "FAIL"));
    check(() => assert.equal(mockedRequests, 0));
    redacted(result);
  }
  process.env.NEXT_PUBLIC_SUPABASE_URL = fakeUrl;
  for (const options of [
    { requestTimeoutMs: 10_001 }, { requestTimeoutMs: 0 }, { requestTimeoutMs: Infinity },
    { runTimeoutMs: 180_001 }, { runTimeoutMs: -1 }, { runTimeoutMs: NaN },
    { fetchImpl: "not a function" }, { token: sensitive }, { method: "POST" }, { path: "/rpc/test" },
  ]) {
    scenarios++;
    const result = await verifyAnonymousReaders({ ...approvedOptions, ...options });
    check(() => assert.equal(result.status, "NOT_RUN"));
    redacted(result);
  }
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const missing = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: goodFetch });
  scenarios++;
  check(() => assert.equal(missing.status, "FAIL"));
  check(() => assert.equal(mockedRequests, 0));
  redacted(missing);
  for (const invalidKey of ["sb_secret_OFFLINE_ONLY", "eyJ_OFFLINE_ONLY", fakeKey + " "]) {
    scenarios++;
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = invalidKey;
    const result = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: goodFetch });
    check(() => assert.equal(result.status, "FAIL"));
  }
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = fakeKey;
  for (const includeWildcards of [false, true]) {
    scenarios++;
    mockedRequests = 0;
    const result = await verifyAnonymousReaders({ ...approvedOptions, includeWildcards, fetchImpl: goodFetch });
    check(() => assert.equal(result.status, "PASS"));
    check(() => assert.equal(result.ok, true));
    check(() => assert.equal(result.authenticated, "NOT RUN"));
    check(() => assert.equal(result.completed, includeWildcards ? 107 : 90));
    check(() => assert.equal(result.passed, result.planned));
    check(() => assert.equal(readerReport(result).firstNonPass, null));
    check(() => assert.equal(mockedRequests, result.planned));
    check(() => assert.deepEqual(result.categories, { approved: 14, excluded: 51, private: 25, wildcard: includeWildcards ? 17 : 0 }));
    redacted(result);
  }
  // All failed/inconclusive cases stop immediately, with no retry or raw errors.
  for (const [fetchImpl, expected] of [
    [async () => Response.json({ code: "42501", message: sensitive }, { status: 401 }), "FAIL_UNEXPECTED_DENY"],
    [async () => Response.json({ code: "42501", message: sensitive }, { status: 403 }), "FAIL_UNEXPECTED_DENY"],
    [async () => Response.json({ code: "PGRST301", message: sensitive }, { status: 401 }), "FAIL_AUTH_OR_API_KEY"],
    [async () => new Response(sensitive, { status: 401 }), "FAIL_AUTH_OR_API_KEY"],
    [async () => Response.json({ code: "42703", message: sensitive }, { status: 400 }), "FAIL_SCHEMA_MISMATCH"],
    [async () => new Response(sensitive, { status: 429 }), "INCONCLUSIVE_RATE_LIMIT"],
    [async () => new Response(sensitive, { status: 408 }), "INCONCLUSIVE_NETWORK"],
    [async () => new Response(sensitive, { status: 500 }), "INCONCLUSIVE_SERVER"],
    [async () => { throw new Error(fakeUrl + fakeKey + sensitive); }, "INCONCLUSIVE_NETWORK"],
    [async () => new Response(new ReadableStream({ start(controller) { controller.error(new Error(sensitive)); } })), "INCONCLUSIVE_NETWORK"],
    [async () => new Response(null, { status: 302, headers: { Location: fakeUrl + "/auth/v1" } }), "FAIL_REDIRECT"],
    [async () => ({ redirected: true, status: 200, url: fakeUrl + "/auth/v1" }), "FAIL_REDIRECT"],
    [async () => ({ redirected: false, status: 200, url: fakeUrl + "/other" }), "FAIL_REDIRECT"],
    [async () => new Response(sensitive, { status: 200 }), "FAIL_RESPONSE_FORMAT"],
    [async () => new Response("[" + " ".repeat(16_385) + "]", { status: 200 }), "FAIL_RESPONSE_FORMAT"],
  ]) {
    scenarios++;
    let calls = 0;
    const result = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: (...args) => { calls++; return fetchImpl(...args); } });
    check(() => assert.equal(result.results[0].outcome, expected));
    check(() => assert.equal(calls, 1));
    check(() => assert.equal(result.ok, false));
    redacted(result);
  }
  const unexpectedAllow = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: async () => Response.json([]) });
  scenarios++;
  check(() => assert.equal(unexpectedAllow.results.at(-1).outcome, "FAIL_UNEXPECTED_ALLOW"));
  check(() => assert.equal(unexpectedAllow.completed, 15));
  check(() => assert.equal(readerReport(unexpectedAllow).firstNonPass.outcome, "FAIL_UNEXPECTED_ALLOW"));
  redacted(unexpectedAllow);

  // Promise race bounds even an injected fetch/response stream ignoring AbortSignal.
  for (const fetchImpl of [
    () => new Promise(() => {}),
    async () => new Response(new ReadableStream({ start() {} })),
  ]) {
    scenarios++;
    const started = performance.now();
    const result = await verifyAnonymousReaders({ ...approvedOptions, requestTimeoutMs: 15, fetchImpl });
    check(() => assert.equal(result.status, "INCONCLUSIVE"));
    check(() => assert.equal(result.results[0].outcome, "INCONCLUSIVE_NETWORK"));
    check(() => assert.ok(performance.now() - started < 2_000));
    redacted(result);
  }
  const deadline = await verifyAnonymousReaders({ ...approvedOptions, requestTimeoutMs: 10_000, runTimeoutMs: 15, fetchImpl: () => new Promise(() => {}) });
  scenarios++;
  check(() => assert.equal(deadline.status, "INCONCLUSIVE"));
  check(() => assert.equal(deadline.completed, 1));
  check(() => assert.equal(deadline.ok, false));

  let active = 0;
  scenarios++;
  let maximumActive = 0;
  const sequential = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: async (...args) => {
    active++;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, 1));
    try { return await goodFetch(...args); } finally { active--; }
  } });
  check(() => assert.equal(sequential.status, "PASS"));
  check(() => assert.equal(maximumActive, 1));
  scenarios++;
  const snapshot = await verifyAnonymousReaders({ ...approvedOptions, fetchImpl: async (url, init) => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${otherRef}.supabase.co`;
    check(() => assert.equal(url.hostname, `${fakeRef}.supabase.co`));
    return goodFetch(url, init);
  } });
  check(() => assert.equal(snapshot.status, "PASS"));
  process.env.NEXT_PUBLIC_SUPABASE_URL = fakeUrl;
  // Exercise the actual CLI entry branch in isolated Node processes. The prelude
  // installs synthetic env and a mocked/blocked global fetch BEFORE module import;
  // no production injection option, env-file, native fetch or real credentials.
  const cliFile = fileURLToPath(new URL("./verify-supabase-readers.mjs", import.meta.url));
  const cliFlags = ["--allow-network", "--confirm-project=myresult", `--expected-project-ref=${fakeRef}`];
  for (const [args, url, key, mode, status, calls] of [
    [[], fakeUrl, fakeKey, "blocked", "NOT_RUN", 0],
    [cliFlags.slice(0, 2), fakeUrl, fakeKey, "blocked", "NOT_RUN", 0],
    [[...cliFlags, "--unknown=" + jwt], fakeUrl, fakeKey, "blocked", "NOT_RUN", 0],
    [[...cliFlags, `--expected-project-ref=${otherRef}`], fakeUrl, fakeKey, "blocked", "NOT_RUN", 0],
    [cliFlags, `https://${otherRef}.supabase.co`, fakeKey, "blocked", "FAIL", 0],
    [cliFlags, "invalid " + sensitive, fakeKey, "blocked", "FAIL", 0],
    [cliFlags, fakeUrl, "", "blocked", "FAIL", 0],
    [cliFlags, fakeUrl, fakeKey, "pass401", "PASS", 90],
    [cliFlags, fakeUrl, fakeKey, "pass403", "PASS", 90],
    [[...cliFlags, "--include-wildcards"], fakeUrl, fakeKey, "pass403", "PASS", 107],
    [cliFlags, fakeUrl, fakeKey, "deny", "FAIL", 1],
    [cliFlags, fakeUrl, fakeKey, "throw", "INCONCLUSIVE", 1],
  ]) {
    scenarios++;
    const prelude = `
      let calls = 0;
      globalThis.fetch = async (url, init) => {
        calls++;
        const mode = ${JSON.stringify(mode)};
        if (mode === 'blocked') throw new Error('OFFLINE_UNEXPECTED_FETCH');
        if (mode === 'throw') throw new Error(${JSON.stringify(secrets.join(" "))});
        if (init.method !== 'GET' || init.redirect !== 'error' || url.searchParams.get('limit') !== '0' ||
            Object.keys(init.headers).some(k => /authorization|cookie/i.test(k)) || 'body' in init) {
          throw new Error('OFFLINE_UNSAFE_REQUEST');
        }
        const approved = calls <= 14 && mode !== 'deny';
        return Response.json(approved ? [] : {code:'42501', message:${JSON.stringify(secrets.join(" "))}},
          {status: approved ? 200 : mode === 'pass403' ? 403 : 401});
      };
      process.argv = [process.execPath, ${JSON.stringify(cliFile)}, ...${JSON.stringify(args)}];
      await import(${JSON.stringify(new URL("./verify-supabase-readers.mjs", import.meta.url).href)});
      process.stderr.write('OFFLINE_FETCH_COUNT=' + calls + '\\n');
    `;
    // Do not inherit NODE_OPTIONS, secrets or any real public configuration.
    const env = { SystemRoot: process.env.SystemRoot, PATH: process.env.PATH,
      NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key };
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", prelude], { env, encoding: "utf8", timeout: 15_000, maxBuffer: 64_000 });
    check(() => assert.ok(!child.error, "Offline CLI child process failed."));
    cleanOutput(child.stdout);
    cleanOutput(child.stderr);
    const report = JSON.parse(child.stdout);
    check(() => assert.equal(report.status, status));
    check(() => assert.equal(child.status, status === "PASS" ? 0 : 1));
    check(() => assert.ok(child.stderr.includes(`OFFLINE_FETCH_COUNT=${calls}\n`)));
    check(() => assert.ok(!child.stderr.includes("OFFLINE_UNEXPECTED_FETCH")));
  }
  for (const channel of Object.values(captured)) cleanOutput(channel.join(""));
  check(() => assert.equal(attemptedRealRequests, 0));
} finally {
  if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
  if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
  globalThis.fetch = previousFetch;
  console.log = originalLog;
  console.error = originalError;
  process.stdout.write = originalStdout;
  process.stderr.write = originalStderr;
}
console.log(`${checks} offline reader harness checks passed across ${scenarios} classification/runner/CLI scenarios; zero real network requests.`);
console.log("Manifest matches 17 migration tables: 14 approved projections, 51 excluded columns, 25 private columns; 17 optional wildcards.");
console.log("Remote anonymous verification NOT RUN; authenticated JWT verification NOT RUN. No SQL/Auth/data mutations.");
