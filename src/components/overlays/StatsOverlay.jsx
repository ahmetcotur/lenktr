import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { request } from '../../utils/api/client';
import { countryName } from '../../utils/countryName';

const ranges = ['12h', '24h', '7d', '30d'];
const StatsOverlay = ({ link, onClose }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('tr') ? 'tr-TR' : 'en-US';
  const [range, setRange] = useState('7d');
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    request(`/api/analytics?range=${range}`, undefined, 'GET').then(({ data, error: resultError }) => {
      if (!active) return;
      if (resultError) { setResult({ range, error: resultError.message, stats: null }); return; }
      setResult({ range, error: '', stats: data.items.find((item) => item.type === 'link' && item.id === link.id) || null });
    });
    return () => { active = false; };
  }, [link.id, range]);
  const stats = result?.range === range ? result.stats : null;
  const error = result?.range === range ? result.error : '';
  const loading = result?.range !== range;
  const chart = useMemo(() => stats?.series || [], [stats]);
  const max = Math.max(1, ...chart.map((item) => item.events));
  const regionNames = useMemo(() => new Intl.DisplayNames([locale], { type: 'region' }), [locale]);
  const period = t(`analytics.${({ '12h': 'last12Hours', '24h': 'last24Hours', '7d': 'last7Days', '30d': 'last30Days' })[range]}`);

  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#08090D]/95 backdrop-blur-sm"><div className="mx-auto max-w-6xl p-5 md:p-8">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><button onClick={onClose} className="mb-3 flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ChevronRight size={18} className="rotate-180" />{t('statsOverlay.backToLinks')}</button><h1 className="text-3xl font-black text-white">{link.title || link.short_slug}</h1><p className="mt-1 font-mono text-sm text-blue-300">lenk.tr/{link.short_slug}</p></div><div className="flex gap-2">{ranges.map((item) => <button type="button" key={item} onClick={() => setRange(item)} aria-pressed={range === item} className={`rounded-lg border px-3 py-2 text-xs font-bold ${range === item ? 'border-blue-500 bg-blue-600 text-white' : 'border-white/10 bg-white/5 text-zinc-400'}`}>{item.toUpperCase()}</button>)}</div></div>
    {error ? <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">{error}</div> : loading ? <div className="grid min-h-64 place-items-center"><Loader2 className="animate-spin text-blue-400" /></div> : <>
      <div className="mb-6 grid gap-4 md:grid-cols-3"><Metric label={t('statsOverlay.totalClicks')} value={link.clicks || 0} /><Metric label={t('statsOverlay.periodClicks', { period })} value={stats?.val || 0} /><Metric label={t('statsOverlay.destination')} value={stats?.destination || link.original_url} /></div>
      <section className="mb-6 rounded-2xl border border-white/5 bg-[#0D0F14] p-6"><h2 className="mb-5 text-lg font-bold text-white">{t('statsOverlay.trafficOverview')} · {period}</h2>{chart.length ? <div className="flex h-56 items-end gap-1 border-b border-white/10">{chart.map((point) => <div key={point.bucket} title={`${point.bucket}: ${point.events}`} className="group relative flex h-full flex-1 items-end"><div className="w-full rounded-t bg-blue-500/80 transition-colors group-hover:bg-blue-300" style={{ height: `${Math.max(point.events ? 4 : 0, point.events / max * 100)}%` }} /><span className="pointer-events-none absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white group-hover:block">{point.events} · {new Date(`${point.bucket.replace(' ', 'T')}Z`).toLocaleString(locale)}</span></div>)}</div> : <p className="py-10 text-center text-sm text-zinc-500">{t('analytics.noData')}</p>}</section>
      <div className="grid gap-6 md:grid-cols-2"><Breakdown title={t('analytics.itemSources')} entries={stats?.sources || []} label={(item) => item.name === 'Direct' ? t('analytics.directTraffic') : item.name} valueKey="traffic" locale={locale} empty={t('analytics.noData')} /><Breakdown title={t('analytics.itemCountries')} entries={stats?.countries || []} label={(item) => countryName(item.code, regionNames, t('analytics.unknownCountry'))} valueKey="count" locale={locale} empty={t('analytics.countryDataUnavailable')} /></div>
    </>}
  </div></div>;
};
function Metric({ label, value }) { return <div className="min-w-0 rounded-2xl border border-white/5 bg-[#0D0F14] p-5"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</div><div className="truncate text-2xl font-black text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div></div>; }
function Breakdown({ title, entries, label, valueKey, locale, empty }) { return <section className="rounded-2xl border border-white/5 bg-[#0D0F14] p-6"><h2 className="mb-4 text-lg font-bold text-white">{title}</h2>{entries.length ? entries.map((item) => <div key={item.code || `${item.type}:${item.name}`} className="flex justify-between gap-4 border-b border-white/5 py-3 text-sm"><span className="truncate text-zinc-300">{label(item)}</span><span className="shrink-0 font-semibold text-white">{item[valueKey].toLocaleString(locale)} <span className="text-xs text-zinc-500">({item.percent}%)</span></span></div>) : <p className="text-sm text-zinc-500">{empty}</p>}</section>; }
export default StatsOverlay;
