// Reconfirmação ao vivo (10/06/2026) dos cards QA 1.12 / 1.15 / 1.16 do Novo Estúdio.
// READ-ONLY: não clica Publicar, não toggla flag/contrato, não edita atividade.
// Org 37061 (staging-novo-estudio), curso 807533.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const COURSE = process.env.COURSE_ID || '807533';
const OUT = 'outputs/novo-estudio/recon-2026-06-10';
mkdirSync(OUT, { recursive: true });

const log = (...a) => console.log(...a);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 720 }, locale: 'pt-BR' });
const page = await ctx.newPage();

// ---- login ----
await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(6000);
log('[login] url pós-login:', page.url());

// =====================================================================
// QA 1.12 + 1.16 — Estúdio do curso: existe "Publicar alterações" / "Salvar como novo" / "Duplicar"?
// =====================================================================
await page.goto(`${BASE}/o/${ORG}/events/${COURSE}/edit/studio`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);
log('\n=== ESTÚDIO ===');
log('URL final:', page.url());
log('TITLE   :', await page.title());
await page.screenshot({ path: `${OUT}/estudio-807533.png`, fullPage: false });

const probe = async (re) => page.evaluate((src) => {
  const rx = new RegExp(src, 'i');
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 3 && r.height > 3; };
  const hits = [...document.querySelectorAll('button, a, [role="button"], [role="menuitem"]')]
    .filter(vis)
    .filter((el) => rx.test((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')))
    .map((el) => ((el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50)));
  const anyNode = [...document.querySelectorAll('*')]
    .some((el) => el.children.length === 0 && rx.test(el.textContent || ''));
  return { controls: [...new Set(hits)], anyTextNode: anyNode };
}, re.source ?? re);

for (const term of ['Publicar', 'Salvar como novo', 'Duplicar', 'Visualizar como aluno', '\\bSalvar\\b']) {
  const r = await probe(new RegExp(term, 'i'));
  log(`  [${term}] controls=${JSON.stringify(r.controls)} | algumTextoNoDOM=${r.anyTextNode}`);
}

// controles visíveis do topo (referência)
const topo = await page.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 3 && r.height > 3 && r.y < 160; };
  return [...new Set([...document.querySelectorAll('button, a, [role="button"], [role="tab"]')]
    .filter(vis).map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)).filter(Boolean))].slice(0, 40);
});
log('  TOPO (y<160):', JSON.stringify(topo));

// =====================================================================
// QA 1.15 — gate do Estúdio: flag Flipper + rota antiga /edit/activities
// =====================================================================
log('\n=== QA 1.15 — FLAG + ROTA ANTIGA ===');

// flag Flipper creation_studio
const flagResp = await page.goto(`${BASE}/admin/manage/features/creation_studio`, { waitUntil: 'domcontentloaded' }).catch((e) => ({ status: () => 'ERR ' + e.message }));
await page.waitForTimeout(3000);
log('  Flipper status HTTP:', flagResp && flagResp.status ? flagResp.status() : '??', '| url:', page.url());
const flagTxt = await page.evaluate(() => {
  const body = (document.body.innerText || '');
  const m = body.match(/(Disabled|Enabled|Fully enabled|No actors enabled|\d+% of actors|\d+% of time)/gi);
  return m ? [...new Set(m)] : (body.slice(0, 200));
});
log('  Flipper texto-chave:', JSON.stringify(flagTxt));
await page.screenshot({ path: `${OUT}/flipper-creation_studio.png` });

// rota antiga
const oldResp = await page.goto(`${BASE}/o/${ORG}/events/${COURSE}/edit/activities`, { waitUntil: 'domcontentloaded' }).catch((e) => ({ status: () => 'ERR ' + e.message }));
await page.waitForTimeout(4000);
log('  /edit/activities HTTP:', oldResp && oldResp.status ? oldResp.status() : '??', '| url final:', page.url());
const old404 = await page.evaluate(() => /404|não encontrad|not found|página não existe/i.test(document.body.innerText || ''));
log('  /edit/activities parece 404/erro?', old404);
await page.screenshot({ path: `${OUT}/rota-antiga-activities.png` });

await browser.close();
log('\n[ok] screenshots em', OUT);
