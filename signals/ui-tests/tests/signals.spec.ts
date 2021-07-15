import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should emit console message and alert when button is pressed', async ({
  page,
}) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=Signal Example
  await page.click('text=Signal Example');

  // Click ul[role="menu"] >> text=Open the Signal Example Panel
  await page.click('ul[role="menu"] >> text=Open the Signal Example Panel');

  // Click text=Click me
  page.once('console', (message) => {
    expect(
      message.text().startsWith('Hey, a Signal has been received from')
    ).toEqual(true);
  });
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toEqual(
      'The big red button has been clicked 1 times.'
    );
    dialog.dismiss().catch(() => {});
  });
  await page.click('text=Click me');

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
