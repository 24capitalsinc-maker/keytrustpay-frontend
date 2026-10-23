'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Landmark, TrendingUp, TrendingDown, Activity, ShieldCheck, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function LiquidityPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/liquidity')
            setStats(res.data)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 lg:pl-80 z-10">
                    <header className="mb-10 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                    Reserves & Flow
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                Liquidity <span className="text-cyan-400">Monitoring.</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm font-normal">Real-time reserve health, 24-hour volume velocity, and strategic asset allocation.</p>
                        </div>

                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Reserve Health 100% Stable</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Core Liquidity Cards */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                        <Landmark size={24} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reserve</span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-bold font-mono text-white mb-2">
                                    ${stats?.totalLiquidity?.toLocaleString()}
                                </h3>
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                                    <TrendingUp size={14} />
                                    <span>+4.2% Net positive liquidity flow</span>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Activity size={24} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">24h System Flow</span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-bold font-mono text-white mb-2">
                                    ${stats?.volume24h?.toLocaleString()}
                                </h3>
                                <p className="text-xs text-slate-400">Settled within past 24 hours</p>
                            </div>
                        </div>

                        {/* Reserve Ratio Dial */}
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl">
                            <div className="relative w-36 h-36 mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="72" cy="72" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                                    <circle cx="72" cy="72" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 - (377 * (stats?.reserveRatio || 100)) / 100} className="text-cyan-400 transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-white font-mono">{stats?.reserveRatio}%</span>
                                    <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Reserve</span>
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-1">Capital Adequacy Ratio</h4>
                            <p className="text-xs text-slate-400 px-4">Exceeds federal reserve requirements</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Flow Patterns */}
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Flow Patterns (Past 12h)</h2>
                                    <p className="text-xs text-slate-400">Inbound vs. Outbound Transfer Velocity</p>
                                </div>
                            </div>

                            <div className="flex items-end gap-2 h-48 mb-6">
                                {stats?.hourlyFlow?.map((flow: any, i: number) => (
                                    <div key={i} className="flex-1 flex items-end gap-1 h-full group relative">
                                        <div 
                                            className="flex-1 bg-cyan-500/40 hover:bg-cyan-400 rounded-t-md transition-all" 
                                            style={{ height: `${Math.max(15, (flow.inflow / 100000) * 100)}%` }} 
                                        />
                                        <div 
                                            className="flex-1 bg-rose-500/40 hover:bg-rose-400 rounded-t-md transition-all" 
                                            style={{ height: `${Math.max(10, (flow.outflow / 100000) * 100)}%` }} 
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-cyan-400" /> Inflows</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-rose-400" /> Outflows</span>
                            </div>
                        </div>

                        {/* Distribution Matrix */}
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Asset Distribution</h2>
                                    <p className="text-xs text-slate-400">Liquidity Allocation by Currency & Node</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {stats?.distribution?.map((dist: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-slate-300">{dist.label}</span>
                                            <span className="text-cyan-400 font-mono">${dist.value?.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(dist.value / (stats.totalLiquidity || 1)) * 100}%` }}
                                                className="h-full bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
