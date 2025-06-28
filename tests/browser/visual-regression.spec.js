/**
 * Visual Regression Tests
 * Captures screenshots and compares them across browsers
 */

const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  
  test('homepage visual consistency', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic content that might cause flaky tests
    await page.addStyleTag({
      content: `
        .dynamic-content,
        .disqus-comments,
        .analytics-script {
          visibility: hidden !important;
        }
      `
    });
    
    // Take screenshot
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      threshold: 0.2, // Allow for minor rendering differences
    });
  });

  test('blog post visual consistency', async ({ page, browserName }) => {
    // Navigate to a recent blog post
    await page.goto('/');
    
    const blogLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await blogLinks.count();
    
    if (linkCount > 0) {
      await blogLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Hide dynamic elements
      await page.addStyleTag({
        content: `
          .disqus-comments,
          .social-share,
          .analytics-script {
            visibility: hidden !important;
          }
        `
      });
      
      // Take screenshot of blog post
      await expect(page).toHaveScreenshot(`blog-post-${browserName}.png`, {
        fullPage: true,
        threshold: 0.2,
      });
    }
  });

  test('mobile responsive visual test', async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic content
    await page.addStyleTag({
      content: `
        .dynamic-content,
        .disqus-comments {
          visibility: hidden !important;
        }
      `
    });
    
    // Take mobile screenshot
    await expect(page).toHaveScreenshot(`mobile-homepage-${browserName}.png`, {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('tablet responsive visual test', async ({ page, browserName }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic content
    await page.addStyleTag({
      content: `
        .dynamic-content,
        .disqus-comments {
          visibility: hidden !important;
        }
      `
    });
    
    // Take tablet screenshot
    await expect(page).toHaveScreenshot(`tablet-homepage-${browserName}.png`, {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('dark theme visual consistency', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Ensure dark theme is applied
    await page.addStyleTag({
      content: `
        html[data-bs-theme="dark"] {
          color-scheme: dark;
        }
        .dynamic-content {
          visibility: hidden !important;
        }
      `
    });
    
    await page.waitForLoadState('networkidle');
    
    // Take dark theme screenshot
    await expect(page).toHaveScreenshot(`dark-theme-${browserName}.png`, {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('code syntax highlighting visual test', async ({ page, browserName }) => {
    // Find a blog post with code
    await page.goto('/');
    
    // Look for posts that likely contain code
    const codePostLinks = page.locator('a[href*="/blog/"]');
    const linkCount = await codePostLinks.count();
    
    if (linkCount > 0) {
      // Try to find a post with code
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        await codePostLinks.nth(i).click();
        await page.waitForLoadState('networkidle');
        
        // Check if there's code on this page
        const codeBlocks = page.locator('pre, code');
        const codeCount = await codeBlocks.count();
        
        if (codeCount > 0) {
          // Found a page with code, take screenshot
          await page.addStyleTag({
            content: `
              .disqus-comments,
              .social-share {
                visibility: hidden !important;
              }
            `
          });
          
          await expect(page).toHaveScreenshot(`code-highlighting-${browserName}.png`, {
            fullPage: true,
            threshold: 0.2,
          });
          break;
        }
        
        // Go back and try next post
        await page.goBack();
      }
    }
  });

  test('navigation elements visual test', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Focus on navigation area only
    const nav = page.locator('nav, .navbar, .branding-container');
    
    if (await nav.count() > 0) {
      await expect(nav.first()).toHaveScreenshot(`navigation-${browserName}.png`, {
        threshold: 0.2,
      });
    }
  });

  test('footer visual consistency', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Take footer screenshot
    await expect(page.locator('footer')).toHaveScreenshot(`footer-${browserName}.png`, {
      threshold: 0.2,
    });
  });

});