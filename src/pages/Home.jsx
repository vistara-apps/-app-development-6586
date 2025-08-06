import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, Heart, Brain, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Dna className="h-8 w-8 text-gene-600" />,
      title: "Genetic Analysis",
      description: "Upload your DNA data and discover your unique genetic profile with advanced AI analysis."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Personalized Nutrition",
      description: "Get tailored meal plans, supplement recommendations, and dietary guidance based on your genes."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Fitness Optimization",
      description: "Discover the most effective workouts and exercise routines for your genetic makeup."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Stress & Sleep",
      description: "Optimize your mental wellness with personalized stress management and sleep strategies."
    }
  ];

  const benefits = [
    "Proactive health risk assessment",
    "Science-backed personalized recommendations",
    "Continuous AI-powered insights",
    "Secure genetic data protection"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/20 rounded-full">
                <Dna className="h-16 w-16 text-white dna-animation" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unlock the Power of <span className="text-yellow-300">Your Genes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              AI-powered genetic analysis for personalized health and wellness recommendations tailored specifically to your DNA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analysis" className="btn-primary bg-white text-gene-600 hover:bg-gray-100">
                Start Your Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/subscription" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-gene-600">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Personalized Health Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your genetic data into actionable insights for optimal health and wellness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose GeneWise?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered platform analyzes your genetic data to provide the most accurate and personalized health recommendations available.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 bg-gene-600 rounded-full flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="card bg-gradient-to-br from-gene-50 to-blue-50 p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Users className="h-12 w-12 text-gene-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Thousands</h3>
                  <p className="text-gray-600 mb-6">
                    Already optimizing their health with GeneWise
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gene-600">10K+</div>
                      <div className="text-sm text-gray-600">Analyses Complete</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gene-600">95%</div>
                      <div className="text-sm text-gray-600">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gene-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Discover Your Genetic Potential?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your personalized health journey today with our comprehensive genetic analysis.
          </p>
          <Link to="/analysis" className="btn-primary bg-white text-gene-600 hover:bg-gray-100 text-lg px-8 py-4">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;