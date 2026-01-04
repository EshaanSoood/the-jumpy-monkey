# Implementation Plan: Diary + Drawers

## Overview

This plan breaks down the PRD into actionable phases, prioritizing accessibility, low-friction publishing, and the core mental model of Diary (temporal) + Drawers (contextual).

---

## Phase 0: Foundation & Setup

### Goals
- Set up development environment
- Configure core dependencies
- Establish project structure

### Tasks

#### 0.1 Project Initialization
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository (if not already)
- [ ] Create basic folder structure:
  ```
  /app (Next.js App Router)
  /components
    /ui (accessible primitives)
    /diary
    /drawers
  /lib
    /sanity
    /utils
  /types
  /styles
  ```

#### 0.2 Core Dependencies
- [ ] Install Next.js, React, TypeScript
- [ ] Install Sanity client libraries (`@sanity/client`, `next-sanity`)
- [ ] Install accessible UI primitives (`@headlessui/react` or `@radix-ui/react-*`)
- [ ] Install styling solution (CSS Modules or Tailwind)
- [ ] Install Framer Motion (optional, for transitions)
- [ ] Install date handling library (`date-fns` or similar)

#### 0.3 Sanity Setup
- [ ] Initialize Sanity project
- [ ] Configure Sanity Studio (local development)
- [ ] Set up environment variables for Sanity project ID and dataset
- [ ] Configure Sanity client for Next.js

#### 0.4 Accessibility Foundation
- [ ] Set up ARIA landmark structure
- [ ] Create skip navigation component
- [ ] Establish keyboard navigation patterns
- [ ] Set up screen reader testing tools/config

**Deliverable:** Working Next.js app with Sanity connection, accessible structure in place

---

## Phase 1: Content Schema & CMS (MVP)

### Goals
- Define Sanity schemas for Diary Entries and Drawers
- Create minimal, low-friction content creation experience
- Ensure schemas support the core mental model

### Tasks

#### 1.1 Sanity Schema: Drawer
- [ ] Create `drawer` schema with:
  - `name` (string, required)
  - `slug` (slug, auto-generated from name)
  - `description` (text, optional)
  - `type` (string, options: "project" | "theme")
  - `order` (number, optional, for manual ordering)
- [ ] Configure preview in Sanity Studio
- [ ] Test drawer creation workflow

#### 1.2 Sanity Schema: Diary Entry
- [ ] Create `diaryEntry` schema with:
  - `title` (string, optional)
  - `date` (datetime, required, default to now)
  - `body` (block content / markdown, required)
  - `drawers` (array of references to drawer, optional)
  - `slug` (slug, auto-generated from date + title)
- [ ] Configure rich text editor (minimal, markdown-friendly)
- [ ] Configure preview in Sanity Studio
- [ ] Test entry creation workflow

#### 1.3 Sanity Studio Customization
- [ ] Customize Studio UI for minimal friction:
  - Simplify field visibility
  - Set sensible defaults
  - Optimize for keyboard navigation
- [ ] Create custom input components if needed (e.g., drawer multi-select)
- [ ] Test content creation flow end-to-end

**Deliverable:** Functional Sanity CMS with both schemas, content can be created and queried

---

## Phase 2: Core Data Layer

### Goals
- Build data fetching layer
- Create utility functions for querying diary entries and drawers
- Implement relationship logic (entries → drawers)

### Tasks

#### 2.1 Sanity Queries
- [ ] Create GROQ queries:
  - `getAllDiaryEntries` (chronological, newest first)
  - `getDiaryEntryBySlug`
  - `getAllDrawers`
  - `getDrawerBySlug`
  - `getDiaryEntriesByDrawer` (for drawer view)
  - `getLatestEntryForDrawer` (for drawer default state)
- [ ] Create TypeScript types from schemas
- [ ] Set up type-safe query helpers

#### 2.2 Data Utilities
- [ ] Create `lib/sanity/queries.ts` with all queries
- [ ] Create `lib/sanity/client.ts` for client instance
- [ ] Create `lib/utils/date.ts` for date formatting
- [ ] Create `lib/utils/drawers.ts` for drawer-related helpers

#### 2.3 Next.js Data Fetching
- [ ] Set up ISR (Incremental Static Regeneration) strategy
- [ ] Configure revalidation for Sanity webhooks (optional, Phase 1)
- [ ] Create API routes if needed (or use direct client-side fetching)

**Deliverable:** Complete data layer with type-safe queries, ready for UI consumption

---

## Phase 3: Diary Layer (MVP)

### Goals
- Build the primary Diary experience
- Implement chronological entry display
- Ensure full accessibility and keyboard navigation

