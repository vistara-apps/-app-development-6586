import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, Info, Clock, Target } from 'lucide-react';

const RiskVisualization = ({ riskAssessment, actionPriorities, monitoringPlan }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getRiskColor = (level) => {
    switch (level) {
      case 'very_high':
        return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', accent: 'bg-red-500' };
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-400' };
      case 'moderate':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', accent: 'bg-yellow-400' };
      case 'low':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-400' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', accent: 'bg-gray-400' };
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'very_high':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'moderate':
        return <TrendingUp className="h-5 w-5" />;
      case 'low':
        return <Shield className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderRiskGauge = (score, maxScore = 15) => {
    const percentage = Math.min((score / maxScore) * 100, 100);
    const level = score <= 3 ? 'low' : score <= 6 ? 'moderate' : score <= 10 ? 'high' : 'very_high';
    const colors = getRiskColor(level);

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${percentage * 2.51} 251`}
            className={colors.text}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{score.toFixed(1)}</div>
            <div className="text-xs text-gray-500">/{maxScore}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryCard = (category, data) => {
    const colors = getRiskColor(data.level);
    const isSelected = selectedCategory === category;

    return (
      <div
        key={category}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        } ${colors.bg} ${colors.border}`}
        onClick={() => setSelectedCategory(isSelected ? null : category)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={colors.text}>
              {getRiskIcon(data.level)}
            </div>
            <h3 className={`font-semibold capitalize ${colors.text}`}>
              {category.replace('_', ' ')} Risk
            </h3>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium uppercase ${colors.text}`}>
              {data.level}
            </div>
            <div className="text-xs text-gray-600">
              Score: {data.score.toFixed(1)}/15
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 bg-white bg-opacity-50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colors.accent}`}
                  style={{ width: `${Math.min((data.score / 15) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            {data.factors && data.factors.length > 0 && (
              <div className="text-xs">
                <span className={`font-medium ${colors.text}`}>Key Factors:</span>
                <div className="mt-1 space-y-1">
                  {data.factors.slice(0, 2).map((factor, index) => (
                    <div key={index} className="flex items-start space-x-1">
                      <span className={colors.text}>•</span>
                      <span className="text-gray-700">{factor.factor}</span>
                    </div>
                  ))}
                  {data.factors.length > 2 && (
                    <div className="text-gray-500">
                      +{data.factors.length - 2} more factors
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {renderRiskGauge(data.score)}
        </div>

        {isSelected && data.mitigationStrategies && (
          <div className="mt-4 pt-4 border-t border-white border-opacity-50">
            <h4 className={`font-medium mb-2 ${colors.text}`}>Mitigation Strategies</h4>
            <div className="space-y-2">
              {data.mitigationStrategies.slice(0, 3).map((strategy, index) => (
                <div key={index} className="bg-white bg-opacity-70 p-2 rounded text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{strategy.category}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(strategy.priority)}`}>
                      {strategy.priority}
                    </span>
                  </div>
                  <p className="text-gray-700">{strategy.strategy}</p>
                  {strategy.evidence && (
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Evidence:</span> {strategy.evidence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActionPriorities = () => {
    if (!actionPriorities || actionPriorities.length === 0) {
      return (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No high-priority actions identified.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {actionPriorities.slice(0, 5).map((action, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(action.priority)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4" />
                  <h3 className="font-semibold">{action.action}</h3>
                </div>
                <p className="text-sm mb-2">{action.details?.rationale || action.evidence}</p>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{action.timeline || 'Ongoing'}</span>
                  </span>
                  <span className="capitalize">Category: {action.category}</span>
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                  {action.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonitoringPlan = () => {
    if (!monitoringPlan || monitoringPlan.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No specific monitoring recommendations.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {monitoringPlan.map((item, index) => (
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">{item.test}</h3>
                <p className="text-blue-800 text-sm mb-2">{item.reason}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-700">
                    <span className="font-medium">Frequency:</span> {item.frequency}
                  </span>
                  {item.target && (
                    <span className="text-blue-700">
                      <span className="font-medium">Target:</span> {item.target}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!riskAssessment) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No risk assessment data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      {riskAssessment.overall && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-blue-600" />
            <span>Risk Assessment Overview</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {riskAssessment.overall.maxRiskScore?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Highest Risk Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 capitalize ${
                riskAssessment.overall.overallLevel === 'high' ? 'text-red-600' :
                riskAssessment.overall.overallLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {riskAssessment.overall.overallLevel || 'Unknown'}
              </div>
              <div className="text-sm text-gray-600">Overall Risk Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1 capitalize">
                {riskAssessment.overall.primaryRiskCategory?.replace('_', ' ') || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Primary Risk Area</div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Categories */}
      {riskAssessment.categories && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(riskAssessment.categories).map(([category, data]) =>
              renderCategoryCard(category, data)
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click on any category to see detailed mitigation strategies
          </p>
        </div>
      )}

      {/* Action Priorities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Priority Actions</span>
        </h3>
        {renderActionPriorities()}
      </div>

      {/* Monitoring Plan */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Monitoring Plan</span>
        </h3>
        {renderMonitoringPlan()}
      </div>
    </div>
  );
};

export default RiskVisualization;

