/**
 * Genetic Analysis Service
 * Interprets genetic markers and maps them to nutritional implications
 */

export class GeneticAnalysisService {
  
  /**
   * Genetic marker interpretation database
   * Maps genetic variants to their functional implications
   */
  static GENETIC_MARKERS = {
    CYP1A2: {
      name: 'Caffeine Metabolism',
      variants: {
        'AA': {
          phenotype: 'Fast metabolizer',
          implications: {
            caffeine: 'Can tolerate higher caffeine intake (up to 400mg/day)',
            recommendations: ['Green tea', 'Coffee', 'Dark chocolate'],
            risks: ['May need higher doses for stimulant effects'],
            confidence: 0.9
          }
        },
        'AC': {
          phenotype: 'Intermediate metabolizer',
          implications: {
            caffeine: 'Moderate caffeine tolerance (200-300mg/day)',
            recommendations: ['Moderate coffee intake', 'Green tea preferred'],
            risks: ['Monitor for jitters or sleep disruption'],
            confidence: 0.85
          }
        },
        'CC': {
          phenotype: 'Slow metabolizer',
          implications: {
            caffeine: 'Low caffeine tolerance (less than 200mg/day)',
            recommendations: ['Limit coffee', 'Herbal teas', 'Decaf options'],
            risks: ['Increased anxiety', 'Sleep disruption', 'Cardiovascular stress'],
            confidence: 0.9
          }
        }
      }
    },
    
    MTHFR: {
      name: 'Folate Metabolism',
      variants: {
        'CC': {
          phenotype: 'Normal folate processing',
          implications: {
            folate: 'Standard folate requirements',
            recommendations: ['Leafy greens', 'Legumes', 'Fortified grains'],
            risks: ['Standard population risks'],
            confidence: 0.8
          }
        },
        'CT': {
          phenotype: 'Reduced folate processing (30-40%)',
          implications: {
            folate: 'Increased folate needs, prefer methylfolate',
            recommendations: ['Dark leafy greens', 'Methylfolate supplements', 'Liver', 'Asparagus'],
            risks: ['Elevated homocysteine', 'Cardiovascular risk', 'Neural tube defects'],
            confidence: 0.9
          }
        },
        'TT': {
          phenotype: 'Significantly reduced folate processing (70%)',
          implications: {
            folate: 'High folate needs, methylfolate essential',
            recommendations: ['High-folate foods daily', 'Methylfolate supplements', 'B-complex vitamins'],
            risks: ['High homocysteine', 'Cardiovascular disease', 'Depression risk'],
            confidence: 0.95
          }
        }
      }
    },
    
    APOE: {
      name: 'Alzheimer\'s Risk & Lipid Metabolism',
      variants: {
        'E2/E2': {
          phenotype: 'Protective variant',
          implications: {
            lipids: 'Lower cholesterol levels, better lipid clearance',
            recommendations: ['Mediterranean diet', 'Omega-3 rich foods', 'Antioxidant-rich foods'],
            risks: ['Lower Alzheimer\'s risk'],
            confidence: 0.85
          }
        },
        'E3/E3': {
          phenotype: 'Standard risk',
          implications: {
            lipids: 'Normal lipid metabolism',
            recommendations: ['Balanced diet', 'Regular omega-3 intake', 'Antioxidants'],
            risks: ['Average Alzheimer\'s risk'],
            confidence: 0.8
          }
        },
        'E4/E4': {
          phenotype: 'High risk variant',
          implications: {
            lipids: 'Impaired lipid clearance, higher cholesterol',
            recommendations: ['Low saturated fat', 'High omega-3', 'Curcumin', 'Blueberries', 'Walnuts'],
            risks: ['15x higher Alzheimer\'s risk', 'Cardiovascular disease'],
            confidence: 0.95
          }
        }
      }
    },
    
    ACE: {
      name: 'Blood Pressure Regulation',
      variants: {
        'DD': {
          phenotype: 'Higher ACE activity',
          implications: {
            sodium: 'More sensitive to sodium intake',
            recommendations: ['Low sodium diet', 'DASH diet', 'Potassium-rich foods', 'Magnesium'],
            risks: ['Hypertension', 'Cardiovascular disease'],
            confidence: 0.8
          }
        },
        'ID': {
          phenotype: 'Intermediate ACE activity',
          implications: {
            sodium: 'Moderate sodium sensitivity',
            recommendations: ['Moderate sodium restriction', 'Balanced electrolytes'],
            risks: ['Moderate hypertension risk'],
            confidence: 0.75
          }
        },
        'II': {
          phenotype: 'Lower ACE activity',
          implications: {
            sodium: 'Less sodium sensitive',
            recommendations: ['Standard sodium intake', 'Focus on overall diet quality'],
            risks: ['Lower hypertension risk'],
            confidence: 0.8
          }
        }
      }
    },
    
    FTO: {
      name: 'Weight Management & Appetite',
      variants: {
        'TT': {
          phenotype: 'Lower obesity risk',
          implications: {
            weight: 'Better appetite control, lower BMI tendency',
            recommendations: ['Standard caloric intake', 'Regular meal timing'],
            risks: ['Lower obesity risk'],
            confidence: 0.8
          }
        },
        'AT': {
          phenotype: 'Moderate obesity risk',
          implications: {
            weight: 'Moderate appetite control challenges',
            recommendations: ['Portion control', 'High protein meals', 'Regular exercise'],
            risks: ['Moderate weight gain tendency'],
            confidence: 0.85
          }
        },
        'AA': {
          phenotype: 'Higher obesity risk',
          implications: {
            weight: 'Increased appetite, slower satiety signals',
            recommendations: ['High protein diet', 'Frequent small meals', 'High fiber foods', 'Mindful eating'],
            risks: ['Higher obesity risk', 'Metabolic syndrome'],
            confidence: 0.9
          }
        }
      }
    },
    
    MC1R: {
      name: 'Vitamin D Synthesis',
      variants: {
        'CC': {
          phenotype: 'Normal vitamin D synthesis',
          implications: {
            vitaminD: 'Standard vitamin D requirements',
            recommendations: ['Moderate sun exposure', 'Vitamin D rich foods'],
            risks: ['Standard deficiency risk'],
            confidence: 0.8
          }
        },
        'CT': {
          phenotype: 'Reduced vitamin D synthesis',
          implications: {
            vitaminD: 'Increased vitamin D needs',
            recommendations: ['Vitamin D supplements', 'Fatty fish', 'Fortified foods', 'Safe sun exposure'],
            risks: ['Higher deficiency risk', 'Bone health issues'],
            confidence: 0.85
          }
        },
        'TT': {
          phenotype: 'Significantly reduced synthesis',
          implications: {
            vitaminD: 'High vitamin D supplementation needs',
            recommendations: ['High-dose vitamin D3', 'Regular monitoring', 'Calcium-rich foods'],
            risks: ['Very high deficiency risk', 'Osteoporosis risk'],
            confidence: 0.9
          }
        }
      }
    },
    
    COMT: {
      name: 'Stress Response & Dopamine',
      variants: {
        'Val/Val': {
          phenotype: 'Fast dopamine clearance',
          implications: {
            stress: 'Better stress tolerance, may need more stimulation',
            recommendations: ['Moderate caffeine OK', 'Challenging activities', 'Varied diet'],
            risks: ['May seek more stimulation'],
            confidence: 0.8
          }
        },
        'Val/Met': {
          phenotype: 'Intermediate dopamine clearance',
          implications: {
            stress: 'Balanced stress response',
            recommendations: ['Moderate stimulants', 'Balanced lifestyle', 'Stress management'],
            risks: ['Moderate stress sensitivity'],
            confidence: 0.75
          }
        },
        'Met/Met': {
          phenotype: 'Slow dopamine clearance',
          implications: {
            stress: 'Higher stress sensitivity, better focus',
            recommendations: ['Limit caffeine', 'Stress-reducing foods', 'Magnesium', 'L-theanine'],
            risks: ['Anxiety', 'Stress-related disorders'],
            confidence: 0.85
          }
        }
      }
    }
  };