### Tasks

#### 3.1 Diary Page Structure
- [ ] Create `/app/diary/page.tsx` (or `/app/page.tsx` as default)
- [ ] Implement chronological list of entries (newest first)
- [ ] Create `DiaryEntryCard` component:
  - Shows date, optional title, body preview
  - Links to full entry view
  - Accessible markup (semantic HTML, ARIA)
- [ ] Implement pagination or "load more" (if needed for MVP)

#### 3.2 Diary Entry Detail Page
- [ ] Create `/app/diary/[slug]/page.tsx`
- [ ] Display full entry:
  - Date, title (if present)
  - Full body content (render markdown/rich text)
  - Associated drawers (links)
- [ ] Implement navigation:
  - Previous/Next entry buttons (keyboard accessible)
  - Back to diary list
- [ ] Ensure proper heading hierarchy

#### 3.3 Accessibility Implementation
- [ ] Add skip navigation link
- [ ] Implement keyboard navigation (Tab, Arrow keys for entry navigation)
- [ ] Add ARIA labels and landmarks
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Ensure focus management between entries

#### 3.4 Styling (Diary)
- [ ] Create minimal, readable styles
- [ ] Ensure high contrast for accessibility
- [ ] Implement responsive layout
- [ ] Add subtle transitions (if using Framer Motion)

**Deliverable:** Fully functional Diary layer, accessible, with entry detail pages

---

## Phase 4: Drawers Layer (MVP)

### Goals
- Build Drawer default state (shows latest entry)
- Build Drawer expanded view (sequential navigation)
- Implement drawer → entry relationships

### Tasks

#### 4.1 Drawer List/Overview
- [ ] Create `/app/drawers/page.tsx` (or sidebar/navigation)
- [ ] Display all drawers
- [ ] Each drawer shows:
  - Name, description
  - Latest entry preview (default state)
  - Link to expand drawer

#### 4.2 Drawer Default State Component
- [ ] Create `DrawerCard` component:
  - Shows drawer name
  - Shows latest relevant diary entry
  - "Open drawer" button/link (accessible)
- [ ] Implement query for latest entry per drawer

#### 4.3 Drawer Expanded View
- [ ] Create `/app/drawers/[slug]/page.tsx`
- [ ] Display drawer context:
  - Drawer name and description
  - Current entry (one at a time)
  - Navigation controls:
    - Previous entry (chronologically backward)
    - Next entry (chronologically forward)
    - Close drawer (back to overview)
- [ ] Implement sequential navigation logic
- [ ] Ensure only one entry visible at a time

#### 4.4 Drawer Navigation UX
- [ ] Implement keyboard shortcuts:
  - Arrow keys for prev/next
  - Escape to close
- [ ] Add ARIA live regions for navigation announcements
- [ ] Ensure focus management
- [ ] Test sequential flow with screen reader

#### 4.5 Styling (Drawers)
- [ ] Style drawer cards (default state)
- [ ] Style drawer expanded view
- [ ] Ensure visual distinction between diary and drawer contexts
- [ ] Maintain accessibility standards

**Deliverable:** Functional Drawers layer with default and expanded states, sequential navigation

---

## Phase 5: Integration & Cross-Linking

### Goals
- Connect Diary and Drawers
- Implement cross-references
- Ensure entries appear in correct drawers

### Tasks

#### 5.1 Entry → Drawer Links
- [ ] In diary entry detail, show associated drawers
- [ ] Make drawer links navigate to drawer view (with entry highlighted/active)
- [ ] Ensure drawer links are accessible

#### 5.2 Drawer → Entry Context
- [ ] When viewing entry in drawer, show it's also in diary
- [ ] Add "View in diary" link from drawer entry view
- [ ] Maintain navigation context (where did user come from?)

#### 5.3 Navigation Structure
- [ ] Create site-wide navigation:
  - Link to Diary (home)
  - Link to Drawers
  - Skip navigation
- [ ] Ensure consistent navigation across all pages
- [ ] Implement breadcrumbs (if helpful for accessibility)

#### 5.4 URL Structure
- [ ] Finalize URL patterns:
  - `/` or `/diary` → Diary list
  - `/diary/[slug]` → Diary entry
  - `/drawers` → Drawers overview
  - `/drawers/[slug]` → Drawer expanded (latest entry)
  - `/drawers/[slug]/entry/[entry-slug]` → Specific entry in drawer context (optional)
- [ ] Ensure clean, semantic URLs

**Deliverable:** Fully integrated Diary + Drawers experience with cross-linking

---

## Phase 6: Polish & Refinement

