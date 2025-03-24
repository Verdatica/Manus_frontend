/**
 * Application Mapping for Bio-Materials Dashboard
 * This module provides mappings between applications, material types, and search terms
 */

// Define application categories and their related terms
const APPLICATION_CATEGORIES = {
    // Packaging applications
    'PACKAGING': {
        terms: ['packaging', 'package', 'container', 'wrap', 'wrapping'],
        subcategories: {
            'FOOD_PACKAGING': {
                terms: ['food', 'edible', 'grocery', 'meal', 'produce', 'perishable'],
                materialTypes: ['Bioplastic', 'Biocomposite'],
                excludedSubtypes: ['Foam']
            },
            'BEVERAGE_PACKAGING': {
                terms: ['beverage', 'drink', 'bottle', 'bottles', 'cup', 'cups', 'liquid', 'water', 'soda', 'juice'],
                materialTypes: ['Bioplastic'],
                excludedSubtypes: ['Foam', 'Fiber', 'Textile']
            },
            'PROTECTIVE_PACKAGING': {
                terms: ['protective', 'protection', 'cushion', 'padding', 'shipping', 'fragile'],
                materialTypes: ['Bioplastic', 'Biocomposite'],
                preferredSubtypes: ['Foam']
            },
            'MEDICAL_PACKAGING': {
                terms: ['medical', 'medicine', 'pharmaceutical', 'sterile', 'healthcare'],
                materialTypes: ['Bioplastic'],
                excludedSubtypes: ['Foam']
            }
        },
        materialTypes: ['Bioplastic', 'Biocomposite'],
        excludedSubtypes: []
    },
    
    // Consumer goods applications
    'CONSUMER_GOODS': {
        terms: ['consumer', 'product', 'goods', 'household', 'item', 'items', 'retail'],
        subcategories: {
            'DISPOSABLE_ITEMS': {
                terms: ['disposable', 'single-use', 'single use', 'cutlery', 'utensil', 'utensils', 'plate', 'plates', 'straw', 'straws'],
                materialTypes: ['Bioplastic', 'Biocomposite'],
                excludedSubtypes: ['Foam']
            },
            'DURABLE_GOODS': {
                terms: ['durable', 'long-lasting', 'long lasting', 'furniture', 'appliance', 'appliances'],
                materialTypes: ['Biocomposite', 'Natural Fiber'],
                excludedSubtypes: []
            }
        },
        materialTypes: ['Bioplastic', 'Biocomposite', 'Natural Fiber'],
        excludedSubtypes: []
    },
    
    // Automotive applications
    'AUTOMOTIVE': {
        terms: ['automotive', 'vehicle', 'car', 'cars', 'automobile', 'automobiles', 'transport'],
        subcategories: {
            'INTERIOR_COMPONENTS': {
                terms: ['interior', 'dashboard', 'panel', 'panels', 'seat', 'seats', 'upholstery'],
                materialTypes: ['Biocomposite', 'Natural Fiber'],
                excludedSubtypes: []
            },
            'EXTERIOR_COMPONENTS': {
                terms: ['exterior', 'body', 'panel', 'panels'],
                materialTypes: ['Biocomposite'],
                excludedSubtypes: ['Foam', 'Film']
            }
        },
        materialTypes: ['Biocomposite', 'Natural Fiber'],
        excludedSubtypes: ['Foam', 'Film']
    },
    
    // Construction applications
    'CONSTRUCTION': {
        terms: ['construction', 'building', 'structure', 'structural', 'architecture', 'architectural'],
        subcategories: {
            'INSULATION': {
                terms: ['insulation', 'insulating', 'thermal', 'acoustic'],
                materialTypes: ['Biocomposite', 'Natural Fiber'],
                preferredSubtypes: ['Foam']
            },
            'STRUCTURAL_ELEMENTS': {
                terms: ['structural', 'load-bearing', 'load bearing', 'support', 'frame', 'framing'],
                materialTypes: ['Biocomposite'],
                excludedSubtypes: ['Foam', 'Film']
            },
            'FINISHING_MATERIALS': {
                terms: ['finishing', 'surface', 'panel', 'panels', 'wall', 'walls', 'floor', 'flooring'],
                materialTypes: ['Biocomposite', 'Natural Fiber'],
                excludedSubtypes: []
            }
        },
        materialTypes: ['Biocomposite', 'Natural Fiber'],
        excludedSubtypes: ['Film']
    },
    
    // Textile applications
    'TEXTILES': {
        terms: ['textile', 'fabric', 'clothing', 'apparel', 'fashion', 'garment', 'garments', 'wear'],
        subcategories: {
            'CLOTHING': {
                terms: ['clothing', 'apparel', 'fashion', 'garment', 'garments', 'wear', 'shirt', 'shirts', 'pants'],
                materialTypes: ['Natural Fiber'],
                excludedSubtypes: ['Foam', 'Film']
            },
            'HOME_TEXTILES': {
                terms: ['home', 'furnishing', 'furnishings', 'upholstery', 'curtain', 'curtains', 'bedding'],
                materialTypes: ['Natural Fiber'],
                excludedSubtypes: ['Foam', 'Film']
            }
        },
        materialTypes: ['Natural Fiber'],
        excludedSubtypes: ['Foam', 'Film', 'PLA']
    },
    
    // Agriculture applications
    'AGRICULTURE': {
        terms: ['agriculture', 'farming', 'farm', 'crop', 'crops', 'soil', 'plant', 'plants', 'growing'],
        subcategories: {
            'MULCH_FILMS': {
                terms: ['mulch', 'film', 'films', 'cover', 'covering', 'soil'],
                materialTypes: ['Bioplastic'],
                preferredSubtypes: ['Film']
            },
            'PLANTING_CONTAINERS': {
                terms: ['container', 'containers', 'pot', 'pots', 'planter', 'planters'],
                materialTypes: ['Bioplastic', 'Biocomposite'],
                excludedSubtypes: ['Film']
            }
        },
        materialTypes: ['Bioplastic', 'Biocomposite'],
        excludedSubtypes: []
    }
};

