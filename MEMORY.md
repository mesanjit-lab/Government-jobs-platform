# MEMORY.md — Current Handoff State

Last updated: 2026-10-09

---

## Current Batch

Phase 2C Batch 1 is committed and pushed as `9b7af497`; the follow-up safe TypeScript narrowing fix is committed and pushed as `822c9b59`. The owner reports that Vercel production build and deployment for `822c9b59` completed successfully. This supersedes the earlier Batch 1 local-memory build deferral, but does not authorize a UI cutover or prove database-backed card behavior with real rows. Phase 2C Batch 2A now has an offline-only migration draft at `supabase/migrations/20261009000100_public_recruitment_card_boundary.sql` and static checker at `scripts/check-public-recruitment-card-boundary.mjs`; neither has been executed or deployed. The draft serializes on `recruitments`, refuses deployment if any existing published row is incomplete, validates final published rows after the existing workflow trigger, rejects numeric-only slugs/missing qualifications/missing-null-conflicting application-end dates, permits exact duplicate dates, preserves original `published_at`, and creates a narrow explicit-column security-invoker view. Ordered raw qualification candidates intentionally defer locale-aware deduplication/display to the existing Phase 2B TypeScript helper. Cursor work remains separate. No SQL, RLS, database, UI, route, Auth, or network action occurred.

Public Recruitment Data Layer — deployed chronological ordering checkpoint and anonymous `published_at` verifier update. Starting HEAD: `74fbcc2 feat: add chronological public recruitment ordering`; master was synchronized with origin/master and clean. The owner executed `20261006000100_public_recruitment_listing_order.sql` exactly once on the separate `myresult` project after an empty-table preflight. Structural verification passed; the deployed function is SECURITY INVOKER with an empty search path, and the earlier text matcher was a false negative because PostgreSQL normalizes `SET search_path = ''` as `SET search_path TO ''`. Rollback-only behavioral verification passed 36 assertions and all 17 foundation tables were zero afterward. The anonymous reader manifest now treats `published_at` as an approved recruitment projection and cross-checks it with the server repository's `published_at -> listedAt` mapping. The new zero-row HTTP verification has not run yet. UI remains entirely mock-backed; `/jobs` has not been cut over.

Verified anonymous `published_at` checkpoint: owner-reported, independently project-bound zero-row HTTP run passed 107/107 (14 approved, 51 excluded, 25 private, 17 wildcard; 90 mandatory; authenticated NOT RUN; firstNonPass null). It proves the anonymous projection/grant boundary only, not positive row visibility, a non-null returned `published_at` value, HTTP write denial or `auth.uid()` behavior. No fake recruitment was created; UI remains mock-backed and `/jobs` is not cut over.

## Last Agent

Phase 2C Batch 1 public recruitment card data readiness is ready for owner review. `lib/repositories/public-recruitment-cards.ts` retains the existing listing repository and maps exact public `organizations`, `recruitment_eligibility_rules`, and `recruitment_dates` projections through the Phase 2B card helpers. For an already bounded input list it uses exactly three batch lookups (never N+1), caps organization/child result sizes, validates unknown rows fail-closed, and returns typed complete, incomplete, or redacted failure outcomes. `lib/supabase/public-recruitment-cards.ts` is server-only; no page imports it and the public UI remains mock-backed. The focused mocked checker covers projection exclusion, missing/malformed/duplicate data, bounded query shape/count, database failures and route readiness. Verified locally: focused card repository checker, Phase 2B card checker (10), public repository checker (40), listing-order checker (21), foundation checker (177 plus 36 fixture comparisons), reader checker (3,688), TypeScript exit 0, targeted ESLint exit 0, syntax check and `git diff --check` passed. Production build was NOT RUN because this approximately 4 GB laptop has previously had critically low free RAM during validation; no concurrent heavy processes were started. This does not make a detail route real, expose a complete-card page, or solve eligibility-aware pagination/cursors; filtering incomplete cards after a database LIMIT remains prohibited.

Codex

## Files Changed

