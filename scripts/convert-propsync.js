import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../Sensitive/Origional_data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Properties.csv');
const SUBURBS_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Suburbs.csv');
const AGENTS_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Agents.csv');
const OUTPUT_FILE = path.join(__dirname, '../src/_data/properties.json');
const LOCATIONS_FILE = path.join(__dirname, '../src/_data/locations.json');

function parseCSVLine(line) {
  // CSV parser that handles quoted fields and escaped quotes
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      // Check for escaped quote (double quote)
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
    i++;
  }
  result.push(current);
  return result;
}

function parseCSV(content) {
  // Handle both \r\n and \n line endings, and handle fields that span multiple lines
  const records = [];
  let currentRecord = [];
  let currentField = '';
  let inQuotes = false;
  let headers = null;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '"') {
      // Check for escaped quote (double quote)
      if (inQuotes && content[i + 1] === '"') {
        currentField += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRecord.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of line - skip \r if followed by \n
      if (char === '\r' && content[i + 1] === '\n') {
        i++;
      }

      currentRecord.push(currentField);
      currentField = '';

      if (currentRecord.length > 0 && currentRecord.some(f => f.length > 0)) {
        if (!headers) {
          headers = currentRecord;
        } else {
          const record = {};
          headers.forEach((header, idx) => {
            record[header] = currentRecord[idx] || '';
          });
          records.push(record);
        }
      }
      currentRecord = [];
    } else {
      currentField += char;
    }
  }

  // Handle last record if file doesn't end with newline
  if (currentRecord.length > 0 || currentField.length > 0) {
    currentRecord.push(currentField);
    if (headers && currentRecord.some(f => f.length > 0)) {
      const record = {};
      headers.forEach((header, idx) => {
        record[header] = currentRecord[idx] || '';
      });
      records.push(record);
    }
  }

  return records;
}

function extractBedsAndBaths(featuresJSON) {
  let beds = 0;
  let baths = 0;
  let parking = 0;

  try {
    const features = JSON.parse(featuresJSON || '[]');

    features.forEach(f => {
      if (f.type === 'Bedroom' && f.value) {
        beds += f.value;
      } else if (f.type === 'Bathroom' && f.value) {
        baths += f.value;
      } else if ((f.type === 'Garage' || f.type === 'Parking') && f.value) {
        parking += f.value;
      }
    });
  } catch (e) {
    // Silently use defaults
  }

  return { beds, baths, parking };
}

