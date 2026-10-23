'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import api from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Shield, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import SmoothSelect from './SmoothSelect'

const schema = z.object({
    name: z.string().min(2, 'Full name is required').optional(),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phoneNumber: z.string().min(10, 'Valid phone number is required').optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
    address: z.string().min(5, 'Residential address is required').optional(),
    gender: z.string().min(1, 'Please select a gender').optional(),
    occupation: z.string().min(2, 'Occupation is required').optional(),
})

export default function AuthForm({ type }: { type: 'login' | 'register' }) {
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const setAuth = useAuthStore((state) => state.setAuth)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors }, trigger, setValue, watch } = useForm({
        resolver: zodResolver(schema)
    })

    const nextStep = async () => {
        let fields: any[] = []
        if (step === 1) fields = ['name', 'email', 'password']
        if (step === 2) fields = ['phoneNumber', 'dateOfBirth', 'gender']

        const isValid = await trigger(fields)
        if (isValid) setStep(prev => prev + 1)
    }

    const prevStep = () => setStep(prev => prev - 1)

    const onSubmit = async (data: any) => {
        setLoading(true)
        setError('')
        try {
            const endpoint = type === 'login' ? '/auth/login' : '/auth/register'
            const res = await api.post(endpoint, data)
            if (type === 'login') {
                if (res.data.requiresVerification || res.data.requires2FA) {
                    sessionStorage.setItem('verifyUserId', res.data.userId)
                    router.push('/verify-email')
                    return
                }
                setAuth(res.data, res.data.accessToken, res.data.refreshToken)
                router.push(res.data.role === 'admin' ? '/admin' : '/dashboard')
            } else {
                // Registration: store userId so verify page can retrieve it
                sessionStorage.setItem('verifyUserId', res.data.userId)
                router.push('/verify-email')
            }
        } catch (err: any) {
            if (type === 'login' && (err.response?.data?.isUnverified || err.response?.data?.requiresVerification || err.response?.data?.requires2FA)) {
                sessionStorage.setItem('verifyUserId', err.response.data.userId)
                router.push('/verify-email')
                return
            }
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.')
            if (type === 'register') setStep(1)
        } finally {
            setLoading(false)
        }
    }

    const inputClasses = "w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-white placeholder:text-slate-500 text-sm focus:ring-1 focus:ring-sky-500/50"
    const labelClasses = "text-xs font-semibold text-slate-300 block mb-1.5"

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg"
        >
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/50 backdrop-blur-xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                                <Shield size={16} className="text-sky-400" />
                            </div>
                            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                                {type === 'login' ? 'Secure Login' : 'New Account'}
                            </span>
                        </div>
                        {type === 'register' && (
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3].map(i => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                                            step >= i ? 'bg-sky-400' : 'bg-slate-800'
                                        }`} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {type === 'login' 
                            ? 'Welcome back' 
                            : step === 1 
                                ? 'Create your account' 
                                : step === 2 
                                    ? 'Personal details' 
                                    : 'Confirm & complete'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                        {type === 'login'
                            ? 'Enter your email and password to access your dashboard.'
                            : `Step ${step} of 3: ${step === 1 ? 'Start with your email and a strong password.' : step === 2 ? 'Add your contact details.' : 'Review and submit your registration.'}`}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {type === 'login' ? (
                        <div className="space-y-4">
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <input 
                                    {...register('email')} 
                                    type="email" 
                                    className={inputClasses} 
                                    placeholder="alex@example.com" 
                                />
                                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message as string}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className={labelClasses}>Password</label>
                                    <Link href="/forgot-password" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        {...register('password')} 
                                        className={inputClasses} 
                                        placeholder="••••••••••••" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message as string}</p>}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 min-h-[260px]">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div>
                                        <label className={labelClasses}>Full Legal Name</label>
                                        <input {...register('name')} className={inputClasses} placeholder="Alex Morgan" />
                                        {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message as string}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Email Address</label>
                                        <input {...register('email')} type="email" className={inputClasses} placeholder="alex@example.com" />
                                        {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message as string}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Password</label>
                                        <div className="relative">
                                            <input 
                                                {...register('password')} 
                                                type={showPassword ? 'text' : 'password'} 
                                                className={inputClasses} 
                                                placeholder="At least 6 characters" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message as string}</p>}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClasses}>Phone Number</label>
                                            <input {...register('phoneNumber')} className={inputClasses} placeholder="+1 (555) 000-0000" />
                                            {errors.phoneNumber && <p className="text-rose-400 text-xs mt-1">{errors.phoneNumber.message as string}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Date of Birth</label>
                                            <input {...register('dateOfBirth')} type="date" className={inputClasses} />
                                            {errors.dateOfBirth && <p className="text-rose-400 text-xs mt-1">{errors.dateOfBirth.message as string}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <SmoothSelect
                                            label="Gender"
                                            value={watch('gender')}
                                            options={[
                                                { value: 'Male', label: 'Male' },
                                                { value: 'Female', label: 'Female' },
                                                { value: 'Other', label: 'Other / Prefer not to say' },
                                            ]}
                                            onChange={(val) => setValue('gender', val)}
                                            placeholder="Select gender"
                                        />
                                        {errors.gender && <p className="text-rose-400 text-xs mt-1">{errors.gender.message as string}</p>}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div>
                                        <label className={labelClasses}>Residential Address</label>
                                        <input {...register('address')} className={inputClasses} placeholder="123 Financial Way, Suite 400" />
                                        {errors.address && <p className="text-rose-400 text-xs mt-1">{errors.address.message as string}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Occupation / Industry</label>
                                        <input {...register('occupation')} className={inputClasses} placeholder="e.g. Software Engineer, Business Owner" />
                                        {errors.occupation && <p className="text-rose-400 text-xs mt-1">{errors.occupation.message as string}</p>}
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                                        By registering, you agree to KeyTrust Pay's <Link href="/terms" className="text-sky-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-sky-400 hover:underline">Privacy Policy</Link>.
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        {type === 'register' && step > 1 && (
                            <button 
                                type="button" 
                                onClick={prevStep} 
                                className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                        )}

                        <button
                            type={type === 'login' || step === 3 ? 'submit' : 'button'}
                            onClick={type === 'register' && step < 3 ? nextStep : undefined}
                            disabled={loading}
                            className="flex-[2] py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-lg shadow-sky-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>
                                    {type === 'login' ? 'Sign In' : step === 3 ? 'Create Account' : 'Continue'}
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
                    <Link href={type === 'login' ? '/register' : '/login'} className="hover:text-white transition-colors">
                        {type === 'login' ? "Don't have an account yet?" : "Already have an account?"}{' '}
                        <span className="text-sky-400 font-semibold ml-1">
                            {type === 'login' ? 'Open an account' : 'Sign In'}
                        </span>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
