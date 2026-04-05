# Story 1.5: Configure GitHub Secrets and FTP Deployment

**Status:** ready-for-dev

**Epic:** 1 - Project Initialization & Deployment Infrastructure

**Story ID:** 1.5

**Created:** 2026-04-05

**Depends On:** Story 1.4 (GitHub Actions Workflow for Automated Build) ✅ Complete

---

## Story Statement

As an admin,
I want to securely store FTP credentials in GitHub Secrets and deploy the built site to cPanel hosting via FTP,
So that the website is automatically deployed to live hosting after each build without exposing credentials.

---

## Acceptance Criteria

### Given I have cPanel FTP credentials (hostname, username, password)

### When I configure GitHub Secrets in the repository settings (Settings → Secrets and variables → Actions)

### Then I can store:
- `FTP_HOST` (cPanel hostname)
- `FTP_USERNAME` (FTP login username)
- `FTP_PASSWORD` (FTP login password)

### And I update the GitHub Actions workflow to include a deployment step that:
- Reads FTP credentials from GitHub Secrets using `${{ secrets.FTP_HOST }}` etc.
- Connects to cPanel via FTP using the provided credentials
- Uploads the contents of `_site/` directory to the appropriate public_html directory
- Credentials are never exposed in logs or code

### And the FTP deployment step only runs if the build succeeds

### And I can verify that files are deployed to the live server after the workflow completes

---

## Developer Context

### Story Purpose & Impact

This story implements the **secure FTP deployment pipeline** that automatically uploads the built site to cPanel hosting. It's critical because:

1. **Secure Credential Management:** FTP credentials stored encrypted in GitHub Secrets, never exposed in code or logs
2. **Automated Deployment:** Admin pushes code → build runs → site deploys automatically, zero manual upload steps
3. **Deployment Verification:** Admin can verify files are deployed by checking cPanel or visiting live site
4. **Complete CI/CD Pipeline:** Completes the automated pipeline from data → build → deployment
5. **Operational Reliability:** Failed deployments visible in GitHub Actions logs for debugging

**Why This Matters:** Without automated FTP deployment, admin must manually download build artifacts and upload to cPanel via FTP client. This is error-prone, time-consuming, and breaks the automation promise. This story completes the full automated workflow.

**Complexity:** Medium-High. Requires understanding GitHub Secrets security, FTP protocol, cPanel hosting structure, and deployment verification.

---

## Technical Requirements & Guardrails

### GitHub Secrets Configuration

**Secrets to Store:**

Three secrets must be configured in GitHub repository settings:

1. **FTP_HOST**
   - Value: cPanel FTP hostname (e.g., `ftp.example.com` or `example.com`)
   - Where to find: cPanel Welcome Email or Account Information
   - Do NOT include `ftp://` prefix or port number (just hostname)

2. **FTP_USERNAME**
   - Value: FTP login username (e.g., `cpanelusername` or `user@example.com`)
   - Where to find: cPanel FTP Accounts or Welcome Email
   - Note: Often same as cPanel username, but verify in FTP Accounts section

3. **FTP_PASSWORD**
   - Value: FTP login password (e.g., `SecurePassword123!`)
   - Where to find: Set when creating FTP account or reset in cPanel
   - Security: GitHub stores encrypted; never visible in logs or code

**How to Add Secrets in GitHub:**

1. Go to repository on GitHub.com
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. For each secret:
   - Name: `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD` (exact names)
   - Value: Paste the credential value
   - Click "Add secret"
5. Repeat for all 3 secrets

**Verification:**
- Visit Settings → Secrets and variables → Actions
- Should see 3 secrets listed: FTP_HOST, FTP_USERNAME, FTP_PASSWORD
- Secret values are hidden (replaced with dots)
- Can be updated anytime by editing

### FTP Deployment Step in Workflow

**Updated Workflow File:** `.github/workflows/build.yml`

**New Deployment Step (after build succeeds):**

```yaml
- name: Download build artifact
  uses: actions/download-artifact@v4
  with:
    name: build-output
    path: ./build

- name: Deploy to cPanel via FTP
  if: success()
  env:
    FTP_HOST: ${{ secrets.FTP_HOST }}
    FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
    FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
  run: |
    apt-get update && apt-get install -y lftp
    lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -e "mirror -R ./build/public_html /public_html; quit" "$FTP_HOST"
```

**Step Breakdown:**

