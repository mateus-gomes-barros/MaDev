-- MaDev checklist structure

-- =========================================================
-- OFFICIAL CHECKLISTS
-- =========================================================

create table public.official_checklists (
  id uuid primary key
    default gen_random_uuid(),

  skill_id uuid
    not null
    references public.skills(id)
    on delete cascade,

  slug text
    not null,

  title text
    not null,

  description text,

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
    default now(),

  unique (skill_id, slug)
);

-- =========================================================
-- USER CHECKLISTS
-- =========================================================

create table public.user_checklists (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  skill_id uuid
    references public.skills(id)
    on delete set null,

  custom_skill_id uuid
    references public.user_custom_skills(id)
    on delete set null,

  title text
    not null,

  description text,

  position integer
    not null
    default 0
    check (position >= 0),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint user_checklists_single_skill_target
    check (
      not (
        skill_id is not null
        and custom_skill_id is not null
      )
    )
);

-- =========================================================
-- CHECKLIST ITEMS
-- =========================================================

create table public.checklist_items (
  id uuid primary key
    default gen_random_uuid(),

  official_checklist_id uuid
    references public.official_checklists(id)
    on delete cascade,

  user_checklist_id uuid
    references public.user_checklists(id)
    on delete cascade,

  slug text,

  title text
    not null,

  description text,

  position integer
    not null
    default 0
    check (position >= 0),

  is_required boolean
    not null
    default true,

  estimated_minutes integer
    check (
      estimated_minutes is null
      or estimated_minutes >= 0
    ),

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint checklist_items_single_parent
    check (
      num_nonnulls(
        official_checklist_id,
        user_checklist_id
      ) = 1
    )
);

-- =========================================================
-- USER PROGRESS
-- =========================================================

create table public.user_checklist_item_progress (
  id uuid primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references auth.users(id)
    on delete cascade,

  checklist_item_id uuid
    not null
    references public.checklist_items(id)
    on delete cascade,

  is_completed boolean
    not null
    default false,

  notes text,

  completed_at timestamptz,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  unique (user_id, checklist_item_id)
);

-- =========================================================
-- INDEXES
-- =========================================================

create index official_checklists_skill_position_idx
on public.official_checklists (
  skill_id,
  position
);

create index user_checklists_user_position_idx
on public.user_checklists (
  user_id,
  position
);

create index user_checklists_skill_idx
on public.user_checklists (skill_id)
where skill_id is not null;

create index user_checklists_custom_skill_idx
on public.user_checklists (custom_skill_id)
where custom_skill_id is not null;

create index checklist_items_official_position_idx
on public.checklist_items (
  official_checklist_id,
  position
)
where official_checklist_id is not null;

create index checklist_items_user_position_idx
on public.checklist_items (
  user_checklist_id,
  position
)
where user_checklist_id is not null;

create unique index official_checklist_items_slug_key
on public.checklist_items (
  official_checklist_id,
  slug
)
where
  official_checklist_id is not null
  and slug is not null;

create index checklist_progress_item_idx
on public.user_checklist_item_progress (
  checklist_item_id
);

-- =========================================================
-- AUTOMATIC TIMESTAMPS
-- =========================================================

create trigger official_checklists_set_updated_at
before update on public.official_checklists
for each row
execute function public.set_updated_at();

create trigger user_checklists_set_updated_at
before update on public.user_checklists
for each row
execute function public.set_updated_at();

create trigger checklist_items_set_updated_at
before update on public.checklist_items
for each row
execute function public.set_updated_at();

create trigger checklist_progress_set_updated_at
before update on public.user_checklist_item_progress
for each row
execute function public.set_updated_at();

create function public.sync_checklist_item_completion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_completed then
    new.completed_at =
      coalesce(new.completed_at, now());
  else
    new.completed_at = null;
  end if;

  return new;
end;
$$;

create trigger checklist_progress_sync_completion
before insert or update
on public.user_checklist_item_progress
for each row
execute function public.sync_checklist_item_completion();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.official_checklists
  enable row level security;

alter table public.user_checklists
  enable row level security;

alter table public.checklist_items
  enable row level security;

alter table public.user_checklist_item_progress
  enable row level security;

-- Published official checklists

create policy "Anyone can read published official checklists"
on public.official_checklists
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.skills
    where skills.id =
      official_checklists.skill_id
      and skills.is_published = true
  )
);

-- User-owned checklists

create policy "Users manage own checklists"
on public.user_checklists
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
  and (
    custom_skill_id is null
    or exists (
      select 1
      from public.user_custom_skills
      where user_custom_skills.id =
        user_checklists.custom_skill_id
        and user_custom_skills.user_id =
          (select auth.uid())
    )
  )
);

-- Published official checklist items

create policy "Anyone can read published official checklist items"
on public.checklist_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.official_checklists
    join public.skills
      on skills.id =
        official_checklists.skill_id
    where official_checklists.id =
      checklist_items.official_checklist_id
      and official_checklists.is_published = true
      and skills.is_published = true
  )
);

-- Items from user-owned checklists

create policy "Users manage items from own checklists"
on public.checklist_items
for all
to authenticated
using (
  exists (
    select 1
    from public.user_checklists
    where user_checklists.id =
      checklist_items.user_checklist_id
      and user_checklists.user_id =
        (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.user_checklists
    where user_checklists.id =
      checklist_items.user_checklist_id
      and user_checklists.user_id =
        (select auth.uid())
  )
);

-- Individual item progress

create policy "Users manage own checklist progress"
on public.user_checklist_item_progress
for all
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
  and (
    exists (
      select 1
      from public.checklist_items
      join public.official_checklists
        on official_checklists.id =
          checklist_items.official_checklist_id
      join public.skills
        on skills.id =
          official_checklists.skill_id
      where checklist_items.id =
        user_checklist_item_progress.checklist_item_id
        and official_checklists.is_published = true
        and skills.is_published = true
    )
    or exists (
      select 1
      from public.checklist_items
      join public.user_checklists
        on user_checklists.id =
          checklist_items.user_checklist_id
      where checklist_items.id =
        user_checklist_item_progress.checklist_item_id
        and user_checklists.user_id =
          (select auth.uid())
    )
  )
);
