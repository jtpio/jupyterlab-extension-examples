import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a panel connected to a notebook kernel', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Install pandas through console
  await page.click('text=File');
  await page.click('ul[role="menu"] >> text=New');
  await page.click('#jp-mainmenu-file-new >> text=Console');
  await page.click('button:has-text("Select")');

  await page.fill(
    'text=[ ]:xxxxxxxxxx ​ >> textarea',
    '!mamba install -qy pandas'
  );
  await page.click('text=Run');
  await page.click('ul[role="menu"] >> text=Run Cell');
  await page.waitForSelector('text=Executing transaction: ...working... done');

  // Click text=File
  await page.click('text=File');

  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');

  // Click #jp-mainmenu-file-new >> text=Notebook
  await page.click('#jp-mainmenu-file-new >> text=Notebook');

  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Click text=eyes
  await page.fill(
    'text=[ ]: ​ >> textarea',
    'import numpy\nimport pandas\ndf = pandas.DataFrame(numpy.eye(5))'
  );

  // Click text=Run
  await page.click('text=Run');

  // Click Run selected cell
  await page.click('ul[role="menu"] >> text=Run Selected Cells');

  // Click text=Kernel Output
  await page.click('text=Kernel Output');

  // Click ul[role="menu"] >> text=Open the Kernel Output Panel
  await page.click('ul[role="menu"] >> text=Open the Kernel Output Panel');

  // Select Notebook kernel
  await page.selectOption('.jp-Dialog-body >> select', {
    label: 'Untitled.ipynb',
  });

  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Emulate drag and drop to place the panel next to the notebook
  const viewerHandle = await page.$(
    'div[role="main"] >> text=Kernel Output Example View'
  );
  const panelHandle = await page.$('#kernel-output-panel div');
  const viewerBBox = await viewerHandle.boundingBox();
  const panelBBox = await panelHandle.boundingBox();

  await page.mouse.move(
    viewerBBox.x + 0.5 * viewerBBox.width,
    viewerBBox.y + 0.5 * viewerBBox.height
  );
  await page.mouse.down();
  await page.mouse.move(
    panelBBox.x + 0.8 * panelBBox.width,
    panelBBox.y + 0.5 * panelBBox.height
  );
  await page.mouse.up();

  // Click div[role="main"] >> text=Kernel Output Example View
  await page.click('div[role="main"] >> text=Kernel Output Example View');

  // Click text=Kernel Output
  await page.click('text=Kernel Output');

  // Click ul[role="menu"] >> text=Contact Kernel and Execute Code
  await page.click('ul[role="menu"] >> text=Contact Kernel and Execute Code');

  // Fill [placeholder="Statement to execute"]
  await page.fill('[placeholder="Statement to execute"]', 'df');

  // Click button:has-text("Execute")
  await page.click('button:has-text("Execute")');

  expect(await page.waitForSelector('th')).toBeTruthy();

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot(
    'kernel-messaging-example.png'
  );

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
