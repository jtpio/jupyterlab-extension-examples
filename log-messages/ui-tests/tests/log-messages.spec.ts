import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should capture log messages in dedicated panel', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click File menu
  await page.click('text=File');
  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');
  // Click #jp-mainmenu-file-new >> text=Notebook
  await page.click('#jp-mainmenu-file-new >> text=Notebook');
  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Click text=View
  await page.click('text=View');
  // Click ul[role="menu"] >> text=Show Log Console
  await page.click('ul[role="menu"] >> text=Show Log Console');

  // Drag and drop the split to display a bigger log panel.
  const splitHandle = await page.$('div.lm-SplitPanel-handle');
  const splitHandleBBox = await splitHandle.boundingBox();
  await page.mouse.move(
    splitHandleBBox.x + 0.5 * splitHandleBBox.width,
    splitHandleBBox.y + 0.5 + splitHandleBBox.height
  );
  await page.mouse.down();
  await page.mouse.move(
    splitHandleBBox.x + 0.5 * splitHandleBBox.width,
    splitHandleBBox.y + 0.5 + splitHandleBBox.height - 200
  );
  await page.mouse.up();

  // Click text=Log Messages Example
  await page.click('text=Log Messages Example');
  // Click text=Text log message
  await page.click('text=Text log message');

  try {
    await page.waitForSelector('text=Hello world text!!', { timeout: 200 });
    throw new Error('Found unexpected log message.');
  } catch (e) {
    expect(e).not.toBeUndefined();
  }

  // Select debug
  await page.selectOption('[aria-label="Log level"]', 'debug');
  // Click text=Log Messages Example
  await page.click('text=Log Messages Example');
  // Click text=Text log message
  await page.click('text=Text log message');

  expect(await page.waitForSelector('text=Hello world text!!')).toBeTruthy();

  // Click button:has-text("Clear Log")
  await page.click('button:has-text("Clear Log")');

  try {
    await page.waitForSelector('text=Hello world text!!', { timeout: 200 });
    throw new Error('Log messages were not cleared.');
  } catch (e) {
    expect(e).not.toBeUndefined();
  }

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
