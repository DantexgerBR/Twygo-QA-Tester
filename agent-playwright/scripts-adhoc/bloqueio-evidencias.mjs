import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = 'outputs/registros-massa-mensagens';
mkdirSync(OUT, { recursive: true });

async function tentarLogin(label, base, email, password, outPrefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
  await page.goto(`${base}/users/login`, { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: 'Login' }).fill(email);
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForTimeout(4000);
  const finalUrl = page.url();
  await page.screenshot({ path: `${OUT}/${outPrefix}.png` });
  const ok = !finalUrl.includes('/users/login');
  console.log(`[${label}] base=${base} email=${email} -> ${ok ? 'SUCESSO' : 'FALHOU'} (url final: ${finalUrl})`);
  await browser.close();
  return ok;
}

const REG_BASE = 'https://registrosf2.stage.twygoead.com';
const HOME_BASE = 'https://twygo1772627238.stage.twygoead.com';

await tentarLogin(
  '1-recertificacao-em-registrosf2',
  REG_BASE,
  process.env.TWYGO_STAGING_RECERTIFICACAO_EMAIL,
  process.env.TWYGO_STAGING_RECERTIFICACAO_PASSWORD,
  '01-registrosf2-login-recertificacao-falhou',
);

await tentarLogin(
  '2-marcadagua-em-registrosf2',
  REG_BASE,
  process.env.TWYGO_STAGING_MARCA_DAGUA_EMAIL,
  process.env.TWYGO_STAGING_MARCA_DAGUA_PASSWORD,
  '02-registrosf2-login-marcadagua-falhou',
);

await tentarLogin(
  '3-recertificacao-no-proprio-home-36675 (sanity)',
  HOME_BASE,
  process.env.TWYGO_STAGING_RECERTIFICACAO_EMAIL,
  process.env.TWYGO_STAGING_RECERTIFICACAO_PASSWORD,
  '03-sanity-recertificacao-no-home-36675-falhou',
);

await tentarLogin(
  '4-marcadagua-no-proprio-home-36675 (sanity)',
  HOME_BASE,
  process.env.TWYGO_STAGING_MARCA_DAGUA_EMAIL,
  process.env.TWYGO_STAGING_MARCA_DAGUA_PASSWORD,
  '04-sanity-marcadagua-no-home-36675-sucesso',
);