- scripts/verify-supabase-authenticated-reader.mjs (new) — separate operator verifier; concealed TTY intake, pinned public-key/claim validation, reused reader manifest, paired invalid-token controls, bounded/redacted GET-only checks; no SDK or Auth user query.
- scripts/check-supabase-authenticated-reader.mjs (new) — generated synthetic keys/JWTs, mocked HTTP, manifest/secret/CLI/intake regressions; no .env.local or real network.
- scripts/run-supabase-authenticated-reader.mjs (new) — local operator-only reviewer-email/concealed-password runner; creates an SDK client only with `persistSession:false`, `autoRefreshToken:false`, and `detectSessionInUrl:false`; allows one `signInWithPassword`, exact reviewer-ID validation, then an in-memory verifier handoff. No application import, storage, refresh, service-role, SQL or Admin capability.
- scripts/check-supabase-authenticated-runner.mjs (new) — synthetic mocked Auth/verifier/TTY checks for accepted/rejected identity/session/token cases, one-call enforcement, disabled persistence/refresh/URL detection, argument/project preservation and redacted failure paths; zero real network requests.
- lib/repositories/public-recruitments.ts (new) — framework-neutral public recruitment mapper/repository with exact public projection, immutable first-listing `listedAt`, bounded newest-first `published_at DESC, id DESC` ordering, UUID/slug lookups, RLS-respecting query boundary and redacted typed outcomes.
- lib/supabase/public-recruitments.ts (new) — server-only composition entry point using the request-scoped Supabase client; not yet imported by pages.
- scripts/check-public-recruitments.mjs (new) — synthetic repository checks for projection, `listedAt` mapping/timestamp rejection, newest-first limits/order, lookup, empty/not-found, malformed/database failures and private-field exclusion; zero real network requests.
- supabase/migrations/20261006000100_public_recruitment_listing_order.sql (new) — forward-only chronological listing contract; deployed exactly once to `myresult` after the controlled empty-table preflight.
- scripts/check-public-recruitment-listing-order.mjs (new) — offline/static checks for the migration's empty-table precondition, server-assigned immutable first listing timestamp, narrow grant, index and preserved foundation safeguards.
- docs/SUPABASE.md — narrower scope, verifier/acquisition-runner design, counts, limitations and review gates.
- docs/FEATURES.md / docs/PHASES.md — offline harness implemented; actual authenticated execution NOT RUN; Phase 3/public integration incomplete.
- MEMORY.md — implementation/checks and preserved prior checkpoint history.
- NEXT_TASK.md — one proposed static security review of the new acquisition runner; not execution approval.

## Current Verified Foundation Checkpoint

- Evidence basis: owner-supplied Dashboard execution/preflight/runtime results and previously approved safe connectivity checks. Remote checks are NOT rerun by this documentation task.
- NEW separate `myresult` project exists. Ignored local `.env.local` is configured with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Never print/document values, keys, passwords or JWTs; do not modify/commit the environment file.
- Foundation migration executed once successfully; all 17 tables exist and RLS is enabled. Catalog preflight PASS_WITH_FINDINGS: 14/14 SELECT policies, no unexpected/public write policies, privilege/exposure problems or constraint metadata mismatches; 16/16 triggers and 7/7 private functions matched. No BLOCKER/HIGH findings.
- Corrected TEST_MYRESULT_RLS_V2 runtime result PASS: 270 assertions. Categories: preconditions 1; recruitment_visibility 10; child_visibility 44; column_projection 28; private_reads 6; write_grants 34; unauthorized_writes 102; update_visibility 8; version_invalidation 25; workflow_guards 12. Exact counts and coverage are also in docs/SUPABASE.md.
- Owner-supplied controlled anonymous HTTP result recorded 2026-10-05: mode ANONYMOUS, authenticated NOT RUN, status PASS, ok true; planned/completed/passed 108/108/108; approved 14, excluded 52, private 25, wildcard 17; firstNonPass null. One controlled run on the NEW myresult project after the final static review. This is zero-row projection/grant evidence, NOT authenticated JWT, positive row visibility, publication filtering with returned records, auth.uid behavior, HTTP write denial or production security clearance. Codex does not independently rerun it.
- Narrower authenticated harness implemented/offline-tested only; actual execution NOT RUN. A future bounded PASS would not independently prove PostgreSQL role/auth.uid, identity RLS, ownership, staff authorization, positive row visibility, HTTP writes or application sessions. No existing schema-only identity readback exists; anon/authenticated share grants/policies.
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

Separate authenticated verifier uses native Node crypto, no SDK/new dependency/shared extraction. Reuses anonymousChecks/buildReaderRequest/classifyReaderResponse unchanged. Concealed TTY-only CLI intake requires --concealed-token; no token argv/env/file source or echo. Refuses non-TTY/other data listeners, bounds intake to 16 KiB/60 seconds and restores mode/listeners on success/cancel/error/timeout. Programmatic accessToken is process-memory input for tests/future reviewed callers; no acquisition helper exists.

