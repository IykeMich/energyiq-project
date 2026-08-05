import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

const errors = [];
page.on('console', (msg) => errors.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => errors.push(`[pageerror] ${String(err)}`));
page.on('requestfailed', (req) => errors.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`));

await page.goto('http://localhost:5174/demo/products', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

await page.screenshot({
  path: '/private/tmp/claude-501/-Users-mac-Documents-vscode-web/5a741426-e0fb-4517-815a-f333fbb429f5/scratchpad/debug.png',
  fullPage: true,
});

console.log('URL:', page.url());
console.log('TITLE:', await page.title());
console.log('BODY_TEXT_SNIPPET:', (await page.textContent('body'))?.slice(0, 500));
console.log('LOG:', JSON.stringify(errors, null, 2));

await browser.close();
