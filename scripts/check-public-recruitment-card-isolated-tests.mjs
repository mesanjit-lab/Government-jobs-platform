import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (name) => readFileSync(new URL(`../supabase/tests/${name}`, import.meta.url), "utf8");
const catalog = read("phase_2c_batch_2b_success_catalog.sql");
const failureSetup = read("phase_2c_batch_2b_failure_setup.sql");
const failureAssertions = read("phase_2c_batch_2b_failure_assertions.sql");
const fixtures = read("phase_2c_batch_2b_fixture_rollback.sql");
const postRollback = read("phase_2c_batch_2b_post_rollback_assertions.sql");
const expect = (condition, message) => assert.equal(condition, true, message);
const sentinel = "private.batch_2b_isolated_sentinel";

for (const [name, script] of Object.entries({ catalog, failureSetup, failureAssertions, fixtures, postRollback })) {
  expect(!/service_role/i.test(script), `${name} has no service-role reference`);
  expect(!/insert\s+into\s+auth\.users/i.test(script), `${name} never inserts auth users`);
  expect(!/update\s+auth\.users/i.test(script), `${name} never updates auth users`);
  expect(!/delete\s+from\s+auth\.users/i.test(script), `${name} never deletes auth users`);
  expect(!/from\s+auth\.users/i.test(script), `${name} never reads auth users`);
  expect(!/drop\s+/i.test(script), `${name} has no destructive drop`);
  expect(!/alter\s+(table|policy|role|function)/i.test(script), `${name} has no schema/security alteration`);
  expect(!/(?:^|\n)\s*(?:grant|revoke)\b/i.test(script), `${name} does not change grants`);
  expect(script.includes(sentinel), `${name} has the isolated sentinel guard`);
  expect(script.includes("TEST_B2B_ISOLATED_DATABASE_V1"), `${name} requires the exact sentinel marker`);
}
for (const [name, script] of Object.entries({ failureSetup, fixtures })) {
  const firstPublicMutation = script.search(/\b(?:insert\s+into|update|delete\s+from)\s+public\./i);
  expect(firstPublicMutation >= 0 && script.indexOf(sentinel) < firstPublicMutation, `${name} checks the sentinel before fixture mutation`);
}

expect(/^begin;/im.test(catalog) && /rollback;\s*$/im.test(catalog), "catalog checks are rollback-only");
expect(/server_version_num[\s\S]*150000/i.test(catalog), "catalog checks PostgreSQL 15 compatibility");
expect(/security_invoker=true/i.test(catalog), "catalog checks security invoker");
expect(/public_recruitment_cards/i.test(catalog) && /recruitment_sources/i.test(catalog), "catalog checks view and private grants");
expect(/completeness_definer is distinct from true[\s\S]*completeness_search_path/i.test(catalog), "catalog requires SECURITY DEFINER only for the completeness helper");
expect(/trigger_definer is distinct from false[\s\S]*trigger_search_path/i.test(catalog), "catalog requires the trigger helper to remain non-definer with a fixed search path");
expect(/tgfoid[\s\S]*tgtype[\s\S]*tgenabled/i.test(catalog), "catalog checks exact trigger binding, timing, events, and enabled state");
expect(/relrowsecurity/i.test(catalog), "catalog checks required base-table RLS");
expect(catalog.indexOf("rollback;") < catalog.indexOf("catalog/security-invoker/grant checks passed after rollback"), "catalog PASS is emitted after rollback");

expect(/^begin;/im.test(failureSetup) && /commit;\s*$/im.test(failureSetup), "failure setup is explicitly committed");
expect(/REPLACE_WITH_ISOLATED_REVIEWER_UUID/.test(failureSetup), "failure setup requires an operator-supplied isolated reviewer");
expect(/TEST_B2B_FAILURE_INCOMPLETE_LEGACY/.test(failureSetup), "failure setup identifies the legacy fixture");
expect(/No qualification and no application_end/i.test(failureSetup), "failure setup explains intentional incompleteness");
expect(!/failure_preflight_verified_by_runner|TEST_B2B_RUNNER_VERIFIED_P0001_V1|TEST_B2B_PASS/i.test(failureAssertions), "failure assertions contain no fabricable runner marker or standalone PASS");
expect(/failed migration left Batch 2A objects behind/i.test(failureAssertions), "failure assertion checks transactional migration rollback");

expect(/^begin;/im.test(fixtures) && /rollback;/im.test(fixtures), "ordinary fixtures end with rollback");
expect(/create function pg_temp\.seed_draft/i.test(fixtures), "fixture helpers are temporary/session-scoped");
expect(/MISSING_QUALIFICATION|missing qualification/i.test(fixtures), "fixtures cover missing qualifications");
expect(/expect_card_rejected[\s\S]*Publication requires a complete public recruitment card/i.test(fixtures), "fixture failures require the exact completeness rejection");
expect(/MISSING_DEADLINE|NULL_DEADLINE|CONFLICTING_DEADLINE/i.test(fixtures), "fixtures cover deadline failures");
expect(/DUPLICATE/i.test(fixtures), "fixtures cover identical duplicate deadlines");
expect(/NUMERIC_SLUG|MALFORMED_SLUG/i.test(fixtures), "fixtures cover numeric and malformed slugs");
expect(/CHILD_INVALIDATION|ORGANIZATION_INVALIDATION|republishing preserves original published_at/i.test(fixtures), "fixtures cover invalidation and republishing");
expect(/set local role anon/i.test(fixtures) && /set local role authenticated/i.test(fixtures), "fixtures cover both reader roles");
expect(/recruitment_sources|recruitment_reviews|editor_memberships/i.test(fixtures), "fixtures cover private-table denial");
expect(/verified_by.*verified_at.*verified_version/s.test(fixtures), "fixtures check private-column exclusion");
for (const field of ["organization_name", "application_end_date", "qualification_candidates", "published_at"]) {
  expect(fixtures.includes(field), `fixtures check exact public-card field ${field}`);
}
expect(fixtures.indexOf("rollback;") < fixtures.indexOf("fixture assertions passed and transaction rollback completed"), "fixture PASS is emitted after rollback");
expect(/zero persistent synthetic fixtures/i.test(postRollback), "post-rollback script proves zero persistent fixtures");
for (const table of ["organizations", "recruitments", "recruitment_sources", "recruitment_eligibility_rules", "recruitment_dates", "recruitment_reviews"]) {
  expect(postRollback.includes(`public.${table}`), `post-rollback check covers ${table}`);
}

console.log("Phase 2C Batch 2B isolated-test static checks passed; zero database connections and zero SQL execution.");
