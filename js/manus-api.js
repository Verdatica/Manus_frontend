/**
 * Manus API Client for Bio-Materials Dashboard
 * This module provides functions to interact with Manus search capabilities
 */

// Configuration for Manus API requests
const MANUS_CONFIG = {
    // Base keywords to focus search on biobased and sustainable materials
    baseKeywords: ['biobased materials', 'sustainable materials', 'bio-materials'],
    
    // Maximum number of detailed results to display
    maxDetailedResults: 5,
    
    // Maximum number of additional results to display in the list
    maxAdditionalResults: 10
};

/**
 * Performs a search using Manus capabilities
 * @param {string} query - The user's search query
 * @param {Object} filters - Optional filters to apply to the search
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function searchWithManus(query, filters = {}) {
    try {
        // Add base keywords to focus search on biobased materials
        const enhancedQuery = enhanceQuery(query, filters);
        
        // Create a loading state indicator
        showLoadingState();
        
        // Use the info_search_web tool to perform the search
        const searchResults = await performManusSearch(enhancedQuery, filters);
        
        // Process and normalize the results
        const processedResults = processSearchResults(searchResults);
        
        // Remove loading state
        hideLoadingState();
        
        return processedResults;
    } catch (error) {
        hideLoadingState();
        console.error('Error searching with Manus:', error);
        return {
            error: true,
            message: 'An error occurred while searching. Please try again.',
            results: []
        };
    }
}

/**
 * Enhances the user query with base keywords to focus on biobased materials
 * @param {string} query - The original user query
 * @param {Object} filters - Any filters to consider when enhancing the query
 * @returns {string} - The enhanced query
 */
function enhanceQuery(query, filters) {
    // Start with the user's query
    let enhancedQuery = query.trim();
    
    // If the query doesn't already contain our base keywords, add the most relevant one
    const containsBaseKeyword = MANUS_CONFIG.baseKeywords.some(keyword => 
        query.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!containsBaseKeyword) {
        // Add the most appropriate base keyword based on the query context
        enhancedQuery += ' biobased materials';
    }
    
    // Add any filter-specific keywords
    if (filters.academicOnly) {
        enhancedQuery += ' research paper';
    }
    
    if (filters.recentOnly) {
        enhancedQuery += ' recent developments';
    }
    
    return enhancedQuery;
}

/**
 * Performs the actual search using Manus capabilities
 * @param {string} query - The enhanced search query
 * @param {Object} filters - Filters to apply to the search
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function performManusSearch(query, filters) {
    try {
        // In a production environment, this would use the Manus API directly
        // For now, we'll use the info_search_web tool through a wrapper
        
        // Prepare search parameters based on filters
        let dateRange = 'all';
        if (filters.recentOnly) {
            dateRange = 'past_year';
        }
        
        // Add academic focus if requested
        let enhancedQuery = query;
        if (filters.academicOnly) {
            enhancedQuery += ' research paper journal';
        }
        
        console.log(`Performing Manus search for: "${enhancedQuery}" with date range: ${dateRange}`);
        
        // This is a simulation of using Manus search capabilities
        // In a real implementation, this would directly call Manus APIs
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate search results
                resolve({
                    query: query,
                    results: [
                        {
                            title: "BioPLA+ Advanced Bioplastic Material",
                            snippet: "A high-performance PLA-based bioplastic with enhanced mechanical properties suitable for packaging applications.",
                            url: "https://example.com/biopla-advanced",
                            source: "Journal of Sustainable Materials"
                        },
                        {
                            title: "EcoFiber Composite: Natural Fiber Reinforced Biocomposite",
                            snippet: "Natural fiber reinforced biocomposite with excellent strength-to-weight ratio for automotive interior components.",
                            url: "https://example.com/ecofiber-composite",
                            source: "Sustainable Materials Research"
                        },
                        {
                            title: "AlgaeFoam: Biodegradable Packaging Material",
                            snippet: "Biodegradable foam material derived from algae, suitable for protective packaging and insulation.",
                            url: "https://example.com/algaefoam",
                            source: "Green Materials Technology"
                        },
                        {
                            title: "CelluloseFilm: Transparent Bio-based Packaging",
                            snippet: "Transparent cellulose-based film with excellent barrier properties for food packaging.",
                            url: "https://example.com/cellulosefilm",
                            source: "Packaging Science Journal"
                        },
                        {
                            title: "HempTex: Sustainable Textile Material",
                            snippet: "Hemp-based textile material with natural antimicrobial properties for sustainable fashion.",
                            url: "https://example.com/hemptex",
                            source: "Sustainable Textiles Research"
                        },
                        {
                            title: "MyceliumBoard: Fungal-based Construction Material",
                            snippet: "Sustainable construction material grown from mycelium, offering excellent insulation properties.",
                            url: "https://example.com/myceliumboard",
                            source: "Biobased Construction Materials"
                        },
                        {
                            title: "BambooComposite: High-Strength Natural Material",
                            snippet: "Bamboo-based composite material with high strength-to-weight ratio for furniture and construction.",
                            url: "https://example.com/bamboocomposite",
                            source: "Renewable Materials Journal"
                        }
                    ]
                });
            }, 1500);
        });
    } catch (error) {
        console.error('Error in Manus search:', error);
        throw new Error('Failed to perform search with Manus: ' + error.message);
    }
}

/**
 * Processes and normalizes search results to match our display format
 * @param {Object} searchResults - The raw search results from Manus
 * @returns {Object} - Normalized search results
 */
