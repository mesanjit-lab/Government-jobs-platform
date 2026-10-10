-- Phase 2C Batch 2B: FAILURE DATABASE setup.
--
-- Run only in a separate disposable database containing Foundation + Listing
-- migrations, but NOT the Batch 2A migration. Replace the placeholder with the
-- UUID of a normal isolated-project reviewer account created through Supabase
-- Auth/Dashboard. Do not insert directly into auth.users.
--
-- This setup intentionally COMMITs a TEST_B2B_* incomplete legacy publication,
-- because the following migration attempt must see it in a separate transaction.
-- Destroy this disposable database after the failure test; do not use it again.

begin;
set local lock_timeout = '2s';
set local statement_timeout = '15s';
select set_config('test_b2b.reviewer_id', 'REPLACE_WITH_ISOLATED_REVIEWER_UUID', true);

do $$
declare
  reviewer uuid := current_setting('test_b2b.reviewer_id')::uuid;
  org_id uuid;
  recruitment_id uuid;
  source_id uuid;
  current_version bigint;
  reviewed_at timestamptz;
begin
  if to_regclass('private.batch_2b_isolated_sentinel') is null then
    raise exception 'TEST_B2B_STOP: isolated sentinel table is absent';
  end if;
  if (select count(*) from private.batch_2b_isolated_sentinel) <> 1
     or (select count(*) from private.batch_2b_isolated_sentinel where marker = 'TEST_B2B_ISOLATED_DATABASE_V1') <> 1 then
    raise exception 'TEST_B2B_STOP: isolated sentinel marker is not exact';
  end if;
  insert into public.organizations (name, short_name)
  values ('TEST_B2B_FAILURE_ORGANIZATION', 'TEST_B2B_FAILURE_ORG')
  returning id into org_id;

  insert into public.recruitments (organization_id, title, slug)
  values (org_id, 'TEST_B2B_FAILURE_INCOMPLETE_LEGACY', 'test-b2b-failure-legacy')
  returning id into recruitment_id;

  insert into public.recruitment_sources (recruitment_id, label, url, origin)
  values (recruitment_id, 'TEST_B2B_FAILURE_SOURCE', 'https://example.test/test-b2b-failure', 'manual')
  returning id into source_id;

  -- No qualification and no application_end row: Foundation permits this,
  -- Batch 2A must reject the later migration preflight.
  select content_version into current_version from public.recruitments where id = recruitment_id;
  insert into public.recruitment_reviews (
    recruitment_id, content_version, decision, reviewer_id, evidence_snapshot
  ) values (
    recruitment_id, current_version, 'verified', reviewer,
    jsonb_build_array(jsonb_build_object(
      'source_id', source_id::text,
      'url', 'https://example.test/test-b2b-failure'
    ))
  ) returning reviewed_at into reviewed_at;

  -- The reviewer FK above is the only reviewer validation. This harness never
  -- reads, inserts, updates, or deletes auth.users rows.

  update public.recruitments
  set verification_state = 'verified', verified_version = current_version,
      verified_by = reviewer, verified_at = reviewed_at, publication_state = 'published'
  where id = recruitment_id;
end;
$$;

commit;
