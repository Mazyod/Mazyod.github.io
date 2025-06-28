/**
 * Feature Detection and Conditional Polyfill Loading
 * Intelligently loads only the polyfills needed for the current browser
 */

(function() {
  'use strict';

  // Feature detection results
  const features = {
    customProperties: window.CSS && CSS.supports && CSS.supports('color', 'var(--fake-var)'),
    grid: window.CSS && CSS.supports && CSS.supports('display', 'grid'),
    flexbox: window.CSS && CSS.supports && CSS.supports('display', 'flex'),
    objectAssign: typeof Object.assign === 'function',
    arrayFrom: typeof Array.from === 'function',
    promise: typeof Promise !== 'undefined',
    intersectionObserver: 'IntersectionObserver' in window,
    customEvent: typeof window.CustomEvent === 'function',
    closest: Element.prototype.closest,
    matches: Element.prototype.matches,
    forEach: NodeList.prototype.forEach,
    smoothScroll: 'scrollBehavior' in document.documentElement.style,
    focusVisible: CSS.supports && CSS.supports('selector(:focus-visible)'),
  };

  // Add feature classes to document element
  const docElement = document.documentElement;
  
  // Add support/no-support classes
  Object.keys(features).forEach(feature => {
    const hasFeature = features[feature];
    const className = hasFeature ? `has-${feature}` : `no-${feature}`;
    docElement.classList.add(className);
  });

  // Legacy browser detection
  const isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1;
  const isOldEdge = navigator.userAgent.indexOf('Edge/') !== -1;
  const isOldSafari = /Safari\//.test(navigator.userAgent) && !/Chrome\//.test(navigator.userAgent) && parseFloat(navigator.userAgent.match(/Version\/(\d+\.\d+)/)?.[1]) < 12;

  if (isIE) {
    docElement.classList.add('ie', 'ie11', 'legacy-browser');
  }
  if (isOldEdge) {
    docElement.classList.add('edge-legacy', 'legacy-browser');
  }
  if (isOldSafari) {
    docElement.classList.add('safari-legacy', 'legacy-browser');
  }

  // Conditional polyfill loading
  const polyfillsNeeded = [];

  // Check which polyfills are needed
  if (!features.customProperties) {
    polyfillsNeeded.push('css-custom-properties');
  }
  
  if (!features.grid) {
    polyfillsNeeded.push('css-grid');
  }
  
  if (!features.objectAssign || !features.arrayFrom || !features.promise) {
    polyfillsNeeded.push('es6-basics');
  }
  
  if (!features.intersectionObserver) {
    polyfillsNeeded.push('intersection-observer');
  }
  
  if (!features.smoothScroll) {
    polyfillsNeeded.push('smooth-scroll');
  }
  
  if (!features.focusVisible) {
    polyfillsNeeded.push('focus-visible');
  }

  // Load polyfills if needed
  if (polyfillsNeeded.length > 0) {
    console.log('Loading polyfills for:', polyfillsNeeded.join(', '));
    
    // Load main polyfills script
    const script = document.createElement('script');
    script.src = (window.SITEURL || '') + '/theme/js/polyfills.js';
    script.async = true;
    script.onload = function() {
      console.log('Cross-browser polyfills loaded successfully');
    };
    script.onerror = function() {
      console.warn('Failed to load polyfills, but site should still function');
    };
    
    // Insert before any other scripts
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  // Performance tracking
  if (window.performance && window.performance.mark) {
    window.performance.mark('feature-detection-complete');
  }

  // Expose feature detection results globally
  window.featureSupport = features;
  window.polyfillsNeeded = polyfillsNeeded;

  // Add utility functions for feature detection
  window.hasFeature = function(featureName) {
    return features[featureName] || false;
  };

  window.needsPolyfill = function(featureName) {
    return polyfillsNeeded.indexOf(featureName) !== -1;
  };

  // Browser information for debugging
  window.browserInfo = {
    isIE: isIE,
    isOldEdge: isOldEdge,
    isOldSafari: isOldSafari,
    isLegacy: isIE || isOldEdge || isOldSafari,
    userAgent: navigator.userAgent,
    features: features,
    polyfills: polyfillsNeeded
  };

  console.log('Feature detection complete:', {
    supported: Object.keys(features).filter(f => features[f]),
    missing: Object.keys(features).filter(f => !features[f]),
    polyfillsNeeded: polyfillsNeeded
  });

})();