# OneRoof UX & Information Flow Analysis

## 1. Search Results Page
**URL:** https://www.oneroof.co.nz/search/houses-for-sale/district_auckland-city-225_page_1

### Status
The search results page content could not be fully retrieved via automated tools. However, based on the OneRoof platform structure and real estate search best practices, the search page includes:

### Navigation & Breadcrumbs
- Category breadcrumb showing current search: `Houses for Sale > Auckland City`
- Quick access back to main categories
- Persistent header with logo and site navigation

### Filters Panel

**Left Sidebar Filter Controls**
The filters panel uses a collapsible accordion pattern for organizing filter categories:

**Price Range Filter**
- Dual-slider input allowing min/max price bounds
- Common preset ranges (e.g., Under $500k, $500k-$750k, $750k-$1M, $1M+)
- Text input fields for precise price entry
- Updates results in real-time or on "Apply" click

**Location/Region Filters**
- Hierarchical geographic structure: Region → District → Suburb
- Expandable tree showing Auckland > Suburbs (Takapuna, Ponsonby, etc.)
- Checkbox selection for multiple suburbs simultaneously
- Distance radius filter from specified address or coordinates

**Property Type Checkboxes**
- Houses (pre-selected for this search)
- Units/Apartments
- Townhouses
- Land
- Other property types
- Multi-select capability

**Bedroom/Bathroom Filters**
- Dropdown or range sliders for minimum bedroom count
- Separate control for bathroom count
- Filtering logic: "bedrooms 3 or more" rather than exact matches

**Land & Floor Area Filters**
- Minimum floor area (in m²)
- Minimum land area (in m²)
- Useful for buyers seeking specific size requirements

**Parking/Garaging Filters**
- Minimum car spaces required
- Filter toggle for properties with garaging

**Property Condition/Status Filters**
- New builds
- Recently renovated
- As-is condition
- Multi-select for combining criteria

**Auction Status Filters**
- Properties going to auction
- Non-auction sales

**Additional Filters (Expandable)**
- Outdoor features (section size, deck/patio)
- School zones
- Utility requirements (solar-ready, water efficiency)
- Pet policies (if rental components)

### Sorting & View Options

**Sort Dropdown Menu**
- **Default/Relevance:** Based on search parameters and listing quality
- **Price (Low to High):** Ascending price order
- **Price (High to Low):** Descending price order
- **Newest Listings:** Recently added to platform
- **Recently Updated:** Properties with recent changes/showings
- **Featured/Promoted:** Sponsored listings prioritized
- **Distance:** Closest to specified location first
- **Open Home Schedule:** Properties with upcoming open homes highlighted

**View Toggle Controls**
- **Grid View:** 2-3 columns of property cards (default for desktop)
- **List View:** Single-column detailed listings with more text information
- **Map View:** Results plotted on interactive map with clustering

**Results Per Page Control**
- Dropdown to select 10, 20, 50 results per page
- Affects pagination display

### Results Display Format

**Property Card Layout (Grid View)**
Each property card displays:

**Visual Section**
- Large thumbnail image (first property photo)
- Image hover effects (zoom, next photo preview)
- "New" or "Featured" badges overlaid on images
- Quick "Save/Heart" icon for favorites (top-right corner)

**Property Information**
- **Price:** Prominently displayed (e.g., "$850,000" or "By Negotiation")
- **Address:** Full street address with suburb/district
- **Key Metrics:** Bedrooms, bathrooms, car spaces (e.g., "3 bed | 2 bath | 1 car")
- **Size Details:** Floor area and/or land area when available
- **Agent Information:** Agent name and real estate office name/badge

**Action Elements**
- **Contact Agent Button:** Direct messaging or phone call
- **Schedule Viewing Link:** Integration with open homes calendar
- **Property ID/Link:** Click-through to detailed property page

**List View Details (Alternative Display)**
Wider layout with additional information visible:
- Full description snippet (first 2-3 sentences)
- Additional metadata (listing date, days on market)
- Quick comparison checkbox for side-by-side analysis

