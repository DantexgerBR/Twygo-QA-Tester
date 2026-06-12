// Revalidação QA 1.12 (LOCAL) — render assíncrono da versão publicada (RN 12).
// Fluxo real (D15/PR 10429): "Salvar como rascunho" (is_draft=true) → badge de
// pendência → "Salvar e renderizar/regerar" dispara render assíncrono → badge
// Renderizando → Pronto. Aula alvo: GENTMP-Lesson 9295161 (seed de QA).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533'; const LESSON = '9295161';
const OUT = 'outputs/novo-estudio/revalida-qa112';
mkdirSync(OUT, { recursive: true });
const r = { lesson: LESSON };
const netLog = [];

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
page.on('request', (req) => {
  if (!['POST', 'PATCH', 'PUT'].includes(req.method())) return;
  if (/save_lesson|render|lessons_parts|design_editor|studio/i.test(req.url()))
    netLog.push({ t: new Date().toISOString(), m: req.method(), url: req.url().replace(BASE, ''), body: req.postData()?.slice(0, 300) ?? null });
});
page.on('response', (res) => {
  if (!['POST', 'PATCH', 'PUT'].includes(res.request().method())) return;
  if (/save_lesson|render|lessons_parts|design_editor|studio/i.test(res.url()))
    netLog.push({ t: new Date().toISOString(), status: res.status(), url: res.url().replace(BASE, '') });
});

const dumpEstado = () => page.evaluate(() => {
  const vis = (el) => el.getBoundingClientRect().width > 0;
  const botoes = [...document.querySelectorAll('button')].filter(vis)
    .map((el) => (el.textContent ?? '').trim()).filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
  const badges = [...document.querySelectorAll('span, div, [role="status"]')]
    .filter((el) => vis(el) && el.children.length === 0 && /rascunho|renderiz|pronto|pendente/i.test(el.textContent ?? '') && (el.textContent ?? '').length < 45)
    .map((el) => (el.textContent ?? '').trim()).filter((v, i, a) => a.indexOf(v) === i);
  return { botoes: botoes.slice(0, 20), badges };
});

async function abrirEditorConteudo() {
  await page.goto(`${BASE}/o/${ORG}/studio/activities/${LESSON}/edit?type=lesson&eventId=${ID}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  await page.getByRole('tab', { name: /conte[uú]do/i }).first().click();
  await page.waitForTimeout(5000);
}

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForTimeout(7000);

  // estado inicial do editor
  await abrirEditorConteudo();
  r.estadoInicial = await dumpEstado();
  console.log('ESTADO INICIAL:', JSON.stringify(r.estadoInicial));
  await page.screenshot({ path: `${OUT}/01-editor-inicial.png` });

  // 1) Salvar como rascunho → is_draft=true
  const netA = netLog.length;
  await page.getByRole('button', { name: /salvar como rascunho/i }).first().click();
  await page.waitForTimeout(6000);
  r.aposRascunho = { estado: await dumpEstado(), rede: netLog.slice(netA), url: page.url().replace(BASE, '') };
  console.log('APÓS SALVAR COMO RASCUNHO:', JSON.stringify(r.aposRascunho, null, 1));
  await page.screenshot({ path: `${OUT}/02-apos-rascunho.png` });

  // reabrir editor (se saiu) e ver botão de render
  if (!/studio\/activities/.test(page.url())) await abrirEditorConteudo();
  else { await page.waitForTimeout(2000); }
  r.estadoPosRascunho = await dumpEstado();
  console.log('EDITOR PÓS-RASCUNHO:', JSON.stringify(r.estadoPosRascunho));
  await page.screenshot({ path: `${OUT}/03-editor-pos-rascunho.png` });

  // 2) disparar a renderização — botão "Salvar e renderizar" (ou "Salvar e regerar")
  const renderBtn = page.getByRole('button', { name: /salvar e (renderizar|regerar)/i }).first();
  r.renderBtnTexto = await renderBtn.textContent().catch(() => null);
  const netB = netLog.length;
  await renderBtn.click();
  await page.waitForTimeout(8000);
  r.aposRender = { estado: await dumpEstado(), rede: netLog.slice(netB), url: page.url().replace(BASE, '') };
  console.log('APÓS DISPARAR RENDER:', JSON.stringify(r.aposRender, null, 1));
  await page.screenshot({ path: `${OUT}/04-apos-disparo-render.png` });

  // 3) status assíncrono: voltar pro estúdio e observar badge no preview da aula
  const verPreview = async () => {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-test-id="creation-studio-activities-list"]').waitFor({ state: 'visible', timeout: 25000 });
    await page.waitForTimeout(3000);
    const close = page.locator('[data-test-id="copilot-drawer-close"]');
    if (await close.isVisible().catch(() => false)) { await close.click(); await page.waitForTimeout(800); }
    const card = page.locator(`[data-test-id="creation-studio-activity-card-${LESSON}"]`);
    await card.scrollIntoViewIfNeeded();
    await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
    await page.waitForTimeout(3500);
    return page.evaluate(() => {
      const pane = document.querySelector('[data-test-id="creation-studio-preview-pane"]');
      const txt = (pane?.textContent ?? '').replace(/\s+/g, ' ');
      return {
        renderiz: /renderiz/i.test(txt), pronto: /pronto/i.test(txt), rascunho: /rascunho/i.test(txt),
        temVideo: !!pane?.querySelector('video, iframe'),
        resumo: txt.slice(0, 220),
      };
    });
  };

  let prev = await verPreview();
  r.statusTimeline = [{ t: 0, ...prev }];
  console.log('[0s preview]', JSON.stringify(prev));
  await page.screenshot({ path: `${OUT}/05-preview-status-inicial.png` });
  const t0 = Date.now();
  while (Date.now() - t0 < 420000) {
    await page.waitForTimeout(45000);
    prev = await verPreview();
    const s = Math.round((Date.now() - t0) / 1000);
    r.statusTimeline.push({ t: s, ...prev });
    console.log(`[${s}s preview]`, JSON.stringify(prev));
    if (!prev.renderiz && !prev.rascunho) break;
  }
  await page.screenshot({ path: `${OUT}/06-preview-status-final.png` });
} catch (e) {
  r.erro = String(e).slice(0, 500);
  console.error('ERRO:', r.erro);
  await page.screenshot({ path: `${OUT}/99-erro.png` }).catch(() => {});
}

r.networkCompleta = netLog;
writeFileSync(`${OUT}/resultado.json`, JSON.stringify(r, null, 2));
console.log('\n===== DADOS =====');
console.log(JSON.stringify({ ...r, networkCompleta: `${netLog.length} reqs` }, null, 2));
await browser.close();
