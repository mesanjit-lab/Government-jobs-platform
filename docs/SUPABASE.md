# Supabase Foundation — operator handoff

Status as of 2026-10-04: separate NEW `myresult` Supabase project configured; safe publishable-key connectivity PASSED; foundation migration executed once successfully; 17 foundation tables deployed; controlled rollback-only SQL-role RLS verification PASSED 270 assertions. Remote execution/results were supplied by the owner; this documentation checkpoint did not rerun them. Public pages remain mock-backed. Application authentication, Admin, notifications and Supabase-backed public reads are NOT IMPLEMENTED.

## Verified remote checkpoint and isolation boundary

- Source checkpoint: `1e2720f feat: add Supabase foundation and patch Next.js`. The committed migration remains unchanged.
- Local `.env.local` is configured for the NEW `myresult` project and ignored by Git. Record environment variable NAMES only; never document the URL, publishable key, tokens, passwords or other credentials. No environment file was read or changed in this documentation task.
- The owner executed `supabase/migrations/20261002000100_recruitment_foundation.sql` once successfully through the Dashboard. All 17 foundation tables exist. DO NOT rerun the migration or the completed V2 suite.
- Catalog preflight: PASS_WITH_FINDINGS; 17/17 tables with RLS, 14/14 intended SELECT policies, no unexpected/public write policies, privilege problems or private-table exposure; 16/16 triggers, 7/7 private functions and constraint metadata matched. No BLOCKER/HIGH findings. The two known MEDIUM findings remain: `KNOWN_EDITORIAL_LOCK_ORDER_RISK` and `KNOWN_REVIEW_ORDERING_RISK`.
- Safe publishable connectivity passed. Earlier approved read-only API probes returned HTTP 200 for 14 approved public projections; restricted wildcard and private-table probes returned HTTP 401. These probes alone do not establish authenticated JWT or positive record-visibility behavior.
- Corrected runtime scope `TEST_MYRESULT_RLS_V2`: result PASS, assertion_count 270. The harness-only UPDATE correction uses `reviewed_at` for `recruitment_reviews`, and `created_at` for the other 16 tables; no schema change was needed.

| Runtime category | Passed assertions |
| --- | ---: |
| preconditions | 1 |
| recruitment_visibility | 10 |
| child_visibility | 44 |
| column_projection | 28 |
| private_reads | 6 |
| write_grants | 34 |
| unauthorized_writes | 102 |
| update_visibility | 8 |
| version_invalidation | 25 |
| workflow_guards | 12 |
| Total | 270 |

- Reported safety flags: `fixture_mutations_already_rolled_back=true`, `foundation_tables_empty_after_rollback=true`, `existing_reviewer_account_unchanged=true`; `ddl_executed=false`, `auth_mutations=false`, `service_role_used=false`, `explicit_auth_user_row_queries=false`. No TEST fixtures or temporary editor membership remained after the successful rollback.
- A dedicated normal test reviewer was created separately by the owner through Supabase Authentication with explicit approval. That account persists outside the test transaction and was not modified by the suite. Its existence is NOT application authentication or staff authorization implementation. Do not insert synthetic Auth users or automatically delete this account.
- Normal MyResult work must never contact, inspect, modify or clean the old AI Test Platform Supabase project. Accidental MyResult objects there are a separately scoped future cleanup task, not authorization for this checkpoint.

### Runtime limits and remaining security work

- SQL roles `anon` and `authenticated` were tested, not HTTP/JWT/`auth.uid()` identity behavior.
- Forbidden publication states were tested as rejected writes, not persisted invalid states.
- Write-denial tests cover the current absence of editorial grants; they do not verify a future authorized staff writer.
- One child UPDATE represents child invalidation; not every child mutation permutation or organization-edit path was runtime-tested by this suite.
- Known review-ordering and concurrent lock-order risks remain; no concurrency/retry or query-plan coverage is claimed.
- This is a controlled isolated foundation checkpoint, not production security clearance, official-data verification, or approval to switch public reads.

## Configuration and clients

Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are accepted. `.env.example` contains blank placeholders; `.env.local` remains ignored. Do not supply a service-role/secret key or legacy JWT. The config parser requires an HTTPS origin (HTTP allowed only for loopback) and a modern publishable-key prefix; it is format validation, not proof the key belongs to a project.

