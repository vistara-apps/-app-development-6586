import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ConversationContext = createContext();

// Conversation state management
const conversationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_CONTEXT':
      return {
        ...state,
        context: { ...state.context, ...action.payload }
      };
    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        messages: [],
        isLoading: false
      };
    case 'SET_ACTIVE_ASSISTANT':
      return {
        ...state,
        activeAssistant: action.payload
      };
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case 'SET_CHAT_OPEN':
      return {
        ...state,
        isOpen: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  messages: [],
  isLoading: false,
  isOpen: false,
  context: {
    currentPage: 'home',
    userProgress: {},
    geneticData: null,
    recommendations: null
  },
  activeAssistant: 'general' // general, onboarding, analysis, recommendations, dashboard
};

export const ConversationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  const addMessage = useCallback((message) => {
    const messageWithId = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...message
    };
    dispatch({ type: 'ADD_MESSAGE', payload: messageWithId });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const updateContext = useCallback((contextUpdate) => {
    dispatch({ type: 'SET_CONTEXT', payload: contextUpdate });
  }, []);

  const clearConversation = useCallback(() => {
    dispatch({ type: 'CLEAR_CONVERSATION' });
  }, []);

  const setActiveAssistant = useCallback((assistant) => {
    dispatch({ type: 'SET_ACTIVE_ASSISTANT', payload: assistant });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  const setChatOpen = useCallback((open) => {
    dispatch({ type: 'SET_CHAT_OPEN', payload: open });
  }, []);

  const value = {
    ...state,
    addMessage,
    setLoading,
    updateContext,
    clearConversation,
    setActiveAssistant,
    toggleChat,
    setChatOpen
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

export default ConversationContext;
