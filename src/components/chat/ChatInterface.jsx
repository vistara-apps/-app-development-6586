import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, X, Minimize2, Maximize2 } from 'lucide-react';
import { useConversation } from '../../context/ConversationContext';
import { ConversationService } from '../../services/conversationService';
import MessageBubble from './MessageBubble';
import AccessibleButton from '../AccessibleButton';

const ChatInterface = ({ isMinimized = false, onToggleMinimize, onClose, className = '' }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const {
    messages,
    isLoading,
    context,
    activeAssistant,
    addMessage,
    setLoading,
    updateContext
  } = useConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load suggestions when context changes
  useEffect(() => {
    const loadSuggestions = async () => {
      const newSuggestions = await ConversationService.generateSuggestions(context);
      setSuggestions(newSuggestions);
    };
    loadSuggestions();
  }, [context, activeAssistant]);

  // Send welcome message when chat opens
  useEffect(() => {
    if (messages.length === 0) {
      const sendWelcomeMessage = async () => {
        const welcomeMessage = await ConversationService.generateWelcomeMessage({
          activeAssistant,
          currentPage: context.currentPage
        });
        addMessage(welcomeMessage);
      };
      sendWelcomeMessage();
    }
  }, [activeAssistant, context.currentPage, messages.length, addMessage]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      content: messageText.trim(),
      sender: 'user',
      type: 'text'
    };

    addMessage(userMessage);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await ConversationService.sendMessage(messageText, {
        ...context,
        activeAssistant,
        messages: [...messages, userMessage]
      });
      
      addMessage(response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        content: "I'm sorry, I encountered an error. Please try again.",
        sender: 'assistant',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  if (isMinimized) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">GeneWise AI</span>
          </div>
          <div className="flex items-center space-x-1">
            <AccessibleButton
              onClick={onToggleMinimize}
              variant="ghost"
              size="sm"
              ariaLabel="Expand chat"
            >
              <Maximize2 className="h-4 w-4" />
            </AccessibleButton>
            {onClose && (
              <AccessibleButton
                onClick={onClose}
                variant="ghost"
                size="sm"
                ariaLabel="Close chat"
              >
                <X className="h-4 w-4" />
              </AccessibleButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gene-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gene-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">GeneWise Assistant</h3>
            <p className="text-xs text-gray-600 capitalize">{activeAssistant} mode</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {onToggleMinimize && (
            <AccessibleButton
              onClick={onToggleMinimize}
              variant="ghost"
              size="sm"
              ariaLabel="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </AccessibleButton>
          )}
          {onClose && (
            <AccessibleButton
              onClick={onClose}
              variant="ghost"
              size="sm"
              ariaLabel="Close chat"
            >
              <X className="h-4 w-4" />
            </AccessibleButton>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-64">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.sender === 'user'}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin text-gene-600" />
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors duration-200"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your genetic health..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gene-500 focus:border-transparent"
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <AccessibleButton
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            variant="primary"
            size="sm"
            className="bg-gene-600 hover:bg-gene-700 px-3 py-2"
            ariaLabel="Send message"
          >
            <Send className="h-4 w-4" />
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
