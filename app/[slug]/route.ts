import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/supabase/env";
import { noStoreFetch } from "@/lib/supabase/no-store-fetch";

export const dynamic = "force-dynamic";
// Wajib: di Next 14 "force-dynamic" saja tidak mematikan Data Cache untuk fetch di route handler,
// sehingga hasil hit_link per slug tersimpan permanen (link terhapus tetap redirect, klik tidak bertambah).
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const { url: sbUrl, key: sbKey } = supabaseEnv();
  const supabase = createClient(
    sbUrl,
    sbKey,
    {
      auth: { persistSession: false },
      global: { fetch: noStoreFetch },
    }
  );

  const { data: url } = await supabase.rpc("hit_link", { p_slug: params.slug });

  if (!url || typeof url !== "string") {
    return new NextResponse("Link tidak ditemukan.", { status: 404 });
  }

  // 302 (bukan 301) agar perubahan URL tujuan langsung berlaku dan tidak di-cache browser
  const res = NextResponse.redirect(url, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
