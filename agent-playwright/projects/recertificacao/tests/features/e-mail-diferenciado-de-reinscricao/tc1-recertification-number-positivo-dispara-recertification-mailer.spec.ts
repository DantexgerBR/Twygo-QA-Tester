import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('E-mail Diferenciado de Reinscrição', () => {
  // Decisão locked do QA (Suite 10): validação do mailer requer captura do
  // e-mail enviado (assunto + corpo + template). Não há infraestrutura de
  // captura (Mailpit/MailHog/letter_opener_web) configurada para o projeto
  // Recertificação em staging-base-de-conhecimento.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente via
  // inbox de teste ou observabilidade do RecertificationMailer.
  test.fixme(
    true,
    'requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.',
  );

  test('TC1 — Criação de participant com `recertification_number > 0` dispara `RecertificationMailer#student_email`', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('E-mail Diferenciado de Reinscrição');
    await allure.story(
      'Criação de participant com `recertification_number > 0` dispara `RecertificationMailer#student_email`',
    );
    await allure.severity('critical');
    await allure.tag('MAILER_REQUIRED');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3 → toast de sucesso é exibido',
      async () => {
        // REVISAR: passo automatizável via PaineisListPage/ParticipantsPage do
        // fluxo da suíte 2 TC3, mas a validação principal (e-mail) depende de
        // infra externa. Mantido como narrativa Allure até captura disponível.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Aguardar até 30 segundos pelo e-mail → e-mail chega na inbox do aluno',
      async () => {
        // REVISAR: requer poll na inbox via API Mailpit/MailHog. Bloqueado por
        // infra ausente em staging-base-de-conhecimento.
      },
    );

    await allure.step(
      '3. Inspecionar o assunto do e-mail → corresponde à chave I18n `recertification_mailer.reenrollment.subject`',
      async () => {
        // REVISAR-I18N: texto traduzido conforme locale do aluno (ver TC4).
      },
    );

    await allure.step(
      '4. Inspecionar o corpo do e-mail → renderizado a partir do template `reenrollment_mail` (NÃO `recertification_mail` legado)',
      async () => {
        // REVISAR: validação de template requer parser HTML da inbox capturada.
      },
    );
  });
});
