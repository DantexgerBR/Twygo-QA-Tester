// Validação retrabalho 19961 (LOCAL, não commitar no twygo-agents-qa)
// P3 [Novo Estúdio] Mobile não usa as 3 abas no rodapé. PR 10666 (RN 54.2).
// Espera: barra creation-studio-mobile-tab-bar com 3 abas (list/preview/copilot),
// alternância sem perder contexto, em 360px e 767px.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19961';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19961, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });

async function dismissModals(page) {
  for (let i = 0; i < 2; i++) {
    for (const txt of [/pergunte depois/i, /continuar mesmo assim/i, /aceitar( todos)?/i,
      /concordo/i, /entendi/i, /^fechar$/i, /^agora não$/i, /^ok$/i]) {
      const b = page.getByRole('button', { name: txt }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(600); }
    }
  }
}

async function gotoStudio(page) {
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-three-column-shell"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) { await page.waitForTimeout(3000); await dismissModals(page); return; }
    console.log(`[gotoStudio] não hidratou (${i}/3)`);
  }
  throw new Error('Estúdio não hidratou após 3 tentativas');
}

async function login(page) {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissModals(page);
}

const tabBarInfo = (page) => page.evaluate(() => {
  const bar = document.querySelector('[data-test-id="creation-studio-mobile-tab-bar"]');
  if (!bar) return { existe: false };
  const r = bar.getBoundingClientRect();
  const tabs = [...bar.querySelectorAll('[data-test-id^="creation-studio-mobile-tab-"]')]
    .filter((el) => el.getAttribute('data-test-id') !== 'creation-studio-mobile-tab-bar')
    .map((el) => ({
      testId: el.getAttribute('data-test-id'),
      label: el.textContent?.trim(),
      ativa: el.getAttribute('aria-current') === 'page',
    }));
  return {
    existe: true,
    visivel: r.width > 0 && r.height > 0,
    noRodape: Math.abs(r.bottom - window.innerHeight) < 4,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    tabs,
  };
});

const visibilidade = (page) => page.evaluate(() => {
  const vis = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 5 && r.height > 5;
  };
  return {
    lista: vis('[data-test-id="creation-studio-activities-list"]'),
    preview: vis('[data-test-id="creation-studio-preview-pane"]'),
    copiloto: vis('[data-test-id="copilot-drawer"]'),
  };
});

try {
  // ===== 360x740 (mobile) =====
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: 'pt-BR' });
  const page = await ctx.newPage();
  await login(page);
  await gotoStudio(page);

  summary.m360 = { barra: await tabBarInfo(page), inicial: await visibilidade(page) };
  console.log('[360] BARRA:', JSON.stringify(summary.m360.barra, null, 2));
  console.log('[360] VISIBILIDADE INICIAL:', JSON.stringify(summary.m360.inicial));
  await page.screenshot({ path: `${OUT}/01-360-aba-lista.png` });

  if (summary.m360.barra.existe) {
    // memorizar 1º título da lista (contexto)
    const primeiroTitulo = await page.locator('[data-test-id="creation-studio-activity-card-title"]').first().textContent().catch(() => null);

    // alternar pra Preview
    await page.locator('[data-test-id="creation-studio-mobile-tab-preview"]').evaluate((el) => el.click());
    await page.waitForTimeout(1500);
    summary.m360.aposTabPreview = { vis: await visibilidade(page), barra: (await tabBarInfo(page)).tabs };
    console.log('[360] APÓS TAB PREVIEW:', JSON.stringify(summary.m360.aposTabPreview));
    await page.screenshot({ path: `${OUT}/02-360-aba-preview.png` });

    // alternar pra Copiloto
    await page.locator('[data-test-id="creation-studio-mobile-tab-copilot"]').evaluate((el) => el.click());
    await page.waitForTimeout(2500);
    summary.m360.aposTabCopilot = { vis: await visibilidade(page), barra: (await tabBarInfo(page)).tabs };
    console.log('[360] APÓS TAB COPILOTO:', JSON.stringify(summary.m360.aposTabCopilot));
    await page.screenshot({ path: `${OUT}/03-360-aba-copiloto.png` });

    // voltar pra Lista — contexto preservado?
    await page.locator('[data-test-id="creation-studio-mobile-tab-list"]').evaluate((el) => el.click());
    await page.waitForTimeout(1500);
    const titulo2 = await page.locator('[data-test-id="creation-studio-activity-card-title"]').first().textContent().catch(() => null);
    summary.m360.aposVoltarLista = { vis: await visibilidade(page), contextoPreservado: titulo2 === primeiroTitulo, primeiroTitulo, titulo2 };
    console.log('[360] APÓS VOLTAR LISTA:', JSON.stringify(summary.m360.aposVoltarLista));
    await page.screenshot({ path: `${OUT}/04-360-volta-lista.png` });
  }
  await ctx.close();

  // ===== 767x740 (limite superior do mobile) =====
  const ctx767 = await browser.newContext({ viewport: { width: 767, height: 740 }, locale: 'pt-BR' });
  const page767 = await ctx767.newPage();
  await login(page767);
  await gotoStudio(page767);
  summary.m767 = { barra: await tabBarInfo(page767) };
  console.log('[767] BARRA:', JSON.stringify(summary.m767.barra, null, 2));
  await page767.screenshot({ path: `${OUT}/05-767-barra-rodape.png` });
  await ctx767.close();

  summary.passou =
    summary.m360.barra?.existe && summary.m360.barra?.visivel && summary.m360.barra?.noRodape
    && summary.m360.barra?.tabs?.length === 3
    && summary.m360.aposTabPreview?.vis?.preview === true
    && summary.m360.aposTabCopilot?.vis?.copiloto === true
    && summary.m360.aposVoltarLista?.vis?.lista === true
    && summary.m767.barra?.existe && summary.m767.barra?.visivel;
  console.log('PASSOU?', summary.passou);
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
}

writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
