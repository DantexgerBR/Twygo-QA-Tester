import 'dotenv/config';
import { chromium } from '@playwright/test';

const BASE = process.env.T_BASE || 'https://registrosf2.stage.twygoead.com';
const EMAIL = process.env.T_EMAIL;
const PASSWORD = process.env.T_PASSWORD;

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({viewport:{width:1440,height:900}})).newPage();
page.on('response', (r) => { if (r.url().includes('/users/') || r.url().includes('sign_in')) console.log('[resp]', r.status(), r.url()); });
await page.goto(`${BASE}/users/login`, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'outputs/registros-massa-mensagens/recon/pre-fill.png' });
console.log('pre-fill alert text:', await page.locator('body').innerText().then(t => t.includes('inválid') ? 'JA TINHA ALERTA' : 'sem alerta'));
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.screenshot({ path: 'outputs/registros-massa-mensagens/recon/filled.png' });
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);
console.log('post url', page.url());
await page.screenshot({ path: 'outputs/registros-massa-mensagens/recon/post-submit.png' });
await browser.close();
