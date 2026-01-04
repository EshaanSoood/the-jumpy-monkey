import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDrawerBySlug, getDiaryEntriesByDrawer } from '@/lib/sanity/fetch'
import { formatDate } from '@/lib/utils/date'
import { getSlug } from '@/lib/utils/slug'
import { PortableTextRenderer } from '@/components/diary/PortableTextRenderer'
import { DrawerNavigation } from '@/components/drawers/DrawerNavigation'

interface DrawerPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ entry?: string }>
}

export default async function DrawerPage({ params, searchParams }: DrawerPageProps) {
  const { slug } = await params
  const { entry: entrySlug } = await searchParams

  const drawer = await getDrawerBySlug(slug)
  if (!drawer) {
    notFound()
  }

  const entries = await getDiaryEntriesByDrawer(slug)

  if (entries.length === 0) {
    return (
      <main id="main-content" className="main-content">
        <header className="mb-8">
          <h1 className="mb-2 text-5xl font-semibold">{drawer.name}</h1>
          {drawer.description && (
            <p className="text-lg text-foreground-muted">{drawer.description}</p>
          )}
        </header>
        <div className="py-8">
          <p className="mb-4">No entries yet in this drawer.</p>
          <nav aria-label="Navigation" className="mt-8">
            <Link 
              href="/drawers"
              className="text-foreground underline-offset-2 hover:no-underline focus-ring"
            >
              ← Back to Drawers
            </Link>
          </nav>
        </div>
      </main>
    )
  }

  // Determine which entry to show
  let currentEntryIndex = 0
  if (entrySlug) {
    const foundIndex = entries.findIndex((e) => getSlug(e.slug) === entrySlug)
    if (foundIndex !== -1) {
      currentEntryIndex = foundIndex
    }
  }

  const currentEntry = entries[currentEntryIndex]
  const previousEntry = currentEntryIndex > 0 ? entries[currentEntryIndex - 1] : null
  const nextEntry = currentEntryIndex < entries.length - 1 ? entries[currentEntryIndex + 1] : null

  const dateStr = formatDate(currentEntry.date)
  const currentEntrySlug = getSlug(currentEntry.slug)
  const drawerSlug = getSlug(drawer.slug)

  return (
    <main id="main-content" className="main-content">
      <header className="mb-12 border-b-2 border-border pb-6">
        <h1 className="mb-3 text-5xl font-semibold">{drawer.name}</h1>
        {drawer.description && (
          <p className="mb-4 text-lg leading-relaxed text-foreground-muted">{drawer.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          <span 
            className="inline-block rounded bg-background-muted px-4 py-2 text-sm capitalize text-foreground-muted" 
            aria-label={`Type: ${drawer.type}`}
          >
            {drawer.type}
          </span>
          <span 
            className="inline-block rounded bg-background-muted px-4 py-2 text-sm text-foreground-muted" 
            aria-label={`${entries.length} entries`}
          >
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </header>

      <article className="prose-container" aria-live="polite" aria-atomic="true">
        <header className="mb-8 border-b border-border pb-4">
          <time 
            dateTime={currentEntry.date} 
            className="mb-3 block text-base text-foreground-muted"
          >
            {dateStr}
          </time>
          {currentEntry.title && (
            <h2 className="text-4xl font-semibold leading-tight">{currentEntry.title}</h2>
          )}
        </header>

        <div className="mb-8 leading-relaxed">
          <PortableTextRenderer content={currentEntry.body} />
        </div>

        {currentEntry.drawers && currentEntry.drawers.length > 1 && (
          <aside 
            className="mb-8 rounded-lg bg-background-muted p-6" 
            aria-label="Other associated drawers"
          >
            <h3 className="mb-4 text-lg font-semibold">Also in</h3>
            <ul className="flex flex-wrap gap-3">
              {currentEntry.drawers
                .filter((d) => getSlug(d.slug) !== drawerSlug)
                .map((d) => (
                  <li key={d._id}>
                    <Link 
                      href={`/drawers/${getSlug(d.slug)}`}
                      className="inline-block rounded border border-border bg-background px-4 py-2 text-foreground no-underline transition-colors hover:bg-background-muted hover:border-foreground-subtle focus-ring"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>
        )}

        <div className="mt-8 border-t border-border pt-6">
          <Link 
            href={`/diary/${currentEntrySlug}`}
            className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
          >
            View in Diary →
          </Link>
        </div>
      </article>

      <DrawerNavigation
        drawerSlug={slug}
        currentIndex={currentEntryIndex}
        totalEntries={entries.length}
        previousEntry={previousEntry}
        nextEntry={nextEntry}
      />

      <nav aria-label="Site navigation" className="mt-12 border-t border-border pt-8">
        <Link 
          href="/drawers"
          className="text-foreground underline-offset-2 hover:no-underline focus-ring"
        >
          ← Back to Drawers
        </Link>
      </nav>
    </main>
  )
}

