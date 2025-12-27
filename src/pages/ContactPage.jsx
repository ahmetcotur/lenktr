import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Mail, Send, Twitter, Github, MessageSquare, Clock } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const ContactPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#08090D] text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[160px] rounded-full"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-10 max-w-[1600px] mx-auto">
                <Link to="/" className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-all duration-500">
                        <Zap size={28} className="text-white fill-current" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter font-heading italic uppercase">LENK.TR</span>
                </Link>
                <Link to="/">
                    <Button variant="secondary" size="md">{t('common.back')}</Button>
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 md:px-16 pt-24 pb-32 md:pt-32 md:pb-48 max-w-[1600px] mx-auto text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Badge variant="primary" className="mb-8">{t('contact.title')}</Badge>
                    <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter font-heading text-white leading-none mb-12 uppercase italic">
                        {t('contact.hero')}
                    </h1>
                    <p className="text-2xl text-gray-400 font-bold max-w-3xl mx-auto leading-relaxed">
                        {t('contact.desc')}
                    </p>
                </Motion.div>
            </section>

            {/* Contact Form & Info */}
            <section className="relative z-10 px-6 md:px-16 py-32 md:py-48 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                    {/* Contact Form */}
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="premium-card p-10 md:p-14 border-white/5"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                                    {t('contact.form.name')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500/50 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                                    {t('contact.form.email')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500/50 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                                    {t('contact.form.subject')}
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500/50 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                                    {t('contact.form.message')}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500/50 focus:outline-none transition-all resize-none"
                                />
                            </div>

                            {status === 'success' && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                                    <p className="text-green-400 font-bold text-center">{t('contact.form.success')}</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                    <p className="text-red-400 font-bold text-center">{t('contact.form.error')}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={status === 'sending'}
                                glow
                            >
                                {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
                                <Send size={18} className="ml-3" />
                            </Button>
                        </form>
                    </Motion.div>

                    {/* Contact Info */}
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        {/* Email */}
                        <div className="glass-effect p-8 rounded-[40px] border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                                <Mail size={28} />
                            </div>
                            <h3 className="text-2xl font-black font-heading text-white mb-4 uppercase">{t('contact.info.email')}</h3>
                            <a href="mailto:support@lenk.tr" className="text-xl text-gray-400 font-bold hover:text-blue-400 transition-colors">
                                {t('contact.info.support')}
                            </a>
                        </div>

                        {/* Support Hours */}
                        <div className="glass-effect p-8 rounded-[40px] border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-2xl font-black font-heading text-white mb-4 uppercase">{t('contact.info.hours')}</h3>
                            <p className="text-xl text-gray-400 font-bold">{t('contact.info.hoursText')}</p>
                        </div>

                        {/* Social */}
                        <div className="glass-effect p-8 rounded-[40px] border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-lime-500/10 flex items-center justify-center text-lime-500 mb-6">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-2xl font-black font-heading text-white mb-6 uppercase">{t('contact.info.social')}</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Twitter, url: 'https://twitter.com' },
                                    { icon: Github, url: 'https://github.com' },
                                    { icon: MessageSquare, url: 'https://discord.com' }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all group"
                                    >
                                        <social.icon size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
