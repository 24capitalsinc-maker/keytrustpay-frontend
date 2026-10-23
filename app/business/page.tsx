'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Briefcase, Globe2, BarChart3, ShieldCheck, ArrowRight, CheckCircle2, Users, Layers, Zap, CreditCard, Building2 } from 'lucide-react'
import Footer from '@/components/Footer'

export default function BusinessPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[450px] bg-gradient-to-b from-sky-600/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

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
                            <Building2 size={14} />
                            <span>Business & Commercial Banking</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Banking built for the <br />
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                modern enterprise.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed font-normal max-w-xl">
                            Empower your business with multi-currency accounts, automated contractor and employee payroll, unlimited corporate cards, and real-time ERP accounting synchronization.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/register" 
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Open Business Account
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                href="/contact" 
                                className="px-8 py-4 rounded-xl font-medium text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </motion.div>

                    {/* Live Corporate Overview Mock */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" as const }} 
                        className="hidden lg:block"
                    >
                        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                            <div className="flex justify-between items-center pb-6 border-b border-slate-800 mb-6">
                                <div>
                                    <h3 className="text-white font-semibold text-base">KeyTrust Enterprise Portal</h3>
                                    <p className="text-slate-400 text-xs">Acme Global Technologies Inc.</p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 40 Currencies Ready
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {[
                                    { label: "Operating Treasury (USD)", value: "$3,450,000.00", highlight: false },
                                    { label: "Euro Treasury Vault (EUR)", value: "€1,280,450.00", highlight: false },
                                    { label: "Corporate Yield Growth (APY)", value: "+ 5.24% Compounding", highlight: true },
                                    { label: "Active Team Cards", value: "32 Issued & Active", highlight: false },
                                    { label: "Pending Vendor Wires", value: "4 Wires Processing", highlight: false },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-2.5 px-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                                        <span className="text-slate-400 text-xs font-medium">{row.label}</span>
                                        <span className={`font-mono text-sm font-semibold ${row.highlight ? 'text-emerald-400' : 'text-slate-100'}`}>
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link 
                                    href="/register" 
                                    className="w-full py-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                                >
                                    Explore Enterprise Demo
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Infrastructure */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Enterprise Capabilities</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                            Built for complexity. <span className="text-cyan-400">Designed for scale.</span>
                        </h2>
                        <p className="text-slate-400 text-base max-w-2xl mx-auto">
                            Whether you're a fast-moving seed startup or a multinational enterprise, KeyTrust Pay powers your financial operations effortlessly.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Globe2 size={24} />, title: "Global Treasury", desc: "Hold, convert, and pay out in 40+ currencies at real mid-market foreign exchange rates with zero hidden spreads." },
                            { icon: <BarChart3 size={24} />, title: "ERP & Accounting Sync", desc: "Automate bookkeeping with native two-way sync for QuickBooks, Xero, NetSuite, and custom accounting webhooks." },
                            { icon: <ShieldCheck size={24} />, title: "Custom Approval Flows", desc: "Define multi-level authorization rules for wire transfers, bill payments, and high-value transactions." },
                            { icon: <Users size={24} />, title: "Automated Global Payroll", desc: "Pay domestic staff and international remote contractors across 140+ countries on scheduled payment dates." },
                            { icon: <Layers size={24} />, title: "Multi-Entity Accounts", desc: "Manage parent companies, sister entities, and regional subsidiaries from a single master dashboard." },
                            { icon: <Zap size={24} />, title: "Fast Settlement Rails", desc: "Lightning-fast domestic ACH and instant RTP routing, plus fast SWIFT wires delivered with transparent tracking." },
                        ].map((f, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -6 }} 
                                className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparent Pricing */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Transparent Plans</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                            Clear pricing that <span className="text-cyan-400">scales with your growth.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                tier: "Starter", price: "$0", period: "/ month", desc: "Ideal for early-stage companies, solo founders, and freelancers.",
                                features: ["1 Primary Business Account", "50 free monthly transfers", "Up to 3 team member seats", "Standard FX conversion rates", "24/7 in-app support"],
                                cta: "Start Free", highlight: false
                            },
                            {
                                tier: "Growth", price: "$49", period: "/ month", desc: "For scaling teams with growing payment volume and multiple users.",
                                features: ["5 Multi-Currency Accounts", "500 free monthly transfers", "15 team seats with permission tiers", "Discounted FX rates", "ERP & Accounting sync", "Priority concierge support"],
                                cta: "Get Started", highlight: true
                            },
                            {
                                tier: "Enterprise", price: "Custom", period: "tailored", desc: "For established corporations with custom compliance & treasury needs.",
                                features: ["Unlimited entity accounts", "Unlimited monthly transactions", "Unlimited team seats & role controls", "Institutional FX spreads", "Dedicated Account Manager", "Full custom REST API access"],
                                cta: "Contact Sales", highlight: false
                            },
                        ].map((plan, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeIn} 
                                className={`rounded-3xl p-8 sm:p-10 flex flex-col relative transition-all duration-300 ${
                                    plan.highlight 
                                        ? 'bg-slate-900 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-500/10' 
                                        : 'bg-slate-900/60 border border-slate-800'
                                }`}
                            >
                                {plan.highlight && (
                                    <div className="text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 font-bold uppercase tracking-wider px-3.5 py-1 rounded-full w-fit mb-6">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.tier}</h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                                    <span className="text-slate-400 text-sm ml-2">{plan.period}</span>
                                </div>
                                <p className="text-slate-400 text-sm mb-8">{plan.desc}</p>
                                <ul className="space-y-3.5 mb-10 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link 
                                    href={plan.tier === 'Enterprise' ? '/contact' : '/register'} 
                                    className={`w-full py-4 rounded-xl text-center text-sm font-semibold transition-all ${
                                        plan.highlight 
                                            ? 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/20' 
                                            : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Corporate Cards */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 bg-slate-900/40 border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-4">Expense Management</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Total corporate <br />
                            <span className="text-cyan-400">spend control.</span>
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Issue unlimited virtual corporate cards in seconds for online subscriptions and ad spend",
                                "Set dynamic spend caps by employee, department, project, or vendor",
                                "Automated receipt capture with SMS and mobile notifications after every swipe",
                                "1.5% unlimited cash back automatically credited to your principal balance",
                                "Instant one-tap freeze and real-time fraud monitoring",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3.5 text-slate-300 text-sm font-normal">
                                    <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <Link href="/register" className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm hover:gap-3 transition-all">
                                Get Corporate Cards for Your Team <ArrowRight size={16} />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div {...fadeIn} className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Department Spend (Current Month)</span>
                            <span className="text-cyan-400 font-mono text-sm font-bold">$54,280.00 total</span>
                        </div>
                        <div className="space-y-5">
                            {[
                                { dept: "Engineering & Cloud", amount: "$22,400", pct: 41, color: "bg-cyan-400" },
                                { dept: "Marketing & Growth", amount: "$14,600", pct: 27, color: "bg-sky-400" },
                                { dept: "Operations & Logistics", amount: "$10,200", pct: 19, color: "bg-emerald-400" },
                                { dept: "Office & HR", amount: "$7,080", pct: 13, color: "bg-indigo-400" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300 font-medium">{item.dept}</span>
                                        <span className="text-slate-100 font-mono font-semibold">{item.amount}</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-[#090D16] text-center relative">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Ready to elevate your <span className="text-cyan-400">business finances?</span>
                    </h2>
                    <p className="text-slate-300 mb-10 text-base max-w-xl mx-auto">
                        Join forward-thinking companies running their global treasury and payments on KeyTrust Pay.
                    </p>
                    <Link 
                        href="/register" 
                        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-10 py-5 rounded-xl shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3 transition-all text-base"
                    >
                        Get Started in Minutes <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
