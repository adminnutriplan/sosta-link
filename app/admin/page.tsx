import { createClient } from "@/lib/supabase/server";
import CopyButton from "@/components/CopyButton";
import { createLink, deleteLink, signOut, updateLink } from "./actions";

export const dynamic = "force-dynamic";

type LinkRow = {
  id: string;
  slug: string;
  url: string;
  clicks: number;
  last_clicked_at: string | null;
  created_at: string;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export default async function AdminPage({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("links")
    .select("id, slug, url, clicks, last_clicked_at, created_at")
    .order("created_at", { ascending: false });
  const links = (data ?? []) as LinkRow[];
  const base = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");

  return (
    <div className="wrap">
      <header className="top">
        <h1>
          Sostain <span>Link</span>
        </h1>
        <form action={signOut}>
          <button className="ghost" type="submit">
            Keluar
          </button>
        </form>
      </header>

      {searchParams.error && <div className="err">{searchParams.error}</div>}

      <form action={createLink} className="card">
        <div className="row">
          <input className="grow" name="url" placeholder="Tempel link tujuan (https://...)" required />
          <input name="slug" placeholder="slug (opsional)" style={{ width: 170 }} />
          <button type="submit">Buat link</button>
        </div>
        <div className="meta" style={{ marginTop: 8, marginBottom: 0 }}>
          Kosongkan slug untuk dibuatkan otomatis. Contoh hasil: {base || "https://domain-anda"}/menu
        </div>
      </form>

      <div className="card">
        {links.length === 0 && <div className="empty">Belum ada link.</div>}
        {links.map((l) => {
          const short = `${base}/${l.slug}`;
          return (
            <div className="item" key={l.id}>
              <div className="short">{short}</div>
              <div className="dest">→ {l.url}</div>
              <div className="meta">
                {l.clicks} klik · dibuat {fmt(l.created_at)}
                {l.last_clicked_at ? ` · klik terakhir ${fmt(l.last_clicked_at)}` : ""}
              </div>
              <div className="row">
                <CopyButton text={short} />
                <form action={updateLink} className="row" style={{ flex: "1 1 260px" }}>
                  <input type="hidden" name="id" value={l.id} />
                  <input className="grow" name="url" defaultValue={l.url} aria-label="Ubah URL tujuan" />
                  <button className="ghost" type="submit">
                    Simpan
                  </button>
                </form>
                <form action={deleteLink}>
                  <input type="hidden" name="id" value={l.id} />
                  <button className="danger" type="submit">
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
