-- Phase 2C Batch 2B: SUCCESS DATABASE catalog and security assertions.
--
-- Execute ONLY after the three migrations have applied successfully in a
-- disposable isolated MyResult test database. This script never creates data
-- and always rolls back its session-local role changes.
-- Do not run against the deployed MyResult project or the old AI Test Platform.

begin;
set local lock_timeout = '2s';
set local statement_timeout = '15s';

do $$
declare
  view_options text[];
  view_columns text[];
  completeness_definer boolean;
  completeness_search_path text[];
  trigger_definer boolean;
  trigger_search_path text[];
  trigger_function oid;
  trigger_type integer;
  trigger_enabled "char";
  required_rls_count integer;
begin
  if to_regclass('private.batch_2b_isolated_sentinel') is null then
    raise exception 'TEST_B2B_STOP: isolated sentinel table is absent';
  end if;
  if (select count(*) from private.batch_2b_isolated_sentinel) <> 1
     or (select count(*) from private.batch_2b_isolated_sentinel where marker = 'TEST_B2B_ISOLATED_DATABASE_V1') <> 1 then
    raise exception 'TEST_B2B_STOP: isolated sentinel marker is not exact';
  end if;

  if current_setting('server_version_num')::integer < 150000 then
    raise exception 'TEST_B2B_STOP: PostgreSQL 15 or later is required for security_invoker views';
  end if;

  select c.reloptions into view_options
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'public_recruitment_cards' and c.relkind = 'v';
  if view_options is null or not ('security_invoker=true' = any (view_options)) then
    raise exception 'TEST_B2B_FAIL: public_recruitment_cards is not security_invoker';
  end if;

  select array_agg(column_name order by ordinal_position) into view_columns
  from information_schema.columns
  where table_schema = 'public' and table_name = 'public_recruitment_cards';
  if view_columns is distinct from array[
    'id', 'slug', 'title', 'organization_id', 'organization_name',
    'organization_short_name', 'category', 'state', 'total_vacancies',
    'lifecycle_status', 'published_at', 'qualification_candidates',
    'application_end_date'
  ] then
    raise exception 'TEST_B2B_FAIL: public-card view projection drifted: %', view_columns;
  end if;

  select p.prosecdef, p.proconfig into completeness_definer, completeness_search_path
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'private' and p.oid = to_regprocedure('private.is_complete_public_recruitment_card(uuid)');
  if completeness_definer is distinct from true or completeness_search_path is null
     or not ('search_path=' = any(completeness_search_path)) then
    raise exception 'TEST_B2B_FAIL: completeness helper is not SECURITY DEFINER with empty search_path';
  end if;
  select p.prosecdef, p.proconfig into trigger_definer, trigger_search_path
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'private' and p.oid = to_regprocedure('private.guard_public_recruitment_card()');
  if trigger_definer is distinct from false or trigger_search_path is null
     or not ('search_path=' = any(trigger_search_path)) then
    raise exception 'TEST_B2B_FAIL: trigger helper security mode or empty search_path drifted';
  end if;

  select t.tgfoid, t.tgtype, t.tgenabled into trigger_function, trigger_type, trigger_enabled
  from pg_trigger t join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'recruitments'
    and t.tgname = 'zzz_recruitment_public_card_ready' and not t.tgisinternal;
  if trigger_function is distinct from to_regprocedure('private.guard_public_recruitment_card()')
     or trigger_enabled is distinct from 'O'
     or (trigger_type & 1) = 0 or (trigger_type & 2) = 0
     or (trigger_type & 4) = 0 or (trigger_type & 16) = 0
     or (trigger_type & 8) <> 0 or (trigger_type & 32) <> 0 then
    raise exception 'TEST_B2B_FAIL: final public-card trigger binding/timing/events drifted';
  end if;

  if not exists (select 1 from pg_class i join pg_namespace n on n.oid = i.relnamespace where n.nspname = 'public' and i.relname = 'recruitment_eligibility_rules_card_candidates')
     or not exists (select 1 from pg_class i join pg_namespace n on n.oid = i.relnamespace where n.nspname = 'public' and i.relname = 'recruitment_dates_card_deadline_lookup') then
    raise exception 'TEST_B2B_FAIL: expected public-card indexes are absent';
  end if;

  select count(*) into required_rls_count
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relrowsecurity
    and c.relname in ('organizations', 'recruitments', 'recruitment_eligibility_rules', 'recruitment_dates');
  if required_rls_count <> 4 then raise exception 'TEST_B2B_FAIL: required base-table RLS is not enabled'; end if;

  if has_function_privilege('anon', 'private.is_complete_public_recruitment_card(uuid)', 'execute')
     or has_function_privilege('authenticated', 'private.is_complete_public_recruitment_card(uuid)', 'execute')
     or has_function_privilege('anon', 'private.guard_public_recruitment_card()', 'execute')
     or has_function_privilege('authenticated', 'private.guard_public_recruitment_card()', 'execute') then
    raise exception 'TEST_B2B_FAIL: a private Batch 2A helper is reader-executable';
  end if;

  if not has_table_privilege('anon', 'public.public_recruitment_cards', 'select')
     or not has_table_privilege('authenticated', 'public.public_recruitment_cards', 'select')
     or has_table_privilege('anon', 'public.public_recruitment_cards', 'insert')
     or has_table_privilege('anon', 'public.public_recruitment_cards', 'update')
     or has_table_privilege('anon', 'public.public_recruitment_cards', 'delete')
     or has_table_privilege('authenticated', 'public.public_recruitment_cards', 'insert')
     or has_table_privilege('authenticated', 'public.public_recruitment_cards', 'update')
     or has_table_privilege('authenticated', 'public.public_recruitment_cards', 'delete') then
    raise exception 'TEST_B2B_FAIL: public-card view grants are not read-only';
  end if;

  if has_table_privilege('anon', 'public.recruitment_sources', 'select')
     or has_table_privilege('authenticated', 'public.recruitment_sources', 'select')
     or has_table_privilege('anon', 'public.recruitment_reviews', 'select')
     or has_table_privilege('authenticated', 'public.recruitment_reviews', 'select')
     or has_table_privilege('anon', 'public.editor_memberships', 'select')
     or has_table_privilege('authenticated', 'public.editor_memberships', 'select') then
    raise exception 'TEST_B2B_FAIL: a private table has reader SELECT privilege';
  end if;
end;
$$;

rollback;
select 'TEST_B2B_PASS: catalog/security-invoker/grant checks passed after rollback' as result;
