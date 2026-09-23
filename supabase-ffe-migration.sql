-- FF&E / Procurement register for the interior-site-check app.
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.ffe_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  item_code text not null,
  room_name text not null default '공통',
  sub_location text,
  category text not null default '기타',
  name text not null,
  brand text,
  product_name text,
  model text,
  finish text,
  dimensions text,
  qty numeric not null default 1,
  unit text not null default 'EA',
  supplier text,
  supply_responsibility text not null default 'user',
  install_responsibility text,
  spec_status text not null default 'candidate',
  procurement_status text not null default 'not_quoted',
  budget numeric,
  quoted_price numeric,
  ordered_price numeric,
  lead_time_days integer,
  buffer_days integer not null default 5,
  required_on_site_date date,
  order_date date,
  expected_delivery_date date,
  actual_delivery_date date,
  install_date date,
  order_number text,
  product_url text,
  image_url text,
  related_todo_source_item_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, item_code)
);

create index if not exists ffe_items_project_idx on public.ffe_items(project_id);
create index if not exists ffe_items_room_idx on public.ffe_items(project_id, room_name);
create index if not exists ffe_items_status_idx on public.ffe_items(project_id, procurement_status);

create table if not exists public.ffe_links (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.ffe_items(id) on delete cascade,
  label text not null,
  url text not null,
  link_type text not null default 'reference',
  created_at timestamptz not null default now()
);
create index if not exists ffe_links_item_idx on public.ffe_links(item_id);

create table if not exists public.ffe_updates (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.ffe_items(id) on delete cascade,
  note text not null,
  status text,
  created_at timestamptz not null default now()
);
create index if not exists ffe_updates_item_idx on public.ffe_updates(item_id, created_at desc);

alter table public.ffe_items enable row level security;
alter table public.ffe_links enable row level security;
alter table public.ffe_updates enable row level security;

drop policy if exists "ffe_items_select_own" on public.ffe_items;
create policy "ffe_items_select_own" on public.ffe_items
for select using (
  exists(select 1 from public.projects p where p.id=ffe_items.project_id and p.owner_id=auth.uid())
);

drop policy if exists "ffe_items_insert_own" on public.ffe_items;
create policy "ffe_items_insert_own" on public.ffe_items
for insert with check (
  exists(select 1 from public.projects p where p.id=ffe_items.project_id and p.owner_id=auth.uid())
);

drop policy if exists "ffe_items_update_own" on public.ffe_items;
create policy "ffe_items_update_own" on public.ffe_items
for update using (
  exists(select 1 from public.projects p where p.id=ffe_items.project_id and p.owner_id=auth.uid())
) with check (
  exists(select 1 from public.projects p where p.id=ffe_items.project_id and p.owner_id=auth.uid())
);

drop policy if exists "ffe_items_delete_own" on public.ffe_items;
create policy "ffe_items_delete_own" on public.ffe_items
for delete using (
  exists(select 1 from public.projects p where p.id=ffe_items.project_id and p.owner_id=auth.uid())
);

drop policy if exists "ffe_links_all_own" on public.ffe_links;
create policy "ffe_links_all_own" on public.ffe_links
for all using (
  exists(
    select 1 from public.ffe_items i
    join public.projects p on p.id=i.project_id
    where i.id=ffe_links.item_id and p.owner_id=auth.uid()
  )
) with check (
  exists(
    select 1 from public.ffe_items i
    join public.projects p on p.id=i.project_id
    where i.id=ffe_links.item_id and p.owner_id=auth.uid()
  )
);

drop policy if exists "ffe_updates_all_own" on public.ffe_updates;
create policy "ffe_updates_all_own" on public.ffe_updates
for all using (
  exists(
    select 1 from public.ffe_items i
    join public.projects p on p.id=i.project_id
    where i.id=ffe_updates.item_id and p.owner_id=auth.uid()
  )
) with check (
  exists(
    select 1 from public.ffe_items i
    join public.projects p on p.id=i.project_id
    where i.id=ffe_updates.item_id and p.owner_id=auth.uid()
  )
);
