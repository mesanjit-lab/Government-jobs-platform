-- Phase 2C Batch 2B: SUCCESS DATABASE transactional fixture tests.
--
-- Preconditions: this is a disposable isolated database; Foundation, Listing,
-- and Batch 2A migrations applied successfully; public.recruitment tables are
-- otherwise empty. Replace the reviewer UUID placeholder with a normal isolated
-- Auth account. This script does not insert into or select auth.users rows.
-- Every TEST_B2B_* fixture is rolled back at the end. If the SQL editor stops
-- at an unexpected error before the last statement, run ROLLBACK once, inspect
-- the error, and do not rerun until reviewed.

begin;
set local lock_timeout = '2s';
set local statement_timeout = '30s';
select set_config('test_b2b.reviewer_id', 'REPLACE_WITH_ISOLATED_REVIEWER_UUID', true);

do $$
begin
  if to_regclass('private.batch_2b_isolated_sentinel') is null then
    raise exception 'TEST_B2B_STOP: isolated sentinel table is absent';
  end if;
  if (select count(*) from private.batch_2b_isolated_sentinel) <> 1
     or (select count(*) from private.batch_2b_isolated_sentinel where marker = 'TEST_B2B_ISOLATED_DATABASE_V1') <> 1 then
    raise exception 'TEST_B2B_STOP: isolated sentinel marker is not exact';
  end if;
end;
$$;

create function pg_temp.assert_true(condition boolean, message text)
returns void language plpgsql as $$
begin
  if condition is distinct from true then raise exception 'TEST_B2B_FAIL: %', message; end if;
end;
$$;

create function pg_temp.seed_draft(
  fixture text,
  fixture_slug text,
  add_qualification boolean,
  deadline_values date[],
  add_null_deadline boolean default false
) returns uuid language plpgsql as $$
declare
  org_id uuid;
  recruitment_id uuid;
  deadline date;
begin
  insert into public.organizations (name, short_name)
  values ('TEST_B2B_' || fixture || '_ORGANIZATION', 'TEST_B2B_' || fixture || '_ORG')
  returning id into org_id;
  insert into public.recruitments (organization_id, title, slug)
  values (org_id, 'TEST_B2B_' || fixture || '_RECRUITMENT', fixture_slug)
  returning id into recruitment_id;
  insert into public.recruitment_sources (recruitment_id, label, url, origin)
  values (recruitment_id, 'TEST_B2B_' || fixture || '_SOURCE', 'https://example.test/test-b2b/' || lower(fixture), 'manual');
  if add_qualification then
    insert into public.recruitment_eligibility_rules (recruitment_id, qualification)
    values (recruitment_id, 'TEST_B2B_' || fixture || '_QUALIFICATION');
  end if;
  foreach deadline in array deadline_values loop
    insert into public.recruitment_dates (recruitment_id, kind, label, date)
    values (recruitment_id, 'application_end', 'TEST_B2B_' || fixture || '_DEADLINE', deadline);
  end loop;
  if add_null_deadline then
    insert into public.recruitment_dates (recruitment_id, kind, label, date, notes)
    values (recruitment_id, 'application_end', 'TEST_B2B_' || fixture || '_NULL_DEADLINE', null, 'TEST_B2B_NULL_DATE_NOTE');
  end if;
  return recruitment_id;
end;
$$;

create function pg_temp.review_and_publish(recruitment_id uuid)
returns timestamptz language plpgsql as $$
declare
  reviewer uuid := current_setting('test_b2b.reviewer_id')::uuid;
  source_id uuid;
  source_url text;
  current_version bigint;
  review_time timestamptz;
begin
  select id, url into source_id, source_url from public.recruitment_sources
  where recruitment_id = review_and_publish.recruitment_id order by id limit 1;
  perform pg_temp.assert_true(source_id is not null, 'review fixture requires one source');
  select content_version into current_version from public.recruitments where id = review_and_publish.recruitment_id;
  insert into public.recruitment_reviews (
    recruitment_id, content_version, decision, reviewer_id, evidence_snapshot
  ) values (
    review_and_publish.recruitment_id, current_version, 'verified', reviewer,
    jsonb_build_array(jsonb_build_object('source_id', source_id::text, 'url', source_url))
  ) returning reviewed_at into review_time;
  update public.recruitments
  set verification_state = 'verified', verified_version = current_version,
      verified_by = reviewer, verified_at = review_time, publication_state = 'published'
  where id = review_and_publish.recruitment_id;
  return review_time;
