import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
await page.goto('https://registrosf2.stage.twygoead.com/users/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const html = await page.evaluate(() => {
  return [...document.querySelectorAll('input')].map(i => ({id: i.id, name: i.name, type: i.type, value: i.value}));
});
console.log(JSON.stringify(html, null, 2));
await browser.close();
