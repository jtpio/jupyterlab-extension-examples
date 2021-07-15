import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a new panel with a react component', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=React Widget
  await page.click('text=React Widget');

  // Click text=You clicked 0 times!
  expect(await page.waitForSelector('text=You clicked 0 times!')).toBeTruthy();

  // Click text=Increment
  await page.click('text=Increment');
  // Click text=Increment
  await page.click('text=Increment');
  // Click text=Increment
  await page.click('text=Increment');
  // Click text=Increment
  await page.click('text=Increment');

  // Click text=You clicked 4 times!
  expect(await page.waitForSelector('text=You clicked 4 times!')).toBeTruthy();

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
