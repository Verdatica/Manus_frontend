/**
 * Application-Specific Search Implementation for Bio-Materials Dashboard
 * This module integrates the context-aware search with the Manus API client
 */

/**
 * Performs a search using Manus capabilities with application-specific filtering
 * @param {string} query - The user's search query
 * @param {Object} filters - Optional filters to apply to the search
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function searchWithApplicationContext(query, filters = {}) {
    try {
        // Extract application context from the query
        const applicationContext = window.ContextAwareSearch.extractApplicationContext(query);
        console.log('Extracted application context:', applicationContext);
        
        // Enhance the query with context-specific terms
        const enhancedQuery = window.ContextAwareSearch.enhanceQueryWithContext(query, applicationContext);
        
        // Create a loading state indicator
        showLoadingState();
        
        // Get search results using the enhanced query
        const searchResults = await performManusSearchWithContext(enhancedQuery, filters, applicationContext);
        
        // Process and normalize the results
        const processedResults = processSearchResultsWithContext(searchResults, applicationContext);
        
        // Remove loading state
        hideLoadingState();
        
        return processedResults;
    } catch (error) {
        hideLoadingState();
        console.error('Error searching with application context:', error);
        return {
            error: true,
            message: 'An error occurred while searching. Please try again.',
            results: []
        };
    }
}

/**
 * Performs the actual search using Manus capabilities with application context
 * @param {string} query - The enhanced search query
 * @param {Object} filters - Filters to apply to the search
 * @param {Object} applicationContext - The application context extracted from the query
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function performManusSearchWithContext(query, filters, applicationContext) {
    try {
        console.log(`Performing context-aware search for: "${query}" with application context:`, applicationContext);
        
        // In a real implementation, this would use the Manus API directly
        // For now, we'll use our enhanced materials data
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Use the enhanced materials data
                const materials = window.EnhancedMaterialsData.ENHANCED_MATERIALS;
                
                // Filter materials based on the query and application context
                const filteredMaterials = filterMaterialsByQueryAndContext(materials, query, applicationContext);
                
                // Format the results to match the expected structure
                const results = filteredMaterials.map(material => ({
                    title: material.name,
                    snippet: material.description,
                    url: material.url,
                    source: material.source,
                    // Add the full material data for use in processing
                    material_data: material
                }));
                
                resolve({
                    query: query,
                    results: results
                });
            }, 1000);
        });
    } catch (error) {
        console.error('Error in context-aware search:', error);
        throw new Error('Failed to perform search with application context: ' + error.message);
    }
}

/**
 * Filters materials based on query and application context
 * @param {Array} materials - The materials to filter
 * @param {string} query - The search query
 * @param {Object} applicationContext - The application context
 * @returns {Array} - Filtered materials
 */
function filterMaterialsByQueryAndContext(materials, query, applicationContext) {
    const lowerQuery = query.toLowerCase();
    
    // First, filter materials that match the query terms
    let matchingMaterials = materials.filter(material => {
        const searchableText = (
            material.name.toLowerCase() + ' ' + 
            material.type.toLowerCase() + ' ' + 
            (material.subtype ? material.subtype.toLowerCase() : '') + ' ' + 
            material.description.toLowerCase()
        );
        
        // Check if the material matches the query
        return searchableText.includes(lowerQuery) || 
               lowerQuery.split(' ').some(term => searchableText.includes(term));
    });
    
    // If we have application context, apply additional filtering
    if (applicationContext) {
        // Filter by product type
        if (applicationContext.productType) {
            const productInfo = window.ApplicationMapping.PRODUCT_TYPES[applicationContext.productType];
            if (productInfo) {
                // Check if the material is suitable for this product type
                matchingMaterials = matchingMaterials.filter(material => {
                    // Check if material type is suitable
                    const isTypeMatch = productInfo.materialTypes.includes(material.type);
                    
                    // Check if subtype is not excluded
                    const isSubtypeOk = !material.subtype || 
                                       !productInfo.excludedSubtypes.includes(material.subtype);
                    
                    // Check if the material is explicitly suitable for this product
                    const isSuitableFor = material.suitable_for && 
                                         productInfo.terms.some(term => 
                                             material.suitable_for.some(suitableItem => 
                                                 suitableItem.toLowerCase().includes(term.toLowerCase())
                                             )
                                         );
                    
                    // Check if the material is explicitly not suitable for this product
                    const isNotSuitableFor = material.not_suitable_for && 
                                           productInfo.terms.some(term => 
                                               material.not_suitable_for.some(notSuitableItem => 
                                                   notSuitableItem.toLowerCase().includes(term.toLowerCase())
                                               )
                                           );
                    
                    return (isTypeMatch && isSubtypeOk && !isNotSuitableFor) || isSuitableFor;
                });
            }
        }
        
        // Filter by application category
        if (applicationContext.applicationCategory && matchingMaterials.length > 0) {
            const categoryInfo = window.ApplicationMapping.APPLICATION_CATEGORIES[applicationContext.applicationCategory];
            if (categoryInfo) {
                // Check if the material is suitable for this application category
                matchingMaterials = matchingMaterials.filter(material => {
                    // Check if material type is suitable
                    const isTypeMatch = categoryInfo.materialTypes.includes(material.type);
                    
                    // Check if subtype is not excluded
                    const isSubtypeOk = !material.subtype || 
                                       !categoryInfo.excludedSubtypes.includes(material.subtype);
                    
                    // Check if the material has matching applications
                    const hasMatchingApplication = material.applications && 
                                                 material.applications.some(app => 
                                                     categoryInfo.terms.some(term => 
                                                         app.toLowerCase().includes(term.toLowerCase())
                                                     )
                                                 );
                    
                    return (isTypeMatch && isSubtypeOk) || hasMatchingApplication;
                });
            }
        }
        
        // Filter by application subcategory
        if (applicationContext.applicationSubcategory && matchingMaterials.length > 0) {
            // Find the parent category
            let subcategoryInfo = null;
            for (const [categoryKey, categoryInfo] of Object.entries(window.ApplicationMapping.APPLICATION_CATEGORIES)) {
                if (categoryInfo.subcategories && categoryInfo.subcategories[applicationContext.applicationSubcategory]) {
                    subcategoryInfo = categoryInfo.subcategories[applicationContext.applicationSubcategory];
                    break;
                }
            }
            
            if (subcategoryInfo) {
                // Check if the material is suitable for this application subcategory
                matchingMaterials = matchingMaterials.filter(material => {
                    // Check if material type is suitable
                    const isTypeMatch = subcategoryInfo.materialTypes.includes(material.type);
                    
                    // Check if subtype is not excluded
                    const isSubtypeOk = !material.subtype || 
                                       !subcategoryInfo.excludedSubtypes.includes(material.subtype);
                    
                    // Check if subtype is preferred
                    const isSubtypePreferred = material.subtype && 
                                             subcategoryInfo.preferredSubtypes && 
                                             subcategoryInfo.preferredSubtypes.includes(material.subtype);
                    
                    // Check if the material has matching applications
                    const hasMatchingApplication = material.applications && 
                                                 material.applications.some(app => 
                                                     subcategoryInfo.terms.some(term => 
                                                         app.toLowerCase().includes(term.toLowerCase())
                                                     )
                                                 );
                    
                    return (isTypeMatch && isSubtypeOk) || isSubtypePreferred || hasMatchingApplication;
                });
            }
        }
    }
    
    return matchingMaterials;
}

