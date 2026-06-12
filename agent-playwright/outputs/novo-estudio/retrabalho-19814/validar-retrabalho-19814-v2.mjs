// Revalidação retrabalho 19814 v2 (LOCAL, não commitar no twygo-agents-qa)
// Alvo corrigido pelo Dante: o "menu lateral" da RN 2 é o PAINEL DA LISTA DE
// ATIVIDADES do Estúdio; o colapso é o chevron creation-studio-activities-list-collapse.
// RN 2: colapsável para ícones E opção de ocultar inteiramente.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19814';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19814, alvo: 'painel da lista de atividades do Estúdio (correção do Dante)', env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();

const painelInfo = (page) => page.evaluate(() => {
  const list = document.querySelector('[data-test-id="creation-studio-activities-list"]');
  // painel = ancestral direto do shell que envolve a lista (Box com w 360/64)
  const shell = document.querySelector('[data-test-id="creation-studio-three-column-shell"]');
  let painel = list;
  while (painel && painel.parentElement && painel.parentElement !== shell?.firstElementChild && painel.parentElement.getBoundingClientRect().width > (list?.getBoundingClientRect().width ?? 0) + 50) {
    if (painel.parentElement.contains(shell)) break;
    painel = painel.parentElement;
    if (painel.getBoundingClientRect().width <= 400) break;
  }
  const alvo = list ?? painel;
  const r = alvo?.getBoundingClientRect();
  const collapseBtn = document.querySelector('[data-test-id="creation-studio-activities-list-collapse"]');
  const expandBtn = [...document.querySelectorAll('button')].find((b) => /expandir lista/i.test(b.getAttribute('aria-label') ?? '') || /expandir lista/i.test(b.textContent ?? ''));
  const railIcones = [...document.querySelectorAll('button, [role="button"]')]
    .filter((el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.x < 320 && b.y > 150;
    }).length;
  return {
    listaVisivel: !!list && r.width > 5,
    larguraLista: r ? Math.round(r.width) : null,
    botaoRecolherVisivel: !!collapseBtn && collapseBtn.getBoundingClientRect().width > 0,
    botaoRecolherAria: collapseBtn?.getAttribute('aria-label') ?? null,
    botaoExpandirVisivel: !!expandBtn && expandBtn.getBoundingClientRect().width > 0,
    botaoExpandirAria: expandBtn?.getAttribute('aria-label') ?? expandBtn?.textContent?.trim() ?? null,
    elementosClicaveisColunaEsq: railIcones,
  };
});

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) break;
    if (i === 3) throw new Error('não hidratou');
  }
  await page.waitForTimeout(3000);

  // estado expandido
  summary.expandido = await painelInfo(page);
  console.log('EXPANDIDO:', JSON.stringify(summary.expandido, null, 2));
  await page.screenshot({ path: `${OUT}/v2-01-expandido.png` });

  // clicar o chevron de recolher
  await page.locator('[data-test-id="creation-studio-activities-list-collapse"]').click();
  await page.waitForTimeout(2000);
  summary.recolhido = await painelInfo(page);
  // o que sobra na coluna recolhida? (ícones/botões na faixa esquerda)
  summary.railRecolhido = await page.evaluate(() => {
    return [...document.querySelectorAll('button, [role="button"]')]
      .filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right < 320 && b.top > 140; })
      .map((el) => ({
        aria: el.getAttribute('aria-label'),
        tid: el.getAttribute('data-test-id'),
        txt: (el.textContent ?? '').trim().slice(0, 30),
      }));
  });
  console.log('RECOLHIDO:', JSON.stringify(summary.recolhido, null, 2));
  console.log('RAIL RECOLHIDO (controles na coluna):', JSON.stringify(summary.railRecolhido, null, 2));
  await page.screenshot({ path: `${OUT}/v2-02-recolhido.png` });

  // existe controle adicional de OCULTAR inteiramente? (procurar em ambos estados)
  summary.controlesOcultar = await page.evaluate(() => {
    const termos = /ocultar (lista|menu|painel)|esconder (lista|menu|painel)|hide (list|panel)/i;
    return [...document.querySelectorAll('button, [role="button"]')]
      .filter((el) => el.getBoundingClientRect().width > 0
        && termos.test(`${el.getAttribute('aria-label')} ${el.getAttribute('data-test-id')} ${el.textContent}`))
      .map((el) => ({ aria: el.getAttribute('aria-label'), tid: el.getAttribute('data-test-id') }));
  });
  console.log('CONTROLES DE OCULTAR INTEIRAMENTE:', JSON.stringify(summary.controlesOcultar));

  // expandir de volta
  const expandir = page.getByRole('button', { name: /expandir lista/i }).first();
  summary.temBotaoExpandir = await expandir.isVisible().catch(() => false);
  if (summary.temBotaoExpandir) {
    await expandir.click();
    await page.waitForTimeout(2000);
  }
  summary.reexpandido = await painelInfo(page);
  console.log('REEXPANDIDO:', JSON.stringify(summary.reexpandido, null, 2));
  await page.screenshot({ path: `${OUT}/v2-03-reexpandido.png` });

  summary.colapsoFunciona =
    summary.expandido.listaVisivel
    && summary.recolhido.listaVisivel === false
    && summary.temBotaoExpandir === true
    && summary.reexpandido.listaVisivel === true;
  console.log('COLAPSO FUNCIONA (recolhe e expande)?', summary.colapsoFunciona);
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
  await page.screenshot({ path: `${OUT}/v2-99-erro.png` }).catch(() => {});
}

writeFileSync(`${OUT}/resultado-v2.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
