import { test, expect } from '@playwright/test';

test('Signup Validation', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Register').click();
  await expect(page).toHaveTitle('Register');
  const locator = page.getByRole('button', { name: 'Submit' });
  await expect(locator).toBeDisabled();
  await page.getByRole('link', { name: ' Register' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Levon');
  await page.getByRole('textbox', { name: 'Email', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Email', exact: true })
    .fill('levon@foo.bar');
  await page.getByRole('textbox', { name: 'Confirm Email' }).click();
  await page
    .getByRole('textbox', { name: 'Confirm Email' })
    .fill('levon@foo.bar');
  await page.locator('#password').getByRole('textbox').click();
  await page.locator('#password').getByRole('textbox').fill('woosh22');
  await page.getByText('Enter a password').click();

  await page.locator('#confirmPassword').getByRole('textbox').click();
  await page.locator('#confirmPassword').getByRole('textbox').fill('woosh21');
  await expect(locator).toBeDisabled();

  await page.locator('#confirmPassword').getByRole('textbox').click();
  await page.locator('#confirmPassword').getByRole('textbox').fill('woosh22');
  await page.getByText('Enter a password').click();
  await expect(locator).toBeEnabled();
});
