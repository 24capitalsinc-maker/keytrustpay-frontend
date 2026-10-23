'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Gavel, Globe, Briefcase, FileCheck, ShieldAlert } from 'lucide-react'

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            <div className="flex-1 pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
                                <Gavel size={14} />
                                <span>Legal Agreement</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
                                Terms of <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Service.</span>
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-2xl">
                                Welcome to KeyTrust Pay Inc. These Terms of Service govern your access to and use of our banking platform, debit card services, and mobile applications.
                            </p>
                        </motion.div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <FileCheck className="text-cyan-400 mb-4" size={26} />
                            <h3 className="text-white font-semibold text-lg mb-2">Banking Partner Integration</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                KeyTrust Pay Inc. is a financial technology company, not an FDIC-insured bank. Banking and depository services are provided by our partner depository institutions, Members FDIC.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <Globe className="text-emerald-400 mb-4" size={26} />
                            <h3 className="text-white font-semibold text-lg mb-2">Global Compliance</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                We operate in strict compliance with the Bank Secrecy Act (BSA), USA PATRIOT Act, OFAC sanctions lists, and international anti-money laundering (AML) standards.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12 text-slate-300">
                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">01.</span> Account Eligibility & KYC
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                To register and maintain an active account with KeyTrust Pay, you must be at least 18 years of age and submit accurate, complete personal identification information. We reserve the right to verify all submitted details against public and private databases.
                            </p>
                        </section>

                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">02.</span> Fund Transfers & Settlements
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Transfer instructions initiated through KeyTrust Pay are processed under standard banking clearing cycles. While internal peer-to-peer transfers settle immediately, external ACH and international SWIFT transfers are subject to partner bank clearing hours and fraud checks.
                            </p>
                        </section>

                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">03.</span> Acceptable Use & Account Security
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Users are strictly prohibited from using KeyTrust Pay services for unlawful activities, including money laundering, terrorist financing, fraud, or prohibited merchant categories. You are responsible for maintaining the confidentiality of your login credentials and two-factor authentication codes.
                            </p>
                        </section>

                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">04.</span> Limitation of Liability
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                To the maximum extent permitted by applicable law, KeyTrust Pay Inc. and its partner banks shall not be liable for indirect, incidental, or consequential damages arising from system maintenance, telecommunication interruptions, or third-party network outages.
                            </p>
                        </section>
                    </div>

                    <footer className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                        <p>© 2026 KeyTrust Pay Inc. All rights reserved.</p>
                        <p>Version 2.4 • Effective March 2026</p>
                    </footer>
                </div>
            </div>

            <Footer />
        </main>
    )
}
