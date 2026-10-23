import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface DashboardCardProps {
    title: string
    value: string | number
    icon: any
    subtitle?: string
    isSensitive?: boolean
    isVisible?: boolean
    onToggle?: () => void
    isCopyable?: boolean
}

export default function DashboardCard({
    title,
    value,
    icon: Icon,
    subtitle,
    isSensitive,
    isVisible,
    onToggle,
    isCopyable
}: DashboardCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(String(value))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const valueToShow = isSensitive && !isVisible ? "••••••••" : value

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group"
        >
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 h-full relative overflow-hidden transition-all duration-300 hover:border-sky-500/40 shadow-xl hover:shadow-2xl hover:shadow-sky-500/5 backdrop-blur-xl">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
                    <div className="flex items-center gap-2">
                        {isSensitive && onToggle && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle();
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title={isVisible ? "Hide details" : "Show details"}
                            >
                                {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        )}
                        <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                            <Icon size={18} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <div className="flex items-center gap-3">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={isVisible ? 'visible' : 'hidden'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate"
                                title={String(value)}
                            >
                                {valueToShow}
                            </motion.h3>
                        </AnimatePresence>
                        {isCopyable && (!isSensitive || isVisible) && (
                            <button
                                onClick={handleCopy}
                                className="p-1 rounded-md text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors shrink-0"
                                title="Copy account number"
                            >
                                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                            </button>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
