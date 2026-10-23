'use client'
import { useEffect, useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { Users, Search, Shield, ShieldOff, UserCheck, UserX, Mail, Hash, AlertCircle, X, Landmark, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Pagination from '@/components/Pagination'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false)
    const [freezeReason, setFreezeReason] = useState('')
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
    const [adjustedBalance, setAdjustedBalance] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users')
            setUsers(res.data)
        } catch (err) {
            toast.error('Failed to load user directory')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleFreeze = async (userId: string, currentStatus: boolean, reason: string = '') => {
        try {
            const newStatus = !currentStatus
            await api.patch('/admin/user-status', {
                userId,
                isFrozen: newStatus,
                reason: newStatus ? reason : ''
            })

            const updatedUsers = users.map(u => u._id === userId ? { ...u, isFrozen: newStatus, freezeReason: newStatus ? reason : '' } : u)
            setUsers(updatedUsers)

            if (selectedUser?._id === userId) {
                setSelectedUser({ ...selectedUser, isFrozen: newStatus, freezeReason: newStatus ? reason : '' })
            }

            if (newStatus) {
                setIsFreezeModalOpen(false)
                setFreezeReason('')
                toast.success('Account suspended successfully.')
            } else {
                toast.success('Account access restored successfully.')
            }
        } catch (err) {
            toast.error('Failed to update account status.')
        }
    }

    const handleUpdateBalance = async () => {
        if (!selectedUser) return
        try {
            const amount = parseFloat(adjustedBalance)
            if (isNaN(amount)) {
                toast.error('Please enter a valid numerical balance.')
                return
            }

            await api.patch('/admin/user-balance', {
                userId: selectedUser._id,
                accountBalance: amount
            })

            const updatedUsers = users.map(u => u._id === selectedUser._id ? { ...u, accountBalance: amount } : u)
            setUsers(updatedUsers)
            setSelectedUser({ ...selectedUser, accountBalance: amount })

            setIsBalanceModalOpen(false)
            setAdjustedBalance('')
            toast.success('Account balance updated successfully.')
        } catch (err) {
            toast.error('Failed to update account balance.')
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.accountNumber?.includes(searchTerm)
        )
    }, [users, searchTerm])

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    const currentUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredUsers.slice(start, start + itemsPerPage)
    }, [filteredUsers, currentPage])

    const handleApproveClosure = async (userId: string) => {
        if (!confirm('Are you sure you want to permanently delete this user account? This action cannot be undone.')) return

        try {
            await api.post('/admin/approve-closure', { userId })
            toast.success('Account has been closed and deleted.')
            setUsers(users.filter(u => u._id !== userId))
            setSelectedUser(null)
        } catch (err) {
            toast.error('Failed to finalize account closure.')
        }
    }

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
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
                                    Client Oversight
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                User <span className="text-cyan-400">Management.</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm font-normal">Manage client balances, account activity statuses, limits, and closure requests.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or account..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                            />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Users Table */}
                        <div className="xl:col-span-2">
                            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 text-nowrap">
                                                <th className="px-6 py-4">Client Details</th>
                                                <th className="px-6 py-4 hidden sm:table-cell">Status</th>
                                                <th className="px-6 py-4 text-right">Balance</th>
                                                <th className="px-6 py-4 text-right hidden md:table-cell">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {currentUsers.map((u) => (
                                                <tr
                                                    key={u._id}
                                                    onClick={() => setSelectedUser(u)}
                                                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer text-nowrap ${
                                                        selectedUser?._id === u._id ? 'bg-cyan-500/10' : ''
                                                    }`}
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-white text-sm">{u.name}</span>
                                                            <span className="text-xs text-slate-400">{u.email}</span>
                                                            <span className="text-[11px] font-mono text-slate-500 mt-0.5">{u.accountNumber}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 hidden sm:table-cell">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                            u.isFrozen
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        }`}>
                                                            {u.isFrozen ? 'Suspended' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right font-mono font-semibold text-white text-sm">
                                                        ${u.accountBalance?.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-5 text-right hidden md:table-cell">
                                                        <span className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                                                            Inspect →
                                                        </span>
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

                        {/* Selected User Details Sidebar */}
                        <div className="xl:col-span-1">
                            <AnimatePresence mode="wait">
                                {selectedUser ? (
                                    <motion.div
                                        key={selectedUser._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl sticky top-24"
                                    >
                                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-800">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{selectedUser.name}</h3>
                                                <p className="text-xs text-slate-400">{selectedUser.occupation || 'Standard Account Holder'}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                selectedUser.isFrozen
                                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {selectedUser.isFrozen ? 'Suspended' : 'Active'}
                                            </span>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center gap-3 text-slate-300 text-xs">
                                                <Mail size={16} className="text-cyan-400 shrink-0" />
                                                <span className="truncate">{selectedUser.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-300 text-xs font-mono">
                                                <Hash size={16} className="text-cyan-400 shrink-0" />
                                                <span>{selectedUser.accountNumber}</span>
                                            </div>
                                        </div>

                                        {/* Balance Card */}
                                        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs text-slate-400">Available Balance</p>
                                                <button
                                                    onClick={() => {
                                                        setAdjustedBalance(selectedUser.accountBalance?.toString() || '0')
                                                        setIsBalanceModalOpen(true)
                                                    }}
                                                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                                                >
                                                    Edit Balance
                                                </button>
                                            </div>
                                            <p className="text-3xl font-bold font-mono text-white">${selectedUser.accountBalance?.toLocaleString()}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => {
                                                    if (selectedUser.isFrozen) {
                                                        handleToggleFreeze(selectedUser._id, true, '')
                                                    } else {
                                                        setIsFreezeModalOpen(true)
                                                    }
                                                }}
                                                className={`w-full py-3.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                                                    selectedUser.isFrozen
                                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                                                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                                                }`}
                                            >
                                                {selectedUser.isFrozen ? <UserCheck size={16} /> : <UserX size={16} />}
                                                {selectedUser.isFrozen ? 'Restore Account Access' : 'Suspend Account'}
                                            </button>

                                            {selectedUser.isFrozen && selectedUser.freezeReason && (
                                                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                                                    <p className="text-red-400 font-semibold mb-1">Suspension Reason:</p>
                                                    <p className="text-slate-300 italic">"{selectedUser.freezeReason}"</p>
                                                </div>
                                            )}

                                            {/* Closure Requested */}
                                            {selectedUser.isClosureRequested && (
                                                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs mt-4">
                                                    <p className="text-red-400 font-bold mb-2 flex items-center gap-1.5">
                                                        <AlertCircle size={14} /> Account Closure Requested
                                                    </p>
                                                    <p className="text-slate-300 mb-3">
                                                        The user has formally requested account closure.
                                                    </p>
                                                    <button
                                                        onClick={() => handleApproveClosure(selectedUser._id)}
                                                        className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all"
                                                    >
                                                        Delete & Close Account
                                                    </button>
                                                </div>
                                            )}

                                            {/* Limits */}
                                            <div className="pt-6 border-t border-slate-800 mt-6">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Transfer Velocity Limits</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1.5">Daily Limit ($)</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={selectedUser.limits?.dailyTransfer || 5000}
                                                            onBlur={async (e) => {
                                                                const val = parseInt(e.target.value)
                                                                try {
                                                                    await api.patch('/admin/user-limits', { userId: selectedUser._id, dailyTransfer: val })
                                                                    toast.success('Daily limit updated')
                                                                    fetchUsers()
                                                                } catch (err) {}
                                                            }}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1.5">Monthly Limit ($)</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={selectedUser.limits?.monthlyTransfer || 50000}
                                                            onBlur={async (e) => {
                                                                const val = parseInt(e.target.value)
                                                                try {
                                                                    await api.patch('/admin/user-limits', { userId: selectedUser._id, monthlyTransfer: val })
                                                                    toast.success('Monthly limit updated')
                                                                    fetchUsers()
                                                                } catch (err) {}
                                                            }}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
                                            <ShieldOff size={24} />
                                        </div>
                                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Select a user to inspect and edit</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUSPEND MODAL */}
            <AnimatePresence>
                {isFreezeModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFreezeModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Suspend User Account</h2>
                                    <p className="text-xs text-slate-400">{selectedUser.name}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                The client will be temporarily prevented from making outbound transfers or withdrawals until access is restored.
                            </p>
                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-semibold text-slate-300 block">Reason for Suspension</label>
                                <textarea
                                    autoFocus
                                    value={freezeReason}
                                    onChange={(e) => setFreezeReason(e.target.value)}
                                    placeholder="e.g., Routine identity verification review..."
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl p-3.5 text-xs text-white outline-none transition-all resize-none min-h-[90px]"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsFreezeModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl text-xs font-semibold border border-slate-800 text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleToggleFreeze(selectedUser._id, false, freezeReason)}
                                    disabled={!freezeReason.trim()}
                                    className="flex-1 py-3 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition-all disabled:opacity-40"
                                >
                                    Confirm Suspension
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* BALANCE ADJUSTMENT MODAL */}
            <AnimatePresence>
                {isBalanceModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBalanceModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <Landmark size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Adjust Account Balance</h2>
                                    <p className="text-xs text-slate-400">{selectedUser.name}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-semibold text-slate-300 block">New Balance ($ USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={adjustedBalance}
                                        onChange={(e) => setAdjustedBalance(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl py-3 pl-8 pr-4 text-white font-mono text-lg outline-none transition-all"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500">Current Balance: ${selectedUser.accountBalance?.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsBalanceModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl text-xs font-semibold border border-slate-800 text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateBalance}
                                    className="flex-1 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all"
                                >
                                    Save New Balance
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
