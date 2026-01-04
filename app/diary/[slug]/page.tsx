import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllDiaryEntries, getDiaryEntryBySlug } from '@/lib/sanity/fetch'
import { formatDate } from '@/lib/utils/date'
import { getSlug } from '@/lib/utils/slug'
import { PortableTextRenderer } from '@/components/diary/PortableTextRenderer'

interface DiaryEntryPageProps {
  params: Promise<{ slug: string }>
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { slug } = await params
  const entry = await getDiaryEntryBySlug(slug)

  if (!entry) {
    notFound()
  }

  const allEntries = await getAllDiaryEntries()
  const currentIndex = allEntries.findIndex((e) => e._id === entry._id)
  const previousEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null
  const nextEntry =
    currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null

  const dateStr = formatDate(entry.date)

  return (
    <main id="main-content" className="main-content">
      <article className="prose-container">
        <header className="mb-8 border-b-2 border-border pb-4">
          <time 
            dateTime={entry.date} 
            className="mb-3 block text-base text-foreground-muted"
          >
            {dateStr}
          </time>
          {entry.title && (
            <h1 className="text-5xl font-semibold leading-tight">{entry.title}</h1>
          )}
        </header>

        <div className="mb-12 leading-relaxed">
          <PortableTextRenderer content={entry.body} />
        </div>

        {entry.drawers && entry.drawers.length > 0 && (
          <aside 
            className="mb-12 rounded-lg bg-background-muted p-6" 
            aria-label="Associated drawers"
          >
            <h2 className="mb-4 text-xl font-semibold">Related to</h2>
            <ul className="flex flex-wrap gap-3">
              {entry.drawers.map((drawer) => (
                <li key={drawer._id}>
                  <Link 
                    href={`/drawers/${getSlug(drawer.slug)}`}
                    className="inline-block rounded border border-border bg-background px-4 py-2 text-foreground no-underline transition-colors hover:bg-background-muted hover:border-foreground-subtle focus-ring"
                  >
                    {drawer.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <nav 
          className="flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between" 
          aria-label="Entry navigation"
        >
          <div className="flex-1 text-center sm:text-left">
            {previousEntry ? (
              <Link
                href={`/diary/${previousEntry.slug}`}
                aria-label={`Previous entry: ${previousEntry.title || formatDate(previousEntry.date)}`}
                className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
              >
                ← Previous
              </Link>
            ) : (
              <span aria-hidden="true" className="text-foreground-subtle">← Previous</span>
            )}
          </div>
          <div className="text-center">
            <Link 
              href="/diary"
              className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
            >
              Back to Diary
            </Link>
          </div>
          <div className="flex-1 text-center sm:text-right">
            {nextEntry ? (
              <Link
                href={`/diary/${nextEntry.slug}`}
                aria-label={`Next entry: ${nextEntry.title || formatDate(nextEntry.date)}`}
                className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
              >
                Next →
              </Link>
            ) : (
              <span aria-hidden="true" className="text-foreground-subtle">Next →</span>
            )}
          </div>
        </nav>
      </article>
    </main>
  )
}

