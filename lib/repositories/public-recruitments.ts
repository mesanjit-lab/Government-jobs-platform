import type { ISODateTime, PublicRecruitmentSummary, RecruitmentId, RecruitmentLifecycleStatus } from "../domain/recruitment";

// Exact public SELECT grant from the foundation migration. Never add workflow,
// verification, provenance, review, or actor fields here.
export const PUBLIC_RECRUITMENT_PROJECTION = [
  "id", "organization_id", "title", "slug", "advertisement_number", "description",
  "category", "state", "total_vacancies", "lifecycle_status", "how_to_apply", "published_at",
].join(",");

export const DEFAULT_PUBLIC_RECRUITMENT_LIMIT = 20;
export const MAX_PUBLIC_RECRUITMENT_LIMIT = 50;

export type { PublicRecruitmentSummary } from "../domain/recruitment";

export type PublicRecruitmentReadResult<T> =
  | { readonly kind: "success"; readonly data: T }
  | { readonly kind: "not_found" }
  | { readonly kind: "failure"; readonly reason: "invalid_request" | "database" | "malformed_data" };

export interface PublicRecruitmentQueryResponse {
  readonly data: unknown;
  readonly error: unknown | null;
}

export interface PublicRecruitmentQuery {
  select(projection: string): PublicRecruitmentQuery;
  order(column: string, options: { readonly ascending: boolean }): PublicRecruitmentQuery;
  limit(limit: number): PromiseLike<PublicRecruitmentQueryResponse>;
  eq(column: string, value: string): PublicRecruitmentQuery;
  maybeSingle(): PromiseLike<PublicRecruitmentQueryResponse>;
}

export interface PublicRecruitmentClient {
  from(table: "recruitments"): PublicRecruitmentQuery;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;
const lifecycleStatuses = new Set<RecruitmentLifecycleStatus>([
  "upcoming", "open", "closed", "in_progress", "completed", "cancelled",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function optionalText(value: unknown): string | undefined | null {
  return value === null || value === undefined ? undefined : typeof value === "string" ? value : null;
}

function publicListingTimestamp(value: unknown): ISODateTime | undefined {
  return typeof value === "string" && timestampPattern.test(value) && Number.isFinite(Date.parse(value))
    ? value
    : undefined;
}

function mapPublicRecruitment(row: unknown): PublicRecruitmentSummary | undefined {
  if (!isRecord(row) || typeof row.id !== "string" || !uuidPattern.test(row.id) ||
      typeof row.organization_id !== "string" || !uuidPattern.test(row.organization_id) ||
      typeof row.title !== "string" || !row.title.trim() || typeof row.slug !== "string" || !slugPattern.test(row.slug)) return undefined;
  const listedAt = publicListingTimestamp(row.published_at);
  if (!listedAt) return undefined;
  const advertisementNumber = optionalText(row.advertisement_number);
  const description = optionalText(row.description);
  const category = optionalText(row.category);
  const state = optionalText(row.state);
  if (advertisementNumber === null || description === null || category === null || state === null) return undefined;
  const totalVacancies = row.total_vacancies;
  if (totalVacancies !== null && totalVacancies !== undefined &&
      (typeof totalVacancies !== "number" || !Number.isSafeInteger(totalVacancies) || totalVacancies < 0)) return undefined;
  const lifecycleStatus = row.lifecycle_status;
  if (lifecycleStatus !== null && lifecycleStatus !== undefined &&
      (typeof lifecycleStatus !== "string" || !lifecycleStatuses.has(lifecycleStatus as RecruitmentLifecycleStatus))) return undefined;
  const instructions = row.how_to_apply;
  if (instructions !== null && instructions !== undefined &&
      (!Array.isArray(instructions) || instructions.some((item) => typeof item !== "string" || !item.trim()))) return undefined;
  return {
    id: row.id,
    organizationId: row.organization_id,
    title: row.title,
    slug: row.slug,
    listedAt,
    ...(advertisementNumber ? { advertisementNumber } : {}),
    ...(description ? { description } : {}),
    ...(category ? { category } : {}),
    ...(state ? { state } : {}),
    ...(typeof totalVacancies === "number" ? { totalVacancies } : {}),
    ...(typeof lifecycleStatus === "string" ? { lifecycleStatus: lifecycleStatus as RecruitmentLifecycleStatus } : {}),
    ...(Array.isArray(instructions) ? { howToApply: instructions.slice() } : {}),
  };
}

function validLimit(limit: number): boolean {
  return Number.isSafeInteger(limit) && limit >= 1 && limit <= MAX_PUBLIC_RECRUITMENT_LIMIT;
}

function listResult(response: PublicRecruitmentQueryResponse): PublicRecruitmentReadResult<readonly PublicRecruitmentSummary[]> {
  if (response.error) return { kind: "failure", reason: "database" };
  if (!Array.isArray(response.data)) return { kind: "failure", reason: "malformed_data" };
  const mapped = response.data.map(mapPublicRecruitment);
  const valid = mapped.filter((item): item is PublicRecruitmentSummary => item !== undefined);
  return valid.length !== mapped.length
    ? { kind: "failure", reason: "malformed_data" }
    : { kind: "success", data: valid };
}

function singleResult(response: PublicRecruitmentQueryResponse): PublicRecruitmentReadResult<PublicRecruitmentSummary> {
  if (response.error) return { kind: "failure", reason: "database" };
  if (response.data === null) return { kind: "not_found" };
  const mapped = mapPublicRecruitment(response.data);
  return mapped ? { kind: "success", data: mapped } : { kind: "failure", reason: "malformed_data" };
}

export function createPublicRecruitmentRepository(client: PublicRecruitmentClient) {
  // `published_at` is the immutable first MyResult public-listing timestamp.
  const listPublishedRecruitments = async (limit = DEFAULT_PUBLIC_RECRUITMENT_LIMIT) => {
    if (!validLimit(limit)) return { kind: "failure", reason: "invalid_request" } as const;
    try {
      const response = await client.from("recruitments")
        .select(PUBLIC_RECRUITMENT_PROJECTION)
        .order("published_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(limit);
      return listResult(response);
    } catch {
      return { kind: "failure", reason: "database" } as const;
    }
  };

  const getPublishedRecruitmentById = async (id: string) => {
    if (!uuidPattern.test(id)) return { kind: "not_found" } as const;
    try {
      const response = await client.from("recruitments")
        .select(PUBLIC_RECRUITMENT_PROJECTION)
        .eq("id", id)
        .maybeSingle();
      return singleResult(response);
    } catch {
      return { kind: "failure", reason: "database" } as const;
    }
  };

  const getPublishedRecruitmentBySlug = async (slug: string) => {
    if (!slugPattern.test(slug)) return { kind: "not_found" } as const;
    try {
      const response = await client.from("recruitments")
        .select(PUBLIC_RECRUITMENT_PROJECTION)
        .eq("slug", slug)
        .maybeSingle();
      return singleResult(response);
    } catch {
      return { kind: "failure", reason: "database" } as const;
    }
  };

  return { listPublishedRecruitments, getPublishedRecruitmentById, getPublishedRecruitmentBySlug } as const;
}
