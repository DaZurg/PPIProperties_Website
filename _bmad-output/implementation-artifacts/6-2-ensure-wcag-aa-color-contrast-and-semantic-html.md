# Story 6.2: Ensure WCAG AA Color Contrast and Semantic HTML

Status: ready-for-dev

## Story

As a user with vision impairments or color blindness,
I want all text and interactive elements to have sufficient color contrast,
So that I can read and use the website comfortably.

## Acceptance Criteria

1. **Color Contrast Requirements (WCAG AA)**
   - Normal text (body copy): minimum 4.5:1 contrast ratio
   - Large text (18pt+ or 14pt+ bold): minimum 3:1 contrast ratio
   - UI components (buttons, form borders): minimum 3:1 contrast ratio
   - Color is not the only indicator (links underlined, errors use icon+text, etc.)

2. **Semantic HTML**
   - Proper heading hierarchy: H1, H2, H3 (no skipped levels, no multiple H1s)
   - Navigation uses `<nav>`, lists use `<ul>`/`<ol>`/`<li>`
   - Forms use `<form>`, fields use `<input>`, labels use `<label>`
   - Buttons use `<button>` tag (not divs styled as buttons)
   - Links use `<a>` tag (not buttons styled as links)
   - Images use `<img>` with alt text
   - Emphasis uses `<strong>` or `<em>` (not just styling)

3. **Image Alt Text**
   - Listing page cards: "3 bedroom house at 123 Main Street, Suburb"
   - Detail page images: "Living room with sofa and natural light"
   - Icons: "Solar panels available" or left empty if purely decorative
   - No alt text like "image", "photo", "pic" (be descriptive)

4. **Form Field Labels**
   - Every input has associated label (visible on page)
   - Labels clearly describe the field (not just placeholder text)
   - Required fields marked: "Price Range (required)" or with asterisk

5. **List Structure**
   - Related items grouped in `<ul>` or `<ol>`
   - Feature lists use `<ul>`/`<li>`
   - Navigation uses `<ul>`/`<li>` (not divs)

## Tasks / Subtasks

- [ ] Task 1: Verify Color Contrast (AC: #1)
  - [ ] Subtask 1.1: Test text colors with WebAIM contrast checker
  - [ ] Subtask 1.2: Test button/UI element colors
  - [ ] Subtask 1.3: Test link colors (ensure underline or other distinction)
  - [ ] Subtask 1.4: Fix any colors that don't meet 4.5:1 (or 3:1 for large text)
  - [ ] Subtask 1.5: Verify with color-blind simulation tools

- [ ] Task 2: Verify Heading Hierarchy (AC: #2)
  - [ ] Subtask 2.1: Check listing page heading structure
  - [ ] Subtask 2.2: Check property detail page heading structure
  - [ ] Subtask 2.3: Ensure no skipped levels (no H3 before H2)
  - [ ] Subtask 2.4: Ensure only one H1 per page
  - [ ] Subtask 2.5: Fix any hierarchy issues

- [ ] Task 3: Verify Semantic HTML Tags (AC: #2)
  - [ ] Subtask 3.1: Check for proper use of semantic tags (button, link, form)
  - [ ] Subtask 3.2: Verify navigation uses `<nav>` and `<ul>`
  - [ ] Subtask 3.3: Verify lists use `<ul>`/`<li>` (not divs)
  - [ ] Subtask 3.4: Fix any non-semantic elements

- [ ] Task 4: Verify Image Alt Text (AC: #3)
  - [ ] Subtask 4.1: Check all property card images have alt text
  - [ ] Subtask 4.2: Check all detail page images have alt text
  - [ ] Subtask 4.3: Verify alt text is descriptive (not "image" or "photo")
  - [ ] Subtask 4.4: Add alt text to any missing images

- [ ] Task 5: Verify Form Labels (AC: #4)
  - [ ] Subtask 5.1: Check contact form fields have labels
  - [ ] Subtask 5.2: Check filter form fields have labels
  - [ ] Subtask 5.3: Verify labels are associated with inputs
  - [ ] Subtask 5.4: Mark required fields appropriately

- [ ] Task 6: Run Verification & Audit (AC: All)
  - [ ] Subtask 6.1: Run WebAIM contrast checker on all pages
  - [ ] Subtask 6.2: Run W3C HTML validator
  - [ ] Subtask 6.3: Run accessibility audit (axe DevTools, WAVE)
  - [ ] Subtask 6.4: Run color-blind simulator
  - [ ] Subtask 6.5: Document all issues and fixes

## Dev Notes

### Previous Implementation

Most semantic HTML already implemented from previous stories:
- Layout.html uses `<header>`, `<main>`, `<footer>`, `<nav>`
- Form elements use proper `<form>`, `<label>`, `<input>` tags
- Property cards and lists already use semantic structure

This story verifies and enhances contrast and accessibility.

### Tools for Verification

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Lighthouse (Chrome DevTools): Built-in accessibility audit
- axe DevTools: Browser extension
- WAVE: Browser extension
- Color Blind Simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/

### Common Issues

- Link colors need to meet 4.5:1 (not just 3:1)
- Focus states also need to meet contrast
- Disabled form fields may be exempt
- Color alone should not convey information (use patterns, icons, text)

### References

- [Epics: Story 6.2](../_bmad-output/planning-artifacts/epics.md#story-62-ensure-wcag-aa-color-contrast-and-semantic-html)
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Semantic HTML: https://developer.mozilla.org/en-US/docs/Glossary/Semantics

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

Files to be modified:
- May need to update colors in `src/_includes/layout.html`
- May need to add/update alt text in templates
- May need to add aria-labels if needed

### Change Log

(To be filled during implementation)
