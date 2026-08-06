-- MaDev initial database schema

create extension if not exists pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

create type public.content_source as enum (
  'official',
  'ai_suggested',
  'team_approved'
);

create type public.mastery_status as enum (
  'not_started',
  'studying',
  'understands_concept',
  'practiced',
  'used_in_project',
  'independent',
  'can_teach'
);

create type public.evidence_type as enum (
  'github_repository',
  'live_project',
  'project',
  'certificate',
  'image',
  'note',
  'professional_experience'
);

create type public.verification_status as enum (
  'unverified',
  'pending',
  'verified',
  'rejected'
);

-- =========================================================
-- PROFILES
-- =========================================================

create table public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  display_name text,
  avatar_url text,
  headline text,
  current_job_title text,
  experience_level text,

  onboarding_completed boolean
    not null
    default false,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);

-- =========================================================
-- OFFICIAL CAREER CONTENT
-- =========================================================

create table public.tracks (
  id uuid primary key
    default gen_random_uuid(),

  slug text
    not null
    unique,

  name text
    not null,

  description text,
  icon text,

  position integer
    not null
    default 0
    check (position >= 0),

  is_published boolean
    not null
    default false,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);

create table public.phases (
  id uuid primary key
    default gen_random_uuid(),

  track_id uuid
    not null
    references public.tracks(id)
    on delete cascade,

  slug text
    not null,

  name text
    not null,

  description text,

  position integer
    not null
    default 0
    check (position >= 0),

  estimated_hours integer
    check (
      estimated_hours is null
      or estimated_hours >= 0
    ),

  is_published boolean
    not null
    default false,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  unique (track_id, slug)
);

create table public.skills (
  id uuid primary key
    default gen_random_uuid(),

  phase_id uuid
    not null
    references public.phases(id)
    on delete cascade,

  slug text
    not null,

  name text
    not null,

  description text,
  category text,

  source public.content_source
    not null
    default 'official',

  position integer
    not null
    default 0
    check (position >= 0),

  estimated_hours integer
    check (
      estimated_hours is null
      or estimated_hours >= 0
    ),

  is_required boolean
    not null
    default true,

  is_published boolean
    not null
    default false,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  unique (phase_id, slug)
);

create table public.skill_prerequisites (
  skill_id uuid
    not null
    references public.skills(id)
    on delete cascade,

  prerequisite_skill_id uuid
    not null
    references public.skills(id)
    on delete cascade,

  created_at timestamptz
    not null
    default now(),

  primary key (
    skill_id,
    prerequisite_skill_id
  ),

  check (
    skill_id <> prerequisite_skill_id
  )
);

-- =========================================================
-- USER JOURNEYS AND PROGRESS
-- =========================================================

create table public.user_tracks (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  track_id uuid
    not null
    references public.tracks(id)
    on delete cascade,

  is_primary boolean
    not null
    default false,

  started_at timestamptz
    not null
    default now(),

  completed_at timestamptz,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  unique (user_id, track_id)
);

create table public.user_skills (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  skill_id uuid
    not null
    references public.skills(id)
    on delete cascade,

  mastery_status public.mastery_status
    not null
    default 'not_started',

  knowledge_score smallint
    not null
    default 0
    check (
      knowledge_score between 0 and 100
    ),

  practice_score smallint
    not null
    default 0
    check (
      practice_score between 0 and 100
    ),

  evidence_score smallint
    not null
    default 0
    check (
      evidence_score between 0 and 100
    ),

  professional_readiness_score smallint
    not null
    default 0
    check (
      professional_readiness_score
      between 0 and 100
    ),

  notes text,

  started_at timestamptz,
  last_practiced_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  unique (user_id, skill_id)
);

-- =========================================================
-- USER-CREATED SKILLS
-- =========================================================

create table public.user_custom_skills (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  track_id uuid
    references public.tracks(id)
    on delete set null,

  phase_id uuid
    references public.phases(id)
    on delete set null,

  name text
    not null,

  description text,
  category text,

  mastery_status public.mastery_status
    not null
    default 'not_started',

  knowledge_score smallint
    not null
    default 0
    check (
      knowledge_score between 0 and 100
    ),

  practice_score smallint
    not null
    default 0
    check (
      practice_score between 0 and 100
    ),

  evidence_score smallint
    not null
    default 0
    check (
      evidence_score between 0 and 100
    ),

  professional_readiness_score smallint
    not null
    default 0
    check (
      professional_readiness_score
      between 0 and 100
    ),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);

-- =========================================================
-- PROJECTS AND EVIDENCE
-- =========================================================

create table public.projects (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  name text
    not null,

  description text,
  repository_url text,
  live_url text,
  image_url text,

  started_at date,
  completed_at date,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  check (
    completed_at is null
    or started_at is null
    or completed_at >= started_at
  )
);

