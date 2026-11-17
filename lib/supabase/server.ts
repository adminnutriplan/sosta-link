import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

export function createClient() {
  const { url, key } = supabaseEnv();
  const store = cookies();
  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(list: { name: string; value: string; options: CookieOptions }[]) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // dipanggil dari Server Component: aman diabaikan, middleware yang menyegarkan sesi
          }
        },
      },
    }
  );
}
