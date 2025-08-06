import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useConversation } from '../../context/ConversationContext';
import ChatInterface from './ChatInterface';
import AccessibleButton from '../AccessibleButton';

const FloatingChatButton = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { isOpen, toggleChat, setChatOpen } = useConversation();

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setChatOpen(false);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <AccessibleButton
          onClick={toggleChat}
          className="bg-gene-600 hover:bg-gene-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          ariaLabel="Open AI assistant chat"
        >
          <MessageCircle className="h-6 w-6" />
        </AccessibleButton>
        
        {/* Notification dot for new features */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ChatInterface
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
        onClose={handleClose}
        className={`transition-all duration-300 ${
          isMinimized 
            ? 'w-64 h-16' 
            : 'w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]'
        }`}
      />
    </div>
  );
};

export default FloatingChatButton;
