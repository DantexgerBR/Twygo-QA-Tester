// Validação retrabalho 19823 (arquivo LOCAL, não commitar no twygo-agents-qa)
// P0 [Novo estúdio] Reordenação e persistência de abas (RN 3) — PR 10676.
// Checa: (1) hover Modelo mostra ícone de drag / Identificação NÃO é draggable;
// (2) drag Modelo→Banner muda ordem + PATCH user_preferences (tab_order);
// (3) reload → ordem persiste (user A); (4) last-tab: clicar Banner, sair,
// voltar sem ?tab → abre Banner; (5) user B vê ordem default (por usuário);
// (6) cleanup: restaurar ordem e aba do user A.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19823';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19823, env: BASE, org: ORG, content: ID };
const netLog = [];
const browser = await chromium.launch({ headless: true });

async function login(ctx, email, senha) {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', email);
  await page.fill('#user_password', senha);
  await page.click('#user_submit');
  await page.waitForTimeout(6000);
  return page;
}

async function gotoEdit(page, tab) {
  const url = `${BASE}/o/${ORG}/contents/${ID}/edit${tab ? `?tab=${tab}` : ''}`;
  for (let i = 1; i <= 3; i++) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const n = await page.evaluate(() =>
      [...document.querySelectorAll('[data-test-id^="tab-"]')].filter((el) => el.getBoundingClientRect().width > 5).length);
    if (n > 3) return;
    console.log(`[gotoEdit] abas não hidrataram (${i}/3)`);
  }
  throw new Error('abas não hidrataram após 3 tentativas');
}

const dumpOrdem = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-test-id^="tab-"]')]
      .filter((el) => el.getBoundingClientRect().width > 5 && !/drag-handle/.test(el.getAttribute('data-test-id')))
      .map((el) => el.getAttribute('data-test-id')));

const abaAtiva = (page) =>
  page.evaluate(() => {
    const el = [...document.querySelectorAll('[data-test-id^="tab-"]')]
      .filter((t) => t.getBoundingClientRect().width > 5)
      .find((t) => t.getAttribute('aria-selected') === 'true');
    return el ? el.getAttribute('data-test-id') : `(url) ${location.search}`;
  });

// HTML5 DnD sintético entre abas (eventos em fases — state React entre eles)
async function dragTab(page, fromName, toName) {
  const fire = (type) => page.evaluate(({ fromName, toName, type }) => {
    const vis = (sel) => [...document.querySelectorAll(sel)].find((el) => el.getBoundingClientRect().width > 5);
    const src = vis(`[data-test-id="tab-${fromName}"]`);
    const tgt = vis(`[data-test-id="tab-${toName}"]`);
    if (!src || !tgt) throw new Error(`tab não achada: ${!src ? fromName : toName}`);
    const f = (el, t, x, y) =>
      el.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: new DataTransfer() }));
    const s = src.getBoundingClientRect(); const r = tgt.getBoundingClientRect();
    const x = r.left + r.width / 2; const y = r.top + r.height / 2;
    if (type === 'dragstart') f(src, 'dragstart', s.left + s.width / 2, s.top + s.height / 2);
    else if (type === 'dragend') f(src, 'dragend', x, y);
    else f(tgt, type, x, y);
  }, { fromName, toName, type });
  for (const t of ['dragstart', 'dragover', 'drop', 'dragend']) {
    await fire(t);
    await page.waitForTimeout(350);
  }
}

