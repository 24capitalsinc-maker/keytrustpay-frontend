import './globals.css'
import { Outfit, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import FaviconSync from '@/components/FaviconSync'
import SessionProvider from '@/components/SessionProvider'
import InactivityHandler from '@/components/InactivityHandler'

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-outfit',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export const metadata = {
    title: 'KeyTrust Pay | Modern Global Banking & Seamless Payments',
    description: 'Effortless international transfers, multi-currency accounts, and bank-grade security built for modern businesses and individuals worldwide.',
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} overflow-x-hidden max-w-[100vw] dark`} data-scroll-behavior="smooth">
            <body className="bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden max-w-[100vw] selection:bg-cyan-500/20 selection:text-cyan-300">
                <SessionProvider>
                    <InactivityHandler />
                    <FaviconSync />
                    <Toaster richColors position="top-right" closeButton theme="dark" />
                    {children}
                </SessionProvider>
            </body>
        </html>
    )
}
