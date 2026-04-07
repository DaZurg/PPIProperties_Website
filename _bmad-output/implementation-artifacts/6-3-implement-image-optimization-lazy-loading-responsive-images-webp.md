# Story 6.3: Implement Image Optimization (Lazy Loading, Responsive Images, WebP)

Status: ready-for-dev

## Story

As a user on slow mobile connection,
I want images to load lazily and responsively at appropriate sizes,
So that the website stays fast even with many high-quality images.

## Acceptance Criteria

1. **Lazy Loading**
   - Listing page: Images below the fold don't load until scrolled into view
   - Detail page carousel: Only visible images and adjacent thumbnails load immediately
   - Below-fold images load when user scrolls to them
   - Placeholder or low-quality image shown while loading (optional)

2. **Responsive Images**
   - Different image sizes for mobile (640px), tablet (1024px), desktop (1920px)
   - `<img src="image-640.jpg" srcset="image-640.jpg 640w, image-1024.jpg 1024w, image-1920.jpg 1920w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" alt="..."/>`
   - Browser selects appropriate size based on viewport
   - Images scale correctly without distortion

3. **Modern Image Formats**
   - WebP format for modern browsers (smaller file size)
   - Fallback to JPEG/PNG for older browsers
   - Can use `<picture>` element or srcset type variant

4. **Image Compression**
   - JPEG: Quality 75-85 for property images
   - PNG: Lossless compression, used only when necessary
   - WebP: High compression with quality 75-80
   - Typical property photo: 50-150KB (not 2MB+)

5. **Gallery Performance**
   - Carousel images load smoothly without lag
   - Thumbnail images are smaller (50-100KB) or very compressed
   - Main image loads before user clicks (or quickly)
   - Smooth scrolling maintained even while loading

## Tasks / Subtasks

- [ ] Task 1: Implement Lazy Loading (AC: #1)
  - [ ] Subtask 1.1: Add loading="lazy" to listing page card images
  - [ ] Subtask 1.2: Test lazy loading on slow connection (DevTools throttle)
  - [ ] Subtask 1.3: Verify below-fold images load only on scroll
  - [ ] Subtask 1.4: Add lazy loading to detail page carousel images

- [ ] Task 2: Implement Responsive Images (AC: #2)
  - [ ] Subtask 2.1: Generate multiple image sizes (640px, 1024px, 1920px)
   - [ ] Subtask 2.2: Add srcset attributes to property card images
  - [ ] Subtask 2.3: Add sizes attribute for responsive sizing
  - [ ] Subtask 2.4: Test on mobile, tablet, desktop viewports
  - [ ] Subtask 2.5: Verify correct size is loaded for each viewport

- [ ] Task 3: Implement WebP Format (AC: #3)
  - [ ] Subtask 3.1: Generate WebP versions of all images
  - [ ] Subtask 3.2: Create `<picture>` elements with WebP source
  - [ ] Subtask 3.3: Include JPEG/PNG fallback
  - [ ] Subtask 3.4: Test in modern and older browsers
  - [ ] Subtask 3.5: Verify WebP is used in modern browsers (DevTools Network)

- [ ] Task 4: Verify Image Compression (AC: #4)
  - [ ] Subtask 4.1: Check JPEG file sizes (target 50-150KB)
  - [ ] Subtask 4.2: Check WebP file sizes
  - [ ] Subtask 4.3: Verify quality is acceptable
  - [ ] Subtask 4.4: Compress any oversized images

- [ ] Task 5: Test Performance (AC: #5)
  - [ ] Subtask 5.1: Run Lighthouse performance audit
  - [ ] Subtask 5.2: Test on slow 3G connection
  - [ ] Subtask 5.3: Verify carousel loads smoothly
  - [ ] Subtask 5.4: Check Network tab for lazy-loaded images
  - [ ] Subtask 5.5: Document performance improvements

## Dev Notes

### Current Image Pipeline

Image optimization already implemented in Story 1.3:
- Images downloaded and optimized during build
- Multiple sizes generated (640px, 1024px, 1920px)
- WebP format created
- Images stored in `src/images/` or `_site/images/`

This story integrates the optimized images into templates.

### Implementation Notes

- Use native `loading="lazy"` attribute (browser support good)
- Use `<picture>` element for WebP/JPEG fallback
- Sizes attribute: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
- Image optimization already done by Story 1.3 pipeline
- Just need to add srcset, sizes, and lazy loading attributes

### File Structure

Files to modify:
- `src/_includes/property-card.html` - Add srcset, sizes, lazy loading
- `src/_includes/image-carousel.html` - Add srcset, sizes, lazy loading
- `src/property.html` - May need image attribute updates

### References

- [Epics: Story 6.3](../_bmad-output/planning-artifacts/epics.md#story-63-implement-image-optimization-lazy-loading-responsive-images-webp)
- [Story 1.3: Image Download and Optimization](./1-3-implement-image-download-and-optimization.md)
- MDN: Responsive images - https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
- MDN: Lazy loading - https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

Files to be modified:
- `src/_includes/property-card.html` - Add responsive image attributes
- `src/_includes/image-carousel.html` - Add lazy loading and responsive images
- `src/property.html` - Update image attributes

### Change Log

(To be filled during implementation)
