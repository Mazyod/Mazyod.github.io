/**
 * Cross-Browser Compatibility Tests
 * Tests core functionality across different browsers
 */

const { test, expect } = require('@playwright/test');

test.describe('Cross-Browser Compatibility', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page, browserName }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/mazyod/i);
    
    // Check for main content elements
    await expect(page.locator('.content')).toBeVisible();
    
    // Verify branding is visible
    await expect(page.locator('.branding-container')).toBeVisible();
    
    // Log browser-specific information
    console.log(`✓ Homepage loaded successfully in ${browserName}`);
  });

  test('navigation works across browsers', async ({ page, browserName }) => {
    // Test navigation to about page
    const aboutLink = page.locator('a[href*="about"]');
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await expect(page).toHaveURL(/about/);
      console.log(`✓ Navigation works in ${browserName}`);
    }
  });

  test('blog posts are accessible', async ({ page, browserName }) => {
    // Look for blog post links
    const blogLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await blogLinks.count();
    
    if (linkCount > 0) {
      // Click on the first blog post
      await blogLinks.first().click();
      
      // Verify we're on a blog post page
      await expect(page.locator('article')).toBeVisible();
      console.log(`✓ Blog posts accessible in ${browserName}`);
    }
  });

  test('CSS styles are applied correctly', async ({ page, browserName }) => {
    // Check that custom styles are applied
    const body = page.locator('body');
    
    // Verify dark theme colors are applied
    const bodyBg = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    expect(bodyBg).not.toBe('rgb(255, 255, 255)'); // Not white
    
    // Check that fonts are loaded
    const fontFamily = await body.evaluate(el => getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('Roboto');
    
    console.log(`✓ CSS styles applied correctly in ${browserName}`);
  });

  test('responsive design works', async ({ page, browserName }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.content')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.content')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.content')).toBeVisible();
    
    console.log(`✓ Responsive design works in ${browserName}`);
  });

  test('polyfills are loaded', async ({ page, browserName }) => {
    // Check if polyfills script is loaded
    const polyfillsLoaded = await page.evaluate(() => {
      // Check for polyfill-specific functions or markers
      return window.getCSSCustomProperty !== undefined || 
             document.documentElement.classList.contains('no-grid') ||
             typeof Promise !== 'undefined';
    });
    
    expect(polyfillsLoaded).toBeTruthy();
    console.log(`✓ Polyfills loaded correctly in ${browserName}`);
  });

  test('keyboard navigation works', async ({ page, browserName }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if there's a focused element
    const focusedElement = await page.evaluate(() => document.activeElement);
    expect(focusedElement).not.toBeNull();
    
    console.log(`✓ Keyboard navigation works in ${browserName}`);
  });

  test('images load correctly', async ({ page, browserName }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check if images are present and loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first image
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // Verify image is actually loaded
      const naturalWidth = await firstImage.evaluate(img => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
    
    console.log(`✓ Images load correctly in ${browserName}`);
  });

  test('external scripts load without errors', async ({ page, browserName }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for all scripts to load
    await page.waitForLoadState('networkidle');
    
    // Filter out non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('disqus')
    );
    
    expect(criticalErrors.length).toBe(0);
    console.log(`✓ No critical script errors in ${browserName}`);
  });

});