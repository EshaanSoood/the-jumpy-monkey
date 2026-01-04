'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import Image from 'next/image'

interface MomentPhotoProps {
  imageUrl?: string
  caption?: string
  date?: string
}

export function MomentPhoto({ imageUrl, caption, date }: MomentPhotoProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const lightboxRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  // Focus trap and keyboard handling for lightbox
  useEffect(() => {
    if (!isLightboxOpen || !lightboxRef.current) return

    const lightbox = lightboxRef.current
    const focusableElements = lightbox.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false)
        return
      }

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

    lightbox.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      lightbox.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen])

  if (!imageUrl) {
    return null
  }

  const transition = reducedMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 300, damping: 25 }

  return (
    <>
      <figure
        className="fixed top-8 left-8 z-20 cursor-pointer lg:top-16 lg:left-16"
        style={{
          transform: 'rotate(-2deg)',
        }}
      >
        <motion.button
          onClick={() => setIsLightboxOpen(true)}
          onFocus={() => {}}
          aria-label={`View moment photo${caption ? `: ${caption}` : ''}`}
          className="relative block focus-ring rounded"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          style={{
            // Taped photo effect
            padding: '8px',
            background: 'var(--color-warm-wall-alt)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {/* Tape strips at top corners */}
          <div
            className="absolute -top-1 left-4 z-10 h-3 w-8 bg-white opacity-60"
            style={{
              transform: 'rotate(-15deg)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -top-1 right-4 z-10 h-3 w-8 bg-white opacity-60"
            style={{
              transform: 'rotate(15deg)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
            aria-hidden="true"
          />

          {/* Photo */}
          <div className="relative aspect-[4/3] w-48 overflow-hidden rounded bg-white lg:w-64">
            <Image
              src={imageUrl}
              alt={caption || 'Moment photo'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 192px, 256px"
            />
          </div>

          {/* Photo border */}
          <div
            className="absolute inset-0 border-2 border-white"
            style={{ borderColor: 'rgba(255, 255, 255, 0.8)' }}
            aria-hidden="true"
          />
        </motion.button>

        {(caption || date) && (
          <figcaption className="mt-2 max-w-[192px] text-xs text-foreground-muted lg:max-w-[256px]">
            {caption && <span>{caption}</span>}
            {date && (
              <span className="block mt-1 font-mono text-[10px]">
                {new Date(date).toLocaleDateString()}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={caption || 'Moment photo'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={transition}
              className="relative max-h-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close lightbox"
                className="absolute -top-12 right-0 rounded bg-white px-4 py-2 text-foreground transition-colors hover:bg-gray-200 focus-ring"
              >
                Close ✕
              </button>
              <div className="relative aspect-video w-full overflow-hidden rounded bg-white">
                <Image
                  src={imageUrl}
                  alt={caption || 'Moment photo'}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              {(caption || date) && (
                <div className="mt-4 rounded bg-white p-4 text-center">
                  {caption && <p className="text-foreground">{caption}</p>}
                  {date && (
                    <p className="mt-2 text-sm text-foreground-muted">
                      {new Date(date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

