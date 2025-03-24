/**
 * Search Interface for Bio-Materials Dashboard
 * This module connects the UI with the Manus API client
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get UI elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const biobasedSlider = document.getElementById('biobased-slider');
    const biobasedValue = document.getElementById('biobased-value');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    // Initialize filter state
    const filters = {
        materialType: [],
        application: [],
        sustainability: [],
        biobasedContent: 50,
        academicOnly: false,
        recentOnly: false
    };
    
    // Update biobased content value display
    biobasedSlider.addEventListener('input', function() {
        biobasedValue.textContent = this.value;
        filters.biobasedContent = parseInt(this.value);
    });
    
    // Search functionality
    async function performSearch(query) {
        if (!query) {
            // If no query, show empty state
            displayEmptyState();
            return;
        }
        
        try {
            // Use the Manus API client to perform the search
            const searchResults = await window.ManusAPI.searchWithManus(query, filters);
            
            // Display the results
            displayResults(searchResults);
        } catch (error) {
            console.error('Error performing search:', error);
            displayErrorState();
        }
    }
    
    // Display empty state when no search has been performed
    function displayEmptyState() {
        searchResults.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
                <p class="text-gray-500">Enter a search query to find bio-materials.</p>
                <p class="text-gray-500 text-sm mt-2">Try searching for specific properties or applications.</p>
            </div>
        `;
    }
    
    // Display error state when search fails
    function displayErrorState(errorMessage = null) {
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
                performSearch(searchInput.value);
            });
        }
    }
    
    // Display search results
    function displayResults(searchData) {
        searchResults.innerHTML = '';
        
        const { detailedResults, additionalResults, totalResults } = searchData;
        
        // Update the results count
        const resultsCountElement = document.querySelector('.text-sm.text-gray-500');
        if (resultsCountElement) {
            resultsCountElement.textContent = `Showing ${totalResults} materials`;
        }
        
        // If no results, show empty results state
        if (detailedResults.length === 0 && additionalResults.length === 0) {
            searchResults.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-500">No materials found matching your criteria.</p>
                    <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }
        
        // Add "Powered by Manus" indicator
        const manusIndicator = document.createElement('div');
        manusIndicator.className = 'mb-4 text-right text-sm text-gray-500';
        manusIndicator.innerHTML = 'Powered by <span class="font-medium">Manus</span>';
        searchResults.appendChild(manusIndicator);
        
        // Display detailed results
        detailedResults.forEach(material => {
            const materialCard = document.createElement('div');
            materialCard.className = 'flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden mb-4 transition duration-300 card-hover';
            
            const sustainabilityBadges = [];
            if (material.sustainability.biodegradable) {
                sustainabilityBadges.push('<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Biodegradable</span>');
            }
            if (material.sustainability.compostable) {
                sustainabilityBadges.push('<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Compostable</span>');
            }
            if (material.sustainability.recyclable) {
                sustainabilityBadges.push('<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Recyclable</span>');
            }
            
            const applicationBadges = material.applications.map(app => 
                `<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">${app}</span>`
            );
            
            materialCard.innerHTML = `
                <div class="md:w-1/4 bg-gray-100">
                    <img src="${material.thumbnail}" alt="${material.name}" class="w-full h-full object-cover">
                </div>
                <div class="md:w-3/4 p-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${material.name}</h3>
                            <div class="flex items-center mt-1 mb-2">
                                <span class="text-sm font-medium text-gray-600">${material.type}</span>
                                ${material.subtype ? `<span class="mx-2 text-gray-400">•</span><span class="text-sm text-gray-600">${material.subtype}</span>` : ''}
                            </div>
                        </div>
                        <div class="text-sm text-green-600 font-medium">
                            ${material.sustainability.biobased_content}% bio-based
                        </div>
                    </div>
                    <p class="text-gray-600 mb-3">${material.description}</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${sustainabilityBadges.join(' ')}
                        ${applicationBadges.join(' ')}
                    </div>
                    <div class="flex justify-between items-center">
                        <a href="${material.url}" target="_blank" class="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-150">
                            View details
                            <i class="fas fa-external-link-alt ml-1 text-xs"></i>
                        </a>
                        <div class="text-xs text-gray-500">
                            Source: ${material.source || 'Web search'}
                        </div>
                    </div>
                </div>
            `;
            
            searchResults.appendChild(materialCard);
        });
        
        // If there are additional results, display them in a compact list
        if (additionalResults.length > 0) {
            const additionalResultsContainer = document.createElement('div');
            additionalResultsContainer.className = 'mt-6 border-t border-gray-200 pt-4';
            
            const additionalResultsTitle = document.createElement('h3');
            additionalResultsTitle.className = 'text-md font-medium text-gray-700 mb-3';
            additionalResultsTitle.textContent = 'Additional Results';
            additionalResultsContainer.appendChild(additionalResultsTitle);
            
            const resultsList = document.createElement('ul');
            resultsList.className = 'space-y-2';
            
            additionalResults.forEach(result => {
                const listItem = document.createElement('li');
                listItem.className = 'flex justify-between items-center text-sm';
                listItem.innerHTML = `
                    <a href="${result.url}" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline flex-grow">${result.name}</a>
                    <span class="text-gray-500 text-xs">${result.source || 'Web search'}</span>
                `;
                resultsList.appendChild(listItem);
            });
            
            additionalResultsContainer.appendChild(resultsList);
            searchResults.appendChild(additionalResultsContainer);
        }
    }
    
    // Set up event listeners for search
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // Set up event listeners for filters
    applyFiltersBtn.addEventListener('click', function() {
        // Collect filter values
        filters.materialType = [];
        document.querySelectorAll('input[id^="type-"]:checked').forEach(checkbox => {
            filters.materialType.push(checkbox.id.replace('type-', ''));
        });
        
        filters.application = [];
        document.querySelectorAll('input[id^="app-"]:checked').forEach(checkbox => {
            filters.application.push(checkbox.id.replace('app-', ''));
        });
        
        filters.sustainability = [];
        document.querySelectorAll('input[id^="sus-"]:checked').forEach(checkbox => {
            filters.sustainability.push(checkbox.id.replace('sus-', ''));
        });
        
        // Apply filters to current search
        performSearch(searchInput.value);
    });
    
    clearFiltersBtn.addEventListener('click', function() {
        // Clear all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset biobased slider
        biobasedSlider.value = 50;
        biobasedValue.textContent = '50';
        
        // Reset filter state
        filters.materialType = [];
        filters.application = [];
        filters.sustainability = [];
        filters.biobasedContent = 50;
        filters.academicOnly = false;
        filters.recentOnly = false;
        
        // Apply search with reset filters
        performSearch(searchInput.value);
    });
    
    // Add event listeners for filter checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Update the label styling
            const label = document.querySelector(`label[for="${this.id}"]`);
            if (label) {
                if (this.checked) {
                    label.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
                } else {
                    label.classList.remove('bg-green-50', 'border-green-500', 'text-green-700');
                }
            }
        });
    });
    
    // Add new filter options for Manus search
    addManusSearchFilters();
    
    // Parse URL parameters and perform search if query is present
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    
    if (queryParam) {
        searchInput.value = queryParam;
        performSearch(queryParam);
    } else {
        // Show all materials by default
        displayEmptyState();
    }
    
    // Function to add Manus-specific search filters
    function addManusSearchFilters() {
        const filtersContainer = document.querySelector('.bg-white.p-6.rounded-lg.shadow-md');
        
        if (filtersContainer) {
            // Create a new section for Manus search filters
            const manusFiltersSection = document.createElement('div');
            manusFiltersSection.className = 'mb-6';
            manusFiltersSection.innerHTML = `
                <h3 class="font-medium text-gray-700 mb-2">Search Options</h3>
                <div class="space-y-2">
                    <div class="flex items-center">
                        <input type="checkbox" id="academic-only" class="hidden filter-checkbox">
                        <label for="academic-only" class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer transition-colors">
                            Academic Sources Only
                        </label>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="recent-only" class="hidden filter-checkbox">
                        <label for="recent-only" class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer transition-colors">
                            Recent Results Only
                        </label>
                    </div>
                </div>
            `;
            
            // Insert the new section before the Apply Filters button
            const applyFiltersBtn = document.getElementById('apply-filters');
            if (applyFiltersBtn) {
                const parentElement = applyFiltersBtn.parentElement;
                parentElement.insertBefore(manusFiltersSection, applyFiltersBtn);
            } else {
                filtersContainer.appendChild(manusFiltersSection);
            }
            
            // Add event listeners for the new filter checkboxes
            const academicOnlyCheckbox = document.getElementById('academic-only');
            const recentOnlyCheckbox = document.getElementById('recent-only');
            
            if (academicOnlyCheckbox) {
                academicOnlyCheckbox.addEventListener('change', function() {
                    filters.academicOnly = this.checked;
                    
                    // Update the label styling
                    const label = document.querySelector('label[for="academic-only"]');
                    if (label) {
                        if (this.checked) {
                            label.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
                        } else {
                            label.classList.remove('bg-green-50', 'border-green-500', 'text-green-700');
                        }
                    }
                });
            }
            
            if (recentOnlyCheckbox) {
                recentOnlyCheckbox.addEventListener('change', function() {
                    filters.recentOnly = this.checked;
                    
                    // Update the label styling
                    const label = document.querySelector('label[for="recent-only"]');
                    if (label) {
                        if (this.checked) {
                            label.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
                        } else {
                            label.classList.remove('bg-green-50', 'border-green-500', 'text-green-700');
                        }
                    }
                });
            }
        }
    }
});
