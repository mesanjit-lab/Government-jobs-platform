// Offline checks only; uses existing TypeScript tooling, never a real database.
// Run: git show HEAD:lib/data/recruitments.ts | node scripts/check-supabase-foundation.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { parseSupabasePublicEnv, SupabaseEnvironmentError } from "../lib/supabase/env.ts";
import { verifySupabase } from "./verify-supabase.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
let checks = 0;
function check(fn) { fn(); checks++; }
const fakeUrl = "https://example.invalid";
const fakeKey = "sb_publishable_offline_test_only";
for (const [url, key] of [
  [undefined, undefined], [fakeUrl, undefined], [undefined, fakeKey],
  ["bad", fakeKey], ["http://example.invalid", fakeKey],
  ["https://name:password@example.invalid", fakeKey], [fakeUrl + "/path", fakeKey],
  [fakeUrl + "?key=secret", fakeKey], [fakeUrl + "#secret", fakeKey],
  [" " + fakeUrl, fakeKey], [fakeUrl, "sb_secret_offline_test"],
  [fakeUrl, "eyJ_fake_legacy_JWT"], [fakeUrl, fakeKey + " "],
]) check(() => assert.throws(() => parseSupabasePublicEnv(url, key), SupabaseEnvironmentError));
for (const url of [fakeUrl, "http://localhost:54321", "http://127.0.0.1:54321", "http://[::1]:54321"])
  check(() => assert.equal(parseSupabasePublicEnv(url, fakeKey).url, url));

// Never use inherited real configuration, and never allow a real fetch.
const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const previousFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error("Real network is forbidden in this test"); };
try {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const missing = await verifySupabase({ allowNetwork: true });
  check(() => assert.equal(missing.ok, false));
  check(() => assert.match(missing.message, /NEXT_PUBLIC_SUPABASE_URL/));
  process.env.NEXT_PUBLIC_SUPABASE_URL = fakeUrl;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = fakeKey;
  check(() => assert.equal(parseSupabasePublicEnv(fakeUrl, fakeKey).publishableKey, fakeKey));
  const denied = await verifySupabase();
  check(() => assert.match(denied.message, /No request sent/));
  let requests = 0;
  const good = await verifySupabase({ allowNetwork: true, fetchImpl: async (url, init) => {
    requests++;
    check(() => assert.equal(init.method, "HEAD"));
    check(() => assert.equal(new URL(url).pathname, "/rest/v1/recruitments"));
    check(() => assert.equal(new URL(url).searchParams.get("select"), "id"));
    check(() => assert.equal(new URL(url).searchParams.get("limit"), "1"));
    return new Response(null, { status: 200 });
  } });
  check(() => assert.equal(good.ok, true));
  check(() => assert.equal(requests, 1));
  const bad = await verifySupabase({ allowNetwork: true, fetchImpl: async () => new Response(null, { status: 403 }) });
  check(() => assert.equal(bad.ok, false));
  check(() => assert.match(bad.message, /HTTP 403/));
  check(() => assert.ok(!bad.message.includes(fakeKey) && !bad.message.includes(fakeUrl)));
} finally {
  if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
  if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
  globalThis.fetch = previousFetch;
}

function compile(source, imports = {}) {
  const module = { exports: {} };
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", "module", output)((id) => {
    if (id in imports) return imports[id];
    throw new Error(`Unexpected runtime import: ${id}`);
  }, module.exports, module);
  return module.exports;
}

// Verify SSR adapter shape and request scoping without Next runtime or credentials.
let cookieReads = 0;
const server = compile(read("lib/supabase/server.ts"), {
  "server-only": {},
  "next/headers": { cookies: async () => { cookieReads++; return { getAll: () => [{ name: "test", value: "synthetic" }] }; } },
  "./env": { getSupabasePublicEnv: () => ({ url: fakeUrl, publishableKey: fakeKey }) },
  "@supabase/ssr": { createServerClient: (url, key, options) => ({ url, key, options }) },
});
const first = await server.createClient();
const second = await server.createClient();
check(() => assert.notEqual(first, second));
check(() => assert.equal(cookieReads, 2));
check(() => assert.equal(first.options.cookies.getAll()[0].name, "test"));
check(() => assert.throws(() => first.options.cookies.setAll([], {}), /response cookie\/header adapter/));
const writer = () => {};
const withWriter = await server.createClient(writer);
check(() => assert.equal(withWriter.options.cookies.setAll, writer));
const browser = compile(read("lib/supabase/client.ts"), {
  "client-only": {},
  "./env": { getSupabasePublicEnv: () => ({ url: fakeUrl, publishableKey: fakeKey }) },
  "@supabase/ssr": { createBrowserClient: (url, key) => ({ url, key }) },
});
check(() => assert.deepEqual(browser.createClient(), { url: fakeUrl, key: fakeKey }));

