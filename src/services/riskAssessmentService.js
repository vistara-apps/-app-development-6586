/**
 * Risk Assessment Service
 * Quantifies genetic predispositions into actionable risk levels and mitigation strategies
 */

export class RiskAssessmentService {
  
  /**
   * Risk scoring weights for different health conditions
   */
  static RISK_WEIGHTS = {
    cardiovascular: {
      APOE_E4: 3.0,
      MTHFR_variant: 2.0,
      ACE_DD: 2.5,
      age_factor: 1.5,
      lifestyle_factor: 2.0
    },
    metabolic: {
      FTO_AA: 3.5,
      APOE_E4: 1.5,
      age_factor: 1.2,
      lifestyle_factor: 2.5
    },
    neurological: {
      APOE_E4: 4.0,
      MTHFR_variant: 1.5,
      COMT_MetMet: 1.2,
      age_factor: 2.0,
      lifestyle_factor: 1.8
    },
    nutritional: {
      MTHFR_variant: 3.0,
      MC1R_variant: 2.0,
      CYP1A2_variant: 1.5,
      lifestyle_factor: 2.0
    }
  };

  /**
   * Risk thresholds for categorization
   */
  static RISK_THRESHOLDS = {
    low: { min: 0, max: 3 },
    moderate: { min: 3.1, max: 6 },
    high: { min: 6.1, max: 10 },
    very_high: { min: 10.1, max: 15 }
  };

  /**
   * Mitigation strategies database
   */
  static MITIGATION_STRATEGIES = {
    cardiovascular: {
      high: [
        {
          category: 'Diet',
          strategy: 'Mediterranean diet with <7% saturated fat',
          priority: 'critical',
          evidence: 'Strong clinical evidence for APOE E4 carriers'
        },
        {
          category: 'Supplements',
          strategy: 'Omega-3 fatty acids (2-3g EPA/DHA daily)',
          priority: 'high',
          evidence: 'Reduces inflammation and supports lipid metabolism'
        },
        {
          category: 'Monitoring',
          strategy: 'Lipid panel every 6 months, homocysteine annually',
          priority: 'critical',
          evidence: 'Early detection of metabolic changes'
        }
      ],
      moderate: [
        {
          category: 'Diet',
          strategy: 'DASH diet with moderate sodium restriction',
          priority: 'high',
          evidence: 'Proven blood pressure and lipid benefits'
        },
        {
          category: 'Exercise',
          strategy: '150 minutes moderate cardio + 2 days strength training',
          priority: 'high',
          evidence: 'Cardiovascular protection and metabolic benefits'
        }
      ],
      low: [
        {
          category: 'Prevention',
          strategy: 'Standard heart-healthy diet and regular exercise',
          priority: 'moderate',
          evidence: 'General population guidelines'
        }
      ]
    },
    
    metabolic: {
      high: [
        {
          category: 'Diet',
          strategy: 'High protein (25-30%), low glycemic index foods',
          priority: 'critical',
          evidence: 'Improves satiety and glucose control in FTO variants'
        },
        {
          category: 'Meal Timing',
          strategy: 'Intermittent fasting or time-restricted eating',
          priority: 'high',
          evidence: 'Metabolic benefits for obesity-prone individuals'
        },
        {
          category: 'Monitoring',
          strategy: 'HbA1c and fasting glucose every 6 months',
          priority: 'critical',
          evidence: 'Early diabetes detection'
        }
      ],
      moderate: [
        {
          category: 'Diet',
          strategy: 'Portion control and balanced macronutrients',
          priority: 'high',
          evidence: 'Weight management and metabolic health'
        },
        {
          category: 'Exercise',
          strategy: 'Combination cardio and resistance training',
          priority: 'high',
          evidence: 'Improves insulin sensitivity'
        }
      ]
    },
    
    neurological: {
      high: [
        {
          category: 'Diet',
          strategy: 'MIND diet with emphasis on berries and leafy greens',
          priority: 'critical',
          evidence: 'Neuroprotective for APOE E4 carriers'
        },
        {
          category: 'Supplements',
          strategy: 'Curcumin, omega-3, vitamin D optimization',
          priority: 'high',
          evidence: 'Anti-inflammatory and neuroprotective effects'
        },
        {
          category: 'Lifestyle',
          strategy: 'Cognitive training and stress management',
          priority: 'high',
          evidence: 'Cognitive reserve and neuroplasticity'
        }
      ],
      moderate: [
        {
          category: 'Diet',
          strategy: 'Antioxidant-rich foods and omega-3 sources',
          priority: 'moderate',
          evidence: 'General brain health support'
        }
      ]
    },
    
    nutritional: {
      high: [
        {
          category: 'Supplements',
          strategy: 'Methylfolate, B12, vitamin D based on genetic needs',
          priority: 'critical',
          evidence: 'Compensates for genetic processing deficiencies'
        },
        {
          category: 'Monitoring',
          strategy: 'B vitamins, homocysteine, vitamin D levels annually',
          priority: 'high',
          evidence: 'Prevents deficiency-related complications'
        }
      ],
      moderate: [
        {
          category: 'Diet',
          strategy: 'Nutrient-dense whole foods, varied diet',
          priority: 'moderate',
          evidence: 'Supports overall nutritional status'
        }
      ]
    }
  };

