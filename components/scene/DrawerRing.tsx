'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { formatDate } from '@/lib/utils/date'
import { getSlug } from '@/lib/utils/slug'
import type { Drawer, DiaryEntryWithDrawers } from '@/types/sanity'

interface DrawerRingProps {
  drawers: Drawer[]
  drawerEntries: Record<string, DiaryEntryWithDrawers[]>
}

export function DrawerRing({ drawers, drawerEntries }: DrawerRingProps) {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const drawerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  const openDrawer = (drawerId: string) => {
    setOpenDrawerId(drawerId)
    setMobileMenuOpen(false)
  }

  const closeDrawer = () => {
    const previousId = openDrawerId
    setOpenDrawerId(null)
    // Return focus to the handle that opened it
    if (previousId && drawerRefs.current[previousId]) {
      drawerRefs.current[previousId]?.focus()
    }
  }

  // ESC key to close drawer
  useEffect(() => {
    if (!openDrawerId) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const previousId = openDrawerId
        setOpenDrawerId(null)
        // Return focus to the handle that opened it
        setTimeout(() => {
          if (previousId && drawerRefs.current[previousId]) {
            drawerRefs.current[previousId]?.focus()
          }
        }, 0)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [openDrawerId])

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!openDrawerId || !panelRef.current) return

    const panel = panelRef.current
    const focusableElements = panel.querySelectorAll<HTMLElement>(
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

    panel.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      panel.removeEventListener('keydown', handleKeyDown)
    }
  }, [openDrawerId])

  // Close drawer on outside click
  useEffect(() => {
    if (!openDrawerId) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !Object.values(drawerRefs.current).some(
          (ref) => ref && ref.contains(event.target as Node)
        )
      ) {
        closeDrawer()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDrawerId])

  const sortedDrawers = [...drawers].sort((a, b) => (a.order || 0) - (b.order || 0))

  // Desktop layout: position drawers around diary
  // Mobile: single button that opens a menu
  return (
    <nav aria-label="Drawers navigation" className="fixed inset-0 pointer-events-none z-20">
      {drawers.length === 0 ? (
        <div className="sr-only">No drawers available</div>
      ) : (
        <>
          {/* Mobile: Single drawer button */}
          <div className="fixed top-4 right-4 z-30 lg:hidden pointer-events-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={`Open drawers menu${drawers.length > 0 ? `, ${drawers.length} drawer${drawers.length === 1 ? '' : 's'} available` : ''}`}
              aria-expanded={mobileMenuOpen}
              className="rounded-lg bg-background-muted px-4 py-2 font-medium text-foreground shadow-lg transition-colors hover:bg-border focus-ring"
            >
              Drawers {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={reducedMotion ? { duration: 0.01 } : { duration: 0.2 }}
            className="fixed top-16 right-4 z-30 w-64 rounded-lg bg-background-muted p-4 shadow-2xl lg:hidden"
          >
            <ul className="space-y-2">
              {sortedDrawers.map((drawer) => (
                <li key={drawer._id}>
                  <button
                    onClick={() => openDrawer(drawer._id)}
                    className="w-full rounded px-3 py-2 text-left font-medium text-foreground transition-colors hover:bg-border focus-ring"
                  >
                    {drawer.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Drawer handles positioned around diary */}
      <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block">
        {/* Left column */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4">
          {sortedDrawers.slice(0, Math.ceil(sortedDrawers.length / 2)).map((drawer) => (
            <DrawerHandle
              key={drawer._id}
              drawer={drawer}
              isOpen={openDrawerId === drawer._id}
              onOpen={() => openDrawer(drawer._id)}
              ref={(el) => {
                drawerRefs.current[drawer._id] = el
              }}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
          {sortedDrawers.slice(Math.ceil(sortedDrawers.length / 2)).map((drawer) => (
            <DrawerHandle
              key={drawer._id}
              drawer={drawer}
              isOpen={openDrawerId === drawer._id}
              onOpen={() => openDrawer(drawer._id)}
              ref={(el) => {
                drawerRefs.current[drawer._id] = el
              }}
            />
          ))}
        </div>
      </div>

      {/* Drawer panels */}
      <AnimatePresence>
        {openDrawerId && (
          <DrawerPanel
            drawer={sortedDrawers.find((d) => d._id === openDrawerId)!}
            entries={drawerEntries[openDrawerId] || []}
            onClose={closeDrawer}
            ref={panelRef}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>
        </>
      )}
    </nav>
  )
}

interface DrawerHandleProps {
  drawer: Drawer
  isOpen: boolean
  onOpen: () => void
}

const DrawerHandle = forwardRef<HTMLButtonElement, DrawerHandleProps>(
  ({ drawer, isOpen, onOpen }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onOpen}
        aria-label={`Open ${drawer.name} drawer`}
        aria-expanded={isOpen}
        aria-controls={`drawer-panel-${drawer._id}`}
        className="pointer-events-auto rounded-lg bg-[var(--color-warm-wall-alt)] px-4 py-2 font-medium text-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl focus-ring"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {drawer.name}
      </button>
    )
  }
)
DrawerHandle.displayName = 'DrawerHandle'

interface DrawerPanelProps {
  drawer: Drawer
  entries: DiaryEntryWithDrawers[]
  onClose: () => void
  reducedMotion: boolean
}

const DrawerPanel = forwardRef<HTMLDivElement, DrawerPanelProps>(
  ({ drawer, entries, onClose, reducedMotion }, ref) => {
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0)
    const currentEntry = entries[currentEntryIndex] || null

    const canGoPrevious = currentEntryIndex > 0
    const canGoNext = currentEntryIndex < entries.length - 1

    const goPrevious = () => {
      if (canGoPrevious) setCurrentEntryIndex(currentEntryIndex - 1)
    }

    const goNext = () => {
      if (canGoNext) setCurrentEntryIndex(currentEntryIndex + 1)
    }

    const panelVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: 0.95,
      },
    }

    const transition = reducedMotion
      ? { duration: 0.01 } as const
      : { type: 'spring' as const, stiffness: 300, damping: 30 }

    return (
      <motion.div
        ref={ref}
        id={`drawer-panel-${drawer._id}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${drawer.name} drawer`}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
        className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={transition}
          className="relative max-h-full w-full max-w-4xl bg-[var(--color-warm-wall-alt)] shadow-2xl rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
          }}
        >
          <div className="flex h-full max-h-[90vh] flex-col">
            {/* Header */}
            <header className="border-b border-border-muted p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">{drawer.name}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded p-2 text-foreground transition-colors hover:bg-border focus-ring"
                >
                  ✕
                </button>
              </div>
              {drawer.description && (
                <p className="mt-2 text-sm text-foreground-muted">{drawer.description}</p>
              )}
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
            {entries.length === 0 ? (
              <p className="text-foreground-muted">No entries in this drawer yet.</p>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">
                    Entry {currentEntryIndex + 1} of {entries.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={goPrevious}
                      disabled={!canGoPrevious}
                      aria-label="Previous entry"
                      className="rounded px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-border focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!canGoNext}
                      aria-label="Next entry"
                      className="rounded px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-border focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>

                {currentEntry && (
                  <article>
                    <time
                      dateTime={currentEntry.date}
                      className="mb-2 block text-sm text-foreground-subtle"
                    >
                      {formatDate(currentEntry.date)}
                    </time>
                    {currentEntry.title && (
                      <h3 className="mb-4 text-xl font-semibold text-foreground">
                        {currentEntry.title}
                      </h3>
                    )}
                    <div className="text-foreground">
                      <p className="leading-relaxed line-clamp-6">
                        {getTextPreview(currentEntry.body, 300)}...
                      </p>
                    </div>
                    <footer className="mt-4">
                      <a
                        href={`/diary/${getSlug(currentEntry.slug)}`}
                        className="text-sm font-medium text-accent underline-offset-2 hover:no-underline focus-ring"
                      >
                        Read full entry →
                      </a>
                    </footer>
                  </article>
                )}
              </>
            )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }
)
DrawerPanel.displayName = 'DrawerPanel'

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

