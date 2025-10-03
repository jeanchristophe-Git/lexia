import type { Metadata } from 'next'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { DemoBanner } from '@/components/DemoBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Assistant Juridique Africain - Droit CI, CM, TG',
  description: 'Assistant IA spécialisé dans la législation africaine : Côte d\'Ivoire, Cameroun, Togo. Informations juridiques basées sur les sources officielles.',
  keywords: 'droit africain, législation, Côte d\'Ivoire, Cameroun, Togo, assistant juridique, OHADA, code commerce, code travail',
  authors: [{ name: 'Assistant Juridique Africain' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Assistant Juridique Africain',
    description: 'Assistant IA spécialisé dans la législation africaine : Côte d\'Ivoire, Cameroun, Togo',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <DemoBanner />
              <div className="pt-14">
                {children}
              </div>
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  )
}
