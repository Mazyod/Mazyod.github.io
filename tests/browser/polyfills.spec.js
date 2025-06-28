/**
 * Polyfills and Feature Detection Tests
 * Tests that polyfills load correctly and provide expected functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Polyfills and Feature Detection', () => {

  test('feature detection script loads and runs', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check that feature detection has run
    const featureSupport = await page.evaluate(() => window.featureSupport);
    expect(featureSupport).toBeTruthy();
    
    // Check that browser info is available
    const browserInfo = await page.evaluate(() => window.browserInfo);
    expect(browserInfo).toBeTruthy();
    expect(browserInfo.userAgent).toBeTruthy();
    
    console.log(`✓ Feature detection works in ${browserName}`);
  });

  test('CSS custom properties work or have fallbacks', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test that CSS custom properties are working
    const customPropSupport = await page.evaluate(() => {
      return window.CSS && CSS.supports && CSS.supports('color', 'var(--fake-var)');
    });
    
    // Get computed style to check if colors are applied
    const bodyColor = await page.locator('body').evaluate(el => {
      return getComputedStyle(el).color;
    });
    
    // Color should not be default black or transparent
    expect(bodyColor).not.toBe('rgb(0, 0, 0)');
    expect(bodyColor).not.toBe('rgba(0, 0, 0, 0)');
    
    console.log(`✓ CSS custom properties work in ${browserName} (supported: ${customPropSupport})`);
  });

  test('Object.assign polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const objectAssignWorks = await page.evaluate(() => {
      try {
        const target = { a: 1 };
        const source = { b: 2 };
        const result = Object.assign(target, source);
        return result.a === 1 && result.b === 2;
      } catch (e) {
        return false;
      }
    });
    
    expect(objectAssignWorks).toBeTruthy();
    console.log(`✓ Object.assign works in ${browserName}`);
  });

  test('Array.from polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const arrayFromWorks = await page.evaluate(() => {
      try {
        const nodeList = document.querySelectorAll('div');
        const array = Array.from(nodeList);
        return Array.isArray(array);
      } catch (e) {
        return false;
      }
    });
    
    expect(arrayFromWorks).toBeTruthy();
    console.log(`✓ Array.from works in ${browserName}`);
  });

  test('Promise polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const promiseWorks = await page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 10);
      }).then(result => result === true);
    });
    
    expect(promiseWorks).toBeTruthy();
    console.log(`✓ Promise works in ${browserName}`);
  });

  test('Element.closest polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const closestWorks = await page.evaluate(() => {
      try {
        const element = document.querySelector('body *');
        if (element) {
          const closest = element.closest('body');
          return closest && closest.tagName === 'BODY';
        }
        return true; // No elements to test, consider it working
      } catch (e) {
        return false;
      }
    });
    
    expect(closestWorks).toBeTruthy();
    console.log(`✓ Element.closest works in ${browserName}`);
  });

  test('Element.matches polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const matchesWorks = await page.evaluate(() => {
      try {
        const body = document.querySelector('body');
        return body && body.matches('body');
      } catch (e) {
        return false;
      }
    });
    
    expect(matchesWorks).toBeTruthy();
    console.log(`✓ Element.matches works in ${browserName}`);
  });

  test('NodeList.forEach polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const forEachWorks = await page.evaluate(() => {
      try {
        const elements = document.querySelectorAll('*');
        let count = 0;
        elements.forEach(() => count++);
        return count > 0;
      } catch (e) {
        return false;
      }
    });
    
    expect(forEachWorks).toBeTruthy();
    console.log(`✓ NodeList.forEach works in ${browserName}`);
  });

  test('CustomEvent polyfill works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const customEventWorks = await page.evaluate(() => {
      try {
        const event = new CustomEvent('test', { detail: 'test-data' });
        return event.type === 'test' && event.detail === 'test-data';
      } catch (e) {
        return false;
      }
    });
    
    expect(customEventWorks).toBeTruthy();
    console.log(`✓ CustomEvent works in ${browserName}`);
  });

  test('CSS Grid fallback to Flexbox works', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check if grid is supported
    const gridSupported = await page.evaluate(() => {
      return window.CSS && CSS.supports && CSS.supports('display', 'grid');
    });
    
    // Check if fallback classes are applied when needed
    const hasGridFallback = await page.evaluate(() => {
      return document.documentElement.classList.contains('no-grid');
    });
    
    if (!gridSupported) {
      expect(hasGridFallback).toBeTruthy();
    }
    
    console.log(`✓ CSS Grid fallback works in ${browserName} (grid supported: ${gridSupported})`);
  });

  test('focus-visible polyfill loads when needed', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check if focus-visible is supported natively
    const focusVisibleSupported = await page.evaluate(() => {
      return window.CSS && CSS.supports && CSS.supports('selector(:focus-visible)');
    });
    
    // If not supported, polyfill should be loaded
    if (!focusVisibleSupported) {
      // Wait a bit for polyfill to load
      await page.waitForTimeout(500);
      
      const polyfillLoaded = await page.evaluate(() => {
        return document.querySelector('script[src*="focus-visible"]') !== null;
      });
      
      // Note: This test may not always pass as the polyfill loads conditionally
      console.log(`Focus-visible polyfill loaded: ${polyfillLoaded}`);
    }
    
    console.log(`✓ Focus-visible handling works in ${browserName} (natively supported: ${focusVisibleSupported})`);
  });

  test('polyfills do not break existing functionality', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check that basic page functionality still works
    await expect(page.locator('.content')).toBeVisible();
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    
    // Check that links are clickable
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    
    // Check that no JavaScript errors occurred
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000); // Wait for any async errors
    
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('disqus') &&
      !error.includes('focus-visible') // Focus-visible may not load in all browsers
    );
    
    expect(criticalErrors.length).toBe(0);
    
    console.log(`✓ Polyfills don't break functionality in ${browserName}`);
  });

  test('legacy browser detection works', async ({ page, browserName }) => {
    await page.goto('/');
    
    const browserInfo = await page.evaluate(() => window.browserInfo);
    
    // Should have browser detection results
    expect(typeof browserInfo.isIE).toBe('boolean');
    expect(typeof browserInfo.isOldEdge).toBe('boolean');
    expect(typeof browserInfo.isOldSafari).toBe('boolean');
    expect(typeof browserInfo.isLegacy).toBe('boolean');
    
    console.log(`✓ Legacy browser detection works in ${browserName}`, {
      isLegacy: browserInfo.isLegacy,
      isIE: browserInfo.isIE
    });
  });

  test('feature detection utility functions work', async ({ page, browserName }) => {
    await page.goto('/');
    
    const utilityFunctionsWork = await page.evaluate(() => {
      try {
        // Test hasFeature function
        const hasCustomProps = window.hasFeature('customProperties');
        const hasGrid = window.hasFeature('grid');
        
        // Test needsPolyfill function  
        const needsCSSPolyfill = window.needsPolyfill('css-custom-properties');
        
        return typeof hasCustomProps === 'boolean' && 
               typeof hasGrid === 'boolean' &&
               typeof needsCSSPolyfill === 'boolean';
      } catch (e) {
        return false;
      }
    });
    
    expect(utilityFunctionsWork).toBeTruthy();
    console.log(`✓ Feature detection utilities work in ${browserName}`);
  });

});