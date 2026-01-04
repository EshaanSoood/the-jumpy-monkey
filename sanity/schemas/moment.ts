import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'moment',
  title: 'Moment Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for this moment photo',
    }),
    defineField({
      name: 'relatedDiaryEntry',
      title: 'Related Diary Entry',
      type: 'reference',
      to: [{ type: 'diaryEntry' }],
      description: 'Optional link to a related diary entry',
    }),
    defineField({
      name: 'isCurrentMoment',
      title: 'Current Moment',
      type: 'boolean',
      description: 'Check this to display as the main "taped photo" on the wall',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      date: 'date',
      media: 'image',
    },
    prepare({ title, date, media }: { title?: string; date?: string; media?: any }) {
      const dateStr = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title: title || 'Untitled Moment',
        subtitle: dateStr,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date, Newest',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date, Oldest',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
})

