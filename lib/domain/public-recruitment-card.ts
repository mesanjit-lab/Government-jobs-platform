export type QualificationSummary =
  | { readonly kind: "one"; readonly values: readonly [string]; readonly display: string }
  | { readonly kind: "two"; readonly values: readonly [string, string]; readonly display: string }
  | { readonly kind: "multiple"; readonly values: readonly string[]; readonly display: "Multiple qualifications" }
  | { readonly kind: "missing"; readonly values: readonly []; readonly display?: undefined };

export interface PublicRecruitmentOrganization { readonly id: string; readonly name: string; readonly shortName?: string }
export interface CanonicalApplicationDeadline { readonly date: string }
export type IncompleteCardReason = "invalid_id" | "invalid_slug" | "missing_title" | "invalid_organization" | "invalid_listed_at" | "missing_qualification" | "missing_deadline" | "ambiguous_deadline" | "malformed_deadline" | "detail_route_not_ready";
export type CompleteCardEligibilityResult = { readonly kind: "complete" } | { readonly kind: "incomplete"; readonly reasons: readonly IncompleteCardReason[] };
export interface PublicRecruitmentCard { readonly id: string; readonly slug: string; readonly title: string; readonly organization: PublicRecruitmentOrganization; readonly state?: string; readonly category?: string; readonly totalVacancies?: number; readonly qualificationSummary: Exclude<QualificationSummary, { readonly kind: "missing" }>; readonly applicationDeadline: CanonicalApplicationDeadline; readonly listedAt: string; readonly detailHref: string }
export interface QualificationCandidate { readonly qualification?: string; readonly position?: number; readonly id?: string }
export interface DeadlineCandidate { readonly kind?: string; readonly date?: string; readonly position?: number; readonly id?: string }
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const iso = /^\d{4}-\d{2}-\d{2}T/;
const date = /^\d{4}-\d{2}-\d{2}$/;
function validCalendarDate(value: string): boolean { if (!date.test(value)) return false; const [year, month, day] = value.split("-").map(Number); const parsed = new Date(Date.UTC(year, month - 1, day)); return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day; }
export function summarizeQualifications(items: readonly QualificationCandidate[]): QualificationSummary {
  const values = [...items].sort((a,b)=>(a.position ?? 0)-(b.position ?? 0) || (a.id ?? "").localeCompare(b.id ?? "")).map(x=>x.qualification?.trim()).filter((x): x is string=>Boolean(x));
  const unique = values.filter((x,i)=>values.findIndex(y=>y.toLocaleLowerCase()===x.toLocaleLowerCase())===i);
  if (!unique.length) return { kind:"missing", values:[] };
  if (unique.length===1) return { kind:"one", values:[unique[0]], display:unique[0] };
  if (unique.length===2) return { kind:"two", values:[unique[0],unique[1]], display:`${unique[0]}, ${unique[1]}` };
  return { kind:"multiple", values:unique, display:"Multiple qualifications" };
}
export function resolveApplicationDeadline(items: readonly DeadlineCandidate[]): { readonly kind:"ok"; readonly value:CanonicalApplicationDeadline } | { readonly kind:"missing"|"ambiguous"|"malformed" } {
  const values=items.filter(x=>x.kind==="application_end").map(x=>x.date);
  if (!values.length) return {kind:"missing"}; if (values.some(x=>!x || !validCalendarDate(x))) return {kind:"malformed"};
  const unique=[...new Set(values as string[])]; return unique.length===1?{kind:"ok",value:{date:unique[0]}}:{kind:"ambiguous"};
}
export function buildPublicRecruitmentDetailHref(value:string): string | undefined { return slug.test(value) && !/^\d+$/.test(value) ? `/jobs/${value}` : undefined }
export function evaluateCompleteCard(input:{id?:string;slug?:string;title?:string;organization?:PublicRecruitmentOrganization;listedAt?:string;qualification:QualificationSummary;deadline:{kind:string};routeReady:boolean}):CompleteCardEligibilityResult { const r:IncompleteCardReason[]=[]; if(!input.id||!uuid.test(input.id))r.push("invalid_id"); if(!input.slug||!slug.test(input.slug)||/^\d+$/.test(input.slug))r.push("invalid_slug"); if(!input.title?.trim())r.push("missing_title"); if(!input.organization||!uuid.test(input.organization.id)||!input.organization.name.trim())r.push("invalid_organization"); if(!input.listedAt||!iso.test(input.listedAt)||Number.isNaN(Date.parse(input.listedAt)))r.push("invalid_listed_at"); if(input.qualification.kind==="missing")r.push("missing_qualification"); if(input.deadline.kind!=="ok")r.push(input.deadline.kind==="ambiguous"?"ambiguous_deadline":input.deadline.kind==="malformed"?"malformed_deadline":"missing_deadline"); if(!input.routeReady)r.push("detail_route_not_ready"); return r.length?{kind:"incomplete",reasons:r}:{kind:"complete"}; }
