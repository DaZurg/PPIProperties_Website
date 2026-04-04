---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["PropSync Data-Test - Properties.csv"]
workflowType: 'prd'
classification:
  projectType: web_app
  domain: real_estate
  complexity: low-medium
  projectContext: greenfield
---

# Product Requirements Document - PPIProperties_Website

**Author:** Willem | **Date:** 2026-04-04 | **Project Type:** Web App (MPA) | **Domain:** Real Estate | **Status:** Greenfield

## Executive Summary

**PPIProperties Website** is a low-maintenance property listing platform solving the operational burden of manual website updates. The solution: automate the data pipeline (Google Sheets → JSON → static HTML via GitHub Actions). Update data once, site reflects changes automatically.

**Primary User:** Property buyers searching for homes. Need intuitive, fast browsing with filtering, image galleries, and property details (beds, baths, features).

**Owner Needs:** Confidence that supplied data displays consistently without manual intervention. Deployment in <5 minutes after updates.

**Differentiator:** Your branding paired with OneRoof-caliber UX—a polished, branded experience buyers trust. Two-user optimization (buyer experience + admin automation) is the competitive edge.

**Scope:** Launch with 6 properties, scale to 300+ without architecture changes.

## Success Criteria

### User Success

**Buyer Discovery:** Buyers can find properties matching their criteria within 2-3 clicks. Filtering by property type, price range, and location works instantly without lag.

**Image & Details Experience:** Buyers can browse 20+ property images smoothly with zero loading delays. Core details (bedrooms, bathrooms, special features, price) are immediately visible alongside images.

**Agent Contact:** Buyers can easily find and access agent contact details (phone, email, contact form) on every property detail page. Contact options are clearly visible.

**Engagement Target:** Average session duration 2-10 minutes, indicating meaningful property exploration.

### Business Success

**Operational Efficiency:** Website deployment after Excel updates takes <5 minutes total (automation handles data sync, minimal manual work).

**Reliability & Availability:** Website is available 24/7 for buyers to browse. No downtime should exceed 15 minutes per month.

**Content Freshness:** Property data updates reflect Google Sheet changes within 24 hours of deployment.

### Technical Success

**Performance:** Property grid loads in <2 seconds. Property detail pages load in <1 second. Image galleries load smoothly without jank.

**Automation:** GitHub Actions deployment runs reliably. Excel-to-JSON conversion handles all data fields without manual intervention. Zero manual website file edits required.

**SEO & Discoverability:** Each property has a unique, crawlable detail page for search engines.

### Measurable Outcomes

- Filtering returns results in <500ms
- Image gallery browsing is smooth (60fps animations)
- Agent contact details visible "above the fold" on property pages
- Deployment process <5 minutes from Excel change to live site
- Website uptime >99.5%

## Product Scope

### MVP - Minimum Viable Product

**Must have to launch:**
- Property listing grid with responsive design
- Filters: property type, price range, bedrooms, location/suburb
- Property detail page with full image gallery
- Agent contact details and contact form/link
- Automated Excel → JSON → HTML deployment via GitHub Actions
- Mobile-responsive design

### Growth Features (Post-MVP)

- Advanced filters (bathrooms, garage, special features)
- Saved favorites/bookmarking
- Property comparison tool
- Map view of properties
- Search by address/suburb
- Property timeline/price history
- Email notifications for new listings

## User Journeys

### Journey 1: Sarah - Buyer Browsing Properties

**Persona:** Sarah, 32, first-time home buyer searching for a 2-3 bedroom home within budget

**Opening:** Sarah finds the website through Google search. She lands on the property listing page and sees 200+ properties displayed. She hopes your site is simpler to navigate than OneRoof.

**The Journey:**
1. **Discovery** — Sarah sees the property grid with thumbnail images and immediately looks for filter options
2. **Filtering** — She filters by 2-3 bedrooms, price range R400k-R800k, and preferred suburb. Results narrow to 12 properties instantly
3. **Browsing** — She scrolls through filtered results, scanning images, price, and address. Fast filtering gives her control and confidence
4. **Deep Dive** — Sarah clicks a property that catches her eye and transitions to the detail page smoothly. She views:
   - 20+ high-quality property images (browsing and zooming without lag)
   - Core details: 3 bed, 2 bath, special features (solar panels, pool)
   - Agent name and contact info prominently displayed
5. **Action** — She clicks "Contact Agent" (phone, email, or contact form available)
6. **Return & Compare** — She navigates back to the list and checks 2-3 more properties before deciding which agents to contact

**Resolution:** Sarah felt the site was clean and intuitive. She found properties matching her criteria quickly and took action. She'll recommend it to friends.

