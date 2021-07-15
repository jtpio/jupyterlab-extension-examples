import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should have new context menu for example files', async ({ page }) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click li[role="menuitem"]:has-text("File")
  await page.click('li[role="menuitem"]:has-text("File")');

  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');

  // Click #jp-mainmenu-file-new >> text=Text File
  await page.click('#jp-mainmenu-file-new >> text=Text File');

  // Click [aria-label="File Browser Section"] >> text=untitled.txt
  await page.click('[aria-label="File Browser Section"] >> text=untitled.txt', {
    button: 'right',
  });

  // Click text=Rename
  await page.click('text=Rename');

  // Fill file browser >> input
  await page.fill('input.jp-DirListing-editor', 'test.example');

  // Press Enter
  await page.press('input.jp-DirListing-editor', 'Enter');

  // Click [aria-label="File Browser Section"] >> text=test.example
  await page.click('[aria-label="File Browser Section"] >> text=test.example', {
    button: 'right',
  });

  // Click ul[role="menu"] >> text=Example
  await page.click('ul[role="menu"] >> text=Example');

  // Click text=Path: test.example
  expect(await page.waitForSelector('text=Path: test.example')).toBeTruthy();

  // Click button:has-text("OK")
  await page.click('button:has-text("OK")');

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
