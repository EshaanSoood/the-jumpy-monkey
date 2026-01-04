# Graphic Design Instructions: Desk-Themed Diary & Drawer Graphics

## Project Overview
This is a personal journaling website with two main sections: **Diary** (chronological entries) and **Drawers** (long-lived themes/projects). The design should evoke the feeling of a physical desk workspace where someone keeps a diary and organizes thoughts in drawers.

## Design Concept
Create graphics that make the digital interface feel like it's sitting on a real desk surface. The aesthetic should be warm, inviting, and tactile—think of a well-used wooden desk with a journal and filing drawers.

---

## Required Graphics & Specifications

### 1. Desk Surface Background
**Purpose:** Main background texture/pattern for the entire site

**Specifications:**
- **Dimensions:** Provide multiple sizes:
  - Desktop: 1920px × 1080px (minimum)
  - Tablet: 1024px × 768px
  - Mobile: 375px × 667px
- **Style:** 
  - Wood grain texture (warm tones: light oak, walnut, or maple)
  - Subtle, not overpowering—should allow text to remain readable
  - Natural lighting from one side (suggest top-left or top-right)
  - Slight wear/patina for authenticity
- **Format:** PNG with transparency or JPG
- **File naming:** `desk-surface-[size].jpg` or `desk-surface-[size].png`
- **Notes:** Consider creating a seamless/repeatable pattern version for tiling

---

### 2. Diary/Journal Book Graphic
**Purpose:** Visual representation for diary entries—used on diary listing pages and individual entry pages

**Specifications:**
- **Dimensions:** 
  - Large: 400px × 600px (for hero/featured areas)
  - Medium: 200px × 300px (for cards)
  - Small: 100px × 150px (for icons/badges)
- **Style:**
  - Open journal/book with visible pages
  - Pages should look like they have handwritten or typed text (subtle, not readable)
  - Binding visible (spiral, stitched, or perfect-bound)
  - Slight shadow/3D effect to lift it off the desk
  - Warm paper tones (cream, off-white, light beige)
- **Perspective:** Slight angle (3/4 view) as if sitting on the desk
- **Format:** PNG with transparency
- **File naming:** `diary-book-[size].png`
- **Variations needed:**
  - Closed journal (for empty states or icons)
  - Open journal (for active/content states)
  - Multiple angles if possible (front view, side view)

---

### 3. Drawer Graphics
**Purpose:** Visual representation for drawers—used on drawer listing pages and individual drawer pages

**Specifications:**
- **Dimensions:**
  - Large: 400px × 300px (for hero/featured areas)
  - Medium: 200px × 150px (for cards)
  - Small: 80px × 60px (for icons/badges)
- **Style:**
  - Filing cabinet drawer or desk drawer
  - Drawer should appear slightly open (pulled out 20-30%)
  - Visible drawer handle/pull (brass, wood, or metal)
  - Interior visible with subtle file tabs or organized papers
  - Wood grain matching the desk surface
  - Shadow to create depth
- **Perspective:** Front-facing or slight 3/4 angle
- **Format:** PNG with transparency
- **File naming:** `drawer-[size].png`
- **Variations needed:**
  - Closed drawer (for empty states)
  - Partially open drawer (for active/content states)
  - Fully open drawer (optional, for detailed views)
  - Multiple drawer stack (optional, for showing multiple drawers)

---

### 4. Desk Accessories (Optional but Recommended)
**Purpose:** Add atmosphere and context to the desk scene

**Suggestions:**
- **Pen/Pencil:** Simple, elegant writing instrument
  - Dimensions: Various sizes (icon to hero)
  - Style: Classic fountain pen or wooden pencil
  - Format: PNG with transparency
  
- **Paper Clips or Staples:** Small decorative elements
  - Dimensions: Small icons (40px × 40px)
  - Style: Minimalist, clean
  - Format: PNG with transparency

- **Desk Lamp:** Optional atmospheric element
  - Dimensions: Medium (200px × 300px)
  - Style: Vintage or modern desk lamp
  - Format: PNG with transparency

