# MEMORY.md — Current Handoff State

Last updated: 2026-10-04

---

## Current Batch

Documentation/checkpoint only, following the owner's successful corrected V2 runtime RLS verification on the separate NEW `myresult` Supabase project. Starting source checkpoint: `1e2720f feat: add Supabase foundation and patch Next.js`, master synchronized with recorded origin/master, initially clean. No SQL, remote requests, database/Auth/configuration changes, implementation, dependencies, commit or push in this task.

## Last Agent

Codex

## Files Changed

- MEMORY.md — current evidence, history and next-step/isolation constraints.
- docs/SUPABASE.md — deployed foundation, complete runtime counts/safety flags and explicit limits.
- docs/PHASES.md / docs/FEATURES.md — infrastructure checkpoint complete; application integration/auth/Admin and HTTP/JWT coverage remain incomplete.
- docs/DATABASE.md / docs/ARCHITECTURE.md — remove stale undeployed/unconnected claims without claiming a working public adapter.
- docs/DECISIONS.md — reconcile prior statuses and ADR-013 for separate-project isolation/bounded verification.
- NEXT_TASK.md — replace stale broad setup/cutover outline with one proposed read-only HTTP/JWT verification planning task; awaiting approval, not started.

## Current Verified Foundation Checkpoint

- Evidence basis: owner-supplied Dashboard execution/preflight/runtime results and previously approved safe connectivity checks. Remote checks are NOT rerun by this documentation task.
- NEW separate `myresult` project exists. Ignored local `.env.local` is configured with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Never print/document values, keys, passwords or JWTs; do not modify/commit the environment file.
- Foundation migration executed once successfully; all 17 tables exist and RLS is enabled. Catalog preflight PASS_WITH_FINDINGS: 14/14 SELECT policies, no unexpected/public write policies, privilege/exposure problems or constraint metadata mismatches; 16/16 triggers and 7/7 private functions matched. No BLOCKER/HIGH findings.
- Corrected TEST_MYRESULT_RLS_V2 runtime result PASS: 270 assertions. Categories: preconditions 1; recruitment_visibility 10; child_visibility 44; column_projection 28; private_reads 6; write_grants 34; unauthorized_writes 102; update_visibility 8; version_invalidation 25; workflow_guards 12. Exact counts and coverage are also in docs/SUPABASE.md.
- Fixture mutations rolled back before PASS; all foundation tables were empty afterward. No persistent TEST data/editor membership, DDL, Auth mutation, explicit Auth row query or service-role usage. Dedicated normal test reviewer account, created separately by the owner with approval, remains unchanged and persists outside rollback; this does not implement application authentication.
- Harness recovery history: original Auth-default allowlist was overly strict, so positive reviewer tests use the normal account rather than direct auth.users insertion. The subsequent generic UPDATE probe wrongly assumed recruitment_reviews.created_at existed; correction selects reviewed_at for that table and created_at for the other 16, with unchanged fixture predicates/42501-only denial assertions. No migration/schema repair was needed. The final corrected suite passed; do not rerun it.
- DO NOT rerun the foundation migration. DO NOT contact, inspect, modify or clean the old AI Test Platform Supabase project in normal MyResult work. Accidental MyResult objects there are a separate future cleanup task requiring its own authorization.
- Limits: SQL roles, not HTTP/JWT/auth.uid identity behavior; forbidden publication states tested as rejected writes; write denial covers current absence of editorial grants; one child UPDATE represents child invalidation, not all mutation permutations. Known MEDIUM KNOWN_EDITORIAL_LOCK_ORDER_RISK and KNOWN_REVIEW_ORDERING_RISK remain, as do concurrency/query-plan coverage and the existing dev-tooling advisory.
- Public pages remain mock-backed. No application Auth, Admin, staff writer/verification service, notification backend, generated DB types or public Supabase read adapter is implemented. No production security clearance or factual government-data approval is claimed.

## Previous Checkpoint: Supabase Foundation Phase 1 — 1e2720f

The following is preserved history from the local-only implementation/security batch, subsequently committed and pushed as 1e2720f. Its unconnected/unexecuted statements describe that earlier checkpoint, not the current verified remote state above.

Supabase Foundation Phase 1 continued the interrupted approved install from checkpoint 16600ca (master, synchronized with origin/master). Only package.json/package-lock.json were dirty on recovery; no foundation code existed. Retained those changes, installed no additional package/tool, and made no remote connection, reset/restore/stash, commit or push in that historical batch.

### Phase 1 Files Changed (historical)

