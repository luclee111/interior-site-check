-- Allow the master To-do dashboard to store rows in public.field_items.
-- Safe to run once after the original schema setup.

alter table public.field_items
  drop constraint if exists field_items_source_check;

alter table public.field_items
  add constraint field_items_source_check
  check (source in ('lighting', 'outlets', 'todo'));