// Define specific product types and their application mappings
const PRODUCT_TYPES = {
    'BOTTLE': {
        terms: ['bottle', 'bottles'],
        applications: ['BEVERAGE_PACKAGING'],
        materialTypes: ['Bioplastic'],
        excludedSubtypes: ['Foam', 'Fiber', 'Textile']
    },
    'FOOD_CONTAINER': {
        terms: ['food container', 'food packaging', 'food box', 'takeout', 'take-out', 'takeaway', 'take-away'],
        applications: ['FOOD_PACKAGING'],
        materialTypes: ['Bioplastic', 'Biocomposite'],
        excludedSubtypes: ['Fiber']
    },
    'CUTLERY': {
        terms: ['cutlery', 'utensil', 'utensils', 'fork', 'forks', 'knife', 'knives', 'spoon', 'spoons'],
        applications: ['DISPOSABLE_ITEMS'],
        materialTypes: ['Bioplastic'],
        excludedSubtypes: ['Foam', 'Film', 'Fiber']
    },
    'BAG': {
        terms: ['bag', 'bags', 'shopping bag', 'grocery bag'],
        applications: ['PACKAGING'],
        materialTypes: ['Bioplastic', 'Biocomposite', 'Natural Fiber'],
        excludedSubtypes: []
    }
};

// Define quantity indicators and their thresholds
const QUANTITY_INDICATORS = {
    'LOW': {
        terms: ['few', 'small batch', 'small scale', 'prototype', 'sample', 'testing'],
        threshold: 1000
    },
    'MEDIUM': {
        terms: ['several', 'medium batch', 'medium scale', 'production run'],
        threshold: 50000
    },
    'HIGH': {
        terms: ['many', 'large batch', 'large scale', 'mass production', 'industrial scale'],
        threshold: 100000
    },
    'NUMERIC': {
        regex: /\b(\d+)[k]?\s*(pcs|pieces|units|items|products)\b/i,
        multipliers: {
            'k': 1000
        }
    }
};

// Export the mappings for use in other modules
window.ApplicationMapping = {
    APPLICATION_CATEGORIES,
    PRODUCT_TYPES,
    QUANTITY_INDICATORS
};
