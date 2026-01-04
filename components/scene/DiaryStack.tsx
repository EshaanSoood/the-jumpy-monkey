'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { formatDate } from '@/lib/utils/date'
import { PortableTextRenderer } from '@/components/diary/PortableTextRenderer'
import type { DiaryEntryWithDrawers } from '@/types/sanity'

interface DiaryStackProps {
  entries: DiaryEntryWithDrawers[]
  initialIndex?: number
}

export function DiaryStack({ entries, initialIndex = 0 }: DiaryStackProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const fullscreenRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  // Ensure we have at least 3 entries (pad with nulls if needed)
  const getEntry = (offset: number): DiaryEntryWithDrawers | null => {
    const index = currentIndex + offset
    return index >= 0 && index < entries.length ? entries[index] : null
  }

  const previousEntry = getEntry(-1)
  const currentEntry = getEntry(0)
  const nextEntry = getEntry(1)

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < entries.length - 1

  const goPrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && canGoPrevious) {
        event.preventDefault()
        setCurrentIndex((prev) => prev - 1)
      } else if (event.key === 'ArrowRight' && canGoNext) {
        event.preventDefault()
        setCurrentIndex((prev) => prev + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canGoPrevious, canGoNext])

  // Scroll wheel navigation (optional, desktop only)
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 50) {
        event.preventDefault()
        if (event.deltaY > 0 && canGoNext) {
          setCurrentIndex((prev) => prev + 1)
        } else if (event.deltaY < 0 && canGoPrevious) {
          setCurrentIndex((prev) => prev - 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [canGoPrevious, canGoNext])

  // ESC key to close fullscreen
  useEffect(() => {
    if (!isFullscreen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isFullscreen])

  // Focus trap for fullscreen modal
  useEffect(() => {
    if (!isFullscreen || !fullscreenRef.current) return

    const modal = fullscreenRef.current
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    modal.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      modal.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  if (!currentEntry) {
    return (
      <main aria-label="Diary" className="relative z-10 flex min-h-screen items-center justify-center">
        <p className="text-foreground-muted">No diary entries available.</p>
      </main>
    )
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      zIndex: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 2,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      zIndex: 1,
    }),
  }

  const peekVariants = {
    static: {
      scale: 0.85,
      opacity: 0.4,
      y: 0,
    },
    hover: {
      scale: 0.9,
      opacity: 0.6,
      y: -8,
    },
  }

  const transition = reducedMotion
    ? { duration: 0.01 } as const
    : { type: 'spring' as const, stiffness: 300, damping: 30 }

  return (
    <main 
      aria-label="Diary" 
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8"
    >
      {/* Navigation buttons */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={goPrevious}
          disabled={!canGoPrevious}
          aria-label="Previous entry"
          className="rounded-lg bg-background-muted px-4 py-2 font-medium text-foreground transition-colors hover:bg-border focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next entry"
          className="rounded-lg bg-background-muted px-4 py-2 font-medium text-foreground transition-colors hover:bg-border focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Diary stack container */}
      <div className="relative w-full max-w-2xl">
        {/* Previous entry (peek) */}
        {previousEntry && (
          <motion.div
            className="absolute inset-0 -z-10"
            variants={peekVariants}
            initial="static"
            whileHover="hover"
            transition={transition}
          >
            <DiaryCard entry={previousEntry} isPeek position="previous" />
          </motion.div>
        )}

        {/* Current entry (active) */}
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentEntry._id}
            custom={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            aria-live="polite"
            aria-atomic="true"
          >
            <DiaryCard 
              entry={currentEntry} 
              isPeek={false}
              position="current"
              onFullscreen={() => setIsFullscreen(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next entry (peek) */}
        {nextEntry && (
          <motion.div
            className="absolute inset-0 -z-10"
            variants={peekVariants}
            initial="static"
            whileHover="hover"
            transition={transition}
          >
            <DiaryCard entry={nextEntry} isPeek position="next" />
          </motion.div>
        )}
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing entry dated {formatDate(currentEntry.date)}
        {currentEntry.title && `: ${currentEntry.title}`}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            ref={fullscreenRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Diary entry: ${currentEntry.title || formatDate(currentEntry.date)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={transition}
              className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-[var(--color-warm-wall)] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundImage: `
                  linear-gradient(90deg, transparent 79px, rgba(0,0,0,0.03) 81px, rgba(0,0,0,0.03) 82px, transparent 84px),
                  linear-gradient(var(--color-warm-wall) 0.1em, transparent 0.1em)
                `,
                backgroundSize: '100% 1.5em',
              }}
            >
              <button
                onClick={() => setIsFullscreen(false)}
                aria-label="Close fullscreen view"
                className="absolute right-4 top-4 rounded p-2 text-foreground transition-colors hover:bg-border focus-ring"
              >
                ✕
              </button>
              <DiaryCard 
                entry={currentEntry} 
                isPeek={false}
                position="current"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

interface DiaryCardProps {
  entry: DiaryEntryWithDrawers
  isPeek: boolean
  position: 'previous' | 'current' | 'next'
  onFullscreen?: () => void
}

function DiaryCard({ entry, isPeek, position, onFullscreen }: DiaryCardProps) {
  const dateStr = formatDate(entry.date)
  const reducedMotion = useReducedMotion()

  // Slight rotation for paper effect
  const rotation = position === 'previous' ? -1.5 : position === 'next' ? 1.5 : 0

  return (
    <article
      className={`relative rounded-lg bg-[var(--color-warm-wall)] p-8 shadow-2xl ${!isPeek && onFullscreen ? 'cursor-pointer' : ''}`}
      onClick={!isPeek && onFullscreen ? onFullscreen : undefined}
      style={{
        transform: `rotate(${rotation}deg)`,
        // Paper texture effect with subtle noise
        backgroundImage: `
          linear-gradient(90deg, transparent 79px, rgba(0,0,0,0.03) 81px, rgba(0,0,0,0.03) 82px, transparent 84px),
          linear-gradient(var(--color-warm-wall) 0.1em, transparent 0.1em)
        `,
        backgroundSize: '100% 1.5em',
        boxShadow: isPeek 
          ? '0 4px 12px rgba(0,0,0,0.2)' 
          : '0 8px 24px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      {/* Margin line hint */}
      <div 
        className="absolute left-8 top-0 bottom-0 w-px bg-border-muted opacity-30"
        aria-hidden="true"
      />

      <header className="mb-6">
        {/* Date stamp */}
        <time 
          dateTime={entry.date} 
          className="mb-3 block font-mono text-xs text-foreground-subtle uppercase tracking-wider"
        >
          {dateStr}
        </time>
        {entry.title && (
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground">
            {entry.title}
          </h2>
        )}
      </header>

      <div 
        className={`text-foreground ${isPeek ? 'line-clamp-6' : ''}`}
        aria-describedby={entry.title ? undefined : `entry-date-${entry._id}`}
      >
        {isPeek ? (
          <p className="leading-relaxed opacity-70">
            {getTextPreview(entry.body, 200)}...
          </p>
        ) : (
          <PortableTextRenderer content={entry.body} />
        )}
      </div>

      {entry.drawers && entry.drawers.length > 0 && !isPeek && (
        <footer className="mt-6 pt-6 border-t border-border-muted">
          <span className="sr-only">Related to: </span>
          <ul className="flex flex-wrap gap-2">
            {entry.drawers.map((drawer) => (
              <li key={drawer._id}>
                <span className="inline-block rounded bg-background-muted px-3 py-1 text-sm text-foreground-muted">
                  {drawer.name}
                </span>
              </li>
            ))}
          </ul>
        </footer>
      )}

      <div id={`entry-date-${entry._id}`} className="sr-only">
        Entry dated {dateStr}
      </div>
    </article>
  )
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

