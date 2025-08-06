import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, Dna } from 'lucide-react';
import { AIService } from '../services/aiService';

const Analysis = () => {
  const { user, updateUser, addRecommendations } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [geneticFile, setGeneticFile] = useState(null);
  const [healthProfile, setHealthProfile] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    healthGoals: '',
    existingConditions: '',
    medications: '',
    allergies: ''
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setGeneticFile(file);
      // Simulate genetic data processing
      const mockGeneticData = {
        fileName: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        markers: {
          CYP1A2: 'AA', // Caffeine metabolism
          MTHFR: 'CT', // Folate metabolism
          APOE: 'E3/E3', // Alzheimer's risk
          ACE: 'II', // Blood pressure
          ACTN3: 'RR', // Athletic performance
          FTO: 'AA', // Weight management
          MC1R: 'CC', // Vitamin D synthesis
          COMT: 'Val/Met' // Stress response
        },
        riskFactors: {
          cardiovascular: 'low',
          diabetes: 'moderate',
          alzheimers: 'low',
          obesity: 'low'
        }
      };
      updateUser({ geneticData: mockGeneticData });
    }
  };

  const handleHealthProfileChange = (field, value) => {
    setHealthProfile(prev => ({ ...prev, [field]: value }));
  };

  const processAnalysis = async () => {
    setLoading(true);
    try {
      // Update user health profile
      updateUser({ healthProfile });

      // Generate AI recommendations
      const [nutritionRecs, fitnessRecs, stressSleepRecs] = await Promise.all([
        AIService.generateNutritionRecommendations(user.geneticData, healthProfile),
        AIService.generateFitnessRecommendations(user.geneticData, healthProfile),
        AIService.generateStressSleepRecommendations(user.geneticData, healthProfile)
      ]);

      // Add recommendations to user context
      addRecommendations('nutrition', nutritionRecs);
      addRecommendations('fitness', fitnessRecs);
      addRecommendations('stressSleep', stressSleepRecs);

      setStep(4); // Analysis complete
    } catch (error) {
      console.error('Error processing analysis:', error);
      // Still proceed to show fallback recommendations
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Upload Genetic Data', description: 'Upload your raw DNA data file' },
    { number: 2, title: 'Health Profile', description: 'Complete your health questionnaire' },
    { number: 3, title: 'Processing', description: 'AI analysis in progress' },
    { number: 4, title: 'Complete', description: 'View your personalized recommendations' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= stepItem.number 
                  ? 'bg-gene-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepItem.number ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span>{stepItem.number}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  step > stepItem.number ? 'bg-gene-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{steps[step - 1].title}</h2>
          <p className="text-gray-600">{steps[step - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Your Genetic Data</h3>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label htmlFor="genetic-file" className="btn-primary cursor-pointer">
                    Choose File
                  </label>
                  <input
                    id="genetic-file"
                    type="file"
                    accept=".txt,.csv,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload your raw DNA data from 23andMe, AncestryDNA, or other providers
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: .txt, .csv, .zip (Max 50MB)
                </p>
              </div>

              {geneticFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-green-800">File uploaded successfully</p>
                      <p className="text-sm text-green-600">{geneticFile.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Data Privacy & Security</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Your genetic data is encrypted and stored securely. We never share your data with third parties.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!geneticFile}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Health Profile
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Health Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={healthProfile.age}
                  onChange={(e) => handleHealthProfileChange('age', e.target.value)}
                  className="input-field"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                <input
                  type="number"
                  value={healthProfile.weight}
                  onChange={(e) => handleHealthProfileChange('weight', e.target.value)}
                  className="input-field"
                  placeholder="Enter your weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                <input
                  type="number"
                  value={healthProfile.height}
                  onChange={(e) => handleHealthProfileChange('height', e.target.value)}
                  className="input-field"
                  placeholder="Enter your height"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                <select
                  value={healthProfile.activityLevel}
                  onChange={(e) => handleHealthProfileChange('activityLevel', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly Active</option>
                  <option value="moderate">Moderately Active</option>
                  <option value="very">Very Active</option>
                  <option value="extremely">Extremely Active</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Goals</label>
                <textarea
                  value={healthProfile.healthGoals}
                  onChange={(e) => handleHealthProfileChange('healthGoals', e.target.value)}
                  className="input-field h-24"
                  placeholder="Describe your health and fitness goals..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Existing Conditions</label>
                <textarea
                  value={healthProfile.existingConditions}
                  onChange={(e) => handleHealthProfileChange('existingConditions', e.target.value)}
                  className="input-field h-20"
                  placeholder="List any existing health conditions..."
                />
              </div>
            </div>
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary flex-1"
              >
                Start Analysis
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gene-100 rounded-full flex items-center justify-center">
                {loading ? (
                  <Loader className="h-10 w-10 text-gene-600 animate-spin" />
                ) : (
                  <Dna className="h-10 w-10 text-gene-600 dna-animation" />
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Analyzing Your Genetic Data
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Our AI is processing your genetic markers and health profile to generate personalized recommendations.
            </p>
            <div className="space-y-2 mb-8">
              <div className="text-sm text-gray-600">Processing genetic markers...</div>
              <div className="text-sm text-gray-600">Analyzing health risks...</div>
              <div className="text-sm text-gray-600">Generating recommendations...</div>
            </div>
            <button
              onClick={processAnalysis}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Start Analysis'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Analysis Complete!
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your personalized health recommendations are ready. Explore your nutrition, fitness, and wellness insights.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/recommendations')}
                className="btn-primary w-full"
              >
                View My Recommendations
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary w-full"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;