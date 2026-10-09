# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-09

## Status

PENDING OWNER REVIEW — Phase 2C Batch 2A has an offline-only draft migration and static checker. Phase 2C Batch 1 is committed as `9b7af497`, and the Vercel TypeScript production-build fix is committed and deployed as `822c9b59`. This document is not authorization to execute SQL, change the deployed database, or cut any page over to Supabase.

## Proposed next task: Phase 2C Batch 2 — complete public-card publication boundary

### Starting checkpoint

- The chronological public-listing migration is deployed and the independently project-bound anonymous zero-row reader verification passed 107/107, including the approved `published_at` projection.
- Public pages remain mock-backed and the database remains fixture-free.
- Authenticated JWT, positive row visibility, HTTP write denial and `auth.uid()` behavior remain outside this proposed task.
- Current workflow guards require a verified current version to publish and preserve the original `published_at`, but do not yet require card completeness or reject numeric-only slugs.

### Scope

1. Review the draft forward-only migration and static checker. The migration serializes against parent invalidation, rejects pre-existing incomplete published rows, adds a trusted final-state completeness guard, and requires an active organization, a non-numeric valid slug, at least one nonblank qualification, and at least one non-null `application_end` date with exactly one distinct date.
2. Review the draft security-invoker public-card view with explicit public columns only. It preserves the existing public-state/review predicate and `published_at DESC, id DESC` consumer contract, and never exposes reviews, sources, memberships, actors, workflow internals, or private notes/URLs.
3. Preserve the original `published_at` after withdrawal/republishing. Do not implement a cursor, filtering after `LIMIT`, a page query, UI changes, Auth, Admin, or public writes.
4. Specify offline/static migration checks plus a controlled isolated-database execution plan before any remote deployment. No remote SQL, Auth, service-role or data mutation is authorized by this planning file.

### Definition of done

A reviewed migration and test plan that enforces the agreed completeness invariant and establishes a projection-safe reader view without changing a public page. The later cursor contract must use a validated base64url payload for `(published_at, id)` and be separately approved. This batch must not claim positive HTTP row visibility, non-null `published_at` in a returned row, HTTP write denial, or `auth.uid()` behavior.
