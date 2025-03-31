/**
 * Manus API Search Results Formatter
 * This file enhances the search results formatting for Manus API responses
 */

// Create a formatter for Manus search results
const ManusResultsFormatter = {
    // Format search results with enhanced metadata
    formatResults: function(searchData) {
        if (!searchData || searchData.error) {
            return searchData;
        }
        
        // Add additional metadata to results
        if (searchData.detailedResults && Array.isArray(searchData.detailedResults)) {
            searchData.detailedResults = searchData.detailedResults.map(result => {
                return {
                    ...result,
                    // Add Manus-specific metadata
                    manus_enhanced: true,
                    // Add confidence score (simulated for now)
                    confidence: this.calculateConfidence(result),
                    // Add relevance indicators
                    relevance_factors: this.determineRelevanceFactors(result)
                };
            });
        }
        
        return searchData;
    },
    
    // Calculate a confidence score for the result (0-100)
    calculateConfidence: function(result) {
        let score = 70; // Base score
        
        // Adjust based on material type match
        if (result.type && result.type !== 'Biomaterial') {
            score += 10;
        }
        
        // Adjust based on sustainability properties
        if (result.sustainability) {
            if (result.sustainability.biodegradable) score += 5;
            if (result.sustainability.compostable) score += 5;
            if (result.sustainability.recyclable) score += 5;
            
            // Adjust based on bio-based content
            const bioContent = result.sustainability.biobased_content || 0;
            score += Math.min(10, bioContent / 10);
        }
        
        // Cap at 100
        return Math.min(100, score);
    },
    
    // Determine relevance factors for the result
    determineRelevanceFactors: function(result) {
        const factors = [];
        
        // Add material type as a factor
        if (result.type) {
            factors.push({
                type: 'material_type',
                value: result.type,
                weight: 0.3
            });
        }
        
        // Add sustainability properties as factors
        if (result.sustainability) {
            if (result.sustainability.biodegradable) {
                factors.push({
                    type: 'sustainability',
                    value: 'Biodegradable',
                    weight: 0.2
                });
            }
            
            if (result.sustainability.recyclable) {
                factors.push({
                    type: 'sustainability',
                    value: 'Recyclable',
                    weight: 0.2
                });
            }
            
            // Add bio-based content as a factor
            factors.push({
                type: 'bio_content',
                value: `${result.sustainability.biobased_content || 0}%`,
                weight: 0.15
            });
        }
        
        // Add applications as factors
        if (result.applications && result.applications.length > 0) {
            result.applications.forEach(app => {
                factors.push({
                    type: 'application',
                    value: app,
                    weight: 0.25 / result.applications.length
                });
            });
        }
        
        return factors;
    },
    
    // Enhance the display of search results with Manus-specific features
    enhanceResultsDisplay: function(searchData) {
        // Format the results
        const formattedResults = this.formatResults(searchData);
        
        // Add Manus-specific display enhancements
        formattedResults.manus_enhanced = true;
        formattedResults.search_timestamp = new Date().toISOString();
        
        return formattedResults;
    }
};

// Override the processSearchResults function to use the formatter
const originalProcessSearchResults = window.ManusAPI.processSearchResults;
window.ManusAPI.processSearchResults = function(searchResults) {
    // Call the original function
    const processedResults = originalProcessSearchResults(searchResults);
    
    // Enhance the results with Manus-specific formatting
    return ManusResultsFormatter.enhanceResultsDisplay(processedResults);
};

// Export the formatter
window.ManusResultsFormatter = ManusResultsFormatter;
