import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function captureFile(page, htmlFile, prefix) {
  const htmlPath = join(__dirname, htmlFile);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const canvas = page.locator('.canvas');

  // Dark version
  await canvas.screenshot({
    path: join(__dirname, 'images', `${prefix}-dark.png`),
    type: 'png',
  });
  console.log(`OK ${prefix}-dark.png`);

  // Light version
  await page.evaluate(() => document.body.classList.add('light'));
  await page.waitForTimeout(800);
  await canvas.screenshot({
    path: join(__dirname, 'images', `${prefix}-light.png`),
    type: 'png',
  });
  console.log(`OK ${prefix}-light.png`);
}

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1680, height: 940 },
    deviceScaleFactor: 2,
  });

  // English version (default)
  await captureFile(page, 'demo-flow.html', 'demo-flow');

  // Chinese version
  await captureFile(page, 'demo-flow-zh.html', 'demo-flow-zh');

  await browser.close();
}

capture().catch(console.error);
