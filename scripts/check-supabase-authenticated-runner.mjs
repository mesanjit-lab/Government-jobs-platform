// Offline-only tests for the operator acquisition runner. Never load .env.local or call fetch.
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXPECTED_SUBJECT } from "./verify-supabase-authenticated-reader.mjs";
import { parseOperatorArguments, readConcealedPassword, runAuthenticatedReaderOperator } from "./run-supabase-authenticated-reader.mjs";

const ref = "a".repeat(20);
const url = `https://${ref}.supabase.co`;
const key = "sb_publishable_OFFLINE_ONLY";
const password = "SyntheticPassword!7";
const token = "offline.access.token";
const refresh = "offline.refresh.token";
const args = ["--allow-network", "--confirm-project=myresult", `--expected-project-ref=${ref}`, "--include-wildcards"];
const secrets = [password, token, refresh, key, url];
let assertions = 0;
let failed = false;
let stage = "start";
const previousFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error("Real network is forbidden in this test"); };
const check = (fn) => { assertions++; fn(); };
const clean = (value) => check(() => assert.ok(!secrets.some((secret) => String(value).includes(secret))));
const config = () => ({ url, publishableKey: key });
const prompts = (email = "reviewer@example.test", secret = password) => ({ promptEmail: async () => email, promptPassword: async () => secret });

