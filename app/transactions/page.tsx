'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import TransactionTable from '@/components/TransactionTable'
import api from '@/lib/api'
import { ArrowLeftRight, Download, RefreshCw } from 'lucide-react'

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await api.get('/transactions/my')
            setTransactions(res.data)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col relative overflow-x-hidden font-sans">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            <div className="flex flex-1 pt-16 relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:pl-72 z-10 overflow-hidden">
                    <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                    <ArrowLeftRight size={13} />
                                    <span>Real-Time Settlements</span>
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Transaction <span className="text-cyan-400">History.</span>
                            </h1>
                            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
                                Full ledger of your inbound credits, domestic wires, and international transfers.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchTransactions}
                                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
                                title="Refresh transactions"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </header>

                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Syncing Ledger...</p>
                            </div>
                        ) : (
                            <TransactionTable transactions={transactions} itemsPerPage={10} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
