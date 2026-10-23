'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DashboardCard from '@/components/DashboardCard'
import TransactionTable from '@/components/TransactionTable'
import Link from 'next/link';
import { Wallet, CreditCard, ShieldCheck, ArrowRight, Send, ArrowUpRight, ArrowDownLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
    const { user, accessToken, logout } = useAuthStore()
    const [profile, setProfile] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showSensitiveInfo, setShowSensitiveInfo] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
            return
        }

        const fetchProfile = async () => {
            try {
                const [profileRes, transactionsRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/transactions/my')
                ])
                setProfile(profileRes.data)
                setTransactions(transactionsRes.data)
            } catch (err: any) {
                if (err.response) {
                    logout()
                    router.push('/login')
                } else {
                    setError('Could not connect to the server. Please check your internet connection.')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [accessToken, router, logout])

    if (loading) return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sky-400 text-xs font-semibold tracking-wider uppercase">Loading Account...</p>
            </div>
        </main>
    )

    if (error) return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center px-6 max-w-md">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Connection Error</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{error}</p>
                <button
                    onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
                    className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs hover:bg-sky-400 transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        </main>
    )

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden font-sans">
            <Navbar />

            <div className="flex flex-1 pt-16 relative z-10">
                <Sidebar />

                <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:pl-72 z-10">
                    {/* Welcome Banner */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shrink-0">
                                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                                    {profile?.profileImage ? (
                                        <img src={profile.profileImage} className="w-full h-full object-cover" alt={profile.name} />
                                    ) : (
                                        <span className="text-lg font-bold text-sky-400">
                                            {profile?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'KP'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        Hi, {profile?.name?.split(' ')[0]}
                                    </h1>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Verified
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Welcome back to your KeyTrust Pay account.
                                </p>
                            </div>
                        </div>

                        {/* Quick Action Button */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/transfer"
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-md shadow-sky-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Send size={14} />
                                <span>Send Money</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        <DashboardCard
                            title="Total Available Balance"
                            value={`$${profile?.accountBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            icon={Wallet}
                            subtitle="Primary Checking Account"
                            isSensitive={true}
                            isVisible={showSensitiveInfo}
                            onToggle={() => setShowSensitiveInfo(!showSensitiveInfo)}
                        />
                        <DashboardCard
                            title="Account Number"
                            value={profile?.accountNumber}
                            icon={CreditCard}
                            subtitle={`${profile?.accountType || 'Savings'} • ${profile?.currency || 'USD'}`}
                            isSensitive={true}
                            isVisible={showSensitiveInfo}
                            onToggle={() => setShowSensitiveInfo(!showSensitiveInfo)}
                            isCopyable={true}
                        />
                        <DashboardCard
                            title="Account Security"
                            value={profile?.isFrozen ? "ON HOLD" : "PROTECTED"}
                            icon={ShieldCheck}
                            subtitle={profile?.isFrozen ? "Contact Support" : "256-Bit Encryption Active"}
                        />
                    </div>

                    {/* Market Rates & Quick Conversion */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Live Exchange Rates</h3>
                                    <p className="text-xs text-slate-400">Mid-market rate updated in real time</p>
                                </div>
                                <span className="text-[11px] font-semibold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10">
                                    0% Markup
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                                {[
                                    { pair: 'EUR / USD', rate: '1.0842', change: '+0.15%' },
                                    { pair: 'GBP / USD', rate: '1.2654', change: '+0.08%' },
                                    { pair: 'CAD / USD', rate: '0.7350', change: '-0.04%' },
                                    { pair: 'AUD / USD', rate: '0.6580', change: '+0.21%' },
                                ].map((item, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                                        <p className="text-[11px] font-medium text-slate-400">{item.pair}</p>
                                        <p className="text-sm font-bold text-white tabular-nums">{item.rate}</p>
                                        <p className="text-[10px] text-emerald-400 font-semibold">{item.change}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fast Transfer Shortcut */}
                        <div className="rounded-2xl bg-gradient-to-br from-blue-950/50 to-slate-900 border border-sky-500/20 p-6 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Fast Transfer</span>
                                <h4 className="text-base font-bold text-white">Send funds globally in minutes</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Transfer directly to domestic banks, international SWIFT, or offshore accounts at zero hidden charges.
                                </p>
                            </div>
                            <Link
                                href="/transfer"
                                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20"
                            >
                                <span>Start a Transfer</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Transactions Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-bold text-white">Recent Transactions</h3>
                                <p className="text-xs text-slate-400">All outbound and inbound account settlements</p>
                            </div>
                            <Link href="/transactions" className="text-xs font-semibold text-sky-400 hover:underline">
                                View all
                            </Link>
                        </div>

                        <TransactionTable transactions={transactions} itemsPerPage={6} />
                    </div>
                </div>
            </div>
        </main>
    )
}
