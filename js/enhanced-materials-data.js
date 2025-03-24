/**
 * Enhanced Material Data for Bio-Materials Dashboard
 * This module provides detailed sample data for bio-based materials
 */

// Detailed material data with comprehensive properties
const ENHANCED_MATERIALS = [
    {
        id: 'mat-1',
        name: 'BioPLA+',
        type: 'Bioplastic',
        subtype: 'PLA',
        description: 'A high-performance PLA-based bioplastic with enhanced mechanical properties suitable for packaging applications. This advanced material combines the biodegradability of traditional PLA with improved heat resistance and durability.',
        thumbnail: 'https://placehold.co/600x400/00A86B/FFFFFF?text=BioPLA%2B',
        sustainability: {
            biodegradable: true,
            compostable: true,
            recyclable: true,
            biobased_content: 95
        },
        applications: ['Food packaging', 'Disposable cutlery', 'Consumer goods', 'Medical packaging'],
        source: 'Journal of Sustainable Materials',
        url: 'https://example.com/biopla-advanced',
        physical_properties: {
            density: {
                value: 1.24,
                unit: 'g/cm³'
            },
            melt_flow_index: {
                value: 6,
                unit: 'g/10min (190°C/2.16kg)'
            },
            water_absorption: {
                value: 0.3,
                unit: '%'
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 65,
                unit: 'MPa'
            },
            flexural_modulus: {
                value: 3.6,
                unit: 'GPa'
            },
            impact_strength: {
                value: 5.5,
                unit: 'kJ/m²'
            },
            elongation_at_break: {
                value: 4,
                unit: '%'
            }
        },
        thermal_properties: {
            heat_deflection_temperature: {
                value: 110,
                unit: '°C'
            },
            vicat_softening_point: {
                value: 155,
                unit: '°C'
            },
            melting_point: {
                value: 175,
                unit: '°C'
            },
            glass_transition_temperature: {
                value: 60,
                unit: '°C'
            }
        },
        processing_information: {
            processing_temperature: {
                value: '180-210',
                unit: '°C'
            },
            mold_temperature: {
                value: '20-30',
                unit: '°C'
            },
            drying_conditions: {
                value: '4-6 hours at 80',
                unit: '°C'
            }
        },
        suitable_for: ['bottles', 'food containers', 'cups', 'trays', 'blister packaging'],
        not_suitable_for: ['high-heat applications', 'structural components', 'long-term outdoor use']
    },
    {
        id: 'mat-2',
        name: 'CelluloseFilm',
        type: 'Bioplastic',
        subtype: 'Film',
        description: 'Transparent cellulose-based film with excellent barrier properties for food packaging. Derived from renewable wood pulp, this material offers good clarity and printability while being fully biodegradable.',
        thumbnail: 'https://placehold.co/600x400/4B9CD3/FFFFFF?text=CelluloseFilm',
        sustainability: {
            biodegradable: true,
            compostable: true,
            recyclable: true,
            biobased_content: 90
        },
        applications: ['Food packaging', 'Beverage packaging', 'Consumer goods'],
        source: 'Packaging Science Journal',
        url: 'https://example.com/cellulosefilm',
        physical_properties: {
            density: {
                value: 1.3,
                unit: 'g/cm³'
            },
            thickness: {
                value: '15-50',
                unit: 'μm'
            },
            water_vapor_transmission_rate: {
                value: 15,
                unit: 'g/m²/day'
            },
            oxygen_transmission_rate: {
                value: 10,
                unit: 'cm³/m²/day'
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 90,
                unit: 'MPa'
            },
            elongation_at_break: {
                value: 20,
                unit: '%'
            },
            tear_resistance: {
                value: 40,
                unit: 'N/mm'
            }
        },
        thermal_properties: {
            heat_resistance: {
                value: 85,
                unit: '°C'
            },
            cold_resistance: {
                value: -25,
                unit: '°C'
            }
        },
        processing_information: {
            sealing_temperature: {
                value: '110-130',
                unit: '°C'
            },
            printing_methods: ['Flexographic', 'Rotogravure', 'Digital']
        },
        suitable_for: ['food wrapping', 'beverage labels', 'sachets', 'pouches', 'window cartons'],
        not_suitable_for: ['hot-fill applications', 'retort packaging', 'deep freezing']
    },
    {
        id: 'mat-3',
        name: 'BioPET',
        type: 'Bioplastic',
        subtype: 'PET',
        description: 'Bio-based polyethylene terephthalate with properties identical to conventional PET but derived partially from renewable resources. Ideal for beverage bottles and food containers with excellent clarity and barrier properties.',
        thumbnail: 'https://placehold.co/600x400/33658A/FFFFFF?text=BioPET',
        sustainability: {
            biodegradable: false,
            compostable: false,
            recyclable: true,
            biobased_content: 30
        },
        applications: ['Beverage packaging', 'Food packaging', 'Consumer goods'],
        source: 'Sustainable Packaging Technology',
        url: 'https://example.com/biopet',
        physical_properties: {
            density: {
                value: 1.38,
                unit: 'g/cm³'
            },
            water_absorption: {
                value: 0.1,
                unit: '%'
            },
            clarity: {
                value: 'Excellent',
                unit: ''
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 55,
                unit: 'MPa'
            },
            flexural_modulus: {
                value: 2.3,
                unit: 'GPa'
            },
            impact_strength: {
                value: 75,
                unit: 'J/m'
            },
            elongation_at_break: {
                value: 300,
                unit: '%'
            }
        },
        thermal_properties: {
            melting_point: {
                value: 250,
                unit: '°C'
            },
            glass_transition_temperature: {
                value: 76,
                unit: '°C'
            }
        },
        processing_information: {
            processing_temperature: {
                value: '260-280',
                unit: '°C'
            },
            mold_temperature: {
                value: '15-35',
                unit: '°C'
            },
            drying_conditions: {
                value: '4 hours at 160',
                unit: '°C'
            }
        },
        suitable_for: ['water bottles', 'soda bottles', 'juice containers', 'food trays', 'thermoformed containers'],
        not_suitable_for: ['high-heat applications', 'microwave containers']
    },
    {
        id: 'mat-4',
        name: 'StarchBlend',
        type: 'Bioplastic',
        subtype: 'Starch-based',
        description: 'Starch-based bioplastic blend with good processability and mechanical properties. Fully biodegradable and compostable, suitable for single-use packaging and disposable items.',
        thumbnail: 'https://placehold.co/600x400/F26419/FFFFFF?text=StarchBlend',
        sustainability: {
            biodegradable: true,
            compostable: true,
            recyclable: false,
            biobased_content: 85
        },
        applications: ['Food packaging', 'Disposable cutlery', 'Agricultural films'],
        source: 'Bioplastics Magazine',
        url: 'https://example.com/starchblend',
        physical_properties: {
            density: {
                value: 1.3,
                unit: 'g/cm³'
            },
            water_absorption: {
                value: 1.8,
                unit: '%'
            },
            moisture_content: {
                value: '<0.5',
                unit: '%'
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 35,
                unit: 'MPa'
            },
            flexural_modulus: {
                value: 1.8,
                unit: 'GPa'
            },
            impact_strength: {
                value: 2.5,
                unit: 'kJ/m²'
            },
            elongation_at_break: {
                value: 15,
                unit: '%'
            }
        },
        thermal_properties: {
            heat_deflection_temperature: {
                value: 85,
                unit: '°C'
            },
            vicat_softening_point: {
                value: 115,
                unit: '°C'
            },
            melting_range: {
                value: '140-160',
                unit: '°C'
            }
        },
        processing_information: {
            processing_temperature: {
                value: '150-170',
                unit: '°C'
            },
            mold_temperature: {
                value: '20-40',
                unit: '°C'
            },
            drying_conditions: {
                value: '2-3 hours at 70',
                unit: '°C'
            }
        },
        suitable_for: ['disposable cups', 'food containers', 'cutlery', 'straws', 'agricultural mulch films'],
        not_suitable_for: ['beverage bottles', 'durable goods', 'hot liquid containers']
    },
    {
        id: 'mat-5',
        name: 'PHBVPlus',
        type: 'Bioplastic',
        subtype: 'PHA',
        description: 'Advanced polyhydroxybutyrate-valerate (PHBV) biopolymer with enhanced flexibility and processing characteristics. Fully bio-based and marine biodegradable with excellent barrier properties.',
        thumbnail: 'https://placehold.co/600x400/86BBD8/FFFFFF?text=PHBVPlus',
        sustainability: {
            biodegradable: true,
            compostable: true,
            recyclable: true,
            biobased_content: 100,
            marine_biodegradable: true
        },
        applications: ['Food packaging', 'Beverage packaging', 'Medical packaging', 'Agricultural films'],
        source: 'Journal of Biopolymer Science',
        url: 'https://example.com/phbvplus',
        physical_properties: {
            density: {
                value: 1.25,
                unit: 'g/cm³'
            },
            water_absorption: {
                value: 0.5,
                unit: '%'
            },
            oxygen_barrier: {
                value: 'Excellent',
                unit: ''
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 40,
                unit: 'MPa'
            },
            flexural_modulus: {
                value: 2.5,
                unit: 'GPa'
            },
            impact_strength: {
                value: 3.8,
                unit: 'kJ/m²'
            },
            elongation_at_break: {
                value: 8,
                unit: '%'
            }
        },
        thermal_properties: {
            heat_deflection_temperature: {
                value: 120,
                unit: '°C'
            },
            melting_point: {
                value: 170,
                unit: '°C'
            },
            glass_transition_temperature: {
                value: 5,
                unit: '°C'
            }
        },
        processing_information: {
            processing_temperature: {
                value: '165-185',
                unit: '°C'
            },
            mold_temperature: {
                value: '25-40',
                unit: '°C'
            },
            drying_conditions: {
                value: '4 hours at 60',
                unit: '°C'
            }
        },
        suitable_for: ['bottles', 'food containers', 'caps and closures', 'blister packaging', 'agricultural films'],
        not_suitable_for: ['high-heat applications', 'high-stress mechanical parts']
    },
    {
        id: 'mat-6',
        name: 'EcoFiber Composite',
        type: 'Biocomposite',
        subtype: 'Fiber-reinforced',
        description: 'Natural fiber reinforced biocomposite with excellent strength-to-weight ratio for automotive interior components. Combines biodegradable polymer matrix with natural fibers for reduced environmental impact.',
        thumbnail: 'https://placehold.co/600x400/2F4858/FFFFFF?text=EcoFiber%20Composite',
        sustainability: {
            biodegradable: true,
            compostable: false,
            recyclable: true,
            biobased_content: 80
        },
        applications: ['Automotive', 'Construction', 'Furniture'],
        source: 'Sustainable Materials Research',
        url: 'https://example.com/ecofiber-composite',
        physical_properties: {
            density: {
                value: 1.15,
                unit: 'g/cm³'
            },
            water_absorption: {
                value: 1.2,
                unit: '%'
            },
            fiber_content: {
                value: 30,
                unit: '%'
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 70,
                unit: 'MPa'
            },
            flexural_modulus: {
                value: 4.5,
                unit: 'GPa'
            },
            impact_strength: {
                value: 12,
                unit: 'kJ/m²'
            },
            elongation_at_break: {
                value: 3,
                unit: '%'
            }
        },
        thermal_properties: {
            heat_deflection_temperature: {
                value: 105,
                unit: '°C'
            },
            vicat_softening_point: {
                value: 145,
                unit: '°C'
            }
        },
        processing_information: {
            processing_temperature: {
                value: '170-190',
                unit: '°C'
            },
            mold_temperature: {
                value: '40-60',
                unit: '°C'
            },
            drying_conditions: {
                value: '4 hours at 80',
                unit: '°C'
            }
        },
        suitable_for: ['automotive interior panels', 'furniture components', 'construction elements', 'consumer goods'],
        not_suitable_for: ['food contact applications', 'transparent products', 'high-flex applications']
    },
    {
        id: 'mat-7',
        name: 'AlgaeFoam',
        type: 'Bioplastic',
        subtype: 'Foam',
        description: 'Biodegradable foam material derived from algae, suitable for protective packaging and insulation. Offers excellent cushioning properties with minimal environmental impact.',
        thumbnail: 'https://placehold.co/600x400/7A9E9F/FFFFFF?text=AlgaeFoam',
        sustainability: {
            biodegradable: true,
            compostable: true,
            recyclable: false,
            biobased_content: 100,
            marine_biodegradable: true
        },
        applications: ['Protective packaging', 'Construction', 'Insulation'],
        source: 'Green Materials Technology',
        url: 'https://example.com/algaefoam',
        physical_properties: {
            density: {
                value: '0.025-0.045',
                unit: 'g/cm³'
            },
            water_absorption: {
                value: 2.5,
                unit: '%'
            },
            closed_cell_content: {
                value: 90,
                unit: '%'
            }
        },
        mechanical_properties: {
            compressive_strength: {
                value: 125,
                unit: 'kPa'
            },
            tensile_strength: {
                value: 200,
                unit: 'kPa'
            },
            elongation_at_break: {
                value: 15,
                unit: '%'
            }
        },
        thermal_properties: {
            thermal_conductivity: {
                value: 0.038,
                unit: 'W/m·K'
            },
            maximum_service_temperature: {
                value: 80,
                unit: '°C'
            }
        },
        processing_information: {
            processing_method: 'Expansion molding',
            expansion_ratio: {
                value: '20-40',
                unit: 'x'
            }
        },
        suitable_for: ['protective packaging', 'cushioning', 'thermal insulation', 'acoustic insulation'],
        not_suitable_for: ['food containers', 'beverage containers', 'structural applications', 'outdoor applications']
    },
    {
        id: 'mat-8',
        name: 'HempTex',
        type: 'Natural Fiber',
        subtype: 'Textile',
        description: 'Hemp-based textile material with natural antimicrobial properties for sustainable fashion. Durable, breathable, and requires minimal water and pesticides to produce.',
        thumbnail: 'https://placehold.co/600x400/00A86B/FFFFFF?text=HempTex',
        sustainability: {
            biodegradable: true,
            compostable: true,
            recyclable: true,
            biobased_content: 100
        },
        applications: ['Textiles', 'Fashion', 'Home furnishings'],
        source: 'Sustainable Textiles Research',
        url: 'https://example.com/hemptex',
        physical_properties: {
            density: {
                value: 1.48,
                unit: 'g/cm³'
            },
            moisture_regain: {
                value: 12,
                unit: '%'
            },
            fiber_length: {
                value: '20-100',
                unit: 'mm'
            }
        },
        mechanical_properties: {
            tensile_strength: {
                value: 550,
                unit: 'MPa'
            },
            elongation_at_break: {
                value: 1.6,
                unit: '%'
            },
            abrasion_resistance: {
                value: 'Good',
                unit: ''
            }
        },
        thermal_properties: {
            thermal_conductivity: {
                value: 0.040,
                unit: 'W/m·K'
            },
            maximum_service_temperature: {
                value: 150,
                unit: '°C'
            }
        },
        processing_information: {
            processing_methods: ['Spinning', 'Weaving', 'Knitting', 'Nonwoven'],
            dyeing_properties: 'Good color absorption with natural dyes'
        },
        suitable_for: ['clothing', 'upholstery', 'home textiles', 'industrial textiles'],
        not_suitable_for: ['food packaging', 'beverage containers', 'medical implants']
    }
];

// Export the enhanced materials data for use in other modules
window.EnhancedMaterialsData = {
    ENHANCED_MATERIALS
};
