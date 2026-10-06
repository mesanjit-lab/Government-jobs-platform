# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-06

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to contact Supabase, switch pages to database data, or alter the database.

## Task: Review the Phase 1 public recruitment data-access layer

### Starting checkpoint

- Committed HEAD before the uncommitted batch: `a2755a7 test: add safe authenticated verification runner`.
- New Phase 1 files establish `lib/repositories/public-recruitments.ts` and the server-only `lib/supabase/public-recruitments.ts` entry point, plus synthetic offline checks.
- The public application remains mock-backed. Foundation tables have no seeded real recruitment records.

### Scope

1. Review the exact public SQL projection against the committed migration grants and confirm no private/workflow/review/provenance fields or wildcard selection can escape.
2. Review UUID/slug lookup, limits, title/UUID deterministic ordering, malformed-row handling, typed empty/not-found/failure outcomes, and no-N+1 design.
3. Confirm server-only composition and no page/component client import or cutover.
4. Confirm the documented ordering limit: `published_at` is intentionally unavailable, so the public reader exposes only a bounded deterministic title/UUID display list, not chronological newest-first data. A later separately reviewed database/public-ordering decision is required before MyResult labels Supabase-backed results as "Latest Jobs".
5. Review the 39 offline repository checks and existing regression scope. Do not contact Supabase, add fixtures, alter schema, change Auth, or implement a UI cutover.

### Definition of done

Static review result with any minimal corrections. A later separately approved task may integrate one server-rendered listing only after defining empty/error UX and a truthful public ordering strategy. It must preserve mocks until an explicit cutover and must not invent facts or map legacy numeric URLs to UUIDs implicitly.
