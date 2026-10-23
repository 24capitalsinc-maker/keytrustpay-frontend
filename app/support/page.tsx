'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Mail, Shield, ChevronDown, ArrowRight, Clock, Globe, Headphones, CheckCircle2, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import Footer from '@/components/Footer'

export default function SupportPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const faqs = [
        { 
            q: "How quickly can I open a KeyTrust Pay account?", 
            a: "Opening an account takes less than 3 minutes. Simply fill out our secure online registration form, verify your identity with a valid government-issued ID, and your account will be activated immediately." 
        },
        { 
            q: "Is my money safe and insured with KeyTrust Pay?", 
            a: "Yes. KeyTrust Pay partners with top-tier depository institutions where customer deposits are FDIC insured up to $250,000 per eligible depositor. All account data is safeguarded by bank-grade AES-256 bit encryption." 
        },
        { 
            q: "How fast do domestic and international transfers clear?", 
            a: "Internal KeyTrust Pay peer transfers settle instantly (under 60 seconds). Domestic ACH transfers typically settle same-day or next business day, while international SWIFT wires clear within 1 to 4 business hours." 
        },
        { 
            q: "What fees apply for currency conversion and foreign purchases?", 
            a: "KeyTrust Pay uses real-time mid-market foreign exchange rates with transparent low-cost conversion fees (0.5% or less). Signature and Reserve cardholders enjoy zero foreign transaction fees worldwide." 
        },
        { 
            q: "What should I do if my card is lost or stolen?", 
            a: "You can instantly freeze your card with a single tap in your dashboard or mobile app to prevent any unauthorized charges. Then contact our 24/7 support line to receive an expedited replacement card." 
        },
        { 
            q: "Can I manage personal and business accounts under one login?", 
            a: "Yes! KeyTrust Pay allows you to link multiple personal and commercial profiles under a single secure login, making it easy to toggle between checking, business treasury, and investment vaults." 
        },
        { 
            q: "How can I request higher daily or monthly transfer limits?", 
            a: "To upgrade your transaction velocity, you can submit an limit increase request through your dashboard or reach out directly to your assigned account concierge." 
        },
        { 
            q: "How do I dispute an unrecognized transaction?", 
            a: "Navigate to your Transactions ledger, click on the transaction in question, and select 'Report an Issue'. Our fraud protection team will immediately review the charge and respond within 24 hours." 
        },
    ]

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-12 text-center">
                <div className="max-w-4xl w-full mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 25 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, ease: "easeOut" as const }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
                            <Headphones size={14} />
                            <span>24/7 Global Client Support</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                            How can we <br />
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                help you today?
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto font-normal">
                            Our dedicated client care specialists and technical advisors are online 24 hours a day, 7 days a week to support your banking needs.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link 
                                href="/login" 
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} />
                                Start Live Chat
                            </Link>
                            <a 
                                href="tel:+15552400000" 
                                className="px-8 py-4 rounded-xl font-medium text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2"
                            >
                                <Phone size={18} className="text-cyan-400" />
                                +1 (555) 240-0000
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Channels */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Direct Channels</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                            Get in touch <span className="text-cyan-400">your way.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageCircle size={28} />, title: "Live In-App Chat", badge: "Instant",
                                desc: "Connect directly with our support specialists from your dashboard. Real human assistance in under 2 minutes.",
                                meta: "Available 24/7 • End-to-end encrypted",
                                action: "Open Live Chat", href: "/login"
                            },
                            {
                                icon: <Phone size={28} />, title: "Phone Support", badge: "24/7 Line",
                                desc: "Speak directly with a specialist for urgent account locks, card freezes, or high-value transfer verifications.",
                                meta: "+1 (555) 240-0000 • Toll-Free",
                                action: "Call Now", href: "tel:+15552400000"
                            },
                            {
                                icon: <Mail size={28} />, title: "Email Support", badge: "Detailed",
                                desc: "Send account documentation, formal inquiries, or compliance queries to our dedicated support desk.",
                                meta: "support@keytrustpay.org • Reply in < 2 hrs",
                                action: "Send an Email", href: "/contact"
                            },
                        ].map((c, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -6 }} 
                                {...fadeIn} 
                                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-8 rounded-2xl flex flex-col justify-between group transition-all duration-300"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                            {c.icon}
                                        </div>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                            {c.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">{c.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{c.desc}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-4">{c.meta}</p>
                                    <a 
                                        href={c.href} 
                                        className="text-cyan-400 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        {c.action} <ArrowRight size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 px-4 sm:px-6 lg:px-12 relative">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-3">Help Center</p>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                            Frequently Asked <span className="text-cyan-400">Questions.</span>
                        </h2>
                    </motion.div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                {...fadeIn}
                                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-colors"
                            >
                                <button
                                    className="w-full flex justify-between items-center px-6 py-5 text-left gap-4"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="text-white font-medium text-base">{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-cyan-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/80 pt-4">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-[#090D16] border-t border-slate-800 text-center relative">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                        Still have <span className="text-cyan-400">questions?</span>
                    </h2>
                    <p className="text-slate-300 mb-10 text-base max-w-xl mx-auto">
                        Our support advisors are ready to assist you right now.
                    </p>
                    <Link 
                        href="/contact" 
                        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-10 py-5 rounded-xl shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3 transition-all text-base"
                    >
                        Contact Our Team <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
