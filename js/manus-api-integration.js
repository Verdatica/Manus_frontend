/**
 * Manus API Integration for Bio-Materials Dashboard
 * This file updates the performManusSearch function to use real Manus API calls
 */

// Update the performManusSearch function to use the Manus API connector
async function performManusSearch(query, filters) {
    try {
        // Prepare search parameters based on filters
        let dateRange = 'all';
        if (filters.recentOnly) {
            dateRange = 'past_year';
        }
        
        console.log(`Performing Manus search for: "${query}" with date range: ${dateRange}`);
        
        // Use the Manus API connector to perform the actual search
        const results = await window.ManusConnector.searchWithManusAPI(query, dateRange);
        
        return {
            query: query,
            results: results
        };
    } catch (error) {
        console.error('Error in Manus search:', error);
        throw new Error('Failed to perform search with Manus: ' + error.message);
    }
}

// Replace the original performManusSearch function with our updated version
window.ManusAPI.performManusSearch = performManusSearch;
