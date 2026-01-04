/**
 * Utility function to extract slug from Sanity slug objects
 * Handles both string slugs and Sanity slug objects with .current property
 */
export function getSlug(slug: string | { current: string }): string {
  return typeof slug === 'string' ? slug : slug.current
}

