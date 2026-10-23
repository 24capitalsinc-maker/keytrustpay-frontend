'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Globe, ShieldCheck, Clock, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import { toast } from 'sonner'

const contactSchema = z.object({
    name: z.string().min(2, 'Please enter your name'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(3, 'Please specify a subject'),
    message: z.string().min(10, 'Please enter a message of at least 10 characters')
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema)
    })

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true)
        try {
            await api.post('/public/contact', data)
            toast.success('Thank you! Your message has been received.')
            setIsSent(true)
            reset()
        } catch (error) {
            toast.error('Unable to send message right now. Please email support@keytrustpay.org directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-1/4 w-[800px] h-[450px] bg-gradient-to-b from-sky-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

            <Navbar />

            {/* Header */}
            <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-12 border-b border-slate-800/80">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div {...fadeIn}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
                            <Mail size={14} />
                            <span>Contact & Inquiries</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
                            Get in touch with <br />
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                the KeyTrust Pay team.
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                            Have questions about our personal checking, commercial accounts, or enterprise treasury? We're here to answer every question.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="py-20 px-4 sm:px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Contact Details */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-6">Our Contact Details</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <MapPin size={20} />, label: "Global Offices", val: "KeyTrust Pay Inc., Financial District, New York, NY & London, UK" },
                                    { icon: <Mail size={20} />, label: "Support Email", val: "support@keytrustpay.org" },
                                    { icon: <Phone size={20} />, label: "Client Hotline", val: "+1 (555) 240-0000" },
                                    { icon: <Clock size={20} />, label: "Operating Hours", val: "24/7 Global Live Support" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</p>
                                            <p className="text-white text-sm font-medium">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-1">SOC 2 Type II & AES-256 Security</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    All communications and client records are encrypted with 256-bit SSL protocols and stored in fully certified secure data centers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                            {isSent ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Message Delivered</h3>
                                    <p className="text-slate-300 text-sm max-w-md mx-auto">
                                        Thank you for reaching out to KeyTrust Pay. A specialist will review your inquiry and follow up within a few business hours.
                                    </p>
                                    <button
                                        onClick={() => setIsSent(false)}
                                        className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">Send a Message</h3>
                                        <p className="text-slate-400 text-sm">Fill out the form below and we'll reply to your email promptly.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                                            <input
                                                {...register('name')}
                                                className={`w-full bg-slate-950/60 border ${errors.name ? 'border-red-500' : 'border-slate-800'} focus:border-cyan-400 rounded-xl outline-none p-3.5 text-sm text-white transition-all placeholder:text-slate-600`}
                                                placeholder="Sarah Jenkins"
                                            />
                                            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className={`w-full bg-slate-950/60 border ${errors.email ? 'border-red-500' : 'border-slate-800'} focus:border-cyan-400 rounded-xl outline-none p-3.5 text-sm text-white transition-all placeholder:text-slate-600`}
                                                placeholder="sarah@example.com"
                                            />
                                            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300 block">Subject</label>
                                        <input
                                            {...register('subject')}
                                            className={`w-full bg-slate-950/60 border ${errors.subject ? 'border-red-500' : 'border-slate-800'} focus:border-cyan-400 rounded-xl outline-none p-3.5 text-sm text-white transition-all placeholder:text-slate-600`}
                                            placeholder="Question about Commercial Treasury"
                                        />
                                        {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-300 block">Your Message</label>
                                        <textarea
                                            {...register('message')}
                                            rows={5}
                                            className={`w-full bg-slate-950/60 border ${errors.message ? 'border-red-500' : 'border-slate-800'} focus:border-cyan-400 rounded-xl outline-none p-3.5 text-sm text-white transition-all placeholder:text-slate-600 resize-none`}
                                            placeholder="Please describe how we can assist you..."
                                        />
                                        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 py-4 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-40 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={16} /> Send Message
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-slate-500 text-center">
                                        We respect your privacy and will never share your personal information.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
