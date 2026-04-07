# Story 5.3: Implement Contact Form Submission and Feedback

Status: ready-for-dev

## Story

As a buyer,
I want to submit a message to the agent directly through an inline contact form with validation and confirmation,
So that I can send a custom message without leaving the property page.

## Acceptance Criteria

1. **Contact Form Structure**
   - Name field (text input, required, min 2 characters)
   - Email field (email input, required, valid email format)
   - Message field (textarea, required, minimum 10 characters, maximum 500 characters)
   - Submit button ("Send Message" or similar)
   - Clear button or cancel option
   - Form includes character counter for message field

2. **Form Validation**
   - Name field requires at least 2 characters
   - Email field validates email format
   - Message field requires minimum 10 characters
   - On submit: If any field invalid, show error message and don't submit
   - Error messages are clear and specific: "Please enter a valid email" not just "Error"
   - Invalid fields visually marked (red border or error icon)
   - Helpful error text appears below each invalid field

3. **Form Submission & Feedback**
   - Submit button disabled while form is submitting (prevent double-submit)
   - Loading indicator or message appears during submission
   - On successful submission:
     - Form clears or shows success message: "Message sent! The agent will contact you soon."
     - Success message appears for 3-5 seconds then fades
     - Form resets and ready for new message
   - On submission error:
     - Error message appears: "Failed to send message. Please try again or call directly."
     - Form data preserved (not cleared)
     - User can retry or try another contact method

4. **Semantic HTML & Accessibility**
   - Proper `<form>`, `<fieldset>`, `<label>` elements
   - `<input type="email">` for email field (HTML5 validation)
   - Accessible error messages associated with form fields via aria-describedby
   - All fields have associated labels (not just placeholder text)
   - Form can be completed entirely with keyboard (Tab, Enter)
   - Screen readers announce form purpose and required fields
   - Error messages announced to screen readers

## Tasks / Subtasks

- [ ] Task 1: Implement Form Structure & Validation (AC: #1, #2)
  - [ ] Subtask 1.1: Verify form HTML structure (fields, labels, validation)
  - [ ] Subtask 1.2: Add character counter for message field
  - [ ] Subtask 1.3: Implement client-side validation logic
  - [ ] Subtask 1.4: Add error message display for invalid fields
  - [ ] Subtask 1.5: Style invalid fields with visual feedback

- [ ] Task 2: Implement Form Submission Handler (AC: #3)
  - [ ] Subtask 2.1: Create fetch() request to backend (/api/contact endpoint)
  - [ ] Subtask 2.2: Disable submit button during submission
  - [ ] Subtask 2.3: Handle successful response (200 OK)
  - [ ] Subtask 2.4: Handle error response (4xx, 5xx)
  - [ ] Subtask 2.5: Prevent form double-submission

- [ ] Task 3: Implement Success/Error Feedback (AC: #3)
  - [ ] Subtask 3.1: Show success message on successful submission
  - [ ] Subtask 3.2: Auto-clear success message after 3-5 seconds
  - [ ] Subtask 3.3: Show error message on submission failure
  - [ ] Subtask 3.4: Reset form on successful submission
  - [ ] Subtask 3.5: Preserve form data on error

- [ ] Task 4: Verify Accessibility (AC: #4)
  - [ ] Subtask 4.1: Verify all fields have proper labels
  - [ ] Subtask 4.2: Test Tab navigation through form fields
  - [ ] Subtask 4.3: Verify error messages are announced by screen reader
  - [ ] Subtask 4.4: Test form submission with keyboard only
  - [ ] Subtask 4.5: Run accessibility audit (axe DevTools)

- [ ] Task 5: Build & Test (AC: All)
  - [ ] Subtask 5.1: Run `npm run build` and verify pages generate
  - [ ] Subtask 5.2: Test form validation with various inputs
  - [ ] Subtask 5.3: Test form submission (mock backend or test endpoint)
  - [ ] Subtask 5.4: Test on mobile, tablet, desktop
  - [ ] Subtask 5.5: Verify all acceptance criteria met

## Dev Notes

### Context from Previous Stories

**Story 4.4** already implemented:
- Contact form HTML structure exists (lines 261-329 in property.html)
- Form fields present: name, email, message
- Character counter implemented
- Form validation logic implemented (lines 375-418)
- Success message implemented with auto-clear

This story enhances the backend submission and ensures proper error handling.

### Implementation Notes

- Backend endpoint: `/api/contact` (needs to be implemented separately)
- Form data structure: { propertyId, name, email, message, submittedAt }
- Email sending can be handled by: Netlify Functions, AWS Lambda, or email service
- For MVP: Can accept POST without actual email sending (data collection)

### File Structure

Files to modify:
- `src/property.html` - Contact form section (already partially implemented)

No new files needed.

### References

- [Epics: Story 5.3](../_bmad-output/planning-artifacts/epics.md#story-53-implement-contact-form-submission-and-feedback)
- [Story 4.4: Property Details](./4-4-display-property-details-and-agent-contact-on-detail-page.md)
- MDN: HTML Form Element - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- MDN: Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

Files to be modified:
- `src/property.html` - Contact form submission handler (JavaScript)

Files created:
- None (backend endpoint implementation is out of scope)

### Change Log

(To be filled during implementation)
