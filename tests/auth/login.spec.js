// TestSprite Test: User Login Flow
// Tests the user authentication process

const { test, expect } = require('@playwright/test');

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check form labels
    await expect(page.locator('text=Email Address')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
    
    // Check navigation links
    await expect(page.locator('text=Don\'t have an account?')).toBeVisible();
    await expect(page.locator('text=Sign up')).toBeVisible();
  });

  test('should validate login form inputs', async ({ page }) => {
    // Test empty form submission
    await page.click('button[type="submit"]');
    
    // Should show validation errors (browser native validation)
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required');
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should handle invalid credentials', async ({ page }) => {
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // First, create a test user (assuming signup works)
    await page.goto('/signup');
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for signup completion
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Now test login
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back');
    
    // Add to cleanup
    global.testData.cleanup.push({
      type: 'user',
      email: testUser.email
    });
  });

  test('should show proper loading state during login', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Fill out the form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit and check loading state
    await page.click('button[type="submit"]');
    
    // Button should show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    
    // Wait for completion or error
    await page.waitForTimeout(2000);
  });

  test('should navigate to signup page from login', async ({ page }) => {
    // Click on "Don't have an account?" link
    await page.click('text=Sign up');
    
    // Should navigate to signup page
    await expect(page).toHaveURL(/.*\/signup/);
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should handle email verification requirement', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Try to login with unverified email
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Should show email verification message
    await expect(page.locator('text=Please check your email')).toBeVisible();
  });

  test('should remember login state', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Login
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Navigate to another page and back
    await page.goto('/portfolio');
    await page.goto('/dashboard');
    
    // Should still be logged in
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('should handle logout functionality', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Login first
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Find and click logout button (assuming it's in navigation)
    await page.click('text=Sign Out');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect back to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should handle password reset flow', async ({ page }) => {
    // Click on "Forgot password?" link (if it exists)
    const forgotPasswordLink = page.locator('text=Forgot password?');
    
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Should navigate to password reset page
      await expect(page.locator('h1')).toContainText('Reset Password');
      
      // Fill email and submit
      await page.fill('input[type="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=Password reset email sent')).toBeVisible();
    }
  });
});