- .gitignore / .env.example — explicitly allow the blank public env template; .env.local remains ignored.
- package.json / package-lock.json — approved @supabase/supabase-js 2.117.2 and @supabase/ssr 0.12.7, verify:supabase operator command, and subsequent approved exact Next.js 16.3.4 → 16.3.8 security patch. No unrelated direct version changes.
- lib/supabase/env.ts, client.ts, server.ts — lazy public config, client-only browser factory, server-only request/cookie factory. No service-role client. SSR cookie/header writer is required for future auth writes; no auth Proxy/UI wiring.
- supabase/migrations/20261002000100_recruitment_foundation.sql — 17 Core V1 tables, constraints, current-version review/publication guards, immutable evidence and RLS. Static review only, NOT executed on a database.
- scripts/verify-supabase.mjs — opt-in Node-only HEAD read check, no writes or raw credentials/errors/records printed.
- scripts/check-supabase-foundation.mjs — offline synthetic/mocked checks and HEAD fixture comparisons using existing TypeScript tooling; no test dependency or database call.
- docs/SUPABASE.md — operator gates, migration execution limits, SDK/Node requirements and both pre-existing audit findings.
- docs/DATABASE.md, ARCHITECTURE.md, DECISIONS.md, FEATURES.md, PHASES.md and MEMORY.md — distinguish local implementation from unverified remote/database state.

### Phase 1 verification and security state (historical)

- 177 offline foundation checks passed; 36 deep-equality fixture selector comparisons against HEAD passed. Public app files, fixture/domain/validation files, routes and NEXT_TASK.md remain unchanged. Only recruitment IDs 1–2 still have supported details.
- Initial foundation verification before the Next.js security update: npx tsc --noEmit PASSED (exit 0); git diff --check PASSED. npm run build PASSED outside the restricted sandbox (exit 0, 22/22 static pages). Compile took 5.4 minutes; build TypeScript took 105 seconds. Build required no .env.local, source/config workaround or cache deletion.
- npm run verify:supabase correctly FAILED CLOSED (exit 1) with the two missing env NAMES only; .env.local absent, no network request sent. Mocked HEAD success/403 checks passed offline. This is not a real connection test.
- Static migration review performed: 17 tables, FK order/ownership, enum/check alignment, 14 SELECT-only policies, grants, private fixed-search-path read helpers, version/review triggers, indexes and no seeds/destructive statements. This is NOT a PostgreSQL execution or runtime RLS test.
- DATABASE EXECUTION: NOT VERIFIED. No Supabase CLI/PostgreSQL CLI/Docker available or installed; no remote project connected, linked, migrated or seeded. No real credentials created or exposed. Blank example only; .env.local ignored.
- Public reads require current verified published content and latest human review; independently reviewed updates also require a public parent. Sources, reviews, staff membership and actor columns are private; anon/authenticated have no editorial writes. Human factual checking/role authorization/persistence services are NOT implemented.
- Supabase local foundation implemented; all public pages still mock-backed. Admin, authentication, notifications, generated database types and public read adapter NOT IMPLEMENTED. Auth Proxy deferred.
- Dependency audit: pre-existing direct runtime Next.js 16.3.4 CRITICAL GHSA-vcvr-r3jv-pc5j resolved by the approved exact 16.3.8 update. Post-update npm audit --json reports one HIGH, zero CRITICAL and no Next.js/Supabase findings. Audit exits 1 because of the remaining brace-expansion issue.
- Dependency audit: pre-existing dev-only transitive brace-expansion 1.1.18/5.0.9 HIGH aggregate recursion DoS plus moderate CPU DoS, via ESLint/minimatch; same-major fixed 1.1.21/5.0.12. No Supabase package advisory. No audit fix/unrelated upgrade performed. See docs/SUPABASE.md for paths and advisories.
- Installed SDK needs Node >=22; utility scripts use native TypeScript stripping (>=22.18), tested on Node 24.19.0. Node emits a harmless module-type warning for env.ts. Existing unrs-resolver postinstall was not approved/executed in this task.

### Security remediation continuation — Codex (historical)

