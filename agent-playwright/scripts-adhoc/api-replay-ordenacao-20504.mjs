import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

// Rodada 4 — validação DEFINITIVA do PR 10991 via API order_by/order_type.
// Para cada campo do card, ordena asc+desc e checa se a resposta veio em ordem
// NUMÉRICA/CRONOLÓGICA (fix ok) ou LEXICOGRÁFICA (bug persiste — "trata número
// como texto"). Endpoint real capturado no gate: GET /api/v1/o/37079/records.
const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const EMAIL = process.env.T_EMAIL || 'devtestes@teste.com';
const PASSWORD = process.env.T_PASSWORD || '123456';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const NUMERIC = [
  { field: 'content_value', label: 'Valor do conteúdo' },
  { field: 'progress_score', label: 'Progresso' },
  { field: 'final_score', label: 'Desempenho' },
  { field: 'workload_seconds', label: 'Carga horária (controle — já mapeado pré-PR)' },
];
const DATES = [
  { field: 'start_date', label: 'Data de início' },
  { field: 'end_date', label: 'Data de término' },
  { field: 'approved_at', label: 'Data de aprovação' },
  { field: 'certificate_date', label: 'Data do certificado' },
  { field: 'expiration_date', label: 'Data de validade' },
];

// compara sequência retornada (só não-nulos) contra sort numérico e sort string
function analisar(valores, kind, dir) {
  const naoNulos = valores.filter((v) => v !== null && v !== undefined && v !== '');
  const asNum = (v) => (kind === 'date' ? Date.parse(v) : Number(v));
  const numSorted = [...naoNulos].sort((a, b) => (dir === 'asc' ? asNum(a) - asNum(b) : asNum(b) - asNum(a)));
  const strSorted = [...naoNulos].sort((a, b) => {
    const c = String(a).localeCompare(String(b));
    return dir === 'asc' ? c : -c;
  });
  const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);
  // monotonicidade estrita da sequência RETORNADA na escala numérica/data
  let monotonic = true;
  for (let i = 1; i < naoNulos.length; i++) {
    const a = asNum(naoNulos[i - 1]);
    const b = asNum(naoNulos[i]);
    if (dir === 'asc' ? a > b : a < b) { monotonic = false; break; }
  }
  return {
    contagem_nao_nulos: naoNulos.length,
    bate_com_numerico: eq(naoNulos, numSorted),
    bate_com_lexicografico: eq(naoNulos, strSorted),
    // discrimina numérico de lexicográfico? (só quando as duas ordens divergem)
    lex_diverge_de_num: !eq(numSorted, strSorted),
    monotonico_na_escala_correta: monotonic,
    // valores DISTINTOS na ordem retornada — a prova legível do bug
    distintos_em_ordem: [...new Set(naoNulos)].slice(0, 20),
  };
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const page = await ctx.newPage();
await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(3000);

async function pegarValores(field, dir) {
  const url = `${BASE}/api/v1/o/${ORG}/records?per_page=300&page=1&order_by=${field}&order_type=${dir}`;
  const resp = await ctx.request.get(url);
  const json = await resp.json();
  const records = json?.data?.records || [];
  return { status: resp.status(), valores: records.map((r) => r[field]) };
}

const resultados = [];
for (const { field, label } of [...NUMERIC, ...DATES]) {
  const kind = DATES.some((d) => d.field === field) ? 'date' : 'number';
  const linha = { field, label, kind };
  for (const dir of ['asc', 'desc']) {
    const { status, valores } = await pegarValores(field, dir);
    linha[dir] = { http: status, ...analisar(valores, kind, dir) };
  }
  // veredito do campo: passa se ambas direções batem com a ordem numérica/data
  // e NÃO estão presas na lexicográfica (quando as duas ordens divergem)
  linha.ok = linha.asc.bate_com_numerico && linha.desc.bate_com_numerico
    && linha.asc.monotonico_na_escala_correta && linha.desc.monotonico_na_escala_correta;
  resultados.push(linha);
  console.log(`[${field}] (${label}) asc.num=${linha.asc.bate_com_numerico} desc.num=${linha.desc.bate_com_numerico} asc.lex=${linha.asc.bate_com_lexicografico} n_asc=${linha.asc.contagem_nao_nulos} -> ${linha.ok ? 'OK' : 'CHECAR'}`);
}

const todosOk = resultados.every((r) => r.ok);
const out = { card: 20504, pr: 10991, rodada: 4, data: '2026-07-07', env: BASE, org: ORG, endpoint: '/api/v1/o/37079/records?order_by=<campo>&order_type=asc|desc', todos_campos_ok: todosOk, resultados };
writeFileSync(`${OUT}/api-replay-ordenacao.json`, JSON.stringify(out, null, 2));
console.log('\n=== TODOS OS CAMPOS OK:', todosOk, '===');

await browser.close();
