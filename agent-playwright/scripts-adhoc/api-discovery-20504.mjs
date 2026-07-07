import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

// Discovery: descobrir os field names reais da response da listagem de Registros
// para saber quais order_by testar. ponytail: 1 chamada, dump das chaves.
const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const EMAIL = process.env.T_EMAIL || 'devtestes@teste.com';
const PASSWORD = process.env.T_PASSWORD || '123456';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const page = await ctx.newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(3000);

const url = `${BASE}/api/v1/o/${ORG}/records?per_page=100&page=1&order_by=created_at&order_type=desc`;
const resp = await ctx.request.get(url);
const json = await resp.json();
const d = json.data;
console.log('status:', resp.status(), '| tipo data:', Array.isArray(d) ? 'array' : typeof d);
console.log('data keys:', d && !Array.isArray(d) ? Object.keys(d) : `array len ${d?.length}`);
// achar o array de registros dentro de data
const list = Array.isArray(d) ? d
  : (d?.records || d?.items || d?.list || (Array.isArray(d?.data) ? d.data : []));
console.log('total registros:', list.length);
if (list[0]) console.log('\nchaves de 1 registro:\n', JSON.stringify(Object.keys(list[0]), null, 2), '\n\namostra:\n', JSON.stringify(list[0], null, 2));
writeFileSync(`${OUT}/api-discovery.json`, JSON.stringify({ status: resp.status(), dataKeys: d && !Array.isArray(d) ? Object.keys(d) : null, count: list.length, sample: list[0] || null }, null, 2));

await browser.close();
