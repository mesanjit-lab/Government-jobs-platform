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
Status: In Progress — database connection planned for Phase 3

---

## ADR-006 — Supabase for Database and Auth

Date: September 2026
Decision: Use Supabase for PostgreSQL database and authentication
Reason: Built-in Auth, Row Level Security, real-time capabilities, free tier
Status: Planned — Phase 3

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
Status: Domain contracts and schema design only. No migrations, roles/RLS, persistence, verification service, Admin CMS or notification infrastructure implemented.

---

## ADR-012 — Fail-closed local Supabase foundation, without public integration

Date: October 2026
Decision: Use modern publishable credentials only, lazy client factories and a server-only request cookie boundary. Defer Proxy/auth until a response adapter can apply both SSR cookie writes and cache headers. No service-role client, remote connection or public debug endpoint.
Decision: Implement Core V1 as a versioned transactional local migration. Grant reader roles only selected public columns with current-version/latest-review publication checks; internal evidence/memberships remain private. No reader write policies, staff grants or mutation RPC. Child/provenance edits invalidate verification; published history is archived, not deleted.
Reason: A public parent must not expose draft updates, private reviewer evidence or unreviewed edits. SDK installation and SQL text do not imply a connected/verified production database. Existing mock selectors/pages remain unchanged until an explicitly approved adapter/identity migration.
Limits: SQL reviewed statically only; actual execution, RLS adversarial tests and concurrency/transaction testing require later approved setup. Admin authorization, human factual verification service, auth and notifications remain unimplemented. The Next.js critical finding was resolved by the approved 16.3.8 patch; remaining dev-only brace-expansion advisories require separate remediation approval. No automatic audit fix.
Status: Local foundation implemented; remote/database execution NOT VERIFIED. Supersedes ADR-011's historical statement that no migration exists, not its lifecycle/publication/verification separation.
