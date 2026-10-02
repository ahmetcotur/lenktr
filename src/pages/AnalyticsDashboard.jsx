import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Calendar, ChevronDown, Globe, Loader2, MapPinned, Monitor, MousePointer2, Smartphone, Tablet, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CountryTrafficMap from '../components/analytics/CountryTrafficMap';
import { request } from '../utils/api/client';
import { countryName } from '../utils/countryName';
import { useTranslation } from 'react-i18next';

const ranges = ['12h', '24h', '7d', '30d'];
const deviceIcons = { mobile: Smartphone, desktop: Monitor, tablet: Tablet, other: Globe };
const deviceColors = { mobile: 'blue', desktop: 'purple', tablet: 'orange', other: 'gray' };
const rangeLabelKeys = { '12h': 'last12Hours', '24h': 'last24Hours', '7d': 'last7Days', '30d': 'last30Days' };

function makeBuckets(range, now = new Date()) {
    const hourly = range === '12h' || range === '24h';
    const count = Number.parseInt(range, 10);
    const end = new Date(now);
    if (hourly) end.setUTCMinutes(0, 0, 0);
    else end.setUTCHours(0, 0, 0, 0);
    return Array.from({ length: count + 1 }, (_, index) => {
        const date = new Date(end);
        if (hourly) date.setUTCHours(date.getUTCHours() - count + index);
        else date.setUTCDate(date.getUTCDate() - count + index);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    });
}

