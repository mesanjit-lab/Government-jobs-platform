-- Core V1 LOCAL foundation. STATIC REVIEW ONLY until approved database execution.
-- No seed data, public writes, staff grants, or auth implementation.
begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated;

create domain private.nonempty_text as text
  check (value = btrim(value) and length(value) > 0);
create domain private.safe_count as bigint
  check (value between 0 and 9007199254740991);
-- Structural URL guard only, NOT official-domain verification or SSRF protection.
create domain private.http_url as text
  check (value ~ '^https?://[^/@[:space:]?#]+([/?#][^[:space:]]*)?$'
    and position(chr(92) in value) = 0);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name private.nonempty_text not null,
  short_name private.nonempty_text,
  official_url private.http_url,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  title private.nonempty_text not null,
  slug text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  advertisement_number private.nonempty_text,
  description private.nonempty_text,
  category private.nonempty_text,
  state private.nonempty_text,
  total_vacancies private.safe_count,
  lifecycle_status text check (lifecycle_status in ('upcoming','open','closed','in_progress','completed','cancelled')),
  how_to_apply private.nonempty_text[] check (array_position(how_to_apply, null) is null),
  publication_state text not null default 'draft' check (publication_state in ('draft','in_review','published','archived')),
  verification_state text not null default 'unverified' check (verification_state in ('unverified','in_review','verified','rejected')),
  content_version bigint not null default 1 check (content_version between 1 and 9007199254740991),
  verified_version bigint,
  verified_by uuid references auth.users(id) on delete restrict,
  verified_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete restrict,
  updated_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((verification_state = 'verified' and verified_version is not null and verified_version = content_version and verified_by is not null and verified_at is not null)
      or (verification_state <> 'verified' and verified_version is null and verified_by is null and verified_at is null)),
  check (publication_state <> 'published' or (verification_state = 'verified' and published_at is not null and archived_at is null)),
  check ((publication_state = 'archived') = (archived_at is not null)),
  check (publication_state <> 'published' or slug is not null)
);

