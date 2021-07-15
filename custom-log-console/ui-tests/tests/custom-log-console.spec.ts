import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a log panel and filter message depending on the log level.', async ({
  page,
}) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=Log Console Example
  await page.click('text=Log Console Example');

  // Click ul[role="menu"] >> text=Custom Log Console
  await page.click('ul[role="menu"] >> text=Custom Log Console');

  // Click div[role="main"] >> text=Log: custom-log-console
  expect(
    await page.waitForSelector(
      'div[role="main"] >> text=Log: custom-log-console'
    )
  ).toBeTruthy();

  // Click text=Log Console Example menu
  await page.click('text=Log Console Example');
  // Click text=HTML log message
  await page.click('text=HTML log message');

  expect(await page.waitForSelector('text=Hello world HTML!!')).toBeTruthy();

  // Click text=Log Console Example
  await page.click('text=Log Console Example');
  // Click text=Text log message
  await page.click('text=Text log message');

  expect(await page.waitForSelector('text=Hello world text!!')).toBeTruthy();

  // Click text=Log Console Example
  await page.click('text=Log Console Example');
  // Click text=Output log message
  await page.click('text=Output log message');

  expect(
    await page.waitForSelector('text=Hello world nbformat!!')
  ).toBeTruthy();

  // Click button:has-text("Add Checkpoint")
  await page.click('button:has-text("Add Checkpoint")');

  expect(await page.waitForSelector('hr')).toBeTruthy();

  await page.click('button:has-text("Clear Log")');
  await page.waitForSelector('text=No log messages.');

  // Select warning
  await page.selectOption('[aria-label="Log level"]', 'warning');

  // Click text=Log Console Example
  await page.click('text=Log Console Example');
  // Click text=Output log message
  await page.click('text=Output log message');

  expect(
    await page.waitForSelector('text=Hello world nbformat!!')
  ).toBeTruthy();

  // Click text=Log Console Example
  await page.click('text=Log Console Example');
  // Click text=HTML log message
  await page.click('text=HTML log message');

  try {
    await page.waitForSelector('text=Hello world HTML!!', {
      state: 'attached',
      timeout: 200,
    });
    throw new Error('HTML message is not filtered.');
  } catch (e) {
    expect(e).toBeTruthy();
  }

  // Select debug
  await page.selectOption('[aria-label="Log level"]', 'debug');

  // Click text=Log Console Example
  await page.click('text=Log Console Example');
  // Click text=HTML log message
  await page.click('text=HTML log message');

  expect(await page.waitForSelector('text=Hello world HTML!!')).toBeTruthy();

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
