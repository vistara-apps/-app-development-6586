import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export class ConversationService {
  static async sendMessage(message, context = {}) {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      const conversationHistory = context.messages || [];
      
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: "user", content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        content: response.choices[0].message.content,
        sender: 'assistant',
        type: 'text'
      };
    } catch (error) {
      console.error('Error in conversation service:', error);
      return {
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        sender: 'assistant',
        type: 'error'
      };
    }
  }

  static getSystemPrompt(context) {
    const { activeAssistant, currentPage, geneticData, recommendations, userProgress } = context;
    
    const basePrompt = `You are GeneWise AI, a helpful and knowledgeable assistant for a genetic analysis and personalized health platform. You help users understand their genetic data, navigate the platform, and make sense of their personalized health recommendations.

Key principles:
- Be friendly, supportive, and encouraging
- Explain complex genetic concepts in simple terms
- Always prioritize user privacy and data security
- Provide actionable, science-based advice
- Ask clarifying questions when needed
- Be empathetic about health concerns`;

    const contextPrompts = {
      general: `${basePrompt}

You're helping users with general questions about GeneWise, genetic testing, and health optimization. You can guide them through the platform and explain how genetic analysis works.`,

      onboarding: `${basePrompt}

You're guiding a new user through the GeneWise onboarding process. Help them understand:
- What genetic data they need and how to upload it
- What to expect from the analysis
- How to set up their health profile
- Privacy and security measures
- Next steps after onboarding

Be encouraging and address any concerns they might have about genetic testing.`,

      analysis: `${basePrompt}

You're helping users understand the genetic analysis process. You can explain:
- What different genetic markers mean
- How genetic variants affect health and traits
- The analysis process and timeline
- What the results will include
- Scientific basis behind genetic testing

Current genetic data context: ${geneticData ? JSON.stringify(geneticData) : 'No genetic data uploaded yet'}`,

      recommendations: `${basePrompt}

You're helping users understand their personalized recommendations. You can explain:
- Why specific recommendations were made based on their genetics
- How to implement nutrition and fitness suggestions
- The science behind genetic-based recommendations
- How to track progress and adjust recommendations

Current recommendations context: ${recommendations ? JSON.stringify(recommendations) : 'No recommendations generated yet'}`,

      dashboard: `${basePrompt}

You're helping users navigate their dashboard and understand their results. You can explain:
- How to read their genetic analysis results
- What their health metrics mean
- How to use different features of the platform
- Next steps for optimization

User progress context: ${userProgress ? JSON.stringify(userProgress) : 'New user'}`
    };

    return contextPrompts[activeAssistant] || contextPrompts.general;
  }

  static async generateSuggestions(context) {
    const { currentPage, activeAssistant } = context;
    
    const suggestions = {
      home: [
        "How does genetic testing work?",
        "What can I learn from my DNA?",
        "Is my genetic data secure?",
        "How accurate are the recommendations?"
      ],
      onboarding: [
        "What genetic data do I need?",
        "How do I upload my DNA file?",
        "What happens to my data?",
        "How long does analysis take?"
      ],
      analysis: [
        "What do these genetic markers mean?",
        "How reliable are genetic tests?",
        "Can I upload data from 23andMe?",
        "What health insights will I get?"
      ],
      recommendations: [
        "Why was this recommended for me?",
        "How do I implement these suggestions?",
        "Can I modify my recommendations?",
        "How often should I update my profile?"
      ],
      dashboard: [
        "How do I read my results?",
        "What should I focus on first?",
        "How can I track my progress?",
        "When should I update my data?"
      ]
    };

    return suggestions[currentPage] || suggestions.home;
  }

  static async explainGeneticConcept(concept, userLevel = 'beginner') {
    try {
      const prompt = `Explain the genetic concept "${concept}" in simple terms for a ${userLevel} level understanding. 
      
      Include:
      1. What it is in simple terms
      2. Why it matters for health
      3. How it affects daily life
      4. Any actionable insights
      
      Keep it conversational and encouraging. Avoid overwhelming technical details.`;

      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      return {
        content: response.choices[0].message.content,
        sender: 'assistant',
        type: 'explanation'
      };
    } catch (error) {
      console.error('Error explaining genetic concept:', error);
      return {
        content: `I'd be happy to explain ${concept}, but I'm having trouble accessing that information right now. Please try asking again in a moment.`,
        sender: 'assistant',
        type: 'error'
      };
    }
  }

  static async generateWelcomeMessage(context) {
    const { activeAssistant, currentPage } = context;
    
    const welcomeMessages = {
      general: "Hi! I'm your GeneWise AI assistant. I'm here to help you understand genetic testing and make the most of your personalized health insights. What would you like to know?",
      onboarding: "Welcome to GeneWise! I'm here to guide you through setting up your account and uploading your genetic data. Let's start your personalized health journey together!",
      analysis: "I'm here to help you understand the genetic analysis process. Whether you have questions about uploading your data or want to know what to expect from your results, just ask!",
      recommendations: "Great! I can help you understand your personalized recommendations and how to implement them in your daily life. What would you like to explore first?",
      dashboard: "Welcome to your GeneWise dashboard! I can help you navigate your results, understand your health metrics, and plan your next steps. How can I assist you today?"
    };

    return {
      content: welcomeMessages[activeAssistant] || welcomeMessages.general,
      sender: 'assistant',
      type: 'welcome'
    };
  }
}
