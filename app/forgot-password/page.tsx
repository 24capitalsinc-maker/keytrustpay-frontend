'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, Shield, Loader2, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type Phase = 'form' | 'sent'

export default function ForgotPasswordPage() {
    const [phase, setPhase] = useState<Phase>('form')
    const [loading, setLoading] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.replace('/dashboard')
        }
    }, [user, router])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            setSubmittedEmail(data.email)
            setPhase('sent')
        } catch (error) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col relative overflow-x-hidden font-sans">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pt-32 sm:pt-40">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Back to Login */}
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-xs font-semibold uppercase tracking-wider transition-colors mb-6"
                    >
                        <ArrowLeft size={14} />
                        Back to Login
                    </Link>

                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                        <AnimatePresence mode="wait">
                            {/* ===== FORM PHASE ===== */}
                            {phase === 'form' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                                            <Mail size={22} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Reset Password
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Enter the email address registered with your KeyTrust Pay account and we'll send you a password recovery link.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-300 block">
                                                Email Address
                                            </label>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                autoFocus
                                                className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3.5 outline-none transition-colors text-white placeholder:text-slate-600 text-sm"
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                        >
                                            {loading
                                                ? <><Loader2 className="animate-spin" size={16} /> Sending Link…</>
                                                : <><Mail size={16} /> Send Recovery Link</>
                                            }
                                        </button>
                                    </form>

                                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                                        <p className="text-xs text-slate-400">
                                            Remembered your password?{' '}
                                            <Link href="/login" className="text-cyan-400 font-semibold hover:underline ml-1">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ===== SUCCESS PHASE ===== */}
                            {phase === 'sent' && (
                                <motion.div
                                    key="sent"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center flex flex-col items-center gap-6 py-4"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                                        <CheckCircle2 size={32} />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Check your email</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            If an account exists for <span className="text-cyan-400 font-medium">{submittedEmail}</span>, a secure password reset link has been dispatched.
                                        </p>
                                    </div>

                                    <div className="w-full bg-slate-950/60 rounded-2xl border border-slate-800 p-5 text-left space-y-2.5">
                                        <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Next Steps</p>
                                        {[
                                            "Check your inbox (and spam folder) for an email from support@keytrustpay.org",
                                            "Click the secure reset link in the email (valid for 15 minutes)",
                                            "Set your new strong password and sign back in",
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                                                <span>{step}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3 w-full pt-2">
                                        <button
                                            onClick={() => setPhase('form')}
                                            className="w-full border border-slate-800 text-slate-400 hover:text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                                        >
                                            Try Another Email
                                        </button>
                                        <Link
                                            href="/login"
                                            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-center transition-colors"
                                        >
                                            Return to Login
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs">
                        <Shield size={14} className="text-cyan-400" />
                        <span>Protected by 256-bit SSL Encryption</span>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