  /**
   * Calculates comprehensive risk assessment based on genetic profile and health data
   * @param {Object} geneticAnalysis - Results from genetic analysis service
   * @param {Object} healthProfile - User's health profile data
   * @returns {Object} Comprehensive risk assessment
   */
  static assessRisks(geneticAnalysis, healthProfile = {}) {
    const assessment = {
      overall: {},
      categories: {},
      prioritizedActions: [],
      monitoring: [],
      timestamp: new Date().toISOString()
    };

    // Calculate risk scores for each category
    assessment.categories.cardiovascular = this.calculateCardiovascularRisk(geneticAnalysis, healthProfile);
    assessment.categories.metabolic = this.calculateMetabolicRisk(geneticAnalysis, healthProfile);
    assessment.categories.neurological = this.calculateNeurologicalRisk(geneticAnalysis, healthProfile);
    assessment.categories.nutritional = this.calculateNutritionalRisk(geneticAnalysis, healthProfile);

    // Calculate overall risk profile
    assessment.overall = this.calculateOverallRisk(assessment.categories);

    // Generate prioritized action plan
    assessment.prioritizedActions = this.generateActionPlan(assessment.categories);

    // Generate monitoring recommendations
    assessment.monitoring = this.generateMonitoringPlan(assessment.categories, healthProfile);

    return assessment;
  }

  /**
   * Calculates cardiovascular disease risk
   */
  static calculateCardiovascularRisk(geneticAnalysis, healthProfile) {
    let score = 0;
    const factors = [];
    const weights = this.RISK_WEIGHTS.cardiovascular;

    // Genetic factors
    if (geneticAnalysis.markers.APOE?.variant.includes('E4')) {
      score += weights.APOE_E4;
      factors.push({
        factor: 'APOE E4 variant',
        contribution: weights.APOE_E4,
        description: 'Impaired lipid clearance and increased inflammation'
      });
    }

    if (geneticAnalysis.markers.MTHFR?.variant !== 'CC') {
      score += weights.MTHFR_variant;
      factors.push({
        factor: 'MTHFR variant',
        contribution: weights.MTHFR_variant,
        description: 'Elevated homocysteine risk'
      });
    }

    if (geneticAnalysis.markers.ACE?.variant === 'DD') {
      score += weights.ACE_DD;
      factors.push({
        factor: 'ACE DD variant',
        contribution: weights.ACE_DD,
        description: 'Increased sodium sensitivity and hypertension risk'
      });
    }

    // Age factor
    if (healthProfile.age) {
      const ageScore = this.calculateAgeFactor(healthProfile.age, 'cardiovascular');
      score += ageScore;
      if (ageScore > 0) {
        factors.push({
          factor: 'Age',
          contribution: ageScore,
          description: `Age-related cardiovascular risk (${healthProfile.age} years)`
        });
      }
    }

    // Lifestyle factors
    const lifestyleScore = this.calculateLifestyleFactor(healthProfile, 'cardiovascular');
    score += lifestyleScore;
    if (lifestyleScore > 0) {
      factors.push({
        factor: 'Lifestyle',
        contribution: lifestyleScore,
        description: 'Modifiable risk factors'
      });
    }

    return {
      score: Math.min(score, 15), // Cap at maximum
      level: this.categorizeRisk(score),
      factors: factors,
      mitigationStrategies: this.getMitigationStrategies('cardiovascular', this.categorizeRisk(score))
    };
  }

  /**
   * Calculates metabolic disease risk
   */
  static calculateMetabolicRisk(geneticAnalysis, healthProfile) {
    let score = 0;
    const factors = [];
    const weights = this.RISK_WEIGHTS.metabolic;

    // Genetic factors
    if (geneticAnalysis.markers.FTO?.variant === 'AA') {
      score += weights.FTO_AA;
      factors.push({
        factor: 'FTO AA variant',
        contribution: weights.FTO_AA,
        description: 'Increased appetite and obesity risk'
      });
    }

    if (geneticAnalysis.markers.APOE?.variant.includes('E4')) {
      score += weights.APOE_E4;
      factors.push({
        factor: 'APOE E4 variant',
        contribution: weights.APOE_E4,
        description: 'Metabolic dysfunction risk'
      });
    }

    // Age and lifestyle factors
    if (healthProfile.age) {
      const ageScore = this.calculateAgeFactor(healthProfile.age, 'metabolic');
      score += ageScore;
      if (ageScore > 0) {
        factors.push({
          factor: 'Age',
          contribution: ageScore,
          description: `Age-related metabolic changes (${healthProfile.age} years)`
        });
      }
    }

    const lifestyleScore = this.calculateLifestyleFactor(healthProfile, 'metabolic');
    score += lifestyleScore;
    if (lifestyleScore > 0) {
      factors.push({
        factor: 'Lifestyle',
        contribution: lifestyleScore,
        description: 'Diet and activity level impact'
      });
    }

    return {
      score: Math.min(score, 15),
      level: this.categorizeRisk(score),
      factors: factors,
      mitigationStrategies: this.getMitigationStrategies('metabolic', this.categorizeRisk(score))
    };
  }

