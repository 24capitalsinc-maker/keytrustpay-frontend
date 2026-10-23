'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { LayoutDashboard, Send, History, Settings, LogOut, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsStore } from '@/store/useSettingsStore'

export const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Send Money', href: '/transfer', icon: Send },
    { name: 'Transaction History', href: '/transactions', icon: History },
    { name: 'Account Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const { user, logout } = useAuthStore()
    const { settings } = useSettingsStore()
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const links = [...dashboardLinks]

    if (!mounted) {
        return (
            <aside className="w-64 bg-slate-950/50 border-r border-slate-800/80 min-h-[calc(100vh-70px)] p-6 hidden lg:block sticky top-20 self-start" />
        )
    }

    return (
        <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 h-[calc(100vh-70px)] overflow-y-auto no-scrollbar p-6 hidden lg:block fixed top-16 left-0 z-30">
            <div className="flex flex-col h-full justify-between">
                <div className="space-y-6">
                    <div className="px-3 py-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account Navigation</p>
                    </div>
                    <ul className="space-y-1.5">
                        {links.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className={`group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative ${
                                            isActive
                                                ? 'text-sky-400 bg-sky-500/10 shadow-sm'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                        }`}
                                    >
                                        <link.icon size={17} className={isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-white transition-colors'} />
                                        <span>{link.name}</span>
                                        {isActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-400 rounded-l" />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}

                        {/* Admin Link if role is admin */}
                        {user?.role === 'admin' && (
                            <li className="pt-1">
                                <Link
                                    href="/admin"
                                    className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-200"
                                >
                                    <ShieldCheck size={17} className="text-cyan-400" />
                                    <span>Admin Console</span>
                                </Link>
                            </li>
                        )}

                        {/* Sign Out */}
                        <li className="pt-2">
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/login');
                                }}
                                className="w-full group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                            >
                                <LogOut size={17} className="group-hover:text-rose-400 transition-colors" />
                                <span>Sign Out</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* User Identity Card */}
                <div className="pt-6 border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shrink-0">
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        className="w-full h-full object-cover"
                                        alt={user.name}
                                    />
                                ) : (
                                    <span className="text-xs text-sky-400 font-bold uppercase">
                                        {user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'KP'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Verified Member'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <p className="text-[10px] text-emerald-400 font-medium">Active & Verified</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