- Starting committed HEAD was 16600ca. Verified and preserved all completed uncommitted Phase 1 work before installation; no reset/restore/stash, commit or push in that recovery turn.
- Exact command: npm install next@16.3.8 --save-exact, exit 0. React/React DOM remain 19.2.8; Supabase remains 2.117.2 / SSR 0.12.7. All other direct dependencies and devDependencies unchanged, including eslint-config-next 16.3.4.
- Compared lockfile package hashes with the pre-update snapshot: only Next.js, @next/env and eight SWC platform variants changed to 16.3.8, plus root dependency metadata. No package nodes added/removed in this remediation. npm reports three installed packages changed.
- SHA-256 comparisons confirm the foundation clients/config, both scripts, migration, blank env example and ignore rules were preserved byte for byte. Documentation updated to reflect the resolved Next.js finding.
- Reran the existing offline suite: 177 foundation/static checks and all 36 fixture comparisons against HEAD passed. No real network/database calls were used by those checks.
- Post-update npx tsc --noEmit PASSED (exit 0). npm run build on Next.js 16.3.8 PASSED (exit 0; 22/22 static pages; unchanged routes). Compilation took 9.9 minutes; build TypeScript took 3.5 minutes. Allowed the same build to finish without retries, source/config changes or cache deletion. git diff --check PASSED.
- Public app/routes/data/domain/validation and NEXT_TASK.md remain unchanged. No real credentials, service-role client, public write policy, authentication/Admin/notification implementation or remote connection/migration introduced.

## Previous Checkpoint: Backend Readiness — 16600ca

The following records the completed preparation batch based on 8c2b8db, subsequently committed as 16600ca. Its no-Supabase statements describe that historical checkpoint, not the current Phase 1 work.

### Backend Readiness files (historical)

- lib/domain/recruitment.ts — Readonly, DB/framework/UI-independent identity/content/detail contracts; optional unknown facts; separate lifecycle/publication/verification states and version-bound verification metadata.
- lib/data/recruitment-views.ts (new) — Compatibility DTOs for unchanged legacy display fixtures. Not a second persisted Recruitment entity.
- lib/data/recruitments.ts — Type references now use the explicit view contract; fixture literals and selector runtime logic unchanged.
- lib/validation/recruitment.ts (new) — Dependency-free unknown-input validation for full create/update content snapshots; typed success or path-specific issues; rejects workflow/audit fields.
- docs/DATABASE.md — Replaced flat jobs-table plan with normalized recruitment-owned content, provenance/review safeguards and clearly deferred user/notification entities; design only.
- docs/ARCHITECTURE.md — Domain/view/input boundaries and honest limits of future async adapter replacement.
- docs/DECISIONS.md — ADR-010/011: contract separation, structural vs factual verification, lifecycle vs publishing, mock compatibility and normalized schema direction.
- docs/FEATURES.md and docs/PHASES.md — Mark preparation/design complete, not database/Admin/auth/notifications or server validation enforcement.
- MEMORY.md — Current recovery, verification and readiness handoff.

### Backend Readiness interrupted work retained / completed (historical)

- Read the entire interrupted diff and both untracked files before continuing. Found exactly lib/domain/recruitment.ts, lib/data/recruitments.ts, lib/data/recruitment-views.ts and lib/validation/recruitment.ts; no syntactically unfinished file.
- Retained all four files. Completed the domain's optional RecruitmentDetail grouping and content/verified version metadata; no public consumer rewrite or fixture conversion.
- Completed schema/architecture/decision/feature/phase documentation. No reset/restore/stash, package installation, backend integration, commit or push.

### Backend Readiness checks (historical)

- Focused runtime verification: PowerShell inline script piped to Node, using the already installed TypeScript transpileModule in memory and node:assert/strict. No test framework, dependency or test artifact installed/created.
- 106 validation checks passed: minimal/full create and update inputs; missing fields/IDs; invalid counts/dates/leap days/URLs/fees/currency/statuses; duplicates in every nested ID collection; malformed objects/collections; missing post/stage/source references; inverted ages; document/FAQ/salary requirements; whitespace handling and nonmutation; workflow/audit field rejection. AI-extracted input never acquired verified/published state.
- 36 selector comparisons against HEAD passed using deep equality: listings, eligibility views, seven latest-list limits, and lookup/detail/detail-availability for IDs 1–8 plus unknown ID. Only 1–2 retain supported details. Git supplied the HEAD source through a read-only shell command because Node spawning Git was denied in the sandbox; the successful rerun completed with exit 0.
- npx tsc --noEmit passed (exit 0) after continuation. git diff --check passed.
- npm run build passed outside the restricted sandbox (exit 0; 22/22 static pages generated). Compilation took 5.6 minutes and the build's TypeScript step took 3.1 minutes; no source/configuration workaround, deleted cache, dependency change or interrupted build was needed. Existing routes, including dynamic Jobs/Syllabus detail routes, remain unchanged.
- No app/public route files, package manifests/lockfile, Next/TS configuration or NEXT_TASK.md changed. No new any/suppression/framework/backend imports in the new domain/validation/view contracts.

## Previous Checkpoint: Frontend Navigation Integrity — 8c2b8db

- Completed informational /alerts, corrected tool routes, disabled placeholder navigation and preserved supported-only job/syllabus detail links. No real notifications/authentication were implemented.
- Prior checkpoint verification passed TypeScript, production build (22/22 static pages), whitespace checks and rendered-link audit (21 application routes, 37 renders, 49 unique internal hrefs). These are historical results, not substitutes for this batch's checks.

