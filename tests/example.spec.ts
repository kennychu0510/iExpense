import { expect, test } from '@playwright/test';

test('add expense flow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/iExpense/);
  await expect(page.getByTestId('add-expense')).toBeVisible();
  await page.getByTestId('add-expense').click();
  await expect(page.getByTestId('add-expense-dialog')).toBeVisible();
  await page.locator('#expense').fill('Shopping');
  const people = [
    {
      name: 'john',
      amount: 300,
    },
    {
      name: 'same',
      amount: 0,
    },
    {
      name: 'david',
      amount: 0,
    },
  ];
  for (const person of people) {
    await page.locator('#person').fill(person.name);
    await page.locator('#expense-amount').fill(String(person.amount));
    await page.getByTestId('add-person').click();
  }
  await page.getByTestId('save-expense').click();

  await expect(page.getByTestId('expense-table')).toBeVisible();
});
