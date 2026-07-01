import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { avaliarData as data } from './avaliar.shared.data.js';

// SEED/LOGIN AUSENTE → QA Lead: este TC exige uma sessão logada no perfil LÍDER
// com liderados diretos (e um registro Externo Pendente de liderado), além de um
// registro de pessoa FORA da equipe para o caso negativo. O storageState atual é
// Admin; não há credencial/perfil Líder provisionado neste env. Destrava quando
// o env tiver o login do Líder (cobre-se em conjunto com a suíte 1.16 — Escopo do
// Líder). Ver decisão registrada: fixme → QA Lead.
test.describe(data.suiteName, () => {
  test.fixme(
    'Validar escopo do Líder na avaliação',
    async () => {
      await allure.epic(data.epic);
      await allure.feature(data.suiteName);
      await allure.story('Validar escopo do Líder na avaliação');
      // requer login no perfil Líder com liderados — seed ausente.
    },
  );
});
