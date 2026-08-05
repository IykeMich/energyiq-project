import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:5173/demo/products/categories', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Try to open the Add Category modal
const addButton = page.getByRole('button', { name: /add category/i }).first();
if (await addButton.count()) {
  await addButton.click();
  await page.waitForTimeout(500);
}

await page.screenshot({ path: '/private/tmp/claude-501/-Users-mac-Documents-vscode-web/5bbc6c9f-bb20-4416-a72b-ab8d34767d00/scratchpad/category-modal.png' });

await browser.close();
