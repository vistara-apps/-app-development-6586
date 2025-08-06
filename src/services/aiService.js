import OpenAI from 'openai';
import { GeneticAnalysisService } from './geneticAnalysisService.js';
import { RiskAssessmentService } from './riskAssessmentService.js';
import { NutritionReportService } from './nutritionReportService.js';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export class AIService {
  static async generateNutritionRecommendations(geneticData, healthProfile) {
    try {
      // First, use our comprehensive genetic analysis system
      const comprehensiveReport = await NutritionReportService.generateComprehensiveReport(geneticData, healthProfile);
      
      // Then enhance with AI-generated natural language explanations
      const enhancedRecommendations = await this.enhanceWithAIExplanations(comprehensiveReport, geneticData, healthProfile);
      
      return enhancedRecommendations;
    } catch (error) {
      console.error('Error generating nutrition recommendations:', error);
      return this.getFallbackNutritionRecommendations();
    }
  }

  /**
   * Enhances genetic-based recommendations with AI-generated explanations
   */
  static async enhanceWithAIExplanations(comprehensiveReport, geneticData, healthProfile) {
    try {
      // Extract key genetic insights for AI processing
      const geneticInsights = this.extractGeneticInsights(comprehensiveReport);
      
      const prompt = `Based on the following genetic analysis and personalized nutrition report, create user-friendly recommendations with clear explanations:

GENETIC PROFILE:
${JSON.stringify(geneticInsights, null, 2)}

RISK ASSESSMENT:
${JSON.stringify(comprehensiveReport.riskProfile.overall, null, 2)}

HEALTH PROFILE:
${JSON.stringify(healthProfile, null, 2)}

Please provide personalized nutrition recommendations in the following JSON format, incorporating the genetic insights:
{
  "recommendedFoods": [{"food": "food name", "reason": "genetic-based reason", "frequency": "how often", "geneticBasis": "which genetic variant"}],
  "avoidFoods": [{"food": "food name", "reason": "genetic-based reason", "geneticBasis": "which genetic variant"}],
  "supplements": [{"supplement": "name", "dosage": "amount", "reason": "genetic rationale", "priority": "high/moderate/low"}],
  "mealTiming": "personalized timing based on genetic profile",
  "dietaryPattern": "recommended pattern with genetic rationale",
  "keyInsights": ["3-4 key genetic insights that drive the recommendations"],
  "riskMitigation": ["specific strategies based on genetic risk factors"]
}

Focus on:
1. Clear explanations of WHY each recommendation is important for this genetic profile
2. Practical, actionable advice
3. Prioritization based on genetic risk factors
4. User-friendly language that explains complex genetic concepts simply`;

      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const aiRecommendations = JSON.parse(response.choices[0].message.content);
      
      // Merge AI recommendations with comprehensive report data
      return this.mergeRecommendations(aiRecommendations, comprehensiveReport);
      
    } catch (error) {
      console.error('Error enhancing with AI explanations:', error);
      // Fall back to structured recommendations from comprehensive report
      return this.formatComprehensiveReportForUI(comprehensiveReport);
    }
  }

  /**
   * Extracts key genetic insights for AI processing
   */
  static extractGeneticInsights(comprehensiveReport) {
    const insights = {};
    
    Object.entries(comprehensiveReport.geneticProfile.markers).forEach(([marker, analysis]) => {
      insights[marker] = {
        variant: analysis.variant,
        phenotype: analysis.phenotype,
        keyImplications: analysis.implications,
        confidence: analysis.confidence
      };
    });
    
    return insights;
  }

  /**
   * Merges AI-generated recommendations with comprehensive genetic analysis
   */
  static mergeRecommendations(aiRecommendations, comprehensiveReport) {
    return {
      ...aiRecommendations,
      geneticProfile: comprehensiveReport.geneticProfile,
      riskAssessment: comprehensiveReport.riskProfile,
      supplementProtocol: comprehensiveReport.supplementProtocol,
      monitoringPlan: comprehensiveReport.monitoringPlan,
      actionPriorities: comprehensiveReport.actionPriorities,
      reportMetadata: {
        reportId: comprehensiveReport.reportId,
        timestamp: comprehensiveReport.timestamp,
        confidence: comprehensiveReport.geneticProfile.confidence
      }
    };
  }

  /**
   * Formats comprehensive report for UI when AI enhancement fails
   */
  static formatComprehensiveReportForUI(comprehensiveReport) {
    const recommendations = comprehensiveReport.nutritionRecommendations;
    
    return {
      recommendedFoods: this.formatFoodRecommendations(recommendations.foodCategories),
      avoidFoods: this.formatAvoidanceList(recommendations.avoidanceList),
      supplements: this.formatSupplementProtocol(comprehensiveReport.supplementProtocol),
      mealTiming: comprehensiveReport.mealPlans.timing.pattern,
      dietaryPattern: this.formatDietaryPattern(recommendations),
      keyInsights: this.formatKeyInsights(comprehensiveReport.geneticProfile),
      riskMitigation: this.formatRiskMitigation(comprehensiveReport.riskProfile),
      geneticProfile: comprehensiveReport.geneticProfile,
      riskAssessment: comprehensiveReport.riskProfile,
      reportMetadata: {
        reportId: comprehensiveReport.reportId,
        timestamp: comprehensiveReport.timestamp,
        confidence: comprehensiveReport.geneticProfile.confidence
      }
    };
  }

  /**
   * Helper methods for formatting comprehensive report data
   */
  static formatFoodRecommendations(foodCategories) {
    const foods = [];
    Object.entries(foodCategories).forEach(([category, data]) => {
      if (data.foods) {
        data.foods.forEach(food => {
          foods.push({
            food: food.food || food.name || category,
            reason: data.rationale || 'Genetic optimization',
            frequency: data.frequency || 'Regular',
            geneticBasis: category
          });
        });
      }
    });
    return foods;
  }

  static formatAvoidanceList(avoidanceList) {
    return Object.entries(avoidanceList).map(([food, data]) => ({
      food: food.replace('_', ' '),
      reason: data.reason,
      geneticBasis: 'Multiple genetic factors'
    }));
  }

  static formatSupplementProtocol(supplementProtocol) {
    return supplementProtocol.core.map(supp => ({
      supplement: supp.supplement,
      dosage: supp.dosage,
      reason: supp.rationale,
      priority: 'high'
    }));
  }

  static formatDietaryPattern(recommendations) {
    const patterns = [];
    if (recommendations.macronutrients.protein?.requirement) {
      patterns.push(`High protein (${recommendations.macronutrients.protein.requirement})`);
    }
    if (recommendations.macronutrients.saturatedFat?.limit) {
      patterns.push(`Low saturated fat (${recommendations.macronutrients.saturatedFat.limit})`);
    }
    return patterns.join(', ') || 'Balanced whole foods diet';
  }

  static formatKeyInsights(geneticProfile) {
    return Object.entries(geneticProfile.markers).map(([marker, analysis]) => 
      `${analysis.name}: ${analysis.phenotype} - ${Object.values(analysis.implications)[0]}`
    ).slice(0, 4);
  }

  static formatRiskMitigation(riskProfile) {
    return riskProfile.prioritizedActions.map(action => action.action).slice(0, 3);
  }

  static async generateFitnessRecommendations(geneticData, healthProfile) {
    try {
      const prompt = `Based on the following genetic data and health profile, provide personalized fitness recommendations:

Genetic Data: ${JSON.stringify(geneticData)}
Health Profile: ${JSON.stringify(healthProfile)}

Please provide:
1. Optimal exercise types
2. Training intensity recommendations
3. Recovery needs
4. Exercise frequency
5. Specific workout suggestions

Format the response as JSON with the following structure:
{
  "exerciseTypes": [{"type": "exercise type", "reason": "genetic reason", "intensity": "low/moderate/high"}],
  "trainingSchedule": "recommended frequency",
  "recoveryNeeds": "recovery recommendations",
  "specificWorkouts": [{"workout": "name", "duration": "time", "description": "details"}]
}`;

      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating fitness recommendations:', error);
      return this.getFallbackFitnessRecommendations();
    }
  }

  static async generateStressSleepRecommendations(geneticData, healthProfile) {
    try {
      const prompt = `Based on the following genetic data and health profile, provide personalized stress and sleep management recommendations:

Genetic Data: ${JSON.stringify(geneticData)}
Health Profile: ${JSON.stringify(healthProfile)}

Please provide:
1. Stress management techniques
2. Sleep optimization strategies
3. Relaxation methods
4. Environmental recommendations
5. Lifestyle adjustments

Format the response as JSON with the following structure:
{
  "stressManagement": [{"technique": "name", "description": "how to do it", "frequency": "how often"}],
  "sleepOptimization": [{"strategy": "name", "description": "details", "timing": "when to apply"}],
  "relaxationMethods": [{"method": "name", "duration": "time", "benefits": "what it helps with"}],
  "environmental": "environmental recommendations",
  "lifestyle": "lifestyle adjustments"
}`;

      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating stress/sleep recommendations:', error);
      return this.getFallbackStressSleepRecommendations();
    }
  }

  static getFallbackNutritionRecommendations() {
    return {
      recommendedFoods: [
        { food: "Leafy greens", reason: "Rich in folate for DNA methylation", frequency: "Daily" },
        { food: "Fatty fish", reason: "Omega-3s for inflammation control", frequency: "2-3 times per week" },
        { food: "Berries", reason: "Antioxidants for cellular protection", frequency: "Daily" }
      ],
      avoidFoods: [
        { food: "Processed meats", reason: "May increase inflammation markers" }
      ],
      supplements: [
        { supplement: "Vitamin D3", dosage: "1000-2000 IU", reason: "Support immune function" }
      ],
      mealTiming: "Eat within 12-hour window to support circadian rhythms",
      dietaryPattern: "Mediterranean-style diet with emphasis on whole foods"
    };
  }

  static getFallbackFitnessRecommendations() {
    return {
      exerciseTypes: [
        { type: "Moderate cardio", reason: "Supports cardiovascular health", intensity: "moderate" },
        { type: "Resistance training", reason: "Maintains muscle mass and bone density", intensity: "moderate" }
      ],
      trainingSchedule: "4-5 days per week with rest days",
      recoveryNeeds: "Ensure 7-9 hours of sleep and 1-2 rest days per week",
      specificWorkouts: [
        { workout: "Brisk walking", duration: "30 minutes", description: "Low-impact cardio exercise" }
      ]
    };
  }

  static getFallbackStressSleepRecommendations() {
    return {
      stressManagement: [
        { technique: "Deep breathing", description: "4-7-8 breathing technique", frequency: "Daily" }
      ],
      sleepOptimization: [
        { strategy: "Sleep hygiene", description: "Cool, dark room and consistent bedtime", timing: "Every night" }
      ],
      relaxationMethods: [
        { method: "Meditation", duration: "10-20 minutes", benefits: "Reduces cortisol levels" }
      ],
      environmental: "Keep bedroom temperature between 65-68°F",
      lifestyle: "Limit caffeine after 2 PM and screen time before bed"
    };
  }
}
