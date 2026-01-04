import { Backdrop } from '@/components/scene/Backdrop'
import { DiaryStack } from '@/components/scene/DiaryStack'
import { DrawerRing } from '@/components/scene/DrawerRing'
import { MomentPhoto } from '@/components/scene/MomentPhoto'
import { PostcardArchive } from '@/components/scene/PostcardArchive'
import { getAllDiaryEntries, getAllDrawers, getDiaryEntriesByDrawer, getCurrentMoment, getAllMoments } from '@/lib/sanity/fetch'
import { getSlug } from '@/lib/utils/slug'
import type { DiaryEntryWithDrawers } from '@/types/sanity'
import type { Drawer } from '@/types/sanity'
import type { Moment } from '@/lib/sanity/queries'

interface Postcard {
  _id: string
  imageUrl: string
  date: string
  label?: string
  relatedDiaryEntry?: string
}

export default async function Home() {
  // Fetch all data needed for the scene
  let entries: DiaryEntryWithDrawers[] = []
  let drawers: Drawer[] = []
  let currentMoment: Moment | null = null
  let allMoments: Postcard[] = []
  let drawerEntriesMap: Record<string, DiaryEntryWithDrawers[]> = {}

  try {
    // Fetch diary entries
    entries = await getAllDiaryEntries()

    // Fetch drawers
    drawers = await getAllDrawers()

    // Fetch entries for each drawer
    for (const drawer of drawers) {
      const drawerSlug = getSlug(drawer.slug)
      const drawerEntries = await getDiaryEntriesByDrawer(drawerSlug)
      drawerEntriesMap[drawer._id] = drawerEntries
    }

    // Fetch current moment photo
    currentMoment = await getCurrentMoment()

    // Fetch all moments for postcard archive (excluding current)
    const allMomentsData = await getAllMoments()
    allMoments = allMomentsData
      .filter((moment) => !moment.isCurrentMoment)
      .map((moment) => ({
        _id: moment._id,
        imageUrl: moment.imageUrl || '',
        date: moment.date,
        label: moment.caption,
        relatedDiaryEntry: moment.relatedDiaryEntry,
      }))
  } catch (error) {
    console.error('Error fetching scene data:', error)
  }

  // Get backdrop image URL (you can add this to environment variables or Sanity)
  const backdropImageUrl = process.env.NEXT_PUBLIC_DESK_BACKDROP_IMAGE_URL

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Backdrop */}
      <Backdrop imageUrl={backdropImageUrl} alt="Desk workspace backdrop" />

      {/* Main scene content */}
      <div className="relative z-10">
        {/* Moment photo (taped on wall) */}
        {currentMoment?.imageUrl && (
          <MomentPhoto
            imageUrl={currentMoment.imageUrl}
            caption={currentMoment.caption}
            date={currentMoment.date}
          />
        )}

        {/* Postcard archive (under moment photo) */}
        {allMoments.length > 0 && (
          <PostcardArchive postcards={allMoments} />
        )}

        {/* Diary stack (center) */}
        {entries.length > 0 ? (
          <DiaryStack entries={entries} initialIndex={0} />
        ) : (
          <main aria-label="Diary" className="relative z-10 flex min-h-screen items-center justify-center">
            <div className="rounded-lg bg-background-muted p-8 text-center shadow-lg">
              <h1 className="mb-4 text-2xl font-semibold text-foreground">No entries yet</h1>
              <p className="text-foreground-muted">Check back soon for diary entries.</p>
            </div>
          </main>
        )}

        {/* Drawer ring (around diary) */}
        {drawers.length > 0 && (
          <DrawerRing drawers={drawers} drawerEntries={drawerEntriesMap} />
        )}
      </div>
    </div>
  )
}
