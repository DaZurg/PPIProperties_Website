# Story 1.6: Implement Data Validation and Deployment Error Handling

**Status:** review

**Epic:** 1 - Project Initialization & Deployment Infrastructure

**Story ID:** 1.6

**Created:** 2026-04-05

**Depends On:** Story 1.5 (GitHub Secrets and FTP Deployment) ✅ Complete

---

## Story Statement

As an admin,
I want to validate property data during the build process and receive clear feedback on whether the deployment succeeded or failed,
So that I can catch data issues early and know the site was successfully deployed.

---

## Acceptance Criteria

### Given the build process reads properties.json

### When the build validates data

### Then the validation checks:
- All required fields (id, address, price, bedrooms, bathrooms, imageUrls) are present
- Field types are correct (price is number, bedrooms/bathrooms are numbers, imageUrls is array)
- At least one imageUrl is present per property
- All properties have unique IDs

### And if validation errors are found, the build fails with a clear error message listing which properties have issues

### And if validation warnings occur (optional fields missing), warnings are logged but build continues

### And the GitHub Actions workflow reports deployment status:
- Success: "Deployment completed successfully at [timestamp]"
- Failure: "Deployment failed: [specific error reason]"
- Status is visible in GitHub Actions logs and workflow summary

### And I can review GitHub Actions logs to understand any build or deployment failures

---

## Developer Context

### Story Purpose & Impact

This story implements the **data validation and error handling layer** that ensures only valid property data builds and deploys. It's critical because:

1. **Catch Data Issues Early:** Invalid data in properties.json fails build before deployment
2. **Clear Error Messages:** Admin knows exactly what's wrong and can fix data immediately
3. **Prevent Bad Deployments:** Invalid data never reaches live site
4. **Operational Confidence:** Admin can trust the deployment pipeline
5. **Debugging Support:** Clear logs in GitHub Actions show what failed and why

**Why This Matters:** Without validation, bad data silently breaks the site. Missing required fields cause rendering errors. Wrong field types cause JavaScript errors. This story prevents silent failures and provides clear feedback.

**Complexity:** Medium. Requires implementing validation logic in build process, proper error handling, and clear error reporting.

---

## Technical Requirements & Guardrails

### Data Validation Rules

**Required Fields (Build Fails if Missing):**

For each property in `src/_data/properties.json`:

1. **id** — Unique identifier (string or number)
   - Type: Must be string or number
   - Rule: Must be unique (no duplicates)
   - Error if: Missing, not string/number, or duplicate

2. **address** — Full street address
   - Type: Must be non-empty string
   - Rule: Minimum 5 characters (realistic address)
   - Error if: Missing, empty, or < 5 chars

3. **price** — Listing price in currency units
   - Type: Must be number (not string)
   - Rule: Must be positive (> 0)
   - Error if: Missing, not a number, or <= 0

4. **bedrooms** — Number of bedrooms
   - Type: Must be integer (whole number)
   - Rule: Must be >= 0 and <= 20 (realistic range)
   - Error if: Missing, not integer, or outside range

5. **bathrooms** — Number of bathrooms
   - Type: Must be integer (whole number)
   - Rule: Must be >= 0 and <= 20 (realistic range)
   - Error if: Missing, not integer, or outside range

6. **imageUrls** — Array of image URLs
   - Type: Must be array of strings
   - Rule: Must have at least 1 URL
   - Error if: Missing, not array, or empty array

**Optional Fields (Warnings Only):**

These fields are optional but recommended:
- `description` — Property description (string)
- `agentName` — Agent name (string)
- `agentEmail` — Agent email (string format)
- `agentPhone` — Agent phone (string)
- `features` — Array of features (array)
- `location` — Location/suburb (string)
- `propertyType` — Type of property (string)

**Warning if Missing:** Log warning if optional fields missing, but continue build

### Validation Implementation

**Validation Script Location:** `scripts/validate-properties.js`

**Script Responsibilities:**

