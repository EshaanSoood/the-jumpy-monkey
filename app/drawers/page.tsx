import Link from 'next/link'
import { getAllDrawers, getLatestEntryForDrawer } from '@/lib/sanity/fetch'
import { getSlug } from '@/lib/utils/slug'
import { DrawerCard } from '@/components/drawers/DrawerCard'
import type { GetAllDrawersResult } from '@/lib/sanity/queries'

export default async function DrawersPage() {
  let drawers: GetAllDrawersResult = []
  try {
    drawers = await getAllDrawers()
  } catch (error) {
    console.error('Error fetching drawers:', error)
    drawers = []
  }

  // Fetch latest entry for each drawer
  const drawersWithLatestEntries = await Promise.all(
    drawers.map(async (drawer) => {
      try {
        const drawerSlug = getSlug(drawer.slug)
        const latestEntry = await getLatestEntryForDrawer(drawerSlug)
        return { drawer, latestEntry }
      } catch (error) {
        const drawerSlug = getSlug(drawer.slug)
        console.error(`Error fetching latest entry for drawer ${drawerSlug}:`, error)
        return { drawer, latestEntry: null }
      }
    })
  )

  return (
    <main id="main-content" className="main-content">
      <header className="mb-8">
        <h1 className="mb-2 text-5xl font-semibold">Drawers</h1>
        <p className="text-lg text-foreground-muted">Long-lived themes, projects, and facets</p>
      </header>

      {drawersWithLatestEntries.length === 0 ? (
        <div className="py-8">
          <p className="mb-4">No drawers yet. Check back soon.</p>
          {!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && (
            <p className="mt-4 text-sm text-foreground-muted">
              Note: Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID to enable content.
            </p>
          )}
        </div>
      ) : (
        <ol className="space-y-12">
          {drawersWithLatestEntries.map(({ drawer, latestEntry }) => (
            <li key={drawer._id}>
              <DrawerCard drawer={drawer} latestEntry={latestEntry} />
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

