'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
    name: string
    role: string
    text: string
    avatar: string
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + testimonials.length) % testimonials.length)
    }, [testimonials.length])

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1)
        }, 8000)
        return () => clearInterval(timer)
    }, [paginate])

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 py-8">
            <div className="relative min-h-[320px] flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1)
                            }
                        }}
                        className="w-full"
                    >
                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col gap-6 relative shadow-2xl backdrop-blur-xl">
                            <Quote className="text-cyan-500/20 w-12 h-12 absolute top-6 right-6" />

                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((j) => (
                                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            <p className="text-slate-200 text-lg sm:text-xl leading-relaxed font-light italic">
                                &ldquo;{testimonials[currentIndex].text}&rdquo;
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold text-sm">
                                    {testimonials[currentIndex].avatar}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-base">{testimonials[currentIndex].name}</p>
                                    <p className="text-slate-400 text-xs font-medium">{testimonials[currentIndex].role}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-6 mt-8">
                <button
                    onClick={() => paginate(-1)}
                    className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentIndex ? 1 : -1)
                                setCurrentIndex(i)
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === currentIndex ? 'bg-cyan-400 w-8' : 'bg-slate-700 w-2 hover:bg-slate-600'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => paginate(1)}
                    className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
                    aria-label="Next testimonial"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
