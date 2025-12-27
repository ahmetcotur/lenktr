import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const PricingPage = () => {
    const plans = [
        {
            name: "Standard Node",
            price: "0",
            desc: "Essential infrastructure for individuals.",
            features: [
                "Unlimited bio links",
                "7-day performance logs",
                "Standard redirection speed",
                "lenk.tr system branding",
                "10 short nodes / month"
            ],
            button: "Claim Free Node",
            variant: "outline"
        },
        {
            name: "Pro Engine",
            price: "12",
            desc: "Advanced logic for professional creators.",
            features: [
                "Lifetime performance data",
                "Unlimited short nodes",
                "Remove system branding",
                "Priority node propagation",
                "Geofencing & Auth Gates",
                "Custom domain mapping"
            ],
            button: "Activate Pro Node",
            variant: "primary",
            popular: true,
            glow: true
        },
        {
            name: "Nexus Cluster",
            price: "32",
            desc: "Cluster management for scaled teams.",
            features: [
                "Everything in Pro",
                "Multi-user collaboration",
                "Universal API access",
                "White-label redirection",
                "Dedicated account node",
                "Custom SSL certificates"
            ],
            button: "Request Cluster",
            variant: "outline"
        }
    ];

    return (
        <div className="min-h-screen bg-[#08090D] py-24 md:py-40 px-6 md:px-16 text-white font-sans">
            <div className="max-w-[1600px] mx-auto text-center mb-24 md:mb-40">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Badge variant="primary" className="mb-8 md:mb-12">PRTCL-X PRICING</Badge>
                    <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 md:mb-12 font-heading text-gradient leading-[0.85] uppercase italic">TRANSPARENT <br /> NODE SCALE.</h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-bold leading-relaxed px-4">
                        Computational power that scales with your growth. <br className="hidden md:block" />
                        No hidden layers. Just precision routing.
                    </p>
                </Motion.div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {plans.map((plan, i) => (
                    <Motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative p-8 md:p-12 rounded-[32px] md:rounded-[40px] border ${plan.popular ? 'bg-[#0D0F14] border-blue-500/30' : 'bg-[#0D0F14] border-white/5'} flex flex-col group transition-all duration-500 hover:border-white/10`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 rounded-full text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl shadow-blue-600/50 flex items-center gap-2 z-20">
                                <Sparkles size={14} /> ELITE CHOICE
                            </div>
                        )}

                        <div className="mb-10 md:mb-12">
                            <h3 className="text-2xl md:text-3xl font-black font-heading tracking-tighter mb-4 flex items-center gap-3 italic uppercase">
                                {plan.name} {plan.popular && <Star size={20} className="text-blue-500 fill-current" />}
                            </h3>
                            <p className="text-sm md:text-base font-bold text-gray-500 leading-relaxed">{plan.desc}</p>
                            <div className="mt-8 md:mt-12 flex items-baseline gap-3">
                                <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">${plan.price}</span>
                                <span className="text-gray-600 text-[10px] md:text-sm font-black uppercase tracking-[0.3em]">/NODE</span>
                            </div>
                        </div>

                        <Button variant={plan.variant} className="w-full mb-10 md:mb-12 py-5 md:py-6 text-base md:text-lg" size="lg">
                            {plan.button}
                        </Button>

                        <div className="space-y-6 md:space-y-8 flex-1">
                            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-gray-700">NODE CAPABILITIES</p>
                            <ul className="space-y-4 md:space-y-6">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-4 md:gap-5 text-sm md:text-base font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 border border-blue-500/10">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Motion.div>
                ))}
            </div>

            <Motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-32 md:mt-64 max-w-6xl mx-auto glass-effect rounded-[40px] md:rounded-[50px] p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full"></div>
                <div className="text-center lg:text-left space-y-4 md:space-y-6 relative z-10">
                    <Badge variant="success">CUSTOM CLUSTER</Badge>
                    <h3 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-white leading-none italic uppercase">ENTERPRISE SCALE?</h3>
                    <p className="text-gray-500 font-bold text-lg md:text-xl max-w-xl">Dedicated infrastructure for global agencies and decentralized organizations.</p>
                </div>
                <Button variant="primary" size="lg" className="px-10 md:px-16 py-6 md:py-8 text-lg md:text-xl group/btn min-w-[240px] md:min-w-[300px]">
                    Contact Council <ArrowRight size={24} className="ml-4 group-hover/btn:translate-x-2 transition-transform duration-500" />
                </Button>
            </Motion.div>
        </div>
    );
};

export default PricingPage;
