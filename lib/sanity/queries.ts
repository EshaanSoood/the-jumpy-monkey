import { groq } from 'next-sanity'
import type { DiaryEntry, Drawer, DiaryEntryWithDrawers } from '@/types/sanity'

export interface Moment {
  _id: string
  _type: 'moment'
  _createdAt: string
  _updatedAt: string
  date: string
  caption?: string
  imageUrl?: string
  imageAlt?: string
  relatedDiaryEntry?: string
  isCurrentMoment?: boolean
}

// Get all diary entries, newest first
export const getAllDiaryEntriesQuery = groq`
  *[_type == "diaryEntry"] | order(date desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    date,
    body,
    "slug": slug.current,
    drawers[]-> {
      _id,
      name,
      "slug": slug.current,
      type
    }
  }
`

// Get a single diary entry by slug
export const getDiaryEntryBySlugQuery = groq`
  *[_type == "diaryEntry" && slug.current == $slug][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    date,
    body,
    "slug": slug.current,
    drawers[]-> {
      _id,
      name,
      "slug": slug.current,
      type,
      description
    }
  }
`

// Get all drawers
export const getAllDrawersQuery = groq`
  *[_type == "drawer"] | order(order asc, name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    "slug": slug.current,
    description,
    type,
    order
  }
`

// Get a single drawer by slug
export const getDrawerBySlugQuery = groq`
  *[_type == "drawer" && slug.current == $slug][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    "slug": slug.current,
    description,
    type,
    order
  }
`

// Get diary entries for a specific drawer, ordered by date (newest first)
export const getDiaryEntriesByDrawerQuery = groq`
  *[_type == "diaryEntry" && references(*[_type == "drawer" && slug.current == $drawerSlug]._id)] | order(date desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    date,
    body,
    "slug": slug.current,
    drawers[]-> {
      _id,
      name,
      "slug": slug.current,
      type
    }
  }
`

// Get the latest diary entry for a specific drawer
export const getLatestEntryForDrawerQuery = groq`
  *[_type == "diaryEntry" && references(*[_type == "drawer" && slug.current == $drawerSlug]._id)] | order(date desc)[0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    date,
    body,
    "slug": slug.current,
    drawers[]-> {
      _id,
      name,
      "slug": slug.current,
      type
    }
  }
`

// Get current moment photo (the one marked as current)
export const getCurrentMomentQuery = groq`
  *[_type == "moment" && isCurrentMoment == true] | order(date desc)[0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    date,
    caption,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    relatedDiaryEntry
  }
`

// Get all moment photos for postcard archive (excluding current)
export const getAllMomentsQuery = groq`
  *[_type == "moment"] | order(date desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    date,
    caption,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    relatedDiaryEntry,
    isCurrentMoment
  }
`

// Type helpers for query results
export type GetAllDiaryEntriesResult = DiaryEntryWithDrawers[]
export type GetDiaryEntryBySlugResult = DiaryEntryWithDrawers | null
export type GetAllDrawersResult = Drawer[]
export type GetDrawerBySlugResult = Drawer | null
export type GetDiaryEntriesByDrawerResult = DiaryEntryWithDrawers[]
export type GetLatestEntryForDrawerResult = DiaryEntryWithDrawers | null
export type GetCurrentMomentResult = Moment | null
export type GetAllMomentsResult = Moment[]
