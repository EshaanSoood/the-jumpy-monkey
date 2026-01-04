import { sanityClientRead } from './client'
import {
  getAllDiaryEntriesQuery,
  getDiaryEntryBySlugQuery,
  getAllDrawersQuery,
  getDrawerBySlugQuery,
  getDiaryEntriesByDrawerQuery,
  getLatestEntryForDrawerQuery,
  getCurrentMomentQuery,
  getAllMomentsQuery,
  type GetAllDiaryEntriesResult,
  type GetDiaryEntryBySlugResult,
  type GetAllDrawersResult,
  type GetDrawerBySlugResult,
  type GetDiaryEntriesByDrawerResult,
  type GetLatestEntryForDrawerResult,
  type GetCurrentMomentResult,
  type GetAllMomentsResult,
} from './queries'

export async function getAllDiaryEntries(): Promise<GetAllDiaryEntriesResult> {
  return await sanityClientRead.fetch(getAllDiaryEntriesQuery)
}

export async function getDiaryEntryBySlug(
  slug: string
): Promise<GetDiaryEntryBySlugResult> {
  return await sanityClientRead.fetch(getDiaryEntryBySlugQuery, { slug })
}

export async function getAllDrawers(): Promise<GetAllDrawersResult> {
  return await sanityClientRead.fetch(getAllDrawersQuery)
}

export async function getDrawerBySlug(
  slug: string
): Promise<GetDrawerBySlugResult> {
  return await sanityClientRead.fetch(getDrawerBySlugQuery, { slug })
}

export async function getDiaryEntriesByDrawer(
  drawerSlug: string
): Promise<GetDiaryEntriesByDrawerResult> {
  return await sanityClientRead.fetch(getDiaryEntriesByDrawerQuery, {
    drawerSlug,
  })
}

export async function getLatestEntryForDrawer(
  drawerSlug: string
): Promise<GetLatestEntryForDrawerResult> {
  return await sanityClientRead.fetch(getLatestEntryForDrawerQuery, {
    drawerSlug,
  })
}

export async function getCurrentMoment(): Promise<GetCurrentMomentResult> {
  return await sanityClientRead.fetch(getCurrentMomentQuery)
}

export async function getAllMoments(): Promise<GetAllMomentsResult> {
  return await sanityClientRead.fetch(getAllMomentsQuery)
}

