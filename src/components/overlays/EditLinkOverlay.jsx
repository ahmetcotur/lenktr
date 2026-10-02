import { useState } from 'react';
import { X, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createClient } from '../../utils/api/client';
import { useAuth } from '../../context/AuthContext';

const api = createClient();
const channels = ['default', 'facebook', 'twitter', 'pinterest', 'linkedin', 'whatsapp', 'telegram', 'slack'];
const emptyRule = { country: '', os: '', browser: '', url: '' };
const localDate = (value) => value ? new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000 : null;

export default function EditLinkOverlay({ link, onClose }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const prior = link?.settings || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeChannel, setActiveChannel] = useState('default');
  const [form, setForm] = useState({
    destinationUrl: link?.original_url || '', title: link?.title || '',
    shortSlug: link?.short_slug || Math.random().toString(36).slice(2, 8),
    utm: { source: '', medium: '', campaign: '', term: '', content: '', ...prior.utm },
    pixels: { meta: '', google: '', tiktok: '', ...prior.pixels },
    routingRules: prior.routingRules || [], socialPreview: prior.socialPreview || {}, qr: prior.qr || null,
    schedule: { startsAt: '', expiresAt: '', ...prior.schedule },
    password: '', removePassword: false,
    interstitial: { enabled: false, title: '', message: '', buttonText: '', ...prior.interstitial },
  });
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setNested = (key, field, value) => setForm((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    let destination;
    try { destination = new URL(form.destinationUrl); } catch { setError(t('editLink.errorUrl')); return; }
    if (!['http:', 'https:'].includes(destination.protocol)) { setError(t('editLink.errorUrl')); return; }
    const schedule = {};
    for (const key of ['startsAt', 'expiresAt']) if (form.schedule[key]) schedule[key] = new Date(form.schedule[key]).toISOString();
    const socialPreview = Object.fromEntries(Object.entries(form.socialPreview).filter(([, value]) => value?.title || value?.description || value?.image));
    const values = {
      user_id: user.id, original_url: destination.toString(), title: form.title.trim(), short_slug: form.shortSlug.trim().toLowerCase(),
      settings: { utm: form.utm, pixels: form.pixels, routingRules: form.routingRules, socialPreview, schedule, interstitial: form.interstitial, ...(form.qr ? { qr: form.qr } : {}) },
      ...(form.password ? { password: form.password } : {}),
      ...(form.removePassword ? { remove_password: true } : {}),
    };
    setLoading(true);
    try {
      const { error: saveError } = link?.id
        ? await api.from('links').update(values).eq('id', link.id)
        : await api.from('links').insert([values]);
      if (saveError) throw new Error(saveError.message);
      onClose();
    } catch (saveError) {
      setError(`${t('editLink.errorSave')}${saveError.message}`);
    } finally { setLoading(false); }
  };

  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none';
  const labelClass = 'mb-2 block text-xs font-bold text-zinc-400';

  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <button aria-label={t('common.confirm.cancel')} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    <form onSubmit={handleSave} className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0F14] shadow-2xl">
      <header className="z-10 flex items-center justify-between border-b border-white/5 bg-[#0D0F14] px-6 py-4">
        <h2 className="text-lg font-black text-white">{link ? t('editLink.titleUpdate') : t('editLink.titleShort')}</h2>
        <div className="flex items-center gap-2"><button disabled={loading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{t('editLink.save')}</button><button type="button" onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"><X size={18} /></button></div>
      </header>
      <div className="space-y-8 overflow-y-auto p-6">
        {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        <section className="space-y-4">
          <div><label className={labelClass}>{t('editLink.destinationUrl')}</label><input required type="url" value={form.destinationUrl} onChange={(e) => set('destinationUrl', e.target.value)} placeholder="https://example.com/page" className={inputClass} /></div>
          <div className="grid gap-4 md:grid-cols-2"><div><label className={labelClass}>{t('editLink.title')}</label><input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder={t('editLink.campaignPlaceholder')} className={inputClass} /></div><div><label className={labelClass}>{t('editLink.customSlug')}</label><div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4"><span className="shrink-0 font-mono text-xs text-zinc-500">lenk.tr/</span><input required pattern="[a-z0-9][a-z0-9-]{0,99}" value={form.shortSlug} onChange={(e) => set('shortSlug', e.target.value)} className="min-w-0 bg-transparent py-3 pl-2 font-mono text-sm text-white outline-none" /></div></div></div>
        </section>

        <section className="space-y-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5"><div><h3 className="font-bold text-white">{t('editLink.utmParams')}</h3><p className="mt-1 text-xs text-zinc-500">{t('editLink.utmHelp')}</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{['source', 'medium', 'campaign', 'term', 'content'].map((field) => <div key={field}><label className={labelClass}>{`utm_${field}`}</label><input value={form.utm[field] || ''} onChange={(e) => setNested('utm', field, e.target.value)} className={inputClass} /></div>)}</div></section>

        <section className="space-y-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5"><div><h3 className="font-bold text-white">{t('editLink.attachPixels')}</h3><p className="mt-1 text-xs text-zinc-500">{t('editLink.pixelHelp')}</p></div><div className="grid gap-3 md:grid-cols-3">{[['meta', 'Meta Pixel ID'], ['google', 'Google tag (G-… / AW-…)'], ['tiktok', 'TikTok Pixel ID']].map(([key, label]) => <div key={key}><label className={labelClass}>{label}</label><input value={form.pixels[key] || ''} onChange={(e) => setNested('pixels', key, e.target.value.trim())} className={inputClass} /></div>)}</div></section>

        <section className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5"><div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-white">{t('editLink.customRedirections')}</h3><p className="mt-1 text-xs text-zinc-500">{t('editLink.routingHelp')}</p></div><button type="button" onClick={() => set('routingRules', [...form.routingRules, { ...emptyRule }])} className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-white/5"><Plus size={14} />{t('editLink.addRule')}</button></div>
          {form.routingRules.map((rule, index) => <div key={index} className="grid gap-3 rounded-xl border border-white/5 p-3 md:grid-cols-2"><div className="grid grid-cols-3 gap-2"><select aria-label={t('editLink.targetCountry')} value={rule.country} onChange={(e) => set('routingRules', form.routingRules.map((item, i) => i === index ? { ...item, country: e.target.value } : item))} className={inputClass}><option value="">{t('editLink.anyCountry')}</option>{[['TR','Türkiye'],['US','USA'],['DE','Deutschland'],['GB','UK'],['FR','France'],['NL','Netherlands'],['AZ','Azerbaijan']].map(([code,name])=><option key={code} value={code}>{name}</option>)}</select><select aria-label={t('editLink.targetOs')} value={rule.os} onChange={(e) => set('routingRules', form.routingRules.map((item, i) => i === index ? { ...item, os: e.target.value } : item))} className={inputClass}><option value="">{t('editLink.anyOs')}</option>{['ios','android','windows','macos'].map((os)=><option key={os} value={os}>{os}</option>)}</select><select aria-label={t('editLink.browser')} value={rule.browser} onChange={(e) => set('routingRules', form.routingRules.map((item, i) => i === index ? { ...item, browser: e.target.value } : item))} className={inputClass}><option value="">{t('editLink.anyBrowser')}</option>{['chrome','safari','firefox','edge'].map((browser)=><option key={browser} value={browser}>{browser}</option>)}</select></div><div className="flex gap-2"><input required type="url" placeholder={t('editLink.redirectionUrl')} value={rule.url} onChange={(e) => set('routingRules', form.routingRules.map((item, i) => i === index ? { ...item, url: e.target.value } : item))} className={inputClass} /><button type="button" aria-label={t('editLink.removeRule')} onClick={() => set('routingRules', form.routingRules.filter((_, i) => i !== index))} className="rounded-lg px-3 text-red-300 hover:bg-red-500/10"><Trash2 size={16} /></button></div></div>)}
        </section>

        <section className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5"><div><h3 className="font-bold text-white">{t('editLink.socialPreview')}</h3><p className="mt-1 text-xs text-zinc-500">{t('editLink.previewHelp')}</p></div><div className="flex flex-wrap gap-2">{channels.map((channel) => <button key={channel} type="button" onClick={() => setActiveChannel(channel)} className={`rounded-lg px-3 py-2 text-xs font-bold capitalize ${activeChannel === channel ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400'}`}>{channel}</button>)}</div><div className="grid gap-3"><input value={form.socialPreview[activeChannel]?.title || ''} onChange={(e) => set('socialPreview', { ...form.socialPreview, [activeChannel]: { ...form.socialPreview[activeChannel], title: e.target.value } })} placeholder={t('editLink.previewTitle')} className={inputClass} /><textarea value={form.socialPreview[activeChannel]?.description || ''} onChange={(e) => set('socialPreview', { ...form.socialPreview, [activeChannel]: { ...form.socialPreview[activeChannel], description: e.target.value } })} placeholder={t('editLink.previewDescription')} rows={2} className={inputClass} /><input type="url" value={form.socialPreview[activeChannel]?.image || ''} onChange={(e) => set('socialPreview', { ...form.socialPreview, [activeChannel]: { ...form.socialPreview[activeChannel], image: e.target.value } })} placeholder={t('editLink.previewImage')} className={inputClass} /></div></section>

        <section className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:grid-cols-2"><div><label className={labelClass}>{t('editLink.schedulingDate')}</label><input type="datetime-local" value={form.schedule.startsAt ? new Date(localDate(form.schedule.startsAt)).toISOString().slice(0,16) : ''} onChange={(e) => setNested('schedule', 'startsAt', e.target.value ? new Date(e.target.value).toISOString() : '')} className={inputClass} /></div><div><label className={labelClass}>{t('editLink.expirationDate')}</label><input type="datetime-local" value={form.schedule.expiresAt ? new Date(localDate(form.schedule.expiresAt)).toISOString().slice(0,16) : ''} onChange={(e) => setNested('schedule', 'expiresAt', e.target.value ? new Date(e.target.value).toISOString() : '')} className={inputClass} /></div></section>

        <section className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:grid-cols-2"><div><label className={labelClass}>{t('editLink.passwordProtection')}</label><input type="password" autoComplete="new-password" minLength={6} maxLength={200} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder={link?.has_password ? t('editLink.passwordSet') : t('editLink.passwordPlaceholder')} className={inputClass} />{link?.has_password && <label className="mt-2 flex items-center gap-2 text-xs text-zinc-400"><input type="checkbox" checked={form.removePassword} onChange={(e) => set('removePassword', e.target.checked)} />{t('editLink.removePassword')}</label>}</div><div className="flex items-start gap-3 pt-6"><input id="interstitial-enabled" type="checkbox" checked={form.interstitial.enabled} onChange={(e) => setNested('interstitial', 'enabled', e.target.checked)} className="mt-1 accent-blue-500" /><label htmlFor="interstitial-enabled" className="text-sm font-semibold text-zinc-300">{t('editLink.enableTransit')}</label></div>{form.interstitial.enabled && <div className="grid gap-3 md:col-span-2"><input value={form.interstitial.title} onChange={(e) => setNested('interstitial', 'title', e.target.value)} placeholder={t('editLink.transitTitle')} className={inputClass} /><textarea rows={2} value={form.interstitial.message} onChange={(e) => setNested('interstitial', 'message', e.target.value)} placeholder={t('editLink.transitMessage')} className={inputClass} /><input value={form.interstitial.buttonText} onChange={(e) => setNested('interstitial', 'buttonText', e.target.value)} placeholder={t('editLink.transitButton')} className={inputClass} /></div>}</section>
      </div>
    </form>
  </div>;
}
