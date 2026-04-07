import { fetchGoogleSheetsData } from './scripts/fetch-google-sheets-data.js';
import { optimizeImages } from './scripts/optimize-images.js';
import { validateProperties } from './scripts/validate-properties.js';

export default function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({"src/_includes/js": "js"});
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

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

  // Count properties by attribute value
  eleventyConfig.addNunjucksFilter('countByAttribute', (collection, attribute, value) => {
    if (!collection || !Array.isArray(collection)) return 0;
    return collection.filter(item => item[attribute] === value).length;
  });

  // Number formatting filter for prices
  eleventyConfig.addNunjucksFilter('formatNumber', (value) => {
    if (!value && value !== 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  });

  // Add date filter for formatting dates
  eleventyConfig.addNunjucksFilter('dateFilter', (date, format) => {
    if (!date) {
      date = new Date();
    }
    if (format === '%Y-%m-%d') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date.toISOString();
  });

  // Add global for current date
  eleventyConfig.addNunjucksGlobal('now', new Date());

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
