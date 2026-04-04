---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
epicsApproved: true
storiesCreated: 27
workflowStatus: complete
validationPassed: true
---

# PPIProperties_Website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for PPIProperties_Website, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Buyers can view a listing page displaying all available properties
FR2: Buyers can see property images (thumbnails) on the listing page
FR3: Buyers can see property price on the listing page
FR4: Buyers can see property address on the listing page
FR5: Buyers can see core property details (bedrooms, bathrooms) on the listing page
FR6: Buyers can filter properties by property type (house, apartment, etc.)
FR7: Buyers can filter properties by price range (min/max)
FR8: Buyers can filter properties by number of bedrooms
FR9: Buyers can filter properties by location/suburb
FR10: Buyers can combine multiple filters simultaneously
FR11: Buyers can see filtered results update instantly (no page reload)
FR12: Buyers can clear all filters and see complete property list
FR13: Buyers can click/navigate to property detail page
FR14: Buyers can see full property address on detail page
FR15: Buyers can see property price on detail page
FR16: Buyers can see bedroom count on detail page
FR17: Buyers can see bathroom count on detail page
FR18: Buyers can see special features (solar panels, pools, garages, etc.)
FR19: Buyers can read full property description/marketing text
FR20: Buyers can view property images in sequence (20+ per property)
FR21: Buyers can navigate forward/backward through images
FR22: Buyers can zoom in/out on individual images
FR23: Image gallery loads and scrolls smoothly without lag
FR24: Buyers can see agent name on property detail page
FR25: Buyers can see agent contact information (phone, email) prominently displayed
FR26: Buyers can initiate phone contact with agent
FR27: Buyers can send email to agent
FR28: Buyers can submit contact form to reach agent
FR29: Buyers can navigate back from property detail to listing page
FR30: Buyers can navigate between different properties from detail page
FR31: Filtering choices persist as users browse property details
FR32: Admin can update property information in Google Sheet
FR33: Admin can trigger deployment of updated content
FR34: System can read and validate property data
FR35: System can process property data for website display
FR36: Admin can initiate website deployment via GitHub Actions
FR37: System can generate static website files from property data
FR38: System can upload updated website files to cPanel hosting
FR39: System can provide feedback on deployment success/failure
FR40: Updated properties appear on live website after deployment
FR41: Each property has a unique, semantic URL structure
FR42: Each property page includes search engine meta tags (title, description)
FR43: Each property includes structured data markup (Schema.org)
FR44: Website includes XML sitemap for search engines
FR45: Property pages include Open Graph tags for social sharing
FR46: All pages are fully responsive on mobile devices (phones)
FR47: All pages are fully responsive on tablet devices
FR48: All pages are fully responsive on desktop browsers
FR49: All interactive elements are keyboard-accessible
FR50: All images have descriptive alt text
FR51: All form fields have associated labels
FR52: Page headings follow proper hierarchy (H1, H2, etc.)
FR53: Color contrast meets WCAG AA accessibility standard

### Non-Functional Requirements