No credentials are required to import the factories or build the existing mock site. Public values supplied to Next.js are build-time browser configuration; rebuild when changing them later. Configuration now exists only in ignored local environment storage; no unsafe fallback, hidden privileged client or credentials were added to tracked files. Vercel environment configuration is not verified by this checkpoint.

Browser factory: `lib/supabase/client.ts`, client-only, uses `createBrowserClient`.
Server factory: `lib/supabase/server.ts`, server-only, new instance per request, awaits Next cookies. Reads use getAll. Cookie writes require an explicit future response writer applying BOTH cookies and the SSR package's cache headers; the default callback throws instead of pretending sessions were persisted. Auth Proxy/session refresh/UI are deferred because no auth workflow uses this foundation.

Installed: `@supabase/supabase-js` 2.117.2 and `@supabase/ssr` 0.12.7. SDK Node minimum is 22; the two Node utilities use native TypeScript stripping and require Node >=22.18 (tested on 24.19.0). Native loading of env.ts currently emits a harmless MODULE_TYPELESS_PACKAGE_JSON warning; the app's module configuration was not changed to suppress it.

Approved security continuation: Next.js was updated from the exact pin 16.3.4 to 16.3.8 with `npm install next@16.3.8 --save-exact`. React/React DOM remain 19.2.8; both Supabase versions and all other direct dependencies remain unchanged. The lockfile updated only Next.js, @next/env and its eight SWC platform packages to 16.3.8; no other package nodes changed during this update. npm changed three installed packages. Foundation code, scripts, SQL and env-template hashes match the pre-update snapshot.

Current API references: [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Next.js server/client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning). Next handles server-only/client-only markers; no third dependency was installed.

## Offline checks

From the repository root (PowerShell):

```powershell
git show HEAD:lib/data/recruitments.ts | node scripts/check-supabase-foundation.mjs
npx tsc --noEmit
git diff --check
npm run build
```

The offline script uses synthetic configuration and mocked fetches only. It checks env rejection/acceptance, read-only request shape and redaction, cookie factory wiring/request scoping, package version agreement, textual SQL safeguards, and 36 deep-equality selector comparisons with HEAD. It never loads .env.local or contacts a database. SQL text checks cannot replace a parser/execution test. No test framework/package was added.

Historical post-security-update results on Next.js 16.3.8: 177 offline checks and 36 fixture comparisons PASSED; standalone TypeScript PASSED; production build PASSED (exit 0, 22/22 static pages, no .env.local); git diff --check PASSED. Compilation took 9.9 minutes and build TypeScript took 3.5 minutes; the single build was allowed to finish. The earlier Phase 1 operator command without configuration exited 1 with a clear missing-env message and no request. Those local checks do not establish remote execution; the later owner-supplied remote checkpoint above records separate connectivity/catalog/runtime evidence.

## Read connectivity mechanism (future reruns require explicit approval)

```powershell
npm run verify:supabase
# Only after explicit project/setup approval and local public configuration:
npm run verify:supabase -- --allow-network
```

The first command rejects missing/invalid env or, with valid config, refuses network without the flag. The approved opt-in sends a timeout-limited HEAD SELECT of only recruitments.id, with limit 1, using publishable credentials and no persisted/refreshed auth session. It prints no records, URL, key or raw error body and makes no writes. A successful response proves only endpoint/read reachability, NOT correct RLS, schema completeness or existence of public data. Connectivity has passed for the new project; no request is authorized or performed by this documentation task. No debug route exists.

## Migration and security boundary

Local file: `supabase/migrations/20261002000100_recruitment_foundation.sql`.

It creates the 17 exact Core V1 tables in DATABASE.md, constrained child relationships, private append-only reviews/provenance, version invalidation and public read policies. No user profile, tracking, notification, auth UI, Admin UI or public mutation endpoint is added. No real/sample government rows are seeded.

Every table enables RLS and revokes untrusted table privileges. Only 14 public content tables receive deliberate column SELECT grants plus parent/current-verification predicates. Sources, reviews and memberships stay private. There are zero public INSERT/UPDATE/DELETE policies and no application service-role client. Existing authenticated users have the same public-read/no-write access as anonymous users; membership rows do not grant functionality yet.

