# PHASES.md — Development Roadmap

Last updated: October 2026

---

## Current Phase: Phase 3 — Database & Real Data

---

## Phase 1 — Foundation ✅ COMPLETE

- [x] Next.js project setup
- [x] Tailwind CSS configuration
- [x] TypeScript setup
- [x] GitHub repository
- [x] Vercel deployment

---

## Phase 2 — Frontend UI ✅ COMPLETE

- [x] Homepage — desktop
- [x] Homepage — mobile
- [x] Jobs listing + detail
- [x] Results listing
- [x] Admit Cards listing
- [x] Answer Keys listing
- [x] Syllabus listing + detail
- [x] Exam Calendar
- [x] Job Alerts informational page (/alerts) — frontend only; Phase 5 notification functionality remains unimplemented
- [x] Tools — Age Calculator
- [x] Tools — Photo & Signature Resize
- [x] Tools — PDF Tools
- [x] Tools — Eligibility Checker
- [x] About, Contact, Privacy, Terms
- [x] Login UI, Register UI

---

## Phase 3 — Database & Real Data 🔄 CURRENT

- [x] Separate NEW MyResult Supabase project setup + ignored local publishable configuration + safe connectivity verification
- [x] Recruitment domain/view separation and standalone Admin input structural validation
- [x] Logical recruitment schema design reconciled; foundation migration executed once successfully on the NEW project
- [x] Supabase Foundation Phase 1 local clients/env/read-check mechanism and approved package installation
- [x] Foundation database/RLS runtime checkpoint — 17 tables deployed; owner-reported rollback-only SQL-role suite PASS, 270 assertions, fixtures rolled back and tables empty afterward
- [x] Anonymous HTTP reader harness Phase 1 + offline safety tests — no application auth integration
- [x] Controlled anonymous HTTP projection/grant checkpoint — independently project-bound owner-reported PASS 107/107 for the deployed `published_at` projection; zero-row reads only
- [x] Narrower authenticated JWT acceptance/reader-grant verifier + offline tests — duplicate-JSON, terminal-cleanup and parser-resource corrections applied; no real token or acquisition/network execution
- [x] Local-only operator acquisition runner + offline tests — no real sign-in, token or network; persistence/refresh/URL detection disabled
- [x] Server-first public recruitment read boundary — explicit migration projection, bounded deterministic list/lookup mapping and offline tests; no page cutover
- [x] Phase 2B complete-card contract preparation — pure offline contracts/checker validated; pagination eligibility and cursor design deferred
- [x] Phase 2C Batch 1 public recruitment card data readiness — explicit bounded side-loads for organization, qualification and canonical application-end data; Vercel production build/deployment verified at `822c9b59`; no page integration, complete-card filtering or cursor design
- [~] Phase 2C Batch 2A/2B public-card publication/view boundary — offline migration/static checks and an unexecuted isolated success/failure test harness are prepared; test-project creation, SQL execution, deployment, cursor work and page integration require separate approval
- [x] Chronological public-listing contract — deployed once to `myresult`; assigns immutable first MyResult listing time and enables `published_at DESC, id DESC`; UI cutover pending
- [ ] Integrate one server-rendered recruitment listing using the public repository — requires a separate approved cutover/error-empty-state task
- [ ] Static security review of authenticated acquisition runner — next proposed gate before controlled normal sign-in
- [ ] Actual authenticated JWT reader execution — NOT RUN; independent database role/auth.uid/identity coverage unavailable
- [ ] Positive HTTP row visibility / publication filtering / auth.uid behavior verification — empty reads do not establish this
- [ ] Organizations/recruitments + owned content tables + verified real data
- [ ] Results/Admit Cards/Answer Keys as recruitment lifecycle updates + verified real data
- [ ] Syllabus table + real data
- [ ] Connect frontend to Supabase
- [ ] Admin panel for data entry

---

## Phase 4 — Authentication

- [ ] Application Supabase Auth integration — dedicated normal test account exists, not a working application auth flow
- [ ] Login — functional
- [ ] Register — functional
- [ ] User dashboard
- [ ] Saved Jobs
- [ ] Tracked Jobs

---

## Phase 5 — Notifications

- [ ] Email notifications
- [ ] Push notifications
- [ ] WhatsApp/SMS notifications
- [ ] Notification preferences
- [ ] Job Alert system

---

## Phase 6 — SEO & Performance

- [ ] Dynamic metadata
- [ ] Open Graph
- [ ] Sitemap + Robots.txt
- [ ] Structured data
- [ ] Image optimization
- [ ] Pagination
- [ ] Performance audit

---

## Phase 7 — Security & Production

- [~] Row Level Security — foundation SQL-role and bounded anonymous HTTP projection/grant checkpoints complete; JWT, positive HTTP row visibility, future user/staff policies and broader security coverage pending
- [ ] API protection
- [ ] Input validation
- [ ] Security audit
- [ ] Custom domain
- [ ] Production checklist

Standalone recruitment structural validation exists from Phase 3 preparation; production server enforcement and other input contracts remain pending.

Owner-reported SQL-role PASS 270/270 and anonymous HTTP PASS 108/108 remain bounded checkpoints. Narrower authenticated verifier and local-only acquisition runner are implemented/offline-tested, not remotely executed: no real token or sign-in/out/refresh. A future runner execution may perform one normal sign-in and update Auth audit/session metadata, but it does not establish application sessions. The boundary does not independently prove database role/auth.uid, identity RLS, ownership/staff authorization, positive visibility or HTTP writes. Known concurrency/review-ordering risks remain. No migration/V2/anonymous rerun or old AI Test Platform contact. Phase 3 remains incomplete: public pages mock-backed, verified content/read adapters and Admin/authorization services absent. See SUPABASE.md; NEXT_TASK.md proposes static security review before any separately approved acquisition/execution.

---

## Phase 8 — Advanced Features

- [ ] AI-assisted data extraction
- [ ] Source monitoring
- [ ] Recruitment tracking timeline
- [ ] "I Applied" system
- [ ] Answer Key objection tracker