  /**
   * Analyzes genetic markers and returns comprehensive interpretation
   * @param {Object} geneticData - Raw genetic data with markers
   * @returns {Object} Analyzed genetic profile with implications
   */
  static analyzeGeneticProfile(geneticData) {
    if (!geneticData || !geneticData.markers) {
      throw new Error('Invalid genetic data provided');
    }

    const analysis = {
      markers: {},
      overallRisk: {},
      nutritionalNeeds: {},
      confidence: 0,
      timestamp: new Date().toISOString()
    };

    let totalConfidence = 0;
    let markerCount = 0;

    // Analyze each genetic marker
    Object.entries(geneticData.markers).forEach(([marker, variant]) => {
      if (this.GENETIC_MARKERS[marker]) {
        const markerInfo = this.GENETIC_MARKERS[marker];
        const variantInfo = markerInfo.variants[variant];
        
        if (variantInfo) {
          analysis.markers[marker] = {
            name: markerInfo.name,
            variant: variant,
            phenotype: variantInfo.phenotype,
            implications: variantInfo.implications,
            confidence: variantInfo.confidence
          };
          
          totalConfidence += variantInfo.confidence;
          markerCount++;
        }
      }
    });

    // Calculate overall confidence
    analysis.confidence = markerCount > 0 ? totalConfidence / markerCount : 0;

    // Extract nutritional needs and risks
    analysis.nutritionalNeeds = this.extractNutritionalNeeds(analysis.markers);
    analysis.overallRisk = this.assessOverallRisk(analysis.markers);

    return analysis;
  }

