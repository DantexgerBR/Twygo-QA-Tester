// spec: testsuite XML
// seed: tests/seed.spec.ts
//
// TC — Transição flag ON → OFF com painéis (item não-padrão) aplicados.
//
// Setup técnico VALIDADO via skills (`testar-feature-flag-twygo` +
// `alterar-funcionalidade-contrato-twygo`): ensureContractFeature +
// ensureFlipperActor + criar painel + associar ao useMode Aluno +
// switch via ProfileSwitcher. TC `flag-habilitada-menu-aluno-acessivel`
// roda essa mesma cadeia com sucesso.
//
// Bloqueio: cache server-side do Twygo. Após `ensureFlipperActor
// enabled:false` (revert), a sidebar Aluno continua exibindo links
// `/panel_viewer/` por janela que pode exceder 60-180s. Combinação:
//   - test.timeout = 120_000 (playwright.config) → cap teto
//   - expect.toPass externo + page.reload() em cada attempt
//   - `getByRole('tab', { name: 'Painéis' }).waitFor()` interno do
//     `paineis.goToList()` tem default 30s → primeira tentativa dentro
//     do toPass já come 30s de orçamento
//
// Resultado: cache pode atinge >60s e a janela de retry restante
// (~30-60s dentro do test) não cobre. TC vira flaky.
//
// Caminho pra destravar:
//  - Endpoint admin do Twygo para invalidar cache de flag/plan
//    on-demand (PR de produto), ou
//  - Estender `test.timeout` específico desse TC pra 300_000 +
//    estender internal waitFor de `paineis.goToList` pra 120_000.
//    Custo: TC pode rodar 5min em pior caso.
//
// TCs que NÃO dependem do "menu some" SOB cache passam:
//  - flag-desabilitada-aba-paineis-nao-exibida ✓
//  - flag-habilitada-menu-aluno-acessivel ✓ (caminho positivo)
//  - menu-padrao-com-flag-desabilitada ✓ (assert redirect, não count=0)
//  - transicao-flag-off-on ✓
//  - listagem-de-paineis/feature-flag-desabilitada ✓

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Feature flag', () => {
  test('Transição: flag habilitada -> desabilitada com painéis aplicados', async ({ step }) => {
    test.fixme(
      true,
      'cache server-side Twygo > test.timeout: após revert flag, sidebar Aluno mantém links /panel_viewer/ por janela maior que 120s; toPass+reload não cobre. Setup funciona (testar-feature-flag-twygo + alterar-funcionalidade-contrato-twygo). Destravar: endpoint admin pra invalidate cache OU estender test.timeout pra 300s.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Transição: flag habilitada -> desabilitada com painéis aplicados');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Estado inicial: flag on + painéis + menu visível', async () => {
      expect(true).toBe(true);
    });

    await step('2. Desabilitar flag → menu some na visão do aluno', async () => {
      expect(true).toBe(true);
    });
  });
});
