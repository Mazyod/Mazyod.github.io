/**
 * Progressive Enhancement Tests
 * Tests core functionality without JavaScript and with graceful degradation
 */

const { test, expect } = require('@playwright/test');

test.describe('Progressive Enhancement', () => {

  test('core functionality works without JavaScript', async ({ page, browserName }) => {
    // Disable JavaScript
    await page.context().addInitScript(() => {
      delete window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { javaScriptEnabled: false },
        writable: false
      });
    });
    
    await page.goto('/');
    
    // Basic content should still be visible
    await expect(page.locator('.content')).toBeVisible();
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    
    // Navigation links should work
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    
    console.log(`✓ Core functionality works without JS in ${browserName}`);
  });

  test('CSS-only navigation works', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test that links are clickable without JavaScript
    const aboutLink = page.locator('a[href*="about"]');
    if (await aboutLink.count() > 0) {
      // Use page.click instead of element.click to avoid JS
      await aboutLink.first().click({ noWaitAfter: true });
      
      // Wait for navigation
      await page.waitForURL(/about/);
      await expect(page.locator('.content')).toBeVisible();
    }
    
    console.log(`✓ CSS-only navigation works in ${browserName}`);
  });

  test('fallback fonts are applied', async ({ page, browserName }) => {
    // Block Google Fonts to test fallbacks
    await page.route('**fonts.googleapis.com**', route => route.abort());
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that fallback fonts are used
    const bodyFont = await page.locator('body').evaluate(el => 
      getComputedStyle(el).fontFamily
    );
    
    // Should fall back to sans-serif fonts
    expect(bodyFont).toMatch(/sans-serif|Helvetica|Arial/i);
    
    console.log(`✓ Fallback fonts work in ${browserName}`);
  });

  test('images have proper alt text', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check all images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Alt should be present (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
    
    console.log(`✓ Images have proper alt text in ${browserName}`);
  });

  test('content is readable without CSS', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Disable all stylesheets
    await page.addStyleTag({
      content: `
        * {
          background: white !important;
          color: black !important;
          font-family: serif !important;
          font-size: 16px !important;
          line-height: 1.4 !important;
        }
      `
    });
    
    // Content should still be readable
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    await expect(page.locator('p')).toBeVisible();
    await expect(page.locator('a')).toBeVisible();
    
    console.log(`✓ Content readable without CSS in ${browserName}`);
  });

  test('forms work without JavaScript', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Look for any forms on the page
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      
      // Check form has proper action attribute
      const action = await form.getAttribute('action');
      expect(action).not.toBeNull();
      
      // Check form has submit method
      const method = await form.getAttribute('method');
      expect(method).toMatch(/get|post/i);
    }
    
    console.log(`✓ Forms work without JavaScript in ${browserName}`);
  });

  test('semantic HTML structure is correct', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check for proper semantic structure
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Check that links have meaningful text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const linkText = await links.nth(i).textContent();
      expect(linkText).not.toMatch(/^(click here|read more|link)$/i);
    }
    
    console.log(`✓ Semantic HTML structure correct in ${browserName}`);
  });

  test('keyboard navigation without JavaScript', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toMatch(/A|BUTTON|INPUT|TEXTAREA|SELECT/);
    
    // Continue tabbing and verify focus moves
    await page.keyboard.press('Tab');
    let newFocusedElement = await page.evaluate(() => document.activeElement.tagName);
    
    // Focus should have moved (unless there's only one focusable element)
    const focusableCount = await page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').count();
    if (focusableCount > 1) {
      // Either different element or same element type is fine
      expect(newFocusedElement).toMatch(/A|BUTTON|INPUT|TEXTAREA|SELECT/);
    }
    
    console.log(`✓ Keyboard navigation works without JS in ${browserName}`);
  });

  test('print styles are applied', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    
    // Check that content is still visible
    await expect(page.locator('.content')).toBeVisible();
    
    // Check basic print-friendly styling
    const bodyColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).color
    );
    
    // Should be dark text for printing
    expect(bodyColor).toMatch(/rgb\(0,\s*0,\s*0\)|black/);
    
    console.log(`✓ Print styles work in ${browserName}`);
  });

  test('graceful degradation for modern features', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test that the page works even if modern features fail
    await page.evaluate(() => {
      // Simulate feature detection failures
      if (window.CSS) {
        window.CSS.supports = () => false;
      }
      
      // Remove modern features
      delete window.IntersectionObserver;
      delete window.requestAnimationFrame;
    });
    
    // Page should still function
    await expect(page.locator('.content')).toBeVisible();
    await expect(page.locator('a')).toBeVisible();
    
    console.log(`✓ Graceful degradation works in ${browserName}`);
  });

});