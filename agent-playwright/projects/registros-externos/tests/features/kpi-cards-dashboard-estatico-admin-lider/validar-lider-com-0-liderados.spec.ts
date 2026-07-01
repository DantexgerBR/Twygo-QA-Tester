import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

// fixme LEGÍTIMO (Anti-pattern F — categoria "seed/credencial ausente"; destinatário: QA Lead).
// TC exige logar como **Líder recém-promovido sem nenhum liderado direto** para validar
// os 4 cards zerados e a lista vazia (RN 22, RN 36). Não há credencial/seed de Líder
// sem time no env staging-registros-externos. Destrava junto com TC5 (Líder): provisionar
// usuário Líder e controlar a composição da equipe (com e sem liderados).
test.describe(SUITE, () => {
  test('Validar Líder com 0 liderados (todos os cards zerados)', async () => {
    test.fixme(
      true,
      'seed/credencial ausente: usuário Líder sem liderados diretos (RN 22, RN 36). Destinatário: QA Lead.',
    );
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar Líder com 0 liderados (todos os cards zerados)');
  });
});
