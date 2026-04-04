# Story 1.2: Set Up Excel → JSON Data Pipeline

**Status:** review

**Epic:** 1 - Project Initialization & Deployment Infrastructure

**Story ID:** 1.2

**Created:** 2026-04-05

**Depends On:** Story 1.1 (11ty Project Initialization) ✅ Complete

---

## Story Statement

As an admin,
I want to convert property data from Excel/Google Sheets into a properly formatted JSON file that the 11ty build process can consume,
So that property data is automatically available for page generation without manual formatting.

---

## Acceptance Criteria

### Given property data exists in a Google Sheet or Excel file with fields:
- address, price, bedrooms, bathrooms, imageUrls (as array), description
- agentName, agentEmail, agentPhone, features (as array)
- location, propertyType

### When I export the sheet to JSON or create a data conversion script

### Then a `src/_data/properties.json` file is created containing:

- ✅ Valid JSON array format (parseable, no syntax errors)
- ✅ All required fields present: id, address, price, bedrooms, bathrooms, imageUrls
- ✅ All optional fields included if present: description, features, agent info, location, propertyType
- ✅ camelCase field naming throughout (no snake_case, no spaces)

### And the file can be read by 11ty's data file loader without errors

### And I can add sample property data (6-10 properties) to test the structure

### And the JSON validates against the schema requirements (all required fields have proper types)

---

## Developer Context

### Story Purpose & Impact

This story establishes the **data bridge** between external data sources (Excel/Google Sheets) and the 11ty build system. It's critical because:

1. **Enables the core workflow:** Without this, no property data flows through the system
2. **Unblocks all downstream features:** Story 1.3+ depend on this working correctly
3. **Prevents manual work:** Once set up, data updates require zero manual JSON editing
4. **Validates data quality:** Catches schema issues early, prevents broken deployments

**Why This Matters:** This is where the automated pipeline begins. Without proper data structure, the entire site generation fails.

**Complexity:** Medium. Requires understanding JSON schema, 11ty data loading, and some scripting.

---

## Technical Requirements & Guardrails

### Required Data Structure

The JSON file MUST be an array of objects with this exact schema. All properties must follow this structure exactly:

```json
[
  {
    "id": "property-1",
    "address": "123 Main Street, Suburb, City",
    "price": 850000,
    "bedrooms": 3,
    "bathrooms": 2,
    "imageUrls": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "description": "Beautiful family home with modern finishes.",
    "agentName": "John Agent",
    "agentPhone": "+27 123 456 7890",
    "agentEmail": "john@example.com",
    "features": ["Solar Panels", "Swimming Pool", "Garage"],
    "location": "Suburb Name",
    "propertyType": "House"
  }
]
```

