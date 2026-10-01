# ARCHITECTURE.md — System Architecture

Last updated: October 2026

---

## Overview

MyResult is a Next.js application using the App Router pattern.
Currently frontend-only with mock data.
Supabase integration is planned for Phase 3.

---

## Frontend

Framework: Next.js 16.3.4
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

## Planned Backend (Phase 3)

Database: Supabase (PostgreSQL)
Auth: Supabase Auth
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
- NEXT_PUBLIC_SUPABASE_ANON_KEY (with RLS enabled)

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

## Publication and verification (contracts/design only)

Recruitment lifecycle is optional `upcoming | open | closed | in_progress | completed | cancelled`.
Publication is `draft | in_review | published | archived`; verification is separately `unverified | in_review | verified | rejected`.

Draft → Preview (read-only) → Human verification of official sources → Authorized publication.

An AI-extracted source remains an unverified draft. Validation never supplies verified/published flags. Trusted services must bind human verification to a content version, invalidate it on edits, and enforce publication atomically. These services are NOT implemented. See DATABASE.md for proposed ownership, RLS, provenance and archive rules.

## Data flow (planned — Phase 3, not implemented)

Database rows → server-only adapter → normalized domain records → public view DTOs → server-rendered pages / safe client props.

Future Admin content input → structural validation → authorization/DB constraints → draft transaction → human verification → publication.

Keep `getRecruitments`, `getRecruitmentById`, `getLatestRecruitments`, `getRecruitmentDetailView`, `hasRecruitmentDetail` and `getRecruitmentsForEligibility` as the compatibility surface. The current synchronous client imports cannot simply become async Supabase calls: integration must introduce server loading and pass safe projections to client components while preserving their presentation. No privileged client belongs in a browser bundle.

Before real reads, define normalized-to-view formatting, missing-detail availability, legacy numeric ID/UUID routing, cache invalidation and request-scoped loading. The current detail selector still assumes legacy complete fixtures (ages/category breakdown and label-based dates); it is not a validator for future incomplete domain records. No backend adapter has been added in this preparation batch.