  /**
   * Calculates neurological disease risk
   */
  static calculateNeurologicalRisk(geneticAnalysis, healthProfile) {
    let score = 0;
    const factors = [];
    const weights = this.RISK_WEIGHTS.neurological;

    // APOE E4 is the strongest neurological risk factor
    if (geneticAnalysis.markers.APOE?.variant === 'E4/E4') {
      score += weights.APOE_E4 * 1.5; // Higher weight for homozygous
      factors.push({
        factor: 'APOE E4/E4 variant',
        contribution: weights.APOE_E4 * 1.5,
        description: '15x increased Alzheimer\'s risk'
      });
    } else if (geneticAnalysis.markers.APOE?.variant.includes('E4')) {
      score += weights.APOE_E4;
      factors.push({
        factor: 'APOE E4 variant',
        contribution: weights.APOE_E4,
        description: '3-4x increased Alzheimer\'s risk'
      });
    }

    if (geneticAnalysis.markers.MTHFR?.variant !== 'CC') {
      score += weights.MTHFR_variant;
      factors.push({
        factor: 'MTHFR variant',
        contribution: weights.MTHFR_variant,
        description: 'Cognitive function and mood impact'
      });
    }

    if (geneticAnalysis.markers.COMT?.variant === 'Met/Met') {
      score += weights.COMT_MetMet;
      factors.push({
        factor: 'COMT Met/Met variant',
        contribution: weights.COMT_MetMet,
        description: 'Stress sensitivity and cognitive effects'
      });
    }

    // Age is critical for neurological risk
    if (healthProfile.age) {
      const ageScore = this.calculateAgeFactor(healthProfile.age, 'neurological');
      score += ageScore;
      if (ageScore > 0) {
        factors.push({
          factor: 'Age',
          contribution: ageScore,
          description: `Age-related neurological risk (${healthProfile.age} years)`
        });
      }
    }

    return {
      score: Math.min(score, 15),
      level: this.categorizeRisk(score),
      factors: factors,
      mitigationStrategies: this.getMitigationStrategies('neurological', this.categorizeRisk(score))
    };
  }

  /**
   * Calculates nutritional deficiency risk
   */
  static calculateNutritionalRisk(geneticAnalysis, healthProfile) {
    let score = 0;
    const factors = [];
    const weights = this.RISK_WEIGHTS.nutritional;

    if (geneticAnalysis.markers.MTHFR?.variant === 'TT') {
      score += weights.MTHFR_variant * 1.5;
      factors.push({
        factor: 'MTHFR TT variant',
        contribution: weights.MTHFR_variant * 1.5,
        description: 'Severe folate processing impairment'
      });
    } else if (geneticAnalysis.markers.MTHFR?.variant === 'CT') {
      score += weights.MTHFR_variant;
      factors.push({
        factor: 'MTHFR CT variant',
        contribution: weights.MTHFR_variant,
        description: 'Moderate folate processing impairment'
      });
    }

    if (geneticAnalysis.markers.MC1R?.variant !== 'CC') {
      score += weights.MC1R_variant;
      factors.push({
        factor: 'MC1R variant',
        contribution: weights.MC1R_variant,
        description: 'Reduced vitamin D synthesis'
      });
    }

    if (geneticAnalysis.markers.CYP1A2?.variant === 'CC') {
      score += weights.CYP1A2_variant;
      factors.push({
        factor: 'CYP1A2 slow metabolizer',
        contribution: weights.CYP1A2_variant,
        description: 'Caffeine sensitivity and processing issues'
      });
    }

    return {
      score: Math.min(score, 15),
      level: this.categorizeRisk(score),
      factors: factors,
      mitigationStrategies: this.getMitigationStrategies('nutritional', this.categorizeRisk(score))
    };
  }

  /**
   * Calculates age-related risk factor
   */
  static calculateAgeFactor(age, category) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 0;