1. **Download Artifact:** Retrieves `_site/` directory from previous build job
2. **Set Environment Variables:** Reads FTP credentials from GitHub Secrets
3. **Install FTP Client:** Uses `lftp` (secure, reliable FTP client)
4. **Execute Deployment:**
   - Mirrors (copies) all files from `./build/_site/` to `/public_html` on cPanel
   - Recursive upload (`-R` flag)
   - Automatically creates directories as needed
   - Overwrites existing files

**Why lftp Instead of Other Tools:**
- Built-in to Ubuntu (GitHub Actions default runner OS)
- Supports SSL/TLS encryption (more secure than plain FTP)
- Simple syntax: `mirror -R` (bidirectional sync)
- Handles large uploads reliably
- No additional dependencies needed

### cPanel Directory Structure

**Target Directory:** `/public_html/`

**Why this location:**
- cPanel default web root directory
- All files in `/public_html/` are publicly accessible via HTTP/HTTPS
- FTP user's home directory is usually `/home/cpanelusername/`
- So FTP path is: `/public_html/` or `~/public_html/`

**Expected After Deployment:**
```
/public_html/
├── index.html          (homepage)
├── images/             (optimized property images)
│   ├── property-1-640.jpg
│   ├── property-1-640.webp
│   ├── property-1-1024.jpg
│   └── ...
├── _site/              (may be nested or flattened)
└── ... other static files
```

**Note:** Exact structure depends on how FTP upload handles paths. `lftp mirror` will recreate directory structure exactly as it exists locally.

### Security Considerations

**Credential Exposure Prevention:**

1. **GitHub Secrets Encryption:**
   - Values encrypted at rest in GitHub
   - Only decrypted when workflow runs
   - Never printed in logs (GitHub auto-masks secrets)

2. **Workflow Logging:**
   - FTP commands should NOT echo credentials
   - Use `${{ secrets.FTP_PASSWORD }}` syntax (auto-masked in logs)
   - Never use `echo` or `print` statements with credential values

3. **Code Safety:**
   - Credentials NEVER hardcoded in `.github/workflows/build.yml`
   - Always reference via `${{ secrets.SECRET_NAME }}`
   - No temporary credential files created

4. **Best Practices:**
   - Change FTP password periodically
   - If credential exposed, delete secret and update FTP password in cPanel
   - GitHub retains secret change history (can audit)

### Deployment Verification

**How to Verify Deployment Succeeded:**

1. **Check GitHub Actions Logs:**
   - Go to Actions tab in repository
   - Find latest workflow run
   - Look for "Deploy to cPanel via FTP" step
   - Should show: "Mirror finished"
   - Should NOT show error messages

2. **Visit Live Website:**
   - Open `http://your-domain.com` in browser
   - Should show latest version of site
   - Check timestamp or content to confirm fresh deployment

3. **Check cPanel File Manager:**
   - Log into cPanel
   - File Manager → public_html
   - Verify latest files are present
   - Check file modification timestamps (should be recent)

4. **Command Line Verification (Optional):**
   - Connect to cPanel via FTP manually
   - List files: `ls -la public_html/`
   - Verify `_site/` contents are present
   - Check timestamps

**What to Check:**
- index.html exists and was recently modified
- images/ directory has optimized images
- No errors in GitHub Actions logs
- Website renders correctly in browser

### Error Handling & Debugging

**Common Deployment Failures:**

**Failure 1: FTP Authentication Error**
- Error: "Login failed"
- Cause: Wrong username or password
- Fix:
  1. Verify FTP credentials in cPanel (FTP Accounts section)
  2. Update GitHub Secrets with correct values
  3. Re-run workflow

**Failure 2: Directory Not Found**
- Error: "Cannot create remote directory"
- Cause: FTP user doesn't have permission to `/public_html/`
- Fix:
  1. Check FTP user home directory in cPanel
  2. Ensure `/public_html/` exists and FTP user has write access
  3. Create directory in cPanel if missing

**Failure 3: Connection Timeout**
- Error: "Connection timeout" or "Cannot connect to host"
- Cause: FTP hostname wrong or cPanel FTP service down
- Fix:
  1. Verify FTP_HOST value in GitHub Secrets
  2. Test FTP connection locally with FTP client
  3. Check cPanel FTP service status

**Failure 4: Mirror Command Issues**
- Error: "Mirror not supported" or mirror-related errors
- Cause: lftp not installed or version issue
- Fix:
  1. Verify `apt-get install lftp` succeeds
  2. Use alternative FTP command if needed

**Debugging Steps:**

If deployment fails:

