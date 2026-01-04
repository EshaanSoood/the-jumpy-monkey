import { PortableTextBlock } from '@portabletext/types'

export interface Drawer {
  _id: string
  _type: 'drawer'
  _createdAt: string
  _updatedAt: string
  _rev: string
  name: string
  slug: string | { current: string }
  description?: string
  type: 'project' | 'theme'
  order?: number
}

export interface DiaryEntry {
  _id: string
  _type: 'diaryEntry'
  _createdAt: string
  _updatedAt: string
  _rev: string
  title?: string
  date: string
  body: PortableTextBlock[]
  drawers?: Array<{
    _ref: string
    _type: 'reference'
    _weak?: boolean
  }>
  slug: string | { current: string }
}

export interface DiaryEntryWithDrawers extends Omit<DiaryEntry, 'drawers'> {
  drawers?: Drawer[]
}

