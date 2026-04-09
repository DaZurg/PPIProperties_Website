import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load properties.json
const propertiesPath = path.join(__dirname, '../src/_data/properties.json');

/**
 * Validate all properties in properties.json
 * Throws error if required fields missing or invalid
 * Logs warnings if optional fields missing
 */
export async function validateProperties() {
  try {
    const data = fs.readFileSync(propertiesPath, 'utf8');
    const properties = JSON.parse(data);

    if (!Array.isArray(properties)) {
      throw new Error('properties.json must contain an array of properties');
    }

    console.log('\n📋 Starting data validation...\n');

    const errors = [];
    const warnings = [];
    const seenIds = new Set();

    // Validate each property
    properties.forEach((property, index) => {
      const propertyErrors = validateProperty(property, index);
      const propertyWarnings = validateOptionalFields(property, index);

      if (propertyErrors.length > 0) {
        errors.push(...propertyErrors);
      }

      if (propertyWarnings.length > 0) {
        warnings.push(...propertyWarnings);
      }

      // Check for duplicate IDs
      if (property.id) {
        if (seenIds.has(property.id)) {
          errors.push(`Duplicate ID found: ${property.id}`);
        }
        seenIds.add(property.id);
      }
    });

    // Report results
    if (errors.length > 0) {
      console.error('❌ DATA VALIDATION FAILED\n');
      console.error('Validation errors found in src/_data/properties.json:\n');
      errors.forEach(error => {
        console.error(`  ✗ ${error}`);
      });
      console.error('\nFix the errors above and retry the build.');
      throw new Error(`Data validation failed with ${errors.length} error(s)`);
    }

    if (warnings.length > 0) {
      console.warn('⚠️  DATA VALIDATION WARNINGS\n');
      warnings.forEach(warning => {
        console.warn(`  ⓘ ${warning}`);
      });
      console.warn(`\n${properties.length} properties validated with ${warnings.length} warning(s).`);
      console.warn('Build continuing...\n');
    } else {
      console.log('✅ DATA VALIDATION PASSED\n');
      console.log(`All ${properties.length} properties validated successfully:`);
      console.log('  ✓ All required fields present');
      console.log('  ✓ All field types correct');
      console.log('  ✓ All field values in valid ranges');
      console.log('  ✓ No duplicate IDs found\n');
    }
  } catch (error) {
    if (error.message.includes('Data validation failed')) {
      throw error; // Re-throw validation errors
    }
    throw new Error(`Failed to validate properties: ${error.message}`);
  }
}

/**
 * Validate required fields for a single property
 */
function validateProperty(property, index) {
  const errors = [];
  const propId = property.id || `[Property ${index}]`;

  // Required: id
  if (!property.id) {
    errors.push(`Property ${propId}: Missing required field: id`);
  } else if (typeof property.id !== 'string' && typeof property.id !== 'number') {
    errors.push(`Property ${propId}: Field type error: id should be string or number, got ${typeof property.id}`);
  }

  // Required: address
  if (!property.address) {
    errors.push(`Property ${propId}: Missing required field: address`);
  } else if (typeof property.address !== 'string') {
    errors.push(`Property ${propId}: Field type error: address should be string, got ${typeof property.address}`);
  } else if (property.address.length < 5) {
    errors.push(`Property ${propId}: Field value error: address too short (minimum 5 characters), got "${property.address}"`);
  }

  // Required: price
  if (property.price === undefined || property.price === null) {
    errors.push(`Property ${propId}: Missing required field: price`);
  } else if (typeof property.price !== 'number') {
    errors.push(`Property ${propId}: Field type error: price should be number, got ${typeof property.price} ("${property.price}")`);
  } else if (property.price <= 0) {
    errors.push(`Property ${propId}: Field value error: price must be > 0, got ${property.price}`);
  }

  // Required: bedrooms
  if (property.bedrooms === undefined || property.bedrooms === null) {
    errors.push(`Property ${propId}: Missing required field: bedrooms`);
  } else if (typeof property.bedrooms !== 'number') {
    errors.push(`Property ${propId}: Field type error: bedrooms should be number, got ${typeof property.bedrooms}`);
  } else if (property.bedrooms < 0 || property.bedrooms > 20) {
    errors.push(`Property ${propId}: Field value error: bedrooms must be 0-20, got ${property.bedrooms}`);
  }

  // Required: bathrooms (can be decimal for half-baths)
  if (property.bathrooms === undefined || property.bathrooms === null) {
    errors.push(`Property ${propId}: Missing required field: bathrooms`);
  } else if (typeof property.bathrooms !== 'number') {
    errors.push(`Property ${propId}: Field type error: bathrooms should be number, got ${typeof property.bathrooms}`);
  } else if (property.bathrooms < 0 || property.bathrooms > 20) {
    errors.push(`Property ${propId}: Field value error: bathrooms must be 0-20, got ${property.bathrooms}`);
  }

  // Required: imageUrls
  if (!property.imageUrls) {
    errors.push(`Property ${propId}: Missing required field: imageUrls`);
  } else if (!Array.isArray(property.imageUrls)) {
    errors.push(`Property ${propId}: Field type error: imageUrls should be array, got ${typeof property.imageUrls}`);
  } else if (property.imageUrls.length === 0) {
    errors.push(`Property ${propId}: Field value error: imageUrls must have at least 1 URL, got empty array`);
  } else {
    // Check all URLs are strings
    property.imageUrls.forEach((url, urlIndex) => {
      if (typeof url !== 'string') {
        errors.push(`Property ${propId}: imageUrls[${urlIndex}] should be string, got ${typeof url}`);
      }
    });
  }

  return errors;
}

/**
 * Check optional fields and collect warnings
 */
function validateOptionalFields(property, index) {
  const warnings = [];
  const propId = property.id || `[Property ${index}]`;

  // Optional: description
  if (!property.description) {
    warnings.push(`Property ${propId}: Missing optional field: description`);
  }

  // Optional: agentName
  if (!property.agentName) {
    warnings.push(`Property ${propId}: Missing optional field: agentName`);
  }

  // Optional: agentEmail
  if (!property.agentEmail) {
    warnings.push(`Property ${propId}: Missing optional field: agentEmail`);
  }

  // Optional: agentPhone
  if (!property.agentPhone) {
    warnings.push(`Property ${propId}: Missing optional field: agentPhone`);
  }

  // Optional: roomFeatures (detailed room-by-room features)
  if (!property.roomFeatures) {
    warnings.push(`Property ${propId}: Missing optional field: roomFeatures`);
  } else if (!Array.isArray(property.roomFeatures)) {
    warnings.push(`Property ${propId}: roomFeatures should be array, got ${typeof property.roomFeatures}`);
  }

  // Optional: location
  if (!property.location) {
    warnings.push(`Property ${propId}: Missing optional field: location`);
  }

  // Optional: propertyType
  if (!property.propertyType) {
    warnings.push(`Property ${propId}: Missing optional field: propertyType`);
  }

  return warnings;
}