1. **Review GitHub Actions Logs:**
   - Click failed workflow run
   - Expand "Deploy to cPanel via FTP" step
   - Read error message (usually very clear)

2. **Test Credentials Locally:**
   - Install lftp locally: `apt-get install lftp` (Ubuntu) or `brew install lftp` (Mac)
   - Test connection: `lftp -u username,password ftp.example.com`
   - List files: `ls`
   - Verify you can access `/public_html/`

3. **Check cPanel:**
   - Log into cPanel
   - FTP Accounts → verify account exists and is enabled
   - File Manager → verify `/public_html/` exists
   - Check user permissions

4. **Fix and Retry:**
   - Update GitHub Secrets if credentials wrong
   - Fix FTP account or permissions in cPanel
   - Push new commit to trigger workflow again

---

## Architecture Compliance

### Core Decisions Relevant to This Story

**Decision 1: GitHub Secrets for Credential Management**
- **Choice:** Use GitHub Secrets (encrypted repository secrets)
- **Why:** Industry standard, GitHub-integrated, encrypted at rest, automatically masked in logs
- **Affects:** Workflow security, credential storage approach
- **Important:** Secrets never stored in code; always referenced via `${{ secrets.NAME }}`

[Source: architecture.md#GitHub Actions Secrets Management for Credentials, lines 186-204]

**Decision 2: FTP Deployment to cPanel**
- **Choice:** Use FTP/SFTP to upload to cPanel shared hosting
- **Why:** cPanel constraint (no Node.js runtime); FTP most reliable method
- **Affects:** Workflow deployment step, directory structure
- **Important:** Target directory is `/public_html/` (cPanel web root)

[Source: architecture.md#Infrastructure & Deployment, lines 184-205]

**Decision 3: Automatic Deployment on Build Success**
- **Choice:** Deploy only if build succeeds (conditional step with `if: success()`)
- **Why:** Prevents broken builds from being deployed
- **Affects:** Workflow logic, deployment reliability
- **Important:** Failed builds do not trigger deployment

**Decision 4: Artifact-Based Deployment**
- **Choice:** Download build artifact, then deploy (not rebuild in deployment step)
- **Why:** Ensures deployed version matches tested build; avoids rebuilding
- **Affects:** Build and deployment separation, artifact retention
- **Important:** Build artifact retained 7 days (from Story 1.4)

---

## Previous Story Intelligence

### Story 1.4 Learnings & Dependencies

**What Story 1.4 Established:**
- GitHub Actions workflow at `.github/workflows/build.yml` triggers on push to main
- Build artifact uploaded with name `build-output` to `_site/` directory
- Build artifact retained for 7 days
- Workflow completes in <5 minutes

**Workflow Integration Points:**
- Story 1.5 adds new step AFTER "Upload build artifacts" step in workflow
- Deployment step reads `build-output` artifact (already uploaded in Story 1.4)
- Deployment step uses `if: success()` to run only after successful build

**Build Output Expected:**
- `_site/` directory with:
  - `index.html` (property listing with optimized images)
  - `images/` subdirectory (optimized images: 640px, 1024px, 1920px in WebP + JPEG)
  - Static assets (CSS, JavaScript)
  - All generated by Story 1.3 image optimization + Story 1.2 data pipeline

**Pattern to Follow:**
- Add new deployment step after artifact upload
- Use conditional `if: success()` to ensure build succeeded first
- Reference secrets via `${{ secrets.SECRET_NAME }}`
- Keep FTP command simple and reliable

**Key File to Modify:**
- `.github/workflows/build.yml` — Add deployment step after line 35 (after artifact upload)

---

## Git Intelligence Summary

### Recent Commits & Deployment Patterns

**Last 3 commits:**
1. `a85012f` — Mark Story 1.4 complete
2. `dfefca6` — Implement Story 1.4: GitHub Actions workflow
3. `135dfeb` — Create story file for 1.4

**Workflow File Pattern:**
- `.github/workflows/build.yml` created in Story 1.4
- Job named `build-site` with multiple steps
- Each step has descriptive `name:` field
- Final steps report success/failure status

**Modification Pattern:**
- Story 1.5 extends the existing workflow
- Adds deployment step after build completion
- Uses conditional execution (`if: success()`)
- Follows GitHub Actions best practices

**Secrets Management Pattern:**
- No secrets used in build step (Story 1.4)
- Secrets introduced in deployment step (Story 1.5)
- Environment variables reference secrets: `${{ secrets.NAME }}`
- Credentials never hardcoded

---

## Latest Technical Information

### GitHub Secrets & Security (2026 Edition)

**GitHub Secrets Features:**
- Encrypted at rest using AES-256
- Only decrypted in GitHub Actions workflows
- Auto-masked in workflow logs (replaced with `***`)
- Can be updated anytime (creates new version)
- Accessible only to workflows in repository
- Audit log tracks changes

**lftp Command Reference:**

```bash
# Basic syntax
lftp -u username,password hostname

# Mirror (sync) command
mirror -R local_dir remote_dir   # Upload local to remote (recursive)
mirror remote_dir local_dir      # Download remote to local

# Common options
-e "command"                      # Execute command and exit
-R                                # Reverse mirror (upload instead of download)
--no-symlinks                    # Skip symbolic links
--continue                       # Resume interrupted transfers
```

**FTP Security:**
- Regular FTP sends credentials unencrypted (insecure for untrusted networks)
- lftp supports SFTP (SSH-based, encrypted) if available on cPanel
- For maximum security, use SFTP instead of FTP (lftp supports both)
- GitHub Actions runs on trusted network, so FTP acceptable

### cPanel FTP Hosting (2026 Edition)

**cPanel Standard Setup:**
- FTP service runs on port 21 (standard FTP)
- SFTP available on port 22 (SSH)
- FTP user home directory: `/home/username/`
- Web root: `/home/username/public_html/`
- FTP user has read/write access to home directory

**File Permissions:**
- Files uploaded via FTP inherit default permissions (usually 644)
- Directories created via FTP usually get 755 permissions
- lftp respects cPanel file permissions automatically

**Bandwidth & Quotas:**
- cPanel accounts have upload bandwidth limits (varies by plan)
- Typical limit: 50-500MB/day or more
- Story 1.4 image optimization keeps files small (<200MB typical)
- Should be well within typical limits

---

## Testing Strategy

### Pre-Deployment Testing (Local)

**Test FTP Credentials Locally:**
1. Install lftp: `apt-get install lftp` (Ubuntu) or `brew install lftp` (Mac)
2. Test connection:
   ```bash
   lftp -u cpanelusername,password ftp.example.com
   ```
3. List files:
   ```bash
   lftp> ls
   lftp> ls public_html
   ```
4. Upload test file:
   ```bash
   lftp> put testfile.txt public_html/
   lftp> quit
   ```
5. Verify in cPanel File Manager

**What to Verify:**
- FTP connection succeeds (no "Login failed")
- Can list `public_html` directory
- Can upload files
- Files appear in cPanel File Manager
- File permissions are correct (644 for files)

### Workflow Testing in GitHub

**First Deployment Run:**
1. Add deployment step to `.github/workflows/build.yml`
2. Add GitHub Secrets (FTP_HOST, FTP_USERNAME, FTP_PASSWORD)
3. Commit and push to main branch
4. Observe workflow execution in Actions tab
5. Verify deployment step completes successfully

**Monitoring Deployment:**
1. Actions tab → Latest workflow run
2. Click "Deploy to cPanel via FTP" step
3. Watch logs in real-time
4. Should see: "Mirror finished" message
5. No errors in output

**Post-Deployment Verification:**
1. Open live website in browser: `http://your-domain.com`
2. Verify latest version of site is displayed
3. Check timestamps on files in cPanel File Manager
4. Verify images loaded correctly

**Troubleshooting Failed Deployments:**
- Review GitHub Actions logs for error message
- Common issues: wrong credentials, directory permissions, FTP service down
- Test FTP connection locally to isolate issue
- Check cPanel FTP Accounts section to verify account status
- Update GitHub Secrets if credentials changed in cPanel
- Re-run workflow after fixing issue

---

## Implementation Checklist

### Pre-Implementation Setup
- [ ] Gather FTP credentials from cPanel (hostname, username, password)
- [ ] Test FTP connection locally using FTP client
- [ ] Verify `/public_html/` directory exists and is accessible via FTP
- [ ] Confirm FTP user has write access to `/public_html/`
- [ ] Story 1.4 (GitHub Actions workflow) is complete and tested

### GitHub Secrets Configuration
- [ ] Go to GitHub repository → Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Add secret: Name = `FTP_HOST`, Value = (FTP hostname, no ftp:// prefix)
- [ ] Add secret: Name = `FTP_USERNAME`, Value = (FTP username)
- [ ] Add secret: Name = `FTP_PASSWORD`, Value = (FTP password)
- [ ] Verify all 3 secrets appear in Secrets list
- [ ] Secrets are shown as dots (values hidden)

### Workflow File Update
- [ ] Open `.github/workflows/build.yml`
- [ ] Add "Download build artifact" step after "Upload build artifacts" step
- [ ] Add "Deploy to cPanel via FTP" step with:
  - [ ] `if: success()` condition
  - [ ] `env:` section with secret references
  - [ ] `apt-get install lftp` to install FTP client
  - [ ] `lftp` mirror command to upload `_site/` to `/public_html/`
- [ ] Verify YAML syntax is valid (no hard tabs, proper indentation)
- [ ] Commit and push to main branch

### Deployment Testing
- [ ] Workflow triggers automatically on push
- [ ] Build step completes successfully (all green checks)
- [ ] Download artifact step succeeds
- [ ] Deploy to cPanel step completes successfully
- [ ] Logs show "Mirror finished" message
- [ ] No error messages in deployment step
- [ ] Visit live website and verify latest content is displayed
- [ ] Check cPanel File Manager to confirm files were uploaded

### Documentation & Handoff
- [ ] Document FTP credentials securely (password manager, not code)
- [ ] Note GitHub Secrets location and names
- [ ] Document how to view deployment logs
- [ ] Document rollback procedure (if deployment goes wrong)
- [ ] Note that deployment happens automatically after every push to main

---

## Story Completion Status

**Acceptance Criteria Status:**
- [ ] GitHub Secrets configured (FTP_HOST, FTP_USERNAME, FTP_PASSWORD)
- [ ] Workflow updated with deployment step
- [ ] Deployment step runs only on build success
- [ ] Files deployed to `/public_html/` on cPanel
- [ ] Credentials never exposed in logs or code
- [ ] Deployment verified on live website

**Definition of Done:**
This story is complete when:
1. Three GitHub Secrets are configured in repository settings
2. `.github/workflows/build.yml` includes deployment step after build
3. Deployment step uses conditional execution (`if: success()`)
4. First deployment workflow runs successfully
5. Files are verified on live website
6. No credentials appear in logs or code
7. Story marked as review status

**Ready for Story 1.6:** Automated deployment pipeline complete; data validation is next step.

---

## Developer Notes

### Common Pitfalls & How to Avoid Them

**Pitfall 1: Hardcoding Credentials in Workflow**
- Wrong: `FTP_PASSWORD: "MyPassword123"`
- Right: `FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}`
- Why: Secrets expose credentials in code; GitHub Secrets encrypts them
- Prevention: Always use `${{ secrets.NAME }}` syntax

**Pitfall 2: Wrong FTP Directory**
- Wrong: `/var/www/html/` (Linux path, not cPanel standard)
- Right: `/public_html/` (cPanel standard web root)
- Why: cPanel uses `/public_html/` as web root; other paths not publicly accessible
- Prevention: Verify FTP user can access `/public_html/` in cPanel File Manager

**Pitfall 3: FTP Command Echoing Password**
- Wrong: `echo "Connecting with password: $password"`
- Right: Use environment variables, never echo them
- Why: Even if GitHub masks secrets, explicit echo breaks masking
- Prevention: Never echo or print credential values

**Pitfall 4: Missing `if: success()` Condition**
- Wrong: Deploy regardless of build success
- Right: Only deploy `if: success()`
- Why: Prevents broken builds from going live
- Prevention: Always include conditional on deployment step

**Pitfall 5: Wrong Artifact Name**
- Wrong: `name: site-build` (Story 1.4 uses `build-output`)
- Right: `name: build-output` (must match artifact name from Story 1.4)
- Why: Artifact download step looks for specific name
- Prevention: Check exact artifact name in Story 1.4 workflow

**Pitfall 6: Directory Path Issues**
- Wrong: `./build/` (artifact downloads to different path)
- Right: `./build/` matches download path in workflow
- Why: Must match where artifact is downloaded
- Prevention: Verify download step path matches mirror source path

---

## Related Documentation

- **Epic 1 Context:** Project Initialization & Deployment Infrastructure
- **Story 1.4 Reference:** GitHub Actions workflow (build job and artifact upload)
- **Story 1.6 Dependency:** Data validation adds validation steps to build
- **Architecture:** GitHub Secrets, FTP deployment decisions

**Security References:**
- [GitHub: Using Secrets in Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [lftp Documentation](https://lftp.yar.ru/)
- [cPanel: FTP Accounts](https://docs.cpanel.net/cpanel/files/ftp-accounts/)

**FTP & cPanel References:**
- cPanel documentation on FTP security
- cPanel File Manager for file verification
- lftp command reference for mirror operations

