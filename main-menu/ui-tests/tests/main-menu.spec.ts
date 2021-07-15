import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should emit a message in a dialog when menu is triggered', async ({
  page,
}) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=Main Menu Example
  await page.click('text=Main Menu Example');

  // Add listener to check alert message
  // > Alert are not capture by the recording
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toEqual(
      'jlab-examples:main-menu has been called from the menu.'
    );

    dialog.dismiss().catch(() => {});
  });

  // Click ul[role="menu"] >> text=Execute jlab-examples:main-menu Command
  await page.click(
    'ul[role="menu"] >> text=Execute jlab-examples:main-menu Command'
  );

  expect(
    logs.filter(
      (s) => s === 'jlab-examples:main-menu has been called from the menu.'
    )
  ).toHaveLength(1);

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
