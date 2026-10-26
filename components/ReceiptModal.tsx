'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Download, Share2, X, Printer, ShieldCheck, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useRef } from 'react'
import jsPDF from 'jspdf'

interface ReceiptModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: {
        _id?: string
        amount: number
        currency: string
        description?: string
        referenceId: string
        receiverAccountNumber: string
        receiverName?: string
        routingProtocol?: string
        createdAt: string | Date
        status: string
        type: 'debit' | 'credit'
        jurisdiction?: string
        fee?: number
        balanceAfter?: number
    } | null
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null)

    if (!transaction) return null

    const isDebit = transaction.type === 'debit'
    const alertLabel = isDebit ? 'Debit Alert' : 'Credit Alert'
    const currSymbol = transaction.currency === 'USD' ? '$' : transaction.currency === 'EUR' ? '€' : transaction.currency === 'GBP' ? '£' : `${transaction.currency} `
    const fee = transaction.fee || 0
    const totalImpact = isDebit ? transaction.amount + fee : transaction.amount

    const handleShare = async () => {
        const shareData = {
            title: `KeyTrust Pay ${alertLabel}: ${transaction.referenceId}`,
            text: `Transfer of ${currSymbol}${transaction.amount.toLocaleString()} ${isDebit ? 'to' : 'from'} ${transaction.receiverAccountNumber}.`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(
                    `KeyTrust Pay [${alertLabel}]\nReference: ${transaction.referenceId}\nAmount: ${currSymbol}${transaction.amount.toLocaleString()}\nAccount: ${transaction.receiverAccountNumber}\nStatus: ${transaction.status.toUpperCase()}`
                )
                toast.success('Receipt details copied to clipboard')
            }
        } catch (error) {
            // Handled
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        if (!transaction) return
        const loadingToast = toast.loading('Generating official PDF receipt...')

        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = 210
            const margin = 18
            const contentWidth = pageWidth - (margin * 2)

            // Top Header Box (Deep Obsidian #0B1120)
            doc.setFillColor(11, 17, 32)
            doc.rect(0, 0, pageWidth, 48, 'F')

            // Cyan top accent line
            doc.setFillColor(56, 189, 248) // #38BDF8
            doc.rect(0, 0, pageWidth, 3, 'F')

            // Brand Logo & Title
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(22)
            doc.setTextColor(255, 255, 255)
            doc.text('KeyTrust', margin, 18)
            const ktWidth = doc.getTextWidth('KeyTrust')
            doc.setTextColor(56, 189, 248)
            doc.text('PAY', margin + ktWidth + 2, 18)

            // Subtitle
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.setTextColor(148, 163, 184)
            doc.text('INSTITUTIONAL DIGITAL SETTLEMENTS & MULTI-PARTY GOVERNANCE', margin, 24)

            // Official Receipt Label right-aligned
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(10)
            doc.setTextColor(56, 189, 248)
            doc.text('OFFICIAL TRANSACTION RECEIPT', pageWidth - margin, 18, { align: 'right' })

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.setTextColor(148, 163, 184)
            const dateStr = format(new Date(transaction.createdAt || new Date()), 'dd MMM yyyy, hh:mm a')
            doc.text(`ISSUED: ${dateStr.toUpperCase()}`, pageWidth - margin, 24, { align: 'right' })
            doc.text(`REF: ${transaction.referenceId}`, pageWidth - margin, 29, { align: 'right' })

            // Hero Box for Amount & Alert Type
            const heroY = 56
            const badgeBg = isDebit ? [254, 242, 242] : [240, 253, 244]
            const badgeText = isDebit ? [225, 29, 72] : [16, 185, 129]

            // Main Amount Card
            doc.setFillColor(248, 250, 252)
            doc.setDrawColor(226, 232, 240)
            doc.roundedRect(margin, heroY, contentWidth, 42, 3, 3, 'FD')

            // Alert Badge
            doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2])
            doc.setDrawColor(badgeText[0], badgeText[1], badgeText[2])
            doc.roundedRect(margin + 6, heroY + 6, 38, 7, 2, 2, 'FD')
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(7.5)
            doc.setTextColor(badgeText[0], badgeText[1], badgeText[2])
            doc.text(alertLabel.toUpperCase(), margin + 25, heroY + 11, { align: 'center' })

            // Large Amount
            const formattedAmt = `${isDebit ? '-' : '+'}${currSymbol}${Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(24)
            doc.setTextColor(isDebit ? 225 : 16, isDebit ? 29 : 185, isDebit ? 72 : 129)
            doc.text(formattedAmt, margin + 6, heroY + 26)

            // Status Badge
            const isSettled = transaction.status?.toLowerCase() === 'success' || transaction.status?.toLowerCase() === 'settled'
            const statusLabel = isSettled ? 'PAYMENT SETTLED & VERIFIED' : 'PENDING VERIFICATION'
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(8)
            doc.setTextColor(isSettled ? 16 : 217, isSettled ? 185 : 119, isSettled ? 129 : 6)
            doc.text(`STATUS: ${statusLabel}`, margin + 6, heroY + 34)

            // Key Details Table
            const tableY = heroY + 48
            doc.setFillColor(15, 23, 42)
            doc.rect(margin, tableY, contentWidth, 8, 'F')
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(8.5)
            doc.setTextColor(255, 255, 255)
            doc.text('TRANSACTION LEDGER BREAKDOWN', margin + 4, tableY + 5.5)

            // Rows
            const rows: [string, string][] = [
                ['Transaction Reference ID', transaction.referenceId],
                ['Alert Type', alertLabel.toUpperCase()],
                ['Transaction Direction', isDebit ? 'DEBIT (OUTBOUND TRANSFER)' : 'CREDIT (INCOMING SETTLEMENT)'],
                ['Payment Protocol', `${transaction.routingProtocol || 'Domestic'} Network`],
                ['Transfer Amount', `${currSymbol}${Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
                ['Transfer Fee / Charges', `${currSymbol}${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
                ['Total Transaction Impact', `${currSymbol}${totalImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
                ['Recipient / Beneficiary Name', transaction.receiverName || 'Verified Institutional Account'],
                ['Recipient Account Number', transaction.receiverAccountNumber],
                ['Transaction Date & Time', dateStr],
                ['Narration / Description', transaction.description || 'Institutional Payment Settlement'],
            ]

            if (transaction.balanceAfter !== undefined && transaction.balanceAfter !== null) {
                rows.push(['Available Balance Left', `${currSymbol}${Number(transaction.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`])
            }

            let curY = tableY + 8
            const rowHeight = 8.5

            rows.forEach(([label, value], idx) => {
                if (idx % 2 === 0) {
                    doc.setFillColor(248, 250, 252)
                } else {
                    doc.setFillColor(255, 255, 255)
                }
                doc.setDrawColor(226, 232, 240)
                doc.rect(margin, curY, contentWidth, rowHeight, 'FD')

                doc.setFont('helvetica', 'normal')
                doc.setFontSize(8)
                doc.setTextColor(100, 116, 139)
                doc.text(label, margin + 4, curY + 5.5)

                doc.setFont('helvetica', 'bold')
                doc.setFontSize(8.5)
                doc.setTextColor(15, 23, 42)
                doc.text(value, pageWidth - margin - 4, curY + 5.5, { align: 'right' })

                curY += rowHeight
            })

            // Security Watermark and Seal
            curY += 10
            doc.setFillColor(240, 249, 255)
            doc.setDrawColor(186, 230, 253)
            doc.roundedRect(margin, curY, contentWidth, 22, 2, 2, 'FD')

            doc.setFont('helvetica', 'bold')
            doc.setFontSize(8)
            doc.setTextColor(3, 105, 161)
            doc.text('ELECTRONIC BANK-GRADE SECURITY SEAL', margin + 6, curY + 6.5)

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(7.5)
            doc.setTextColor(100, 116, 139)
            doc.text('This receipt was cryptographically generated and certified by KeyTrust Pay core banking protocols.', margin + 6, curY + 12)
            doc.text('Valid without physical endorsement. Inquiries: support@keytrustpay.org • Verified 256-Bit TLS.', margin + 6, curY + 17)

            // Institutional Bottom Line
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(7)
            doc.setTextColor(148, 163, 184)
            doc.text(`© 2026 KeyTrust Pay Inc. • All Rights Reserved • Reference: ${transaction.referenceId}`, pageWidth / 2, 288, { align: 'center' })

            // Save PDF
            const filename = `KeyTrustPay_Receipt_${transaction.referenceId}.pdf`
            doc.save(filename)

            toast.dismiss(loadingToast)
            toast.success('Official PDF receipt downloaded successfully')
        } catch (error: any) {
            console.error('PDF Generation Error:', error)
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
                        <div className={`h-1.5 w-full bg-gradient-to-r ${isDebit ? 'from-rose-600 via-pink-500 to-amber-500' : 'from-emerald-600 via-teal-500 to-cyan-400'}`} />

                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-5 w-5 rounded ${isDebit ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'} flex items-center justify-center`}>
                                            {isDebit ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                        </div>
                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {alertLabel} • Official Receipt
                                        </p>
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                                        <span>KeyTrust</span>
                                        <span className="text-sky-400">PAY</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Amount & Status Hero */}
                            <div className={`p-6 rounded-xl border text-center mb-6 ${isDebit ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                                <div className={`w-10 h-10 rounded-full border flex items-center justify-center mx-auto mb-3 ${isDebit ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                    {isDebit ? <ArrowUpRight size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <p className={`text-3xl font-extrabold tracking-tight tabular-nums ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {isDebit ? '-' : '+'}{currSymbol}{Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${isDebit ? 'text-rose-400/90' : 'text-emerald-400/90'}`}>
                                    {transaction.status === 'pending' ? 'Pending Verification' : 'Payment Settled'}
                                </p>
                            </div>

                            {/* Key Details Grid */}
                            <div className="space-y-3 text-xs pb-6 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Transaction Type</span>
                                    <span className={`font-semibold uppercase ${isDebit ? 'text-rose-400' : 'text-emerald-400'}`}>{alertLabel}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Reference ID</span>
                                    <span className="font-mono font-medium text-sky-400">{transaction.referenceId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Date & Time</span>
                                    <span className="text-white font-medium">
                                        {format(new Date(transaction.createdAt || new Date()), 'MMM dd, yyyy • h:mm a')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Network / Protocol</span>
                                    <span className="text-white font-medium">{transaction.routingProtocol || 'Domestic'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">{isDebit ? 'Recipient Account' : 'Sender Account'}</span>
                                    <span className="text-white font-medium font-mono">{transaction.receiverAccountNumber}</span>
                                </div>
                                {transaction.receiverName && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">{isDebit ? 'Recipient Name' : 'Sender Name'}</span>
                                        <span className="text-white font-medium">{transaction.receiverName}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Transfer Fee</span>
                                    <span className="text-slate-300 font-medium">{currSymbol}{fee.toFixed(2)}</span>
                                </div>
                                {transaction.balanceAfter !== undefined && transaction.balanceAfter !== null && (
                                    <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
                                        <span className="text-sky-400 font-semibold">Available Balance Left</span>
                                        <span className="text-white font-bold text-sm">
                                            {currSymbol}{Number(transaction.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}
                                {transaction.description && (
                                    <div className="flex justify-between items-start pt-1">
                                        <span className="text-slate-400">Note</span>
                                        <span className="text-white text-right max-w-[200px] font-normal italic">
                                            "{transaction.description}"
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex items-center justify-between">
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
                                        onClick={handlePrint}
                                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                                        title="Print Receipt"
                                    >
                                        <Printer size={16} />
                                    </button>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="px-3.5 py-2 rounded-lg font-semibold text-xs text-white bg-sky-500 hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-sm"
                                        title="Download Official PDF"
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
