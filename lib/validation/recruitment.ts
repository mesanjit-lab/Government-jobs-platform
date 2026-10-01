import { importantDateKinds, recruitmentLifecycleStatuses } from '../domain/recruitment'
import type { RecruitmentContent, RecruitmentId } from '../domain/recruitment'

// Full content snapshot, not a PATCH or a persisted Recruitment. Workflow/audit
// fields cannot be supplied here. New records may omit id; edits must include it.
export interface RecruitmentAdminInput extends RecruitmentContent { readonly id?: RecruitmentId }
export interface ValidationIssue { readonly path: string; readonly message: string }
export type RecruitmentValidationResult =
  | { readonly success: true; readonly data: RecruitmentAdminInput }
  | { readonly success: false; readonly issues: readonly ValidationIssue[] }

// Structural validation only. No I/O, authorization, factual verification or save.
export function validateRecruitmentInput(input: unknown, mode: 'create' | 'update' = 'create'): RecruitmentValidationResult {
  const issues: ValidationIssue[] = []
  const fail = (path: string, message: string) => { issues.push({ path, message }) }
  type Fields = Record<string, unknown>

  function record(value: unknown, path: string, keys: readonly string[]): Fields {
    if (typeof value !== 'object' || value === null || Array.isArray(value) ||
        (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)) {
      fail(path, 'Expected an object.')
      return {}
    }
    const fields = value as Fields
    for (const key of Object.keys(fields)) {
      if (!keys.includes(key)) fail(`${path}.${key}`, 'Unknown or non-editable field.')
    }
    return fields
  }

  function text(value: unknown, path: string, required = false): string | undefined {
    if (value === undefined && !required) return undefined
    if (typeof value !== 'string' || !value.trim()) {
      fail(path, 'Expected a non-empty string.')
      return undefined
    }
    return value.trim()
  }

  function id(value: unknown, path: string, required = false): string | undefined {
    const result = text(value, path, required)
    if (result !== undefined && !/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(result)) {
      fail(path, 'Expected an opaque ID using letters, digits, underscores or hyphens (max 128 characters).')
    }
    return result
  }

  function number(value: unknown, path: string, integer = true, required = false): number | undefined {
    if (value === undefined && !required) return undefined
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 ||
        (integer && !Number.isSafeInteger(value))) {
      fail(path, integer ? 'Expected a non-negative safe integer.' : 'Expected a finite non-negative number.')
      return undefined
    }
    return value
  }

  function choice<T extends string>(value: unknown, path: string, allowed: readonly T[], required = false): T | undefined {
    if (value === undefined && !required) return undefined
    const result = allowed.find((candidate) => candidate === value)
    if (result === undefined) fail(path, `Expected one of: ${allowed.join(', ')}.`)
    return result
  }

  function date(value: unknown, path: string): string | undefined {
    const result = text(value, path)
    if (result === undefined) return undefined
    const [year, month, day] = result.split('-').map(Number)
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) {
      fail(path, 'Expected a real calendar date in YYYY-MM-DD format.')
    }
    return result
  }

  function url(value: unknown, path: string, required = false): string | undefined {
    const result = text(value, path, required)
    if (result === undefined) return undefined
    try {
      const parsed = new URL(result)
      if (!/^https?:\/\/[^\s\\]+$/i.test(result) || !parsed.hostname || parsed.username || parsed.password) throw new Error('Invalid URL')
    } catch {
      fail(path, 'Expected an absolute HTTP(S) URL without credentials or whitespace.')
    }
    return result
  }

  function list<T>(value: unknown, path: string, parse: (item: unknown, path: string) => T): T[] | undefined {
    if (value === undefined) return undefined
    if (!Array.isArray(value)) { fail(path, 'Expected an array.'); return undefined }
    return Array.from(value, (item, index) => parse(item, `${path}[${index}]`))
  }

  function rows<T extends { readonly id: string }>(value: unknown, path: string, parse: (item: unknown, path: string) => T): T[] | undefined {
    const result = list(value, path, parse)
    const seen = new Set<string>()
    result?.forEach((item, index) => {
      if (seen.has(item.id)) fail(`${path}[${index}].id`, 'Duplicate ID in collection.')
      seen.add(item.id)
    })
    return result
  }

  const root = record(input, '$', ['id', 'organizationId', 'title', 'slug', 'advertisementNumber', 'description',
    'lifecycleStatus', 'category', 'state', 'totalVacancies', 'posts', 'eligibilityRules', 'importantDates',
    'fees', 'officialLinks', 'documents', 'selectionStages', 'salary', 'examPatterns', 'howToApply', 'faqs', 'sources'])

  const data: RecruitmentAdminInput = {
    id: id(root.id, '$.id', mode === 'update'),
    organizationId: id(root.organizationId, '$.organizationId', true) ?? '',
    title: text(root.title, '$.title', true) ?? '',
    slug: text(root.slug, '$.slug'),
    advertisementNumber: text(root.advertisementNumber, '$.advertisementNumber'),
    description: text(root.description, '$.description'),
    lifecycleStatus: choice(root.lifecycleStatus, '$.lifecycleStatus', recruitmentLifecycleStatuses),
    category: text(root.category, '$.category'),
    state: text(root.state, '$.state'),
    totalVacancies: number(root.totalVacancies, '$.totalVacancies'),
    posts: rows(root.posts, '$.posts', (value, path) => {
      const row = record(value, path, ['id', 'title', 'count', 'categoryCounts'])
      const categories = new Set<string>()
      return {
        id: id(row.id, `${path}.id`, true) ?? '',
        title: text(row.title, `${path}.title`, true) ?? '',
        count: number(row.count, `${path}.count`),
        categoryCounts: list(row.categoryCounts, `${path}.categoryCounts`, (value, path) => {
          const categoryRow = record(value, path, ['category', 'count'])
          const category = text(categoryRow.category, `${path}.category`, true) ?? ''
          if (categories.has(category.toLowerCase())) fail(`${path}.category`, 'Duplicate category within post.')
          categories.add(category.toLowerCase())
          return { category, count: number(categoryRow.count, `${path}.count`, true, true) ?? 0 }
        }),
      }
    }),
    eligibilityRules: rows(root.eligibilityRules, '$.eligibilityRules', (value, path) => {
      const row = record(value, path, ['id', 'postId', 'qualification', 'minimumAge', 'maximumAge', 'ageCutoffDate', 'notes'])
      const rule = {
        id: id(row.id, `${path}.id`, true) ?? '',
        postId: id(row.postId, `${path}.postId`),
        qualification: text(row.qualification, `${path}.qualification`),
        minimumAge: number(row.minimumAge, `${path}.minimumAge`),
        maximumAge: number(row.maximumAge, `${path}.maximumAge`),
        ageCutoffDate: date(row.ageCutoffDate, `${path}.ageCutoffDate`),
        notes: text(row.notes, `${path}.notes`),
      }
      if (rule.minimumAge !== undefined && rule.maximumAge !== undefined && rule.minimumAge > rule.maximumAge) {
        fail(path, 'Minimum age cannot exceed maximum age.')
      }
      if (rule.qualification === undefined && rule.minimumAge === undefined && rule.maximumAge === undefined && rule.notes === undefined) {
        fail(path, 'An eligibility rule needs a qualification, age bound or explanatory notes.')
      }
      return rule
    }),
    importantDates: rows(root.importantDates, '$.importantDates', (value, path) => {
      const row = record(value, path, ['id', 'kind', 'label', 'date', 'notes'])
      const result = {
        id: id(row.id, `${path}.id`, true) ?? '',
        kind: choice(row.kind, `${path}.kind`, importantDateKinds, true) ?? 'other',
        label: text(row.label, `${path}.label`, true) ?? '',
        date: date(row.date, `${path}.date`),
        notes: text(row.notes, `${path}.notes`),
      }
      if (!result.date && !result.notes) fail(path, 'Supply a date or notes explaining its uncertainty.')
      return result
    }),
    fees: rows(root.fees, '$.fees', (value, path) => {
      const row = record(value, path, ['id', 'category', 'amount', 'currency', 'notes'])
      const amount = text(row.amount, `${path}.amount`)
      const currency = text(row.currency, `${path}.currency`)
      if (amount !== undefined && !/^(0|[1-9]\d{0,11})(\.\d{1,2})?$/.test(amount)) fail(`${path}.amount`, 'Expected a non-negative decimal string (up to 12 integer digits and 2 decimal places).')
      if (currency !== undefined && !/^[A-Z]{3}$/.test(currency)) fail(`${path}.currency`, 'Expected a three-letter uppercase currency code.')
      if ((amount === undefined) !== (currency === undefined)) fail(path, 'Amount and currency must be provided together.')
      const notes = text(row.notes, `${path}.notes`)
      if (amount === undefined && !notes) fail(path, 'Supply an amount or notes explaining an unknown fee.')
      return { id: id(row.id, `${path}.id`, true) ?? '', category: text(row.category, `${path}.category`, true) ?? '', amount, currency, notes }
    }),
    officialLinks: rows(root.officialLinks, '$.officialLinks', (value, path) => {
      const row = record(value, path, ['id', 'label', 'url', 'sourceId'])
      return { id: id(row.id, `${path}.id`, true) ?? '', label: text(row.label, `${path}.label`, true) ?? '', url: url(row.url, `${path}.url`, true) ?? '', sourceId: id(row.sourceId, `${path}.sourceId`) }
    }),
    documents: rows(root.documents, '$.documents', (value, path) => {
      const row = record(value, path, ['id', 'label', 'kind', 'url', 'sourceId'])
      const kind = choice(row.kind, `${path}.kind`, ['official_document', 'required_document'] as const, true) ?? 'required_document'
      return { id: id(row.id, `${path}.id`, true) ?? '', label: text(row.label, `${path}.label`, true) ?? '', kind, url: url(row.url, `${path}.url`, kind === 'official_document'), sourceId: id(row.sourceId, `${path}.sourceId`) }
    }),
    selectionStages: rows(root.selectionStages, '$.selectionStages', (value, path) => {
      const row = record(value, path, ['id', 'name', 'description'])
      return { id: id(row.id, `${path}.id`, true) ?? '', name: text(row.name, `${path}.name`, true) ?? '', description: text(row.description, `${path}.description`) }
    }),
    salary: root.salary === undefined ? undefined : (() => {
      const row = record(root.salary, '$.salary', ['description', 'postId'])
      return { description: text(row.description, '$.salary.description', true) ?? '', postId: id(row.postId, '$.salary.postId') }
    })(),
    examPatterns: rows(root.examPatterns, '$.examPatterns', (value, path) => {
      const row = record(value, path, ['id', 'stageId', 'subject', 'questions', 'marks', 'durationMinutes'])
      return { id: id(row.id, `${path}.id`, true) ?? '', stageId: id(row.stageId, `${path}.stageId`), subject: text(row.subject, `${path}.subject`, true) ?? '', questions: number(row.questions, `${path}.questions`), marks: number(row.marks, `${path}.marks`, false), durationMinutes: number(row.durationMinutes, `${path}.durationMinutes`) }
    }),
    howToApply: list(root.howToApply, '$.howToApply', (value, path) => text(value, path, true) ?? ''),
    faqs: rows(root.faqs, '$.faqs', (value, path) => {
      const row = record(value, path, ['id', 'question', 'answer'])
      return { id: id(row.id, `${path}.id`, true) ?? '', question: text(row.question, `${path}.question`, true) ?? '', answer: text(row.answer, `${path}.answer`, true) ?? '' }
    }),
    sources: rows(root.sources, '$.sources', (value, path) => {
      const row = record(value, path, ['id', 'url', 'label', 'origin'])
      return { id: id(row.id, `${path}.id`, true) ?? '', url: url(row.url, `${path}.url`, true) ?? '', label: text(row.label, `${path}.label`, true) ?? '', origin: choice(row.origin, `${path}.origin`, ['manual', 'ai_extracted'] as const, true) ?? 'manual' }
    }),
  }

  if (data.slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) fail('$.slug', 'Expected a lowercase URL slug with hyphen-separated words.')
  // These references must resolve within this complete content snapshot. External
  // organization/recruitment existence and ownership require the future database.
  const postIds = new Set(data.posts?.map((post) => post.id))
  const stageIds = new Set(data.selectionStages?.map((stage) => stage.id))
  const sourceIds = new Set(data.sources?.map((source) => source.id))
  const reference = (value: string | undefined, ids: ReadonlySet<string>, path: string) => {
    if (value !== undefined && !ids.has(value)) fail(path, 'Referenced ID is missing from this recruitment input.')
  }
  data.eligibilityRules?.forEach((rule, index) => reference(rule.postId, postIds, `$.eligibilityRules[${index}].postId`))
  reference(data.salary?.postId, postIds, '$.salary.postId')
  data.examPatterns?.forEach((pattern, index) => reference(pattern.stageId, stageIds, `$.examPatterns[${index}].stageId`))
  data.officialLinks?.forEach((link, index) => reference(link.sourceId, sourceIds, `$.officialLinks[${index}].sourceId`))
  data.documents?.forEach((document, index) => reference(document.sourceId, sourceIds, `$.documents[${index}].sourceId`))

  return issues.length ? { success: false, issues } : { success: true, data }
}
