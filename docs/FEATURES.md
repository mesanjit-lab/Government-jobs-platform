# FEATURES.md — Master Feature Status

Last updated: October 2026

Legend:
[x] Complete — implemented and verified
[~] In Progress
[ ] Not Started
[!] Blocked
[R] Needs Review

---

## Pages & Routes

[x] Homepage — desktop layout
[x] Homepage — mobile layout (MobileHome component)
[x] Jobs listing (/jobs)
[x] Job Detail (/jobs/[id])
[x] Results listing (/results)
[x] Admit Cards listing (/admit-card)
[x] Answer Keys listing (/answer-key)
[x] Syllabus listing (/syllabus)
[x] Syllabus Detail (/syllabus/[id])
[x] Exam Calendar (/exam-calendar)
[x] Job Alerts information (/alerts) — informational frontend page only; no subscriptions or notifications
[x] About (/about)
[x] Contact (/contact)
[x] Privacy Policy (/privacy)
[x] Terms (/terms)
[x] Login UI (/login) — UI only, no auth
[x] Register UI (/register) — UI only, no auth

---

## Tools

[x] Tools Index (/tools)
[x] Age Calculator (/tools/age-calculator) — client-side exact age, totals, and optional cut-off age-range helper
[x] Photo & Signature Resize (/tools/photo-resize)
[x] PDF Tools (/tools/pdf) — JPG to PDF, Merge, Compress, Split
[x] Eligibility Checker (/tools/eligibility-checker)
[ ] Exam Calendar Tool (separate from page)

---

## Data & Database

[x] DB-independent recruitment domain contracts and separate legacy public view DTOs
[x] Dependency-free recruitment Admin input structural validation — standalone only; not connected to UI/API/persistence
[x] Recruitment schema reconciliation — design only; lifecycle, publication, verification/provenance and future user entities documented
[x] Shared mock recruitment read boundary — public fixture/selector compatibility retained
[x] Separate NEW MyResult Supabase project setup + safe publishable connectivity verification
[x] Local Supabase packages, lazy public env contract, browser/request-scoped server factories and operator read-check script
[x] Normalized foundation schema deployed once — 17 tables; owner-reported rollback-only SQL-role RLS suite PASS, 270 assertions; fixtures rolled back and foundation tables empty afterward
[x] Anonymous HTTP reader verification harness + offline safety tests — operator-only, no application integration
[x] Controlled anonymous HTTP projection/grant verification — independently project-bound owner-reported PASS 107/107 for the deployed `published_at` grant (14 approved, 51 excluded, 25 private, 17 wildcard; 90 mandatory); zero-row reads only
[x] Narrower authenticated reader verifier + offline tests — JWT acceptance/reader grants only; duplicate/terminal/parser-resource static-review corrections applied
[x] Local operator-only authenticated acquisition runner + offline tests — one normal reviewer sign-in only when separately executed; concealed local password, no persistent session/token storage; static security review pending
[x] Server-first public recruitment read boundary — explicit safe projection, bounded list/lookup mapping and offline tests; pages remain mock-backed
[x] Phase 2B complete-card domain contracts — pure qualification/deadline/eligibility/slug helpers offline-validated; no schema, route, or UI integration
[x] Phase 2C Batch 1 public recruitment card data readiness — bounded explicit organization/qualification/application-end side-loads, validated mapping and complete/incomplete/failure outcomes; Vercel production build/deployment verified at `822c9b59`; no filtering, cursor, page or UI integration
[~] Phase 2C Batch 2A public-card publication/view boundary — offline migration draft and static checker complete; no SQL execution, deployment, UI integration, cursor, or page cutover
[x] Chronological public-listing contract — deployed once to the dedicated MyResult Supabase project; public `listedAt` mapping and newest-first ordering; pages remain mock-backed
[ ] Actual authenticated JWT/HTTP execution — NOT RUN; dedicated account/offline signatures do not verify the deployed boundary
[ ] Positive row visibility / HTTP publication filtering / auth.uid behavior verification — not established by empty reads
[ ] Result/Admit Card/Answer Key lifecycle update application persistence — recruitment_updates schema deployed, writer/read integration and verified real content not implemented
[ ] Syllabus table
[ ] Database-backed Exam Calendar date projection
[ ] Real data in homepage
[ ] Real data in Jobs page
[ ] Real data in Results page
[ ] Real data in Admit Cards page
[ ] Admin CMS

---

## Authentication

[ ] Application Supabase Auth integration — dedicated normal test reviewer account exists only for testing
[ ] Login — functional
[ ] Register — functional
[ ] Forgot Password
[ ] Email verification
[ ] User dashboard
[ ] Saved Jobs
[ ] Tracked Jobs
[ ] Job Alerts preferences

---

## Notifications

[ ] Personalized recruitment notification system — NOT IMPLEMENTED; /alerts only explains the planned feature
[ ] Email notifications
[ ] WhatsApp notifications
[ ] SMS notifications
[ ] Push notifications
[ ] In-app notifications
[ ] Notification architecture

---

## SEO

[~] Basic page titles
[ ] Dynamic metadata per page
[ ] Open Graph tags
[ ] Sitemap
[ ] Robots.txt
[ ] Structured data (JobPosting schema)
[ ] Canonical URLs

---

## Performance

[~] Basic Next.js optimization
[ ] Image optimization
[ ] Pagination on listings
[ ] Efficient DB queries
[ ] Caching strategy

---

## Security

[~] Basic security
[~] Supabase Row Level Security — all 17 foundation tables enabled; controlled SQL-role and anonymous HTTP projection/grant checkpoints complete; JWT, positive HTTP row visibility, staff authorization and comprehensive production security remain unverified
[ ] API route protection
[~] Input validation — recruitment content contract implemented; server enforcement and other workflows not implemented
[ ] Rate limiting

---

## Deployment

[x] Vercel deployment
[x] GitHub repository
[ ] Custom domain
[~] Environment variables configured — ignored local MyResult publishable configuration only; deployment/Vercel configuration not verified
[ ] CI/CD pipeline

SQL-role and anonymous HTTP checkpoints remain owner-reported PASS 270/270 and 108/108. Narrower authenticated verifier and local operator-only acquisition runner are offline-tested, not remotely executed or application auth. Public pages remain mock-backed; known concurrency/review-ordering risks and dev-tooling advisory unchanged. No migration/V2/anonymous rerun occurred. NEXT_TASK.md proposes static security review of the acquisition runner before a separately approved normal sign-in. Database role/auth.uid, ownership/staff authorization, positive visibility and HTTP write/session behavior remain unverified. See SUPABASE.md for evidence/limits.
