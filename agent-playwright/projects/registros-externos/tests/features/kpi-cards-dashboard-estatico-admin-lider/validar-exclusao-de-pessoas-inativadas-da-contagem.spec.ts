import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

// fixme LEGÍTIMO (Anti-pattern F — categoria "seed ausente"; destinatário: QA Lead).
// TC exige uma pessoa INATIVADA que possua registros (ex.: 3 Emitidos) e cujo nome
// seja conhecido, para provar que (a) os KPIs NÃO contam os registros dela e (b) a
// busca pelo nome dela retorna vazio (RN 24). A massa do env staging-registros-externos
// não tem uma pessoa inativada-com-registros identificada. Destrava com: inativar uma
// pessoa que tenha registros e registrar o nome em um *.data.ts deste TC.
test.describe(SUITE, () => {
  test('Validar exclusão de pessoas inativadas da contagem', async () => {
    test.fixme(
      true,
      'seed ausente: pessoa inativada com registros + nome conhecido (RN 24). Destinatário: QA Lead.',
    );
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar exclusão de pessoas inativadas da contagem');
    // Fluxo pretendido: cards não incluem registros da pessoa inativada; busca pelo
    // nome dela → lista vazia ("Não há dados para exibir" na UI; a AT diz "Nenhum registro encontrado").
  });
});
