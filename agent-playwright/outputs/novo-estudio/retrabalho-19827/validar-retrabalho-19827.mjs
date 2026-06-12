// Validação retrabalho 19827 (LOCAL, não commitar no twygo-agents-qa)
// P1 Botão "Editar" do preview nunca habilita (sem PR vinculada — checar live).
// + recon do type-selector (tipos disponíveis) pros cards 19915/19857.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19827';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19827, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();

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

  const estadoEditar = () => page.evaluate(() => {
    const b = document.querySelector('[data-test-id="creation-studio-preview-edit"]');
    return b ? { existe: true, disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' } : { existe: false };
  });

  summary.semSelecao = await estadoEditar();
  console.log('SEM ATIVIDADE ABERTA:', JSON.stringify(summary.semSelecao));

  // abrir atividade PAI "Conteúdo 1" (9288189)
  await page.locator('[data-test-id="creation-studio-activity-card-9288189"] [data-test-id="creation-studio-activity-card-title"]').click();
  await page.waitForTimeout(2500);
  summary.paiSelecionado = await estadoEditar();
  console.log('PAI "Conteúdo 1" ABERTO:', JSON.stringify(summary.paiSelecionado));
  await page.screenshot({ path: `${OUT}/01-pai-selecionado-editar.png` });

  // clicar Editar (se habilitado) → form abre?
  if (summary.paiSelecionado.existe && !summary.paiSelecionado.disabled) {
    await page.locator('[data-test-id="creation-studio-preview-edit"]').click();
    await page.waitForTimeout(3000);
    summary.formAposEditarPai = await page.evaluate(() => {
      const form = document.querySelector('[data-test-id^="studio-activity-form-"], [data-test-id*="activity-modal"]');
      return { abriu: !!form, testId: form?.getAttribute('data-test-id') ?? null, url: location.pathname + location.search };
    });
    console.log('FORM APÓS EDITAR (pai):', JSON.stringify(summary.formAposEditarPai));
    await page.screenshot({ path: `${OUT}/02-form-aberto-pai.png` });
    // voltar pro estúdio
    await page.goBack().catch(() => {});
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-test-id="creation-studio-activities-list"]').waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(3000);
  }

  // sub-atividade "Material de apoio" (9288190)
  await page.locator('[data-test-id="creation-studio-activity-card-9288190"] [data-test-id="creation-studio-activity-card-title"]').click();
  await page.waitForTimeout(2500);
  summary.subSelecionada = await estadoEditar();
  console.log('SUB "Material de apoio" ABERTA:', JSON.stringify(summary.subSelecionada));
  await page.screenshot({ path: `${OUT}/03-sub-selecionada-editar.png` });
  if (summary.subSelecionada.existe && !summary.subSelecionada.disabled) {
    await page.locator('[data-test-id="creation-studio-preview-edit"]').click();
    await page.waitForTimeout(3000);
    summary.formAposEditarSub = await page.evaluate(() => {
      const form = document.querySelector('[data-test-id^="studio-activity-form-"], [data-test-id*="activity-modal"]');
      return { abriu: !!form, testId: form?.getAttribute('data-test-id') ?? null, url: location.pathname + location.search };
    });
    console.log('FORM APÓS EDITAR (sub):', JSON.stringify(summary.formAposEditarSub));
    await page.screenshot({ path: `${OUT}/04-form-aberto-sub.png` });
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-test-id="creation-studio-activities-list"]').waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(3000);
  }

  // RECON: tipos do drawer Adicionar (pros cards Games/SCORM)
  await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
  await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);
  summary.tiposDisponiveis = await page.evaluate(() =>
    [...document.querySelectorAll('[data-test-id^="creation-studio-type-selector-"]')]
      .filter((el) => el.getAttribute('data-test-id') !== 'creation-studio-type-selector-drawer')
      .map((el) => ({ tid: el.getAttribute('data-test-id'), txt: (el.textContent ?? '').trim().slice(0, 40) })));
  console.log('TIPOS NO DRAWER:', JSON.stringify(summary.tiposDisponiveis, null, 2));
  await page.screenshot({ path: `${OUT}/05-type-selector.png` });
  await page.keyboard.press('Escape');

  summary.passou =
    summary.paiSelecionado?.existe && summary.paiSelecionado?.disabled === false
    && summary.subSelecionada?.existe && summary.subSelecionada?.disabled === false
    && summary.formAposEditarPai?.abriu === true && summary.formAposEditarSub?.abriu === true;
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
