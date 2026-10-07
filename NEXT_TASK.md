# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-07

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to switch pages to database data.

## Task: Controlled `/jobs` Supabase read cutover

### Starting checkpoint

- The chronological public-listing migration is deployed and the independently project-bound anonymous zero-row reader verification passed 107/107, including the approved `published_at` projection.
- Public pages remain mock-backed and the database remains fixture-free.
- Authenticated JWT, positive row visibility, HTTP write denial and `auth.uid()` behavior remain outside this proposed task.

### Scope

1. Review the existing server-only public recruitment repository and integrate it only into `/jobs`, preserving explicit public projection, newest-first `(published_at, id)` order and bounded list semantics.
2. Define reviewed loading, empty, malformed-data and redacted-error UI behavior without inventing recruitment facts or creating fixtures.
3. Preserve unrelated pages, recruitment detail routes, Auth, Admin, RLS, schema and migrations.
4. Keep the implementation server-first; do not expose Supabase credentials to client components or add write capability.
5. Validate TypeScript/build and narrow UI/data-boundary regression checks before any commit. No remote SQL, Auth, service-role or data mutation is authorized.

### Definition of done

A narrowly scoped, reviewed `/jobs` integration that uses only the public repository boundary and preserves a safe empty/error experience while the database contains no records. It must not claim that the zero-row verifier proved positive row visibility, non-null `published_at`, HTTP write denial or `auth.uid()` behavior.
