-- Forward-only public-card completeness and projection boundary.
-- REVIEW ONLY: do not execute until separately approved for the isolated myresult project.
begin;

-- Trusted trigger helper. It is not a reader API or direct-call surface.
-- Qualification summaries stay in the TypeScript domain because its locale-aware
-- de-duplication semantics are not reproduced by PostgreSQL lower().
create function private.is_complete_public_recruitment_card(rec uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.recruitments r
    join public.organizations o on o.id = r.organization_id
    where r.id = rec
      and o.archived_at is null
      and r.slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      and r.slug !~ '^[0-9]+$'
      and exists (
        select 1
        from public.recruitment_eligibility_rules e
        where e.recruitment_id = r.id
          and nullif(btrim(e.qualification), '') is not null
      )
      and exists (
        select 1
        from public.recruitment_dates d
        where d.recruitment_id = r.id and d.kind = 'application_end'
      )
      and not exists (
        select 1
        from public.recruitment_dates d
        where d.recruitment_id = r.id
          and d.kind = 'application_end'
          and d.date is null
      )
      and 1 = (
        select count(distinct d.date)
        from public.recruitment_dates d
        where d.recruitment_id = r.id and d.kind = 'application_end'
      )
  )
$$;

revoke execute on function private.is_complete_public_recruitment_card(uuid) from public, anon, authenticated;

-- Prevent a legacy published row from silently falling outside the new card
-- boundary, and serialize trusted child/organization writers that invalidate
-- their parent through public.recruitments.
lock table public.recruitments in access exclusive mode;

do $$
begin
  if exists (
    select 1
    from public.recruitments r
    where r.publication_state = 'published'
      and not private.is_complete_public_recruitment_card(r.id)
  ) then
    raise exception 'Public card migration requires every published recruitment to be complete';
  end if;
end;
$$;

-- Runs after aaa_recruitment_first_public_listing and recruitment_workflow.
-- The existing workflow guard may downgrade changed content to draft; only a
-- final published row must satisfy the card-completeness invariant.
create function private.guard_public_recruitment_card()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.publication_state = 'published'
     and not private.is_complete_public_recruitment_card(new.id) then
    raise exception 'Publication requires a complete public recruitment card';
  end if;
  return new;
end;
$$;

revoke execute on function private.guard_public_recruitment_card() from public, anon, authenticated;

create trigger zzz_recruitment_public_card_ready
before insert or update on public.recruitments
for each row execute function private.guard_public_recruitment_card();

-- Supports the completeness predicate and the correlated public-card view.
create index recruitment_eligibility_rules_card_candidates
  on public.recruitment_eligibility_rules(recruitment_id, position, id)
  where qualification is not null;
create index recruitment_dates_card_deadline_lookup
  on public.recruitment_dates(recruitment_id, kind, date);

-- This view is a public card projection, not a detail API. Its invoker setting
-- preserves underlying table privileges and RLS. Ordered candidates let the
-- existing TypeScript helper preserve its locale-aware qualification summary.
create view public.public_recruitment_cards
with (security_invoker = true)
as
select
  r.id,
  r.slug,
  r.title,
  r.organization_id,
  o.name as organization_name,
  o.short_name as organization_short_name,
  r.category,
  r.state,
  r.total_vacancies,
  r.lifecycle_status,
  r.published_at,
  qualifications.qualification_candidates,
  deadline.application_end_date
from public.recruitments r
join public.organizations o on o.id = r.organization_id
cross join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'id', e.id,
      'qualification', btrim(e.qualification),
      'position', e.position
    ) order by e.position, e.id
  ) as qualification_candidates
  from public.recruitment_eligibility_rules e
  where e.recruitment_id = r.id
    and nullif(btrim(e.qualification), '') is not null
  having count(*) > 0
) qualifications
cross join lateral (
  select min(d.date) as application_end_date
  from public.recruitment_dates d
  where d.recruitment_id = r.id and d.kind = 'application_end'
  having count(*) > 0
    and count(d.date) = count(*)
    and count(distinct d.date) = 1
) deadline
where private.is_public_recruitment(r.id)
  and r.slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  and r.slug !~ '^[0-9]+$';

revoke all on table public.public_recruitment_cards from public, anon, authenticated;
grant select on table public.public_recruitment_cards to anon, authenticated;

commit;
