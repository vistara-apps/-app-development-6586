/**
 * Nutrition Report Service
 * Generates comprehensive personalized nutrition reports based on genetic analysis and risk assessment
 */

import { GeneticAnalysisService } from './geneticAnalysisService.js';
import { RiskAssessmentService } from './riskAssessmentService.js';

export class NutritionReportService {
  
  /**
   * Food database with genetic-specific recommendations
   */
  static GENETIC_FOOD_DATABASE = {
    // High folate foods for MTHFR variants
    high_folate: [
      { food: 'Dark leafy greens (spinach, kale)', folate: '263mcg/cup', bioavailability: 'high' },
      { food: 'Asparagus', folate: '262mcg/cup', bioavailability: 'high' },
      { food: 'Brussels sprouts', folate: '156mcg/cup', bioavailability: 'moderate' },
      { food: 'Broccoli', folate: '104mcg/cup', bioavailability: 'moderate' },
      { food: 'Avocado', folate: '90mcg/cup', bioavailability: 'high' },
      { food: 'Lentils', folate: '358mcg/cup', bioavailability: 'moderate' },
      { food: 'Chickpeas', folate: '282mcg/cup', bioavailability: 'moderate' }
    ],
    
    // Omega-3 rich foods for APOE E4
    omega3_rich: [
      { food: 'Wild salmon', omega3: '1.8g/serving', type: 'EPA/DHA' },
      { food: 'Sardines', omega3: '1.3g/serving', type: 'EPA/DHA' },
      { food: 'Mackerel', omega3: '2.6g/serving', type: 'EPA/DHA' },
      { food: 'Walnuts', omega3: '2.5g/oz', type: 'ALA' },
      { food: 'Chia seeds', omega3: '5g/oz', type: 'ALA' },
      { food: 'Flaxseeds', omega3: '6.4g/oz', type: 'ALA' }
    ],
    
    // Low sodium foods for ACE DD
    low_sodium: [
      { food: 'Fresh fruits', sodium: '<5mg/serving', potassium: 'high' },
      { food: 'Fresh vegetables', sodium: '<10mg/serving', potassium: 'high' },
      { food: 'Plain yogurt', sodium: '150mg/cup', potassium: '573mg' },
      { food: 'Unsalted nuts', sodium: '<5mg/oz', potassium: 'moderate' },
      { food: 'Herbs and spices', sodium: '0mg', flavor: 'high' }
    ],
    
    // High protein foods for FTO AA
    high_protein: [
      { food: 'Lean chicken breast', protein: '31g/serving', satiety: 'high' },
      { food: 'Greek yogurt', protein: '20g/cup', satiety: 'high' },
      { food: 'Eggs', protein: '6g/egg', satiety: 'high' },
      { food: 'Quinoa', protein: '8g/cup', satiety: 'moderate' },
      { food: 'Legumes', protein: '15g/cup', satiety: 'high' },
      { food: 'Fish', protein: '25g/serving', satiety: 'high' }
    ],
    
    // Antioxidant-rich foods for neurological protection
    antioxidant_rich: [
      { food: 'Blueberries', antioxidants: 'anthocyanins', neuroprotection: 'high' },
      { food: 'Dark chocolate (70%+)', antioxidants: 'flavonoids', neuroprotection: 'moderate' },
      { food: 'Green tea', antioxidants: 'catechins', neuroprotection: 'moderate' },
      { food: 'Turmeric', antioxidants: 'curcumin', neuroprotection: 'high' },
      { food: 'Pomegranate', antioxidants: 'polyphenols', neuroprotection: 'moderate' }
    ]
  };

  /**
   * Meal timing templates based on genetic variants
   */
  static MEAL_TIMING_TEMPLATES = {
    standard: {
      pattern: '3 meals + 2 snacks',
      timing: 'Every 3-4 hours',
      rationale: 'Standard metabolic pattern'
    },
    high_protein_frequent: {
      pattern: '5-6 small meals',
      timing: 'Every 2-3 hours',
      rationale: 'Better appetite control for FTO variants'
    },
    time_restricted: {
      pattern: '2-3 meals in 8-10 hour window',
      timing: 'Intermittent fasting approach',
      rationale: 'Metabolic benefits for obesity-prone individuals'
    },
    circadian_optimized: {
      pattern: 'Larger breakfast, moderate lunch, light dinner',
      timing: 'Aligned with natural rhythms',
      rationale: 'Supports healthy sleep and metabolism'
    }
  };