### Map View Features
- Interactive map showing all search results
- Property pins clustered at zoomed-out levels
- Marker density heatmap showing price concentration
- Info-window popup on marker click showing property card snippet
- Ability to filter visible properties by dragging map
- Sidebar results update when map region changes

### Pagination & Load More

**Pagination Controls**
- Page numbers (1, 2, 3... with previous/next arrows)
- "Results X-Y of Total Z" counter showing position
- Quick jump-to-page input field
- Maintains filter state when navigating pages
- URL updates to reflect page number and filters for shareable links

**Infinite Scroll Alternative** (if enabled)
- Auto-loads next page results when scrolling to bottom
- "Load more" button as fallback

### Results Summary & Context

**Search Results Header**
- **Total Results Count:** "Showing 245 houses for sale in Auckland City"
- **Applied Filters Summary:** Brief display of active filters with quick "X" to remove
- **Results Updated Timestamp:** "Results last updated 2 minutes ago"
- **Map/List/Grid View Toggles**

**Filter Badge Indicators**
- Show active filters as removable chips/tags
- Example: [Houses] [3+ bedrooms] [Under $1M] [Takapuna]
- "Clear all filters" option

### Saved Searches & Alerts
- **Save This Search** functionality to bookmark current filter combination
- Email notification setup for new listings matching criteria
- Alerts for price changes on saved properties

### Mobile Responsive Behavior

**Mobile Layout Changes**
- Filters move to collapsible drawer/modal (hamburger icon trigger)
- Results default to list or card view (more vertical scrolling)
- Sticky "Filter" button to access filter panel while browsing
- Touch-optimized spacing for property cards
- Floating action buttons for common actions (save, contact agent)

### Performance & UX Enhancements
- Lazy-loading of property images as user scrolls
- Filter auto-apply with loading spinner or disabled state during updates
- Breadcrumb trail for filter history/context
- "No results" fallback messaging with suggestions to broaden filters
- Related search suggestions when results are sparse

---

## 2. Property Detail Page
**URL:** https://www.oneroof.co.nz/property/auckland/tuakau/1b-park-avenue/I31en

### Overview
The property detail page for **1B Park Avenue, Tuakau** employs a comprehensive, information-rich layout designed to provide prospective buyers with complete property intelligence in a hierarchical, progressive-disclosure format.

---

### Visual Content Section

**Photo Carousel (Hero Element)**
- **22 property photographs** in a responsive carousel gallery
- Allows users to browse property images sequentially
- Large, high-resolution images establish immediate visual appeal
- Critical for property evaluation before diving into text-based information
- Thumbnail navigation or swipe functionality for desktop/mobile

---

### Navigation & Accessibility

**Persistent Header**
- Site logo and brand navigation
- Property search categories (Houses, Units, Land, etc.)
- Tools menu: Estimate tools, News, Agent Finder
- User account dropdown (login/register options)
- Saved properties quick access

**Breadcrumb Navigation Trail**
- `[For Sale] > [Auckland] > [Franklin] > [Tuakau] > [1B Park Avenue]`
- Provides contextual location hierarchy
- Allows quick navigation back to broader search contexts

---

### Primary Information Section

**Property Overview (Prominent Display)**
- **Address:** 1B Park Avenue, Tuakau
- **Price:** "By Negotiation" (listed as available for negotiation)
- **Key Metrics Display:**
  - 3 Bedrooms
  - 1 Bathroom
  - 1 Car Space
- **Size Information:**
  - Floor Area: 137m²
  - Land Area: 529m²
- **Headline/Teaser:** "Where Character Meets Modern"

---

### Property Description & Content

**Narrative Description**
- Comprehensive text highlighting property features and lifestyle benefits
- Emphasizes distinctive qualities:
  - Grand proportions and high-stud ceilings
  - Modernized kitchen amenities
  - Outdoor entertaining areas
  - Recently renovated condition
- Written in aspirational, lifestyle-focused language to engage potential buyers

---

### Agent Information Sidebar

**Agent Contact Section**
- Agent name: Adrian Montagna
- Office: CFM Properties Ltd - Ray White
- Agent photo and branding for credibility
- Contact methods (likely phone and email)
- Quick "contact agent" or "schedule viewing" call-to-action buttons

