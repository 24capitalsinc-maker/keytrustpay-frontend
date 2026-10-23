'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import TransferForm from '@/components/TransferForm'
import { ShieldCheck } from 'lucide-react'

export default function TransferPage() {
    return (
        <main className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden font-sans">
            <Navbar />

            <div className="flex flex-1 pt-16 relative z-10">
                <Sidebar />
                <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:pl-72 z-10">
                    <div className="max-w-3xl mx-auto">
                        <header className="mb-8 border-b border-slate-800 pb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
                                <ShieldCheck size={14} />
                                <span>Encrypted 256-Bit Transfer</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Send Money Worldwide
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Transfer funds instantly to domestic accounts, international banks via SWIFT/IBAN, or multi-currency wallets.
                            </p>
                        </header>

                        <div>
                            <TransferForm />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
