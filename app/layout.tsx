import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VA Plants',
  description: 'Learn Virginia native plants and wetland indicator species',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
