import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const resultado = { card: 20504, fase: 'pos-beta-explorar-e-ordenar', env: BASE, org: ORG };

function isSorted(arr, dir) {
  for (let i = 1; i < arr.length; i++) {
    if (dir === 'asc' && arr[i] < arr[i - 1]) return false;
    if (dir === 'desc' && arr[i] > arr[i - 1]) return false;
  }
  return true;
}

function parseCargaHoraria(text) {
  const t = (text || '').trim();
  if (t === '-' || t === '—' || t === '') return null;
  const hMatch = t.match(/(\d+)h/);
  const mMatch = t.match(/(\d+)m/);
  const sMatch = t.match(/(\d+)s/);
  const h = hMatch ? parseInt(hMatch[1], 10) : 0;
  const m = mMatch ? parseInt(mMatch[1], 10) : 0;
  const s = sMatch ? parseInt(sMatch[1], 10) : 0;
  if (!hMatch && !mMatch && !sMatch) return null;
  return h * 3600 + m * 60 + s;
}

const browser = await chromium.launch({ headless: false, slowMo: 200 });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' })).newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);

await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const npsLater = page.getByRole('button', { name: 'Pergunte depois' });
if (await npsLater.count().catch(() => 0)) { await npsLater.click().catch(() => {}); await page.waitForTimeout(1000); }
await page.waitForSelector('table tbody tr', { timeout: 15000 }).catch(() => {});

// 1) Headers atuais (pos-interrupcao) - fonte de verdade fresca
const headers = await page.evaluate(() => {
  const table = document.querySelector('table');
  return table ? [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' ')) : null;
});
console.log('[headers pos-BETA]', JSON.stringify(headers));
resultado.headers_pos_beta = headers;

// Confere se banner BETA / badge BETA no menu ainda existem
const bannerBeta = await page.getByText(/modo BETA/i).count().catch(() => 0);
const badgeBetaMenu = await page.locator('text=BETA').count().catch(() => 0);
resultado.banner_beta_presente = bannerBeta > 0;
resultado.badges_beta_count_pagina = badgeBetaMenu;
console.log('[banner beta presente?]', bannerBeta > 0, '| badges BETA na pagina (Skills/Planos ainda tem):', badgeBetaMenu);

await page.screenshot({ path: `${OUT}/13-listagem-pos-interromper.png`, fullPage: true });

// 2) Checa scroll horizontal na tabela (mesma logica do script anterior)
const scrollInfo = await page.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  const info = [];
  let el = table;
  for (let i = 0; i < 5 && el; i++) {
    info.push({ tag: el.tagName, cls: el.className, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
    el = el.parentElement;
  }
  return info;
});
resultado.scroll_chain_pos_beta = scrollInfo;
console.log('[scroll chain pos-beta]', JSON.stringify(scrollInfo));

// 3) Verifica se ha nova aba "Provedores" (apareceu no screenshot) - so registra, nao testa ordenacao la (fora do escopo do card)
const tabProvedores = await page.getByRole('tab', { name: 'Provedores' }).or(page.getByText('Provedores', { exact: true })).count().catch(() => 0);
resultado.aba_provedores_encontrada = tabProvedores > 0;
console.log('[aba Provedores encontrada?]', tabProvedores > 0);

