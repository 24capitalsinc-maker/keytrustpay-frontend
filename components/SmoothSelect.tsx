'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface Option {
    value: string
    label: string
    icon?: React.ReactNode
}

interface SmoothSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    icon?: React.ReactNode
}

export default function SmoothSelect({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select an option',
    className,
    icon: TriggerIcon
}: SmoothSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const activeOption = options.find(opt => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={cn("space-y-2 relative w-full", className)} ref={containerRef}>
            {label && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {TriggerIcon && <span className="text-cyan-400">{TriggerIcon}</span>}
                    <label>{label}</label>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-left outline-none transition-all duration-200 group shadow-inner"
            >
                <div className="flex items-center gap-3 min-w-0">
                    {activeOption?.icon && <div className="text-cyan-400 shrink-0">{activeOption.icon}</div>}
                    <span className={cn(
                        "text-sm font-medium truncate",
                        activeOption ? "text-white" : "text-slate-500"
                    )}>
                        {activeOption ? activeOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-slate-400 transition-transform duration-300 shrink-0 ml-2 group-hover:text-slate-200",
                        isOpen && "rotate-180 text-cyan-400"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute z-[300] left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-1.5 overflow-hidden"
                    >
                        <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1">
                            {options.map((option) => {
                                const isSelected = value === option.value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 text-left",
                                            isSelected
                                                ? "bg-cyan-500/15 text-cyan-300 font-medium"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            {option.icon && (
                                                <div className={cn("shrink-0", isSelected ? "text-cyan-400" : "text-slate-400")}>
                                                    {option.icon}
                                                </div>
                                            )}
                                            <span className="truncate">{option.label}</span>
                                        </div>
                                        {isSelected && (
                                            <Check size={16} className="text-cyan-400 shrink-0 ml-2" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
