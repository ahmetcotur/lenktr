import { useState } from 'react';
import SEO from '../components/SEO';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck, Loader2 } from 'lucide-react';
import { request } from '../utils/api/client';
import { useTranslation } from 'react-i18next';

export default function VerifyEmailPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    const email = location.state?.email || '';
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function verify() {
        setBusy(true);
        setError('');
        const result = await request('/api/auth/verify-email', { token });
        setBusy(false);
        if (result.error) setError(result.error.message || t('emailVerification.expired'));
        else {
            setMessage(t('emailVerification.success'));
            window.history.replaceState(null, '', window.location.pathname);
        }
    }

    async function resend() {
        setBusy(true);
        setError('');
        const result = await request('/api/auth/resend-verification', { email });
        setBusy(false);
        if (result.error) setError(result.error.message);
        else setMessage(t('emailVerification.resendSent'));
    }

    return (
        <main className="min-h-screen bg-[#08090D] text-white grid place-items-center p-6">
            <SEO title={`${t('emailVerification.title')} | LENK.TR`} description={t('emailVerification.prompt')} url="/account/verify" noIndex />
            <section className="w-full max-w-md rounded-3xl bg-[#0D0F14] border border-white/10 p-8 space-y-6">
                <Link to="/" className="text-2xl font-black text-blue-500">lenk.tr</Link>
                <MailCheck size={40} className="text-blue-400" />
                <h1 className="text-2xl font-bold">{t('emailVerification.title')}</h1>
                <p className="text-zinc-400">{t('emailVerification.prompt')}</p>
                {email && <p className="text-sm text-zinc-400">{t('emailVerification.sentTo')} <strong className="text-white">{email}</strong></p>}
                {message && <p role="status" className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-300">{message}</p>}
                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                {!message && token && <button disabled={busy} onClick={verify} className="w-full rounded-xl bg-blue-600 p-3 font-bold disabled:opacity-50 flex justify-center gap-2">{busy && <Loader2 className="animate-spin" size={18} />}{t('emailVerification.verifyButton')}</button>}
                {email && <button disabled={busy} onClick={resend} className="w-full rounded-xl border border-white/10 p-3 font-semibold text-zinc-300 hover:bg-white/5 disabled:opacity-50 flex justify-center gap-2">{busy && <Loader2 className="animate-spin" size={18} />}{t('emailVerification.resendButton')}</button>}
                <Link to="/login" className="block text-sm text-blue-400 hover:text-blue-300">{t('emailVerification.signIn')}</Link>
            </section>
        </main>
    );
}
