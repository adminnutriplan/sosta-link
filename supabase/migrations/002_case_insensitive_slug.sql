-- Jalankan sekali di Supabase > SQL Editor (untuk database yang sudah berjalan).
-- Membuat slug tidak membedakan huruf besar/kecil: /Cuti, /cuti, /CUTI menuju link yang sama.

-- 1) Cek dulu: query ini harus mengembalikan 0 baris.
--    Jika ada hasil, hapus/ganti salah satu slug kembar di Table Editor sebelum lanjut ke langkah 2.
select lower(slug) as slug, count(*) from public.links group by lower(slug) having count(*) > 1;

-- 2) Cegah slug kembar beda huruf besar/kecil
create unique index if not exists links_slug_lower_key on public.links (lower(slug));

-- 3) Pencarian redirect tidak membedakan huruf besar/kecil
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
   where lower(slug) = lower(p_slug)
   returning url into u;
  return u;
end;
$$;

revoke all on function public.hit_link(text) from public;
grant execute on function public.hit_link(text) to anon, authenticated;