  /**
   * Extracts specific nutritional needs from genetic analysis
   * @param {Object} markers - Analyzed genetic markers
   * @returns {Object} Nutritional requirements and recommendations
   */
  static extractNutritionalNeeds(markers) {
    const needs = {
      macronutrients: {},
      micronutrients: {},
      supplements: [],
      dietaryPatterns: [],
      restrictions: []
    };

    Object.entries(markers).forEach(([marker, analysis]) => {
      const implications = analysis.implications;
      
      // Extract specific nutritional needs based on marker
      switch (marker) {
        case 'MTHFR':
          if (analysis.variant !== 'CC') {
            needs.micronutrients.folate = {
              increased: true,
              type: 'methylfolate',
              reason: 'Reduced folate processing ability'
            };
            needs.supplements.push({
              name: 'Methylfolate',
              dosage: '400-800mcg',
              reason: 'Compensate for reduced MTHFR activity'
            });
          }
          break;
          
        case 'FTO':
          if (analysis.variant === 'AA') {
            needs.macronutrients.protein = {
              increased: true,
              percentage: '25-30%',
              reason: 'Better satiety and appetite control'
            };
            needs.dietaryPatterns.push('High protein, frequent small meals');
          }
          break;
          
        case 'APOE':
          if (analysis.variant.includes('E4')) {
            needs.macronutrients.saturatedFat = {
              restricted: true,
              limit: '<7% of calories',
              reason: 'Impaired lipid clearance'
            };
            needs.micronutrients.omega3 = {
              increased: true,
              amount: '2-3g daily',
              reason: 'Neuroprotection and lipid management'
            };
          }
          break;
          
        case 'MC1R':
          if (analysis.variant !== 'CC') {
            needs.micronutrients.vitaminD = {
              increased: true,
              amount: '2000-4000 IU',
              reason: 'Reduced synthesis capacity'
            };
          }
          break;
          
        case 'ACE':
          if (analysis.variant === 'DD') {
            needs.micronutrients.sodium = {
              restricted: true,
              limit: '<2300mg daily',
              reason: 'Increased sodium sensitivity'
            };
            needs.micronutrients.potassium = {
              increased: true,
              amount: '3500-4700mg',
              reason: 'Blood pressure regulation'
            };
          }
          break;
      }
    });

    return needs;
  }

