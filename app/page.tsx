'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Shield, CreditCard, Send, Smartphone, ArrowRight, CheckCircle2, 
    Globe, Zap, Lock, ChevronRight, RefreshCw, Star, 
    ArrowUpRight, Users, Check, Building2, UserCheck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import Footer from '@/components/Footer'

export default function HomePage() {
    const { settings, fetchSettings } = useSettingsStore()
    const [mounted, setMounted] = useState(false)
    const [sendAmount, setSendAmount] = useState('1000')
    const [targetCurrency, setTargetCurrency] = useState('EUR')

    const rates: Record<string, { rate: number; symbol: string; fee: number }> = {
        EUR: { rate: 0.92, symbol: '€', fee: 2.50 },
        GBP: { rate: 0.79, symbol: '£', fee: 2.20 },
        CAD: { rate: 1.36, symbol: 'C$', fee: 3.00 },
        AUD: { rate: 1.52, symbol: 'A$', fee: 3.20 },
        JPY: { rate: 154.20, symbol: '¥', fee: 350 },
    }

    const currentRate = rates[targetCurrency] || rates.EUR
    const numericSend = parseFloat(sendAmount) || 0
    const receivedAmount = Math.max(0, (numericSend - (currentRate.fee || 0)) * currentRate.rate).toFixed(2)

    useEffect(() => {
        setMounted(true)
        fetchSettings()
    }, [fetchSettings])

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden font-sans">
            <Navbar />

            {/* ===== HERO SECTION ===== */}
            <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Subtle Ambient Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-sky-500/15 to-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
                    {/* Left Column: Hero Copy */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium"
                        >
                            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                            Next-Generation Global Banking & Payments
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12]"
                        >
                            Banking designed for <br />
                            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                                speed, trust & clarity.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
                        >
                            Send money across 180+ countries in seconds, hold multiple currencies, and grow your wealth with zero surprise fees. Simple, transparent, and built for everyone.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                        >
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                Open Free Account
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#features"
                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
                            >
                                How It Works
                            </Link>
                        </motion.div>

                        {/* Trust Checkmarks */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium"
                        >
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                <span>No hidden conversion fees</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                <span>256-Bit bank security</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={15} className="text-emerald-400" />
                                <span>Setup in 3 minutes</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Interactive Transfer Calculator Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-5"
                    >
                        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/40 backdrop-blur-xl relative">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                                <div>
                                    <h3 className="text-base font-bold text-white">Live Currency Calculator</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Real-time mid-market exchange rate</p>
                                </div>
                                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Live
                                </div>
                            </div>

                            {/* Send Input */}
                            <div className="pt-6 space-y-4">
                                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 focus-within:border-sky-500/60 transition-colors">
                                    <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                                        <span>You send</span>
                                        <span className="font-medium text-slate-300">USD</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-2xl font-bold text-slate-300">$</span>
                                        <input
                                            type="number"
                                            value={sendAmount}
                                            onChange={(e) => setSendAmount(e.target.value)}
                                            className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                                            placeholder="1,000"
                                        />
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">USD</span>
                                    </div>
                                </div>

                                {/* Calculation Bridge */}
                                <div className="px-3 py-1 flex items-center justify-between text-xs text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center text-[10px] font-bold">1</span>
                                        <span>1 USD = {currentRate.rate} {targetCurrency}</span>
                                    </div>
                                    <span className="text-emerald-400 font-medium">Free transfer guarantee</span>
                                </div>

                                {/* Receive Output */}
                                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                                    <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                                        <span>Recipient receives</span>
                                        <div className="flex items-center gap-1.5">
                                            {['EUR', 'GBP', 'CAD', 'AUD'].map((curr) => (
                                                <button
                                                    key={curr}
                                                    type="button"
                                                    onClick={() => setTargetCurrency(curr)}
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                                        targetCurrency === curr
                                                            ? 'bg-sky-500 text-slate-950'
                                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    {curr}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-2xl font-bold text-sky-400">{currentRate.symbol}</span>
                                        <div className="text-2xl font-bold text-white truncate">
                                            {receivedAmount}
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                                            {targetCurrency}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="pt-6">
                                <Link
                                    href="/register"
                                    className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-lg shadow-sky-500/20"
                                >
                                    Send This Amount Now
                                </Link>
                                <p className="text-center text-[11px] text-slate-500 mt-3">
                                    Estimated arrival: <strong className="text-slate-400">Within minutes</strong>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="py-12 border-y border-slate-800/80 bg-slate-950/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: "$12.8B+", label: "Transfers Processed" },
                        { value: "180+", label: "Countries Supported" },
                        { value: "99.99%", label: "Platform Uptime" },
                        { value: "4.9 / 5", label: "User Trust Rating" },
                    ].map((stat, i) => (
                        <motion.div key={i} {...fadeIn} className="space-y-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== CORE SOLUTIONS SECTION ===== */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Built For Everyday Money</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Everything you need to manage money worldwide.
                    </h2>
                    <p className="text-sm text-slate-400">
                        Whether you are sending money to loved ones abroad or running an international business, KeyTrust Pay makes global banking frictionless.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Send className="text-sky-400" size={24} />,
                            title: "Instant Global Transfers",
                            desc: "Send and receive money internationally with real-time tracking, transparent rates, and zero hidden markups.",
                            badge: "Instant Delivery"
                        },
                        {
                            icon: <Globe className="text-blue-400" size={24} />,
                            title: "Multi-Currency Accounts",
                            desc: "Hold and convert between 30+ currencies in one unified dashboard. Exchange at mid-market rates whenever you want.",
                            badge: "30+ Currencies"
                        },
                        {
                            icon: <CreditCard className="text-cyan-400" size={24} />,
                            title: "Virtual & Contactless Cards",
                            desc: "Generate instant virtual cards for safe online shopping, or order your durable metal debit card for travel worldwide.",
                            badge: "Apple & Google Pay"
                        },
                        {
                            icon: <Building2 className="text-indigo-400" size={24} />,
                            title: "Business & Payroll Tools",
                            desc: "Pay international teams and vendors in a few clicks. Automate invoices and download audit-ready financial receipts.",
                            badge: "For Teams"
                        },
                        {
                            icon: <Shield className="text-emerald-400" size={24} />,
                            title: "Bank-Grade Protection",
                            desc: "Every transaction is guarded with 256-bit encryption, biometric two-factor authentication, and proactive fraud prevention.",
                            badge: "256-Bit TLS"
                        },
                        {
                            icon: <Zap className="text-amber-400" size={24} />,
                            title: "24/7 Human Support",
                            desc: "Our responsive customer support desk is available around the clock to answer questions and keep your finances moving.",
                            badge: "Always Here"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            {...fadeIn}
                            className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/30 transition-all hover:bg-slate-900/80 space-y-4 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <span className="text-[10px] font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/80">
                                    {feature.badge}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white pt-2">{feature.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== HOW IT WORKS IN 3 STEPS ===== */}
            <section className="py-20 bg-slate-950/70 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
                        <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Get Started Fast</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">How KeyTrust Pay works</h2>
                        <p className="text-xs text-slate-400">Join thousands of verified members in three simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {[
                            {
                                step: "01",
                                title: "Create your free account",
                                desc: "Sign up in 3 minutes with your email and basic details. No paperwork or tedious branch visits."
                            },
                            {
                                step: "02",
                                title: "Verify & load your balance",
                                desc: "Verify your email with a quick 6-digit code and fund your wallet securely through bank wire or transfer."
                            },
                            {
                                step: "03",
                                title: "Send, spend & save globally",
                                desc: "Send money instantly to accounts in over 180 countries or spend with your virtual KeyTrust Pay card."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeIn}
                                className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 relative space-y-3"
                            >
                                <span className="text-4xl font-extrabold text-sky-500/20">{item.step}</span>
                                <h3 className="text-base font-bold text-white">{item.title}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SOCIAL PROOF / TESTIMONIALS ===== */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
                    <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Customer Stories</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">Loved by teams & individuals</h2>
                    <p className="text-xs text-slate-400">Hear from real people using KeyTrust Pay every day.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Sarah Jenkins",
                            role: "Freelance Designer, Berlin",
                            text: "KeyTrust Pay made receiving client payments from the US and UK painless. I save hundreds in currency conversion fees every month."
                        },
                        {
                            name: "David Adeleke",
                            role: "Founder at NovaTech",
                            text: "We use KeyTrust Pay to disburse payroll to our remote engineering team across 4 countries. Instant settlement and zero friction."
                        },
                        {
                            name: "Elena Rostova",
                            role: "E-commerce Entrepreneur",
                            text: "The virtual cards are a lifesaver for our company software subscriptions. Clean interface, fast transfers, and brilliant support."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            {...fadeIn}
                            className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4"
                        >
                            <div className="flex gap-1 text-amber-400">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} size={14} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">"{item.text}"</p>
                            <div className="pt-2 border-t border-slate-800/60">
                                <p className="text-xs font-semibold text-white">{item.name}</p>
                                <p className="text-[11px] text-slate-500">{item.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== FINAL CALL TO ACTION ===== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
                <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-blue-900/40 via-sky-900/20 to-slate-900 border border-sky-500/20 text-center relative overflow-hidden shadow-2xl">
                    <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Ready to upgrade your banking?
                        </h2>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            Join thousands of individuals and growing businesses who trust KeyTrust Pay for seamless, modern global finances.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-lg shadow-sky-500/20"
                            >
                                Open Your Account in Minutes
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 transition-colors"
                            >
                                Talk to Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
