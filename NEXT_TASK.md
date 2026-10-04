# NEXT_TASK.md — Single Proposed Next Task

Last updated: 2026-10-04

## Status

PROPOSED — awaiting explicit owner approval. This file is not authorization to start, implement or execute the next task.

## Task: Prepare a read-only HTTP/JWT reader-access verification plan

### Starting checkpoint

- Committed source: `1e2720f feat: add Supabase foundation and patch Next.js`.
- Separate NEW `myresult` Supabase project configured; publishable connectivity passed.
- Foundation migration executed once; 17 tables deployed. Owner reports corrected rollback-only TEST_MYRESULT_RLS_V2 PASS, 270 assertions, all fixtures rolled back and foundation tables empty afterward.
- Public application remains mock-backed. Application authentication, Admin, staff authorization and Supabase read adapters are not implemented.
- SQL-role verification does not establish HTTP/JWT/auth.uid behavior. Known review-ordering and concurrent lock-order risks remain.

### Scope of the proposed planning task

1. Design an explicit read-only Data API test matrix for publishable anonymous requests and a normal authenticated test-user JWT, using approved public projections, restricted wildcard probes and private-table denial checks.
2. Define safe local token handling, project confirmation, minimal/redacted outputs and stop conditions. Do not ask for credentials or tokens in chat, use service_role, or query Auth user rows.
3. Identify what can be established with empty foundation tables and what remains untested: positive record visibility and identity-dependent behavior must not be claimed from empty responses. Current reader policies do not use auth.uid(); preparing this plan does not prove future user-owned policies.
4. Deliver the plan for review only. Any token acquisition/Auth session step or HTTP execution requires separate explicit approval; do not run it as part of planning.

### Exclusions

- No application/auth implementation, public-page cutover, Admin CMS, database writes, fixtures, dependency changes or schema/policy/grant changes.
- Do not rerun the migration or completed V2 suite.
- Do not contact, inspect, modify or clean the old AI Test Platform project.
- Do not modify or commit `.env.local`; accepted public names are NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Never print their values or any JWT/password/key.
- Do not start unrelated advisory remediation or concurrency work; those remain separately scoped future tasks.

### Definition of done

A beginner-readable, bounded read-only verification plan with separate execution approval gates, expected response checks, identity/empty-table limitations and no remote actions or implementation changes.

### Why this comes next

It addresses the explicit HTTP/JWT coverage gap before auth or real-read integration, without adding fixtures, a writer, a CMS or a production cutover. The old broad database-setup/homepage-migration outline is superseded, not permission to seed mock government data or repeat the completed migration.
