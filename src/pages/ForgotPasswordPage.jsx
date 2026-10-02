import { useState } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { request } from "../utils/api/client";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await request("/api/auth/forgot-password", { email });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else setMessage(result.data.message);
  }
  return (
    <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6">
      <SEO title="Şifre sıfırlama | LENK.TR" description="LENK.TR hesabınız için yeni şifre bağlantısı isteyin." url="/forgot-password" noIndex />
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D0F14] p-8 sm:p-10">
        <Link to="/" className="text-2xl font-black text-blue-500">
          lenk.tr
        </Link>
        <div className="my-8 w-12 h-12 rounded-2xl bg-blue-500/10 grid place-items-center">
          <Mail className="text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold">Şifrenizi mi unuttunuz?</h1>
        <p className="mt-3 mb-6 text-zinc-400 leading-relaxed">
          Hesabınızın e-posta adresini girin. Yeni şifre belirleyebilmeniz için
          size bir bağlantı göndereceğiz.
        </p>
        {message ? (
          <div
            role="status"
            className="p-4 rounded-xl bg-blue-500/10 text-blue-300 flex gap-3"
          >
            <CheckCircle2 className="shrink-0" />
            <p>{message}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label
              className="block text-sm text-zinc-300"
              htmlFor="recovery-email"
            >
              E-posta adresi
            </label>
            <input
              id="recovery-email"
              autoComplete="email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 focus:outline-none focus:border-blue-500"
            />
            {error && (
              <p role="alert" className="text-red-400 text-sm">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 p-3 font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={18} className="animate-spin" />}Bağlantı
              gönder
            </button>
          </form>
        )}
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Giriş sayfasına dön
        </Link>
      </section>
    </main>
  );
}
