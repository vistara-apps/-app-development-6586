import { useEffect, useRef, useCallback } from 'react';

// Hook for managing keyboard navigation within a container
export const useKeyboardNavigation = (options = {}) => {
  const {
    selector = '[data-keyboard-nav]',
    loop = true,
    autoFocus = false,
    onEscape,
    onEnter,
    disabled = false
  } = options;

  const containerRef = useRef(null);
  const currentIndexRef = useRef(-1);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(selector));
  }, [selector]);

  const focusElement = useCallback((index) => {
    const elements = getFocusableElements();
    if (elements[index]) {
      elements[index].focus();
      currentIndexRef.current = index;
    }
  }, [getFocusableElements]);

  const handleKeyDown = useCallback((e) => {
    if (disabled) return;

    const elements = getFocusableElements();
    if (elements.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex >= elements.length) {
          focusElement(loop ? 0 : elements.length - 1);
        } else {
          focusElement(nextIndex);
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = currentIndexRef.current - 1;
        if (prevIndex < 0) {
          focusElement(loop ? elements.length - 1 : 0);
        } else {
          focusElement(prevIndex);
        }
        break;

      case 'Home':
        e.preventDefault();
        focusElement(0);
        break;

      case 'End':
        e.preventDefault();
        focusElement(elements.length - 1);
        break;

      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape(e);
        }
        break;

      case 'Enter':
        if (onEnter) {
          e.preventDefault();
          onEnter(e, currentIndexRef.current);
        }
        break;
    }
  }, [disabled, getFocusableElements, focusElement, loop, onEscape, onEnter]);

  const handleFocus = useCallback((e) => {
    if (disabled) return;
    
    const elements = getFocusableElements();
    const index = elements.indexOf(e.target);
    if (index !== -1) {
      currentIndexRef.current = index;
    }
  }, [disabled, getFocusableElements]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('focusin', handleFocus);

    // Auto focus first element if requested
    if (autoFocus) {
      const elements = getFocusableElements();
      if (elements.length > 0) {
        focusElement(0);
      }
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusin', handleFocus);
    };
  }, [handleKeyDown, handleFocus, autoFocus, disabled, getFocusableElements, focusElement]);

  return {
    containerRef,
    focusElement,
    getCurrentIndex: () => currentIndexRef.current,
    getElementCount: () => getFocusableElements().length
  };
};

// Hook for managing focus trap (useful for modals, dropdowns)
export const useFocusTrap = (isActive = true) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when trap becomes active
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

// Hook for managing skip links
export const useSkipLinks = () => {
  const skipLinksRef = useRef(null);

  const addSkipLink = useCallback((targetId, label) => {
    if (!skipLinksRef.current) return;

    const link = document.createElement('a');
    link.href = `#${targetId}`;
    link.textContent = label;
    link.className = `
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
      bg-gene-600 text-white px-4 py-2 rounded-md z-50 
      focus:outline-none focus:ring-2 focus:ring-white
    `;
    
    skipLinksRef.current.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return { skipLinksRef, addSkipLink };
};

// Hook for managing ARIA live regions
export const useLiveRegion = (politeness = 'polite') => {
  const liveRegionRef = useRef(null);

  const announce = useCallback((message) => {
    if (!liveRegionRef.current) return;

    // Clear previous message
    liveRegionRef.current.textContent = '';
    
    // Set new message after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 100);
  }, []);

  const createLiveRegion = useCallback(() => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    liveRegionRef.current = region;

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, [politeness]);

  useEffect(() => {
    const cleanup = createLiveRegion();
    return cleanup;
  }, [createLiveRegion]);

  return { announce };
};

// Hook for managing reduced motion preferences
export const useReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return {
    prefersReducedMotion,
    getAnimationDuration: (normalDuration) => prefersReducedMotion ? 0 : normalDuration,
    shouldAnimate: !prefersReducedMotion
  };
};