  /**
   * Generates comprehensive personalized nutrition report
   * @param {Object} geneticData - Raw genetic data
   * @param {Object} healthProfile - User's health profile
   * @returns {Object} Comprehensive nutrition report
   */
  static async generateComprehensiveReport(geneticData, healthProfile) {
    try {
      // Step 1: Analyze genetic profile
      const geneticAnalysis = GeneticAnalysisService.analyzeGeneticProfile(geneticData);
      
      // Step 2: Assess risks
      const riskAssessment = RiskAssessmentService.assessRisks(geneticAnalysis, healthProfile);
      
      // Step 3: Generate personalized recommendations
      const nutritionRecommendations = this.generateNutritionRecommendations(geneticAnalysis, riskAssessment, healthProfile);
      
      // Step 4: Create meal plans
      const mealPlans = this.generateMealPlans(geneticAnalysis, nutritionRecommendations, healthProfile);
      
      // Step 5: Generate supplement protocol
      const supplementProtocol = this.generateSupplementProtocol(geneticAnalysis, riskAssessment);
      
      // Step 6: Create monitoring plan
      const monitoringPlan = this.generateNutritionalMonitoringPlan(geneticAnalysis, riskAssessment);

      return {
        reportId: this.generateReportId(),
        timestamp: new Date().toISOString(),
        geneticProfile: {
          markers: geneticAnalysis.markers,
          confidence: geneticAnalysis.confidence,
          interactions: GeneticAnalysisService.getMarkerInteractions(geneticAnalysis.markers)
        },
        riskProfile: riskAssessment,
        nutritionRecommendations: nutritionRecommendations,
        mealPlans: mealPlans,
        supplementProtocol: supplementProtocol,
        monitoringPlan: monitoringPlan,
        actionPriorities: this.prioritizeActions(riskAssessment, nutritionRecommendations),
        educationalContent: this.generateEducationalContent(geneticAnalysis)
      };
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      return this.generateFallbackReport(healthProfile);
    }
  }

  /**
   * Generates detailed nutrition recommendations based on genetic analysis
   */
  static generateNutritionRecommendations(geneticAnalysis, riskAssessment, healthProfile) {
    const recommendations = {
      macronutrients: {},
      micronutrients: {},
      foodCategories: {},
      avoidanceList: {},
      specialConsiderations: []
    };

    // Analyze each genetic marker for nutrition implications
    Object.entries(geneticAnalysis.markers).forEach(([marker, analysis]) => {
      switch (marker) {
        case 'MTHFR':
          this.addMTHFRRecommendations(recommendations, analysis);
          break;
        case 'APOE':
          this.addAPOERecommendations(recommendations, analysis);
          break;
        case 'FTO':
          this.addFTORecommendations(recommendations, analysis);
          break;
        case 'ACE':
          this.addACERecommendations(recommendations, analysis);
          break;
        case 'MC1R':
          this.addMC1RRecommendations(recommendations, analysis);
          break;
        case 'CYP1A2':
          this.addCYP1A2Recommendations(recommendations, analysis);
          break;
        case 'COMT':
          this.addCOMTRecommendations(recommendations, analysis);
          break;
      }
    });

    // Add risk-based modifications
    this.addRiskBasedModifications(recommendations, riskAssessment);

    return recommendations;
  }

  /**
   * Adds MTHFR-specific recommendations
   */
  static addMTHFRRecommendations(recommendations, analysis) {
    if (analysis.variant !== 'CC') {
      recommendations.micronutrients.folate = {
        requirement: 'Increased (800-1000mcg daily)',
        preferredForm: 'Methylfolate (5-MTHF)',
        foodSources: this.GENETIC_FOOD_DATABASE.high_folate,
        rationale: `${analysis.phenotype} - requires bioactive folate forms`,
        priority: 'critical'
      };

      recommendations.micronutrients.b12 = {
        requirement: 'Increased (1000mcg daily)',
        preferredForm: 'Methylcobalamin',
        rationale: 'Works synergistically with methylfolate',
        priority: 'high'
      };

      recommendations.avoidanceList.folic_acid = {
        reason: 'May interfere with methylfolate utilization',
        alternatives: 'Choose methylfolate supplements instead'
      };

      recommendations.specialConsiderations.push({
        consideration: 'Homocysteine monitoring',
        frequency: 'Every 6-12 months',
        target: '<10 μmol/L'
      });
    }
  }

