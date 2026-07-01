import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Decisão locked do QA (Suite 02 TC6): este TC valida o disparo do
  // `RecertificationMailer#student_email` com template `reenrollment_mail`
  // após reinscrição individual. Validação cross-suite com Suite 10
  // (E-mail diferenciado de reinscrição) — requer infra de captura de
  // e-mail (sandbox SMTP / inbox de teste em staging) que ainda não está
  // configurada nesta suite.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"
  // / "cross-suite ainda não orquestrado").
  test.fixme(
    true,
    'cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail não configurada. Validar manualmente que e-mail de reinscrição foi disparado.',
  );

  test('TC6 — Após reinscrição, e-mail diferenciado é disparado (validação cross-suite)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story('Após reinscrição, e-mail diferenciado é disparado (cross-suite)');
    await allure.severity('normal');
    await allure.tag('CROSS_SUITE_MAILER');
    await allure.tag('REVIEW_NEEDED');
    await allure.label('executionType', 'manual');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    // Plano de implementação quando a infra de captura de e-mail estiver
    // configurada (Suite 10):
    //
    // 1. beforeAll: criar/obter inbox de teste em sandbox SMTP (ex.:
    //    Mailtrap, MailHog, ou tabela `letter_opener` do Rails dev).
    // 2. Executar fluxo de TC3: reinscrever aluno elegível via UI
    //    (`learning.clickReinscrever` + `confirmReinscreverModal`).
    // 3. Aguardar até 30s pelo e-mail aparecer na inbox via polling do
    //    endpoint de inbox (`expect.poll`).
    // 4. Assert: subject corresponde à chave I18n
    //    `recertification_mailer.reenrollment.subject`.
    // 5. Assert: body corresponde ao template `reenrollment_mail` (e
    //    não ao `recertification_mail` legado). Validação detalhada
    //    fica na Suite 10.
  });
});
