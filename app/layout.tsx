import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shadow Raiders Alliance | Supremacy WW3',
  description: 'An elite gaming alliance in Supremacy WW3. Built on discipline, execution, and loyalty since 2023.',
  openGraph: {
    title: 'Shadow Raiders Alliance',
    description: 'Elite Supremacy WW3 Alliance — Tacite et celeriter.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