  /**
   * Adds APOE-specific recommendations
   */
  static addAPOERecommendations(recommendations, analysis) {
    if (analysis.variant.includes('E4')) {
      recommendations.macronutrients.saturatedFat = {
        limit: '<7% of total calories',
        rationale: 'Impaired lipid clearance in APOE E4 carriers',
        priority: 'critical'
      };

      recommendations.macronutrients.omega3 = {
        requirement: 'High (2-3g EPA/DHA daily)',
        foodSources: this.GENETIC_FOOD_DATABASE.omega3_rich,
        rationale: 'Neuroprotection and lipid management',
        priority: 'critical'
      };

      recommendations.foodCategories.neuroprotective = {
        foods: this.GENETIC_FOOD_DATABASE.antioxidant_rich,
        frequency: 'Daily',
        rationale: 'Cognitive protection for APOE E4 carriers'
      };

      recommendations.avoidanceList.trans_fats = {
        reason: 'Particularly harmful for APOE E4 carriers',
        alternatives: 'Use olive oil, avocado oil instead'
      };
    }
  }

  /**
   * Adds FTO-specific recommendations
   */
  static addFTORecommendations(recommendations, analysis) {
    if (analysis.variant === 'AA') {
      recommendations.macronutrients.protein = {
        requirement: '25-30% of total calories',
        timing: 'At each meal',
        foodSources: this.GENETIC_FOOD_DATABASE.high_protein,
        rationale: 'Enhanced satiety for appetite control',
        priority: 'high'
      };

      recommendations.macronutrients.fiber = {
        requirement: '35-40g daily',
        rationale: 'Improved satiety and glucose control',
        priority: 'high'
      };

      recommendations.specialConsiderations.push({
        consideration: 'Meal frequency',
        recommendation: '5-6 smaller meals',
        rationale: 'Better appetite and blood sugar control'
      });
    }
  }

  /**
   * Adds ACE-specific recommendations
   */
  static addACERecommendations(recommendations, analysis) {
    if (analysis.variant === 'DD') {
      recommendations.micronutrients.sodium = {
        limit: '<2000mg daily',
        rationale: 'Increased sodium sensitivity',
        priority: 'high'
      };

      recommendations.micronutrients.potassium = {
        requirement: '3500-4700mg daily',
        foodSources: this.GENETIC_FOOD_DATABASE.low_sodium,
        rationale: 'Blood pressure regulation',
        priority: 'high'
      };

      recommendations.foodCategories.dash_foods = {
        pattern: 'DASH diet emphasis',
        rationale: 'Proven benefits for ACE DD variant'
      };
    }
  }

  /**
   * Adds MC1R-specific recommendations
   */
  static addMC1RRecommendations(recommendations, analysis) {
    if (analysis.variant !== 'CC') {
      recommendations.micronutrients.vitaminD = {
        requirement: analysis.variant === 'TT' ? '3000-4000 IU daily' : '2000-3000 IU daily',
        form: 'Vitamin D3 (cholecalciferol)',
        rationale: 'Reduced synthesis capacity',
        priority: 'high'
      };

      recommendations.micronutrients.calcium = {
        requirement: '1200mg daily',
        rationale: 'Support bone health with vitamin D',
        priority: 'moderate'
      };
    }
  }

  /**
   * Adds CYP1A2-specific recommendations
   */
  static addCYP1A2Recommendations(recommendations, analysis) {
    if (analysis.variant === 'CC') {
      recommendations.avoidanceList.high_caffeine = {
        limit: '<200mg daily',
        reason: 'Slow caffeine metabolism',
        alternatives: 'Herbal teas, decaf options'
      };

      recommendations.specialConsiderations.push({
        consideration: 'Caffeine timing',
        recommendation: 'No caffeine after 12 PM',
        rationale: 'Prevent sleep disruption'
      });
    }
  }

