import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-opcao-substituido-aparece-no-filtro-flag-on.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Categoria: seed-invalido (heal 2026-05-26).
  // GET /o/37007/events/1/learning_students retornou 404 — `tc1Data.eventId = 1`
  // é placeholder. Validar manualmente no env staging-base-de-conhecimento
  // (orgId 37007) qual eventId tem listagem de aprendizagem habilitada
  // (participants em diferentes certificate_status) e atualizar
  // `tc1-opcao-substituido-aparece-no-filtro-flag-on.data.ts`.
  test.fixme(
    true,
    'seed inválido — eventId placeholder em tc1-opcao-substituido-aparece-no-filtro-flag-on.data.ts. Validar manualmente no env staging-base-de-conhecimento e atualizar o .data.ts.',
  );

  test('TC1 — Opção "Substituído" aparece no filtro avançado de Status do certificado com flag ON', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Filtro Avançado Status Substituído');
    await allure.story(
      'Opção "Substituído" aparece no filtro avançado de Status do certificado com flag ON',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar a lista de aprendizagem em "/learning_students" → Lista é exibida com colunas Nome, Status do certificado, etc.',
      async () => {
        await learningStudents.goToList(tc1Data.eventId);
        await expect(page).toHaveURL(
          /\/o\/\d+\/events\/\d+\/learning_students/,
        );
      },
    );

    await allure.step(
      '2. Clicar no ícone de filtro da coluna "Status do certificado" → Drawer de filtro avançado é exibido com lista de opções',
      async () => {
        await learningStudents.openFilterDrawer();
        await expect(page.getByRole('dialog').first()).toBeVisible();
      },
    );

    await allure.step(
      '3. Inspecionar as opções do filtro → Lista contém: Emitido, Pendente, Expirado, Aguardando assinatura, Substituído',
      async () => {
        // Asserção principal (RN 23): "Substituído" presente com flag ON.
        await learningStudents.expectFilterOptionVisible(tc1Data.optionLabel, true);

        // Asserções de paridade com as outras opções pré-existentes do filtro.
        // REVISAR-FIGMA: labels exatos das demais opções confirmados via MD;
        // se algum label tiver wording diferente no produto (ex.: "Aguardando
        // assinatura digital"), ajustar conforme recon live.
        for (const baseline of [
          'Emitido',
          'Pendente',
          'Expirado',
          'Aguardando assinatura',
        ]) {
          await learningStudents.expectFilterOptionVisible(baseline, true);
        }
      },
    );
  });
});
