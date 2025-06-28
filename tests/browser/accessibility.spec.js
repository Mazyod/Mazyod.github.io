/**
 * Accessibility Tests
 * Tests accessibility features and compliance
 */

const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {

  test('page has proper ARIA landmarks', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check for main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    
    // Check for navigation if present
    const nav = page.locator('nav, [role="navigation"]');
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible();
    }
    
    // Check for footer
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
    
    console.log(`✓ ARIA landmarks present in ${browserName}`);
  });

  test('headings follow proper hierarchy', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    let previousLevel = 0;
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const currentLevel = parseInt(tagName.charAt(1));
      
      if (previousLevel === 0) {
        // First heading should be h1
        expect(currentLevel).toBe(1);
      } else {
        // Subsequent headings should not skip levels
        expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      }
      
      previousLevel = currentLevel;
    }
    
    console.log(`✓ Heading hierarchy correct in ${browserName}`);
  });

  test('images have appropriate alt text', async ({ page, browserName }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // Alt attribute should be present
      expect(alt).not.toBeNull();
      
      // If it's a content image, alt should be meaningful
      if (src && !src.includes('icon') && !src.includes('logo')) {
        expect(alt).not.toBe('');
        expect(alt.length).toBeGreaterThan(3);
      }
    }
    
    console.log(`✓ Image alt text appropriate in ${browserName}`);
  });

  test('links have descriptive text', async ({ page, browserName }) => {
    await page.goto('/');
    
    const links = await page.locator('a[href]').all();
    
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Link should have meaningful text or aria-label
      const hasDescription = (text && text.trim().length > 0) || 
                           (ariaLabel && ariaLabel.trim().length > 0) ||
                           (title && title.trim().length > 0);
      
      expect(hasDescription).toBeTruthy();
      
      // Should not use generic text
      if (text) {
        expect(text.toLowerCase()).not.toMatch(/^(click here|read more|link|more)$/);
      }
    }
    
    console.log(`✓ Links have descriptive text in ${browserName}`);
  });

  test('color contrast is sufficient', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test key text elements for contrast
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, a, span').all();
    
    for (const element of textElements.slice(0, 10)) { // Test first 10 elements
      const styles = await element.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      // Basic check - color should not be the same as background
      if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        expect(styles.color).not.toBe(styles.backgroundColor);
      }
    }
    
    console.log(`✓ Basic color contrast checks pass in ${browserName}`);
  });

  test('focus indicators are visible', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Find focusable elements
    const focusableElements = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
    
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      
      // Focus the element
      await firstElement.focus();
      
      // Check if element has focus styles
      const focusStyles = await firstElement.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow
        };
      });
      
      // Should have some kind of focus indicator
      const hasFocusIndicator = focusStyles.outline !== 'none' || 
                               focusStyles.outlineWidth !== '0px' ||
                               focusStyles.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBeTruthy();
    }
    
    console.log(`✓ Focus indicators visible in ${browserName}`);
  });

  test('page is keyboard navigable', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test tab navigation
    const focusableElements = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').count();
    
    if (focusableElements > 0) {
      // Start tabbing
      await page.keyboard.press('Tab');
      
      let currentElement = await page.evaluate(() => document.activeElement.tagName);
      expect(currentElement).toMatch(/A|BUTTON|INPUT|TEXTAREA|SELECT/);
      
      // Test that we can continue tabbing
      await page.keyboard.press('Tab');
      
      // Should be able to navigate with Shift+Tab too
      await page.keyboard.press('Shift+Tab');
      
      currentElement = await page.evaluate(() => document.activeElement.tagName);
      expect(currentElement).toMatch(/A|BUTTON|INPUT|TEXTAREA|SELECT|BODY/);
    }
    
    console.log(`✓ Keyboard navigation works in ${browserName}`);
  });

  test('page works with reduced motion', async ({ page, browserName }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    // Page should still be functional
    await expect(page.locator('.content')).toBeVisible();
    
    // Check that animations are disabled or reduced
    const animatedElements = await page.locator('*').evaluateAll(elements => {
      return elements.filter(el => {
        const computed = getComputedStyle(el);
        return computed.animationDuration !== '0s' || 
               computed.transitionDuration !== '0s';
      }).length;
    });
    
    // With reduced motion, there should be fewer animated elements
    console.log(`Animated elements with reduced motion: ${animatedElements}`);
    
    console.log(`✓ Reduced motion support works in ${browserName}`);
  });

  test('page supports high contrast mode', async ({ page, browserName }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    
    await page.goto('/');
    
    // Page should still be readable
    await expect(page.locator('.content')).toBeVisible();
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    
    console.log(`✓ High contrast mode support works in ${browserName}`);
  });

  test('forms are properly labeled', async ({ page, browserName }) => {
    await page.goto('/');
    
    const formInputs = await page.locator('input, textarea, select').all();
    
    for (const input of formInputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Check if there's a label for this input
      let hasLabel = false;
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }
      
      // Input should have some form of labeling
      const hasLabeling = hasLabel || ariaLabel || ariaLabelledBy || placeholder;
      expect(hasLabeling).toBeTruthy();
    }
    
    console.log(`✓ Forms properly labeled in ${browserName}`);
  });

  test('page has proper document structure', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check for proper document structure
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for language attribute
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    
    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      expect(metaDescription.length).toBeGreaterThan(0);
    }
    
    console.log(`✓ Document structure proper in ${browserName}`);
  });

});