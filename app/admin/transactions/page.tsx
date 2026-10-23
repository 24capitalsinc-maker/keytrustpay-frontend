'use client'
import { useEffect, useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import SmoothSelect from '@/components/SmoothSelect'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Edit2, Save, X, Calendar, DollarSign, ArrowRightLeft, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Pagination from '@/components/Pagination'

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [editingTx, setEditingTx] = useState<any>(null)
    const [editForm, setEditForm] = useState<any>({})
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/admin/transactions')
            setTransactions(res.data)
        } catch (err) {
            toast.error('Failed to load transaction ledger')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (tx: any) => {
        setEditingTx(tx)
        setEditForm({
            amount: tx.amount,
            status: tx.status,
            createdAt: tx.createdAt?.split('T')[0] + 'T' + tx.createdAt?.split('T')[1]?.substring(0, 5),
            type: tx.type,
            description: tx.description,
            sender: tx.sender?._id || tx.sender || '',
            receiver: tx.receiver?._id || tx.receiver || '',
            receiverAccountNumber: tx.receiverAccountNumber || '',
            currency: tx.currency || 'USD',
            routingProtocol: tx.routingProtocol || 'Domestic',
            swiftCode: tx.swiftCode || '',
            iban: tx.iban || '',
            jurisdiction: tx.jurisdiction || '',
            referenceId: tx.referenceId || '',
            detailLabel: tx.detailLabel || '',
            valueLabel: tx.valueLabel || ''
        })
    }

    const handleUpdate = async () => {
        try {
            const payload = { ...editForm }
            if (!payload.sender || payload.sender === '') delete payload.sender
            if (!payload.receiver || payload.receiver === '') payload.receiver = null

            const res = await api.put(`/admin/transactions/${editingTx._id}`, payload)
            setTransactions(transactions.map(t => t._id === editingTx._id ? { ...t, ...res.data } : t))
            setEditingTx(null)
            toast.success('Transaction record updated successfully')
        } catch (err) {
            toast.error('Failed to update transaction.')
        }
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx =>
            tx.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [transactions, searchTerm])

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

    const currentTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredTransactions.slice(start, start + itemsPerPage)
    }, [filteredTransactions, currentPage])

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
                                    Ledger Audit
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                All <span className="text-cyan-400">Transactions.</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm font-normal">Monitor, audit, and correct platform transaction records.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search sender, receiver, or ref..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
                            />
                        </div>
                    </header>

                    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 text-nowrap">
                                        <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                                        <th className="px-6 py-4">Sender / Recipient</th>
                                        <th className="px-6 py-4 hidden lg:table-cell">Reference</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center hidden md:table-cell">Type</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {currentTransactions.map((tx) => (
                                        <tr key={tx._id} className="hover:bg-slate-800/30 transition-colors text-nowrap">
                                            <td className="px-6 py-5 hidden sm:table-cell">
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[11px] text-slate-500">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium text-xs max-w-[120px] truncate">{tx.sender?.name || 'External Deposit'}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase">From</span>
                                                    </div>
                                                    <ArrowRightLeft size={12} className="text-slate-600 shrink-0" />
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium text-xs max-w-[120px] truncate">{tx.receiver?.name || tx.receiverAccountNumber || 'External Outflow'}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase">To</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 hidden lg:table-cell">
                                                <span className="text-xs font-mono text-slate-400">
                                                    {tx.referenceNumber || tx.referenceId || 'TX-' + tx._id.substring(0, 8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="font-mono font-semibold text-white text-sm">
                                                    ${tx.amount?.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    tx.status === 'success' 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                        : tx.status === 'pending' 
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center hidden md:table-cell">
                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                                                    {tx.routingProtocol || tx.type || 'Domestic'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => handleEdit(tx)}
                                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                                                    title="Edit transaction"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
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

            {/* Edit Modal */}
            <AnimatePresence>
                {editingTx && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingTx(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
                                    <p className="text-xs text-slate-400">Ref: {editingTx.referenceNumber || editingTx._id}</p>
                                </div>
                                <button onClick={() => setEditingTx(null)} className="text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={editForm.amount}
                                        onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Currency</label>
                                    <input
                                        type="text"
                                        value={editForm.currency}
                                        onChange={(e) => setEditForm({ ...editForm, currency: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none uppercase"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Status</label>
                                    <SmoothSelect
                                        label="Status"
                                        value={editForm.status}
                                        options={[
                                            { value: 'success', label: 'Success / Settled' },
                                            { value: 'pending', label: 'Pending Processing' },
                                            { value: 'failed', label: 'Failed / Declined' },
                                        ]}
                                        onChange={(val) => setEditForm({ ...editForm, status: val })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300">Transfer Type</label>
                                    <SmoothSelect
                                        label="Type"
                                        value={editForm.type}
                                        options={[
                                            { value: 'debit', label: 'Debit (Outbound)' },
                                            { value: 'credit', label: 'Credit (Inbound)' },
                                        ]}
                                        onChange={(val) => setEditForm({ ...editForm, type: val })}
                                    />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-300">Description</label>
                                    <input
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
