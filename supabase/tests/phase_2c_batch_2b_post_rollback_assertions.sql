-- Phase 2C Batch 2B: run in a NEW trusted session after the success fixture
-- script rolls back. This script is read-only and must find zero TEST_B2B_*
-- traces in every public table the success harness can touch.

do $$
begin
  if to_regclass('private.batch_2b_isolated_sentinel') is null then
    raise exception 'TEST_B2B_STOP: isolated sentinel table is absent';
  end if;
  if (select count(*) from private.batch_2b_isolated_sentinel) <> 1
     or (select count(*) from private.batch_2b_isolated_sentinel where marker = 'TEST_B2B_ISOLATED_DATABASE_V1') <> 1 then
    raise exception 'TEST_B2B_STOP: isolated sentinel marker is not exact';
  end if;
  if exists (select 1 from public.organizations where name like 'TEST_B2B_%' or short_name like 'TEST_B2B_%')
     or exists (select 1 from public.recruitments where title like 'TEST_B2B_%' or slug like 'test-b2b-%')
     or exists (select 1 from public.recruitment_sources where label like 'TEST_B2B_%' or url like 'https://example.test/test-b2b/%')
     or exists (select 1 from public.recruitment_eligibility_rules where qualification like 'TEST_B2B_%')
     or exists (select 1 from public.recruitment_dates where label like 'TEST_B2B_%' or notes like 'TEST_B2B_%')
     or exists (
       select 1 from public.recruitment_reviews v
       join public.recruitments r on r.id = v.recruitment_id
       where r.title like 'TEST_B2B_%'
     ) then
    raise exception 'TEST_B2B_FAIL: rollback left persistent synthetic fixtures';
  end if;
end;
$$;

select 'TEST_B2B_PASS: zero persistent synthetic fixtures' as result;
