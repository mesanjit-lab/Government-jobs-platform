import type { PublicRecruitmentSummary } from "../domain/recruitment";
import {
  buildPublicRecruitmentDetailHref,
  evaluateCompleteCard,
  resolveApplicationDeadline,
  summarizeQualifications,
  type IncompleteCardReason,
  type PublicRecruitmentCard,
  type PublicRecruitmentOrganization,
} from "../domain/public-recruitment-card";
import { MAX_PUBLIC_RECRUITMENT_LIMIT } from "./public-recruitments";

// These exact projections are subsets of the foundation migration's explicit
// public SELECT grants. Do not add workflow, review, provenance, or actor data.
export const PUBLIC_ORGANIZATION_CARD_PROJECTION = ["id", "name", "short_name"].join(",");
export const PUBLIC_QUALIFICATION_CARD_PROJECTION = ["id", "recruitment_id", "qualification", "position"].join(",");
export const PUBLIC_APPLICATION_END_CARD_PROJECTION = ["id", "recruitment_id", "kind", "date", "position"].join(",");

export const MAX_PUBLIC_CARD_RECRUITMENTS = MAX_PUBLIC_RECRUITMENT_LIMIT;
export const MAX_PUBLIC_CARD_ORGANIZATION_ROWS = MAX_PUBLIC_CARD_RECRUITMENTS + 1;
export const MAX_PUBLIC_CARD_CHILD_ROWS = 500;
export const PUBLIC_CARD_CHILD_QUERY_LIMIT = MAX_PUBLIC_CARD_CHILD_ROWS + 1;

type PublicCardTable = "organizations" | "recruitment_eligibility_rules" | "recruitment_dates";

export interface PublicRecruitmentCardQueryResponse {
  readonly data: unknown;
  readonly error: unknown | null;
}

export interface PublicRecruitmentCardQuery {
  select(projection: string): PublicRecruitmentCardQuery;
  in(column: string, values: readonly string[]): PublicRecruitmentCardQuery;
  limit(limit: number): PromiseLike<PublicRecruitmentCardQueryResponse>;
}

export interface PublicRecruitmentCardClient {
  from(table: PublicCardTable): PublicRecruitmentCardQuery;
}

export type PublicRecruitmentCardFailureReason = "invalid_request" | "database" | "malformed_data" | "bounded_data";

export type PublicRecruitmentCardOutcome =
  | { readonly kind: "complete"; readonly card: PublicRecruitmentCard }
  | { readonly kind: "incomplete"; readonly recruitment: PublicRecruitmentSummary; readonly reasons: readonly IncompleteCardReason[] };

export type PublicRecruitmentCardBatchResult =
  | { readonly kind: "success"; readonly data: readonly PublicRecruitmentCardOutcome[] }
  | { readonly kind: "failure"; readonly reason: PublicRecruitmentCardFailureReason };

export interface PublicRecruitmentCardOptions {
  // Detail routes are not yet backed by this database. Callers must opt in only
  // after a separately approved, supported detail-route integration exists.
  readonly routeReady: boolean;
}

interface QualificationRow {
  readonly id: string;
  readonly recruitmentId: string;
  readonly qualification?: string;
  readonly position: number;
}

