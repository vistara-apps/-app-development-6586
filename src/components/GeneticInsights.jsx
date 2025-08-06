import React, { useState } from 'react';
import { Dna, Info, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const GeneticInsights = ({ geneticProfile, riskAssessment, recommendations }) => {
  const [expandedMarkers, setExpandedMarkers] = useState({});
  const [activeTab, setActiveTab] = useState('markers');

  const toggleMarker = (markerId) => {
    setExpandedMarkers(prev => ({
      ...prev,
      [markerId]: !prev[markerId]
    }));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'High Confidence';
    if (confidence >= 0.8) return 'Moderate Confidence';
    return 'Lower Confidence';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
      case 'very_high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const renderMarkerCard = (markerId, markerData) => {
    const isExpanded = expandedMarkers[markerId];
    
    return (
      <div key={markerId} className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleMarker(markerId)}
          className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-t-lg"
        >
          <div className="flex items-center space-x-3">
            <Dna className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{markerData.name}</h3>
              <p className="text-sm text-gray-600">
                {markerId}: {markerData.variant} - {markerData.phenotype}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(markerData.confidence)}`}>
              {getConfidenceLabel(markerData.confidence)}
            </span>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="mt-4 space-y-4">
              {/* Genetic Implications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What This Means</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 text-sm">{markerData.phenotype}</p>
                </div>
              </div>

              {/* Nutritional Implications */}
              {markerData.implications && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Nutritional Impact</h4>
                  <div className="space-y-2">
                    {Object.entries(markerData.implications).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-700 capitalize">{key.replace('_', ' ')}: </span>
                          <span className="text-gray-600">{Array.isArray(value) ? value.join(', ') : value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence Score */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scientific Confidence</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${markerData.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{Math.round(markerData.confidence * 100)}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on current scientific research and population studies
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRiskOverview = () => {
    if (!riskAssessment?.categories) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(riskAssessment.categories).map(([category, data]) => (
            <div key={category} className={`p-4 rounded-lg border ${getRiskColor(data.level)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold capitalize">{category.replace('_', ' ')} Risk</h3>
                <span className="text-sm font-medium uppercase">{data.level}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        data.level === 'high' ? 'bg-red-500' :
                        data.level === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((data.score / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{data.score.toFixed(1)}/10</span>
                </div>
                {data.factors && data.factors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Contributing Factors:</p>
                    <ul className="text-xs space-y-1">
                      {data.factors.slice(0, 2).map((factor, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-current">•</span>
                          <span>{factor.factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overall Risk Summary */}
        {riskAssessment.overall && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Overall Risk Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Primary Risk Area:</span>
                <p className="font-medium capitalize">{riskAssessment.overall.primaryRiskCategory?.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-gray-600">Highest Risk Score:</span>
                <p className="font-medium">{riskAssessment.overall.maxRiskScore?.toFixed(1)}/15</p>
              </div>
              <div>
                <span className="text-gray-600">Overall Level:</span>
                <p className={`font-medium capitalize ${
                  riskAssessment.overall.overallLevel === 'high' ? 'text-red-600' :
                  riskAssessment.overall.overallLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {riskAssessment.overall.overallLevel}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInteractions = () => {
    if (!geneticProfile?.interactions || geneticProfile.interactions.length === 0) {
      return (
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No significant genetic interactions detected in your profile.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {geneticProfile.interactions.map((interaction, index) => (
          <div key={index} className={`p-4 rounded-lg border ${
            interaction.priority === 'high' ? 'border-red-200 bg-red-50' :
            interaction.priority === 'moderate' ? 'border-yellow-200 bg-yellow-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                interaction.priority === 'high' ? 'text-red-600' :
                interaction.priority === 'moderate' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {interaction.markers.join(' + ')} Interaction
                </h3>
                <p className="text-gray-700 mb-2">{interaction.effect}</p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Recommendation: </span>
                    {interaction.recommendation}
                  </p>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    interaction.priority === 'high' ? 'bg-red-100 text-red-800' :
                    interaction.priority === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {interaction.priority} priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!geneticProfile) {
    return (
      <div className="text-center py-8">
        <Dna className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No genetic analysis data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Dna className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Genetic Insights</h2>
        </div>
        
        {/* Overall Confidence */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">Analysis Confidence</span>
            <span className="text-blue-600">{Math.round(geneticProfile.confidence * 100)}%</span>
          </div>
          <div className="mt-2 flex-1 bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${geneticProfile.confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'markers', label: 'Genetic Markers', icon: Dna },
            { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
            { id: 'interactions', label: 'Gene Interactions', icon: Info }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'markers' && (
          <div>
            {Object.entries(geneticProfile.markers).map(([markerId, markerData]) =>
              renderMarkerCard(markerId, markerData)
            )}
          </div>
        )}
        
        {activeTab === 'risks' && renderRiskOverview()}
        
        {activeTab === 'interactions' && renderInteractions()}
      </div>
    </div>
  );
};

export default GeneticInsights;

