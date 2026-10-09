# ARCHITECTURE.md — System Architecture

Last updated: October 2026

---

## Overview

MyResult is a Next.js application using the App Router pattern.
Public pages remain frontend/mock-backed. Phase 3 includes local Supabase clients/scripts plus a separately provisioned NEW `myresult` database. The owner reports the foundation migration executed once and a controlled rollback-only SQL-role suite PASSED 270 assertions, with foundation tables empty after rollback. The application does not yet read from this database; authentication/Admin and HTTP/JWT identity behavior remain unimplemented/unverified. See SUPABASE.md for evidence and limits.

---

## Frontend

Framework: Next.js 16.3.8 (approved security patch)
Language: TypeScript
Styling: Tailwind CSS
Icons: lucide-react
PDF: pdf-lib (client-side only)
Router: App Router (Next.js)

---

## Responsive Layout

Mobile (below lg / 1024px):
- MobileHome component at app/components/MobileHome.tsx
- Fixed bottom navigation
- Hamburger menu
- Compact cards

Desktop (lg and above):
- Full desktop layout with Header, Hero, Tools sections
- Sticky sidebar on Job Detail page
- Multi-column grid layouts

Both layouts share:
- Same data sources
- Same shared components (Header, Footer, etc.)
- Same routes

---

## Backend foundation and planned application integration (Phase 3)

Database: Supabase (PostgreSQL) — separate foundation deployed; public read adapter pending
Auth: Supabase Auth — dedicated normal test account exists; application integration pending
Storage: Supabase Storage (for images/PDFs if needed)
API: Next.js API Routes + Supabase client

---

## Security Boundaries

NEVER in frontend:
- SUPABASE_SERVICE_ROLE_KEY
- Any admin-level credentials
- Direct DB admin operations

ALLOWED in frontend:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (with RLS enabled)

Admin operations must go through:
- Next.js API Routes (server-side only)
- Row Level Security on all tables

---

## Deployment

Platform: Vercel
Repository: github.com/mesanjit-lab/Government-jobs-platform
Branch: master
Live URL: https://government-jobs-platform-sigma.vercel.app

---

## Recruitment contracts and current data flow

- `lib/domain/recruitment.ts` defines framework/database/UI-independent, readonly contracts. Recruitment is the identity; optional RecruitmentDetail content includes posts, eligibility, dates, fees, links/documents, stages, salary, patterns, FAQs and sources. RecruitmentUpdate attaches lifecycle events to that identity.
- `lib/data/recruitment-views.ts` preserves the current public fixture/display contract. New/Hot badges, formatted vacancy strings, approximate dates and duplicated related-card display summaries belong here, not in persisted domain entities. This is a compatibility projection, not a second canonical Recruitment model.
- `lib/data/recruitments.ts` remains the single mock-backed recruitment read boundary. All fixture literals and selector behavior are preserved. Jobs, Job Detail, LatestJobs, MobileHome, Eligibility Checker and desktop Closing Soon continue to consume the same selectors without UI edits.
- The module owns fixture state. Consumers must not mutate it; legacy view DTOs are not deeply frozen. New domain contracts use readonly properties/collections. Future reads will be request-scoped. No cloning/freezing library is introduced.
- Results, Admit Cards, Answer Keys, Syllabus and other non-migrated datasets remain mock-backed; their data migration is not complete.

Current: public consumer → synchronous recruitment selectors → mock display DTOs → render.

## Admin input boundary (implemented, not connected to a UI/API)

`validateRecruitmentInput(unknown, 'create' | 'update')` in `lib/validation/recruitment.ts` returns either typed RecruitmentAdminInput or path-specific issues. It constructs only allowed content fields; it does not cast raw input into a Recruitment. No dependency or I/O is used.

This is a full content snapshot, NOT a partial PATCH. Title/organization are required; edit mode requires a recruitment ID; nested entity IDs are required. Unknown optional facts may remain absent. Explicit null/blank values are rejected rather than silently converted into facts. Text is trimmed. Referenced post/stage/source IDs must exist in the same snapshot.

Structural validation checks fields, date validity (including leap years), non-negative counts/age bounds, decimal fee strings, HTTP(S) URLs, nested shapes/duplicate IDs and enum values. It rejects workflow/audit properties. It does not verify official facts, URL authenticity/reachability, database identity/ownership, permissions or government eligibility. Future server endpoints must apply this validation again and add authorization, request-size limits and persistence constraints.

## Publication and verification (contracts/database guards; services pending)

Recruitment lifecycle is optional `upcoming | open | closed | in_progress | completed | cancelled`.
Publication is `draft | in_review | published | archived`; verification is separately `unverified | in_review | verified | rejected`.

Draft → Preview (read-only) → Human verification of official sources → Authorized publication.

An AI-extracted source remains an unverified draft. Validation never supplies verified/published flags. Deployed database guards bind verification to a current-version human review and invalidate it on edits; selected paths passed the controlled runtime suite. Authorized services and human factual verification remain NOT implemented. See DATABASE.md for ownership, RLS, provenance, archive rules and remaining concurrency/coverage limits.

## Data flow (planned — Phase 3, not implemented)

Database rows → server-only adapter → normalized domain records → public view DTOs → server-rendered pages / safe client props.

Future Admin content input → structural validation → authorization/DB constraints → draft transaction → human verification → publication.

