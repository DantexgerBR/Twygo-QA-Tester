import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' })).newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);

await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const npsLater = page.getByRole('button', { name: 'Pergunte depois' });
if (await npsLater.count().catch(() => 0)) { await npsLater.click().catch(() => {}); await page.waitForTimeout(1000); }

await page.waitForSelector('table tbody tr');
await page.waitForFunction(() => document.querySelectorAll('table tbody tr').length > 1, { timeout: 10000 });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/02-antes-sort-carga-horaria.png`, fullPage: true });

const headerBtn = page.locator('th', { hasText: 'Carga horária' }).first();
await headerBtn.click();
await page.waitForFunction(() => !document.querySelector('.chakra-spinner, [class*="spinner"]'), { timeout: 10000 }).catch(() => {});
await page.waitForSelector('table tbody tr');
await page.waitForFunction(() => document.querySelectorAll('table tbody tr').length > 1, { timeout: 10000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/03-carga-horaria-1o-clique.png`, fullPage: true });

await headerBtn.click();
await page.waitForFunction(() => !document.querySelector('.chakra-spinner, [class*="spinner"]'), { timeout: 10000 }).catch(() => {});
await page.waitForSelector('table tbody tr');
await page.waitForFunction(() => document.querySelectorAll('table tbody tr').length > 1, { timeout: 10000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/04-carga-horaria-2o-clique.png`, fullPage: true });

await browser.close();
console.log('screenshots limpos salvos');
