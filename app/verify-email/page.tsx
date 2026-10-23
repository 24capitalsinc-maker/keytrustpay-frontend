'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, Loader2, ArrowLeft, MailCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { getBaseApiUrl } from '@/lib/apiUrl'

export default function VerifyEmailPage() {
    const router = useRouter()
    const { user, setAuth } = useAuthStore()
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [phase, setPhase] = useState<'input' | 'success'>('input')
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (user) router.replace(user.role === 'admin' ? '/admin' : '/dashboard')
    }, [user, router])

    const handleChange = (idx: number, value: string) => {
        // Accept only digits; handle pasting of full code
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('')
            const newCode = [...code]
            digits.forEach((d, i) => {
                if (idx + i < 6) newCode[idx + i] = d
            })
            setCode(newCode)
            const next = Math.min(idx + digits.length, 5)
            inputsRef.current[next]?.focus()
            return
        }
        if (!/^\d?$/.test(value)) return
        const newCode = [...code]
        newCode[idx] = value
        setCode(newCode)
        if (value && idx < 5) inputsRef.current[idx + 1]?.focus()
    }

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus()
        }
    }

    const pinValue = code.join('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (pinValue.length !== 6) {
            setError('Please enter the complete 6-digit verification code.')
            return
        }
        const userId = sessionStorage.getItem('verifyUserId')
        if (!userId) {
            setError('Your verification session has expired. Please sign in or register again.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const apiBase = getBaseApiUrl()
            const res = await fetch(`${apiBase}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, code: pinValue }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Verification failed. Please check your code.')

            sessionStorage.removeItem('verifyUserId')

            setAuth(data, data.accessToken, data.refreshToken)
            setPhase('success')
            setTimeout(() => router.push(data.role === 'admin' ? '/admin' : '/dashboard'), 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        const userId = sessionStorage.getItem('verifyUserId')
        if (!userId) {
            setError('Your verification session has expired. Please sign in or register again.')
            return
        }
        setLoading(true)
        setError('')
        setSuccessMessage('')
        try {
            const apiBase = getBaseApiUrl()
            const res = await fetch(`${apiBase}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to send new code')

            setSuccessMessage('A fresh verification code has been dispatched to your email.')
            setTimeout(() => setSuccessMessage(''), 4000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden font-sans">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-4 pt-28 pb-16 sm:p-6 sm:pt-36 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors mb-6"
                    >
                        <ArrowLeft size={14} />
                        Back to registration
                    </Link>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                        <AnimatePresence mode="wait">
                            {phase === 'input' ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="mb-8 text-center sm:text-left">
                                        <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                                            <MailCheck size={20} className="text-sky-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">
                                            Verify your email
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                            We sent a 6-digit confirmation code to your email. Enter it below to activate your KeyTrust Pay account.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-300 block mb-3 text-center sm:text-left">
                                                6-Digit Code
                                            </label>
                                            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                                                {code.map((digit, i) => (
                                                    <input
                                                        key={i}
                                                        ref={(el) => { inputsRef.current[i] = el }}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={6}
                                                        value={digit}
                                                        onChange={(e) => handleChange(i, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                                        autoFocus={i === 0}
                                                        className="w-full h-12 text-center text-xl font-bold text-sky-400 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl outline-none transition-colors"
                                                    />
                                                ))}
                                            </div>

                                            {error && (
                                                <p className="text-rose-400 text-xs mt-3 text-center sm:text-left font-medium">{error}</p>
                                            )}
                                            {successMessage && (
                                                <p className="text-emerald-400 text-xs mt-3 text-center sm:text-left font-medium">{successMessage}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || pinValue.length !== 6}
                                            className="w-full py-3.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading
                                                ? <><Loader2 className="animate-spin" size={16} /> Verifying...</>
                                                : <>Verify & Continue to Account</>
                                            }
                                        </button>
                                    </form>

                                    <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                                        <p className="text-xs text-slate-400">
                                            Didn't receive the email?{' '}
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                className="text-sky-400 font-semibold hover:underline ml-1"
                                            >
                                                Resend Code
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6 space-y-4"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Email Verified!</h3>
                                    <p className="text-xs text-slate-400">Welcome to KeyTrust Pay. Taking you to your dashboard now...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
