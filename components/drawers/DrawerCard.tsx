import Link from 'next/link'
import { formatDate } from '@/lib/utils/date'
import { getSlug } from '@/lib/utils/slug'
import type { Drawer, DiaryEntryWithDrawers } from '@/types/sanity'

interface DrawerCardProps {
  drawer: Drawer
  latestEntry: DiaryEntryWithDrawers | null
}

function getTextPreview(body: DiaryEntryWithDrawers['body'], maxLength: number = 150): string {
  const text = body
    .filter((block) => block._type === 'block')
    .slice(0, 2)
    .map((block) => {
      if ('children' in block && Array.isArray(block.children)) {
        return block.children
          .map((child: unknown) => {
            if (typeof child === 'object' && child !== null && 'text' in child) {
              return typeof child.text === 'string' ? child.text : ''
            }
            return ''
          })
          .join('')
      }
      return ''
    })
    .join(' ')
    .slice(0, maxLength)
  
  return text || ''
}

export function DrawerCard({ drawer, latestEntry }: DrawerCardProps) {
  const drawerSlug = getSlug(drawer.slug)

  return (
    <article className="border-t border-border pt-6">
      <header className="mb-6">
        <h2 className="mb-2 text-3xl font-semibold">{drawer.name}</h2>
        {drawer.description && (
          <p className="mb-3 text-foreground-muted leading-relaxed">{drawer.description}</p>
        )}
        <span 
          className="inline-block rounded bg-background-muted px-3 py-1 text-sm capitalize text-foreground-muted" 
          aria-label={`Type: ${drawer.type}`}
        >
          {drawer.type}
        </span>
      </header>

      {latestEntry ? (
        <div className="mt-6">
          <div className="mb-4">
            <time 
              dateTime={latestEntry.date} 
              className="mb-2 block text-sm text-foreground-muted"
            >
              {formatDate(latestEntry.date)}
            </time>
            {latestEntry.title && (
              <h3 className="text-xl font-semibold">{latestEntry.title}</h3>
            )}
          </div>
          <div className="mb-4 text-foreground">
            <p className="leading-relaxed">{getTextPreview(latestEntry.body)}...</p>
          </div>
          <footer className="mt-4">
            <Link
              href={`/drawers/${drawerSlug}`}
              aria-label={`Open ${drawer.name} drawer`}
              className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
            >
              Open drawer →
            </Link>
          </footer>
        </div>
      ) : (
        <div className="py-8 text-foreground-muted">
          <p>No entries yet in this drawer.</p>
          <Link 
            href={`/drawers/${drawerSlug}`}
            className="mt-2 inline-block font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
          >
            View drawer →
          </Link>
        </div>
      )}
    </article>
  )
}

