# Phase 2C Batch 2B — Isolated Database Test Harness

Status: **offline harness prepared; not executed or approved for execution**.

This guide is for the committed Batch 2A draft migration only. It is not an
approval to connect to a database, create a project, create an Auth account,
apply SQL, or deploy to the dedicated MyResult project. Never use the old AI
Test Platform project.

## Files

- `supabase/tests/phase_2c_batch_2b_success_catalog.sql` — run after a
  successful Batch 2A migration in the isolated success database. It checks
  PostgreSQL 15+ compatibility, `security_invoker`, explicit view columns,
  trigger/index presence, reader grants, and private-helper/table exclusion.
- `supabase/tests/phase_2c_batch_2b_fixture_rollback.sql` — transactional
  success-database fixture scenarios. It ends in `ROLLBACK` and includes a
  separate-session zero-fixture query.
- `supabase/tests/phase_2c_batch_2b_failure_setup.sql` — the one deliberate
  exception to rollback-only fixtures. It commits an incomplete legacy
  publication in a disposable failure database so the migration preflight can
  see it.
- `supabase/tests/phase_2c_batch_2b_failure_assertions.sql` — run after the
  controlled runner's expected failed Batch 2A application to prove the
  migration left no partial Batch 2A objects. It has no success output and is
  not standalone proof of preflight behavior.
- `supabase/tests/phase_2c_batch_2b_post_rollback_assertions.sql` — a
  read-only fresh-session check covering every public table touched by the
  success fixture; it must find zero synthetic traces.
- `scripts/check-public-recruitment-card-isolated-tests.mjs` — local text and
  structural checks only; it does not parse or execute SQL and opens no network
  connection.
- `scripts/run-public-recruitment-card-failure-test.mjs` — a future
  operator-only `psql` runner. It checks an exact disposable target name and
  sentinel before attempting the migration, requires the exact expected
  PostgreSQL failure, and only then opens a fresh assertion session. It is not
  authorized for execution by this document.
- `scripts/check-public-recruitment-card-failure-runner.mjs` — offline
  sequencing and fail-closed tests for that runner; it opens no database
  connection.

## Required isolated topology

Use disposable databases/projects only. The recommended arrangement is two
separate isolated projects or resettable databases:

1. **Success database:** apply Foundation, Listing Order, then Batch 2A to an
   empty baseline. Run catalog assertions, then rollback-only fixtures.
2. **Failure database:** apply Foundation and Listing Order only. Commit the
   intentionally incomplete `TEST_B2B_FAILURE_*` legacy fixture, attempt Batch
   2A once, expect failure, then run failure assertions.

The Batch 2A migration has its own `BEGIN`/`COMMIT`; a successful migration
cannot be rolled back by wrapping it in a caller transaction. Destroy the
disposable project/database after review instead of editing, rerunning, or
rolling back migrations. No automated cleanup is authorized.

## Preconditions

Before a separately approved execution, the operator must confirm:

1. Dashboard/project identity is a new disposable MyResult test environment,
   not the deployed project and not the old AI Test Platform.
2. A separately approved trusted operator has provisioned exactly one persistent
   sentinel row in that disposable database only:

   ```sql
   create table private.batch_2b_isolated_sentinel (
     singleton boolean primary key default true check (singleton),
     marker text not null check (marker = 'TEST_B2B_ISOLATED_DATABASE_V1')
   );
   revoke all on table private.batch_2b_isolated_sentinel from public, anon, authenticated;
   insert into private.batch_2b_isolated_sentinel (marker)
   values ('TEST_B2B_ISOLATED_DATABASE_V1');
   ```

   This is a manual, one-time isolated-environment provisioning action, not an
   ordinary harness script and not production deployment SQL. The trusted test
   executor must be able to read it; anon/authenticated must not. Every Batch
   2B entry script requires the table and exactly this one marker before it
   reads or mutates test data. The guard is intentionally fail-closed.
3. PostgreSQL is version 15 or newer and accepts a view with
   `security_invoker = true`.
4. The migration executor is the trusted schema owner and may create the
   draft's function, trigger, indexes, and view.
5. `psql` is installed locally, and a locally maintained `pg_service.conf`
   service name can reach only the disposable failure database. Credentials
   remain outside this repository, command history, environment template, and
   runner output. The operator separately supplies an exact expected database
   name; the runner rejects a mismatch before attempting the migration.
6. The test environment is otherwise free of `TEST_B2B_*` public fixtures.
7. If review fixtures need a reviewer FK, a normal isolated-project reviewer
   account was manually created through Supabase Auth/Dashboard. Copy its UUID
   into the placeholder only at execution time. Never insert into `auth.users`.
8. No credentials, project URLs, keys, tokens, passwords, or real recruitment
   data are placed in SQL files, chat, logs, or repository files.