### Goals
- Refine UX based on testing
- Optimize performance
- Enhance accessibility
- Add subtle motion (if desired)

### Tasks

#### 6.1 Performance Optimization
- [ ] Implement proper caching strategies
- [ ] Optimize images (if any)
- [ ] Minimize bundle size
- [ ] Test Core Web Vitals

#### 6.2 Accessibility Audit
- [ ] Run automated accessibility tests (axe, Lighthouse)
- [ ] Manual screen reader testing (all major readers)
- [ ] Keyboard-only navigation testing
- [ ] Fix any identified issues

#### 6.3 Content Rendering
- [ ] Ensure markdown/rich text renders correctly
- [ ] Handle embeds (links, audio, video) if needed
- [ ] Test edge cases (empty states, single entry, etc.)

#### 6.4 Motion & Transitions (Optional)
- [ ] Add subtle transitions between entries (Framer Motion)
- [ ] Ensure motion respects `prefers-reduced-motion`
- [ ] Test transitions don't break screen reader flow

#### 6.5 Error Handling
- [ ] Handle 404s gracefully
- [ ] Handle missing drawer associations
- [ ] Add helpful error messages (accessible)

**Deliverable:** Polished, performant, fully accessible MVP

---

## Phase 7: Deployment & Infrastructure

### Goals
- Deploy to production
- Set up CI/CD
- Configure Sanity webhooks for revalidation

### Tasks

#### 7.1 Deployment Setup
- [ ] Choose hosting (Vercel recommended for Next.js)
- [ ] Configure environment variables
- [ ] Set up production Sanity dataset
- [ ] Deploy Next.js app

#### 7.2 Sanity Studio Deployment
- [ ] Deploy Sanity Studio (separate or embedded)
- [ ] Configure authentication
- [ ] Test content creation in production

#### 7.3 Revalidation Strategy
- [ ] Set up Sanity webhooks
- [ ] Configure ISR revalidation on content updates
- [ ] Test content updates propagate correctly

#### 7.4 Monitoring & Analytics (Optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add basic analytics (privacy-respecting)
- [ ] Monitor performance

**Deliverable:** Live, production-ready site

---

## Technical Considerations

### Accessibility Checklist (Throughout All Phases)
- [ ] Semantic HTML (`<article>`, `<nav>`, `<main>`, etc.)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA labels where needed
- [ ] Keyboard navigation (Tab, Arrow keys, Escape)
- [ ] Focus indicators
- [ ] Screen reader announcements
- [ ] Skip navigation
- [ ] High contrast ratios
- [ ] No reliance on color alone
- [ ] `prefers-reduced-motion` support

### Content Creation Friction Reduction
- [ ] Sensible defaults (date = now, drawers = optional)
- [ ] Minimal required fields
- [ ] Quick drawer selection (autocomplete/search)
- [ ] Markdown support for body
- [ ] Preview in Sanity Studio

### Performance Targets
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Lighthouse Accessibility score > 95
- [ ] Lighthouse Performance score > 90

---

## MVP Scope Definition

### Must-Have (V1)
- ✅ Diary entries (create, list, view)
- ✅ Drawers (create, list)
- ✅ Entry → Drawer association
- ✅ Drawer default state (latest entry)
- ✅ Drawer expanded view (sequential navigation)
- ✅ Full keyboard + screen reader accessibility
- ✅ Basic styling (readable, accessible)

### Nice-to-Have (Post-MVP)
- Search functionality
- Tags/categories beyond drawers
- Entry drafts
- Rich media embeds (beyond basic links)
- Custom drawer ordering UI
- Analytics dashboard
- RSS feed
- Export functionality

---

## Risk Mitigation

### Potential Challenges
1. **Sanity Schema Complexity**: Start minimal, iterate
2. **Accessibility Gaps**: Test early and often with real screen readers
3. **Performance with Many Entries**: Implement pagination/ISR early
4. **Drawer Association UX**: Prototype drawer selection early, get feedback

### Mitigation Strategies
- Build incrementally, test each phase
- Use TypeScript for type safety
- Test accessibility from Phase 3 onward
- Keep schemas simple, extend later if needed

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize phases** (can some be parallelized?)
3. **Set up Phase 0** (foundation)
4. **Begin Phase 1** (Sanity schemas)

---

## Questions to Resolve

- [ ] Should Diary be the home page (`/`) or `/diary`?
- [ ] How should drawer selection work in Sanity Studio? (autocomplete, checkboxes, tags?)
- [ ] Should there be a "latest entries" preview on home?
- [ ] What's the exact URL structure preference?
- [ ] Should drawers have their own home page or be accessible from Diary?

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Status:** Draft - Ready for Review

