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
await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);
// buscar pelo nome pra linha aparecer
const busca = page.locator('input[type="search"], input[placeholder*="esquis" i], input[placeholder*="uscar" i]').first();
if (await busca.isVisible().catch(()=>false)) { await busca.fill('QA122-repasse'); await page.waitForTimeout(3500); }
const row = page.locator('tr, [data-item-id]').filter({ hasText: 'QA122-repasse-1206-excluir' }).first();
const achou = await row.isVisible().catch(()=>false);
console.log('LINHA DO CURSO VISÍVEL?', achou);
if (achou) {
  const controles = await row.evaluate((el) => [...el.querySelectorAll('button, a, [role="button"]')]
    .map((b) => ({ tid: b.getAttribute('data-test-id'), aria: b.getAttribute('aria-label'), txt: (b.textContent ?? '').trim().slice(0, 25), href: b.getAttribute('href') }))
    .filter((c) => c.tid || c.aria || c.txt || c.href));
  console.log('CONTROLES DA LINHA:', JSON.stringify(controles, null, 1));
  // abrir o último botão (kebab típico) e dump do menu
  const kebab = row.locator('button').last();
  await kebab.click();
  await page.waitForTimeout(1500);
  const itens = await page.evaluate(() => [...document.querySelectorAll('[role="menuitem"], .chakra-menu__menuitem, .dropdown-menu a, ul.dropdown-menu li')]
    .filter((el) => el.getBoundingClientRect().width > 0)
    .map((el) => (el.textContent ?? '').trim()).filter(Boolean));
  console.log('MENU:', JSON.stringify(itens));
  await page.screenshot({ path: `${OUT}/05-kebab-menu.png` });
  // Atividades legado
  const ativ = page.locator('[role="menuitem"], .dropdown-menu a').filter({ hasText: /atividades/i }).first();
  if (await ativ.isVisible().catch(()=>false)) {
    await ativ.click();
    await page.waitForTimeout(8000);
    console.log('ATIVIDADES LEGADO URL:', page.url().replace(BASE, ''));
    console.log('CARREGOU CONTEÚDO?', await page.evaluate(() => document.body.innerText.length > 500));
    await page.screenshot({ path: `${OUT}/06-atividades-legado.png` });
    await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const b2 = page.locator('input[type="search"], input[placeholder*="esquis" i], input[placeholder*="uscar" i]').first();
    if (await b2.isVisible().catch(()=>false)) { await b2.fill('QA122-repasse'); await page.waitForTimeout(3500); }
  } else { await page.keyboard.press('Escape'); }
  // excluir
  const row2 = page.locator('tr, [data-item-id]').filter({ hasText: 'QA122-repasse-1206-excluir' }).first();
  await row2.locator('button').last().click();
  await page.waitForTimeout(1500);
  page.once('dialog', (d) => d.accept());
  const exc = page.locator('[role="menuitem"], .dropdown-menu a').filter({ hasText: /excluir/i }).first();
  if (await exc.isVisible().catch(()=>false)) {
    await exc.click().catch(()=>{});
    await page.waitForTimeout(2500);
    const conf = page.getByRole('button', { name: /^(Excluir|Confirmar|Sim)$/i }).first();
    if (await conf.isVisible().catch(()=>false)) await conf.click().catch(()=>{});
    await page.waitForTimeout(4000);
  }
  const resta = await page.locator('tr, [data-item-id]').filter({ hasText: 'QA122-repasse-1206-excluir' }).first().isVisible().catch(()=>false);
  console.log('CURSO EXCLUÍDO?', !resta);
  await page.screenshot({ path: `${OUT}/07-pos-cleanup.png` });
}
await browser.close();
