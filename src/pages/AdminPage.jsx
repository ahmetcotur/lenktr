import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowUpRight, Ban, CheckCircle2, ChevronLeft, ChevronRight, Eye, Link2, LoaderCircle, Search, Users } from "lucide-react";
import SEO from "../components/SEO";

async function getData(url) {
  const response = await fetch(url, { credentials: "same-origin", headers: { Accept: "application/json" } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || "Yükleme tamamlanamadı.");
  return payload.data;
}

const number = (value) => new Intl.NumberFormat("tr-TR").format(Number(value) || 0);

export default function AdminPage() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessSaving, setAccessSaving] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); setSearch(query.trim()); }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search) params.set("search", search);
      const result = await getData(`/api/admin/users?${params}`);
      setUsers(result.users);
      setTotal(result.total);
      if (!selected && result.users.length) setSelected(result.users[0]);
      if (selected && !result.users.some((user) => user.id === selected.id)) setSelected(result.users[0] || null);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, selected]);

  useEffect(() => {
    getData("/api/admin/overview").then(setOverview).catch((cause) => setError(cause.message));
  }, []);
  useEffect(() => { void loadUsers(); }, [loadUsers]);
  useEffect(() => {
    if (!selected) { setDetails(null); return; }
    let active = true;
    setDetailLoading(true);
    getData(`/api/admin/users/${encodeURIComponent(selected.id)}`)
      .then((result) => { if (active) setDetails(result); })
      .catch((cause) => { if (active) setError(cause.message); })
      .finally(() => { if (active) setDetailLoading(false); });
    return () => { active = false; };
  }, [selected]);

  const stats = [
    ["Kullanıcı", overview?.users, Users],
    ["Kısa bağlantı", overview?.links, Link2],
    ["Bio sayfası", overview?.bio_pages, Eye],
    ["Toplam tıklama", overview?.clicks, ArrowUpRight],
  ];

  async function toggleAccess() {
    if (!details || accessSaving) return;
    const disabled = !details.user.access_disabled;
    const reason = disabled ? window.prompt("Kısıtlama gerekçesi (isteğe bağlı):", "") : "";
    if (reason === null) return;
    setAccessSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(details.user.id)}/access`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ disabled, reason }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Erişim durumu değiştirilemedi.");
      await Promise.all([loadUsers(), getData(`/api/admin/users/${encodeURIComponent(details.user.id)}`).then(setDetails)]);
    } catch (cause) { setError(cause.message); }
    finally { setAccessSaving(false); }
  }

  return (
    <div className="space-y-7">
      <SEO title="Yönetim paneli | LENK.TR" description="LENK.TR kullanıcı ve içerik yönetimi." url="/admin" noIndex />
      <header className="flex flex-col gap-2 border-b border-white/5 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">LENK.TR / Yönetim</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Admin paneli</h1><p className="mt-1 text-sm text-zinc-400">Kullanıcı profillerini ve oluşturdukları bağlantıları görüntüle.</p></div>
        <span className="text-xs text-zinc-500">Salt okunur görünüm</span>
      </header>

      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"><AlertCircle size={17} />{error}</div>}

      <section aria-label="Genel istatistikler" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-white/5 bg-[#101319] p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-400 sm:text-sm">{label}</span><Icon size={17} className="text-blue-400" /></div><p className="mt-3 text-2xl font-bold text-white">{value == null ? "—" : number(value)}</p></article>)}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#101319]">
          <div className="border-b border-white/5 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold text-white">Kullanıcılar</h2><p className="mt-1 text-xs text-zinc-500">{number(total)} hesap</p></div><span className="text-xs text-zinc-500">Sayfa {page}</span></div>
            <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><Search size={16} className="shrink-0 text-zinc-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ad veya e-posta ara" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-zinc-600" /></label>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? <div className="flex justify-center p-10"><LoaderCircle className="animate-spin text-blue-400" /></div> : users.length ? users.map((user) => <button type="button" key={user.id} onClick={() => setSelected(user)} className={`flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03] sm:px-5 ${selected?.id === user.id ? "bg-blue-500/[0.07]" : ""}`}><span className="min-w-0"><span className="block truncate text-sm font-medium text-white">{user.full_name || "İsimsiz profil"}{user.access_disabled ? <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-red-400">Kısıtlı</span> : null}</span><span className="mt-0.5 block truncate text-xs text-zinc-500">{user.email}</span></span><span className="shrink-0 text-right text-xs text-zinc-400">{number(user.links_count)} link<br />{number(user.bio_pages_count)} bio</span></button>) : <p className="p-8 text-center text-sm text-zinc-500">Kullanıcı bulunamadı.</p>}
          </div>
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 sm:px-5"><span className="text-xs text-zinc-500">{total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} / {number(total)}</span><div className="flex gap-2"><button type="button" aria-label="Önceki sayfa" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-white/10 p-2 text-zinc-300 disabled:opacity-30"><ChevronLeft size={16} /></button><button type="button" aria-label="Sonraki sayfa" disabled={page * pageSize >= total || loading} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-white/10 p-2 text-zinc-300 disabled:opacity-30"><ChevronRight size={16} /></button></div></div>
        </section>

        <section className="min-w-0 space-y-5">
          {detailLoading ? <div className="grid min-h-52 place-items-center rounded-2xl border border-white/5 bg-[#101319]"><LoaderCircle className="animate-spin text-blue-400" /></div> : details ? <>
            <article className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#101319] p-4 sm:p-5"><div className="flex min-w-0 items-center gap-4"><div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-blue-500/10 font-semibold text-blue-300">{details.user.avatar_url ? <img src={details.user.avatar_url} alt="" className="size-full object-cover" /> : (details.user.full_name || details.user.email || "U").slice(0, 1).toUpperCase()}</div><div className="min-w-0"><h2 className="truncate font-semibold text-white">{details.user.full_name || "İsimsiz profil"}</h2><p className="truncate text-sm text-zinc-400">{details.user.email}</p><p className="mt-1 text-xs text-zinc-500">Kayıt: {new Date(details.user.created_at).toLocaleDateString("tr-TR")}</p>{details.user.access_disabled && <p className="mt-1 text-xs text-red-300">Erişim kısıtlı{details.user.access_disabled_reason ? ` · ${details.user.access_disabled_reason}` : ""}</p>}</div></div><button type="button" onClick={toggleAccess} disabled={accessSaving} className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${details.user.access_disabled ? "border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10" : "border-red-500/20 text-red-300 hover:bg-red-500/10"}`}>{accessSaving ? <LoaderCircle size={15} className="animate-spin" /> : details.user.access_disabled ? <CheckCircle2 size={15} /> : <Ban size={15} />}{details.user.access_disabled ? "Erişimi aç" : "Erişimi kısıtla"}</button></article>
            <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#101319]"><div className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 sm:px-5"><h3 className="font-semibold text-white">Kısa bağlantılar</h3><span className="text-xs text-zinc-500">{number(details.links.length)} gösteriliyor · son 200</span></div>{details.links.length ? <div className="divide-y divide-white/5">{details.links.map((link) => <div key={link.id} className="flex min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-5"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{link.title || link.short_slug}</p><a href={`https://lenk.tr/${encodeURIComponent(link.short_slug)}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300">lenk.tr/{link.short_slug}</a><p className="mt-0.5 truncate text-xs text-zinc-500" title={link.original_url}>{link.original_url}</p></div><span className="shrink-0 text-xs text-zinc-400">{number(link.clicks)} tık</span></div>)}</div> : <p className="p-6 text-sm text-zinc-500">Henüz kısa bağlantı oluşturmamış.</p>}</article>
            <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#101319]"><div className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 sm:px-5"><h3 className="font-semibold text-white">Bio sayfaları</h3><span className="text-xs text-zinc-500">{number(details.bio_pages.length)} gösteriliyor · son 100</span></div>{details.bio_pages.length ? <div className="divide-y divide-white/5">{details.bio_pages.map((bio) => <div key={bio.id} className="flex min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-5"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{bio.profile_title || bio.slug}</p><Link to={`/${encodeURIComponent(bio.slug)}`} target="_blank" className="text-xs text-blue-400 hover:text-blue-300">lenk.tr/{bio.slug}</Link></div><span className="shrink-0 text-xs text-zinc-400">{number(bio.views)} görüntülenme</span></div>)}</div> : <p className="p-6 text-sm text-zinc-500">Henüz bio sayfası oluşturmamış.</p>}</article>
          </> : <div className="grid min-h-52 place-items-center rounded-2xl border border-white/5 bg-[#101319] p-6 text-center text-sm text-zinc-500">Görüntülemek için kullanıcı seç.</div>}
        </section>
      </div>
    </div>
  );
}
