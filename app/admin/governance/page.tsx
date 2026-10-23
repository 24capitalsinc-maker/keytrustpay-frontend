'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Save, AlertTriangle, ShieldCheck, Globe, Mail, Share2, Info, Building } from 'lucide-react'

export default function GovernancePage() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings')
            setSettings(res.data)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            await api.put('/admin/settings', settings)
            setMessage({ type: 'success', text: 'System settings saved successfully.' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save system settings.' })
        } finally {
            setSaving(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage({ type: '', text: '' })

        const formData = new FormData()
        formData.append('logo', file)

        try {
            const res = await api.post('/admin/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSettings({ ...settings, logoUrl: res.data.logoUrl })
            setMessage({ type: 'success', text: 'Logo uploaded successfully.' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload logo.' })
        } finally {
            setUploading(false)
        }
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 lg:pl-80 z-10">
                    <header className="mb-10 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                    System Settings
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                Platform <span className="text-cyan-400">Governance.</span>
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm font-normal">Manage brand identity, support channels, maintenance status, and registrations.</p>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </header>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-8 p-4 rounded-xl border text-xs font-semibold ${
                                message.type === 'success' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Operational State */}
                        <div className="space-y-8">
                            <section className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">System Controls</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Maintenance Mode</p>
                                            <p className="text-xs text-slate-400">Suspends public access while system maintenance is in progress.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, isMaintenanceMode: !settings.isMaintenanceMode })}
                                            className={`relative w-12 h-6 transition-colors rounded-full border ${
                                                settings?.isMaintenanceMode ? 'bg-amber-600 border-amber-500' : 'bg-slate-800 border-slate-700'
                                            }`}
                                        >
                                            <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                                                settings?.isMaintenanceMode ? 'translate-x-6 bg-white' : 'translate-x-0.5 bg-slate-400'
                                            }`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                                        <div>
                                            <p className="text-sm font-semibold text-white">User Registration</p>
                                            <p className="text-xs text-slate-400">Allow new clients to register accounts.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, isRegistrationEnabled: !settings.isRegistrationEnabled })}
                                            className={`relative w-12 h-6 transition-colors rounded-full border ${
                                                settings?.isRegistrationEnabled ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'
                                            }`}
                                        >
                                            <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                                                settings?.isRegistrationEnabled ? 'translate-x-6 bg-white' : 'translate-x-0.5 bg-slate-400'
                                            }`} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Maintenance Broadcast Message</label>
                                        <textarea
                                            value={settings?.maintenanceMessage || ''}
                                            onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl p-3.5 text-xs text-white outline-none transition-all resize-none min-h-[90px]"
                                            placeholder="System is undergoing scheduled maintenance..."
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Logo & Display Text</h2>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Logo Primary Text</label>
                                            <input
                                                type="text"
                                                value={settings?.logoText || 'KeyTrust'}
                                                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none"
                                                placeholder="KeyTrust"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Logo Accent Text</label>
                                            <input
                                                type="text"
                                                value={settings?.logoAccent || 'Pay'}
                                                onChange={(e) => setSettings({ ...settings, logoAccent: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none"
                                                placeholder="Pay"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300">Custom Brand Logo File</label>
                                        <div className="flex items-center gap-4">
                                            {settings?.logoUrl ? (
                                                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                                                    <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
                                                    K
                                                </div>
                                            )}
                                            <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white transition-all">
                                                <span>{uploading ? 'Uploading...' : 'Upload New Logo'}</span>
                                                <input type="file" className="hidden" onChange={handleLogoUpload} disabled={uploading} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Brand & Socials */}
                        <div className="space-y-8">
                            <section className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl h-full">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                        <Building size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Brand Identity & Support</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300">Company Name</label>
                                        <input
                                            type="text"
                                            value={settings?.companyName || 'KeyTrust Pay'}
                                            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300">Support Desk Email</label>
                                        <input
                                            type="email"
                                            value={settings?.supportEmail || 'support@keytrustpay.org'}
                                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 space-y-4">
                                        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                                            <Share2 size={14} /> Social Channels
                                        </p>
                                        <div className="space-y-3">
                                            {settings?.socialLinks && Object.keys(settings.socialLinks).map((platform) => (
                                                <div key={platform} className="space-y-1">
                                                    <label className="text-xs text-slate-400 capitalize">{platform}</label>
                                                    <input
                                                        type="text"
                                                        value={settings.socialLinks[platform] || ''}
                                                        onChange={(e) => setSettings({
                                                            ...settings,
                                                            socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                                                        })}
                                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2 text-white text-xs outline-none"
                                                        placeholder={`https://${platform}.com/keytrustpay`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
