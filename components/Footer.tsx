'use client'
import Link from 'next/link'
import { useSettingsStore } from '@/store/useSettingsStore'
import { Shield, Mail, MapPin, Twitter, Linkedin, Instagram, Facebook, Lock, Globe, CheckCircle2 } from 'lucide-react'

export default function Footer() {
    const { settings } = useSettingsStore()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-slate-950 pt-16 md:pt-20 pb-12 border-t border-slate-800/80 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-5">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-[1.5px]">
                                <div className="h-full w-full bg-slate-950 rounded-[6.5px] flex items-center justify-center">
                                    <img src="/favicon.svg" alt="KeyTrust Pay" className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-base font-bold text-white tracking-tight">KeyTrust</span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">
                                    Pay
                                </span>
                            </div>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-normal">
                            Modern, fast, and secure digital banking engineered for frictionless global payments, multi-currency accounts, and automated financial growth.
                        </p>
                        <div className="flex items-center gap-4 text-slate-400">
                            {settings?.socialLinks?.twitter && (
                                <Link href={settings.socialLinks.twitter} className="hover:text-sky-400 transition-colors"><Twitter size={16} /></Link>
                            )}
                            {settings?.socialLinks?.linkedin && (
                                <Link href={settings.socialLinks.linkedin} className="hover:text-sky-400 transition-colors"><Linkedin size={16} /></Link>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <Link href={settings.socialLinks.instagram} className="hover:text-sky-400 transition-colors"><Instagram size={16} /></Link>
                            )}
                            {settings?.socialLinks?.facebook && (
                                <Link href={settings.socialLinks.facebook} className="hover:text-sky-400 transition-colors"><Facebook size={16} /></Link>
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Products & Services</h4>
                        <ul className="space-y-2.5 text-xs text-slate-400">
                            <li><Link href="/personal" className="hover:text-sky-400 transition-colors">Personal Accounts</Link></li>
                            <li><Link href="/business" className="hover:text-sky-400 transition-colors">Business Banking</Link></li>
                            <li><Link href="/cards" className="hover:text-sky-400 transition-colors">Virtual & Physical Cards</Link></li>
                            <li><Link href="/loans" className="hover:text-sky-400 transition-colors">Credit & Working Capital</Link></li>
                            <li><Link href="/transfer" className="hover:text-sky-400 transition-colors">Instant Global Transfers</Link></li>
                        </ul>
                    </div>

                    {/* Support & Company */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Help & Resources</h4>
                        <ul className="space-y-2.5 text-xs text-slate-400">
                            <li><Link href="/support" className="hover:text-sky-400 transition-colors">Help Center & FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-sky-400 transition-colors">Contact Support</Link></li>
                            <li><Link href="/privacy" className="hover:text-sky-400 transition-colors">Security & Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-sky-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Security Badges */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Get in Touch</h4>
                        <div className="space-y-3 text-xs text-slate-400">
                            <div className="flex items-start gap-2.5">
                                <Mail size={15} className="text-sky-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-slate-300 font-medium">{settings?.supportEmail || 'support@keytrustpay.org'}</p>
                                    <p className="text-[11px] text-slate-500">24/7 Priority Desk</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Globe size={15} className="text-sky-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-slate-300 font-medium">Worldwide Coverage</p>
                                    <p className="text-[11px] text-slate-500">180+ Countries Supported</p>
                                </div>
                            </div>
                        </div>

                        {/* Security Pill */}
                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
                                <Lock size={12} />
                                <span className="font-medium">256-Bit Bank-Grade Encryption</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {currentYear} {settings?.companyName || 'KeyTrust Pay'}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms & Disclosures</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
