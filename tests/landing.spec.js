import { test, expect } from '@playwright/test';



test.describe('Landing Page', () => {

  test('should display landing page with demo cards', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Hello World/);
    await expect(page.locator('h1')).toContainText('CS408 Simple EC2 Example');

    // Check for Todo App card
    const todoCard = page.locator('.card', { hasText: 'Todo App' });
    await expect(todoCard).toBeVisible();
    await expect(todoCard.locator('a[href="/todos"]')).toBeVisible();

    // Check for Asteroids Game card
    const gameCard = page.locator('.card', { hasText: 'Asteroids Game' });
    await expect(gameCard).toBeVisible();
    await expect(gameCard.locator('a[href="/asteroids"]')).toBeVisible();
  });

  test('should display todo statistics', async ({ page }) => {
    await page.goto('/');

    // Check that stats display expected values from seeded data
    await expect(page.locator('text=Total tasks:')).toBeVisible();
    await expect(page.locator('text=Completed:')).toBeVisible();
    await expect(page.locator('text=Pending:')).toBeVisible();
  });

  test('should navigate to todo app from landing', async ({ page }) => {
    await page.goto('/');

    await page.click('a[href="/todos"]');
    await page.waitForURL('/todos');

    await expect(page.locator('h1')).toContainText('Todo App');
  });

  test('should navigate to asteroids game from landing', async ({ page }) => {
    await page.goto('/');

    await page.click('a[href="/asteroids"]');
    await page.waitForURL('/asteroids');

    await expect(page.locator('h1')).toContainText('ASTEROIDS');
  });
});
