
# Product Requirements Document (PRD)

**Working title:** *Diary + Drawers* (name intentionally neutral)

## 1. Product Overview

### Purpose

Create a personal website that functions as:

* A **public diary of concrete thoughts** (not frequent, not performative)
* A **home for multifaceted work and interests**
* A **non-social-media space** for people who want to follow closely
* A system that **reflects linked, evolving thinking** without requiring manual indexing

This is **not**:

* A blog
* A feed
* A portfolio
* A social platform

This **is**:

* A thinking surface
* A temporal record
* A navigable memory
* A place where ideas, projects, and curiosities coexist naturally

---

## 2. Core Mental Model (Critical)

The site is composed of **two primary UX layers**:

1. **Diary (Present Layer)**

   * What’s alive *now*
   * Chronological
   * Low-frequency, high-intent entries
   * Each entry may touch multiple projects, ideas, or interests

2. **Drawers (Contextual Layers)**

   * Long-lived themes, projects, or facets
   * Each drawer accumulates related diary entries over time
   * Each drawer can be “opened” to explore its own temporal evolution

The key idea:

> **You write once (diary), the system sorts contextually (drawers).**

---

## 3. User Types

### Primary User

* The site owner (you)
* Blind / screen-reader user
* Needs **extremely low friction publishing**
* Must not require manual curation, indexing, or visual design work

### Secondary Users

* Close followers
* Curious peers
* People interested in *how you think*, not just what you ship

They are:

* Comfortable exploring
* Not expecting constant updates
* Interested in evolution, not polish

---

## 4. Core UX Components

### 4.1 Diary (Main Experience)

**Function**

* Central, default experience
* Chronological list of diary entries
* Ordered by date (newest first)

**Diary Entry Characteristics**

* Free-form text (primary)
* Optional embeds (links, audio, video)
* Written whenever a “concrete thought happens”
* No expectation of frequency

**Diary Entry Metadata (lightweight)**

* Date (required)
* Title (optional)
* Associated drawers (optional, minimal effort)

**UX Requirements**

* Reads like a diary, not a feed
* One entry at a time when focused
* Easy navigation between entries
* Fully accessible via screen reader and keyboard

---

### 4.2 Drawers (Secondary, Persistent Context)

**What is a Drawer**
A drawer represents:

* A project (podcast, YouTube, book, music, teaching)
* Or a recurring theme / interest (e.g. books you’re reading)

Examples:

* Podcast
* YouTube Channel
* Music Teaching Business
* Personal Music
* Book Writing
* Reading / Influences

**Drawer Behavior**

* Each drawer automatically collects diary entries that reference it
* Drawers are not manually curated timelines
* Drawers grow over time

---

### 4.3 Drawer UX (Critical Detail)

**Default State**

* Shows the *latest* relevant diary entry for that drawer
* Represents the “current state” of that facet

**Expanded State**

* User can “pull out” the drawer
* Drawer becomes its own focused view

**Inside a Drawer**

* Entries are stacked by date
* Only one entry is shown at a time
* User can:

  * Move backward / forward through time
  * Experience how that project or idea evolved

**Key Constraint**

* No overwhelming lists
* No grids
* No dense timelines
* Temporal navigation is **sequential and intentional**

---

## 5. Interaction Between Diary and Drawers

* Diary entries can belong to multiple drawers
* A single diary entry:

  * Might mention a book
  * Reference a podcast episode
  * Trigger thoughts relevant to music or writing
* That one entry appears:

  * Once in the diary
  * Contextually inside multiple drawers

**Important**

* You do not manually place entries into drawers after the fact
* Association must be trivial at writing time (e.g. selecting from a short list)

---

## 6. Content Types (CMS-Level)

At minimum:

### 6.1 Diary Entry

* Body (rich text / markdown)
* Date
* Optional title
* Optional drawer references (multi-select)

### 6.2 Drawer

* Name
* Description (optional)
* Type (project / theme)
* Ordering / prominence (optional)

Drawers are **stable**, diary entries are **temporal**.

---

## 7. Accessibility Requirements (Non-Negotiable)

* Fully usable with screen readers
* Logical heading structure
* Keyboard-only navigation
* No reliance on spatial metaphors that are only visual
* Drawer metaphors must be:

  * Semantic
  * Described textually
  * Navigable programmatically

Visual styling is secondary to **structural clarity**.

---

## 8. Technical Stack (Aligned with Constraints)

### Frontend

* Next.js
* React
* Accessible component primitives (e.g. Headless UI, Radix)

### CMS

* Sanity (headless)
* Custom schemas designed to:

  * Minimize required fields
  * Feel like “typing in a document”
  * Avoid complex editorial workflows

### Styling / Motion

* CSS-first
* Optional Framer Motion for transitions
* No requirement for custom vector illustration work

---

## 9. Non-Goals (Explicit)

* Daily posting
* Social interaction (likes, comments, feeds)
* SEO-first content strategy
* Monetization (for now)
* Visual novelty at the expense of usability

---

## 10. Success Criteria

The product is successful if:

* You can publish an entry as easily as writing in a text editor
* You never feel resistance to “structuring” thoughts
* Visitors understand:

  * What you’re thinking about *now*
  * How each facet has evolved over time
* The site feels like:

  > “Following a mind, not consuming content”

---

If you want, next we can:

* Translate this PRD into **Sanity schemas**
* Design the **exact screen-reader-friendly navigation model**
* Define the **minimum viable version (V1)** vs future iterations

