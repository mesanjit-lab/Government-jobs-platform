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
[ ] Supabase project setup
[x] Local Supabase packages, lazy public env contract, browser/request-scoped server factories and operator read-check script
[~] Normalized organizations/recruitments and owned content tables + RLS/migrations — local SQL/static review complete; database execution NOT VERIFIED
[ ] Result/Admit Card/Answer Key lifecycle update persistence (attached to Recruitment)
[ ] Syllabus table
[ ] Database-backed Exam Calendar date projection
[ ] Real data in homepage
[ ] Real data in Jobs page
[ ] Real data in Results page
[ ] Real data in Admit Cards page
[ ] Admin CMS

---

## Authentication

[ ] Supabase Auth setup
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
[~] Supabase Row Level Security — fail-closed local policies for all 17 Core V1 tables; database execution/security tests pending
[ ] API route protection
[~] Input validation — recruitment content contract implemented; server enforcement and other workflows not implemented
[ ] Rate limiting

---

## Deployment

[x] Vercel deployment
[x] GitHub repository
[ ] Custom domain
[ ] Environment variables configured
[ ] CI/CD pipeline