**File naming:** `desk-[accessory-name]-[size].png`

---

## Color Palette Reference
The site uses a clean, minimal color scheme. Graphics should complement:
- **Background:** White/cream (#ffffff, #f9f9f9)
- **Foreground:** Black/dark gray (#000000, #666666)
- **Accent:** Blue (#0066cc)
- **Desk wood:** Warm browns (suggest #d4a574, #c9a961, or similar oak/walnut tones)

---

## Technical Requirements

### File Formats
- **Primary:** PNG with transparency (for graphics that overlay content)
- **Secondary:** JPG (for backgrounds if transparency not needed)
- **Optional:** SVG (for scalable icons, if preferred)

### Resolution & Quality
- **Standard:** 2x resolution for retina displays (e.g., if displaying at 200px, provide 400px source)
- **DPI:** 72-150 DPI for web (avoid 300 DPI unless specifically needed)
- **Optimization:** Files should be web-optimized (compressed but high quality)

### Transparency
- All graphics that overlay content (diary, drawers, accessories) should have transparent backgrounds
- Use proper anti-aliasing to avoid jagged edges

---

## Usage Context

### Where Graphics Will Be Used

1. **Home Page (`/`)**
   - Desk surface background (full page or hero section)
   - Diary and drawer icons/graphics for navigation

2. **Diary Listing Page (`/diary`)**
   - Desk surface background
   - Diary book graphic (hero or header area)
   - Possibly small diary icons for each entry card

3. **Individual Diary Entry (`/diary/[slug]`)**
   - Desk surface background
   - Open diary book graphic (hero/header)
   - Subtle paper texture for content area

4. **Drawers Listing Page (`/drawers`)**
   - Desk surface background
   - Drawer graphic (hero or header area)
   - Possibly small drawer icons for each drawer card

5. **Individual Drawer Page (`/drawers/[slug]`)**
   - Desk surface background
   - Open drawer graphic (hero/header)
   - File tabs or organized papers aesthetic

---

## Design Principles

### Visual Hierarchy
- Graphics should enhance, not distract from content
- Keep text areas clear and readable
- Use shadows and depth to create visual separation

### Consistency
- All graphics should feel like they belong on the same desk
- Consistent lighting direction across all elements
- Matching wood tones and textures

### Accessibility
- Ensure sufficient contrast if graphics include text
- Graphics should work in both light and dark mode (if applicable)
- Consider providing alternative text-friendly versions

### Responsiveness
- Graphics should scale gracefully across devices
- Consider creating mobile-optimized versions (simpler, less detail)
- Ensure graphics don't overwhelm small screens

---

## Deliverables Checklist

- [ ] Desk surface background (multiple sizes)
- [ ] Diary/journal book graphic (closed, open, multiple sizes)
- [ ] Drawer graphics (closed, partially open, multiple sizes)
- [ ] Optional desk accessories (pen, paper clips, etc.)
- [ ] Source files (PSD, AI, or Figma) for future edits
- [ ] Web-optimized exports (PNG/JPG)
- [ ] Style guide/documentation showing color codes and usage

---

## Questions or Clarifications Needed?

Before starting, please confirm:
1. Preferred wood type/tone for the desk (oak, walnut, maple, etc.)
2. Style preference (modern minimalist vs. vintage/antique)
3. Lighting direction preference (top-left, top-right, or centered)
4. Any specific cultural or personal preferences for the desk aesthetic

---

## Additional Notes

- The site is built with Next.js and uses Tailwind CSS
- Graphics will be integrated as background images, hero images, or decorative elements
- Consider creating a "desk scene" mockup showing how all elements work together
- If possible, provide graphics in both color and grayscale versions for flexibility

---

## Contact & Feedback
Please provide graphics in stages for review:
1. Initial sketches/concepts
2. Refined designs with color
3. Final optimized exports

Thank you for helping bring this desk workspace concept to life!

