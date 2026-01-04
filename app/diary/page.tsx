import Link from 'next/link'
import { getAllDiaryEntries } from '@/lib/sanity/fetch'
import { DiaryEntryCard } from '@/components/diary/DiaryEntryCard'
import type { GetAllDiaryEntriesResult } from '@/lib/sanity/queries'

export default async function DiaryPage() {
  let entries: GetAllDiaryEntriesResult = []
  try {
    entries = await getAllDiaryEntries()
  } catch (error) {
    console.error('Error fetching diary entries:', error)
    entries = []
  }

  return (
    <main id="main-content" className="main-content">
      <header className="mb-8">
        <h1 className="mb-2 text-5xl font-semibold">Diary</h1>
        <p className="text-lg text-foreground-muted">A chronological record of thoughts and reflections</p>
      </header>
      {entries.length === 0 ? (
        <div className="py-8">
          <p className="mb-4">No entries yet. Check back soon.</p>
          {!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && (
            <p className="mt-4 text-sm text-foreground-muted">
              Note: Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID to enable content.
            </p>
          )}
        </div>
      ) : (
        <ol className="space-y-12">
          {entries.map((entry) => (
            <li key={entry._id}>
              <DiaryEntryCard entry={entry} />
            </li>
          ))}
        </ol>
      )}
      <nav aria-label="Site navigation" className="mt-12 border-t border-border pt-8">
        <Link 
          href="/" 
          className="text-foreground underline-offset-2 hover:no-underline focus-ring"
        >
          ← Back to Home
        </Link>
      </nav>
    </main>
  )
}

