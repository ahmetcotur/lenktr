import { useState } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { LockKeyhole, Loader2 } from "lucide-react";
import { request } from "../utils/api/client";
export default function PasswordSetupPage() {
  const [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
  async function submit(event) {
    event.preventDefault();
    if (password !== confirmation) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await request("/api/auth/setup-password", {
      token,
      password,
    });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else {
      window.history.replaceState(null, "", window.location.pathname);
      window.location.replace("/dashboard");
    }
  }
  return (
    <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6">
      <SEO title="Yeni şifre belirle | LENK.TR" description="LENK.TR hesabınız için yeni bir şifre belirleyin." url="/account/password" noIndex />
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D0F14] p-8 sm:p-10">
        <Link to="/" className="text-2xl font-black text-blue-500">
          lenk.tr
        </Link>
        <LockKeyhole size={36} className="mt-8 mb-5 text-blue-400" />
        <h1 className="text-2xl font-bold">Yeni şifrenizi belirleyin</h1>
        <p className="text-zinc-400 text-sm mt-3 mb-6 leading-relaxed">
          En az 8 karakter kullanın. Bağlantı bir kez kullanılabilir. Yeni
          şifreniz kaydedildiğinde hesabınız açılır.
        </p>
        {!token ? (
          <p role="alert" className="text-red-400 text-sm">
            Bu sayfayı e-postanızdaki bağlantıdan açın.{" "}
            <Link to="/forgot-password" className="underline">
              Yeni bağlantı isteyin.
            </Link>
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label
              className="block text-sm text-zinc-300"
              htmlFor="setup-password"
            >
              Yeni şifre
            </label>
            <input
              id="setup-password"
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
              type="password"
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              className="block text-sm text-zinc-300"
              htmlFor="setup-confirm"
            >
              Yeni şifreyi tekrar girin
            </label>
            <input
              id="setup-confirm"
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
              type="password"
              minLength={8}
              maxLength={128}
              required
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
            {error && (
              <p role="alert" className="text-red-400 text-sm">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 rounded-xl p-3 font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {busy && <Loader2 className="animate-spin" size={18} />}Şifreyi
              kaydet
            </button>
          </form>
        )}
        <Link
          to="/login"
          className="mt-6 block text-sm text-zinc-400 hover:text-white"
        >
          Giriş sayfasına dön
        </Link>
      </section>
    </main>
  );
}
