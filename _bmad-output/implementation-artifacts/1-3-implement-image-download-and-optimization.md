# Story 1.3: Implement Image Download and Optimization

**Status:** ready-for-dev

**Epic:** 1 - Project Initialization & Deployment Infrastructure

**Story ID:** 1.3

**Created:** 2026-04-05

**Depends On:** Story 1.2 (Excel → JSON Data Pipeline) ✅ Complete

---

## Story Statement

As a system,
I want to automatically download images from URLs listed in property data and optimize them for web delivery,
So that images are compressed, responsive, and ready for deployment without manual processing.

---

## Acceptance Criteria

### Given the build process reads properties.json with imageUrls array

### When the 11ty build starts

### Then the build process:

- ✅ Downloads all images from the URLs in imageUrls
- ✅ Stores downloaded images in `_site/images/` directory
- ✅ Optimizes images for web (compresses, reduces file size)
- ✅ Generates responsive sizes for mobile (640px), tablet (1024px), and desktop (1920px) breakpoints
- ✅ Creates WebP format versions with fallback to original format

### And if an individual image URL fails to download, the build logs a warning but continues (doesn't fail)

### And if all images for a property fail, a placeholder image is used and a warning is logged

### And the build never fails due to image errors (warn and continue pattern)

### And optimized images are referenced in generated HTML with proper src/srcset attributes

---

## Developer Context

### Story Purpose & Impact

This story implements the **image pipeline** that automates image download, optimization, and responsive sizing. It's critical because:

1. **Eliminates Manual Work:** Images download automatically from URLs; no manual resizing needed
2. **Performance Critical:** Responsive images + WebP significantly reduce page load time
3. **Build Foundation:** Enables Story 1.4 (GitHub Actions) to have complete build pipeline
4. **User Experience:** Fast, beautiful images directly impact buyer engagement

**Why This Matters:** Without optimized images, the site loads slowly and degrades user experience. This story ensures every image is properly sized for every device.

**Complexity:** High. Requires build-time image processing, multiple formats, responsive sizing, and robust error handling.

---

## Technical Requirements & Guardrails

### Image Processing Pipeline

The build process must implement this complete pipeline:

**1. Image Download Phase:**
- Read all imageUrls from `src/_data/properties.json`
- Download images from external URLs
- Store originals in temporary directory (not committed)
- Skip failed downloads, log warning, continue build

**2. Optimization Phase:**
- Compress images for web (reduce file size by 50%+)
- Generate three responsive sizes:
  - Mobile: 640px wide (phones)
  - Tablet: 1024px wide (tablets)
  - Desktop: 1920px wide (large screens)
- For each size, create both JPEG and WebP formats
- Result per image: 6 files (3 sizes × 2 formats)

**3. Storage Phase:**
- Store optimized images in `_site/images/` directory
- Filename format: `property-{id}-{size}.{format}`
  - Example: `property-1-640.webp`, `property-1-1024.jpg`
- Never include in git (add to .gitignore)
- Only exist in `_site/` (build output)

**4. HTML Reference Phase:**
- Update HTML templates to reference optimized images
- Use `<picture>` element with WebP first, JPEG fallback
- Add `srcset` attribute for responsive sizing
- Example HTML structure:
```html
<picture>
  <source media="(min-width: 1920px)" srcset="/images/property-1-1920.webp" type="image/webp">
  <source media="(min-width: 1024px)" srcset="/images/property-1-1024.webp" type="image/webp">
  <source media="(max-width: 1023px)" srcset="/images/property-1-640.webp" type="image/webp">
  <img src="/images/property-1-640.jpg" alt="Property description">
</picture>
```

