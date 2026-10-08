import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import * as cardDomain from "../lib/domain/public-recruitment-card.ts";

function compile(source, imports) {
  const module = { exports: {} };
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", "module", output)((id) => {
    if (id in imports) return imports[id];
    throw new Error(`Unexpected runtime import: ${id}`);
  }, module.exports, module);
  return module.exports;
}

const repository = compile(readFileSync(new URL("../lib/repositories/public-recruitment-cards.ts", import.meta.url), "utf8"), {
  "../domain/public-recruitment-card": cardDomain,
  "./public-recruitments": { MAX_PUBLIC_RECRUITMENT_LIMIT: 50 },
});
const {
  MAX_PUBLIC_CARD_CHILD_ROWS,
  MAX_PUBLIC_CARD_ORGANIZATION_ROWS,
  PUBLIC_APPLICATION_END_CARD_PROJECTION,
  PUBLIC_ORGANIZATION_CARD_PROJECTION,
  PUBLIC_QUALIFICATION_CARD_PROJECTION,
  composePublicRecruitmentCards,
  mapPublicOrganizationRow,
} = repository;

const organizationId = "123e4567-e89b-42d3-a456-426614174001";
const otherOrganizationId = "123e4567-e89b-42d3-a456-426614174002";
const recruitmentId = "123e4567-e89b-42d3-a456-426614174003";
const otherRecruitmentId = "123e4567-e89b-42d3-a456-426614174004";
const qualificationId = "123e4567-e89b-42d3-a456-426614174005";
const deadlineId = "123e4567-e89b-42d3-a456-426614174006";

const recruitment = {
  id: recruitmentId,
  organizationId,
  title: "Public Recruitment",
  slug: "public-recruitment",
  listedAt: "2026-10-06T00:00:00Z",
  state: "India",
  category: "Central",
  totalVacancies: 5,
};

function response(data, error = null) {
  return { data, error };
}

function createClient(responses) {
  const calls = [];
  return {
    calls,
    from(table) {
      const call = { table, projection: undefined, inColumn: undefined, values: undefined, limit: undefined };
      calls.push(call);
      const query = {
        select(projection) { call.projection = projection; return query; },
        in(column, values) { call.inColumn = column; call.values = values; return query; },
        limit(limit) { call.limit = limit; return Promise.resolve(responses[table]); },
      };
      return query;
    },
  };
}

function rows({ organizations = [{ id: organizationId, name: " Public Service Commission ", short_name: " PSC " }], qualifications = [{ id: qualificationId, recruitment_id: recruitmentId, qualification: " Graduate ", position: 1 }], deadlines = [{ id: deadlineId, recruitment_id: recruitmentId, kind: "application_end", date: "2026-12-31", position: 0 }] } = {}) {
  return {
    organizations: response(organizations),
    recruitment_eligibility_rules: response(qualifications),
    recruitment_dates: response(deadlines),
  };
}

const mappedOrganization = mapPublicOrganizationRow({ id: organizationId, name: " Public Service Commission ", short_name: " PSC " });
assert.deepEqual(mappedOrganization, { id: organizationId, name: "Public Service Commission", shortName: "PSC" });
assert.equal(mapPublicOrganizationRow({ id: organizationId, name: " ", short_name: null }), undefined);
assert.equal(mapPublicOrganizationRow({ id: "not-a-uuid", name: "Organization" }), undefined);

