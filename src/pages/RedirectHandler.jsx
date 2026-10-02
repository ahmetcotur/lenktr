import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { request } from "../utils/api/client";
import PublicBioPage from "../components/bio/PublicBioPage";
import { Loader2, Link2 } from "lucide-react";
export default function RedirectHandler() {
  const { slug } = useParams(),
    [state, setState] = useState({ slug: null, data: null, error: null });
  useEffect(() => {
    let cancelled = false;
    request(`/api/resolve/${encodeURIComponent(slug)}`, {
      referrer: document.referrer,
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (data?.type === "link" && !error) {
        window.location.replace(data.page.original_url);
        return;
      }
      setState({ slug, data, error });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);
  if (state.slug !== slug)
    return (
      <main
        role="status"
        className="min-h-screen bg-[#08090D] grid place-items-center text-zinc-400"
      >
        <span className="flex gap-3 items-center">
          <Loader2 className="animate-spin text-blue-500" size={22} />
          Bağlantı açılıyor…
        </span>
      </main>
    );
  if (state.data?.type === "bio")
    return <PublicBioPage pageData={state.data.page} />;
  return (
    <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6">
      <section className="max-w-md text-center space-y-5">
        <Link2 size={42} className="mx-auto text-zinc-500" />
        <h1 className="text-2xl font-bold">Bağlantı açılamadı</h1>
        <p className="text-zinc-400 leading-relaxed">
          {state.error?.message ||
            "Bu adres bulunamadı veya artık yayında değil."}
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 text-sm font-semibold"
        >
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  );
}
