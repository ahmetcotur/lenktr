import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowUpRight, Ban, CheckCircle2, ChevronLeft, ChevronRight, Eye, Link2, LoaderCircle, Pencil, Search, Send, Trash2, Users, X } from "lucide-react";
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
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noticeType, setNoticeType] = useState("system");
  const [noticeAudience, setNoticeAudience] = useState("all");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeSending, setNoticeSending] = useState(false);
  const [noticeResult, setNoticeResult] = useState("");
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

  function openEditor(type, item = {}) {
    const fields = type === "profile"
      ? { full_name: details.user.full_name || "", avatar_url: details.user.avatar_url || "" }
      : type === "link"
        ? { title: item.title || "", original_url: item.original_url || "", short_slug: item.short_slug || "", is_archived: Boolean(item.is_archived) }
        : { profile_title: item.profile_title || "", slug: item.slug || "", profile_bio: item.profile_bio || "", is_published: Boolean(item.is_published) };
    setEditor({ type, id: item.id, values: fields });
  }

  async function submitEditor(event) {
    event.preventDefault();
    if (!editor || !details || saving) return;
    setSaving(true);
    setError("");
    const paths = {
      profile: `/api/admin/users/${details.user.id}/profile`,
      link: `/api/admin/users/${details.user.id}/links/${editor.id}`,
      bio: `/api/admin/users/${details.user.id}/bio-pages/${editor.id}`,
    };
    try {
      const response = await fetch(paths[editor.type], {
        method: "PATCH", credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(editor.values),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Değişiklik kaydedilemedi.");
      setEditor(null);
      const [fresh] = await Promise.all([
        getData(`/api/admin/users/${details.user.id}`),
        loadUsers(),
      ]);
      setDetails(fresh);
    } catch (cause) { setError(cause.message); }
    finally { setSaving(false); }
  }

  async function removeRecord(type, item = {}) {
    if (!details || deleting) return;
    const base = `/api/admin/users/${details.user.id}`;
    let path = base;
    if (type === "link") path += `/links/${item.id}`;
    if (type === "bio") path += `/bio-pages/${item.id}`;
    if (type === "user") {
      const typed = window.prompt(`Bu işlem ${details.user.email} hesabını ve tüm bağlantılarını kalıcı olarak siler. Onaylamak için e-posta adresini yaz:`);
      if (typed !== details.user.email) return;
    } else if (!window.confirm(type === "link" ? `“${item.short_slug}” kısa bağlantısı kalıcı olarak silinsin mi?` : `“${item.slug}” bio sayfası kalıcı olarak silinsin mi?`)) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(path, { method: "DELETE", credentials: "same-origin", headers: { Accept: "application/json" } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Kayıt silinemedi.");
      if (type === "user") {
        setDetails(null);
        setSelected(null);
        await loadUsers();
      } else {
        const [fresh] = await Promise.all([getData(base), loadUsers()]);
        setDetails(fresh);
      }
    } catch (cause) { setError(cause.message); }
    finally { setDeleting(false); }
  }

  function updateEditor(key, value) {
    setEditor((current) => ({ ...current, values: { ...current.values, [key]: value } }));
  }

  async function sendNotification(event) {
    event.preventDefault();
    if (noticeSending || (noticeAudience === "user" && !selected)) return;
    if (noticeAudience === "all" && !window.confirm("Bildirim tüm aktif hesaplara gönderilecek. Devam edilsin mi?")) return;
    setNoticeSending(true);
    setNoticeResult("");
    setError("");
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: noticeType,
          content: noticeContent,
          audience: noticeAudience,
          ...(noticeAudience === "user" ? { user_id: selected.id } : {}),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Bildirim gönderilemedi.");
      setNoticeResult(`${number(payload.data.sent)} kullanıcıya bildirim gönderildi.`);
      setNoticeContent("");
    } catch (cause) { setError(cause.message); }
    finally { setNoticeSending(false); }
  }

  return (
    <div className="space-y-7">
      <SEO title="Yönetim paneli | LENK.TR" description="LENK.TR kullanıcı ve içerik yönetimi." url="/admin" noIndex />
      <header className="flex flex-col gap-2 border-b border-white/5 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">LENK.TR / Yönetim</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Admin paneli</h1><p className="mt-1 text-sm text-zinc-400">Kullanıcı profillerini ve oluşturdukları bağlantıları görüntüle.</p></div>
        <span className="text-xs text-zinc-500">Hesap ve içerik yönetimi</span>
      </header>

      {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"><AlertCircle size={17} />{error}</div>}

      <section aria-label="Genel istatistikler" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-white/5 bg-[#101319] p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-400 sm:text-sm">{label}</span><Icon size={17} className="text-blue-400" /></div><p className="mt-3 text-2xl font-bold text-white">{value == null ? "—" : number(value)}</p></article>)}
      </section>

      <form onSubmit={sendNotification} className="space-y-4 rounded-2xl border border-white/5 bg-[#101319] p-4 sm:p-5">
        <div><h2 className="font-semibold text-white">Kullanıcılara bildirim gönder</h2><p className="mt-1 text-sm text-zinc-500">Bildirim, alıcının LENK.TR bildirim merkezinde görünür. Saatte en fazla 20 gönderim yapılabilir.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-medium text-zinc-400">Alıcı<select value={noticeAudience} onChange={(event) => { setNoticeAudience(event.target.value); setNoticeResult(""); }} className="w-full rounded-xl border border-white/10 bg-[#0b0d12] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"><option value="all">Tüm aktif kullanıcılar</option><option value="user" disabled={!selected}>Seçili kullanıcı: {selected?.email || "önce kullanıcı seç"}</option></select></label>
          <label className="space-y-1.5 text-xs font-medium text-zinc-400">Tür<select value={noticeType} onChange={(event) => setNoticeType(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0b0d12] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"><option value="system">Sistem bildirimi</option><option value="alert">Uyarı</option></select></label>
        </div>
        <label className="block space-y-1.5 text-xs font-medium text-zinc-400">Bildirim metni<textarea required minLength={1} maxLength={1000} rows={3} value={noticeContent} onChange={(event) => setNoticeContent(event.target.value)} placeholder="Kullanıcılara iletilecek mesajı yazın…" className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0d12] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500" /><span className="block text-right text-[11px] text-zinc-600">{noticeContent.length}/1000</span></label>
        <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-emerald-300">{noticeResult}</p><button type="submit" disabled={noticeSending || !noticeContent.trim() || (noticeAudience === "user" && !selected)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{noticeSending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}{noticeAudience === "all" ? "Herkese gönder" : "Seçili kullanıcıya gönder"}</button></div>
      </form>

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
            <article className="flex min-w-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#101319] p-4 sm:p-5"><div className="flex min-w-0 items-center gap-4"><div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-blue-500/10 font-semibold text-blue-300">{details.user.avatar_url ? <img src={details.user.avatar_url} alt="" className="size-full object-cover" /> : (details.user.full_name || details.user.email || "U").slice(0, 1).toUpperCase()}</div><div className="min-w-0"><h2 className="truncate font-semibold text-white">{details.user.full_name || "İsimsiz profil"}</h2><p className="truncate text-sm text-zinc-400">{details.user.email}</p><p className="mt-1 text-xs text-zinc-500">Kayıt: {new Date(details.user.created_at).toLocaleDateString("tr-TR")}</p>{details.user.access_disabled && <p className="mt-1 text-xs text-red-300">Erişim kısıtlı{details.user.access_disabled_reason ? ` · ${details.user.access_disabled_reason}` : ""}</p>}</div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => openEditor("profile")} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"><Pencil size={14} />Profili düzenle</button><button type="button" onClick={toggleAccess} disabled={accessSaving || details.user.is_admin} title={details.user.is_admin ? "Yönetici hesabının erişimi buradan değiştirilemez" : undefined} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${details.user.access_disabled ? "border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10" : "border-red-500/20 text-red-300 hover:bg-red-500/10"}`}>{accessSaving ? <LoaderCircle size={15} className="animate-spin" /> : details.user.access_disabled ? <CheckCircle2 size={15} /> : <Ban size={15} />}{details.user.access_disabled ? "Erişimi aç" : "Erişimi kısıtla"}</button><button type="button" onClick={() => void removeRecord("user")} disabled={deleting || details.user.is_admin} title={details.user.is_admin ? "Yönetici hesabı panelden silinemez" : "Hesabı kalıcı sil"} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-40"><Trash2 size={14} />Hesabı sil</button></div></article>
            <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#101319]"><div className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 sm:px-5"><h3 className="font-semibold text-white">Kısa bağlantılar</h3><span className="text-xs text-zinc-500">{number(details.links.length)} gösteriliyor · son 200</span></div>{details.links.length ? <div className="divide-y divide-white/5">{details.links.map((link) => <div key={link.id} className="flex min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-5"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{link.title || link.short_slug}</p><a href={`https://lenk.tr/${encodeURIComponent(link.short_slug)}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300">lenk.tr/{link.short_slug}</a><p className="mt-0.5 truncate text-xs text-zinc-500" title={link.original_url}>{link.original_url}</p><p className="mt-1 text-xs text-zinc-400">{number(link.clicks)} tık{link.is_archived ? " · arşivli" : ""}</p></div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => openEditor("link", link)} aria-label={`${link.short_slug} bağlantısını düzenle`} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"><Pencil size={15} /></button><button type="button" onClick={() => void removeRecord("link", link)} disabled={deleting} aria-label={`${link.short_slug} bağlantısını sil`} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-40"><Trash2 size={15} /></button></div></div>)}</div> : <p className="p-6 text-sm text-zinc-500">Henüz kısa bağlantı oluşturmamış.</p>}</article>
            <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#101319]"><div className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 sm:px-5"><h3 className="font-semibold text-white">Bio sayfaları</h3><span className="text-xs text-zinc-500">{number(details.bio_pages.length)} gösteriliyor · son 100</span></div>{details.bio_pages.length ? <div className="divide-y divide-white/5">{details.bio_pages.map((bio) => <div key={bio.id} className="flex min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-5"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{bio.profile_title || bio.slug}</p><Link to={`/${encodeURIComponent(bio.slug)}`} target="_blank" className="text-xs text-blue-400 hover:text-blue-300">lenk.tr/{bio.slug}</Link><p className="mt-1 text-xs text-zinc-400">{number(bio.views)} görüntülenme{bio.is_published ? " · yayında" : " · taslak"}</p></div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => openEditor("bio", bio)} aria-label={`${bio.slug} bio sayfasını düzenle`} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"><Pencil size={15} /></button><button type="button" onClick={() => void removeRecord("bio", bio)} disabled={deleting} aria-label={`${bio.slug} bio sayfasını sil`} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-40"><Trash2 size={15} /></button></div></div>)}</div> : <p className="p-6 text-sm text-zinc-500">Henüz bio sayfası oluşturmamış.</p>}</article>
          </> : <div className="grid min-h-52 place-items-center rounded-2xl border border-white/5 bg-[#101319] p-6 text-center text-sm text-zinc-500">Görüntülemek için kullanıcı seç.</div>}
        </section>
      </div>

      {editor && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditor(null); }}><form role="dialog" aria-modal="true" aria-labelledby="admin-editor-title" onSubmit={submitEditor} className="w-full max-w-xl space-y-5 rounded-2xl border border-white/10 bg-[#11141b] p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Yönetici düzenlemesi</p><h2 id="admin-editor-title" className="mt-1 text-xl font-semibold text-white">{editor.type === "profile" ? "Profili düzenle" : editor.type === "link" ? "Kısa bağlantıyı düzenle" : "Bio sayfasını düzenle"}</h2></div><button type="button" onClick={() => setEditor(null)} disabled={saving} aria-label="Kapat" className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 disabled:opacity-50"><X size={18} /></button></div><div className="space-y-4">{Object.entries(editor.values).map(([key, value]) => { const checkbox = typeof value === "boolean"; const textarea = key === "profile_bio"; const labels = { full_name: "Ad soyad", avatar_url: "Avatar görseli URL’si", title: "Link başlığı", original_url: "Hedef URL", short_slug: "Kısa adres", is_archived: "Bağlantıyı arşivle", profile_title: "Bio başlığı", slug: "Bio adresi", profile_bio: "Bio açıklaması", is_published: "Bio sayfasını yayımla" }; return <label key={key} className={checkbox ? "flex items-center gap-3 text-sm text-zinc-200" : "block space-y-1.5 text-sm text-zinc-300"}>{checkbox ? <><input type="checkbox" checked={value} onChange={(event) => updateEditor(key, event.target.checked)} className="size-4 accent-blue-500" />{labels[key]}</> : <>{labels[key]}{textarea ? <textarea rows={5} value={value} onChange={(event) => updateEditor(key, event.target.value)} className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none focus:border-blue-500" /> : <input type={key === "original_url" ? "url" : "text"} required={key === "original_url" || key === "short_slug" || key === "slug"} value={value} onChange={(event) => updateEditor(key, event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none focus:border-blue-500" />}</>}</label>; })}</div><div className="flex justify-end gap-2 border-t border-white/5 pt-4"><button type="button" onClick={() => setEditor(null)} disabled={saving} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5">Vazgeç</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Pencil size={15} />}Kaydet</button></div></form></div>}
    </div>
  );
}
