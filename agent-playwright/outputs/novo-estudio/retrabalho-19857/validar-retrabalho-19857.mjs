// Validação retrabalho 19857 v2 (LOCAL, não commitar no twygo-agents-qa)
// P1 SCORM no Estúdio. PR 10670. Fluxo correto: Dados(título) → Conteúdo →
// "Enviar arquivo" (modal c/ texto de extensões) → upload → Salvar → LIBERAR
// → preview admin → visão do aluno → cleanup.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const ZIP = 'test-assets/uploads/documents/scorm-qa19857.zip';
const OUT = 'outputs/novo-estudio/retrabalho-19857';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19857, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const page = await ctx.newPage();

const cardIds = (p) => p.evaluate(() =>
  [...document.querySelectorAll('[data-test-id^="creation-studio-activity-card-"]')]
    .map((el) => el.getAttribute('data-test-id'))
    .filter((t) => /^creation-studio-activity-card-\d+$/.test(t))
    .map((t) => t.match(/(\d+)$/)[1]));

async function gotoStudio(p) {
  for (let i = 1; i <= 3; i++) {
    await p.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await p.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) { await p.waitForTimeout(3000); return; }
  }
  throw new Error('não hidratou');
}

async function login(p, email, senha) {
  await p.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await p.fill('#user_email', email);
  await p.fill('#user_password', senha);
  await p.click('#user_submit');
  await p.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(3000);
}