interface ApplicationEndRow {
  readonly id: string;
  readonly recruitmentId: string;
  readonly kind: string;
  readonly date?: string;
  readonly position: number;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function optionalTrimmedText(value: unknown): string | undefined | null {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

export function mapPublicOrganizationRow(row: unknown): PublicRecruitmentOrganization | undefined {
  if (!isRecord(row) || typeof row.id !== "string" || !uuidPattern.test(row.id)) return undefined;
  const name = optionalTrimmedText(row.name);
  const shortName = optionalTrimmedText(row.short_name);
  if (!name || shortName === null) return undefined;
  return { id: row.id, name, ...(shortName ? { shortName } : {}) };
}

function mapQualificationRow(row: unknown, recruitmentIds: ReadonlySet<string>): QualificationRow | undefined {
  if (!isRecord(row) || typeof row.id !== "string" || !uuidPattern.test(row.id) ||
      typeof row.recruitment_id !== "string" || !recruitmentIds.has(row.recruitment_id) ||
      !isNonNegativeSafeInteger(row.position)) return undefined;
  const qualification = optionalTrimmedText(row.qualification);
  if (qualification === null) return undefined;
  return { id: row.id, recruitmentId: row.recruitment_id, ...(qualification ? { qualification } : {}), position: row.position };
}

function mapApplicationEndRow(row: unknown, recruitmentIds: ReadonlySet<string>): ApplicationEndRow | undefined {
  if (!isRecord(row) || typeof row.id !== "string" || !uuidPattern.test(row.id) ||
      typeof row.recruitment_id !== "string" || !recruitmentIds.has(row.recruitment_id) ||
      typeof row.kind !== "string" || !row.kind || !isNonNegativeSafeInteger(row.position)) return undefined;
  const date = optionalTrimmedText(row.date);
  if (date === null) return undefined;
  return { id: row.id, recruitmentId: row.recruitment_id, kind: row.kind, ...(date ? { date } : {}), position: row.position };
}

function validRecruitments(recruitments: readonly PublicRecruitmentSummary[]): boolean {
  if (recruitments.length > MAX_PUBLIC_CARD_RECRUITMENTS) return false;
  const ids = new Set<string>();
  for (const recruitment of recruitments) {
    if (!uuidPattern.test(recruitment.id) || !uuidPattern.test(recruitment.organizationId) || ids.has(recruitment.id)) return false;
    ids.add(recruitment.id);
  }
  return true;
}

async function readRows(queryFactory: () => PromiseLike<PublicRecruitmentCardQueryResponse>): Promise<readonly unknown[] | PublicRecruitmentCardFailureReason> {
  try {
    const response = await queryFactory();
    if (response.error) return "database";
    return Array.isArray(response.data) ? response.data : "malformed_data";
  } catch {
    return "database";
  }
}

function isFailureReason(value: readonly unknown[] | PublicRecruitmentCardFailureReason): value is PublicRecruitmentCardFailureReason {
  return typeof value === "string";
}

function groupByRecruitment<T extends { readonly recruitmentId: string }>(rows: readonly T[]): ReadonlyMap<string, readonly T[]> {
  const grouped = new Map<string, T[]>();
  for (const row of rows) grouped.set(row.recruitmentId, [...(grouped.get(row.recruitmentId) ?? []), row]);
  return grouped;
}

function incomplete(recruitment: PublicRecruitmentSummary, reasons: readonly IncompleteCardReason[]): PublicRecruitmentCardOutcome {
  return { kind: "incomplete", recruitment, reasons };
}

export async function composePublicRecruitmentCards(
  client: PublicRecruitmentCardClient,
  recruitments: readonly PublicRecruitmentSummary[],
  options: PublicRecruitmentCardOptions,
): Promise<PublicRecruitmentCardBatchResult> {
  if (!validRecruitments(recruitments) || typeof options.routeReady !== "boolean") return { kind: "failure", reason: "invalid_request" };
  if (!recruitments.length) return { kind: "success", data: [] };

  const recruitmentIds = recruitments.map((recruitment) => recruitment.id);
  const organizationIds = [...new Set(recruitments.map((recruitment) => recruitment.organizationId))];
  const [organizationResult, qualificationResult, deadlineResult] = await Promise.all([
    readRows(() => client.from("organizations").select(PUBLIC_ORGANIZATION_CARD_PROJECTION).in("id", organizationIds).limit(MAX_PUBLIC_CARD_ORGANIZATION_ROWS)),
    readRows(() => client.from("recruitment_eligibility_rules").select(PUBLIC_QUALIFICATION_CARD_PROJECTION).in("recruitment_id", recruitmentIds).limit(PUBLIC_CARD_CHILD_QUERY_LIMIT)),
    readRows(() => client.from("recruitment_dates").select(PUBLIC_APPLICATION_END_CARD_PROJECTION).in("recruitment_id", recruitmentIds).limit(PUBLIC_CARD_CHILD_QUERY_LIMIT)),
  ]);
  if (isFailureReason(organizationResult)) return { kind: "failure", reason: organizationResult };
  if (isFailureReason(qualificationResult)) return { kind: "failure", reason: qualificationResult };
  if (isFailureReason(deadlineResult)) return { kind: "failure", reason: deadlineResult };
  if (organizationResult.length > MAX_PUBLIC_CARD_RECRUITMENTS || qualificationResult.length > MAX_PUBLIC_CARD_CHILD_ROWS || deadlineResult.length > MAX_PUBLIC_CARD_CHILD_ROWS) return { kind: "failure", reason: "bounded_data" };

  const organizations = new Map<string, PublicRecruitmentOrganization>();
  for (const row of organizationResult) {
    const organization = mapPublicOrganizationRow(row);
    if (!organization || !organizationIds.includes(organization.id) || organizations.has(organization.id)) return { kind: "failure", reason: "malformed_data" };
    organizations.set(organization.id, organization);
  }
  const idSet = new Set(recruitmentIds);
  const qualifications: QualificationRow[] = [];
  for (const row of qualificationResult) {
    const qualification = mapQualificationRow(row, idSet);
    if (!qualification) return { kind: "failure", reason: "malformed_data" };
    qualifications.push(qualification);
  }
  const deadlines: ApplicationEndRow[] = [];
  for (const row of deadlineResult) {
    const deadline = mapApplicationEndRow(row, idSet);
    if (!deadline) return { kind: "failure", reason: "malformed_data" };
    deadlines.push(deadline);
  }
  const qualificationsByRecruitment = groupByRecruitment(qualifications);
  const deadlinesByRecruitment = groupByRecruitment(deadlines);
  const data = recruitments.map((recruitment): PublicRecruitmentCardOutcome => {
    const organization = organizations.get(recruitment.organizationId);
    const qualification = summarizeQualifications(qualificationsByRecruitment.get(recruitment.id) ?? []);
    const deadline = resolveApplicationDeadline(deadlinesByRecruitment.get(recruitment.id) ?? []);
    const eligibility = evaluateCompleteCard({
      id: recruitment.id,
      slug: recruitment.slug,
      title: recruitment.title,
      organization,
      listedAt: recruitment.listedAt,
      qualification,
      deadline,
      routeReady: options.routeReady,
    });
    if (eligibility.kind === "incomplete") return incomplete(recruitment, eligibility.reasons);
    const detailHref = buildPublicRecruitmentDetailHref(recruitment.slug);
    if (!organization || qualification.kind === "missing" || deadline.kind !== "ok" || !detailHref) return incomplete(recruitment, ["invalid_slug"]);
    return {
      kind: "complete",
      card: {
        id: recruitment.id,
        slug: recruitment.slug,
        title: recruitment.title,
        organization,
        ...(recruitment.state ? { state: recruitment.state } : {}),
        ...(recruitment.category ? { category: recruitment.category } : {}),
        ...(typeof recruitment.totalVacancies === "number" ? { totalVacancies: recruitment.totalVacancies } : {}),
        qualificationSummary: qualification,
        applicationDeadline: deadline.value,
        listedAt: recruitment.listedAt,
        detailHref,
      },
    };
  });
  return { kind: "success", data };
}
