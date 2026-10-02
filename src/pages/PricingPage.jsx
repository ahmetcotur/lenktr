import { ArrowRight, BarChart3, Link2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Button from "../components/ui/Button";
import { PublicFooter, PublicNav } from "../components/layout/PublicSite";

const features = [
  { icon: Link2, title: "Kısa bağlantılar", description: "Kendi kısa adreslerini oluştur, hedeflerini düzenle ve tıklamaları gör." },
  { icon: UserRound, title: "Bio sayfası", description: "Profilini ve bağlantılarını tek bir paylaşılabilir sayfada bir araya getir." },
  { icon: BarChart3, title: "Temel istatistikler", description: "Bağlantı tıklamalarını ve bio sayfası görüntülenmelerini takip et." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#08090D] text-white">
      <SEO title="LENK.TR fiyatlandırma" description="Kısa bağlantılarını yönet, bio sayfanı oluştur ve temel istatistikleri ücretsiz kullan." url="/pricing" />
      <PublicNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">ÜCRETSİZ KULLANIM</span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">Başla ve bağlantılarını tek yerden yönet.</h1>
          <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">LENK.TR hesabı açmak ücretsizdir. Şu anda kullanılabilir temel özellikler için ödeme veya kart bilgisi gerekmez.</p>
        </header>
        <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-[#101319] p-6 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-semibold text-blue-300">LENK.TR hesabı</p><p className="mt-2 text-4xl font-bold text-white">Ücretsiz</p><p className="mt-2 text-sm text-zinc-400">Hesap oluştur, temel araçları kullanmaya başla.</p></div>
            <Link to="/register"><Button variant="primary" size="md">Ücretsiz hesap oluştur <ArrowRight size={16} className="ml-2" /></Button></Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-2xl border border-white/5 bg-black/20 p-4"><Icon size={19} className="text-blue-300" /><h2 className="mt-3 text-sm font-semibold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-zinc-400">{description}</p></article>)}
          </div>
          <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-zinc-500">İleride ücretli planlar sunulursa kapsam ve ücretler burada açıkça belirtilecektir. Şu anda bu sayfada listelenen özellikler ücretsizdir.</p>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
