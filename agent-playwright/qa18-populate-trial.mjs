// QA 1.18 — POVOAR a Trial 37062 com dado de historico (copiloto -> conversations/messages).
// NAO destrutivo. Login trial -> acha curso -> abre Estudio -> abre copiloto -> envia 1 msg.
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
log('[login] url:', page.url());

// achar um curso na listagem de Conteudos
await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);
const courseId = await page.evaluate(() => {
  const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '');
  const m = hrefs.map((h) => h.match(/\/(?:events|contents)\/(\d+)/)).find(Boolean);
  return m ? m[1] : null;
});
log('[listagem] courseId:', courseId);
await page.screenshot({ path: `${OUT}/populate-00-listagem.png` });
if (!courseId) { log('SEM curso na Trial — precisa criar curso antes. Abortando.'); await browser.close(); process.exit(2); }

// abrir Estudio
await page.goto(`${BASE}/o/${ORG}/contents/${courseId}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);
log('[estudio] url:', page.url(), '| title:', await page.title());

// abrir copiloto
const abrir = page.getByRole('button', { name: /Abrir copiloto/i }).first();
if (await abrir.count().catch(() => 0)) { await abrir.click().catch(() => {}); await page.waitForTimeout(4000); }
log('[copiloto] aberto?', await page.getByText(/copiloto|Soph/i).count().catch(() => 0));

// dump de inputs/textarea do copiloto pra achar onde digitar
const inputs = await page.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 20 && r.height > 10; };
  return [...document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]')]
    .filter(vis)
    .map((el) => ({ tag: el.tagName.toLowerCase(), ph: el.getAttribute('placeholder') || '', x: Math.round(el.getBoundingClientRect().x) }));
});
log('[copiloto] campos de texto visiveis:', JSON.stringify(inputs));

// tentar digitar e enviar
const MSG = 'Teste QA 1.18 - povoando historico para validar exclusao.';
let enviado = false;
const cand = page.locator('textarea:visible, [contenteditable="true"]:visible').last();
if (await cand.count().catch(() => 0)) {
  try {
    await cand.click();
    await cand.fill(MSG).catch(async () => { await cand.type(MSG); });
    await page.waitForTimeout(800);
    // botao Enviar ou Enter
    const enviar = page.getByRole('button', { name: /Enviar|Enviar mensagem|send/i }).first();
    if (await enviar.count().catch(() => 0)) { await enviar.click().catch(() => {}); }
    else { await cand.press('Enter'); }
    enviado = true;
  } catch (e) { log('[copiloto] erro ao enviar:', e.message); }
}
log('[copiloto] mensagem enviada?', enviado);
await page.waitForTimeout(8000); // aguarda gravar conversa/mensagem
await page.screenshot({ path: `${OUT}/populate-01-copiloto.png`, fullPage: false });

await browser.close();
log('\n[ok] screenshots em', OUT);
