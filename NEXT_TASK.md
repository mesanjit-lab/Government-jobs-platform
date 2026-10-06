# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-06

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to execute a migration, contact Supabase, or switch pages to database data.

## Task: Review the chronological public-listing migration contract

### Starting checkpoint

- Committed HEAD before the uncommitted batch: `1d84abe feat: add public recruitment data layer`.
- New forward migration `20261006000100_public_recruitment_listing_order.sql` is local only and NOT deployed.
- The public application remains mock-backed. The migration deliberately fails when `recruitments` is nonempty rather than inferring historical listing times.

### Scope

1. Review the new migration's ACCESS EXCLUSIVE lock before its empty-table precondition, trigger ordering, first-publication database assignment, immutable preservation, direct-execution revocation for the trigger helper, narrow `published_at` grant, and index.
2. Confirm existing verification, version-bound review, archive and future-visibility RLS safeguards remain unchanged.
3. Confirm the public repository maps only `listedAt`, rejects malformed timestamps, orders by `published_at DESC, id DESC`, and retains bounded UUID/slug reads.
4. Confirm no page/component imports the adapter and all UI remains mock-backed.
5. Review the focused offline migration/repository checks and existing foundation regression scope. Do not execute SQL, deploy the migration, contact Supabase, change Auth, or implement a UI cutover.

### Definition of done

Static migration-review result with any minimal corrections. After separate execution approval and verification, a later task may integrate `/jobs` first using an empty/error UX and future `(published_at, id)` keyset cursor. It must preserve mocks until an explicit cutover and must not invent facts or map legacy numeric URLs to UUIDs implicitly.
