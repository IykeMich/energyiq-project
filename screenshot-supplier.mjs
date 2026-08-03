import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1000, height: 950 } });

const scratch = '/private/tmp/claude-501/-Users-mac-Documents-vscode-web/4286092a-db7b-42dd-a865-12c39c174a79/scratchpad';

await page.goto('http://localhost:5177/register/supplier');
await page.waitForSelector('text=Company Name:');
await page.screenshot({ path: `${scratch}/supplier-step1.png` });

// Step 1: Company Information
await page.fill('input[placeholder="e.g Emeka Fuels"]', 'Emeka Fuels Ltd');
await page.fill('input[placeholder="e.g emeka@fuels.com"]', 'company@emekafuels.com');
await page.selectOption('select', { index: 1 });
await page.fill('input[placeholder="RC-12345678"]', 'RC-998877');
await page.click('button:has-text("Next")');

await page.waitForSelector('text=Account Owner');
await page.screenshot({ path: `${scratch}/supplier-step2.png` });

// Step 2: Account Setup
const freshEmail = `supplier-test-${Date.now()}@example.com`;
await page.fill('input[placeholder="Thomas"]', 'Thomas');
await page.fill('input[placeholder="Okeke"]', 'Okeke');
await page.fill('input[placeholder="admin@company.com"]', freshEmail);
await page.fill('input[placeholder="08012345678"]', '08012345678');
await page.fill('input[placeholder="Password"]', 'SuperSecret123!');
await page.fill('input[placeholder="Confirm password"]', 'SuperSecret123!');
await page.click('input[type="checkbox"] >> nth=0');
await page.click('input[type="checkbox"] >> nth=1');

const [initiateResponse] = await Promise.all([
  page.waitForResponse((res) => res.url().includes('/public/auth/register')),
  page.click('button:has-text("Create Account")'),
]);
console.log('INITIATE STATUS:', initiateResponse.status());
console.log('INITIATE BODY:', await initiateResponse.text());

await page.waitForTimeout(1000);
await page.screenshot({ path: `${scratch}/supplier-step3-documents.png` });

console.log('DONE');
await browser.close();
