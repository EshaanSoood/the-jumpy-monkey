import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  console.warn('Warning: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity Studio will not work until configured.')
}

export default defineConfig({
  name: 'diary-drawers',
  title: 'Diary + Drawers',
  projectId: projectId || 'placeholder',
  dataset: dataset,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})

