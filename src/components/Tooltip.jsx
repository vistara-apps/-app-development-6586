import React, { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle, AlertCircle } from 'lucide-react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  trigger = 'hover',
  variant = 'default',
  className = '',
  disabled = false,
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const variants = {
    default: 'bg-gray-900 text-white',
    info: 'bg-blue-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg'
  };

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };

  const getArrowColor = (variant) => {
    switch (variant) {
      case 'info': return 'border-blue-600';
      case 'warning': return 'border-yellow-600';
      case 'error': return 'border-red-600';
      case 'light': return 'border-gray-200';
      default: return 'border-gray-900';
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip would overflow and adjust position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      hideTooltip();
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerProps = {
    ref: triggerRef,
    onClick: handleClick,
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip
    })
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div {...triggerProps}>
        {children}
      </div>
      
      {isVisible && content && (
        <>
          {/* Backdrop for click trigger */}
          {trigger === 'click' && (
            <div
              className="fixed inset-0 z-10"
              onClick={hideTooltip}
            />
          )}
          
          <div
            ref={tooltipRef}
            className={`
              absolute z-20 px-3 py-2 text-sm rounded-lg max-w-xs
              ${variants[variant]} ${positions[actualPosition]}
              ${isVisible ? 'opacity-100' : 'opacity-0'}
              transition-opacity duration-200
            `}
            role="tooltip"
            aria-hidden={!isVisible}
          >
            {content}
            
            {/* Arrow */}
            <div
              className={`
                absolute w-0 h-0 border-4
                ${arrows[actualPosition]} ${getArrowColor(variant)}
              `}
            />
          </div>
        </>
      )}
    </div>
  );
};

// Predefined tooltip components for common use cases
export const InfoTooltip = ({ content, ...props }) => (
  <Tooltip content={content} variant="info" {...props}>
    <Info className="h-4 w-4 text-blue-500 cursor-help" />
  </Tooltip>
);

export const HelpTooltip = ({ content, ...props }) => (
  <Tooltip content={content} variant="default" {...props}>
    <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
  </Tooltip>
);

export const WarningTooltip = ({ content, ...props }) => (
  <Tooltip content={content} variant="warning" {...props}>
    <AlertCircle className="h-4 w-4 text-yellow-500 cursor-help" />
  </Tooltip>
);

export default Tooltip;