const AnalyticsDashboard = () => {
    const { t, i18n } = useTranslation();
    const [range, setRange] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);
    const [stats, setStats] = useState({ totals: { events: 0, clicks: 0, views: 0 }, series: [], sources: [], countries: [], devices: [], items: [] });

    useEffect(() => {
        let active = true;
        request(`/api/analytics?range=${range}`, undefined, 'GET').then((result) => {
            if (!active) return;
            if (result.error) {
                setError(result.error.message || t('analytics.loadError'));
                return;
            }
            setError('');
            setStats(result.data);
        }).catch(() => {
            if (active) setError(t('analytics.loadError'));
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [range, t]);

    const buckets = useMemo(() => makeBuckets(range), [range]);
    const chartData = useMemo(() => {
        const byBucket = new Map(stats.series.map((row) => [row.bucket, Number(row.events)]));
        return buckets.map((bucket) => byBucket.get(bucket) || 0);
    }, [buckets, stats.series]);
    const maxVal = Math.max(...chartData, 1);
    const width = 1000;
    const height = 300;
    const stepX = chartData.length > 1 ? width / (chartData.length - 1) : 0;
    const coordinates = chartData.map((value, index) => ({ x: index * stepX, y: height - (value / maxVal * height * 0.8) }));
    const linePath = coordinates.map(({ x, y }, index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ');
    const pathD = chartData.length ? `M0,${height} ${coordinates.map(({ x, y }) => `L${x},${y}`).join(' ')} L${width},${height} Z` : '';
    const locale = i18n.language?.startsWith('tr') ? 'tr-TR' : 'en-US';
    const chartLabels = buckets.map((bucket) => {
        const date = new Date(`${bucket.replace(' ', 'T')}Z`);
        return new Intl.DateTimeFormat(locale, range === '12h' || range === '24h'
            ? { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }
            : { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(date);
    });
    const devices = ['mobile', 'desktop', 'tablet', 'other'].map((key) => {
        const count = stats.devices.filter((item) => String(item.device).toLowerCase() === key).reduce((sum, item) => sum + item.count, 0);
        const percent = stats.totals.events ? Math.round(count / stats.totals.events * 100) : 0;
        return { key, title: t(`analytics.devices.${key}`), icon: deviceIcons[key], color: deviceColors[key], percent };
    });
    const regionNames = useMemo(() => new Intl.DisplayNames([locale], { type: 'region' }), [locale]);
    const getCountryName = (code) => countryName(code, regionNames, t('analytics.unknownCountry'));

    if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4"><Loader2 className="animate-spin text-blue-500" size={40} /><p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('analytics.loading')}</p></div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-20 font-sans">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2"><Badge variant="primary">{t('analytics.badge')}</Badge><span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('analytics.trackedData')}</span></div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-white font-heading">{t('analytics.title')}</h1>
                    <p className="text-zinc-500 mt-2 font-medium max-w-2xl text-lg">{t('analytics.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0D0F14] px-4 py-3 text-zinc-300"><Calendar size={18} className="text-zinc-400" />{t(`analytics.${rangeLabelKeys[range]}`)}</div>
            </div>

            {error ? <Card className="p-6 border-red-500/20 text-red-300">{error}</Card> : <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: t('analytics.kpis.totalViews'), value: stats.totals.views, icon: Users, color: 'blue' },
                        { label: t('analytics.kpis.totalClicks'), value: stats.totals.clicks, icon: MousePointer2, color: 'purple' },
                        { label: t('analytics.kpis.totalEvents'), value: stats.totals.events, icon: Activity, color: 'lime' },
                    ].map((stat) => <Card key={stat.label} className="p-6 relative overflow-hidden group"><div className={`absolute top-0 right-0 p-3 opacity-10 text-${stat.color}-500`}><stat.icon size={76} /></div><div className="relative"><div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 mb-4`}><stat.icon size={20} /></div><h3 className="text-4xl font-black text-white mb-1">{stat.value.toLocaleString(locale)}</h3><span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{stat.label}</span></div></Card>)}
                </div>

                <Card className="p-0 overflow-hidden border-white/5 bg-[#0D0F14] relative h-[500px] flex flex-col">
                    <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 bg-[#0D0F14]/90">
                        <div><h3 className="text-2xl font-bold text-white">{t('analytics.trafficVolume')}</h3><p className="text-sm text-zinc-500 mt-1">{t('analytics.chartDescription', { range: t(`analytics.${rangeLabelKeys[range]}`) })}</p></div>
                        <div className="flex gap-2">{ranges.map((item) => <button key={item} type="button" aria-pressed={range === item} onClick={() => setRange(item)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${range === item ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 text-zinc-400 border-transparent hover:text-white hover:bg-white/10'}`}>{item.toUpperCase()}</button>)}</div>
                    </div>
                    <div className="relative flex-1 min-h-0 group px-4 pt-6 pb-12" onMouseLeave={() => setHoveredPoint(null)}>
                        <div className="absolute inset-6 bottom-14 flex flex-col justify-between opacity-10 pointer-events-none">{[0, 1, 2, 3, 4].map((line) => <div key={line} className="w-full border-t border-dashed border-white" />)}</div>
                        {stats.totals.events === 0 ? <div className="absolute inset-0 flex items-center justify-center text-zinc-500">{t('analytics.noData')}</div> : <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs><path d={pathD} fill="url(#chartGradient)" /><path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3" />{coordinates.map(({ x, y }, index) => <g key={buckets[index]}><circle cx={x} cy={y} r="13" fill="transparent" tabIndex={0} role="img" aria-label={`${chartLabels[index]}: ${chartData[index]} ${t('analytics.visits')}`} onMouseEnter={() => setHoveredPoint(index)} onFocus={() => setHoveredPoint(index)} onBlur={() => setHoveredPoint(null)} /><circle cx={x} cy={y} r={hoveredPoint === index ? 7 : 4} fill="#0D0F14" stroke="#60a5fa" strokeWidth="2" pointerEvents="none" /></g>)}</svg>}
                        {hoveredPoint !== null && stats.totals.events > 0 && <div className="absolute z-20 -translate-x-1/2 -translate-y-full pointer-events-none rounded-lg border border-blue-400/30 bg-[#10141d]/95 px-3 py-2 text-xs text-white shadow-xl" style={{ left: `${coordinates[hoveredPoint].x / width * 100}%`, top: `calc(${coordinates[hoveredPoint].y / height * 100}% + 1.25rem)` }}><strong>{chartData[hoveredPoint].toLocaleString(locale)} {t('analytics.visits')}</strong><div className="text-[10px] text-zinc-400">{chartLabels[hoveredPoint]}</div></div>}
                        <div className="absolute bottom-3 left-6 right-6 flex justify-between text-[10px] text-zinc-500"><span>{chartLabels[0]}</span><span>{chartLabels[Math.floor(chartLabels.length / 2)]}</span><span>{chartLabels.at(-1)}</span></div>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 bg-[#0D0F14]"><div className="flex items-center gap-3 mb-6"><MapPinned size={22} className="text-blue-400" /><div><h3 className="text-xl font-bold text-white">{t('analytics.countryData')}</h3><p className="text-xs text-zinc-500">{t('analytics.countryMapDescription')}</p></div></div><CountryTrafficMap countries={stats.countries} locale={locale} t={t} /></Card>

                <Card className="p-0 overflow-hidden bg-[#0D0F14]"><div className="p-6 md:p-8 border-b border-white/5"><div className="flex items-center gap-3"><Activity size={21} className="text-lime-500" /><div><h3 className="text-xl font-bold text-white">{t('analytics.assetPerformance')}</h3><p className="mt-1 text-xs text-zinc-500">{t('analytics.assetPerformanceHint')}</p></div></div></div>
                    {!stats.items.length ? <div className="p-10 text-center text-zinc-500">{t('analytics.noData')}</div> : <div className="divide-y divide-white/5">{stats.items.map((item) => {
                        const open = expandedItem === `${item.type}:${item.id}`;
                        return <div key={`${item.type}:${item.id}`}>
                            <button type="button" aria-expanded={open} onClick={() => setExpandedItem(open ? null : `${item.type}:${item.id}`)} className="w-full px-5 py-5 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left hover:bg-white/[0.025]">
                                <div className="min-w-0 flex items-start gap-3"><Badge variant={item.type === 'link' ? 'primary' : 'success'}>{item.type === 'link' ? t('analytics.topPerforming.link') : t('analytics.topPerforming.bio')}</Badge><div className="min-w-0"><div className="font-bold text-white truncate">{item.name}</div><div className="text-xs font-mono text-blue-300">lenk.tr/{item.slug}</div>{item.destination && <div className="mt-1 max-w-2xl truncate text-xs text-zinc-500" title={item.destination}>{t('analytics.destination')}: {item.destination}</div>}</div></div>
                                <div className="flex items-center gap-5 md:gap-8 md:pl-4"><span className="text-[10px] uppercase tracking-widest text-zinc-500">{t(`analytics.itemStatus.${item.status}`)}</span><span className="min-w-24 text-right"><strong className="block text-lg text-white">{item.val.toLocaleString(locale)}</strong><span className="text-[10px] text-zinc-500">{item.type === 'link' ? t('analytics.topPerforming.clicks') : t('analytics.topPerforming.views')}</span></span><ChevronDown size={18} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} /></div>
                            </button>
                            {open && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#090b10] px-6 py-6 md:px-10"><div><h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">{t('analytics.itemSources')}</h4>{item.sources.length ? item.sources.map((source) => <div key={`${source.type}:${source.name}`} className="flex items-center justify-between gap-4 border-b border-white/5 py-2 text-sm"><span className="flex min-w-0 items-center gap-2 truncate text-zinc-300"><Badge variant="primary" className="shrink-0">{t(`analytics.sourceTypes.${source.type}`)}</Badge><span className="truncate">{source.name === 'Direct' ? t('analytics.directTraffic') : source.name}</span></span><span className="whitespace-nowrap text-white">{source.traffic.toLocaleString(locale)} <span className="text-zinc-500">({source.percent}%)</span></span></div>) : <p className="text-sm text-zinc-600">{t('analytics.noData')}</p>}</div><div><h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">{t('analytics.itemCountries')}</h4>{item.countries.length ? item.countries.map((country) => <div key={country.code} className="flex items-center justify-between border-b border-white/5 py-2 text-sm"><span className="text-zinc-300">{getCountryName(country.code)} <span className="text-[10px] text-zinc-600">{country.code}</span></span><span className="text-white">{country.count.toLocaleString(locale)} <span className="text-zinc-500">({country.percent}%)</span></span></div>) : <p className="text-sm text-zinc-600">{t('analytics.countryDataUnavailable')}</p>}</div></div>}
                        </div>;
                    })}</div>}
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{devices.map((device) => <Card key={device.key} className="p-6 flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-2xl bg-${device.color}-500/10 flex items-center justify-center text-${device.color}-500`}><device.icon size={24} /></div><div><h4 className="text-sm font-bold text-zinc-400">{device.title}</h4><div className="text-2xl font-black text-white">{device.percent}%</div></div></div></Card>)}</div>

                <Card className="p-0 overflow-hidden bg-[#0D0F14]"><div className="p-6 md:p-8 border-b border-white/5"><h3 className="text-xl font-bold text-white">{t('analytics.trafficSources')}</h3><p className="mt-1 text-xs text-zinc-500">{t('analytics.sourceBreakdownHint')}</p></div>{stats.sources.length === 0 ? <div className="p-8 text-zinc-500">{t('analytics.noData')}</div> : <div className="divide-y divide-white/5">{stats.sources.map((source) => <div key={`${source.type}:${source.name}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 md:px-8"><div className="flex min-w-0 items-center gap-3"><Badge variant={source.type === 'bot' ? 'warning' : source.type === 'ai' ? 'success' : 'primary'}>{t(`analytics.sourceTypes.${source.type}`)}</Badge><span className="truncate text-sm font-medium text-zinc-200" title={source.name}>{source.name === 'Direct' ? t('analytics.directTraffic') : source.name}</span></div><span className="text-sm font-bold text-white">{source.traffic.toLocaleString(locale)}</span><span className="w-12 text-right text-xs text-zinc-500">{source.percent}%</span></div>)}</div>}</Card>
            </>}
        </div>
    );
};

export default AnalyticsDashboard;