// Textual SQL structure checks: NOT a PostgreSQL parser or execution/RLS test.
const sql = read("supabase/migrations/20261002000100_recruitment_foundation.sql");
const tables = [...sql.matchAll(/create table public\.(\w+)/g)].map(match => match[1]);
check(() => assert.equal(tables.length, 17));
check(() => assert.equal(new Set(tables).size, 17));
for (const table of tables) {
  check(() => assert.ok(sql.includes(`alter table public.${table} enable row level security;`)));
  check(() => assert.ok(sql.includes(`revoke all on table public.${table} from public, anon, authenticated;`)));
}
for (const match of sql.matchAll(/references public\.(\w+)/g)) {
  check(() => assert.ok(sql.indexOf(`create table public.${match[1]} (`) < match.index));
}
const policies = [...sql.matchAll(/create policy (\w+) on public\.(\w+) for (\w+)/g)];
check(() => assert.equal(policies.length, 14));
for (const [, , table, operation] of policies) {
  check(() => assert.ok(tables.includes(table)));
  check(() => assert.equal(operation, "select"));
}
for (const table of ["editor_memberships", "recruitment_reviews", "recruitment_sources"]) {
  check(() => assert.ok(!policies.some(([, , target]) => target === table)));
  check(() => assert.ok(!new RegExp(`grant select[^;]*on public\\.${table}\\b`).test(sql)));
}
for (const kind of ["function", "trigger", "index", "policy"]) {
  const names = [...sql.matchAll(new RegExp(`create (?:unique )?${kind} ([\\w.]+)`, "g"))].map(match => match[1]);
  check(() => assert.equal(names.length, new Set(names).size));
}
check(() => assert.equal((sql.match(/\$\$/g) ?? []).length % 2, 0));
check(() => assert.equal((sql.match(/language plpgsql/g) ?? []).length, (sql.match(/end;\r?\n\$\$;/g) ?? []).length));
check(() => assert.ok(!/\b(?:drop|truncate)\s+(?:table|schema)|grant\s+(?:all|insert|update|delete)\b/i.test(sql)));
check(() => assert.ok(!/insert\s+into\s+public\./i.test(sql)));
check(() => assert.equal((sql.match(/security definer set search_path = ''/g) ?? []).length, 3));
check(() => assert.ok(sql.trimEnd().endsWith("commit;")));

// Keep storage enums aligned with the existing database-independent contract.
const domainSource = read("lib/domain/recruitment.ts");
const domain = compile(domainSource);
for (const [column, values] of [
  ["lifecycle_status", domain.recruitmentLifecycleStatuses],
  ["kind", domain.importantDateKinds],
]) {
  const sqlLists = [...sql.matchAll(new RegExp(`${column} in \\(([^)]+)\\)`, "g"))]
    .map(match => [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]));
  check(() => assert.ok(sqlLists.some(list => JSON.stringify(list) === JSON.stringify(values))));
}
for (const [typeName, column] of [["PublicationState", "publication_state"], ["VerificationState", "verification_state"]]) {
  const line = domainSource.match(new RegExp(`export type ${typeName} = ([^\\r\\n]+)`))[1];
  const expected = [...line.matchAll(/'([^']+)'/g)].map(match => match[1]);
  for (const match of sql.matchAll(new RegExp(`${column} in \\(([^)]+)\\)`, "g"))) {
    check(() => assert.deepEqual([...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]), expected));
  }
}
const definitions = new Map([...sql.matchAll(/create table public\.(\w+) \(([\s\S]*?)\n\);/g)]
  .map(match => [match[1], match[2]]));
check(() => assert.equal(definitions.size, 17));
for (const match of sql.matchAll(/references public\.(\w+)\(([^)]+)\)/g)) {
  const definition = definitions.get(match[1]);
  for (const column of match[2].split(",").map(value => value.trim())) {
    check(() => assert.match(definition, new RegExp(`^  ${column} `, "m")));
  }
}

// SDK lock/install version agreement, using only already installed modules.
const require = createRequire(import.meta.url);
const lock = JSON.parse(read("package-lock.json"));
for (const name of ["@supabase/supabase-js", "@supabase/ssr"]) {
  check(() => assert.equal(require(`${name}/package.json`).version, lock.packages[`node_modules/${name}`].version));
}

// Exactly the previous 36 selector parity comparisons; HEAD source arrives via stdin.
const baseline = readFileSync(0, "utf8");
assert.ok(baseline.includes("getRecruitments"), "Pipe HEAD fixture source into this script; no test data is written.");
const before = compile(baseline);
const after = compile(read("lib/data/recruitments.ts"));
let fixtureChecks = 0;
function parity(name, args = []) {
  assert.deepEqual(after[name](...args), before[name](...args)); fixtureChecks++;
}
parity("getRecruitments"); parity("getRecruitmentsForEligibility");
for (const limit of [undefined, 0, 1, 2, 5, 8, 20]) parity("getLatestRecruitments", [limit]);
for (const id of ["1", "2", "3", "4", "5", "6", "7", "8", "unknown"]) {
  for (const name of ["getRecruitmentById", "getRecruitmentDetailView", "hasRecruitmentDetail"]) parity(name, [id]);
}
assert.equal(fixtureChecks, 36);
console.log(`${checks} offline foundation checks passed; ${fixtureChecks} fixture comparisons against HEAD passed.`);
console.log("SQL checks are static only. No database contacted or migrations executed.");
