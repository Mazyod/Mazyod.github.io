/**
 * Cross-Browser Polyfills for Retrospective Theme
 * Ensures compatibility across Chrome, Firefox, Safari, Edge, and IE11+
 */

(function() {
  'use strict';

  // CSS Custom Properties (CSS Variables) Polyfill for IE11
  if (!window.CSS || !CSS.supports('color', 'var(--fake-var)')) {
    // Simple CSS custom properties polyfill
    var customProps = {};
    
    function getCSSCustomProperty(property) {
      return customProps[property] || null;
    }
    
    function setCSSCustomProperty(property, value) {
      customProps[property] = value;
      document.documentElement.style.setProperty(property, value);
    }
    
    // Parse existing CSS custom properties from :root
    try {
      var sheets = document.styleSheets;
      for (var i = 0; i < sheets.length; i++) {
        try {
          var rules = sheets[i].cssRules || sheets[i].rules;
          for (var j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === ':root' || rules[j].selectorText === '[data-bs-theme="dark"]') {
              var style = rules[j].style;
              for (var k = 0; k < style.length; k++) {
                var prop = style[k];
                if (prop.startsWith('--')) {
                  customProps[prop] = style.getPropertyValue(prop);
                }
              }
            }
          }
        } catch (e) {
          // Skip cross-origin stylesheets
        }
      }
    } catch (e) {
      console.warn('Could not parse CSS custom properties');
    }
    
    window.getCSSCustomProperty = getCSSCustomProperty;
    window.setCSSCustomProperty = setCSSCustomProperty;
  }

  // CSS Grid Fallback for older browsers
  if (!window.CSS || !CSS.supports('display', 'grid')) {
    // Add flexbox fallback class
    document.documentElement.classList.add('no-grid');
    
    // Simple grid polyfill using flexbox
    function applyGridFallback() {
      var gridElements = document.querySelectorAll('[style*="display: grid"], [style*="display:grid"]');
      for (var i = 0; i < gridElements.length; i++) {
        var el = gridElements[i];
        el.style.display = 'flex';
        el.style.flexWrap = 'wrap';
        el.classList.add('grid-fallback');
      }
    }
    
    // Apply fallback after DOM loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyGridFallback);
    } else {
      applyGridFallback();
    }
  }

  // Object.assign polyfill for IE11
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // Array.from polyfill for IE11
  if (!Array.from) {
    Array.from = function(arrayLike) {
      var items = Object(arrayLike);
      var len = parseInt(items.length) || 0;
      var result = new Array(len);
      var k = 0;
      while (k < len) {
        if (k in items) {
          result[k] = items[k];
        }
        k++;
      }
      return result;
    };
  }

  // forEach polyfill for NodeList in IE11
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // closest() method polyfill for IE11
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // matches() method polyfill for IE11
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
  }

  // CustomEvent polyfill for IE11
  if (typeof window.CustomEvent !== 'function') {
    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  // Promise polyfill for IE11 (basic implementation)
  if (typeof Promise === 'undefined') {
    window.Promise = function(executor) {
      var self = this;
      self.state = 'pending';
      self.value = undefined;
      self.handlers = [];
      
      function resolve(result) {
        if (self.state === 'pending') {
          self.state = 'fulfilled';
          self.value = result;
          self.handlers.forEach(handle);
          self.handlers = null;
        }
      }
      
      function reject(error) {
        if (self.state === 'pending') {
          self.state = 'rejected';
          self.value = error;
          self.handlers.forEach(handle);
          self.handlers = null;
        }
      }
      
      function handle(handler) {
        if (self.state === 'pending') {
          self.handlers.push(handler);
        } else {
          if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
            handler.onFulfilled(self.value);
          }
          if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
            handler.onRejected(self.value);
          }
        }
      }
      
      this.then = function(onFulfilled, onRejected) {
        return new Promise(function(resolve, reject) {
          handle({
            onFulfilled: function(result) {
              try {
                resolve(onFulfilled ? onFulfilled(result) : result);
              } catch (ex) {
                reject(ex);
              }
            },
            onRejected: function(error) {
              try {
                resolve(onRejected ? onRejected(error) : error);
              } catch (ex) {
                reject(ex);
              }
            }
          });
        });
      };
      
      executor(resolve, reject);
    };
  }

  // Intersection Observer polyfill for older browsers
  if (!('IntersectionObserver' in window)) {
    // Basic polyfill - just executes callback immediately
    window.IntersectionObserver = function(callback) {
      this.observe = function(element) {
        // Fallback: just trigger callback immediately
        setTimeout(function() {
          callback([{
            target: element,
            isIntersecting: true,
            intersectionRatio: 1
          }]);
        }, 100);
      };
      this.unobserve = function() {};
      this.disconnect = function() {};
    };
  }

  // Smooth scrolling polyfill
  function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
      document.head.appendChild(script);
    }
  }

  // Apply smooth scrolling polyfill
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
  } else {
    smoothScrollPolyfill();
  }

  // Focus-visible polyfill for better keyboard navigation
  function applyFocusVisiblePolyfill() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/focus-visible@5.2.0/dist/focus-visible.min.js';
    document.head.appendChild(script);
  }

  // Apply focus-visible polyfill
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFocusVisiblePolyfill);
  } else {
    applyFocusVisiblePolyfill();
  }

  console.log('Cross-browser polyfills loaded successfully');

})();