const client = createClient(rows());
const complete = await composePublicRecruitmentCards(client, [recruitment], { routeReady: true });
assert.equal(complete.kind, "success");
assert.equal(complete.data[0].kind, "complete");
assert.equal(complete.data[0].card.qualificationSummary.display, "Graduate");
assert.equal(complete.data[0].card.applicationDeadline.date, "2026-12-31");
assert.equal(complete.data[0].card.detailHref, "/jobs/public-recruitment");
assert.equal(client.calls.length, 3);
assert.deepEqual(client.calls.map((call) => call.table).sort(), ["organizations", "recruitment_dates", "recruitment_eligibility_rules"]);
assert.equal(client.calls.find((call) => call.table === "organizations").projection, PUBLIC_ORGANIZATION_CARD_PROJECTION);
assert.equal(client.calls.find((call) => call.table === "recruitment_eligibility_rules").projection, PUBLIC_QUALIFICATION_CARD_PROJECTION);
assert.equal(client.calls.find((call) => call.table === "recruitment_dates").projection, PUBLIC_APPLICATION_END_CARD_PROJECTION);
assert.equal(client.calls.find((call) => call.table === "organizations").inColumn, "id");
assert.equal(client.calls.find((call) => call.table === "recruitment_eligibility_rules").inColumn, "recruitment_id");
assert.equal(client.calls.find((call) => call.table === "recruitment_dates").inColumn, "recruitment_id");
assert.equal(client.calls.find((call) => call.table === "organizations").limit, MAX_PUBLIC_CARD_ORGANIZATION_ROWS);
assert.equal(client.calls.find((call) => call.table === "recruitment_eligibility_rules").limit, MAX_PUBLIC_CARD_CHILD_ROWS + 1);
assert.equal(client.calls.find((call) => call.table === "recruitment_dates").limit, MAX_PUBLIC_CARD_CHILD_ROWS + 1);
assert.deepEqual(PUBLIC_ORGANIZATION_CARD_PROJECTION.split(","), ["id", "name", "short_name"]);
assert.deepEqual(PUBLIC_QUALIFICATION_CARD_PROJECTION.split(","), ["id", "recruitment_id", "qualification", "position"]);
assert.deepEqual(PUBLIC_APPLICATION_END_CARD_PROJECTION.split(","), ["id", "recruitment_id", "kind", "date", "position"]);
for (const projection of [PUBLIC_ORGANIZATION_CARD_PROJECTION, PUBLIC_QUALIFICATION_CARD_PROJECTION, PUBLIC_APPLICATION_END_CARD_PROJECTION]) {
  for (const privateColumn of ["official_url", "notes", "label", "post_id", "minimum_age", "maximum_age", "age_cutoff_date", "created_at", "updated_at", "verified_by", "publication_state", "source_id", "reviewer_id"]) {
    assert.equal(projection.includes(privateColumn), false);
  }
}

const routeNotReady = await composePublicRecruitmentCards(createClient(rows()), [recruitment], { routeReady: false });
assert.equal(routeNotReady.kind, "success");
assert.deepEqual(routeNotReady.data[0], { kind: "incomplete", recruitment, reasons: ["detail_route_not_ready"] });

const numericSlug = await composePublicRecruitmentCards(createClient(rows()), [{ ...recruitment, slug: "123" }], { routeReady: true });
assert.equal(numericSlug.kind, "success");
assert.equal(numericSlug.data[0].kind, "incomplete");
assert.deepEqual(numericSlug.data[0].reasons, ["invalid_slug"]);

const duplicateQualification = await composePublicRecruitmentCards(createClient(rows({
  qualifications: [
    { id: qualificationId, recruitment_id: recruitmentId, qualification: "Graduate", position: 1 },
    { id: otherRecruitmentId, recruitment_id: recruitmentId, qualification: " graduate ", position: 2 },
  ],
})), [recruitment], { routeReady: true });
assert.equal(duplicateQualification.kind, "success");
assert.equal(duplicateQualification.data[0].kind, "complete");
assert.equal(duplicateQualification.data[0].card.qualificationSummary.kind, "one");

const missingOrganization = await composePublicRecruitmentCards(createClient(rows({ organizations: [] })), [recruitment], { routeReady: true });
assert.equal(missingOrganization.kind, "success");
assert.deepEqual(missingOrganization.data[0], { kind: "incomplete", recruitment, reasons: ["invalid_organization"] });

const missingValues = await composePublicRecruitmentCards(createClient(rows({ qualifications: [], deadlines: [] })), [recruitment], { routeReady: true });
assert.equal(missingValues.kind, "success");
assert.equal(missingValues.data[0].kind, "incomplete");
assert.deepEqual(missingValues.data[0].reasons, ["missing_qualification", "missing_deadline"]);

const duplicateOrganization = await composePublicRecruitmentCards(createClient(rows({
  organizations: [
    { id: organizationId, name: "Public Service Commission", short_name: null },
    { id: organizationId, name: "Different duplicate", short_name: null },
  ],
})), [recruitment], { routeReady: true });
assert.deepEqual(duplicateOrganization, { kind: "failure", reason: "malformed_data" });

const ambiguousDeadline = await composePublicRecruitmentCards(createClient(rows({
  deadlines: [
    { id: deadlineId, recruitment_id: recruitmentId, kind: "application_end", date: "2026-12-31", position: 0 },
    { id: otherRecruitmentId, recruitment_id: recruitmentId, kind: "application_end", date: "2027-01-01", position: 1 },
  ],
})), [recruitment], { routeReady: true });
assert.equal(ambiguousDeadline.kind, "success");
assert.equal(ambiguousDeadline.data[0].kind, "incomplete");
assert.deepEqual(ambiguousDeadline.data[0].reasons, ["ambiguous_deadline"]);