Network remains opt-in and independently pinned. Public configuration/requests and the input token are snapshotted; JWT issuer matches that origin. Bounded strict JWT/header parsing, exact expected normal-user subject, authenticated role/audience, is_anonymous=false, UUID session_id, exp/iat/optional nbf and run-cap-plus-60-second lifetime margin. Only ES256/P-256 and RS256/2048–4096-bit public keys; one future pinned public JWKS GET supplies an unambiguous matching kid. Native signature verification; no signing-secret/SDK getUser fallback or token-provided key URLs. Unsupported/missing/invalid key/signature stops before Data API.

Matrix: 14 approved + 52 excluded + 25 private = 91 readers; optional 17 wildcards = 108. The first approved organizations projection is counted once and paired with two extra fixed controls: signature-corrupted derivative and unmistakably invalid synthetic token. Control PASS only for HTTP 401 + PGRST301, not permission/bare/ambiguous errors. Final PASS needs signature, both controls and all readers. Planned total including one JWKS check = 94 mandatory / 111 with wildcards. All generated requests are sequential GET, limit=0 for Data API, no retries/redirects/cookies/RPC/embedding/writes; 10-second request/body deadline, 180-second whole-run cap, 16-KiB API and 64-KiB JWKS bodies. No refresh or anonymous fallback.

Reader permissions retain HTTP 401/403 + exact 42501. Network/timeout/429/5xx inconclusive; schema/auth/format mismatches fail. Compact output has fixed labels/counts/allowlisted codes only, no token/key/URL/ref/claims/JWKS/raw response/request/error details. Real authenticated execution NOT RUN; no token acquired or Auth operation. Public app/migration/helpers/packages/old scripts and ignored .env.local unchanged. Build excluded: explicit offline-only task, existing build downloads fonts.

### Authenticated offline implementation verification — Codex, 2026-10-05

- Static review remediation (2026-10-05): fixed three MEDIUM offline-harness findings before any real token use. A bounded recursive JSON parser rejects duplicate member names at every nested object level in JWT header/payload and JWKS responses, with explicit 32-value-depth and 1,024-total-value/container limits; terminal intake restores raw mode and removes only its scoped handlers on simulated SIGINT/SIGTERM/exit, cancellation, timeout and prompt failure. External signals with no pre-existing handler are re-signalled only in the real process after cleanup; simulated Windows/PowerShell behavior remains a later runtime limitation.
- New suite PASSED: 31,806 assertions across 178 scenarios, including 12 actual isolated CLI entry-point cases. Generated synthetic signing keys/JWTs and mocked HTTP only; zero real network requests. Large assertion count includes repeated secret-canary scans, not 31,806 independent security guarantees. Covers token/config snapshots, strict claims/signatures/controls, manifest drift, duplicate/malformed/depth/complexity-bounded JSON, terminal signal cleanup, output/error paths and bounded transport failures.
- Unchanged anonymous suite PASSED: 3,708 assertions across 86 scenarios. Existing foundation checks PASSED: 177; fixture comparisons against HEAD PASSED: 36/36.
- Installed TypeScript `--noEmit --incremental false`, Node syntax checks for both new scripts and targeted ESLint PASSED (exit 0). No packages installed. Build NOT RUN because this task permits offline checks only and the existing build downloads fonts; historical build results are not new authenticated evidence.
- Complete tracked/new-file diff reviewed; git diff --check PASSED. Application, lib/helpers/domain/data, migration, packages/lockfile, anonymous/foundation scripts and env templates unchanged relative to HEAD; .env.local remains ignored/untracked and was not read or modified. No staging, commit, push or real Auth/database/network operation.
- Actual authenticated execution remains NOT RUN. Real Windows terminal concealment, deployed signing configuration, JWT/API rejection behavior and session revocation require later separately approved review/execution; offline mocks do not prove them. NEXT_TASK.md proposes static security review only, before session acquisition.

### Anonymous harness checkpoint — 6b88e29 (historical)