  /**
   * Adds COMT-specific recommendations
   */
  static addCOMTRecommendations(recommendations, analysis) {
    if (analysis.variant === 'Met/Met') {
      recommendations.micronutrients.magnesium = {
        requirement: '400-600mg daily',
        rationale: 'Stress response support',
        priority: 'moderate'
      };

      recommendations.specialConsiderations.push({
        consideration: 'Stress-reducing foods',
        foods: ['Green tea (L-theanine)', 'Dark chocolate', 'Chamomile tea'],
        rationale: 'Support stress-sensitive phenotype'
      });
    }
  }

  /**
   * Adds risk-based modifications to recommendations
   */
  static addRiskBasedModifications(recommendations, riskAssessment) {
    // High cardiovascular risk modifications
    if (riskAssessment.categories.cardiovascular.level === 'high') {
      recommendations.macronutrients.fiber = {
        ...recommendations.macronutrients.fiber,
        requirement: '40g daily',
        rationale: 'Cholesterol management'
      };
    }

    // High metabolic risk modifications
    if (riskAssessment.categories.metabolic.level === 'high') {
      recommendations.macronutrients.carbohydrates = {
        quality: 'Low glycemic index',
        timing: 'Earlier in day',
        rationale: 'Glucose control'
      };
    }
  }

  /**
   * Generates personalized meal plans
   */
  static generateMealPlans(geneticAnalysis, recommendations, healthProfile) {
    const mealPlans = {
      weekly: {},
      templates: {},
      timing: this.selectOptimalMealTiming(geneticAnalysis, healthProfile)
    };

    // Generate 7-day meal plan
    for (let day = 1; day <= 7; day++) {
      mealPlans.weekly[`day${day}`] = this.generateDayMealPlan(recommendations, day);
    }

    // Generate meal templates
    mealPlans.templates = {
      breakfast: this.generateMealTemplate('breakfast', recommendations),
      lunch: this.generateMealTemplate('lunch', recommendations),
      dinner: this.generateMealTemplate('dinner', recommendations),
      snacks: this.generateMealTemplate('snacks', recommendations)
    };

    return mealPlans;
  }

  /**
   * Selects optimal meal timing based on genetics
   */
  static selectOptimalMealTiming(geneticAnalysis, healthProfile) {
    // FTO AA variants benefit from frequent meals
    if (geneticAnalysis.markers.FTO?.variant === 'AA') {
      return this.MEAL_TIMING_TEMPLATES.high_protein_frequent;
    }

    // COMT Met/Met may benefit from circadian optimization
    if (geneticAnalysis.markers.COMT?.variant === 'Met/Met') {
      return this.MEAL_TIMING_TEMPLATES.circadian_optimized;
    }

    // Default to standard pattern
    return this.MEAL_TIMING_TEMPLATES.standard;
  }

  /**
   * Generates a single day meal plan
   */
  static generateDayMealPlan(recommendations, dayNumber) {
    return {
      breakfast: this.generateMeal('breakfast', recommendations, dayNumber),
      lunch: this.generateMeal('lunch', recommendations, dayNumber),
      dinner: this.generateMeal('dinner', recommendations, dayNumber),
      snacks: this.generateSnacks(recommendations, dayNumber)
    };
  }

  /**
   * Generates supplement protocol
   */
  static generateSupplementProtocol(geneticAnalysis, riskAssessment) {
    const protocol = {
      core: [],
      conditional: [],
      timing: {},
      interactions: [],
      monitoring: []
    };

    // Core supplements based on genetics
    Object.entries(geneticAnalysis.markers).forEach(([marker, analysis]) => {
      switch (marker) {
        case 'MTHFR':
          if (analysis.variant !== 'CC') {
            protocol.core.push({
              supplement: 'Methylfolate (5-MTHF)',
              dosage: analysis.variant === 'TT' ? '800-1000mcg' : '400-600mcg',
              timing: 'With breakfast',
              rationale: 'Compensate for reduced folate processing'
            });
          }
          break;
        
        case 'MC1R':
          if (analysis.variant !== 'CC') {
            protocol.core.push({
              supplement: 'Vitamin D3',
              dosage: analysis.variant === 'TT' ? '3000-4000 IU' : '2000-3000 IU',
              timing: 'With fat-containing meal',
              rationale: 'Reduced synthesis capacity'
            });
          }
          break;
      }
    });

    // Risk-based supplements
    if (riskAssessment.categories.cardiovascular.level === 'high') {
      protocol.core.push({
        supplement: 'Omega-3 (EPA/DHA)',
        dosage: '2-3g daily',
        timing: 'With meals',
        rationale: 'Cardiovascular protection'
      });
    }

    return protocol;
  }

