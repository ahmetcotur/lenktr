import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  UserCircle,
  BarChart3,
  Settings,
  LogOut,
  Languages,
  ShieldCheck,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
export default function Sidebar({ onClose }) {
  const navigate = useNavigate(),
    { signOut, user } = useAuth(),
    { t, i18n } = useTranslation();
  const links = [
    {
      icon: LayoutDashboard,
      label: t("sidebar.menu.overview"),
      path: "/dashboard",
    },
    { icon: Link2, label: t("sidebar.menu.myLinks"), path: "/links" },
    { icon: UserCircle, label: t("sidebar.menu.bioPage"), path: "/bio" },
    { icon: BarChart3, label: t("sidebar.menu.analytics"), path: "/analytics" },
    { icon: Settings, label: t("sidebar.menu.settings"), path: "/settings" },
    ...(user?.app_metadata?.role === "admin"
      ? [{ icon: ShieldCheck, label: "Yönetim", path: "/admin" }]
      : []),
  ];
  async function logout() {
    const { error } = await signOut();
    if (!error) {
      onClose?.();
      navigate("/login");
    }
  }
  return (
    <aside className="w-[280px] h-dvh bg-[#0B0D12] border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-50">
      <div className="p-7 flex items-center justify-between">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <img src="/logo-mark-512.png" alt="" width="40" height="40" className="size-10 rounded-xl" />
          <span className="text-2xl font-black tracking-tight text-white">lenk.tr</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="lg:hidden p-2 text-zinc-400"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <nav
        aria-label="Hesap menüsü"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
      >
        {links.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 border border-transparent hover:bg-white/5 hover:text-white"}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-5 border-t border-white/5 space-y-4">
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language.startsWith("en") ? "tr" : "en")
          }
          className="w-full text-sm text-zinc-400 hover:text-white flex items-center gap-3 px-3 py-2"
        >
          <Languages size={18} />
          {i18n.language.startsWith("en") ? "Türkçe" : "English"}
        </button>
        <Link
          to="/settings"
          onClick={onClose}
          className="flex gap-3 items-center px-3"
        >
          <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 grid place-items-center text-blue-400 font-bold overflow-hidden">
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
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.user_metadata?.full_name || "Hesabım"}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </Link>
        <button
          onClick={logout}
          className="w-full flex gap-3 items-center px-3 py-2 text-sm text-zinc-400 hover:text-red-400"
        >
          <LogOut size={18} />
          {t("sidebar.userMenu.logout")}
        </button>
      </div>
    </aside>
  );
}
