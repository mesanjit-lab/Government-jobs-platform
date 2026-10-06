# Supabase Foundation — operator handoff

Status as of 2026-10-06: separate NEW `myresult` Supabase project configured; safe publishable-key connectivity PASSED; foundation migration executed once successfully; 17 foundation tables deployed; controlled rollback-only SQL-role RLS verification PASSED 270 assertions; controlled anonymous HTTP projection/grant verification PASSED 108/108 checks. Remote execution/results were supplied by the owner; this documentation checkpoint did not rerun them. Local-only migration `20261006000100_public_recruitment_listing_order.sql` is pending final review/execution and has NOT been deployed; it locks `recruitments` before its empty-table precondition and revokes direct trigger-helper execution from reader roles. Authenticated JWT and positive row visibility remain unverified. Public pages remain mock-backed. Application authentication, Admin, notifications and Supabase-backed public reads are NOT IMPLEMENTED.

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

Installed: `@supabase/supabase-js` 2.117.2 and `@supabase/ssr` 0.12.7. SDK Node minimum is 22; the Node utilities use native TypeScript stripping and require Node >=22.18 (tested on 24.19.0). Native loading of env.ts currently emits a harmless MODULE_TYPELESS_PACKAGE_JSON warning; the app's module configuration was not changed to suppress it.

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

### Anonymous reader harness — Phase 1 implemented, owner-reported HTTP PASS

`scripts/verify-supabase-readers.mjs` is a separate Node-only operator utility. It does not replace `scripts/verify-supabase.mjs`, use browser/server cookie clients, implement application authentication, or connect public pages. Public pages remain mock-backed.

After the second/final static review approved the corrected harness, the owner executed it once against the independently confirmed NEW myresult project. Actual result supplied by the owner and recorded 2026-10-05:

```json
{"mode":"ANONYMOUS","authenticated":"NOT RUN","status":"PASS","ok":true,"planned":108,"completed":108,"passed":108,"categories":{"approved":14,"excluded":52,"private":25,"wildcard":17},"firstNonPass":null}
```

This establishes only the tested anonymous zero-row projection/grant boundary: 14 approved reads succeeded and 94 forbidden column/wildcard projections met the permission-denial criteria. The compact result does not report individual denial HTTP statuses, so do not infer a per-check 401/403 breakdown. Codex did not rerun the remote test. Authenticated JWT verification remains pending and is reported `NOT RUN`; this phase accepts no JWT/password, and includes no sign-in, refresh, sign-out or Auth request. No automatic rerun is authorized.

Its immutable explicit manifest matches the committed migration's 17 tables and column grants. Mandatory anonymous checks: 14 full approved public projections, 52 individual excluded public columns, and 25 individual columns across the three private tables (91 total). `--include-wildcards` adds a separately counted category of 17 forbidden wildcard projections (108 total). Salary and vacancy-count tables do not have `id`; reviews have `reviewed_at`, not `created_at`. No shared-column assumption is used.

Only GET requests are generated, with `select` from the manifest and `limit=0`, public schema, publishable `apikey`, and no Authorization/cookie header. The guarded request builder permits GET/HEAD only and rejects write methods, unknown paths/projections/options, RPC, embedding and non-hosted project origins. This phase supports HTTPS `<project-ref>.supabase.co` origins only; custom/local endpoints need separate review. Redirects are refused, requests are sequential with no retries, each request including body handling is bounded by 10 seconds, the whole run by 180 seconds, and response bodies by 16 KiB. A timeout/error/non-pass stops the run; uncompleted checks are not passes.

Classification: `PASS_ALLOWED_EMPTY` requires a successful approved read with an empty JSON array. `PASS_PERMISSION_DENIED` requires a forbidden read with HTTP 401 OR 403 AND allowlisted error code `42501`; an approved projection with that combination is `FAIL_UNEXPECTED_DENY`. Bare 401/403, JWT/API-key errors, missing relations/columns and schema-cache errors are not permission passes. The supported status pair is not a claim about an observed response from this deployment. Unexpected allows/denials fail. Network/timeout, rate-limit and server failures are inconclusive. Malformed/oversized bodies fail closed. Native fetch's redirect-refusal error can be reported as an inconclusive transport error, but is never followed or retried. CLI output is one compact JSON summary with category/completion counts and at most the first non-pass. It contains only fixed labels/manifest names, HTTP status and allowlisted codes, not URL/key/project ref/headers/JWT/records/raw bodies or exception text.

