import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const SUITE = 'KPI cards como dashboard estático (Admin/Líder)';

// fixme LEGÍTIMO (Anti-pattern F — categoria "seed/credencial ausente"; destinatário: QA Lead).
// TC exige logar como **Líder** cuja equipe tenha distribuição CONHECIDA (ex.: 18
// Emitidos, 2 Pendentes, 0 Expirados, 0 Recusados) para validar que a contagem
// cobre apenas os liderados diretos (RN 22). Não há credencial de Líder nem massa
// de liderados de distribuição conhecida provisionada no env staging-registros-externos.
// Destrava com: usuário Líder + liderados com registros (ou perfil-switch "Gestor de
// turma" sobre um user que seja líder de uma equipe seedada).
test.describe(SUITE, () => {
  test('Validar escopo da contagem do Líder (liderados diretos)', async () => {
    test.fixme(
      true,
      'seed/credencial ausente: usuário Líder com liderados de distribuição conhecida (RN 22). Destinatário: QA Lead.',
    );
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar escopo da contagem do Líder (liderados diretos)');
    // Fluxo pretendido (quando houver seed): logar como Líder → cards refletem só
    // os liderados diretos; cards zerados com anel cinza; carga horária no escopo do time.
  });
});
