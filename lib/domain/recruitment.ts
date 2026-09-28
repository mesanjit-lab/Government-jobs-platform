export type RecruitmentStatus = 'New' | 'Hot' | 'Updated' | 'Active' | 'Application Open'

export interface Organization { name: string; shortName?: string }
export interface CategoryVacancy { post: string; ur: number; obc: number; sc: number; st: number; ews: number; total: number }
export interface Vacancy { total: number; categoryWise?: CategoryVacancy[] }
export interface EligibilityRule { qualification: string; minimumAge?: number; maximumAge?: number }
export interface ImportantDate { label: string; value: string }
export interface ApplicationFee { category: string; amount: string }
export interface OfficialLink { label: string; url: string }
export interface OfficialDocument { label: string; url: string }
export interface SelectionStage { name: string }
export interface SalaryInformation { value: string }
export interface ExamPattern { subject: string; questions: number; marks: number; duration: string }
export interface RecruitmentFaq { question: string; answer: string }
export interface RelatedRecruitment { id: string; title: string; organization: string; vacancies: string; qualification: string; lastDate: string }

export interface RecruitmentDetail {
  shortTitle: string; advertisementNo: string; description: string; publishedAt: string; updatedAt: string
  eligibility: EligibilityRule; importantDates: ImportantDate[]; fees: ApplicationFee[]; officialLinks: OfficialLink[]
  documents: OfficialDocument[]; vacancy: Vacancy; selectionStages: SelectionStage[]; examPattern: ExamPattern[]
  howToApply: string[]; faqs: RecruitmentFaq[]; relatedRecruitments: RelatedRecruitment[]; salary?: SalaryInformation
}

export interface Recruitment {
  id: string; slug: string; title: string; organization: Organization; vacancies: string; qualification: string
  lastDate: string; status: RecruitmentStatus; category: string; state: string; detail?: RecruitmentDetail
}
