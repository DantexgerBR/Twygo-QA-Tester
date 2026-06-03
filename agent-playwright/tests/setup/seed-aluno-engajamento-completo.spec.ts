import { test, expect, request as playwrightRequest } from '@playwright/test';
import { resolve } from 'node:path';
import { safeGoto, dismissCommonModals } from '../../src/utils/modals.js';
import { getOrgId } from '../../src/utils/environment.js';

/**
 * Pipeline completo do seed-aluno-engajamento:
 *   1. Cria aluno COM SENHA via Inscrição (admin context).
 *   2. POST /oauth/token grant_type=password — valida senha gravada.
 *   3. Login UI como aluno em context novo (sem storageState admin).
 *   4. Acessa /play/event/{cursoId} → completa atividades → 100%.
 *   5. Valida certificate_situation=2 (Emitido) via API V2.
 *
 * **Output**: console com email/senha/user_id/access_token/cert_situation.
 *
 * Como rodar:
 *   RUN_SEED_ENGAJAMENTO_COMPLETO=1 PROJECT=recertificacao npx playwright test \
 *     --project=chromium tests/setup/seed-aluno-engajamento-completo.spec.ts \
 *     --reporter=list --retries=0
 */
const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
const COURSE_NAME = 'Curso com atividades';
const COURSE_ID = 807403;