Private SECURITY DEFINER read predicates use an empty search_path and fully qualified relations. Keep `private` OUT of the Data API exposed schemas and keep the trusted migration owner. This intentionally bypasses RLS only inside narrow read predicates to avoid recursive policies, not as a write API. Do not introduce FORCE RLS/ownership changes without reviewing that design. See [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

Publishing structurally requires current version-bound human review/evidence, active organization and stable public identity. Editing parent/child/source content withdraws stale verification. Independently published updates also require a public parent. SQL cannot establish factual authenticity: a later authorized editorial service and real human review remain mandatory. Application role checks, optimistic expected-version matching and safe transaction/lock ordering are still future work, not implied by this migration.

No CLI installation or linking was needed for the owner-run Dashboard migration and rollback-only verification. Static review covered order, FKs, enum/check alignment, RLS/policy targets, grants, indexes, names, function search paths and destructive statements. Runtime evidence now covers the 270 cases above, not every possible constraint, trigger path, identity or concurrency scenario.

## Remaining gates after separate approval

1. Prepare a read-only HTTP/JWT reader-access verification plan for the NEW project. This is the single proposed next task, awaiting approval in NEXT_TASK.md; do not implement auth or run requests in this checkpoint.
2. Any future execution needs its own approval, safe normal-user token handling and redacted outputs. Empty tables/read-only requests cannot prove positive public-record visibility or every identity-dependent policy; record those limits rather than seed data or rerun V2.
3. Assess the known review-ordering/lock-order risks, missing mutation permutations and concurrency/retry scenarios before introducing an authorized writer. No service-role usage is authorized by this handoff.
4. Review query plans/indexes; generate database types and define numeric/decimal mapping, missing-detail behavior and legacy ID/UUID routing before a read adapter. These are later separately approved tasks.
5. Separately approve staff authorization/publication services, safe DTO projections and server-to-client loading. Keep current public pages mock-backed until their explicit integration task; mocks are not verified production seeds.
6. Resolve/review the existing development-tooling advisory below before production exposure. No automatic audit fix or dependency change is part of this checkpoint.

## Dependency audit — Next.js resolved; development tooling concern remains

Before the security update, `npm audit --json` reported TWO affected packages: one high and one critical (multiple advisories can apply to one package). After the explicitly approved Next.js update, the audit reports ONE high affected package and ZERO critical findings; Next.js is absent from the findings. The remaining brace-expansion versions are unchanged and dev-only in the lockfile. No Supabase-package advisory was reported. No audit fix, forced brace-expansion version, unrelated direct update or CLI installation was performed.

| Package | Scope / dependency path | Finding / patch | Action and foundation relevance |
| --- | --- | --- | --- |
| brace-expansion 1.1.18 and 5.0.9 | Transitive, lockfile dev-only. Paths include eslint-config-next → eslint-plugin-import → minimatch → brace-expansion, and eslint-config-next → typescript-eslint → @typescript-eslint/typescript-estree → minimatch → brace-expansion. | Aggregate HIGH. Nested/parseCommaParts recursion causes stack-exhaustion DoS; another moderate advisory describes quadratic CPU DoS. Patched same-major versions covering the findings: 1.1.21 and 5.0.12. | Request approval for a narrowly scoped lint dependency/lockfile refresh, verify installed paths and rerun lint/build/audit. Not part of the new SDK runtime, but malicious tooling inputs remain a development risk. Outside the two approved packages. |
| next 16.3.4 → 16.3.8 | Direct production runtime dependency: project → next. | RESOLVED in the post-update audit: formerly CRITICAL GHSA-vcvr-r3jv-pc5j, RCE in next/og ImageResponse; reported affected >=16.2.0 <16.3.6. | Applied the approved exact security patch. No Next.js finding remains in the audit. ESLint configuration, React, React DOM and Supabase versions were preserved. |

Advisories: [brace CPU DoS](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [brace nested recursion](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [brace parsing recursion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p), [Next advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j). Next details above are from the actual npm audit response; the advisory web page could not be fetched during this review. Installation also reported the pre-existing unapproved unrs-resolver postinstall; no approve-scripts action was taken.

A verified foundation checkpoint can be reviewed separately from dependency remediation. Neither a green build nor the bounded runtime PASS is comprehensive production security clearance. No migration rerun, V2 rerun, remote mutation or old-project cleanup is authorized by this handoff.
