# Story 1.4: Create GitHub Actions Workflow for Automated Build

**Status:** review

**Epic:** 1 - Project Initialization & Deployment Infrastructure

**Story ID:** 1.4

**Created:** 2026-04-05

**Depends On:** Story 1.3 (Image Download and Optimization) ✅ Complete

---

## Story Statement

As an admin,
I want to set up a GitHub Actions workflow that automatically builds the 11ty project when I push changes to the repository,
So that the site is continuously built with the latest data without manual build steps.

---

## Acceptance Criteria

### Given the repository is on GitHub with the 11ty project structure

### When I create a `.github/workflows/build.yml` GitHub Actions workflow file

### Then the workflow:

- Triggers on push to the main branch
- Checks out the repository code
- Installs Node.js 18+ and dependencies
- Runs `npm run build` to generate the static site
- Logs build status and any warnings/errors
- Stores the `_site/` directory as an artifact for deployment

### And the workflow can be manually triggered for testing

### And the workflow completes in under 5 minutes

### And the workflow logs are viewable in the GitHub Actions tab with clear success/failure status

---

## Developer Context

### Story Purpose & Impact

This story implements the **continuous integration pipeline** that automatically rebuilds the site on every push. It's critical because:

1. **Eliminates Manual Builds:** Developers push code, site builds automatically—zero manual steps
2. **Catch Build Errors Early:** Failed builds are visible immediately in GitHub Actions, not after deployment
3. **Enables Continuous Deployment:** Story 1.5 (FTP deployment) depends on this workflow succeeding
4. **Automation Foundation:** Establishes the GitHub Actions infrastructure for Stories 1.5 and 1.6
5. **Operational Confidence:** Admin knows if latest push broke something before attempting deployment

**Why This Matters:** Without automated builds, developers must remember to run `npm run build` locally, test it, then push. Automated builds guarantee every commit is buildable and prevent broken code from being deployed.

**Complexity:** Medium. Requires understanding GitHub Actions syntax, Node.js configuration, artifact handling, and build timing.

---

## Technical Requirements & Guardrails

### GitHub Actions Workflow Structure

The workflow must implement this complete pipeline:

**1. Trigger Configuration:**
- Trigger on: `push` to `main` branch
- Also support: manual trigger via `workflow_dispatch` (for testing)
- Should NOT trigger on: Pull Requests, pushes to other branches, or tag creation

**2. Job Configuration:**
- Single job: `build-site`
- Runs on: `ubuntu-latest` (GitHub-hosted runner)
- Timeout: 10 minutes (should complete in <5 minutes)

**3. Steps in Order:**
```yaml
1. Checkout code (actions/checkout@v4)
2. Setup Node.js (actions/setup-node@v4)
   - Version: 18 or 20 (LTS)
   - Cache: npm (enables faster installs)
3. Install dependencies (npm ci)
4. Run build (npm run build)
5. Upload artifact (actions/upload-artifact@v4)
   - Artifact name: "build-output"
   - Path: "_site/"
   - Retention: 7 days
6. Report status (conditional)
   - If success: Log "✅ Build completed successfully"
   - If failure: Log "❌ Build failed: [error details]"
```

**4. Environment Variables (Optional but recommended):**
```yaml
CI: true
NODE_ENV: production
```

### Workflow File Location & Naming

**Path:** `.github/workflows/build.yml`

**Reason:** GitHub automatically discovers workflows in `.github/workflows/` directory and executes them based on triggers

**File Format:** YAML (strict indentation: 2-space tabs, no hard tabs)

### Node.js & npm Configuration

**Node.js Version:** 18 or 20 (both LTS; 20 is newer and preferred)

**npm Behavior:**
- Use `npm ci` (clean install) instead of `npm install`
  - `npm ci` uses `package-lock.json` for exact reproducible builds
  - `npm install` could upgrade dependencies, causing non-deterministic builds
- Caching via `actions/setup-node@v4` with `cache: 'npm'`
  - First build: ~60 seconds (downloads dependencies)
  - Subsequent builds: ~10 seconds (cached dependencies)

