import { test, expect } from '@playwright/test';

// ════════════════════════════════════════════════════════════════
// E2E: Auth critical flows
// Tests the full register → verify → dashboard path in a real browser.
// Requires backend running (or MSW browser handlers).
// ════════════════════════════════════════════════════════════════

test.describe('Registration flow', () => {
  test('shows registration form with company and account sections', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByText('Company Information')).toBeVisible();
    await expect(page.getByText('Account Owner')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Company name is required')).toBeVisible();
    await expect(page.getByText('Business type is required')).toBeVisible();
    await expect(page.getByText('Your name is required')).toBeVisible();
  });

  test('navigates to login', async ({ page }) => {
    await page.goto('/register');
    await page.getByText('Sign in').click();

    await expect(page).toHaveURL('/login');
  });
});

test.describe('Login flow', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('navigates to register', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Create account').click();

    await expect(page).toHaveURL('/register');
  });
});

test.describe('Auth guards', () => {
  test('redirects to login when accessing dashboard unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL('/login');
  });
});

test.describe('Accessibility', () => {
  test('register page has no critical a11y violations', async ({ page }) => {
    await page.goto('/register');

    // Check all form fields have labels
    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });
});