end;
$$;

create function pg_temp.expect_card_rejected(recruitment_id uuid, fixture text)
returns void language plpgsql as $$
declare
  failure_message text;
begin
  begin
    perform pg_temp.review_and_publish(recruitment_id);
  exception when others then
    get stacked diagnostics failure_message = message_text;
    if failure_message <> 'Publication requires a complete public recruitment card' then
      raise exception 'TEST_B2B_FAIL: % failed for an unexpected reason: %', fixture, failure_message;
    end if;
    return;
  end;
  raise exception 'TEST_B2B_FAIL: % unexpectedly published', fixture;
end;
$$;

do $$
declare
  reviewer uuid := current_setting('test_b2b.reviewer_id')::uuid;
  complete_id uuid;
  duplicate_id uuid;
  child_id uuid;
  organization_id uuid;
  missing_qualification_id uuid;
  missing_deadline_id uuid;
  null_deadline_id uuid;
  conflicting_deadline_id uuid;
  numeric_slug_id uuid;
  complete_organization_id uuid;
  complete_qualification_id uuid;
  first_listed_at timestamptz;
  actual_candidate jsonb;
  malformed_rejected boolean := false;
begin
  -- The review insert in pg_temp.review_and_publish is the only reviewer-FK
  -- validation. The harness never creates or reads Auth rows.
  perform pg_temp.assert_true(not exists (
    select 1 from public.recruitments where title like 'TEST_B2B_%'
  ), 'success database already contains TEST_B2B fixtures');

  complete_id := pg_temp.seed_draft('COMPLETE', 'test-b2b-complete', true, array[date '2030-12-31']);
  perform pg_temp.review_and_publish(complete_id);
  select published_at into first_listed_at from public.recruitments where id = complete_id;
  select organization_id into complete_organization_id from public.recruitments where id = complete_id;
  select id into complete_qualification_id from public.recruitment_eligibility_rules where recruitment_id = complete_id;
  perform pg_temp.assert_true(first_listed_at is not null, 'complete publication assigns published_at');
  perform pg_temp.assert_true(exists (select 1 from public.public_recruitment_cards where id = complete_id), 'complete card is visible through view');
  select qualification_candidates into actual_candidate from public.public_recruitment_cards where id = complete_id;
  perform pg_temp.assert_true(
    (select id = complete_id
      and organization_id = complete_organization_id
      and organization_name = 'TEST_B2B_COMPLETE_ORGANIZATION'
      and organization_short_name = 'TEST_B2B_COMPLETE_ORG'
      and published_at = first_listed_at
      and application_end_date = date '2030-12-31'
      from public.public_recruitment_cards where id = complete_id),
    'complete view maps recruitment, organization, listed-at, and deadline exactly'
  );
  perform pg_temp.assert_true(
    actual_candidate = jsonb_build_array(jsonb_build_object(
      'id', complete_qualification_id,
      'qualification', 'TEST_B2B_COMPLETE_QUALIFICATION',
      'position', 0
    )),
    'complete view emits ordered qualification candidate JSON exactly'
  );

  duplicate_id := pg_temp.seed_draft('DUPLICATE', 'test-b2b-duplicate', true, array[date '2030-12-31', date '2030-12-31']);
  perform pg_temp.review_and_publish(duplicate_id);
  perform pg_temp.assert_true((select application_end_date = date '2030-12-31' from public.public_recruitment_cards where id = duplicate_id), 'identical deadlines produce one canonical deadline');

  missing_qualification_id := pg_temp.seed_draft('MISSING_QUALIFICATION', 'test-b2b-missing-qualification', false, array[date '2030-12-31']);
  perform pg_temp.expect_card_rejected(missing_qualification_id, 'missing qualification');

  missing_deadline_id := pg_temp.seed_draft('MISSING_DEADLINE', 'test-b2b-missing-deadline', true, array[]::date[]);
  perform pg_temp.expect_card_rejected(missing_deadline_id, 'missing application_end');

  null_deadline_id := pg_temp.seed_draft('NULL_DEADLINE', 'test-b2b-null-deadline', true, array[]::date[], true);
  perform pg_temp.expect_card_rejected(null_deadline_id, 'null application_end');

  conflicting_deadline_id := pg_temp.seed_draft('CONFLICTING_DEADLINE', 'test-b2b-conflicting-deadline', true, array[date '2030-12-31', date '2031-01-01']);
  perform pg_temp.expect_card_rejected(conflicting_deadline_id, 'conflicting application_end dates');

  numeric_slug_id := pg_temp.seed_draft('NUMERIC_SLUG', '123456', true, array[date '2030-12-31']);
  perform pg_temp.expect_card_rejected(numeric_slug_id, 'numeric-only slug');

  -- Existing foundation syntax rejects malformed slugs before Batch 2A can run.
  begin
    perform pg_temp.seed_draft('MALFORMED_SLUG', 'TEST_B2B_INVALID_SLUG', true, array[date '2030-12-31']);
  exception when check_violation then malformed_rejected := true;
  when others then raise exception 'TEST_B2B_FAIL: malformed slug failed with unexpected SQLSTATE %', sqlstate; end;
  perform pg_temp.assert_true(malformed_rejected, 'foundation slug constraint rejects malformed slug');

  child_id := pg_temp.seed_draft('CHILD_INVALIDATION', 'test-b2b-child-invalidation', true, array[date '2030-12-31']);
  perform pg_temp.review_and_publish(child_id);
  update public.recruitment_eligibility_rules set qualification = 'TEST_B2B_CHILD_REVISED' where recruitment_id = child_id;
  perform pg_temp.assert_true(not exists (select 1 from public.public_recruitment_cards where id = child_id), 'child edit removes public view visibility');

  organization_id := pg_temp.seed_draft('ORGANIZATION_INVALIDATION', 'test-b2b-organization-invalidation', true, array[date '2030-12-31']);
  perform pg_temp.review_and_publish(organization_id);
  update public.organizations set short_name = 'TEST_B2B_ORGANIZATION_REVISED'
  where id = (select organization_id from public.recruitments where id = organization_id);
  perform pg_temp.assert_true(not exists (select 1 from public.public_recruitment_cards where id = organization_id), 'organization edit removes public view visibility');

  update public.recruitment_eligibility_rules set qualification = 'TEST_B2B_REPUBLISH_QUALIFICATION' where recruitment_id = complete_id;
  perform pg_temp.review_and_publish(complete_id);
  perform pg_temp.assert_true((select published_at = first_listed_at from public.recruitments where id = complete_id), 'republishing preserves original published_at');
