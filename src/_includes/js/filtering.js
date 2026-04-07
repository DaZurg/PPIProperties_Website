/**
 * Property Filtering Logic for PPIProperties_Website
 *
 * This module provides client-side filtering functionality for property listings.
 * Filters properties based on user selections in the filter bar without server requests.
 *
 * @author Claude Sonnet 4.5
 * @date 2026-04-06
 */

(function() {
  'use strict';

  /**
   * Get current filter values from form controls
   *
   * @returns {Object} Filter object with type, priceMin, priceMax, bedrooms, location
   */
  function getFilterValues() {
    const typeElement = document.querySelector('[data-filter="type"]');
    const priceMinElement = document.querySelector('[data-filter="price-min"]');
    const priceMaxElement = document.querySelector('[data-filter="price-max"]');
    const bedroomsElement = document.querySelector('[data-filter="bedrooms"]');
    const locationElement = document.querySelector('[data-filter="location"]');

    // Read values and convert to appropriate types
    const type = typeElement ? typeElement.value : '';
    const priceMinStr = priceMinElement ? priceMinElement.value : '';
    const priceMaxStr = priceMaxElement ? priceMaxElement.value : '';
    const bedroomsStr = bedroomsElement ? bedroomsElement.value : '';
    const location = locationElement ? locationElement.value : '';

    // Convert numeric values, handling empty strings and invalid numbers
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : null;
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : null;
    const bedrooms = bedroomsStr ? parseInt(bedroomsStr, 10) : null;

    // Validate numeric conversions (treat NaN as null)
    return {
      type: type || null,
      priceMin: (priceMin !== null && !isNaN(priceMin) && priceMin >= 0) ? priceMin : null,
      priceMax: (priceMax !== null && !isNaN(priceMax) && priceMax >= 0) ? priceMax : null,
      bedrooms: (bedrooms !== null && !isNaN(bedrooms) && bedrooms >= 0) ? bedrooms : null,
      location: location || null
    };
  }

  /**
   * Filter properties based on filter criteria
   * Uses AND logic - property must match ALL selected filters to be included
   *
   * @param {Array} properties - Array of property objects
   * @param {Object} filters - Filter criteria object
   * @returns {Array} Filtered properties array
   */
  function filterProperties(properties, filters) {
    // Handle edge case: empty properties array
    if (!properties || properties.length === 0) {
      return [];
    }

    // Handle edge case: no filters selected - return all properties
    if (!filters.type && !filters.priceMin && !filters.priceMax && !filters.bedrooms && !filters.location) {
      return properties;
    }

    return properties.filter(property => {
      // Property type filter (case-insensitive)
      if (filters.type && property.propertyType) {
        if (property.propertyType.toLowerCase() !== filters.type.toLowerCase()) {
          return false;
        }
      } else if (filters.type && !property.propertyType) {
        // Exclude property if filter is active but property has no type
        return false;
      }

      // Price min filter
      if (filters.priceMin !== null && property.price !== undefined && property.price !== null) {
        if (property.price < filters.priceMin) {
          return false;
        }
      } else if (filters.priceMin !== null && (property.price === undefined || property.price === null)) {
        // Exclude property if filter is active but property has no price
        return false;
      }

      // Price max filter
      if (filters.priceMax !== null && property.price !== undefined && property.price !== null) {
        if (property.price > filters.priceMax) {
          return false;
        }
      } else if (filters.priceMax !== null && (property.price === undefined || property.price === null)) {
        // Exclude property if filter is active but property has no price
        return false;
      }

      // Bedrooms filter (property must have >= selected bedrooms)
      if (filters.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms !== null) {
        if (property.bedrooms < filters.bedrooms) {
          return false;
        }
      } else if (filters.bedrooms !== null && (property.bedrooms === undefined || property.bedrooms === null || property.bedrooms === 0)) {
        // Exclude property if filter is active but property has no/zero bedrooms
        return false;
      }

      // Location filter (case-insensitive)
      if (filters.location && property.location) {
        if (property.location.toLowerCase() !== filters.location.toLowerCase()) {
          return false;
        }
      } else if (filters.location && !property.location) {
        // Exclude property if filter is active but property has no location
        return false;
      }

      // Property passes all filters
      return true;
    });
  }

  /**
   * Format number with thousands separators
   *
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Count parking spaces from features array
   *
   * @param {Array} features - Property features array
   * @returns {number} Number of parking spaces
   */
  function countParkingSpaces(features) {
    if (!features || !Array.isArray(features)) {
      return 0;
    }

    let count = 0;
    features.forEach(feature => {
      const featureLower = feature.toLowerCase();
      if (featureLower.includes('garage') || featureLower.includes('parking') || featureLower.includes('carport')) {
        count++;
      }
    });
    return count;
  }

  /**
   * Check if property is pet-friendly
   *
   * @param {Array} features - Property features array
   * @returns {boolean} True if pet-friendly
   */
  function isPetFriendly(features) {
    if (!features || !Array.isArray(features)) {
      return false;
    }

    // Use word boundary regex to avoid false positives (e.g., "carpet" matching "pet")
    const petRegex = /\bpet\b/i;
    return features.some(feature => petRegex.test(feature));
  }

  /**
   * Escape HTML special characters to prevent XSS
   *
   * @param {string} str - String to escape
   * @returns {string} Escaped string safe for innerHTML
   */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Create HTML for a single property card
   *
   * @param {Object} property - Property object
   * @returns {string} HTML string for property card
   */
  function createPropertyCardHTML(property) {
    const imageUrl = (property.imageUrls && property.imageUrls.length > 0) ? property.imageUrls[0] : '';
    const priceDisplay = property.price ? `R${formatNumber(property.price)}` : 'POA';
    const bedroomsDisplay = property.bedrooms > 0 ? `${property.bedrooms} bed` : 'N/A';
    const bathroomsDisplay = property.bathrooms > 0 ? `${property.bathrooms} bath` : 'N/A';
    const parkingCount = countParkingSpaces(property.features);
    const parkingDisplay = parkingCount > 0 ? `${parkingCount} parking` : 'N/A';
    const petDisplay = isPetFriendly(property.features) ? 'Pets OK' : 'N/A';

    // Escape address for XSS protection and provide fallback
    const addressDisplay = escapeHtml(property.address) || 'Address Not Available';
    const altText = property.address ? ` at ${escapeHtml(property.address)}` : '';

    return `
      <article class="property-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300" data-property-id="${escapeHtml(property.id)}">
        <!-- Property Image -->
        <div class="w-full h-48 md:h-56 lg:h-64 bg-gray-200 overflow-hidden">
          ${imageUrl ? `
            <img
              src="${imageUrl}"
              alt="Property image${altText}"
              class="w-full h-full object-cover"
              loading="lazy"
              onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2218%22 text-anchor=%22middle%22 x=%22200%22 y=%22150%22%3EImage Not Available%3C/text%3E%3C/svg%3E';"
            />
          ` : `
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <span class="text-sm">No Image Available</span>
            </div>
          `}
        </div>

        <!-- Card Content -->
        <div class="p-4 md:p-6">
          <!-- Price -->
          <div class="text-2xl md:text-3xl font-bold text-green-600 mb-2">
            ${priceDisplay}
          </div>

          <!-- Address -->
          <h3 class="text-lg md:text-xl text-gray-900 mb-3 font-semibold">
            ${addressDisplay}
          </h3>

          <!-- Feature Icons -->
          <div class="flex flex-wrap gap-4 mb-4 text-gray-600 text-sm md:text-base">
            <!-- Bedrooms -->
            <div class="flex items-center gap-1">
              <span class="text-lg" aria-hidden="true">🛏️</span>
              <span>${bedroomsDisplay}</span>
            </div>

            <!-- Bathrooms -->
            <div class="flex items-center gap-1">
              <span class="text-lg" aria-hidden="true">🚿</span>
              <span>${bathroomsDisplay}</span>
            </div>

            <!-- Parking -->
            <div class="flex items-center gap-1">
              <span class="text-lg" aria-hidden="true">🅿️</span>
              <span>${parkingDisplay}</span>
            </div>

            <!-- Pet Friendly -->
            <div class="flex items-center gap-1">
              <span class="text-lg" aria-hidden="true">🐾</span>
              <span>${petDisplay}</span>
            </div>
          </div>

          <!-- View Details Button -->
          <a
            href="/properties/${property.id}/"
            class="inline-flex items-center justify-center w-full md:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[48px]"
          >
            View Details
          </a>
        </div>
      </article>
    `;
  }

  /**
   * Update property grid DOM with filtered results
   *
   * @param {Array} filteredProperties - Filtered properties to display
   * @param {number} totalProperties - Total number of properties (for counter)
   */
  function updatePropertyGrid(filteredProperties, totalProperties) {
    try {
      const propertyList = document.getElementById('property-list');
      const resultsHeader = document.getElementById('results-counter');

      if (!propertyList) {
        console.error('Property list container not found');
        return;
      }

      // Clear existing cards
      propertyList.innerHTML = '';

      // Handle no results case
      if (filteredProperties.length === 0) {
        propertyList.innerHTML = `
          <div class="col-span-full text-center py-8 text-gray-600">
            <p class="text-lg mb-2">No properties match your criteria.</p>
            <p class="text-sm">Try adjusting your filters or clearing all filters.</p>
          </div>
        `;

        if (resultsHeader) {
          resultsHeader.textContent = '0 Properties Found';
        }
        return;
      }

      // Render filtered properties
      const cardsHTML = filteredProperties.map(property => createPropertyCardHTML(property)).join('');
      propertyList.innerHTML = cardsHTML;

      // Update results counter
      if (resultsHeader) {
        const countText = filteredProperties.length === totalProperties
          ? `${filteredProperties.length} Properties Available`
          : `${filteredProperties.length} Properties Found`;
        resultsHeader.textContent = countText;
      }
    } catch (error) {
      console.error('Error updating property grid:', error);
    }
  }

  /**
   * Handle filter change event
   * Reads current filter values, filters properties, and updates the DOM
   */
  function handleFilterChange() {
    try {
      if (typeof allProperties === 'undefined') {
        console.error('Properties data not available');
        return;
      }

      const filters = getFilterValues();
      const filtered = filterProperties(allProperties, filters);
      updatePropertyGrid(filtered, allProperties.length);
    } catch (error) {
      console.error('Error handling filter change:', error);
    }
  }

  /**
   * Clear all filters and show all properties
   */
  function clearAllFilters() {
    try {
      // Reset all filter controls
      const typeElement = document.querySelector('[data-filter="type"]');
      const priceMinElement = document.querySelector('[data-filter="price-min"]');
      const priceMaxElement = document.querySelector('[data-filter="price-max"]');
      const bedroomsElement = document.querySelector('[data-filter="bedrooms"]');
      const locationElement = document.querySelector('[data-filter="location"]');

      if (typeElement) typeElement.value = '';
      if (priceMinElement) priceMinElement.value = '';
      if (priceMaxElement) priceMaxElement.value = '';
      if (bedroomsElement) bedroomsElement.value = '';
      if (locationElement) locationElement.value = '';

      // Show all properties
      handleFilterChange();
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  }

  /**
   * Initialize filtering on page load
   * Sets up event listeners and displays initial property list
   */
  function initFiltering() {
    try {
      // Check if properties data is available
      if (typeof allProperties === 'undefined') {
        console.error('Properties data not available. Make sure allProperties is defined before loading filtering.js');
        return;
      }

      // Add event listeners to all filter controls
      const typeElement = document.querySelector('[data-filter="type"]');
      const priceMinElement = document.querySelector('[data-filter="price-min"]');
      const priceMaxElement = document.querySelector('[data-filter="price-max"]');
      const bedroomsElement = document.querySelector('[data-filter="bedrooms"]');
      const locationElement = document.querySelector('[data-filter="location"]');
      const clearButton = document.querySelector('[data-filter-action="clear"]');

      if (typeElement) typeElement.addEventListener('change', handleFilterChange);
      if (priceMinElement) priceMinElement.addEventListener('input', handleFilterChange);
      if (priceMaxElement) priceMaxElement.addEventListener('input', handleFilterChange);
      if (bedroomsElement) bedroomsElement.addEventListener('change', handleFilterChange);
      if (locationElement) locationElement.addEventListener('change', handleFilterChange);
      if (clearButton) clearButton.addEventListener('click', clearAllFilters);

      // Show all properties initially (no filters active)
      updatePropertyGrid(allProperties, allProperties.length);
    } catch (error) {
      console.error('Error initializing filtering:', error);
    }
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFiltering);
  } else {
    initFiltering();
  }

})();
