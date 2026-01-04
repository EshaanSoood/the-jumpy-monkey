'use client'

import Image from 'next/image'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface BackdropProps {
  imageUrl?: string
  alt?: string
}

export function Backdrop({ imageUrl, alt = '' }: BackdropProps) {
  const prefersReducedMotion = useReducedMotion()

  // If no image URL provided, use a placeholder gradient
  if (!imageUrl) {
    return (
      <div 
        className="fixed inset-0 z-0"
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--color-warm-wall) 0%, var(--color-warm-wall-alt) 50%, var(--color-plant-green) 100%)`,
          }}
        />
        {/* Vignette overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.25), rgba(0,0,0,0.65) 70%)',
          }}
        />
        {/* Readable center glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(221, 202, 176, 0.15), transparent 60%)',
          }}
        />
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-0"
      aria-hidden="true"
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority
        className="object-cover"
        style={{ objectFit: 'cover' }}
      />
      {/* Vignette overlay - darkens corners */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.25), rgba(0,0,0,0.65) 70%)',
        }}
      />
      {/* Readable center glow - subtle light gradient behind diary */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(221, 202, 176, 0.15), transparent 60%)',
        }}
      />
    </div>
  )
}