create table public.project_skills (
  id uuid primary key
    default gen_random_uuid(),

  project_id uuid
    not null
    references public.projects(id)
    on delete cascade,

  skill_id uuid
    references public.skills(id)
    on delete cascade,

  custom_skill_id uuid
    references public.user_custom_skills(id)
    on delete cascade,

  created_at timestamptz
    not null
    default now(),

  check (
    (
      skill_id is not null
    )::integer
    +
    (
      custom_skill_id is not null
    )::integer
    = 1
  )
);

create table public.skill_evidence (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  skill_id uuid
    references public.skills(id)
    on delete cascade,

  custom_skill_id uuid
    references public.user_custom_skills(id)
    on delete cascade,

  project_id uuid
    references public.projects(id)
    on delete set null,

  type public.evidence_type
    not null,

  title text
    not null,

  description text,
  url text,
  storage_path text,
  issuer text,
  evidence_date date,

  verification_status
    public.verification_status
    not null
    default 'unverified',

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  check (
    (
      skill_id is not null
    )::integer
    +
    (
      custom_skill_id is not null
    )::integer
    = 1
  )
);

-- =========================================================
-- INDEXES
-- =========================================================

create index phases_track_id_idx
  on public.phases(track_id);

create index skills_phase_id_idx
  on public.skills(phase_id);

create index user_tracks_user_id_idx
  on public.user_tracks(user_id);

create index user_skills_user_id_idx
  on public.user_skills(user_id);

create index user_skills_skill_id_idx
  on public.user_skills(skill_id);

create index user_custom_skills_user_id_idx
  on public.user_custom_skills(user_id);

create index projects_user_id_idx
  on public.projects(user_id);

create index skill_evidence_user_id_idx
  on public.skill_evidence(user_id);

create index skill_evidence_skill_id_idx
  on public.skill_evidence(skill_id);

create unique index project_official_skill_unique_idx
  on public.project_skills(
    project_id,
    skill_id
  )
  where skill_id is not null;

create unique index project_custom_skill_unique_idx
  on public.project_skills(
    project_id,
    custom_skill_id
  )
  where custom_skill_id is not null;

create unique index one_primary_track_per_user_idx
  on public.user_tracks(user_id)
  where is_primary = true;

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger tracks_set_updated_at
before update on public.tracks
for each row
execute function public.set_updated_at();

create trigger phases_set_updated_at
before update on public.phases
for each row
execute function public.set_updated_at();

create trigger skills_set_updated_at
before update on public.skills
for each row
execute function public.set_updated_at();

create trigger user_tracks_set_updated_at
before update on public.user_tracks
for each row
execute function public.set_updated_at();

create trigger user_skills_set_updated_at
before update on public.user_skills
for each row
execute function public.set_updated_at();

create trigger user_custom_skills_set_updated_at
before update on public.user_custom_skills
for each row
execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create trigger skill_evidence_set_updated_at
before update on public.skill_evidence
for each row
execute function public.set_updated_at();

-- =========================================================
-- AUTOMATIC PROFILE CREATION
-- =========================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'Developer'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles
  enable row level security;

alter table public.tracks
  enable row level security;

alter table public.phases
  enable row level security;

alter table public.skills
  enable row level security;

alter table public.skill_prerequisites
  enable row level security;

alter table public.user_tracks
  enable row level security;

alter table public.user_skills
  enable row level security;

alter table public.user_custom_skills
  enable row level security;

alter table public.projects
  enable row level security;

alter table public.project_skills
  enable row level security;

alter table public.skill_evidence
  enable row level security;

-- Profiles

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = id
)
with check (
  (select auth.uid()) = id
);

-- Published catalog

create policy "Anyone can read published tracks"
on public.tracks
for select
to anon, authenticated
using (is_published = true);

create policy "Anyone can read published phases"
on public.phases
for select
to anon, authenticated
using (is_published = true);

create policy "Anyone can read published skills"
on public.skills
for select
to anon, authenticated
using (is_published = true);

create policy "Anyone can read published prerequisites"
on public.skill_prerequisites
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.skills
    where skills.id =
      skill_prerequisites.skill_id
      and skills.is_published = true
  )
  and exists (
    select 1
    from public.skills
    where skills.id =
      skill_prerequisites.prerequisite_skill_id
      and skills.is_published = true
  )
);

-- User-owned tables

create policy "Users manage own tracks"
on public.user_tracks
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "Users manage own skill progress"
on public.user_skills
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "Users manage own custom skills"
on public.user_custom_skills
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "Users manage own projects"
on public.projects
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "Users manage skills from own projects"
on public.project_skills
for all
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id =
      project_skills.project_id
      and projects.user_id =
        (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id =
      project_skills.project_id
      and projects.user_id =
        (select auth.uid())
  )
);

create policy "Users manage own evidence"
on public.skill_evidence
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);