  /**
   * Generates nutritional monitoring plan
   */
  static generateNutritionalMonitoringPlan(geneticAnalysis, riskAssessment) {
    const plan = {
      biomarkers: [],
      frequency: {},
      targets: {}
    };

    // MTHFR monitoring
    if (geneticAnalysis.markers.MTHFR?.variant !== 'CC') {
      plan.biomarkers.push({
        test: 'Homocysteine',
        frequency: 'Every 6 months',
        target: '<10 μmol/L',
        rationale: 'Monitor folate status'
      });
    }

    // APOE E4 monitoring
    if (geneticAnalysis.markers.APOE?.variant.includes('E4')) {
      plan.biomarkers.push({
        test: 'Lipid Panel',
        frequency: 'Every 6 months',
        target: 'LDL <100 mg/dL',
        rationale: 'Cardiovascular risk management'
      });
    }

    return plan;
  }

  /**
   * Prioritizes actions based on risk and genetic factors
   */
  static prioritizeActions(riskAssessment, nutritionRecommendations) {
    const actions = [];

    // Critical priority actions
    Object.entries(nutritionRecommendations.micronutrients).forEach(([nutrient, rec]) => {
      if (rec.priority === 'critical') {
        actions.push({
          action: `Optimize ${nutrient} intake`,
          priority: 'critical',
          timeline: 'immediate',
          details: rec
        });
      }
    });

    // High priority actions
    riskAssessment.prioritizedActions.forEach(action => {
      if (action.priority === 'critical') {
        actions.push(action);
      }
    });

    return actions.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, moderate: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Generates educational content about genetic variants
   */
  static generateEducationalContent(geneticAnalysis) {
    const content = {
      overview: 'Your genetic profile influences how your body processes nutrients and responds to different foods.',
      keyInsights: [],
      actionableAdvice: []
    };

    Object.entries(geneticAnalysis.markers).forEach(([marker, analysis]) => {
      content.keyInsights.push({
        marker: marker,
        name: analysis.name,
        finding: analysis.phenotype,
        implication: analysis.implications,
        confidence: analysis.confidence
      });
    });

    return content;
  }

  /**
   * Generates fallback report when analysis fails
   */
  static generateFallbackReport(healthProfile) {
    return {
      reportId: this.generateReportId(),
      timestamp: new Date().toISOString(),
      type: 'fallback',
      message: 'Using general recommendations due to analysis limitations',
      recommendations: {
        general: 'Follow a balanced, whole-foods based diet with adequate protein, healthy fats, and complex carbohydrates.',
        monitoring: 'Consider basic health screening annually'
      }
    };
  }

  /**
   * Generates unique report ID
   */
  static generateReportId() {
    return `NR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper methods for meal generation
   */
  static generateMeal(mealType, recommendations, dayNumber) {
    // Simplified meal generation - in a real implementation, this would be more sophisticated
    return {
      name: `${mealType} Day ${dayNumber}`,
      foods: ['Placeholder meal based on genetic recommendations'],
      nutrients: 'Optimized for genetic profile'
    };
  }

  static generateSnacks(recommendations, dayNumber) {
    return [
      { name: 'Morning snack', foods: ['Genetic-optimized snack'] },
      { name: 'Afternoon snack', foods: ['Genetic-optimized snack'] }
    ];
  }

  static generateMealTemplate(mealType, recommendations) {
    return {
      type: mealType,
      guidelines: 'Based on genetic recommendations',
      examples: ['Placeholder examples']
    };
  }
}

