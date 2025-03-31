/**
 * Search Interface Update for Bio-Materials Dashboard
 * This file enhances the search interface to work with the real Manus API integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for search results processing
    document.addEventListener('manusSearchComplete', handleManusSearchResults);
    
    // Update the search button to show processing state
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        const originalText = searchButton.textContent;
        
        // Store original text and add processing state handling
        searchButton.dataset.originalText = originalText;
        
        // Override the click handler to show processing state
        const originalClickHandler = searchButton.onclick;
        searchButton.onclick = function(event) {
            // Show processing state
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Searching...';
            searchButton.disabled = true;
            
            // Call the original handler
            if (originalClickHandler) {
                originalClickHandler.call(this, event);
            }
            
            // Reset button after a timeout (in case the search takes too long)
            setTimeout(() => {
                resetSearchButton();
            }, 15000);
        };
    }
    
    // Function to reset search button state
    function resetSearchButton() {
        if (searchButton && searchButton.dataset.originalText) {
            searchButton.innerHTML = searchButton.dataset.originalText;
            searchButton.disabled = false;
        }
    }
    
    // Handle Manus search results with enhanced error handling
    function handleManusSearchResults(event) {
        // Reset the search button
        resetSearchButton();
        
        // Get the search results from the event
        const searchData = event.detail;
        
        // Check if we have an error
        if (searchData.error) {
            displayErrorState(searchData.message);
            return;
        }
        
        // Display the results
        displayResults(searchData);
        
        // Add "Powered by Manus" indicator if not already present
        addManusAttribution();
    }
    
    // Add Manus attribution to the search results
    function addManusAttribution() {
        // Check if attribution already exists
        if (!document.querySelector('.manus-attribution')) {
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                const manusIndicator = document.createElement('div');
                manusIndicator.className = 'manus-attribution mb-4 text-right text-sm text-gray-500';
                manusIndicator.innerHTML = 'Powered by <span class="font-medium">Manus</span>';
                
                // Insert at the beginning of the results
                if (searchResults.firstChild) {
                    searchResults.insertBefore(manusIndicator, searchResults.firstChild);
                } else {
                    searchResults.appendChild(manusIndicator);
                }
            }
        }
    }
    
    // Enhanced error display with more detailed information
    function displayErrorState(errorMessage = null) {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
                    <p class="text-gray-700">An error occurred while searching.</p>
                    <p class="text-gray-500 text-sm mt-2">${errorMessage || 'Please try again or refine your search query.'}</p>
                    <button id="retry-search" class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-150">
                        Retry Search
                    </button>
                </div>
            `;
            
            // Add event listener to retry button
            const retryButton = document.getElementById('retry-search');
            if (retryButton) {
                retryButton.addEventListener('click', function() {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput && searchInput.value) {
                        // Trigger search with current input value
                        const searchButton = document.getElementById('search-button');
                        if (searchButton) {
                            searchButton.click();
                        }
                    }
                });
            }
        }
    }
    
    // Add no results handler with suggestions
    function displayNoResultsState(query) {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            // Generate alternative search suggestions
            const suggestions = generateSearchSuggestions(query);
            
            searchResults.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500">No materials found matching your criteria.</p>
                    <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                    ${suggestions ? `
                        <div class="mt-6">
                            <p class="text-gray-600 font-medium">Try these searches instead:</p>
                            <div class="flex flex-wrap justify-center gap-2 mt-3">
                                ${suggestions.map(suggestion => `
                                    <button class="search-suggestion px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-sm rounded-md transition duration-150">
                                        ${suggestion}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            // Add event listeners to suggestion buttons
            document.querySelectorAll('.search-suggestion').forEach(button => {
                button.addEventListener('click', function() {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) {
                        searchInput.value = this.textContent.trim();
                        const searchButton = document.getElementById('search-button');
                        if (searchButton) {
                            searchButton.click();
                        }
                    }
                });
            });
        }
    }
    
    // Generate alternative search suggestions based on the query
    function generateSearchSuggestions(query) {
        if (!query) return null;
        
        const queryLower = query.toLowerCase().trim();
        const suggestions = [];
        
        // Add material type suggestions
        if (!queryLower.includes('bioplastic') && !queryLower.includes('plastic')) {
            suggestions.push('bioplastic ' + queryLower);
        }
        
        if (!queryLower.includes('biocomposite') && !queryLower.includes('composite')) {
            suggestions.push('biocomposite ' + queryLower);
        }
        
        if (!queryLower.includes('fiber') && !queryLower.includes('fibre')) {
            suggestions.push('natural fiber ' + queryLower);
        }
        
        // Add application suggestions
        if (!queryLower.includes('packaging')) {
            suggestions.push(queryLower + ' for packaging');
        }
        
        if (!queryLower.includes('automotive')) {
            suggestions.push(queryLower + ' for automotive');
        }
        
        // Add sustainability suggestions
        if (!queryLower.includes('biodegradable')) {
            suggestions.push('biodegradable ' + queryLower);
        }
        
        if (!queryLower.includes('sustainable')) {
            suggestions.push('sustainable ' + queryLower);
        }
        
        // Limit to 5 suggestions
        return suggestions.slice(0, 5);
    }
    
    // Override the original displayResults function to handle Manus-specific data
    const originalDisplayResults = window.displayResults || function() {};
    window.displayResults = function(searchData) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        // Clear previous results
        searchResults.innerHTML = '';
        
        const { detailedResults, additionalResults, totalResults } = searchData;
        
        // Update the results count
        const resultsCountElement = document.querySelector('.text-sm.text-gray-500');
        if (resultsCountElement) {
            resultsCountElement.textContent = `Showing ${totalResults} materials`;
        }
        
        // If no results, show empty results state with suggestions
        if (detailedResults.length === 0 && additionalResults.length === 0) {
            displayNoResultsState(searchData.query);
            return;
        }
        
        // Add "Powered by Manus" indicator
        addManusAttribution();
        
        // Call the original display function to maintain compatibility
        originalDisplayResults(searchData);
    };
});
