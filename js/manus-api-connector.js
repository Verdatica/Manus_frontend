/**
 * Manus API Connector
 * This module provides the actual connection to Manus API functionality
 */

/**
 * Makes a search request to Manus API
 * @param {string} query - The search query
 * @param {string} dateRange - Time range filter for search results
 * @returns {Promise<Array>} - Promise resolving to search results
 */
async function searchWithManusAPI(query, dateRange = 'all') {
    console.log(`Making Manus API request for: "${query}" with date range: ${dateRange}`);
    
    try {
        // Use the info_search_web tool from Manus
        const searchResults = await info_search_web({
            query: query,
            date_range: dateRange
        });
        
        // Transform the results to match our expected format
        return transformManusResults(searchResults);
    } catch (error) {
        console.error('Error calling Manus API:', error);
        throw new Error('Failed to retrieve results from Manus: ' + error.message);
    }
}

/**
 * Transforms Manus API results to match our expected format
 * @param {Object} manusResults - Raw results from Manus API
 * @returns {Array} - Transformed results
 */
function transformManusResults(manusResults) {
    // Check if we have valid results
    if (!manusResults || !Array.isArray(manusResults.results)) {
        return [];
    }
    
    // Map Manus results to our expected format
    return manusResults.results.map(result => ({
        title: result.title || 'Untitled Material',
        snippet: result.snippet || result.description || 'No description available',
        url: result.url || '#',
        source: result.source || 'Web search'
    }));
}

// Export the connector functions
window.ManusConnector = {
    searchWithManusAPI,
    transformManusResults
};