Successful zero-row checks prove only the tested projection/grant boundary: they do NOT prove row visibility, publication/child filtering with returned records, HTTP write denial, auth.uid identity behavior, or comprehensive production security. No write capability is exercised. Operational HTTP logging may still occur during a separately approved future run.

Offline command (does NOT load `.env.local`):

```powershell
node scripts/check-supabase-readers.mjs
```

The tests replace the two public env variables temporarily in process with synthetic values, mock every request, prohibit real fetch, check the full manifest against local SQL text, and restore the inherited process environment/fetch. They capture console.log/error and stdout/stderr, scan sensitive synthetic canaries, and exercise the actual CLI entry branch in isolated Node processes with synthetic env and mocked/blocked global fetch installed before import. No .env.local or inherited NODE_OPTIONS is loaded by those child tests. SQL is read as text only, never executed.

Phase 1 local results: 2,506 offline reader checks PASSED; existing 177 foundation checks and 36 fixture comparisons PASSED; TypeScript, targeted script lint, production build (22/22 static pages) and git diff --check PASSED. Initial restricted build could not fetch existing Google fonts; the unchanged build passed outside that restriction. These are local/offline results, not new Supabase HTTP/JWT evidence.

Default refusal (no network and no .env.local loading):

```powershell
node scripts/verify-supabase-readers.mjs
```

For any separately approved future run, independently open the NEW `myresult` Dashboard and obtain its project ref there, not from NEXT_PUBLIC_SUPABASE_URL. The harness additionally requires `--expected-project-ref=<independently-confirmed-ref>` together with network opt-in and the myresult attestation. The owner-completed run is not continuing authorization; no rerun is performed or authorized by this documentation task. Never share or print values. The pin is a non-credential argument, but local command/history visibility is possible; it is never echoed by the harness. The attestation is NOT automatic discovery of the Dashboard project name.

The effective process.env values are read once; Node env-file loading preserves already inherited environment values. All request URLs are built from that snapshot and their hostnames must equal the independently supplied ref plus `.supabase.co` before any fetch. Missing/malformed ref, malformed/unapproved origin, or mismatch sends zero requests. Thus an inherited old-project endpoint cannot pass a NEW-project pin. No later environment reread changes the bound requests. Offline tests cover both mismatch and mid-run env changes with synthetic refs. A wrongly confirmed ref or malicious local environment is not automatically detectable; independent Dashboard confirmation remains required.

Duplicate ref arguments and unknown arguments (including JWT/endpoint overrides) are rejected without echoing them. No additional environment variables, service-role credentials, fixtures, RPC, SQL or Auth operations are used. Do not contact the old AI Test Platform project.

Pre-execution correction validation (2026-10-05): 3,708 assertions across 86 classification/runner/CLI scenarios PASSED, including 12 isolated CLI cases and both permission statuses. Existing 177 foundation checks and 36 fixture comparisons, TypeScript, targeted lint, Node syntax checks and git diff --check PASSED at that correction step. Child-process tests require Node spawning; restricted execution returned EPERM, so the same offline-only suite passed with subprocess permission. No Supabase/network execution occurred in that correction step. Earlier production build remains historical; no build rerun in the offline-only correction. The subsequent owner-supplied anonymous HTTP result is recorded separately above; authenticated JWT remains unverified.

Documentation-checkpoint validation (2026-10-05): reran offline suites only — 3,708 reader assertions/86 scenarios, 177 foundation checks and 36/36 fixture comparisons PASSED, plus git diff --check. Both harness scripts remained byte-identical; no remote rerun, SQL, Auth/database operation or environment changes. Offline NOT RUN messages refer to the test invocation, not the owner's completed remote run. No TypeScript/build rerun for this documentation-only update; those prior results are historical.

```powershell
npm run verify:supabase
# Only after explicit project/setup approval and local public configuration:
npm run verify:supabase -- --allow-network
```

The first command rejects missing/invalid env or, with valid config, refuses network without the flag. The approved opt-in sends a timeout-limited HEAD SELECT of only recruitments.id, with limit 1, using publishable credentials and no persisted/refreshed auth session. It prints no records, URL, key or raw error body and makes no writes. A successful response proves only endpoint/read reachability, NOT correct RLS, schema completeness or existence of public data. Connectivity has passed for the new project; no request is authorized or performed by this documentation task. No debug route exists.

### Authenticated reader harness — narrower scope approved, execution NOT RUN

