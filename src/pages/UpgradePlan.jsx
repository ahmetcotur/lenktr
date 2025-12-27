import React, { useState } from 'react';
import { Check, X, Zap, Crown, Star, Shield, Smartphone, Globe, Calendar, BarChart2, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const UpgradePlan = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const plans = [
        {
            id: 'free',
            name: 'Free Starter',
            price: { monthly: 0, yearly: 0 },
            desc: 'Essential tools for individuals just starting out.',
            features: [
                { text: 'Unlimited Bio Links', included: true },
                { text: 'Basic Analytics (7 days)', included: true },
                { text: 'Standard Templates', included: true },
                { text: 'lenk.tr Branding', included: false, label: 'Show Branding' },
                { text: 'Custom Domain', included: false },
                { text: 'Tracking Pixels', included: false },
                { text: 'Schedule & Expiration', included: false },
            ],
            cta: 'Current Plan',
            variant: 'outline',
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: { monthly: 3, yearly: 29 },
            desc: 'Unlock advanced customization and analytics.',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'No Branding', included: true },
                { text: 'Advanced Analytics (90 days)', included: true },
                { text: 'Pro Templates & Fonts', included: true },
                { text: 'Custom Domain Support', included: true },
                { text: 'Tracking Pixels (FB, Google)', included: true },
                { text: 'Schedule & Expiration', included: true },
                { text: 'Verified Output', included: true },
            ],
            cta: 'Upgrade to Pro',
            variant: 'primary',
            popular: true,
            icon: Zap
        },
        {
            id: 'lifetime',
            name: 'Lifetime Deal',
            price: { monthly: 19, yearly: 19 },
            type: 'one-time',
            desc: 'Pay once, own it forever. Best value for power users.',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Lifetime Access', included: true },
                { text: 'Unlimited Custom Domains', included: true },
                { text: 'Lifetime Analytics History', included: true },
                { text: 'Priority Support (24/7)', included: true },
                { text: 'API Access', included: true },
                { text: 'Future Pro Updates', included: true },
            ],
            cta: 'Get Lifetime Access',
            variant: 'outline',
            popular: false,
            icon: Crown
        }
    ];

    return (
        <div className="min-h-screen bg-[#08090D] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Unlock Your Full <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Potential</span>
                    </h1>
                    <p className="text-xl text-zinc-400 mb-8">
                        Upgrade to Pro to remove branding, use custom domains, and access powerful analytics.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center p-1 bg-white/5 rounded-full border border-white/10">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Yearly <Badge variant="success" size="sm" className="bg-lime-500 text-black border-none px-1 py-0 text-[10px]">-20%</Badge>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => {
                        const isLifetime = plan.type === 'one-time';
                        const price = isLifetime ? plan.price.monthly : (billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12));
                        const isPro = plan.id === 'pro';

                        return (
                            <div
                                key={plan.id}
                                className={`relative p-8 rounded-3xl border transition-all duration-300 ${isPro ? 'bg-gradient-to-b from-blue-600/10 to-[#0D0F14] border-blue-500/50 shadow-2xl shadow-blue-900/20 transform hover:-translate-y-2' : 'bg-[#0D0F14] border-white/10 hover:border-white/20'}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white/20">
                                        Most Popular
                                    </div>
                                )}
                                {isLifetime && (
                                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-lime-500 text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                        Best Value
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPro ? 'bg-blue-500 text-white' : 'bg-white/5 text-zinc-400'}`}>
                                            {plan.icon ? <plan.icon size={24} /> : <Star size={24} />}
                                        </div>
                                        {isPro && <div className="text-blue-400 font-bold text-sm flex items-center gap-1"><Sparkles size={14} /> Recommended</div>}
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                                    <p className="text-zinc-500 text-sm h-10">{plan.desc}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-black text-white">${price}</span>
                                        {!isLifetime && <span className="text-zinc-500 font-medium mb-1">/mo</span>}
                                        {isLifetime && <span className="text-lime-500 font-black text-sm mb-2 ml-1 uppercase">One-time</span>}
                                    </div>
                                    {billingCycle === 'yearly' && plan.price.yearly > 0 && !isLifetime && (
                                        <p className="text-xs text-lime-500 mt-2 font-bold">Billed ${plan.price.yearly} yearly</p>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feature.included ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                                {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                                            </div>
                                            <span className={`text-sm ${feature.included ? 'text-zinc-300' : 'text-zinc-600 line-through'}`}>
                                                {feature.label || feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.variant}
                                    className="w-full"
                                    glow={isPro}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                    <div className="grid gap-4">
                        {[
                            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.' },
                            { q: 'Can I use my own domain?', a: 'Yes! Pro and Agency plans support custom domains so you can use your own web address.' },
                            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay.' }
                        ].map((faq, i) => (
                            <div key={i} className="bg-[#0D0F14] border border-white/5 rounded-xl p-6">
                                <h4 className="font-bold text-white mb-2">{faq.q}</h4>
                                <p className="text-zinc-500 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradePlan;
