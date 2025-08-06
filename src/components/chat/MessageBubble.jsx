import React from 'react';
import { Bot, User, AlertCircle, Lightbulb } from 'lucide-react';

const MessageBubble = ({ message, isUser = false }) => {
  const { content, type = 'text', timestamp } = message;

  const getMessageIcon = () => {
    if (isUser) return <User className="h-4 w-4" />;
    
    switch (type) {
      case 'welcome':
        return <Bot className="h-4 w-4 text-gene-600" />;
      case 'explanation':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bot className="h-4 w-4 text-gene-600" />;
    }
  };

  const getMessageStyles = () => {
    if (isUser) {
      return 'bg-gene-600 text-white ml-auto';
    }
    
    switch (type) {
      case 'welcome':
        return 'bg-gradient-to-r from-gene-50 to-blue-50 text-gray-800 border border-gene-200';
      case 'explanation':
        return 'bg-yellow-50 text-gray-800 border border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-800 border border-red-200';
      default:
        return 'bg-white text-gray-800 border border-gray-200 shadow-sm';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${getMessageStyles()}`}>
        <div className="flex items-start space-x-2">
          {!isUser && (
            <div className="flex-shrink-0 mt-0.5">
              {getMessageIcon()}
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
            {timestamp && (
              <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
                {formatTimestamp(timestamp)}
              </div>
            )}
          </div>
          {isUser && (
            <div className="flex-shrink-0 mt-0.5">
              {getMessageIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
