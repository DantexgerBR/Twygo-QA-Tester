import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

function parseCargaHoraria(text) {
  // formatos observados: "10m", "1h", "4h", "10h", "40h" (h e m podem combinar "1h30m")
  const t = text.trim();
  if (t === '-' || t === '—' || t === '') return null;
  const hMatch = t.match(/(\d+)h/);
  const mMatch = t.match(/(\d+)m/);
  const h = hMatch ? parseInt(hMatch[1], 10) : 0;
  const m = mMatch ? parseInt(mMatch[1], 10) : 0;
  if (!hMatch && !mMatch) return null;
  return h * 60 + m;
}

function isSorted(arr, dir) {
  for (let i = 1; i < arr.length; i++) {
    if (dir === 'asc' && arr[i] < arr[i - 1]) return false;
    if (dir === 'desc' && arr[i] > arr[i - 1]) return false;
  }
  return true;
}

const browser = await chromium.launch({ headless: true });
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

await page.waitForSelector('table tbody tr', { timeout: 15000 });
await page.screenshot({ path: `${OUT}/02-antes-sort-carga-horaria.png`, fullPage: true });

async function dumpColuna(colIndex) {
  await page.waitForSelector('table tbody tr', { timeout: 15000 });
  return page.evaluate((idx) => {
    const table = document.querySelector('table');
    const trs = [...table.querySelectorAll('tbody tr')];
    return trs.map((tr) => tr.querySelectorAll('td')[idx]?.textContent.trim().replace(/\s+/g, ' ') ?? null);
  }, colIndex);
}

// coluna "Carga horária" = indice 8 (0-based) conforme recon: "", Pessoa, Conteúdo, Origem, Criado por, Provedor, Situação, Certificado, Carga horária, ""
const headerCargaHoraria = page.getByRole('columnheader', { name: /Carga horária/i }).or(page.locator('th', { hasText: 'Carga horária' }));
const headerBtn = page.locator('th', { hasText: 'Carga horária' }).first();

const antes = await dumpColuna(8);
console.log('[carga horaria] antes:', JSON.stringify(antes));

await headerBtn.click();
await page.waitForTimeout(1500);
const asc = await dumpColuna(8);
console.log('[carga horaria] apos 1o clique (esperado asc):', JSON.stringify(asc));
await page.screenshot({ path: `${OUT}/03-carga-horaria-1o-clique.png`, fullPage: true });

await headerBtn.click();
await page.waitForTimeout(1500);
const desc = await dumpColuna(8);
console.log('[carga horaria] apos 2o clique (esperado desc):', JSON.stringify(desc));
await page.screenshot({ path: `${OUT}/04-carga-horaria-2o-clique.png`, fullPage: true });

const ascParsed = asc.map(parseCargaHoraria).filter((v) => v !== null);
const descParsed = desc.map(parseCargaHoraria).filter((v) => v !== null);
const ascOk = isSorted(ascParsed, 'asc');
const descOk = isSorted(descParsed, 'desc');
console.log('[carga horaria] ascParsed:', JSON.stringify(ascParsed), 'ascOk:', ascOk);
console.log('[carga horaria] descParsed:', JSON.stringify(descParsed), 'descOk:', descOk);

// tentativa limpa no toggle grid_view / reorder (Material Symbols ligature via getByText)
let colunasApósToggle = null;
try {
  const gridToggle = page.getByText('grid_view', { exact: true }).first();
  const gridCount = await gridToggle.count();
  console.log('[toggle] grid_view count:', gridCount);
  if (gridCount) {
    await gridToggle.click({ force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/05-apos-toggle-grid.png`, fullPage: true });
    colunasApósToggle = await page.evaluate(() => {
      const table = document.querySelector('table');
      return table ? [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' ')) : 'sem-tabela-apos-toggle';
    });
    console.log('[toggle] colunas apos grid_view:', JSON.stringify(colunasApósToggle));
  }
} catch (e) {
  console.log('[toggle] erro:', e.message);
}

const resultado = {
  card: 20504,
  pr: 'https://github.com/Twygo/twyg-app/pull/10991',
  env: BASE,
  org: ORG,
  colunas_tabela_atual: ['Pessoa', 'Conteúdo', 'Origem', 'Criado por', 'Provedor', 'Situação', 'Certificado', 'Carga horária'],
  carga_horaria: {
    antes,
    apos_1_clique_raw: asc,
    apos_1_clique_parsed_minutos: ascParsed,
    ascendente_correto: ascOk,
    apos_2_clique_raw: desc,
    apos_2_clique_parsed_minutos: descParsed,
    descendente_correto: descOk,
  },
  toggle_grid_view: {
    tentado: true,
    colunas_resultantes: colunasApósToggle,
  },
  colunas_pendentes_nao_testadas: ['Progresso', 'Desempenho', 'Valor do conteúdo', 'Data de início', 'Data de término', 'Data de aprovação', 'Data do certificado', 'Data de validade'],
  observacao_colunas_pendentes: 'Campos confirmados no formulário de Editar registro (/o/37079/records/{id}/edit): Desempenho, Valor do conteúdo, Datas (início/término/aprovação/certificado/validade). NÃO aparecem como colunas na tabela atual da listagem de Registros (8 colunas de dado no DOM, sem controle de customização de colunas encontrado). O vídeo do bug (jam.dev, 03/07/2026) mostra uma tabela com essas colunas presentes — sugere mudança de versão/modo da tabela entre a gravação do bug e o Stage atual (banner ativo: "modo BETA da funcionalidade Registros de avaliação"). Não foi possível confirmar se essas colunas ficam visíveis em outro modo/rota.',
};
writeFileSync(`${OUT}/resultado.json`, JSON.stringify(resultado, null, 2));
console.log('\n[resultado.json gravado]');

await browser.close();
