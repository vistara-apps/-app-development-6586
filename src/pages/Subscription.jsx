import React, { useState } from 'react';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { useUser } from '../context/UserContext';
import { Check, Star, Zap, Crown, Shield } from 'lucide-react';

const Subscription = () => {
  const { createSession } = usePaymentContext();
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$19.99',
      period: '/month',
      description: 'Essential genetic insights for beginners',
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      color: 'border-blue-200',
      features: [
        'Basic genetic analysis',
        'Core nutrition recommendations',
        'General fitness guidance',
        'Monthly report updates',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$39.99',
      period: '/month',
      description: 'Comprehensive health optimization',
      icon: <Star className="h-8 w-8 text-purple-600" />,
      color: 'border-purple-200',
      popular: true,
      features: [
        'Advanced genetic analysis',
        'Personalized meal plans',
        'Custom workout routines',
        'Stress & sleep optimization',
        'Weekly report updates',
        'Priority email support',
        'AI-powered insights',
        'Risk factor assessments'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: '$79.99',
      period: '/month',
      description: 'Premium features with expert consultation',
      icon: <Crown className="h-8 w-8 text-gold-600" />,
      color: 'border-yellow-200',
      features: [
        'Everything in Premium',
        'Monthly expert consultations',
        'Continuous genetic monitoring',
        'Family genetic insights',
        'Advanced biomarker tracking',
        'Custom supplement protocols',
        'Phone & video support',
        'Early access to new features'
      ]
    }
  ];

  const handleSubscription = async (plan) => {
    setLoading(true);
    try {
      await createSession(plan.price);
      updateUser({ subscriptionPlan: plan.id });
      alert(`Successfully subscribed to ${plan.name}!`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again or connect your wallet first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Genetic Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock personalized health insights with our tiered subscription plans. 
          Each plan is designed to help you optimize your health based on your unique genetic profile.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card relative ${plan.color} ${
              plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
            } hover:shadow-xl transition-all duration-300`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {plan.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscription(plan)}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                plan.popular
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Processing...' : `Choose ${plan.name}`}
            </button>

            {user.subscriptionPlan === plan.id && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  <Check className="h-4 w-4 mr-1" />
                  Current Plan
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          What's Included in Each Plan?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-gene-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Genetic Analysis</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Basic markers</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Advanced analysis</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Continuous monitoring</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Health Insights</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Risk assessments</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Detailed reports</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Family insights</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Recommendations</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Nutrition plans</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Fitness routines</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Supplement protocols</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <Crown className="h-6 w-6 text-yellow-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Support</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Email support</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Priority support</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span>Expert consultations</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto text-left space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Is my genetic data secure?</h3>
            <p className="text-gray-600">Absolutely. We use bank-level encryption and never share your data with third parties.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">What genetic test providers do you support?</h3>
            <p className="text-gray-600">We support 23andMe, AncestryDNA, MyHeritage, and most other major genetic testing providers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;