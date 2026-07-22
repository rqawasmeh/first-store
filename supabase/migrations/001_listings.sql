-- Listings table for 1upthrift.jo
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

-- Anyone can read listings
create policy "Public read listings"
  on public.listings
  for select
  to anon, authenticated
  using (true);

-- No direct writes from client (dev uses Edge Function with service role)
create policy "No public insert"
  on public.listings
  for insert
  to anon, authenticated
  with check (false);

create policy "No public update"
  on public.listings
  for update
  to anon, authenticated
  using (false);

create policy "No public delete"
  on public.listings
  for delete
  to anon, authenticated
  using (false);

-- Storage bucket for listing images
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Public read listing images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'listing-images');

create policy "No public upload listing images"
  on storage.objects
  for insert
  to anon, authenticated
  with check (false);

-- Seed initial listings (edit names/prices in dev panel after deploy)
insert into public.listings (id, name, price, image_url, available, created_at) values
  ('11111111-1111-1111-1111-111111111101', 'Vintage Tee #1', 15, '/listings/tshirt1.png', true, '2026-07-22T00:00:00Z'),
  ('11111111-1111-1111-1111-111111111102', 'Vintage Tee #2', 15, '/listings/tshirt2.png', true, '2026-07-22T00:00:01Z'),
  ('11111111-1111-1111-1111-111111111103', 'Vintage Tee #3', 18, '/listings/tshirt3.png', true, '2026-07-22T00:00:02Z'),
  ('11111111-1111-1111-1111-111111111104', 'Vintage Cap', 12, '/listings/cap1.png', true, '2026-07-22T00:00:03Z')
on conflict (id) do nothing;
