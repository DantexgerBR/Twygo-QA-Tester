// spec: testsuite "Trial (provisionamento e exclusão de dados)" → TC2
//       "Validar feature de Registros em trial criado via API"
// seed: tests/seed.spec.ts
//
// fixme LEGÍTIMO (§7.6 F — dependência externa / executor errado):
//   - TC2 é `Tipo: api`. Cria uma org Trial NOVA via a "API de onboarding
//     externo do Stage" e valida paridade com o trial criado via URL.
//   - A pré-condição da AT exige "Credenciais/token para a API de onboarding
//     disponíveis no `.env` do consumidor" — AUSENTE no `.env` (não há var de
//     token de onboarding). Recon 2026-06-25 confirmou.
//   - Provisionar via API cria uma org sem rotina de cleanup acessível ao
//     agent-playwright (cada chamada gera tenant novo) e a validação de
//     paridade pede checagem de banco → território do `agent-api` + `agent-db`,
//     não do executor Playwright.
//
// Destinatário do sinal: infra/agent-api (prover token de onboarding + executor
// de API). Quando existir, migrar este TC para lá. NÃO é bug de produto.

import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const SUITE = 'Trial (provisionamento e exclusão de dados)';

test.describe(SUITE, () => {
  test.fixme(
    'Validar feature de Registros em trial criado via API',
    async () => {
      await allure.epic('Twygo - Registros de Aprendizagem');
      await allure.feature(SUITE);
      await allure.story('TC2 — Validar feature de Registros em trial criado via API');
      await allure.severity('normal');
      // Bloqueado: sem token de onboarding no .env + executor é agent-api (não Playwright).
    },
  );
});
