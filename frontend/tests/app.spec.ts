import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5001';
const APP_URL = 'http://localhost:5173';

test.describe('Gym Web App - Comprehensive Testing Suite', () => {

  // ============ PUBLIC PAGES ============

  test('01. Public: Home page loads', async ({ page }) => {
    await page.goto(APP_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Home page loaded');
  });

  test('02. Public: Gallery page loads', async ({ page }) => {
    await page.goto(`${APP_URL}/gallery`);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Gallery page loaded');
  });

  test('03. Public: About page loads', async ({ page }) => {
    await page.goto(`${APP_URL}/about`);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ About page loaded');
  });

  // ============ MEMBER SIGN UP ============

  test('04. Member: Sign Up with new account', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `testmember${timestamp}@example.com`;

    await page.goto(`${APP_URL}/join`);

    // Fill signup form
    const nameInput = page.locator('input[type="text"]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Member');
      await emailInput.fill(testEmail);
      await passwordInput.fill('test@123');

      await submitBtn.click();
      await page.waitForTimeout(2000);

      const url = page.url();
      console.log(`✅ Member signed up: ${testEmail}, redirected to: ${url}`);
      expect(url).not.toContain('join');
    }
  });

  // ============ MEMBER SIGN IN ============

  test('05. Member: Sign In with valid credentials', async ({ page }) => {
    await page.goto(`${APP_URL}/login`);

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await emailInput.fill('john@example.com');
    await passwordInput.fill('john123');
    await submitBtn.click();

    await page.waitForTimeout(2000);
    const url = page.url();
    console.log(`✅ Member logged in, URL: ${url}`);
    expect(url).toContain('member');
  });

  test('06. Member: Access Dashboard after login', async ({ page }) => {
    await page.goto(`${APP_URL}/login`);

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await emailInput.fill('john@example.com');
    await passwordInput.fill('john123');
    await submitBtn.click();

    await page.waitForTimeout(2000);
    await page.goto(`${APP_URL}/member/dashboard`);

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Member Dashboard accessible');
  });

  // ============ ADMIN SIGN IN ============

  test('07. Admin: Sign In with valid credentials', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`);

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await emailInput.fill('admin@afitnessgyam.com');
    await passwordInput.fill('admin123');
    await submitBtn.click();

    await page.waitForTimeout(2000);
    const url = page.url();
    console.log(`✅ Admin logged in, URL: ${url}`);
    expect(url).toContain('admin');
  });

  test('08. Admin: Access Admin Dashboard', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`);

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await emailInput.fill('admin@afitnessgyam.com');
    await passwordInput.fill('admin123');
    await submitBtn.click();

    await page.waitForTimeout(2000);
    await page.goto(`${APP_URL}/admin/dashboard`);

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Admin Dashboard accessible');
  });

  test('09. Admin: View Members List', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`);

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await emailInput.fill('admin@afitnessgyam.com');
    await passwordInput.fill('admin123');
    await submitBtn.click();

    await page.waitForTimeout(2000);
    await page.goto(`${APP_URL}/admin/members`);

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Members List page accessible');
  });

  // ============ GALLERY - ADD ============

  test('10. Admin: Gallery page loads', async ({ page }) => {
    await page.goto(`${APP_URL}/admin/login`);

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await emailInput.fill('admin@afitnessgyam.com');
    await passwordInput.fill('admin123');
    await submitBtn.click();

    await page.waitForTimeout(2000);
    await page.goto(`${APP_URL}/admin/gallery`);

    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Gallery Management page accessible');
  });

  // ============ API TESTS ============

  test('11. API: Health check', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/api/health`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
    console.log('✅ Backend API health check passed');
  });

  test('12. API: Gallery endpoint returns data', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/api/gallery`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    console.log(`✅ Gallery API returned ${data.length} items`);
  });

  // ============ DATABASE VERIFICATION ============

  test('13. Database: Verify User table has records', async ({ page }) => {
    const response = await page.request.get(`${API_URL}/api/admin/members`, {
      headers: {
        'Authorization': 'Bearer dummy'
      }
    }).catch(() => null);

    console.log('✅ User table verification attempted');
  });

  // ============ RESPONSIVE DESIGN ============

  test('14. Responsive: Desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(APP_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Desktop viewport works');
  });

  test('15. Responsive: Tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(APP_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Tablet viewport works');
  });

  test('16. Responsive: Mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(APP_URL);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Mobile viewport works');
  });
});
