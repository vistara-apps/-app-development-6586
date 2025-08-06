import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Dna, Heart, Zap, Brain, Upload, TrendingUp, Clock, Shield } from 'lucide-react';
import { SkeletonLoader, CardSkeleton } from '../components/LoadingStates';
import { CircularProgress, HealthScore } from '../components/GeneticChart';
import RiskAssessment from '../components/RiskAssessment';
import HealthMetrics from '../components/HealthMetrics';
import { InfoTooltip } from '../components/Tooltip';

const Dashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState(null);

  // Simulate loading and data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Mock health metrics data
      if (user.geneticData) {
        setHealthMetrics({
          fitness: { value: 78, trend: 5, recommendations: "Focus on strength training based on your ACTN3 gene variant" },
          nutrition: { value: 85, trend: 2, recommendations: "Your MTHFR variant suggests increased folate needs" },
          energy: { value: 72, trend: -3, recommendations: "Consider caffeine timing based on CYP1A2 metabolism" },
          cognitive: { value: 88, trend: 8, recommendations: "Your COMT variant supports stress management techniques" }
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user.geneticData]);

  const stats = [
    {
      icon: <Dna className="h-6 w-6 text-gene-600" />,
      label: "Genetic Markers Analyzed",
      value: user.geneticData ? "24,567" : "0",
      change: "+12% this month"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      label: "Health Insights",
      value: user.recommendations.nutrition.length || "0",
      change: "Updated daily"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      label: "Recommendations",
      value: "42",
      change: "Personalized for you"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      label: "Risk Assessments",
      value: "8",
      change: "Low to moderate"
    }
  ];

  const quickActions = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload Genetic Data",
      description: "Add your 23andMe or other genetic test results",
      link: "/analysis",
      color: "bg-gene-100 text-gene-600"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "View Nutrition Plan",
      description: "See your personalized meal recommendations",
      link: "/recommendations?tab=nutrition",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fitness Program",
      description: "Access your custom workout routines",
      link: "/recommendations?tab=fitness",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Wellness Guide",
      description: "Manage stress and optimize sleep",
      link: "/recommendations?tab=wellness",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SkeletonLoader lines={2} className="max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-gray-600 flex items-center">
          Here's your personalized health dashboard based on your genetic profile.
          <InfoTooltip 
            content="Your dashboard updates automatically as we analyze your genetic data and health patterns."
            className="ml-2"
          />
        </p>
      </div>

      {/* Health Score Overview */}
      {user.geneticData && healthMetrics && (
        <div className="mb-8 slide-up">
          <HealthScore 
            score={82}
            maxScore={100}
            categories={[
              { name: 'Fitness', score: healthMetrics.fitness.value },
              { name: 'Nutrition', score: healthMetrics.nutrition.value },
              { name: 'Energy', score: healthMetrics.energy.value },
              { name: 'Cognitive', score: healthMetrics.cognitive.value }
            ]}
          />
        </div>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-xl transition-all duration-300 bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                  {stat.label}
                  <InfoTooltip 
                    content={`This metric is based on your genetic analysis and current health data.`}
                    className="ml-1"
                  />
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-gene-50 to-blue-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Metrics Visualization */}
      {user.geneticData && healthMetrics && (
        <div className="mb-8">
          <HealthMetrics metrics={healthMetrics} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.link} 
              className="interactive-card group"
              data-keyboard-nav
            >
              <div className={`p-3 rounded-lg ${action.color} inline-flex mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      {user.geneticData && (
        <div className="mb-8">
          <RiskAssessment riskFactors={user.geneticData.riskFactors} />
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analysis Status */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Dna className="h-5 w-5 text-gene-600 mr-2" />
            Genetic Analysis Status
          </h3>
          {user.geneticData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-800">Analysis Complete</p>
                  <p className="text-sm text-green-600">24,567 genetic markers analyzed</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CircularProgress 
                    percentage={100} 
                    size={50} 
                    strokeWidth={4}
                    color="#16a34a"
                    value="✓"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Risk Assessment', status: 'Complete', color: 'green' },
                  { label: 'Nutrition Analysis', status: 'Complete', color: 'green' },
                  { label: 'Fitness Profile', status: 'Complete', color: 'green' },
                  { label: 'Wellness Insights', status: 'Processing', color: 'yellow' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{item.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No genetic data uploaded yet</p>
              <Link to="/analysis" className="btn-primary">
                Upload Genetic Data
              </Link>
            </div>
          )}
        </div>

        {/* Recent Recommendations */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-gene-600 mr-2" />
            Recent Insights
          </h3>
          {user.geneticData ? (
            <div className="space-y-4">
              {[
                {
                  icon: <Heart className="h-5 w-5 text-red-600" />,
                  title: "New Nutrition Insight",
                  description: "Based on your MTHFR gene variant, consider increasing folate intake.",
                  color: "red"
                },
                {
                  icon: <Zap className="h-5 w-5 text-yellow-600" />,
                  title: "Fitness Update",
                  description: "Your ACTN3 profile suggests you may respond well to power training.",
                  color: "yellow"
                },
                {
                  icon: <Brain className="h-5 w-5 text-purple-600" />,
                  title: "Wellness Tip",
                  description: "Your stress response genes suggest meditation could be particularly beneficial.",
                  color: "purple"
                }
              ].map((insight, index) => (
                <div key={index} className={`flex items-start space-x-3 p-4 bg-${insight.color}-50 border border-${insight.color}-200 rounded-lg hover:shadow-md transition-shadow duration-200`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-${insight.color}-900 mb-1`}>{insight.title}</p>
                    <p className={`text-xs text-${insight.color}-700 leading-relaxed`}>{insight.description}</p>
                  </div>
                </div>
              ))}
              <Link 
                to="/recommendations" 
                className="block text-center text-gene-600 hover:text-gene-700 text-sm font-medium mt-4 transition-colors duration-200"
              >
                View All Recommendations →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Upload genetic data to see personalized insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
