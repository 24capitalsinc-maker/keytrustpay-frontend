'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownLeft, Search, ChevronLeft, ChevronRight, Eye, FileText } from 'lucide-react'
import ReceiptModal from './ReceiptModal'

interface Transaction {
    _id: string
    type: 'debit' | 'credit'
    amount: number
    currency: string
    description: string
    status: 'success' | 'pending' | 'failed'
    createdAt: string
    referenceId: string
    receiverAccountNumber: string
    routingProtocol: string
    jurisdiction?: string
}

interface TransactionTableProps {
    transactions: Transaction[]
    itemsPerPage?: number
}

export default function TransactionTable({ transactions = [], itemsPerPage = 8 }: TransactionTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
    const [showReceipt, setShowReceipt] = useState(false)

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            (tx.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (tx.referenceId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (tx.receiverAccountNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())

        const matchesFilter = filterType === 'all' || tx.type === filterType

        return matchesSearch && matchesFilter
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

    const handleRowClick = (tx: Transaction) => {
        setSelectedTx(tx)
        setShowReceipt(true)
    }

    return (
        <div className="space-y-4">
            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                transaction={selectedTx}
            />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search transfers, ref, account..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-sky-500 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-stretch sm:self-auto">
                    {[
                        { id: 'all', label: 'All Transfers' },
                        { id: 'debit', label: 'Sent (Out)' },
                        { id: 'credit', label: 'Received (In)' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => { setFilterType(tab.id as any); setCurrentPage(1); }}
                            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                filterType === tab.id
                                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                            <th className="px-5 py-4">Transaction</th>
                            <th className="px-5 py-4 hidden sm:table-cell">Reference</th>
                            <th className="px-5 py-4 hidden md:table-cell">Status</th>
                            <th className="px-5 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        <AnimatePresence mode="popLayout">
                            {paginatedTransactions.map((tx) => {
                                const isDebit = tx.type === 'debit';
                                return (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={tx._id}
                                        onClick={() => handleRowClick(tx)}
                                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                                    >
                                        {/* Main column */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                                    isDebit ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                    {isDebit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs group-hover:text-sky-300 transition-colors">
                                                        {tx.description || (isDebit ? 'Outbound Transfer' : 'Inbound Deposit')}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                        {tx.createdAt ? format(new Date(tx.createdAt), 'MMM dd, yyyy • h:mm a') : 'Recent'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Reference ID */}
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                                                {tx.referenceId}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                tx.status === 'success'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : tx.status === 'pending'
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    tx.status === 'success' ? 'bg-emerald-400' : tx.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'
                                                }`} />
                                                {tx.status === 'success' ? 'Settled' : tx.status === 'pending' ? 'Pending Review' : 'Cancelled'}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-5 py-4 text-right">
                                            <p className={`text-sm font-bold tabular-nums ${
                                                isDebit ? 'text-white' : 'text-emerald-400'
                                            }`}>
                                                {isDebit ? '-' : '+'}{tx.currency === 'USD' ? '$' : tx.currency === 'EUR' ? '€' : '£'}{tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[10px] text-sky-400 group-hover:underline mt-0.5 inline-flex items-center gap-1">
                                                <FileText size={11} /> Receipt
                                            </p>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>

                {filteredTransactions.length === 0 && (
                    <div className="py-16 text-center text-slate-400">
                        <Search size={24} className="mx-auto mb-2 opacity-30 text-slate-500" />
                        <p className="text-xs font-medium">No transactions found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <p>
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transfers
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-white"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800 text-white"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
