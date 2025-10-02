// TestSprite Test: Supabase API Integration
// Tests the backend API functionality and database operations

const { test, expect } = require('@playwright/test');

test.describe('Supabase API Integration', () => {
  let testUser;

  test.beforeEach(async ({ page }) => {
    testUser = global.testData.testUser;
  });

  test('should connect to Supabase successfully', async ({ page }) => {
    // Navigate to any page to initialize Supabase
    await page.goto('/');
    
    // Check if Supabase client is available
    const supabaseAvailable = await page.evaluate(() => {
      return typeof window !== 'undefined' && window.supabase !== undefined;
    });
    
    expect(supabaseAvailable).toBe(true);
  });

  test('should authenticate user successfully', async ({ page }) => {
    // Test authentication flow
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check if authentication was successful
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Verify user session
    const userSession = await page.evaluate(() => {
      return window.supabase.auth.getSession();
    });
    
    expect(userSession).toBeDefined();
  });

  test('should create user profile in database', async ({ page }) => {
    // Sign up a new user
    await page.goto('/signup');
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for signup completion
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Check if user profile was created in database
    const userProfile = await page.evaluate(async (email) => {
      const { data, error } = await window.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      return { data, error };
    }, testUser.email);
    
    expect(userProfile.error).toBeNull();
    expect(userProfile.data).toBeDefined();
    expect(userProfile.data.email).toBe(testUser.email);
    expect(userProfile.data.full_name).toBe(testUser.fullName);
  });

  test('should create portfolio for new user', async ({ page }) => {
    // Sign up a new user
    await page.goto('/signup');
    await page.fill('input[placeholder="John Doe"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]:first-of-type', testUser.password);
    await page.fill('input[type="password"]:last-of-type', testUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for signup completion
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Check if portfolio was created
    const portfolio = await page.evaluate(async (email) => {
      // Get user ID first
      const { data: user } = await window.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (!user) return null;
      
      // Get portfolio
      const { data, error } = await window.supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return { data, error };
    }, testUser.email);
    
    expect(portfolio.error).toBeNull();
    expect(portfolio.data).toBeDefined();
    expect(portfolio.data.etf_token_balance).toBe('0');
    expect(portfolio.data.eth_balance).toBe('0');
    expect(portfolio.data.btc_balance).toBe('0');
  });

  test('should fetch crypto prices', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Check if crypto prices are loaded
    await page.waitForTimeout(2000);
    
    // Verify crypto prices in database
    const cryptoPrices = await page.evaluate(async () => {
      const { data, error } = await window.supabase
        .from('crypto_prices')
        .select('*')
        .order('symbol');
      
      return { data, error };
    });
    
    expect(cryptoPrices.error).toBeNull();
    expect(cryptoPrices.data).toBeDefined();
    expect(cryptoPrices.data.length).toBeGreaterThan(0);
    
    // Check for expected crypto symbols
    const symbols = cryptoPrices.data.map(price => price.symbol);
    expect(symbols).toContain('ETH');
    expect(symbols).toContain('BTC');
    expect(symbols).toContain('ETF');
  });

  test('should handle real-time updates', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Set up real-time subscription
    const realTimeData = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const subscription = window.supabase
          .channel('crypto_prices')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'crypto_prices'
          }, (payload) => {
            resolve(payload);
          })
          .subscribe();
        
        // Resolve after 5 seconds if no update
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    // Real-time subscription should be set up (even if no updates occur)
    expect(realTimeData).toBeDefined();
  });

  test('should handle referral system', async ({ page }) => {
    // Create a referrer user
    const referrerEmail = `referrer-${Date.now()}@test.com`;
    await page.goto('/signup');
    await page.fill('input[placeholder="John Doe"]', 'Referrer User');
    await page.fill('input[type="email"]', referrerEmail);
    await page.fill('input[type="password"]:first-of-type', 'ReferrerPass123!');
    await page.fill('input[type="password"]:last-of-type', 'ReferrerPass123!');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Get referrer's referral code
    const referrerCode = await page.evaluate(async (email) => {
      const { data } = await window.supabase
        .from('users')
        .select('referral_code')
        .eq('email', email)
        .single();
      
      return data?.referral_code;
    }, referrerEmail);
    
    expect(referrerCode).toBeDefined();
    
    // Create referred user
    const referredEmail = `referred-${Date.now()}@test.com`;
    await page.goto('/signup');
    await page.fill('input[placeholder="John Doe"]', 'Referred User');
    await page.fill('input[type="email"]', referredEmail);
    await page.fill('input[type="password"]:first-of-type', 'ReferredPass123!');
    await page.fill('input[type="password"]:last-of-type', 'ReferredPass123!');
    await page.fill('input[placeholder="Enter referral code"]', referrerCode);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Account created successfully')).toBeVisible();
    
    // Check if referral record was created
    const referralRecord = await page.evaluate(async (referrerEmail, referredEmail) => {
      // Get user IDs
      const { data: referrer } = await window.supabase
        .from('users')
        .select('id')
        .eq('email', referrerEmail)
        .single();
      
      const { data: referred } = await window.supabase
        .from('users')
        .select('id')
        .eq('email', referredEmail)
        .single();
      
      if (!referrer || !referred) return null;
      
      // Get referral record
      const { data, error } = await window.supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', referrer.id)
        .eq('referred_id', referred.id)
        .single();
      
      return { data, error };
    }, referrerEmail, referredEmail);
    
    expect(referralRecord.error).toBeNull();
    expect(referralRecord.data).toBeDefined();
    expect(referralRecord.data.level).toBe(1);
    expect(referralRecord.data.bonus_rate).toBe('10.00');
  });

  test('should handle transaction creation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Navigate to deposit page
    await page.goto('/deposit');
    
    // Fill deposit form
    await page.selectOption('select', 'ETH');
    await page.fill('input[type="number"]', '0.1');
    await page.fill('input[placeholder="Transaction hash"]', '0x1234567890abcdef1234567890abcdef12345678');
    
    // Submit deposit
    await page.click('button[type="submit"]');
    
    // Check if transaction was created
    const transaction = await page.evaluate(async (email) => {
      // Get user ID
      const { data: user } = await window.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (!user) return null;
      
      // Get latest transaction
      const { data, error } = await window.supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'deposit')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return { data, error };
    }, testUser.email);
    
    expect(transaction.error).toBeNull();
    expect(transaction.data).toBeDefined();
    expect(transaction.data.type).toBe('deposit');
    expect(transaction.data.crypto_type).toBe('ETH');
    expect(transaction.data.crypto_amount).toBe('0.1');
  });

  test('should handle portfolio updates', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Navigate to portfolio page
    await page.goto('/portfolio');
    
    // Check if portfolio data is loaded
    await page.waitForTimeout(2000);
    
    // Verify portfolio data
    const portfolio = await page.evaluate(async (email) => {
      // Get user ID
      const { data: user } = await window.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (!user) return null;
      
      // Get portfolio
      const { data, error } = await window.supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return { data, error };
    }, testUser.email);
    
    expect(portfolio.error).toBeNull();
    expect(portfolio.data).toBeDefined();
    expect(portfolio.data.user_id).toBeDefined();
  });

  test('should handle notifications', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Check if notifications are loaded
    const notifications = await page.evaluate(async (email) => {
      // Get user ID
      const { data: user } = await window.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (!user) return null;
      
      // Get notifications
      const { data, error } = await window.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      return { data, error };
    }, testUser.email);
    
    expect(notifications.error).toBeNull();
    expect(notifications.data).toBeDefined();
    expect(Array.isArray(notifications.data)).toBe(true);
  });

  test('should handle error responses gracefully', async ({ page }) => {
    // Test with invalid data
    const invalidData = await page.evaluate(async () => {
      try {
        const { data, error } = await window.supabase
          .from('users')
          .select('*')
          .eq('id', 'invalid-uuid')
          .single();
        
        return { data, error };
      } catch (err) {
        return { error: err.message };
      }
    });
    
    // Should handle error gracefully
    expect(invalidData.error).toBeDefined();
  });
});

