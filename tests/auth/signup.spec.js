// TestSprite Test: User Signup Flow
// Tests the complete user registration process

const { test, expect } = require('@playwright/test');

test.describe('User Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should display signup form correctly', async ({ page }) => {
    // Check form elements are present
    await expect(page.locator('input[type="text"][placeholder="John Doe"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
    await expect(page.locator('input[placeholder="Enter referral code"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check form labels
    await expect(page.locator('text=Full Name')).toBeVisible();
    await expect(page.locator('text=Email Address')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
    await expect(page.locator('text=Confirm Password')).toBeVisible();
    await expect(page.locator('text=Referral Code')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Test empty form submission
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    
    // Test password mismatch
    await page.fill('input[type="password"]:first-of-type', 'password123');
    await page.fill('input[type="password"]:last-of-type', 'different123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    
    // Test short password
    await page.fill('input[type="password"]:first-of-type', '123');
    await page.fill('input[type="password"]:last-of-type', '123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should successfully create account with valid data', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Fill out the form
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Add to cleanup
    global.testData.cleanup.push({
      type: 'user',
      email: testUser.email
    });
  });

  test('should handle referral code signup', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Fill out the form with referral code
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    await page.fill('input[placeholder="Enter referral code"]', testUser.referralCode);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Add to cleanup
    global.testData.cleanup.push({
      type: 'user',
      email: testUser.email
    });
  });

  test('should handle signup with referral URL parameter', async ({ page }) => {
    const testUser = global.testData.testUser;
    const referralCode = 'REF123';
    
    // Navigate to signup with referral parameter
    await page.goto(`/signup?ref=${referralCode}`);
    
    // Check if referral code is pre-filled
    await expect(page.locator('input[placeholder="Enter referral code"]')).toHaveValue(referralCode);
    
    // Check if referral message is shown
    await expect(page.locator('text=You\'ve been invited!')).toBeVisible();
    
    // Fill out the form
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Add to cleanup
    global.testData.cleanup.push({
      type: 'user',
      email: testUser.email
    });
  });

  test('should handle duplicate email signup', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // First signup
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Try to signup again with same email
    await page.goto('/signup');
    await page.fill('input[placeholder="John Doe"]', 'Another User');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', 'AnotherPassword123!');
    await page.fill('input[type="password"]:last-of-type', 'AnotherPassword123!');
    await page.click('button[type="submit"]');
    
    // Should show error for duplicate email
    await expect(page.locator('text=User already registered')).toBeVisible();
  });

  test('should navigate to login page from signup', async ({ page }) => {
    // Click on "Already have an account?" link
    await page.click('text=Already have an account?');
    
    // Should navigate to login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('should show proper loading state during signup', async ({ page }) => {
    const testUser = global.testData.testUser;
    
    // Fill out the form
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    
    // Submit and check loading state
    await page.click('button[type="submit"]');
    
    // Button should show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('.spinner')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('text=Account created successfully')).toBeVisible();
  });
});
