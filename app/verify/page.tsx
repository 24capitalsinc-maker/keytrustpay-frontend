'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, RefreshCw, ArrowRight, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useSettingsStore } from '@/store/useSettingsStore'

function generateChallenge() {
    const ops = [
        { a: Math.floor(Math.random() * 15) + 1, b: Math.floor(Math.random() * 10) + 1, op: '+', fn: (a: number, b: number) => a + b },
        { a: Math.floor(Math.random() * 15) + 5, b: Math.floor(Math.random() * 5) + 1, op: '-', fn: (a: number, b: number) => a - b },
        { a: Math.floor(Math.random() * 9) + 2, b: Math.floor(Math.random() * 9) + 2, op: '×', fn: (a: number, b: number) => a * b },
    ]
    const chosen = ops[Math.floor(Math.random() * ops.length)]
    return { ...chosen, answer: chosen.fn(chosen.a, chosen.b) }
}

type Phase = 'checkbox' | 'challenge' | 'verified'

export default function VerifyPage() {
    const router = useRouter()
    const { settings } = useSettingsStore()
    const [phase, setPhase] = useState<Phase>('checkbox')
    const [challenge, setChallenge] = useState(generateChallenge)
    const [answer, setAnswer] = useState('')
    const [error, setError] = useState('')
    const [checkboxAnimating, setCheckboxAnimating] = useState(false)
    const [attempts, setAttempts] = useState(0)

    // If already verified in this session, skip straight to register
    useEffect(() => {
        if (settings && settings.isRegistrationEnabled === false) {
            router.replace('/login')
            return
        }

        if (typeof window !== 'undefined' && sessionStorage.getItem('captcha_verified') === 'true') {
            router.replace('/register')
        }
    }, [router, settings])

    const handleCheckboxClick = useCallback(() => {
        if (phase !== 'checkbox' || checkboxAnimating) return
        setCheckboxAnimating(true)
        // Short pause to mimic check animation
        setTimeout(() => {
            setCheckboxAnimating(false)
            setPhase('challenge')
        }, 800)
    }, [phase, checkboxAnimating])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const parsed = parseInt(answer.trim(), 10)
        if (parsed === challenge.answer) {
            setPhase('verified')
            sessionStorage.setItem('captcha_verified', 'true')
            setTimeout(() => router.push('/register'), 1200)
        } else {
            setAttempts(prev => prev + 1)
            setError('Incorrect answer. Please try again.')
            setAnswer('')
            if (attempts >= 1) {
                setChallenge(generateChallenge())
                setAttempts(0)
            }
        }
    }

    const refreshChallenge = () => {
        setChallenge(generateChallenge())
        setAnswer('')
        setError('')
        setAttempts(0)
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
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center mb-4 text-cyan-400">
                            <Shield size={26} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Security Verification</h1>
                        <p className="text-slate-400 text-sm mt-2">Please complete the check below to proceed to registration.</p>
                    </div>

                    {/* CAPTCHA Card */}
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                        {/* Brand strip */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Lock size={14} className="text-cyan-400" />
                                <span className="text-xs text-cyan-400 font-semibold tracking-wide">KeyTrust Pay SecureCheck™</span>
                            </div>
                            <span className="text-slate-500 text-xs">v4.0</span>
                        </div>

                        {/* Phase: Checkbox */}
                        <AnimatePresence mode="wait">
                            {phase === 'checkbox' && (
                                <motion.div key="checkbox"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-4 py-3"
                                >
                                    <button
                                        onClick={handleCheckboxClick}
                                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                                            checkboxAnimating 
                                                ? 'border-cyan-400 bg-cyan-400/10' 
                                                : 'border-slate-600 hover:border-cyan-400 bg-slate-950'
                                        }`}
                                        aria-label="Verify you are not a robot"
                                    >
                                        {checkboxAnimating && (
                                            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </button>
                                    <span className="text-slate-200 text-sm font-medium">I am human and ready to proceed</span>
                                </motion.div>
                            )}

                            {/* Phase: Math challenge */}
                            {phase === 'challenge' && (
                                <motion.div key="challenge"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="mb-4">
                                        <p className="text-xs text-slate-400 mb-2">Solve this quick calculation:</p>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                                            <span className="text-xl font-bold font-mono tracking-wider text-cyan-400">
                                                {challenge.a} {challenge.op} {challenge.b} = ?
                                            </span>
                                            <button
                                                type="button"
                                                onClick={refreshChallenge}
                                                className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                                                title="New challenge"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <input
                                                type="number"
                                                value={answer}
                                                onChange={e => { setAnswer(e.target.value); setError('') }}
                                                placeholder="Your answer"
                                                autoFocus
                                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-white text-base font-mono outline-none transition-colors"
                                            />
                                            {error && (
                                                <p className="text-red-400 text-xs mt-1.5">{error}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!answer.trim()}
                                            className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-cyan-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                                        >
                                            Verify & Continue <ArrowRight size={16} />
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Phase: Verified */}
                            {phase === 'verified' && (
                                <motion.div key="verified"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6 space-y-2"
                                >
                                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-3">
                                        <CheckCircle2 size={30} />
                                    </div>
                                    <p className="text-emerald-400 font-bold text-base">Verification Complete!</p>
                                    <p className="text-slate-400 text-xs">Redirecting to registration…</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer brand */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Shield size={12} className="text-cyan-400" />
                                <span>Protected by KeyTrust Pay</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                                <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-6 text-slate-400 text-xs">
                        Already have an account?{' '}
                        <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </main>
    )
}
