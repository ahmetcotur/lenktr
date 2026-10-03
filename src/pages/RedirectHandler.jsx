import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { request } from "../utils/api/client";
import PublicBioPage from "../components/bio/PublicBioPage";
import { Loader2, Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
export default function RedirectHandler() {
  const { slug } = useParams(),
    { t } = useTranslation(),
    [state, setState] = useState({ slug: null, data: null, error: null }),
    [password, setPassword] = useState(""),
    [passwordRequired, setPasswordRequired] = useState(false),
    [submitting, setSubmitting] = useState(false);
  const resolveLink = useCallback((candidatePassword) => {
    setSubmitting(true);
    request(`/api/resolve/${encodeURIComponent(slug)}`, {
      referrer: document.referrer,
      ...(candidatePassword ? { password: candidatePassword } : {}),
    }).then(({ data, error, password_required: required }) => {
      if (data?.type === "link" && !error) {
        if (data.page.settings?.interstitial?.enabled) {
          setState({ slug, data, error: null });
          return;
        }
        if (Object.keys(data.page.settings?.pixels || {}).length) {
          firePixels(data.page.settings.pixels);
          window.setTimeout(() => window.location.replace(data.redirect_url || data.page.original_url), 700);
        } else window.location.replace(data.redirect_url || data.page.original_url);
        return;
      }
      if (data?.type === "bio" && !error) {
        setState({ slug, data, error: null });
        return;
      }
      setPasswordRequired(Boolean(required));
      setState({ slug, data: null, error });
    }).finally(() => setSubmitting(false));
  }, [slug]);
  useEffect(() => {
    const timer = window.setTimeout(resolveLink, 0);
    return () => window.clearTimeout(timer);
  }, [resolveLink]);
  const continueRedirect = () => {
    const { page } = state.data;
    firePixels(page.settings?.pixels || {});
    window.setTimeout(() => window.location.replace(state.data.redirect_url || page.original_url), Object.keys(page.settings?.pixels || {}).length ? 700 : 0);
  };
  if (state.slug !== slug)
    return (
      <main
        role="status"
        className="min-h-screen bg-[#08090D] grid place-items-center text-zinc-400"
      >
        <span className="flex gap-3 items-center">
          <Loader2 className="animate-spin text-blue-500" size={22} />
          {t('redirect.loading')}
        </span>
      </main>
    );
  if (state.data?.type === "bio")
    return <PublicBioPage pageData={state.data.page} />;
  if (state.data?.type === "link") {
    const transit = state.data.page.settings?.interstitial || {};
    return <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6"><section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0D0F14] p-8 text-center space-y-5"><Link2 size={42} className="mx-auto text-blue-400" /><h1 className="text-2xl font-bold">{transit.title || state.data.page.title || t('redirect.title')}</h1>{transit.message && <p className="text-zinc-400">{transit.message}</p>}<button type="button" disabled={submitting} onClick={continueRedirect} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50">{transit.buttonText || t('redirect.continue')}</button></section></main>;
  }
  if (passwordRequired) return <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6"><form className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D0F14] p-8 space-y-5" onSubmit={(event) => { event.preventDefault(); resolveLink(password); }}><h1 className="text-2xl font-bold">{t('redirect.passwordTitle')}</h1><p className="text-sm text-zinc-400">{t('redirect.passwordDescription')}</p><input autoFocus type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" required /><button disabled={submitting} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold disabled:opacity-50">{submitting ? t('redirect.checking') : t('redirect.openLink')}</button>{state.error && <p role="alert" className="text-sm text-red-300">{state.error.message}</p>}</form></main>;
  return (
    <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6">
      <section className="max-w-md text-center space-y-5">
        <Link2 size={42} className="mx-auto text-zinc-500" />
        <h1 className="text-2xl font-bold">{t('redirect.failed')}</h1>
        <p className="text-zinc-400 leading-relaxed">
          {state.error?.message ||
            t('redirect.unavailable')}
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-500 rounded-xl px-5 py-3 text-sm font-semibold"
        >
          {t('redirect.home')}
        </Link>
      </section>
    </main>
  );
}

function firePixels(pixels = {}) {
  if (pixels.meta && !window.fbq) {
    const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
    fbq.queue = []; fbq.loaded = true; fbq.version = "2.0"; window.fbq = fbq; window._fbq = fbq;
    const script = document.createElement("script"); script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script);
  }
  if (pixels.meta) { window.fbq("init", pixels.meta); window.fbq("track", "PageView"); }
  if (pixels.google) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", pixels.google);
    if (![...document.querySelectorAll('script[data-lenk-google]')].some((script) => script.dataset.lenkGoogle === pixels.google)) {
      const script = document.createElement("script"); script.async = true; script.dataset.lenkGoogle = pixels.google;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(pixels.google)}`; document.head.appendChild(script);
    }
  }
  if (pixels.tiktok && !window.ttq) {
    const ttq = window.ttq = []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
    ttq.setAndDefer = (target, method) => { target[method] = (...args) => { target.push([method, ...args]); }; };
    ttq.methods.forEach((method) => ttq.setAndDefer(ttq, method)); ttq.load = (id) => { const script = document.createElement("script"); script.async = true; script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(id)}&lib=ttq`; document.head.appendChild(script); };
    ttq.load(pixels.tiktok);
  }
  if (pixels.tiktok) window.ttq?.page();
}
