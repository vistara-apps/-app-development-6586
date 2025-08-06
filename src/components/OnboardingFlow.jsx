import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Dna, Upload, Heart, Zap, Brain, CheckCircle } from 'lucide-react';
import AccessibleButton from './AccessibleButton';
import { useFocusTrap } from '../hooks/useKeyboardNavigation';

const OnboardingFlow = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    hasGeneticData: null,
    primaryGoals: [],
    experienceLevel: null
  });
  
  const focusTrapRef = useFocusTrap(isOpen);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to GeneWise',
      component: WelcomeStep
    },
    {
      id: 'genetic-data',
      title: 'Genetic Data',
      component: GeneticDataStep
    },
    {
      id: 'goals',
      title: 'Your Goals',
      component: GoalsStep
    },
    {
      id: 'experience',
      title: 'Experience Level',
      component: ExperienceStep
    },
    {
      id: 'complete',
      title: 'All Set!',
      component: CompleteStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(userPreferences);
    onClose();
  };

  const updatePreferences = (key, value) => {
    setUserPreferences(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={focusTrapRef}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 id="onboarding-title" className="text-xl font-semibold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close onboarding"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gene-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <CurrentStepComponent
            preferences={userPreferences}
            updatePreferences={updatePreferences}
            onNext={handleNext}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <AccessibleButton
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </AccessibleButton>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-gene-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <AccessibleButton
            variant="primary"
            onClick={handleNext}
            className="flex items-center"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

// Welcome Step Component
const WelcomeStep = () => (
  <div className="text-center">
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-gene-100 rounded-full">
        <Dna className="h-12 w-12 text-gene-600 dna-animation" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Unlock Your Genetic Potential
    </h3>
    <p className="text-gray-600 text-lg leading-relaxed mb-6">
      GeneWise uses AI-powered analysis to transform your genetic data into personalized 
      health and wellness recommendations. Let's get you started on your journey to 
      optimal health.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-red-50 rounded-lg">
        <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h4 className="font-medium text-gray-900">Nutrition</h4>
        <p className="text-sm text-gray-600">Personalized meal plans</p>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg">
        <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h4 className="font-medium text-gray-900">Fitness</h4>
        <p className="text-sm text-gray-600">Optimized workouts</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
        <h4 className="font-medium text-gray-900">Wellness</h4>
        <p className="text-sm text-gray-600">Stress & sleep management</p>
      </div>
    </div>
  </div>
);

// Genetic Data Step Component
const GeneticDataStep = ({ preferences, updatePreferences }) => (
  <div>
    <div className="text-center mb-8">
      <Upload className="h-12 w-12 text-gene-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Do you have genetic test results?
      </h3>
      <p className="text-gray-600">
        We support data from 23andMe, AncestryDNA, and other major providers.
      </p>
    </div>

    <div className="space-y-4">
      <button
        onClick={() => updatePreferences('hasGeneticData', true)}
        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
          preferences.hasGeneticData === true
            ? 'border-gene-600 bg-gene-50'
            : 'border-gray-200 hover:border-gene-300'
        }`}
      >
        <div className="flex items-center">
          <CheckCircle className={`h-5 w-5 mr-3 ${
            preferences.hasGeneticData === true ? 'text-gene-600' : 'text-gray-400'
          }`} />
          <div>
            <h4 className="font-medium text-gray-900">Yes, I have genetic data</h4>
            <p className="text-sm text-gray-600">I can upload my genetic test results</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => updatePreferences('hasGeneticData', false)}
        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
          preferences.hasGeneticData === false
            ? 'border-gene-600 bg-gene-50'
            : 'border-gray-200 hover:border-gene-300'
        }`}
      >
        <div className="flex items-center">
          <CheckCircle className={`h-5 w-5 mr-3 ${
            preferences.hasGeneticData === false ? 'text-gene-600' : 'text-gray-400'
          }`} />
          <div>
            <h4 className="font-medium text-gray-900">No, I don't have genetic data</h4>
            <p className="text-sm text-gray-600">I'd like to learn about getting tested</p>
          </div>
        </div>
      </button>
    </div>

    {preferences.hasGeneticData === false && (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Getting Started Without Genetic Data</h4>
        <p className="text-sm text-blue-800">
          You can still use GeneWise! We'll provide general health recommendations and help you 
          understand the benefits of genetic testing. You can always add your genetic data later.
        </p>
      </div>
    )}
  </div>
);

// Goals Step Component
const GoalsStep = ({ preferences, updatePreferences }) => {
  const goals = [
    { id: 'weight', label: 'Weight Management', icon: <Zap className="h-5 w-5" /> },
    { id: 'fitness', label: 'Fitness Optimization', icon: <Zap className="h-5 w-5" /> },
    { id: 'nutrition', label: 'Better Nutrition', icon: <Heart className="h-5 w-5" /> },
    { id: 'energy', label: 'More Energy', icon: <Zap className="h-5 w-5" /> },
    { id: 'sleep', label: 'Better Sleep', icon: <Brain className="h-5 w-5" /> },
    { id: 'stress', label: 'Stress Management', icon: <Brain className="h-5 w-5" /> }
  ];

  const toggleGoal = (goalId) => {
    const currentGoals = preferences.primaryGoals || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    updatePreferences('primaryGoals', updatedGoals);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          What are your primary health goals?
        </h3>
        <p className="text-gray-600">
          Select all that apply. We'll prioritize recommendations based on your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const isSelected = preferences.primaryGoals?.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                isSelected
                  ? 'border-gene-600 bg-gene-50'
                  : 'border-gray-200 hover:border-gene-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  isSelected ? 'bg-gene-100 text-gene-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {goal.icon}
                </div>
                <span className="font-medium text-gray-900">{goal.label}</span>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-gene-600 ml-auto" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Experience Step Component
const ExperienceStep = ({ preferences, updatePreferences }) => {
  const levels = [
    {
      id: 'beginner',
      label: 'Beginner',
      description: 'New to genetic health and wellness'
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      description: 'Some experience with health optimization'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      description: 'Experienced with genetic health concepts'
    }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          What's your experience level?
        </h3>
        <p className="text-gray-600">
          This helps us tailor the complexity of your recommendations.
        </p>
      </div>

      <div className="space-y-4">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => updatePreferences('experienceLevel', level.id)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              preferences.experienceLevel === level.id
                ? 'border-gene-600 bg-gene-50'
                : 'border-gray-200 hover:border-gene-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{level.label}</h4>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
              {preferences.experienceLevel === level.id && (
                <CheckCircle className="h-5 w-5 text-gene-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Complete Step Component
const CompleteStep = ({ preferences }) => (
  <div className="text-center">
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-green-100 rounded-full">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      You're all set!
    </h3>
    <p className="text-gray-600 text-lg mb-6">
      We've personalized your GeneWise experience based on your preferences. 
      You can always update these settings later in your dashboard.
    </p>
    
    <div className="bg-gene-50 border border-gene-200 rounded-lg p-4 text-left">
      <h4 className="font-medium text-gene-900 mb-2">Your Setup Summary:</h4>
      <ul className="text-sm text-gene-800 space-y-1">
        <li>• Genetic Data: {preferences.hasGeneticData ? 'Ready to upload' : 'Will provide general recommendations'}</li>
        <li>• Goals: {preferences.primaryGoals?.length || 0} selected</li>
        <li>• Experience: {preferences.experienceLevel || 'Not specified'}</li>
      </ul>
    </div>
  </div>
);

export default OnboardingFlow;

