'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react'

export default function PrivacyPage() {
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
                                <Shield size={14} />
                                <span>Legal & Compliance</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
                                Privacy <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Policy.</span>
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-2xl">
                                At KeyTrust Pay Inc., we treat your personal and financial information with the utmost respect, transparency, and bank-grade cryptographic protection.
                            </p>
                        </motion.div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <Lock className="text-cyan-400 mb-4" size={26} />
                            <h3 className="text-white font-semibold text-lg mb-2">AES-256 Bit Encryption</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                All account data, transaction payloads, and identity records are encrypted in transit via TLS 1.3 and at rest with AES-256 bit protocols.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                            <Shield className="text-emerald-400 mb-4" size={26} />
                            <h3 className="text-white font-semibold text-lg mb-2">We Never Sell Your Data</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                KeyTrust Pay never monetizes, sells, or rents your personal or financial data to third-party advertisers or data brokers under any circumstances.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12 text-slate-300">
                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">01.</span> Information We Collect
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                When you create an account with KeyTrust Pay, we collect information necessary to fulfill regulatory compliance (KYC/AML) and provide seamless banking services:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                                <li>Legal Name, date of birth, residential address, and contact information.</li>
                                <li>Government-issued identification numbers (e.g., SSN, Passport, or National ID).</li>
                                <li>Transactional details, including timestamps, amounts, recipient names, and account numbers.</li>
                                <li>Device diagnostic telemetry and IP logs to prevent unauthorized account access.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">02.</span> How We Use Your Information
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                We utilize collected information solely to provide, operate, and secure our financial platform:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                                <li>Authorizing and executing domestic ACH, RTP, and international SWIFT transfers.</li>
                                <li>Monitoring for suspicious account activity and active fraud prevention.</li>
                                <li>Sending critical transactional alerts, balance updates, and verification OTPs.</li>
                                <li>Complying with applicable banking laws, state banking authorities, and federal regulations.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-lg">03.</span> Your Privacy Rights & Governance
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Depending on your jurisdiction (including GDPR and CCPA), you have explicit rights regarding your personal information:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                                <li>The right to request a complete copy of all personal data held about you.</li>
                                <li>The right to correct inaccurate or outdated information in your profile.</li>
                                <li>The right to request account closure and data deletion, subject to statutory banking record-retention laws.</li>
                            </ul>
                            <p className="text-slate-400 text-xs mt-4">
                                To exercise any of these rights, please email our compliance desk directly at <span className="text-cyan-400">privacy@keytrustpay.org</span>.
                            </p>
                        </section>
                    </div>

                    <footer className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                        <p>© 2026 KeyTrust Pay Inc. All rights reserved.</p>
                        <p>Last Updated: March 2026</p>
                    </footer>
                </div>
            </div>

            <Footer />
        </main>
    )
}
