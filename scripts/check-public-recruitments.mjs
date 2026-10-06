// Offline-only repository checks. No .env.local, SDK client, or network access.
import assert from "node:assert/strict";
import { createPublicRecruitmentRepository, DEFAULT_PUBLIC_RECRUITMENT_LIMIT, MAX_PUBLIC_RECRUITMENT_LIMIT, PUBLIC_RECRUITMENT_PROJECTION } from "../lib/repositories/public-recruitments.ts";

const id = "11111111-1111-4111-8111-111111111111";
const organizationId = "22222222-2222-4222-8222-222222222222";
const row = Object.freeze({
  id, organization_id: organizationId, title: "Published recruitment", slug: "published-recruitment",
  advertisement_number: "Notice/2026", description: "Public description", category: "Central", state: "All India",
  total_vacancies: 42, lifecycle_status: "open", how_to_apply: ["Read the notice", "Apply online"],
  publication_state: "draft", verification_state: "unverified", verified_by: "private", published_at: "private",
});
let assertions = 0;
let stage = "projection";
const check = (fn) => { assertions++; fn(); };

function mock(response, calls = [], throwOnQuery = false) {
  const query = {
    select: (projection) => { calls.push(["select", projection]); return query; },
    order: (column, options) => { calls.push(["order", column, options]); return query; },
    limit: async (limit) => { calls.push(["limit", limit]); if (throwOnQuery) throw new Error("synthetic"); return response; },
    eq: (column, value) => { calls.push(["eq", column, value]); return query; },
    maybeSingle: async () => { calls.push(["maybeSingle"]); if (throwOnQuery) throw new Error("synthetic"); return response; },
  };
  return { client: { from: (table) => { calls.push(["from", table]); return query; } }, calls };
}

try {
  check(() => assert.ok(!PUBLIC_RECRUITMENT_PROJECTION.includes("*")));
  for (const privateColumn of ["publication_state", "verification_state", "verified_by", "published_at", "created_by", "updated_by"]) {
    check(() => assert.ok(!PUBLIC_RECRUITMENT_PROJECTION.includes(privateColumn)));
  }
  check(() => assert.equal(DEFAULT_PUBLIC_RECRUITMENT_LIMIT, 20));
  check(() => assert.equal(MAX_PUBLIC_RECRUITMENT_LIMIT, 50));

  stage = "published mapping";
  const listed = mock({ data: [row], error: null });
  const repository = createPublicRecruitmentRepository(listed.client);
  const result = await repository.listPublishedRecruitments();
  check(() => assert.equal(result.kind, "success"));
  if (result.kind === "success") {
    check(() => assert.deepEqual(result.data[0], {
      id, organizationId, title: "Published recruitment", slug: "published-recruitment", advertisementNumber: "Notice/2026",
      description: "Public description", category: "Central", state: "All India", totalVacancies: 42,
      lifecycleStatus: "open", howToApply: ["Read the notice", "Apply online"],
    }));
    check(() => assert.equal("publication_state" in result.data[0], false));
    check(() => assert.equal("verified_by" in result.data[0], false));
  }
  check(() => assert.deepEqual(listed.calls, [
    ["from", "recruitments"], ["select", PUBLIC_RECRUITMENT_PROJECTION], ["order", "title", { ascending: true }],
    ["order", "id", { ascending: true }], ["limit", DEFAULT_PUBLIC_RECRUITMENT_LIMIT],
  ]));

  stage = "limits";
  const bounded = mock({ data: [], error: null });
  const boundedRepository = createPublicRecruitmentRepository(bounded.client);
  const boundedResult = await boundedRepository.listPublishedRecruitments(3);
  check(() => assert.deepEqual(boundedResult, { kind: "success", data: [] }));
  check(() => assert.deepEqual(bounded.calls.at(-1), ["limit", 3]));
  check(() => assert.equal(Object.keys(boundedRepository).some((name) => /latest|newest|recent/i.test(name)), false));
  for (const limit of [0, -1, 51, 1.5]) {
    const invalid = mock({ data: [row], error: null });
    const invalidResult = await createPublicRecruitmentRepository(invalid.client).listPublishedRecruitments(limit);
    check(() => assert.deepEqual(invalidResult, { kind: "failure", reason: "invalid_request" }));
    check(() => assert.equal(invalid.calls.length, 0));
  }

  stage = "stable lookup";
  const byId = mock({ data: row, error: null });
  const byIdResult = await createPublicRecruitmentRepository(byId.client).getPublishedRecruitmentById(id);
  check(() => assert.equal(byIdResult.kind, "success"));
  check(() => assert.deepEqual(byId.calls, [["from", "recruitments"], ["select", PUBLIC_RECRUITMENT_PROJECTION], ["eq", "id", id], ["maybeSingle"]]));
  const bySlug = mock({ data: null, error: null });
  const bySlugResult = await createPublicRecruitmentRepository(bySlug.client).getPublishedRecruitmentBySlug("missing-recruitment");
  check(() => assert.deepEqual(bySlugResult, { kind: "not_found" }));
  check(() => assert.deepEqual(bySlug.calls.at(-2), ["eq", "slug", "missing-recruitment"]));
  for (const invalid of ["not-a-uuid", "", "00000000-0000-0000-0000-000000000000"]) {
    const query = mock({ data: row, error: null });
    const invalidResult = await createPublicRecruitmentRepository(query.client).getPublishedRecruitmentById(invalid);
    check(() => assert.deepEqual(invalidResult, { kind: "not_found" }));
    check(() => assert.equal(query.calls.length, 0));
  }

  stage = "fail closed";
  const malformed = mock({ data: [{ ...row, slug: null }], error: null });
  const malformedResult = await createPublicRecruitmentRepository(malformed.client).listPublishedRecruitments(1);
  check(() => assert.deepEqual(malformedResult, { kind: "failure", reason: "malformed_data" }));
  stage = "private-field exclusion";
  const privateOnly = mock({ data: { id, organization_id: organizationId, title: "x", slug: "x", publication_state: "published" }, error: null });
  const privateOnlyResult = await createPublicRecruitmentRepository(privateOnly.client).getPublishedRecruitmentById(id);
  check(() => assert.deepEqual(privateOnlyResult, { kind: "success", data: { id, organizationId, title: "x", slug: "x" } }));
  stage = "database error";
  const databaseError = mock({ data: null, error: { message: "private database detail" } });
  const databaseErrorResult = await createPublicRecruitmentRepository(databaseError.client).getPublishedRecruitmentById(id);
  check(() => assert.deepEqual(databaseErrorResult, { kind: "failure", reason: "database" }));
  stage = "thrown database error";
  const thrown = mock({ data: null, error: null }, [], true);
  const thrownResult = await createPublicRecruitmentRepository(thrown.client).getPublishedRecruitmentById(id);
  check(() => assert.deepEqual(thrownResult, { kind: "failure", reason: "database" }));
} catch {
  process.exitCode = 1;
}

if (process.exitCode) console.log(`Offline public recruitment repository checks FAILED at fixed stage: ${stage}; details withheld.`);
else console.log(`${assertions} offline public recruitment repository checks passed; zero real network requests.`);
