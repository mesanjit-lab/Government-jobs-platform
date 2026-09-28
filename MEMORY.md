# MEMORY.md — Current Handoff State

Last updated: September 2026

---

## Last Completed Task

Route Integrity Task 3C: remove unsupported Results and Admit Card record links

## Last Agent

Codex

## Files Changed

- lib/domain/recruitment.ts — React-independent recruitment domain types
- lib/data/recruitments.ts — Typed temporary fixture adapter and read-only selectors
- app/jobs/page.tsx — Uses shared recruitment data
- app/jobs/[id]/page.tsx — Resolves supported detail records through the shared data boundary
- app/components/LatestJobs.tsx — Uses shared latest recruitment data
- docs/DECISIONS.md — Records canonical recruitment lifecycle decision
- MEMORY.md — Updated handoff state

## Checks Performed

- npx tsc --noEmit
- git diff --check
- Verified the shared fixture type has no `any` and supported detail IDs resolve

## Known Issues

- Authentication is not implemented (Login/Register are UI only)
- Database is not connected; recruitment and exam data remains mock/hardcoded
- No real notification system exists
- Several existing UI controls and links remain non-functional, including filters and missing detail/alerts routes
- MobileHome and Eligibility Checker still use legacy local recruitment data and are the next migration candidates
- RRB NTPC legacy eligibility data is temporarily excluded because no canonical recruitment fixture exists
- Remaining route-integrity issues: Results, Admit Cards, Alerts, Syllabus, and placeholder hrefs
- Results and Admit Card detail routes are intentionally deferred pending approved data/product behavior; remaining issues are Alerts, Syllabus, and placeholder hrefs

## Current Work

Recovery task complete; awaiting owner direction. No new task selected.

## Next Recommended Task

Supabase database setup remains the approved pending task in NEXT_TASK.md. Do not begin without owner approval.

---

## Completed Features (verified against repository)

- Homepage (desktop + mobile)
- Jobs listing (/jobs)
- Job Detail (/jobs/[id])
- Results (/results)
- Admit Cards (/admit-card)
- Answer Keys (/answer-key)
- Syllabus listing (/syllabus)
- Syllabus Detail (/syllabus/[id])
- Exam Calendar (/exam-calendar)
- Tools index (/tools)
- Age Calculator (/tools/age-calculator)
- Photo & Signature Resize (/tools/photo-resize)
- PDF Tools (/tools/pdf)
- Eligibility Checker (/tools/eligibility-checker)
- About (/about)
- Contact (/contact)
- Privacy Policy (/privacy)
- Terms (/terms)
- Login UI (/login)
- Register UI (/register)
