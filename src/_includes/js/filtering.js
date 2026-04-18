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
   * Storage key for filter persistence
   * @const {string}
   */
  const FILTER_STATE_KEY = 'ppiproperties-filter-state';

  /**
   * Check if localStorage is available
   * Feature detection for localStorage support with error handling
   *
   * @returns {boolean} True if localStorage is available and writable
   */
  function isLocalStorageAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the value from a filter element (handles both selects and radio buttons)
   *
   * @param {string} filterName - The data-filter attribute value
   * @returns {string} The selected value or empty string
   */
  function getFilterValue(filterName) {
    // First try to find a checked radio button
    const checkedRadio = document.querySelector('[data-filter="' + filterName + '"]:checked');
    if (checkedRadio) {
      return checkedRadio.value;
    }

    // Fall back to select/input element
    const element = document.querySelector('[data-filter="' + filterName + '"]');
    if (element) {
      return element.value;
    }

    return '';
  }

  /**
   * Get highlight filter values from checkboxes
   *
   * @returns {Array} Array of selected highlight filter values
   */
  function getHighlightFilters() {
    const highlights = [];
    const checkboxes = document.querySelectorAll('[data-filter="highlight"]:checked');
    checkboxes.forEach(cb => {
      if (cb.value) {
        highlights.push(cb.value);
      }
    });
    return highlights;
  }

  /**
   * Get current filter values from form controls
   *
   * @returns {Object} Filter object with type, priceMin, priceMax, bedrooms, bathrooms, location, highlights
   */
  function getFilterValues() {
    // Read values - handles both radio buttons and select elements
    const type = getFilterValue('type');
    const priceMinStr = getFilterValue('price-min');
    const priceMaxStr = getFilterValue('price-max');
    const bedroomsStr = getFilterValue('bedrooms');
    const bathroomsStr = getFilterValue('bathrooms');
    const location = getFilterValue('location');
    const highlights = getHighlightFilters();

    // Convert numeric values, handling empty strings and invalid numbers
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : null;
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : null;
    const bedrooms = bedroomsStr ? parseInt(bedroomsStr, 10) : null;
    const bathrooms = bathroomsStr ? parseInt(bathroomsStr, 10) : null;

    // Validate numeric conversions (treat NaN as null)
    // For price, 0 means "Any" so treat as null
    // For priceMax, use dynamic PRICE_MAX from filter-bar or fallback to checking if at slider max
    const sliderMax = window.PRICE_MAX || 50000000;
    return {
      type: type || null,
      priceMin: (priceMin !== null && !isNaN(priceMin) && priceMin > 0) ? priceMin : null,
      priceMax: (priceMax !== null && !isNaN(priceMax) && priceMax > 0 && priceMax < sliderMax) ? priceMax : null,
      bedrooms: (bedrooms !== null && !isNaN(bedrooms) && bedrooms > 0) ? bedrooms : null,
      bathrooms: (bathrooms !== null && !isNaN(bathrooms) && bathrooms > 0) ? bathrooms : null,
      location: location || null,
      highlights: highlights.length > 0 ? highlights : null
    };
  }

  /**
   * Get filter state as a clean object (only including non-null values)
   * Used for persistence - excludes empty filter values
   *
   * @returns {Object} Filter state object ready for storage
   */
  function getFilterState() {
    const filters = getFilterValues();
    // Create clean state object - only include filters that are actually set (non-null)
    const state = {};

    if (filters.type !== null) state.type = filters.type;
    if (filters.priceMin !== null) state.priceMin = filters.priceMin;
    if (filters.priceMax !== null) state.priceMax = filters.priceMax;
    if (filters.bedrooms !== null) state.bedrooms = filters.bedrooms;
    if (filters.bathrooms !== null) state.bathrooms = filters.bathrooms;
    if (filters.location !== null) state.location = filters.location;

    return state;
  }

  /**
   * Save filter state to localStorage
   * Stores current filter selections for restoration on return
   *
   * @param {Object} filterState - Filter state object to save
   */
  function saveFilterState(filterState) {
    // Validate input parameter
    if (!filterState || typeof filterState !== 'object') {
      return; // Invalid state, do not save
    }

    if (!isLocalStorageAvailable()) {
      return; // Silently fail if localStorage unavailable
    }

    try {
      const stateJson = JSON.stringify(filterState);
      localStorage.setItem(FILTER_STATE_KEY, stateJson);
    } catch (e) {
      // Handle storage quota exceeded or other errors
      console.warn('Failed to save filter state:', e);
    }
  }

  /**
   * Load filter state from localStorage
   * Retrieves previously saved filter selections
   *
   * @returns {Object|null} Filter state object or null if no state saved
   */
  function loadFilterState() {
    if (!isLocalStorageAvailable()) {
      return null;
    }

    try {
      const stateJson = localStorage.getItem(FILTER_STATE_KEY);
      if (!stateJson) {
        return null;
      }

      const state = JSON.parse(stateJson);

      // Validate loaded state (basic validation)
      if (typeof state === 'object' && state !== null) {
        return state;
      }

      return null;
    } catch (e) {
      // Handle JSON parse errors or other issues
      console.warn('Failed to load filter state:', e);
      return null;
    }
  }

  /**
   * Set a filter value (handles both radio buttons and select/input elements)
   *
   * @param {string} filterName - The data-filter attribute value
   * @param {string} value - The value to set
   */
  function setFilterValue(filterName, value) {
    const valueStr = String(value);

    // Try to find and check a radio button with matching value
    const radioSelector = '[data-filter="' + filterName + '"][value="' + valueStr + '"]';
    const radio = document.querySelector(radioSelector);
    if (radio && radio.type === 'radio') {
      radio.checked = true;
      return;
    }

    // Fall back to setting value on select/input element
    const element = document.querySelector('[data-filter="' + filterName + '"]');
    if (element) {
      element.value = valueStr;
    }
  }

  /**
   * Restore filter state by applying saved values to form controls
   * Called on page load to restore previous filter selections
   */
  function restoreFilterState() {
    const state = loadFilterState();
    if (!state) {
      return; // No saved state, nothing to restore
    }

    try {
      // Apply each saved filter value to corresponding form control
      if (typeof state.type === 'string' && state.type) {
        setFilterValue('type', state.type);
      }

      if (typeof state.priceMin === 'number') {
        setFilterValue('price-min', state.priceMin);
      }

      if (typeof state.priceMax === 'number') {
        setFilterValue('price-max', state.priceMax);
      }

      if (typeof state.bedrooms === 'number') {
        setFilterValue('bedrooms', state.bedrooms);
      }

      if (typeof state.bathrooms === 'number') {
        setFilterValue('bathrooms', state.bathrooms);
      }

      if (typeof state.location === 'string' && state.location) {
        setFilterValue('location', state.location);
      }

      // Trigger filtering to show correct results based on restored filters
      handleFilterChange();
    } catch (e) {
      console.warn('Error restoring filter state:', e);
    }
  }

  /**
   * Clear filter state from localStorage
   * Used when user explicitly clicks "Clear All Filters"
   */
  function clearFilterState() {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(FILTER_STATE_KEY);
    } catch (e) {
      console.warn('Failed to clear filter state:', e);
    }
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
    if (!filters.type && !filters.priceMin && !filters.priceMax && !filters.bedrooms && !filters.bathrooms && !filters.location && !filters.highlights) {
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

      // Bathrooms filter (property must have >= selected bathrooms)
      if (filters.bathrooms !== null && property.bathrooms !== undefined && property.bathrooms !== null) {
        if (property.bathrooms < filters.bathrooms) {
          return false;
        }
      } else if (filters.bathrooms !== null && (property.bathrooms === undefined || property.bathrooms === null || property.bathrooms === 0)) {
        // Exclude property if filter is active but property has no/zero bathrooms
        return false;
      }

      // Location filter (supports comma-separated list of locations)
      // Checks both suburb (property.location) and city (property.city) fields
      if (filters.location && filters.location.length > 0) {
        if (!property.location && !property.city) {
          // Exclude property if filter is active but property has no location/city
          return false;
        }
        // Check if property location OR city matches any of the selected locations
        const selectedLocations = filters.location.split(',').map(l => l.trim().toLowerCase());
        const propertyLocationLower = (property.location || '').toLowerCase();
        const propertyCityLower = (property.city || '').toLowerCase();
        const matchesLocation = selectedLocations.includes(propertyLocationLower);
        const matchesCity = selectedLocations.includes(propertyCityLower);
        const matches = matchesLocation || matchesCity;
        // Log first few comparisons for debugging
        if (properties.indexOf(property) < 3) {
          console.log('[Filter Debug] Location check - suburb:', property.location, 'city:', property.city, 'selectedLocations:', selectedLocations, 'matches:', matches);
        }
        if (!matches) {
          return false;
        }
      }

      // Highlight filters (energy features, pets, etc.)
      // Property must have ALL selected highlights (AND logic)
      if (filters.highlights && filters.highlights.length > 0) {
        for (const highlight of filters.highlights) {
          // Handle petsAllowed separately as it's a top-level property
          if (highlight === 'petsAllowed') {
            if (!property.petsAllowed) {
              return false;
            }
          } else {
            // Check in property.highlights object
            if (!property.highlights || !property.highlights[highlight]) {
              return false;
            }
          }
        }
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
   * Uses show/hide approach to preserve the original OneRoof-style cards
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

      // Get set of filtered property IDs for quick lookup
      const filteredIds = new Set(filteredProperties.map(p => String(p.id)));

      // Get all property cards
      const allCards = propertyList.querySelectorAll('.property-card');

      // Remove any existing "no results" message
      const existingNoResults = propertyList.querySelector('.no-results-message');
      if (existingNoResults) {
        existingNoResults.remove();
      }

      // Show/hide each card based on whether it's in filtered results
      allCards.forEach(card => {
        const propertyId = card.getAttribute('data-property-id');
        if (filteredIds.has(propertyId)) {
          card.style.display = '';
          card.removeAttribute('hidden');
        } else {
          card.style.display = 'none';
          card.setAttribute('hidden', '');
        }
      });

      // Handle no results case - add a message
      if (filteredProperties.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message col-span-full text-center py-8';
        noResultsDiv.innerHTML = `
          <div class="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <p class="text-lg text-gray-700 mb-2 font-medium">No properties match your criteria</p>
            <p class="text-sm text-gray-500">Try adjusting your filters or clearing some selections.</p>
          </div>
        `;
        propertyList.appendChild(noResultsDiv);
      }

      // Update results counter
      if (resultsHeader) {
        if (filteredProperties.length === totalProperties) {
          resultsHeader.innerHTML = `We found <strong>${filteredProperties.length}</strong> properties for sale`;
        } else {
          resultsHeader.innerHTML = `Showing <strong>${filteredProperties.length}</strong> of ${totalProperties} properties`;
        }
      }
    } catch (error) {
      console.error('Error updating property grid:', error);
    }
  }

  /**
   * Handle filter change event
   * Reads current filter values, filters properties, updates the DOM, and saves state
   */
  function handleFilterChange() {
    try {
      if (typeof allProperties === 'undefined') {
        console.error('[Filter Debug] Properties data not available');
        return;
      }

      const filters = getFilterValues();
      console.log('[Filter Debug] handleFilterChange - filters:', JSON.stringify(filters));
      console.log('[Filter Debug] handleFilterChange - total properties:', allProperties.length);

      const filtered = filterProperties(allProperties, filters);
      console.log('[Filter Debug] handleFilterChange - filtered count:', filtered.length);

      updatePropertyGrid(filtered, allProperties.length);

      // Save filter state for persistence across navigation
      const state = getFilterState();
      saveFilterState(state);
    } catch (error) {
      console.error('Error handling filter change:', error);
    }
  }

  /**
   * Reset a filter to its default "Any" value (handles radio buttons and selects)
   *
   * @param {string} filterName - The data-filter attribute value
   */
  function resetFilterValue(filterName) {
    // For radio buttons, check the one with empty value
    const emptyRadio = document.querySelector('[data-filter="' + filterName + '"][value=""]');
    if (emptyRadio && emptyRadio.type === 'radio') {
      emptyRadio.checked = true;
      return;
    }

    // For select elements, set to empty or first option
    const element = document.querySelector('[data-filter="' + filterName + '"]');
    if (element) {
      element.value = '';
    }
  }

  /**
   * Clear all filters and show all properties
   */
  function clearAllFilters() {
    try {
      // Reset all filter controls using the helper
      resetFilterValue('type');
      resetFilterValue('price-min');
      resetFilterValue('price-max');
      resetFilterValue('bedrooms');
      resetFilterValue('bathrooms');
      resetFilterValue('location');

      // Clear persisted filter state
      clearFilterState();

      // Show all properties
      handleFilterChange();
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  }

  /**
   * Expand a location parameter (province/city/suburb name) to matching suburbs
   * Uses lookup tables for case-insensitive matching
   * @param {string} locationParam - The location name from URL or filter
   * @returns {Array} Array of suburb names (+ city name for city matches)
   */
  function expandLocationSlug(locationParam) {
    console.log('[Filter Debug] expandLocationSlug called with:', locationParam);

    // Check if locationLookup is available (from new locations.json structure)
    const lookup = window.locationLookup || (window.locationData && window.locationData.lookup);
    if (!lookup) {
      console.warn('[Filter Debug] locationLookup NOT available, returning original');
      return [locationParam];
    }

    const paramLower = locationParam.toLowerCase();

    // Check if it's a province
    if (lookup.byProvince && lookup.byProvince[paramLower]) {
      const provinceData = lookup.byProvince[paramLower];
      const locations = [];
      // Include all cities and their suburbs
      provinceData.cities.forEach(cityName => {
        locations.push(cityName); // Include city name for city field matching
        const cityData = lookup.byCity[cityName.toLowerCase()];
        if (cityData) {
          locations.push(...cityData.suburbs);
        }
      });
      console.log('[Filter Debug] Matched PROVINCE:', provinceData.province, '-> locations:', locations);
      return locations;
    }

    // Check if it's a city
    if (lookup.byCity && lookup.byCity[paramLower]) {
      const cityData = lookup.byCity[paramLower];
      // Include the city name itself so properties with matching city field are found
      const locations = [cityData.city, ...cityData.suburbs];
      console.log('[Filter Debug] Matched CITY:', cityData.city, '-> locations:', locations);
      return locations;
    }

    // Check if it's a suburb
    if (lookup.bySuburb && lookup.bySuburb[paramLower]) {
      const suburbData = lookup.bySuburb[paramLower];
      console.log('[Filter Debug] Matched SUBURB:', suburbData.suburb);
      return [suburbData.suburb];
    }

    // No match found - return original value
    console.warn('[Filter Debug] No match found for:', locationParam, '- returning as-is');
    return [locationParam];
  }

  /**
   * Get display name for a location
   * Uses lookup tables for case-insensitive matching
   * @param {string} locationParam - The location name
   * @returns {string} Display name (preserves original case)
   */
  function getLocationDisplayName(locationParam) {
    const lookup = window.locationLookup || (window.locationData && window.locationData.lookup);
    if (!lookup) {
      return locationParam;
    }

    const paramLower = locationParam.toLowerCase();

    // Check province
    if (lookup.byProvince && lookup.byProvince[paramLower]) {
      return lookup.byProvince[paramLower].province;
    }

    // Check city
    if (lookup.byCity && lookup.byCity[paramLower]) {
      return lookup.byCity[paramLower].city;
    }

    // Check suburb
    if (lookup.bySuburb && lookup.bySuburb[paramLower]) {
      return lookup.bySuburb[paramLower].suburb;
    }

    return locationParam;
  }

  /**
   * Parse URL query parameters and apply as filters
   * Handles ?location=xxx from breadcrumb links
   */
  function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    let hasUrlFilters = false;

    // Check for location parameter
    const locationParam = urlParams.get('location');
    console.log('[Filter Debug] applyUrlFilters - URL location param:', locationParam);

    if (locationParam) {
      // Expand location slug to suburbs (handles province/city/suburb)
      const expandedLocations = expandLocationSlug(locationParam);
      const locationValue = expandedLocations.join(',');
      console.log('[Filter Debug] applyUrlFilters - expanded to:', locationValue);

      // Set the location filter value
      const locationInput = document.getElementById('location-filter-value');
      if (locationInput) {
        locationInput.value = locationValue;
        hasUrlFilters = true;
        console.log('[Filter Debug] applyUrlFilters - set hidden input value:', locationInput.value);
      } else {
        console.warn('[Filter Debug] applyUrlFilters - location-filter-value element NOT FOUND');
      }

      // Update the location button label with display name
      const locationBtnLabel = document.getElementById('location-btn-label');
      const locationBtn = document.getElementById('location-filter-btn');
      if (locationBtnLabel && locationBtn) {
        locationBtnLabel.textContent = getLocationDisplayName(locationParam);
        locationBtn.classList.add('active');
      }

      // Update selectedLocations in filter-bar.html scope if available
      if (typeof window.setSelectedLocations === 'function') {
        window.setSelectedLocations(expandedLocations);
        console.log('[Filter Debug] applyUrlFilters - called setSelectedLocations');
      } else {
        console.warn('[Filter Debug] applyUrlFilters - setSelectedLocations NOT available');
      }
    }

    return hasUrlFilters;
  }

  /**
   * Initialize filtering on page load
   * Sets up event listeners, restores filter state, and displays initial property list
   */
  function initFiltering() {
    try {
      // Check if properties data is available
      if (typeof allProperties === 'undefined') {
        console.error('Properties data not available. Make sure allProperties is defined before loading filtering.js');
        return;
      }

      // Add event listeners to ALL filter controls (both radio buttons and selects)
      // For radio buttons, we need to add listeners to each one
      const allFilterInputs = document.querySelectorAll('[data-filter]');
      allFilterInputs.forEach(function(input) {
        const filterType = input.getAttribute('data-filter');

        // Use 'change' event for radio buttons and selects
        if (input.type === 'radio' || input.tagName === 'SELECT') {
          input.addEventListener('change', handleFilterChange);
        } else {
          // Use 'input' event for text inputs (like price range inputs)
          input.addEventListener('input', handleFilterChange);
        }
      });

      // Clear button
      const clearButton = document.querySelector('[data-filter-action="clear"]');
      if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
      }

      // First check for URL parameters (from breadcrumb links)
      const hasUrlFilters = applyUrlFilters();

      if (hasUrlFilters) {
        // Clear any old localStorage state when coming from URL
        clearFilterState();
        // URL filters take priority - apply them
        handleFilterChange();
        // Clear URL params after applying (clean URL)
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // Restore filter state if available (will trigger handleFilterChange internally)
        const savedState = loadFilterState();
        if (savedState) {
          restoreFilterState();
        } else {
          // No filter state was restored, show all properties initially
          updatePropertyGrid(allProperties, allProperties.length);
        }
      }
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

  // Expose functions to window for external use (by filter-bar.html)
  window.filterProperties = handleFilterChange;
  window.applyPropertyFilters = handleFilterChange;

})();
