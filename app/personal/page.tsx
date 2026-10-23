'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Zap, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, PiggyBank, CreditCard, Clock, Sparkles } from 'lucide-react'
import Footer from '@/components/Footer'

export default function PersonalPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
            
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
                            <Sparkles size={14} />
                            <span>Personal Banking Redefined</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Banking tailored to <br />
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                your daily life.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed font-normal max-w-xl">
                            Zero monthly maintenance fees. Earn 5.24% APY on your savings. Receive direct deposits up to 2 days early, and send money to anyone in seconds with zero hidden charges.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/register" 
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Open Free Account
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                href="/login" 
                                className="px-8 py-4 rounded-xl font-medium text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={18} className="text-cyan-400" /> 
                                Client Login
                            </Link>
                        </div>
                        <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">$0</p>
                                <p className="text-slate-400 text-xs mt-1">Monthly Fees</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-cyan-400">5.24%</p>
                                <p className="text-slate-400 text-xs mt-1">Savings APY</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">2 Days</p>
                                <p className="text-slate-400 text-xs mt-1">Early Paycheck</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Live Card Mock */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" as const }} 
                        className="hidden lg:block"
                    >
                        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                            <div className="flex justify-between items-center pb-6 border-b border-slate-800">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Personal Checking</p>
                                    <p className="text-slate-400 text-xs font-mono mt-0.5">Acct •••• 4912</p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live & Protected
                                </span>
                            </div>
                            
                            <div className="my-6">
                                <p className="text-xs text-slate-400 mb-1">Available Balance</p>
                                <p className="text-4xl font-bold text-white tracking-tight">$18,450.25</p>
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-2 font-medium">
                                    <TrendingUp size={14} />
                                    <span>+ $3,200.00 inbound direct deposit received</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
                                    <p className="text-xs text-slate-400 mb-1">Growth Vault APY</p>
                                    <p className="text-xl font-bold text-cyan-400">5.24%</p>
                                </div>
                                <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
                                    <p className="text-xs text-slate-400 mb-1">Card Cash Back</p>
                                    <p className="text-xl font-bold text-emerald-400">+$124.60</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Activity</p>
                                {[
                                    { name: "Salary Direct Deposit", amount: "+$3,200.00", time: "Yesterday, 9:15 AM", type: "in" },
                                    { name: "Grocery Store", amount: "-$64.80", time: "Today, 1:42 PM", type: "out" },
                                    { name: "Savings Vault Transfer", amount: "-$500.00", time: "Today, 3:10 PM", type: "out" },
                                ].map((tx, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                                        <div>
                                            <p className="text-slate-200 text-sm font-medium">{tx.name}</p>
                                            <p className="text-slate-500 text-xs">{tx.time}</p>
                                        </div>
                                        <span className={`font-mono text-sm font-semibold ${tx.type === 'in' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                            {tx.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">KeyTrust Pay Products</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                            Everything you need, <span className="text-cyan-400">built with zero hassle.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <PiggyBank size={26} />, title: "High-Yield Vault", value: "5.24% APY", desc: "Grow your savings faster with daily interest accrual, zero lockup periods, and instant withdrawals." },
                            { icon: <CreditCard size={26} />, title: "KeyTrust Debit", value: "Zero Fees", desc: "Virtual and physical debit card with global ATM access, zero foreign exchange fees, and instant spend alerts." },
                            { icon: <Zap size={26} />, title: "Instant Transfers", value: "Under 60s", desc: "Send money to friends, family, or domestic and international accounts in seconds with transparent rates." },
                            { icon: <Clock size={26} />, title: "Early Paycheck", value: "2 Days Early", desc: "Receive your employer direct deposit up to 48 hours earlier thanks to our optimized clearing routes." },
                        ].map((p, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -6 }} 
                                {...fadeIn} 
                                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-8 rounded-2xl group transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                    {p.icon}
                                </div>
                                <div className="text-cyan-400 font-mono text-sm font-semibold mb-1">{p.value}</div>
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">{p.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why KeyTrust Pay */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-4">Why KeyTrust Pay</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                            A seamless, modern <br />
                            <span className="text-cyan-400">financial companion.</span>
                        </h2>
                        <p className="text-slate-300 font-normal mb-8 leading-relaxed">
                            Traditional retail banks rely on overdraft fees, monthly account charges, and hidden conversion markups. KeyTrust Pay is designed transparently: fair rates, real security, and tools that help you save money every day.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { title: "No Minimums or Monthly Fees", desc: "Keep 100% of your earnings. No hidden charges or unexpected penalties." },
                                { title: "FDIC Insured Protection", desc: "Your deposits are held securely with our partner banks and insured up to $250,000." },
                                { title: "Instant Card Controls", desc: "Freeze your card with one tap, generate virtual card numbers, and set spending limits." },
                                { title: "24/7 Human Support", desc: "Friendly customer support team ready to assist you day and night." },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
                                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-white font-semibold text-sm mb-0.5">{item.title}</h4>
                                        <p className="text-slate-400 text-xs">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div {...fadeIn}>
                        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                            <h3 className="text-white font-semibold text-xl mb-6 pb-4 border-b border-slate-800 flex justify-between items-center">
                                <span>KeyTrust Pay vs Traditional Banks</span>
                                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">Comparison</span>
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { feature: "Monthly Maintenance Fee", us: "$0 Free", them: "$12 - $25/mo" },
                                    { feature: "Minimum Balance Requirement", us: "$0.00", them: "$500 - $1,500" },
                                    { feature: "Foreign Transaction Fee", us: "0%", them: "3.0%" },
                                    { feature: "Global ATM Withdrawals", us: "Free in-network", them: "$2.50 - $5.00" },
                                    { feature: "Early Direct Deposit", us: "Up to 2 days early", them: "On payday" },
                                    { feature: "Savings Yield (APY)", us: "5.24% APY", them: "0.01% - 0.05%" },
                                ].map((row, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-4 py-3.5 border-b border-slate-800/80 text-sm items-center">
                                        <span className="text-slate-400 text-xs font-medium">{row.feature}</span>
                                        <span className="text-cyan-400 font-semibold text-center">{row.us}</span>
                                        <span className="text-slate-500 text-right text-xs">{row.them}</span>
                                    </div>
                                ))}
                                <div className="pt-2 grid grid-cols-3 gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <span>Feature</span>
                                    <span className="text-cyan-400 text-center">KeyTrust Pay</span>
                                    <span className="text-right">Legacy Bank</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-[#090D16] border-t border-slate-800 text-center relative">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Ready to experience the future of <span className="text-cyan-400">personal banking?</span>
                    </h2>
                    <p className="text-slate-300 mb-10 text-base max-w-xl mx-auto">
                        Sign up in less than 3 minutes. No credit check required to open an account.
                    </p>
                    <Link 
                        href="/register" 
                        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-10 py-5 rounded-xl shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3 transition-all text-base"
                    >
                        Open Your Account Today <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
