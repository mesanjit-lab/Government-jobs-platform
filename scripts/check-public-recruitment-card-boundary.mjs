import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(new URL("../supabase/migrations/20261009000100_public_recruitment_card_boundary.sql", import.meta.url), "utf8");
const listingMigration = readFileSync(new URL("../supabase/migrations/20261006000100_public_recruitment_listing_order.sql", import.meta.url), "utf8");

const expect = (condition, message) => assert.equal(condition, true, message);
const count = (pattern) => (migration.match(pattern) ?? []).length;

expect(/^--[\s\S]*?\bbegin;/.test(migration), "migration is transactional");
expect(/\bcommit;\s*$/.test(migration), "migration commits");
expect(/create function private\.is_complete_public_recruitment_card\(rec uuid\)[\s\S]*?security definer set search_path = ''/i.test(migration), "completeness helper is trusted with fixed search path");
expect(/revoke execute on function private\.is_complete_public_recruitment_card\(uuid\) from public, anon, authenticated;/i.test(migration), "completeness helper is not callable by readers");
expect(/lock table public\.recruitments in access exclusive mode;/i.test(migration), "legacy precondition is serialized against parent invalidation");
expect(/not private\.is_complete_public_recruitment_card\(r\.id\)/i.test(migration), "legacy incomplete published rows block deployment");
expect(/o\.archived_at is null/i.test(migration), "active organization is required");
expect(/r\.slug ~ '\^\[a-z0-9\]\+\(-\[a-z0-9\]\+\)\*\$'/i.test(migration), "slug grammar is required");
expect(/r\.slug !~ '\^\[0-9\]\+\$'/i.test(migration), "numeric-only slugs are rejected");
expect(/nullif\(btrim\(e\.qualification\), ''\) is not null/i.test(migration), "nonblank qualification is required");
expect(/d\.kind = 'application_end'/i.test(migration), "application-end rows are scoped");
expect(/and d\.date is null/i.test(migration), "null application-end dates are rejected");
expect(/count\(distinct d\.date\)\s*from public\.recruitment_dates/i.test(migration), "one distinct deadline is required by the guard");
expect(/count\(d\.date\) = count\(\*\)/i.test(migration), "view also excludes null deadlines");
expect(count(/count\(distinct d\.date\) = 1/g) === 1, "view accepts only one distinct deadline");
expect(/create function private\.guard_public_recruitment_card\(\)[\s\S]*?new\.publication_state = 'published'/i.test(migration), "final published state is guarded");
expect(/create trigger zzz_recruitment_public_card_ready\s+before insert or update on public\.recruitments/i.test(migration), "readiness trigger exists");
expect(listingMigration.indexOf("aaa_recruitment_first_public_listing") >= 0, "listing trigger exists");
expect("zzz_recruitment_public_card_ready" > "recruitment_workflow", "readiness trigger sorts after workflow");
expect(/create index recruitment_eligibility_rules_card_candidates\s+on public\.recruitment_eligibility_rules\(recruitment_id, position, id\)\s+where qualification is not null;/i.test(migration), "qualification lookup index is present");
expect(/create index recruitment_dates_card_deadline_lookup\s+on public\.recruitment_dates\(recruitment_id, kind, date\);/i.test(migration), "deadline lookup index is present");
expect(/with \(security_invoker = true\)/i.test(migration), "view is security invoker");
expect(/create view public\.public_recruitment_cards/i.test(migration), "public card view exists");
expect(!/select\s+\*/i.test(migration), "no select-star projection");
for (const forbidden of ["verified_by", "verified_at", "verified_version", "content_version", "publication_state", "archived_at", "created_by", "updated_by", "notes", "official_url", "source", "review"]) {
  const projection = migration.slice(migration.indexOf("select\n  r.id"), migration.indexOf("where private.is_public_recruitment"));
  expect(!projection.includes(forbidden), `view excludes ${forbidden}`);
}
expect(/revoke all on table public\.public_recruitment_cards from public, anon, authenticated;/i.test(migration), "view permissions start closed");
expect(/grant select on table public\.public_recruitment_cards to anon, authenticated;/i.test(migration), "view has narrow reader grant");
expect(/private\.is_public_recruitment\(r\.id\)/i.test(migration), "view retains public-state predicate");
expect(/r\.published_at,/i.test(migration), "view exposes immutable listed-at value");
expect(!/new\.published_at\s*:=/i.test(migration), "draft does not reassign published-at");
expect(/order by e\.position, e\.id/i.test(migration), "qualification candidates retain domain ordering inputs");

function modeledCardReady({ slug, qualifications, deadlines }) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    && !/^\d+$/.test(slug)
    && qualifications.some((value) => typeof value === "string" && value.trim())
    && deadlines.length > 0
    && deadlines.every((value) => typeof value === "string")
    && new Set(deadlines).size === 1;
}

expect(!modeledCardReady({ slug: "valid-slug", qualifications: ["Graduate"], deadlines: [] }), "missing deadline is rejected");
expect(!modeledCardReady({ slug: "valid-slug", qualifications: ["Graduate"], deadlines: ["2026-12-31", "2027-01-01"] }), "conflicting deadlines are rejected");
expect(modeledCardReady({ slug: "valid-slug", qualifications: ["Graduate"], deadlines: ["2026-12-31", "2026-12-31"] }), "identical deadlines are accepted");
expect(!modeledCardReady({ slug: "valid-slug", qualifications: ["  "], deadlines: ["2026-12-31"] }), "missing qualification is rejected");
expect(!modeledCardReady({ slug: "123", qualifications: ["Graduate"], deadlines: ["2026-12-31"] }), "numeric-only slug is rejected");

console.log("Public recruitment card-boundary static checks passed; zero network requests and zero SQL execution.");
