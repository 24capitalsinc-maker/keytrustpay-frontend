'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/api'
import {
    User, Shield, Bell, Settings as SettingsIcon,
    Lock, ChevronRight, Check, Loader2, AlertTriangle,
    Globe, Clock, CreditCard, Camera, Edit2
} from 'lucide-react'
import SmoothSelect from '@/components/SmoothSelect'
import { toast } from 'sonner'

type Section = 'Identity' | 'Security' | 'Notifications' | 'Global' | 'Management';

export default function SettingsPage() {
    const { user, setUser } = useAuthStore()
    const [mounted, setMounted] = useState(false)
    const [activeSection, setActiveSection] = useState<Section>('Identity')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState<any>({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const MAX_WIDTH = 400
                    const MAX_HEIGHT = 400
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75)
                    setFormData((prev: any) => ({ ...prev, profileImage: compressedBase64 }))
                }
                img.src = reader.result as string
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        setMounted(true)
        if (user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                occupation: user.occupation || '',
                twoFactorEnabled: user.twoFactorEnabled || false,
                notifications: user.notifications || { email: true, sms: false, push: true },
                preferences: user.preferences || { language: 'English', timezone: 'UTC', defaultCurrency: 'USD' },
                limits: user.limits || { dailyTransfer: 50000, monthlyTransfer: 500000 },
                profileImage: user.profileImage || ''
            })
        }
    }, [user])

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)
        try {
            const res = await api.put('/users/profile', formData)
            setUser(res.data)
            setSuccess(true)
            toast.success('Profile settings updated successfully!')
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update profile settings.')
        } finally {
            setLoading(false)
        }
    }

    const handleRequestClosure = async () => {
        if (!confirm('Are you sure you want to request account closure? Our compliance desk will review your request.')) return

        setLoading(true)
        try {
            await api.post('/users/request-closure', { reason: 'User initiated from settings' })
            setUser({ ...user, isClosureRequested: true })
            toast.success('Account closure request submitted.')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to submit closure request.')
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    const sections: { id: Section; label: string; icon: any }[] = [
        { id: 'Identity', label: 'Personal Profile', icon: User },
        { id: 'Security', label: 'Security & Access', icon: Shield },
        { id: 'Notifications', label: 'Alert Preferences', icon: Bell },
        { id: 'Global', label: 'Regional & Currency', icon: SettingsIcon },
        { id: 'Management', label: 'Account Limits', icon: Lock },
    ]

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col relative font-sans">
            {/* Ambient gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            <div className="flex flex-col lg:flex-row flex-1 pt-16 relative z-10">
                <Sidebar />

                <div className="flex-1 flex flex-col min-h-0 lg:pl-72">
                    {/* Settings Tab Navigation */}
                    <div className="w-full border-b border-slate-800/80 bg-slate-950/40">
                        <div className="px-6 md:px-12 pt-8 pb-4">
                            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-4">Account Settings</p>
                            <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                                {sections.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSection(s.id)}
                                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-semibold ${
                                            activeSection === s.id 
                                                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                                                : 'text-slate-400 hover:text-white hover:bg-slate-850'
                                        }`}
                                    >
                                        <s.icon size={15} className={activeSection === s.id ? 'text-cyan-400' : 'text-slate-500'} />
                                        <span>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-12">
                        <header className="mb-10 border-b border-slate-800/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    {sections.find(s => s.id === activeSection)?.label}
                                </h1>
                                <p className="text-xs text-slate-400 mt-1">Manage and update your preferences</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : success ? <Check size={16} /> : 'Save Changes'}
                            </button>
                        </header>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* PERSONAL PROFILE */}
                                {activeSection === 'Identity' && (
                                    <div className="space-y-8 max-w-4xl">
                                        {/* Avatar Section */}
                                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col sm:flex-row items-center gap-6">
                                            <div className="relative group shrink-0">
                                                <div className="w-24 h-24 rounded-2xl bg-slate-950 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
                                                    {formData.profileImage ? (
                                                        <img src={formData.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                                    ) : (
                                                        <span className="text-3xl text-cyan-400 font-bold">{user?.name?.[0] || 'K'}</span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-cyan-400 gap-1 cursor-pointer"
                                                >
                                                    <Camera size={20} />
                                                    <span className="text-[10px] font-semibold uppercase">Change</span>
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white mb-1">Profile Photo</h3>
                                                <p className="text-xs text-slate-400 mb-3">
                                                    Your avatar is displayed in your client portal and internal receipts.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="text-xs text-cyan-400 font-semibold hover:underline inline-flex items-center gap-1.5"
                                                >
                                                    <Edit2 size={12} /> Upload New Photo
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inputs */}
                                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-300">Full Name</label>
                                                    <input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-300">Occupation</label>
                                                    <input
                                                        value={formData.occupation}
                                                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                                        placeholder="e.g. Software Engineer / Consultant"
                                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-300">Registered Email</label>
                                                    <input
                                                        disabled
                                                        value={user?.email || ''}
                                                        className="w-full bg-slate-950/50 border border-slate-800/60 rounded-xl px-4 py-2.5 text-slate-400 text-sm outline-none cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                                                    <input
                                                        value={formData.phoneNumber}
                                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder:text-slate-600"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-300">Residential Address</label>
                                                    <textarea
                                                        rows={3}
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        placeholder="Street, City, State, Postal Code, Country"
                                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl p-3.5 text-white text-sm outline-none transition-colors resize-none placeholder:text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SECURITY & ACCESS */}
                                {activeSection === 'Security' && (
                                    <div className="space-y-6 max-w-4xl">
                                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 flex items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-base font-bold text-white mb-1">Two-Factor Authentication (2FA)</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                                                    Require an additional authentication step on unrecognized logins to protect your account.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, twoFactorEnabled: !formData.twoFactorEnabled })}
                                                className={`relative w-12 h-6 transition-colors rounded-full border shrink-0 ${
                                                    formData.twoFactorEnabled ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
                                                }`}
                                            >
                                                <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                                                    formData.twoFactorEnabled ? 'translate-x-6 bg-slate-950' : 'translate-x-0.5 bg-slate-400'
                                                }`} />
                                            </button>
                                        </div>

                                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
                                            <h3 className="text-base font-bold text-white mb-2">Password & Access Controls</h3>
                                            <p className="text-xs text-slate-400 mb-6">Manage your login credentials and active device sessions.</p>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <a
                                                    href="/forgot-password"
                                                    className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-white transition-colors text-center"
                                                >
                                                    Change Password
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => toast.success('Active sessions refreshed.')}
                                                    className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Sign Out All Other Devices
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* NOTIFICATIONS */}
                                {activeSection === 'Notifications' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                                        {[
                                            { id: 'email', label: 'Email Notifications', desc: 'Statements, incoming transfers, and security alerts.' },
                                            { id: 'sms', label: 'SMS Alerts', desc: 'Real-time card activity alerts and OTP challenge codes.' },
                                            { id: 'push', label: 'In-App Alerts', desc: 'Real-time push notifications regarding platform updates.' }
                                        ].map((n) => (
                                            <div key={n.id} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-bold text-white mb-1.5">{n.label}</h3>
                                                    <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        notifications: { ...formData.notifications, [n.id]: !formData.notifications[n.id] }
                                                    })}
                                                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                                                        formData.notifications?.[n.id] 
                                                            ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' 
                                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                                                    }`}
                                                >
                                                    {formData.notifications?.[n.id] ? 'Enabled' : 'Disabled'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* REGIONAL & CURRENCY */}
                                {activeSection === 'Global' && (
                                    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                                        <SmoothSelect
                                            label="Language"
                                            icon={<Globe size={14} />}
                                            value={formData.preferences?.language || 'English'}
                                            options={[
                                                { value: 'English', label: 'English (US)' },
                                                { value: 'Spanish', label: 'Español' },
                                                { value: 'French', label: 'Français' },
                                                { value: 'German', label: 'Deutsch' },
                                            ]}
                                            onChange={(val) => setFormData({ ...formData, preferences: { ...formData.preferences, language: val } })}
                                        />

                                        <SmoothSelect
                                            label="Time Zone"
                                            icon={<Clock size={14} />}
                                            value={formData.preferences?.timezone || 'UTC'}
                                            options={[
                                                { value: 'UTC', label: 'UTC (Universal Time)' },
                                                { value: 'EST', label: 'EST (New York)' },
                                                { value: 'PST', label: 'PST (San Francisco)' },
                                                { value: 'GMT', label: 'GMT (London)' },
                                                { value: 'CET', label: 'CET (Frankfurt)' },
                                            ]}
                                            onChange={(val) => setFormData({ ...formData, preferences: { ...formData.preferences, timezone: val } })}
                                        />

                                        <SmoothSelect
                                            label="Base Currency"
                                            icon={<CreditCard size={14} />}
                                            value={formData.preferences?.defaultCurrency || 'USD'}
                                            options={[
                                                { value: 'USD', label: 'USD ($) - US Dollar' },
                                                { value: 'EUR', label: 'EUR (€) - Euro' },
                                                { value: 'GBP', label: 'GBP (£) - British Pound' },
                                                { value: 'CAD', label: 'CAD ($) - Canadian Dollar' },
                                            ]}
                                            onChange={(val) => setFormData({ ...formData, preferences: { ...formData.preferences, defaultCurrency: val } })}
                                        />
                                    </div>
                                )}

                                {/* ACCOUNT LIMITS & MANAGEMENT */}
                                {activeSection === 'Management' && (
                                    <div className="space-y-6 max-w-4xl">
                                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-4">
                                            <h3 className="text-base font-bold text-white">Transfer Limits</h3>
                                            <p className="text-xs text-slate-400">View and request adjustments to your account velocity.</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                                    <span className="text-xs text-slate-400 block mb-1">Daily Limit</span>
                                                    <span className="text-2xl font-bold font-mono text-cyan-400">
                                                        ${formData.limits?.dailyTransfer?.toLocaleString() || '50,000'}
                                                    </span>
                                                </div>
                                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                                    <span className="text-xs text-slate-400 block mb-1">Monthly Limit</span>
                                                    <span className="text-2xl font-bold font-mono text-cyan-400">
                                                        ${formData.limits?.monthlyTransfer?.toLocaleString() || '500,000'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 sm:p-8 space-y-4">
                                            <div className="flex items-center gap-2 text-rose-400">
                                                <AlertTriangle size={18} />
                                                <h3 className="text-sm font-bold uppercase tracking-wider">Account Closure</h3>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                {user?.isClosureRequested
                                                    ? 'An administrative review for account closure is currently pending. You will be notified via email once completed.'
                                                    : 'Request permanent closure of your KeyTrust Pay account. All pending settlements must be cleared beforehand.'}
                                            </p>
                                            <button
                                                onClick={handleRequestClosure}
                                                disabled={loading || user?.isClosureRequested}
                                                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                    user?.isClosureRequested
                                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                                                }`}
                                            >
                                                {user?.isClosureRequested ? 'Closure Pending Review' : 'Request Account Closure'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    )
}
