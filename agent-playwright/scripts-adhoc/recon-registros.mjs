import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-massa-mensagens/recon';
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(...a);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const page = await ctx.newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
const WHICH = process.env.TRY_WHICH || 'RECERTIFICACAO';
const EMAIL = process.env[`TWYGO_STAGING_${WHICH}_EMAIL`];
const PASSWORD = process.env[`TWYGO_STAGING_${WHICH}_PASSWORD`];
console.log('[login] tentando', WHICH, EMAIL, '| pass len:', (PASSWORD || '').length);
await page.fill('#user_email', EMAIL);
await page.fill('#user_password', PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(5000);
log('[login] url apos submit:', page.url());
await page.screenshot({ path: `${OUT}/00-pos-login.png` });

await page.goto(`${BASE}/o/${ORG}/dashboard`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
log('[dashboard] url:', page.url(), '| title:', await page.title());
await page.screenshot({ path: `${OUT}/01-dashboard.png` });

// tentar expandir Aprendizagem e achar link Registros
const learning = page.locator('#menu a#learning, #menu #learning');
if (await learning.count().catch(() => 0)) {
  await learning.first().dispatchEvent('click').catch(() => {});
  await page.waitForTimeout(1500);
}
await page.screenshot({ path: `${OUT}/02-menu-aprendizagem.png` });

const links = await page.evaluate(() => {
  return [...document.querySelectorAll('#menu a')].map((a) => ({
    id: a.id, text: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href'),
  })).filter((l) => l.text);
});
log('[menu links]', JSON.stringify(links, null, 2));

await browser.close();
