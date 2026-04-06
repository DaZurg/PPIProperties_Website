import { fetchGoogleSheetsData } from './scripts/fetch-google-sheets-data.js';
import { optimizeImages } from './scripts/optimize-images.js';
import { validateProperties } from './scripts/validate-properties.js';

export default function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({"src/_includes/js": "js"});
  eleventyConfig.addPassthroughCopy("src/images");

  // Run data fetch, validation, and optimization before build
  eleventyConfig.on('eleventy.before', async () => {
    // Fetch live data from Google Sheets (if configured)
    await fetchGoogleSheetsData();
    // Validate data (fast, catches errors early)
    await validateProperties();
    // Then optimize images
    await optimizeImages();
  });

  // Add helper for responsive images
  eleventyConfig.addNunjucksGlobal('responsiveImage', (propertyId, imageIndex = 0) => {
    return {
      propertyId,
      imageIndex,
      imageName: `property-${propertyId}-${imageIndex}`
    };
  });

  // Add number formatting filter for prices
  eleventyConfig.addNunjucksFilter('formatNumber', (value) => {
    if (!value && value !== 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
