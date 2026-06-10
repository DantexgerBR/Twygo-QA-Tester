// QA 1.18 — POVOAR a Trial 37062 com dado de historico (copiloto -> conversations/messages).
// NAO destrutivo. Login trial -> abre curso "Construindo times..." -> Estudio -> copiloto -> envia msg.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'https://novoestudiotrial.stage.twygoead.com';
const ORG = '37062';
const OUT = 'outputs/novo-estudio/qa18-e2e';
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(...a);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, locale: 'pt-BR' });
const page = await ctx.newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.TWYGO_TRIAL_NOVO_ESTUDIO_EMAIL);
await page.fill('#user_password', process.env.TWYGO_TRIAL_NOVO_ESTUDIO_PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(6000);

await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);

let courseId = null;
const titulo = page.getByText('Construindo times de alta performance', { exact: false }).first();
if (await titulo.count().catch(() => 0)) {
  await titulo.click().catch(() => {});
  await page.waitForTimeout(7000);
  const m = page.url().match(/\/(?:events|contents)\/(\d+)/);
  if (m) courseId = m[1];
}
log('[curso] url apos click:', page.url(), '| courseId:', courseId);
if (!courseId) {
  courseId = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[data-item-id]')].find((e) => /\d{5,}/.test(e.getAttribute('data-item-id') || ''));
    return el ? el.getAttribute('data-item-id') : null;
  });
  log('[curso] fallback data-item-id:', courseId);
}
if (!courseId) { log('SEM courseId. Abortando.'); await page.screenshot({ path: `${OUT}/populate-00b-semid.png` }); await browser.close(); process.exit(2); }

await page.goto(`${BASE}/o/${ORG}/contents/${courseId}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);
log('[estudio] url:', page.url(), '| title:', await page.title());

const abrir = page.getByRole('button', { name: /Abrir copiloto/i }).first();
if (await abrir.count().catch(() => 0)) { await abrir.click().catch(() => {}); await page.waitForTimeout(4000); }

const inputs = await page.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 20 && r.height > 10; };
  return [...document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]')]
    .filter(vis).map((el) => ({ tag: el.tagName.toLowerCase(), ph: el.getAttribute('placeholder') || '' }));
});
log('[copiloto] campos visiveis:', JSON.stringify(inputs));

const MSG = 'Teste QA 1.18 - povoando historico para validar exclusao.';
let enviado = false;
const cand = page.locator('textarea:visible, [contenteditable="true"]:visible').last();
if (await cand.count().catch(() => 0)) {
  try {
    await cand.click();
    await cand.fill(MSG).catch(async () => { await cand.type(MSG); });
    await page.waitForTimeout(800);
    const enviar = page.getByRole('button', { name: /Enviar|send/i }).first();
    if (await enviar.count().catch(() => 0)) await enviar.click().catch(() => {});
    else await cand.press('Enter');
    enviado = true;
  } catch (e) { log('[copiloto] erro:', e.message); }
}
log('[copiloto] enviado?', enviado);
await page.waitForTimeout(9000);
await page.screenshot({ path: `${OUT}/populate-01-copiloto.png`, fullPage: false });
log('[ok]', OUT);
await browser.close();
