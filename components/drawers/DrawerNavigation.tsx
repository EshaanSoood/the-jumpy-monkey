'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils/date'
import { getSlug } from '@/lib/utils/slug'
import type { DiaryEntryWithDrawers } from '@/types/sanity'

interface DrawerNavigationProps {
  drawerSlug: string
  currentIndex: number
  totalEntries: number
  previousEntry: DiaryEntryWithDrawers | null
  nextEntry: DiaryEntryWithDrawers | null
}

export function DrawerNavigation({
  drawerSlug,
  currentIndex,
  totalEntries,
  previousEntry,
  nextEntry,
}: DrawerNavigationProps) {
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't intercept if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (previousEntry) {
            event.preventDefault()
            const entrySlug = getSlug(previousEntry.slug)
            router.push(`/drawers/${drawerSlug}?entry=${entrySlug}`)
            // Announce navigation to screen readers
            const announcement = document.createElement('div')
            announcement.setAttribute('role', 'status')
            announcement.setAttribute('aria-live', 'polite')
            announcement.className = 'sr-only'
            announcement.textContent = `Previous entry: ${previousEntry.title || formatDate(previousEntry.date)}`
            document.body.appendChild(announcement)
            setTimeout(() => document.body.removeChild(announcement), 1000)
          }
          break
        case 'ArrowRight':
          if (nextEntry) {
            event.preventDefault()
            const entrySlug = getSlug(nextEntry.slug)
            router.push(`/drawers/${drawerSlug}?entry=${entrySlug}`)
            // Announce navigation to screen readers
            const announcement = document.createElement('div')
            announcement.setAttribute('role', 'status')
            announcement.setAttribute('aria-live', 'polite')
            announcement.className = 'sr-only'
            announcement.textContent = `Next entry: ${nextEntry.title || formatDate(nextEntry.date)}`
            document.body.appendChild(announcement)
            setTimeout(() => document.body.removeChild(announcement), 1000)
          }
          break
        case 'Escape':
          event.preventDefault()
          router.push('/drawers')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawerSlug, previousEntry, nextEntry, router])

  const previousEntrySlug = previousEntry ? getSlug(previousEntry.slug) : null
  const nextEntrySlug = nextEntry ? getSlug(nextEntry.slug) : null

  return (
    <nav className="mt-12 border-t-2 border-border pt-8" aria-label="Drawer entry navigation">
      <div className="mb-6 text-center text-sm text-foreground-muted" aria-live="polite">
        <span className="sr-only">Entry </span>
        {currentIndex + 1} of {totalEntries}
      </div>
      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex-1 text-center sm:text-left">
          {previousEntry ? (
            <Link
              href={`/drawers/${drawerSlug}?entry=${previousEntrySlug}`}
              aria-label={`Previous entry: ${previousEntry.title || formatDate(previousEntry.date)}`}
              className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
            >
              ← Previous
            </Link>
          ) : (
            <span aria-hidden="true" className="text-foreground-subtle">← Previous</span>
          )}
        </div>
        <div className="flex-1 text-center sm:text-right">
          {nextEntry ? (
            <Link
              href={`/drawers/${drawerSlug}?entry=${nextEntrySlug}`}
              aria-label={`Next entry: ${nextEntry.title || formatDate(nextEntry.date)}`}
              className="font-medium text-foreground underline-offset-2 hover:no-underline focus-ring"
            >
              Next →
            </Link>
          ) : (
            <span aria-hidden="true" className="text-foreground-subtle">Next →</span>
          )}
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="sr-only">
          Use arrow keys to navigate between entries. Press Escape to return to drawers list.
        </p>
        <p className="text-sm italic text-foreground-subtle" aria-hidden="true">
          ← → Arrow keys to navigate • Esc to close
        </p>
      </div>
    </nav>
  )
}

