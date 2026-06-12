// Validação retrabalho 19915 (LOCAL, não commitar no twygo-agents-qa)
// P2 Games: "Permitir marcar atividade como concluída manualmente" ON por
// padrão e BLOQUEADA. PR 10645 (CommonMarkCompletedSection isLocked).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19915';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19915, env: BASE, org: ORG, content: ID };
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

  // adicionar atividade tipo Games (clicar o tipo JÁ CRIA)
  await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
  await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('[data-test-id="creation-studio-type-selector-games"]').click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/01-apos-criar-games.png` });

  // form do Games deve abrir (ou achar o card novo e abrir o form)
  let formVisivel = await page.locator('[data-test-id^="studio-activity-form-"]').first().isVisible().catch(() => false);
  if (!formVisivel) {
    const depois = await cardIds();
    const novoId = depois.find((id) => !antes.includes(id));
    summary.novoId = novoId;
    if (!novoId) throw new Error('atividade Games não foi criada');
    await page.goto(`${BASE}/o/${ORG}/studio/activities/${novoId}/edit?type=games&eventId=${ID}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-test-id^="studio-activity-form-"]').first().waitFor({ state: 'visible', timeout: 20000 });
  }
  await page.waitForTimeout(2500);
  summary.formUrl = page.url().replace(BASE, '');
  console.log('FORM:', summary.formUrl);

  // achar o switch markCompleted
  const probe = async () => page.evaluate(() => {
    const input = document.querySelector('input[name="markCompleted"]');
    if (!input) return { existe: false };
    const wrapper = input.closest('label') ?? input.parentElement;
    return {
      existe: true,
      checked: input.checked,
      disabledAttr: input.disabled,
      ariaDisabled: wrapper?.getAttribute('aria-disabled') ?? input.getAttribute('aria-disabled'),
      dataDisabled: wrapper?.hasAttribute('data-disabled') ?? false,
    };
  });

  summary.estadoInicial = await probe();
  console.log('SWITCH markCompleted INICIAL:', JSON.stringify(summary.estadoInicial));

  // scrollar até o switch e screenshot
  await page.locator('input[name="markCompleted"]').evaluate((el) => el.closest('label,div')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/02-switch-on-bloqueado.png` });

  // tentar DESATIVAR (clique forçado no wrapper) — não pode mudar
  await page.locator('input[name="markCompleted"]').evaluate((el) => {
    const alvo = el.closest('label') ?? el;
    alvo.click();
  });
  await page.waitForTimeout(1000);
  summary.aposTentativaDesativar = await probe();
  console.log('APÓS TENTAR DESATIVAR:', JSON.stringify(summary.aposTentativaDesativar));
  await page.screenshot({ path: `${OUT}/03-apos-tentativa-desativar.png` });

  // tooltip de bloqueio presente? (texto da PR)
  summary.tooltipBloqueio = await page.evaluate(() =>
    document.body.innerHTML.includes('Obrigatório para este tipo de atividade'));
  console.log('TOOLTIP/TEXTO DE BLOQUEIO NO DOM?', summary.tooltipBloqueio);

  // CLEANUP: excluir o rascunho criado (pelo id novo)
  await gotoStudio();
  const depois2 = await cardIds();
  const novoId = summary.novoId ?? depois2.find((id) => !antes.includes(id));
  summary.novoId = novoId;
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

  summary.passou =
    summary.estadoInicial?.checked === true
    && (summary.estadoInicial?.disabledAttr === true || summary.estadoInicial?.ariaDisabled === 'true' || summary.estadoInicial?.dataDisabled === true)
    && summary.aposTentativaDesativar?.checked === true;
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
