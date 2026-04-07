# Story 6.1: Implement Keyboard Navigation and Screen Reader Support

Status: ready-for-dev

## Story

As a user with disabilities,
I want to navigate and use the entire website using only keyboard and screen reader,
So that I can access all content and functionality regardless of my abilities.

## Acceptance Criteria

1. **Keyboard Navigation**
   - Tab through all interactive elements in logical order
   - Activate buttons/links using Enter or Space key
   - Navigate form fields with Tab and submit with Enter
   - Close modals/popups with Escape key
   - Control image carousels with arrow keys
   - Keyboard navigation order is logical: Header → Navigation → Main content → Sidebar (if exists) → Footer

2. **Focus Indicators**
   - Keyboard focus is clearly visible (outline, highlight, or underline)
   - Focus indicator meets color contrast requirements
   - Focus state distinct from hover state
   - No keyboard traps (can always Tab out of any element)

3. **Screen Reader Support**
   - Page title and main heading (H1) announced
   - Navigation structure and links announced
   - Form fields and their labels announced (not just placeholder text)
   - Buttons and their purpose announced ("Submit form", "Close modal", etc.)
   - Images with meaningful alt text announced
   - Error messages and validation feedback announced
   - Results count updates announced when filtering
   - Success/error messages from form submission announced

4. **Form Accessibility**
   - Every input has associated `<label>` element (not just placeholder)
   - Error messages associated with form fields via aria-describedby
   - Required fields marked with aria-required or aria-label
   - List structure is semantic: Navigation uses `<nav>` and `<ul>`/`<li>`

5. **Semantic HTML & Landmark Roles**
   - `<header>`, `<main>`, `<footer>`, `<nav>` semantic tags used
   - Page structure is clear to assistive technology
   - Proper heading hierarchy (H1, H2, H3 only—no skipped levels)

## Tasks / Subtasks

- [ ] Task 1: Verify Keyboard Navigation (AC: #1, #2)
  - [ ] Subtask 1.1: Test Tab through all interactive elements on listing page
  - [ ] Subtask 1.2: Test Tab through all interactive elements on property detail page
  - [ ] Subtask 1.3: Verify focus indicators are visible and meet contrast
  - [ ] Subtask 1.4: Test Enter/Space key activation of buttons and links
  - [ ] Subtask 1.5: Verify no keyboard traps exist

- [ ] Task 2: Implement Screen Reader Support (AC: #3)
  - [ ] Subtask 2.1: Verify all alt text present and descriptive for images
  - [ ] Subtask 2.2: Verify form labels present and associated with inputs
  - [ ] Subtask 2.3: Verify buttons have descriptive text (not just "Click here")
  - [ ] Subtask 2.4: Add aria-live regions for dynamic updates (filter results)
  - [ ] Subtask 2.5: Verify error messages announced to screen readers

- [ ] Task 3: Verify Form Accessibility (AC: #4)
  - [ ] Subtask 3.1: Check all form fields have associated `<label>` elements
  - [ ] Subtask 3.2: Associate error messages with fields via aria-describedby
  - [ ] Subtask 3.3: Mark required fields appropriately
  - [ ] Subtask 3.4: Test form completion with keyboard only

- [ ] Task 4: Verify Semantic HTML (AC: #5)
  - [ ] Subtask 4.1: Check proper use of `<header>`, `<nav>`, `<main>`, `<footer>`
  - [ ] Subtask 4.2: Verify heading hierarchy (no skipped levels)
  - [ ] Subtask 4.3: Check list structures use `<ul>`/`<ol>`/`<li>`
  - [ ] Subtask 4.4: Verify button/link elements used correctly (not divs styled as buttons)

- [ ] Task 5: Test with Screen Reader (AC: All)
  - [ ] Subtask 5.1: Test with NVDA or JAWS on Windows
  - [ ] Subtask 5.2: Test keyboard-only navigation end-to-end
  - [ ] Subtask 5.3: Verify all content is accessible
  - [ ] Subtask 5.4: Run accessibility audit (axe DevTools or WAVE)
  - [ ] Subtask 5.5: Document any issues and fixes

## Dev Notes

### Previous Implementation

Most of the semantic HTML already exists from previous stories:
- Story 4.4: Semantic HTML structure in property.html
- Story 2.1: Layout and header structure
- Story 3.1: Filter bar with labels and form elements

This story verifies and enhances keyboard and screen reader support.

### Testing Tools

- NVDA (free, Windows): https://www.nvaccess.org/
- JAWS (paid, Windows/Mac)
- VoiceOver (Mac/iOS built-in)
- axe DevTools (browser extension)
- WAVE (browser extension)

### File Structure

Files to modify:
- May need to add aria-labels, aria-describedby attributes
- May need to enhance focus styling in layout.html
- May need to add skip links for accessibility

### References

- [Epics: Story 6.1](../_bmad-output/planning-artifacts/epics.md#story-61-implement-keyboard-navigation-and-screen-reader-support)
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

Files to be modified:
- `src/_includes/layout.html` - May add focus styling
- `src/property.html` - May add aria labels
- `src/listing.html` - May add aria labels

### Change Log

(To be filled during implementation)
