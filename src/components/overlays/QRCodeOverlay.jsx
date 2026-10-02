import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Loader2, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createClient } from '../../utils/api/client';

const api = createClient();
const defaults = { size: 512, foreground: '#111827', background: '#ffffff', moduleStyle: 'square', eyeStyle: 'square' };
const luminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
const roundedRect = (ctx, x, y, width, height, radius) => {
  if (radius <= 0) return ctx.fillRect(x, y, width, height);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, width, height, radius);
  else {
    ctx.moveTo(x + radius, y); ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius); ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
  }
  ctx.fill();
};
const inFinder = (row, column, size) => (row < 7 && column < 7) || (row < 7 && column >= size - 7) || (row >= size - 7 && column < 7);
function drawQr(canvas, text, options) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'H' });
  const ctx = canvas.getContext('2d');
  const n = qr.modules.size;
  const cell = options.size / (n + 8);
  const offset = cell * 4;
  canvas.width = options.size; canvas.height = options.size;
  ctx.fillStyle = options.background; ctx.fillRect(0, 0, options.size, options.size);
  ctx.fillStyle = options.foreground;
  for (let row = 0; row < n; row++) for (let column = 0; column < n; column++) {
    if (!qr.modules.get(row, column) || inFinder(row, column, n)) continue;
    const x = offset + column * cell; const y = offset + row * cell;
    const radius = options.moduleStyle === 'square' ? 0 : cell * (options.moduleStyle === 'dots' ? 0.5 : 0.35);
    roundedRect(ctx, x + cell * 0.06, y + cell * 0.06, cell * 0.88, cell * 0.88, radius);
  }
  const eye = (row, column) => {
    const x = offset + column * cell; const y = offset + row * cell;
    const radius = options.eyeStyle === 'square' ? 0 : cell * (options.eyeStyle === 'circle' ? 3.5 : 1.15);
    roundedRect(ctx, x, y, cell * 7, cell * 7, radius);
    ctx.fillStyle = options.background;
    roundedRect(ctx, x + cell, y + cell, cell * 5, cell * 5, radius * 0.75);
    ctx.fillStyle = options.foreground;
    roundedRect(ctx, x + cell * 2, y + cell * 2, cell * 3, cell * 3, radius * 0.5);
  };
  eye(0, 0); eye(0, n - 7); eye(n - 7, 0);
}

export default function QRCodeOverlay({ link, onClose }) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [options, setOptions] = useState({ ...defaults, ...(link.settings?.qr || {}) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const shortUrl = `https://lenk.tr/${link.short_slug}`;
  const contrast = (Math.max(luminance(options.foreground), luminance(options.background)) + 0.05) / (Math.min(luminance(options.foreground), luminance(options.background)) + 0.05);
  const readable = contrast >= 4.5;
  useEffect(() => {
    try { drawQr(canvasRef.current, shortUrl, options); setError(''); }
    catch (drawError) { setError(drawError.message); }
  }, [shortUrl, options]);
  const download = async (format) => {
    if (!canvasRef.current) return;
    try {
      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
        const side = 120; pdf.addImage(canvasRef.current, 'PNG', 45, 55, side, side);
        pdf.setFontSize(14); pdf.text(shortUrl, 105, 190, { align: 'center' }); pdf.save(`${link.short_slug}-qr.pdf`);
        return;
      }
      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const data = canvasRef.current.toDataURL(mime, 0.95);
      const anchor = document.createElement('a'); anchor.href = data; anchor.download = `${link.short_slug}-qr.${format}`; anchor.click();
    } catch (downloadError) {
      setError(downloadError.message || t('qr.downloadError'));
    }
  };
  const save = async () => {
    setLoading(true); setError('');
    try {
      const { error: saveError } = await api.from('links').update({ settings: { ...(link.settings || {}), qr: options } }).eq('id', link.id);
      if (saveError) throw new Error(saveError.message);
      onClose();
    } catch (saveError) { setError(saveError.message); }
    finally { setLoading(false); }
  };
  const field = (name, value, setter, kind = 'text') => <label className="block space-y-2 text-xs font-bold text-zinc-400">{name}<input type={kind} value={value} onChange={(event) => setter(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white" /></label>;
  return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"><section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0D0F14] shadow-2xl"><header className="flex items-center justify-between border-b border-white/5 px-6 py-4"><div><h2 className="font-bold text-white">{t('qr.title')}</h2><p className="mt-1 font-mono text-xs text-blue-300">{shortUrl}</p></div><button type="button" aria-label={t('common.confirm.cancel')} onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-white/10"><X size={18} /></button></header><div className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr]"><div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-4"><canvas ref={canvasRef} className="h-auto w-full max-w-[300px]"/><p className="break-all text-center font-mono text-xs text-zinc-600">{shortUrl}</p></div><div className="space-y-4"><div className="grid grid-cols-2 gap-3"><label className="space-y-2 text-xs font-bold text-zinc-400">{t('qr.size')}<select value={options.size} onChange={(event) => setOptions({ ...options, size: Number(event.target.value) })} className="w-full rounded-lg border border-white/10 bg-[#11141b] p-2 text-sm text-white">{[256, 512, 1024].map((size) => <option key={size}>{size}</option>)}</select></label><label className="space-y-2 text-xs font-bold text-zinc-400">{t('qr.modules')}<select value={options.moduleStyle} onChange={(event) => setOptions({ ...options, moduleStyle: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#11141b] p-2 text-sm text-white"><option value="square">{t('qr.square')}</option><option value="rounded">{t('qr.rounded')}</option><option value="dots">{t('qr.dots')}</option></select></label><label className="space-y-2 text-xs font-bold text-zinc-400">{t('qr.corners')}<select value={options.eyeStyle} onChange={(event) => setOptions({ ...options, eyeStyle: event.target.value })} className="w-full rounded-lg border border-white/10 bg-[#11141b] p-2 text-sm text-white"><option value="square">{t('qr.square')}</option><option value="rounded">{t('qr.rounded')}</option><option value="circle">{t('qr.circle')}</option></select></label>{field(t('qr.foreground'), options.foreground, (foreground) => setOptions({ ...options, foreground }), 'color')}{field(t('qr.background'), options.background, (background) => setOptions({ ...options, background }), 'color')}</div>{!readable && <p role="alert" className="text-sm text-amber-300">{t('qr.lowContrast')}</p>}{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<div className="grid grid-cols-3 gap-2"><button disabled={!readable} type="button" onClick={() => download('png')} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/5 disabled:opacity-40">PNG</button><button disabled={!readable} type="button" onClick={() => download('jpg')} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/5 disabled:opacity-40">JPG</button><button disabled={!readable} type="button" onClick={() => download('pdf')} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/5 disabled:opacity-40">PDF</button></div><button type="button" disabled={loading || !readable} onClick={save} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}{t('qr.saveStyles')}</button></div></div></section></div>;
}
