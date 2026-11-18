"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const RESERVED = new Set(["admin", "login", "api", "_next", "favicon.ico", "robots.txt"]);
const SLUG_RE = /^[A-Za-z0-9_-]{1,50}$/;

function fail(msg: string): never {
  redirect(`/admin?error=${encodeURIComponent(msg)}`);
}

function normalizeUrl(raw: string): string {
  let value = raw.trim();
  if (value && !/^https?:\/\//i.test(value)) value = "https://" + value;
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
    return u.toString();
  } catch {
    return fail("URL tujuan tidak valid.");
  }
}

function randomSlug(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(6);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function createLink(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const url = normalizeUrl(String(formData.get("url") ?? ""));
  let slug = String(formData.get("slug") ?? "").trim();

  if (slug) {
    if (!SLUG_RE.test(slug)) fail("Slug hanya boleh huruf, angka, - dan _ (maks 50 karakter).");
    if (RESERVED.has(slug.toLowerCase())) fail(`Slug "${slug}" dicadangkan sistem.`);
  } else {
    slug = randomSlug();
  }

  const { error } = await supabase.from("links").insert({ slug, url, created_by: user.id });
  if (error) {
    if (error.code === "23505") fail(`Slug "${slug}" sudah dipakai.`);
    console.error("createLink error:", error);
    fail(`Gagal menyimpan link (${error.code}: ${error.message}).`);
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateLink(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") ?? "");
  const url = normalizeUrl(String(formData.get("url") ?? ""));
  const { data, error } = await supabase.from("links").update({ url }).eq("id", id).select("id");
  if (!error && (!data || data.length === 0)) fail("Link tidak ditemukan atau tidak bisa diubah.");
  if (error) {
    console.error("updateLink error:", error);
    fail(`Gagal memperbarui link (${error.code}: ${error.message}).`);
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteLink(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") ?? "");
  // .select() agar ketahuan jika RLS/izin membuat 0 baris terhapus (Supabase tidak menganggapnya error)
  const { data, error } = await supabase.from("links").delete().eq("id", id).select("id");
  if (!error && (!data || data.length === 0)) fail("Link tidak terhapus (tidak ditemukan atau tidak ada izin).");
  if (error) {
    console.error("deleteLink error:", error);
    fail(`Gagal menghapus link (${error.code}: ${error.message}).`);
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
