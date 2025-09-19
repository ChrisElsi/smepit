import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMePit - iRacing Pit Analysis',
  description: 'Team-basierte Pit-Stop Analyse für iRacing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