    switch (category) {
      case 'cardiovascular':
        if (ageNum >= 65) return 2.0;
        if (ageNum >= 50) return 1.5;
        if (ageNum >= 40) return 1.0;
        return 0;
      
      case 'metabolic':
        if (ageNum >= 60) return 1.5;
        if (ageNum >= 45) return 1.0;
        return 0;
      
      case 'neurological':
        if (ageNum >= 70) return 3.0;
        if (ageNum >= 60) return 2.0;
        if (ageNum >= 50) return 1.0;
        return 0;
      
      default:
        return 0;
    }
  }

  /**
   * Calculates lifestyle-related risk factor
   */
  static calculateLifestyleFactor(healthProfile, category) {
    let score = 0;

    // Activity level impact
    if (healthProfile.activityLevel === 'sedentary') {
      score += 1.5;
    } else if (healthProfile.activityLevel === 'lightly_active') {
      score += 0.5;
    }

    // Existing conditions impact
    if (healthProfile.existingConditions) {
      const conditions = healthProfile.existingConditions.toLowerCase();
      if (conditions.includes('diabetes') || conditions.includes('hypertension')) {
        score += 1.0;
      }
      if (conditions.includes('obesity') || conditions.includes('overweight')) {
        score += 0.5;
      }
    }

    return score;
  }

  /**
   * Categorizes numerical risk score into risk level
   */
  static categorizeRisk(score) {
    if (score <= this.RISK_THRESHOLDS.low.max) return 'low';
    if (score <= this.RISK_THRESHOLDS.moderate.max) return 'moderate';
    if (score <= this.RISK_THRESHOLDS.high.max) return 'high';
    return 'very_high';
  }

  /**
   * Gets mitigation strategies for specific risk category and level
   */
  static getMitigationStrategies(category, level) {
    return this.MITIGATION_STRATEGIES[category]?.[level] || [];
  }

  /**
   * Calculates overall risk profile
   */
  static calculateOverallRisk(categories) {
    const scores = Object.values(categories).map(cat => cat.score);
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return {
      maxRiskScore: maxScore,
      averageRiskScore: avgScore,
      primaryRiskCategory: this.getPrimaryRiskCategory(categories),
      overallLevel: this.categorizeRisk(maxScore),
      riskDistribution: this.getRiskDistribution(categories)
    };
  }

  /**
   * Identifies the primary risk category
   */
  static getPrimaryRiskCategory(categories) {
    let maxScore = 0;
    let primaryCategory = 'low_risk';

    Object.entries(categories).forEach(([category, data]) => {
      if (data.score > maxScore) {
        maxScore = data.score;
        primaryCategory = category;
      }
    });

    return primaryCategory;
  }

  /**
   * Gets risk distribution across categories
   */
  static getRiskDistribution(categories) {
    const distribution = {};
    Object.entries(categories).forEach(([category, data]) => {
      distribution[category] = {
        level: data.level,
        score: data.score,
        percentage: Math.round((data.score / 15) * 100)
      };
    });
    return distribution;
  }

  /**
   * Generates prioritized action plan
   */
  static generateActionPlan(categories) {
    const actions = [];

    Object.entries(categories).forEach(([category, data]) => {
      if (data.level === 'high' || data.level === 'very_high') {
        data.mitigationStrategies.forEach(strategy => {
          if (strategy.priority === 'critical') {
            actions.push({
              category: category,
              action: strategy.strategy,
              priority: 'critical',
              evidence: strategy.evidence,
              timeline: 'immediate'
            });
          }
        });
      }
    });

    // Sort by priority
    return actions.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, moderate: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Generates monitoring plan based on risk assessment
   */
  static generateMonitoringPlan(categories, healthProfile) {
    const monitoring = [];

    Object.entries(categories).forEach(([category, data]) => {
      if (data.level === 'high' || data.level === 'very_high') {
        switch (category) {
          case 'cardiovascular':
            monitoring.push({
              test: 'Lipid Panel',
              frequency: 'Every 6 months',
              reason: 'Monitor cholesterol and triglycerides'
            });
            monitoring.push({
              test: 'Homocysteine',
              frequency: 'Annually',
              reason: 'MTHFR variant monitoring'
            });
            break;
          
          case 'metabolic':
            monitoring.push({
              test: 'HbA1c',
              frequency: 'Every 6 months',
              reason: 'Diabetes risk monitoring'
            });
            monitoring.push({
              test: 'Fasting Glucose',
              frequency: 'Every 6 months',
              reason: 'Metabolic health tracking'
            });
            break;
          
          case 'nutritional':
            monitoring.push({
              test: 'B Vitamin Panel',
              frequency: 'Annually',
              reason: 'MTHFR and folate status'
            });
            monitoring.push({
              test: 'Vitamin D',
              frequency: 'Every 6 months',
              reason: 'MC1R variant monitoring'
            });
            break;
        }
      }
    });

    return monitoring;
  }
}