1. Load `src/_data/properties.json`
2. For each property:
   - Check all required fields present
   - Validate field types
   - Validate field values (ranges, formats)
   - Check for duplicate IDs
3. Collect all errors and warnings
4. If errors found: Log errors and throw exception (fail build)
5. If only warnings: Log warnings and return success
6. Return validation report with counts

**Integration Point:** `.eleventy.js` before build starts

```javascript
// In .eleventy.js before build:
import { validateProperties } from './scripts/validate-properties.js';

export default function(eleventyConfig) {
  // Validate data on every build
  eleventyConfig.on('eleventy.before', async () => {
    await validateProperties();
  });

  // ... rest of config
}
```

### Error Reporting Format

**Build Failure Format:**

When validation errors found, fail with clear message:

```
❌ DATA VALIDATION FAILED

Validation errors found in src/_data/properties.json:

Property: property-3
  ✗ Missing required field: address
  ✗ Missing required field: imageUrls

Property: property-5
  ✗ Field type error: price should be number, got string "450000"
  ✗ Field value error: bedrooms must be >= 0, got -1

Duplicate ID found: property-2 (appears 2 times)

Fix the errors above and retry the build.
Build failed. Exit code: 1
```

**Build Success with Warnings Format:**

When validation passes but has warnings:

```
⚠️  DATA VALIDATION WARNINGS

Property: property-1
  ⓘ Missing optional field: agentEmail

Property: property-4
  ⓘ Missing optional field: features

4 properties validated successfully with 2 warnings.
Build continuing...
```

**Build Success Format:**

When all validation passes:

```
✅ DATA VALIDATION PASSED

All 10 properties validated successfully:
  ✓ All required fields present
  ✓ All field types correct
  ✓ All field values in valid ranges
  ✓ No duplicate IDs found

Build proceeding...
```

### Deployment Status Reporting

**GitHub Actions Workflow Status:**

Workflow should report final status clearly:

**Success Message:**
```
✅ DEPLOYMENT COMPLETED SUCCESSFULLY

Build Status: ✅ Success
Deployment Status: ✅ Success
Timestamp: 2026-04-05 14:30:45 UTC
Website: https://your-domain.com

All files deployed to cPanel /public_html/ directory.
Visit your website to verify changes.
```

**Failure Message:**
```
❌ DEPLOYMENT FAILED

Build Status: ✅ Success
Deployment Status: ❌ Failed
Error: FTP connection refused (check credentials)
Timestamp: 2026-04-05 14:35:12 UTC

Review logs above for details.
GitHub Secrets may need to be updated.
```

### Build Failure Scenarios

**Scenario 1: Missing Required Field**
- Error: "Missing required field: {fieldName}"
- Action: Build fails, user fixes data in properties.json, retries
- Example: Property missing "address" field

**Scenario 2: Wrong Field Type**
- Error: "Field type error: {field} should be {type}, got {actualType}"
- Action: Build fails, user changes data type, retries
- Example: price is string "1000" instead of number 1000

**Scenario 3: Invalid Field Value**
- Error: "Field value error: {field} {reason}"
- Action: Build fails, user fixes value, retries
- Example: price is negative or bedrooms is -1

**Scenario 4: Duplicate ID**
- Error: "Duplicate ID found: {id} (appears {count} times)"
- Action: Build fails, user makes IDs unique, retries
- Example: Two properties both have id "property-1"

**Scenario 5: Empty Image Array**
- Error: "Field value error: imageUrls must have at least 1 URL"
- Action: Build fails, user adds image URLs, retries

**Scenario 6: FTP Deployment Fails**
- Error: "❌ Deployment failed: FTP connection timeout"
- Action: Build succeeds but deployment fails, check GitHub Actions logs
- Troubleshooting: Verify FTP credentials in GitHub Secrets

---

## Architecture Compliance

### Core Decisions Relevant to This Story

