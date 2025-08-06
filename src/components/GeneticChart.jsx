import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// Risk level indicator component
export const RiskIndicator = ({ level, label, className = "" }) => {
  const getRiskConfig = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="h-4 w-4" />,
          percentage: 25
        };
      case 'moderate':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: <Info className="h-4 w-4" />,
          percentage: 50
        };
      case 'high':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: <AlertTriangle className="h-4 w-4" />,
          percentage: 75
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <Minus className="h-4 w-4" />,
          percentage: 0
        };
    }
  };

  const config = getRiskConfig(level);

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${config.bgColor} ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`${config.color}`}>
          {config.icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className={`text-sm ${config.color} capitalize`}>{level} Risk</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${config.color.replace('text-', 'bg-')}`}
            style={{ width: `${config.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Genetic marker display
export const GeneticMarker = ({ marker, value, description, impact }) => {
  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{marker}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {getImpactIcon(impact)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-mono font-bold text-gene-600">{value}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          impact === 'positive' ? 'bg-green-100 text-green-700' :
          impact === 'negative' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {impact || 'neutral'}
        </span>
      </div>
    </div>
  );
};

// Circular progress for health metrics
export const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = "#9333ea",
  label,
  value 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {label && <span className="text-xs text-gray-600 text-center">{label}</span>}
        </div>
      </div>
    </div>
  );
};

// Health score visualization
export const HealthScore = ({ score, maxScore = 100, categories }) => {
  const percentage = (score / maxScore) * 100;
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Health Score</h3>
        <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
          {score}<span className="text-lg text-gray-500">/{maxScore}</span>
        </div>
      </div>
      
      <CircularProgress 
        percentage={percentage}
        size={150}
        color={percentage >= 80 ? '#16a34a' : percentage >= 60 ? '#ca8a04' : '#dc2626'}
        value={`${Math.round(percentage)}%`}
        label="Health Score"
      />

      {categories && (
        <div className="mt-6 space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{category.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ease-out ${
                      category.score >= 80 ? 'bg-green-600' :
                      category.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {category.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

