import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

const sections = [
  ["features", "nav.features"],
  ["how-it-works", "nav.howItWorks"],
  ["ecosystem", "nav.themes"],
];

export function PublicNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const scrollToSection = (id) => (event) => {
    setOpen(false);
    if (pathname !== "/") return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    history.replaceState(null, "", `/#${id}`);
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - 88,
      behavior: "instant",
    });
  };
  const navLinks = sections.map(([id, label]) => (
    <Link key={id} to={`/#${id}`} onClick={scrollToSection(id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:text-white">
      {t(label)}
    </Link>
  ));
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08090D]/90 backdrop-blur-xl">
      <nav aria-label="Ana menü" className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link to="/" aria-label="LENK.TR ana sayfa" className="flex shrink-0 items-center gap-3 text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20"><Zap size={22} className="fill-current" /></span>
          <span className="text-xl font-black tracking-tight sm:text-2xl">lenk.tr</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">{navLinks}</div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link to="/login" className="px-3 py-2 text-sm font-semibold text-zinc-400 transition hover:text-white">{t("nav.signIn")}</Link>
          <Link to="/register"><Button variant="primary" size="md">{t("nav.getStarted")}</Button></Link>
        </div>
        <button type="button" aria-label={open ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={open} aria-controls="public-mobile-menu" onClick={() => setOpen((value) => !value)} className="grid size-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && <div id="public-mobile-menu" className="absolute inset-x-0 top-full border-b border-white/10 bg-[#0B0D12] px-4 pb-5 pt-3 shadow-2xl lg:hidden"><div className="flex flex-col">{navLinks}<Link to="/login" className="rounded-lg px-3 py-3 text-sm font-semibold text-zinc-300">{t("nav.signIn")}</Link><Link to="/register" className="mt-2"><Button variant="primary" size="md" className="w-full">{t("nav.getStarted")}</Button></Link></div></div>}
    </header>
  );
}

export function PublicFooter() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const tr = i18n.language.startsWith("tr");
  const columns = tr ? [
    { title: "Platform", links: [["Özellikler", "/#features"], ["Nasıl çalışır", "/#how-it-works"], ["Temalar", "/#ecosystem"], ["Fiyatlandırma", "/pricing"]] },
    { title: "Kurumsal", links: [["Hakkımızda", "/about"], ["İletişim", "/contact"], ["Güvenlik", "/security"]] },
    { title: "Yasal", links: [["Kullanım şartları", "/terms"], ["Gizlilik", "/privacy"]] },
  ] : [
    { title: "Platform", links: [["Features", "/#features"], ["How it works", "/#how-it-works"], ["Themes", "/#ecosystem"], ["Pricing", "/pricing"]] },
    { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Security", "/security"]] },
    { title: "Legal", links: [["Terms", "/terms"], ["Privacy", "/privacy"]] },
  ];
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0B0D12]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 sm:gap-8">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-black text-white"><span className="grid size-9 place-items-center rounded-xl bg-blue-600"><Zap size={19} className="fill-current" /></span>lenk.tr</Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-400">{tr ? "Bağlantılarını tek bir yerde düzenle, paylaş ve takip et." : "Manage, share, and track all your links in one place."}</p>
          </div>
          {columns.map((column) => <div key={column.title}><h2 className="text-xs font-bold uppercase tracking-widest text-white">{column.title}</h2><ul className="mt-3 space-y-2.5">{column.links.map(([label, to]) => <li key={to}><Link to={to} onClick={to.startsWith("/#") && pathname === "/" ? (event) => { const target = document.getElementById(to.slice(2)); if (target) { event.preventDefault(); history.replaceState(null, "", to); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: "instant" }); } } : undefined} className="text-sm text-zinc-400 transition hover:text-white">{label}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-9 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} LENK.TR</span><a href="/api/health" className="w-fit transition hover:text-white">{tr ? "Sistem durumu" : "System status"}</a></div>
      </div>
    </footer>
  );
}
