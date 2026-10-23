'use client'
import AuthForm from '@/components/AuthForm'
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginPage() {
    const { user, isInitialized } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (isInitialized && user) {
            router.replace(user.role === 'admin' ? '/admin' : '/dashboard')
        }
    }, [user, isInitialized, router])

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-blue-600/10 via-sky-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-4 pt-28 pb-16 sm:p-6 sm:pt-36 relative z-10">
                <AuthForm type="login" />
            </div>
        </main>
    )
}