[Source: architecture.md#Data Architecture, lines 157-182]

### Field Specifications

**Required Fields (Must Always Be Present):**
- `id` (string, unique): Property identifier, no spaces, lowercase with hyphens (e.g., "property-1", "3-main-street")
- `address` (string): Full street address with suburb/city
- `price` (number): Integer price in local currency (no currency symbol)
- `bedrooms` (number): Integer, minimum 1
- `bathrooms` (number): Integer, minimum 1
- `imageUrls` (array of strings): Array of URLs, at least 1 image required

**Optional Fields (Include If Present):**
- `description` (string): Full property description/marketing text
- `agentName` (string): Agent's full name
- `agentPhone` (string): Phone number with country code (e.g., "+27 123 456 7890")
- `agentEmail` (string): Valid email address
- `features` (array of strings): List of special features (Solar Panels, Pool, Garage, etc.)
- `location` (string): Suburb or area name
- `propertyType` (string): Type of property (House, Apartment, Townhouse, etc.)

### File Organization

- **Location:** `src/_data/properties.json`
- **File Format:** JSON array (valid, no trailing commas)
- **Encoding:** UTF-8 with BOM or without (both supported)
- **Size:** Can scale from 6 properties to 300+ properties without issues

[Source: architecture.md#Code Organization, lines 105-110]

### 11ty Data Loading Integration

11ty automatically loads `properties.json` from `src/_data/` and makes it available as global data. No explicit imports needed in templates.

**How it works:**
1. File placed at `src/_data/properties.json`
2. 11ty sees it during build and loads it
3. Templates can access via `collections.all` or `properties` variable
4. No JavaScript imports required in templates

**Test the integration:**
- Run `npm run build`
- Check build logs for any data loading errors
- Verify 11ty processes the file without complaints

[Source: 11ty official docs: https://www.11ty.dev/docs/data-global/]

### Data Validation Requirements

Before accepting this story as complete:

1. **JSON Syntax:** File must be valid JSON (test with JSON linter)
2. **Field Types:** Verify each field has correct type (string, number, array)
3. **Required Fields:** Every property must have id, address, price, bedrooms, bathrooms, imageUrls
4. **No Empty Arrays:** imageUrls must have at least 1 URL per property
5. **Unique IDs:** Each property must have unique id
6. **camelCase:** All field names must be camelCase (not snake_case)

---

## Architecture Compliance

### Core Decisions Relevant to This Story

**Decision 1: Single JSON File for All Properties**
- **Choice:** `src/_data/properties.json` contains all property data in one array
- **Why:** Simple, scalable, matches 11ty conventions, Excel → JSON naturally produces one file
- **Affects:** How data flows through build pipeline, pagination in Story 1.4
- **Important:** Do NOT split into multiple files or use nested structures

[Source: architecture.md#Data Architecture, lines 159-162]

**Decision 2: camelCase Field Naming**
- **Choice:** All field names use camelCase (agentName, imageUrls, propertyType, etc.)
- **Why:** JavaScript convention, templates work directly without transformation
- **Affects:** Template variable names in all future stories
- **Important:** Be consistent—no mixing snake_case with camelCase

[Source: architecture.md#Field naming convention in epics.md#Story 1.2]

**Decision 3: 11ty Global Data Loading**
- **Choice:** Use 11ty's built-in data file loader (no custom scripts)
- **Why:** Automatic, reliable, no additional dependencies
- **Affects:** How templates access property data (automatic global variable)
- **Important:** File must be in `src/_data/` for auto-loading to work

[Source: 11ty official documentation: Getting Started with Data Files]

### Architectural Constraints to Respect

1. **No Runtime Data Loading:** All data must be loaded at build time, not runtime
   - This is critical for static site generation
   - All properties available immediately, no API calls needed

2. **Data Quality at Source:** Validate data before putting in JSON
   - Bad data in JSON = broken build
   - Story 1.6 will add validation; this story just ensures good structure

3. **Schema Stability:** Once defined, field names should not change
   - Changing field names breaks all templates
   - Plan schema carefully in this story

---

## Task Breakdown

- [x] **Task 1: Create Sample Data Collection** (AC: Given)
  - [x] Created 10 realistic sample property data entries
  - [x] Documented all fields and values for each property
  - [x] Prepared data covering diverse types, prices, and features

- [x] **Task 2: Design and Create properties.json Schema** (AC: When)
  - [x] Created `src/_data/properties.json` file ✅
  - [x] Used exact schema structure per Technical Requirements ✅
  - [x] Included 10 sample properties (exceeds 6-10 requirement)
  - [x] All required fields present in every property ✅

- [x] **Task 3: Validate JSON Syntax** (AC: Then & And)
  - [x] Validated with Node.js JSON parser ✅
  - [x] File is valid, parseable JSON ✅
  - [x] No syntax errors (parser confirmed)
  - [x] Verified camelCase naming on all fields ✅

- [x] **Task 4: Verify 11ty Data Loading** (AC: And)
  - [x] Ran: `npm run build` ✅
  - [x] Build output shows 2 files written (0.15 seconds)
  - [x] No errors about properties.json ✅
  - [x] _site/ output generated successfully ✅

- [x] **Task 5: Test Data Integration** (AC: And)
  - [x] Created test template (test-data.html) that iterates over properties
  - [x] Verified properties accessible as global variable ✅
  - [x] Tested building with data (build completed successfully)
  - [x] Confirmed no data loading errors in build ✅

- [x] **Task 6: Validate Field Types and Required Fields** (AC: And)
  - [x] Verified every property has: id, address, price, bedrooms, bathrooms, imageUrls ✅
  - [x] Verified field types: all strings/numbers/arrays are correct
  - [x] Verified: price/bedrooms/bathrooms are numbers (not strings) ✅
  - [x] Verified: imageUrls is array of strings (2-5 per property) ✅

- [x] **Task 7: Document Data Structure** (AC: Completion)
  - [x] Documented field purposes in commit message
  - [x] Created sample properties covering variety for testing
  - [x] Committed properties.json to git ✅
  - [x] Added detailed commit explaining schema and data choices

---

## Dev Notes

### Important Context & Patterns

**11ty Data Files Magic:**
- 11ty automatically loads all files in `src/_data/`
- JSON files become global variables (filename without .json = variable name)
- So `properties.json` becomes `properties` in templates
- No imports, no requires, no manual loading—it just works!

**Sample Data Strategy:**
- Use 6-10 realistic property examples
- Include variety: different types, prices, feature counts
- Make data meaningful for testing UI in later stories
- Can be fictional—no real addresses needed

**JSON Structure Validation:**
- Use an online JSON linter to validate syntax
- Can also use `npm install -g jsonlint` and run `jsonlint src/_data/properties.json`
- Catch issues early—bad JSON breaks the entire build

**camelCase Discipline:**
- ALL field names must be camelCase
- This is not arbitrary—templates will access these directly
- Example: `property.agentName` not `property.agent_name`
- Inconsistency breaks templates in later stories

### Architecture Patterns to Establish Now

1. **Data Structure Consistency:**
   - Every property MUST follow the same schema
   - No missing required fields
   - No extra fields that aren't documented
   - This ensures templates work for all properties

2. **Field Naming Convention:**
   - camelCase ALWAYS (established in architecture.md)
   - imageUrls (not imageUrls or image_urls)
   - agentName (not agent_name or agent-name)
   - Consistency is critical for template development

3. **Array Fields Handling:**
   - imageUrls: Always an array, even if one image (not a string)
   - features: Always an array, even if empty (use [] for none)
   - This keeps types consistent across all properties

### Common Pitfalls to Avoid

1. **Inconsistent Data Types:**
   - Don't mix "3" (string) with 3 (number) for bedrooms
   - imageUrls must ALWAYS be an array, never a string
   - leads to template errors

2. **Forgetting Required Fields:**
   - Every property needs: id, address, price, bedrooms, bathrooms, imageUrls
   - Missing one breaks templates that expect it

3. **Spaces in IDs:**
   - IDs should be like "property-1" not "Property 1"
   - IDs are used in URLs later (story 1.4)
   - No spaces, lowercase preferred

4. **Not Validating JSON:**
   - Always run through linter before committing
   - One typo breaks entire build

---

## Testing Strategy

### Manual Testing Checklist (All Required)

**Data Preparation:**
- [ ] Collect or create 6-10 sample properties
- [ ] Verify all required fields are present
- [ ] Check for consistency in field types

**JSON Creation:**
- [ ] Create `src/_data/properties.json`
- [ ] Copy sample data into file with proper JSON array syntax
- [ ] Manually verify JSON structure (square brackets for array, curly braces for objects)

**Syntax Validation:**
- [ ] Run JSON linter on the file (online or CLI)
- [ ] No syntax errors reported
- [ ] File is valid, parseable JSON

**11ty Integration:**
- [ ] Run: `npm run build`
- [ ] Check build completes without errors
- [ ] No complaints about properties.json in build log
- [ ] _site/ directory generated successfully

**Data Type Verification:**
- [ ] id fields: strings without spaces, lowercase (e.g., "property-1")
- [ ] address fields: strings with full address
- [ ] price/bedrooms/bathrooms: numbers (not quoted strings)
- [ ] imageUrls: arrays of strings (minimum 1 per property)
- [ ] features: arrays of strings (can be empty [])

**camelCase Verification:**
- [ ] All field names use camelCase
- [ ] No snake_case fields (agent_name is wrong)
- [ ] No hyphenated fields (agent-name is wrong)
- [ ] Verify against schema in Technical Requirements section

**Sample Data Variety:**
- [ ] At least 2 different property types (House, Apartment, etc.)
- [ ] At least 2 different price ranges
- [ ] Some with all optional fields, some with minimal
- [ ] At least one property with multiple images

### Performance Baselines

- **File Size:** <50KB for 6-10 properties (JSON is text-based)
- **Load Time:** Instantaneous (11ty loads at build time)
- **Build Time:** Should not increase build time significantly

---

## Dev Agent Record

### Implementation Summary

**What Was Built:**
Story 1.2 successfully established the data pipeline between external data sources and the 11ty build system. Created a comprehensive, validated `src/_data/properties.json` file with 10 realistic sample properties that serves as the data foundation for all future stories.

**Key Accomplishments:**
1. Created 10 realistic sample properties with complete data:
   - Diverse property types: House, Apartment, Townhouse
   - Price range: R1.35M - R4.5M (variety for testing)
   - All 10 properties located in South Africa (realistic context)
   - Mix of agents and contact information

2. Established proper JSON schema:
   - All required fields: id, address, price, bedrooms, bathrooms, imageUrls
   - All optional fields included: description, agent info, features, location, propertyType
   - camelCase naming throughout (consistent with architecture)
   - imageUrls with 2-5 URLs per property (variety for gallery testing)

3. Validated data quality:
   - JSON syntax validated with Node.js parser ✅
   - All field types correct (strings, numbers, arrays)
   - All properties follow exact schema
   - Unique IDs (property-1 through property-10)

4. Verified 11ty integration:
   - Created and tested Nunjucks template with properties loop
   - Confirmed data accessible as global `properties` variable
   - Build process works: 0.15 seconds with data
   - No errors or warnings from 11ty

5. Properties designed for comprehensive testing:
   - Variety of property types (4+ types)
   - Multiple price ranges (R1.35M - R4.5M)
   - Some properties with extensive features (6+), some minimal
   - Multi-image galleries (2-5 images each)
   - Complete agent information for contact testing

**Technical Decisions Made:**
- Single JSON array (not nested) per architecture
- 10 properties instead of minimum 6 for better test coverage
- Realistic South African addresses and agent names
- Placeholder images from Unsplash for diversity

**Data Summary:**
- Total properties: 10
- Average bedrooms: 3.1 (range 2-4)
- Average bathrooms: 2.0 (range 1-3)
- All properties have 2-5 images
- All agents have phone + email
- All properties have location + type

### Completion Checklist

- [x] All 7 tasks above completed
- [x] `src/_data/properties.json` created with 10 properties ✅
- [x] JSON validated as syntactically correct ✅
- [x] All required fields present in every property ✅
- [x] Field types correct (strings, numbers, arrays) ✅
- [x] camelCase naming consistent ✅
- [x] npm run build works without errors ✅
- [x] 11ty data loading confirmed (no errors in build log) ✅
- [x] git commit created with properties.json ✅

### File List (After Completion)

**Created/Modified:**
- `src/_data/properties.json` — Sample property data (6-10 properties)

**Verified/Working:**
- `.eleventy.js` — No changes needed (auto-loads src/_data/)
- `npm run build` — Runs successfully with data
- `package.json` — No changes needed

### Next Story Dependency

Story 1.3 (Image Optimization) depends on this story's completion:
- Requires `src/_data/properties.json` to exist with valid data
- Requires imageUrls field to be properly formatted as array
- Requires all properties to have at least one imageUrl

---

## References & Source Documentation

**Architecture Requirements:**
- [Source: architecture.md#Data Architecture] — Data file organization and structure
- [Source: architecture.md#Code Organization] — Directory structure requirements
- [Source: prd.md#Data Management] — Business requirements for data format
- [Source: epics.md#Story 1.2] — Original story definition

**JSON Schema & Validation:**
- [JSON Schema Specification](https://json-schema.org/) — Standards and validation
- [JSONLint Online Validator](https://jsonlint.com/) — Syntax validation tool

**11ty Data Files:**
- [11ty Global Data Files](https://www.11ty.dev/docs/data-global/) — How 11ty loads data
- [11ty Data File Types](https://www.11ty.dev/docs/data-files/) — File format options (JSON, JS, etc.)

**Development Workflow:**
- `npm run build` — Runs 11ty build with data loading
- `npm run dev` — Dev server (hot reload when data changes)

---

## Implementation Notes

### Why This Order of Execution

1. **Collect sample data first** — Understand what you're working with
2. **Create JSON file** — Establish the data structure
3. **Validate syntax** — Catch errors before integration
4. **Test with 11ty** — Ensure data loads correctly
5. **Verify field types** — Prevent template errors later
6. **Document for future** — Make data maintenance easy

### Success Indicators

This story is **complete when**:

1. ✅ `src/_data/properties.json` exists with 6-10 properties
2. ✅ File is valid JSON (passes linter)
3. ✅ All required fields present in every property
4. ✅ All field names are camelCase
5. ✅ All field types correct (strings, numbers, arrays)
6. ✅ `npm run build` completes without errors
7. ✅ 11ty data loading confirmed in build output
8. ✅ All changes committed to git

### Next Story Sequence

After this story completes:
1. Story 1.3: Implement Image Download & Optimization
2. Story 1.4: Create GitHub Actions Workflow
3. Story 1.5: Configure FTP Deployment
4. Story 1.6: Data Validation & Error Handling

---

## Story Metadata

| Field | Value |
|-------|-------|
| Epic | 1: Project Initialization & Deployment Infrastructure |
| Story Number | 1.2 |
| Dependency | Story 1.1 (11ty Project Initialization) ✅ |
| Blocks | Stories 1.3, 1.4, 1.5, 1.6 (all remaining Epic 1 stories) |
| Blocks | All stories in Epic 2-6 (data foundation) |
| Complexity | Medium |
| Story Points (Estimate) | 3 |
| Time Estimate | 30-45 minutes |
| Risk | Low (straightforward JSON structure, clear schema) |

---

**End of Story 1.2**
