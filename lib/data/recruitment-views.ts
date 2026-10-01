import type { RecruitmentId } from '../domain/recruitment'

// Compatibility DTOs for the existing mock-backed UI, NOT persisted domain entities.
// Preserve formatted/approximate values and legacy badges without inventing facts.
export type RecruitmentBadge = 'New' | 'Hot' | 'Updated' | 'Active' | 'Application Open'

export interface RecruitmentFixtureDetail {
  shortTitle: string; advertisementNo: string; description: string; publishedAt: string; updatedAt: string
  eligibility: { qualification: string; minimumAge?: number; maximumAge?: number }
  importantDates: { label: string; value: string }[]
  fees: { category: string; amount: string }[]
  officialLinks: { label: string; url: string }[]
  documents: { label: string; url: string }[]
  vacancy: { total: number; categoryWise?: { post: string; ur: number; obc: number; sc: number; st: number; ews: number; total: number }[] }
  selectionStages: { name: string }[]
  examPattern: { subject: string; questions: number; marks: number; duration: string }[]
  howToApply: string[]
  faqs: { question: string; answer: string }[]
  relatedRecruitments: { id: RecruitmentId; title: string; organization: string; vacancies: string; qualification: string; lastDate: string }[]
  salary?: { value: string }
}

export interface RecruitmentListView {
  id: RecruitmentId; slug: string; title: string; organization: { name: string; shortName?: string }
  vacancies: string; qualification: string; lastDate: string; status: RecruitmentBadge
  category: string; state: string; detail?: RecruitmentFixtureDetail
}
