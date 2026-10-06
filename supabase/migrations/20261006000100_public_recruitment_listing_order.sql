-- Forward-only public listing contract. Do not infer historical first-listing times.
begin;

-- Close the precondition-to-trigger-install race: trusted concurrent writers
-- cannot add a recruitment after the empty-table check begins.
lock table public.recruitments in access exclusive mode;

-- The foundation was deployed empty. If that precondition no longer holds, stop
-- rather than treating a writer-supplied historical timestamp as authoritative.
do $$
begin
  if exists (select 1 from public.recruitments) then
    raise exception 'Public listing migration requires an empty recruitments table; review historical listing timestamps first';
  end if;
end;
$$;

-- Runs alphabetically before recruitment_workflow. On first valid publication,
-- use the database transaction timestamp; later writes retain that first listing.
create function private.assign_first_public_listing_timestamp()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if new.published_at is not null then
      raise exception 'New recruitment cannot choose a public listing timestamp';
    end if;
  elsif old.published_at is null and new.publication_state = 'published' then
    new.published_at := now();
  elsif old.published_at is null and new.published_at is not null then
    raise exception 'Only first valid publication may assign a public listing timestamp';
  elsif old.published_at is not null then
    new.published_at := old.published_at;
  end if;
  return new;
end;
$$;

-- This trigger helper is not a reader API or direct-call surface.
revoke execute on function private.assign_first_public_listing_timestamp() from public, anon, authenticated;

create trigger aaa_recruitment_first_public_listing
before insert or update on public.recruitments
for each row execute function private.assign_first_public_listing_timestamp();

-- Public listing time is appropriate public recruitment metadata, not review data.
grant select (published_at) on public.recruitments to anon, authenticated;

-- Supports newest-first bounded reads and the later (published_at, id) keyset cursor.
create index recruitments_public_listing_order on public.recruitments(published_at desc, id desc);

commit;
