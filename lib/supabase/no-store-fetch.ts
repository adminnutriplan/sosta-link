// Fetch tanpa cache: mencegah Next.js menyimpan respons Supabase di Data Cache.
export const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" });