The owner approved implementation/offline testing only of JWT ACCEPTANCE + AUTHENTICATED HTTP READER GRANTS. `scripts/verify-supabase-authenticated-reader.mjs` is separate from the unchanged anonymous harness, reusing its frozen manifest and guarded builder/classifier. `scripts/check-supabase-authenticated-reader.mjs` uses generated synthetic ES256/RS256 keys/JWTs, mocked fetch and isolated CLI/terminal tests. `scripts/run-supabase-authenticated-reader.mjs` is a separate local operator-only acquisition runner, not application Auth: it prompts for the reviewer email and a concealed password, performs at most one normal `signInWithPassword` only during a separately approved execution, and passes an access token only in memory to the verifier. No dependency or application Auth was added.

This scope does NOT independently prove PostgreSQL authenticated role, auth.uid(), identity RLS, ownership, staff authorization, positive visibility, HTTP writes or application sessions. Current anon/authenticated grants/policies are identical, with no identity-readback endpoint. Public pages remain mock-backed. Actual authenticated execution NOT RUN; no real token acquired or sign-in/out/refresh performed.

The verifier's direct-token CLI intake is concealed TTY-only, explicitly enabled with --concealed-token; no token argument/env/file source. The new operator runner instead receives only the reviewer password through its own concealed TTY intake (maximum 1 KiB/60 seconds, no echo, restores raw mode/listeners); it never accepts a password through argv, env, file, pipe or source. Reviewer email is prompted locally and is not hardcoded. The runner configures the SDK with `persistSession:false`, `autoRefreshToken:false`, and `detectSessionInUrl:false`; it validates both returned user IDs against the pinned dedicated reviewer UUID before handing only `session.access_token` to the verifier in process memory. Password/access/refresh tokens are never printed, stored, passed through argv/env/files, or intentionally persisted. JavaScript/OS memory cannot be guaranteed securely erased; use a trusted unrecorded local terminal, never credentials/tokens in chat/history/files.

Explicit network opt-in, myresult attestation and independently Dashboard-confirmed ref are required. Effective public config/request URLs and input token are snapshotted; all hostnames and JWT issuer bind to that same project before fetch. Decoded claims are untrusted until signature validation. Bounded JWT/header/segments; exact dedicated subject, authenticated role/audience, is_anonymous=false, UUID session_id, integer exp/iat/optional nbf, conservative timing and run-cap-plus-60-second remaining lifetime. Only ES256/P-256 or RS256/2048–4096-bit public keys. Unsupported signing configuration stops rather than requesting secrets.

One future GET to the pinned `/auth/v1/.well-known/jwks.json` obtains public signing keys without a Bearer token. Require an unambiguous kid, matching algorithm/key type/use/operations and public-only material, then native Node crypto verification. Reject token-provided key URLs/extensions. No SDK: getClaims() can fall back to getUser(), which is forbidden here. No Auth user endpoint, refresh, sign-in, logout, SQL or RPC path.

Counts: 91 mandatory readers (14 approved, 52 excluded, 25 private), optional 17 wildcards (108). First approved organizations projection is counted once for valid-JWT acceptance. Two extra controls use that identical approved zero-row endpoint: signature-corrupted derivative and fixed unmistakably invalid synthetic token. One JWKS signature check yields 94 mandatory / 111 optional-total planned checks. Counts exclude acquisition/cleanup and do not represent a database identity assertion.

Reader PASS retains approved empty JSON success and forbidden HTTP 401/403 + exact 42501. Control PASS requires HTTP 401 + PGRST301; permission denial, bare status, success, other/ambiguous errors or message matching cannot pass. Do not broaden recognition automatically after remote errors. Both controls/all readers must pass; public success alone is insufficient. No anonymous fallback/refresh/retry.

Sequential GET only, redirect:error, credentials:omit/no-store, explicit manifest/limit=0 Data API requests; no caller endpoint/header/body override, embedding or writes. Request/body timeout <=10 seconds; whole-run <=180 seconds includes JWKS; API bodies <=16 KiB, JWKS <=64 KiB. Network/timeout/429/5xx inconclusive; schema/auth/format/redirect errors cannot be security passes. Native redirect refusal can appear as inconclusive transport failure, never followed. Output: fixed labels/counts/allowlisted codes only, no tokens/headers/claims/key/ref/URL/JWKS/raw responses/exception details.

Offline-only command:

```powershell
node scripts/check-supabase-authenticated-reader.mjs
```

