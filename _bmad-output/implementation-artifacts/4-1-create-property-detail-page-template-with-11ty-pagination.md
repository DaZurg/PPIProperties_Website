# Story 4.1: Create Property Detail Page Template with 11ty Pagination

**Status:** done

**Code Review:** ✅ Complete - 4 patches applied and verified (2026-04-07)

**Epic:** 4 - Property Details, Image Gallery & SEO

**Story ID:** 4.1

**Created:** 2026-04-07

**Depends On:**
- Story 2.4 (Integrate Property Data and Display All Properties) ✅ Complete
- Story 3.4 (Implement Filter State Persistence Across Navigation) ✅ Complete
- 11ty project initialized with property data loaded (Stories 1.1-1.6) ✅ Complete

**Implementation:** 2026-04-07 ✅ COMPLETE

**Completion Summary:**
- ✅ File created: `src/property.html` with 11ty pagination
- ✅ 5 property detail pages generated at `/properties/{propertyId}/`
- ✅ Semantic HTML structure with proper navigation
- ✅ Navigation: Back to Results, Previous/Next Property buttons
- ✅ Content placeholders for carousel (4.2) and contact (4.4)
- ✅ Build succeeds, property data correctly populated
- ✅ Error handling with fallback content for missing data
- ✅ Responsive design with Tailwind CSS styling

---

## Story

As a developer,
I want to create a property detail page template that automatically generates individual pages for each property using 11ty's pagination from properties.json,
So that each property has its own unique, crawlable detail page with semantic URL structure.

---

## Acceptance Criteria

1. **11ty Pagination Template Created**
   - File created: `src/property.html`
   - Uses 11ty's pagination feature to generate one page per property
   - References `collections.all` and `data` to access properties.json
   - Pagination configuration: `pagination.data: "properties"`, `pagination.size: 1`, `pagination.alias: "property"`

2. **Semantic URL Structure Generated**
   - Property pages generate at `/properties/{propertyId}/index.html`
   - URLs are human-readable and semantic (e.g., `/properties/abc-123/`)
   - Each page is accessible and crawlable by search engines
   - Build command `npm run build` successfully generates all property pages

3. **Correct Property Data Assignment**
   - Each page receives the correct property object in the `property` variable
   - Property fields accessible: id, address, price, bedrooms, bathrooms, description, etc.
   - Template can safely access property.id, property.address, property.price without errors

4. **Semantic HTML Structure**
   - Uses `<article>` tag for main property content
   - Uses `<section>` tags for logical content grouping
   - H1 heading with property address (page title)
   - Proper heading hierarchy (no missing heading levels)
   - Header and footer inherited from layout template

5. **Navigation Elements Present**
   - "Back to Results" button/link at top (links to `/` or `/listing.html`)
   - "Previous Property" button/link (navigates to previous property)
   - "Next Property" button/link (navigates to next property)
   - Previous/Next buttons disabled/hidden when at first/last property
   - Navigation buttons styled consistently with site design

6. **Content Placeholders**
   - Main content area ready for property details (filled by Story 4.4)
   - Image carousel placeholder section (filled by Story 4.2)
   - Agent contact section placeholder (filled by Story 4.4)
   - Clear comments indicating where future content will be inserted

7. **Template Layout & Design**
   - Extends from `_includes/layout.html` for consistent header/footer
   - Uses Tailwind CSS classes for styling (no inline styles)
   - Mobile-responsive design (readable on mobile, tablet, desktop)
   - Follows responsive best practices (mobile-first approach)
   - Layout consistent with listing page design (same header, footer, typography)

8. **Error Handling & Fallbacks**
   - Handles missing property data gracefully with fallback content
   - Shows default text if address, price, or other fields missing
   - No console errors or broken layout if property data incomplete
   - Page still renders and is navigable even with missing data

9. **Build Integration**
   - Running `npm run build` generates all property pages in `_site/properties/`
   - All property detail pages appear at correct URLs
   - Build command completes without errors
   - Generated HTML is valid and passes basic validation

10. **Navigation Between Properties**
    - Clicking "Next Property" navigates to next property detail page
    - Clicking "Previous Property" navigates to previous property detail page
    - Property navigation works correctly (sequential, no gaps)
    - Navigation order matches properties array order

---

## Tasks / Subtasks

