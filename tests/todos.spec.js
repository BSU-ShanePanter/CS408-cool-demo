import { test, expect } from '@playwright/test';


// Run tests in serial to avoid database conflicts
test.describe.configure({ mode: 'serial' });

test.describe('Todo App', () => {

  test.beforeEach(async ({ request }) => {
    // Clear the database file to ensure clean state
    await request.post('/test-api/clear-database');
  });


  test('should display the todo app page', async ({ page }) => {
    await page.goto('/todos');
    await expect(page).toHaveTitle(/Todo App/);
    await expect(page.locator('h1')).toContainText('Todo App');
  });

  test('should show back to landing link', async ({ page }) => {
    await page.goto('/todos');
    const backLink = page.locator('a:has-text("Back to Landing")');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should show empty state when no todos', async ({ page }) => {

    // Reload page to see empty state
    await page.goto('/todos');

    // Database is empty, so should show empty state
    await expect(page.locator('.alert-info')).toContainText('No tasks yet');
  });


  test('should create a new todo', async ({ page }) => {
    await page.goto('/todos');
    const taskText = `Test Task ${Date.now()}`;

    // Fill in the task input
    await page.fill('input[name="task"]', taskText);

    // Submit the form
    await page.click('button[type="submit"]:has-text("Create Task")');

    // Wait for navigation back to page
    await page.waitForURL('/todos');

    // Verify the task appears in the list
    await expect(page.locator('.task-text')).toContainText(taskText);
    await expect(page.locator('.badge-pending')).toBeVisible();

  });

  test('should delete a todo', async ({ page }) => {
    await page.goto('/todos');
    const taskText = `Delete Test ${Date.now()}`;

    // Create a task first
    await page.fill('input[name="task"]', taskText);
    await page.click('button[type="submit"]:has-text("Create Task")');
    await page.waitForURL('/todos');

    // Find and click the delete button for this task
    const todoItem = page.locator('.todo-item', { hasText: taskText });
    await expect(todoItem).toBeVisible();

    await todoItem.locator('button:has-text("Delete")').click();

    // Wait for navigation
    await page.waitForURL('/todos');

    // Verify the task is gone
    await expect(page.locator('.task-text', { hasText: taskText })).not.toBeVisible();
  });



  test('should display task status badges correctly', async ({ page }) => {
    await page.goto('/todos');
    const taskText = `Badge Test ${Date.now()}`;

    // Create a task
    await page.fill('input[name="task"]', taskText);
    await page.click('button[type="submit"]:has-text("Create Task")');
    await page.waitForURL('/todos');

    // Check for pending badge
    const todoItem = page.locator('.todo-item', { hasText: taskText });
    const pendingBadge = todoItem.locator('.badge-pending');
    await expect(pendingBadge).toBeVisible();
    await expect(pendingBadge).toContainText('Pending');
  });

  test('should require task input', async ({ page }) => {
    await page.goto('/todos');
    const submitButton = page.locator('button[type="submit"]:has-text("Create Task")');

    // Try to submit without filling input
    await submitButton.click();

    // Browser validation should prevent submission
    // The page should still be on /todos (not navigated)
    await expect(page).toHaveURL('/todos');
  });

  test('should navigate back to landing page', async ({ page }) => {
    await page.goto('/todos');
    const backLink = page.locator('a:has-text("Back to Landing")');
    await backLink.click();

    await page.waitForURL('/');
    await expect(page.locator('h1')).toContainText('CS408 Simple EC2 Example');
  });
});
