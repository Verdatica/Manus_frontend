/**
 * Event Dispatcher for Manus API Integration
 * This file adds event handling to connect the Manus API with the search interface
 */

// Create a custom event dispatcher for Manus search events
const ManusEventDispatcher = {
    // Dispatch event when search is complete
    dispatchSearchComplete: function(searchData) {
        const event = new CustomEvent('manusSearchComplete', {
            detail: searchData,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    },
    
    // Dispatch event when search encounters an error
    dispatchSearchError: function(errorMessage) {
        const event = new CustomEvent('manusSearchError', {
            detail: { error: true, message: errorMessage },
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
};

// Override the searchWithManus function to dispatch events
const originalSearchWithManus = window.ManusAPI.searchWithManus;
window.ManusAPI.searchWithManus = async function(query, filters = {}) {
    try {
        // Call the original function
        const results = await originalSearchWithManus(query, filters);
        
        // Dispatch the search complete event
        ManusEventDispatcher.dispatchSearchComplete(results);
        
        // Return the results
        return results;
    } catch (error) {
        // Dispatch the search error event
        ManusEventDispatcher.dispatchSearchError(error.message || 'An error occurred during search');
        
        // Return an error object
        return {
            error: true,
            message: error.message || 'An error occurred during search',
            results: []
        };
    }
};

// Export the event dispatcher
window.ManusEventDispatcher = ManusEventDispatcher;
