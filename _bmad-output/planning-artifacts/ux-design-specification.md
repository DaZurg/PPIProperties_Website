---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-core-experience"]
inputDocuments: ["prd.md", "architecture.md", "OneroofExamples.md"]
workflowType: 'ux-design'
project_name: 'PPIProperties_Website'
user_name: 'Willem'
date: '2026-04-05'
---

# UX Design Specification - PPIProperties_Website

**Author:** Willem
**Date:** 2026-04-05

---

## Executive Summary

### Project Vision

PPIProperties_Website is a property listing platform designed for buyers to discover, filter, and compare properties with OneRoof-caliber UX. The experience prioritizes fast filtering, beautiful image galleries, and clear agent contact options. Behind the scenes, an automated pipeline keeps data fresh with minimal owner effort (update Google Sheets → site updates automatically).

### Target Users

**Primary User Persona:** Sarah
- Age: 32, first-time home buyer
- Goal: Find 2-3 bedroom home within budget
- Behavior: Browses properties on desktop and mobile, filters by multiple criteria, compares options, views detailed property info before contacting agent
- Frustration: Slow filtering, hard to find agent contact info, poor image viewing experience

### Key UX Design Challenges

1. **Fast Filtering Performance** — Must filter 1-300 properties with <500ms results update (client-side vanilla JS)
2. **Image Gallery Smoothness** — Buyers must browse 20+ images smoothly (60fps) without jank
3. **Mobile Experience** — Many property searches happen on mobile during commute; must be fully responsive
4. **Prominent Contact Path** — Agent phone/email must be immediately accessible on detail pages

### Design Opportunities

1. **Visual Trust Building** — Professional, clean design (matching OneRoof) builds buyer confidence in your brand
2. **Easy Comparison** — Smooth navigation between properties encourages extended browsing
3. **Responsive Excellence** — Excellent mobile experience is competitive advantage (many agents still have poor mobile sites)

---

## Core UX Decisions

### Image Gallery Interaction

**Decision: Carousel with Arrows + Thumbnails Below**
- Desktop: Large main image with left/right arrows; row of thumbnails below for quick navigation
- Mobile: Same approach, optimized for touch (larger arrows)
- Rationale: Standard real estate pattern (matches OneRoof); easy to understand; shows all available images

### Filtering UI

**Decision: Horizontal Filter Bar at Top**
- Location: Full-width bar at top of property grid (below header)
- Visibility: Always visible (not collapsed drawer)
- Controls: Dropdown/select for type; range sliders for price/bedrooms; location dropdown
- Behavior: Instant update as filters change (<500ms)
- Mobile: Same horizontal layout, but filters wrap responsively; dropdowns optimized for touch
- Rationale: Horizontal bar keeps filtering visible without hiding content; encourages exploration

### Property Card Design

**Listing Page — Minimal with Icons:**
```
[Image (full width)]
[$850,000]
[Address: 123 Main Street, Suburb]
[🛏️ 3  |  🚿 2  |  🅿️ 1  |  🐾 Yes]
[More Details →]
```
- Image: Hero element, clickable to detail page
- Price: Bold, large
- Address: Clear location context
- Icons: Beds, baths, parking, pets (visual quick scan)
- CTA: "More Details" or "View Property"

**Detail Page — Rich Property Details with Extended Icons:**
```
[Image Carousel with Thumbnails]
[$850,000]
[Address + Suburb]
[🛏️ 3  |  🚿 2  |  🅿️ 1  |  🐾 Yes  |  ☀️ Solar  |  🔒 Security]
[📐 137m² Floor  |  🏡 529m² Land]
[Full Description]
[🏠 Features List]
[Agent Contact Block]
```
- Same icons as listing + solar, security
- House area & stand size displayed with icons
- All icons use consistent visual language

### Contact Options

**Agent Contact Block (Prominent on Detail Page):**
- Agent name & photo
- ☎️ Phone (click-to-call on mobile, copyable on desktop)
- ✉️ Email (opens email client)
- 📝 Contact Form (inline form on page)
- Order: Phone first (most direct), then email, then form

### Responsive Design Strategy

**No Mobile-Specific Features:**
- Single experience across all devices (phone, tablet, desktop)
- Adaptive layouts using responsive CSS (Tailwind breakpoints)
- Touch-friendly spacing on mobile (larger buttons, more padding)
- Same features available everywhere

**Breakpoints:**
- Mobile: 0-640px (single column, full-width elements)
- Tablet: 640px-1024px (2-column property grid)
- Desktop: 1024px+ (3-4 column property grid, wider filter controls)

---

## Visual Component Inventory

### Icons to Use
**Property Features:** Beds, Baths, Parking, Pets, Solar, Security
**Other:** Filter, Search, Phone, Email, Gallery arrow, Close, Back