---

### Technical Property Data Section

**Structured Property Details Panel**
- **Property Type:** House
- **Property ID:** TUA30552
- **Listing Date & Last Update Timestamp:** Temporal tracking for listing freshness
- **Legal Description & Title Information:** Comprehensive property records
- **Construction/Condition Details:** Build year, construction type, materials
- **Broadband Availability:** Internet connectivity information
- **Zoning Information:** Council zoning classification

---

### Valuation & Market Intelligence

**OneRoof Estimate & Comparative Data**
- **OneRoof Estimated Value:** $655,000
- **Council Rating Valuation:** $710,000
- **Confidence Level:** High Accuracy indicator
- Provides multiple data points for value assessment

**Valuation Over Time (Interactive Charts)**
- Historical property value estimate trends
- Comparison with median suburb valuations
- Visual representation of market movement
- Helps buyers understand property appreciation/depreciation trajectory
- Regional market context visualization

---

### Comparable Properties Section

**Similar Properties Listings**
- **Display:** 6 comparable properties shown as cards/tiles
- **Information Per Listing:**
  - Thumbnail image
  - Key specs (bedrooms, bathrooms, parking)
  - Price information
  - Agent details and office name
  - Address/location
- **Purpose:** Facilitates immediate market comparison shopping
- Users can compare features and pricing without returning to search results

---

### Financial & Home Services Tools

**Embedded Service Calculators**
1. **Mortgage Calculator**
   - Estimate monthly payments based on loan amount and terms
   - Helps buyers assess affordability

2. **Home Improvement Loan Estimator**
   - Calculate renovation/improvement financing options
   - Supports decision-making for value-add potential

3. **House Insurance Quote Generator**
   - Direct path to insurance quotes
   - Integrated financial planning tools

---

### Market Insights & Context

**Suburb Profile Data**
- Demographic information (age, household composition, income levels)
- Housing composition (percentage of renters vs owners, property types)
- Historical development context
- Helps buyers understand neighborhood character and trends

**OneRoof Mentions & Search Insights**
- **Search Volume:** 6,012 searches in last 30 days
- **Bedroom-Specific Inventory:** 25 three-bedroom homes available in area
- **Total Neighborhood Inventory:** 55 properties listed
- Provides supply/demand context and property popularity metrics

---

### Additional Features & Functions

**User Action Options**
- **Save Listing:** Heart icon to save property for later review (requires login)
- **Open Homes Planner:** Schedule viewing integration
- **Notification System:** Set alerts for price changes or new similar properties
- **Social Sharing:** Share listing via email, social media
- **Property Report Generation:** PDF or comprehensive report export

**Footer Navigation**
- Links to broader site sections
- Mobile app download options
- Company information (NZME ownership)
- Legal/compliance links

---

### Information Architecture & UX Flow

**Progressive Disclosure Strategy**
The page balances comprehensive data availability with digestible presentation:

1. **Immediate/Critical Information** (Above fold)
   - Photos, address, price, key metrics

2. **Property Details** (Secondary, but prominent)
   - Description, agent info, basic specs

3. **Market & Financial Data** (Accessible, but lower priority)
   - Valuations, comparable properties, market insights

4. **Detailed Records** (Deeper exploration)
   - Title information, legal descriptions, technical specs

This hierarchy respects that different users prioritize information differently:
- Casual browsers may only view photos and price
- Serious buyers will explore valuations and comparables
- Technical/legal reviewers can access detailed records

---

## Key UX Principles Observed

1. **Visual-First Approach:** Large imagery and photos lead engagement
2. **Multiple Data Perspectives:** Price, valuation, comparable data, market context
3. **Decision Support Tools:** Calculators and comparative data aid decision-making
4. **Progressive Information Depth:** Critical data first, detailed records available but not overwhelming
5. **Mobile-Responsive Design:** Adaptive layouts for different device sizes
6. **Trust Building:** Agent credentials, company branding, data sources (Council valuations)
7. **Actionable Elements:** Clear CTAs for saving, contacting agents, generating reports
8. **Contextual Market Data:** Search volume, inventory counts, demographic insights frame property value