const malformedOrganization = await composePublicRecruitmentCards(createClient(rows({ organizations: [{ id: organizationId, name: 1, short_name: null }] })), [recruitment], { routeReady: true });
assert.deepEqual(malformedOrganization, { kind: "failure", reason: "malformed_data" });

const malformedChild = await composePublicRecruitmentCards(createClient(rows({
  deadlines: [{ id: deadlineId, recruitment_id: otherRecruitmentId, kind: "application_end", date: "2026-12-31", position: 0 }],
})), [recruitment], { routeReady: true });
assert.deepEqual(malformedChild, { kind: "failure", reason: "malformed_data" });

const databaseFailure = await composePublicRecruitmentCards(createClient({
  ...rows(),
  recruitment_dates: response(null, { code: "42501" }),
}), [recruitment], { routeReady: true });
assert.deepEqual(databaseFailure, { kind: "failure", reason: "database" });

const synchronousFromFailure = await composePublicRecruitmentCards({
  from() { throw new Error("synthetic synchronous from failure"); },
}, [recruitment], { routeReady: true });
assert.deepEqual(synchronousFromFailure, { kind: "failure", reason: "database" });

const synchronousSelectFailure = await composePublicRecruitmentCards({
  from() { return { select() { throw new Error("synthetic synchronous select failure"); } }; },
}, [recruitment], { routeReady: true });
assert.deepEqual(synchronousSelectFailure, { kind: "failure", reason: "database" });

const overflowId = (offset) => `123e4567-e89b-42d3-a456-${String(426614175000 + offset).padStart(12, "0")}`;
const overflowingQualifications = Array.from({ length: MAX_PUBLIC_CARD_CHILD_ROWS + 1 }, (_, index) => ({
  id: overflowId(index), recruitment_id: recruitmentId, qualification: "Graduate", position: index,
}));
const qualificationOverflow = await composePublicRecruitmentCards(createClient(rows({ qualifications: overflowingQualifications })), [recruitment], { routeReady: true });
assert.deepEqual(qualificationOverflow, { kind: "failure", reason: "bounded_data" });

const overflowingDeadlines = Array.from({ length: MAX_PUBLIC_CARD_CHILD_ROWS + 1 }, (_, index) => ({
  id: overflowId(index), recruitment_id: recruitmentId, kind: "application_end", date: "2026-12-31", position: index,
}));
const deadlineOverflow = await composePublicRecruitmentCards(createClient(rows({ deadlines: overflowingDeadlines })), [recruitment], { routeReady: true });
assert.deepEqual(deadlineOverflow, { kind: "failure", reason: "bounded_data" });

const emptyClient = createClient(rows());
assert.deepEqual(await composePublicRecruitmentCards(emptyClient, [], { routeReady: true }), { kind: "success", data: [] });
assert.equal(emptyClient.calls.length, 0);

const oversized = Array.from({ length: 51 }, (_, index) => ({ ...recruitment, id: `123e4567-e89b-42d3-a456-${String(426614174100 + index).padStart(12, "0")}` }));
const invalidRequestClient = createClient(rows());
assert.deepEqual(await composePublicRecruitmentCards(invalidRequestClient, oversized, { routeReady: true }), { kind: "failure", reason: "invalid_request" });
assert.equal(invalidRequestClient.calls.length, 0);

const secondRecruitment = { ...recruitment, id: otherRecruitmentId, organizationId: otherOrganizationId, slug: "second-recruitment" };
const batchClient = createClient(rows({
  organizations: [
    { id: organizationId, name: "First", short_name: null },
    { id: otherOrganizationId, name: "Second", short_name: null },
  ],
  qualifications: [
    { id: qualificationId, recruitment_id: recruitmentId, qualification: "Graduate", position: 0 },
    { id: "123e4567-e89b-42d3-a456-426614174007", recruitment_id: otherRecruitmentId, qualification: "Diploma", position: 0 },
  ],
  deadlines: [
    { id: deadlineId, recruitment_id: recruitmentId, kind: "application_end", date: "2026-12-31", position: 0 },
    { id: "123e4567-e89b-42d3-a456-426614174008", recruitment_id: otherRecruitmentId, kind: "application_end", date: "2027-01-01", position: 0 },
  ],
}));
const batch = await composePublicRecruitmentCards(batchClient, [recruitment, secondRecruitment], { routeReady: true });
assert.equal(batch.kind, "success");
assert.equal(batch.data.filter((item) => item.kind === "complete").length, 2);
assert.equal(batchClient.calls.length, 3);
assert.deepEqual(batchClient.calls.find((call) => call.table === "organizations").values.sort(), [organizationId, otherOrganizationId].sort());

console.log("Focused public recruitment card repository checks passed; zero network requests.");