  /**
   * Assesses overall health risks based on genetic profile
   * @param {Object} markers - Analyzed genetic markers
   * @returns {Object} Risk assessment for various health conditions
   */
  static assessOverallRisk(markers) {
    const risks = {
      cardiovascular: { level: 'low', factors: [] },
      metabolic: { level: 'low', factors: [] },
      neurological: { level: 'low', factors: [] },
      nutritional: { level: 'low', factors: [] }
    };

    Object.entries(markers).forEach(([marker, analysis]) => {
      switch (marker) {
        case 'APOE':
          if (analysis.variant.includes('E4')) {
            risks.cardiovascular.level = 'high';
            risks.cardiovascular.factors.push('APOE E4 variant');
            risks.neurological.level = 'high';
            risks.neurological.factors.push('Increased Alzheimer\'s risk');
          }
          break;
          
        case 'MTHFR':
          if (analysis.variant !== 'CC') {
            risks.cardiovascular.level = risks.cardiovascular.level === 'low' ? 'moderate' : 'high';
            risks.cardiovascular.factors.push('Elevated homocysteine risk');
            risks.nutritional.level = 'moderate';
            risks.nutritional.factors.push('Folate deficiency risk');
          }
          break;
          
        case 'FTO':
          if (analysis.variant === 'AA') {
            risks.metabolic.level = 'high';
            risks.metabolic.factors.push('Increased obesity risk');
          }
          break;
          
        case 'ACE':
          if (analysis.variant === 'DD') {
            risks.cardiovascular.level = risks.cardiovascular.level === 'low' ? 'moderate' : 'high';
            risks.cardiovascular.factors.push('Hypertension susceptibility');
          }
          break;
      }
    });

    return risks;
  }

  /**
   * Gets genetic marker interactions and compound effects
   * @param {Object} markers - Analyzed genetic markers
   * @returns {Array} Array of marker interactions
   */
  static getMarkerInteractions(markers) {
    const interactions = [];

    // APOE E4 + MTHFR interaction
    if (markers.APOE?.variant.includes('E4') && markers.MTHFR?.variant !== 'CC') {
      interactions.push({
        markers: ['APOE', 'MTHFR'],
        effect: 'Compound cardiovascular risk',
        recommendation: 'Aggressive folate supplementation and lipid management',
        priority: 'high'
      });
    }

    // FTO + COMT interaction for stress eating
    if (markers.FTO?.variant === 'AA' && markers.COMT?.variant === 'Met/Met') {
      interactions.push({
        markers: ['FTO', 'COMT'],
        effect: 'Stress-induced eating tendency',
        recommendation: 'Stress management techniques and structured meal planning',
        priority: 'moderate'
      });
    }

    // CYP1A2 + COMT interaction for caffeine sensitivity
    if (markers.CYP1A2?.variant === 'CC' && markers.COMT?.variant === 'Met/Met') {
      interactions.push({
        markers: ['CYP1A2', 'COMT'],
        effect: 'High caffeine sensitivity',
        recommendation: 'Strict caffeine limitation, consider L-theanine',
        priority: 'moderate'
      });
    }

    return interactions;
  }

  /**
   * Validates genetic data format and completeness
   * @param {Object} geneticData - Raw genetic data
   * @returns {Object} Validation result
   */
  static validateGeneticData(geneticData) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      completeness: 0
    };

    if (!geneticData) {
      validation.isValid = false;
      validation.errors.push('No genetic data provided');
      return validation;
    }

    if (!geneticData.markers) {
      validation.isValid = false;
      validation.errors.push('No genetic markers found');
      return validation;
    }

    // Check for required markers
    const requiredMarkers = Object.keys(this.GENETIC_MARKERS);
    const providedMarkers = Object.keys(geneticData.markers);
    const missingMarkers = requiredMarkers.filter(marker => !providedMarkers.includes(marker));
    
    if (missingMarkers.length > 0) {
      validation.warnings.push(`Missing markers: ${missingMarkers.join(', ')}`);
    }

    // Calculate completeness
    validation.completeness = (providedMarkers.length / requiredMarkers.length) * 100;

    // Validate marker variants
    providedMarkers.forEach(marker => {
      if (this.GENETIC_MARKERS[marker]) {
        const variant = geneticData.markers[marker];
        if (!this.GENETIC_MARKERS[marker].variants[variant]) {
          validation.warnings.push(`Unknown variant ${variant} for marker ${marker}`);
        }
      } else {
        validation.warnings.push(`Unknown marker: ${marker}`);
      }
    });

    return validation;
  }
}