Keep `getRecruitments`, `getRecruitmentById`, `getLatestRecruitments`, `getRecruitmentDetailView`, `hasRecruitmentDetail` and `getRecruitmentsForEligibility` as the compatibility surface. The current synchronous client imports cannot simply become async Supabase calls: integration must introduce server loading and pass safe projections to client components while preserving their presentation. No privileged client belongs in a browser bundle.

Before real reads, define normalized-to-view formatting, missing-detail availability, legacy numeric ID/UUID routing, cache invalidation and request-scoped loading. The current detail selector still assumes legacy complete fixtures (ages/category breakdown and label-based dates); it is not a validator for future incomplete domain records. No backend adapter has been added in this preparation batch.

## Supabase foundation — local implementation and isolated runtime checkpoint

- Installed @supabase/supabase-js 2.117.2 and @supabase/ssr 0.12.7 only. SDK requires Node >=22; the operator scripts use native TypeScript stripping (Node >=22.18, verified with 24.19.0).
- `lib/supabase/env.ts` lazily validates the two explicit public environment names. No service credentials, legacy-JWT fallback or build-time requirement for local credentials. `.env.example` is blank; `.env.local` stays ignored.
- `lib/supabase/client.ts` is client-only and uses createBrowserClient with publishable credentials. `server.ts` is server-only, creates a fresh request-scoped createServerClient and reads Next's asynchronous cookie store.
- SSR 0.12.7 cookie writes also require response cache headers. A future authorized Route Handler must pass a writer applying BOTH arguments of setAll. Without that adapter, writes fail explicitly rather than silently dropping session changes/cache headers. This is not working authentication; no Proxy, auth UI wiring or refresh workflow is installed.
- No public component imports these clients. `lib/repositories/public-recruitments.ts` provides the Phase 1 public mapper/query contract, while `lib/supabase/public-recruitments.ts` is its server-only composition entry point. Phase 2C Batch 1 adds `lib/repositories/public-recruitment-cards.ts`: it receives an already bounded public recruitment list and issues at most three explicit-projection batch queries (organizations, qualification candidates and date candidates), with no joins or N+1 reads. It maps unknown rows fail-closed and returns typed complete, incomplete or failure outcomes through the Phase 2B helpers. `lib/supabase/public-recruitment-cards.ts` is server-only and does not load a listing or choose cache policy. Neither boundary is imported by a page; current UI remains mock-backed. Card composition is not a pagination/filter/cursor solution: filtering incomplete cards after a list limit can underfill a page and requires a separately designed eligibility-aware cursor.
- `supabase/migrations/20261002000100_recruitment_foundation.sql` defines the 17 Core V1 tables, version/review guards and fail-closed RLS; owner-run migration succeeded once on the NEW project. The corrected rollback-only V2 suite passed 270 SQL-role assertions, without Auth mutations, service-role usage or persistent fixtures. Do not rerun the migration or V2 suite. See DATABASE.md and SUPABASE.md for limits and remaining approval gates.
- Phase 2C Batch 2A has an offline-only forward migration draft and static checker; it is not deployed. The draft installs a trusted completeness guard after `recruitment_workflow`, so it evaluates the final publication state rather than blocking normal child/organization invalidation to draft. It serializes a legacy precheck with `ACCESS EXCLUSIVE` on `recruitments`, then creates an explicit-column `security_invoker` public-card view. The guard rejects an invalid/numeric-only publication slug, missing qualification, null/missing application end date, and conflicting application end dates; repeated identical end dates are allowed. The view returns ordered raw qualification candidates so the existing Phase 2B TypeScript helper, rather than SQL collation, retains locale-aware summary behavior. It is not a page query or cursor implementation. A later separately approved adapter may use an opaque validated base64url `(published_at, id)` cursor; no offset pagination or post-`LIMIT` incomplete-card filtering is permitted.
- `scripts/verify-supabase.mjs` is a Node-only, explicit-opt-in HEAD read check; no API/debug route. `scripts/check-supabase-foundation.mjs` tests with synthetic config and mocked networking, plus static SQL structure and fixture parity.

The Phase 1 repository has no `select('*')`, never queries private tables, uses a maximum bounded list size, and maps only the migration's deliberate public fields into `PublicRecruitmentSummary`. The deployed forward migration `20261006000100_public_recruitment_listing_order.sql` establishes `published_at` as the database-assigned immutable first MyResult public-listing timestamp, mapped publicly as `listedAt` rather than an official notification date. The independently project-bound anonymous zero-row reader verification passed 107/107 projection/grant checks; it does not prove positive row visibility or a non-null returned value. Public reads order `published_at DESC, id DESC`, enabling truthful newest-first “Latest Jobs” and a future keyset cursor. The migration was applied once to the separate `myresult` project with an empty recruitment table; public pages remain mock-backed until explicit UI integration approval. Caching is deliberately not added at this boundary: the future server-rendered caller can choose framework-supported revalidation, while the request-scoped server client avoids making public updates permanently stale. Admin, staff authorization services, application authentication, notification delivery and public-page integration remain NOT IMPLEMENTED. HTTP/JWT/auth.uid verification is pending; known review-ordering and concurrent lock-order risks remain. Normal MyResult work must not contact, inspect, modify or clean the old AI Test Platform Supabase project.