All icons: Consistent style, monochrome, clear at small sizes

### Color Palette
Your branding colors + functional colors:
- Primary: [Your brand color]
- Secondary: [Your accent color]
- Neutral: Grays for text, borders, backgrounds
- Functional: Green (success/available), Red (alert/contact needed)

### Typography
- Headings: Clear hierarchy (H1, H2, H3)
- Body text: Readable size (16px minimum on mobile)
- Price: Large, prominent
- Address: Slightly smaller than price, but scannable

### Spacing
- Property cards: Consistent padding (Tailwind spacing scale)
- Filter bar: Adequate whitespace, not cramped
- Contact block: Generous spacing around CTA buttons

---

## Core User Experience

### Defining the Experience

Users come to PPIProperties_Website with a goal: find properties that match their criteria. The journey flows as:

**Browse → Filter → Evaluate → Contact**

- **Browse:** Buyers see property grid with key info (image, price, address, essential icons)
- **Filter:** They refine using property type, price range, bedrooms, location
- **Evaluate:** They click into detail pages to see full photos, features, agent info
- **Contact:** They reach out via phone, email, or contact form

Success happens when filtering feels instant and images look beautiful. These are the two moments that determine whether buyers trust your site or leave for competitors.

### Platform Strategy

**Primary Use Contexts:**
1. **Desktop (Home Research):** Buyers researching multiple properties, comparing options, taking time to explore
2. **Mobile On-The-Go:** Quick browsing during commute, checking specific properties, getting first impression

**Platform Approach:**
- Single experience across both (no mobile app)
- Desktop: 3-4 column grid, wider filter controls, comfortable spacing
- Mobile: Single column, full-width cards, touch-optimized controls
- Both: Same features, same speed, same visual language

### Effortless Interactions

**Filtering Must Feel Instant (<500ms)**
- User changes filter → Grid updates immediately
- No loading spinners, no delay
- This instant feedback encourages exploration ("let me try another filter")
- Competitors with slow filtering lose buyers to your speed

**Image Browsing Must Feel Smooth (60fps)**
- Carousel arrows respond immediately
- Thumbnail scrolling is buttery smooth
- No jank, no lag
- Beautiful images build confidence ("this property looks great")
- Poor image experience = buyer leaves

**Navigation Between Properties Should Be Effortless**
- Back to grid must work (not reload, just pop back)
- Next/Previous property buttons allow quick comparison
- Filter state persists when returning to grid

### Critical Success Moments

**Moment 1: Instant Filtering**
When user changes filters and results update in <500ms, they feel: "This site is fast! I can explore easily."
This is the competitive advantage. Slow competitor sites make buyers frustrated; yours encourages discovery.

**Moment 2: Smooth Image Browsing**
When buyer browses 20+ property images smoothly without lag, they feel: "These photos are beautiful. I can trust this property listing."
Poor image experience makes buyers doubt the property. Smooth browsing builds confidence.

Together, these two moments create the core value: **Fast exploration + Beautiful presentation = Buyer confidence.**

### Experience Principles

These principles guide every UX decision:

**1. Instant Feedback**
Every user action must feel responsive. Filtering, navigation, interactions should never make users wait. Latency kills exploration.

**2. Visual Confidence**
Images are the primary decision driver. Image galleries must be beautiful, fast, and smooth. Poor image experience ruins the whole site.

**3. Quick Evaluation**
Moving between properties should be seamless. Buyers should never feel slowed down by navigation, loading, or friction.

**4. Desktop & Mobile Parity**
Same smooth, responsive experience on desktop (research) and mobile (on-the-go). Users expect speed everywhere.

---

## Page Layouts & Wireframes

### Page 1: Listing Page (Property Grid)

**Layout Structure (Desktop):**

```
┌─────────────────────────────────────────┐
│         HEADER / BRANDING               │
├─────────────────────────────────────────┤
│ Filter Bar (horizontal)                  │
│ [Type ▼] [Price: $__ - $__] [Beds: __] │
│ [Location ▼]                            │
├─────────────────────────────────────────┤
│  Results: 45 properties found            │
├─────────────────────────────────────────┤
│  [Card]  [Card]  [Card]  [Card]         │
│  [Card]  [Card]  [Card]  [Card]         │
│  [Card]  [Card]  [Card]  [Card]         │
│                                         │
│  [Load More] or [Pagination]            │
└─────────────────────────────────────────┘
```

**Property Card (Desktop 3-4 columns):**

```
┌──────────────────┐
│                  │
│   Image          │  ← Full-width hero
│   (hero)         │
│                  │
├──────────────────┤
│  $850,000        │  ← Price prominent
├──────────────────┤
│ 123 Main Street  │  ← Address
│ Suburb, City     │
├──────────────────┤
│ 🛏️ 3 | 🚿 2     │  ← Icons (beds, baths)
│ 🅿️ 1 | 🐾 Yes   │  ← Icons (parking, pets)
├──────────────────┤
│ [View Details →] │  ← CTA button
└──────────────────┘
```