/**
 * Processes and normalizes search results with application context
 * @param {Object} searchResults - The raw search results
 * @param {Object} applicationContext - The application context
 * @returns {Object} - Normalized search results
 */
function processSearchResultsWithContext(searchResults, applicationContext) {
    // Extract the results array
    const results = searchResults.results || [];
    
    // Transform the results into our display format with enhanced properties
    const transformedResults = results.map(result => {
        // If we have material_data from our enhanced dataset, use it
        if (result.material_data) {
            const material = result.material_data;
            return {
                id: material.id,
                name: material.name,
                type: material.type,
                subtype: material.subtype,
                description: material.description,
                thumbnail: material.thumbnail,
                sustainability: material.sustainability,
                applications: material.applications,
                source: material.source,
                url: material.url,
                physical_properties: material.physical_properties,
                mechanical_properties: material.mechanical_properties,
                thermal_properties: material.thermal_properties,
                processing_information: material.processing_information,
                suitable_for: material.suitable_for,
                not_suitable_for: material.not_suitable_for
            };
        } else {
            // Fall back to the original transformation for external results
            return {
                id: generateId(result.title),
                name: result.title.split(':')[0].trim(),
                type: determineMaterialType(result.title, result.snippet),
                subtype: determineSubtype(result.title, result.snippet),
                description: result.snippet,
                thumbnail: generateThumbnailUrl(result.title),
                sustainability: determineSustainability(result.title, result.snippet),
                applications: determineApplications(result.title, result.snippet),
                source: result.source,
                url: result.url
            };
        }
    });
    
    // If we have application context, sort results by relevance to the context
    let sortedResults = transformedResults;
    if (applicationContext) {
        sortedResults = window.ContextAwareSearch.filterResultsByApplicationContext(transformedResults, applicationContext);
    }
    
    // Separate detailed results from additional results
    const detailedResults = sortedResults.slice(0, MANUS_CONFIG.maxDetailedResults);
    const additionalResults = sortedResults.slice(
        MANUS_CONFIG.maxDetailedResults, 
        MANUS_CONFIG.maxDetailedResults + MANUS_CONFIG.maxAdditionalResults
    );
    
    // Transform additional results into simpler format
    const transformedAdditionalResults = additionalResults.map(result => ({
        name: result.name,
        url: result.url,
        source: result.source
    }));
    
    return {
        query: searchResults.query,
        detailedResults: detailedResults,
        additionalResults: transformedAdditionalResults,
        totalResults: sortedResults.length,
        applicationContext: applicationContext
    };
}

// Export the functions for use in other modules
window.ApplicationSpecificSearch = {
    searchWithApplicationContext,
    performManusSearchWithContext,
    filterMaterialsByQueryAndContext,
    processSearchResultsWithContext
};
