import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should emit console message when called from palette', async ({
  page,
}) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=View
  await page.click('text=View');
  // Click text=Activate Command Palette
  await page.click('text=Activate Command Palette');
  // Fill [aria-label="Command Palette Section"] [placeholder="SEARCH"]
  await page.fill(
    '[aria-label="Command Palette Section"] [placeholder="SEARCH"]',
    'Execute'
  );
  // Click text=Execute jlab-examples:command-palette Command
  await page.click('text=Execute jlab-examples:command-palette Command');

  expect(
    logs.filter((s) =>
      s.startsWith('jlab-examples:command-palette has been called from palette')
    )
  ).toHaveLength(1);

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
