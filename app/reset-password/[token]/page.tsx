'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Navbar from '@/components/Navbar'

const schema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type Phase = 'form' | 'success'

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const [phase, setPhase] = useState<Phase>('form')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/reset-password/${params.token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: data.password }),
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Password reset link is invalid or expired')
            }

            setPhase('success')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col relative overflow-hidden font-sans">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                        <AnimatePresence mode="wait">
                            {phase === 'form' ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                                            <Lock size={22} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Create New Password
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Set a strong, new password for your KeyTrust Pay account.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-300 block">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    {...register('password')}
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoFocus
                                                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3.5 pr-12 outline-none transition-colors text-white text-sm"
                                                    placeholder="At least 8 characters"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)} 
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-300 block">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    {...register('confirmPassword')}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3.5 pr-12 outline-none transition-colors text-white text-sm"
                                                    placeholder="Confirm new password"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message as string}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
                                        >
                                            {loading
                                                ? <><Loader2 className="animate-spin" size={16} /> Updating Password…</>
                                                : <><CheckCircle2 size={16} /> Update Password</>
                                            }
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center flex flex-col items-center gap-6 py-6"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                                        <CheckCircle2 size={32} />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Password Updated</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            Your password has been successfully reset. You can now log into your KeyTrust Pay account.
                                        </p>
                                    </div>

                                    <Link
                                        href="/login"
                                        className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 py-4 rounded-xl text-sm font-semibold text-center transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group"
                                    >
                                        Continue to Login
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs">
                        <Shield size={14} className="text-cyan-400" />
                        <span>Protected by KeyTrust Pay Security</span>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