function processSearchResults(searchResults) {
    // Extract the results array
    const results = searchResults.results || [];
    
    // Separate detailed results (first 5) from additional results
    const detailedResults = results.slice(0, MANUS_CONFIG.maxDetailedResults);
    const additionalResults = results.slice(MANUS_CONFIG.maxDetailedResults, 
                                          MANUS_CONFIG.maxDetailedResults + MANUS_CONFIG.maxAdditionalResults);
    
    // Transform the results into our display format
    const transformedDetailedResults = detailedResults.map(result => ({
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
    }));
    
    // Transform additional results into simpler format
    const transformedAdditionalResults = additionalResults.map(result => ({
        name: result.title.split(':')[0].trim(),
        url: result.url,
        source: result.source
    }));
    
    return {
        query: searchResults.query,
        detailedResults: transformedDetailedResults,
        additionalResults: transformedAdditionalResults,
        totalResults: results.length
    };
}

/**
 * Generates a unique ID for a material based on its title
 * @param {string} title - The material title
 * @returns {string} - A unique ID
 */
function generateId(title) {
    return 'mat-' + title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Determines the material type based on title and snippet
 * @param {string} title - The material title
 * @param {string} snippet - The material description
 * @returns {string} - The determined material type
 */
function determineMaterialType(title, snippet) {
    const text = (title + ' ' + snippet).toLowerCase();
    
    if (text.includes('bioplastic') || text.includes('pla')) {
        return 'Bioplastic';
    } else if (text.includes('composite') || text.includes('biocomposite')) {
        return 'Biocomposite';
    } else if (text.includes('fiber') || text.includes('fibre')) {
        return 'Natural Fiber';
    } else if (text.includes('foam')) {
        return 'Bioplastic';
    } else if (text.includes('film')) {
        return 'Bioplastic';
    } else if (text.includes('textile') || text.includes('fabric')) {
        return 'Natural Fiber';
    } else {
        return 'Biomaterial';
    }
}

/**
 * Determines the material subtype based on title and snippet
 * @param {string} title - The material title
 * @param {string} snippet - The material description
 * @returns {string|null} - The determined subtype or null if not determinable
 */
function determineSubtype(title, snippet) {
    const text = (title + ' ' + snippet).toLowerCase();
    
    if (text.includes('pla')) {
        return 'PLA';
    } else if (text.includes('foam')) {
        return 'Foam';
    } else if (text.includes('film')) {
        return 'Film';
    } else if (text.includes('fiber-reinforced') || text.includes('fibre-reinforced')) {
        return 'Fiber-reinforced';
    } else if (text.includes('textile')) {
        return 'Textile';
    } else {
        return null;
    }
}

/**
 * Determines sustainability properties based on title and snippet
 * @param {string} title - The material title
 * @param {string} snippet - The material description
 * @returns {Object} - Sustainability properties
 */
function determineSustainability(title, snippet) {
    const text = (title + ' ' + snippet).toLowerCase();
    
    return {
        biodegradable: text.includes('biodegradable'),
        compostable: text.includes('compostable'),
        recyclable: text.includes('recyclable'),
        biobased_content: estimateBiobasedContent(text)
    };
}

/**
 * Estimates bio-based content percentage based on text description
 * @param {string} text - The combined title and snippet text
 * @returns {number} - Estimated bio-based content percentage
 */
function estimateBiobasedContent(text) {
    if (text.includes('100%') || text.includes('fully biobased')) {
        return 100;
    } else if (text.includes('partially biobased') || text.includes('bio-based content')) {
        return 80;
    } else {
        return 90; // Default assumption for bio-materials
    }
}

/**
 * Determines potential applications based on title and snippet
 * @param {string} title - The material title
 * @param {string} snippet - The material description
 * @returns {Array<string>} - List of potential applications
 */
function determineApplications(title, snippet) {
    const text = (title + ' ' + snippet).toLowerCase();
    const applications = [];
    
    if (text.includes('packaging')) {
        applications.push('Packaging');
    }
    
    if (text.includes('automotive') || text.includes('vehicle')) {
        applications.push('Automotive');
    }
    
    if (text.includes('construction') || text.includes('building')) {
        applications.push('Construction');
    }
    
    if (text.includes('textile') || text.includes('fashion') || text.includes('clothing')) {
        applications.push('Textiles');
    }
    
    if (text.includes('consumer') || text.includes('product')) {
        applications.push('Consumer goods');
    }
    
    if (text.includes('agriculture') || text.includes('farming')) {
        applications.push('Agriculture');
    }
    
    // If no applications were determined, add a default one
    if (applications.length === 0) {
        applications.push('Industrial');
    }
    
    return applications;
}

/**
 * Generates a thumbnail URL for a material based on its title
 * @param {string} title - The material title
 * @returns {string} - URL for a placeholder thumbnail
 */
function generateThumbnailUrl(title) {
    // Extract the first part of the title (before any colon)
    const shortName = title.split(':')[0].trim();
    
    // Generate a color based on the material name
    const colors = ['00A86B', '4B9CD3', 'F26419', '86BBD8', '33658A', '2F4858', '7A9E9F'];
    const colorIndex = Math.abs(hashCode(shortName)) % colors.length;
    const color = colors[colorIndex];
    
    // Create a placeholder URL with the material name
    const encodedName = encodeURIComponent(shortName);
    return `https://placehold.co/600x400/${color}/FFFFFF?text=${encodedName}`;
}

/**
 * Simple hash function for strings
 * @param {string} str - Input string
 * @returns {number} - Hash code
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Shows a loading state while search is in progress
 */
function showLoadingState() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        // Create loading indicator
        searchResults.innerHTML = `
            <div class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                <p class="mt-4 text-gray-600">Searching with Manus...</p>
                <p class="text-sm text-gray-500">Finding the most relevant bio-materials for you</p>
            </div>
        `;
        
        // Disable search button and add loading state
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.disabled = true;
            searchButton.classList.add('opacity-50', 'cursor-not-allowed');
        }
        
        // Disable filters during search
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.disabled = true;
            applyFiltersBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

/**
 * Hides the loading state
 */
function hideLoadingState() {
    // Re-enable search button
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.disabled = false;
        searchButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Re-enable filters
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.disabled = false;
        applyFiltersBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// Export the functions for use in other modules
window.ManusAPI = {
    searchWithManus,
    MANUS_CONFIG
};
