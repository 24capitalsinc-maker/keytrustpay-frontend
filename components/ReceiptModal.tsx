'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Download, Share2, X, Shield, Globe, Landmark, ShieldCheck, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ReceiptModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: {
        _id: string
        amount: number
        currency: string
        description: string
        referenceId: string
        receiverAccountNumber: string
        receiverName?: string
        routingProtocol: string
        createdAt: string | Date
        status: string
        type: 'debit' | 'credit'
        jurisdiction?: string
    } | null
}

const COLORS = {
    primary: '#0b1120',
    card: '#0f172a',
    cyan: '#38bdf8',
    white: '#ffffff',
    slate: '#94a3b8'
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null)

    if (!transaction) return null

    const isDebit = transaction.type === 'debit'

    const handleShare = async () => {
        const shareData = {
            title: `KeyTrust Pay Receipt: ${transaction.referenceId}`,
            text: `Transfer of ${transaction.currency} ${transaction.amount.toLocaleString()} to ${transaction.receiverAccountNumber}.`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(
                    `KeyTrust Pay Receipt [${transaction.referenceId}]\nAmount: ${transaction.currency} ${transaction.amount.toLocaleString()}\nBeneficiary: ${transaction.receiverAccountNumber}`
                )
                toast.success('Receipt details copied to clipboard')
            }
        } catch (error) {
            // Handled
        }
    }

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return

        const loadingToast = toast.loading('Generating PDF receipt...')

        try {
            const element = receiptRef.current
            const originalScrollbar = element.style.scrollbarWidth;
            element.style.scrollbarWidth = 'none';

            const canvas = await html2canvas(element, {
                backgroundColor: COLORS.primary,
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (doc) => {
                    const el = doc.getElementById('receipt-content');
                    if (el) el.style.overflow = 'visible';
                }
            })

            element.style.scrollbarWidth = originalScrollbar;

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            })

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
            pdf.save(`KeyTrustPay_Receipt_${transaction.referenceId.slice(-8)}.pdf`)

            toast.dismiss(loadingToast)
            toast.success('Receipt downloaded successfully')
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error('Failed to generate PDF document')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        id="receipt-content"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col z-10"
                        ref={receiptRef}
                    >
                        {/* Top Gradient Banner */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400" />

                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 rounded bg-sky-500/10 flex items-center justify-center">
                                            <FileText size={12} className="text-sky-400" />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Official Receipt</p>
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">
                                        KeyTrust Pay
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    data-html2canvas-ignore="true"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Amount & Status Hero */}
                            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center mb-6">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                </div>
                                <p className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                                    {isDebit ? '-' : '+'}{transaction.currency === 'USD' ? '$' : transaction.currency === 'EUR' ? '€' : '£'}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-wider">
                                    {transaction.status === 'pending' ? 'Pending Verification' : 'Payment Settled'}
                                </p>
                            </div>

                            {/* Key Details Grid */}
                            <div className="space-y-3.5 text-xs pb-6 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Reference ID</span>
                                    <span className="font-mono font-medium text-sky-400">{transaction.referenceId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Date & Time</span>
                                    <span className="text-white font-medium">
                                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy • h:mm a')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Network / Protocol</span>
                                    <span className="text-white font-medium">{transaction.routingProtocol}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Recipient Account</span>
                                    <span className="text-white font-medium font-mono">{transaction.receiverAccountNumber}</span>
                                </div>
                                {transaction.receiverName && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Recipient Name</span>
                                        <span className="text-white font-medium">{transaction.receiverName}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start pt-1">
                                    <span className="text-slate-400">Note</span>
                                    <span className="text-white text-right max-w-[200px] font-normal italic">
                                        "{transaction.description || 'Global Payment Transfer'}"
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex items-center justify-between" data-html2canvas-ignore="true">
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                    <ShieldCheck size={14} className="text-sky-400" />
                                    <span>Verified by KeyTrust Pay</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                                        title="Share Details"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="px-3.5 py-2 rounded-lg font-semibold text-xs text-white bg-sky-500 hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-sm"
                                        title="Download PDF"
                                    >
                                        <Download size={14} />
                                        <span>Download PDF</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
