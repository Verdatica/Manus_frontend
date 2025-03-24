/**
 * Context-Aware Search for Bio-Materials Dashboard
 * This module enhances the search functionality to be context-aware and application-specific
 */

/**
 * Extracts application context from a search query
 * @param {string} query - The user's search query
 * @returns {Object} - Extracted application context
 */
function extractApplicationContext(query) {
    const lowerQuery = query.toLowerCase();
    const context = {
        applicationCategory: null,
        applicationSubcategory: null,
        productType: null,
        quantity: null,
        quantityValue: null,
        materialTypePreferences: [],
        excludedMaterialTypes: [],
        excludedSubtypes: []
    };
    
    // Extract product type
    for (const [productKey, productInfo] of Object.entries(window.ApplicationMapping.PRODUCT_TYPES)) {
        if (productInfo.terms.some(term => lowerQuery.includes(term))) {
            context.productType = productKey;
            
            // Add material type preferences and exclusions from product type
            if (productInfo.materialTypes) {
                context.materialTypePreferences = [...productInfo.materialTypes];
            }
            
            if (productInfo.excludedSubtypes) {
                context.excludedSubtypes = [...productInfo.excludedSubtypes];
            }
            
            // Add application category from product type
            if (productInfo.applications && productInfo.applications.length > 0) {
                // Find the parent category for this subcategory
                for (const [categoryKey, categoryInfo] of Object.entries(window.ApplicationMapping.APPLICATION_CATEGORIES)) {
                    for (const subcategoryKey of Object.keys(categoryInfo.subcategories || {})) {
                        if (productInfo.applications.includes(subcategoryKey)) {
                            context.applicationCategory = categoryKey;
                            context.applicationSubcategory = subcategoryKey;
                            break;
                        }
                    }
                    if (context.applicationCategory) break;
                }
            }
            
            break;
        }
    }
    
    // If no product type was found, try to extract application category and subcategory
    if (!context.applicationCategory) {
        for (const [categoryKey, categoryInfo] of Object.entries(window.ApplicationMapping.APPLICATION_CATEGORIES)) {
            // Check if any category terms match
            if (categoryInfo.terms.some(term => lowerQuery.includes(term))) {
                context.applicationCategory = categoryKey;
                
                // Add material type preferences and exclusions from category
                if (categoryInfo.materialTypes) {
                    context.materialTypePreferences = [...categoryInfo.materialTypes];
                }
                
                if (categoryInfo.excludedSubtypes) {
                    context.excludedSubtypes = [...categoryInfo.excludedSubtypes];
                }
                
                // Check for subcategories
                for (const [subcategoryKey, subcategoryInfo] of Object.entries(categoryInfo.subcategories || {})) {
                    if (subcategoryInfo.terms.some(term => lowerQuery.includes(term))) {
                        context.applicationSubcategory = subcategoryKey;
                        
                        // Add more specific material type preferences and exclusions
                        if (subcategoryInfo.materialTypes) {
                            context.materialTypePreferences = [...subcategoryInfo.materialTypes];
                        }
                        
                        if (subcategoryInfo.excludedSubtypes) {
                            context.excludedSubtypes = [...subcategoryInfo.excludedSubtypes];
                        }
                        
                        if (subcategoryInfo.preferredSubtypes) {
                            context.preferredSubtypes = [...subcategoryInfo.preferredSubtypes];
                        }
                        
                        break;
                    }
                }
                
                break;
            }
        }
    }
    
    // Extract quantity information
    for (const [quantityKey, quantityInfo] of Object.entries(window.ApplicationMapping.QUANTITY_INDICATORS)) {
        if (quantityKey === 'NUMERIC') {
            const match = lowerQuery.match(quantityInfo.regex);
            if (match) {
                let value = parseInt(match[1]);
                const multiplier = match[2] && quantityInfo.multipliers[match[2].toLowerCase()];
                if (multiplier) {
                    value *= multiplier;
                }
                context.quantity = 'NUMERIC';
                context.quantityValue = value;
            }
        } else if (quantityInfo.terms.some(term => lowerQuery.includes(term))) {
            context.quantity = quantityKey;
            context.quantityValue = quantityInfo.threshold;
            break;
        }
    }
    
    return context;
}

