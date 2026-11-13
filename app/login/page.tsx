import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function signIn(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) redirect("/login?error=1");
  redirect("/admin");
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="login card">
      <h1>
        Sostain <span>Link</span>
      </h1>
      <p style={{ color: "#6b7280", fontSize: 14 }}>Khusus tim Sostain.</p>
      {searchParams.error && <div className="err">Email atau password salah.</div>}
      <form action={signIn}>
        <input name="email" type="email" placeholder="Email" required autoComplete="email" />
        <input name="password" type="password" placeholder="Password" required autoComplete="current-password" />
        <button type="submit">Masuk</button>
      </form>
    </div>
  );
}
