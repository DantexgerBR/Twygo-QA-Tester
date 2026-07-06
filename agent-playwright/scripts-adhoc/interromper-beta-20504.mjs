import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const resultado = { card: 20504, fase: 'interromper-beta', env: BASE, org: ORG };

const browser = await chromium.launch({ headless: false, slowMo: 300 });
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
await page.screenshot({ path: `${OUT}/12-antes-interromper-beta.png`, fullPage: true });

const headersAntes = await page.evaluate(() => {
  const table = document.querySelector('table');
  return table ? [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' ')) : null;
});
console.log('[headers ANTES de interromper]', JSON.stringify(headersAntes));
resultado.headers_antes = headersAntes;

// Localiza e clica no botao "Interromper BETA teste"
const betaBtn = page.locator('#beta-testing-end-beta-test-button');
const betaBtnCount = await betaBtn.count();
console.log('[botao interromper beta] count:', betaBtnCount);
resultado.botao_encontrado = betaBtnCount > 0;

if (betaBtnCount > 0) {
  await betaBtn.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/12b-botao-visivel.png`, fullPage: true });
  await betaBtn.click();

  // Espera modal (role=dialog) montar - pode levar um instante
  let modalApareceu = false;
  let modalTexto = null;
  try {
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 5000 });
    modalApareceu = true;
    modalTexto = await dialog.first().innerText();
    console.log('[modal apareceu] texto:', modalTexto);
    await page.screenshot({ path: `${OUT}/12c-modal-confirmacao.png`, fullPage: true });
  } catch (e) {
    console.log('[modal] nao apareceu dentro do timeout:', e.message);
  }
  resultado.modal_apareceu = modalApareceu;
  resultado.modal_texto = modalTexto;

  if (modalApareceu) {
    // Modal e uma pesquisa de satisfacao NPS obrigatoria (nao um simples confirm/cancel).
    // Preenche os campos obrigatorios (marcados com *) deixando explicito que e acao de QA.
    const dialog = page.getByRole('dialog').first();
    resultado.modal_tipo = 'pesquisa-satisfacao-nps-obrigatoria';

    // 1) radio - nivel de satisfacao
    await dialog.getByText('Intuitivo', { exact: true }).click().catch(async (e) => {
      console.log('[modal] falha ao clicar radio Intuitivo:', e.message);
    });

    // 2) textarea - o que podemos fazer
    const textareas = dialog.locator('textarea');
    const textareaCount = await textareas.count();
    console.log('[modal] qtd textareas:', textareaCount);
    if (textareaCount > 0) {
      await textareas.nth(0).fill('Acao de QA para revalidacao do card 20504 (ordenacao de colunas) - nao e feedback real de usuario.');
    }

    // 3) escala 0-10 - clica no botao "8"
    await dialog.getByRole('button', { name: '8', exact: true }).click().catch((e) => {
      console.log('[modal] falha ao clicar escala 8:', e.message);
    });

    // 4) textarea - dificuldade tecnica
    if (textareaCount > 1) {
      await textareas.nth(1).fill('Nenhuma dificuldade tecnica; acao executada para fins de teste de QA (card 20504).');
    }

    // 5) checkbox obrigatorio - marca "Outro:" e descreve
    await dialog.getByText('Outro:', { exact: true }).click().catch((e) => {
      console.log('[modal] falha ao marcar checkbox Outro:', e.message);
    });
    const descrevaAqui = dialog.getByPlaceholder('Descreva aqui');
    if (await descrevaAqui.count().catch(() => 0)) {
      await descrevaAqui.fill('N/A - acao de QA, nao e avaliacao real de compra.');
    }

    await page.screenshot({ path: `${OUT}/12c2-modal-preenchido.png`, fullPage: true });

    // Enviar
    const enviarBtn = dialog.getByRole('button', { name: 'Enviar', exact: true });
    const enviarCount = await enviarBtn.count().catch(() => 0);
    console.log('[modal] botao Enviar count:', enviarCount);
    let confirmado = false;
    if (enviarCount > 0) {
      await enviarBtn.click();
      confirmado = true;
    }
    resultado.modal_confirmado_via = confirmado ? 'Enviar (pesquisa NPS preenchida)' : null;
    if (!confirmado) {
      const btns = await dialog.getByRole('button').allInnerTexts().catch(() => []);
      console.log('[modal] botoes disponiveis (fallback):', JSON.stringify(btns));
      resultado.modal_botoes_disponiveis = btns;
    }
  } else {
    resultado.acao = 'direta (sem modal)';
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT}/12d-apos-confirmar-interromper.png`, fullPage: true });
}

// Recarrega a listagem de Registros para ver estado pos-interrupcao
await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
await page.waitForSelector('table tbody tr', { timeout: 15000 }).catch(() => {});
await page.screenshot({ path: `${OUT}/13-listagem-pos-interromper.png`, fullPage: true });

const headersDepois = await page.evaluate(() => {
  const table = document.querySelector('table');
  return table ? [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' ')) : null;
});
console.log('[headers DEPOIS de interromper]', JSON.stringify(headersDepois));
resultado.headers_depois = headersDepois;

// Verifica se banner BETA ainda existe
const bannerBeta = await page.getByText(/modo BETA/i).count().catch(() => 0);
console.log('[banner BETA ainda presente?]', bannerBeta > 0);
resultado.banner_beta_ainda_presente = bannerBeta > 0;

writeFileSync(`${OUT}/resultado-interromper-beta.json`, JSON.stringify(resultado, null, 2));
console.log('\n[resultado-interromper-beta.json gravado]');

await browser.close();
