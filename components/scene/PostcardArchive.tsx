'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import Image from 'next/image'

interface Postcard {
  _id: string
  imageUrl: string
  date: string
  label?: string
  relatedDiaryEntry?: string
}

interface PostcardArchiveProps {
  postcards: Postcard[]
  onSelectPostcard?: (postcard: Postcard) => void
}

export function PostcardArchive({ postcards, onSelectPostcard }: PostcardArchiveProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const reducedMotion = useReducedMotion()

  if (postcards.length === 0) {
    return null
  }

  // Show top 5-7 postcards in stack
  const visibleStack = postcards.slice(0, Math.min(7, postcards.length))
  const remainingCount = postcards.length - visibleStack.length

  const transition = reducedMotion
    ? { duration: 0.01 } as const
    : { type: 'spring' as const, stiffness: 300, damping: 25 }

  const handlePostcardClick = (postcard: Postcard) => {
    if (onSelectPostcard) {
      onSelectPostcard(postcard)
    } else {
      // Default: expand to show archive
      setIsExpanded(true)
    }
  }

  return (
    <section
      aria-label="Postcard archive"
      className="fixed bottom-8 left-8 z-20 lg:bottom-16 lg:left-16"
    >
      {!isExpanded ? (
        /* Stack view */
        <div className="relative">
          {visibleStack.map((postcard, index) => {
            const offset = index * 4
            const rotation = index % 2 === 0 ? -2 : 2
            const zIndex = visibleStack.length - index

            return (
              <motion.button
                key={postcard._id}
                onClick={() => handlePostcardClick(postcard)}
                aria-label={`Postcard from ${new Date(postcard.date).toLocaleDateString()}${postcard.label ? `: ${postcard.label}` : ''}`}
                className="absolute focus-ring rounded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: index * 0.05 }}
                whileHover={reducedMotion ? {} : { y: -8, zIndex: 100 }}
                style={{
                  left: `${offset}px`,
                  top: `${offset}px`,
                  transform: `rotate(${rotation}deg)`,
                  zIndex,
                  width: '120px',
                  height: '90px',
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded bg-white shadow-lg">
                  <Image
                    src={postcard.imageUrl}
                    alt={postcard.label || `Postcard from ${new Date(postcard.date).toLocaleDateString()}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  {/* Postcard back effect - subtle lines */}
                  <div
                    className="absolute inset-0 border-2 border-white opacity-0 transition-opacity hover:opacity-100"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)
                      `,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </motion.button>
            )
          })}

          {/* Expand button */}
          {remainingCount > 0 && (
            <motion.button
              onClick={() => setIsExpanded(true)}
              aria-label={`Expand archive to see ${remainingCount} more postcards`}
              className="absolute left-0 top-0 flex h-[90px] w-[120px] items-center justify-center rounded bg-background-muted text-xs font-medium text-foreground shadow-lg transition-colors hover:bg-border focus-ring"
              style={{
                left: `${visibleStack.length * 4}px`,
                top: `${visibleStack.length * 4}px`,
                zIndex: 1,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transition}
            >
              +{remainingCount}
            </motion.button>
          )}
        </div>
      ) : (
        /* Expanded list view */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={transition}
          className="w-80 rounded-lg bg-background-muted p-4 shadow-2xl lg:w-96"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Archive</h3>
            <button
              onClick={() => setIsExpanded(false)}
              aria-label="Collapse archive"
              className="rounded p-1 text-foreground transition-colors hover:bg-border focus-ring"
            >
              ✕
            </button>
          </div>

          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {postcards.map((postcard) => (
              <li key={postcard._id}>
                <button
                  onClick={() => {
                    if (onSelectPostcard) {
                      onSelectPostcard(postcard)
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded p-2 text-left transition-colors hover:bg-border focus-ring"
                >
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded bg-white">
                    <Image
                      src={postcard.imageUrl}
                      alt={postcard.label || `Postcard from ${new Date(postcard.date).toLocaleDateString()}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {postcard.label || 'Moment photo'}
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted font-mono">
                      {new Date(postcard.date).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </section>
  )
}

