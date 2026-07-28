import 'dotenv/config';
import { chromium } from '@playwright/test';

const BASE = 'https://twygo1772627238.stage.twygoead.com';
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.TWYGO_STAGING_RECERTIFICACAO_EMAIL);
await page.fill('#user_password', process.env.TWYGO_STAGING_RECERTIFICACAO_PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(4000);
console.log('url:', page.url());
await page.screenshot({ path: 'outputs/registros-massa-mensagens/recon/sanity.png' });
await browser.close();
