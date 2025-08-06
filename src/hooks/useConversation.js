import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConversation as useConversationContext } from '../context/ConversationContext';
import { useUser } from '../context/UserContext';

export const useConversation = () => {
  const conversation = useConversationContext();
  const { user } = useUser();
  const location = useLocation();

  // Update context when location or user data changes
  useEffect(() => {
    const currentPage = location.pathname.slice(1) || 'home';
    
    conversation.updateContext({
      currentPage,
      geneticData: user?.geneticData,
      recommendations: user?.recommendations,
      userProgress: {
        hasGeneticData: !!user?.geneticData,
        hasRecommendations: !!user?.recommendations,
        completedOnboarding: user?.onboardingComplete
      }
    });

    // Set appropriate assistant based on current page
    const assistantMap = {
      'home': 'general',
      'dashboard': 'dashboard',
      'analysis': 'analysis',
      'recommendations': 'recommendations',
      'subscription': 'general'
    };

    const newAssistant = assistantMap[currentPage] || 'general';
    if (conversation.activeAssistant !== newAssistant) {
      conversation.setActiveAssistant(newAssistant);
    }
  }, [location.pathname, user, conversation]);

  return conversation;
};

// Hook for managing conversation in specific contexts
export const useContextualConversation = (context = {}) => {
  const conversation = useConversation();

  useEffect(() => {
    if (Object.keys(context).length > 0) {
      conversation.updateContext(context);
    }
  }, [context, conversation]);

  return conversation;
};

// Hook for managing assistant-specific conversations
export const useAssistantConversation = (assistantType) => {
  const conversation = useConversation();

  useEffect(() => {
    if (assistantType && conversation.activeAssistant !== assistantType) {
      conversation.setActiveAssistant(assistantType);
    }
  }, [assistantType, conversation]);

  return conversation;
};
