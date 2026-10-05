# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-05

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to start, implement or execute the next task.

## Task: Plan authenticated JWT reader verification

### Starting checkpoint

- Committed HEAD: `72507002dbc794ee925f7daa22db1cf132f37e7e docs: record verified Supabase RLS checkpoint`; anonymous harness/documentation changes remain uncommitted pending review.
- Separate NEW `myresult` Supabase project configured; publishable connectivity passed.
- Foundation migration executed once; 17 tables deployed. Owner reports corrected rollback-only TEST_MYRESULT_RLS_V2 PASS, 270 assertions, all fixtures rolled back and foundation tables empty afterward.
- Owner reports one controlled anonymous HTTP run PASS: planned/completed/passed 108/108/108; approved 14, excluded 52, private 25, wildcard 17; ok true, firstNonPass null. Authenticated NOT RUN. The zero-row test does not independently recheck table emptiness or positive record visibility.
- Public application remains mock-backed. Application authentication, Admin, staff authorization and Supabase read adapters are not implemented.
- SQL-role verification does not establish HTTP/JWT/auth.uid behavior. Known review-ordering and concurrent lock-order risks remain.

### Scope of the proposed planning task

1. Design a minimal authenticated-JWT Data API reader matrix using approved projections, excluded columns, private-table denials and optional wildcard probes. Reuse the anonymous boundary where appropriate, but do not implement it during planning or rerun the completed anonymous check.
2. Propose the safest legitimate, separately approved session-acquisition method using the existing dedicated normal test reviewer account; do not modify/create Auth users. Assess Auth session/log side effects and token expiry. Do not request passwords/JWTs in chat or acquire a session now.
3. Define independent NEW myresult project-ref binding and JWT issuer/project/session validation without logging tokens or making unapproved Auth/RPC requests. Publishable credentials remain required; no service-role usage or Auth user row queries.
4. Specify local in-memory token handling, no persistence/refresh by default, redacted output, GET-only zero-row requests, no retries/redirects, request/run deadlines and fail-closed PASS/FAIL/INCONCLUSIVE criteria.
5. Preserve empty-table limitations: positive row visibility, HTTP writes, identity-dependent ownership and future auth.uid policies cannot be inferred from successful empty reads. Current reader policies do not use auth.uid(). Do not create fixtures to expand coverage.
6. Deliver the plan for review only. Planning approval is separate from later harness implementation, session acquisition and execution approvals. No network/Auth/database operation occurs in the planning turn.

### Exclusions

- No application/auth implementation, public-page cutover, Admin CMS, database writes, fixtures, dependency changes or schema/policy/grant changes.
- Do not rerun the migration, completed V2 suite or anonymous HTTP verification.
- Do not contact, inspect, modify or clean the old AI Test Platform project.
- Do not modify or commit `.env.local`; accepted public names are NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Never print their values or any JWT/password/key.
- Do not start unrelated advisory remediation or concurrency work; those remain separately scoped future tasks.

### Definition of done

A beginner-readable authenticated JWT reader plan with a legitimate session strategy, independent project/token binding, explicit approval gates, bounded read-only matrix and honest empty-table limitations; no implementation, token acquisition, remote actions or database/Auth changes.

### Why this comes next

The controlled anonymous HTTP projection/grant checkpoint is now complete; actual authenticated JWT reader behavior remains unverified despite SQL-role PASS. This single planning proposal addresses that gap without application auth, fixtures, writer, CMS or public read cutover. Updating this file is not permission to start the plan or execute authentication/network tests.
