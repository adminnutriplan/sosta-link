import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
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