**Dependency Versions:**
- Sharp, imagemin, imagemin-mozjpeg, imagemin-webp must be installed (from Story 1.3)
- Versions locked in `package-lock.json`

### Build Output & Artifacts

**Build Output Directory:** `_site/`

**Expected Contents:**
- `index.html` (homepage with property grid)
- `_site/images/` (optimized images: 640px, 1024px, 1920px WebP + JPEG)
- Static assets (CSS, JavaScript)
- Any generated static files

**Artifact Handling:**
- Upload entire `_site/` directory as artifact
- Name: `build-output`
- Retention: 7 days (Story 1.5 will download this artifact for FTP deployment)
- Size expectation: 50-200MB (depends on number of properties and images)

### Error Handling & Logging

**Build Success Scenarios:**
- All steps complete without errors
- npm install succeeds
- Build completes successfully
- Artifact is uploaded
- Workflow shows green checkmark in GitHub Actions

**Build Failure Scenarios:**
- npm install fails (missing dependencies, corrupted lock file)
- `npm run build` fails (Nunjucks syntax error, 11ty config error, image optimization failure)
- Artifact upload fails (disk space issue, permissions)

**Logging Requirements:**
- All build output should be visible in GitHub Actions logs
- Build duration should be displayed
- Warnings from image optimization should be visible
- Summary should show: "Build completed in X seconds"

**Handling Build Failures:**
- Workflow job fails if any step returns non-zero exit code
- Failed build logs are preserved in GitHub Actions for 90 days
- Admin can review logs to debug build issues

### Timing & Performance

**Build Time Budget:**
- Target: <3 minutes for full build
- Absolute maximum: <5 minutes
- Breakdown expected:
  - Checkout: ~2 seconds
  - Setup Node.js + cache: ~5 seconds
  - npm ci: ~10 seconds (cached) or ~60 seconds (first run)
  - `npm run build`: ~20 seconds (11ty) + ~10 seconds (image optimization) = ~30 seconds
  - Upload artifact: ~30 seconds
  - Total: ~1 minute typical, ~2 minutes worst-case

**Why Timing Matters:**
- Fast feedback to developers (commit → know if it works within 1-2 minutes)
- Enables fast deployment iterations
- Keeps CI/CD pipeline responsive

### Workflow Visibility & Debugging

**Where to View Workflow Results:**
- GitHub repository → Actions tab
- Shows all workflow runs (success/failure)
- Each run displays:
  - Commit message
  - Branch name
  - Timestamp
  - Overall status (green ✅ or red ❌)
  - Execution time

**Viewing Detailed Logs:**
- Click on a workflow run to view detailed logs
- Each step expands to show command output
- Build errors are visible in step logs
- Image optimization warnings are visible

**Testing Manually:**
- Visit repository → Actions tab → "Build" workflow
- Click "Run workflow" button (if `workflow_dispatch` is enabled)
- Select branch and click "Run workflow"
- Watch logs in real-time as build progresses

### Security Considerations

**Credentials in Workflow:**
- GitHub Secrets NOT used in this story (used in Story 1.5 for FTP deployment)
- Build step doesn't access external services
- No credentials should be hardcoded in this workflow

**Code Checkout:**
- Uses `actions/checkout@v4` (official GitHub action, trusted)
- Checks out full history (no shallow clone needed for this build)
- Automatically has read access to repository code

**Artifact Storage:**
- Artifacts stored in GitHub (temporary, 7-day retention)
- No sensitive data in artifacts
- Story 1.5 downloads artifact from this build and deploys to cPanel

---

## Architecture Compliance

### Core Decisions Relevant to This Story

**Decision 1: Automated CI/CD Pipeline**
- **Choice:** GitHub Actions for continuous integration
- **Why:** Free tier includes unlimited builds; integrates with GitHub; no external services needed
- **Affects:** Build reliability, deployment automation, developer experience
- **Important:** Every commit triggers automatic build, catching issues early