**Key Emotional Moments:**
- Relief: Filtering worked instantly and wasn't overwhelming
- Confidence: Agent details were clear and easy to find
- Satisfaction: Beautiful images showed properties clearly

---

### Journey 2: Willem - Admin Maintaining the Site

**Persona:** Willem, property listing owner, updates property data weekly with minimal time investment

**Opening:** It's Monday morning. Willem has 3 new property listings from agents and 2 properties to mark as sold. He opens his Google Sheet and updates the data (new rows, status changes). This takes ~10 minutes.

**The Journey:**
1. **Data Update** — Willem updates the Excel sheet with new property details: addresses, prices, images, agent info, special features. All formatted consistently
2. **Triggering Deployment** — Willem commits changes to GitHub or runs a GitHub Actions workflow manually
3. **Automation** — GitHub Actions automatically:
   - Reads the Excel/JSON data
   - Converts to static HTML pages (grid, detail pages)
   - Deploys to cPanel hosting via FTP
4. **Verification** — 5 minutes later, Willem checks the website. New properties appear on the listing grid. Sold properties are hidden. Data matches Excel perfectly
5. **Assurance** — Willem knows the site is live with current data. No manual HTML editing was needed. He can close his browser and move on

**Resolution:** Total active time: <5 minutes. Update data once, site updates automatically. Zero ongoing website maintenance burden.

**Key Emotional Moments:**
- Confidence: Deployment completed without manual intervention
- Relief: No need to edit HTML or debug website code
- Satisfaction: Data pipeline is reliable and consistent

---

## Technical Requirements

### Architecture & Platform

**Multi-Page App (Static HTML Generation)**
- Each property detail page is a pre-generated static HTML file with unique, semantic URL (e.g., `/properties/3108494-6-fair-road/`)
- Listing page displays all properties with client-side filtering
- No runtime server-side rendering
- GitHub Actions converts JSON → HTML files using template system (Handlebars, EJS, etc.)
- Deploy to cPanel via FTP/SFTP with atomic updates

**Browser & Deployment**
- Target: Chrome, Safari, Firefox, Edge (latest 2 versions)
- Modern CSS (Flexbox, Grid) and JavaScript (ES6+)
- Mobile-responsive (phone, tablet, desktop)
- Image optimization and lazy loading

**SEO & Accessibility**
- Meta tags and Schema.org structured data per property
- Sitemap.xml and Open Graph tags for social sharing
- Semantic HTML, keyboard navigation, WCAG AA color contrast
- Image alt text, form labels, proper heading hierarchy

**Data Management**
- Property data: JSON format (converted from Google Sheet)
- Required fields: address, price, bedrooms, bathrooms, images, description, agent contact, special features
- Optional fields: floor area, erf size, garage, parking, etc.
- On-demand deployment (no real-time sync needed)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Start with what you have. Launch with 6 current properties, proving the core concept (automated updates, beautiful display, buyer discovery) works at small scale, then scale to 300+ properties as your inventory grows.

**Why this works:**
- No artificial feature cuts — complete user journeys from day one
- Real validation: Does the automation pipeline work? Do buyers like the interface?
- Growth is clean: Add more properties without changing architecture

**Resource Requirements:** Solo developer (you managing data + GitHub Actions automation). No external team needed for MVP.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
1. Sarah (Buyer): Browse → Filter → View Details → Contact Agent
2. Willem (Admin): Update Excel → Deploy → Verify

**Must-Have Capabilities:**
- Property listing grid with thumbnail images (6 properties initially)
- Filtering: property type, price range, bedrooms, location/suburb
- Property detail page with full image gallery (20+ images per property)
- Agent contact details and contact options (phone, email, contact form)
- Automated Excel → JSON → HTML pipeline via GitHub Actions
- FTP/SFTP deployment to cPanel
- Mobile-responsive design
- SEO: Unique URLs, meta tags, structured data per property
- Basic accessibility (WCAG AA)

**Launch Target:** All 6 current properties with full feature set

### Post-MVP Features

**Phase 2 (Post-MVP Growth):**
- Advanced filters (bathrooms, garage, special features)
- Saved favorites/bookmarking
- Property comparison tool
- Map view of properties
- Search by address/suburb
- Property price history/timeline
- Email notifications for new listings
- Support for 50-300 properties without architecture changes

**Phase 3 (Expansion):**
- Analytics (which properties get most views, etc.)
- Agent dashboard (if agents manage their own listings)
- Advanced search and saved searches
- Community/neighborhood insights

### Risk Mitigation

**Technical:** Static HTML generation is proven, low-complexity. GitHub Actions + FTP is standard. Low risk.

**Market:** You control inventory — no bet on market discovery needed. Validation via buyer engagement and agent contact metrics.

**Resource:** Fully automated pipeline requires <5 min/update. Single-person team sustainable. Manual HTML editing is acceptable fallback.

