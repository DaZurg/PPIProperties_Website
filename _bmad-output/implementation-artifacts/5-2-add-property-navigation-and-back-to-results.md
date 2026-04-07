# Story 5.2: Add Property Navigation and Back to Results

Status: ready-for-dev

## Story

As a buyer,
I want to navigate between properties (Previous/Next) and return to my listing results,
So that I can compare properties easily without losing my search context.

## Acceptance Criteria

1. **Navigation UI Implementation**
   - "← Back to Results" button returns to listing page with filters preserved
   - "< Previous Property" button (if not first property) navigates to adjacent property
   - "Next Property >" button (if not last property) navigates to adjacent property
   - Current property indicator: "Property X of Y" or similar
   - Previous/Next buttons disabled/hidden on first/last property

2. **Navigation Functionality**
   - Clicking "Back to Results" returns to `/` or `/listing.html` with filter state restored
   - Clicking Previous/Next navigates to adjacent property detail page
   - Page does not reload when navigating between properties (smooth transition)
   - Scroll position behavior: Returns to approximately same position, Properties scroll to top

3. **Filter State Persistence**
   - Filters remain selected when returning to listing via "Back to Results"
   - Filtered results still display when returning to listing
   - Clearing filters resets the state

4. **Navigation UI Styling & Accessibility**
   - Uses Tailwind CSS (no inline styles)
   - Buttons clearly visible and touch-friendly (minimum 48px on mobile)
   - Visual distinction between primary button (Back) and secondary buttons (Prev/Next)
   - Consistent placement (top of page in breadcrumb area)
   - All navigation elements keyboard-accessible (Tab through buttons, Enter to activate)
   - Screen readers announce button purposes clearly

## Tasks / Subtasks

- [ ] Task 1: Implement Previous/Next Navigation Buttons (AC: #1, #2)
  - [ ] Subtask 1.1: Add Previous/Next button HTML structure
  - [ ] Subtask 1.2: Use 11ty pagination data to determine previous/next properties
  - [ ] Subtask 1.3: Style buttons with Tailwind CSS
  - [ ] Subtask 1.4: Disable buttons when not applicable (first/last property)
  - [ ] Subtask 1.5: Test navigation between all properties

- [ ] Task 2: Implement Back to Results Navigation (AC: #1, #2, #3)
  - [ ] Subtask 2.1: Add "Back to Results" button
  - [ ] Subtask 2.2: Implement filter state preservation (use localStorage or URL params)
  - [ ] Subtask 2.3: Restore filter state on return from detail page
  - [ ] Subtask 2.4: Test filter persistence across navigation

- [ ] Task 3: Add Property Counter (AC: #1)
  - [ ] Subtask 3.1: Add "Property X of Y" indicator
  - [ ] Subtask 3.2: Display correct count on each property page
  - [ ] Subtask 3.3: Update when navigating between properties

- [ ] Task 4: Verify Accessibility & UX (AC: #3, #4)
  - [ ] Subtask 4.1: Test keyboard navigation (Tab through all buttons)
  - [ ] Subtask 4.2: Verify screen reader announces button purposes
  - [ ] Subtask 4.3: Test touch targets are minimum 48px on mobile
  - [ ] Subtask 4.4: Verify visual distinction between primary and secondary buttons
  - [ ] Subtask 4.5: Run accessibility audit

- [ ] Task 5: Build & Test (AC: All)
  - [ ] Subtask 5.1: Run `npm run build` and verify pages generate
  - [ ] Subtask 5.2: Test navigation on mobile, tablet, desktop
  - [ ] Subtask 5.3: Test filter state persistence
  - [ ] Subtask 5.4: Verify scroll position behavior
  - [ ] Subtask 5.5: Verify all acceptance criteria met

## Dev Notes

### Context from Previous Stories

**Story 4.1** already implemented:
- Previous/Next Property Navigation exists (lines 19-52 in property.html)
- Navigation structure in place
- Property pagination available

**Story 3.4** already implemented:
- Filter state persistence implemented
- Uses sessionStorage to store filter selections
- Works across navigation

This story enhances the navigation with better styling and ensures filter persistence.

### Implementation Notes

- Navigation buttons already exist but may need styling improvements
- Filter state persistence using sessionStorage (already in Story 3.4)
- Scroll position can be managed with JavaScript
- Use 11ty's pagination.pageNumber and pagination.pages for prev/next logic

### File Structure

Files to modify:
- `src/property.html` - Navigation sections (top and footer)
- `src/_includes/js/filtering.js` - Ensure filter state is preserved

No new files needed.

### References

- [Epics: Story 5.2](../_bmad-output/planning-artifacts/epics.md#story-52-add-property-navigation-and-back-to-results)
- [Story 4.1: Property Detail Page](./4-1-create-property-detail-page-template-with-11ty-pagination.md)
- [Story 3.4: Filter State Persistence](./3-4-implement-filter-state-persistence-across-navigation.md)

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

Files to be modified:
- `src/property.html` - Enhance navigation buttons and styling
- `src/_includes/js/filtering.js` - Ensure filter state preservation

Files created:
- None

### Change Log

(To be filled during implementation)