NFR1: Listing page loads in under 2 seconds on typical internet connection
NFR2: Property detail page loads in under 1 second
NFR3: Filter results update in under 500ms without full page reload
NFR4: Image gallery scrolls smoothly (60fps) without lag
NFR5: Website is accessible on slow mobile connections (3G speeds)
NFR6: Website scales to 300+ properties without modifying core architecture
NFR7: Listing page performance remains <2s even with 300 properties
NFR8: Filter responsiveness remains <500ms with full property catalog
NFR9: Image galleries maintain smooth performance with 20+ images per property
NFR10: Website uptime is >99.5% (no more than ~22 minutes downtime per month)
NFR11: Automatic deployment completes without manual intervention
NFR12: Deployment failures provide clear error messages for troubleshooting
NFR13: Website remains available during GitHub Actions deployments (no downtime)
NFR14: GitHub Actions can read property data from JSON files
NFR15: Deployment to cPanel via FTP/SFTP completes reliably
NFR16: Data validation catches and reports missing required fields
NFR17: Image URLs are validated before deployment (broken images don't publish)
NFR18: All text meets WCAG AA color contrast minimum (4.5:1)
NFR19: All interactive elements are keyboard-navigable
NFR20: Page structure uses semantic HTML (proper heading hierarchy)
NFR21: All images have meaningful alt text

### Additional Requirements

**Starter Template:**
- 11ty (Eleventy) v3.1.0 selected as the static site generator
- Initialization: `npm create eleventy@latest -- --template=minimal`

**Technology Stack:**
- Node.js 18+, JavaScript/Nunjucks templating
- Tailwind CSS for styling, Vanilla JavaScript for client-side filtering
- GitHub Actions for CI/CD, FTP/SFTP for cPanel deployment
- Sharp/imagemin plugins for image optimization

**File Organization & Structure:**
- Template files: index.html, listing.html, property.html
- Data: src/_data/properties.json (single JSON array)
- JavaScript: filtering.js, gallery.js, utils.js, main.js (separate concern files)
- Build utilities: image-optimizer.js, data-transformer.js

**JSON Property Field Names (camelCase):**
- Required: id, address, price, bedrooms, bathrooms, imageUrls
- Standard: description, agentName, agentEmail, agentPhone, features, location, propertyType

**Routing Patterns:**
- Property detail pages: /properties/{propertyId}/
- Listing page: / or /index.html

**Data Validation & Error Handling:**
- Required fields validation (build fails if missing/invalid)
- Optional fields handled with defaults
- Image errors: warn and continue pattern (never fail build)

**Deployment & Security:**
- GitHub Secrets for FTP credential management
- Build output to _site/ directory
- Atomic FTP deployment to cPanel

**Code Style & Patterns:**
- Tailwind CSS utility-first approach (no inline styles)
- BEM class names for JavaScript hooks only
- Mobile-first responsive design approach

### UX Design Requirements

UX-DR1: Implement property image gallery as carousel with main image display and thumbnail navigation below
UX-DR2: Carousel must support left/right arrow navigation for forward/backward image browsing
UX-DR3: Carousel must support thumbnail click navigation for quick image access
UX-DR4: Carousel must support touch swipe gestures on mobile devices for image navigation
UX-DR5: Image gallery must maintain 60fps smooth scrolling performance without jank or lag
UX-DR6: Implement horizontal filter bar positioned at top of property grid below header
UX-DR7: Filter bar must remain always visible (not collapsed or hidden) on all screen sizes
UX-DR8: Filter bar must include dropdown control for property type filtering
UX-DR9: Filter bar must include range slider controls for price range filtering
UX-DR10: Filter bar must include numeric input/selector for bedroom count filtering
UX-DR11: Filter bar must include dropdown control for location/suburb filtering
UX-DR12: Filter bar must provide "Clear All Filters" button to reset all filter selections
UX-DR13: Filter results must update instantly (<500ms) as user changes any filter value
UX-DR14: Filter bar must wrap responsively on mobile/tablet screens with filters stacking vertically
UX-DR15: Implement property card design for listing page with image hero, price, address, and feature icons
UX-DR16: Property card must display 4 key feature icons: beds, baths, parking, pets using consistent visual language
UX-DR17: Property card must include "View Details" call-to-action button
UX-DR18: Property card must be full-width on mobile (single column layout)
UX-DR19: Property card must display in 2-column grid on tablet screens (640px-1024px)
UX-DR20: Property card must display in 3-4 column grid on desktop screens (1024px+)
UX-DR21: Implement rich property detail page with extended feature icons beyond listing page
UX-DR22: Detail page must display 8 feature icons: beds, baths, parking, pets, solar panels, security, floor area, land size
UX-DR23: Detail page must prominently display agent contact block with name, photo, phone, email, and contact form
UX-DR24: Agent phone number must support click-to-call functionality on mobile devices
UX-DR25: Agent phone number must be copyable on desktop devices
UX-DR26: Agent contact form must be inline on detail page with name, email, and message fields
UX-DR27: Contact form must include form validation before submission
UX-DR28: Contact form submission must display confirmation message on successful send
UX-DR29: Detail page must support "Back to Results" navigation to return to listing with filter state preserved
UX-DR30: Detail page must support Previous/Next property navigation buttons for quick comparison
UX-DR31: Detail page must support smooth navigation between properties without page reloads
UX-DR32: Implement responsive design with three breakpoints: mobile (0-640px), tablet (640-1024px), desktop (1024px+)
UX-DR33: Mobile layout must use full-width single-column property cards
UX-DR34: Tablet layout must use 2-column property card grid with responsive spacing
UX-DR35: Desktop layout must use 3-4 column property card grid with comfortable spacing
UX-DR36: Implement touch-friendly button and control sizing with minimum 48px touch targets on mobile
UX-DR37: Implement sticky header navigation on all pages for easy access to filter controls
UX-DR38: Implement sticky agent contact block on detail page that remains accessible while scrolling
UX-DR39: All color choices must meet WCAG AA color contrast minimum (4.5:1 for text)
UX-DR40: All interactive elements must be keyboard-accessible with visible focus indicators
UX-DR41: All images must include descriptive alt text following accessibility best practices
UX-DR42: Page structure must use semantic HTML with proper heading hierarchy (H1, H2, H3)
UX-DR43: Implement property feature icon system with consistent monochrome style: beds, baths, parking, pets, solar, security
UX-DR44: Create color palette with brand primary color, secondary accent color, neutral grays, and functional colors
UX-DR45: Establish typography system with clear heading hierarchy, readable body text size (minimum 16px on mobile)
UX-DR46: Establish spacing system using Tailwind spacing scale for consistent padding and margins
UX-DR47: Implement lazy loading for property images to improve initial page load performance
UX-DR48: Implement responsive image sizing with srcset for mobile, tablet, and desktop versions
UX-DR49: Generate WebP format images with fallback to original format for browser compatibility
UX-DR50: Implement scroll position preservation when returning from detail page to listing page

### FR Coverage Map

FR1: Epic 2 - Property Listing & Discovery
FR2: Epic 2 - Property Listing & Discovery
FR3: Epic 2 - Property Listing & Discovery
FR4: Epic 2 - Property Listing & Discovery
FR5: Epic 2 - Property Listing & Discovery
FR6: Epic 3 - Smart Property Filtering
FR7: Epic 3 - Smart Property Filtering
FR8: Epic 3 - Smart Property Filtering
FR9: Epic 3 - Smart Property Filtering
FR10: Epic 3 - Smart Property Filtering
FR11: Epic 3 - Smart Property Filtering
FR12: Epic 3 - Smart Property Filtering
FR13: Epic 4 - Property Details, Image Gallery & SEO
FR14: Epic 4 - Property Details, Image Gallery & SEO
FR15: Epic 4 - Property Details, Image Gallery & SEO
FR16: Epic 4 - Property Details, Image Gallery & SEO
FR17: Epic 4 - Property Details, Image Gallery & SEO
FR18: Epic 4 - Property Details, Image Gallery & SEO
FR19: Epic 4 - Property Details, Image Gallery & SEO
FR20: Epic 4 - Property Details, Image Gallery & SEO
FR21: Epic 4 - Property Details, Image Gallery & SEO
FR22: Epic 4 - Property Details, Image Gallery & SEO
FR23: Epic 4 - Property Details, Image Gallery & SEO
FR24: Epic 5 - Property Interaction & Engagement
FR25: Epic 5 - Property Interaction & Engagement
FR26: Epic 5 - Property Interaction & Engagement
FR27: Epic 5 - Property Interaction & Engagement
FR28: Epic 5 - Property Interaction & Engagement
FR29: Epic 5 - Property Interaction & Engagement
FR30: Epic 5 - Property Interaction & Engagement
FR31: Epic 3 - Smart Property Filtering
FR32: Epic 1 - Project Initialization & Deployment Infrastructure
FR33: Epic 1 - Project Initialization & Deployment Infrastructure
FR34: Epic 1 - Project Initialization & Deployment Infrastructure
FR35: Epic 1 - Project Initialization & Deployment Infrastructure
FR36: Epic 1 - Project Initialization & Deployment Infrastructure
FR37: Epic 1 - Project Initialization & Deployment Infrastructure
FR38: Epic 1 - Project Initialization & Deployment Infrastructure
FR39: Epic 1 - Project Initialization & Deployment Infrastructure
FR40: Epic 1 - Project Initialization & Deployment Infrastructure
FR41: Epic 4 - Property Details, Image Gallery & SEO
FR42: Epic 4 - Property Details, Image Gallery & SEO
FR43: Epic 4 - Property Details, Image Gallery & SEO
FR44: Epic 4 - Property Details, Image Gallery & SEO
FR45: Epic 4 - Property Details, Image Gallery & SEO
FR46: Epic 2 - Property Listing & Discovery
FR47: Epic 2 - Property Listing & Discovery
FR48: Epic 2 - Property Listing & Discovery
FR49: Epic 6 - Accessibility & Performance Excellence
FR50: Epic 6 - Accessibility & Performance Excellence
FR51: Epic 6 - Accessibility & Performance Excellence
FR52: Epic 6 - Accessibility & Performance Excellence
FR53: Epic 6 - Accessibility & Performance Excellence

## Epic List

### Epic 1: Project Initialization & Deployment Infrastructure
Establish the automated pipeline for data ingestion, static site generation, and deployment to cPanel. Initialize 11ty project, configure GitHub Actions workflow, set up image optimization pipeline, and enable automated Excel→JSON→HTML deployment.
**FRs covered:** FR32-FR40

### Epic 2: Property Listing & Discovery
Buyers can view all available properties with key details (price, address, bedrooms, bathrooms) displayed in a responsive grid on all devices. Implement the core property listing page that serves as the entry point for property discovery.
**FRs covered:** FR1-FR5, FR46-FR48

### Epic 3: Smart Property Filtering
Buyers can instantly filter properties by type, price range, bedrooms, and location with results updating in <500ms. Filtering state persists when navigating between properties. Implement horizontal always-visible filter bar with instant feedback and clear functionality.
**FRs covered:** FR6-FR12, FR31

### Epic 4: Property Details, Image Gallery & SEO
Buyers can view complete property information, browse 20+ images smoothly via carousel with thumbnails, and zoom capabilities. Property pages are discoverable via search engines with unique URLs, meta tags, structured data, sitemap, and social sharing support.
**FRs covered:** FR13-FR23, FR41-FR45

### Epic 5: Property Interaction & Engagement
Buyers can easily contact agents and navigate between properties for comparison. Implement agent contact block with multiple contact methods (phone, email, contact form), previous/next property navigation, and back-to-results functionality with state preservation.
**FRs covered:** FR24-FR30

### Epic 6: Accessibility & Performance Excellence
Ensure the entire website is fast, accessible, and works smoothly for all users including those with disabilities or on slow connections. Implement keyboard navigation, WCAG AA contrast, semantic HTML, image optimization, lazy loading, and responsive images.
**FRs covered:** FR49-FR53, plus image optimization and performance NFRs

## Epic 1: Project Initialization & Deployment Infrastructure

Establish the automated pipeline for data ingestion, static site generation, and deployment to cPanel. Initialize 11ty project, configure GitHub Actions workflow, set up image optimization pipeline, and enable automated Excel→JSON→HTML deployment.

### Story 1.1: Initialize 11ty Project with Minimal Template

As a developer,
I want to initialize a new 11ty v3.1.0 project using the minimal template with proper directory structure,
So that I have a clean foundation to build the property listing website.

**Acceptance Criteria:**

**Given** I have Node.js 18+ installed on my machine
**When** I run `npm create eleventy@latest -- --template=minimal`
**Then** a new 11ty project is created with:
- `src/` directory containing templates and content files
- `src/_data/` directory for global data files
- `src/_includes/` directory for reusable components
- `_site/` output directory for built files
- `package.json` with 11ty dependencies installed
- `.eleventy.js` configuration file

**And** I can run `npm run build` successfully and it generates a `_site/` directory with HTML output
**And** I can run `npm run dev` to start a local development server on http://localhost:8080
**And** the project structure matches the Architecture document's specified file organization

### Story 1.2: Set Up Excel → JSON Data Pipeline

As a admin,
I want to convert property data from Excel/Google Sheets into a properly formatted JSON file that the 11ty build process can consume,
So that property data is automatically available for page generation without manual formatting.

**Acceptance Criteria:**

**Given** property data exists in a Google Sheet or Excel file with fields: address, price, bedrooms, bathrooms, imageUrls (as array), description, agentName, agentEmail, agentPhone, features (as array), location, propertyType
**When** I export the sheet to JSON or create a data conversion script
**Then** a `src/_data/properties.json` file is created containing:
- Valid JSON array format
- All required fields present (id, address, price, bedrooms, bathrooms, imageUrls)
- All optional fields included if present (description, features, agent info, etc.)
- camelCase field naming throughout

**And** the file can be read by 11ty's data file loader without errors
**And** I can add sample property data (6-10 properties) to test the structure
**And** the JSON validates against the schema requirements (all required fields have proper types)

### Story 1.3: Implement Image Download and Optimization

As a system,
I want to automatically download images from URLs listed in property data and optimize them for web delivery,
So that images are compressed, responsive, and ready for deployment without manual processing.

**Acceptance Criteria:**

**Given** the build process reads properties.json with imageUrls array
**When** the 11ty build starts
**Then** the build process:
- Downloads all images from the URLs in imageUrls
- Stores downloaded images in `src/images/` or `_site/images/` directory
- Optimizes images for web (compresses, reduces file size)
- Generates responsive sizes for mobile (640px), tablet (1024px), and desktop (1920px) breakpoints
- Creates WebP format versions with fallback to original format

**And** if an individual image URL fails to download, the build logs a warning but continues (doesn't fail)
**And** if all images for a property fail, a placeholder image is used and a warning is logged
**And** the build never fails due to image errors (warn and continue pattern)
**And** optimized images are referenced in generated HTML with proper src/srcset attributes

### Story 1.4: Create GitHub Actions Workflow for Automated Build

As a admin,
I want to set up a GitHub Actions workflow that automatically builds the 11ty project when I push changes to the repository,
So that the site is continuously built with the latest data without manual build steps.

**Acceptance Criteria:**

**Given** the repository is on GitHub with the 11ty project structure
**When** I create a `.github/workflows/build.yml` GitHub Actions workflow file
**Then** the workflow:
- Triggers on push to the main branch
- Checks out the repository code
- Installs Node.js 18+ dependencies
- Runs `npm run build` to generate the static site
- Logs build status and any warnings/errors
- Stores the `_site/` directory as an artifact for deployment

**And** the workflow can be manually triggered for testing
**And** the workflow completes in under 5 minutes
**And** the workflow logs are viewable in the GitHub Actions tab with clear success/failure status

### Story 1.5: Configure GitHub Secrets and FTP Deployment

As a admin,
I want to securely store FTP credentials in GitHub Secrets and deploy the built site to cPanel hosting via FTP,
So that the website is automatically deployed to live hosting after each build without exposing credentials.

**Acceptance Criteria:**

**Given** I have cPanel FTP credentials (hostname, username, password)
**When** I configure GitHub Secrets in the repository settings (Settings → Secrets and variables → Actions)
**Then** I can store:
- `FTP_HOST` (cPanel hostname)
- `FTP_USERNAME` (FTP login username)
- `FTP_PASSWORD` (FTP login password)

**And** I update the GitHub Actions workflow to include a deployment step that:
- Reads FTP credentials from GitHub Secrets using `${{ secrets.FTP_HOST }}` etc.
- Connects to cPanel via FTP using the provided credentials
- Uploads the contents of `_site/` directory to the appropriate public_html directory
- Credentials are never exposed in logs or code

**And** the FTP deployment step only runs if the build succeeds
**And** I can verify that files are deployed to the live server after the workflow completes

### Story 1.6: Implement Data Validation and Deployment Error Handling

As a admin,
I want to validate property data during the build process and receive clear feedback on whether the deployment succeeded or failed,
So that I can catch data issues early and know the site was successfully deployed.

**Acceptance Criteria:**

**Given** the build process reads properties.json
**When** the build validates data
**Then** the validation checks:
- All required fields (id, address, price, bedrooms, bathrooms, imageUrls) are present
- Field types are correct (price is number, bedrooms/bathrooms are numbers, imageUrls is array)
- At least one imageUrl is present per property
- All properties have unique IDs

**And** if validation errors are found, the build fails with a clear error message listing which properties have issues
**And** if validation warnings occur (optional fields missing), warnings are logged but build continues
**And** the GitHub Actions workflow reports deployment status:
- Success: "Deployment completed successfully at [timestamp]"
- Failure: "Deployment failed: [specific error reason]"
- Status is visible in GitHub Actions logs and workflow summary

**And** I can review GitHub Actions logs to understand any build or deployment failures

## Epic 2: Property Listing & Discovery

Buyers can view all available properties with key details (price, address, bedrooms, bathrooms) displayed in a responsive grid on all devices. Implement the core property listing page that serves as the entry point for property discovery.

### Story 2.1: Create Property Listing Page Layout Template

As a developer,
I want to create the main listing page template structure with header and content area,
So that I have a foundation for the property grid and filters.

**Acceptance Criteria:**

**Given** the 11ty project is initialized with proper directory structure
**When** I create a new `src/listing.html` template file
**Then** the template includes:
- A semantic HTML structure with proper heading hierarchy (H1 for page title)
- A header section with site branding/title
- A main content area for the property grid
- Footer section with basic information
- Proper use of semantic HTML tags (main, section, article, etc.)

**And** the template uses Nunjucks templating (11ty default) for layout structure
**And** I can extend from a layout file (`_includes/layout.html` or similar) to maintain consistent page structure
**And** the page title is "Find Your Property" or similar buyer-focused title
**And** the listing page is accessible via `/` or `/listing.html` URL
**And** when I run `npm run dev`, the page renders without errors on http://localhost:8080

### Story 2.2: Design and Implement Responsive Property Card Component

As a designer/developer,
I want to create a reusable property card component that displays property image, price, address, and key details,
So that properties can be displayed in a consistent, attractive format.

**Acceptance Criteria:**

**Given** properties.json contains sample property data with required fields
**When** I create the property card component in `src/_includes/property-card.html`
**Then** each card displays:
- Hero image (property image at full width)
- Price prominently displayed in large font
- Full address (street, suburb, city)
- Core details: bedrooms, bathrooms with icons
- Feature icons: 4 key icons (🛏️ beds, 🚿 baths, 🅿️ parking, 🐾 pets)
- "View Details" call-to-action button linking to `/properties/{id}/`

**And** the card uses Tailwind CSS utility classes for styling (no inline styles)
**And** the card includes proper alt text for images: "Property image at [address]"
**And** the card is semantically structured with article or div.property-card wrapper
**And** price is displayed with currency symbol and proper formatting
**And** feature icons are visually consistent and clear at all sizes
**And** the "View Details" button is styled as a primary CTA button
**And** the component can be tested with sample property data in isolation

### Story 2.3: Implement Responsive Grid Layout with Tailwind CSS

As a developer,
I want to style the property grid with Tailwind CSS so it's responsive across mobile, tablet, and desktop screens,
So that the property cards display appropriately on all devices.

**Acceptance Criteria:**

**Given** property cards exist and are displayed on the listing page
**When** I apply Tailwind CSS responsive classes to the grid container
**Then** the grid layout responds to screen sizes:
- Mobile (0-640px): Single column, full-width cards
- Tablet (640px-1024px): Two-column grid with responsive spacing
- Desktop (1024px+): Three to four-column grid with comfortable spacing

**And** spacing between cards is consistent using Tailwind spacing scale (gap-4, gap-6, etc.)
**And** cards maintain proper aspect ratio and don't distort at any breakpoint
**And** image heights are consistent within each breakpoint
**And** touch targets on mobile are minimum 48px for interactive elements
**And** the page uses Tailwind's mobile-first approach (no min-width breakpoints)
**And** the responsive behavior can be tested using browser dev tools at different viewport sizes
**And** no CSS media queries are needed (Tailwind handles responsiveness)

### Story 2.4: Integrate Property Data and Display All Properties

As a buyer,
I want to see all available properties displayed on the listing page when I visit the site,
So that I can immediately see what properties are available.

**Acceptance Criteria:**

**Given** the listing page template exists with card components and responsive grid
**When** the 11ty build processes properties.json
**Then** the page displays:
- All properties from properties.json rendered as cards in the grid
- Each property shows correct data: address, price, bedrooms, bathrooms, images
- Cards link to correct property detail page (`/properties/{propertyId}/`)

**And** the page title shows total property count: "45 Properties Available" or similar
**And** the page loads in under 2 seconds on a typical internet connection (tested locally)
**And** all image URLs are resolved and images display correctly
**And** if a property image fails to load, a fallback placeholder is shown with alt text
**And** the page is fully accessible with keyboard navigation (Tab through all cards and buttons)
**And** all images have descriptive alt text describing the property and its features
**And** page structure includes proper heading hierarchy (H1 for main title, H2+ for card titles)
**And** color contrast meets WCAG AA standards (4.5:1 for text)
**And** the listing page can handle scaling to 300+ properties without performance degradation

## Epic 3: Smart Property Filtering

Buyers can instantly filter properties by type, price range, bedrooms, and location with results updating in <500ms. Filtering state persists when navigating between properties. Implement horizontal always-visible filter bar with instant feedback and clear functionality.

### Story 3.1: Create Filter Bar HTML Template with All Filter Controls

As a developer,
I want to create the filter bar HTML template with all necessary filter controls and buttons,
So that buyers have a visible interface to refine their property search.

**Acceptance Criteria:**

**Given** the listing page template exists
**When** I create a filter bar component in `src/_includes/filter-bar.html`
**Then** the filter bar includes:
- Dropdown/select control for property type (House, Apartment, etc.)
- Range slider or dual input for price range (min/max price)
- Numeric input or dropdown for number of bedrooms
- Dropdown/select control for location/suburb
- "Clear All Filters" button to reset selections

**And** the filter bar is positioned horizontally at the top of the property grid
**And** the filter bar remains always visible (not collapsed or hidden behind a toggle)
**And** the filter bar is styled with Tailwind CSS (no inline styles)
**And** all form controls have associated labels for accessibility
**And** the filter bar uses semantic HTML (fieldset, legend, label, input elements)
**And** the filter bar is responsive:
- On mobile (0-640px): Filters stack vertically or wrap naturally
- On tablet/desktop: Filters display horizontally

**And** all inputs have data-* attributes for JavaScript targeting (e.g., data-filter-type, data-filter-price-min, etc.)
**And** the "Clear All Filters" button resets all form controls to default values
**And** when I include the filter bar on the listing page, it renders without errors

### Story 3.2: Implement Vanilla JavaScript Filtering Logic

As a developer,
I want to implement client-side vanilla JavaScript that filters properties based on user selections,
So that filtering happens instantly in the browser without server requests.

**Acceptance Criteria:**

**Given** the filter bar HTML exists with all controls and data-* attributes
**When** I create `src/_includes/js/filtering.js` with filtering logic
**Then** the JavaScript includes:
- Function to read current filter values from form controls
- Function to filter property array based on:
  - Property type matches selected type (or all if none selected)
  - Price falls within min/max range (or all if none selected)
  - Bedrooms matches or exceeds selected value (or all if none selected)
  - Location matches selected location (or all if none selected)
- Function to update property grid with filtered results

**And** the filtering works with all properties loaded in the page (from properties.json)
**And** filtering logic handles edge cases:
- No filters selected → show all properties
- No properties match filters → show "No properties found" message
- Multiple filters selected → AND logic (property must match ALL filters)

**And** the filtering function returns a new array without modifying original property data
**And** the code is well-organized with clear function names and comments
**And** the JavaScript can be tested independently with sample property data

### Story 3.3: Add Instant Filter Feedback and Result Count Updates

As a buyer,
I want to see filtered results update instantly as I change filter selections and see how many properties match,
So that I get immediate feedback and can refine my search quickly.

**Acceptance Criteria:**

**Given** the filter bar and filtering logic exist
**When** I select a filter value (or change it)
**Then** within <500ms:
- The property grid updates to show only matching properties
- Results counter updates to show: "X properties found" or "0 properties found"
- Grid re-renders without page reload
- No loading spinner or delay is visible

**And** the filtering response time stays <500ms even with:
- Large property datasets (tested with 300+ properties)
- Multiple filters selected simultaneously
- Rapid filter changes

**And** when no properties match the current filters:
- A helpful message displays: "No properties match your criteria. Try adjusting your filters."
- The grid remains visible but empty

**And** the results counter is positioned near the filter bar or grid title
**And** the results counter uses clear language: "Showing X of Y properties"
**And** visual feedback is provided without loading spinners (instant update)
**And** page scroll position doesn't jump when results update
**And** keyboard users can access the results counter with Tab navigation

### Story 3.4: Implement Filter State Persistence Across Navigation

As a buyer,
I want my filter selections to persist when I navigate to a property detail page and back to the listing,
So that I don't lose my search context when exploring individual properties.

**Acceptance Criteria:**

**Given** I have filters selected on the listing page and am viewing filtered results
**When** I click on a property card to view its detail page
**Then** my filter selections are preserved (stored in browser)

**And** when I click "Back to Results" on the detail page or use browser back button
**Then** the listing page displays:
- The same filters still selected
- The same filtered results still showing
- The grid scrolled to approximately the same position as before navigation

**And** the filter state persists across navigation without:
- Requiring server-side storage
- Using cookies (optional: can use localStorage or URL parameters)
- Reloading the page

**And** clearing filters on the listing page resets the persisted state
**And** the filter state is preserved for the current session only (not permanently)
**And** if the user manually visits a property detail page URL directly, no persistent state is required

## Epic 4: Property Details, Image Gallery & SEO

Buyers can view complete property information, browse 20+ images smoothly via carousel with thumbnails, and zoom capabilities. Property pages are discoverable via search engines with unique URLs, meta tags, structured data, sitemap, and social sharing support.

### Story 4.1: Create Property Detail Page Template with 11ty Pagination

As a developer,
I want to create a property detail page template that automatically generates individual pages for each property using 11ty's pagination from properties.json,
So that each property has its own unique, crawlable detail page with semantic URL structure.

**Acceptance Criteria:**

**Given** properties.json contains an array of property objects
**When** I create `src/property.html` template file with 11ty pagination
**Then** the template:
- Uses 11ty's pagination feature to generate one page per property
- Generates pages with semantic URL structure: `/properties/{propertyId}/`
- Each page receives the correct property data object

**And** the template includes:
- Proper semantic HTML structure (article, section tags)
- H1 heading with property address
- Back to Results navigation link
- Previous/Next property navigation links
- Main content area for property details
- Image carousel placeholder
- Agent contact section placeholder

**And** I can run `npm run build` and view generated property pages at `/properties/property-123/index.html`
**And** the page structure uses a consistent layout that extends from `_includes/layout.html`
**And** page navigation between properties works via Next/Previous buttons
**And** the "Back to Results" button links back to `/` or `/listing.html`
**And** the template handles missing property data gracefully with fallback content

### Story 4.2: Implement Image Carousel Component with Navigation

As a developer,
I want to create an image carousel component that displays a main image with left/right arrow navigation and clickable thumbnails,
So that buyers can browse property images smoothly and intuitively.

**Acceptance Criteria:**

**Given** a property has multiple images in imageUrls array
**When** I create `src/_includes/image-carousel.html` carousel component
**Then** the carousel displays:
- Large main image (full-width, prominent display)
- Left arrow button (← navigate to previous image)
- Right arrow button (→ navigate to next image)
- Row of thumbnail images below main image
- Current image indicator (e.g., "Image 3 of 12")

**And** the carousel interaction works as:
- Clicking left/right arrows → main image changes to adjacent image
- Clicking thumbnail → main image changes to that image
- Thumbnail for current image is highlighted/active
- Thumbnails are horizontally scrollable if more than 5-6 images

**And** the carousel uses Tailwind CSS for styling (no inline styles)
**And** arrow buttons are large and touch-friendly (minimum 48px on mobile)
**And** images include proper alt text describing the property and location
**And** the carousel handles edge cases:
- First image: left arrow shows disabled or wraps to last image
- Last image: right arrow shows disabled or wraps to first image
- Only 1 image: arrows/thumbnails are hidden

**And** the carousel component can be tested independently with sample property images

### Story 4.3: Add Image Zoom and Smooth 60fps Animations

As a buyer,
I want to zoom in on property images to see details and experience smooth carousel transitions,
So that I can examine properties thoroughly with beautiful, responsive image browsing.

**Acceptance Criteria:**

**Given** the image carousel component exists
**When** I implement zoom and animation functionality in `src/_includes/js/gallery.js`
**Then** the carousel provides:
- Zoom capability: Click main image to zoom in, click again to zoom out (or zoom controls)
- Smooth transitions between images (fade or slide animation)
- Smooth thumbnail scrolling (smooth-scroll behavior)
- 60fps animation performance (tested with DevTools performance profiler)

**And** the zoom feature:
- Shows zoomed view at 1.5x-2x scale
- Allows panning/dragging zoomed image to see different areas
- Can be dismissed by clicking elsewhere or pressing Escape
- Works on both desktop and mobile (touch-friendly)

**And** carousel transitions:
- Smooth fade or slide effect between images (<300ms duration)
- No jank or lag when navigating between images
- Smooth when swiping on mobile (1-2 finger gesture)

**And** performance targets:
- Image transitions maintain 60fps frame rate
- Zoom/pan operations are smooth and responsive
- No stuttering or dropped frames (verified with browser DevTools)

**And** touch gestures work on mobile:
- Swipe left/right → navigate between images
- Pinch to zoom (optional: zoom via buttons is acceptable)
- Touch arrows and thumbnails work reliably

**And** keyboard users can navigate:
- Arrow keys → navigate between images
- Escape → close zoom modal if open

### Story 4.4: Display Property Details and Agent Contact on Detail Page

As a buyer,
I want to see complete property information including features, description, and multiple agent contact options on the detail page,
So that I have all the information needed to make a decision and can easily contact the agent.

**Acceptance Criteria:**

**Given** the property detail template exists with image carousel
**When** I populate the detail page with property data from properties.json
**Then** the page displays:
- Full property address prominently
- Price in large, prominent font
- Extended feature icons (8 icons): 🛏️ beds, 🚿 baths, 🅿️ parking, 🐾 pets, ☀️ solar, 🔒 security, 📐 floor area, 🏡 land size
- Full property description/marketing text
- Key features list (bullet points)

**And** the page includes an Agent Contact Block with:
- Agent name and photo (if available)
- Phone number (click-to-call on mobile, copyable on desktop)
- Email address (click to open email client)
- Contact form (inline form with name, email, message fields)
- Clear contact CTA button

**And** the detail page is sticky on mobile:
- Agent contact block sticks to bottom/top when scrolling on mobile
- Always accessible without scrolling back up

**And** all content uses semantic HTML with proper heading hierarchy
**And** all feature icons are consistent, monochrome style
**And** all text meets WCAG AA color contrast (4.5:1 minimum)
**And** form fields have associated labels and validation
**And** the page loads in under 1 second on typical connection

### Story 4.5: Generate SEO Metadata Per Property (Meta Tags & Schema.org)

As a search engine bot,
I want to receive proper SEO metadata for each property page including meta tags and structured data,
So that properties are discoverable and rank well in search results.

**Acceptance Criteria:**

**Given** each property detail page is generated from properties.json
**When** the 11ty build processes property pages
**Then** each page includes:
- Unique, semantic title tag: "[Price] [Beds]bed [Address] | PPIProperties"
- Meta description: "[Address] — [Beds] bed property in [Location]. [Brief description]" (155-160 chars)
- Meta keywords (optional): "property for sale, [location], [bedrooms] bedroom"

**And** the page includes Open Graph tags for social sharing:
- og:title, og:description, og:image (property hero image)
- og:url (property detail page URL)
- og:type: "website"
- twitter:card (if applicable)

**And** the page includes Schema.org structured data (JSON-LD):
- Property schema with:
  - name (address)
  - description
  - image (property images)
  - price and priceCurrency
  - numberOfBedrooms, numberOfBathrooms
  - address (structured address fields)
  - agent name and contact info (Person/Organization schema)

**And** the structured data validates with Schema.org validator
**And** each property URL is unique and semantic: `/properties/{propertyId}/`
**And** canonical tags point to the correct URL (prevent duplicate content)
**And** the page includes proper language/locale meta tags

### Story 4.6: Create XML Sitemap and Verify SEO Completeness

As a search engine,
I want to receive an XML sitemap that lists all property pages with last modified dates,
So that I can discover and crawl all property pages efficiently.

**Acceptance Criteria:**

**Given** all property detail pages are generated
**When** the 11ty build completes
**Then** a `_site/sitemap.xml` file is generated containing:
- All property detail page URLs: `/properties/{propertyId}/`
- Listing page URL: `/`
- lastmod dates (when property was last updated)
- changefreq: "weekly" for property pages, "daily" for listing
- priority: 1.0 for listing, 0.8 for property pages

**And** the sitemap is submitted to Google Search Console (manual step documented)
**And** the sitemap validates with online sitemap validators
**And** robots.txt is created to allow crawlers and reference sitemap: `/robots.txt`

**And** the listing page (`/`) includes:
- Canonical tag pointing to itself
- No noindex tags (allow indexing)
- Proper language meta tag

**And** each property page includes:
- Canonical tag pointing to itself (prevent duplicate content)
- No noindex tags (allow indexing)
- Proper language meta tag

**And** all pages include:
- Proper heading hierarchy (H1, H2, H3 only—no skipped levels)
- Internal linking strategy (property cards link to detail pages, detail pages link back to listing)
- No broken internal links (404s)

**And** the SEO implementation can be verified:
- All pages pass basic Lighthouse SEO audit (>90 score)
- Google Search Console shows proper indexation (if submitted)

## Epic 5: Property Interaction & Engagement

Buyers can easily contact agents and navigate between properties for comparison. Implement agent contact block with multiple contact methods (phone, email, contact form), previous/next property navigation, and back-to-results functionality with state preservation.

### Story 5.1: Implement Agent Contact Methods (Phone, Email)

As a buyer,
I want to easily contact the agent via phone or email using multiple contact options,
So that I can reach out to learn more about the property using my preferred method.

**Acceptance Criteria:**

**Given** the property detail page displays agent contact information
**When** I view the Agent Contact Block
**Then** the block displays:
- Agent name and photo (if available)
- Phone number prominently displayed
- Email address prominently displayed
- Contact form area (placeholder for Story 5.3)

**And** the phone number interaction works as:
- On mobile: Clicking phone number opens phone dialer with pre-filled number
- On desktop: Clicking phone number shows copyable number (with copy button or tooltip)
- Phone number is formatted consistently (e.g., +27 123 456 7890)
- Accessibility: Phone number is wrapped in proper `<a href="tel:+...">` tag

**And** the email interaction works as:
- Clicking email address opens default email client with pre-filled recipient
- Email is wrapped in proper `<a href="mailto:...">` tag
- Accessibility: Email is properly marked as email link

**And** the Agent Contact Block styling:
- Uses Tailwind CSS (no inline styles)
- Prominent visual styling (distinct from other page content)
- Clear hierarchy: name first, then phone, then email
- Sufficient whitespace and padding
- Touch-friendly button sizes on mobile (minimum 48px)

**And** color contrast meets WCAG AA standards (4.5:1 for text)
**And** all interactive elements are keyboard-accessible (Tab through phone/email/buttons)
**And** screen readers announce contact methods clearly ("Call agent at...", "Email agent at...")

### Story 5.2: Add Property Navigation and Back to Results

As a buyer,
I want to navigate between properties (Previous/Next) and return to my listing results,
So that I can compare properties easily without losing my search context.

**Acceptance Criteria:**

**Given** I'm viewing a property detail page
**When** I look at the navigation section (typically at top or bottom of page)
**Then** I see:
- "← Back to Results" button that returns to listing page with filters preserved
- "< Previous Property" button (if not first property)
- "Next Property >" button (if not last property)
- Current property indicator: "Property X of Y" or similar

**And** the navigation buttons work as:
- Clicking "Back to Results" returns to `/` or `/listing.html` with filter state restored
- Clicking Previous/Next navigates to adjacent property detail page
- Previous button is disabled/hidden on first property
- Next button is disabled/hidden on last property
- Page does not reload when navigating between properties (smooth transition)

**And** the scroll position behavior:
- When returning from detail to listing, page scrolls to approximately the same position as before
- When navigating to another property, page scrolls to top
- Smooth scroll behavior (not jarring jumps)

**And** the navigation UI styling:
- Uses Tailwind CSS (no inline styles)
- Buttons are clearly visible and touch-friendly (minimum 48px on mobile)
- Visual distinction between primary button (Back) and secondary buttons (Prev/Next)
- Consistent placement (e.g., top of page in breadcrumb area)

**And** filter state persistence:
- Filters remain selected when returning to listing via "Back to Results"
- Filtered results still display when returning to listing
- Clearing filters on listing resets the state

**And** all navigation elements are keyboard-accessible:
- Tab through all navigation buttons
- Enter/Space to activate buttons
- Screen readers announce button purposes clearly

### Story 5.3: Implement Contact Form Submission and Feedback

As a buyer,
I want to submit a message to the agent directly through an inline contact form with validation and confirmation,
So that I can send a custom message without leaving the property page.

**Acceptance Criteria:**

**Given** I'm viewing the Agent Contact Block on a property detail page
**When** I interact with the contact form
**Then** the form includes:
- Name field (text input, required)
- Email field (email input, required)
- Message field (textarea, required, minimum 10 characters)
- Submit button ("Send Message" or similar)
- Clear button or cancel option

**And** form validation works as:
- Name field requires at least 2 characters
- Email field validates email format (basic regex or HTML5 validation)
- Message field requires minimum 10 characters
- On submit: If any field is invalid, show error message and don't submit
- Error messages are clear and specific: "Please enter a valid email" not just "Error"

**And** validation feedback:
- Invalid fields are visually marked (red border or error icon)
- Helpful error text appears below each invalid field
- Errors disappear when user corrects the field
- Keyboard users can navigate to error messages with Tab

**And** form submission behavior:
- Submit button is disabled while form is submitting (prevent double-submit)
- Loading indicator or message appears during submission ("Sending...")
- On successful submission:
  - Form clears or shows success message: "Message sent! The agent will contact you soon."
  - Success message appears for 3-5 seconds then fades
  - Form resets and is ready for new message
  - User can submit another message
- On submission error:
  - Error message appears: "Failed to send message. Please try again or call directly."
  - Form data is preserved (not cleared)
  - User can retry or try another contact method

**And** form uses semantic HTML:
- Proper `<form>`, `<fieldset>`, `<label>` elements
- `<input type="email">` for email field (HTML5 validation)
- Accessible error messages associated with form fields via aria-describedby

**And** form accessibility:
- All fields have associated labels (not just placeholder text)
- Submit button has clear, descriptive text
- Form can be completed entirely with keyboard (Tab, Enter)
- Screen readers announce form purpose and required fields
- Error messages are announced to screen readers

**And** form styling:
- Uses Tailwind CSS (no inline styles)
- Proper spacing between fields
- Clear visual hierarchy
- Touch-friendly input sizes on mobile
- Focus states are clearly visible for keyboard users

**And** optional: Form submission can be handled by:
- A serverless function (AWS Lambda, Netlify Functions, Vercel Functions)
- Email service integration (SendGrid, Mailgun, etc.)
- Or noted as "implementation-dependent; accept POST request to /api/contact" for now

## Epic 6: Accessibility & Performance Excellence

Ensure the entire website is fast, accessible, and works smoothly for all users including those with disabilities or on slow connections. Implement keyboard navigation, WCAG AA contrast, semantic HTML, image optimization, lazy loading, and responsive images.

### Story 6.1: Implement Keyboard Navigation and Screen Reader Support

As a user with disabilities,
I want to navigate and use the entire website using only keyboard and screen reader,
So that I can access all content and functionality regardless of my abilities.

**Acceptance Criteria:**

**Given** I'm visiting the website with a screen reader (NVDA, JAWS, VoiceOver) or using only keyboard
**When** I navigate through the website
**Then** I can:
- Tab through all interactive elements in a logical order
- Activate buttons/links using Enter or Space key
- Navigate form fields with Tab and submit with Enter
- Close modals/popups with Escape key
- Control image carousels with arrow keys

**And** the keyboard navigation order is logical:
- Header → Navigation → Main content → Sidebar (if exists) → Footer
- Links and buttons are in reading order, not random
- Skip links exist to jump to main content (optional but recommended)

**And** all interactive elements have visible focus indicators:
- Keyboard focus is clearly visible (outline, highlight, or underline)
- Focus indicator meets color contrast requirements
- Focus state is distinct from hover state

**And** screen readers announce:
- Page title and main heading (H1)
- Navigation structure and links
- Form fields and their labels (not just placeholder text)
- Buttons and their purpose ("Submit form", "Close modal", etc.)
- Images with meaningful alt text
- Error messages and validation feedback
- Results count updates when filtering
- Success/error messages from form submission

**And** all form controls are properly labeled:
- Every input has associated `<label>` element (not just placeholder)
- Error messages are associated with form fields via aria-describedby
- Required fields are marked with aria-required or aria-label

**And** list structure is semantic:
- Navigation uses `<nav>` and `<ul>`/`<li>`
- Property cards in grid use semantic structure
- Features list on detail page uses `<ul>`/`<li>`

**And** landmark roles are present:
- `<header>`, `<main>`, `<footer>`, `<nav>` semantic tags or aria-label equivalents
- Page structure is clear to assistive technology

**And** testing is verified:
- Keyboard-only navigation works end-to-end on all pages
- Screen reader announces all content accurately (tested with NVDA or similar)
- Tab order matches visual reading order

### Story 6.2: Ensure WCAG AA Color Contrast and Semantic HTML

As a user with vision impairments or color blindness,
I want all text and interactive elements to have sufficient color contrast,
So that I can read and use the website comfortably.

**Acceptance Criteria:**

**Given** I view the website with any color combination or with color-blindness simulation
**When** I look at text and interactive elements
**Then** all text meets WCAG AA color contrast requirements:
- Normal text (body copy): minimum 4.5:1 contrast ratio
- Large text (18pt+ or 14pt+ bold): minimum 3:1 contrast ratio
- UI components (buttons, form borders): minimum 3:1 contrast ratio

**And** color is not the only indicator:
- Links are underlined or otherwise distinguished (not color alone)
- Error messages use icon + text (not color alone)
- Required form fields use asterisk + color/label (not color alone)
- Current filter selections are marked with checkmark or badge (not color alone)

**And** all pages use semantic HTML:
- Proper heading hierarchy: H1, H2, H3 (no skipped levels, no multiple H1s)
- Navigation uses `<nav>`, lists use `<ul>`/`<ol>`/`<li>`
- Forms use `<form>`, fields use `<input>`, labels use `<label>`
- Buttons use `<button>` tag (not divs styled as buttons)
- Links use `<a>` tag (not buttons styled as links)
- Images use `<img>` with alt text
- Emphasis uses `<strong>` or `<em>` (not just styling)

**And** all images have descriptive alt text:
- Listing page cards: "3 bedroom house at 123 Main Street, Suburb"
- Detail page images: "Living room with sofa and natural light"
- Icons: "Solar panels available" or left empty if purely decorative
- No alt text like "image", "photo", "pic" (be descriptive)

**And** all form fields have labels:
- Every input has associated label (visible on page)
- Labels clearly describe the field (not just placeholder text)
- Required fields are marked: "Price Range (required)" or with asterisk

**And** list structure is used correctly:
- Related items are grouped in `<ul>` or `<ol>`
- Feature lists use `<ul>`/`<li>`
- Navigation uses `<ul>`/`<li>` (not divs)

**And** contrast is verified:
- All text passes WCAG AA contrast check (tested with WebAIM or similar tool)
- All UI elements pass 3:1 minimum contrast
- Color combinations work for color-blind users (simulated or user-tested)

**And** semantic HTML is verified:
- Page structure is valid HTML (tested with W3C validator)
- No div/span used where semantic elements exist
- Proper heading hierarchy throughout

### Story 6.3: Implement Image Optimization (Lazy Loading, Responsive Images, WebP)

As a user on slow mobile connection,
I want images to load lazily and responsively at appropriate sizes,
So that the website stays fast even with many high-quality images.

**Acceptance Criteria:**

**Given** I visit the website on a slow 3G connection or with many images
**When** I load and browse pages
**Then** images are optimized:
- Lazy loading: Images below the fold don't load until scrolled into view
- Responsive images: Different image sizes for mobile (640px), tablet (1024px), desktop (1920px)
- Modern formats: WebP format for modern browsers with fallback to original format
- Compressed: File sizes are reduced without visible quality loss

**And** lazy loading implementation:
- Listing page: Images load as user scrolls (not all 300+ image URLs at once)
- Detail page carousel: Only visible images and adjacent thumbnails load immediately
- Below-fold images load when user scrolls to them
- Placeholder or low-quality image shown while loading (optional)

**And** responsive images use srcset:
- `<img src="image-640.jpg" srcset="image-640.jpg 640w, image-1024.jpg 1024w, image-1920.jpg 1920w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" alt="..."/>`

**And** WebP format implementation:
- Modern browsers receive WebP format (smaller file size)
- Fallback to JPEG/PNG for older browsers
- Can use `<picture>` element or srcset type variant

**And** image files are compressed:
- JPEG: Quality 75-85 for property images
- PNG: Lossless compression, used only when necessary
- WebP: High compression with quality 75-80
- Typical property photo: 50-150KB (not 2MB+)

**And** gallery performance:
- Carousel images load smoothly without lag
- Thumbnail images are smaller (50-100KB) or very compressed
- Main image loads before user clicks (or quickly)
- Smooth scrolling maintained even while loading

**And** performance is verified:
- Listing page: Loads in <2 seconds even with lazy loading verification
- Detail page: Loads in <1 second
- Lighthouse "Images" audit: All images have proper alt text and sizing
- Network tab shows lazy loading working (images load on demand)
- WebP format used in modern browsers (verified in DevTools)

### Story 6.4: Run Accessibility and Performance Audits and Fix Issues

As a website owner,
I want to verify the website meets accessibility standards and performs well,
So that all users can access and use the website successfully.

**Acceptance Criteria:**

**Given** the entire website is complete with all features
**When** I run automated and manual audits
**Then** the website passes:
- Lighthouse Accessibility audit: ≥90 score
- Lighthouse Performance audit: ≥90 score
- Lighthouse Best Practices audit: ≥90 score
- WAVE accessibility scanner: 0 errors, minimal warnings (resolved where possible)
- axe DevTools: 0 violations

**And** manual testing includes:
- Keyboard-only navigation: Complete end-to-end workflows without mouse
- Screen reader testing: NVDA or JAWS on Windows, VoiceOver on Mac/mobile
- Mobile testing: Touch targets >48px, readable text, no horizontal scroll
- Color contrast verification: All text/UI meets WCAG AA minimums
- Responsive testing: Looks good at 320px, 640px, 1024px, 1920px
- Browser testing: Chrome, Safari, Firefox, Edge (latest 2 versions)

**And** performance testing includes:
- Lighthouse scores on desktop: ≥90 across all metrics
- Lighthouse scores on mobile (slow 4G): ≥85 Performance, ≥85 Accessibility
- Core Web Vitals:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- Page load times: Listing <2s, Detail <1s (on typical connection)
- Cache strategy: Static assets cached appropriately

**And** any issues found are documented and fixed:
- Contrast issues: Update colors to meet 4.5:1 minimum
- Missing alt text: Add descriptive alt text to all images
- Keyboard navigation issues: Fix tab order or add keyboard handlers
- Missing labels: Add labels to all form fields
- Image optimization: Implement lazy loading, WebP, responsive images
- Performance issues: Optimize images, defer non-critical CSS/JS, minify assets

**And** a final audit shows:
- Zero critical accessibility issues
- Zero critical performance bottlenecks
- All user workflows verified to work with keyboard and screen reader
- All pages load within performance targets
- Website is ready for production launch

**And** documentation is created:
- Accessibility statement (if required)
- Performance optimization summary
- Known limitations or exceptions documented
- Testing checklists for future updates

