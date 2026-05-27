import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-opcao-substituido-aparece-no-filtro-flag-on.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Rota destravada em 2026-05-27 (LearningStudentsPage.goToList → /e/{id}/learning).
  // Drawer "Lista de filtros" mostra filtros padrão de progresso por default.
  // Para ver as opções de Certificado (Emitido/Pendente/Expirado/Aguardando
  // assinatura/Substituído), navegar via "+ Novo" → critério "Certificado".
  // Skill provisionar-seed v1.3 §filtro-avançado.

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
        // Navegar para criação de novo filtro → critério "Certificado"
        // (terminologia atual do facelift, equivalente ao "Status do
        // certificado" mencionado na AT). Após o click, todas as opções
        // do critério aparecem em "Colunas para filtrar".
        await learningStudents.openAdvancedFilterCriteria('Certificado');

        // Asserção principal (RN 23): "Substituído" presente com flag ON.
        await learningStudents.expectFilterOptionVisible(tc1Data.optionLabel, true);

        // Asserções de paridade com as outras opções pré-existentes.
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
