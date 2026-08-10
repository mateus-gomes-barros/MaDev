-- MaDev badges and achievements foundation

-- =========================================================
-- ENUMS
-- =========================================================

create type public.badge_category as enum (
  'capability',
  'portfolio',
  'career',
  'seniority',
  'market',
  'platform'
);

create type public.badge_metric as enum (
  'knowledge',
  'practice',
  'evidence',
  'readiness'
);

create type public.badge_award_mode as enum (
  'automatic',
  'review_required',
  'manual'
);

create type public.badge_achievement_status as enum (
  'eligible',
  'awarded',
  'revoked'
);

-- =========================================================
-- BADGE CATALOG
-- =========================================================

create table public.badges (
  id uuid primary key
    default gen_random_uuid(),

  track_id uuid
    references public.tracks(id)
    on delete cascade,

  phase_id uuid
    references public.phases(id)
    on delete cascade,

  slug text
    not null
    unique
    check (
      slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  name text
    not null
    check (
      char_length(trim(name)) > 0
    ),

  description text
    not null
    check (
      char_length(trim(description)) > 0
    ),

  category public.badge_category
    not null,

  award_mode public.badge_award_mode
    not null
    default 'automatic',

  icon_key text
    not null
    default 'award',

  is_published boolean
    not null
    default false,

  sort_order integer
    not null
    default 0
    check (sort_order >= 0),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);

comment on table public.badges is
  'Catalog of verifiable achievements available in MaDev.';

comment on column public.badges.award_mode is
  'Controls whether a badge is automatic, reviewed, or manually granted.';

-- =========================================================
-- BADGE REQUIREMENTS
-- =========================================================

create table public.badge_requirements (
  id uuid primary key
    default gen_random_uuid(),

  badge_id uuid
    not null
    references public.badges(id)
    on delete cascade,

  metric public.badge_metric
    not null,

  target_value numeric(8, 2)
    not null
    check (target_value >= 0),

  is_required boolean
    not null
    default true,

  details jsonb
    not null
    default '{}'::jsonb
    check (
      jsonb_typeof(details) = 'object'
    ),

  sort_order integer
    not null
    default 0
    check (sort_order >= 0),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now()
);

comment on table public.badge_requirements is
  'Independent knowledge, practice, evidence, and readiness requirements for each badge.';

comment on column public.badge_requirements.details is
  'Additional rule filters such as phase, skill, evidence type, or verification requirement.';

-- =========================================================
-- USER ACHIEVEMENTS
-- =========================================================

create table public.user_badges (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  badge_id uuid
    not null
    references public.badges(id)
    on delete cascade,

  status public.badge_achievement_status
    not null
    default 'eligible',

  knowledge_score numeric(5, 2)
    check (
      knowledge_score between 0 and 100
    ),

  practice_score numeric(5, 2)
    check (
      practice_score between 0 and 100
    ),

  evidence_score numeric(5, 2)
    check (
      evidence_score between 0 and 100
    ),

  readiness_score numeric(5, 2)
    check (
      readiness_score between 0 and 100
    ),

  evaluation_snapshot jsonb
    not null
    default '{}'::jsonb
    check (
      jsonb_typeof(evaluation_snapshot)
        = 'object'
    ),

  awarded_at timestamptz,
  revoked_at timestamptz,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  unique (user_id, badge_id),

  check (
    (
      status = 'eligible'
      and awarded_at is null
      and revoked_at is null
    )
    or
    (
      status = 'awarded'
      and awarded_at is not null
      and revoked_at is null
    )
    or
    (
      status = 'revoked'
      and awarded_at is not null
      and revoked_at is not null
    )
  )
);

comment on table public.user_badges is
  'Eligibility and awarded achievements with multidimensional evaluation snapshots.';

comment on column public.user_badges.evaluation_snapshot is
  'Explanation of the data used by the latest badge evaluation.';

-- =========================================================
-- INDEXES
-- =========================================================

create index badges_catalog_idx
on public.badges (
  is_published,
  category,
  sort_order
);

create index badges_track_idx
on public.badges (track_id)
where track_id is not null;

create index badges_phase_idx
on public.badges (phase_id)
where phase_id is not null;

create index badge_requirements_badge_idx
on public.badge_requirements (
  badge_id,
  sort_order
);

create index user_badges_user_status_idx
on public.user_badges (
  user_id,
  status,
  awarded_at desc
);

-- =========================================================
-- AUTOMATIC TIMESTAMPS
-- =========================================================

create trigger badges_set_updated_at
before update on public.badges
for each row
execute function public.set_updated_at();

create trigger badge_requirements_set_updated_at
before update on public.badge_requirements
for each row
execute function public.set_updated_at();

create trigger user_badges_set_updated_at
before update on public.user_badges
for each row
execute function public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.badges
  enable row level security;

alter table public.badge_requirements
  enable row level security;

alter table public.user_badges
  enable row level security;

create policy "Anyone can read published badges"
on public.badges
for select
to anon, authenticated
using (
  is_published = true
);

create policy "Anyone can read published badge requirements"
on public.badge_requirements
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.badges
    where badges.id =
      badge_requirements.badge_id
      and badges.is_published = true
  )
);

create policy "Users read own badge achievements"
on public.user_badges
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

-- There is intentionally no client write policy for
-- user_badges. Achievements will be granted only by a
-- secure evaluation workflow.
