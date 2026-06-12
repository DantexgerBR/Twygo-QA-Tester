// Validação retrabalho 19855 v2 (LOCAL, não commitar no twygo-agents-qa)
// Config real: select "Exibição das Perguntas" na aba Conteúdo do form do
// questionário (só com lista de perguntas vinculada). Mutação com REVERT no
// quiz "Avaliação do curso" (9288197).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533'; const QUIZ = '9288197';
const OUT = 'outputs/novo-estudio/retrabalho-19855';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19855, quiz: QUIZ, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();

async function abrirFormConteudo() {
  await page.goto(`${BASE}/o/${ORG}/studio/activities/${QUIZ}/edit?type=questions&eventId=${ID}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  await page.getByRole('tab', { name: /conte[uú]do/i }).first().click();
  await page.waitForTimeout(4000);
}

// o select "Exibição das Perguntas" — acha pelo label anterior
const selectInfo = () => page.evaluate(() => {
  const sels = [...document.querySelectorAll('select')].filter((s) => s.getBoundingClientRect().width > 0 || s.offsetParent !== null || true);
  for (const s of sels) {
    const opts = [...s.options].map((o) => ({ value: o.value, text: o.text }));
    if (opts.some((o) => /aleat|mesmas perguntas/i.test(o.text))) {
      return { achou: true, value: s.value, options: opts };
    }
  }
  return { achou: false, totalSelects: sels.length };
});

const setSelect = (value) => page.evaluate((value) => {
  const sels = [...document.querySelectorAll('select')];
  for (const s of sels) {
    if ([...s.options].some((o) => /aleat|mesmas perguntas/i.test(o.text))) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
      setter.call(s, value);
      s.dispatchEvent(new Event('change', { bubbles: true }));
      return s.value;
    }
  }
  return null;
}, value);

async function salvar() {
  await page.locator('button:has-text("Salvar")').first().evaluate((el) => el.click());
  await page.waitForTimeout(4000);
}

async function abrirPreviewDoQuiz() {
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) break;
    if (i === 3) throw new Error('não hidratou');
  }
  await page.waitForTimeout(3000);
  const closeCopilot = page.locator('[data-test-id="copilot-drawer-close"]');
  if (await closeCopilot.isVisible().catch(() => false)) { await closeCopilot.click(); await page.waitForTimeout(800); }
  const card = page.locator(`[data-test-id="creation-studio-activity-card-${QUIZ}"]`);
  await card.scrollIntoViewIfNeeded();
  await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
  await page.waitForTimeout(4500);
  return page.evaluate(() => {
    const el = document.querySelector('[data-test-id="question-list-random-order-warning"]');
    return {
      avisoExiste: !!el,
      avisoVisivel: !!el && el.getBoundingClientRect().width > 0,
      avisoTexto: el ? (el.textContent ?? '').trim().slice(0, 160) : null,
    };
  });
}

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // 1) ler config atual (pra revert)
  await abrirFormConteudo();
  summary.configOriginal = await selectInfo();
  console.log('CONFIG ORIGINAL:', JSON.stringify(summary.configOriginal, null, 2));
  if (!summary.configOriginal.achou) throw new Error('select Exibição das Perguntas não encontrado');
  const valorOriginal = summary.configOriginal.value;
  const opcaoAleatoria = summary.configOriginal.options.find((o) => /aleat/i.test(o.text));
  if (!opcaoAleatoria) throw new Error('opção aleatória não existe no select');
  summary.opcaoAleatoria = opcaoAleatoria;

  // 2) ligar aleatório + salvar
  await setSelect(opcaoAleatoria.value);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/04-select-aleatorio.png` });
  await salvar();
  console.log('SALVO COM ALEATÓRIO:', opcaoAleatoria.text);

  // 3) preview → aviso deve aparecer
  summary.avisoComAleatorio = await abrirPreviewDoQuiz();
  console.log('AVISO (aleatório ON):', JSON.stringify(summary.avisoComAleatorio, null, 2));
  await page.screenshot({ path: `${OUT}/05-preview-aviso-aleatorio.png` });

  // 4) REVERT + salvar
  await abrirFormConteudo();
  await setSelect(valorOriginal);
  await page.waitForTimeout(800);
  await salvar();
  summary.revertido = (await (async () => { await abrirFormConteudo(); return selectInfo(); })()).value === valorOriginal;
  console.log('REVERTIDO PRO ORIGINAL?', summary.revertido);

  // 5) contra-prova: aviso some sem aleatório
  summary.avisoSemAleatorio = await abrirPreviewDoQuiz();
  console.log('AVISO (revertido):', JSON.stringify(summary.avisoSemAleatorio, null, 2));
  await page.screenshot({ path: `${OUT}/06-preview-sem-aviso-revertido.png` });

  summary.passou = summary.avisoComAleatorio?.avisoVisivel === true
    && summary.avisoSemAleatorio?.avisoVisivel === false
    && summary.revertido === true;
  console.log('PASSOU?', summary.passou);
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
  await page.screenshot({ path: `${OUT}/99-erro-v2.png` }).catch(() => {});
}

writeFileSync(`${OUT}/resultado-v2.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
