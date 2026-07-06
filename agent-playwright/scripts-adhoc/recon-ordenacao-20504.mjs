import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504/recon';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 }, locale: 'pt-BR' })).newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);
console.log('[login] url pos submit:', page.url());
await page.screenshot({ path: `${OUT}/00-pos-login.png` });

await page.goto(`${BASE}/o/${ORG}/records`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
console.log('[records] url:', page.url(), '| title:', await page.title());
await page.screenshot({ path: `${OUT}/01-records.png`, fullPage: true });

// dump headers
const headers = await page.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  const ths = [...table.querySelectorAll('thead th')];
  return ths.map((th, i) => ({ i, text: th.textContent.trim().replace(/\s+/g, ' ') }));
});
console.log('[headers]', JSON.stringify(headers, null, 2));

// dump rows
const rows = await page.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  const trs = [...table.querySelectorAll('tbody tr')];
  return trs.map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent.trim().replace(/\s+/g, ' ')));
});
console.log('[rows count]', rows ? rows.length : 0);
console.log('[rows]', JSON.stringify(rows, null, 2));

// check pagination
const paginationText = await page.evaluate(() => {
  const el = document.querySelector('[class*="pagination"], nav[aria-label*="agina" i]');
  return el ? el.textContent.trim().replace(/\s+/g, ' ') : null;
});
console.log('[pagination]', paginationText);

await browser.close();
