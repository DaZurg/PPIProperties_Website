import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as csvParse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../Sensitive/Origional_data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Properties.csv');
const SUBURBS_FILE = path.join(DATA_DIR, 'PropSync Data-Test - Suburbs.csv');
const OUTPUT_FILE = path.join(__dirname, '../src/_data/properties.json');

/**
 * Import properties from PropSync CSV and convert to JSON schema
 */
export async function importProperties() {
  try {
    console.log('\n📥 Importing properties from PropSync...\n');

    // Read and parse CSV files
    const propertiesCSV = fs.readFileSync(PROPERTIES_FILE, 'utf8');
    const suburpsCSV = fs.readFileSync(SUBURBS_FILE, 'utf8');

    const properties = csvParse(propertiesCSV, {
      columns: true,
      skip_empty_lines: true
    });

    const suburbs = csvParse(suburpsCSV, {
      columns: true,
      skip_empty_lines: true
    });

    // Create suburb lookup
    const suburbMap = {};
    suburbs.forEach(suburb => {
      suburbMap[suburb.suburb_id] = {
        name: suburb.suburb_name,
        city: suburb.city,
        province: suburb.province,
        postalCode: suburb.postal_code
      };
    });

    console.log(`✅ Loaded ${suburbs.length} suburbs`);
    console.log(`✅ Loaded ${properties.length} properties from CSV\n`);

    // Convert to JSON schema
    const converted = properties
      .filter(p => p.listing_status === 'Active') // Only active listings
      .map((prop, index) => {
        const suburb = suburbMap[prop.suburb_id] || {};

        // Parse features array
        let features = [];
        try {
          const featuresData = JSON.parse(prop.features || '[]');
          features = featuresData
            .map(f => f.description || f.type)
            .filter(f => f && f.length > 0)
            .slice(0, 8); // Limit to 8 features
        } catch (e) {
          console.warn(`⚠️  Could not parse features for property ${prop.property_id}`);
        }

        // Parse images array
        let imageUrls = [];
        try {
          const imagesData = JSON.parse(prop.images || '[]');
          imageUrls = imagesData
            .map(img => img.url)
            .filter(url => url && url.length > 0)
            .slice(0, 6); // Limit to 6 images
        } catch (e) {
          console.warn(`⚠️  Could not parse images for property ${prop.property_id}`);
        }

        // Extract bedroom and bathroom counts from features
        let bedrooms = 0;
        let bathrooms = 0;
        try {
          const featuresData = JSON.parse(prop.features || '[]');
          featuresData.forEach(f => {
            if (f.type === 'Bedroom') bedrooms += Math.max(1, Math.round(f.value));
            if (f.type === 'Bathroom') bathrooms += Math.max(0, Math.round(f.value));
          });
        } catch (e) {
          // Use defaults
          bedrooms = 2;
          bathrooms = 1;
        }

        const address = `${prop.address_line}, ${suburb.name || 'Unknown'}, ${suburb.city || 'South Africa'}`;

        return {
          id: `property-${prop.property_id}`,
          address: address,
          price: parseInt(prop.list_price) || 0,
          bedrooms: bedrooms || 2,
          bathrooms: bathrooms || 1,
          imageUrls: imageUrls.length > 0 ? imageUrls : [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=640'
          ],
          description: (prop.marketing_description || '').trim().split('\n')[0],
          agentName: 'Property Agent',
          agentPhone: '+27 00 000 0000',
          agentEmail: 'agent@example.com',
          features: features.length > 0 ? features : ['Modern Home'],
          location: suburb.name || 'Unknown',
          propertyType: formatPropertyType(prop.property_type)
        };
      });

    console.log(`📊 Converted ${converted.length} active properties\n`);

    // Validate all properties
    const errors = [];
    converted.forEach((prop, idx) => {
      if (!prop.id || !prop.address || !prop.price || !prop.bedrooms || !prop.bathrooms || !prop.imageUrls) {
        errors.push(`Property ${idx + 1} (${prop.id}): Missing required fields`);
      }
      if (prop.price <= 0) {
        errors.push(`Property ${prop.id}: Invalid price ${prop.price}`);
      }
    });

    if (errors.length > 0) {
      console.error('❌ Validation errors found:');
      errors.forEach(err => console.error(`   ${err}`));
      throw new Error('Property validation failed');
    }

    console.log('✅ All properties validated successfully\n');

    // Write to properties.json
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(converted, null, 2));
    console.log(`✅ Imported ${converted.length} properties to src/_data/properties.json\n`);

    // Print summary
    console.log('📋 Property Summary:');
    console.log('==================');
    converted.forEach(prop => {
      console.log(`✓ ${prop.id}: ${prop.address}`);
      console.log(`  Price: R${prop.price.toLocaleString()} | ${prop.bedrooms} bed, ${prop.bathrooms} bath | ${prop.imageUrls.length} images`);
    });
    console.log('');

    return converted;
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  }
}

function formatPropertyType(type) {
  if (!type) return 'House';
  if (type.includes('House')) return 'House';
  if (type.includes('Apartment') || type.includes('Flat') || type.includes('Unit')) return 'Apartment';
  if (type.includes('Townhouse') || type.includes('Townhome')) return 'Townhouse';
  if (type.includes('Erf') || type.includes('Land')) return 'Land';
  return type;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importProperties().catch(err => {
    process.exit(1);
  });
}
