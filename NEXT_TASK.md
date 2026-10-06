# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-05

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to execute authentication or remote verification.

## Task: Static security review of the authenticated acquisition runner

### Starting checkpoint

- Committed HEAD before this uncommitted batch: `d247a31 test: add authenticated Supabase reader verifier`.
- Separate NEW `myresult` project is configured locally; public pages remain mock-backed.
- The narrower verifier and the separate local operator runner are implemented and offline-tested only. Real sign-in, token acquisition and authenticated HTTP verification are NOT RUN.
- The runner may later make exactly one normal reviewer `signInWithPassword` call only after this review and separate execution approval. It must not use service role, query `auth.users`, refresh, logout, write database data, create editor membership, or contact the old AI Test Platform project.

### Scope

1. Read `scripts/run-supabase-authenticated-reader.mjs`, its offline checker, the committed verifier/checker, environment helper and relevant documentation.
2. Confirm email/password are interactive local TTY inputs only; password is concealed and never accepted from argv/env/file/pipe/source/history.
3. Confirm SDK options are exactly `persistSession:false`, `autoRefreshToken:false`, `detectSessionInUrl:false`, with no application-client change or persistent credential/session storage.
4. Confirm at most one `signInWithPassword` call, exact user/session reviewer UUID matching, generic/redacted errors and in-memory-only access-token handoff to the unchanged verifier.
5. Confirm verifier flags/project pin/JWT signature/reader matrix/invalid-token controls remain enforced, with no endpoint or token override/fallback.
6. Review synthetic offline tests for wrong identity, missing session/token, sign-in error, disabled persistence, forbidden methods, output canaries and zero real network. Report APPROVE/DO NOT APPROVE; do not execute Auth/network/SQL.

### Exclusions

- No real sign-in, credentials in chat, token/password output, `.env.local` modification, SQL, migration/V2/anonymous rerun, database mutation, application auth/UI, dependency change, service-role, Auth admin API, commit or push.
- Do not contact, inspect, modify or clean the old AI Test Platform project.

### Definition of done

A static security verdict with any minimal corrections. Approval does not itself authorize execution. Runtime evidence must remain limited to JWT acceptance/reader grants and must not claim database-role mapping, `auth.uid`, identity RLS, ownership/staff authorization, positive row visibility, HTTP writes or application sessions.