Anonymous harness implemented and final static review approved; owner reports the controlled anonymous run PASS 108/108. Manifest: 17 tables, 14 approved projections, 52 excluded public columns, 25 private columns (91 mandatory); 17 optional separately counted wildcards (108 with flag). Only GET requests generated with limit=0; request builder accepts GET/HEAD only. No Authorization/JWT/session support; authenticated mode always NOT RUN. Requires explicit network flag, myresult attestation and an independently Dashboard-supplied expected project ref (never derived from env). Effective process.env is snapshotted once; all actual request hostnames must match that ref before fetch, including when inherited env overrides an env-file. This is binding, not automatic project-name discovery. Hosted HTTPS Supabase origins only, no redirects/retries/embedding/RPC/writes, sequential 10-second requests, 180-second run cap and 16-KiB bodies. Forbidden permission PASS requires HTTP 401/403 AND exact 42501; the same response on an approved read fails. Bare statuses/JWT/schema errors never count as permission PASS. Fixed classifications/allowlisted codes and no sensitive/raw output. Zero-row checks do not prove visibility, HTTP writes, auth.uid behavior or production readiness.

Public application/fixtures, clients/env helper, existing verifier/foundation checks, migration, packages/lockfile/configuration and .env.local remain untouched. No environment contents displayed/edited, Supabase remote request, SQL execution, Auth operation, persistent fixture, service-role usage or old-project contact. Offline scripts do not load .env.local; Next's normal build may load it without displaying values and request its existing Google fonts. Do not run network verification before separate approval; do not repeat migration/V2 or modify the reviewer.

### Phase 1 verification — Codex (historical, before owner's HTTP run)

- Final new offline suite PASSED 2,506 checks (exit 0), matching all 17 schemas/14 grants and exact categories, using synthetic env and mocked fetch only. Includes import-time no-network guard, unsafe method/path/options/key rejection, empty/denied/error classification, compact/redacted output, sequential/fail-fast behavior, request/body/run deadlines and broken streams. CLI without flags returned NOT_RUN/exit 1 with zero completed requests; no configuration values printed.
- Existing offline foundation checks PASSED 177 checks plus 36/36 fixture comparisons against HEAD; npx tsc --noEmit PASSED (exit 0). Complete documentation/new-script review and protected-path diff check performed; migration/app/helpers/packages/existing scripts/NEXT_TASK.md unchanged; .env.local remains ignored. No real network used by either offline suite.
- Production build PASSED outside the network restriction (exit 0, 22/22 static pages; compile 12.0 minutes, build TypeScript 2.3 minutes). Initial restricted build failed solely fetching existing Geist/Geist Mono Google fonts. No font/source/config workaround or dependency change applied. Targeted lint via the installed ESLint entrypoint PASSED (exit 0). git diff --check PASSED; complete six-file scope reviewed. Existing harmless Node module-type and Git CRLF notices remain unchanged.
- Anonymous remote HTTP verification NOT RUN. Authenticated JWT verification NOT RUN; no token/password acquisition implemented or authorized. Public pages remain mock-backed.

### Harness correction verification — Codex (2026-10-05, before owner's HTTP run)

- Only scripts/verify-supabase-readers.mjs, scripts/check-supabase-readers.mjs and affected docs/SUPABASE.md/MEMORY.md updated in this correction; existing FEATURES/PHASES implementation changes retained. No public feature/phase status changed; NEXT_TASK.md unchanged.
- Corrected 403 + 42501 classification; added independently supplied expectedProjectRef gate and CLI parsing without value echo; added captured console.log/error/stdout/stderr checks and actual CLI branch tests using synthetic env and mocked/blocked fetch only. No additional environment names/dependencies. The local ref argument may be visible in command history; do not share it. Independent project confirmation still depends on the operator, not remote name discovery.
- Reader suite PASSED 3,708 assertions across 86 classification/runner/CLI scenarios, including 12 subprocess CLI cases. Covers missing/invalid/mismatched project pins (zero fetches), malformed/unapproved origins, both denial statuses, snapshot binding after env changes, redacted successes/errors/timeouts/unknown arguments, no-opt-in and mocked execution. Restricted Node spawning returned EPERM; the unchanged offline suite passed with subprocess permission. No native network request was used.
- Existing foundation checks PASSED 177 plus 36/36 fixture comparisons against HEAD. npx tsc --noEmit, targeted installed ESLint, both Node syntax checks and git diff --check PASSED (exit 0). Complete tracked/new-file diff reviewed; application/helpers/migration/packages/old scripts/NEXT_TASK.md match HEAD, and .env.local remains ignored/unmodified. Earlier production build remains historical; no production build rerun in this offline-only correction (the existing build downloads fonts).
- Remote anonymous HTTP and authenticated JWT verification remain NOT RUN. Await second static security review; no real execution command supplied or authorized. Prior SQL/V2 results, known concurrency risks and dev-tooling advisory remain unchanged.

