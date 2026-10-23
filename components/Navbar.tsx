'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, User as UserIcon, Menu, X, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { dashboardLinks } from './Sidebar'
import { adminLinks } from './AdminSidebar'
import { useSettingsStore } from '@/store/useSettingsStore'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const { settings, fetchSettings } = useSettingsStore()
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
        fetchSettings()
        const handleScroll = () => setScrolled(window.scrollY > 15)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchSettings])

    const navLinks = [
        { label: 'Personal', href: '/personal' },
        { label: 'Business', href: '/business' },
        { label: 'Cards', href: '/cards' },
        { label: 'Loans', href: '/loans' },
        { label: 'Contact', href: '/contact' },
        { label: 'Support', href: '/support' },
    ]

    const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/transfer') || pathname.startsWith('/transactions') || pathname.startsWith('/settings')
    const isAdmin = pathname.startsWith('/admin')

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            scrolled 
                ? 'py-3.5 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20' 
                : 'py-5 bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full">
                {/* Left: Brand Identity */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-[1.5px] shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
                            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                                <img
                                    src="/favicon.svg"
                                    alt="KeyTrust Pay"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-white tracking-tight">KeyTrust</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">
                                Pay
                            </span>
                        </div>
                    </Link>

                    {isDashboard && (
                        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800">
                            <span className="text-[11px] font-semibold text-sky-400 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
                                Client Portal
                            </span>
                        </div>
                    )}
                    {isAdmin && (
                        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800">
                            <span className="text-[11px] font-semibold text-rose-400 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                                Admin Console
                            </span>
                        </div>
                    )}
                </div>

                {/* Center: Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {!isDashboard && !isAdmin && navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                                isActive(link.href)
                                    ? 'text-sky-400 bg-sky-500/10'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right: Auth Actions */}
                <div className="hidden sm:flex items-center gap-3">
                    {mounted && user ? (
                        <div className="flex items-center gap-4">
                            <Link 
                                href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all text-xs text-slate-200"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center overflow-hidden text-[10px] font-bold text-white">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                                    ) : (
                                        user.name?.[0] || 'U'
                                    )}
                                </div>
                                <span className="font-medium max-w-[120px] truncate">{user.name?.split(' ')[0]}</span>
                            </Link>
                            <button
                                onClick={logout}
                                title="Sign Out"
                                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link 
                                href="/login" 
                                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 rounded-lg shadow-md shadow-sky-500/20 hover:opacity-95 transition-opacity"
                            >
                                Open Account
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <div className="flex lg:hidden items-center gap-2">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-3">
                            {!isDashboard && !isAdmin ? (
                                <div className="space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                                                isActive(link.href)
                                                    ? 'text-sky-400 bg-sky-500/10'
                                                    : 'text-slate-300 hover:bg-slate-900'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : isDashboard ? (
                                <div className="space-y-1">
                                    <p className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Navigation</p>
                                    {dashboardLinks.map((link) => {
                                        const isLinkActive = pathname === link.href
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                                                    isLinkActive
                                                        ? 'text-sky-400 bg-sky-500/10'
                                                        : 'text-slate-300 hover:bg-slate-900'
                                                }`}
                                            >
                                                <link.icon size={16} className={isLinkActive ? 'text-sky-400' : 'text-slate-400'} />
                                                <span>{link.name}</span>
                                            </Link>
                                        )
                                    })}
                                    {user?.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 mt-2"
                                        >
                                            <ShieldCheck size={16} className="text-rose-400" />
                                            <span>Switch to Admin Console</span>
                                        </Link>
                                    )}
                                </div>
                            ) : isAdmin ? (
                                <div className="space-y-1">
                                    <p className="px-3 py-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider">Admin Navigation</p>
                                    {adminLinks.map((link) => {
                                        const isLinkActive = pathname === link.href
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                                                    isLinkActive
                                                        ? 'text-rose-400 bg-rose-500/10'
                                                        : 'text-slate-300 hover:bg-slate-900'
                                                }`}
                                            >
                                                <link.icon size={16} className={isLinkActive ? 'text-rose-400' : 'text-slate-400'} />
                                                <span>{link.name}</span>
                                            </Link>
                                        )
                                    })}
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 mt-2"
                                    >
                                        <UserIcon size={16} className="text-sky-400" />
                                        <span>Switch to Client Portal</span>
                                    </Link>
                                </div>
                            ) : null}

                            <div className="pt-4 border-t border-slate-800/80 space-y-2">
                                {mounted && user ? (
                                    <>
                                        <Link
                                            href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg border border-slate-800"
                                        >
                                            Go to Dashboard ({user.name})
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-center py-2.5 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-lg border border-rose-500/20"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-center py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 rounded-lg border border-slate-800"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-center py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-sm"
                                        >
                                            Open Account
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
