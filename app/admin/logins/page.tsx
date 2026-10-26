'use client'
import { useEffect, useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import {
    KeyRound,
    Search,
    ShieldAlert,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    ShieldX,
    Clock,
    RefreshCw,
    Globe,
    Laptop,
    Trash2,
    Filter,
    UserCheck,
    Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { format, formatDistanceToNow } from 'date-fns'
import Pagination from '@/components/Pagination'

interface LoginAttemptItem {
    _id: string
    email: string
    userName?: string
    ip: string
    userAgent: string
    status: 'SUCCESS' | 'FAILED' | '2FA_PENDING' | 'BLOCKED'
    failureReason?: string
    createdAt: string
}

export default function AdminLoginsPage() {
    const [attempts, setAttempts] = useState<LoginAttemptItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | '2FA_PENDING' | 'BLOCKED'>('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [stats, setStats] = useState({
        totalAll: 0,
        totalSuccess: 0,
        totalFailed: 0,
        total2FA: 0,
        totalBlocked: 0,
    })

    useEffect(() => {
        fetchAttempts()
    }, [statusFilter])

    const fetchAttempts = async () => {
        try {
            setRefreshing(true)
            const queryParams = new URLSearchParams()
            if (statusFilter !== 'ALL') queryParams.append('status', statusFilter)
            queryParams.append('limit', '200') // fetch broad set for client filtering & pagination

            const res = await api.get(`/admin/login-attempts?${queryParams.toString()}`)
            setAttempts(res.data.attempts || [])
            if (res.data.stats) {
                setStats(res.data.stats)
            }
        } catch (err: any) {
            toast.error('Failed to load login attempts')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleClearLogs = async () => {
        if (!confirm('Are you sure you want to purge all login attempt audit logs? This action cannot be undone.')) {
            return
        }

        try {
            await api.delete('/admin/login-attempts')
            toast.success('All login attempt records purged successfully')
            fetchAttempts()
        } catch (err) {
            toast.error('Failed to purge records')
        }
    }

    const filteredAttempts = useMemo(() => {
        return attempts.filter((att) => {
            const matchesSearch =
                att.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (att.userName && att.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                att.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (att.failureReason && att.failureReason.toLowerCase().includes(searchTerm.toLowerCase()))

            const matchesStatus = statusFilter === 'ALL' || att.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [attempts, searchTerm, statusFilter])

    const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage)
    const paginatedAttempts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredAttempts.slice(start, start + itemsPerPage)
    }, [filteredAttempts, currentPage])

    const parseDevice = (ua: string) => {
        if (!ua || ua === 'Unknown') return 'Unknown Browser'
        if (ua.includes('iPhone')) return 'iPhone (Safari Mobile)'
        if (ua.includes('iPad')) return 'iPad (Safari Mobile)'
        if (ua.includes('Android')) return 'Android Device'
        if (ua.includes('Macintosh')) return 'macOS (Safari / Chrome)'
        if (ua.includes('Windows')) return 'Windows PC'
        if (ua.includes('Linux')) return 'Linux Desktop'
        return ua.slice(0, 32)
    }

    return (
        <div className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <AdminSidebar />

                <main className="flex-1 lg:ml-64 p-6 sm:p-10 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                        <KeyRound size={20} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                            <span>Attempted Logins & Access Audit</span>
                                        </h1>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Live audit trail of sign-in requests, 2FA security challenges, and credential telemetry.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-stretch sm:self-auto">
                                <button
                                    onClick={fetchAttempts}
                                    disabled={refreshing}
                                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
                                    title="Refresh telemetry"
                                >
                                    <RefreshCw size={14} className={refreshing ? 'animate-spin text-sky-400' : ''} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>
                                <button
                                    onClick={handleClearLogs}
                                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    <span>Purge Logs</span>
                                </button>
                            </div>
                        </div>

                        {/* Top Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                                <div className="flex justify-between items-center text-slate-400 mb-2">
                                    <span className="text-xs font-medium uppercase tracking-wider">Total Attempts</span>
                                    <Lock size={16} className="text-sky-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                                    {stats.totalAll.toLocaleString()}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1">Recorded audit events</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                                <div className="flex justify-between items-center text-slate-400 mb-2">
                                    <span className="text-xs font-medium uppercase tracking-wider">Authorized</span>
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                                    {stats.totalSuccess.toLocaleString()}
                                </p>
                                <p className="text-[11px] text-emerald-400/70 mt-1">Successful sign-ins</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                                <div className="flex justify-between items-center text-slate-400 mb-2">
                                    <span className="text-xs font-medium uppercase tracking-wider">Failed Attempts</span>
                                    <AlertTriangle size={16} className="text-rose-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 tabular-nums">
                                    {stats.totalFailed.toLocaleString()}
                                </p>
                                <p className="text-[11px] text-rose-400/70 mt-1">Bad passwords / accounts</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                                <div className="flex justify-between items-center text-slate-400 mb-2">
                                    <span className="text-xs font-medium uppercase tracking-wider">2FA Challenges</span>
                                    <ShieldAlert size={16} className="text-amber-400" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
                                    {stats.total2FA.toLocaleString()}
                                </p>
                                <p className="text-[11px] text-amber-400/70 mt-1">6-Hour security PINs</p>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by email, account holder, IP address, or reason..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 outline-none transition-all"
                                />
                            </div>

                            {/* Status Filter Pills */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                                {(
                                    [
                                        { id: 'ALL', label: 'All Telemetry' },
                                        { id: 'SUCCESS', label: 'Authorized' },
                                        { id: 'FAILED', label: 'Failed' },
                                        { id: '2FA_PENDING', label: '2FA Challenged' },
                                        { id: 'BLOCKED', label: 'Blocked' },
                                    ] as const
                                ).map((pill) => (
                                    <button
                                        key={pill.id}
                                        onClick={() => {
                                            setStatusFilter(pill.id)
                                            setCurrentPage(1)
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                            statusFilter === pill.id
                                                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                                                : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Telemetry Table */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-950/70 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
                                        <tr>
                                            <th className="py-3.5 px-4 font-semibold">User Identity</th>
                                            <th className="py-3.5 px-4 font-semibold">Status</th>
                                            <th className="py-3.5 px-4 font-semibold">Audit Event / Reason</th>
                                            <th className="py-3.5 px-4 font-semibold">IP Address</th>
                                            <th className="py-3.5 px-4 font-semibold">Client Telemetry</th>
                                            <th className="py-3.5 px-4 font-semibold text-right">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="py-12 text-center text-slate-500">
                                                    <RefreshCw className="animate-spin mx-auto mb-2 text-rose-400" size={24} />
                                                    <span>Retrieving authentication telemetry...</span>
                                                </td>
                                            </tr>
                                        ) : paginatedAttempts.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-12 text-center text-slate-500">
                                                    <ShieldCheck className="mx-auto mb-2 text-slate-600" size={32} />
                                                    <p className="font-semibold text-slate-400">No login attempts match current filter criteria</p>
                                                    <p className="text-[11px] mt-1 text-slate-600">All authentication requests will appear in this ledger in real-time.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedAttempts.map((att) => {
                                                const isSuccess = att.status === 'SUCCESS'
                                                const isFailed = att.status === 'FAILED'
                                                const is2FA = att.status === '2FA_PENDING'
                                                const isBlocked = att.status === 'BLOCKED'

                                                return (
                                                    <tr key={att._id} className="hover:bg-slate-800/30 transition-colors">
                                                        {/* User Identity */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                                                    isSuccess
                                                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                                                        : isFailed
                                                                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                                                        : is2FA
                                                                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                                                        : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                                                                }`}>
                                                                    {att.email.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-semibold text-white truncate max-w-[200px]">
                                                                        {att.userName || 'Unregistered / Anonymous'}
                                                                    </p>
                                                                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                                                        {att.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Status Badge */}
                                                        <td className="py-3.5 px-4">
                                                            {isSuccess && (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                    <CheckCircle2 size={11} />
                                                                    <span>Authorized</span>
                                                                </span>
                                                            )}
                                                            {isFailed && (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                                    <AlertTriangle size={11} />
                                                                    <span>Failed</span>
                                                                </span>
                                                            )}
                                                            {is2FA && (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                    <ShieldAlert size={11} />
                                                                    <span>2FA Challenged</span>
                                                                </span>
                                                            )}
                                                            {isBlocked && (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                                    <ShieldX size={11} />
                                                                    <span>Blocked</span>
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Reason */}
                                                        <td className="py-3.5 px-4 max-w-[260px]">
                                                            <p className="text-slate-300 font-medium truncate" title={att.failureReason || 'Direct sign-in'}>
                                                                {att.failureReason || 'Direct sign-in authenticated'}
                                                            </p>
                                                        </td>

                                                        {/* IP Address */}
                                                        <td className="py-3.5 px-4 font-mono text-slate-300">
                                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                                                                <Globe size={11} className="text-sky-400" />
                                                                <span>{att.ip}</span>
                                                            </div>
                                                        </td>

                                                        {/* User Agent / Client */}
                                                        <td className="py-3.5 px-4 text-slate-400">
                                                            <div className="flex items-center gap-1.5" title={att.userAgent}>
                                                                <Laptop size={13} className="text-slate-500 shrink-0" />
                                                                <span className="truncate max-w-[170px]">{parseDevice(att.userAgent)}</span>
                                                            </div>
                                                        </td>

                                                        {/* Timestamp */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <p className="text-white font-medium">
                                                                {format(new Date(att.createdAt), 'MMM dd, yyyy • h:mm a')}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">
                                                                {formatDistanceToNow(new Date(att.createdAt), { addSuffix: true })}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="p-4 border-t border-slate-800/80 flex justify-between items-center bg-slate-950/40">
                                    <p className="text-xs text-slate-400">
                                        Showing <span className="font-semibold text-white">{paginatedAttempts.length}</span> of <span className="font-semibold text-white">{filteredAttempts.length}</span> attempts
                                    </p>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
