// Offline/static checks for the forward public-listing contract. No database access.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const foundation = read("supabase/migrations/20261002000100_recruitment_foundation.sql");
const migration = read("supabase/migrations/20261006000100_public_recruitment_listing_order.sql");
const normalizedMigration = migration
  .replace(/--[^\r\n]*/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();
let checks = 0;
const check = (fn) => { checks++; fn(); };
const position = (statement) => {
  const found = normalizedMigration.indexOf(statement);
  assert.notEqual(found, -1, `missing migration statement: ${statement}`);
  return found;
};

const beginAt = position("begin;");
const lockAt = position("lock table public.recruitments in access exclusive mode;");
const preconditionAt = position("if exists (select 1 from public.recruitments)");
const functionAt = position("create function private.assign_first_public_listing_timestamp()");
const revokeAt = position("revoke execute on function private.assign_first_public_listing_timestamp() from public, anon, authenticated;");
const triggerAt = position("create trigger aaa_recruitment_first_public_listing");
const grantAt = position("grant select (published_at) on public.recruitments to anon, authenticated;");
const indexAt = position("create index recruitments_public_listing_order on public.recruitments(published_at desc, id desc);");
const commitAt = position("commit;");

check(() => assert.equal(beginAt, 0));
check(() => assert.ok(beginAt < lockAt));
check(() => assert.ok(lockAt < preconditionAt));
check(() => assert.ok(preconditionAt < functionAt));
check(() => assert.ok(functionAt < revokeAt));
check(() => assert.ok(revokeAt < triggerAt));
check(() => assert.ok(triggerAt < grantAt));
check(() => assert.ok(grantAt < indexAt));
check(() => assert.ok(indexAt < commitAt));
check(() => assert.match(migration, /requires an empty recruitments table/));
check(() => assert.match(migration, /old\.published_at is null and new\.publication_state = 'published'/));
check(() => assert.match(migration, /new\.published_at := now\(\);/));
check(() => assert.match(migration, /old\.published_at is null and new\.published_at is not null/));
check(() => assert.match(migration, /old\.published_at is not null[\s\S]*new\.published_at := old\.published_at;/));
check(() => assert.ok("aaa_recruitment_first_public_listing" < "recruitment_workflow"));
check(() => assert.doesNotMatch(normalizedMigration, /grant\s+(?:all|insert|update|delete)\b/));
check(() => assert.match(foundation, /r\.published_at <= now\(\)/));
check(() => assert.match(foundation, /publication_state <> 'published' or \(verification_state = 'verified' and published_at is not null and archived_at is null\)/));
check(() => assert.match(foundation, /private\.has_current_review\(r\.id, null, r\.content_version, r\.verified_by, r\.verified_at\)/));
check(() => assert.match(foundation, /revoke all on table public\.recruitments from public, anon, authenticated;/));
check(() => assert.match(foundation, /create policy recruitments_public_read on public\.recruitments for select to anon, authenticated/));

console.log(`${checks} offline public-listing migration checks passed; no SQL executed or database contacted.`);