**Decision 1: Build-Time Data Validation**
- **Choice:** Validate data during build process (before HTML generation)
- **Why:** Catch errors early, prevent broken builds from deploying
- **Affects:** Build process, error handling, CI/CD pipeline
- **Important:** Build fails if critical data errors found

[Source: architecture.md#Data Validation & Error Handling, lines 298-310]

**Decision 2: Fail-Fast on Validation Errors**
- **Choice:** Build immediately fails if required data missing
- **Why:** Prevents partial/broken deployments
- **Affects:** Build reliability, admin confidence
- **Important:** Only warnings allow build to continue

**Decision 3: Clear Error Messages**
- **Choice:** Detailed error messages listing exactly what's wrong
- **Why:** Admin can immediately fix data without guessing
- **Affects:** Developer experience, operational efficiency
- **Important:** Every error includes property ID and field name

**Decision 4: GitHub Actions Workflow Status**
- **Choice:** Workflow reports deployment success/failure in logs
- **Why:** Admin can verify deployment in GitHub Actions tab
- **Affects:** Workflow visibility, debugging capability
- **Important:** Status visible in Actions tab and workflow summary

---

## Previous Story Intelligence

### Story 1.5 Learnings & Dependencies

**What Story 1.5 Established:**
- FTP deployment workflow integrated into GitHub Actions
- Deployment only runs on build success
- Credentials handled via GitHub Secrets
- Status reporting with success/failure messages

**Validation Integration Points:**
- Story 1.6 validation runs BEFORE build (early in `.eleventy.js`)
- If validation fails, build never runs → deployment never runs
- If validation passes, build proceeds → deployment may follow (Story 1.5)

**Build Process Order:**
1. Checkout code
2. Setup Node.js
3. npm ci
4. **Data validation** (NEW in Story 1.6)
5. npm run build (11ty + image optimization)
6. Upload artifact
7. Download artifact
8. Deploy via FTP

**Pattern to Follow:**
- Validation runs early and fast (before expensive image optimization)
- Clear error messages on validation failure
- Continue build even with optional field warnings
- Fail build on required field errors

**Key File to Create:**
- `scripts/validate-properties.js` — Validation logic

**Key File to Modify:**
- `.eleventy.js` — Integrate validation via `eleventy.before` event

---

## Git Intelligence Summary

### Recent Commits & Patterns

**Last 3 commits:**
1. `1f24e25` — Mark Story 1.5 complete
2. `7b827c7` — Implement Story 1.5 deployment
3. `b297222` — Create story 1.5 file

**Script Pattern (from Story 1.3):**
- Scripts located in `scripts/` directory
- Exported as functions: `export async function scriptName()`
- Imported in `.eleventy.js`: `import { scriptName } from './scripts/...`
- Called in `eleventy.before` event: `eleventyConfig.on('eleventy.before', async () => { ... })`

**Error Handling Pattern (from Story 1.3):**
- Warn and continue for non-critical errors (image failures)
- Fail build for critical errors (validation failures)
- Clear error messages with context
- Exit code 1 on failure, 0 on success

**Module Pattern:**
- Use ES6 import/export syntax
- Async functions where needed
- Error thrown as: `throw new Error('message')`
- Caught by 11ty with clear failure message

---

## Latest Technical Information

### Node.js Validation Libraries (2026 Edition)

**No External Library Needed:**
- Validation is simple enough for vanilla JavaScript
- Built-in Object and Array methods sufficient
- No need to add dependencies (keep build simple)

**Validation Approach:**
- Plain JavaScript object iteration
- Type checking with `typeof` and `Array.isArray()`
- Range validation with comparisons
- Error collection in array, then throw on errors

**Example Validation Pattern:**

```javascript
function validateProperty(property, index) {
  const errors = [];

  // Check required fields
  if (!property.id) {
    errors.push('Missing required field: id');
  }

  // Check field types
  if (typeof property.price !== 'number') {
    errors.push(`Field type error: price should be number, got ${typeof property.price}`);
  }

  // Check field values
  if (property.bedrooms < 0 || property.bedrooms > 20) {
    errors.push(`Field value error: bedrooms must be 0-20, got ${property.bedrooms}`);
  }

  return errors;
}
```

---

## Testing Strategy

### Pre-Implementation Testing

**Test Data Scenarios:**

Create test properties to verify validation:

1. **Valid Property** — All fields correct, should pass
2. **Missing Required Field** — No address, should fail
3. **Wrong Type** — price as string, should fail
4. **Invalid Value** — bedrooms = -1, should fail
5. **Duplicate ID** — Two properties with same id, should fail
6. **Missing Optional Field** — No agentEmail, should warn only

### Validation Testing Steps

**Test 1: Valid Data**
1. Verify current `src/_data/properties.json` has valid data
2. Run `npm run build`
3. Should see: "✅ DATA VALIDATION PASSED"
4. Build should complete successfully

**Test 2: Invalid Data (Missing Field)**
1. Edit property in `src/_data/properties.json`
2. Remove "address" field from one property
3. Run `npm run build`
4. Should see: "❌ DATA VALIDATION FAILED"
5. Error message should show: "Missing required field: address"
6. Build should fail
7. Undo change and rebuild to verify it passes

**Test 3: Invalid Data (Wrong Type)**
1. Edit property: change price from number to string: `"price": "1000000"`
2. Run `npm run build`
3. Should see validation error about price type
4. Build should fail
5. Undo change and rebuild

**Test 4: Invalid Data (Duplicate ID)**
1. Make two properties have same id
2. Run `npm run build`
3. Should see: "Duplicate ID found"
4. Build should fail
5. Undo change and rebuild

**Test 5: Optional Field Warning**
1. Remove optional field like "agentEmail" from one property
2. Run `npm run build`
3. Should see warning about missing optional field
4. Should continue build successfully
5. Build should complete (not fail)

### GitHub Actions Testing

**Test 6: Workflow Validation**
1. Commit validation script to main branch
2. Push to GitHub
3. Watch workflow in Actions tab
4. Workflow should:
   - Build successfully
   - Show validation output in logs
   - Deploy successfully (if Story 1.5 secrets configured)

---

## Implementation Checklist

### Pre-Implementation Setup
- [ ] Story 1.5 (FTP deployment) is complete and committed
- [ ] Current `src/_data/properties.json` contains valid test data (10 properties)
- [ ] `.eleventy.js` file exists and is readable
- [ ] `scripts/` directory exists (from Story 1.3)

### Validation Script Creation
- [ ] Create `scripts/validate-properties.js` file
- [ ] Implement `validateProperties()` function
- [ ] Check all required fields for each property
- [ ] Validate field types (string, number, array, etc.)
- [ ] Validate field values (ranges, formats)
- [ ] Check for duplicate IDs
- [ ] Collect errors and warnings separately
- [ ] Throw error if validation errors found
- [ ] Log warnings if optional fields missing
- [ ] Return validation report with counts

### Integration with Build Process
- [ ] Import validate function in `.eleventy.js`
- [ ] Add validation to `eleventy.before` event
- [ ] Validation runs before build starts
- [ ] Error messages clear and actionable

### Error Message Implementation
- [ ] Format error output with clear structure
- [ ] Include property ID in each error
- [ ] Include field name and expected type
- [ ] Provide suggestions for fixing errors
- [ ] Show count of validated properties

### Testing
- [ ] Test with valid data (build should succeed)
- [ ] Test with missing required field (build should fail)
- [ ] Test with wrong field type (build should fail)
- [ ] Test with invalid field value (build should fail)
- [ ] Test with duplicate IDs (build should fail)
- [ ] Test with missing optional field (build should warn but continue)
- [ ] Verify error messages are clear and helpful

### Deployment Status Reporting
- [ ] Update workflow final step to report deployment status
- [ ] Include success message with timestamp
- [ ] Include failure message with error details
- [ ] Status visible in GitHub Actions logs

### Documentation & Handoff
- [ ] Document validation rules in code comments
- [ ] Document how to read error messages
- [ ] Document what causes each error type
- [ ] Document how to fix validation errors
- [ ] Add comments explaining validation logic

---

## Story Completion Status

**Acceptance Criteria Status:**
- [x] Validation script created and integrated
- [x] All required fields validated
- [x] Field types validated correctly
- [x] Field values validated within ranges
- [x] Duplicate IDs detected
- [x] Build fails on validation errors
- [x] Build continues with optional field warnings
- [x] Error messages are clear and actionable
- [x] Workflow reports deployment status

**Implementation Summary:**
- ✅ Created `scripts/validate-properties.js` with comprehensive validation logic
- ✅ Validates required fields: id, address, price, bedrooms, bathrooms, imageUrls
- ✅ Validates field types (string, number, integer, array)
- ✅ Validates field values (ranges: bedrooms/bathrooms 0-20, price > 0, address > 5 chars)
- ✅ Detects duplicate IDs across all properties
- ✅ Checks for optional fields (description, agentName, agentEmail, agentPhone, features, location, propertyType)
- ✅ Integrated into `.eleventy.js` via `eleventy.before` event (runs before build)
- ✅ Clear error messages with property ID and field name
- ✅ Warnings for missing optional fields (build continues)
- ✅ Updated `.github/workflows/build.yml` with comprehensive deployment status reporting
- ✅ Success and failure messages with timestamps
- ✅ All acceptance criteria implemented
- ✅ Committed to main branch: 3 commits (validation script, workflow update, status updates)

**Definition of Done:**
This story is complete when:
1. `scripts/validate-properties.js` created with complete validation logic
2. Validation integrated into `.eleventy.js`
3. All acceptance criteria tested and passing
4. Error messages tested with various failure scenarios
5. Workflow deployment status reporting implemented
6. Story marked as review status

**Epic 1 Complete:** All 6 stories finished (initialization, data pipeline, image optimization, CI/CD, deployment, validation)

---

## Developer Notes

### Validation Rule Priority

**Critical (Build Fails):**
1. Required field missing
2. Field type wrong
3. Field value invalid (out of range)
4. Duplicate IDs

**Non-Critical (Warnings Only):**
1. Optional field missing

### Common Pitfalls & How to Avoid Them

**Pitfall 1: Validation Too Strict**
- Wrong: Fail on missing optional fields
- Right: Warn only, continue build
- Why: Optional fields should not block build
- Prevention: Separate errors from warnings

**Pitfall 2: Unclear Error Messages**
- Wrong: "Error in property"
- Right: "Property: property-3, Missing required field: address"
- Why: Admin can't fix error without specific info
- Prevention: Include property ID and field name in every error

**Pitfall 3: Validation Not Running**
- Wrong: Place validation after build
- Right: Place validation before build in `eleventy.before`
- Why: Should catch errors early, not after expensive build
- Prevention: Use `eleventy.before` event

**Pitfall 4: No Recovery Option**
- Wrong: Just fail with error
- Right: Fail with error AND instructions to fix
- Why: Admin doesn't know how to recover
- Prevention: Include "how to fix" in error messages

**Pitfall 5: Silent Failures**
- Wrong: Log validation warnings but don't show them
- Right: Print warnings clearly to console
- Why: Admin never sees warnings if not visible
- Prevention: Use `console.warn()` for warnings

---

## Related Documentation

- **Epic 1 Context:** Project Initialization & Deployment Infrastructure
- **Story 1.5 Reference:** Deployment workflow and GitHub Actions
- **Story 1.3 Reference:** Image optimization script pattern
- **Architecture:** Data validation requirements and error handling

**Data Format References:**
- [Property data schema from Story 1.2](../implementation-artifacts/1-2-set-up-excel-json-data-pipeline.md)
- [11ty data loading documentation](https://www.11ty.dev/docs/data-files/)

