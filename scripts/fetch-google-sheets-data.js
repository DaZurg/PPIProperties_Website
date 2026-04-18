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
 * Extract beds, baths, and parking from features JSON
 */
function extractBedsAndBaths(featuresJSON) {
  let beds = 0;
  let baths = 0;
  let parking = 0;

  try {
    const features = JSON.parse(featuresJSON || '[]');
    features.forEach(f => {
      if (f.type === 'Bedroom' && f.value) beds += f.value;
      else if (f.type === 'Bathroom' && f.value) baths += f.value;
      else if ((f.type === 'Garage' || f.type === 'Parking') && f.value) parking += f.value;
    });
  } catch (e) {}

  return { beds, baths, parking };
}

/**
 * Extract detailed room features for display
 */
function extractRoomFeatures(featuresJSON) {
  try {
    const features = JSON.parse(featuresJSON || '[]');
    const rooms = {};

    features.forEach(f => {
      const type = f.type || 'Other';
      if (!rooms[type]) {
        rooms[type] = { type, count: 0, items: [] };
      }
      rooms[type].count += f.value || 1;

      const item = {
        value: f.value,
        description: f.description || '',
        options: (f.options || []).map(opt => opt.description).filter(d => d)
      };

      if (item.description || item.options.length > 0) {
        rooms[type].items.push(item);
      }
    });

    return Object.values(rooms);
  } catch (e) {
    return [];
  }
}

/**
 * Extract floor area or erf size from JSON object
 */
function extractSizeField(sizeJSON) {
  try {
    if (!sizeJSON) return null;
    const data = JSON.parse(sizeJSON);
    if (data && data.size) {
      const unit = data.measurementUnit === 'Metresquared' ? 'm²' : (data.measurementUnit || '');
      return { size: data.size, unit, display: `${data.size} ${unit}` };
    }
  } catch (e) {}
  return null;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  try {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return null;
  }
}

/**
 * Convert properties data to output format
 */
function transformProperty(prop, suburb, agent) {
  const imageUrls = parseImageUrls(prop.images);
  const { beds, baths, parking } = extractBedsAndBaths(prop.features);
  const roomFeatures = extractRoomFeatures(prop.features);
  const floorArea = extractSizeField(prop.floor_area);
  const erfSize = extractSizeField(prop.erf_size);

  return {
    id: prop.property_id || `property-${Date.now()}`,
    address: (prop.address_line || '').trim(),
    price: parseInt(prop.list_price) || 0,
    currencySymbol: prop.currency_symbol || 'R',
    bedrooms: beds,
    bathrooms: baths,
    parkingSpaces: parking,
    imageUrls: imageUrls,

    // Full marketing description
    description: prop.marketing_description || '',
    marketingHeading: prop.marketing_heading || '',

    // Agent details
    agentName: agent ? `${agent.first_name} ${agent.last_name}`.trim() : 'Property Agent',
    agentPhone: agent ? parsePhoneNumber(agent.telephone_numbers) : '',
    agentEmail: agent ? agent.email_address : '',

    // Room-by-room features
    roomFeatures: roomFeatures,

    // Property highlights
    highlights: {
      backupBattery: prop.backup_battery === 'TRUE',
      borehole: prop.borehole === 'TRUE',
      solarPanels: prop.solar_panels === 'TRUE',
      solarGeyser: prop.solar_geyser === 'TRUE',
      gasGeyser: prop.gas_geyser === 'TRUE',
      waterTank: prop.water_tank === 'TRUE'
    },

    // Size information
    floorArea: floorArea,
    erfSize: erfSize,
    furnishedType: prop.furnished_type || null,

    // Property info
    levy: parseInt(prop.levy) || null,
    rates: parseInt(prop.rates) || null,
    ownershipType: prop.ownership_type || null,
    petsAllowed: prop.pets_allowed === 'TRUE',

    // Dates
    listedDate: formatDate(prop.created),
    updatedDate: formatDate(prop.change_date),

    // Location
    location: suburb ? suburb.suburb_name : prop.location || 'Unknown',
    city: suburb ? suburb.city : '',
    province: suburb ? suburb.province : '',

    // Property type
    propertyType: prop.property_type || 'Property',
  };
}

/**
 * Parse first phone number from JSON array
 */
function parsePhoneNumber(phoneJSON) {
  try {
    if (!phoneJSON) return '';
    const phones = JSON.parse(phoneJSON);
    if (Array.isArray(phones) && phones.length > 0) {
      return phones[0].number || '';
    }
  } catch (e) {}
  return '';
}

/**
 * Parse agent IDs from JSON array string
 */
function parseAgentIds(agentsJSON) {
  try {
    if (!agentsJSON) return [];
    return JSON.parse(agentsJSON);
  } catch (e) {
    return [];
  }
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
    const agentsSheetName = config.sheets.agents?.sheetName || 'Agents';
    const suburbanKeyColumn = config.sheets.properties.suburbanKeyColumn;
    const suburbKeyColumn = config.sheets.suburbs.keyColumn;

    // Fetch all sheets
    console.log('📥 Fetching data from Google Sheets...');
    const sheetsToFetch = [
      fetchSheetData(auth, sheetId, propertiesSheetName),
      fetchSheetData(auth, sheetId, suburbesSheetName),
    ];

    // Try to fetch agents sheet if configured
    try {
      sheetsToFetch.push(fetchSheetData(auth, sheetId, agentsSheetName));
    } catch (e) {
      console.log('⚠️  Agents sheet not found, using default agent info');
      sheetsToFetch.push(Promise.resolve([]));
    }

    const [propertiesData, suburbsData, agentsData] = await Promise.all(sheetsToFetch);

    if (propertiesData.length === 0) {
      throw new Error('No properties found in sheet');
    }

    // Create suburb lookup map
    const suburbMap = {};
    suburbsData.forEach(suburb => {
      suburbMap[suburb[suburbKeyColumn]] = suburb;
    });

    console.log(`✓ Created suburb lookup map with ${Object.keys(suburbMap).length} suburbs`);

    // Create agent lookup map
    const agentMap = {};
    if (agentsData && agentsData.length > 0) {
      agentsData.forEach(agent => {
        agentMap[agent.agent_id] = agent;
      });
      console.log(`✓ Created agent lookup map with ${Object.keys(agentMap).length} agents`);
    }

    // Filter active properties (exclude deleted and inactive)
    const properties = propertiesData
      .filter(prop => prop._deleted !== 'TRUE')
      .filter(prop => prop.listing_status === 'Active' || !prop.listing_status)
      .map(prop => {
        const suburbId = prop[suburbanKeyColumn];
        const suburb = suburbMap[suburbId];

        // Get first agent from agents array
        const agentIds = parseAgentIds(prop.agents);
        const primaryAgent = agentIds.length > 0 ? agentMap[agentIds[0]] : null;

        return transformProperty(prop, suburb, primaryAgent);
      })
      .filter(prop => prop.price >= 0);

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
