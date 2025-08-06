import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Heart, Zap, Brain, ChevronDown, ChevronUp, Clock, Target, AlertTriangle } from 'lucide-react';

const Recommendations = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('nutrition');
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const tabs = [
    { id: 'nutrition', label: 'Nutrition', icon: <Heart className="h-5 w-5" />, color: 'text-red-600' },
    { id: 'fitness', label: 'Fitness', icon: <Zap className="h-5 w-5" />, color: 'text-yellow-600' },
    { id: 'wellness', label: 'Wellness', icon: <Brain className="h-5 w-5" />, color: 'text-purple-600' }
  ];

  const renderNutritionTab = () => {
    const nutrition = user.recommendations.nutrition;
    if (!nutrition || Object.keys(nutrition).length === 0) {
      return (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No nutrition recommendations available yet. Complete your genetic analysis first.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Recommended Foods */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-green-600 mr-2" />
            Recommended Foods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutrition.recommendedFoods?.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{item.food}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {item.frequency}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Foods to Avoid */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Foods to Limit
          </h3>
          <div className="space-y-3">
            {nutrition.avoidFoods?.map((item, index) => (
              <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-1">{item.food}</h4>
                <p className="text-sm text-red-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supplements */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Supplement Recommendations</h3>
          <div className="space-y-4">
            {nutrition.supplements?.map((item, index) => (
              <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-900">{item.supplement}</h4>
                  <span className="text-sm font-medium text-blue-700">{item.dosage}</span>
                </div>
                <p className="text-sm text-blue-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Timing & Pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              Meal Timing
            </h3>
            <p className="text-gray-600">{nutrition.mealTiming}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Pattern</h3>
            <p className="text-gray-600">{nutrition.dietaryPattern}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderFitnessTab = () => {
    const fitness = user.recommendations.fitness;
    if (!fitness || Object.keys(fitness).length === 0) {
      return (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No fitness recommendations available yet. Complete your genetic analysis first.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Exercise Types */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimal Exercise Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fitness.exerciseTypes?.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{item.type}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.intensity === 'high' ? 'bg-red-100 text-red-800' :
                    item.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.intensity} intensity
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Training Schedule */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Training Schedule</h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{fitness.trainingSchedule}</p>
          </div>
        </div>

        {/* Recovery Needs */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recovery Requirements</h3>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-800">{fitness.recoveryNeeds}</p>
          </div>
        </div>

        {/* Specific Workouts */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Workouts</h3>
          <div className="space-y-4">
            {fitness.specificWorkouts?.map((workout, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleCard(`workout-${index}`)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{workout.workout}</h4>
                    <p className="text-sm text-gray-600">{workout.duration}</p>
                  </div>
                  {expandedCards[`workout-${index}`] ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedCards[`workout-${index}`] && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <p className="text-gray-600 mt-2">{workout.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWellnessTab = () => {
    const wellness = user.recommendations.stressSleep;
    if (!wellness || Object.keys(wellness).length === 0) {
      return (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No wellness recommendations available yet. Complete your genetic analysis first.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stress Management */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Stress Management Techniques</h3>
          <div className="space-y-4">
            {wellness.stressManagement?.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{item.technique}</h4>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {item.frequency}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Optimization */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Sleep Optimization</h3>
          <div className="space-y-4">
            {wellness.sleepOptimization?.map((item, index) => (
              <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-900">{item.strategy}</h4>
                  <span className="text-xs text-blue-700">{item.timing}</span>
                </div>
                <p className="text-sm text-blue-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Relaxation Methods */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Relaxation Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wellness.relaxationMethods?.map((item, index) => (
              <div key={index} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">{item.method}</h4>
                <p className="text-sm text-green-700 mb-2">{item.benefits}</p>
                <span className="text-xs text-green-600">Duration: {item.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental & Lifestyle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Tips</h3>
            <p className="text-gray-600">{wellness.environmental}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Lifestyle Adjustments</h3>
            <p className="text-gray-600">{wellness.lifestyle}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Recommendations</h1>
        <p className="text-gray-600">
          AI-powered insights based on your genetic profile and health goals
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? `border-gene-500 ${tab.color}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'nutrition' && renderNutritionTab()}
        {activeTab === 'fitness' && renderFitnessTab()}
        {activeTab === 'wellness' && renderWellnessTab()}
      </div>
    </div>
  );
};

export default Recommendations;