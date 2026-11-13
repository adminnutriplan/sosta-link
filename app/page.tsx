import { redirect } from "next/navigation";

// Pengunjung yang membuka domain pendek tanpa slug diarahkan ke website utama.
// Dashboard tim ada di /admin.
export default function Home() {
  redirect(process.env.ROOT_REDIRECT_URL || "https://sostain.id");
}
