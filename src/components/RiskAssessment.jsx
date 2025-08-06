import React from 'react';
import { AlertTriangle, Shield, Info, TrendingUp, Heart, Brain, Activity } from 'lucide-react';
import { RiskIndicator, CircularProgress } from './GeneticChart';

const RiskAssessment = ({ riskFactors, className = "" }) => {
  const getRiskIcon = (category) => {
    switch (category) {
      case 'cardiovascular':
        return <Heart className="h-5 w-5" />;
      case 'diabetes':
        return <Activity className="h-5 w-5" />;
      case 'alzheimers':
        return <Brain className="h-5 w-5" />;
      case 'obesity':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getRiskDescription = (category, level) => {
    const descriptions = {
      cardiovascular: {
        low: "Your genetic profile suggests a lower risk for cardiovascular disease. Maintain a healthy lifestyle.",
        moderate: "You have a moderate genetic predisposition. Focus on heart-healthy habits.",
        high: "Higher genetic risk detected. Consider regular cardiovascular monitoring."
      },
      diabetes: {
        low: "Low genetic risk for type 2 diabetes. Continue healthy eating habits.",
        moderate: "Moderate risk for diabetes. Monitor blood sugar and maintain healthy weight.",
        high: "Higher genetic risk for diabetes. Regular screening and lifestyle management recommended."
      },
      alzheimers: {
        low: "Lower genetic risk for Alzheimer's disease. Keep your brain active and healthy.",
        moderate: "Moderate risk detected. Focus on cognitive health and regular exercise.",
        high: "Higher genetic predisposition. Consider brain-healthy lifestyle choices."
      },
      obesity: {
        low: "Your genes support healthy weight management with proper diet and exercise.",
        moderate: "Moderate genetic influence on weight. Focus on balanced nutrition and activity.",
        high: "Genetic factors may affect weight management. Personalized nutrition approach recommended."
      }
    };

    return descriptions[category]?.[level] || "Genetic analysis complete for this risk factor.";
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const calculateOverallRisk = () => {
    if (!riskFactors) return 0;
    
    const riskValues = { low: 1, moderate: 2, high: 3 };
    const totalRisk = Object.values(riskFactors).reduce((sum, level) => {
      return sum + (riskValues[level] || 0);
    }, 0);
    
    const maxPossibleRisk = Object.keys(riskFactors).length * 3;
    return Math.round((totalRisk / maxPossibleRisk) * 100);
  };

  const overallRiskPercentage = calculateOverallRisk();
  const overallRiskLevel = overallRiskPercentage <= 33 ? 'low' : 
                          overallRiskPercentage <= 66 ? 'moderate' : 'high';

  if (!riskFactors) {
    return (
      <div className={`card ${className}`}>
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Assessment</h3>
          <p className="text-gray-600">Upload your genetic data to see personalized risk assessments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Risk Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Risk Assessment</h3>
            <p className="text-sm text-gray-600">Based on your genetic profile</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            overallRiskLevel === 'low' ? 'bg-green-100 text-green-700' :
            overallRiskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {overallRiskLevel.toUpperCase()} RISK
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <CircularProgress
            percentage={overallRiskPercentage}
            size={120}
            color={
              overallRiskLevel === 'low' ? '#16a34a' :
              overallRiskLevel === 'moderate' ? '#ca8a04' : '#dc2626'
            }
            value={`${overallRiskPercentage}%`}
            label="Risk Score"
          />
        </div>
        
        <p className="text-center text-gray-600 text-sm">
          This score represents your overall genetic risk profile across all analyzed factors.
        </p>
      </div>

      {/* Individual Risk Factors */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Risk Factors</h3>
        <div className="space-y-4">
          {Object.entries(riskFactors).map(([category, level]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  level === 'low' ? 'bg-green-100 text-green-600' :
                  level === 'moderate' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getRiskIcon(category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {formatCategoryName(category)}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      level === 'low' ? 'bg-green-100 text-green-700' :
                      level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getRiskDescription(category, level)}
                  </p>
                  
                  {/* Risk level bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ease-out ${
                          level === 'low' ? 'bg-green-600' :
                          level === 'moderate' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ 
                          width: `${level === 'low' ? 25 : level === 'moderate' ? 50 : 75}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Personalized Recommendations</h4>
            <p className="text-sm text-blue-800">
              Based on your risk assessment, we've generated personalized nutrition, fitness, and lifestyle 
              recommendations. Visit the Recommendations page to explore your customized health plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;

