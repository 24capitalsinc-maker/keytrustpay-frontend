'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import api from '@/lib/api'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Globe, Shield, Landmark, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react'
import ReceiptModal from './ReceiptModal'
import SmoothSelect from './SmoothSelect'

const schema = z.object({
    receiverAccountNumber: z.string().regex(/^\d{1,10}$/, 'Account number must be numeric (up to 10 digits)'),
    receiverName: z.string().min(2, 'Recipient full name is required'),
    amount: z.number().min(1, 'Minimum transfer amount is $1'),
    description: z.string().optional().or(z.literal('')),
    currency: z.string(),
    routingProtocol: z.enum(['Domestic', 'Other', 'Offshore']),
    swiftCode: z.string().optional().or(z.literal('')),
    iban: z.string().optional().or(z.literal('')),
    jurisdiction: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.routingProtocol === 'Other') {
        if (!data.swiftCode || data.swiftCode.length < 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A valid SWIFT/BIC code (8-11 characters) is required for other banks',
                path: ['swiftCode'],
            });
        }
    }
});

type TransferFormData = z.infer<typeof schema>;

export default function TransferForm() {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'input' | 'confirm' | 'processing'>('input')
    const [receiptData, setReceiptData] = useState<any>(null)
    const [showReceipt, setShowReceipt] = useState(false)
    const [error, setError] = useState('')
    const [protocol, setProtocol] = useState<'Domestic' | 'Other' | 'Offshore'>('Domestic')

    const { register, handleSubmit, reset, setValue, watch, trigger, formState: { errors } } = useForm<TransferFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            receiverAccountNumber: '',
            receiverName: '',
            amount: 0,
            routingProtocol: 'Domestic',
            currency: 'USD',
            description: '',
            swiftCode: '',
            iban: '',
            jurisdiction: 'Zurich'
        }
    })

    const formData = watch()
    const currentCurrency = watch('currency')

    useEffect(() => {
        setValue('routingProtocol', protocol)
    }, [protocol, setValue])

    const handleInitialSubmit = async () => {
        const isValid = await trigger()
        if (isValid) {
            setStep('confirm')
        }
    }

    const executeTransfer = async () => {
        setLoading(true)
        setError('')
        try {
            const data = formData
            const payload = {
                ...data,
                routingProtocol: data.routingProtocol === 'Other' ? 'International' : data.routingProtocol
            };

            const res = await api.post('/transactions/transfer', payload)

            setStep('processing')

            setTimeout(() => {
                setReceiptData(res.data)
                setShowReceipt(true)
                setStep('input')
                reset()
                setProtocol('Domestic')
                setLoading(false)
            }, 3000)

        } catch (err: any) {
            setError(err.response?.data?.message || 'Transaction could not be completed. Please check the recipient details.')
            setStep('input')
            setLoading(false)
        }
    }

    if (step === 'confirm') {
        return (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 pb-4 border-b border-slate-800">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Step 2 of 2</span>
                    <h3 className="text-2xl font-bold text-white mt-1">Review & Confirm Transfer</h3>
                    <p className="text-xs text-slate-400 mt-1">Please double-check the recipient details before sending.</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-slate-400">Total Sending Amount</p>
                            <p className="text-2xl font-bold text-sky-400 mt-0.5">
                                {currentCurrency} {formData.amount?.toLocaleString()}
                            </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                            {protocol === 'Domestic' ? 'Domestic Transfer' : protocol === 'Other' ? 'External Bank' : 'International Wire'}
                        </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Beneficiary Name</span>
                            <span className="text-white font-medium uppercase">{formData.receiverName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Account Number</span>
                            <span className="font-mono text-white font-medium">{formData.receiverAccountNumber}</span>
                        </div>
                        {formData.swiftCode && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">SWIFT / BIC</span>
                                <span className="font-mono text-white font-medium uppercase">{formData.swiftCode}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Transfer Fee</span>
                            <span className="text-emerald-400 font-semibold">$0.00 (Free)</span>
                        </div>
                        {formData.description && (
                            <div className="flex justify-between items-start pt-1">
                                <span className="text-slate-400">Note</span>
                                <span className="text-white text-right italic font-normal max-w-[200px]">"{formData.description}"</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-300 flex items-start gap-3 mb-8">
                    <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        Funds will be deducted immediately from your balance and processed through our verified settlement network.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={() => setStep('input')}
                        className="py-3 px-6 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                    >
                        Back to Edit
                    </button>
                    <button
                        type="button"
                        onClick={executeTransfer}
                        disabled={loading}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        <span>Authorize & Send Now</span>
                    </button>
                </div>
            </div>
        )
    }

    if (step === 'processing') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[420px]"
            >
                <div className="w-16 h-16 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin flex items-center justify-center" />
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider animate-pulse">Processing Transfer</span>
                    <h3 className="text-2xl font-bold text-white">Sending your funds securely...</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Your transaction is being verified with KeyTrust Pay's secure settlement network. Please do not close this window.
                    </p>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                transaction={receiptData}
            />

            {/* Protocol Selector Tabs */}
            <div className="mb-8">
                <label className="text-xs font-semibold text-slate-300 block mb-3">Select Transfer Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { id: 'Domestic', icon: Landmark, title: 'KeyTrust Account', desc: 'Instant & Free' },
                        { id: 'Other', icon: Globe, title: 'Other Domestic Bank', desc: 'ACH / Wire' },
                        { id: 'Offshore', icon: Shield, title: 'International SWIFT', desc: 'Global Wire' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setProtocol(item.id as any)}
                            className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                                protocol === item.id
                                    ? 'border-sky-500/50 bg-sky-500/10 shadow-sm'
                                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <item.icon size={18} className={protocol === item.id ? 'text-sky-400' : 'text-slate-500'} />
                                <span className="text-[10px] text-slate-400 font-medium">{item.desc}</span>
                            </div>
                            <span className={`text-xs font-bold ${protocol === item.id ? 'text-white' : 'text-slate-300'}`}>
                                {item.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(handleInitialSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">Recipient Full Name</label>
                        <input
                            {...register('receiverName')}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 outline-none transition-colors text-white text-sm placeholder:text-slate-500 uppercase"
                            placeholder="e.g. JANE DOE"
                        />
                        {errors.receiverName && <p className="text-rose-400 text-xs mt-1">{errors.receiverName.message}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">Recipient Account Number</label>
                        <input
                            {...register('receiverAccountNumber')}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 outline-none transition-colors text-white text-sm placeholder:text-slate-500 font-mono"
                            placeholder="e.g. 1049283746"
                        />
                        {errors.receiverAccountNumber && <p className="text-rose-400 text-xs mt-1">{errors.receiverAccountNumber.message}</p>}
                    </div>
                </div>

                {protocol === 'Other' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">SWIFT / BIC Code</label>
                        <input
                            {...register('swiftCode')}
                            className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 outline-none transition-colors text-white text-sm placeholder:text-slate-500 uppercase font-mono"
                            placeholder="CHASUS33XXX"
                        />
                        {errors.swiftCode && <p className="text-rose-400 text-xs mt-1">{errors.swiftCode.message}</p>}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">Amount to Send</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">$</span>
                            <input
                                type="number"
                                min="1"
                                step="any"
                                {...register('amount', { valueAsNumber: true })}
                                className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl pl-8 pr-4 py-3 outline-none transition-colors text-white text-lg font-bold placeholder:text-slate-500"
                                placeholder="0.00"
                            />
                        </div>
                        {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount.message}</p>}
                    </div>

                    <div>
                        <SmoothSelect
                            label="Currency"
                            value={currentCurrency}
                            options={[
                                { value: 'USD', label: 'USD - US Dollar ($)' },
                                { value: 'EUR', label: 'EUR - Euro (€)' },
                                { value: 'GBP', label: 'GBP - British Pound (£)' },
                                { value: 'CAD', label: 'CAD - Canadian Dollar (C$)' },
                                { value: 'AUD', label: 'AUD - Australian Dollar (A$)' },
                            ]}
                            onChange={(val) => setValue('currency', val)}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Description / Payment Reference (Optional)</label>
                    <input
                        {...register('description')}
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 outline-none transition-colors text-white text-sm placeholder:text-slate-500"
                        placeholder="e.g. Freelance invoice, family support"
                    />
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
                        <AlertCircle size={15} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                    >
                        <span>Review Transfer</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </form>
        </div>
    )
}
