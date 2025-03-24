# Future Database Integration for Bio-Materials Dashboard

This document outlines the plan for integrating the Bio-Materials Dashboard with a Verdatica database of biobased materials in the future. The current implementation uses Manus's search capabilities to provide dynamic search results, and this document describes how to extend this functionality to also query a custom database.

## Current Architecture

The current implementation consists of:

1. **Frontend UI** - HTML/CSS/JavaScript interface for user interactions
2. **Manus API Client** - JavaScript module that handles search requests to Manus
3. **Search Interface** - JavaScript module that connects the UI with the Manus API client

## Future Database Integration Plan

### 1. Database Schema Design

Based on the current implementation, we recommend a database schema that includes the following tables:

#### Materials Table
- `id` (Primary Key)
- `name` (String)
- `type` (String) - e.g., Bioplastic, Biocomposite, Natural Fiber
- `subtype` (String) - e.g., PLA, Foam, Film
- `description` (Text)
- `thumbnail_url` (String)
- `source` (String)
- `url` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### Sustainability Properties Table
- `id` (Primary Key)
- `material_id` (Foreign Key)
- `biodegradable` (Boolean)
- `compostable` (Boolean)
- `recyclable` (Boolean)
- `biobased_content` (Integer) - percentage

#### Applications Table
- `id` (Primary Key)
- `name` (String) - e.g., Packaging, Automotive, Construction

#### Material Applications Junction Table
- `material_id` (Foreign Key)
- `application_id` (Foreign Key)

### 2. API Layer Design

Create a RESTful API with the following endpoints:

#### Search Endpoint
```
GET /api/materials/search
```
Parameters:
- `q` (String) - Search query
- `type[]` (Array) - Filter by material type
- `application[]` (Array) - Filter by application
- `sustainability[]` (Array) - Filter by sustainability properties
- `min_biobased_content` (Integer) - Minimum biobased content percentage

Response:
```json
{
  "query": "search query",
  "results": [
    {
      "id": "mat-1",
      "name": "BioPLA+",
      "type": "Bioplastic",
      "subtype": "PLA",
      "description": "A high-performance PLA-based bioplastic...",
      "thumbnail": "https://example.com/images/biopla.jpg",
      "sustainability": {
        "biodegradable": true,
        "compostable": true,
        "recyclable": false,
        "biobased_content": 90
      },
      "applications": ["Packaging", "Consumer goods"],
      "source": "Verdatica Database",
      "url": "https://example.com/materials/biopla"
    },
    // More results...
  ],
  "total_results": 10
}
```

#### Material Details Endpoint
```
GET /api/materials/:id
```
Response: Detailed information about a specific material.

### 3. Integration with Current Implementation

#### Update the Manus API Client

Modify the `manus-api.js` file to include a new function for querying the Verdatica database:

```javascript
/**
 * Performs a search using the Verdatica database
 * @param {string} query - The user's search query
 * @param {Object} filters - Optional filters to apply to the search
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function searchVerdaticaDatabase(query, filters = {}) {
  try {
    // Create API request URL with query parameters
    const apiUrl = new URL('https://api.verdatica.com/materials/search');
    apiUrl.searchParams.append('q', query);
    
    // Add filters to request
    if (filters.materialType && filters.materialType.length > 0) {
      filters.materialType.forEach(type => {
        apiUrl.searchParams.append('type[]', type);
      });
    }
    
    // Add more filter parameters...
    
    // Fetch results from API
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and normalize the results
    return processVerdaticaResults(data);
  } catch (error) {
    console.error('Error searching Verdatica database:', error);
    throw error;
  }
}

/**
 * Processes and normalizes Verdatica database results
 * @param {Object} data - The raw data from the Verdatica API
 * @returns {Object} - Normalized search results
 */
function processVerdaticaResults(data) {
  // Transform API response to match our display format
  // Similar to processSearchResults function
  
  return {
    query: data.query,
    detailedResults: data.results.slice(0, MANUS_CONFIG.maxDetailedResults),
    additionalResults: data.results.slice(
      MANUS_CONFIG.maxDetailedResults,
      MANUS_CONFIG.maxDetailedResults + MANUS_CONFIG.maxAdditionalResults
    ),
    totalResults: data.total_results
  };
}
```

#### Add Combined Search Function

Add a function to search both Manus and the Verdatica database:

```javascript
/**
 * Performs a search using both Manus and the Verdatica database
 * @param {string} query - The user's search query
 * @param {Object} filters - Optional filters to apply to the search
 * @param {Object} options - Search options
 * @returns {Promise<Object>} - Promise resolving to combined search results
 */
async function searchCombined(query, filters = {}, options = {}) {
  try {
    // Determine which sources to search based on options
    const searchSources = options.sources || ['manus', 'verdatica'];
    const results = { detailedResults: [], additionalResults: [], totalResults: 0 };
    
    // Search Manus if enabled
    if (searchSources.includes('manus')) {
      try {
        const manusResults = await searchWithManus(query, filters);
        results.detailedResults = results.detailedResults.concat(manusResults.detailedResults);
        results.additionalResults = results.additionalResults.concat(manusResults.additionalResults);
        results.totalResults += manusResults.totalResults;
      } catch (error) {
        console.error('Error searching with Manus:', error);
      }
    }
    
    // Search Verdatica database if enabled
    if (searchSources.includes('verdatica')) {
      try {
        const verdaticaResults = await searchVerdaticaDatabase(query, filters);
        results.detailedResults = results.detailedResults.concat(verdaticaResults.detailedResults);
        results.additionalResults = results.additionalResults.concat(verdaticaResults.additionalResults);
        results.totalResults += verdaticaResults.totalResults;
      } catch (error) {
        console.error('Error searching Verdatica database:', error);
      }
    }
    
    // Deduplicate results based on material name or ID
    results.detailedResults = deduplicateResults(results.detailedResults);
    results.additionalResults = deduplicateResults(results.additionalResults);
    
    // Limit the number of results
    results.detailedResults = results.detailedResults.slice(0, MANUS_CONFIG.maxDetailedResults);
    results.additionalResults = results.additionalResults.slice(0, MANUS_CONFIG.maxAdditionalResults);
    
    return results;
  } catch (error) {
    console.error('Error in combined search:', error);
    throw error;
  }
}

/**
 * Deduplicates results based on material name
 * @param {Array} results - Array of search results
 * @returns {Array} - Deduplicated results
 */
function deduplicateResults(results) {
  const seen = new Set();
  return results.filter(result => {
    const key = result.name.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
```

#### Update the Search Interface

Modify the search interface to include a source selector:

```javascript
// Add source selector to the UI
function addSourceSelector() {
  const filtersContainer = document.querySelector('.bg-white.p-6.rounded-lg.shadow-md');
  
  if (filtersContainer) {
    const sourceSelector = document.createElement('div');
    sourceSelector.className = 'mb-6';
    sourceSelector.innerHTML = `
      <h3 class="font-medium text-gray-700 mb-2">Search Sources</h3>
      <div class="space-y-2">
        <div class="flex items-center">
          <input type="checkbox" id="source-manus" class="hidden filter-checkbox" checked>
          <label for="source-manus" class="flex-1 px-3 py-2 border border-green-500 bg-green-50 text-green-700 rounded-md text-sm cursor-pointer transition-colors">
            Manus Search
          </label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="source-verdatica" class="hidden filter-checkbox" checked>
          <label for="source-verdatica" class="flex-1 px-3 py-2 border border-green-500 bg-green-50 text-green-700 rounded-md text-sm cursor-pointer transition-colors">
            Verdatica Database
          </label>
        </div>
      </div>
    `;
    
    // Insert before the Apply Filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
      const parentElement = applyFiltersBtn.parentElement;
      parentElement.insertBefore(sourceSelector, applyFiltersBtn);
    }
    
    // Add event listeners for the source checkboxes
    document.getElementById('source-manus').addEventListener('change', updateSourceLabel);
    document.getElementById('source-verdatica').addEventListener('change', updateSourceLabel);
  }
}

// Update the label styling for source checkboxes
function updateSourceLabel(event) {
  const checkbox = event.target;
  const label = document.querySelector(`label[for="${checkbox.id}"]`);
  
  if (label) {
    if (checkbox.checked) {
      label.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
    } else {
      label.classList.remove('bg-green-50', 'border-green-500', 'text-green-700');
    }
  }
}

// Update performSearch function to use combined search
async function performSearch(query) {
  if (!query) {
    displayEmptyState();
    return;
  }
  
  try {
    // Determine which sources to search
    const sources = [];
    if (document.getElementById('source-manus').checked) {
      sources.push('manus');
    }
    if (document.getElementById('source-verdatica').checked) {
      sources.push('verdatica');
    }
    
    // Use the combined search function
    const searchResults = await window.ManusAPI.searchCombined(query, filters, { sources });
    
    // Display the results
    displayResults(searchResults);
  } catch (error) {
    console.error('Error performing search:', error);
    displayErrorState(error.message);
  }
}
```

### 4. Implementation Steps

1. **Database Setup**:
   - Create the database schema as outlined above
   - Populate with initial data from existing sources

2. **API Development**:
   - Develop a RESTful API following the design above
   - Implement authentication and rate limiting
   - Add comprehensive error handling

3. **Frontend Integration**:
   - Update the Manus API client with the new functions
   - Add the source selector to the UI
   - Modify the search interface to use the combined search

4. **Testing**:
   - Test the integration with sample data
   - Verify that both sources can be searched individually and together
   - Test error handling and edge cases

5. **Deployment**:
   - Deploy the database and API
   - Update the frontend code
   - Monitor performance and make adjustments as needed

## Conclusion

This integration plan provides a roadmap for extending the Bio-Materials Dashboard to include both Manus search capabilities and a custom Verdatica database. The modular design allows for flexibility in how these sources are used, and the combined search function provides a seamless experience for users.

By following this plan, the Bio-Materials Dashboard will become a comprehensive tool for finding and comparing biobased materials from multiple sources, providing users with the most relevant and up-to-date information available.
