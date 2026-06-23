import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

// fixme LEGÍTIMO (Anti-pattern F — categoria "seed/ambiente ausente"; destinatário: QA Lead).
// TC exige um Admin de organização SEM NENHUM registro (org recém-contratada) para
// validar a faixa com 4 cards zerados e anéis cinza completos, e que clicar num card
// zerado não tem efeito (RN 36, RN 30). O env principal (org 37079) tem massa; não há
// org Admin garantidamente vazia mapeada. Destrava com: env/org sem registros declarado
// em environment.json (ex.: trial recém-provisionada) e ponteiro no project.config.
test.describe(SUITE, () => {
  test('Validar estado "tudo zero" no Admin de organização nova', async () => {
    test.fixme(
      true,
      'seed/ambiente ausente: org Admin sem nenhum registro (RN 36). Destinatário: QA Lead.',
    );
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar estado "tudo zero" no Admin de organização nova');
    // Fluxo pretendido: faixa renderiza 4 cards com "0" e anel cinza; clicar card zerado = sem efeito.
  });
});