The sentinel is a deliberate execution gate, not proof of project identity:
an operator who copies it into another database defeats that protection. Keep
its creation outside ordinary scripts, never create it in the deployed project,
and verify Dashboard identity separately. No test script creates, updates, or
deletes the sentinel.

## Exact execution order after separate approval

1. Create the disposable success and failure databases/projects.
2. Apply Foundation and Listing Order migrations once to both.
3. In the failure database, replace the reviewer placeholder locally and run
   `phase_2c_batch_2b_failure_setup.sql`. This intentionally commits one
   synthetic legacy row.
4. Run the separately approved runner once with its explicit database opt-in,
   exact expected target name, and non-secret `pg_service.conf` service name.
   Each `psql` invocation receives both `service=<service>` and the validated
   explicit `dbname=<expected-target>` parameter; implicit/default database
   selection is rejected. The runner first checks the exact target database
   name, exactly one sentinel marker,
   exactly one committed failure fixture, no Batch 2A objects, and no other
   recruitment rows. It then attempts Batch 2A once. The attempt must fail
   with SQLSTATE `P0001` and exactly this message:
   `Public card migration requires every published recruitment to be complete`.
   Any other error, an unexpected success, or any failed preflight is FAIL; the
   runner must not invoke assertions. `psql` exits after the migration error,
   so PostgreSQL rolls back the aborted migration transaction when that session
   closes. This does **not** remove the separately committed legacy fixture.
5. Only after that exact runner-verified failure does the runner open a fresh
   assertion session and run `phase_2c_batch_2b_failure_assertions.sql`. The
   SQL file emits no PASS; the Node runner is the sole PASS reporter, and only
   reports PASS after the assertion process exits successfully. Do not use a
   standalone SQL assertion outcome as evidence of migration-preflight behavior.
6. In the success database, verify the recruitment table is empty, then apply
   Batch 2A once.
7. Run `phase_2c_batch_2b_success_catalog.sql`.
8. Replace the reviewer placeholder only in the local execution copy of
   `phase_2c_batch_2b_fixture_rollback.sql`, then run it once.
9. In a fresh trusted session, run
   `phase_2c_batch_2b_post_rollback_assertions.sql`. It must return PASS and
   find zero synthetic traces in all touched tables.
10. Capture compact PASS/FAIL/error identifiers only. Destroy both disposable
   environments after review.

## Assertions

The success fixture covers a complete publication, exact organization/recruitment
mapping, original `published_at`, canonical deadline, ordered qualification JSON,
missing qualification,
missing/null/conflicting application-end dates, identical duplicate dates,
numeric-only and malformed slugs, child invalidation, organization
invalidation, republishing with unchanged `published_at`, security-invoker
view visibility, reader roles, private table denial, and private-column
exclusion. It uses `SET LOCAL ROLE anon` and `authenticated`; this establishes
the SQL role/grant/RLS boundary only. It does not establish HTTP/JWT,
`auth.uid()`, browser sessions, or Data API behavior.

## Transaction and lock safety

Ordinary fixtures run between `BEGIN` and `ROLLBACK`; the fixture PASS result
is emitted only after `ROLLBACK` completes. Temporary helper functions are
created in `pg_temp` and disappear with rollback/session end.
If an unexpected SQL error prevents the final `ROLLBACK` from running, issue
`ROLLBACK` once (or disconnect if the client cannot accept it), preserve the
error, and stop for review. Do not rerun. No PASS output is cleanup evidence;
the fresh-session post-rollback script is the separate persistent-cleanup gate.

The migration obtains `ACCESS EXCLUSIVE` on `public.recruitments`; it blocks
conflicting reads and writes. Its ordinary index creation is also not
concurrent. Use the disposable test environment without other sessions. Any
future production deployment needs a separate maintenance-window decision,
lock monitoring, a fresh published-row precondition check, and explicit owner
approval.

## Error-format and locale handling

The failure runner preserves any inherited `PGOPTIONS` session settings,
trims only surrounding whitespace, and appends `-c lc_messages=C` for each
spawned `psql` child alongside verbose error output. It then requires exactly
SQLSTATE `P0001` and the exact English
preflight message. It does not accept an approximate message. If the target
server rejects the requested session locale, produces a different diagnostic
format, or `psql` does not return its expected script-error exit code, the run
fails closed and does not open assertions. The client cannot independently
prove every server's locale configuration before connecting; controlled
execution therefore also requires a PostgreSQL/`psql` compatibility check in
the disposable environment.

## Stop/go criteria

Stop immediately if PostgreSQL lacks `security_invoker` support, a migration
leaves partial objects after expected failure, a complete card is not visible,
an incomplete/invalid card is visible, an edit leaves stale content public,
`published_at` changes on republish, a private table/field is readable, or a
`TEST_B2B_*` fixture persists after rollback.

Only request the next review when every assertion passes, no synthetic data
remains, and the results confirm the draft's security-invoker, grant, and
publication-boundary assumptions. A production deployment, cursor work, and
page/UI cutover each still require separate approval.
