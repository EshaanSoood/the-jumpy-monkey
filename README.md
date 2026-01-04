# Diary + Drawers

A personal website that functions as a thinking surface, temporal record, and navigable memory.

## Project Status

**Phase 0: Foundation & Setup** ✅ Complete
- Next.js 16 with TypeScript
- Sanity client configured
- Accessibility foundation (skip navigation)
- Project structure established

**Phase 1: Content Schema & CMS** ✅ Complete
- Sanity schemas for Drawer and Diary Entry
- Sanity Studio integrated
- GROQ queries defined
- TypeScript types created
- Data fetching helpers ready

**Phase 2: Core Data Layer** ✅ Complete
- All GROQ queries implemented
- Type-safe data fetching functions
- Error handling for missing Sanity config

**Phase 3: Diary Layer (MVP)** ✅ Complete
- Diary list page with chronological entries
- Diary entry detail pages
- Previous/Next navigation
- PortableText rendering for rich content
- Accessible markup and keyboard navigation
- Responsive CSS styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account (free tier works)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Sanity:
   - Create a new Sanity project at [sanity.io](https://www.sanity.io)
   - Get your project ID from the Sanity dashboard
   - Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. Initialize Sanity (if needed):
```bash
npx sanity init
```
   - Follow the prompts to link your project
   - The schemas are already defined in `/sanity/schemas`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Access Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio) to manage content.

Alternatively, run Sanity Studio standalone:

```bash
npm run studio
```

### Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
/app              # Next.js App Router pages
/components       # React components
  /ui            # Accessible UI primitives
  /diary         # Diary-related components
  /drawers       # Drawer-related components
/lib
  /sanity        # Sanity client and queries
  /utils         # Utility functions
/types           # TypeScript type definitions
```

## Next Steps

See `IMPLEMENTATION_PLAN.md` for the full development roadmap.

**Phase 1** (Next): Set up Sanity schemas for Diary Entries and Drawers.

## Accessibility

This project prioritizes accessibility:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Skip navigation links
- ARIA landmarks

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **CMS**: Sanity (headless)
- **UI Primitives**: Radix UI
- **Styling**: CSS-first approach
- **Date Handling**: date-fns
- **Motion**: Framer Motion (optional)