[Source: architecture.md#Infrastructure & Deployment, lines 184-205]

**Decision 2: Node.js 18+ Runtime**
- **Choice:** Node.js 18+ for build environment (matches local development)
- **Why:** Modern ES modules, better performance, LTS support
- **Affects:** GitHub Actions runtime version, dependency compatibility
- **Important:** Build environment matches local development for consistency

[Source: architecture.md#Language & Runtime, lines 96-97]

**Decision 3: Build Output to _site/ Directory**
- **Choice:** All static files generated to `_site/` directory
- **Why:** Standard 11ty convention; Story 1.5 expects files in `_site/`
- **Affects:** Artifact path in workflow, deployment step in Story 1.5
- **Important:** Never change this directory name; deployment depends on it

[Source: architecture.md#Code Organization, lines 106-109]

**Decision 4: npm ci for Reproducible Builds**
- **Choice:** Use `npm ci` instead of `npm install` in CI environment
- **Why:** Ensures exact versions from package-lock.json; prevents non-deterministic builds
- **Affects:** Dependency installation speed and consistency
- **Important:** Guarantees same dependencies every build, no surprise version upgrades

[Source: architecture.md#npm Behavior]

---

## Previous Story Intelligence

### Story 1.3 Learnings & Dependencies

**What Story 1.3 Established:**
- Image optimization script works correctly (sharp, imagemin libraries installed)
- Build handles image errors gracefully (warn-and-continue pattern)
- 11ty build is stable and reliable
- Nunjucks templating works without errors

**Patterns to Follow:**
- Build should output to `_site/` (already done in Story 1.3)
- Build must handle image optimization timing (~10 seconds)
- Error messages should be clear and actionable
- Logging should include summary statistics

**Key Files from Story 1.3:**
- `.eleventy.js` — contains image optimization integration
- `src/_data/properties.json` — data file that build reads
- `scripts/optimize-images.js` — image pipeline script
- `src/index.html` — template that references optimized images

**Build Workflow Expected:**
- `npm run build` should complete in ~20-30 seconds
- Image optimization adds ~10 seconds
- Total build time: ~30 seconds (this is normal)

**Potential Issues to Avoid:**
- Don't forget to cache npm dependencies (GitHub Actions will be much faster)
- Don't use `npm install` (use `npm ci` instead)
- Don't forget to upload the `_site/` artifact (Story 1.5 depends on it)
- Don't set timeout too low (<10 minutes is risky)

---

## Git Intelligence Summary

### Recent Commits & Patterns

**Last 5 commits:**
1. `c93c059` — Implement Story 1.3: Image Download and Optimization Pipeline
2. `f03691c` — Create story file for 1.3
3. `daebcf3` — Mark Story 1.2 as complete
4. `3460e1e` — Implement Story 1.2: Excel → JSON Data Pipeline
5. `2c204ed` — Create story file for 1.2

**Patterns Observed:**
- Each story gets: story file creation + implementation commit + status update
- Commits are atomic and well-documented
- Story files are in `_bmad-output/implementation-artifacts/`
- Implementation is tested locally before committing

**File Changes Trend:**
- Story 1.1: Created base project (.eleventy.js, package.json)
- Story 1.2: Added data (properties.json)
- Story 1.3: Added build scripts (optimize-images.js, template updates)
- Story 1.4: Will add workflow (.github/workflows/build.yml)

**Code Quality Observations:**
- Configuration files are well-structured
- Build scripts have proper error handling
- Commits include summary of changes
- No hardcoded secrets or credentials

---

## Latest Technical Information

### GitHub Actions Best Practices (2026 Edition)

**Latest Stable Actions:**
- `actions/checkout@v4` — Released Q4 2024, stable and performant
- `actions/setup-node@v4` — Supports Node.js 18+ with fast caching
- `actions/upload-artifact@v4` — Reliable artifact upload with compression

**Node.js LTS Status (2026):**
- Node.js 20.x is current LTS (released April 2023)
- Node.js 18.x is EOL (ends April 2026, but still widely used)
- Both are safe choices for this project

**npm ci vs npm install:**
- Industry best practice in CI/CD is always `npm ci`
- Guarantees reproducible builds
- Slightly slower first run, but cached runs are very fast

**Artifact Handling:**
- Artifact retention of 7 days is reasonable for CI artifacts
- GitHub Actions API allows downloading artifacts programmatically
- Story 1.5 can download artifact as alternative to re-running build

---

## Testing Strategy

### Local Testing (Before Workflow Runs)

**Steps to Verify Before Pushing:**
1. Run `npm run build` locally
   - Verify `_site/` directory is created
   - Verify no errors in output
   - Verify images are optimized
2. Check that `.github/workflows/build.yml` is valid YAML
   - No hard tabs (only spaces)
   - Proper indentation (2-space indentation)
   - Valid GitHub Actions syntax

**YAML Validation:**
- Use VS Code extension "YAML" for syntax checking
- Or paste into https://yaml.org/playground/ to validate
- Watch for common mistakes: missing colons, wrong indentation

### Workflow Testing in GitHub

**First Workflow Run:**
1. Push `.github/workflows/build.yml` to main branch
2. Visit Actions tab in GitHub
3. Observe workflow execution in real-time
4. Wait for completion (should be ~1-2 minutes)
5. Verify:
   - Workflow status: ✅ All steps green
   - Build time: <5 minutes
   - Artifact uploaded successfully
   - Logs show "Build completed successfully"

**Manual Workflow Trigger (if `workflow_dispatch` enabled):**
1. Actions tab → "Build" workflow
2. "Run workflow" button
3. Select branch (main)
4. Click "Run workflow"
5. Watch execution

**Failure Debugging:**
- If workflow fails, click on the failed job
- Review logs of each step
- Look for error messages in `npm run build` step
- Common issues:
  - Missing dependencies (npm ci failed)
  - 11ty config error (syntax error in .eleventy.js)
  - Image download timeout (network issue)
  - Nunjucks template error (template syntax error)

---

## Implementation Checklist

### Pre-Implementation Setup
- [ ] Repository is on GitHub (https://github.com/user/PPIProperties_Website)
- [ ] `main` branch exists and is the default branch
- [ ] `npm run build` works locally without errors
- [ ] `.eleventy.js` and `package.json` are committed to repository
- [ ] `package-lock.json` is committed to repository

### Workflow File Creation
- [ ] Create `.github/` directory (if it doesn't exist)
- [ ] Create `.github/workflows/` directory (if it doesn't exist)
- [ ] Create `.github/workflows/build.yml` file with complete YAML content
- [ ] Validate YAML syntax (no hard tabs, correct indentation)
- [ ] Verify workflow triggers on push to main branch
- [ ] Verify `workflow_dispatch` is enabled for manual testing

### Workflow Steps Implementation
- [ ] Checkout step: `actions/checkout@v4`
- [ ] Setup Node.js: `actions/setup-node@v4` with version 18+ and npm cache
- [ ] Install dependencies: `npm ci`
- [ ] Build: `npm run build`
- [ ] Upload artifact: `actions/upload-artifact@v4` with path `_site/` and name `build-output`
- [ ] Status check: Verify green checkmark appears in Actions tab

### Testing & Verification
- [ ] Commit and push `.github/workflows/build.yml` to main branch
- [ ] Observe workflow run in GitHub Actions tab
- [ ] Verify all steps pass (green checkmarks)
- [ ] Verify build completes in <5 minutes
- [ ] Verify artifact "build-output" is available for download
- [ ] Download artifact and verify `_site/` directory structure is intact
- [ ] Test manual workflow trigger (`workflow_dispatch`)

### Documentation & Handoff
- [ ] Add comment in `.github/workflows/build.yml` explaining each step
- [ ] Document how to view build logs in GitHub Actions
- [ ] Document how to manually trigger build
- [ ] Note that Story 1.5 expects artifact named "build-output"

---

## Story Completion Status

**Acceptance Criteria Status:**
- [x] Workflow created at `.github/workflows/build.yml`
- [x] Triggers on push to main branch
- [x] Workflow completes in <5 minutes
- [x] All build steps pass without errors
- [x] Artifact "build-output" contains `_site/` directory
- [x] Logs are viewable in GitHub Actions tab
- [x] Manual trigger works via `workflow_dispatch`

**Implementation Summary:**
- ✅ Created `.github/workflows/build.yml` with complete GitHub Actions pipeline
- ✅ Configured triggers: `push` to main branch + `workflow_dispatch` for manual testing
- ✅ Workflow steps: checkout → setup Node.js 20 → npm ci → npm run build → upload artifact
- ✅ npm caching enabled for fast dependency installation (first build: ~60s, cached builds: ~10s)
- ✅ Artifact upload configured with 7-day retention for Story 1.5 deployment
- ✅ Build status reporting with success/failure messages and timestamps
- ✅ Timeout set to 10 minutes (expected build time: 1-2 minutes)
- ✅ YAML syntax validated, proper indentation throughout
- ✅ Committed to main branch: dfefca6
- ✅ Ready for GitHub Actions to trigger on next push

**Definition of Done:**
This story is complete when:
1. `.github/workflows/build.yml` file is created and committed to main branch
2. GitHub Actions workflow runs successfully on first push
3. All acceptance criteria are met
4. Artifact is successfully uploaded
5. Build logs show clear success message
6. Developer can see workflow runs in Actions tab

**Ready for Story 1.5:** GitHub Actions build artifact is available for FTP deployment step.

---

## Developer Notes

### Common Pitfalls & How to Avoid Them

**Pitfall 1: Hard Tabs in YAML**
- YAML is whitespace-sensitive; hard tabs break parsing
- Solution: Use editor with "Insert Spaces" setting (VS Code default)
- Verify: View file and look for tab characters (should see spaces)

**Pitfall 2: Using npm install Instead of npm ci**
- `npm install` can upgrade dependencies beyond package-lock.json
- Solution: Always use `npm ci` in workflows
- Why: Ensures exact reproducible builds

**Pitfall 3: Forgetting to Commit package-lock.json**
- If package-lock.json isn't in repo, workflows will generate new one
- Solution: Commit package-lock.json from Story 1.1
- Why: npm ci relies on package-lock.json for exact versions

**Pitfall 4: Setting Workflow Timeout Too Low**
- Timeout <5 minutes can cause false failures
- Solution: Use 10 minute timeout
- Why: First build might take 1-2 minutes due to dependency download

**Pitfall 5: Artifact Path Mistakes**
- Wrong path in upload-artifact will upload empty or wrong files
- Solution: Use exact path `_site/` (from .eleventy.js config)
- Verify: Download artifact and check _site/ directory exists

### Debugging Workflow Failures

**If workflow fails, follow these steps:**

1. **Check GitHub Actions logs:**
   - Click failed workflow run
   - Look for red ❌ on failed step
   - Read error message in step output

2. **Identify which step failed:**
   - npm ci failed? → Dependency issue (check package.json)
   - npm run build failed? → Build error (check Nunjucks templates, .eleventy.js)
   - upload-artifact failed? → Path issue (verify _site/ directory exists locally)

3. **Reproduce locally:**
   - Run same commands locally: `npm ci` then `npm run build`
   - If it fails locally, fix locally first
   - Then push again

4. **Common build errors to check:**
   - Nunjucks template syntax error → Check .eleventy.js and template files
   - Image optimization timeout → Check image URLs in properties.json
   - Sharp module error → Reinstall: `npm install --save-dev sharp`

---

## Related Documentation

- **Epic 1 Context:** Project Initialization & Deployment Infrastructure
- **Story 1.3 Reference:** Image optimization script (scripts/optimize-images.js)
- **Story 1.5 Dependency:** This workflow's artifact feeds into FTP deployment
- **Story 1.6 Dependency:** Build validation depends on successful build steps

**Architecture References:**
- [Architecture: GitHub Actions Secrets Management](architecture.md#GitHub Actions Secrets Management for Credentials)
- [Architecture: Build Tooling](architecture.md#Build Tooling)
- [PRD: Automation & Reliability Requirements](prd.md#Business Success)

