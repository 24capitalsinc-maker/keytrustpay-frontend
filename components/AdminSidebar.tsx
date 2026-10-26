'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, Landmark, Settings, LogOut, LayoutDashboard, KeyRound } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export const adminLinks = [
    { name: 'Dashboard Overview', href: '/admin', icon: ShieldCheck },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Transactions Ledger', href: '/admin/transactions', icon: Activity },
    { name: 'Attempted Logins', href: '/admin/logins', icon: KeyRound },
    { name: 'Liquidity & Reserves', href: '/admin/liquidity', icon: Landmark },
    { name: 'Platform Settings', href: '/admin/governance', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuthStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const links = [...adminLinks]

    if (!mounted) {
        return (
            <aside className="w-64 bg-slate-950/50 border-r border-slate-800/80 min-h-[calc(100vh-70px)] p-6 hidden lg:block sticky top-20 self-start" />
        )
    }

    return (
        <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 h-[calc(100vh-70px)] p-6 hidden lg:block fixed top-16 left-0 z-30 overflow-y-auto">
            <div className="flex flex-col h-full justify-between">
                <div className="space-y-6">
                    <div className="px-3 py-1">
                        <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">Admin Console</p>
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
                                                ? 'text-rose-400 bg-rose-500/10 shadow-sm'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                        }`}
                                    >
                                        <link.icon size={17} className={isActive ? 'text-rose-400' : 'text-slate-400 group-hover:text-white transition-colors'} />
                                        <span>{link.name}</span>
                                        {isActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-rose-500 rounded-l" />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}

                        {/* Client Dashboard Link */}
                        <li className="pt-1">
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-200"
                            >
                                <LayoutDashboard size={17} className="text-cyan-400" />
                                <span>Client Banking Portal</span>
                            </Link>
                        </li>

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

                {/* Admin Identity Card */}
                <div className="pt-6 border-t border-slate-800/80">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-[1.5px] shrink-0">
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} className="w-full h-full object-cover" alt="Admin" />
                                ) : (
                                    <ShieldCheck size={18} className="text-rose-400" />
                                )}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">{user?.name || "Administrator"}</p>
                            <p className="text-[10px] text-rose-400 font-medium">System Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