try {
  // ===== Usuário A (agents.qa) =====
  const ctxA = await browser.newContext({ viewport: { width: 1366, height: 768 }, locale: 'pt-BR' });
  const pageA = await login(ctxA, process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL, process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  pageA.on('request', (req) => {
    if (['PATCH', 'POST', 'PUT'].includes(req.method()) && /user_preferences/i.test(req.url()))
      netLog.push({ t: new Date().toISOString(), method: req.method(), url: req.url(), body: req.postData()?.slice(0, 400) ?? null });
  });
  pageA.on('response', (res) => {
    if (['PATCH', 'POST', 'PUT'].includes(res.request().method()) && /user_preferences/i.test(res.url()))
      netLog.push({ t: new Date().toISOString(), status: res.status(), url: res.url() });
  });

  await gotoEdit(pageA, 'identification');
  summary.ordemInicialA = await dumpOrdem(pageA);
  console.log('[A] ORDEM INICIAL:', JSON.stringify(summary.ordemInicialA));

  // (1) draggable + handle no hover — Modelo vs Identificação
  summary.atributos = await pageA.evaluate(() => {
    const vis = (sel) => [...document.querySelectorAll(sel)].find((el) => el.getBoundingClientRect().width > 5);
    const probe = (name) => {
      const el = vis(`[data-test-id="tab-${name}"]`);
      const handle = el?.querySelector(`[data-test-id="tab-${name}-drag-handle"]`);
      return el ? {
        draggable: el.getAttribute('draggable'),
        temHandle: !!handle,
        handleAria: handle?.getAttribute('aria-label') ?? null,
        handleOpacity: handle ? getComputedStyle(handle).opacity : null,
      } : null;
    };
    return { modelo: probe('modelo'), identification: probe('identification'), banner: probe('banner') };
  });
  console.log('[1] ATRIBUTOS:', JSON.stringify(summary.atributos, null, 2));

  // hover no Modelo → opacity do handle vai a 1
  const modeloVisivel = pageA.locator('[data-test-id="tab-modelo"]:visible').first();
  await modeloVisivel.hover();
  await pageA.waitForTimeout(900);
  summary.hoverModeloOpacity = await pageA.evaluate(() => {
    const vis = [...document.querySelectorAll('[data-test-id="tab-modelo-drag-handle"]')]
      .find((el) => el.getBoundingClientRect().width > 0);
    return vis ? getComputedStyle(vis).opacity : null;
  });
  console.log('[1] HOVER Modelo → opacity do handle:', summary.hoverModeloOpacity);
  await pageA.screenshot({ path: `${OUT}/01-hover-modelo-icone-drag.png` });
  summary.iconeNoHoverModelo = summary.hoverModeloOpacity === '1';
  summary.identificacaoTravada = !summary.atributos.identification?.temHandle
    && summary.atributos.identification?.draggable !== 'true';

  // (2) drag Modelo → Banner + Network
  const netBefore = netLog.length;
  await dragTab(pageA, 'modelo', 'banner');
  await pageA.waitForTimeout(3000);
  summary.ordemAposDrag = await dumpOrdem(pageA);
  summary.ordemMudou = JSON.stringify(summary.ordemAposDrag) !== JSON.stringify(summary.ordemInicialA);
  summary.requestsDoDrag = netLog.slice(netBefore);
  console.log('[2] ORDEM APÓS DRAG:', JSON.stringify(summary.ordemAposDrag));
  console.log('[2] MUDOU?', summary.ordemMudou, '| NETWORK:', JSON.stringify(summary.requestsDoDrag, null, 2));
  await pageA.screenshot({ path: `${OUT}/02-apos-drag-modelo-banner.png` });

  // (3) reload → persistência da ordem
  await gotoEdit(pageA, 'identification');
  summary.ordemAposReload = await dumpOrdem(pageA);
  summary.ordemPersistiu = JSON.stringify(summary.ordemAposReload) === JSON.stringify(summary.ordemAposDrag);
  console.log('[3] ORDEM APÓS RELOAD:', JSON.stringify(summary.ordemAposReload), '| PERSISTIU?', summary.ordemPersistiu);
  await pageA.screenshot({ path: `${OUT}/03-apos-reload-ordem-persistida.png` });

  // (4) last-tab: clicar Banner, sair pra listagem, voltar sem ?tab
  await pageA.locator('[data-test-id="tab-banner"]:visible').first().click();
  await pageA.waitForTimeout(3000);
  await pageA.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
  await pageA.waitForTimeout(4000);
  await gotoEdit(pageA, null);
  summary.abaAoVoltar = await abaAtiva(pageA);
  summary.lastTabRestaurada = summary.abaAoVoltar === 'tab-banner';
  console.log('[4] ABA ATIVA AO VOLTAR (sem ?tab):', summary.abaAoVoltar);
  await pageA.screenshot({ path: `${OUT}/04-retorno-abre-ultima-aba.png` });

  // (5) usuário B — ordem própria (default) e aba própria
  const ctxB = await browser.newContext({ viewport: { width: 1366, height: 768 }, locale: 'pt-BR' });
  const pageB = await login(ctxB, 'dante.tavares@twygo.com', '123456');
  await gotoEdit(pageB, null);
  summary.ordemUserB = await dumpOrdem(pageB);
  summary.abaAtivaUserB = await abaAtiva(pageB);
  summary.userBNaoHerdouOrdemDeA = JSON.stringify(summary.ordemUserB) !== JSON.stringify(summary.ordemAposDrag);
  console.log('[5] USER B ordem:', JSON.stringify(summary.ordemUserB), '| aba ativa:', summary.abaAtivaUserB);
  console.log('[5] USER B NÃO herdou ordem do A?', summary.userBNaoHerdouOrdemDeA);
  await pageB.screenshot({ path: `${OUT}/05-user-b-ordem-propria.png` });
  await ctxB.close();

  // (6) cleanup user A: restaurar ordem (Modelo de volta pra perto de Acesso) + aba Identificação
  await gotoEdit(pageA, 'identification');
  if (JSON.stringify(await dumpOrdem(pageA)) !== JSON.stringify(summary.ordemInicialA)) {
    await dragTab(pageA, 'modelo', 'access');
    await pageA.waitForTimeout(3000);
    let ordem = await dumpOrdem(pageA);
    if (JSON.stringify(ordem) !== JSON.stringify(summary.ordemInicialA)) {
      // segunda tentativa: dependendo do índice, mover de novo
      await dragTab(pageA, 'modelo', 'access');
      await pageA.waitForTimeout(3000);
      ordem = await dumpOrdem(pageA);
    }
    summary.cleanupOrdem = ordem;
    summary.cleanupOk = JSON.stringify(ordem) === JSON.stringify(summary.ordemInicialA);
    console.log('[6] CLEANUP ordem:', JSON.stringify(ordem), '| ok?', summary.cleanupOk);
  } else {
    summary.cleanupOk = true;
  }
  await pageA.locator('[data-test-id="tab-identification"]:visible').first().click().catch(() => {});
  await pageA.waitForTimeout(2500);
  await pageA.screenshot({ path: `${OUT}/06-apos-cleanup.png` });
  await ctxA.close();
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
}

summary.networkCompleta = netLog;
writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify({ ...summary, networkCompleta: undefined }, null, 2));
await browser.close();
