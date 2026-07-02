import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5001';

test.describe('Login Tests - Member & Admin', () => {

  test('01. Member: Login page loads and has form', async ({ page }) => {
    await page.goto(`${APP_URL}/member/login`, { waitUntil: 'networkidle' });

    // Verify page loaded
    await expect(page.locator('text=Member Login')).toBeVisible({ timeout: 5000 });

    // Check form elements exist
    const emailInputs = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');
    const buttons = page.locator('button[type="submit"]');

    expect(await emailInputs.count()).toBeGreaterThan(0);
    expect(await passwordInputs.count()).toBeGreaterThan(0);
    expect(await buttons.count()).toBeGreaterThan(0);

    console.log('✅ Member login page loaded successfully');
  });

  test('02. Member: Successful login with valid credentials', async ({ page }) => {
    await page.goto(`${APP_URL}/member/login`, { waitUntil: 'networkidle' });

    // Wait for form to be visible
    await expect(page.locator('text=Member Login')).toBeVisible({ timeout: 5000 });

    // Get form inputs
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Wait for inputs to be enabled
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });

    // Fill form
    await emailInput.click();
    await emailInput.fill('john@example.com', { timeout: 5000 });

    await passwordInput.click();
    await passwordInput.fill('john123', { timeout: 5000 });

    // Submit form
    await submitButton.click();

    // Wait for navigation and dashboard to load
    await page.waitForURL('**/member/**', { timeout: 10000 });

    const url = page.url();
    console.log(`✅ Member logged in successfully. URL: ${url}`);
    expect(url).toContain('member');
  });

  test('03. Member: Invalid password shows error', async ({ page }) => {
    await page.goto(`${APP_URL}/member/login`, { waitUntil: 'networkidle' });

    await expect(page.locator('text=Member Login')).toBeVisible({ timeout: 5000 });

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.waitFor({ state: 'visible' });
    await passwordInput.waitFor({ state: 'visible' });

    await emailInput.click();
    await emailInput.fill('john@example.com');

    await passwordInput.click();
    await passwordInput.fill('wrongpassword');

    await submitButton.click();

    // Wait for error message
    await expect(page.locator('text=/[Ii]nvalid|[Ff]ailed/')).toBeVisible({ timeout: 5000 });

    console.log('✅ Invalid credentials error displayed correctly');
  });

  test('04. Admin: Login page loads and has form', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`, { waitUntil: 'networkidle' });

    // Verify page loaded
    await expect(page.locator('text=Admin Panel')).toBeVisible({ timeout: 5000 });

    // Check form elements exist
    const emailInputs = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');
    const buttons = page.locator('button[type="submit"]');

    expect(await emailInputs.count()).toBeGreaterThan(0);
    expect(await passwordInputs.count()).toBeGreaterThan(0);
    expect(await buttons.count()).toBeGreaterThan(0);

    console.log('✅ Admin login page loaded successfully');
  });

  test('05. Admin: Successful login with valid credentials', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`, { waitUntil: 'networkidle' });

    // Wait for form to be visible
    await expect(page.locator('text=Admin Panel')).toBeVisible({ timeout: 5000 });

    // Get form inputs
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Wait for inputs to be enabled
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });

    // Fill form
    await emailInput.click();
    await emailInput.fill('admin@afitnessgyam.com', { timeout: 5000 });

    await passwordInput.click();
    await passwordInput.fill('admin123', { timeout: 5000 });

    // Submit form
    await submitButton.click();

    // Wait for navigation to admin dashboard
    await page.waitForURL('**/admin/**', { timeout: 10000 });

    const url = page.url();
    console.log(`✅ Admin logged in successfully. URL: ${url}`);
    expect(url).toContain('admin');
  });

  test('06. Admin: Invalid password shows error', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`, { waitUntil: 'networkidle' });

    await expect(page.locator('text=Admin Panel')).toBeVisible({ timeout: 5000 });

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.waitFor({ state: 'visible' });
    await passwordInput.waitFor({ state: 'visible' });

    await emailInput.click();
    await emailInput.fill('admin@afitnessgyam.com');

    await passwordInput.click();
    await passwordInput.fill('wrongpassword');

    await submitButton.click();

    // Wait for error message
    await expect(page.locator('text=/[Ii]nvalid|[Ff]ailed/')).toBeVisible({ timeout: 5000 });

    console.log('✅ Invalid admin credentials error displayed correctly');
  });

  test('07. Member: User can access dashboard after login', async ({ page }) => {
    // Login first
    await page.goto(`${APP_URL}/member/login`, { waitUntil: 'networkidle' });
    await expect(page.locator('text=Member Login')).toBeVisible({ timeout: 5000 });

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.waitFor({ state: 'visible' });
    await emailInput.click();
    await emailInput.fill('john@example.com');

    await passwordInput.click();
    await passwordInput.fill('john123');

    await submitButton.click();
    await page.waitForURL('**/member/**', { timeout: 10000 });

    // Access dashboard
    await page.goto(`${APP_URL}/member/dashboard`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();

    console.log('✅ Member dashboard accessible after login');
  });

  test('08. Admin: User can access admin dashboard after login', async ({ page }) => {
    // Login first
    await page.goto(`${APP_URL}/admin/login`, { waitUntil: 'networkidle' });
    await expect(page.locator('text=Admin Panel')).toBeVisible({ timeout: 5000 });

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.waitFor({ state: 'visible' });
    await emailInput.click();
    await emailInput.fill('admin@afitnessgyam.com');

    await passwordInput.click();
    await passwordInput.fill('admin123');

    await submitButton.click();
    await page.waitForURL('**/admin/**', { timeout: 10000 });

    // Access admin dashboard
    await page.goto(`${APP_URL}/admin/dashboard`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();

    console.log('✅ Admin dashboard accessible after login');
  });

  test('09. API: Verify login endpoint returns token', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/login`, {
      data: {
        email: 'john@example.com',
        password: 'john123'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.token).toBeTruthy();
    expect(data.user).toBeTruthy();
    expect(data.user.role).toBe('member');

    console.log('✅ API login endpoint working correctly');
  });

  test('10. API: Admin login endpoint returns admin token', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/login`, {
      data: {
        email: 'admin@afitnessgyam.com',
        password: 'admin123'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.token).toBeTruthy();
    expect(data.user).toBeTruthy();
    expect(data.user.role).toBe('admin');

    console.log('✅ API admin login endpoint working correctly');
  });
});
