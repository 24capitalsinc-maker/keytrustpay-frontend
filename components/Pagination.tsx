'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    // Helper to determine which pages to show
    const visiblePages = pages.filter(page => {
        if (totalPages <= 7) return true
        if (page === 1 || page === totalPages) return true
        if (Math.abs(page - currentPage) <= 1) return true
        return false
    })

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-800/80 bg-slate-900/40">
            <p className="text-xs text-slate-400">
                Page <span className="text-cyan-400 font-semibold">{currentPage}</span> of <span className="text-slate-200 font-semibold">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page, index) => {
                        const isVisible = visiblePages.includes(page)
                        const showEllipsis = index > 0 && isVisible && !visiblePages.includes(pages[index - 1])

                        return (
                            <div key={page} className="flex items-center gap-1">
                                {showEllipsis && <span className="text-slate-600 px-1 text-xs">...</span>}
                                {isVisible && (
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                                            currentPage === page
                                                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border border-slate-800/80'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}
