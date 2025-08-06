import React, { forwardRef } from 'react';
import { Loader } from 'lucide-react';

const AccessibleButton = forwardRef(({ 
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  onClick,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${loading ? 'cursor-wait' : ''}
  `;

  const variants = {
    primary: `
      bg-gene-600 text-white hover:bg-gene-700 focus:ring-gene-500
      disabled:bg-gene-300 disabled:hover:bg-gene-300
    `,
    secondary: `
      bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500
      disabled:bg-gray-100 disabled:hover:bg-gray-100
    `,
    outline: `
      border-2 border-gene-600 text-gene-600 bg-transparent hover:bg-gene-50 focus:ring-gene-500
      disabled:border-gene-300 disabled:text-gene-300 disabled:hover:bg-transparent
    `,
    ghost: `
      text-gene-600 bg-transparent hover:bg-gene-50 focus:ring-gene-500
      disabled:text-gene-300 disabled:hover:bg-transparent
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      disabled:bg-red-300 disabled:hover:bg-red-300
    `,
    success: `
      bg-green-600 text-white hover:bg-green-700 focus:ring-green-500
      disabled:bg-green-300 disabled:hover:bg-green-300
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    // Ensure button can be activated with Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
      )}
      <span className={loading ? 'opacity-75' : ''}>
        {children}
      </span>
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;

