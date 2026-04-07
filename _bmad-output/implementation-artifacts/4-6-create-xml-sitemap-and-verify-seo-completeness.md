# Story 4.6: Create XML Sitemap and Verify SEO Completeness

Status: ready-for-dev

## Story

As a search engine,
I want to receive an XML sitemap that lists all property pages with last modified dates,
So that I can discover and crawl all property pages efficiently.

## Acceptance Criteria

1. **XML Sitemap Generation**
   - `_site/sitemap.xml` file is generated containing:
     - All property detail page URLs: `/properties/{propertyId}/`
     - Listing page URL: `/`
     - lastmod dates (when property was last updated)
     - changefreq: "weekly" for property pages, "daily" for listing
     - priority: 1.0 for listing, 0.8 for property pages
   - Sitemap validates with online sitemap validators

2. **robots.txt Configuration**
   - robots.txt file created at `/robots.txt`
   - Allows crawlers to access pages
   - References sitemap: `/robots.txt` includes sitemap URL

3. **Semantic HTML & Link Verification**
   - Listing page includes canonical tag pointing to itself
   - No noindex tags present (allow indexing)
   - Proper language meta tag present
   - Each property page includes canonical tag pointing to itself
   - Proper heading hierarchy (H1, H2, H3 only—no skipped levels)
   - Internal linking strategy verified (property cards link to detail pages, detail pages link back to listing)
   - No broken internal links (404s)

4. **SEO Audit Results**
   - All pages pass basic Lighthouse SEO audit (>90 score)
   - Heading hierarchy verified across all pages
   - Canonical tags present and correct
   - Meta tags complete and unique

## Tasks / Subtasks

- [ ] Task 1: Generate XML Sitemap (AC: #1)
  - [ ] Subtask 1.1: Create 11ty plugin or build script to generate sitemap.xml
  - [ ] Subtask 1.2: Include all property pages with property IDs
  - [ ] Subtask 1.3: Include listing page URL (/)
  - [ ] Subtask 1.4: Set changefreq: "daily" for listing, "weekly" for properties
  - [ ] Subtask 1.5: Set priority: 1.0 for listing, 0.8 for properties
  - [ ] Subtask 1.6: Test sitemap generation and verify XML formatting

- [ ] Task 2: Create robots.txt (AC: #2)
  - [ ] Subtask 2.1: Create robots.txt file at root level
  - [ ] Subtask 2.2: Allow crawlers: User-agent: * / Disallow: (empty or specific paths)
  - [ ] Subtask 2.3: Add sitemap reference: Sitemap: https://ppiproperties.com/sitemap.xml
  - [ ] Subtask 2.4: Test robots.txt accessibility and syntax

- [ ] Task 3: Verify HTML Structure & Links (AC: #3)
  - [ ] Subtask 3.1: Verify heading hierarchy on listing page (H1, no H3 before H2, etc.)
  - [ ] Subtask 3.2: Verify heading hierarchy on property detail pages
  - [ ] Subtask 3.3: Verify canonical tags on listing page
  - [ ] Subtask 3.4: Verify canonical tags on all property pages
  - [ ] Subtask 3.5: Check for no noindex tags
  - [ ] Subtask 3.6: Verify internal links (listing → properties, properties → listing/next/prev)
  - [ ] Subtask 3.7: Test links for 404s by crawling generated site

- [ ] Task 4: Run SEO Audit (AC: #4)
  - [ ] Subtask 4.1: Run Lighthouse SEO audit on listing page
  - [ ] Subtask 4.2: Run Lighthouse SEO audit on sample property pages (2-3)
  - [ ] Subtask 4.3: Document audit scores (target >90 for all)
  - [ ] Subtask 4.4: Fix any critical SEO issues found
  - [ ] Subtask 4.5: Verify all scores meet >90 threshold
  - [ ] Subtask 4.6: Document results and any recommendations

- [ ] Task 5: Final Verification (AC: All)
  - [ ] Subtask 5.1: Run full build and verify sitemap.xml is generated
  - [ ] Subtask 5.2: Validate sitemap with online validator (XML Sitemap Validator)
  - [ ] Subtask 5.3: Verify robots.txt is accessible and correct
  - [ ] Subtask 5.4: Run final Lighthouse SEO audit on all page types
  - [ ] Subtask 5.5: Document SEO completeness summary

## Dev Notes

### Architecture & Technical Context

**Sitemap Generation Approach:**
- Use 11ty's output directory to generate sitemap.xml
- Can use: npm package `@quasibit/eleventy-plugin-sitemap` or custom build script
- Sitemap should be placed in _site/sitemap.xml (root level after deployment)
- Include all URLs from pagination: listing page + all property detail pages

**robots.txt Location:**
- Place in src/robots.txt (will be copied to _site/robots.txt)
- Use 11ty's passthrough copy if not in src/ by default
- Or place directly in _site/robots.txt during build

**Verification Approach:**
- Inspect generated HTML files for heading hierarchy
- Use browser DevTools to check canonical tags
- Crawl _site/ directory to verify all internal links work
- Use Lighthouse CLI or DevTools for SEO audit
- Validate sitemap XML structure

**Previous Story Integration:**
- Story 4.5 already implemented: meta tags, Open Graph, JSON-LD
- Story 4.4 already implemented: canonical tags, language tags
- All prerequisite SEO metadata is in place

### Testing Strategy

1. **Sitemap Testing:**
   - Validate XML structure
   - Check all URLs are present
   - Verify changefreq and priority values

2. **robots.txt Testing:**
   - Verify file is accessible at /robots.txt
   - Check syntax is correct
   - Verify sitemap reference is included

3. **HTML Verification:**
   - Check heading hierarchy programmatically
   - Verify canonical tags present
   - Test internal links with crawler

4. **SEO Audit:**
   - Run Lighthouse with SEO category
   - Document baseline scores
   - Fix issues to reach >90

### Edge Cases to Handle

- Property with missing data: Should still appear in sitemap
- No changes to properties: Use build date as lastmod
- Empty description/title: Fallback text in meta tags
- Property deletion: Not applicable for this sprint (backlog)

### References

- [Epics: Story 4.6 Requirements](../_bmad-output/planning-artifacts/epics.md#story-46-create-xml-sitemap-and-verify-seo-completeness)
- [Story 4.5: SEO Metadata Implementation](./4-5-generate-seo-metadata-per-property.md)
- [Story 4.4: Property Details](./4-4-display-property-details-and-agent-contact-on-detail-page.md)
- 11ty Sitemap Plugins: https://www.11ty.dev/docs/plugins/
- XML Sitemap Validator: https://www.xml-sitemaps.com/
- Google Search Console: https://search.google.com/search-console

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

Files to be created:
- `src/robots.txt` - robots.txt configuration file
- `_site/sitemap.xml` - Generated XML sitemap (auto-created by build process)

Files to be modified:
- `.eleventy.js` - May need to add sitemap plugin or build step

### Change Log

(To be filled during implementation)