- [ ] **Understand 11ty Pagination & Structure**
  - [ ] Review 11ty pagination documentation and examples
  - [ ] Understand how pagination generates one page per array item
  - [ ] Understand `pagination.alias` variable assignment
  - [ ] Review existing 11ty structure in project (src/, _includes/, _data/)
  - [ ] Understand how layout templates extend from _includes/layout.html

- [ ] **Design Property Detail Page Structure**
  - [ ] Plan semantic HTML structure (article, section, nav tags)
  - [ ] Design heading hierarchy (H1 for address, H2 for sections)
  - [ ] Plan content sections: hero, details, gallery, contact, navigation
  - [ ] Determine responsive breakpoints (mobile, tablet, desktop)
  - [ ] Plan navigation button placement and styling
  - [ ] Review OneRoof design patterns for detail page layout

- [ ] **Create property.html Template File**
  - [ ] Create new file: `src/property.html`
  - [ ] Add 11ty frontmatter with pagination configuration
  - [ ] Configure pagination for properties.json data
  - [ ] Set permalink to generate `/properties/{propertyId}/`
  - [ ] Add layout reference to extend _includes/layout.html
  - [ ] Add comments explaining pagination structure

- [ ] **Implement Semantic HTML Structure**
  - [ ] Add `<article>` tag for main property content
  - [ ] Add `<section>` tags for content grouping (details, gallery, contact, navigation)
  - [ ] Add H1 heading with property address (property.address variable)
  - [ ] Add proper heading hierarchy for all subsections
  - [ ] Include semantic nav element for navigation buttons
  - [ ] Use aria-labels for accessibility where needed

- [ ] **Implement Back to Results Navigation**
  - [ ] Add "Back to Results" button linking to `/` (listing page)
  - [ ] Position button at top of page for easy access
  - [ ] Style with consistent button styling (Tailwind classes)
  - [ ] Make button accessible via keyboard (proper link/button element)
  - [ ] Add aria-label explaining link purpose

- [ ] **Implement Previous/Next Property Navigation**
  - [ ] Add "Previous Property" button linking to previous property
  - [ ] Add "Next Property" button linking to next property
  - [ ] Use 11ty pagination variables: `previousPage` and `nextPage`
  - [ ] Disable/hide buttons when at first property (no previous)
  - [ ] Disable/hide buttons when at last property (no next)
  - [ ] Show current property position (e.g., "Property 3 of 42")
  - [ ] Style navigation buttons consistently with site design

- [ ] **Create Content Placeholders**
  - [ ] Add main content area section for property details (story 4.4)
  - [ ] Add image carousel section with placeholder (story 4.2)
  - [ ] Add agent contact section with placeholder (story 4.4)
  - [ ] Add clear HTML comments indicating where content will go
  - [ ] Note which story handles each placeholder section

- [ ] **Implement Responsive Design**
  - [ ] Use Tailwind CSS classes for all styling (no inline styles)
  - [ ] Implement mobile-first responsive design
  - [ ] Design for mobile (small screens, touch-friendly buttons)
  - [ ] Design for tablet (medium screens, optimized layout)
  - [ ] Design for desktop (large screens, spacious layout)
  - [ ] Test layout at breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)
  - [ ] Ensure text is readable on all screen sizes

- [ ] **Add Error Handling & Fallbacks**
  - [ ] Handle missing property.address (show "Address Not Available")
  - [ ] Handle missing property.price (show "Price On Application" or "POA")
  - [ ] Handle missing property.bedrooms, bathrooms (show "N/A")
  - [ ] Ensure page renders without errors even with missing data
  - [ ] Test template with incomplete property data

- [ ] **Extend from Layout Template**
  - [ ] Add layout frontmatter: `layout: layout.html`
  - [ ] Verify layout.html exists in _includes/
  - [ ] Verify header and footer from layout appear on page
  - [ ] Style consistency with listing page (same typography, colors, spacing)
  - [ ] Test that navigation and layout are consistent

- [ ] **Test Build Process**
  - [ ] Run `npm run build` command
  - [ ] Verify `_site/properties/` directory created
  - [ ] Verify property pages exist for each property in properties.json
  - [ ] Check URLs match semantic pattern: /properties/{propertyId}/
  - [ ] Verify all property pages have unique content (correct data)
  - [ ] Test that no build errors or warnings appear
  - [ ] Verify generated HTML is valid (can open in browser)

