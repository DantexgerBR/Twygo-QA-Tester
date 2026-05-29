import { test, expect } from '../../../../../src/fixtures/seed-fixtures.js';
import * as allure from 'allure-js-commons';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';

const STORAGE_PATH = 'outputs/.auth/storage.json';

test.describe.configure({ timeout: 15 * 60 * 1000 });

test.describe('Isolamento de Progresso, Score e Attendance por Inscrição', () => {
  // ============================================================================
  // HISTÓRICO DE FALHAS:
  //
  // v1 (2026-05-27): usava curso 806755 / recertificacaoever1@twygo.com.
  //   Falha: POST /api/v1/.../event_participants → HTTP 422 "Error Inesperado"
  //   (bug de produto confirmado via chrome-devtools-mcp em sessão humana).
  //
  // v2 (2026-05-29): migrado para curso 807287 / richard.sebold@twygo.com
  //   após diagnóstico: waitForResponse 20s timeout sem POST saindo do browser
  //   no curso 806755. Causa: frontend bloqueia silenciosamente.
  //   Solução tentada: trocar seed + substituir waitForResponse por toast assertion.
  //   Falha persistiu: toast não vem em 10s mesmo após click em "Iniciar reinscrição".
  //   Causa raiz confirmada: todos os participants de richard.sebold têm cert
  //   "Pendente" — backend silencia a ação (frontend não exibe toast de erro,
  //   não dispara POST) quando o participant mais recente já está em estado
  //   "Pendente" (não "Emitido"). Screenshot trace 2026-05-29 confirmou
  //   menu aberto + item highlighted mas sem POST saindo.
  //
  // v3 (2026-05-29): migrado para `alunoAprovadoNoCursoFixoSeed` — aluno
  //   worker-isolated com cert EMITIDO no curso 807403 ("Curso com atividades",
  //   has_recertification=true). Pré-condição correta: cert Emitido → botão
  //   Reinscrever habilitado → POST disparado → toast de sucesso.
  //
  // DECISÃO USUÁRIO 2026-05-29: validações de progresso/cert são via UI
  // menu Aprendizagem (admin-side), não banco. TC1 valida que novo participant
  // aparece na listagem com progress=0 após reinscrição.
  //
  // NOTA CLEANUP: fixture alunoAprovadoNoCursoFixoSeed desmatricula o aluno
  // ao final — mas participants criados pela reinscrição permanecem no env
  // (sem UI de "deletar participant"). Sem impacto real: aluno é worker-isolated
  // (email único por run) — não conflita com outras runs.
  // ============================================================================

  test.beforeAll(async ({ browser }) => {
    // Pré-condição RN 1: feature flag :recertificacao ON para a org.
    // Idempotente — no-op se já estiver ON (estado atual do env dedicado).
    await ensureFlipperActor(browser, {
      envName: 'staging-recertificacao',
      storageStatePath: STORAGE_PATH,
      flag: 'recertificacao',
      actor: `Organization;${getOrgId()}`,
      enabled: true,
    });
  });

  test(
    'TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição',
    { tag: '@seed-heavy' },
    async ({ page, alunoAprovadoNoCursoFixoSeed }) => {
      // Skill provisionar-seed v1.7.x (2026-05-29): após 7 iterações de heal:
      //   v1: curso 806755 + recertificacaoever1@twygo.com → 422 silencioso
      //   v2: curso 807287 + richard.sebold@twygo.com → todos Pendente
      //   v3: alunoAprovadoNoCursoFixoSeed → matriculou OK, fixture completou
      //   v4-v5: SeedAdminPage findEventRowAndClickKebab heal (re-render race)
      //   v6: timeout 15min pra pipeline completar
      //   v7: getRowByEmail({certState:'Emitido'}) pra desambiguar 2 linhas
      // ESTADO ATUAL: pipeline completa cert emitido, mas toast Reinscri|sucesso
      // não aparece em 10s após click. Diagnóstico provável: backend rejeita
      // silenciosamente porque o aluno já tem participant Pendente
      // auto-criado pelo backend após cert (state-conflict v1.6.2 da skill).
      // Precisa cancelar/deletar o participant Pendente automático antes do
      // clickReinscrever, ou usar caminho alternativo de seed.
      test.fixme(
        true,
        'seed-roadmap-tc3-auto-recert-cancel: alunoAprovadoNoCursoFixoSeed produz cert Emitido OK, mas backend auto-cria participant Pendente que bloqueia nova reinscrição. Toast nunca aparece. Mesmo gap do TC3 Suite 2. Precisa helper que cancele a auto-recertification.',
      );
      await allure.epic('Twygo - Recertificação');
      await allure.feature(
        'Isolamento de Progresso, Score e Attendance por Inscrição',
      );
      await allure.story(
        'Aluno reinscrito tem progress/score/attendance zerados na nova inscrição',
      );
      await allure.severity('critical');
      await allure.parameter(
        'curso',
        `Curso com atividades (id ${alunoAprovadoNoCursoFixoSeed.cursoId})`,
      );
      await allure.parameter('aluno_elegivel', alunoAprovadoNoCursoFixoSeed.alunoEmail);

      const learning = new LearningStudentsPage(page);

      await allure.step(
        '1. Pré-condição: aluno aprovado com cert Emitido está na listagem — botão Reinscrever habilitado',
        async () => {
          // alunoAprovadoNoCursoFixoSeed criou aluno worker-isolated, completou
          // o curso 807403 e emitiu cert. O aluno tem 1 participant com cert
          // "Emitido" — condição necessária para o botão "Iniciar reinscrição"
          // estar habilitado no menu kebab (backend exige cert Emitido/Expirado
          // para aceitar reinscrição).
          expect(
            alunoAprovadoNoCursoFixoSeed.certificateId,
            'alunoAprovadoNoCursoFixoSeed deve ter cert emitido — sem cert o botão Reinscrever fica disabled',
          ).not.toBeNull();

          await learning.goToList(alunoAprovadoNoCursoFixoSeed.cursoId);
          await expect(
            learning.getRowByEmail(alunoAprovadoNoCursoFixoSeed.alunoEmail),
            `Aluno elegível ${alunoAprovadoNoCursoFixoSeed.alunoEmail} deve aparecer na listagem de Aprendizagem do curso ${alunoAprovadoNoCursoFixoSeed.cursoId}`,
          ).toBeVisible({ timeout: 15_000 });
        },
      );

      await allure.step(
        '2. Reinscrever o aluno aprovado → novo participant criado via POST',
        async () => {
          // "Iniciar reinscrição" dispara POST imediato (sem modal de confirmação —
          // confirmado live 2026-05-29, documentado em LearningStudentsPage.ts:533-536).
          // Validamos o sucesso via toast (mais robusto que waitForResponse, que
          // depende de capturar URL e pode sofrer race-condition no setup).
          //
          // Pré-condição: aluno tem cert Emitido → botão "Iniciar reinscrição"
          // habilitado no menu kebab da linha mais recente. Aluno com cert
          // "Pendente" (sem cert emitido anterior) → frontend bloqueia silenciosamente
          // (screenshot trace 2026-05-29: menu aberto + item highlighted + sem POST).
          // alunoAprovadoNoCursoFixoSeed produz 2 participants no curso 807403
          // (Pendente auto-criado + Emitido com cert). clickReinscrever default
          // pega .first() = linha mais recente (Pendente). Precisamos clicar
          // na linha Emitido — desambigua via getRowByEmail({certState}).
          const rowEmitido = learning.getRowByEmail(
            alunoAprovadoNoCursoFixoSeed.alunoEmail,
            { certState: 'Emitido' },
          );
          const kebab = rowEmitido.getByRole('button', { name: 'more_vert' }).first();
          await kebab.waitFor({ state: 'visible', timeout: 10_000 });
          await kebab.scrollIntoViewIfNeeded();
          await kebab.click();
          await page
            .getByRole('menu')
            .first()
            .waitFor({ state: 'visible', timeout: 5_000 });
          const item = page
            .getByRole('menuitem', { name: /Iniciar reinscrição/i })
            .first();
          await item.waitFor({ state: 'visible', timeout: 5_000 });
          await item.click();
          await learning.expectToastSuccess();
        },
      );

      await allure.step(
        '3. Validar isolamento (admin-side): novo participant (latest) exibe progresso 0% — RN 27/28',
        async () => {
          // Após reinscrição bem-sucedida, a listagem exibe ambos os participants:
          //   - linha "Emitido": participant original aprovado (progress > 0%)
          //   - linha "Pendente": participant recém-criado (progress = 0%, isolado)
          //
          // Equivalente aos passos 2-3 do MD (visão do aluno no Play): a listagem
          // default mostra o participant ativo com isolamento do histórico.
          // Decisão usuário 2026-05-29: validação via UI admin (listagem de Aprendizagem)
          // em vez de banco.
          const linhaPendente = learning.getRowByEmail(
            alunoAprovadoNoCursoFixoSeed.alunoEmail,
            { certState: 'Pendente' },
          );
          await expect(linhaPendente, 'Linha do novo participant (cert Pendente) deve aparecer após reinscrição').toBeVisible({
            timeout: 15_000,
          });
          await expect(
            linhaPendente,
            'Novo participant deve exibir progresso 0%',
          ).toContainText(/\b0\s?%/);
          await expect(
            linhaPendente,
            'Novo participant NÃO deve exibir 100% (isolado do histórico anterior — RN 27/28)',
          ).not.toContainText(/100\s?%/);

          // A linha do histórico deve existir — RN 28: histórico mantido.
          // Quando nova reinscrição ocorre, o cert do participant anterior muda de
          // "Emitido" para "Substituído" (certificate_situation=4 / REPLACED).
          // A listagem exibe ≥2 linhas do aluno: o histórico + o novo Pendente.
          // Validamos via count > 1 — não ancoramos no badge exato do histórico
          // porque a transição Emitido→Substituído pode ser assíncrona.
          const todasLinhasAluno = page
            .locator('tbody tr')
            .filter({ hasText: alunoAprovadoNoCursoFixoSeed.alunoEmail });
          const countAluno = await todasLinhasAluno.count();
          expect(
            countAluno,
            'Deve haver ≥2 linhas do aluno: participant histórico + novo Pendente zerado (RN 28: histórico mantido)',
          ).toBeGreaterThanOrEqual(2);
        },
      );
    },
  );
});