end;
$$;

-- Role checks are intentionally separate from fixture construction. The current
-- policies do not use auth.uid(); this proves SQL grant/RLS behavior only, not
-- HTTP/JWT identity behavior. SET LOCAL is undone by the final ROLLBACK.
set local role anon;
do $$
begin
  if not exists (select 1 from public.public_recruitment_cards where title = 'TEST_B2B_COMPLETE_RECRUITMENT') then
    raise exception 'TEST_B2B_FAIL: anon cannot read complete public card';
  end if;
  begin perform 1 from public.recruitment_sources limit 1; raise exception 'TEST_B2B_FAIL: anon read a private source';
  exception when insufficient_privilege then null; end;
  begin perform 1 from public.recruitment_reviews limit 1; raise exception 'TEST_B2B_FAIL: anon read a private review';
  exception when insufficient_privilege then null; end;
  begin perform 1 from public.editor_memberships limit 1; raise exception 'TEST_B2B_FAIL: anon read membership';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

set local role authenticated;
do $$
begin
  if not exists (select 1 from public.public_recruitment_cards where title = 'TEST_B2B_COMPLETE_RECRUITMENT') then
    raise exception 'TEST_B2B_FAIL: authenticated cannot read complete public card';
  end if;
  begin perform 1 from public.recruitment_sources limit 1; raise exception 'TEST_B2B_FAIL: authenticated read a private source';
  exception when insufficient_privilege then null; end;
  begin perform 1 from public.recruitment_reviews limit 1; raise exception 'TEST_B2B_FAIL: authenticated read a private review';
  exception when insufficient_privilege then null; end;
  begin perform 1 from public.editor_memberships limit 1; raise exception 'TEST_B2B_FAIL: authenticated read membership';
  exception when insufficient_privilege then null; end;
end;
$$;
reset role;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'public_recruitment_cards'
      and column_name in ('verified_by', 'verified_at', 'verified_version', 'content_version', 'publication_state', 'archived_at', 'created_by', 'updated_by', 'notes', 'official_url')
  ) then raise exception 'TEST_B2B_FAIL: view exposes a private/workflow column'; end if;
end;
$$;

rollback;
select 'TEST_B2B_PASS: fixture assertions passed and transaction rollback completed; run fresh post-rollback assertions' as result;

-- In a NEW trusted session, run phase_2c_batch_2b_post_rollback_assertions.sql.
