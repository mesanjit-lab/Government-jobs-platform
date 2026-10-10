-- Phase 2C Batch 2B: runner-controlled post-failure assertions. The Node
-- runner invokes this file only after it captured the exact Batch 2A P0001
-- preflight failure and closed the failed migration session. This file emits
-- no success result: only the runner may report PASS.

do $$
begin
  if to_regclass('private.batch_2b_isolated_sentinel') is null then
    raise exception 'TEST_B2B_STOP: isolated sentinel table is absent';
  end if;
  if (select count(*) from private.batch_2b_isolated_sentinel) <> 1
     or (select count(*) from private.batch_2b_isolated_sentinel where marker = 'TEST_B2B_ISOLATED_DATABASE_V1') <> 1 then
    raise exception 'TEST_B2B_STOP: isolated sentinel marker is not exact';
  end if;
  if to_regclass('public.public_recruitment_cards') is not null
     or to_regclass('public.recruitment_eligibility_rules_card_candidates') is not null
     or to_regclass('public.recruitment_dates_card_deadline_lookup') is not null
     or exists (
       select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relname = 'recruitments'
         and t.tgname = 'zzz_recruitment_public_card_ready' and not t.tgisinternal
     )
     or to_regprocedure('private.is_complete_public_recruitment_card(uuid)') is not null
     or to_regprocedure('private.guard_public_recruitment_card()') is not null then
    raise exception 'TEST_B2B_FAIL: failed migration left Batch 2A objects behind';
  end if;

  if not exists (select 1 from public.recruitments where title = 'TEST_B2B_FAILURE_INCOMPLETE_LEGACY') then
    raise exception 'TEST_B2B_FAIL: expected committed failure fixture is absent';
  end if;
end;
$$;
