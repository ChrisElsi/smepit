import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMePit Dashboard',
  description: 'Motorsport Pit-Stop Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  )
}