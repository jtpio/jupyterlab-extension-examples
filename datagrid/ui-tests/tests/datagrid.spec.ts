import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a datagrid panel', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=DataGrid Example
  await page.click('text=DataGrid Example');
  // Click ul[role="menu"] >> text=Open a Datagrid
  await page.click('ul[role="menu"] >> text=Open a Datagrid');

  expect(
    await page.waitForSelector('div[role="main"] >> text=Datagrid Example View')
  ).toBeTruthy();

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot('datagrid-example.png');

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
