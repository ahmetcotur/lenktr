import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  Ban,
  Bell,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Layers,
  Link2,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

async function getData(url) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || "Yükleme tamamlanamadı.");
  return payload.data;
}

const number = (value) => new Intl.NumberFormat("tr-TR").format(Number(value) || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

export default function AdminPage() {
  const { user: currentAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("users"); // "users" | "links" | "bio_pages" | "notifications"
  const [overview, setOverview] = useState(null);
  const [copiedText, setCopiedText] = useState("");
  const [error, setError] = useState("");
  const [globalLoading, setGlobalLoading] = useState(false);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersQuery, setUsersQuery] = useState("");
  const [usersSearch, setUsersSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Global links tab state
  const [linksList, setLinksList] = useState([]);
  const [linksTotal, setLinksTotal] = useState(0);
  const [linksPage, setLinksPage] = useState(1);
  const [linksQuery, setLinksQuery] = useState("");
  const [linksSearch, setLinksSearch] = useState("");
  const [linksStatus, setLinksStatus] = useState("all"); // "all" | "active" | "archived"
  const [linksLoading, setLinksLoading] = useState(false);

  // Global bio pages tab state
  const [biosList, setBiosList] = useState([]);
  const [biosTotal, setBiosTotal] = useState(0);
  const [biosPage, setBiosPage] = useState(1);
  const [biosQuery, setBiosQuery] = useState("");
  const [biosSearch, setBiosSearch] = useState("");
  const [biosStatus, setBiosStatus] = useState("all"); // "all" | "published" | "draft"
  const [biosLoading, setBiosLoading] = useState(false);

  // Actions / Modals state
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [accessSaving, setAccessSaving] = useState(false);

  // Notifications state
  const [noticeType, setNoticeType] = useState("system");
  const [noticeAudience, setNoticeAudience] = useState("all");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeSending, setNoticeSending] = useState(false);
  const [noticeResult, setNoticeResult] = useState("");

  const pageSize = 20;

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    });
  };

  // Debounced search for Users
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsersPage(1);
      setUsersSearch(usersQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [usersQuery]);

  // Debounced search for Links
  useEffect(() => {
    const timer = setTimeout(() => {
      setLinksPage(1);
      setLinksSearch(linksQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [linksQuery]);

  // Debounced search for Bio Pages
  useEffect(() => {
    const timer = setTimeout(() => {
      setBiosPage(1);
      setBiosSearch(biosQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [biosQuery]);

  // Load Overview stats
  const loadOverview = useCallback(async () => {
    try {
      const data = await getData("/api/admin/overview");
      setOverview(data);
    } catch (cause) {
      setError(cause.message);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  // Load Users
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(usersPage),
        pageSize: String(pageSize),
      });
      if (usersSearch) params.set("search", usersSearch);
      const result = await getData(`/api/admin/users?${params}`);
      setUsers(result.users || []);
      setUsersTotal(result.total || 0);

      // Auto select first user if none or if missing
      setSelectedUser((prev) => {
        if (!prev && result.users?.length) return result.users[0];
        if (prev && !result.users?.some((u) => u.id === prev.id)) {
          return result.users?.[0] || null;
        }
        return prev;
      });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setUsersLoading(false);
    }
  }, [usersPage, usersSearch]);

  useEffect(() => {
    if (activeTab === "users") {
      void loadUsers();
    }
  }, [activeTab, loadUsers]);

  // Load Selected User Details
  useEffect(() => {
    if (!selectedUser) {
      setUserDetails(null);
      return;
    }
    let active = true;
    setDetailLoading(true);
    getData(`/api/admin/users/${encodeURIComponent(selectedUser.id)}`)
      .then((result) => {
        if (active) setUserDetails(result);
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedUser]);

  // Load Global Links
  const loadLinks = useCallback(async () => {
    setLinksLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(linksPage),
        pageSize: String(pageSize),
        status: linksStatus,
      });
      if (linksSearch) params.set("search", linksSearch);
      const result = await getData(`/api/admin/links?${params}`);
      setLinksList(result.links || []);
      setLinksTotal(result.total || 0);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLinksLoading(false);
    }
  }, [linksPage, linksSearch, linksStatus]);

  useEffect(() => {
    if (activeTab === "links") {
      void loadLinks();
    }
  }, [activeTab, loadLinks]);

  // Load Global Bio Pages
  const loadBioPages = useCallback(async () => {
    setBiosLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(biosPage),
        pageSize: String(pageSize),
        status: biosStatus,
      });
      if (biosSearch) params.set("search", biosSearch);
      const result = await getData(`/api/admin/bio-pages?${params}`);
      setBiosList(result.bio_pages || []);
      setBiosTotal(result.total || 0);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBiosLoading(false);
    }
  }, [biosPage, biosSearch, biosStatus]);

  useEffect(() => {
    if (activeTab === "bio_pages") {
      void loadBioPages();
    }
  }, [activeTab, loadBioPages]);

  // Refresh current view
  const refreshCurrentView = async () => {
    setGlobalLoading(true);
    await loadOverview();
    if (activeTab === "users") {
      await loadUsers();
      if (selectedUser) {
        const fresh = await getData(`/api/admin/users/${selectedUser.id}`).catch(() => null);
        if (fresh) setUserDetails(fresh);
      }
    } else if (activeTab === "links") {
      await loadLinks();
    } else if (activeTab === "bio_pages") {
      await loadBioPages();
    }
    setGlobalLoading(false);
  };

  // Jump to specific user from links or bio pages
  const inspectUser = (userId, userEmail, userName) => {
    setActiveTab("users");
    setSelectedUser({ id: userId, email: userEmail, full_name: userName });
    setUsersSearch(userEmail || "");
    setUsersQuery(userEmail || "");
  };

  // Toggle user restriction
  async function toggleAccess() {
    if (!userDetails || accessSaving) return;
    const disabled = !userDetails.user.access_disabled;
    const reason = disabled ? window.prompt("Kısıtlama gerekçesi (isteğe bağlı):", "") : "";
    if (reason === null) return;
    setAccessSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userDetails.user.id)}/access`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ disabled, reason }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Erişim durumu değiştirilemedi.");
      await Promise.all([
        loadUsers(),
        getData(`/api/admin/users/${encodeURIComponent(userDetails.user.id)}`).then(setUserDetails),
      ]);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setAccessSaving(false);
    }
  }

  // Open Editor Modal
  function openEditor(type, item = {}, userId = null) {
    const targetUserId = userId || userDetails?.user?.id;
    const fields =
      type === "profile"
        ? { full_name: item.full_name || userDetails?.user?.full_name || "", avatar_url: item.avatar_url || userDetails?.user?.avatar_url || "" }
        : type === "link"
          ? {
              title: item.title || "",
              original_url: item.original_url || "",
              short_slug: item.short_slug || "",
              is_archived: Boolean(item.is_archived),
            }
          : {
              profile_title: item.profile_title || "",
              slug: item.slug || "",
              profile_bio: item.profile_bio || "",
              is_published: Boolean(item.is_published),
            };
    setEditor({ type, id: item.id, userId: targetUserId, values: fields });
  }

  // Submit Editor Modal
  async function submitEditor(event) {
    event.preventDefault();
    if (!editor || saving) return;
    setSaving(true);
    setError("");

    let path = "";
    if (editor.type === "profile") {
      path = `/api/admin/users/${editor.userId}/profile`;
    } else if (editor.type === "link") {
      path = `/api/admin/links/${editor.id}`;
    } else if (editor.type === "bio") {
      path = `/api/admin/bio-pages/${editor.id}`;
    }

    try {
      const response = await fetch(path, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(editor.values),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Değişiklik kaydedilemedi.");

      setEditor(null);
      await loadOverview();
      if (activeTab === "users" && userDetails) {
        const fresh = await getData(`/api/admin/users/${userDetails.user.id}`);
        setUserDetails(fresh);
        await loadUsers();
      } else if (activeTab === "links") {
        await loadLinks();
      } else if (activeTab === "bio_pages") {
        await loadBioPages();
      }
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSaving(false);
    }
  }

  // Remove Record
  async function removeRecord(type, item = {}) {
    if (deleting) return;
    let path = "";
    if (type === "link") {
      if (!window.confirm(`“${item.short_slug}” kısa bağlantısı kalıcı olarak silinsin mi?`)) return;
      path = `/api/admin/links/${item.id}`;
    } else if (type === "bio") {
      if (!window.confirm(`“${item.slug}” bio sayfası kalıcı olarak silinsin mi?`)) return;
      path = `/api/admin/bio-pages/${item.id}`;
    } else if (type === "user") {
      const typed = window.prompt(
        `Bu işlem ${userDetails?.user?.email} hesabını ve tüm bağlantılarını kalıcı olarak siler. Onaylamak için e-posta adresini yazın:`
      );
      if (typed !== userDetails?.user?.email) return;
      path = `/api/admin/users/${userDetails.user.id}`;
    }

    setDeleting(true);
    setError("");
    try {
      const response = await fetch(path, {
        method: "DELETE",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Kayıt silinemedi.");

      await loadOverview();
      if (type === "user") {
        setUserDetails(null);
        setSelectedUser(null);
        await loadUsers();
      } else if (activeTab === "users" && userDetails) {
        const fresh = await getData(`/api/admin/users/${userDetails.user.id}`);
        setUserDetails(fresh);
        await loadUsers();
      } else if (activeTab === "links") {
        await loadLinks();
      } else if (activeTab === "bio_pages") {
        await loadBioPages();
      }
    } catch (cause) {
      setError(cause.message);
    } finally {
      setDeleting(false);
    }
  }

  function updateEditor(key, value) {
    setEditor((current) => ({
      ...current,
      values: { ...current.values, [key]: value },
    }));
  }

  // Send Notification
  async function sendNotification(event) {
    event.preventDefault();
    if (noticeSending || (noticeAudience === "user" && !selectedUser)) return;
    if (
      noticeAudience === "all" &&
      !window.confirm("Bildirim tüm aktif hesaplara gönderilecek. Devam edilsin mi?")
    )
      return;
    setNoticeSending(true);
    setNoticeResult("");
    setError("");
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: noticeType,
          content: noticeContent,
          audience: noticeAudience,
          ...(noticeAudience === "user" ? { user_id: selectedUser.id } : {}),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "Bildirim gönderilemedi.");
      setNoticeResult(`${number(payload.data?.sent || 1)} kullanıcıya bildirim başarıyla gönderildi.`);
      setNoticeContent("");
    } catch (cause) {
      setError(cause.message);
    } finally {
      setNoticeSending(false);
    }
  }

  const statCards = [
    { label: "Toplam Kullanıcı", value: overview?.users, icon: Users, tab: "users", color: "from-blue-500/20 to-blue-600/5 text-blue-400" },
    { label: "Kısa Bağlantılar", value: overview?.links, icon: Link2, tab: "links", color: "from-cyan-500/20 to-cyan-600/5 text-cyan-400" },
    { label: "Bio Sayfaları", value: overview?.bio_pages, icon: Eye, tab: "bio_pages", color: "from-purple-500/20 to-purple-600/5 text-purple-400" },
    { label: "Toplam Tıklama", value: overview?.clicks, icon: ArrowUpRight, tab: null, color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400" },
  ];

  return (
    <div className="space-y-7 pb-12">
      <SEO title="Sistem Yönetimi | LENK.TR" description="LENK.TR kullanıcı ve içerik yönetim merkezi." url="/admin" noIndex />

      {/* Page Header */}
      <header className="flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
            <ShieldCheck size={16} />
            <span>Sistem Yöneticisi Paneli</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Yönetim ve İçerik Kontrolü</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Kullanıcıları, oluşturdukları bio sayfalarını ve kısa linkleri tek bir merkezden görüntüleyin ve yönetin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101319] px-3.5 py-2 text-xs text-zinc-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Yönetici:</span>
            <span className="font-semibold text-white">{currentAdmin?.email || "ahmet@ahmetcotur.com"}</span>
          </div>

          <button
            type="button"
            onClick={refreshCurrentView}
            disabled={globalLoading}
            title="Verileri Yenile"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#101319] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={globalLoading ? "animate-spin" : ""} />
            <span>Yenile</span>
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={18} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-200">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Overview Cards */}
      <section aria-label="Genel İstatistikler" className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          const isClickable = Boolean(item.tab);
          return (
            <article
              key={item.label}
              onClick={() => item.tab && setActiveTab(item.tab)}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#101319] p-4.5 transition sm:p-5 ${
                isClickable ? "cursor-pointer hover:border-blue-500/30 hover:bg-[#141822]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400 sm:text-sm">{item.label}</span>
                <div className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${item.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {item.value == null ? "—" : number(item.value)}
              </p>
              {isClickable && (
                <span className="mt-2 block text-[11px] font-medium text-zinc-500 transition group-hover:text-blue-400">
                  Görüntülemek için tıklayın →
                </span>
              )}
            </article>
          );
        })}
      </section>

      {/* Main Tab Navigation */}
      <nav className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3" aria-label="Yönetim Sekmeleri">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "users"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Users size={17} />
          <span>Kullanıcılar</span>
          {overview?.users != null && (
            <span className={`ml-1 rounded-md px-1.5 py-0.5 text-xs ${activeTab === "users" ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"}`}>
              {number(overview.users)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("links")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "links"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Link2 size={17} />
          <span>Tüm Kısa Linkler</span>
          {overview?.links != null && (
            <span className={`ml-1 rounded-md px-1.5 py-0.5 text-xs ${activeTab === "links" ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"}`}>
              {number(overview.links)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bio_pages")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "bio_pages"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Eye size={17} />
          <span>Tüm Bio Sayfaları</span>
          {overview?.bio_pages != null && (
            <span className={`ml-1 rounded-md px-1.5 py-0.5 text-xs ${activeTab === "bio_pages" ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"}`}>
              {number(overview.bio_pages)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "notifications"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Bell size={17} />
          <span>Bildirim Gönder</span>
        </button>
      </nav>

      {/* TAB 1: USERS & USER DETAIL INSPECTOR */}
      {activeTab === "users" && (
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.4fr)]">
          {/* Users List Column */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#101319]">
            <div className="border-b border-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-white">Kayıtlı Kullanıcılar</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">{number(usersTotal)} hesap bulundu</p>
                </div>
                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-zinc-400">Sayfa {usersPage}</span>
              </div>

              <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3">
                <Search size={16} className="shrink-0 text-zinc-500" />
                <input
                  value={usersQuery}
                  onChange={(event) => setUsersQuery(event.target.value)}
                  placeholder="İsim veya e-posta ile ara…"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-zinc-600"
                />
                {usersQuery && (
                  <button type="button" onClick={() => setUsersQuery("")} className="text-zinc-500 hover:text-white">
                    <X size={15} />
                  </button>
                )}
              </label>
            </div>

            <div className="divide-y divide-white/5">
              {usersLoading ? (
                <div className="flex justify-center p-12">
                  <LoaderCircle className="animate-spin text-blue-400" size={28} />
                </div>
              ) : users.length ? (
                users.map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  const isAdminUser = String(user.email).toLowerCase() === "ahmet@ahmetcotur.com";
                  return (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.04] sm:px-5 ${
                        isSelected ? "bg-blue-600/[0.12] border-l-2 border-blue-500" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 font-bold text-blue-400 text-sm">
                          {(user.full_name || user.email || "U").slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-white">
                              {user.full_name || "İsimsiz profil"}
                            </span>
                            {isAdminUser && (
                              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                                Admin
                              </span>
                            )}
                            {user.access_disabled && (
                              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-400">
                                Kısıtlı
                              </span>
                            )}
                          </div>
                          <span className="mt-0.5 block truncate text-xs text-zinc-400">{user.email}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right text-xs">
                        <span className="font-semibold text-white">{number(user.links_count)}</span>{" "}
                        <span className="text-zinc-500">link</span>
                        <br />
                        <span className="font-semibold text-white">{number(user.bio_pages_count)}</span>{" "}
                        <span className="text-zinc-500">bio</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="p-8 text-center text-sm text-zinc-500">Kullanıcı bulunamadı.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 sm:px-5">
              <span className="text-xs text-zinc-400">
                {usersTotal ? (usersPage - 1) * pageSize + 1 : 0}–{Math.min(usersPage * pageSize, usersTotal)} / {number(usersTotal)}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Önceki sayfa"
                  disabled={usersPage <= 1 || usersLoading}
                  onClick={() => setUsersPage((value) => value - 1)}
                  className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Sonraki sayfa"
                  disabled={usersPage * pageSize >= usersTotal || usersLoading}
                  onClick={() => setUsersPage((value) => value + 1)}
                  className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* User Details Inspector */}
          <section className="min-w-0 space-y-6">
            {detailLoading ? (
              <div className="grid min-h-64 place-items-center rounded-2xl border border-white/5 bg-[#101319]">
                <LoaderCircle className="animate-spin text-blue-400" size={32} />
              </div>
            ) : userDetails ? (
              <>
                {/* Profile Header Card */}
                <article className="rounded-2xl border border-white/5 bg-[#101319] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-lg font-bold text-blue-300">
                        {userDetails.user.avatar_url ? (
                          <img src={userDetails.user.avatar_url} alt="" className="size-full object-cover" />
                        ) : (
                          (userDetails.user.full_name || userDetails.user.email || "U").slice(0, 1).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-xl font-bold text-white">
                            {userDetails.user.full_name || "İsimsiz profil"}
                          </h2>
                          {userDetails.user.is_admin && (
                            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">
                              Yönetici
                            </span>
                          )}
                          {userDetails.user.access_disabled && (
                            <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-300">
                              Erişim Kısıtlı
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-zinc-400">{userDetails.user.email}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Kayıt: {formatDate(userDetails.user.created_at)}
                          {userDetails.user.access_disabled_reason && (
                            <span className="ml-2 text-red-300">· {userDetails.user.access_disabled_reason}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor("profile", userDetails.user)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
                      >
                        <Pencil size={14} />
                        Profili düzenle
                      </button>

                      <button
                        type="button"
                        onClick={toggleAccess}
                        disabled={accessSaving || userDetails.user.is_admin}
                        title={userDetails.user.is_admin ? "Yönetici hesabının erişimi buradan değiştirilemez" : undefined}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                          userDetails.user.access_disabled
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                        }`}
                      >
                        {accessSaving ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : userDetails.user.access_disabled ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Ban size={14} />
                        )}
                        {userDetails.user.access_disabled ? "Erişimi aç" : "Kısıtla"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void removeRecord("user")}
                        disabled={deleting || userDetails.user.is_admin}
                        title={userDetails.user.is_admin ? "Yönetici hesabı panelden silinemez" : "Hesabı kalıcı sil"}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/15 disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                        Hesabı sil
                      </button>
                    </div>
                  </div>
                </article>

                {/* User's Created Links */}
                <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#101319]">
                  <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link2 size={17} className="text-cyan-400" />
                      <h3 className="font-bold text-white">Kullanıcının Oluşturduğu Kısa Linkler</h3>
                    </div>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                      {number(userDetails.links.length)} link
                    </span>
                  </div>

                  {userDetails.links.length ? (
                    <div className="divide-y divide-white/5">
                      {userDetails.links.map((link) => {
                        const shortUrl = `https://lenk.tr/${link.short_slug}`;
                        return (
                          <div key={link.id} className="flex min-w-0 items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-white/[0.02]">
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold text-white">
                                  {link.title || link.short_slug}
                                </span>
                                {link.is_archived && (
                                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                                    Arşivli
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <a
                                  href={shortUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                >
                                  <span>lenk.tr/{link.short_slug}</span>
                                  <ExternalLink size={12} />
                                </a>

                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(shortUrl)}
                                  className="text-zinc-500 hover:text-zinc-300"
                                  title="Kısa linki kopyala"
                                >
                                  {copiedText === shortUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                </button>

                                <span className="text-zinc-600">·</span>
                                <span className="font-semibold text-emerald-400">{number(link.clicks)} tıklama</span>
                                <span className="text-zinc-600">·</span>
                                <span className="text-zinc-500">{formatDate(link.created_at)}</span>
                              </div>

                              <p className="truncate text-xs text-zinc-500" title={link.original_url}>
                                ↳ {link.original_url}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditor("link", link)}
                                aria-label={`${link.short_slug} bağlantısını düzenle`}
                                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => void removeRecord("link", link)}
                                disabled={deleting}
                                aria-label={`${link.short_slug} bağlantısını sil`}
                                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="p-8 text-center text-sm text-zinc-500">Bu kullanıcı henüz kısa link oluşturmamış.</p>
                  )}
                </article>

                {/* User's Created Bio Pages */}
                <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#101319]">
                  <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Eye size={17} className="text-purple-400" />
                      <h3 className="font-bold text-white">Kullanıcının Oluşturduğu Bio Sayfaları</h3>
                    </div>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                      {number(userDetails.bio_pages.length)} sayfa
                    </span>
                  </div>

                  {userDetails.bio_pages.length ? (
                    <div className="divide-y divide-white/5">
                      {userDetails.bio_pages.map((bio) => {
                        const bioUrl = `https://lenk.tr/${bio.slug}`;
                        return (
                          <div key={bio.id} className="flex min-w-0 items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-white/[0.02]">
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-semibold text-white">
                                  {bio.profile_title || bio.slug}
                                </span>
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                    bio.is_published
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : "bg-amber-500/20 text-amber-300"
                                  }`}
                                >
                                  {bio.is_published ? "Yayında" : "Taslak"}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <Link
                                  to={`/${encodeURIComponent(bio.slug)}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
                                >
                                  <span>lenk.tr/{bio.slug}</span>
                                  <ExternalLink size={12} />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(bioUrl)}
                                  className="text-zinc-500 hover:text-zinc-300"
                                  title="Bio linkini kopyala"
                                >
                                  {copiedText === bioUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                </button>

                                <span className="text-zinc-600">·</span>
                                <span className="font-semibold text-purple-400">{number(bio.views)} görüntülenme</span>
                                <span className="text-zinc-600">·</span>
                                <span className="text-zinc-500">{formatDate(bio.created_at)}</span>
                              </div>

                              {bio.profile_bio && (
                                <p className="truncate text-xs text-zinc-400 italic">
                                  “{bio.profile_bio}”
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditor("bio", bio)}
                                aria-label={`${bio.slug} bio sayfasını düzenle`}
                                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => void removeRecord("bio", bio)}
                                disabled={deleting}
                                aria-label={`${bio.slug} bio sayfasını sil`}
                                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="p-8 text-center text-sm text-zinc-500">Bu kullanıcı henüz bio sayfası oluşturmamış.</p>
                  )}
                </article>
              </>
            ) : (
              <div className="grid min-h-64 place-items-center rounded-2xl border border-white/5 bg-[#101319] p-8 text-center text-zinc-500">
                <div>
                  <Users size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-white">Kullanıcı Seçin</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Oluşturduğu linkleri ve bio sayfalarını incelemek için soldaki listeden bir kullanıcıya tıklayın.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 2: ALL SHORT LINKS ACROSS PLATFORM */}
      {activeTab === "links" && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#101319] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">Tüm Kullanıcıların Kısa Bağlantıları</h2>
              <p className="text-xs text-zinc-400">
                Sistem genelinde oluşturulan tüm linkleri listeleyin, inceleyin veya düzenleyin ({number(linksTotal)} bağlantı).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Pills */}
              <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
                {[
                  { key: "all", label: "Tümü" },
                  { key: "active", label: "Aktif" },
                  { key: "archived", label: "Arşivli" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setLinksStatus(item.key);
                      setLinksPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      linksStatus === item.key ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3">
                <Search size={15} className="text-zinc-500" />
                <input
                  value={linksQuery}
                  onChange={(event) => setLinksQuery(event.target.value)}
                  placeholder="Link, hedef URL veya kullanıcı ara…"
                  className="w-56 bg-transparent py-2 text-xs text-white outline-none placeholder:text-zinc-600 sm:w-64"
                />
                {linksQuery && (
                  <button type="button" onClick={() => setLinksQuery("")} className="text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          </div>

          {/* Links Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#101319]">
            {linksLoading ? (
              <div className="flex justify-center p-16">
                <LoaderCircle className="animate-spin text-blue-400" size={32} />
              </div>
            ) : linksList.length ? (
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="border-b border-white/5 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Kısa Link</th>
                    <th scope="col" className="px-5 py-3.5">Hedef URL & Başlık</th>
                    <th scope="col" className="px-5 py-3.5">Oluşturan</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Tıklama</th>
                    <th scope="col" className="px-5 py-3.5">Durum</th>
                    <th scope="col" className="px-5 py-3.5">Tarih</th>
                    <th scope="col" className="px-5 py-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {linksList.map((link) => {
                    const shortUrl = `https://lenk.tr/${link.short_slug}`;
                    return (
                      <tr key={link.id} className="transition hover:bg-white/[0.02]">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={shortUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-sm font-semibold text-blue-400 hover:text-blue-300"
                            >
                              lenk.tr/{link.short_slug}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(shortUrl)}
                              className="text-zinc-500 hover:text-zinc-300"
                              title="Linki kopyala"
                            >
                              {copiedText === shortUrl ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </td>

                        <td className="max-w-xs truncate px-5 py-4">
                          <p className="truncate font-medium text-white">{link.title || link.short_slug}</p>
                          <p className="truncate text-xs text-zinc-500" title={link.original_url}>
                            {link.original_url}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <button
                            type="button"
                            onClick={() => inspectUser(link.user_id, link.user_email, link.user_name)}
                            className="text-left group"
                          >
                            <span className="block text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition">
                              {link.user_name || "İsimsiz"}
                            </span>
                            <span className="block text-[11px] text-zinc-500 group-hover:underline">
                              {link.user_email}
                            </span>
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <span className="inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                            {number(link.clicks)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {link.is_archived ? (
                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-400">
                              Arşivli
                            </span>
                          ) : (
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                              Aktif
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-zinc-400">
                          {formatDate(link.created_at)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditor("link", link, link.user_id)}
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                              title="Düzenle"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => void removeRecord("link", link)}
                              disabled={deleting}
                              className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                              title="Sil"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-sm text-zinc-500">Kriterlere uygun kısa bağlantı bulunamadı.</div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-white/5 px-5 py-3.5">
              <span className="text-xs text-zinc-400">
                {linksTotal ? (linksPage - 1) * pageSize + 1 : 0}–{Math.min(linksPage * pageSize, linksTotal)} / {number(linksTotal)}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={linksPage <= 1 || linksLoading}
                  onClick={() => setLinksPage((p) => p - 1)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  Önceki
                </button>
                <button
                  type="button"
                  disabled={linksPage * pageSize >= linksTotal || linksLoading}
                  onClick={() => setLinksPage((p) => p + 1)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ALL BIO PAGES ACROSS PLATFORM */}
      {activeTab === "bio_pages" && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#101319] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white">Tüm Kullanıcıların Bio Sayfaları</h2>
              <p className="text-xs text-zinc-400">
                Sistem genelinde oluşturulan tüm bio sayfalarını listeleyin ({number(biosTotal)} sayfa).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Pills */}
              <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
                {[
                  { key: "all", label: "Tümü" },
                  { key: "published", label: "Yayında" },
                  { key: "draft", label: "Taslak" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setBiosStatus(item.key);
                      setBiosPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      biosStatus === item.key ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3">
                <Search size={15} className="text-zinc-500" />
                <input
                  value={biosQuery}
                  onChange={(event) => setBiosQuery(event.target.value)}
                  placeholder="Bio adresi, başlık veya kullanıcı ara…"
                  className="w-56 bg-transparent py-2 text-xs text-white outline-none placeholder:text-zinc-600 sm:w-64"
                />
                {biosQuery && (
                  <button type="button" onClick={() => setBiosQuery("")} className="text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          </div>

          {/* Bio Pages Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#101319]">
            {biosLoading ? (
              <div className="flex justify-center p-16">
                <LoaderCircle className="animate-spin text-blue-400" size={32} />
              </div>
            ) : biosList.length ? (
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="border-b border-white/5 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Bio Adresi</th>
                    <th scope="col" className="px-5 py-3.5">Sayfa Başlığı & Biyografi</th>
                    <th scope="col" className="px-5 py-3.5">Oluşturan</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Görüntülenme</th>
                    <th scope="col" className="px-5 py-3.5">Durum</th>
                    <th scope="col" className="px-5 py-3.5">Tarih</th>
                    <th scope="col" className="px-5 py-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {biosList.map((bio) => {
                    const bioUrl = `https://lenk.tr/${bio.slug}`;
                    return (
                      <tr key={bio.id} className="transition hover:bg-white/[0.02]">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/${encodeURIComponent(bio.slug)}`}
                              target="_blank"
                              className="font-mono text-sm font-semibold text-purple-400 hover:text-purple-300"
                            >
                              lenk.tr/{bio.slug}
                            </Link>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(bioUrl)}
                              className="text-zinc-500 hover:text-zinc-300"
                              title="Bio linkini kopyala"
                            >
                              {copiedText === bioUrl ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </td>

                        <td className="max-w-xs truncate px-5 py-4">
                          <p className="truncate font-medium text-white">{bio.profile_title || bio.slug}</p>
                          {bio.profile_bio && (
                            <p className="truncate text-xs text-zinc-500 italic" title={bio.profile_bio}>
                              {bio.profile_bio}
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <button
                            type="button"
                            onClick={() => inspectUser(bio.user_id, bio.user_email, bio.user_name)}
                            className="text-left group"
                          >
                            <span className="block text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition">
                              {bio.user_name || "İsimsiz"}
                            </span>
                            <span className="block text-[11px] text-zinc-500 group-hover:underline">
                              {bio.user_email}
                            </span>
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <span className="inline-block rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-400">
                            {number(bio.views)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold ${
                              bio.is_published
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {bio.is_published ? "Yayında" : "Taslak"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-zinc-400">
                          {formatDate(bio.created_at)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/${encodeURIComponent(bio.slug)}`}
                              target="_blank"
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                              title="Sayfayı aç"
                            >
                              <ExternalLink size={15} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEditor("bio", bio, bio.user_id)}
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                              title="Düzenle"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => void removeRecord("bio", bio)}
                              disabled={deleting}
                              className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                              title="Sil"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-sm text-zinc-500">Kriterlere uygun bio sayfası bulunamadı.</div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-white/5 px-5 py-3.5">
              <span className="text-xs text-zinc-400">
                {biosTotal ? (biosPage - 1) * pageSize + 1 : 0}–{Math.min(biosPage * pageSize, biosTotal)} / {number(biosTotal)}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={biosPage <= 1 || biosLoading}
                  onClick={() => setBiosPage((p) => p - 1)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  Önceki
                </button>
                <button
                  type="button"
                  disabled={biosPage * pageSize >= biosTotal || biosLoading}
                  onClick={() => setBiosPage((p) => p + 1)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: BROADCAST & SYSTEM NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <form onSubmit={sendNotification} className="max-w-3xl space-y-5 rounded-2xl border border-white/5 bg-[#101319] p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-white">Kullanıcılara Bildirim Gönder</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Gönderilen bildirimler kullanıcıların LENK.TR bildirim merkezinde doğrudan görünür. Saatte en fazla 20 bildirim gönderilebilir.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-medium text-zinc-400">
              <span>Alıcı Kitle</span>
              <select
                value={noticeAudience}
                onChange={(event) => {
                  setNoticeAudience(event.target.value);
                  setNoticeResult("");
                }}
                className="w-full rounded-xl border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="all">Tüm aktif kullanıcılar ({number(overview?.users || 0)} hesap)</option>
                <option value="user" disabled={!selectedUser}>
                  Seçili kullanıcı: {selectedUser?.email || "(Kullanıcılar sekmesinden seçin)"}
                </option>
              </select>
            </label>

            <label className="space-y-1.5 text-xs font-medium text-zinc-400">
              <span>Bildirim Türü</span>
              <select
                value={noticeType}
                onChange={(event) => setNoticeType(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="system">Sistem Duyurusu</option>
                <option value="alert">Güvenlik / Önemli Uyarı</option>
              </select>
            </label>
          </div>

          <label className="block space-y-1.5 text-xs font-medium text-zinc-400">
            <span>Bildirim Metni</span>
            <textarea
              required
              minLength={1}
              maxLength={1000}
              rows={4}
              value={noticeContent}
              onChange={(event) => setNoticeContent(event.target.value)}
              placeholder="Kullanıcılara iletilecek duyuru veya bilgilendirme mesajını buraya yazın…"
              className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0d12] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
            />
            <span className="block text-right text-[11px] text-zinc-600">{noticeContent.length} / 1000 karakter</span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
            <p role="status" className="text-sm font-medium text-emerald-300">
              {noticeResult}
            </p>
            <button
              type="submit"
              disabled={noticeSending || !noticeContent.trim() || (noticeAudience === "user" && !selectedUser)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {noticeSending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
              {noticeAudience === "all" ? "Herkese Gönder" : "Seçili Kullanıcıya Gönder"}
            </button>
          </div>
        </form>
      )}

      {/* UNIFIED EDITOR MODAL */}
      {editor && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditor(null);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-editor-title"
            onSubmit={submitEditor}
            className="w-full max-w-xl space-y-5 rounded-2xl border border-white/10 bg-[#11141b] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Yönetici Düzenlemesi</p>
                <h2 id="admin-editor-title" className="mt-1 text-xl font-bold text-white">
                  {editor.type === "profile"
                    ? "Kullanıcı Profilini Düzenle"
                    : editor.type === "link"
                      ? "Kısa Bağlantıyı Düzenle"
                      : "Bio Sayfasını Düzenle"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditor(null)}
                disabled={saving}
                aria-label="Kapat"
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(editor.values).map(([key, value]) => {
                const checkbox = typeof value === "boolean";
                const textarea = key === "profile_bio";
                const labels = {
                  full_name: "Ad Soyad",
                  avatar_url: "Avatar Görseli URL'si",
                  title: "Link Başlığı",
                  original_url: "Hedef URL (Varış Noktası)",
                  short_slug: "Kısa Adres (Slug)",
                  is_archived: "Bağlantıyı Arşivle",
                  profile_title: "Bio Başlığı",
                  slug: "Bio Sayfa Adresi (Slug)",
                  profile_bio: "Bio Açıklama Metni",
                  is_published: "Bio Sayfasını Yayımla (Aktif)",
                };

                return (
                  <label
                    key={key}
                    className={
                      checkbox
                        ? "flex items-center gap-3 text-sm text-zinc-200 cursor-pointer"
                        : "block space-y-1.5 text-sm text-zinc-300"
                    }
                  >
                    {checkbox ? (
                      <>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(event) => updateEditor(key, event.target.checked)}
                          className="size-4 accent-blue-600 rounded"
                        />
                        <span>{labels[key] || key}</span>
                      </>
                    ) : (
                      <>
                        <span>{labels[key] || key}</span>
                        {textarea ? (
                          <textarea
                            rows={4}
                            value={value}
                            onChange={(event) => updateEditor(key, event.target.value)}
                            className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
                          />
                        ) : (
                          <input
                            type={key === "original_url" ? "url" : "text"}
                            required={key === "original_url" || key === "short_slug" || key === "slug"}
                            value={value}
                            onChange={(event) => updateEditor(key, event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
                          />
                        )}
                      </>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setEditor(null)}
                disabled={saving}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Pencil size={15} />}
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