try {
  stage = "argument parsing";
  const source = readFileSync(fileURLToPath(new URL("./run-supabase-authenticated-reader.mjs", import.meta.url)), "utf8");
  check(() => assert.ok(!/signUp|signInWithOtp|resetPassword|refreshSession|updateUser|signOut|auth\.admin|auth\/v1\/(?:user|logout)/.test(source)));
  check(() => assert.equal((source.match(/signInWithPassword/g) ?? []).length, 2)); // call plus capability guard
  check(() => assert.ok(!/process\.env\.(?:PASSWORD|ACCESS_TOKEN|REFRESH_TOKEN)|--(?:password|token|access-token)/.test(source)));
  check(() => assert.deepEqual(parseOperatorArguments(args), { expectedProjectRef: ref, includeWildcards: true }));
  for (const invalid of [[], args.filter((arg) => arg !== "--allow-network"), [...args, "--password=" + password], [...args, `--expected-project-ref=${ref}`],
    ["--allow-network", "--confirm-project=other", `--expected-project-ref=${ref}`], ["--allow-network", "--confirm-project=myresult", "--expected-project-ref=bad"]]) {
    check(() => assert.equal(parseOperatorArguments(invalid), undefined));
  }

  const calls = [];
  const verifierCalls = [];
  const client = (response) => (clientUrl, clientKey, options) => {
    calls.push({ clientUrl, clientKey, options });
    return { auth: { signInWithPassword: async (credentials) => { calls.push({ credentials }); return response; } } };
  };
  const verify = async (options) => { verifierCalls.push(options); return { ok: true, status: "PASS", mode: "AUTHENTICATED_JWT_READER" }; };
  const good = { data: { user: { id: EXPECTED_SUBJECT }, session: { user: { id: EXPECTED_SUBJECT }, access_token: token, refresh_token: refresh } }, error: null };

  stage = "accepted normal sign-in";
  const result = await runAuthenticatedReaderOperator({ args, ...prompts(), getEnv: config, createClientImpl: client(good), verifyImpl: verify });
  check(() => assert.equal(result.status, "PASS")); clean(JSON.stringify(result));
  check(() => assert.equal(calls.length, 2));
  check(() => assert.deepEqual(calls[0].options.auth, { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }));
  check(() => assert.deepEqual(calls[1].credentials, { email: "reviewer@example.test", password }));
  check(() => assert.equal(verifierCalls.length, 1));
  check(() => assert.deepEqual(verifierCalls[0], { allowNetwork: true, confirmedProject: "myresult", expectedProjectRef: ref, includeWildcards: true, accessToken: token }));
  clean(JSON.stringify(calls[0].options));

  for (const [label, response] of [
    ["wrong returned user", { data: { user: { id: "wrong" }, session: { user: { id: EXPECTED_SUBJECT }, access_token: token } }, error: null }],
    ["wrong session user", { data: { user: { id: EXPECTED_SUBJECT }, session: { user: { id: "wrong" }, access_token: token } }, error: null }],
    ["missing session", { data: { user: { id: EXPECTED_SUBJECT }, session: null }, error: null }],
    ["missing token", { data: { user: { id: EXPECTED_SUBJECT }, session: { user: { id: EXPECTED_SUBJECT } } }, error: null }],
    ["sign-in error", { data: { user: { id: EXPECTED_SUBJECT }, session: { user: { id: EXPECTED_SUBJECT }, access_token: token } }, error: { message: password } }],
  ]) {
    stage = label;
    let invoked = false;
    const result = await runAuthenticatedReaderOperator({ args, ...prompts(), getEnv: config, createClientImpl: client(response), verifyImpl: async () => { invoked = true; return {}; } });
    check(() => assert.equal(result.status, "FAIL")); check(() => assert.equal(invoked, false)); clean(JSON.stringify(result));
  }
  for (const [label, overrides] of [["bad email", prompts("bad", password)], ["missing password", prompts(undefined, "")], ["bad config", { ...prompts(), getEnv: () => ({ url: "https://b".repeat(1), publishableKey: key }) }]]) {
    stage = label;
    let signIns = 0;
    const result = await runAuthenticatedReaderOperator({ args, ...overrides, createClientImpl: () => ({ auth: { signInWithPassword: async () => { signIns++; return good; } } }), verifyImpl: verify });
    check(() => assert.ok(["NOT_RUN", "FAIL"].includes(result.status))); check(() => assert.equal(signIns, 0)); clean(JSON.stringify(result));
  }

  stage = "fail-closed malformed dependencies";
  for (const options of [{ args, ...prompts(), getEnv: config, createClientImpl: () => ({}) }, { args, ...prompts(), getEnv: () => { throw new Error(password); } }, { args, ...prompts(), getEnv: config, createClientImpl: () => { throw new Error(token); } }]) {
    const result = await runAuthenticatedReaderOperator(options);
    check(() => assert.equal(result.status, "FAIL")); clean(JSON.stringify(result));
  }

  stage = "concealed password input";
  class Input extends EventEmitter {
    constructor(chunks) { super(); this.isTTY = true; this.isRaw = false; this.paused = true; this.chunks = chunks; }
    isPaused() { return this.paused; } pause() { this.paused = true; } setRawMode(value) { this.isRaw = value; } resume() { this.paused = false; queueMicrotask(() => this.chunks.forEach((value) => this.emit("data", Buffer.from(value)))); }
  }
  const input = new Input([password + "\r"]); const output = { isTTY: true, write: () => {} }; const runtime = new EventEmitter();
  const entered = await readConcealedPassword(input, output, 100, runtime);
  check(() => assert.equal(entered, password)); check(() => assert.equal(input.isRaw, false)); check(() => assert.equal(input.isPaused(), true)); check(() => assert.equal(input.eventNames().length, 0));
  for (const bad of [["\x03"], ["x".repeat(1_025)], [password + "\n" + token]]) {
    const rejected = await readConcealedPassword(new Input(bad), output, 100, new EventEmitter());
    check(() => assert.equal(rejected, undefined));
  }
} catch {
  failed = true;
} finally {
  globalThis.fetch = previousFetch;
}
console.log(failed ? `Offline authenticated acquisition runner checks FAILED at fixed stage: ${stage}; details withheld.` :
  `${assertions} offline authenticated acquisition runner checks passed; zero real network requests.`);
console.log("Real sign-in NOT RUN. No token acquisition, Auth operation, SQL or database mutation.");
process.exitCode = failed ? 1 : 0;
