import React, { useState } from 'react';
import SEO from "../components/SEO";
import { motion as Motion } from 'framer-motion';
import { Github, ArrowRight, Lock, Loader2, Languages } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { createClient, request } from '../utils/api/client';
import { useTranslation } from 'react-i18next';

const api = createClient();

const LoginPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verificationRequired, setVerificationRequired] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setVerificationRequired(false);
        setResendMessage('');

        const { error } = await api.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setVerificationRequired(/doğrula|verify your email/i.test(error.message));
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    const resendVerification = async () => {
        setResending(true);
        const result = await request('/api/auth/resend-verification', { email });
        setResending(false);
        if (result.error) setError(result.error.message);
        else setResendMessage(t('login.verificationResent'));
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-8 selection:bg-blue-500/30">
      <SEO title={`${t('login.title')} | LENK.TR`} description="LENK.TR hesabınıza giriş yapın." url="/login" noIndex />
            {/* Language Switcher */}
            <div className="fixed top-8 right-8 z-50">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                    <Languages size={16} className="text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                        {i18n.language === 'en' ? 'TR' : 'EN'}
                    </span>
                </button>
            </div>

            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

            <Motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="flex justify-center mb-12">
                    <Link to="/" aria-label="LENK.TR ana sayfa" className="flex items-center"><img src="/logo-lenk.png" alt="LENK.TR" width="192" height="56" className="h-14 w-auto" /></Link>
                </div>

                <div className="bg-[#0D0F14] border border-white/5 rounded-[40px] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                    <div className="text-center mb-10 space-y-2">
                        <h1 className="text-3xl font-black font-heading tracking-tight text-white mt-4">{t('login.title')}</h1>
                        <p className="text-gray-500 font-medium text-sm">{t('login.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}
                    {verificationRequired && <button type="button" disabled={resending || !email} onClick={resendVerification} className="mb-6 w-full rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-sm font-semibold text-blue-300 disabled:opacity-50">{resending ? <Loader2 size={16} className="mx-auto animate-spin" /> : t('login.resendVerification')}</button>}
                    {resendMessage && <p role="status" className="mb-6 text-center text-sm text-green-400">{resendMessage}</p>}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{t('login.emailLabel')}</label>
                                <input
                                    type="email"
                                    placeholder={t('login.emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('login.passwordLabel')}</label>
                                    <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">{t('login.forgotPassword')}</Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-14"
                            glow
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>{t('login.signInButton')} <ArrowRight size={20} className="ml-3" /></>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-10 text-sm font-bold text-gray-600">
                    {t('login.noAccount')}{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest text-xs ml-2">{t('login.registerLink')}</Link>
                </p>
            </Motion.div>
        </div>
    );
};

export default LoginPage;
