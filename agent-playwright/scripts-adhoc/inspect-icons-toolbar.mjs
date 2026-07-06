import 'dotenv/config';
import { chromium } from '@playwright/test';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
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
await page.waitForSelector('table tbody tr', { timeout: 15000 });

const info = await page.evaluate(() => {
  const filtroBtn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Filtro' || b.textContent.includes('Filtro'));
  if (!filtroBtn) return { erro: 'botao Filtro nao encontrado' };
  const container = filtroBtn.closest('div')?.parentElement;
  const candidates = container ? [...container.querySelectorAll('button, [role="button"]')] : [];
  return candidates.map(el => ({
    tag: el.tagName,
    aria: el.getAttribute('aria-label'),
    title: el.getAttribute('title'),
    text: el.textContent.trim().slice(0, 40),
    cls: el.className,
    outerHTMLpreview: el.outerHTML.slice(0, 300),
  }));
});
console.log('[icones perto de Filtro]', JSON.stringify(info, null, 2));

// TODOS elementos com atributo data-icon na pagina (icones Material Symbols)
const dataIcons = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-icon]')].map((el) => {
    const btn = el.closest('button');
    return {
      dataIcon: el.getAttribute('data-icon'),
      parentButtonId: btn?.id || null,
      parentButtonTestId: btn?.getAttribute('data-test-id') || null,
      parentButtonText: btn?.textContent.trim().slice(0, 40) || null,
    };
  });
});
console.log('[todos data-icon na pagina]', JSON.stringify(dataIcons, null, 2));
await browser.close();