## Functional Requirements

### Property Discovery & Browsing

- FR1: Buyers can view a listing page displaying all available properties
- FR2: Buyers can see property images (thumbnails) on the listing page
- FR3: Buyers can see property price on the listing page
- FR4: Buyers can see property address on the listing page
- FR5: Buyers can see core property details (bedrooms, bathrooms) on the listing page

### Property Filtering & Refinement

- FR6: Buyers can filter properties by property type (house, apartment, etc.)
- FR7: Buyers can filter properties by price range (min/max)
- FR8: Buyers can filter properties by number of bedrooms
- FR9: Buyers can filter properties by location/suburb
- FR10: Buyers can combine multiple filters simultaneously
- FR11: Buyers can see filtered results update instantly (no page reload)
- FR12: Buyers can clear all filters and see complete property list

### Property Detail Viewing

- FR13: Buyers can click/navigate to property detail page
- FR14: Buyers can see full property address
- FR15: Buyers can see property price
- FR16: Buyers can see bedroom count
- FR17: Buyers can see bathroom count
- FR18: Buyers can see special features (solar panels, pools, garages, etc.)
- FR19: Buyers can read full property description/marketing text

### Image Gallery & Media

- FR20: Buyers can view property images in sequence (20+ per property)
- FR21: Buyers can navigate forward/backward through images
- FR22: Buyers can zoom in/out on individual images
- FR23: Image gallery loads and scrolls smoothly without lag

### Agent Contact & Engagement

- FR24: Buyers can see agent name on property detail page
- FR25: Buyers can see agent contact information (phone, email) prominently displayed
- FR26: Buyers can initiate phone contact with agent
- FR27: Buyers can send email to agent
- FR28: Buyers can submit contact form to reach agent

### Page Navigation & Experience

- FR29: Buyers can navigate back from property detail to listing page
- FR30: Buyers can navigate between different properties from detail page
- FR31: Filtering choices persist as users browse property details

### Data & Content Management

- FR32: Admin can update property information in Google Sheet
- FR33: Admin can trigger deployment of updated content
- FR34: System can read and validate property data
- FR35: System can process property data for website display

### Deployment & Site Updates

- FR36: Admin can initiate website deployment via GitHub Actions
- FR37: System can generate static website files from property data
- FR38: System can upload updated website files to cPanel hosting
- FR39: System can provide feedback on deployment success/failure
- FR40: Updated properties appear on live website after deployment

### Search Engine Optimization

- FR41: Each property has a unique, semantic URL structure
- FR42: Each property page includes search engine meta tags (title, description)
- FR43: Each property includes structured data markup (Schema.org)
- FR44: Website includes XML sitemap for search engines
- FR45: Property pages include Open Graph tags for social sharing

### Responsive Design & Accessibility

- FR46: All pages are fully responsive on mobile devices (phones)
- FR47: All pages are fully responsive on tablet devices
- FR48: All pages are fully responsive on desktop browsers
- FR49: All interactive elements are keyboard-accessible
- FR50: All images have descriptive alt text
- FR51: All form fields have associated labels
- FR52: Page headings follow proper hierarchy (H1, H2, etc.)
- FR53: Color contrast meets WCAG AA accessibility standard

## Non-Functional Requirements

### Performance

- NFR1: Listing page loads in under 2 seconds on typical internet connection
- NFR2: Property detail page loads in under 1 second
- NFR3: Filter results update in under 500ms without full page reload
- NFR4: Image gallery scrolls smoothly (60fps) without lag
- NFR5: Website is accessible on slow mobile connections (3G speeds)

### Scalability

- NFR6: Website scales to 300+ properties without modifying core architecture
- NFR7: Listing page performance remains <2s even with 300 properties
- NFR8: Filter responsiveness remains <500ms with full property catalog
- NFR9: Image galleries maintain smooth performance with 20+ images per property

### Reliability & Availability

- NFR10: Website uptime is >99.5% (no more than ~22 minutes downtime per month)
- NFR11: Automatic deployment completes without manual intervention
- NFR12: Deployment failures provide clear error messages for troubleshooting
- NFR13: Website remains available during GitHub Actions deployments (no downtime)

### Integration & Deployment

- NFR14: GitHub Actions can read property data from JSON files
- NFR15: Deployment to cPanel via FTP/SFTP completes reliably
- NFR16: Data validation catches and reports missing required fields
- NFR17: Image URLs are validated before deployment (broken images don't publish)

### Accessibility

- NFR18: All text meets WCAG AA color contrast minimum (4.5:1)
- NFR19: All interactive elements are keyboard-navigable
- NFR20: Page structure uses semantic HTML (proper heading hierarchy)
- NFR21: All images have meaningful alt text
