import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Create a placeholder client for build time when projectId is not set
const createSanityClient = () => {
  if (!projectId) {
    // Return a mock client that returns empty arrays/objects
    return {
      fetch: async () => [],
    } as any
  }

  return createClient({
    projectId,
    dataset,
    useCdn: process.env.NODE_ENV === 'production',
    apiVersion: '2024-01-01',
    perspective: 'published',
  })
}

export const sanityClient = createSanityClient()

// For server-side rendering
export const sanityClientRead = createSanityClient()

