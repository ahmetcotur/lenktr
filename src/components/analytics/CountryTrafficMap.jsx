import React, { useMemo, useState } from 'react';
// Country shapes derived from @svg-maps/world (CC BY 4.0); attribution is shown on the map.
import world from '../../assets/world-map.json';

export default function CountryTrafficMap({ countries, locale, t }) {
    const [hovered, setHovered] = useState(null);
    const countryNames = useMemo(() => new Intl.DisplayNames([locale], { type: 'region' }), [locale]);
    const counts = useMemo(() => new Map(countries.map((country) => [country.code.toLowerCase(), country.count])), [countries]);
    const max = Math.max(...countries.map((country) => country.count), 0);
    const label = (code) => countryNames.of(code.toUpperCase()) || code.toUpperCase();
    const colorFor = (count) => {
        if (!count || !max) return '#171b24';
        const intensity = count / max;
        if (intensity > 0.65) return '#2563eb';
        if (intensity > 0.3) return '#1d4ed8';
        if (intensity > 0.1) return '#1e40af';
        return '#1e3a8a';
    };
    return (
        <div className="space-y-4">
            <div className="relative rounded-2xl border border-white/5 bg-[#08090D] p-3 md:p-5">
                <svg viewBox={world.viewBox} role="group" aria-label={t('analytics.countryMapLabel')} className="w-full h-auto max-h-[390px]">
                    {world.locations.map((location) => {
                        const count = counts.get(location.id) || 0;
                        const active = hovered?.code === location.id;
                        return <path key={location.id} d={location.path} fill={colorFor(count)} fillOpacity={count ? 0.95 : 1} stroke={active ? '#e2e8f0' : '#343b49'} strokeWidth={active ? 1.4 : 0.55} vectorEffect="non-scaling-stroke" tabIndex={count ? 0 : -1} role="button" aria-label={`${label(location.id)}: ${count.toLocaleString(locale)}`} onMouseEnter={() => setHovered({ code: location.id, count })} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered({ code: location.id, count })} onBlur={() => setHovered(null)}><title>{label(location.id)}: {count.toLocaleString(locale)}</title></path>;
                    })}
                </svg>
                {hovered && <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none rounded-lg border border-white/10 bg-[#10141d]/95 px-3 py-2 text-xs text-white shadow-xl"><strong>{label(hovered.code)}</strong><span className="ml-2 text-blue-300">{hovered.count.toLocaleString(locale)} {t('analytics.visits')}</span></div>}
                <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noreferrer" className="absolute bottom-2 right-3 text-[10px] text-zinc-600 hover:text-zinc-400">{t('analytics.mapAttribution')}</a>
            </div>
            <div className="flex items-center justify-end gap-2 text-[10px] text-zinc-500"><span>{t('analytics.fewerVisits')}</span>{['#171b24', '#1e3a8a', '#1e40af', '#1d4ed8', '#2563eb'].map((color) => <span key={color} className="h-2.5 w-4 rounded-sm" style={{ backgroundColor: color }} />)}<span>{t('analytics.moreVisits')}</span></div>
            <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
                {countries.length ? countries.map((country) => <div key={country.code} className="flex items-center justify-between py-3 text-sm"><span className="text-zinc-300">{label(country.code)} <span className="ml-1 font-mono text-[10px] text-zinc-600">{country.code}</span></span><span className="font-semibold text-white">{country.count.toLocaleString(locale)} <span className="ml-1 text-xs font-normal text-zinc-500">({country.percent}%)</span></span></div>) : <p className="py-6 text-center text-sm text-zinc-500">{t('analytics.countryDataUnavailable')}</p>}
            </div>
        </div>
    );
}
