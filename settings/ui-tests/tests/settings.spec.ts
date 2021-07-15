import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should emit console message', async ({ page }) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  expect(
    logs.filter(
      (s) =>
        s ===
        "Settings Example extension: Limit is set to '25' and flag to 'false'"
    )
  ).toHaveLength(1);

  // Click :nth-match(:text("Settings"), 2)
  await page.click(':nth-match(:text("Settings"), 2)');

  // Click ul[role="menu"] >> text=Advanced Settings Editor
  await page.click('ul[role="menu"] >> text=Advanced Settings Editor');

  // Click span:has-text("Settings Example")
  await page.click('span:has-text("Settings Example")');

  // Click li[role="menuitem"]:has-text("Settings Example")
  await page.click('li[role="menuitem"]:has-text("Settings Example")');

  page.once('console', (message) => {
    expect(message.text()).toEqual(
      "Settings Example extension: Limit is set to '26' and flag to 'true'"
    );
  });

  // Click text=Toggle Flag and Increment Limit
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toEqual(
      "Settings Example extension: Limit is set to '26' and flag to 'true'"
    );
    dialog.dismiss().catch(() => {});
  });
  await page.click('text=Toggle Flag and Increment Limit');

  // Click li[role="menuitem"]:has-text("Settings Example")
  await page.click('li[role="menuitem"]:has-text("Settings Example")');
  expect(await page.waitForSelector('ul[role="menu"] svg')).toBeTruthy();

  // // Double click text=26
  // // const handle = await page.$('text=26');
  // // await handle.click();
  // // await handle.press('Control+a');
  // await page.press('text=User Preferences >> textarea', 'Control+a');
  // await page.press('text=User Preferences >> textarea', 'Delete');

  // // await page.press('.jp-SettingsRawEditor-user', 'Control+a');
  // // await page.press('.jp-SettingsRawEditor-user', 'Delete');
  // await page.fill(
  //   '.jp-SettingsRawEditor-user textarea',
  //   // 'text=User Preferences >> textarea',
  //   '{"flag": true, "limit": 27}'
  // );

  // page.once('console', (message) => {
  //   expect(message.text()).toEqual(
  //     "Settings Example extension: Limit is set to '27' and flag to 'true'"
  //   );
  // });

  // // Click text=Toggle Flag and Increment Limit
  // page.once('dialog', (dialog) => {
  //   expect(dialog.message()).toEqual(
  //     "Settings Example extension: Limit is set to '27' and flag to 'true'"
  //   );
  //   dialog.dismiss().catch(() => {});
  // });
  // // Click button:has-text("Save User Settings")
  // await page.click('button:has-text("Save User Settings")');

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
