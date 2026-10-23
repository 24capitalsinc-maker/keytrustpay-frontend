'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreditCard, Globe, Shield, Star, ArrowRight, CheckCircle2, Zap, Gift, Plane, Lock, Wifi } from 'lucide-react'
import Footer from '@/components/Footer'

export default function CardsPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/3 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            {/* Hero */}
            <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-12">
                <div className="max-w-7xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.8, ease: "easeOut" as const }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8">
                            <CreditCard size={14} />
                            <span>Smart Physical & Virtual Cards</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Cards designed for <br />
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                total freedom.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed font-normal max-w-xl">
                            From instant unlimited cashback to global travel rewards and metal cards with zero foreign transaction fees — KeyTrust Pay gives you full control over how you spend anywhere in the world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/register" 
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Order Your Card
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a 
                                href="#compare" 
                                className="px-8 py-4 rounded-xl font-medium text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2"
                            >
                                Compare Cards
                            </a>
                        </div>
                    </motion.div>

                    {/* Card Visuals Stack */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" as const }} 
                        className="hidden lg:flex flex-col gap-6 relative"
                    >
                        {/* Signature Titanium Card */}
                        <div className="relative w-full max-w-md aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/40 p-7 flex flex-col justify-between shadow-2xl shadow-cyan-500/10 group hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                            K
                                        </div>
                                        <span className="font-bold text-white text-sm tracking-wide">KeyTrust Pay</span>
                                    </div>
                                    <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mt-1 block">Signature Titanium</span>
                                </div>
                                <Wifi size={20} className="text-slate-400 rotate-90" />
                            </div>

                            <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-400/40 my-auto" />

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="font-mono text-base tracking-[0.25em] text-slate-200 mb-1">•••• •••• •••• 8294</p>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alexander Wright</p>
                                </div>
                                <span className="font-bold text-base text-slate-300 tracking-wider">DEBIT</span>
                            </div>
                        </div>

                        {/* Everyday Virtual Card */}
                        <div className="relative w-4/5 ml-auto -mt-10 aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-700 p-6 flex flex-col justify-between shadow-xl opacity-90 group hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-semibold text-slate-300 text-xs">KeyTrust Pay Virtual</span>
                                    <span className="text-[9px] text-emerald-400 font-medium block">Instant Spend Ready</span>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="font-mono text-xs tracking-widest text-slate-400">•••• 5102</p>
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Apple Pay Ready</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Comparison */}
            <section id="compare" className="py-24 px-4 sm:px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Card Portfolio</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                            Choose the card that <span className="text-cyan-400">matches your lifestyle.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Everyday", tier: "Essential", annualFee: "Free", apr: "Zero APR on debit",
                                rewards: "1.0% cash back on all everyday purchases", highlight: false,
                                highlights: [
                                    "Instant virtual debit card issuance",
                                    "1.0% unlimited cash back",
                                    "Zero foreign exchange transaction fees",
                                    "Real-time instant spend push notifications",
                                    "Apple Pay & Google Pay compatibility",
                                    "Free ATM cash withdrawals worldwide (3/mo)"
                                ]
                            },
                            {
                                name: "Signature", tier: "Preferred", annualFee: "$99/yr", apr: "Zero APR on debit",
                                rewards: "2.0% cash back on dining, transit & travel", highlight: true,
                                highlights: [
                                    "Heavyweight matte black metal physical card",
                                    "2.0% cash back on dining and travel",
                                    "1.5% cash back on all other purchases",
                                    "Priority 24/7 customer concierge",
                                    "$150 annual flight and hotel credit",
                                    "Complimentary airport lounge access (2/yr)"
                                ]
                            },
                            {
                                name: "Reserve", tier: "Elite Tier", annualFee: "$399/yr", apr: "Zero APR on debit",
                                rewards: "3.5% cash back on all global travel & hotels", highlight: false,
                                highlights: [
                                    "Crafted brushed titanium card",
                                    "3.5% cash back on flights and luxury hotels",
                                    "Unlimited airport lounge access (Priority Pass)",
                                    "Dedicated private relationship advisor",
                                    "$400 annual travel statement credit",
                                    "Comprehensive worldwide travel insurance"
                                ]
                            },
                        ].map((card, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeIn} 
                                className={`rounded-3xl p-8 sm:p-10 flex flex-col relative transition-all duration-300 ${
                                    card.highlight 
                                        ? 'bg-slate-900 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-500/10' 
                                        : 'bg-slate-900/60 border border-slate-800'
                                }`}
                            >
                                {card.highlight && (
                                    <div className="text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 font-bold uppercase tracking-wider px-3.5 py-1 rounded-full w-fit mb-6">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-4">
                                    <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">{card.tier}</p>
                                    <h3 className="text-2xl font-bold text-white">{card.name}</h3>
                                </div>
                                <div className="py-4 border-y border-slate-800 mb-6">
                                    <p className="text-3xl font-extrabold text-white">{card.annualFee}</p>
                                    <p className="text-slate-400 text-xs mt-1">{card.apr}</p>
                                </div>
                                <p className="text-slate-300 text-sm mb-6 font-medium">&ldquo;{card.rewards}&rdquo;</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {card.highlights.map((h, j) => (
                                        <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                                <Link 
                                    href="/register" 
                                    className={`w-full py-4 rounded-xl text-center text-sm font-semibold transition-all ${
                                        card.highlight 
                                            ? 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/20' 
                                            : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                                    }`}
                                >
                                    Apply for {card.name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Travel & Protection Perks */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Everyday Protection</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                            Engineered for safety <span className="text-cyan-400">wherever you roam.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Plane size={24} />, label: "Global Lounge Access", desc: "Relax before your flight in over 1,400 airport lounges worldwide via partner passes." },
                            { icon: <Globe size={24} />, label: "Zero FX Markup", desc: "Swipe in any foreign currency anywhere in the world at real mid-market exchange rates." },
                            { icon: <Lock size={24} />, label: "Instant Card Freeze", desc: "Misplaced your card? Freeze and unfreeze it in seconds directly from the app." },
                            { icon: <Shield size={24} />, label: "Zero Liability Policy", desc: "Protected against unauthorized charges with automated real-time fraud detection." },
                        ].map((b, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -6 }} 
                                {...fadeIn} 
                                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-8 rounded-2xl group transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                    {b.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">{b.label}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-[#090D16] border-t border-slate-800 text-center relative">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Ready to upgrade your <span className="text-cyan-400">daily spending?</span>
                    </h2>
                    <p className="text-slate-300 mb-10 text-base max-w-xl mx-auto">
                        Order your KeyTrust Pay card today. Virtual cards are active immediately upon verification.
                    </p>
                    <Link 
                        href="/register" 
                        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-10 py-5 rounded-xl shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3 transition-all text-base"
                    >
                        Order Your Card Now <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