create table public.recruitment_posts (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  title private.nonempty_text not null,
  count private.safe_count,
  unique (recruitment_id, id),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_sources (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  label private.nonempty_text not null,
  url private.http_url not null,
  origin text not null check (origin in ('manual','ai_extracted')),
  captured_at timestamptz not null default now(),
  captured_by uuid references auth.users(id) on delete restrict,
  document_reference private.nonempty_text,
  document_hash private.nonempty_text,
  unique (recruitment_id, id),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_selection_stages (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  name private.nonempty_text not null,
  description private.nonempty_text,
  unique (recruitment_id, id),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  post_id uuid,
  qualification private.nonempty_text,
  minimum_age private.safe_count,
  maximum_age private.safe_count,
  age_cutoff_date date check (age_cutoff_date between date '0001-01-01' and date '9999-12-31'),
  notes private.nonempty_text,
  check (qualification is not null or minimum_age is not null or maximum_age is not null or notes is not null),
  check (minimum_age <= maximum_age),
  foreign key (recruitment_id, post_id) references public.recruitment_posts(recruitment_id, id) on delete restrict,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_dates (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  kind text not null check (kind in ('application_start','application_end','fee_deadline','correction_deadline','exam','admit_card','result','other')),
  label private.nonempty_text not null,
  date date check (date between date '0001-01-01' and date '9999-12-31'),
  notes private.nonempty_text,
  check (date is not null or notes is not null),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_fees (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  category private.nonempty_text not null,
  amount numeric(14,2) check (amount >= 0 and amount <> 'NaN'::numeric),
  currency text check (currency ~ '^[A-Z]{3}$'),
  notes private.nonempty_text,
  check ((amount is null) = (currency is null)),
  check (amount is not null or notes is not null),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_links (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  label private.nonempty_text not null,
  url private.http_url not null,
  source_id uuid,
  foreign key (recruitment_id, source_id) references public.recruitment_sources(recruitment_id, id) on delete restrict,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_documents (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  label private.nonempty_text not null,
  kind text not null check (kind in ('official_document','required_document')),
  url private.http_url,
  source_id uuid,
  check (kind <> 'official_document' or url is not null),
  foreign key (recruitment_id, source_id) references public.recruitment_sources(recruitment_id, id) on delete restrict,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_exam_patterns (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  subject private.nonempty_text not null,
  stage_id uuid,
  questions private.safe_count,
  marks numeric check (marks >= 0 and marks not in ('NaN'::numeric, 'Infinity'::numeric)),
  duration_minutes private.safe_count,
  foreign key (recruitment_id, stage_id) references public.recruitment_selection_stages(recruitment_id, id) on delete restrict,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recruitment_faqs (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  question private.nonempty_text not null,
  answer private.nonempty_text not null,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_vacancy_counts (
  post_id uuid not null references public.recruitment_posts(id) on delete restrict,
  category private.nonempty_text not null,
  count private.safe_count not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (post_id, category)
);
create unique index post_vacancy_counts_category_ci on public.post_vacancy_counts(post_id, lower(category));

create table public.recruitment_salary (
  recruitment_id uuid primary key references public.recruitments(id) on delete restrict,
  post_id uuid,
  description private.nonempty_text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (recruitment_id, post_id) references public.recruitment_posts(recruitment_id, id) on delete restrict
);

create table public.recruitment_updates (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  kind text not null check (kind in ('notice','correction','admit_card','answer_key','result')),
  title private.nonempty_text not null,
  description private.nonempty_text,
  date date check (date between date '0001-01-01' and date '9999-12-31'),
  source_id uuid,
  publication_state text not null default 'draft' check (publication_state in ('draft','in_review','published','archived')),
  verification_state text not null default 'unverified' check (verification_state in ('unverified','in_review','verified','rejected')),
  content_version bigint not null default 1 check (content_version between 1 and 9007199254740991),
  verified_version bigint,
  verified_by uuid references auth.users(id) on delete restrict,
  verified_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete restrict,
  updated_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((verification_state = 'verified' and verified_version is not null and verified_version = content_version and verified_by is not null and verified_at is not null)
      or (verification_state <> 'verified' and verified_version is null and verified_by is null and verified_at is null)),
  check (publication_state <> 'published' or (verification_state = 'verified' and published_at is not null and archived_at is null)),
  check ((publication_state = 'archived') = (archived_at is not null)),
  unique (recruitment_id, id),
  foreign key (recruitment_id, source_id) references public.recruitment_sources(recruitment_id, id) on delete restrict
);

create table public.editor_memberships (
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check (role in ('editor','verifier','publisher','administrator')),
  created_at timestamptz not null default now(),
  granted_by uuid not null references auth.users(id) on delete restrict,
  primary key (user_id, role)
);

create table public.recruitment_reviews (
  id uuid primary key default gen_random_uuid(),
  recruitment_id uuid not null references public.recruitments(id) on delete restrict,
  update_id uuid,
  content_version bigint not null check (content_version between 1 and 9007199254740991),
  decision text not null check (decision in ('verified','rejected')),
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  reviewed_at timestamptz not null default now(),
  verification_notes private.nonempty_text,
  evidence_snapshot jsonb not null check (jsonb_typeof(evidence_snapshot) = 'array'),
  foreign key (recruitment_id, update_id) references public.recruitment_updates(recruitment_id, id) on delete restrict
);

-- Parent/child lookups, common public queries and version-bound review lookups.
create index recruitments_organization on public.recruitments(organization_id);
create index recruitments_public_lifecycle on public.recruitments(publication_state, lifecycle_status, published_at);
create index recruitment_dates_kind_date on public.recruitment_dates(kind, date);
create index recruitment_updates_parent on public.recruitment_updates(recruitment_id);
create index recruitment_reviews_target_version on public.recruitment_reviews(recruitment_id, update_id, content_version, reviewed_at desc);
create index recruitment_posts_parent on public.recruitment_posts(recruitment_id);
create index recruitment_sources_parent on public.recruitment_sources(recruitment_id);
create index recruitment_selection_stages_parent on public.recruitment_selection_stages(recruitment_id);
create index recruitment_eligibility_rules_parent on public.recruitment_eligibility_rules(recruitment_id);
create index recruitment_dates_parent on public.recruitment_dates(recruitment_id);
create index recruitment_fees_parent on public.recruitment_fees(recruitment_id);
create index recruitment_links_parent on public.recruitment_links(recruitment_id);
create index recruitment_documents_parent on public.recruitment_documents(recruitment_id);
create index recruitment_exam_patterns_parent on public.recruitment_exam_patterns(recruitment_id);
create index recruitment_faqs_parent on public.recruitment_faqs(recruitment_id);

-- Latest review must attest THIS version. Evidence is private and immutable.
create function private.has_current_review(rec uuid, upd uuid, version bigint, actor uuid, at_time timestamptz)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((
    select v.decision = 'verified' and v.reviewer_id = actor and v.reviewed_at = at_time
    from public.recruitment_reviews v
    where v.recruitment_id = rec and v.update_id is not distinct from upd and v.content_version = version
    order by v.reviewed_at desc, v.id desc limit 1
  ), false)
$$;

create function private.is_public_recruitment(rec uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.recruitments r join public.organizations o on o.id = r.organization_id
    where r.id = rec and r.publication_state = 'published' and r.archived_at is null
      and o.archived_at is null and r.slug is not null
      and r.verification_state = 'verified' and r.verified_version = r.content_version
      and r.published_at <= now()
      and private.has_current_review(r.id, null, r.content_version, r.verified_by, r.verified_at)
  )
$$;

create function private.is_public_update(upd uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.recruitment_updates u
    where u.id = upd and private.is_public_recruitment(u.recruitment_id)
      and u.publication_state = 'published' and u.archived_at is null
      and u.verification_state = 'verified' and u.verified_version = u.content_version
      and u.published_at <= now()
      and private.has_current_review(u.recruitment_id, u.id, u.content_version, u.verified_by, u.verified_at)
  )
$$;

-- Trusted maintenance only. No editor/public write grant or mutation RPC exists.
create function private.guard_workflow()
returns trigger language plpgsql set search_path = '' as $$
declare
  ignored text[] := array['publication_state','verification_state','content_version','verified_version',
    'verified_by','verified_at','published_at','archived_at','created_at','updated_at','created_by','updated_by'];
  parent_id uuid;
  update_id uuid;
begin
  if tg_op = 'DELETE' then
    if old.published_at is not null then raise exception 'Published history must be archived'; end if;
    return old;
  end if;
  if tg_op = 'INSERT' then
    if new.publication_state <> 'draft' or new.verification_state <> 'unverified'
       or new.content_version <> 1 or new.verified_version is not null or new.verified_by is not null
       or new.verified_at is not null or new.published_at is not null or new.archived_at is not null then
      raise exception 'New content must start as an unverified draft';
    end if;
    new.created_at := clock_timestamp();
  else
    if new.id <> old.id or new.created_by is distinct from old.created_by then
      raise exception 'Identity/creator is immutable';
    end if;
    if tg_table_name = 'recruitment_updates' then
      if new.recruitment_id <> old.recruitment_id then raise exception 'Update cannot be reparented'; end if;
    end if;
    new.created_at := old.created_at;
    -- Once published, retain that history marker even while withdrawn.
    if old.published_at is not null then new.published_at := old.published_at; end if;
    if (to_jsonb(new) - ignored) is distinct from (to_jsonb(old) - ignored)
       or new.content_version is distinct from old.content_version then
      new.content_version := old.content_version + 1;
      new.verification_state := 'unverified';
      new.verified_version := null; new.verified_by := null; new.verified_at := null;
      new.publication_state := case when old.publication_state = 'archived' then 'archived' else 'draft' end;
      new.archived_at := case when old.publication_state = 'archived' then old.archived_at else null end;
    end if;
  end if;
  new.updated_at := clock_timestamp();
  if tg_table_name = 'recruitments' then parent_id := new.id; update_id := null;
  else parent_id := new.recruitment_id; update_id := new.id;
  end if;
  if new.verification_state = 'verified' and not private.has_current_review(
      parent_id, update_id, new.content_version, new.verified_by, new.verified_at) then
    raise exception 'Verification requires a human review of the current content version';
  end if;
  if new.publication_state = 'published' then
    if new.published_at > now() then raise exception 'Scheduled publication is not implemented'; end if;
    if tg_table_name = 'recruitments' then
      perform 1 from public.organizations where id = new.organization_id and archived_at is null for share;
      if not found then raise exception 'Publication requires an active organization'; end if;
    elsif not private.is_public_recruitment(parent_id) then
      raise exception 'Update publication requires a public parent';
    end if;
  end if;
  return new;
end;
$$;

create trigger recruitment_workflow before insert or update or delete on public.recruitments
for each row execute function private.guard_workflow();
create trigger update_workflow before insert or update or delete on public.recruitment_updates
for each row execute function private.guard_workflow();

-- Lock/version the aggregate BEFORE changing any child, including provenance.
create function private.guard_child()
returns trigger language plpgsql set search_path = '' as $$
declare rec uuid; post uuid;
begin
  if tg_op = 'UPDATE' then
    if (to_jsonb(new)->'id') is distinct from (to_jsonb(old)->'id')
       or (to_jsonb(new)->'recruitment_id') is distinct from (to_jsonb(old)->'recruitment_id') then
      raise exception 'Child identity/ownership is immutable';
    end if;
    if tg_table_name = 'post_vacancy_counts' then
      if new.post_id <> old.post_id then raise exception 'Vacancy count cannot be reparented'; end if;
    end if;
    new.created_at := old.created_at;
  elsif tg_op = 'INSERT' then new.created_at := clock_timestamp();
  end if;
  if tg_table_name = 'post_vacancy_counts' then
    if tg_op = 'DELETE' then post := old.post_id; else post := new.post_id; end if;
    select recruitment_id into strict rec from public.recruitment_posts where id = post;
  elsif tg_op = 'DELETE' then rec := old.recruitment_id;
  else rec := new.recruitment_id;
  end if;
  update public.recruitments set content_version = content_version + 1 where id = rec;
  if tg_table_name = 'recruitment_sources' then
    if tg_op = 'INSERT' then new.captured_at := clock_timestamp();
    elsif tg_op = 'UPDATE' then
      new.captured_at := old.captured_at; new.captured_by := old.captured_by;
    end if;
    -- Conservative: provenance changes invalidate all independently reviewed updates.
    update public.recruitment_updates set content_version = content_version + 1 where recruitment_id = rec;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
create trigger recruitment_posts_content_guard before insert or update or delete on public.recruitment_posts
for each row execute function private.guard_child();
create trigger recruitment_sources_content_guard before insert or update or delete on public.recruitment_sources
for each row execute function private.guard_child();
create trigger recruitment_selection_stages_content_guard before insert or update or delete on public.recruitment_selection_stages
for each row execute function private.guard_child();
create trigger recruitment_eligibility_rules_content_guard before insert or update or delete on public.recruitment_eligibility_rules
for each row execute function private.guard_child();
create trigger recruitment_dates_content_guard before insert or update or delete on public.recruitment_dates
for each row execute function private.guard_child();
create trigger recruitment_fees_content_guard before insert or update or delete on public.recruitment_fees
for each row execute function private.guard_child();
create trigger recruitment_links_content_guard before insert or update or delete on public.recruitment_links
for each row execute function private.guard_child();
create trigger recruitment_documents_content_guard before insert or update or delete on public.recruitment_documents
for each row execute function private.guard_child();
create trigger recruitment_exam_patterns_content_guard before insert or update or delete on public.recruitment_exam_patterns
for each row execute function private.guard_child();
create trigger recruitment_faqs_content_guard before insert or update or delete on public.recruitment_faqs
for each row execute function private.guard_child();
create trigger post_vacancy_counts_content_guard before insert or update or delete on public.post_vacancy_counts
for each row execute function private.guard_child();
create trigger recruitment_salary_content_guard before insert or update or delete on public.recruitment_salary
for each row execute function private.guard_child();

create function private.guard_organization()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    if new.id <> old.id then raise exception 'Organization identity is immutable'; end if;
    new.created_at := old.created_at;
    if (to_jsonb(new) - array['created_at','updated_at']) is distinct from (to_jsonb(old) - array['created_at','updated_at']) then
      update public.recruitments set content_version = content_version + 1 where organization_id = old.id;
    end if;
  else new.created_at := clock_timestamp();
  end if;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
create trigger organization_content_guard before insert or update on public.organizations
for each row execute function private.guard_organization();

create function private.guard_review()
returns trigger language plpgsql set search_path = '' as $$
declare
  current_version bigint;
  evidence jsonb;
begin
  if tg_op <> 'INSERT' then raise exception 'Reviews are append-only'; end if;
  -- Serialize with parent/child/provenance writes, then with an update if applicable.
  select content_version into strict current_version from public.recruitments where id = new.recruitment_id for update;
  if new.update_id is not null then
    select content_version into strict current_version from public.recruitment_updates
      where id = new.update_id and recruitment_id = new.recruitment_id for update;
  end if;
  if new.content_version <> current_version then raise exception 'Review version is stale'; end if;
  if jsonb_typeof(new.evidence_snapshot) <> 'array' then raise exception 'Evidence must be an array'; end if;
  if new.decision = 'verified' and jsonb_array_length(new.evidence_snapshot) = 0 then
    raise exception 'Verification requires source evidence';
  end if;
  for evidence in select value from jsonb_array_elements(new.evidence_snapshot) loop
    if jsonb_typeof(evidence) <> 'object' or not (evidence ? 'source_id' and evidence ? 'url')
       or evidence - array['source_id','url','document_hash'] <> '{}'::jsonb then
      raise exception 'Invalid evidence snapshot shape';
    end if;
    perform 1 from public.recruitment_sources s
      where s.recruitment_id = new.recruitment_id and s.id::text = evidence->>'source_id'
        and s.url = evidence->>'url'
        and s.document_hash is not distinct from evidence->>'document_hash';
    if not found then raise exception 'Evidence must match a source of this recruitment'; end if;
  end loop;
  new.reviewed_at := clock_timestamp();
  return new;
end;
$$;
create trigger immutable_review before insert or update or delete on public.recruitment_reviews
for each row execute function private.guard_review();

-- SECURITY DEFINER helpers are private, read-only, fixed-search-path predicates.
-- Their owner must remain the trusted migration owner, never anon/authenticated.
revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_public_recruitment(uuid) to anon, authenticated;
grant execute on function private.is_public_update(uuid) to anon, authenticated;

alter table public.organizations enable row level security;
revoke all on table public.organizations from public, anon, authenticated;
alter table public.recruitments enable row level security;
revoke all on table public.recruitments from public, anon, authenticated;
alter table public.recruitment_posts enable row level security;
revoke all on table public.recruitment_posts from public, anon, authenticated;
alter table public.recruitment_sources enable row level security;
revoke all on table public.recruitment_sources from public, anon, authenticated;
alter table public.recruitment_selection_stages enable row level security;
revoke all on table public.recruitment_selection_stages from public, anon, authenticated;
alter table public.recruitment_eligibility_rules enable row level security;
revoke all on table public.recruitment_eligibility_rules from public, anon, authenticated;
alter table public.recruitment_dates enable row level security;
revoke all on table public.recruitment_dates from public, anon, authenticated;
alter table public.recruitment_fees enable row level security;
revoke all on table public.recruitment_fees from public, anon, authenticated;
alter table public.recruitment_links enable row level security;
revoke all on table public.recruitment_links from public, anon, authenticated;
alter table public.recruitment_documents enable row level security;
revoke all on table public.recruitment_documents from public, anon, authenticated;
alter table public.recruitment_exam_patterns enable row level security;
revoke all on table public.recruitment_exam_patterns from public, anon, authenticated;
alter table public.recruitment_faqs enable row level security;
revoke all on table public.recruitment_faqs from public, anon, authenticated;
alter table public.post_vacancy_counts enable row level security;
revoke all on table public.post_vacancy_counts from public, anon, authenticated;
alter table public.recruitment_salary enable row level security;
revoke all on table public.recruitment_salary from public, anon, authenticated;
alter table public.recruitment_updates enable row level security;
revoke all on table public.recruitment_updates from public, anon, authenticated;
alter table public.editor_memberships enable row level security;
revoke all on table public.editor_memberships from public, anon, authenticated;
alter table public.recruitment_reviews enable row level security;
revoke all on table public.recruitment_reviews from public, anon, authenticated;

-- Deliberate column grants: actor IDs, internal review/provenance and workflow
-- metadata are NOT exposed by SELECT *. Consumers must select safe columns.
grant select (id, name, short_name, official_url) on public.organizations to anon, authenticated;
grant select (id, organization_id, title, slug, advertisement_number, description, category, state,
  total_vacancies, lifecycle_status, how_to_apply) on public.recruitments to anon, authenticated;
grant select (id, recruitment_id, kind, title, description, date) on public.recruitment_updates to anon, authenticated;

create policy organizations_public_read on public.organizations for select to anon, authenticated
using (archived_at is null and exists (
  select 1 from public.recruitments r where r.organization_id = organizations.id and private.is_public_recruitment(r.id)
));
create policy recruitments_public_read on public.recruitments for select to anon, authenticated
using (private.is_public_recruitment(id));
create policy recruitment_updates_public_read on public.recruitment_updates for select to anon, authenticated
using (private.is_public_update(id));
grant select (id, recruitment_id, title, count, position) on public.recruitment_posts to anon, authenticated;
create policy recruitment_posts_public_read on public.recruitment_posts for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, name, description, position) on public.recruitment_selection_stages to anon, authenticated;
create policy recruitment_selection_stages_public_read on public.recruitment_selection_stages for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, post_id, qualification, minimum_age, maximum_age, age_cutoff_date, notes, position) on public.recruitment_eligibility_rules to anon, authenticated;
create policy recruitment_eligibility_rules_public_read on public.recruitment_eligibility_rules for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, kind, label, date, notes, position) on public.recruitment_dates to anon, authenticated;
create policy recruitment_dates_public_read on public.recruitment_dates for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, category, amount, currency, notes, position) on public.recruitment_fees to anon, authenticated;
create policy recruitment_fees_public_read on public.recruitment_fees for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, label, url, position) on public.recruitment_links to anon, authenticated;
create policy recruitment_links_public_read on public.recruitment_links for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, label, kind, url, position) on public.recruitment_documents to anon, authenticated;
create policy recruitment_documents_public_read on public.recruitment_documents for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, subject, stage_id, questions, marks, duration_minutes, position) on public.recruitment_exam_patterns to anon, authenticated;
create policy recruitment_exam_patterns_public_read on public.recruitment_exam_patterns for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (id, recruitment_id, question, answer, position) on public.recruitment_faqs to anon, authenticated;
create policy recruitment_faqs_public_read on public.recruitment_faqs for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (recruitment_id, post_id, description) on public.recruitment_salary to anon, authenticated;
create policy recruitment_salary_public_read on public.recruitment_salary for select to anon, authenticated
using (private.is_public_recruitment(recruitment_id));
grant select (post_id, category, count) on public.post_vacancy_counts to anon, authenticated;
create policy post_vacancy_counts_public_read on public.post_vacancy_counts for select to anon, authenticated
using (exists (
  select 1 from public.recruitment_posts p where p.id = post_vacancy_counts.post_id and private.is_public_recruitment(p.recruitment_id)
));

-- No policies/grants for sources, reviews or editor_memberships.
-- No INSERT/UPDATE/DELETE policies, no publication RPC, no sample government data.
commit;
