import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export class AIService {
  static async generateNutritionRecommendations(geneticData, healthProfile) {
    try {
      const prompt = `Based on the following genetic data and health profile, provide personalized nutrition recommendations:

Genetic Data: ${JSON.stringify(geneticData)}
Health Profile: ${JSON.stringify(healthProfile)}

Please provide:
1. Recommended foods (specific items with reasons)
2. Foods to avoid or limit
3. Supplement recommendations
4. Meal timing suggestions
5. Dietary pattern recommendations

Format the response as JSON with the following structure:
{
  "recommendedFoods": [{"food": "food name", "reason": "genetic reason", "frequency": "how often"}],
  "avoidFoods": [{"food": "food name", "reason": "genetic reason"}],
  "supplements": [{"supplement": "name", "dosage": "amount", "reason": "why needed"}],
  "mealTiming": "suggestions",
  "dietaryPattern": "recommended pattern"
}`;

      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating nutrition recommendations:', error);
      return this.getFallbackNutritionRecommendations();
    }
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