import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { safeGoto, dismissCommonModals } from '../../src/utils/modals.js';
import { getOrgId } from '../../src/utils/environment.js';

/**
 * Spec one-shot pra criar aluno COM SENHA via fluxo Inscrição (drawer "Adicionar"
 * em curso) — replica `matricularAluno` mas estende com expansão da seção
 * "Senha" (h3 colapsado).
 *
 * **Fluxo do drawer "Adicionar" em curso** (validado live 2026-05-28):
 *   1. /o/{orgId}/events?tab=events&profile=admin (listagem cursos)
 *   2. Filtra curso por nome → kebab → "Inscrição" → drawer "Lista de Participantes"
 *   3. Clica "Adicionar" → form completo abre (Informações Pessoais / Endereço /
 *      Dados Profissionais / **Senha** [colapsada])
 *   4. Fill email / nome / sobrenome (3 obrigatórios)
 *   5. **Expandir h3 Senha**: <h3 onclick="$('.create_password').toggleClass('hidden')">Senha</h3>
 *   6. Fill #password + #password_confirmation
 *   7. Salvar → contador Confirmados +1 → drawer reset OR fecha
 *   8. user_id capturado via API V2 (GET /api/v2/users?email=)
 *
 * **Output**: console com email + senha + user_id (pra próximos steps).
 * Email único por run: `aluno-engajamento-w<N>-<ts>@example.com`.
 *
 * Como rodar:
 *   RUN_SEED_ALUNO_ENGAJAMENTO=1 PROJECT=recertificacao npx playwright test --project=chromium tests/setup/seed-aluno-engajamento.spec.ts --reporter=list
 */
const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
const COURSE_NAME = 'Curso com atividades';

test('Bootstrap aluno com senha pra fluxo de engajamento', async ({ browser }, testInfo) => {
  test.skip(
    !process.env.RUN_SEED_ALUNO_ENGAJAMENTO,
    'Spec one-shot. Roda só com: RUN_SEED_ALUNO_ENGAJAMENTO=1 npx playwright test --project=chromium tests/setup/seed-aluno-engajamento.spec.ts --reporter=list',
  );

  const context = await browser.newContext({ storageState: STORAGE_PATH });
  const page = await context.newPage();

  try {
    const ts = Date.now();
    const email = `aluno-engajamento-w${testInfo.workerIndex}-${ts}@example.com`;
    const firstName = 'AlunoEngaj';
    const lastName = `W${testInfo.workerIndex}T${ts}`;
    const senha = 'Senha123!';
    const orgId = getOrgId();

    console.log(`[SEED] Email: ${email}`);
    console.log(`[SEED] Senha: ${senha}`);

    // 1. Listagem de cursos
    await safeGoto(page, `/o/${orgId}/events?tab=events&profile=admin`);
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

    // 2. Filtra curso por nome
    console.log(`[SEED] Filtrando curso "${COURSE_NAME}"...`);
    await page.getByPlaceholder(/Pesquise aqui/i).fill(COURSE_NAME);
    const row = page.locator('tr, [role="row"]').filter({ hasText: COURSE_NAME }).first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });

    // 3. Kebab → Inscrição
    console.log(`[SEED] Abrindo kebab → Inscrição...`);
    const kebab = row
      .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
      .or(row.getByRole('button', { name: 'more_vert' }))
      .first();
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();
    await page.getByRole('menuitem', { name: /Inscrição/i }).first().click();

    // 4. Aguarda drawer "Lista de Participantes"
    await page.getByRole('heading', { name: /Lista de Participantes/i }).first()
      .waitFor({ state: 'visible', timeout: 15_000 });

    // 5. Clica "Adicionar" → abre form completo
    console.log(`[SEED] Clicando Adicionar...`);
    const addBtn = page.getByText('Adicionar', { exact: true }).first();
    await addBtn.waitFor({ state: 'visible', timeout: 5_000 });
    await addBtn.click();
    await page.getByRole('heading', { name: /^Adicionar$/i }).first()
      .waitFor({ state: 'visible', timeout: 10_000 });

    // 6. Preenche campos obrigatórios
    console.log(`[SEED] Preenchendo email/nome/sobrenome...`);
    await page.getByRole('textbox', { name: /E-?mail\*/i }).first().fill(email);
    await page.getByRole('textbox', { name: /^Nome\*$/i }).fill(firstName);
    await page.getByRole('textbox', { name: /^Sobrenome\*$/i }).fill(lastName);

    // 7. EXPANDIR h3 "Senha" (colapsado por default).
    // Validado live 2026-05-28 via chrome-devtools-mcp:
    //   - h3 "Senha" tem onclick="$('.create_password').toggleClass('hidden'); ..."
    //   - Posição y≈1490px no DOM — form Twygo Materialize é grande
    //   - state:'visible' falha pelo viewport check; o h3 só vira "attached"
    //     no Playwright depois que o React/Materialize de fato renderiza a
    //     seção, o que aparentemente exige scroll progressivo.
    //   - Fix: scroll programático em window + scrollIntoViewIfNeeded.
    console.log(`[SEED] Expandindo seção Senha...`);
    // Scroll progressivo até o final do form pra forçar render de todos os h3.
    await page.evaluate(async () => {
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    // Selector específico via :has-text — evita strict mode warning
    // que o page.locator('h3', { hasText }) pode gerar com multiple matches.
    const senhaH3 = page.locator('h3:has-text("Senha")').first();
    await senhaH3.scrollIntoViewIfNeeded();
    await senhaH3.click();
    // Inputs ficam visíveis após toggleClass('hidden') no .create_password
    await page.locator('#password').waitFor({ state: 'visible', timeout: 5_000 });

    // 8. Preenche senha + confirmação
    await page.locator('#password').fill(senha);
    await page.locator('#password_confirmation').fill(senha);

    // 9. Salvar
    console.log(`[SEED] Salvando...`);
    await dismissCommonModals(page);
    await page.getByRole('button', { name: 'Salvar', exact: true }).click();

    // 10. Confirma volta pra "Lista de Participantes"
    await page.getByRole('heading', { name: /Lista de Participantes/i }).first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    console.log(`[SEED] Aluno inscrito. Verificando user_id via API...`);

    // 11. Captura user_id via API V2
    const token = process.env.API_TOKEN!;
    const baseUrl = process.env.API_BASE_URL || `https://recertificacao-testeqa.stage.twygoead.com`;
    const apiResponse = await page.request.get(
      `${baseUrl}/api/v2/users?email=${encodeURIComponent(email)}&page=1&per_page=1`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
    );
    expect(apiResponse.status(), `GET /api/v2/users falhou`).toBe(200);
    const body = await apiResponse.json();
    const users = body.data?.users || [];
    const userId = users[0]?.id || users[0]?.user_id;

    console.log('');
    console.log('============================================================');
    console.log('[SEED] SUCESSO. Aluno criado + inscrito:');
    console.log(`         email:    ${email}`);
    console.log(`         senha:    ${senha}`);
    console.log(`         user_id:  ${userId ?? '(não encontrado via API — investigar)'}`);
    console.log(`         curso:    ${COURSE_NAME} (807403)`);
    console.log('');
    console.log('[NEXT STEP] Login como aluno + completar atividades.');
    console.log('============================================================');
  } finally {
    await context.close();
  }
});