- [ ] **Test Navigation in Generated Site**
  - [ ] Open generated property page in browser
  - [ ] Verify page loads correctly and is readable
  - [ ] Click "Back to Results" - verify returns to listing page
  - [ ] Click "Previous Property" - verify navigates to previous property
  - [ ] Click "Next Property" - verify navigates to next property
  - [ ] Test first property - verify "Previous" disabled/hidden
  - [ ] Test last property - verify "Next" disabled/hidden
  - [ ] Verify navigation links work correctly

- [ ] **Verify Semantic URL Structure**
  - [ ] Check that URLs follow `/properties/{propertyId}/` pattern
  - [ ] Verify property IDs are correct in URLs
  - [ ] Check that URLs are human-readable (no encoding artifacts)
  - [ ] Verify all property pages are crawlable (semantic URLs)
  - [ ] Test that property pages are accessible without index.html

- [ ] **Code Quality & Documentation**
  - [ ] Add comments explaining pagination configuration
  - [ ] Add comments for content placeholder sections
  - [ ] Document where future stories will add content
  - [ ] Ensure code follows project conventions (Tailwind, spacing, naming)
  - [ ] Verify no console errors when pages load

---

## Dev Notes

### Architecture Patterns & Constraints

**11ty Pagination Requirements:**
- Story 4.1 implements core property detail page template
- Uses 11ty's native pagination to generate one page per property
- Semantic URLs: `/properties/{propertyId}/` (matches project architecture)
- No dynamic routing needed - all pages generated at build time
- Each page is a static HTML file (works on cPanel shared hosting)