## Previous Checkpoint: Compile/Build Recovery — Codex

- Preserved the existing one-character MobileHome JSX repair and Task 3D syllabus changes.
- app/jobs/[id]/page.tsx — Repaired pre-existing compile blockers by looking up the logo only after the job guard and narrowing vacancyDetails once before its typed map/reduce operations; no assertions or domain changes.
- No product behavior or recruitment facts intentionally changed; unsupported details still use the existing fallback and related-job links remain gated.
- npx tsc --noEmit passed. Focused render checks passed for job IDs 1–8 and an unknown ID (HEAD comparison with shared Header/Footer stubbed), MobileHome link gating, and all eight syllabus entries with links only for IDs 1–3.
- Initial sandbox builds stalled at "Creating an optimized production build" with no explanatory error. The owner subsequently verified a successful local production build (exit 0, 21/21 static pages), before checkpoint 9daf724 was committed and pushed.
- git diff --check passed for that checkpoint.

## Known Issues

- Authentication is not implemented (Login/Register are UI only)
- Separate database foundation is deployed and controlled SQL-role verified, but the public application is not connected to it; recruitment and exam data remain mock/hardcoded
- No real notification system exists
- Existing search/filter/sort controls, query-parameter job filtering, Save/Track/Applied buttons, and mock login/register/contact workflows remain nonfunctional; not implemented by this preparation batch
- MobileHome and Eligibility Checker use the canonical recruitment boundary; desktop Closing Soon retains local presentation metadata but shares canonical detail-availability gating
- RRB NTPC legacy eligibility data is temporarily excluded because no canonical recruitment fixture exists
- Results, Admit Card, and Answer Key detail routes remain deferred pending approved data/product behavior; no fake routes or government facts were added
- /alerts is informational only. Personalized alerts, subscriptions, preferences, application authentication, application database integration and Admin functionality remain unimplemented
- No verified official MyResult Telegram/WhatsApp URL is available; the contact page's existing Telegram handle is not verified and was not converted into a link
- Existing fixture detail vacancy breakdowns do not reconcile with their headline totals; this mock factual debt was preserved, not silently corrected or treated as real production seed data.
- Legacy detail views still depend on complete fixture shapes, label-based dates and a hardcoded display status. The future adapter must define formatting and missing-detail availability instead of applying these assumptions to incomplete real records.
- Synchronous mock imports in client components need server-loading/prop integration for real data. Stable DTO contracts reduce UI churn but do not implement this bridge.
- Structural validation is not factual verification/authorization. Foundation FKs/RLS/version guards are deployed with bounded runtime coverage, not HTTP/JWT or comprehensive concurrency coverage. Future work still needs staff services, further transaction tests, UUID/legacy URL mapping, numeric-limit alignment, payload limits and verified official content.
- No API routes, application Admin/auth or notification backend added. Sources/reviews have deployed tables; user-side entities remain design/contracts only. Neither the bounded runtime PASS nor green frontend checks are comprehensive production database/security approval.

## Current Work

Document the completed isolated foundation/runtime checkpoint without implementation or remote actions. Source/migration/packages/environment and public mock behavior are untouched. Documentation changes await review; no commit or push performed. TypeScript/build successes from 1e2720f remain historical, not fresh results of this documentation task. Do not repeat migration/V2, modify the reviewer, or touch the old project.

### Documentation checkpoint checks — Codex

- Reviewed the full documentation diff and current foundation files; only the eight listed documentation files changed. Git ignore check confirms .env.local remains ignored; no environment contents were read.
- Existing lightweight offline suite rerun: 177 foundation checks and 36/36 fixture comparisons against HEAD PASSED (exit 0). It uses synthetic configuration/mocked networking, does not load .env.local and performs no database calls or SQL execution. Existing harmless Node module-type warning remains.
- git diff --check PASSED; assertion-category totals and documentation-only scope checked locally. No TypeScript/production build rerun for this docs-only checkpoint; prior successes remain historical. No remote migration, RLS suite or Auth operation rerun.

## Next Recommended Task

Single proposal in NEXT_TASK.md: prepare a read-only HTTP/JWT reader-access verification plan for the NEW project. Await explicit approval; do not acquire tokens, run HTTP requests or implement auth in this checkpoint. This targets the documented coverage gap without a CMS, writer, fixtures or production read cutover. Concurrency risks, generated types/DTO/ID mapping and dev-tooling remediation remain separate later work, not additional approved tasks.

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
- Job Alerts information (/alerts) — informational UI only, not a working notification system
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