**Filter Bar Behavior:**
- Always visible at top (not collapsed)
- Filters arranged horizontally, wrap on smaller screens
- Instant updates (<500ms) as user changes values
- Clear button to reset all filters

**Mobile Layout:**
- Single column of cards (full-width)
- Filter bar stacks vertically (each filter on own row)
- Same card structure, responsive text sizes

---

### Page 2: Property Detail Page

**Layout Structure:**

```
┌─────────────────────────────────────────┐
│  [← Back to Results] | [< Prev] [Next >]│
├─────────────────────────────────────────┤
│                                         │
│         IMAGE CAROUSEL                  │
│     (Large main image)                  │
│     [←] [→]                             │
│     [Thumbnail row below]               │
│                                         │
├─────────────────────────────────────────┤
│  $850,000                               │
│  123 Main Street, Suburb, City          │
│                                         │
│  🛏️ 3 | 🚿 2 | 🅿️ 1 | 🐾 Yes          │
│  ☀️ Solar | 🔒 Security                 │
│  📐 137m² Floor | 🏡 529m² Land         │
├─────────────────────────────────────────┤
│  DESCRIPTION                            │
│  [Full marketing text about property]   │
├─────────────────────────────────────────┤
│  KEY FEATURES                           │
│  • Solar Panels                         │
│  • Swimming Pool                        │
│  • Double Garage                        │
├─────────────────────────────────────────┤
│  AGENT CONTACT BLOCK                    │
│  [Agent Photo] John Smith               │
│                                         │
│  ☎️ +27 123 456 7890                    │
│  [Click to Call / Copy]                 │
│                                         │
│  ✉️ john@example.com                    │
│  [Opens email / Copy]                   │
│                                         │
│  [Send Message Form]                    │
│  [Name] [Email] [Message]               │
│  [Send Button]                          │
├─────────────────────────────────────────┤
│  RELATED PROPERTIES                     │
│  [Card] [Card] [Card]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Image Carousel Details:**

```
Main Image (Large, full-width)
   [←] [Main Image] [→]

Thumbnail Row Below:
[T1] [T2] [T3] [T4] [T5] [T6] ...
      ↑ Active thumbnail highlight
```
- Click thumbnail → Main image updates instantly
- Arrow buttons → Next/prev image
- Touch swipe on mobile → Navigate images
- All images load smoothly without jank (60fps)

**Agent Contact Block:**
- Name + Photo (builds trust)
- Phone: Click-to-call (mobile), copy (desktop)
- Email: Opens email client
- Contact Form: Inline form for message
- Order matters: Phone first (most direct), then email, then form

**Mobile Layout:**
- Carousel takes full width
- Icons stack for readability
- Agent block becomes sticky (always accessible when scrolling)
- Contact buttons are large and touch-friendly

---

### Interaction Behaviors

**Filtering (Listing Page):**
```
User selects filter value
    ↓
JavaScript event listener fires
    ↓
Vanilla JS filters property array (<500ms)
    ↓
Grid updates with new results
    ↓
Results counter updates
```
No page reload, no loading spinner, instant visual feedback.

**Image Gallery (Detail Page):**
```
User clicks arrow / thumbnail / swipes
    ↓
Main image transitions smoothly
    ↓
Thumbnail scroll updates
    ↓
No lag, no jank, 60fps animation
```

**Navigation (Detail to Listing):**
```
User clicks [← Back to Results]
    ↓
Return to listing (filter state preserved)
    ↓
Grid maintains previous scroll position if possible
```

**Contact Actions:**
```
User clicks phone number
    ↓
Mobile: Opens phone dialer
Desktop: Copy-able phone number
    ↓
User clicks email
    ↓
Opens email client with pre-filled address
    ↓
User submits contact form
    ↓
Form validation → Send → Confirmation message
```

---

## Accessibility & Performance Considerations

### Accessibility
- All interactive elements keyboard-accessible
- Proper heading hierarchy (H1, H2, H3)
- Image alt text descriptive
- Color contrast meets WCAG AA (4.5:1)
- Touch targets minimum 48px on mobile

### Performance
- Filtering: <500ms response time (vanilla JS)
- Image gallery: 60fps smooth scrolling (optimized images, lazy loading)
- Page load: Listing <2s, Detail <1s (static HTML, optimized images)
- Images: Responsive sizes, WebP format with fallbacks

### Mobile Considerations
- Touch-friendly buttons (larger tap targets)
- Horizontal scrolling for filter bar if needed
- Sticky header for navigation
- Sticky agent contact block on detail page (always accessible)
- Full-width cards and images
