import React from 'react';
import { TrendingUp, TrendingDown, Activity, Heart, Zap, Brain } from 'lucide-react';
import { CircularProgress } from './GeneticChart';

const HealthMetrics = ({ metrics, className = "" }) => {
  const getMetricIcon = (type) => {
    switch (type) {
      case 'fitness':
        return <Activity className="h-5 w-5" />;
      case 'nutrition':
        return <Heart className="h-5 w-5" />;
      case 'energy':
        return <Zap className="h-5 w-5" />;
      case 'cognitive':
        return <Brain className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getMetricColor = (value, type) => {
    // Different thresholds for different metric types
    const thresholds = {
      fitness: { good: 75, moderate: 50 },
      nutrition: { good: 80, moderate: 60 },
      energy: { good: 70, moderate: 50 },
      cognitive: { good: 75, moderate: 55 },
      default: { good: 70, moderate: 50 }
    };

    const threshold = thresholds[type] || thresholds.default;
    
    if (value >= threshold.good) return 'green';
    if (value >= threshold.moderate) return 'yellow';
    return 'red';
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          border: 'border-green-200',
          progress: '#16a34a'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-600',
          border: 'border-yellow-200',
          progress: '#ca8a04'
        };
      case 'red':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          border: 'border-red-200',
          progress: '#dc2626'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200',
          progress: '#6b7280'
        };
    }
  };

  const formatMetricName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const getMetricDescription = (type, value) => {
    const descriptions = {
      fitness: {
        high: "Excellent genetic predisposition for athletic performance and muscle development.",
        moderate: "Good fitness potential with proper training and nutrition.",
        low: "Focus on consistent exercise routine for optimal health benefits."
      },
      nutrition: {
        high: "Your genes support efficient nutrient metabolism and absorption.",
        moderate: "Balanced approach to nutrition will serve you well.",
        low: "Pay attention to specific nutritional needs based on your genetic profile."
      },
      energy: {
        high: "Strong genetic foundation for sustained energy levels throughout the day.",
        moderate: "Maintain consistent sleep and nutrition for optimal energy.",
        low: "Consider lifestyle adjustments to support natural energy production."
      },
      cognitive: {
        high: "Excellent genetic support for cognitive function and memory.",
        moderate: "Good cognitive potential with proper brain health practices.",
        low: "Focus on brain-healthy activities and nutrition for cognitive support."
      }
    };

    const level = value >= 70 ? 'high' : value >= 50 ? 'moderate' : 'low';
    return descriptions[type]?.[level] || "Genetic analysis complete for this health metric.";
  };

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className={`card ${className}`}>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Metrics</h3>
          <p className="text-gray-600">Complete your genetic analysis to see personalized health metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(metrics).map(([type, data]) => {
          const color = getMetricColor(data.value, type);
          const colorClasses = getColorClasses(color);
          
          return (
            <div key={type} className={`card border-2 ${colorClasses.border} hover:shadow-lg transition-shadow duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                  <div className={colorClasses.text}>
                    {getMetricIcon(type)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colorClasses.text}`}>
                    {data.value}%
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {formatMetricName(type)}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${data.value}%`,
                      backgroundColor: colorClasses.progress
                    }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                {getMetricDescription(type, data.value)}
              </p>
              
              {data.trend && (
                <div className="flex items-center mt-2 text-xs">
                  {data.trend > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={data.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(data.trend)}% vs last month
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Health Analysis</h3>
        <div className="space-y-6">
          {Object.entries(metrics).map(([type, data]) => {
            const color = getMetricColor(data.value, type);
            const colorClasses = getColorClasses(color);
            
            return (
              <div key={type} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CircularProgress
                    percentage={data.value}
                    size={80}
                    strokeWidth={6}
                    color={colorClasses.progress}
                    value={`${data.value}%`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <div className={`p-1 rounded mr-2 ${colorClasses.bg}`}>
                        <div className={colorClasses.text}>
                          {getMetricIcon(type)}
                        </div>
                      </div>
                      {formatMetricName(type)}
                    </h4>
                    <span className={`text-sm px-2 py-1 rounded-full ${colorClasses.bg} ${colorClasses.text} font-medium`}>
                      {data.value >= 70 ? 'Excellent' : data.value >= 50 ? 'Good' : 'Needs Attention'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {getMetricDescription(type, data.value)}
                  </p>
                  {data.recommendations && (
                    <div className="text-xs text-gray-500">
                      <strong>Recommendations:</strong> {data.recommendations}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;

