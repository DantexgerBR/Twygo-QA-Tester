import 'dotenv/config';
import { chromium } from '@playwright/test';
const BASE = (process.env.EDUAPI_BASE_URL_NE ?? '').replace(/\/$/, '');
const ORG = process.env.EDUAPI_ORG_ID_NE; const ID = '807991';
const OUT = 'outputs/novo-estudio/revalida-qa122';
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.EDUAPI_EMAIL_NE);
await page.fill('#user_password', process.env.EDUAPI_SENHA_NE);
await page.click('#user_submit');
await page.waitForTimeout(7000);

async function abrirKebab() {
  await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  const busca = page.locator('input[type="search"], input[placeholder*="esquis" i], input[placeholder*="uscar" i]').first();
  if (await busca.isVisible().catch(()=>false)) { await busca.fill('QA122-repasse'); await page.waitForTimeout(3500); }
  await page.locator(`[data-test-id="events-${ID}-actions-kebab"]`).click();
  await page.waitForTimeout(1500);
}

// dispatchEvent no item do kebab (itens são DIVs; tooltip engole clique normal)
const clickItem = (texto) => page.evaluate((texto) => {
  const els = [...document.querySelectorAll('[role="menuitem"], .chakra-menu__menuitem')]
    .filter((el) => el.getBoundingClientRect().width > 0 && new RegExp(texto, 'i').test(el.textContent ?? ''));
  if (!els.length) return false;
  els[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
}, texto);

// 1) Atividades legado
await abrirKebab();
console.log('[ativ] dispatch:', await clickItem('Atividades'));
await page.waitForTimeout(8000);
console.log('[ativ] URL:', page.url().replace(BASE, ''));
console.log('[ativ] corpo carregou?', await page.evaluate(() => document.body.innerText.length > 500));
await page.screenshot({ path: `${OUT}/06-atividades-legado.png` });

// 2) Excluir
await abrirKebab();
page.once('dialog', (d) => d.accept());
console.log('[del] dispatch:', await clickItem('Excluir'));
await page.waitForTimeout(2500);
const conf = page.getByRole('button', { name: /^(Excluir|Confirmar|Sim)$/i }).first();
if (await conf.isVisible().catch(()=>false)) { await conf.click().catch(()=>{}); await page.waitForTimeout(1000); }
await page.waitForTimeout(4000);
await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const busca2 = page.locator('input[type="search"], input[placeholder*="esquis" i], input[placeholder*="uscar" i]').first();
if (await busca2.isVisible().catch(()=>false)) { await busca2.fill('QA122-repasse'); await page.waitForTimeout(3500); }
const resta = await page.locator('tr, [data-item-id]').filter({ hasText: 'QA122-repasse-1206-excluir' }).first().isVisible().catch(()=>false);
console.log('[del] CURSO EXCLUÍDO?', !resta);
await page.screenshot({ path: `${OUT}/07-pos-cleanup.png` });
await browser.close();
