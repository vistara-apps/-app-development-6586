import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MessageCircle, Lightbulb } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';
import AccessibleButton from './AccessibleButton';

const ConversationalFAQ = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const { setChatOpen, setActiveAssistant } = useConversation();

  const faqItems = [
    {
      id: 1,
      question: "How accurate are genetic health predictions?",
      answer: "Genetic testing provides valuable insights based on current scientific research, but it's important to understand that genetics is just one factor in your health. Our AI explains the science behind each recommendation and helps you understand the confidence levels of different predictions.",
      followUp: "Ask our AI: 'Explain the accuracy of genetic testing'"
    },
    {
      id: 2,
      question: "What genetic data formats do you accept?",
      answer: "We accept raw DNA data from major testing companies like 23andMe, AncestryDNA, MyHeritage, and others. Our AI can guide you through the upload process and explain what information we can extract from your specific data format.",
      followUp: "Ask our AI: 'How do I upload my genetic data?'"
    },
    {
      id: 3,
      question: "How do you protect my genetic privacy?",
      answer: "Your genetic data is encrypted, never shared with third parties, and you maintain full control. We use advanced security measures and comply with all privacy regulations. Our AI can explain our security measures in detail and answer any privacy concerns.",
      followUp: "Ask our AI: 'Tell me about data security and privacy'"
    },
    {
      id: 4,
      question: "Can I get recommendations without genetic data?",
      answer: "While genetic data provides the most personalized insights, our AI can still help with general health and wellness guidance based on your health profile, goals, and preferences. However, genetic-based recommendations are much more precise.",
      followUp: "Ask our AI: 'What can I do without genetic data?'"
    },
    {
      id: 5,
      question: "How often should I update my recommendations?",
      answer: "We recommend reviewing your recommendations every 3-6 months or when your health goals change. Our AI can help you track your progress and suggest when it's time to update your profile or recommendations.",
      followUp: "Ask our AI: 'When should I update my health profile?'"
    }
  ];

  const handleToggleExpand = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleAskAI = (followUpQuestion) => {
    setActiveAssistant('general');
    setChatOpen(true);
    // The chat will automatically show the welcome message, user can then ask the follow-up
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-gene-600 to-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600">
          Get instant answers or chat with our AI for personalized help
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleToggleExpand(item.id)}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              {expandedItem === item.id ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedItem === item.id && (
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {item.answer}
                </p>
                
                <div className="flex items-center justify-between bg-gradient-to-r from-gene-50 to-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-gene-600" />
                    <span className="text-sm text-gray-700">Want to know more?</span>
                  </div>
                  
                  <AccessibleButton
                    onClick={() => handleAskAI(item.followUp)}
                    variant="primary"
                    size="sm"
                    className="bg-gene-600 hover:bg-gene-700 text-xs"
                    ariaLabel={`Ask AI: ${item.followUp}`}
                  >
                    Ask AI
                  </AccessibleButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-gene-50 to-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            Still have questions?
          </h4>
          <p className="text-gray-600 mb-4">
            Our AI assistant is here to help with personalized answers
          </p>
          <AccessibleButton
            onClick={() => {
              setActiveAssistant('general');
              setChatOpen(true);
            }}
            variant="primary"
            className="bg-gene-600 hover:bg-gene-700"
            ariaLabel="Open AI chat assistant"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with AI Assistant
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

export default ConversationalFAQ;
