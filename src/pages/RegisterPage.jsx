import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Zap, Check, Loader2, ArrowRight, Languages } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { createClient } from '../utils/supabase/client';
import { useTranslation } from 'react-i18next';

const supabase = createClient();

const RegisterPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Usually Supabase sends a confirmation email. 
            // If email confirmation is off, it logs the user in.
            navigate('/dashboard');
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'tr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-8 selection:bg-blue-500/30">
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
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full"></div>
            </div>

            <Motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-xl"
            >
                <div className="flex justify-center mb-10">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-transform duration-500">
                            <Zap size={28} className="text-white fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter font-heading text-white">lenk.tr</span>
                        </div>
                    </Link>
                </div>

                <div className="bg-[#0D0F14] border border-white/5 rounded-[40px] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                    <div className="text-center mb-10 space-y-2">
                        <h1 className="text-3xl font-black font-heading tracking-tight text-white mt-4">{t('register.title')}</h1>
                        <p className="text-gray-500 font-medium">{t('register.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{t('register.firstNameLabel')}</label>
                                <input
                                    placeholder={t('register.firstNamePlaceholder')}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{t('register.lastNameLabel')}</label>
                                <input
                                    placeholder={t('register.lastNamePlaceholder')}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{t('register.emailLabel')}</label>
                            <input
                                type="email"
                                placeholder={t('register.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{t('register.passwordLabel')}</label>
                            <input
                                type="password"
                                placeholder={t('register.passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                required
                            />
                        </div>

                        <div className="flex items-start gap-4 px-2">
                            <div className="mt-1 w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center bg-blue-600 shadow-lg shadow-blue-600/20 shrink-0">
                                <Check size={14} className="text-white" strokeWidth={4} />
                            </div>
                            <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">
                                {t('register.termsAgree').split('Terms')[0]}
                                <span className="text-white font-black cursor-pointer underline underline-offset-4 decoration-white/10">{t('register.terms')}</span>
                                {t('register.termsAgree').includes('and') ? ' and ' : ' ve '}
                                <span className="text-white font-black cursor-pointer underline underline-offset-4 decoration-white/10">{t('register.privacy')}</span>.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full h-14"
                            glow
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>{t('register.submitButton')} <ArrowRight size={20} className="ml-3" /></>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-10 text-sm font-bold text-gray-600">
                    {t('register.hasAccount')}{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest text-xs ml-2">{t('register.loginLink')}</Link>
                </p>
            </Motion.div>
        </div>
    );
};

export default RegisterPage;
