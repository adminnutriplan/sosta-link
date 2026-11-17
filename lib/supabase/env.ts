// Menerima key format baru (sb_publishable_...) maupun anon key legacy.
// Nama variabel harus ditulis literal agar Next.js bisa meng-inline NEXT_PUBLIC_* saat build.
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Env Supabase belum lengkap: set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di Vercel (Settings > Environment Variables), lalu redeploy."
    );
  }
  return { url, key };
}
