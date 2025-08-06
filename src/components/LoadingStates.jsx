import React from 'react';
import { Loader, Dna } from 'lucide-react';

// Skeleton loading component
export const SkeletonLoader = ({ className = "", lines = 3, height = "h-4" }) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`bg-gray-200 rounded ${height} mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}></div>
    ))}
  </div>
);

// Card skeleton for dashboard
export const CardSkeleton = ({ className = "" }) => (
  <div className={`card animate-pulse ${className}`}>
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

// Genetic analysis loading with DNA animation
export const GeneticAnalysisLoader = ({ message = "Analyzing your genetic data..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative mb-6">
      <div className="w-16 h-16 bg-gene-100 rounded-full flex items-center justify-center">
        <Dna className="h-8 w-8 text-gene-600 dna-animation" />
      </div>
      <div className="absolute inset-0 border-4 border-gene-200 rounded-full animate-ping"></div>
    </div>
    <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gene-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  </div>
);

// Progress bar component
export const ProgressBar = ({ progress = 0, className = "", showPercentage = true }) => (
  <div className={`w-full ${className}`}>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700">Progress</span>
      {showPercentage && (
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      )}
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-gene-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  </div>
);

// Button with loading state
export const LoadingButton = ({ 
  loading = false, 
  children, 
  className = "", 
  disabled = false,
  ...props 
}) => (
  <button
    className={`btn-primary relative ${className} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
    disabled={loading || disabled}
    {...props}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-5 w-5 animate-spin" />
      </div>
    )}
    <span className={loading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

// Spinner component
export const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <Loader className={`animate-spin text-gene-600 ${sizeClasses[size]} ${className}`} />
  );
};

