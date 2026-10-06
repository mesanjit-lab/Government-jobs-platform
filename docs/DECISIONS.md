# DECISIONS.md — Architecture Decision Log

Last updated: October 2026

---

## ADR-001 — Use Next.js App Router

Date: September 2026
Decision: Use Next.js 16 App Router instead of Pages Router
Reason: Modern pattern, Server Components, better performance
Status: Implemented

---

## ADR-002 — Tailwind CSS for Styling

Date: September 2026
Decision: Use Tailwind CSS utility classes
Reason: Fast development, consistent design, no CSS files needed
Status: Implemented

---

## ADR-003 — Separate Mobile and Desktop Homepage

Date: September 2026
Decision: Create MobileHome component separate from desktop layout
Reason: Mobile requires fundamentally different composition, not just CSS shrinking
Implementation: MobileHome shown below lg, desktop shown at lg+
Status: Implemented

---

## ADR-004 — Client-side PDF Processing

Date: September 2026
Decision: Process PDFs entirely in browser using pdf-lib
Reason: Privacy — user files never uploaded to server
Tradeoff: Limited compression capability vs server-side processing
Status: Implemented

---

## ADR-005 — Mock Data First, Database Later

Date: September 2026
Decision: Build complete UI with mock data before connecting database
Reason: Faster UI iteration, database schema can be finalized based on UI needs
Status: Public application remains mock-backed. Separate database foundation is deployed/SQL-role tested; application read integration remains planned for Phase 3.

---

## ADR-006 — Supabase for Database and Auth

Date: September 2026
Decision: Use Supabase for PostgreSQL database and authentication
Reason: Built-in Auth, Row Level Security, real-time capabilities, free tier
Status: Supabase database foundation deployed and controlled SQL-role verified; application Auth integration remains planned.

---

## ADR-007 — Registration Optional

Date: September 2026
Decision: All content accessible without registration
Reason: Lower friction for students, registration only required for notifications
Status: Implemented in UI

---

## ADR-008 — lucide-react for Icons

Date: September 2026
Decision: Use lucide-react as the primary icon library
Reason: Clean, consistent, tree-shakeable, TypeScript support
Status: Implemented

---

## ADR-009 — Recruitment is the canonical public lifecycle entity

Date: September 2026
Decision: Public UI reads recruitment data through a shared typed data boundary.
Reason: Recruitment owns the public lifecycle; future admit cards, answer keys, results, exam dates, corrections, and updates attach to it rather than duplicating job records.
Status: Implemented with temporary typed fixtures; database adapter planned.

---

## ADR-010 — Separate canonical contracts, public views and Admin input

Date: October 2026
Decision: Keep Recruitment/RecruitmentDetail and related domain contracts in lib/domain, with opaque string IDs, optional unknown facts and readonly collections. Preserve the old UI-shaped fixture contract in explicitly named lib/data/recruitment-views.ts DTOs. Only type references change in the current adapter; fixture facts and selector outputs do not change.
Reason: Display badges, formatted dates/counts and related-card summaries are not normalized persistence fields. Forcing old mock data into a future schema would require guessed IDs/dates and risk public regressions.
Decision: Dependency-free validateRecruitmentInput accepts complete create/update content snapshots separately from persisted Recruitment. It validates unknown input, builds typed allowed fields and rejects workflow/audit properties. No validation/test package was installed.
Limits: Structural validation is not authorization, official-source verification or a save operation. Existing view DTOs retain the documented no-mutation boundary rather than adding cloning/deep-freeze machinery. Supabase replacement still needs server/client loading and domain-to-view mapping; it is not an async drop-in for synchronous fixture imports.
Status: Contracts/validation and mock compatibility implemented; backend/Admin integration NOT IMPLEMENTED.

---

## ADR-011 — Separate lifecycle, editorial publication and human verification

Date: October 2026
Decision: Lifecycle, publicationState and verificationState are independent. Preview is a read-only action. Verified content requires human official-source review tied to contentVersion; any content/child/source edit must invalidate it before republishing. AI extraction records origin but never implies verification.
Decision: Reconcile DATABASE.md around organizations, recruitments and owned normalized content, with source/review evidence and independent workflow on future lifecycle updates. Do not create separate competing jobs/results/admit-card recruitment identities. Defer user tracking, delivery infrastructure and optional revision snapshots.
Reason: Draft → Preview → Verify → Publish must not accidentally publish unverified automation output or leak child/update drafts beneath a public parent. Unknown factual data stays absent.
Historical status at the design checkpoint: domain contracts and schema design only. Migration/RLS deployment and controlled runtime verification are now recorded in ADR-012/013; verification services, Admin CMS and notifications remain unimplemented.

