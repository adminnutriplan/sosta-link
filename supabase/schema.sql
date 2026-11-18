-- Jalankan di Supabase > SQL Editor

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[A-Za-z0-9_-]{1,50}$'),
  url text not null check (url ~* '^https?://'),
  clicks integer not null default 0,
  last_clicked_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.links enable row level security;

-- Hak akses tabel untuk role login (RLS di bawah tetap membatasi baris)
grant select, insert, update, delete on public.links to authenticated;

-- Hanya user yang login (tim) yang boleh melihat & mengubah tabel
create policy "tim bisa baca" on public.links for select to authenticated using (true);
create policy "tim bisa tambah" on public.links for insert to authenticated with check (true);
create policy "tim bisa ubah" on public.links for update to authenticated using (true);
create policy "tim bisa hapus" on public.links for delete to authenticated using (true);

-- Fungsi redirect: publik hanya bisa mencari URL dari slug (tidak bisa melihat daftar)
create or replace function public.hit_link(p_slug text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  u text;
begin
  update public.links
     set clicks = clicks + 1, last_clicked_at = now()
   where slug = p_slug
   returning url into u;
  return u;
end;
$$;

revoke all on function public.hit_link(text) from public;
grant execute on function public.hit_link(text) to anon, authenticated;
