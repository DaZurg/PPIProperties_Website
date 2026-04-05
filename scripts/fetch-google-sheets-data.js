/**
 * Fetch Properties and Suburbs data from Google Sheets
 * Joins them on suburb_id and outputs properties.json
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONFIG_FILE = path.join(__dirname, '../config.google-sheets.json');
const OUTPUT_FILE = path.join(__dirname, '../src/_data/properties.json');

/**
 * Load configuration from file or environment variable
 */
function loadConfig() {
  let config;

  // Try to load from environment variable first (GitHub Actions)
  if (process.env.GOOGLE_SHEETS_CONFIG) {
    try {
      config = JSON.parse(process.env.GOOGLE_SHEETS_CONFIG);
      console.log('📋 Loaded config from environment variable');
      return config;
    } catch (error) {
      console.error('❌ Failed to parse GOOGLE_SHEETS_CONFIG environment variable');
      throw error;
    }
  }

  // Fall back to local config file
  if (!fs.existsSync(CONFIG_FILE)) {
    console.log('⚠️  No Google Sheets config found. Create config.google-sheets.json to enable live data sync.');
    return null;
  }

  try {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    console.log('📋 Loaded config from config.google-sheets.json');
    return config;
  } catch (error) {
    console.error('❌ Failed to parse config.google-sheets.json');
    throw error;
  }
}

/**
 * Fetch sheet data from Google Sheets
 */
async function fetchSheetData(auth, sheetId, sheetName) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${sheetName}'`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      console.warn(`⚠️  No data found in sheet: ${sheetName}`);
      return [];
    }

    // First row is headers
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx] || '';
      });
      return obj;
    });

    console.log(`✓ Fetched ${data.length} rows from ${sheetName}`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch ${sheetName}:`, error.message);
    throw error;
  }
}

/**
 * Parse image URLs from JSON array string
 */
function parseImageUrls(imagesJSON) {
  if (!imagesJSON) return [];
  try {
    const images = JSON.parse(imagesJSON);
    if (Array.isArray(images)) {
      return images
        .map(img => img.url || img)
        .filter(url => url && typeof url === 'string')
        .slice(0, 10); // Max 10 images per property
    }
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Parse features from JSON array string
 */
function parseFeatures(featuresJSON) {
  if (!featuresJSON) return [];
  try {
    const features = JSON.parse(featuresJSON);
    if (Array.isArray(features)) {
      return features
        .map(f => f.description || f.type || f)
        .filter(f => f && typeof f === 'string' && f.length > 0)
        .slice(0, 8); // Max 8 features per property
    }
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Convert properties data to output format
 */
function transformProperty(prop, suburb) {
  const imageUrls = parseImageUrls(prop.images);
  const features = parseFeatures(prop.features);

  return {
    id: prop.property_id || `property-${Date.now()}`,
    address: `${prop.address_line || ''}${suburb ? `, ${suburb.suburb_name || ''}` : ''}`.trim(),
    price: parseInt(prop.list_price) || 0,
    bedrooms: parseInt(prop.bedrooms) || 0,
    bathrooms: parseInt(prop.bathrooms) || 0,
    imageUrls: imageUrls,
    description: (prop.marketing_description || '').substring(0, 300).trim(),
    agentName: prop.agent_name || 'Property Agent',
    agentPhone: prop.agent_phone || '',
    agentEmail: prop.agent_email || '',
    features: features.length > 0 ? features : ['Property'],
    location: suburb ? suburb.suburb_name : prop.location || 'Unknown',
    propertyType: prop.property_type || 'Property',
  };
}

/**
 * Main function
 */
export async function fetchGoogleSheetsData() {
  console.log('\n📊 Starting Google Sheets data sync...\n');

  const config = loadConfig();
  if (!config) {
    console.log('⏭️  Skipping Google Sheets sync (no config found)');
    return;
  }

  try {
    // Authenticate with service account
    const auth = new google.auth.GoogleAuth({
      credentials: config.serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheetId = config.sheetId;
    const propertiesSheetName = config.sheets.properties.sheetName;
    const suburbesSheetName = config.sheets.suburbs.sheetName;
    const suburbanKeyColumn = config.sheets.properties.suburbanKeyColumn;
    const suburbKeyColumn = config.sheets.suburbs.keyColumn;

    // Fetch both sheets
    console.log('📥 Fetching data from Google Sheets...');
    const [propertiesData, suburbsData] = await Promise.all([
      fetchSheetData(auth, sheetId, propertiesSheetName),
      fetchSheetData(auth, sheetId, suburbesSheetName),
    ]);

    if (propertiesData.length === 0) {
      throw new Error('No properties found in sheet');
    }

    // Create suburb lookup map
    const suburbMap = {};
    suburbsData.forEach(suburb => {
      suburbMap[suburb[suburbKeyColumn]] = suburb;
    });

    console.log(`✓ Created suburb lookup map with ${Object.keys(suburbMap).length} suburbs`);

    // Filter active properties and transform
    const properties = propertiesData
      .filter(prop => prop.listing_status === 'Active' || !prop.listing_status)
      .map(prop => {
        const suburbId = prop[suburbanKeyColumn];
        const suburb = suburbMap[suburbId];
        return transformProperty(prop, suburb);
      })
      .filter(prop => prop.price > 0 && prop.bedrooms >= 0 && prop.bathrooms >= 0);

    console.log(`✓ Transformed ${properties.length} properties`);

    // Write output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(properties, null, 2));
    console.log(`\n✅ Google Sheets sync complete!`);
    console.log(`📊 Summary:`);
    console.log(`   Total properties: ${properties.length}`);
    console.log(`   Total images: ${properties.reduce((sum, p) => sum + p.imageUrls.length, 0)}`);
    console.log(`   Saved to: src/_data/properties.json\n`);

    return properties;
  } catch (error) {
    console.error('❌ Google Sheets sync failed:', error.message);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchGoogleSheetsData().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
