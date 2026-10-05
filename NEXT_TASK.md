# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-05

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to start, implement or execute the next task.

## Task: Static security review of the authenticated reader verifier

### Starting checkpoint

- Committed HEAD: `6b88e297917437994f3b38f23c9d13b6fb695454 test: verify anonymous Supabase reader access`.
- Separate NEW `myresult` Supabase project configured; publishable connectivity passed.
- Foundation migration executed once; 17 tables deployed. Owner reports corrected rollback-only TEST_MYRESULT_RLS_V2 PASS, 270 assertions, all fixtures rolled back and foundation tables empty afterward.
- Owner reports one controlled anonymous HTTP run PASS: planned/completed/passed 108/108/108; approved 14, excluded 52, private 25, wildcard 17; ok true, firstNonPass null. Authenticated NOT RUN. The zero-row test does not independently recheck table emptiness or positive record visibility.
- Public application remains mock-backed. Application authentication, Admin, staff authorization and Supabase read adapters are not implemented.
- Owner approved the narrower JWT ACCEPTANCE + AUTHENTICATED HTTP READER GRANTS boundary. Separate verifier/offline tests are now implemented, awaiting static review/checkpointing; actual authenticated execution NOT RUN. No real token acquired or sign-in/out/refresh performed.
- SQL-role verification does not establish HTTP/JWT/auth.uid behavior. Known review-ordering and concurrent lock-order risks remain.

### Scope of the proposed static review

1. Read both complete new authenticated scripts, unchanged anonymous harness, committed migration and relevant docs. Verify manifest reuse/counts: 91/108 readers plus two controls and one JWKS check = 94/111 planned checks.
2. Audit concealed TTY intake, no argv/env/file token source, terminal cleanup, bounded claims/segments, exact expected subject and independently pinned project/issuer.
3. Audit native ES256/RS256 public-key verification and pinned GET-only JWKS discovery. No token-directed URLs, signing-secret requests, SDK getUser fallback or Auth user queries; unsupported keys/configuration must stop.
4. Audit both invalid-token controls on the same fixed approved zero-row endpoint, strict JWT-error recognition and no anonymous fallback. A successful public read alone is insufficient.
5. Audit output/exception/CLI secrecy with synthetic canaries, GET-only paths, sequential/no-retry/fail-fast behavior, redirects/body/deadline bounds and offline test coverage. No network or session acquisition during review.
6. Report APPROVE/DO NOT APPROVE with defects/minimal corrections and honest narrower coverage limits. Approval does not itself authorize session acquisition/cleanup or remote execution; those need separate explicit approval.

### Exclusions

- No file/code changes during review unless a separate correction task is approved. No application/auth implementation, public-page cutover, Admin CMS, session-acquisition helper, Auth operations, database writes, fixtures, dependency changes or schema/policy/grant changes.
- Do not rerun the migration, completed V2 suite or anonymous HTTP verification.
- Do not contact, inspect, modify or clean the old AI Test Platform project.
- Do not modify or commit `.env.local`; accepted public names are NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Never print their values or any JWT/password/key.
- Do not start unrelated advisory remediation or concurrency work; those remain separately scoped future tasks.

### Definition of done

A complete static security audit with offline evidence, any defects/minimal corrections and a clear recommendation. No real token, Auth/network/database operations or implementation changes. This boundary does NOT independently prove PostgreSQL role/auth.uid, identity RLS, ownership, staff authorization, positive row visibility, HTTP writes or application sessions. Public-key validation is not session-revocation verification; normal sign-in changes Auth state and requires separate approval.

### Why this comes next

The narrower authenticated harness is implemented/offline-tested, but actual deployed signing-key/JWT behavior is NOT RUN. A static review must precede any real session acquisition and controlled execution. This single proposal does not authorize those steps, a session helper, application authentication, fixtures, writer/CMS or public read cutover.
