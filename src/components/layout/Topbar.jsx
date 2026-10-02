import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, Menu, Link2, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { createClient } from "../../utils/api/client";
const api = createClient();
export default function Topbar({ onMenu }) {
  const navigate = useNavigate(),
    location = useLocation(),
    { user } = useAuth(),
    { i18n } = useTranslation(),
    input = useRef(null);
  const english = i18n.language.startsWith("en");
  const [open, setOpen] = useState(false),
    [notifications, setNotifications] = useState([]),
    [search, setSearch] = useState(""),
    [results, setResults] = useState([]),
    [searching, setSearching] = useState(false);
  useEffect(() => {
    api
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setNotifications(data || []));
  }, [user, location.pathname]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (search.trim().length < 2) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      const [links, bios] = await Promise.all([
        api.from("links").select("id,title,short_slug,original_url"),
        api.from("bio_pages").select("id,profile_title,slug"),
      ]);
      if (!cancelled) {
        const query = search.toLocaleLowerCase();
        setResults(
          [
            ...(links.data || []).map((l) => ({
              id: l.id,
              title: l.title || l.short_slug,
              slug: l.short_slug,
              path: "/links",
              type: "link",
            })),
            ...(bios.data || []).map((b) => ({
              id: b.id,
              title: b.profile_title || b.slug,
              slug: b.slug,
              path: `/bio/editor?id=${b.id}`,
              type: "bio",
            })),
          ]
            .filter((r) =>
              (r.title + " " + r.slug).toLocaleLowerCase().includes(query),
            )
            .slice(0, 8),
        );
        setSearching(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);
  async function markRead(id) {
    const { error } = await api
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    if (!error)
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
  }
  const unread = notifications.filter((n) => !n.is_read).length;
  return (
    <header className="h-16 border-b border-white/5 bg-[#08090D]/95 backdrop-blur-xl flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30">
      <button
        onClick={onMenu}
        aria-label={english ? "Open menu" : "Menüyü aç"}
        className="lg:hidden text-zinc-400 p-2 rounded-lg hover:bg-white/5"
      >
        <Menu size={21} />
      </button>
      <div className="relative flex-1 max-w-lg min-w-0">
        <Search size={17} className="absolute left-3 top-3 text-zinc-500" />
        <input
          ref={input}
          aria-label={
            english
              ? "Search links and bio pages"
              : "Bağlantı ve bio sayfası ara"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            english ? "Search your links…" : "Bağlantılarınızda arayın…"
          }
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50"
        />
        {search.trim().length >= 2 && (
          <div
            role="listbox"
            aria-label="Arama sonuçları"
            className="absolute top-full mt-2 left-0 w-full min-w-[220px] rounded-xl border border-white/10 bg-[#11141D] shadow-2xl p-2 max-h-80 overflow-y-auto"
          >
            {searching ? (
              <p className="p-3 text-sm text-zinc-400">
                {english ? "Searching…" : "Aranıyor…"}
              </p>
            ) : results.length ? (
              results.map((r) => (
                <button
                  role="option"
                  aria-selected="false"
                  key={r.id}
                  onClick={() => {
                    navigate(
                      r.type === "link"
                        ? `/links?q=${encodeURIComponent(r.slug)}`
                        : r.path,
                    );
                    setSearch("");
                  }}
                  className="w-full text-left flex gap-3 items-center p-3 rounded-lg hover:bg-white/5"
                >
                  {r.type === "link" ? (
                    <Link2 size={18} className="text-blue-400" />
                  ) : (
                    <UserCircle size={18} className="text-purple-400" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm text-white truncate">
                      {r.title}
                    </span>
                    <span className="block text-xs text-zinc-500 truncate">
                      lenk.tr/{r.slug}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="p-3 text-sm text-zinc-400">
                {english
                  ? "No matching links or pages."
                  : "Eşleşen bağlantı veya sayfa bulunamadı."}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="ml-auto flex gap-3 sm:gap-5 items-center shrink-0">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            aria-label={english ? "Notifications" : "Bildirimler"}
            aria-expanded={open}
            className="p-2 text-zinc-400 hover:text-white relative"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1 right-0 bg-blue-600 text-white text-[9px] min-w-4 h-4 rounded-full grid place-items-center">
                {unread}
              </span>
            )}
          </button>
          {open && (
            <>
              <button
                aria-label="Bildirimleri kapat"
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <section className="fixed sm:absolute top-16 sm:top-full left-3 right-3 sm:left-auto sm:right-0 sm:w-80 z-50 rounded-2xl border border-white/10 bg-[#11141D] shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <h2 className="text-sm font-bold">
                    {english ? "Notifications" : "Bildirimler"}
                  </h2>
                  {unread > 0 && (
                    <button
                      onClick={() =>
                        Promise.all(
                          notifications
                            .filter((n) => !n.is_read)
                            .map((n) => markRead(n.id)),
                        )
                      }
                      className="text-xs text-blue-400"
                    >
                      {english ? "Mark all read" : "Tümünü oku"}
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length ? (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 ${n.is_read ? "text-zinc-500" : "text-zinc-200"}`}
                      >
                        <p className="text-sm leading-relaxed">{n.content}</p>
                        <span className="text-xs text-zinc-500 mt-2 block">
                          {new Date(n.created_at).toLocaleString(
                            english ? "en-GB" : "tr-TR",
                          )}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="p-6 text-center text-zinc-500 text-sm">
                      {english
                        ? "You’re all caught up."
                        : "Henüz bildiriminiz yok."}
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
        <button
          onClick={() => navigate("/settings")}
          aria-label={english ? "Account settings" : "Hesap ayarları"}
          className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 grid place-items-center text-blue-400 font-bold overflow-hidden"
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            (user?.user_metadata?.full_name ||
              user?.email ||
              "U")[0].toUpperCase()
          )}
        </button>
      </div>
    </header>
  );
}