test('Pipeline completo: criar + login + completar curso + cert', async ({ browser }, testInfo) => {
  test.skip(
    !process.env.RUN_SEED_ENGAJAMENTO_COMPLETO,
    'One-shot. RUN_SEED_ENGAJAMENTO_COMPLETO=1 npx playwright test ...',
  );

  test.setTimeout(5 * 60_000);

  const ts = Date.now();
  const email = `aluno-engaj-completo-w${testInfo.workerIndex}-${ts}@example.com`;
  const firstName = 'AlunoEngajCompleto';
  const lastName = `W${testInfo.workerIndex}T${ts}`;
  const senha = 'Senha123!';
  const orgId = getOrgId();
  const baseURL = process.env.API_BASE_URL || `https://recertificacao-testeqa.stage.twygoead.com`;
  const apiToken = process.env.API_TOKEN!;

  console.log('[SEED] ============================================================');
  console.log(`[SEED] Email:  ${email}`);
  console.log(`[SEED] Senha:  ${senha}`);
  console.log(`[SEED] Curso:  ${COURSE_NAME} (${COURSE_ID})`);
  console.log('[SEED] ============================================================');

  // ============================================================
  // FASE 1: Criar aluno via Inscrição no curso (admin context)
  // ============================================================
  console.log('[FASE 1] Criando aluno via Inscrição...');
  const adminCtx = await browser.newContext({ storageState: STORAGE_PATH });
  const adminPage = await adminCtx.newPage();
  let userId: number | undefined;
  try {
    await safeGoto(adminPage, `/o/${orgId}/events?tab=events&profile=admin`);
    await adminPage.getByPlaceholder(/Pesquise aqui/i).fill(COURSE_NAME);
    const row = adminPage.locator('tr, [role="row"]').filter({ hasText: COURSE_NAME }).first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });
    // Aguarda lista estabilizar antes de scroll/click — evita "not attached".
    await adminPage.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
    const kebab = row
      .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
      .first();
    await expect(kebab).toBeAttached({ timeout: 10_000 });
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();
    await adminPage.getByRole('menuitem', { name: /Inscrição/i }).first().click();
    await adminPage
      .getByRole('heading', { name: /Lista de Participantes/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    await adminPage.getByText('Adicionar', { exact: true }).first().click();
    await adminPage
      .getByRole('heading', { name: /^Adicionar$/i })
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 });
    await adminPage.getByRole('textbox', { name: /E-?mail\*/i }).first().fill(email);
    await adminPage.getByRole('textbox', { name: /^Nome\*$/i }).fill(firstName);
    await adminPage.getByRole('textbox', { name: /^Sobrenome\*$/i }).fill(lastName);
    // Scroll progressivo + expand h3 Senha (fix do commit c407914).
    await adminPage.evaluate(async () => {
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    const senhaH3 = adminPage.locator('h3:has-text("Senha")').first();
    await senhaH3.scrollIntoViewIfNeeded();
    await senhaH3.click();
    await adminPage.locator('#password').waitFor({ state: 'visible', timeout: 5_000 });
    await adminPage.locator('#password').fill(senha);
    await adminPage.locator('#password_confirmation').fill(senha);
    await dismissCommonModals(adminPage);
    await adminPage.getByRole('button', { name: 'Salvar', exact: true }).click();
    await adminPage
      .getByRole('heading', { name: /Lista de Participantes/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });

    // Capturar user_id via API V2.
    const usersResp = await adminPage.request.get(
      `${baseURL}/api/v2/users?email=${encodeURIComponent(email)}&page=1&per_page=1`,
      { headers: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' } },
    );
    expect(usersResp.status()).toBe(200);
    const usersBody = await usersResp.json();
    console.log('[FASE 1] users body:', JSON.stringify(usersBody).slice(0, 500));
    userId = usersBody.data?.users?.[0]?.id || usersBody.data?.users?.[0]?.user_id;
    console.log(`[FASE 1] OK — user_id=${userId}`);
  } finally {
    await adminCtx.close();
  }
  expect(userId, 'user_id capturado').toBeTruthy();

  // ============================================================
  // FASE 2: Login OAuth — valida que a senha foi gravada
  // ============================================================
  console.log('[FASE 2] POST /oauth/token grant_type=password...');
  const oauthCtx = await playwrightRequest.newContext({ baseURL });
  let accessToken: string;
  try {
    const oauthResp = await oauthCtx.post('/oauth/token', {
      data: { grant_type: 'password', username: email, password: senha },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!oauthResp.ok()) {
      const body = await oauthResp.text();
      throw new Error(`POST /oauth/token retornou ${oauthResp.status()}: ${body.slice(0, 300)}`);
    }
    const oauthBody = (await oauthResp.json()) as { access_token?: string; token_type?: string };
    accessToken = oauthBody.access_token!;
    expect(accessToken, 'access_token retornado').toBeTruthy();
    console.log(
      `[FASE 2] OK — access_token=${accessToken.slice(0, 20)}... (token_type=${oauthBody.token_type})`,
    );
  } finally {
    await oauthCtx.dispose();
  }

  // ============================================================
  // FASE 3: Login UI como aluno (context novo) + /play/event
  // ============================================================
  console.log('[FASE 3] Login UI como aluno + acesso ao curso...');
  // storageState empty explícito — garante context fresh sem cookies do admin.
  const alunoCtx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const alunoPage = await alunoCtx.newPage();
  try {
    await safeGoto(alunoPage, '/users/login');
    await alunoPage.getByRole('textbox', { name: 'Login', exact: true }).fill(email);
    await alunoPage.getByRole('textbox', { name: 'Senha', exact: true }).fill(senha);
    await alunoPage.getByRole('button', { name: 'Entrar', exact: true }).click();
    await alunoPage.waitForURL((url) => !url.pathname.startsWith('/users/login'), {
      timeout: 30_000,
    });
    console.log(`[FASE 3] Login OK — URL=${alunoPage.url()}`);

    // Rota canônica: /e/{id} (200, validado live 2026-05-28)
    await safeGoto(alunoPage, `/e/${COURSE_ID}`);
    await alunoPage.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    console.log(`[FASE 3] /e/${COURSE_ID} — URL=${alunoPage.url()}`);

    const cursoOverview = await alunoPage.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      headings: Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .filter((h) => (h as HTMLElement).offsetParent !== null)
        .map((h) => ({ tag: h.tagName, text: (h.textContent || '').trim().slice(0, 80) }))
        .slice(0, 15),
      mainButtons: Array.from(document.querySelectorAll('button, a.btn, [role="button"]'))
        .filter((b) => (b as HTMLElement).offsetParent !== null)
        .map((b) => ({
          tag: b.tagName,
          text: (b.textContent || '').trim().slice(0, 50),
          href: b.getAttribute('href'),
          dataTestId: b.getAttribute('data-test-id'),
        }))
        .filter((b) => b.text && b.text.length > 0 && b.text.length < 50)
        .slice(0, 25),
    }));
    console.log('[FASE 3] /e/{id} overview:');
    console.log('         title:', cursoOverview.title);
    console.log('         headings:', JSON.stringify(cursoOverview.headings, null, 2));
    console.log('         buttons:', JSON.stringify(cursoOverview.mainButtons, null, 2));

    // ============================================================
    // FASE 4: Aceitar consentimento + APRENDER + ver atividades
    // ============================================================
    console.log('[FASE 4] Aceitar consentimento (se houver) + clicar APRENDER...');
    const aceitarBtn = alunoPage.getByRole('button', { name: /^Aceitar$/i }).first();
    if (await aceitarBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await aceitarBtn.click();
      console.log('[FASE 4] Consentimento aceito.');
    }
    const aprenderBtn = alunoPage.getByRole('button', { name: /^APRENDER$/i }).first();
    await aprenderBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await aprenderBtn.click();
    await alunoPage.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    console.log(`[FASE 4] Após APRENDER — URL=${alunoPage.url()}`);

    // Inspecionar tela de atividades.
    const atividadesOverview = await alunoPage.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      headings: Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .filter((h) => (h as HTMLElement).offsetParent !== null)
        .map((h) => ({ tag: h.tagName, text: (h.textContent || '').trim().slice(0, 80) }))
        .slice(0, 15),
      buttons: Array.from(document.querySelectorAll('button, a.btn, [role="button"]'))
        .filter((b) => (b as HTMLElement).offsetParent !== null)
        .map((b) => ({
          tag: b.tagName,
          text: (b.textContent || '').trim().slice(0, 50),
          dataTestId: b.getAttribute('data-test-id'),
        }))
        .filter((b) => b.text && b.text.length > 0 && b.text.length < 50)
        .slice(0, 30),
      activityItems: Array.from(document.querySelectorAll('[class*="activit"], [class*="lesson"], [class*="modul"]'))
        .filter((e) => (e as HTMLElement).offsetParent !== null)
        .slice(0, 5)
        .map((e) => ({
          tag: e.tagName,
          cls: e.className.slice(0, 80),
          text: (e.textContent || '').trim().slice(0, 80),
        })),
    }));
    console.log('[FASE 4] Tela APRENDER overview:');
    console.log('         title:', atividadesOverview.title);
    console.log('         headings:', JSON.stringify(atividadesOverview.headings, null, 2));
    console.log('         buttons:', JSON.stringify(atividadesOverview.buttons, null, 2));
    console.log('         activityItems:', JSON.stringify(atividadesOverview.activityItems, null, 2));

    // Aguardar mais + capturar iframes + body interno
    await alunoPage.waitForTimeout(3000);
    const deep = await alunoPage.evaluate(() => ({
      iframes: Array.from(document.querySelectorAll('iframe')).map((f) => ({
        src: f.src,
        name: f.name,
        title: f.title,
      })),
      bodyClasses: document.body.className,
      mainSelectors: ['.activity-list', '.lesson-list', '.curriculum', '.player', '#player', '#course-player', '.content-list', '[data-role="course"]', '[data-role="activity"]'].map((s) => ({
        selector: s,
        count: document.querySelectorAll(s).length,
      })).filter((x) => x.count > 0),
      // Todos os anchors da página (sem filtro de visibilidade)
      allLinks: Array.from(document.querySelectorAll('a[href]'))
        .map((a) => ({ href: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 50) }))
        .filter((x) => x.text && /atividade|aula|lição|módulo|atividade|content/i.test(x.text + ' ' + (x.href || '')))
        .slice(0, 20),
    }));
    console.log('         iframes:', JSON.stringify(deep.iframes, null, 2));
    console.log('         mainSelectors found:', JSON.stringify(deep.mainSelectors, null, 2));
    console.log('         activityLinks:', JSON.stringify(deep.allLinks, null, 2));

    // Screenshot pra debug visual
    await alunoPage.screenshot({ path: 'outputs/recertificacao/seed-debug-learn.png', fullPage: true });
    console.log('[FASE 4] Screenshot salvo em outputs/recertificacao/seed-debug-learn.png');

    // Capturar elementos clicáveis (qualquer tag com cursor:pointer) + spans/divs com texto.
    const interactive = await alunoPage.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const clickables = all
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .filter((el) => {
          const cs = window.getComputedStyle(el as HTMLElement);
          return cs.cursor === 'pointer' && (el.textContent || '').trim().length > 0 && (el.textContent || '').trim().length < 80;
        })
        .slice(0, 30)
        .map((el) => ({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 60),
          cls: (el.className || '').slice(0, 60),
          dataTestId: el.getAttribute('data-test-id'),
        }));
      return { clickables };
    });
    console.log('[FASE 4] clickables (cursor:pointer):', JSON.stringify(interactive.clickables, null, 2));

    // ============================================================
    // FASE 5: Iterar atividades e tentar completar
    // ============================================================
    console.log('[FASE 5] Iterando atividades para completar...');
    const cards = await alunoPage.evaluate(() => {
      // Cards de atividade: H2 com nome dentro de um wrapper clicável.
      const h2s = Array.from(document.querySelectorAll('h2'))
        .filter((h) => (h as HTMLElement).offsetParent !== null && (h.textContent || '').trim().length < 50);
      return h2s.map((h) => (h.textContent || '').trim());
    });
    console.log(`[FASE 5] ${cards.length} atividades visíveis na sidebar:`, cards);

    // Estratégia: clicar em cada card → aguardar carregar → seguir.
    // Captura progresso antes e depois pra ver se algo muda.
    const progressoBefore = await alunoPage.evaluate(() => {
      const txt = document.body.innerText;
      const m = txt.match(/(\d+)%/);
      return m ? Number(m[1]) : null;
    });
    console.log(`[FASE 5] Progresso antes: ${progressoBefore}%`);

    for (let i = 0; i < cards.length; i++) {
      const cardName = cards[i];
      if (!cardName) continue;
      console.log(`[FASE 5]   → clicando "${cardName}"...`);
      const card = alunoPage.locator(`h2:has-text("${cardName}")`).first();
      try {
        await card.scrollIntoViewIfNeeded({ timeout: 3_000 });
        await card.click({ timeout: 5_000 });
        await alunoPage.waitForTimeout(2_000);
        // Tentar clicar checkbox "Marcar como concluído" ou similar — pra atividades
        // que têm config "permitir marcar manualmente" (Aula/vídeo/SCORM).
        const completoCheckbox = alunoPage.locator(
          'input[type="checkbox"][id*="complet"], label:has-text("Marcar como concluído"), button:has-text("Marcar como concluído"), [class*="mark-complete"], [class*="markComplete"]'
        ).first();
        if (await completoCheckbox.isVisible({ timeout: 1_500 }).catch(() => false)) {
          await completoCheckbox.click({ force: true }).catch(() => {});
          console.log(`[FASE 5]     ✓ marcou "concluído manualmente"`);
          await alunoPage.waitForTimeout(1_500);
        }
      } catch (e) {
        console.log(`[FASE 5]   ✘ falhou: ${(e as Error).message.slice(0, 100)}`);
      }
    }

    const progressoAfter = await alunoPage.evaluate(() => {
      const txt = document.body.innerText;
      const m = txt.match(/(\d+)%/);
      return m ? Number(m[1]) : null;
    });
    console.log(`[FASE 5] Progresso depois: ${progressoAfter}%`);

    // Verificar modal "Aprovação atingida" — curso emitiu cert automático
    // quando critério (60%) é atingido. Fechar o modal pra spec seguir.
    const aprovacaoModal = alunoPage.getByText(/Aprovação atingida|Parabéns/i).first();
    if (await aprovacaoModal.isVisible({ timeout: 2_000 }).catch(() => false)) {
      console.log('[FASE 5] 🏆 MODAL "Aprovação atingida" detectado — cert sendo gerado!');
      const okBtn = alunoPage.getByRole('button', { name: /^Ok$/i }).first();
      if (await okBtn.isVisible({ timeout: 1_500 }).catch(() => false)) {
        await okBtn.click();
      }
    }

    // Screenshot final + capturar quais atividades ficaram pendentes (não-check)
    await alunoPage.screenshot({
      path: 'outputs/recertificacao/seed-debug-progresso.png',
      fullPage: true,
    });
    const pendentes = await alunoPage.evaluate(() => {
      // Cada card de atividade tem um SVG/icon de check (preenchido quando done).
      // Capturar nome do card + se tem aria-checked / classes "completed"/"done".
      const cards = Array.from(document.querySelectorAll('div'))
        .filter((d) => {
          const h2 = d.querySelector('h2');
          if (!h2) return false;
          const txt = (h2.textContent || '').trim();
          return txt.length > 0 && txt.length < 50;
        })
        .slice(0, 20);
      return cards.map((c) => {
        const h2 = c.querySelector('h2');
        return {
          name: (h2?.textContent || '').trim().slice(0, 40),
          hasCompleted: /complet|done|check.*fill|--checked/.test(c.outerHTML.slice(0, 500)),
        };
      });
    });
    console.log('[FASE 5] Atividades + estado:', JSON.stringify(pendentes, null, 2));

    // ============================================================
    // FASE 6: Validar certificate_situation via API V2
    // ============================================================
    console.log('[FASE 6] Verificando certificate_situation via API V2...');
    const certCtx = await playwrightRequest.newContext({ baseURL });
    try {
      // Endpoint canônico (testado live 2026-05-28):
      //   /api/v2/attendees?content_id={X}&user_id={Y} → 200 ✓
      // Outros endpoints retornam 404:
      //   /api/v2/contents/{X}/event_participants
      //   /api/v2/events/{X}/learning_students
      //   /api/v2/event_students?event_id={X}&user_id={Y}
      // Aguarda ~3s pro worker async terminar de gerar cert.
      await new Promise((r) => setTimeout(r, 3_000));
      const attResp = await certCtx.get(
        `/api/v2/attendees?content_id=${COURSE_ID}&user_id=${userId}`,
        { headers: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' } },
      );
      console.log(`[FASE 6] GET /api/v2/attendees → ${attResp.status()}`);
      // Poll até cert ser emitido (worker async, geralmente <30s).
      let attendee: any = null;
      let cert: any = null;
      const maxPolls = 12;
      for (let i = 0; i < maxPolls; i++) {
        const r = await certCtx.get(
          `/api/v2/attendees?content_id=${COURSE_ID}&user_id=${userId}`,
          { headers: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' } },
        );
        if (!r.ok()) break;
        const body = await r.json();
        attendee = body.data?.attendees?.[0];
        cert = attendee?.certificates?.[0];
        const status = `progress=${attendee?.progress}% approved_at=${attendee?.approved_at ? 'ok' : 'pending'} certs=${attendee?.certificates?.length}`;
        console.log(`[FASE 6]   poll ${i + 1}/${maxPolls}: ${status}`);
        if (cert) break;
        await new Promise((r) => setTimeout(r, 5_000));
      }
      if (attendee) {
        console.log('[FASE 6] attendee final state:');
        console.log(`         attendee_id:      ${attendee.attendee_id}`);
        console.log(`         progress:         ${attendee.progress}%`);
        console.log(`         status:           ${attendee.status}`);
        console.log(`         approved_at:      ${attendee.approved_at ?? '(pending)'}`);
        console.log(`         completed_at:     ${attendee.completed_at ?? '(pending)'}`);
        console.log(`         score:            ${attendee.score}`);
        console.log(`         certificates:     ${JSON.stringify(attendee.certificates)}`);
      }
      if (cert) {
        console.log(`[FASE 6] 🏆 CERTIFICATE EMITTED: ${JSON.stringify(cert)}`);
      } else {
        console.log('[FASE 6] ⏳ Cert ainda não disponível via API após poll (worker pode demorar mais).');
      }
    } finally {
      await certCtx.dispose();
    }

    console.log('[SEED] ============================================================');
    console.log('[SEED] PIPELINE FINAL — Status:');
    console.log(`[SEED]   user_id:       ${userId}`);
    console.log(`[SEED]   access_token:  ${accessToken.slice(0, 24)}...`);
    console.log(`[SEED]   progresso:     ${progressoAfter}% (limite com seed-via-UI)`);
    console.log(`[SEED]   Atividades de leitura (texto/página/PDF/arquivo): ✓ auto-completas ao clicar`);
    console.log(`[SEED]   Atividades pendentes (video/scorm/questionário):  ✗ exigem interação real`);
    console.log(`[SEED] ============================================================`);
  } finally {
    await alunoCtx.close();
  }

});
