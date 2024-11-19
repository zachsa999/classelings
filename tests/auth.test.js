import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow signup and login with valid credentials', async ({ page }) => {
        // Test signup
        await page.goto('/signup');
        await page.fill('input[type="text"]', 'Test User');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.fill('input#confirmPassword', 'password123');
        await page.click('button[type="submit"]');

        // Should redirect to login page
        await expect(page).toHaveURL(/.*login/);

        // Test login
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Should redirect to protected page
        await expect(page).toHaveURL(/.*protected/);
        await expect(page.locator('h1')).toContainText('Welcome');
    });

    test('should show error message for invalid login', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpass');
        await page.click('button[type="submit"]');

        await expect(page.locator('.error')).toBeVisible();
        await expect(page.locator('.error')).toContainText('Invalid credentials');
    });

    test('should redirect to login page when accessing protected route', async ({ page }) => {
        await page.goto('/protected');
        await expect(page).toHaveURL(/.*login/);
    });
}); 