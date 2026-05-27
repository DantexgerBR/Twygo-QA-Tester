import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-opcao-substituido-aparece-no-filtro-flag-on.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Rota destravada em 2026-05-27 (LearningStudentsPage.goToList → /e/{id}/learning).
  // Drawer abre OK (step 2 verde), mas o drawer "Lista de filtros" hoje só
  // mostra filtros PADRÃO de progresso (Não iniciados, Em andamento, Concluídos)
  // — para validar opção "Substituído" do filtro AVANÇADO de Status do certificado,
  // precisa clicar em "+ Novo" → escolher critério "Status do certificado" →
  // ver lista de status como opções. Refator do LearningStudentsPage com
  // helper `openAdvancedFilterCriteria(criterion)` pendente.
  test.fixme(
    true,
    'Refator pendente: drawer Lista de filtros mostra apenas filtros padrão. Validar Substituído exige fluxo "+ Novo" → critério "Status do certificado". Atualizar LearningStudentsPage com helper de drawer-novo.',
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
        await expect(page).toHaveURL(/\/e\/\d+\/learning/);
      },
    );

    await allure.step(
      '2. Clicar no ícone de filtro da coluna "Status do certificado" → Drawer de filtro avançado é exibido com lista de opções',
      async () => {
        await learningStudents.openFilterDrawer();
        await expect(page.getByText('Lista de filtros', { exact: true }).first()).toBeVisible();
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
