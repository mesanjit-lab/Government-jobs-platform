# Supabase Foundation Phase 1 — local operator handoff

Status: local clients, SQL and scripts implemented. Remote project NOT CONNECTED. Migration STATIC REVIEW performed; DATABASE EXECUTION NOT VERIFIED. Public pages remain mock-backed. Admin, authentication and notifications NOT IMPLEMENTED.

## Configuration and clients

Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are accepted. `.env.example` contains blank placeholders; `.env.local` remains ignored. Do not supply a service-role/secret key or legacy JWT. The config parser requires an HTTPS origin (HTTP allowed only for loopback) and a modern publishable-key prefix; it is format validation, not proof the key belongs to a project.

No credentials are required to import the factories or build the existing mock site. Public values supplied to Next.js are build-time browser configuration; rebuild when changing them later. No unsafe fallback, hidden privileged client or real configuration was added.

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

Observed post-security-update results on Next.js 16.3.8: 177 offline checks and 36 fixture comparisons PASSED; standalone TypeScript PASSED; production build PASSED (exit 0, 22/22 static pages, no .env.local); git diff --check PASSED. Compilation took 9.9 minutes and build TypeScript took 3.5 minutes; the single build was allowed to finish. The earlier Phase 1 operator command without configuration exited 1 with a clear missing-env message and no request. These results do not verify a real database connection or SQL execution.

## Read connectivity mechanism (DO NOT run against a project until approved)

```powershell
npm run verify:supabase
# Only after explicit project/setup approval and local public configuration:
npm run verify:supabase -- --allow-network
```

The first command rejects missing/invalid env or, with valid config, refuses network without the flag. The approved opt-in sends a timeout-limited HEAD SELECT of only recruitments.id, with limit 1, using publishable credentials and no persisted/refreshed auth session. It prints no records, URL, key or raw error body and makes no writes. A successful response proves only endpoint/read reachability, NOT correct RLS, schema completeness or existence of public data. Without real credentials no connection success is claimed. No debug route exists.

## Migration and security boundary

Local file: `supabase/migrations/20261002000100_recruitment_foundation.sql`.

It creates the 17 exact Core V1 tables in DATABASE.md, constrained child relationships, private append-only reviews/provenance, version invalidation and public read policies. No user profile, tracking, notification, auth UI, Admin UI or public mutation endpoint is added. No real/sample government rows are seeded.

Every table enables RLS and revokes untrusted table privileges. Only 14 public content tables receive deliberate column SELECT grants plus parent/current-verification predicates. Sources, reviews and memberships stay private. There are zero public INSERT/UPDATE/DELETE policies and no application service-role client. Existing authenticated users have the same public-read/no-write access as anonymous users; membership rows do not grant functionality yet.

Private SECURITY DEFINER read predicates use an empty search_path and fully qualified relations. Keep `private` OUT of the Data API exposed schemas and keep the trusted migration owner. This intentionally bypasses RLS only inside narrow read predicates to avoid recursive policies, not as a write API. Do not introduce FORCE RLS/ownership changes without reviewing that design. See [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

Publishing structurally requires current version-bound human review/evidence, active organization and stable public identity. Editing parent/child/source content withdraws stale verification. Independently published updates also require a public parent. SQL cannot establish factual authenticity: a later authorized editorial service and real human review remain mandatory. Application role checks, optimistic expected-version matching and safe transaction/lock ordering are still future work, not implied by this migration.

No Supabase/PostgreSQL/Docker CLI is available or installed. Static review covered order, FKs, enum/check alignment, RLS/policy targets, grants, indexes, names, function search paths and destructive statements. Actual SQL syntax/constraint/trigger behavior and RLS are NOT database-tested.

## Manual gates after separate approval

1. Resolve/review the existing dependency advisories below before production exposure.
2. Approve an isolated Supabase test project or local database/tooling separately. Do not point unexecuted SQL at an existing production database. Check existing objects/roles, migration ownership and exposed-schema configuration first.
3. Apply the versioned migration using approved tooling; record success/failure and retain migration history. No CLI setup or remote migration was performed here.
4. Execute rollback-scoped tests using explicitly synthetic records and a test auth identity: defaults; cross-parent FK failures; scalar constraints; missing evidence; current/stale/rejected reviews; publication; edits to each child/source/organization; independent update visibility; archive/delete protection; anonymous and authenticated reads and INSERT/UPDATE/DELETE denial; denial of private/audit columns; concurrency and rollback behavior. Test service-role/owner separately because they bypass RLS.
5. Review query plans/indexes and deadlock/retry behavior. Generate database types only from the verified schema. Review numeric/decimal mapping and unknown-value preservation before implementing a writer.
6. Supply the two PUBLIC values locally without committing them; only then explicitly opt in to the read check. Never log credentials or place privileged keys in the browser.
7. Separately approve staff authorization/publication service, UUID/legacy routing, DTO adapter and server-to-client loading. Do not seed the existing recruitment mocks as verified government data.

## Dependency audit — Next.js resolved; development tooling concern remains

Before the security update, `npm audit --json` reported TWO affected packages: one high and one critical (multiple advisories can apply to one package). After the explicitly approved Next.js update, the audit reports ONE high affected package and ZERO critical findings; Next.js is absent from the findings. The remaining brace-expansion versions are unchanged and dev-only in the lockfile. No Supabase-package advisory was reported. No audit fix, forced brace-expansion version, unrelated direct update or CLI installation was performed.

| Package | Scope / dependency path | Finding / patch | Action and foundation relevance |
| --- | --- | --- | --- |
| brace-expansion 1.1.18 and 5.0.9 | Transitive, lockfile dev-only. Paths include eslint-config-next → eslint-plugin-import → minimatch → brace-expansion, and eslint-config-next → typescript-eslint → @typescript-eslint/typescript-estree → minimatch → brace-expansion. | Aggregate HIGH. Nested/parseCommaParts recursion causes stack-exhaustion DoS; another moderate advisory describes quadratic CPU DoS. Patched same-major versions covering the findings: 1.1.21 and 5.0.12. | Request approval for a narrowly scoped lint dependency/lockfile refresh, verify installed paths and rerun lint/build/audit. Not part of the new SDK runtime, but malicious tooling inputs remain a development risk. Outside the two approved packages. |
| next 16.3.4 → 16.3.8 | Direct production runtime dependency: project → next. | RESOLVED in the post-update audit: formerly CRITICAL GHSA-vcvr-r3jv-pc5j, RCE in next/og ImageResponse; reported affected >=16.2.0 <16.3.6. | Applied the approved exact security patch. No Next.js finding remains in the audit. ESLint configuration, React, React DOM and Supabase versions were preserved. |

Advisories: [brace CPU DoS](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [brace nested recursion](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [brace parsing recursion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p), [Next advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j). Next details above are from the actual npm audit response; the advisory web page could not be fetched during this review. Installation also reported the pre-existing unapproved unrs-resolver postinstall; no approve-scripts action was taken.

A verified local source checkpoint can be reviewed separately from dependency remediation. Do not interpret a green build or safe-to-checkpoint assessment as production security clearance or database execution approval.