Static review remediation (2026-10-05): duplicate JSON member names are rejected fail-closed by a recursive parser at every object level in JWT header/payload and JWKS data. It also has explicit independent limits: root depth zero with at most 32 nested value levels, and at most 1,024 parsed containers/scalar values per JSON document. These limits prevent reliance on JavaScript stack exhaustion or unbounded container allocation while comfortably exceeding normal JWT/JWKS shape. Concealed terminal input restores its prior raw state and removes only its own process/input listeners on simulated SIGINT, SIGTERM, exit, cancellation, timeout and prompt failure. With no pre-existing real-process signal handler, cleanup occurs before re-signalling; platform-specific Windows terminal behavior is still not proven by mocks.

Offline implementation validation (2026-10-05): 31,806 authenticated assertions across 178 scenarios, including 12 isolated actual CLI entry-point cases, PASSED with zero real network requests. Assertion count includes repeated synthetic-canary scans, not independent security guarantees. Coverage includes duplicate protected-header/claims/JWKS rejection including escaped-equivalent names, valid/malformed JSON grammar, depth/complexity boundaries and zero Data API probes after parser rejection, plus signal/exit cleanup, cleanup idempotency and preservation of unrelated signal listeners. Unchanged anonymous suite PASSED (3,708 assertions/86 scenarios); foundation checks PASSED (177); fixture comparisons against HEAD PASSED (36/36). Installed TypeScript noEmit/nonincremental, both Node syntax checks, targeted ESLint and git diff --check PASSED; complete diff reviewed. No build rerun because this task is offline-only and the existing build downloads fonts. No dependencies, application/anonymous harness/migration/env changes. Real terminal concealment and deployed JWT/signing/API behavior are not established by these mocks.

The runner is implemented/offline-tested only. Next proposed gate is static security review of this acquisition path before any execution. A later normal sign-in may create server-side Auth session/audit/last-sign-in metadata; it is the only approved Auth mutation category for a separately approved controlled run. No direct `auth.users` insertion/query, service-role use, Auth admin API, refresh, logout or persistent local session is permitted. Actual deployed signing support/JWT behavior remains unverified.

## Migration and security boundary

Local file: `supabase/migrations/20261002000100_recruitment_foundation.sql`.

It creates the 17 exact Core V1 tables in DATABASE.md, constrained child relationships, private append-only reviews/provenance, version invalidation and public read policies. No user profile, tracking, notification, auth UI, Admin UI or public mutation endpoint is added. No real/sample government rows are seeded.

Every table enables RLS and revokes untrusted table privileges. Only 14 public content tables receive deliberate column SELECT grants plus parent/current-verification predicates. Sources, reviews and memberships stay private. There are zero public INSERT/UPDATE/DELETE policies and no application service-role client. Existing authenticated users have the same public-read/no-write access as anonymous users; membership rows do not grant functionality yet.

Private SECURITY DEFINER read predicates use an empty search_path and fully qualified relations. Keep `private` OUT of the Data API exposed schemas and keep the trusted migration owner. This intentionally bypasses RLS only inside narrow read predicates to avoid recursive policies, not as a write API. Do not introduce FORCE RLS/ownership changes without reviewing that design. See [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

Publishing structurally requires current version-bound human review/evidence, active organization and stable public identity. Editing parent/child/source content withdraws stale verification. Independently published updates also require a public parent. SQL cannot establish factual authenticity: a later authorized editorial service and real human review remain mandatory. Application role checks, optimistic expected-version matching and safe transaction/lock ordering are still future work, not implied by this migration.

No CLI installation or linking was needed for the owner-run Dashboard migration and rollback-only verification. Static review covered order, FKs, enum/check alignment, RLS/policy targets, grants, indexes, names, function search paths and destructive statements. Runtime evidence now covers the 270 cases above, not every possible constraint, trigger path, identity or concurrency scenario.

## Remaining gates after separate approval

1. Anonymous harness/static review/owner HTTP run complete within scope (PASS 108/108). Narrower authenticated verifier/offline tests implemented; NEXT_TASK.md proposes static security review before any session acquisition. No new remote run authorized.
2. Actual authenticated execution NOT RUN. Static review precedes separately approved normal session acquisition/cleanup and controlled execution. No password/JWT in chat/logs/commits or Auth operation now. Preserve excluded database-role/auth.uid/ownership/row-visibility/write/session guarantees; do not seed fixtures, expose identity RPCs or rerun V2 to expand scope.
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
