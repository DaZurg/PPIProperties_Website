import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../Sensitive/Origional_data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Properties.csv');
const SUBURBS_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Suburbs.csv');
const OUTPUT_FILE = path.join(__dirname, '../src/_data/properties.json');

function parseCSVLine(line) {
  // Simple CSV parser that handles quoted fields
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content) {
  const lines = content.split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const record = {};

    headers.forEach((header, idx) => {
      record[header] = values[idx] || '';
    });

    records.push(record);
  }

  return records;
}

function extractBedsAndBaths(featuresJSON) {
  let beds = 2;
  let baths = 1;

  try {
    const features = JSON.parse(featuresJSON || '[]');
    beds = 0;
    baths = 0;

    features.forEach(f => {
      if (f.type === 'Bedroom' && f.value) {
        beds += Math.round(f.value);
      } else if (f.type === 'Bathroom' && f.value) {
        baths += Math.round(f.value);
      }
    });

    if (beds === 0) beds = 2;
    if (baths === 0) baths = 1;
  } catch (e) {
    // Silently use defaults
  }

  return { beds, baths };
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

function convertProperties() {
  console.log('\n🔄 Converting PropSync data to JSON schema...\n');

  // Read files
  const propertiesContent = fs.readFileSync(PROPERTIES_FILE, 'utf8');
  const suburpsContent = fs.readFileSync(SUBURBS_FILE, 'utf8');

  // Parse CSVs
  const properties = parseCSV(propertiesContent);
  const suburbs = parseCSV(suburpsContent);

  console.log(`📊 Found ${properties.length} properties and ${suburbs.length} suburbs`);

  // Create suburb map
  const suburbMap = {};
  suburbs.forEach(s => {
    suburbMap[s.suburb_id] = {
      name: s.suburb_name,
      city: s.city,
      province: s.province
    };
  });

  // Filter active and convert
  const converted = properties
    .filter(p => p.listing_status === 'Active')
    .map((prop) => {
      const suburb = suburbMap[prop.suburb_id] || { name: 'Unknown', city: 'South Africa' };
      const { beds, baths } = extractBedsAndBaths(prop.features);
      const imageUrls = extractImages(prop.images);
      const features = extractFeatures(prop.features);

      const address = `${prop.address_line}, ${suburb.name}, ${suburb.city}`;

      return {
        id: `property-${prop.property_id}`,
        address: address,
        price: parseInt(prop.list_price) || 0,
        bedrooms: beds,
        bathrooms: baths,
        imageUrls: imageUrls,
        description: (prop.marketing_description || '').split('\n')[0].substring(0, 150),
        agentName: 'Property Agent',
        agentPhone: '+27 00 000 0000',
        agentEmail: 'agent@example.com',
        features: features.length > 0 ? features : ['Modern Property'],
        location: suburb.name,
        propertyType: prop.property_type.includes('House') ? 'House' :
                     prop.property_type.includes('Apartment') ? 'Apartment' :
                     prop.property_type.includes('Townhouse') ? 'Townhouse' : 'Property'
      };
    });

  console.log(`✅ Converted ${converted.length} active properties\n`);

  // Display properties
  console.log('📋 Imported Properties:');
  console.log('======================');
  converted.forEach(prop => {
    console.log(`✓ ${prop.id}`);
    console.log(`  Address: ${prop.address}`);
    console.log(`  Price: R${prop.price.toLocaleString()}`);
    console.log(`  Details: ${prop.bedrooms} bed, ${prop.bathrooms} bath | ${prop.imageUrls.length} images`);
  });
  console.log('');

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(converted, null, 2));
  console.log(`✅ Saved to src/_data/properties.json\n`);

  return converted;
}

// Run
convertProperties();
