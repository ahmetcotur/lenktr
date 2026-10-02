import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck, Loader2 } from "lucide-react";
import { request } from "../utils/api/client";
export default function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  async function verify() {
    setBusy(true);
    const result = await request("/api/auth/verify-email", { token });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else {
      setMessage(result.data.message);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }
  return (
    <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6">
      <section className="w-full max-w-md rounded-3xl bg-[#0D0F14] border border-white/10 p-8 space-y-6">
        <Link to="/" className="text-2xl font-black text-blue-500">
          lenk.tr
        </Link>
        <MailCheck size={40} className="text-blue-400" />
        <h1 className="text-2xl font-bold">E-posta doğrulama</h1>
        {message ? (
          <p role="status" className="text-green-400">
            {message}
          </p>
        ) : (
          <>
            <p className="text-zinc-400">
              Hesabınızın e-posta adresini doğrulamak için aşağıdaki düğmeye
              basın.
            </p>
            {error && (
              <p role="alert" className="text-red-400">
                {error}
              </p>
            )}
            <button
              disabled={busy || !token}
              onClick={verify}
              className="w-full rounded-xl bg-blue-600 p-3 font-bold disabled:opacity-50 flex justify-center gap-2"
            >
              {busy && <Loader2 className="animate-spin" size={18} />}E-postamı
              doğrula
            </button>
          </>
        )}
        <Link
          to="/dashboard"
          className="block text-sm text-zinc-400 hover:text-white"
        >
          Hesabıma dön
        </Link>
      </section>
    </main>
  );
}
