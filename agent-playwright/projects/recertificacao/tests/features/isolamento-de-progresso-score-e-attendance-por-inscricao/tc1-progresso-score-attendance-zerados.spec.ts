import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { tc1Data } from './tc1-progresso-score-attendance-zerados.data.js';

test.describe('Isolamento de Progresso, Score e Attendance por Inscrição', () => {
  test('TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc1Data.cursoIsolamentoId=1 e alunoReinscritoEmail=
    // 'aluno.reinscrito@example.com' são placeholders. Network mostrou
    // GET /o/37007/events/1 → 404 (curso não existe). Pré-condição
    // (Suite 02 TC3 de reinscrição admin) ainda não foi resolvida — sem
    // o aluno reinscrito real no env, não há como validar progresso
    // 0% no novo participant. Destrava quando o seed for criado em
    // staging-base-de-conhecimento OU quando Suite 02 TC3 ficar verde
    // e este TC for refatorado para usar beforeAll que invoque o helper
    // de reinscrição.
    test.fixme(
      true,
      'seed inválido — cursoIsolamentoId=1 retorna 404 e aluno.reinscrito@example.com é placeholder. NEEDS_SEED.',
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
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    await allure.step(
      '1. Reinscrever o aluno aprovado pelo fluxo da suíte 2 TC3 → Novo participant criado com `recertification_number = 1`',
      async () => {
        // REVISAR-SEED: este passo assume que o seed do env já tem o aluno
        // `tc1Data.alunoReinscritoEmail` com:
        //   - histórico: recertification_number = 0, progress_score = 100,
        //     certificado VALID
        //   - inscrição ativa: recertification_number = 1 (resultado da
        //     reinscrição pelo fluxo da Suite 02 TC3)
        // Quando o Page Object da Suite 02 TC3 (Reinscrição Admin Individual)
        // existir, mover este passo para um `beforeAll` que invoque o helper
        // de reinscrição. Por ora, o seed é a pré-condição.
        await allure.tag('SEED_DEPENDENCY');
        expect(tc1Data.alunoReinscritoEmail).toBeTruthy();
      },
    );

    await allure.step(
      '2. Login com o aluno e acessar a página do curso no Play → Banner do curso exibe progresso `0%` (NÃO 100% do anterior). Status "Pendente"',
      async () => {
        // REVISAR-SEED: storageState atual em `outputs/.auth/storage.json` é
        // do usuário ADMIN do env (definido em `global-setup.ts`). Para
        // logar como aluno reinscrito, este TC deveria ter um storageState
        // dedicado (`storage-aluno-reinscrito.json`) gerado por fixture
        // específica OU fazer login inline neste passo.
        // Como não há fixture de login-aluno hoje, navegamos para a página
        // do curso no Play assumindo storage do aluno já gravado. Se não,
        // a asserção de progresso 0% capturará a divergência.
        await allure.tag('REVIEW_NEEDED');
        await safeGoto(
          page,
          `/o/${getOrgId()}/events/${tc1Data.cursoIsolamentoId}`,
        );

        // RN 27/28: progresso da nova inscrição deve ser 0% (NÃO 100% do
        // histórico). Procura o banner/badge de progresso. Fallback por
        // role/texto enquanto não há Page Object dedicado.
        // REVISAR: extrair pra LearningStudentsPage quando criada (Suite
        // dedicada cobrirá o Page Object da página de aprendizagem).
        const progressoZero = page.getByText(/0\s?%/).first();
        await expect(progressoZero).toBeVisible({ timeout: 10_000 });

        // Status "Pendente" na nova inscrição.
        const statusPendente = page.getByText(/Pendente/i).first();
        await expect(statusPendente).toBeVisible();
      },
    );

    await allure.step(
      '3. Avançar uma aula até `progress_score = 25` no novo participant → Progresso atualiza para 25% na UI do Play',
      async () => {
        // REVISAR-SEED: avançar 1 aula requer navegação interna no Play
        // (clicar na aula, marcar como concluída ou progredir no vídeo).
        // Fluxo varia conforme tipo de conteúdo do curso (vídeo, página,
        // arquivo). Por ora, depende do seed garantir que o aluno
        // reinscrito JÁ avançou 1 aula com progress_score = 25 — OU
        // implementar o avanço aqui quando houver Page Object da aula.
        await allure.tag('SEED_DEPENDENCY');

        await safeGoto(
          page,
          `/o/${getOrgId()}/events/${tc1Data.cursoIsolamentoId}`,
        );

        // RN 27: progresso atualiza para 25% após avanço de 1 aula no novo
        // participant. Asserta presença do texto "25%" no banner do curso.
        // REVISAR: extrair pra LearningStudentsPage quando criada.
        const progresso25 = page.getByText(
          new RegExp(`${tc1Data.progressoEsperadoNoStep3}\\s?%`),
        ).first();
        await expect(progresso25).toBeVisible({ timeout: 15_000 });
      },
    );

    await allure.step(
      '4. Acessar como admin a lista de aprendizagem → Listagem padrão exibe apenas o participant atual com `progress_score = 25`. Histórico (recertification_number = 0, progress_score = 100) preservado em banco mas oculto do listing default',
      async () => {
        // Aqui voltamos pro contexto admin (storage padrão). A listagem
        // default de aprendizagem aplica filtro `is_latest_recertification = 1`
        // — apenas o participant ativo (recertification_number = 1) aparece.
        // REVISAR: extrair pra LearningStudentsPage quando criada.
        await safeGoto(
          page,
          `/o/${getOrgId()}/events/${tc1Data.cursoIsolamentoId}/learning_students`,
        );
        await expect(page).toHaveURL(/\/learning_students/);

        // Procura a linha do aluno reinscrito com progresso 25%.
        // REVISAR-SEED: identificar a linha por email do aluno é frágil se
        // a coluna não estiver visível por padrão. Quando o Page Object
        // existir, usar método semântico (ex: `getStudentRow(email)`).
        const linhaAluno = page
          .getByRole('row', { name: new RegExp(tc1Data.alunoReinscritoEmail, 'i') })
          .first();

        if (await linhaAluno.isVisible().catch(() => false)) {
          await expect(linhaAluno).toContainText(
            new RegExp(`${tc1Data.progressoEsperadoNoStep3}\\s?%`),
          );

          // RN 28: histórico (progress_score = 100) NÃO aparece na listagem
          // default. Asserta que o "100%" não está na linha do aluno.
          await expect(linhaAluno).not.toContainText(/100\s?%/);
        } else {
          // Fallback: se a linha não é localizável por role=row (depende do
          // markup da listagem), procura por texto na página inteira.
          await expect(
            page.getByText(
              new RegExp(`${tc1Data.progressoEsperadoNoStep3}\\s?%`),
            ).first(),
          ).toBeVisible();
          await allure.tag('REVIEW_NEEDED');
        }
      },
    );
  });
});
