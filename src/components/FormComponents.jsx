import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, Upload, FileText } from 'lucide-react';

// Enhanced Input Field with floating label and validation
export const FloatingInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  error, 
  success,
  required = false,
  className = "",
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 pt-6 pb-2 border-2 rounded-lg transition-all duration-200 outline-none
            ${error ? 'border-red-300 focus:border-red-500' : 
              success ? 'border-green-300 focus:border-green-500' :
              'border-gray-300 focus:border-gene-500'}
            ${error ? 'bg-red-50' : success ? 'bg-green-50' : 'bg-white'}
          `}
          {...props}
        />
        
        <label className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${shouldFloat 
            ? 'top-2 text-xs text-gray-500' 
            : 'top-1/2 -translate-y-1/2 text-gray-400'
          }
          ${focused && !error ? 'text-gene-600' : ''}
          ${error ? 'text-red-500' : ''}
          ${success ? 'text-green-500' : ''}
        `}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}

        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <X className="h-5 w-5 text-red-500" />
            ) : (
              <Check className="h-5 w-5 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {(error || success) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
          {error || success}
        </p>
      )}
    </div>
  );
};

// Enhanced Select with floating label
export const FloatingSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  error, 
  success,
  required = false,
  className = "",
  placeholder = "Select an option...",
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 pt-6 pb-2 border-2 rounded-lg transition-all duration-200 outline-none appearance-none
            ${error ? 'border-red-300 focus:border-red-500' : 
              success ? 'border-green-300 focus:border-green-500' :
              'border-gray-300 focus:border-gene-500'}
            ${error ? 'bg-red-50' : success ? 'bg-green-50' : 'bg-white'}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <label className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${shouldFloat 
            ? 'top-2 text-xs text-gray-500' 
            : 'top-1/2 -translate-y-1/2 text-gray-400'
          }
          ${focused && !error ? 'text-gene-600' : ''}
          ${error ? 'text-red-500' : ''}
          ${success ? 'text-green-500' : ''}
        `}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {(error || success) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
          {error || success}
        </p>
      )}
    </div>
  );
};

// Enhanced Textarea with floating label
export const FloatingTextarea = ({ 
  label, 
  value, 
  onChange, 
  error, 
  success,
  required = false,
  rows = 4,
  className = "",
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          className={`
            w-full px-4 pt-6 pb-2 border-2 rounded-lg transition-all duration-200 outline-none resize-none
            ${error ? 'border-red-300 focus:border-red-500' : 
              success ? 'border-green-300 focus:border-green-500' :
              'border-gray-300 focus:border-gene-500'}
            ${error ? 'bg-red-50' : success ? 'bg-green-50' : 'bg-white'}
          `}
          {...props}
        />
        
        <label className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${shouldFloat 
            ? 'top-2 text-xs text-gray-500' 
            : 'top-6 text-gray-400'
          }
          ${focused && !error ? 'text-gene-600' : ''}
          ${error ? 'text-red-500' : ''}
          ${success ? 'text-green-500' : ''}
        `}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      
      {(error || success) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
          {error || success}
        </p>
      )}
    </div>
  );
};

// File Upload Component
export const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = ".txt,.csv,.json", 
  maxSize = 10, // MB
  error,
  success,
  className = "",
  label = "Upload File"
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      onFileSelect(null, `File size must be less than ${maxSize}MB`);
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file, null);
  };

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-gene-400 bg-gene-50' : 
            error ? 'border-red-300 bg-red-50' :
            success ? 'border-green-300 bg-green-50' :
            'border-gray-300 hover:border-gene-400 hover:bg-gene-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept={acceptedTypes}
          onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        <div className="text-center">
          {selectedFile ? (
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-8 w-8 text-gene-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <>
              <Upload className={`h-12 w-12 mx-auto mb-4 ${
                dragOver ? 'text-gene-600' : 'text-gray-400'
              }`} />
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-gene-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Accepted formats: {acceptedTypes} (max {maxSize}MB)
              </p>
            </>
          )}
        </div>
      </div>
      
      {(error || success) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
          {error || success}
        </p>
      )}
    </div>
  );
};

// Form Step Indicator
export const StepIndicator = ({ steps, currentStep, className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={index} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
              ${isCompleted ? 'bg-gene-600 border-gene-600 text-white' :
                isActive ? 'border-gene-600 text-gene-600 bg-white' :
                'border-gray-300 text-gray-400 bg-white'}
            `}>
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                isActive ? 'text-gene-600' : 
                isCompleted ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                isCompleted ? 'bg-gene-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

