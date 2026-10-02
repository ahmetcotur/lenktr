import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
export default function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false),
    drawer = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement,
      overflow = document.body.style.overflow;
    const media = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", resize);
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector("a,button")?.focus();
    const key = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab") {
        const controls = drawer.current?.querySelectorAll("a,button,input");
        if (!controls?.length) return;
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      media.removeEventListener("change", resize);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [menuOpen]);
  return (
    <div className="flex min-h-screen bg-[#08090D] text-white font-sans selection:bg-blue-500/30">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-blue-600 focus:px-4 focus:py-2 focus:rounded-lg"
      >
        İçeriğe geç
      </a>
      <div className="hidden lg:block w-[280px] shrink-0">
        <Sidebar />
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Hesap menüsü"
          >
            <Sidebar onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main
          id="main-content"
          className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-9 w-full max-w-[1400px] mx-auto"
        >
          {children}
        </main>
        <footer className="px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} LENK.TR</span>
          <span>Bağlantılarınız, tek bir yerde.</span>
        </footer>
      </div>
    </div>
  );
}
