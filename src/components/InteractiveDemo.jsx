import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, MessageCircle } from 'lucide-react';
import MessageBubble from './chat/MessageBubble';
import AccessibleButton from './AccessibleButton';

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);

  const demoSteps = [
    {
      user: "How does genetic testing work?",
      assistant: "Great question! Genetic testing analyzes your DNA to identify variations that can affect your health, nutrition needs, and fitness response. I can help you understand what each result means for your daily life.",
      type: "explanation"
    },
    {
      user: "What can I learn about my nutrition?",
      assistant: "Your genes can reveal how you metabolize different nutrients! For example, some people process caffeine slowly and should limit intake, while others can handle more. I'll help you create a personalized nutrition plan based on your unique genetic profile.",
      type: "text"
    },
    {
      user: "Is my data secure?",
      assistant: "Absolutely! Your genetic data is encrypted and stored securely. We never share your personal information, and you maintain full control over your data. Privacy and security are our top priorities.",
      type: "text"
    }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < demoSteps.length) {
      interval = setInterval(() => {
        const step = demoSteps[currentStep];
        
        // Add user message
        setMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          content: step.user,
          sender: 'user',
          type: 'text',
          timestamp: new Date().toISOString()
        }]);

        // Add assistant response after a delay
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            content: step.assistant,
            sender: 'assistant',
            type: step.type,
            timestamp: new Date().toISOString()
          }]);
        }, 1500);

        setCurrentStep(prev => prev + 1);
      }, 4000);
    } else if (currentStep >= demoSteps.length) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const handlePlay = () => {
    if (currentStep >= demoSteps.length) {
      // Reset demo
      setCurrentStep(0);
      setMessages([]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMessages([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gene-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant Demo</h3>
            <p className="text-sm text-gray-600">See how our AI can help you</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AccessibleButton
            onClick={handlePlay}
            variant="primary"
            size="sm"
            className="bg-gene-600 hover:bg-gene-700"
            ariaLabel={isPlaying ? "Pause demo" : "Play demo"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </AccessibleButton>
          
          <AccessibleButton
            onClick={handleReset}
            variant="ghost"
            size="sm"
            ariaLabel="Reset demo"
          >
            <RotateCcw className="h-4 w-4" />
          </AccessibleButton>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 min-h-64 max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Click play to see the AI assistant in action</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.sender === 'user'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Interactive AI Assistant Preview</span>
        <span>{currentStep} / {demoSteps.length} conversations</span>
      </div>
    </div>
  );
};

export default InteractiveDemo;