/**
 * Filters search results based on application context
 * @param {Array} results - The search results to filter
 * @param {Object} context - The application context extracted from the query
 * @returns {Array} - Filtered results
 */
function filterResultsByApplicationContext(results, context) {
    if (!context || !results || results.length === 0) {
        return results;
    }
    
    // Define scoring function for results
    const scoreResult = (result) => {
        let score = 0;
        
        // Score based on material type preferences
        if (context.materialTypePreferences.includes(result.type)) {
            score += 10;
        }
        
        // Penalize excluded material types
        if (context.excludedMaterialTypes.includes(result.type)) {
            score -= 20;
        }
        
        // Penalize excluded subtypes
        if (result.subtype && context.excludedSubtypes.includes(result.subtype)) {
            score -= 15;
        }
        
        // Bonus for preferred subtypes
        if (result.subtype && context.preferredSubtypes && context.preferredSubtypes.includes(result.subtype)) {
            score += 5;
        }
        
        // Score based on application match
        if (context.applicationCategory) {
            const hasMatchingApplication = result.applications.some(app => {
                // Direct match with category
                if (app === context.applicationCategory) {
                    return true;
                }
                
                // Check if application is a subcategory of the context category
                const categoryInfo = window.ApplicationMapping.APPLICATION_CATEGORIES[context.applicationCategory];
                if (categoryInfo && categoryInfo.subcategories && 
                    Object.keys(categoryInfo.subcategories).includes(app)) {
                    return true;
                }
                
                return false;
            });
            
            if (hasMatchingApplication) {
                score += 15;
            } else {
                score -= 10;
            }
        }
        
        // Score based on subcategory match
        if (context.applicationSubcategory) {
            const hasMatchingSubcategory = result.applications.some(app => 
                app === context.applicationSubcategory
            );
            
            if (hasMatchingSubcategory) {
                score += 20;
            }
        }
        
        // Score based on product type match
        if (context.productType) {
            const productInfo = window.ApplicationMapping.PRODUCT_TYPES[context.productType];
            if (productInfo) {
                const hasMatchingApplication = productInfo.applications.some(app => 
                    result.applications.includes(app)
                );
                
                if (hasMatchingApplication) {
                    score += 25;
                }
                
                // Check if material type is suitable for this product
                if (productInfo.materialTypes.includes(result.type)) {
                    score += 15;
                } else {
                    score -= 15;
                }
                
                // Check if subtype is excluded for this product
                if (result.subtype && productInfo.excludedSubtypes.includes(result.subtype)) {
                    score -= 30;
                }
            }
        }
        
        return score;
    };
    
    // Score and filter results
    const scoredResults = results.map(result => ({
        ...result,
        score: scoreResult(result)
    }));
    
    // Sort by score (descending)
    scoredResults.sort((a, b) => b.score - a.score);
    
    // Filter out results with negative scores (completely unsuitable)
    const filteredResults = scoredResults.filter(result => result.score > -10);
    
    return filteredResults;
}

/**
 * Enhances the search query with application-specific terms
 * @param {string} query - The original query
 * @param {Object} context - The application context
 * @returns {string} - Enhanced query
 */
function enhanceQueryWithContext(query, context) {
    let enhancedQuery = query;
    
    // Add application-specific terms
    if (context.applicationCategory) {
        const categoryInfo = window.ApplicationMapping.APPLICATION_CATEGORIES[context.applicationCategory];
        if (categoryInfo) {
            // Add a representative term from the category if not already in query
            const categoryTerm = categoryInfo.terms[0];
            if (!query.toLowerCase().includes(categoryTerm)) {
                enhancedQuery += ` ${categoryTerm}`;
            }
        }
    }
    
    // Add material type preferences if not already in query
    if (context.materialTypePreferences.length > 0) {
        const materialType = context.materialTypePreferences[0];
        if (!query.toLowerCase().includes(materialType.toLowerCase())) {
            enhancedQuery += ` ${materialType}`;
        }
    }
    
    return enhancedQuery;
}

// Export the functions for use in other modules
window.ContextAwareSearch = {
    extractApplicationContext,
    filterResultsByApplicationContext,
    enhanceQueryWithContext
};
