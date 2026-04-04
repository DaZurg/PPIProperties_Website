---
stepsCompleted: ["step-01-init", "step-02-context", "step-03-starter", "step-04-decisions", "step-05-patterns"]
inputDocuments: ["prd.md", "OneroofExamples.md"]
workflowType: 'architecture'
project_name: 'PPIProperties_Website'
user_name: 'Willem'
date: '2026-04-05'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (53 capabilities):**
Static property listing site with 8 capability areas: property discovery/browsing, filtering/refinement, detail viewing, image gallery, agent contact, navigation, data management, deployment/updates, SEO, and accessibility. Core workflow: buyers browse/filter properties → view details → contact agent. Admin workflow: update Excel → deploy to cPanel.

**Non-Functional Requirements (21 metrics):**

Performance: Listing page <2s, detail page <1s, filter updates <500ms, 60fps image gallery scrolling, accessible on 3G
Scalability: Scale 6→300+ properties without architecture changes, maintain <2s load time at 300 properties
Reliability: >99.5% uptime, automatic deployment, no manual intervention, error feedback on failures
Integration: GitHub Actions → JSON conversion, FTP/SFTP deployment to cPanel, data validation
Accessibility: WCAG AA color contrast, keyboard navigation, semantic HTML, image alt text

**Scale & Complexity:**
- Project Complexity: Low-Medium (static generation, no real-time features, no database complexity)
- Primary Domain: Full-stack web (static site generator + client-side interactivity + CI/CD automation)
- Estimated Architectural Components: 7-9 major systems (template engine, static generator, GitHub Actions workflow, FTP deployment, client-side filter engine, image optimizer, SEO metadata generator, responsive CSS, accessibility layer)

### Technical Constraints & Dependencies

**Hosting Constraint:** cPanel shared hosting (limits: FTP/SFTP only, no Node.js runtime, static file serving only)
**Data Source:** Google Sheets → JSON conversion required
**Browser Support:** Modern browsers only (Chrome, Safari, Firefox, Edge latest 2 versions)
**No Regulatory Requirements:** Low-complexity real estate domain, no HIPAA/PCI/GDPR constraints
**Deployment:** On-demand via GitHub Actions, no real-time sync needed

### Cross-Cutting Concerns Identified

**Performance Optimization:** Required across all components (lazy image loading, CSS/JS minification, image compression, caching strategy)
**SEO Implementation:** Must be built into static generation (per-property unique URLs, meta tags, Schema.org, sitemap generation)
**Responsive Design:** Mobile-first approach required for all pages and components
**Data Validation:** Excel → JSON pipeline must gracefully handle missing fields, validate image URLs, prevent broken deployments
**Accessibility Compliance:** Semantic HTML, keyboard navigation, color contrast must be maintained throughout architecture

## Starter Template Evaluation

### Primary Technology Domain

Static Site Generator + Client-Side Interactivity + GitHub Actions CI/CD

Project requires generating static HTML files from JSON data (properties), scaling from 6 to 300+ items, with client-side filtering and mobile responsiveness. cPanel shared hosting constraint limits to static file serving only (no Node.js runtime).

### Starter Options Considered

**11ty (Eleventy) v3.1.0 — SELECTED** ✅
- Zero client-side JavaScript by default; no framework overhead
- Native JSON data file support; "Create Pages from Data" generates property detail pages automatically
- Perfect for static-only hosting (cPanel); no SaaS dependencies
- Proven for real estate/property sites at scale
- Open source (MIT license); runs locally if needed; zero vendor lock-in risk

**Astro 4.15+**
- Modern islands architecture; more powerful if complex interactivity needed
- Trade-off: More framework complexity than project requires

**Custom Node.js Builder**
- Full control; minimal overhead
- Trade-off: More maintenance responsibility; less battle-tested

### Selected Starter: 11ty (Eleventy) v3.1.0

**Rationale for Selection:**

11ty is purpose-built for static site generation from data files. It solves your core architectural needs: JSON input → static HTML output, with zero framework dependencies. This is critical because:

1. **cPanel Compatibility:** Generates only static HTML/CSS/JS files—works on any shared hosting
2. **Local Independence:** Runs entirely on your machine via npm; no external SaaS services; if 11ty ever stops development, your static HTML files still work forever
3. **Zero Cost:** Completely open source; no monthly SaaS fees; runs on free GitHub Actions
4. **Property Page Generation:** Native support for generating individual property detail pages from JSON data
5. **Scalability:** Handles 1-300 properties without architecture changes; fast builds (v3.1.0 is 11% faster than previous version)
6. **Developer Experience:** Simple, focused tool; easy to modify templates; extensive documentation

**Initialization Command:**

```bash
npm create eleventy@latest -- --template=minimal
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
Node.js 18+; JavaScript/Nunjucks templating; no TypeScript required (optional if needed)

**Styling Solution:**
CSS-first approach (no CSS framework imposed). Integrate Tailwind CSS or similar via npm if desired.

**Build Tooling:**
Passthrough file copying for assets; image optimization via plugins (sharp, imagemin); CSS/JS minification via build plugins; outputs to `_site/` directory

**Code Organization:**
- `src/` — templates, data files, content
- `src/_data/` — global data (JSON property files)
- `src/_includes/` — reusable template components
- `_site/` — output static files (ready for FTP deploy to cPanel)

**Development Experience:**
Hot reload during development; local server on http://localhost:8080; fast incremental builds

**Deployment:**
Build output = static HTML files. GitHub Actions runs `npm run build`, generates `_site/`, deploys via FTP to cPanel.

**Note:** Project initialization using this command should be the first implementation story. Template structure for property listing and detail pages will be designed in next architectural decision phase.

## Core Architectural Decisions

### Critical Decisions (Block Implementation)

All critical decisions made. Ready to proceed to implementation.

### Frontend Architecture

**Decision: Client-Side Filtering Implementation**
- **Choice:** Vanilla JavaScript
- **Rationale:** Lightweight, fast, works on all browsers. For 1-300 properties with simple filters (type, price, bedrooms, location), vanilla JS filtering achieves required <500ms update speed with minimal bundle size. No framework overhead needed.
- **Affects:** Listing page component, filter UI interactions
- **Implementation:** Plain JavaScript event listeners on filter controls; array filter operations on property data loaded in page

**Decision: Styling Solution**
- **Choice:** Tailwind CSS
- **Version:** Latest stable (2026)
- **Rationale:** Utility-first CSS enables fast responsive design matching OneRoof-caliber polish. Integrates seamlessly with 11ty. Purges unused styles for minimal bundle. Handles mobile-first approach efficiently.
- **Affects:** All HTML templates, component styling, responsive breakpoints
- **Integration:** npm install tailwindcss; configure in 11ty build pipeline

**Decision: Image Optimization Strategy**
- **Choice:** Automatic download + build-time optimization
- **Process:**
  1. Google Sheets contains image URLs (no manual download needed)
  2. Excel → JSON conversion preserves URLs
  3. GitHub Actions build process:
     - Reads properties.json with image URLs
     - Downloads all images
     - Stores locally in `_site/images/`
     - Generates responsive sizes (mobile, tablet, desktop)
     - Creates WebP format + fallbacks
     - Updates HTML to reference local images
  4. Final site uses self-hosted optimized images
- **Build Impact:** +1-2 minutes per deploy (acceptable; runs automatically in GitHub Actions)
- **Performance Benefit:** Responsive images, WebP compression, no external dependencies, faster load times
- **Affects:** GitHub Actions workflow, 11ty build config, image pipeline

### Data Architecture

**Decision: Property Data File Organization**
- **Choice:** Single JSON file (`src/_data/properties.json`)
- **Rationale:** All property data in one file. Simpler than multiple files. 11ty's "Create Pages from Data" feature generates individual property detail pages automatically from the single array. Your Excel → JSON pipeline naturally outputs one file. Scales fine to 300+ properties.
- **File Structure:**
  ```json
  [
    {
      "id": "property-1",
      "address": "...",
      "price": ...,
      "bedrooms": ...,
      "bathrooms": ...,
      "imageUrls": ["url1", "url2", ...],
      "description": "...",
      "agentName": "...",
      "agentPhone": "...",
      "agentEmail": "...",
      "features": [...],
      "location": "...",
      ...
    }
  ]
  ```
- **Affects:** GitHub Actions JSON creation, 11ty data loading, page generation logic

### Infrastructure & Deployment

**Decision: GitHub Actions Secrets Management for Credentials**
- **Choice:** GitHub Secrets (encrypted)
- **Security Approach:**
  1. Store FTP username and password in GitHub Secrets (encrypted)
  2. GitHub Actions workflow reads secrets from environment
  3. FTP deployment command uses secret variables
  4. Credentials never exposed in code or logs
- **Setup:** One-time GitHub repository configuration
- **Affects:** GitHub Actions workflow file, FTP deployment step
- **Implementation Example:**
  ```yaml
  - name: Deploy to cPanel
    env:
      FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
      FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
      FTP_HOST: ${{ secrets.FTP_HOST }}
    run: |
      # FTP deployment command using secrets
  ```

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize 11ty project (`npm create eleventy@latest -- --template=minimal`)
2. Configure Tailwind CSS integration
3. Create 11ty build config for image download + optimization
4. Create property listing page template (uses vanilla JS filtering)
5. Create property detail page template (11ty generates from properties.json)
6. Set up GitHub Actions workflow (build + image download + FTP deploy)
7. Configure GitHub Secrets (FTP credentials)

**Cross-Component Dependencies:**
- Image optimization pipeline feeds processed images to HTML templates
- Vanilla JS filtering requires property data to be available in listing page (via 11ty data)
- GitHub Actions secrets enable secure FTP deployment of built `_site/` directory
- Tailwind CSS must be configured in 11ty build to process all template files

## Implementation Patterns & Consistency Rules

### Naming Conventions

**Template File Naming:**
All 11ty templates use simple, content-type-based names:
- `index.html` — homepage/landing page
- `listing.html` — property listing page with filtering
- `property.html` — property detail page template (11ty generates individual pages from properties.json)

**JSON Field Naming (properties.json):**
All property data fields use camelCase:
- `id` — unique property identifier (string or number)
- `address` — full street address
- `price` — listing price (number)
- `bedrooms` — number of bedrooms (number)
- `bathrooms` — number of bathrooms (number)
- `imageUrls` — array of image URLs (minimum 1 required)
- `description` — marketing text describing property
- `agentName` — agent name
- `agentEmail` — agent email address
- `agentPhone` — agent phone number
- `features` — array of special features (solar panels, pool, garage, etc.)
- `location` — suburb/region/location name
- `propertyType` — house, apartment, sectional title unit, land, etc.

Example property object:
```json
{
  "id": "property-123",
  "address": "123 Main Street, Suburb, City",
  "price": 850000,
  "bedrooms": 3,
  "bathrooms": 2,
  "imageUrls": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "description": "Beautiful renovated home with...",
  "agentName": "John Smith",
  "agentEmail": "john@example.com",
  "agentPhone": "+27-123-456-7890",
  "features": ["Solar Panels", "Swimming Pool", "Double Garage"],
  "location": "Takapuna",
  "propertyType": "House"
}
```

**CSS Class Naming:**
Hybrid approach: Use Tailwind CSS utility classes for all styling; minimal BEM for JavaScript hook selectors:
- Filter button: `<button class="filter-btn" data-type="house">` (Tailwind utilities applied, BEM class for JS)
- Property card: `<div class="property-card">` (Tailwind utilities applied, BEM for container scope)
- Image gallery: `<div class="image-gallery" data-property-id="123">` (Tailwind for styling, BEM for JS)

### File Organization

**JavaScript File Structure:**
Client-side JavaScript organized by concern:
- `src/_includes/js/filtering.js` — property filter logic (type, price, bedrooms, location)
- `src/_includes/js/gallery.js` — image gallery navigation and lightbox
- `src/_includes/js/utils.js` — shared utility functions (format price, helper methods, etc.)
- `src/_includes/js/main.js` — initialization script that runs on all pages

**Build Utilities:**
- `src/_11ty/` — 11ty configuration files and build utilities
- `src/_11ty/image-optimizer.js` — handles image download + optimization pipeline
- `src/_11ty/data-transformer.js` — transforms raw JSON properties into template-ready format

**Data Organization:**
- `src/_data/properties.json` — raw property data (read from Google Sheets export)
- `src/_data/` — only raw data files go here
- No processing logic in _data/ directory

**Static Assets:**
- `src/images/` — source images (only properties from _data will be downloaded here)
- `src/styles/` — CSS files (Tailwind config, custom CSS overrides)
- `src/fonts/` — if custom fonts needed

### Data Processing & Validation

**Property Data Validation:**

**Required Fields (Build fails if missing or invalid):**
- `id` — must be unique string/number
- `address` — must be non-empty string
- `price` — must be valid number
- `bedrooms` — must be number >= 0
- `bathrooms` — must be number >= 0
- `imageUrls` — must be array with minimum 1 valid URL (build fails if empty or missing)

**Optional Fields (Build continues if missing):**
- `description` — uses default "Property details not available" if missing
- `features` — renders as empty if missing
- `agentName`, `agentEmail`, `agentPhone` — show "Contact agent" fallback if any missing
- Additional images beyond first — property displays with just 1 image if more missing

**Image URL Handling:**
- If individual image URL fails to download: Log warning, skip that image, continue build
- If ALL image URLs fail for a property: Log warning, use fallback placeholder image, continue build
- Build never fails due to image errors (pattern: warn and continue)
- User monitors GitHub Actions log to see any image warnings

**Data File Format:**
Properties stored as JSON array in single file `src/_data/properties.json`:
```json
[
  { property object 1 },
  { property object 2 },
  ...
]
```

### Routing & URL Patterns

**Property Detail Page URLs:**
ID-based routing: `/properties/{propertyId}/`

Example URLs:
- `/properties/property-123/` → details for property with id="property-123"
- `/properties/abc-def-456/` → details for property with id="abc-def-456"

11ty uses `properties.json` with `pagination` to generate individual pages from the single data array.

**Listing Page:**
- `/` or `/index.html` — main property listing with filtering

### Enforcement Guidelines

**All AI Agents MUST follow these patterns:**

1. Use specified template file names (`index.html`, `listing.html`, `property.html`)
2. Use camelCase for all JSON property field names
3. Validate required fields (id, address, price, bedrooms, bathrooms, imageUrls with min 1)
4. Organize JavaScript by concern (separate files: filtering.js, gallery.js, utils.js)
5. Use Tailwind CSS for all styling (no inline styles)
6. Generate property URLs as `/properties/{id}/` format
7. Warn and continue on image errors (never fail build)
8. Use BEM class names only for JavaScript hooks (selectors)

### Pattern Examples

**Good Example - Property Card HTML:**
```html
<div class="property-card" data-property-id="123">
  <img src="/images/property-123-1.webp" alt="Main image of house at 123 Main St">
  <h3 class="text-xl font-bold">$850,000</h3>
  <p class="text-gray-600">123 Main Street, Suburb</p>
  <p class="text-sm">3 bed | 2 bath</p>
  <a href="/properties/property-123/" class="bg-blue-600 text-white px-4 py-2 rounded">View Details</a>
</div>
```

**Good Example - Filtering JavaScript:**
```javascript
// filtering.js
function filterProperties(properties, filters) {
  return properties.filter(prop => {
    if (filters.type && prop.propertyType !== filters.type) return false;
    if (filters.minPrice && prop.price < filters.minPrice) return false;
    if (filters.maxPrice && prop.price > filters.maxPrice) return false;
    if (filters.bedrooms && prop.bedrooms < filters.bedrooms) return false;
    if (filters.location && prop.location !== filters.location) return false;
    return true;
  });
}
```

**Anti-Pattern - Avoid:**
- ❌ Inline styles: `<div style="color: red; font-size: 16px">`
- ❌ Mixed camelCase/snake_case in JSON: `{bedrooms: 3, bath_count: 2}`
- ❌ All JavaScript in one massive file (use separate concern files)
- ❌ Property URLs without IDs: `/properties/main-street-home/` (use `/properties/{id}/` format)
- ❌ Build fails on image errors (must warn and continue)
