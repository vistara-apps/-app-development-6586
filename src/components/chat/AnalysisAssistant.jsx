import React, { useState } from 'react';
import { HelpCircle, Info, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useConversation } from '../../context/ConversationContext';
import { ConversationService } from '../../services/conversationService';
import AccessibleButton from '../AccessibleButton';

const AnalysisAssistant = ({ geneticData, currentStep }) => {
  const [expandedHelp, setExpandedHelp] = useState(null);
  const { setChatOpen, setActiveAssistant, addMessage } = useConversation();

  const helpSections = {
    upload: {
      title: "Uploading Your Genetic Data",
      content: "Upload your raw DNA data file from companies like 23andMe, AncestryDNA, or MyHeritage. The file is usually named something like 'genome_data.txt' or similar.",
      quickQuestions: [
        "What file formats do you accept?",
        "How do I download my data from 23andMe?",
        "Is my genetic data secure during upload?"
      ]
    },
    profile: {
      title: "Creating Your Health Profile",
      content: "Your health profile helps us provide more accurate recommendations by understanding your current health status, goals, and lifestyle.",
      quickQuestions: [
        "Why do you need my health information?",
        "How does my age affect genetic recommendations?",
        "What if I have existing health conditions?"
      ]
    },
    analysis: {
      title: "Understanding Genetic Analysis",
      content: "We analyze specific genetic markers that influence your health, nutrition needs, fitness response, and wellness optimization.",
      quickQuestions: [
        "What genetic markers do you analyze?",
        "How long does the analysis take?",
        "What will my results include?"
      ]
    }
  };

  const geneticMarkerExplanations = {
    CYP1A2: "Controls how quickly you metabolize caffeine",
    MTHFR: "Affects folate metabolism and vitamin B needs",
    APOE: "Influences cardiovascular and brain health",
    ACE: "Related to blood pressure regulation",
    ACTN3: "The 'athlete gene' affecting muscle fiber type",
    FTO: "Influences weight management and metabolism",
    MC1R: "Affects vitamin D synthesis and skin health",
    COMT: "Controls stress response and neurotransmitter breakdown"
  };

  const handleQuickQuestion = async (question) => {
    setActiveAssistant('analysis');
    setChatOpen(true);
    
    // Add the question as a user message
    addMessage({
      content: question,
      sender: 'user',
      type: 'text'
    });

    // Get AI response
    try {
      const response = await ConversationService.sendMessage(question, {
        activeAssistant: 'analysis',
        currentPage: 'analysis',
        geneticData: geneticData
      });
      addMessage(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  const handleExplainMarker = async (marker) => {
    const question = `What does the ${marker} genetic marker mean and how does it affect my health?`;
    handleQuickQuestion(question);
  };

  const toggleHelpSection = (section) => {
    setExpandedHelp(expandedHelp === section ? null : section);
  };

  const getCurrentHelpSection = () => {
    if (currentStep === 1) return 'upload';
    if (currentStep === 2) return 'profile';
    if (currentStep >= 3) return 'analysis';
    return 'upload';
  };

  const currentSection = getCurrentHelpSection();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gene-600 rounded-full flex items-center justify-center">
          <HelpCircle className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Analysis Assistant</h3>
          <p className="text-sm text-gray-600">Get help with your genetic analysis</p>
        </div>
      </div>

      {/* Current Step Help */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gene-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-gene-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">
                {helpSections[currentSection].title}
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                {helpSections[currentSection].content}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Quick questions:</p>
                {helpSections[currentSection].quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="block w-full text-left text-xs bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded border border-gray-200 transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genetic Markers Explanation (if genetic data is available) */}
      {geneticData && (
        <div className="mb-6">
          <button
            onClick={() => toggleHelpSection('markers')}
            className="flex items-center justify-between w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-gray-900">Understand Your Genetic Markers</span>
            </div>
            {expandedHelp === 'markers' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {expandedHelp === 'markers' && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Click on any genetic marker to learn what it means for your health:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(geneticMarkerExplanations).map(([marker, description]) => (
                  <button
                    key={marker}
                    onClick={() => handleExplainMarker(marker)}
                    className="text-left p-3 bg-gray-50 hover:bg-gene-50 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-gene-200"
                  >
                    <div className="font-medium text-sm text-gray-900">{marker}</div>
                    <div className="text-xs text-gray-600 mt-1">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat with AI Button */}
      <div className="text-center">
        <AccessibleButton
          onClick={() => {
            setActiveAssistant('analysis');
            setChatOpen(true);
          }}
          variant="primary"
          className="bg-gene-600 hover:bg-gene-700 w-full"
          ariaLabel="Chat with analysis assistant"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Ask Analysis Assistant
        </AccessibleButton>
      </div>
    </div>
  );
};

export default AnalysisAssistant;