---

## ADR-012 — Fail-closed local Supabase foundation, without public integration

Date: October 2026
Decision: Use modern publishable credentials only, lazy client factories and a server-only request cookie boundary. Defer Proxy/auth until a response adapter can apply both SSR cookie writes and cache headers. No service-role client or public debug endpoint. Initial local-only scope is historical; isolated remote deployment/verification is recorded below and in ADR-013.
Decision: Implement Core V1 as a versioned transactional local migration. Grant reader roles only selected public columns with current-version/latest-review publication checks; internal evidence/memberships remain private. No reader write policies, staff grants or mutation RPC. Child/provenance edits invalidate verification; published history is archived, not deleted.
Reason: A public parent must not expose draft updates, private reviewer evidence or unreviewed edits. SDK installation and SQL text do not imply a connected/verified production database. Existing mock selectors/pages remain unchanged until an explicitly approved adapter/identity migration.
Limits: Owner-reported isolated migration and 270 rollback-only SQL-role assertions are now complete, not comprehensive HTTP/JWT/auth.uid or concurrency coverage. Admin authorization, human factual verification service, application auth and notifications remain unimplemented. Known review-ordering and lock-order risks remain. The Next.js critical finding was resolved by the approved 16.3.8 patch; remaining dev-only brace-expansion advisories require separate remediation approval. No automatic audit fix.
Status: Foundation implemented/deployed and controlled SQL-role checkpoint verified as of 2026-10-04; public application integration deferred. Supersedes ADR-011's historical statement that no migration exists, not its lifecycle/publication/verification separation.

---

## ADR-013 — Isolate MyResult database verification from existing projects

Date: 2026-10-04
Decision: Use only the separate NEW `myresult` Supabase project for MyResult foundation work. Never contact, inspect, modify or clean the old AI Test Platform project during normal development; cleanup of accidental MyResult objects there requires its own future scope and approval.
Decision: Record the once-executed migration and corrected rollback-only TEST_MYRESULT_RLS_V2 PASS (270 assertions) as bounded foundation evidence, not approval for auth, staff writes or a production read cutover. No migration/V2 rerun is authorized by this checkpoint.
Reason: Project isolation prevents unrelated application impact. SQL-role coverage proves the tested grants/policies/guards but does not establish HTTP/JWT/auth.uid identity behavior or solve known concurrency risks.
Reviewer boundary: Use the separately approved normal Auth test account; do not directly insert synthetic auth.users records. It persists outside rollback and remained unchanged; TEST fixtures/editor membership rolled back. No service-role usage or Auth mutation occurred in the suite.
Status: Separate project and controlled runtime checkpoint complete according to owner-supplied results. Public pages remain mock-backed; future verification/integration needs separate approval. Evidence, counts and limits are recorded in SUPABASE.md.

---

## ADR-014 — Server-first, projection-safe public recruitment reads

Date: 2026-10-06
Decision: Keep public Supabase recruitment reads behind a framework-neutral repository and a separate server-only composition entry point. The repository selects only the Foundation V1 granted recruitment columns, maps unknown row data into domain-level `PublicRecruitmentSummary`, returns typed success/not-found/failure outcomes, and never queries private evidence/membership tables. It has bounded list limits and stable title/UUID ordering; it is not imported by UI pages in this phase. Do not add a cache wrapper at the repository boundary yet; future page integration must choose current Next.js-supported revalidation so Admin publication can invalidate or age out reads safely.
Reason: Pages must not own database queries, and current mock display DTOs require facts (badges, formatted dates, qualifications and legacy numeric IDs) not present in the normalized public summary. Direct conversion would invent or misrepresent data.
Ordering limit: Foundation V1 deliberately does not grant `published_at`. The repository therefore exposes only a deterministic title/UUID display list, not a chronological newest-first API. A future approved public ordering projection/view or grant decision is needed before MyResult labels Supabase-backed results as "Latest Jobs" or makes a latest-first UI claim.
Status: Repository boundary implemented and offline tested; public-page cutover, generated types, real content and caching/revalidation policy are deferred.