### Anonymous HTTP checkpoint documentation — Codex (2026-10-05)

- Followed AGENTS/MEMORY/NEXT_TASK/relevant-doc session protocol and checked status/recent commits. The expected six-file uncommitted harness scope was intact; no unrelated changes. Updated only MEMORY.md, NEXT_TASK.md, docs/SUPABASE.md, docs/FEATURES.md and docs/PHASES.md in this turn. Both new harness scripts were preserved byte for byte (SHA-256 compared before/after).
- Recorded the owner's supplied controlled anonymous PASS 108/108 and final static review approval, not an agent-run HTTP test. Authenticated JWT, positive HTTP row visibility, auth.uid behavior and HTTP write denial remain unverified; public application remains mock-backed. NEXT_TASK.md contains one proposed planning-only JWT task, awaiting approval; it was not started.
- Fresh offline checks PASSED: 3,708 reader assertions across 86 scenarios (12 isolated CLI cases), 177 foundation checks and 36/36 fixture comparisons against HEAD. Mocked/blocked fetch only, no .env.local loading or actual network. The offline suite's NOT RUN output describes that local invocation, not the owner-completed remote checkpoint.
- git diff --check PASSED; complete tracked/untracked diff reviewed. Application code/helpers/migration/dependencies/old scripts match HEAD; .env.local remains ignored/unmodified. No TSC/lint/build rerun for this docs-only turn; earlier results remain historical. No SQL, Supabase/old-project contact, Auth/database operation, service-role usage, commit or push.

### Previous documentation checkpoint — 7250700

The prior eight-file documentation checkpoint (MEMORY.md, NEXT_TASK.md and docs/ARCHITECTURE.md, DATABASE.md, DECISIONS.md, FEATURES.md, PHASES.md, SUPABASE.md) was committed and pushed as 7250700. It recorded the owner-supplied corrected V2 PASS without remote actions. Its checks below are historical; no migration/V2 rerun is authorized.

### Documentation checkpoint checks — Codex

- Reviewed the full documentation diff and current foundation files; only the eight listed documentation files changed. Git ignore check confirms .env.local remains ignored; no environment contents were read.
- Existing lightweight offline suite rerun: 177 foundation checks and 36/36 fixture comparisons against HEAD PASSED (exit 0). It uses synthetic configuration/mocked networking, does not load .env.local and performs no database calls or SQL execution. Existing harmless Node module-type warning remains.
- git diff --check PASSED; assertion-category totals and documentation-only scope checked locally. No TypeScript/production build rerun for this docs-only checkpoint; prior successes remain historical. No remote migration, RLS suite or Auth operation rerun.

## Phase 2C Batch 2B isolated-test harness — prepared, NOT executed

- Checkpoint `88d28db` contains the offline Batch 2A migration draft only; it remains unexecuted in every database.
- Prepared reviewable, offline-only isolated-database scripts under `supabase/tests/` for a disposable success database, a separately disposable failure database, catalog/grant/security-invoker checks, rollback-only `TEST_B2B_*` fixtures, and a zero-persistent-fixture verification query. Every entry script now requires a separately approved, manually provisioned private isolated-environment sentinel with one exact marker; no script creates or alters it.
- The failure setup intentionally commits one synthetic incomplete legacy publication so a later migration application can prove transactional preflight rollback. It must run only in a disposable failure database; ordinary success scenarios begin and roll back. A separate offline runner is prepared to require the exact Batch 2A SQLSTATE `P0001` and preflight message, then opens a fresh assertion session only after PostgreSQL has rolled back the failed migration connection. The assertion SQL emits no PASS; only the runner may report PASS after that assertion process exits successfully.
- The new local static checker reads SQL text only. It does not connect to Supabase/PostgreSQL or execute SQL. Isolated project creation, Auth reviewer creation, SQL execution, migration application, production deployment, cursor work, and UI cutover all remain separately gated.

## Next Recommended Task

Single proposal in NEXT_TASK.md: static security review of the new authenticated verifier/tests before any session acquisition. No token, sign-in/out/refresh, Auth operation or network execution authorized. Later acquisition/cleanup and controlled execution need separate approvals. Do not rerun anonymous HTTP verification, migration or V2. Concurrency, generated types/DTO/ID mapping and dev-tooling remediation remain separate work; no CMS/writer/fixtures/application auth/public cutover authorized.

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
