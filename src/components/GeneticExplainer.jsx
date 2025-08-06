import React, { useState } from 'react';
import { Info, ChevronRight, Dna, Brain, Heart, Zap } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';
import { ConversationService } from '../services/conversationService';
import AccessibleButton from './AccessibleButton';

const GeneticExplainer = ({ geneticData }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { setChatOpen, setActiveAssistant, addMessage } = useConversation();

  const markerCategories = {
    metabolism: {
      title: "Metabolism & Nutrition",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      markers: ['CYP1A2', 'MTHFR', 'FTO', 'MC1R'],
      description: "How your body processes nutrients and manages weight"
    },
    fitness: {
      title: "Fitness & Performance",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      markers: ['ACTN3', 'ACE'],
      description: "Your genetic predisposition for different types of exercise"
    },
    wellness: {
      title: "Mental Wellness",
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      markers: ['COMT', 'APOE'],
      description: "Stress response and cognitive health factors"
    }
  };

  const markerDetails = {
    CYP1A2: {
      name: "Caffeine Metabolism",
      description: "Determines how quickly you process caffeine",
      implications: "Affects optimal caffeine intake and timing",
      values: {
        'AA': 'Fast metabolizer - can handle more caffeine',
        'AC': 'Moderate metabolizer - average caffeine tolerance',
        'CC': 'Slow metabolizer - should limit caffeine intake'
      }
    },
    MTHFR: {
      name: "Folate Processing",
      description: "Affects how you process folate and B vitamins",
      implications: "Influences vitamin B supplement needs",
      values: {
        'CC': 'Normal folate processing',
        'CT': 'Slightly reduced folate processing',
        'TT': 'Significantly reduced - may need methylfolate'
      }
    },
    ACTN3: {
      name: "Athletic Performance",
      description: "The 'athlete gene' affecting muscle fiber type",
      implications: "Influences optimal exercise type",
      values: {
        'RR': 'Power athlete - better at explosive movements',
        'RX': 'Mixed - good at both power and endurance',
        'XX': 'Endurance athlete - better at sustained activities'
      }
    },
    FTO: {
      name: "Weight Management",
      description: "Influences metabolism and weight regulation",
      implications: "Affects weight management strategies",
      values: {
        'AA': 'Lower genetic risk for weight gain',
        'AT': 'Moderate genetic risk for weight gain',
        'TT': 'Higher genetic risk - may need stricter diet control'
      }
    },
    ACE: {
      name: "Blood Pressure",
      description: "Related to cardiovascular health and blood pressure",
      implications: "Influences exercise response and heart health",
      values: {
        'II': 'Better endurance performance, lower blood pressure risk',
        'ID': 'Balanced cardiovascular response',
        'DD': 'Better power performance, monitor blood pressure'
      }
    },
    MC1R: {
      name: "Vitamin D Synthesis",
      description: "Affects how well you produce vitamin D from sunlight",
      implications: "Influences vitamin D supplement needs",
      values: {
        'CC': 'Good vitamin D synthesis from sunlight',
        'CT': 'Moderate vitamin D synthesis',
        'TT': 'Poor synthesis - likely need supplements'
      }
    },
    COMT: {
      name: "Stress Response",
      description: "Controls neurotransmitter breakdown and stress handling",
      implications: "Affects stress management and cognitive function",
      values: {
        'Val/Val': 'Efficient stress handling, good under pressure',
        'Val/Met': 'Balanced stress response',
        'Met/Met': 'Sensitive to stress, benefits from stress management'
      }
    },
    APOE: {
      name: "Brain Health",
      description: "Influences cardiovascular and cognitive health",
      implications: "Affects brain health and Alzheimer's risk",
      values: {
        'E2/E2': 'Lower risk for cognitive decline',
        'E3/E3': 'Average risk for cognitive decline',
        'E4/E4': 'Higher risk - focus on brain-healthy lifestyle'
      }
    }
  };

  const handleExplainMarker = async (marker) => {
    const question = `Can you explain my ${marker} genetic marker and what it means for my health?`;
    
    setActiveAssistant('analysis');
    setChatOpen(true);
    
    addMessage({
      content: question,
      sender: 'user',
      type: 'text'
    });

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

  const getUserMarkerValue = (marker) => {
    if (!geneticData?.markers) return null;
    return geneticData.markers[marker];
  };

  const getMarkerInterpretation = (marker, value) => {
    const details = markerDetails[marker];
    if (!details || !value) return null;
    return details.values[value] || 'Unknown variant';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gene-600 rounded-full flex items-center justify-center">
          <Dna className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Your Genetic Markers</h3>
          <p className="text-sm text-gray-600">Click any marker to learn more</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(markerCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {category.icon}
                <div>
                  <h4 className="font-medium text-gray-900">{category.title}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {category.markers.map((marker) => {
                const userValue = getUserMarkerValue(marker);
                const interpretation = getMarkerInterpretation(marker, userValue);
                const details = markerDetails[marker];
                
                return (
                  <div
                    key={marker}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gene-50 rounded-lg transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-gene-200"
                    onClick={() => handleExplainMarker(marker)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900">{details?.name || marker}</div>
                          <div className="text-sm text-gray-600">{details?.description}</div>
                          {userValue && (
                            <div className="text-xs text-gene-600 font-medium mt-1">
                              Your variant: {userValue}
                              {interpretation && (
                                <span className="text-gray-600 ml-2">- {interpretation}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <AccessibleButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExplainMarker(marker);
                        }}
                        variant="ghost"
                        size="sm"
                        ariaLabel={`Learn more about ${marker}`}
                      >
                        <Info className="h-4 w-4" />
                      </AccessibleButton>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-gene-50 to-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-gene-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">Need Help Understanding?</h4>
            <p className="text-sm text-gray-700 mb-3">
              Our AI assistant can explain any genetic marker in simple terms and help you understand what it means for your daily life.
            </p>
            <AccessibleButton
              onClick={() => {
                setActiveAssistant('analysis');
                setChatOpen(true);
              }}
              variant="primary"
              size="sm"
              className="bg-gene-600 hover:bg-gene-700"
              ariaLabel="Ask AI about genetic markers"
            >
              Ask AI Assistant
            </AccessibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneticExplainer;
