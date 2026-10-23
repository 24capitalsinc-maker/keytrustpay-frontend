'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import DashboardCard from '@/components/DashboardCard'
import { Users, Repeat, Landmark, ShieldCheck } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import Pagination from '@/components/Pagination'

export default function AdminPage() {
    const [metrics, setMetrics] = useState<any>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return users.slice(start, start + itemsPerPage)
    }, [users, currentPage])

    const totalPages = Math.ceil(users.length / itemsPerPage)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [mRes, uRes] = await Promise.all([
                    api.get('/admin/metrics'),
                    api.get('/admin/users')
                ])
                setMetrics(mRes.data)
                setUsers(uRes.data)
            } catch (err) {
                toast.error('Failed to load administrative overview.')
            } finally {
                setLoading(false)
            }
        }
        fetchAdminData()
    }, [])

    if (loading) return (
        <main className="min-h-screen bg-[#090D16] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-cyan-400 text-xs font-semibold tracking-wider uppercase">Loading Admin Portal...</p>
            </div>
        </main>
    )

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 lg:pl-80 z-10">
                    <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
                                    <ShieldCheck size={14} /> Admin Console
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                KeyTrust Pay <span className="text-cyan-400">Administration.</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm font-normal">Real-time system telemetry, client management, and reserve monitoring.</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>System Online & Operational</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <DashboardCard
                            title="Total Users"
                            value={metrics?.totalUsers}
                            icon={Users}
                            subtitle="Registered KeyTrust Pay clients"
                        />
                        <DashboardCard
                            title="Total Transactions"
                            value={metrics?.totalTransactions}
                            icon={Repeat}
                            subtitle="Processed ledger transfers"
                        />
                        <DashboardCard
                            title="Bank Reserves"
                            value={`$${metrics?.totalBankBalance?.toLocaleString()}`}
                            icon={Landmark}
                            subtitle="Aggregated system liquidity"
                        />
                    </div>

                    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white">Registered Users</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Overview of active and monitored accounts</p>
                            </div>
                            <Link 
                                href="/admin/users" 
                                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                View All Users →
                            </Link>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 text-nowrap">
                                        <th className="px-6 py-4">Client Name</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Account Number</th>
                                        <th className="px-6 py-4 text-right">Available Balance</th>
                                        <th className="px-6 py-4 text-center hidden sm:table-cell">Account Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {paginatedUsers.map((u: any) => (
                                        <tr key={u._id} className="hover:bg-slate-800/30 transition-colors text-nowrap">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white text-sm">{u.name}</span>
                                                    <span className="text-xs text-slate-400">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 hidden md:table-cell">
                                                <span className="font-mono text-xs text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700">
                                                    {u.accountNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right font-semibold text-white text-sm font-mono">
                                                ${u.accountBalance?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5 text-center hidden sm:table-cell">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    u.isFrozen
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                    {u.isFrozen ? 'Suspended' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href="/admin/users"
                                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors inline-block"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-slate-800">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
