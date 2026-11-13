# Sostain Link

Pemendek link internal tim Sostain. Tanpa iklan, redirect langsung (302), login khusus tim.
Stack: Next.js 14 + Supabase + Vercel.

## Setup

### 1. Supabase
1. Buat project di supabase.com.
2. SQL Editor → tempel isi `supabase/schema.sql` → Run.
3. Authentication → Providers → Email: **matikan "Allow new users to sign up"** (penting, supaya tidak publik).
4. Authentication → Users → **Add user** → buat akun untuk tiap anggota tim (email + password).
5. Settings → API → salin Project URL dan anon key.

### 2. Deploy ke Vercel
1. Upload folder ini ke repo GitHub, lalu Import di Vercel.
2. Isi Environment Variables seperti `.env.example`.
3. Settings → Domains → tambahkan domain/subdomain pendek (mis. `go.sostain.id`), lalu ikuti instruksi DNS Vercel (biasanya CNAME ke `cname.vercel-dns.com`).
4. Deploy ulang setelah env diisi.

### 3. Jalankan lokal
```
cp .env.example .env.local
npm install
npm run dev
```

## Catatan
- Slug `admin`, `login`, `api` dicadangkan sistem.
- Publik hanya bisa membuka `/slug`; daftar link tidak bisa dilihat tanpa login.
- Menghapus link = link tersebut langsung mati (404). Pastikan tidak dipakai di materi cetak.

## Domain
- Domain pendek: `sosta.id` (set `NEXT_PUBLIC_BASE_URL=https://sosta.id`).
- Membuka `sosta.id` tanpa slug diarahkan ke `https://sostain.id` (ubah lewat `ROOT_REDIRECT_URL`).
- Dashboard tim: `https://sosta.id/admin` (simpan sebagai bookmark).
