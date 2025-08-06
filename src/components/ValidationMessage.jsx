import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ValidationMessage = ({ 
  type = 'error', 
  message, 
  className = "",
  showIcon = true,
  onClose 
}) => {
  const getConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: <CheckCircle className="h-5 w-5" />
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: <AlertTriangle className="h-5 w-5" />
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: <Info className="h-5 w-5" />
        };
      case 'error':
      default:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: <AlertCircle className="h-5 w-5" />
        };
    }
  };

  const config = getConfig(type);

  if (!message) return null;

  return (
    <div className={`
      flex items-start p-4 rounded-lg border
      ${config.bgColor} ${config.borderColor} ${className}
    `}>
      {showIcon && (
        <div className={`flex-shrink-0 ${config.iconColor} mr-3`}>
          {config.icon}
        </div>
      )}
      
      <div className="flex-1">
        <p className={`text-sm ${config.textColor}`}>
          {message}
        </p>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ml-3 ${config.iconColor} hover:opacity-75`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Validation helper functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  return null;
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateAge = (age) => {
  const ageNum = parseInt(age);
  if (!age) return 'Age is required';
  if (isNaN(ageNum)) return 'Please enter a valid age';
  if (ageNum < 18) return 'You must be at least 18 years old';
  if (ageNum > 120) return 'Please enter a valid age';
  return null;
};

export const validateWeight = (weight) => {
  const weightNum = parseFloat(weight);
  if (!weight) return 'Weight is required';
  if (isNaN(weightNum)) return 'Please enter a valid weight';
  if (weightNum < 30) return 'Please enter a valid weight (minimum 30 lbs)';
  if (weightNum > 1000) return 'Please enter a valid weight (maximum 1000 lbs)';
  return null;
};

export const validateHeight = (height) => {
  const heightNum = parseFloat(height);
  if (!height) return 'Height is required';
  if (isNaN(heightNum)) return 'Please enter a valid height';
  if (heightNum < 36) return 'Please enter a valid height (minimum 36 inches)';
  if (heightNum > 96) return 'Please enter a valid height (maximum 96 inches)';
  return null;
};

// Form validation hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;
    
    if (typeof rule === 'function') {
      return rule(value);
    }
    
    if (Array.isArray(rule)) {
      for (const validator of rule) {
        const error = validator(value);
        if (error) return error;
      }
    }
    
    return null;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};
    
    Object.keys(validationRules).forEach(name => {
      newTouched[name] = true;
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

export default ValidationMessage;

