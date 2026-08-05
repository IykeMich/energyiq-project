import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto('http://localhost:5174/demo/products', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('text=Product Catalog', { timeout: 20000 });
await page.waitForTimeout(1500);

await page.screenshot({
  path: '/private/tmp/claude-501/-Users-mac-Documents-vscode-web/5a741426-e0fb-4517-815a-f333fbb429f5/scratchpad/products-loaded.png',
  fullPage: true,
});

console.log('PRODUCTS_CONSOLE_ERRORS:', JSON.stringify(errors));

const ordersErrors = [];
page.removeAllListeners('console');
page.removeAllListeners('pageerror');
page.on('console', (msg) => {
  if (msg.type() === 'error') ordersErrors.push(msg.text());
});
page.on('pageerror', (err) => ordersErrors.push(String(err)));

await page.goto('http://localhost:5174/demo/orders', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.screenshot({
  path: '/private/tmp/claude-501/-Users-mac-Documents-vscode-web/5a741426-e0fb-4517-815a-f333fbb429f5/scratchpad/orders-loaded.png',
  fullPage: true,
});
console.log('ORDERS_CONSOLE_ERRORS:', JSON.stringify(ordersErrors));

await browser.close();