// 4) Testa "Extrair dados" para ver se o arquivo exportado tem mais colunas (so registra clique/abertura de menu, sem baixar de fato se possivel evitar)
let extrairInfo;
try {
  const extrairBtn = page.getByRole('button', { name: 'Extrair dados' });
  const cnt = await extrairBtn.count();
  if (cnt > 0) {
    await extrairBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/13b-extrair-dados-menu.png`, fullPage: true });
    const menuTexto = await page.locator('body').innerText();
    extrairInfo = { clicado: true, screenshot: '13b-extrair-dados-menu.png' };
    // fecha o menu clicando fora, sem confirmar exportacao (evita gerar/baixar arquivo real sem necessidade)
    await page.keyboard.press('Escape').catch(() => {});
  } else {
    extrairInfo = { clicado: false, motivo: 'botao nao encontrado' };
  }
} catch (e) {
  extrairInfo = { clicado: false, erro: e.message };
}
resultado.extrair_dados = extrairInfo;
console.log('[extrair dados]', JSON.stringify(extrairInfo));

await page.waitForTimeout(500);

// 5) ORDENACAO nas colunas disponiveis - deriva indice pelo header por NOME (nao hardcode)
async function dumpColunaPorNome(nomeHeader) {
  await page.waitForSelector('table tbody tr', { timeout: 15000 });
  return page.evaluate((nome) => {
    const table = document.querySelector('table');
    const ths = [...table.querySelectorAll('thead th')];
    const idx = ths.findIndex((th) => th.textContent.trim().replace(/\s+/g, ' ').includes(nome));
    if (idx === -1) return { idx: -1, valores: null };
    const trs = [...table.querySelectorAll('tbody tr')];
    const valores = trs.map((tr) => tr.querySelectorAll('td')[idx]?.textContent.trim().replace(/\s+/g, ' ') ?? null);
    return { idx, valores };
  }, nomeHeader);
}

const colunasOrdenaveis = headers.filter((h) => h && h.trim() !== '');
console.log('[colunas candidatas a ordenacao]', JSON.stringify(colunasOrdenaveis));
resultado.colunas_candidatas = colunasOrdenaveis;

const resultadosOrdenacao = {};

// Carga horaria - unica numerica conhecida
{
  const nome = 'Carga horária';
  const headerBtn = page.locator('th', { hasText: nome }).first();
  const cntBtn = await headerBtn.count();
  if (cntBtn > 0) {
    const antes = await dumpColunaPorNome(nome);
    await headerBtn.click();
    await page.waitForTimeout(1200);
    const asc = await dumpColunaPorNome(nome);
    await page.screenshot({ path: `${OUT}/14-carga-horaria-asc.png`, fullPage: true });
    await headerBtn.click();
    await page.waitForTimeout(1200);
    const desc = await dumpColunaPorNome(nome);
    await page.screenshot({ path: `${OUT}/15-carga-horaria-desc.png`, fullPage: true });

    const ascParsed = asc.valores.map(parseCargaHoraria).filter((v) => v !== null);
    const descParsed = desc.valores.map(parseCargaHoraria).filter((v) => v !== null);
    resultadosOrdenacao[nome] = {
      indice_coluna: asc.idx,
      antes_raw: antes.valores,
      asc_raw: asc.valores,
      asc_parsed_segundos: ascParsed,
      asc_correto: isSorted(ascParsed, 'asc'),
      desc_raw: desc.valores,
      desc_parsed_segundos: descParsed,
      desc_correto: isSorted(descParsed, 'desc'),
    };
    console.log(`[${nome}] asc_correto=${resultadosOrdenacao[nome].asc_correto} desc_correto=${resultadosOrdenacao[nome].desc_correto}`);
    console.log(`[${nome}] asc_raw=`, JSON.stringify(asc.valores));
    console.log(`[${nome}] desc_raw=`, JSON.stringify(desc.valores));
  } else {
    resultadosOrdenacao[nome] = { erro: 'header nao encontrado' };
  }
}

resultado.resultados_ordenacao = resultadosOrdenacao;

// 6) Colunas do card AINDA nao presentes - confirma explicitamente
const colunasDoCard = ['Valor do conteúdo', 'Progresso', 'Desempenho', 'Data de início', 'Data de término', 'Data de aprovação', 'Data do certificado', 'Data de validade'];
const colunasDoCardPresentes = colunasDoCard.filter((c) => headers.some((h) => h && h.includes(c.split(' ')[0])));
resultado.colunas_do_card_presentes_apos_interromper_beta = colunasDoCardPresentes;
resultado.colunas_do_card_ausentes = colunasDoCard.filter((c) => !colunasDoCardPresentes.includes(c));
console.log('[colunas do card ainda ausentes]', JSON.stringify(resultado.colunas_do_card_ausentes));

// 7) Tenta reverter o BETA - procura opcao de reativar
let reverterInfo;
try {
  // opcao comum: badge "BETA" clicavel no menu lateral, ou link no banner que sumiu.
  // Verifica se ha algo em Configuracoes
  await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const reativarBtn = page.getByRole('button', { name: /reativar.*beta|voltar.*beta|iniciar.*beta/i }).or(page.getByText(/reativar.*beta|voltar.*beta|iniciar.*beta/i));
  const cntReativar = await reativarBtn.count().catch(() => 0);
  reverterInfo = { tentado: true, botao_reativar_encontrado: cntReativar > 0 };
  if (cntReativar > 0) {
    await reativarBtn.first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/16-tentativa-reverter-beta.png`, fullPage: true });
    reverterInfo.screenshot = '16-tentativa-reverter-beta.png';
  } else {
    await page.screenshot({ path: `${OUT}/16-sem-opcao-reverter-beta.png`, fullPage: true });
    reverterInfo.screenshot = '16-sem-opcao-reverter-beta.png';
    reverterInfo.observacao = 'Nenhum botao/link de reativacao do BETA encontrado na tela de Registros. Badge "BETA" ao lado do menu "Registros" desapareceu (visivel em Skills e Planos e Metas ainda). Acao parece IRREVERSIVEL pela UI.';
  }
} catch (e) {
  reverterInfo = { tentado: true, erro: e.message };
}
resultado.reverter_beta = reverterInfo;
console.log('[reverter beta]', JSON.stringify(reverterInfo));

writeFileSync(`${OUT}/resultado-pos-beta.json`, JSON.stringify(resultado, null, 2));
console.log('\n[resultado-pos-beta.json gravado]');

await browser.close();
