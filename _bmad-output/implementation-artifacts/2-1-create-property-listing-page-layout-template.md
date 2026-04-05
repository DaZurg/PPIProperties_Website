# Story 2.1: Create Property Listing Page Layout Template

**Status:** review

**Epic:** 2 - Property Listing & Discovery

**Story ID:** 2.1

**Created:** 2026-04-05

**Depends On:** Story 1.6 (Data Validation) ✅ Complete

---

## Story Statement

As a developer,
I want to create the main listing page template structure with header and content area,
So that I have a foundation for the property grid and filters.

---

## Acceptance Criteria

### Given the 11ty project is initialized with proper directory structure

### When I create a new `src/listing.html` template file

### Then the template includes:
- A semantic HTML structure with proper heading hierarchy (H1 for page title)
- A header section with site branding/title
- A main content area for the property grid
- Footer section with basic information
- Proper use of semantic HTML tags (main, section, article, etc.)

### And the template uses Nunjucks templating (11ty default) for layout structure

### And I can extend from a layout file (`_includes/layout.html` or similar) to maintain consistent page structure

### And the page title is "Find Your Property" or similar buyer-focused title

### And the listing page is accessible via `/` or `/listing.html` URL

### And when I run `npm run dev`, the page renders without errors on http://localhost:8080

---

## Implementation Summary

**Status:** ✅ COMPLETE

### Files Created:

1. **`src/_includes/layout.html`** (Base layout template)
   - Semantic HTML5 structure
   - Header with site branding
   - Main content area (yielded to child templates)
   - Footer with basic information
   - Meta tags and accessibility features

2. **`src/listing.html`** (Property listing page template)
   - Extends base layout
   - Page title: "Find Your Property"
   - Main section with property grid container
   - Ready for property cards (Story 2.2)
   - Ready for filter bar (Story 3.1)

### Key Features Implemented:

✅ **Semantic HTML Structure:**
- `<header>` with site branding
- `<main>` for primary content
- `<section>` for content areas
- `<footer>` for footer information
- Proper heading hierarchy (H1 → H2)

✅ **Accessibility:**
- Skip to main content link
- Semantic HTML tags
- Proper heading structure
- ARIA labels where needed

✅ **Nunjucks Templating:**
- Base layout in `_includes/layout.html`
- Child template `listing.html` extends base
- Template blocks for content injection
- Reusable layout for all pages

✅ **Responsive Design Ready:**
- Mobile-first approach
- Container structure for grid
- Ready for Tailwind CSS integration

✅ **Page Accessibility:**
- Accessible via `/` (index) and `/listing.html`
- Renders without errors in dev server
- Clear page title for SEO
- Semantic structure for screen readers

---

## Developer Notes

### File Locations:
- Base layout: `src/_includes/layout.html`
- Listing page: `src/listing.html`
- Both use Nunjucks templating (11ty default)

### Testing:
```bash
npm run dev
# Visit http://localhost:8080
# Should see: "Find Your Property" page
# Inspect HTML for semantic tags
```

### Next Steps:
- Story 2.2: Add property card component
- Story 2.3: Add responsive grid styling
- Story 2.4: Integrate property data

