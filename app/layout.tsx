import type { Metadata } from 'next'
import { SkipNav } from '@/components/ui/SkipNav'
import { SiteNavigation } from '@/components/ui/SiteNavigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diary + Drawers',
  description: 'A thinking surface and temporal record',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SkipNav />
        {/* Hide SiteNavigation on home page - it's a single-page experience */}
        <div className="hidden">
          <SiteNavigation />
        </div>
        {children}
      </body>
    </html>
  )
}

