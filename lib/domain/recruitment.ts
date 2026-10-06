// Storage/framework-independent contracts. Unknown facts stay absent, never guessed.
export type RecruitmentId = string
export type OrganizationId = string
export type PostId = string
export type SourceId = string
export type ISODate = string // YYYY-MM-DD calendar date, not a timestamp
export type ISODateTime = string // ISO 8601 instant from a trusted timestamp column
export type DecimalAmount = string // Non-negative decimal, at most two fractional digits

export const recruitmentLifecycleStatuses = ['upcoming', 'open', 'closed', 'in_progress', 'completed', 'cancelled'] as const
export type RecruitmentLifecycleStatus = typeof recruitmentLifecycleStatuses[number]
export type PublicationState = 'draft' | 'in_review' | 'published' | 'archived'
export type VerificationState = 'unverified' | 'in_review' | 'verified' | 'rejected'

export interface Organization {
  readonly id: OrganizationId
  readonly name: string
  readonly shortName?: string
  readonly officialUrl?: string
}

export interface Vacancy {
  readonly id: PostId
  readonly title: string
  readonly count?: number
  readonly categoryCounts?: readonly { readonly category: string; readonly count: number }[]
}

export interface EligibilityRule {
  readonly id: string
  readonly postId?: PostId
  readonly qualification?: string
  readonly minimumAge?: number
  readonly maximumAge?: number
  readonly ageCutoffDate?: ISODate
  readonly notes?: string // Includes recruitment-specific exceptions; not an eligibility engine.
}

export const importantDateKinds = ['application_start', 'application_end', 'fee_deadline', 'correction_deadline', 'exam', 'admit_card', 'result', 'other'] as const
export interface ImportantDate {
  readonly id: string
  readonly kind: typeof importantDateKinds[number]
  readonly label: string
  readonly date?: ISODate
  readonly notes?: string // Approximate/TBA dates belong here, not in an invented exact date.
}

export interface ApplicationFee {
  readonly id: string
  readonly category: string
  readonly amount?: DecimalAmount // Omitted = unknown; "0" = explicitly zero.
  readonly currency?: string // Required alongside an amount; three-letter currency code.
  readonly notes?: string
}

export interface OfficialLink {
  readonly id: string
  readonly label: string
  readonly url: string
  readonly sourceId?: SourceId
}

export interface OfficialDocument {
  readonly id: string
  readonly label: string
  readonly kind: 'official_document' | 'required_document'
  readonly url?: string // Required for official documents; optional for applicant checklists.
  readonly sourceId?: SourceId
}

export interface SelectionStage { readonly id: string; readonly name: string; readonly description?: string }
export interface SalaryInformation { readonly description: string; readonly postId?: PostId }
export interface ExamPattern {
  readonly id: string
  readonly stageId?: string
  readonly subject: string
  readonly questions?: number
  readonly marks?: number
  readonly durationMinutes?: number
}
export interface RecruitmentFaq { readonly id: string; readonly question: string; readonly answer: string }

export interface SourceProvenance {
  readonly id: SourceId
  readonly url: string
  readonly label: string
  readonly origin: 'manual' | 'ai_extracted'
  // A claimed official source is not proof of authenticity or human verification.
}

export interface RecruitmentUpdate {
  readonly id: string
  readonly recruitmentId: RecruitmentId
  readonly kind: 'notice' | 'correction' | 'admit_card' | 'answer_key' | 'result'
  readonly title: string
  readonly description?: string
  readonly date?: ISODate
  readonly sourceId?: SourceId
}

// Optional detail content, not a second recruitment identity or a UI page model.
export interface RecruitmentDetail {
  readonly posts?: readonly Vacancy[]
  readonly eligibilityRules?: readonly EligibilityRule[]
  readonly importantDates?: readonly ImportantDate[]
  readonly fees?: readonly ApplicationFee[]
  readonly officialLinks?: readonly OfficialLink[]
  readonly documents?: readonly OfficialDocument[]
  readonly selectionStages?: readonly SelectionStage[]
  readonly salary?: SalaryInformation
  readonly examPatterns?: readonly ExamPattern[]
  readonly howToApply?: readonly string[]
  readonly faqs?: readonly RecruitmentFaq[]
  readonly sources?: readonly SourceProvenance[]
}

// Editable factual content; lifecycle may be unknown even when a draft has a title.
export interface RecruitmentContent extends RecruitmentDetail {
  readonly organizationId: OrganizationId
  readonly title: string
  readonly slug?: string
  readonly advertisementNumber?: string
  readonly description?: string
  readonly lifecycleStatus?: RecruitmentLifecycleStatus
  readonly category?: string
  readonly state?: string
  readonly totalVacancies?: number
}

// Workflow/audit fields are controlled by a future trusted service, NOT content input.
export interface Recruitment extends RecruitmentContent {
  readonly id: RecruitmentId
  readonly publicationState: PublicationState
  readonly verificationState: VerificationState
  readonly createdAt: string
  readonly updatedAt: string
  readonly contentVersion: number
  readonly verifiedVersion?: number
  readonly verifiedAt?: string
  readonly verifiedBy?: string
  readonly publishedAt?: string
  readonly archivedAt?: string
}

// Deliberate public read shape. It excludes all publication, verification,
// provenance, review and actor metadata even when storage contains those fields.
export interface PublicRecruitmentSummary {
  readonly id: RecruitmentId
  readonly organizationId: OrganizationId
  readonly title: string
  readonly slug: string
  // First time MyResult made this verified recruitment public; not an official notice date.
  readonly listedAt: ISODateTime
  readonly advertisementNumber?: string
  readonly description?: string
  readonly category?: string
  readonly state?: string
  readonly totalVacancies?: number
  readonly lifecycleStatus?: RecruitmentLifecycleStatus
  readonly howToApply?: readonly string[]
}