[Source: architecture.md#11ty (Eleventy) v3.1.0, Story 4.1 AC#2]

**Project Template Structure:**
- `src/` - templates and content
- `src/_includes/` - reusable components (layout.html)
- `src/_data/` - global data (properties.json)
- `_site/` - build output (static files)
- All files use Nunjucks templating engine with 11ty

[Source: architecture.md#Code Organization]

**Data Access Pattern:**
- Properties loaded from `src/_data/properties.json` via 11ty data cascade
- Each property is a JSON object with standard fields (id, address, price, bedrooms, bathrooms, description, imageUrls, features, agentName, agentEmail, agentPhone, location, propertyType)
- Property objects automatically available in template as `property` variable (via pagination.alias)

[Source: epics.md - Story 4.1 AC#3, architecture.md - JSON Property Field Names]

**Styling Solution:**
- Tailwind CSS utility-first approach (no inline styles, no CSS files needed)
- BEM-style class names for JavaScript hooks only
- Mobile-first responsive design approach
- All projects components use Tailwind (consistent pattern from Stories 2-3)

[Source: architecture.md#Frontend Architecture - Styling Solution]

### What Previous Stories Already Implemented

**Story 2.4 (Property Data Integration):**
- Properties loaded from properties.json ✅
- All 6+ properties available in data pipeline ✅
- Property fields validated and ready for display ✅
- Data accessible in 11ty templates ✅

**Story 3.4 (Filter State Persistence):**
- Filter state management working on listing page ✅
- Navigation between listing and detail pages planned ✅
- "Back to Results" functionality will use this pattern ✅
- Filter state persists correctly across navigation ✅

**Stories 1.1-1.6 (Project Initialization):**
- 11ty project fully initialized ✅
- Tailwind CSS configured ✅
- GitHub Actions and deployment working ✅
- Build process ready for property page generation ✅

[Source: sprint-status.yaml - all Epics 1-3 complete]

### What This Story Needs to Add

**New Files:**
1. `src/property.html` - Main property detail page template with pagination

**Files Modified:**
- None (only new file creation needed)

**Key Implementation Decisions:**

1. **11ty Pagination Configuration:**
   ```
   ---
   pagination:
     data: properties
     size: 1
     alias: property
   permalink: /properties/{{ property.id }}/
   layout: layout.html
   ---
   ```

2. **Property Data Access:**
   - `property.id` - unique identifier (e.g., "abc-123")
   - `property.address` - full address string
   - `property.price` - numeric price value
   - `property.bedrooms` - number of bedrooms
   - `property.bathrooms` - number of bathrooms
   - Other fields: description, imageUrls, features, agentName, agentEmail, agentPhone, location, propertyType

3. **Navigation Variable Usage:**
   - `previousPage` - link to previous property (null if first)
   - `nextPage` - link to next property (null if last)
   - Can use to conditionally disable/hide navigation buttons

4. **Layout Extension:**
   - Extend from `layout: layout.html` to inherit header/footer
   - Page content goes between layout's header and footer
   - Consistent styling with listing page (same typography, colors, spacing)

[Source: Story 4.1 AC#1-7, epics.md Story 4.1 BDD criteria]

### Integration Points with Other Stories

**Depends On:**
- Story 2.4: Property data must be loaded (properties.json accessible)
- Story 3.4: Filter state persistence must work so "Back to Results" returns with filters

**Blocks:**
- Story 4.2: Needs property.html template to exist before adding image carousel
- Story 4.4: Needs property.html template to exist before adding property details
- Story 4.5: Needs property.html template to generate pages before adding SEO metadata
- Story 4.6: Needs all property pages generated before creating sitemap

**Navigation Flow:**
1. Listing page with filter controls (Story 3.x) ✅
2. Click property card → detail page (Story 4.1 - this story)
3. "Back to Results" button → listing page with filters restored (Story 3.4) ✅
4. "Previous/Next Property" buttons → navigate between properties (Story 4.1 - this story)

[Source: UX Design Specification - Navigation Behavior, Story 4.1 AC#5]

### 11ty Pagination Mechanics (Developer Guide)

**How 11ty Pagination Works:**

When you configure pagination in a template's frontmatter:
```
pagination:
  data: properties          # Data source (array from properties.json)
  size: 1                  # Items per page (1 = one property per page)
  alias: property          # Variable name in template ({{ property.* }})
permalink: /properties/{{ property.id }}/  # URL template (generates unique URL per item)
```

11ty automatically:
1. Reads the `properties` array from `src/_data/properties.json`
2. Creates one page for each array item (one page per property)
3. Makes the current item available as `{{ property }}` in the template
4. Generates the permalink URL using the current item's data
5. Makes navigation variables available: `{{ previousPage }}` and `{{ nextPage }}`

**Result:**
- 6 properties → 6 generated pages
- 300 properties → 300 generated pages
- All pages generated at build time (no runtime overhead)
- Perfect for static hosting (cPanel) because output is pure HTML

[Source: 11ty documentation - Pagination, architecture.md#11ty Selected Starter]

### Semantic URL Pattern

**Pattern Requirement:**
```
/properties/{propertyId}/
```

**Examples:**
- `/properties/123-main-street/` (if id is "123-main-street")
- `/properties/abc-xyz-456/` (if id is "abc-xyz-456")
- `/properties/first-property/` (if id is "first-property")

**Why This Pattern:**
- Human-readable (developers and users can read the URL)
- SEO-friendly (search engines prefer semantic URLs)
- Matches project architecture standards (defined in architecture.md)
- Property ID must be unique (enforced by properties.json structure)
- Matches OneRoof and similar real estate site patterns

[Source: epics.md Story 4.1 AC#2, architecture.md#Routing Patterns]

### Responsive Design Considerations

**Mobile-First Approach (from Tailwind + architecture):**
1. Design base styles for mobile (small screens)
2. Add responsive classes for larger screens using Tailwind breakpoints
3. Key breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

**Design Checklist for Story 4.1:**
- Touch-friendly buttons: minimum 48px height on mobile
- Text readable on mobile: not too small, good contrast
- Images scale properly: don't overflow small screens
- Navigation buttons visible and accessible on mobile
- Property address and price prominent (key info)
- Content stacks vertically on mobile (single column)
- Wider screens use multi-column layout (sidebar, carousel, etc.)

**Example Tailwind Classes for Responsive:**
```html
<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Mobile: 100% width, Tablet+: auto width -->
<button class="w-full md:w-auto">Next Property</button>

<!-- Mobile: smaller text, Desktop: larger text -->
<h1 class="text-2xl md:text-4xl">{{ property.address }}</h1>
```

[Source: Tailwind documentation - Responsive Design, Story 2-3 patterns]

### Testing Strategy

**Build-Time Testing:**
1. Run `npm run build`
2. Verify no errors or warnings
3. Check `_site/properties/` directory exists
4. Count HTML files generated (should match property count)
5. Verify file names match property IDs

**Runtime Testing:**
1. Open generated property page in browser
2. Verify content loads and displays correctly
3. Test all navigation buttons (Back, Previous, Next)
4. Verify page structure is correct (semantic HTML)
5. Check responsive layout (resize browser)
6. Verify no console errors

**Validation Testing:**
1. Verify URLs follow semantic pattern
2. Check that data is correct (address, price, etc. match properties.json)
3. Verify HTML is valid (no broken tags, proper nesting)
4. Test with incomplete property data (missing fields)
5. Verify fallback content displays for missing data

[Source: Story 3.2 testing patterns, acceptance criteria]

### Common Pitfalls to Avoid

- ❌ **Hardcoding property data** - Use `{{ property.* }}` variables instead
- ❌ **Inline styles** - Use Tailwind classes instead (`class="text-2xl text-blue-600"`)
- ❌ **Missing layout extension** - Must extend from `_includes/layout.html`
- ❌ **Incorrect pagination configuration** - Must use correct 11ty pagination syntax
- ❌ **Not handling missing data** - Always provide fallback values
- ❌ **Breaking mobile layout** - Test on mobile and tablet before completing
- ❌ **Broken navigation buttons** - Test Previous/Next on first and last properties
- ❌ **Forgetting to build** - Run `npm run build` to generate pages

### Previous Story Code Patterns

From Stories 3.1-3.4 (filtering system):
- **Vanilla JavaScript:** Use plain JavaScript (no frameworks), proper error handling
- **Try/catch errors:** Wrap risky operations in try/catch
- **Comments:** Add comments explaining non-obvious code
- **Tailwind styling:** Use utility classes, no inline styles
- **Feature detection:** Test browser capabilities (like localStorage)
- **BEM for hooks:** Use BEM-style class names for JavaScript selection

For Story 4.1 (template, not JavaScript):
- Apply similar principles: semantic HTML, Tailwind classes, fallback content
- Add comments explaining template structure
- Use conditional logic for navigation (if previousPage exists, show Previous button)

[Source: filtering.js patterns from Stories 3.1-3.4]

### References

- **Epic 4 Requirements:** [epics.md - Epic 4: Property Details, Image Gallery & SEO]
- **Story 4.1 Details:** [epics.md - Story 4.1: Create Property Detail Page Template]
- **11ty Documentation:** [11ty.dev/docs/pagination/]
- **11ty Data Cascade:** [11ty.dev/docs/data-cascade/]
- **Nunjucks Templating:** [mozilla.github.io/nunjucks/]
- **Architecture Decisions:** [architecture.md#Frontend Architecture]
- **UX Requirements:** [ux-design-specification.md#Navigation Behavior]
- **File Organization:** [architecture.md#Code Organization & File Structure]
- **Data Schema:** [architecture.md#JSON Property Field Names (camelCase)]

---

## Dependencies & Blocking Issues

**Must Complete Before:**
- Story 4.2: Implement Image Carousel Component (needs property.html template to exist)
- Story 4.4: Display Property Details and Agent Contact (needs property.html template)
- Story 4.5: Generate SEO Metadata Per Property (needs all pages generated)
- Story 4.6: Create XML Sitemap (needs all property pages to exist)

**Completed Before This Story:**
- Story 2.4: Integrate Property Data ✅
- Story 3.4: Implement Filter State Persistence ✅
- Stories 1.1-1.6: Project Initialization ✅

**External Dependencies:**
- properties.json with at least 1 property (exists from Story 2.4)
- _includes/layout.html template (exists from Story 1.1)
- 11ty installation and configuration (complete from Story 1.1)
- Tailwind CSS configuration (complete from Story 1.1)

**No Blocking Issues Identified**

---

## Success Metrics

**Implementation Success:**
- ✅ File created: `src/property.html` with proper 11ty pagination
- ✅ Pagination generates correct number of pages (matches property count)
- ✅ URLs follow semantic pattern: `/properties/{propertyId}/`
- ✅ Each page receives correct property data object
- ✅ Template extends from layout.html correctly
- ✅ Semantic HTML structure with article, section, h1, etc.
- ✅ Navigation buttons (Back, Previous, Next) present and functional
- ✅ Content placeholders for image carousel and agent contact
- ✅ Mobile-responsive design works on all breakpoints
- ✅ Missing data handled gracefully with fallbacks

**Build Process Success:**
- ✅ `npm run build` completes without errors
- ✅ All property pages generated in `_site/properties/`
- ✅ Generated HTML is valid and readable
- ✅ No console errors or build warnings

**Browser Testing Success:**
- ✅ Pages load correctly in Chrome, Safari, Firefox, Edge
- ✅ Navigation buttons work (Back, Previous, Next)
- ✅ Responsive layout works on mobile, tablet, desktop
- ✅ Content displays correctly with sample data
- ✅ Fallback content shows for missing data fields

**User Experience Success:**
- ✅ Property address is clear and prominent (H1)
- ✅ Navigation is intuitive (Back/Previous/Next buttons clear)
- ✅ Layout consistent with listing page (same design system)
- ✅ Pages are scannable and well-organized
- ✅ Mobile experience is excellent (readable, touch-friendly)

**Code Quality Success:**
- ✅ Code follows project conventions (Tailwind, Nunjucks)
- ✅ Comments explain pagination and template structure
- ✅ No hardcoded property data (uses variables)
- ✅ Proper error handling for missing data
- ✅ Accessibility basics implemented (semantic HTML, labels)

**Ready for Next Story:**
- ✅ Story 4.2: Image Carousel can now be added (has template to work with)
- ✅ Story 4.4: Property Details can now be added (has template structure)

---

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5 (claude-haiku-4-5-20251001) - Story Creation

### Artifact Analysis Completed

**Epics Analysis (epics.md):**
- Story 4.1 objectives and AC extracted
- Epic 4 overview: "Property Details, Image Gallery & SEO"
- Story 4.1 specific: Create property detail page template with 11ty pagination
- Dependencies: requires properties.json (Story 2.4), requires 11ty initialized (Story 1.1)
- Next stories depend on this: Stories 4.2, 4.4, 4.5, 4.6 all need this template

**Architecture Analysis (architecture.md):**
- 11ty selected as static site generator
- Property detail pages use 11ty pagination
- Semantic URLs: /properties/{propertyId}/
- Layout structure: src/, src/_includes/, src/_data/, _site/
- Tailwind CSS for styling (no inline styles)
- Properties.json contains all property data
- Data schema: id, address, price, bedrooms, bathrooms, description, imageUrls, features, agentName, agentEmail, agentPhone, location, propertyType

**UX Design Analysis (ux-design-specification.md):**
- Property detail page shows full property information
- Image carousel section (story 4.2)
- Agent contact block (story 4.4)
- Navigation: back to listing, previous/next property buttons
- Design consistency with listing page
- Mobile-responsive experience required

**Project Structure Analysis:**
- 11ty template structure established from Story 1.1
- _includes/layout.html exists and is used for page layout
- Nunjucks templating engine used throughout
- Properties.json loaded and validated (Story 2.4)
- Filter state persistence working (Story 3.4) - will support "Back to Results"

**Previous Story Patterns (Stories 3.1-3.4):**
- Vanilla JavaScript, Tailwind CSS, semantic HTML
- Comments explaining code purpose and structure
- Error handling with try/catch
- Mobile-first responsive design
- Graceful fallbacks for missing data
- Feature detection for browser capabilities

### Development Context Extracted

**Critical Technical Requirements:**
1. Use 11ty pagination to generate one page per property
2. Semantic URL structure: /properties/{propertyId}/
3. Extend from _includes/layout.html for consistent design
4. Nunjucks templating with property variables (property.id, property.address, etc.)
5. Tailwind CSS utility classes for styling
6. Mobile-first responsive design

**Implementation Integration Points:**
1. Template file: src/property.html (new file)
2. Frontmatter: pagination configuration with 11ty syntax
3. Layout: extend from layout.html
4. Data: access properties via 11ty data cascade
5. Build: `npm run build` generates all pages
6. Output: _site/properties/{propertyId}/index.html

**Browser Compatibility:**
- Modern browsers (Chrome, Safari, Firefox, Edge latest 2 versions)
- Responsive design: mobile first
- No JavaScript required for basic functionality (all static HTML)
- Semantic HTML for accessibility

**Performance Targets:**
- No runtime performance impact (static pages)
- Build time should be fast (11ty is optimized for speed)
- Page size should be small (no unnecessary markup)
- Load time: page should load instantly (static file)

**Security Considerations:**
- Property data from trusted source (properties.json)
- No user input on detail pages (read-only)
- No XSS vulnerabilities (Nunjucks escapes by default)
- No database access needed (static generation)

**Testing Scope:**
- Unit: Verify template generates correct HTML
- Integration: Verify pagination generates all pages
- Build: Verify npm run build completes successfully
- Browser: Verify pages load and render correctly
- Navigation: Verify Previous/Next/Back buttons work
- Responsive: Verify layout works on all breakpoints
- Data: Verify correct property data in each page

### Completion Status

**Story Status: ready-for-dev**

Dev agent now has complete context on:
- What needs to be built (property detail template with 11ty pagination)
- How to integrate with existing project (extend layout.html, use properties.json)
- What patterns to follow (semantic HTML, Tailwind, Nunjucks)
- How to test (build, browser testing, navigation testing)
- What might go wrong (missing data, broken navigation, responsive issues)
- How the feature fits into larger system (Epic 4, depends on 2.4 & 3.4, blocks 4.2, 4.4, 4.5, 4.6)

---

## Story Completion Checklist

**For Dev Agent Implementation:**
- [ ] Review 11ty pagination documentation
- [ ] Understand project template structure (src/, _includes/, _data/)
- [ ] Create src/property.html template file
- [ ] Configure 11ty pagination in frontmatter
- [ ] Implement semantic HTML structure
- [ ] Add property address H1 heading
- [ ] Implement "Back to Results" navigation
- [ ] Implement "Previous/Next Property" navigation
- [ ] Create content placeholders for image carousel and agent contact
- [ ] Implement responsive Tailwind CSS styling
- [ ] Add error handling for missing data
- [ ] Extend from layout.html template
- [ ] Test npm run build generates all pages
- [ ] Test navigation between properties
- [ ] Test responsive layout on mobile, tablet, desktop
- [ ] Verify semantic URLs generated correctly
- [ ] Add code comments explaining pagination
- [ ] Run final build and verify output
- [ ] Verify no console errors

**For Code Review:**
- [x] Pagination configuration correct for 11ty
- [x] Semantic HTML properly structured
- [x] Tailwind CSS used correctly (no inline styles)
- [x] Layout extension working properly
- [x] Navigation buttons accessible and functional
- [x] Mobile-responsive design verified
- [x] Data access patterns correct
- [x] Error handling for missing data
- [x] Proper comments throughout code
- [x] Build process validates

---

## Code Review Findings

**Review Date:** 2026-04-07
**Review Status:** ✅ COMPLETE - All patches applied and verified

### Patches Applied (4/4)

- [x] [Review][Patch] Title field not rendering template syntax [src/property.html:8]
  - **Fixed:** Changed `title: "{{ property.address }} - Property Details"` to `title: "Property Details"`
  - **Reason:** 11ty frontmatter does not evaluate Nunjucks syntax in title field

- [x] [Review][Patch] Previous/Next navigation buttons disabled on all pages [src/property.html:21-39, 186-204]
  - **Fixed:** Changed from undefined `previousPage`/`nextPage` variables to `pagination.pageNumber` + `pagination.pages` array access
  - **Reason:** 11ty pagination does not auto-populate previousPage/nextPage; manually calculate using pagination object
  - **Verification:** Middle property (3108497) now shows active Previous/Next links

- [x] [Review][Patch] Price not formatted with thousands separator [src/property.html:60]
  - **Fixed:** Changed `{{ property.price }}` to `{{ property.price | formatNumber }}`
  - **Reason:** Prices should use thousands formatting (e.g., "7,000,000" not "7000000")
  - **Verification:** Generated output shows "7,000,000"

- [x] [Review][Patch] Agent contact section has poor fallback for missing data [src/property.html:160-173]
  - **Fixed:** Added fallback text for agentPhone and agentEmail fields
  - **Changes:**
    - Added `{%- else %}<p class="mb-2 text-gray-500">Phone not available</p>{%- endif %}`
    - Added `{%- else %}<p class="mb-4 text-gray-500">Email not available</p>{%- endif %}`
  - **Reason:** Missing fields left empty paragraphs; now display helpful fallback messages

### Build Verification

✅ Build passed without errors after patches
✅ All 5 property pages generated successfully
✅ Generated HTML verified for all fixes
✅ Previous/Next navigation tested on first, middle, and last properties

---
