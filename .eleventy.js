import { optimizeImages } from './scripts/optimize-images.js';

export default function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // Run image optimization before build
  eleventyConfig.on('eleventy.before', async () => {
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
