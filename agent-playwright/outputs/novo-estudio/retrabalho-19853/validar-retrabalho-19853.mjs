// Validação retrabalho 19853 (LOCAL, não commitar no twygo-agents-qa)
// P2 Corpo do conteúdo da Página corta o início de texto grande colado.
// PR 10638: scroll passa pro PRÓPRIO Slate ([data-slate-editor] overflowY auto).
// Seed descartável: cria Página, cola texto longo, verifica que dá pra rolar
// até a 1ª linha; exclui a seed (NUNCA salva — sem risco pro curso).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19853';
mkdirSync(OUT, { recursive: true });

const PRIMEIRA_LINHA = 'INICIO-19853 A Biologia Celular, ou Citologia, e o ramo da biologia que estuda a estrutura das celulas.';
const TEXTO = [PRIMEIRA_LINHA, ...Array.from({ length: 60 }, (_, i) =>
  `Paragrafo ${i + 2} do texto longo colado para validar o corte do corpo do conteudo no editor da pagina.`)].join('\n');

const summary = { card: 19853, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();

const cardIds = () => page.evaluate(() =>
  [...document.querySelectorAll('[data-test-id^="creation-studio-activity-card-"]')]
    .map((el) => el.getAttribute('data-test-id'))
    .filter((t) => /^creation-studio-activity-card-\d+$/.test(t))
    .map((t) => t.match(/(\d+)$/)[1]));

async function gotoStudio() {
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) { await page.waitForTimeout(3000); return; }
  }
  throw new Error('não hidratou');
}

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await gotoStudio();

  const antes = await cardIds();

  // seed: criar Página (clicar tipo JÁ CRIA e abre o form)
  await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
  await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('[data-test-id="creation-studio-type-selector-page"]').click();
  await page.locator('[data-test-id="studio-activity-form-page"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(2500);
  summary.formUrl = page.url().replace(BASE, '');
  summary.novoId = (summary.formUrl.match(/activities\/(\d+)\//) ?? [])[1] ?? null;
  console.log('FORM:', summary.formUrl, '| novoId:', summary.novoId);

  // achar a aba/área do editor de conteúdo (creation-studio-activity-modal-page-editor)
  let editorBox = page.locator('[data-test-id="creation-studio-activity-modal-page-editor"]');
  if (!(await editorBox.isVisible().catch(() => false))) {
    // procurar aba "Conteúdo" dentro do form
    const abas = await page.evaluate(() =>
      [...document.querySelectorAll('[role="tab"]')].filter((t) => t.getBoundingClientRect().width > 0)
        .map((t) => ({ txt: t.textContent?.trim(), tid: t.getAttribute('data-test-id') })));
    console.log('ABAS DO FORM:', JSON.stringify(abas));
    summary.abasForm = abas;
    const abaConteudo = page.getByRole('tab', { name: /conte[uú]do/i }).first();
    if (await abaConteudo.isVisible().catch(() => false)) {
      await abaConteudo.click();
      await page.waitForTimeout(2500);
    }
  }
  await editorBox.waitFor({ state: 'visible', timeout: 15000 });
  await page.screenshot({ path: `${OUT}/01-editor-vazio.png` });

  // colar texto longo no Slate (focus + insertText = caminho do paste)
  const slate = page.locator('[data-test-id="creation-studio-activity-modal-page-editor"] [data-slate-editor="true"]').first();
  await slate.click();
  await page.waitForTimeout(500);
  await page.keyboard.insertText(TEXTO);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/02-apos-colar-fim-do-texto.png` });

  // teste fiel ao card: rolar TUDO pro topo e verificar se a 1ª linha é visível
  // (no bug, a 1ª linha ficava clipada pela borda superior mesmo com scroll no topo)
  summary.medidas = await page.evaluate((primeira) => {
    // zerar scroll de TODOS os ancestrais scrolláveis + window
    const alvo = [...document.querySelectorAll('[data-slate-editor="true"] *, [data-slate-editor="true"]')]
      .filter((el) => (el.textContent ?? '').includes('INICIO-19853'))
      .sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
    if (!alvo) return { contemPrimeiraLinha: false };
    let anc = alvo.parentElement;
    while (anc) { if (anc.scrollHeight > anc.clientHeight + 4) anc.scrollTop = 0; anc = anc.parentElement; }
    window.scrollTo(0, 0);
    const r = alvo.getBoundingClientRect();
    // ancestral que CLIPA (overflow hidden/auto/scroll)
    let clip = alvo.parentElement; let clipRect = null;
    while (clip) {
      const ov = getComputedStyle(clip).overflowY;
      if (ov === 'hidden' || ov === 'auto' || ov === 'scroll') { clipRect = clip.getBoundingClientRect(); break; }
      clip = clip.parentElement;
    }
    return {
      contemPrimeiraLinha: true,
      topoDaPrimeiraLinha: Math.round(r.top),
      alturaViewport: window.innerHeight,
      visivelNoViewport: r.top >= 0 && r.top < window.innerHeight && r.height > 0,
      clipAncestorTop: clipRect ? Math.round(clipRect.top) : null,
      clipadaPeloAncestral: clipRect ? r.top < clipRect.top - 2 : false,
      texto: (alvo.textContent ?? '').slice(0, 60),
    };
  }, PRIMEIRA_LINHA);
  console.log('MEDIDAS (topo):', JSON.stringify(summary.medidas, null, 2));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/03-scroll-no-topo-primeira-linha.png` });

  // CLEANUP: excluir a seed SEM salvar
  await gotoStudio();
  const novoId = summary.novoId ?? (await cardIds()).find((id) => !antes.includes(id));
  if (novoId) {
    const closeCopilot = page.locator('[data-test-id="copilot-drawer-close"]');
    if (await closeCopilot.isVisible().catch(() => false)) { await closeCopilot.click(); await page.waitForTimeout(800); }
    const card = page.locator(`[data-test-id="creation-studio-activity-card-${novoId}"]`);
    await card.scrollIntoViewIfNeeded();
    await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
    await page.waitForTimeout(2000);
    await page.locator('[data-test-id="creation-studio-preview-delete"]').evaluate((el) => el.click());
    const dialog = page.locator('[data-test-id="creation-studio-preview-delete-dialog"]');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await dialog.getByRole('button', { name: /excluir/i }).evaluate((el) => el.click());
    await page.waitForTimeout(3000);
    summary.seedExcluida = !(await cardIds()).includes(novoId);
    console.log('SEED EXCLUÍDA?', summary.seedExcluida);
  }

  const m = summary.medidas;
  summary.passou = !!m && m.contemPrimeiraLinha && m.visivelNoViewport && !m.clipadaPeloAncestral;
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
