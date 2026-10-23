'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Home, Car, Briefcase, GraduationCap, Calculator, ShieldCheck } from 'lucide-react'
import Footer from '@/components/Footer'

export default function LoansPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }

    const [amount, setAmount] = useState(25000)
    const [term, setTerm] = useState(36)
    const rate = 0.0649 // 6.49%

    // Calculate monthly payment: P * (r*(1+r)^n) / ((1+r)^n - 1)
    const monthlyRate = rate / 12
    const monthlyPayment = (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) / (Math.pow(1 + monthlyRate, term) - 1)
    const totalRepay = monthlyPayment * term
    const totalInterest = totalRepay - amount

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-1/3 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

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
                            <Calculator size={14} />
                            <span>Transparent Lending & Credit</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Capital when <br />
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                you need it most.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed font-normal max-w-xl">
                            Fixed rates starting from 4.9% APR. Same-day funding approval. Zero origination or prepayment fees. Whether you're consolidating debt, renovating your home, or expanding your venture — we're here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/register" 
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Check My Rate
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a 
                                href="#rates" 
                                className="px-8 py-4 rounded-xl font-medium text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2"
                            >
                                View All Rates
                            </a>
                        </div>
                        <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-cyan-400">4.9%</p>
                                <p className="text-slate-400 text-xs mt-1">Starting APR</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">$0</p>
                                <p className="text-slate-400 text-xs mt-1">Origination Fee</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">Same Day</p>
                                <p className="text-slate-400 text-xs mt-1">Direct Funding</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Loan Calculator */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" as const }} 
                        className="hidden lg:block"
                    >
                        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                            <div className="flex justify-between items-center pb-6 border-b border-slate-800 mb-6">
                                <div>
                                    <h3 className="text-white font-semibold text-lg">Loan Payment Estimator</h3>
                                    <p className="text-slate-400 text-xs">Simulate your fixed monthly repayments</p>
                                </div>
                                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                    Fixed 6.49% APR
                                </span>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Borrow Amount</span>
                                        <span className="text-white font-bold font-mono text-base">${amount.toLocaleString()}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={2000} 
                                        max={75000} 
                                        step={1000}
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                                        <span>$2,000</span>
                                        <span>$75,000</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Term Length</span>
                                        <span className="text-white font-bold text-base">{term} Months</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[12, 24, 36, 60].map((t) => (
                                            <button 
                                                key={t}
                                                onClick={() => setTerm(t)}
                                                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                                                    term === t 
                                                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                }`}
                                            >
                                                {t} mo
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                                <p className="text-slate-400 text-xs mb-1">Estimated Monthly Payment</p>
                                <p className="text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">
                                    ${monthlyPayment.toFixed(2)}
                                </p>
                                <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
                                    <span>Total repayment: ${totalRepay.toFixed(2)}</span>
                                    <span className="text-emerald-400 font-medium">Interest: ${totalInterest.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link 
                                    href="/register" 
                                    className="w-full py-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                                >
                                    Apply For This Rate
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Lending Solutions</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                            Credit options built to <span className="text-cyan-400">help you flourish.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Briefcase size={26} />, title: "Personal Loan", range: "$1K – $100K", rate: "From 6.49% APR", desc: "Consolidate high-interest debt, fund life milestones, or cover unexpected costs with simple fixed terms." },
                            { icon: <Home size={26} />, title: "Home Mortgage", range: "$100K – $5M", rate: "From 4.90% APR", desc: "Purchase your dream home or refinance an existing loan with competitive fixed and adjustable interest rates." },
                            { icon: <Car size={26} />, title: "Auto Loan", range: "$5K – $120K", rate: "From 5.90% APR", desc: "New and pre-owned vehicle financing with flexible payback schedules ranging from 24 to 84 months." },
                            { icon: <GraduationCap size={26} />, title: "Student Refinance", range: "$5K – $200K", rate: "From 3.99% APR", desc: "Lower your monthly payments by refinancing private and federal student debt into one manageable bill." },
                        ].map((l, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -6 }} 
                                {...fadeIn} 
                                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-8 rounded-2xl group transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                    {l.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">{l.title}</h3>
                                <div className="flex gap-3 mb-4 text-xs font-mono">
                                    <span className="text-emerald-400 font-semibold">{l.rate}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-400">{l.range}</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{l.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rates Table */}
            <section id="rates" className="py-24 px-4 sm:px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="mb-14 text-center">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Live Lending Index</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                            Transparent. <span className="text-cyan-400">Competitive.</span> Clear.
                        </h2>
                    </motion.div>
                    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-4 px-6 sm:px-8 py-4 bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <span>Loan Category</span>
                            <span className="text-right">Starting APR</span>
                            <span className="text-right">Max APR</span>
                            <span className="text-right">Max Duration</span>
                        </div>
                        {[
                            { type: "Unsecured Personal Loan", min: "6.49%", max: "21.99%", term: "84 months" },
                            { type: "30-Year Fixed Mortgage", min: "4.90%", max: "6.85%", term: "30 years" },
                            { type: "Home Equity Line (HELOC)", min: "5.50%", max: "8.99%", term: "20 years" },
                            { type: "New Vehicle Auto Loan", min: "5.90%", max: "11.50%", term: "84 months" },
                            { type: "Student Loan Refinancing", min: "3.99%", max: "7.99%", term: "25 years" },
                            { type: "Commercial Line of Credit", min: "7.25%", max: "15.00%", term: "60 months" },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-4 px-6 sm:px-8 py-4 border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors items-center text-sm">
                                <span className="text-white font-medium">{row.type}</span>
                                <span className="text-right text-emerald-400 font-mono font-semibold">{row.min}</span>
                                <span className="text-right text-slate-400 font-mono">{row.max}</span>
                                <span className="text-right text-slate-400">{row.term}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-[#090D16] border-t border-slate-800 text-center relative">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Check your loan rate in <span className="text-cyan-400">under 60 seconds.</span>
                    </h2>
                    <p className="text-slate-300 mb-10 text-base max-w-xl mx-auto">
                        Checking your rate requires only a soft credit inquiry and will not affect your credit score.
                    </p>
                    <Link 
                        href="/register" 
                        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-10 py-5 rounded-xl shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3 transition-all text-base"
                    >
                        Apply for Funding Now <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
