import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VA Plants - Flashcard Game',
  description: 'Learn Virginia native plants and wetland indicator species',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
