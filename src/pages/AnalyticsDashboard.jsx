import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Calendar, Globe, Loader2, Monitor, MousePointer2, Smartphone, Tablet, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { request } from '../utils/api/client';
import { useTranslation } from 'react-i18next';

const ranges = ['12h', '24h', '7d', '30d'];
const deviceIcons = { mobile: Smartphone, desktop: Monitor, tablet: Tablet, other: Globe };
const deviceColors = { mobile: 'blue', desktop: 'purple', tablet: 'orange', other: 'gray' };
const rangeLabelKeys = { '12h': 'last12Hours', '24h': 'last24Hours', '7d': 'last7Days', '30d': 'last30Days' };

function makeBuckets(range, now = new Date()) {
    const hourly = range === '12h' || range === '24h';
    const count = hourly ? Number.parseInt(range, 10) : Number.parseInt(range, 10);
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
    const [stats, setStats] = useState({ totals: { events: 0, clicks: 0, views: 0 }, series: [], sources: [], devices: [], top_items: [] });

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
    const coordinates = chartData.map((value, index) => ({
        x: index * stepX,
        y: height - (value / maxVal * height * 0.8),
    }));
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
                    <div className="relative flex-1 min-h-0 group px-4 pt-6 pb-12">
                        <div className="absolute inset-6 bottom-14 flex flex-col justify-between opacity-10 pointer-events-none">{[0, 1, 2, 3, 4].map((line) => <div key={line} className="w-full border-t border-dashed border-white" />)}</div>
                        {stats.totals.events === 0 ? <div className="absolute inset-0 flex items-center justify-center text-zinc-500">{t('analytics.noData')}</div> : <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs><path d={pathD} fill="url(#chartGradient)" /><path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3" />{coordinates.map(({ x, y }, index) => <g key={buckets[index]} className="group/point"><circle cx={x} cy={y} r="5" fill="#0D0F14" stroke="#3b82f6" strokeWidth="2" /><title>{chartLabels[index]}: {chartData[index]}</title></g>)}</svg>}
                        <div className="absolute bottom-3 left-6 right-6 flex justify-between text-[10px] text-zinc-500"><span>{chartLabels[0]}</span><span>{chartLabels[Math.floor(chartLabels.length / 2)]}</span><span>{chartLabels.at(-1)}</span></div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <Card className="xl:col-span-2 p-8 min-h-[300px] flex flex-col bg-[#0D0F14]"><h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6"><Globe size={20} className="text-blue-500" />{t('analytics.countryData')}</h3><div className="flex-1 rounded-2xl border border-white/5 bg-[#08090D] flex items-center justify-center text-center p-8 text-zinc-500">{t('analytics.countryDataUnavailable')}</div></Card>
                    <Card className="p-0 overflow-hidden flex flex-col bg-[#0D0F14]"><div className="p-8 border-b border-white/5"><h3 className="text-xl font-bold text-white flex items-center gap-3"><Activity size={20} className="text-lime-500" />{t('analytics.topPerforming.title')}</h3></div><div className="flex-1">{stats.top_items.length === 0 ? <div className="p-10 text-center text-zinc-500 text-sm">{t('analytics.noData')}</div> : stats.top_items.map((item, index) => <div key={`${item.type}-${item.slug}-${index}`} className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-3"><div className="min-w-0"><div className="text-sm font-bold text-white truncate">{item.name}</div><div className="text-[10px] font-mono text-zinc-500">lenk.tr/{item.slug}</div><Badge variant={item.type === 'link' ? 'primary' : 'success'} className="scale-75 origin-left">{t(`analytics.topPerforming.${item.type}`)}</Badge></div><div className="text-right"><div className="text-sm font-black text-white">{item.val.toLocaleString(locale)}</div><div className="text-[10px] text-zinc-500">{item.type === 'link' ? t('analytics.topPerforming.clicks') : t('analytics.topPerforming.views')}</div></div></div>)}</div></Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{devices.map((device) => <Card key={device.key} className="p-6 flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-2xl bg-${device.color}-500/10 flex items-center justify-center text-${device.color}-500`}><device.icon size={24} /></div><div><h4 className="text-sm font-bold text-zinc-400">{device.title}</h4><div className="text-2xl font-black text-white">{device.percent}%</div></div></div></Card>)}</div>

                <Card className="p-0 overflow-hidden bg-[#0D0F14]"><div className="p-8 border-b border-white/5"><h3 className="text-xl font-bold text-white flex items-center gap-3"><Activity size={20} className="text-blue-500" />{t('analytics.trafficSources')}</h3></div>{stats.sources.length === 0 ? <div className="p-8 text-zinc-500">{t('analytics.noData')}</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/5">{stats.sources.map((source) => <div key={source.name} className="p-6"><div className="text-xs font-bold text-zinc-400 uppercase tracking-wide truncate" title={source.name}>{source.name === 'direct' ? t('analytics.directTraffic') : source.name}</div><div className="text-3xl font-black text-white my-3">{source.traffic.toLocaleString(locale)}</div><div className="flex items-center gap-3"><div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${source.percent}%` }} /></div><span className="text-xs text-zinc-400">{source.percent}%</span></div></div>)}</div>}</Card>
            </>}
        </div>
    );
};

export default AnalyticsDashboard;
