import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Github, Zap, ArrowRight, Lock, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { createClient } from '../utils/supabase/client';

const supabase = createClient();

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    const handleGithubLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) setError(error.message);
    };

    return (
        <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-8 selection:bg-blue-500/30">
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
                        <h1 className="text-3xl font-black font-heading tracking-tight text-white mt-4">Welcome Back</h1>
                        <p className="text-gray-500 font-medium text-sm">Sign in to manage your links and bio pages.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="alex@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0D0F14] border border-white/5 rounded-[12px] px-4 py-3.5 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                                    <a href="#" className="text-[10px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest">Forgot?</a>
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
                            size="lg"
                            className="w-full h-14"
                            glow
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight size={20} className="ml-3" /></>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/5"></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
                            <span className="bg-[#0D0F14] px-4">OR</span>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="md"
                        className="w-full h-14"
                        onClick={handleGithubLogin}
                    >
                        <Github size={20} className="mr-3" /> Continue with GitHub
                    </Button>
                </div>

                <p className="text-center mt-10 text-sm font-bold text-gray-600">
                    New to the network?{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest text-xs ml-2">Open account</Link>
                </p>
            </Motion.div>
        </div>
    );
};

export default LoginPage;
