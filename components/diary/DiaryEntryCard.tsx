import Link from 'next/link'
import { formatDate } from '@/lib/utils/date'
import { getSlug } from '@/lib/utils/slug'
import type { DiaryEntryWithDrawers } from '@/types/sanity'

interface DiaryEntryCardProps {
  entry: DiaryEntryWithDrawers
}

function getTextPreview(body: DiaryEntryWithDrawers['body'], maxLength: number = 150): string {
  return body
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
}

export function DiaryEntryCard({ entry }: DiaryEntryCardProps) {
  const dateStr = formatDate(entry.date)
  const preview = getTextPreview(entry.body)

  return (
    <article className="border-t border-border pt-6">
      <header className="mb-4">
        <time 
          dateTime={entry.date} 
          className="mb-2 block text-sm text-foreground-muted"
        >
          {dateStr}
        </time>
        {entry.title && (
          <h2 className="text-2xl font-semibold">{entry.title}</h2>
        )}
      </header>
      <div className="mb-4 text-foreground">
        <p className="leading-relaxed">{preview}...</p>
      </div>
      {entry.drawers && entry.drawers.length > 0 && (
        <div className="mb-4" aria-label="Associated drawers">
          <span className="sr-only">Related to: </span>
          <ul className="flex flex-wrap gap-2">
            {entry.drawers.map((drawer) => (
              <li key={drawer._id}>
                <Link 
                  href={`/drawers/${getSlug(drawer.slug)}`}
                  className="inline-block rounded bg-background-muted px-3 py-1 text-sm text-foreground no-underline transition-colors hover:bg-border focus-ring"
                >
                  {drawer.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <footer>
        <Link 
          href={`/diary/${entry.slug}`} 
          aria-label={`Read full entry: ${entry.title || dateStr}`}
          className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
        >
          Read more
        </Link>
      </footer>
    </article>
  )
}

