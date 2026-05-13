// spec: testsuite XML
// seed: tests/seed.spec.ts

// FIXME: requer login com perfil ALUNO + painel pré-configurado vinculado
// ao Modo de uso Aluno com 4 widgets (Resumo, Conteúdos, Ranking, Certificados).
// Ver _README.md desta pasta para detalhes do bloqueio.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { renderizarWidgetResumoAtividadesData as data } from './renderizar-widget-resumo-atividades.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test("Renderizar widget 'Resumo das atividades' para o aluno", async ({ page, step }) => {
    test.fixme(
      true,
      "seed ausente: requer (1) credencial de perfil Aluno no environment.json staging-widgets (apenas admin/instrutor configurados hoje); (2) painel pré-configurado em /play do user aluno com o widget 'Resumo das atividades'. Destinatário: DevOps/QA Lead — adicionar TWYGO_STAGING_WIDGETS_STUDENT_EMAIL/PASSWORD e seed do painel aluno.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story("Renderizar widget 'Resumo das atividades' para o aluno");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Acessar o painel do aluno via /play', async () => {
      await page.goto('/play?menu_id=play');
    });

    await step("2. Verificar widget 'Resumo das atividades' visível com dados", async () => {
      await expect(page.getByText(data.widgetTitle)).toBeVisible();
      // REVISAR: validar dados específicos quando seed estiver disponível
    });
  });
});
