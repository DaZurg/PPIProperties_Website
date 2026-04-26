/**
 * Image Optimization Script
 * Downloads images from property URLs and generates responsive, optimized versions
 *
 * Process:
 * 1. Read properties.json
 * 2. Download images from imageUrls
 * 3. Optimize to 3 responsive sizes (640px, 1024px, 1920px)
 * 4. Create WebP and JPEG versions of each size
 * 5. Store in _site/images/ with naming: property-{id}-{size}.{format}
 *
 * Error Handling: Warn-and-continue (build never fails on image errors)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminWebp from 'imagemin-webp';

const SIZES = [640, 1024, 1920];
const OUTPUT_DIR = '_site/images';
const TEMP_DIR = '.temp/images';
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 75;
const FTP_CACHE_FILE = process.env.FTP_IMAGES_CACHE || '.ftp-images-cache.json';

let stats = {
  totalImages: 0,
  downloaded: 0,
  failed: 0,
  optimized: 0,
  skipped: 0,
  startTime: Date.now()
};

// Set to store existing FTP images for fast lookup
let ftpImagesSet = new Set();

/**
 * Load existing FTP images cache
 * Returns a Set of filenames for fast lookup
 */
function loadFtpCache() {
  try {
    if (fs.existsSync(FTP_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(FTP_CACHE_FILE, 'utf8'));
      if (Array.isArray(data)) {
        ftpImagesSet = new Set(data);
        console.log(`📋 Loaded FTP cache: ${ftpImagesSet.size} existing images found`);
        return ftpImagesSet;
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not load FTP cache: ${error.message}`);
  }
  console.log('📋 No FTP cache found, will process all images');
  return new Set();
}

/**
 * Check if all output files for an image already exist on FTP
 * An image is considered "complete" if all 6 variants exist (3 sizes × 2 formats)
 */
function imageExistsOnFtp(propertyId, imageIndex) {
  if (ftpImagesSet.size === 0) return false;

  // Check for all required output files
  for (const size of SIZES) {
    const jpegName = `property-${propertyId}-${imageIndex}-${size}.jpg`;
    const webpName = `property-${propertyId}-${imageIndex}-${size}.webp`;

    if (!ftpImagesSet.has(jpegName) || !ftpImagesSet.has(webpName)) {
      return false;
    }
  }
  return true;
}

/**
 * Ensure output directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Download image from URL to local file
 */
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Download timeout'));
    }, 15000); // 15 second timeout per image
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.destroy();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.destroy();
      reject(err);
    });
  });
}

/**
 * Process single image: download, optimize, generate sizes
 * Skips processing if all output files already exist on FTP
 */
async function processImage(propertyId, imageUrl, index) {
  // Check if image already exists on FTP - skip if so
  if (imageExistsOnFtp(propertyId, index)) {
    stats.skipped++;
    return true; // Return true since image is available (on FTP)
  }

  const filename = `property-${propertyId}-original-${index}.jpg`;
  const tempPath = path.join(TEMP_DIR, filename);

  try {
    // Download image
    await downloadImage(imageUrl, tempPath);
    stats.downloaded++;

    // Generate responsive sizes
    for (const size of SIZES) {
      // Create optimized JPEG - include image index in filename
      const jpegPath = path.join(TEMP_DIR, `property-${propertyId}-${index}-${size}.jpg`);
      await sharp(tempPath)
        .resize(size, size * 0.75, { fit: 'cover', withoutEnlargement: true })
        .toFile(jpegPath);

      // Create optimized WebP - include image index in filename
      const webpPath = path.join(TEMP_DIR, `property-${propertyId}-${index}-${size}.webp`);
      await sharp(tempPath)
        .resize(size, size * 0.75, { fit: 'cover', withoutEnlargement: true })
        .toFormat('webp', { quality: WEBP_QUALITY })
        .toFile(webpPath);
    }

    stats.optimized++;
    return true;
  } catch (error) {
    stats.failed++;
    console.warn(`⚠️  Failed to process image ${propertyId} (${index}): ${error.message}`);
    return false;
  }
}

/**
 * Copy placeholder image if it exists
 */
function copyPlaceholder() {
  const placeholderSrc = 'src/images/placeholder.jpg';
  if (fs.existsSync(placeholderSrc)) {
    const placeholderDest = path.join(OUTPUT_DIR, 'placeholder.jpg');
    fs.copyFileSync(placeholderSrc, placeholderDest);
  }
}

/**
 * Copy optimized images to output and compress
 */
async function copyOptimizedImages() {
  try {
    // Get all optimized image files (exclude originals)
    const files = fs.readdirSync(TEMP_DIR);

    for (const file of files) {
      // Skip original downloads
      if (file.includes('-original-')) continue;

      const src = path.join(TEMP_DIR, file);
      const dest = path.join(OUTPUT_DIR, file);

      if (file.endsWith('.jpg') || file.endsWith('.webp')) {
        fs.copyFileSync(src, dest);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Image copy warning: ${error.message}`);
  }
}

/**
 * Main optimization function
 */
export async function optimizeImages() {
  console.log('\n🖼️  Starting image optimization pipeline...\n');

  try {
    // Load FTP images cache to skip already-deployed images
    loadFtpCache();

    // Ensure directories exist
    ensureDir(TEMP_DIR);
    ensureDir(OUTPUT_DIR);

    // Read properties data
    const propertiesPath = 'src/_data/properties.json';
    if (!fs.existsSync(propertiesPath)) {
      console.log('⚠️  No properties.json found, skipping image optimization');
      return;
    }

    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

    // Process each property's images
    for (const property of properties) {
      if (!property.imageUrls || !Array.isArray(property.imageUrls)) {
        continue;
      }

      const imageUrls = property.imageUrls;
      stats.totalImages += imageUrls.length;

      let propertySuccessCount = 0;

      for (let i = 0; i < imageUrls.length; i++) {
        const success = await processImage(property.id, imageUrls[i], i);
        if (success) propertySuccessCount++;
      }

      if (propertySuccessCount === 0 && imageUrls.length > 0) {
        console.warn(`⚠️  All images failed for property ${property.id}, will use placeholder`);
      }
    }

    // Copy optimized images to output
    console.log('📦 Copying optimized images...');
    await copyOptimizedImages();

    // Copy placeholder
    copyPlaceholder();

    // Cleanup temp directory
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    // Print summary
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
    console.log('\n✅ Image optimization complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Total images: ${stats.totalImages}`);
    console.log(`   Skipped (already on FTP): ${stats.skipped}`);
    console.log(`   Downloaded: ${stats.downloaded}`);
    console.log(`   Optimized: ${stats.optimized} (3 sizes × 2 formats each)`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Time: ${duration}s`);
    if (stats.skipped > 0) {
      const timeSaved = ((stats.skipped / stats.totalImages) * 100).toFixed(1);
      console.log(`   ⚡ Time saved by skipping: ~${timeSaved}% of images already deployed`);
    }
    console.log('');

  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
