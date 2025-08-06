import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Dna, Heart, Zap, Brain, Upload, TrendingUp, Clock, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-gray-600">
          Here's your personalized health dashboard based on your genetic profile.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="card hover:shadow-lg transition-shadow duration-300 group">
              <div className={`p-3 rounded-lg ${action.color} inline-flex mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

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
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Analysis Complete</p>
                  <p className="text-sm text-green-600">Your genetic data has been successfully processed</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>• 24,567 genetic markers analyzed</p>
                <p>• Health risk assessments generated</p>
                <p>• Personalized recommendations created</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No genetic data uploaded yet</p>
              <Link to="/analysis" className="btn-primary">
                Upload Your Data
              </Link>
            </div>
          )}
        </div>

        {/* Recent Recommendations */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            Recent Updates
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-gene-500 pl-4">
              <p className="font-medium text-gray-900">New nutrition insights available</p>
              <p className="text-sm text-gray-600">Based on your genetic variants for metabolism</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-medium text-gray-900">Fitness plan updated</p>
              <p className="text-sm text-gray-600">New exercises added for optimal performance</p>
              <p className="text-xs text-gray-500 mt-1">1 day ago</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium text-gray-900">Sleep optimization tips</p>
              <p className="text-sm text-gray-600">Personalized strategies for better rest</p>
              <p className="text-xs text-gray-500 mt-1">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;