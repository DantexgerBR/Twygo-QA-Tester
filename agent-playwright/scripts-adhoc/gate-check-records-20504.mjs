import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

// Gate check round 4 — card 20504. Binary question: /o/37079/records responde
// a listagem (200 + linhas) ou ainda "Você não tem permissão"?
// Usa a credencial DO PRÓPRIO CARD (devtestes@teste.com), que é a que perdeu
// acesso no opt-out do BETA (rodadas 2/3). ponytail: 1 pergunta, 1 script.

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const EMAIL = process.env.T_EMAIL || 'devtestes@teste.com';
const PASSWORD = process.env.T_PASSWORD || '123456';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const listingXhr = [];
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
page.on('response', (r) => {
  const u = r.url();
  // candidata a XHR de listagem de registros (para replay de order_by se acesso voltar)
  if (/\/records?(\.|\?|\/|$)/i.test(u) && !u.includes('getdemo') && !u.includes('recording')) {
    listingXhr.push({ status: r.status(), url: u, type: r.request().resourceType() });
  }
});

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);
const loginUrl = page.url();
console.log('[login] url final:', loginUrl, '| ok:', !loginUrl.includes('/users/login'));

await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const bodyText = await page.locator('body').innerText().catch(() => '');
const semPermissao = /não tem permissão/i.test(bodyText);
const rows = await page.locator('table tbody tr, [role="row"]').count().catch(() => 0);

await page.screenshot({ path: `${OUT}/30-gate-check-rodada4.png`, fullPage: false });

const result = {
  card: 20504,
  rodada: 4,
  data: '2026-07-07',
  usuario: EMAIL,
  url_final: page.url(),
  login_ok: !loginUrl.includes('/users/login'),
  sem_permissao: semPermissao,
  linhas_tabela: rows,
  acesso_restaurado: !semPermissao && rows > 0,
  listing_xhr_candidatas: listingXhr,
};
writeFileSync(`${OUT}/gate-check-rodada4.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

await browser.close();