[Source: architecture.md#Image Optimization Strategy, lines 140-155]

### Required Tools & Libraries

**Image Processing:**
- `sharp` npm package (fast, reliable image processing)
- `imagemin` and plugins for compression
- Supports JPEG, WebP, PNG formats

**Installation:**
```bash
npm install --save-dev sharp imagemin imagemin-mozjpeg imagemin-webp
```

**Build Integration:**
- Create `scripts/optimize-images.js` (custom build script)
- Integrate into `.eleventy.js` or npm script
- Run during `npm run build`
- Timing: Should complete in <2 minutes for 100 images

### Image Quality Standards

**JPEG Settings:**
- Quality: 80% (good quality, reasonable file size)
- Progressive JPEG: enabled (better progressive loading)

**WebP Settings:**
- Quality: 75-80% (WebP has better compression than JPEG)
- Lossy compression: enabled

**Target File Sizes:**
- Original Unsplash images: ~150-300KB each
- Optimized mobile (640px): ~30-50KB per format
- Optimized tablet (1024px): ~50-80KB per format
- Optimized desktop (1920px): ~80-150KB per format
- Reduction target: 60-80% smaller than original

### Error Handling Strategy

**Graceful Degradation:**
- If image download fails: log warning, skip image, continue build ✅
- If image optimization fails: use original image, log warning, continue ✅
- If all images for property fail: use placeholder, log warning, continue ✅
- **Build must never fail due to image errors** (warn-and-continue pattern)

**Logging:**
- Log each image URL being processed
- Log success/failure for each download
- Log optimization results (original size → optimized size)
- Summary report: X images downloaded, Y failed, Z optimized

### Responsive Image Strategy

**Breakpoints (matching TailwindCSS):**
- Mobile: 0-639px → use 640px image
- Tablet: 640-1023px → use 1024px image
- Desktop: 1024px+ → use 1920px image

**Picture Element Approach:**
- Use `<picture>` element (not just img srcset)
- Primary source: WebP format (modern browsers, better compression)
- Fallback source: JPEG format (older browsers)
- Final img tag: low-quality placeholder or base image

[Source: ux-design-specification.md#Image Gallery Interaction & Responsive Design]

---

## Architecture Compliance

### Core Decisions Relevant to This Story

**Decision 1: Build-Time Image Optimization**
- **Choice:** Optimize images during `npm run build`, not at runtime
- **Why:** Static site generation; all images ready at deploy time; no server-side processing needed
- **Affects:** Build time (+1-2 minutes), .eleventy.js configuration
- **Important:** Images are created once during build and deployed as-is

[Source: architecture.md#Image Optimization Strategy, lines 140-155]

**Decision 2: Self-Hosted Images Only**
- **Choice:** Download and store all images locally, never link to external URLs
- **Why:** Performance, reliability, independence from CDN
- **Affects:** Image storage in `_site/images/`, no external image URLs in HTML
- **Important:** Complete control over image delivery and optimization

**Decision 3: Responsive Sizing with Multiple Formats**
- **Choice:** Generate 3 sizes × 2 formats = 6 files per image
- **Why:** Optimal performance across all devices; WebP for modern browsers; JPEG fallback for compatibility
- **Affects:** Disk usage (6× original images), build time, HTML complexity
- **Important:** Ensures fast loading on all device types

**Decision 4: Warn-and-Continue Error Handling**
- **Choice:** Build continues even if some images fail to download/optimize
- **Why:** Robust deployment; doesn't block site rebuild if image URL is temporarily unavailable
- **Affects:** Logging requirements, placeholder image handling
- **Important:** Site stays live even if one property's images are temporarily unavailable

### Architectural Constraints to Respect

1. **Static Generation Only:** All image processing happens at build time
   - No runtime image fetching or processing
   - All images must be in `_site/` before deployment

2. **No External Dependencies:** Images must not reference external CDNs
   - All images self-hosted
   - Improves performance and independence

3. **Build Time Budget:** Optimization should complete in <2 minutes
   - Currently: 0.15 seconds (10 properties, minimal templates)
   - With images: estimated +1-2 minutes
   - Total build: <5 minutes (acceptable for GitHub Actions)

4. **File Size Limits:** Each image format must be optimized
   - Target 60-80% reduction from original
   - Mobile images: <50KB
   - Desktop images: <150KB

---

## Task Breakdown

- [ ] **Task 1: Create Image Optimization Script** (AC: Primary)
  - [ ] Create `scripts/optimize-images.js` file
  - [ ] Implement image download logic from imageUrls
  - [ ] Implement sharp-based optimization pipeline
  - [ ] Implement responsive size generation (640px, 1024px, 1920px)
  - [ ] Implement WebP + JPEG format creation
  - [ ] Add error handling (warn-and-continue)

- [ ] **Task 2: Integrate with Build Process** (AC: When)
  - [ ] Update `.eleventy.js` to run optimization script during build
  - [ ] Or create npm script wrapper for optimization
  - [ ] Ensure optimization runs before 11ty processes templates
  - [ ] Verify build process includes image optimization

- [ ] **Task 3: Test Image Download & Optimization** (AC: Then)
  - [ ] Run build with optimization enabled
  - [ ] Verify images download from all URLs
  - [ ] Verify responsive sizes created (640, 1024, 1920)
  - [ ] Verify both WebP and JPEG formats created
  - [ ] Verify file size reduction (target 60-80%)
  - [ ] Check build log for optimization results

- [ ] **Task 4: Implement Placeholder Image** (AC: And)
  - [ ] Create placeholder image (generic property photo)
  - [ ] Use when all images for property fail to download
  - [ ] Store in `src/images/placeholder.jpg`
  - [ ] Reference in error handling code

- [ ] **Task 5: Verify Error Handling** (AC: And)
  - [ ] Test with bad image URL (one URL fails)
  - [ ] Verify build continues (doesn't fail)
  - [ ] Verify warning logged for failed URL
  - [ ] Verify other images for property still optimize

- [ ] **Task 6: Update HTML Templates** (AC: And)
  - [ ] Create responsive image helper/component
  - [ ] Update templates to use `<picture>` element
  - [ ] Implement WebP + JPEG fallback pattern
  - [ ] Add srcset for responsive sizing
  - [ ] Test image rendering in built HTML

- [ ] **Task 7: Verify Build Output & Performance** (AC: Completion)
  - [ ] Run full `npm run build` with all images
  - [ ] Verify all images in `_site/images/`
  - [ ] Verify both formats (WebP and JPEG) exist
  - [ ] Verify all sizes (640, 1024, 1920) exist
  - [ ] Check build time (target: <2 minutes for images)
  - [ ] Commit optimized image logic to git

---

## Dev Notes

### Important Context & Patterns

**Why Multiple Sizes?**
- Mobile users (640px) don't need 1920px image (wastes bandwidth)
- Desktop users benefit from high-quality 1920px images
- Tablet users get medium 1024px images
- This responsive approach saves 70%+ bandwidth on mobile

**Why WebP First?**
- WebP is 25-35% smaller than JPEG at same quality
- Supported by 95%+ modern browsers
- JPEG is fallback for older browsers
- Using both ensures maximum compatibility + performance

**Why Warn-and-Continue?**
- URLs sometimes temporarily unavailable
- If build fails on one bad URL, entire deployment blocks
- Instead: log warning, skip image, use placeholder
- Site stays live and updated even if one property's gallery is temporarily broken

**Build Order is Critical:**
1. Read properties.json (already done, Task 1.2)
2. Download images from URLs
3. Optimize images (create responsive sizes)
4. Store in `_site/images/`
5. 11ty processes templates (references optimized images)
6. Final output: HTML referencing optimized images

### Architecture Patterns to Establish Now

1. **Build Script Isolation:**
   - Keep image optimization in separate script file
   - Call from `.eleventy.js` or npm script
   - Makes testing and maintenance easier

2. **Configuration-Driven:**
   - Store sizes (640, 1024, 1920) in configuration
   - Store quality settings (JPEG 80, WebP 75) in configuration
   - Easy to adjust without changing logic

3. **Logging & Transparency:**
   - Log every significant action (download, optimize, skip)
   - Summary report at end of build
   - Helps debug issues and understand performance

### Common Pitfalls to Avoid

1. **Broken Build on First Image Failure:**
   - Must implement warn-and-continue pattern
   - Test with intentionally bad URL
   - Verify build completes successfully

2. **Forgetting WebP Fallback:**
   - Some older browsers don't support WebP
   - Always provide JPEG fallback
   - Test in older browser (or use caniuse)

3. **Missing Responsive Sizes:**
   - Don't just optimize to one size
   - Need all three (640, 1024, 1920) for true responsiveness
   - Missing sizes = poor mobile or desktop experience

4. **Poor Error Messages:**
   - When image fails, log the URL and reason
   - Makes debugging much easier
   - Include count: "5 of 10 images failed"

5. **Ignoring File Size Targets:**
   - Poor compression = slow site
   - Set target file sizes and validate
   - Monitor that reduction is 60-80%

---

## Testing Strategy

### Manual Testing Checklist (All Required)

**Setup:**
- [ ] Install required packages: `npm install --save-dev sharp imagemin imagemin-mozjpeg imagemin-webp`
- [ ] Create `scripts/optimize-images.js`
- [ ] Update `.eleventy.js` to call optimization before build

**Image Download:**
- [ ] Run build with optimization enabled
- [ ] Verify images download from Unsplash URLs
- [ ] Check build log for download messages
- [ ] Confirm all 10 properties' images downloaded

**Responsive Sizing:**
- [ ] Verify 640px size created for each image
- [ ] Verify 1024px size created for each image
- [ ] Verify 1920px size created for each image
- [ ] Confirm file sizes decrease as width decreases

**Format Generation:**
- [ ] Verify WebP format created for each size
- [ ] Verify JPEG format created for each size
- [ ] Check file size reduction: JPEG vs original, WebP vs JPEG
- [ ] Target: 60-80% reduction from original

**File Storage:**
- [ ] Verify files in `_site/images/` directory
- [ ] Check naming convention: `property-{id}-{size}.{format}`
- [ ] Verify no images committed to git (add to .gitignore)
- [ ] Verify `_site/images/` in build output only

**Error Handling:**
- [ ] Test with one bad image URL (modify properties.json temporarily)
- [ ] Verify build completes (doesn't fail)
- [ ] Check build log for warning about failed image
- [ ] Verify other images for property still optimized
- [ ] Verify placeholder used for failed images

**HTML Output:**
- [ ] Inspect `_site/index.html` (or detail page)
- [ ] Verify `<picture>` elements present
- [ ] Verify WebP sources listed first
- [ ] Verify JPEG fallback present
- [ ] Verify srcset attributes for responsive sizing
- [ ] Verify alt text present for accessibility

**Build Performance:**
- [ ] Measure build time with images enabled
- [ ] Target: <2 minutes for image optimization
- [ ] Verify total build time still <5 minutes
- [ ] Log optimization summary

### Performance Baselines

- **Image Download Time:** ~10-30 seconds for 10 properties (depends on network)
- **Optimization Time:** ~30-60 seconds for 30 images (3 per property)
- **Total Image Processing:** <2 minutes (acceptable for automated build)
- **Total Build Time:** <5 minutes (with images, templates, optimization)
- **File Size Reduction:** 60-80% smaller than originals
- **Disk Space:** ~500KB-1MB for all optimized images (acceptable)

---

## Dev Agent Record

### Completion Checklist

Before marking this story complete, verify:

- [ ] All 7 tasks above completed
- [ ] Image optimization script created and integrated
- [ ] All images download from properties.json URLs
- [ ] Responsive sizes generated (640px, 1024px, 1920px)
- [ ] Both WebP and JPEG formats created
- [ ] Error handling verified (warn-and-continue)
- [ ] Placeholder image used when downloads fail
- [ ] HTML templates updated for responsive images
- [ ] Build completes in <5 minutes with images
- [ ] File size reduction verified (60-80%)
- [ ] git commit created with image optimization logic

### File List (After Completion)

**Created/Modified:**
- `scripts/optimize-images.js` — Image download and optimization script
- `src/images/placeholder.jpg` — Fallback image for failed downloads
- `.eleventy.js` — Updated to call image optimization
- `.gitignore` — Add `_site/images/` (generated, not committed)
- HTML templates — Updated to use `<picture>` elements

**Generated (not committed):**
- `_site/images/property-*.webp` — Optimized WebP images (all sizes)
- `_site/images/property-*.jpg` — Optimized JPEG images (all sizes)
- `_site/images/placeholder.jpg` — Fallback image (copied to _site/)

### Next Story Dependency

Story 1.4 (GitHub Actions Workflow) depends on this story's completion:
- Requires image optimization working in local build
- Requires build to complete in <5 minutes
- Requires no build failures due to image errors
- Workflow will run this same build in GitHub Actions

---

## References & Source Documentation

**Architecture Requirements:**
- [Source: architecture.md#Image Optimization Strategy] — Optimization strategy and approach
- [Source: architecture.md#Technical Constraints] — Build time budget and cPanel compatibility
- [Source: ux-design-specification.md#Image Gallery] — Image gallery UX requirements

**Project Requirements:**
- [Source: epics.md#Story 1.3] — Original story definition
- [Source: prd.md#Technical Requirements] — Performance requirements

**Image Processing Libraries:**
- [Sharp Documentation](https://sharp.pixelplumbing.com/) — Image processing library
- [ImageMin Documentation](https://github.com/imagemin/imagemin) — Image compression
- [ImageMin WebP Plugin](https://github.com/imagemin/imagemin-webp) — WebP format support

**Responsive Images:**
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) — Best practices
- [Picture Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) — HTML picture element

---

## Implementation Notes

### Why This Order of Execution

1. **Create optimization script first** — Core logic before integration
2. **Integrate into build** — Make it part of build pipeline
3. **Test locally** — Verify with real data and URLs
4. **Handle errors** — Implement graceful degradation
5. **Update templates** — Reference optimized images
6. **Verify performance** — Ensure build stays <5 minutes
7. **Commit to git** — Finalize implementation

### Success Indicators

This story is **complete when**:

1. ✅ `scripts/optimize-images.js` exists and works
2. ✅ All images download from properties.json URLs
3. ✅ Responsive sizes created: 640px, 1024px, 1920px
4. ✅ WebP + JPEG formats for each size
5. ✅ File size reduction: 60-80% smaller
6. ✅ Error handling: warn-and-continue (build never fails)
7. ✅ Placeholder image used for failed downloads
8. ✅ HTML uses `<picture>` elements with proper fallbacks
9. ✅ Build completes in <5 minutes with images
10. ✅ All changes committed to git

### Next Story Sequence

After this story completes:
1. Story 1.4: Create GitHub Actions Workflow
2. Story 1.5: Configure FTP Deployment
3. Story 1.6: Data Validation & Error Handling
4. Story 2.1: Property Listing Page Template (Epic 2 begins)

---

## Story Metadata

| Field | Value |
|-------|-------|
| Epic | 1: Project Initialization & Deployment Infrastructure |
| Story Number | 1.3 |
| Dependency | Story 1.2 (Excel → JSON Data Pipeline) ✅ |
| Blocks | Stories 1.4, 1.5, 1.6 (remaining Epic 1 stories) |
| Blocks | Epic 2-6 (all features require optimized images) |
| Complexity | High (build automation, image processing, error handling) |
| Story Points (Estimate) | 5 |
| Time Estimate | 2-3 hours |
| Risk | Medium (requires learning sharp/imagemin, error handling complexity) |

---

**End of Story 1.3**
