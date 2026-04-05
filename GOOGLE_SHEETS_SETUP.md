# Google Sheets Data Sync Setup

This guide walks you through connecting your PropSync Google Sheet to the build pipeline for live property data.

## Step 1: Create Google Cloud Project & Service Account

Follow these steps to get your service account JSON key:

1. **Create Google Cloud Project** at https://console.cloud.google.com/
   - Click project dropdown → "NEW PROJECT"
   - Name: `PPIProperties` → CREATE

2. **Enable Google Sheets API**
   - Search for "Google Sheets API" in the search bar
   - Click it → ENABLE

3. **Create Service Account**
   - Left sidebar → "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "Service Account"
   - Service account name: `ppiproperties-data-sync`
   - Click "CREATE AND CONTINUE" → CONTINUE → DONE

4. **Generate JSON Key**
   - Click on your service account in the Credentials list
   - Go to "KEYS" tab
   - "ADD KEY" → "Create new key" → JSON → CREATE
   - A JSON file downloads - **keep this safe!**

## Step 2: Share Google Sheet with Service Account

1. Open your PropSync Google Sheet
2. From the downloaded JSON key, find the `client_email` field
3. In your Google Sheet, click Share
4. Paste the service account email, give "Editor" access
5. Uncheck "Notify people" → Share

## Step 3: Get Your Sheet Information

You need two pieces of information:

1. **Sheet ID** - From your Google Sheet URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
   Copy the long string between `/d/` and `/edit`

2. **Sheet Name** - The tab name at the bottom (default is "Sheet1")

The script will automatically detect column names from your sheet's header row.

## Step 4: Create Config File

1. Copy `config.google-sheets.example.json` to `config.google-sheets.json`
2. Open the JSON key file you downloaded and copy its entire contents
3. Edit `config.google-sheets.json`:
   ```json
   {
     "sheetId": "YOUR_SHEET_ID",
     "sheetName": "Properties",
     "serviceAccount": {
       // PASTE ENTIRE JSON KEY FILE CONTENTS HERE
     }
   }
   ```

4. Replace the placeholder values with your actual sheet ID and service account JSON

## Step 5: Set GitHub Secret (for CI/CD)

To use this in GitHub Actions (so the build can fetch data):

1. Go to your GitHub repo → Settings → Secrets and Variables → Actions
2. Click "New repository secret"
3. Name: `GOOGLE_SHEETS_CONFIG`
4. Value: Copy the entire contents of `config.google-sheets.json` (paste as-is)
5. Click "Add secret"

## Step 6: Add to .gitignore

Never commit the actual config file with your service account key:

Add to `.gitignore`:
```
config.google-sheets.json
```

## Step 7: Commit Template & Instructions

Commit the example config and these instructions:
```bash
git add config.google-sheets.example.json GOOGLE_SHEETS_SETUP.md .gitignore
git commit -m "Add Google Sheets data sync setup"
```

## Build Pipeline Flow

Once set up, each build will:

1. **Fetch live data** - Reads configuration from `config.google-sheets.json` (local) or `GOOGLE_SHEETS_CONFIG` (GitHub Actions)
2. **Authenticate** - Uses service account to connect to Google Sheets API
3. **Fetch sheets** - Pulls Properties and Suburbs data from your configured sheets
4. **Join data** - Links properties to suburbs via `suburb_id` key
5. **Generate JSON** - Creates `src/_data/properties.json` with live property data
6. **Validate** - Checks all properties pass validation rules
7. **Optimize images** - Downloads and resizes property images
8. **Build site** - Generates static HTML with 11ty
9. **Deploy** - Uploads to cPanel via FTP

Your site will always have the latest property data from Google Sheets!

## Local Testing

Before pushing to GitHub:

1. Make sure `config.google-sheets.json` exists locally with your real sheet ID and service account key
2. Run the build locally:
   ```bash
   npm run build
   ```
3. Check that `src/_data/properties.json` was generated with your properties
4. Verify the image optimization completed successfully

## Troubleshooting

- **"403 Forbidden"** - Sheet not shared with service account email, or API not enabled
- **"404 Sheet not found"** - Wrong sheet ID or sheet name
- **Column not found** - Column name in config doesn't match header in sheet exactly (case-sensitive)
- **Image download fails** - Image URLs in sheet are invalid or inaccessible