// Extract the detailed room-by-room features for display
function extractRoomFeatures(featuresJSON) {
  try {
    const features = JSON.parse(featuresJSON || '[]');
    const rooms = {};

    features.forEach(f => {
      const type = f.type || 'Other';
      if (!rooms[type]) {
        rooms[type] = {
          type: type,
          count: 0,
          items: []
        };
      }

      rooms[type].count += f.value || 1;

      // Collect item details
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

// Extract floor area from JSON object
function extractFloorArea(floorAreaJSON) {
  try {
    if (!floorAreaJSON || floorAreaJSON === '') return null;
    const data = JSON.parse(floorAreaJSON);
    if (data && data.size) {
      const unit = data.measurementUnit === 'Metresquared' ? 'm²' : data.measurementUnit || '';
      return { size: data.size, unit: unit, display: `${data.size} ${unit}` };
    }
  } catch (e) {}
  return null;
}

// Extract erf/property size from JSON object
function extractErfSize(erfSizeJSON) {
  try {
    if (!erfSizeJSON || erfSizeJSON === '') return null;
    const data = JSON.parse(erfSizeJSON);
    if (data && data.size) {
      const unit = data.measurementUnit === 'Metresquared' ? 'm²' : data.measurementUnit || '';
      return { size: data.size, unit: unit, display: `${data.size} ${unit}` };
    }
  } catch (e) {}
  return null;
}

// Parse agent IDs from JSON array string
function parseAgentIds(agentsJSON) {
  try {
    if (!agentsJSON || agentsJSON === '') return [];
    return JSON.parse(agentsJSON);
  } catch (e) {
    return [];
  }
}

// Format date for display
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

// Parse phone numbers from JSON array
function parsePhoneNumbers(phoneJSON) {
  try {
    if (!phoneJSON || phoneJSON === '') return [];
    const phones = JSON.parse(phoneJSON);
    return phones.map(p => ({
      number: p.number,
      type: p.type || 'Phone'
    }));
  } catch (e) {
    return [];
  }
}

function extractImages(imagesJSON) {
  try {
    const images = JSON.parse(imagesJSON || '[]');
    return images
      .map(img => img.url)
      .filter(url => url && url.length > 0)
      .slice(0, 6);
  } catch (e) {
    return ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=640'];
  }
}

function extractFeatures(featuresJSON) {
  try {
    const features = JSON.parse(featuresJSON || '[]');
    return features
      .map(f => f.description || f.type)
      .filter(f => f && f.length > 2)
      .slice(0, 6);
  } catch (e) {
    return [];
  }
}

// Generate locations.json from suburbs data with lookup tables
function generateLocationsJson(suburbs) {
  const countries = {};
  const bySuburb = {};
  const byCity = {};
  const byProvince = {};

  // Filter out deleted records
  const activeSuburbs = suburbs.filter(s => s._deleted !== 'TRUE');

  activeSuburbs.forEach(record => {
    const { country, province, city, suburb_name } = record;

    // Skip if missing required fields
    if (!country || !province || !city || !suburb_name) return;

    // Build hierarchy: countries -> provinces -> cities -> suburbs
    if (!countries[country]) {
      countries[country] = { provinces: {} };
    }
    if (!countries[country].provinces[province]) {
      countries[country].provinces[province] = { cities: {} };
    }
    if (!countries[country].provinces[province].cities[city]) {
      countries[country].provinces[province].cities[city] = { suburbs: [] };
    }

    const cityObj = countries[country].provinces[province].cities[city];
    if (!cityObj.suburbs.includes(suburb_name)) {
      cityObj.suburbs.push(suburb_name);
    }

    // Build lookup tables with lowercase keys for case-insensitive matching
    const suburbKey = suburb_name.toLowerCase();
    bySuburb[suburbKey] = {
      suburb: suburb_name,
      city: city,
      province: province,
      country: country
    };

    const cityKey = city.toLowerCase();
    if (!byCity[cityKey]) {
      byCity[cityKey] = {
        city: city,
        province: province,
        country: country,
        suburbs: []
      };
    }
    if (!byCity[cityKey].suburbs.includes(suburb_name)) {
      byCity[cityKey].suburbs.push(suburb_name);
    }

    const provinceKey = province.toLowerCase();
    if (!byProvince[provinceKey]) {
      byProvince[provinceKey] = {
        province: province,
        country: country,
        cities: []
      };
    }
    if (!byProvince[provinceKey].cities.includes(city)) {
      byProvince[provinceKey].cities.push(city);
    }
  });

  // Sort suburbs within each city alphabetically
  Object.values(countries).forEach(countryObj => {
    Object.values(countryObj.provinces).forEach(provinceObj => {
      Object.values(provinceObj.cities).forEach(cityObj => {
        cityObj.suburbs.sort((a, b) => a.localeCompare(b));
      });
    });
  });

  // Sort cities in each province lookup
  Object.values(byProvince).forEach(p => {
    p.cities.sort((a, b) => a.localeCompare(b));
  });

  // Sort suburbs in each city lookup
  Object.values(byCity).forEach(c => {
    c.suburbs.sort((a, b) => a.localeCompare(b));
  });

  return {
    countries,
    lookup: { bySuburb, byCity, byProvince }
  };
}

function convertProperties() {
  console.log('\n🔄 Converting PropSync data to JSON schema...\n');

  // Read files
  const propertiesContent = fs.readFileSync(PROPERTIES_FILE, 'utf8');
  const suburpsContent = fs.readFileSync(SUBURBS_FILE, 'utf8');
  const agentsContent = fs.readFileSync(AGENTS_FILE, 'utf8');

  // Parse CSVs
  const properties = parseCSV(propertiesContent);
  const suburbs = parseCSV(suburpsContent);
  const agents = parseCSV(agentsContent);

  console.log(`📊 Found ${properties.length} properties, ${suburbs.length} suburbs, ${agents.length} agents`);

  // Generate locations.json from suburbs data
  const locationsData = generateLocationsJson(suburbs);
  fs.writeFileSync(LOCATIONS_FILE, JSON.stringify(locationsData, null, 2));
  const suburbCount = Object.keys(locationsData.lookup.bySuburb).length;
  const cityCount = Object.keys(locationsData.lookup.byCity).length;
  const provinceCount = Object.keys(locationsData.lookup.byProvince).length;
  console.log(`📍 Generated locations.json: ${provinceCount} provinces, ${cityCount} cities, ${suburbCount} suburbs`);

  // Create suburb map
  const suburbMap = {};
  suburbs.forEach(s => {
    suburbMap[s.suburb_id] = {
      name: s.suburb_name,
      city: s.city,
      province: s.province
    };
  });

  // Create agent map
  const agentMap = {};
  agents.forEach(a => {
    const phones = parsePhoneNumbers(a.telephone_numbers);
    agentMap[a.agent_id] = {
      id: a.agent_id,
      firstName: a.first_name,
      lastName: a.last_name,
      fullName: `${a.first_name} ${a.last_name}`.trim(),
      email: a.email_address,
      phone: phones.length > 0 ? phones[0].number : '',
      phones: phones,
      active: a.active === 'TRUE'
    };
  });

  // Filter active and convert
  const converted = properties
    .filter(p => p.listing_status === 'Active')
    .map((prop) => {
      const suburb = suburbMap[prop.suburb_id] || { name: 'Unknown', city: 'South Africa' };
      const { beds, baths, parking } = extractBedsAndBaths(prop.features);
      const imageUrls = extractImages(prop.images);
      const roomFeatures = extractRoomFeatures(prop.features);
      const floorArea = extractFloorArea(prop.floor_area);
      const erfSize = extractErfSize(prop.erf_size);

      // Get first agent from the agents array
      const agentIds = parseAgentIds(prop.agents);
      const primaryAgent = agentIds.length > 0 ? agentMap[agentIds[0]] : null;

      const address = `${prop.address_line}, ${suburb.name}`;

      return {
        id: prop.property_id,
        address: address,
        price: parseInt(prop.list_price) || 0,
        currencySymbol: prop.currency_symbol || 'R',
        bedrooms: beds,
        bathrooms: baths,
        parkingSpaces: parking,
        imageUrls: imageUrls,

        // Full marketing description
        description: prop.marketing_description || '',
        marketingHeading: prop.marketing_heading || '',

        // Agent details from agents CSV
        agentName: primaryAgent ? primaryAgent.fullName : 'Property Agent',
        agentPhone: primaryAgent ? primaryAgent.phone : '',
        agentEmail: primaryAgent ? primaryAgent.email : '',

        // Room-by-room features for detailed display
        roomFeatures: roomFeatures,

        // Property highlights/amenities (boolean flags)
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
        location: suburb.name,
        city: suburb.city,
        province: suburb.province,

        // Property type
        propertyType: prop.property_type || 'Property'
      };
    });

  console.log(`✅ Converted ${converted.length} active properties\n`);

  // Display properties
  console.log('📋 Imported Properties:');
  console.log('======================');
  converted.forEach(prop => {
    console.log(`✓ ${prop.id}`);
    console.log(`  Address: ${prop.address}`);
    console.log(`  Price: ${prop.currencySymbol}${prop.price.toLocaleString()}`);
    console.log(`  Details: ${prop.bedrooms} bed, ${prop.bathrooms} bath, ${prop.parkingSpaces} parking | ${prop.imageUrls.length} images`);
    console.log(`  Agent: ${prop.agentName} (${prop.agentPhone || 'No phone'})`);
  });
  console.log('');

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(converted, null, 2));
  console.log(`✅ Saved to src/_data/properties.json\n`);

  return converted;
}

// Run
convertProperties();