try {
  await login(page, process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL, process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await gotoStudio(page);

  // criar atividade SCORM
  await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
  await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('[data-test-id="creation-studio-type-selector-scorm"]').click();
  await page.locator('[data-test-id^="studio-activity-form-"]').first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(2500);
  summary.novoId = (page.url().match(/activities\/(\d+)\//) ?? [])[1] ?? null;
  console.log('FORM:', page.url().replace(BASE, ''), '| novoId:', summary.novoId);

  // título na aba Dados
  const titulo = page.locator('input[name="title"]:visible').first();
  await titulo.fill('QA-19857-SCORM');

  // aba Conteúdo → Enviar arquivo (abre modal de upload)
  await page.getByRole('tab', { name: /conte[uú]do/i }).first().click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: /enviar arquivo/i }).first().click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/01-modal-upload-extensoes.png` });

  // texto de extensões aceitas (checar duplicação ".zip .zip")
  summary.textoExtensoes = await page.evaluate(() => {
    const els = [...document.querySelectorAll('p, span, div, label')]
      .filter((el) => /\.zip/i.test(el.textContent ?? '') && el.children.length <= 2 && el.getBoundingClientRect().width > 0)
      .map((el) => (el.textContent ?? '').trim().slice(0, 140));
    return [...new Set(els)].slice(0, 6);
  });
  summary.zipDuplicado = summary.textoExtensoes.some((t) => /\.zip[\s,;]*\.zip/i.test(t));
  console.log('TEXTOS .zip:', JSON.stringify(summary.textoExtensoes), '| DUPLICADO?', summary.zipDuplicado);

  // upload no input do modal (último input file adicionado / o visível no dialog)
  const inputs = page.locator('input[type="file"]');
  const n = await inputs.count();
  await inputs.nth(n - 1).setInputFiles(ZIP);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/02-apos-upload.png` });
  summary.uploadApareceu = await page.evaluate(() => /scorm-qa19857\.zip/i.test(document.body.innerText));
  console.log('NOME DO ARQUIVO NA TELA?', summary.uploadApareceu);

  // confirmar modal se houver botão (Enviar/Confirmar/Concluir) e salvar o form
  for (const nome of [/^enviar$/i, /confirmar/i, /concluir/i, /^ok$/i]) {
    const b = page.locator('[role="dialog"]').getByRole('button', { name: nome }).first();
    if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(2500); break; }
  }
  await page.locator('button:has-text("Salvar"):visible').first().click();
  await page.waitForTimeout(6000);
  summary.urlAposSalvar = page.url().replace(BASE, '');
  summary.toast = await page.evaluate(() => document.querySelector('.chakra-toast')?.textContent?.slice(0, 120) ?? null);
  console.log('APÓS SALVAR:', summary.urlAposSalvar, '| toast:', summary.toast);
  await page.screenshot({ path: `${OUT}/03-apos-salvar.png` });

  // voltar pro estúdio, abrir o card e LIBERAR antes de checar preview
  await gotoStudio(page);
  const closeCopilot = page.locator('[data-test-id="copilot-drawer-close"]');
  if (await closeCopilot.isVisible().catch(() => false)) { await closeCopilot.click(); await page.waitForTimeout(800); }
  const card = page.locator(`[data-test-id="creation-studio-activity-card-${summary.novoId}"]`);
  await card.scrollIntoViewIfNeeded();
  await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
  await page.waitForTimeout(3000);
  const locked = await card.locator('[data-test-id="creation-studio-activity-card-status-locked"]').isVisible().catch(() => false);
  if (locked) {
    await page.locator('[data-test-id="creation-studio-preview-toggle-status"]').evaluate((el) => el.click());
    await page.waitForTimeout(3000);
  }
  summary.liberada = await card.locator('[data-test-id="creation-studio-activity-card-status-released"]').isVisible().catch(() => false);
  console.log('LIBERADA?', summary.liberada);

  // preview admin — poll até 180s pelo SCORM renderizar
  const estadoPreview = async () => {
    let scormOk = false;
    for (const f of page.frames()) {
      const txt = await f.evaluate(() => document.body?.innerText ?? '').catch(() => '');
      if (/SCORM-19857 carregou com sucesso/.test(txt)) scormOk = true;
    }
    const paneTxt = await page.evaluate(() =>
      (document.querySelector('[data-test-id="creation-studio-preview-pane"]')?.textContent ?? ''));
    return {
      scormCarregouNoIframe: scormOk,
      temErroPagina: /não existe|Desculpe|Desconhecido/i.test(paneTxt),
      temIframe: await page.locator('[data-test-id="creation-studio-preview-pane"] iframe').count(),
      paneResumo: paneTxt.replace(/\s+/g, ' ').slice(0, 200),
    };
  };
  let prev = await estadoPreview();
  const t0 = Date.now();
  while (!prev.scormCarregouNoIframe && !prev.temErroPagina && Date.now() - t0 < 180000) {
    await page.waitForTimeout(15000);
    await card.locator('[data-test-id="creation-studio-activity-card-title"]').click().catch(() => {});
    await page.waitForTimeout(4000);
    prev = await estadoPreview();
    console.log(`[poll ${Math.round((Date.now() - t0) / 1000)}s]`, JSON.stringify(prev));
  }
  summary.previewAdmin = prev;
  console.log('PREVIEW ADMIN:', JSON.stringify(prev, null, 2));
  await page.screenshot({ path: `${OUT}/04-preview-admin.png` });

  // visão do aluno
  const ctxB = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
  const aluno = await ctxB.newPage();
  await login(aluno, 'dante.tavares@twygo.com', '123456');
  await aluno.goto(`${BASE}/e/${ID}/learn`, { waitUntil: 'domcontentloaded' });
  await aluno.waitForTimeout(10000);
  const item = aluno.getByText(/QA-19857-SCORM/i).first();
  summary.alunoAchouAtividade = await item.isVisible().catch(() => false);
  console.log('ALUNO ACHOU A ATIVIDADE?', summary.alunoAchouAtividade);
  if (summary.alunoAchouAtividade) {
    await item.click();
    await aluno.waitForTimeout(12000);
    let scormAlunoOk = false;
    for (const f of aluno.frames()) {
      const txt = await f.evaluate(() => document.body?.innerText ?? '').catch(() => '');
      if (/SCORM-19857 carregou com sucesso/.test(txt)) scormAlunoOk = true;
    }
    const bodyTxt = await aluno.evaluate(() => document.body.innerText.slice(0, 800));
    summary.alunoScormCarregou = scormAlunoOk;
    summary.alunoTemErro = /não existe|Desculpe|Desconhecido/i.test(bodyTxt);
    console.log('ALUNO: SCORM carregou?', scormAlunoOk, '| erro?', summary.alunoTemErro);
  }
  await aluno.screenshot({ path: `${OUT}/05-visao-aluno.png` });
  await ctxB.close();

  // CLEANUP
  await gotoStudio(page);
  if (await closeCopilot.isVisible().catch(() => false)) { await closeCopilot.click(); await page.waitForTimeout(800); }
  await card.scrollIntoViewIfNeeded();
  await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
  await page.waitForTimeout(2000);
  await page.locator('[data-test-id="creation-studio-preview-delete"]').evaluate((el) => el.click());
  const dialog = page.locator('[data-test-id="creation-studio-preview-delete-dialog"]');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  await dialog.getByRole('button', { name: /excluir/i }).evaluate((el) => el.click());
  await page.waitForTimeout(3000);
  summary.seedExcluida = !(await cardIds(page)).includes(summary.novoId);
  console.log('SEED EXCLUÍDA?', summary.seedExcluida);

  summary.passou = summary.zipDuplicado === false
    && summary.previewAdmin?.scormCarregouNoIframe === true
    && summary.previewAdmin?.temErroPagina === false
    && summary.alunoScormCarregou === true && summary.alunoTemErro === false;
  console.log('PASSOU?', summary.passou);
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
  await page.screenshot({ path: `${OUT}/99-erro.png` }).catch(() => {});
}

writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
