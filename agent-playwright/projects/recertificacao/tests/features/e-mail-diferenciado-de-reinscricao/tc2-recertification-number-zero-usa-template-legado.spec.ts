import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('E-mail Diferenciado de Reinscrição', () => {
  // Decisão locked do QA (Suite 10): validação do mailer requer captura do
  // e-mail enviado (assunto + corpo + template). Não há infraestrutura de
  // captura (Mailpit/MailHog/letter_opener_web) configurada para o projeto
  // Recertificação em staging-base-de-conhecimento. Além disso, este TC
  // requer disparo manual do cron de aviso de expiração — sem ferramenta
  // de scheduling externo automatizada.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente via
  // inbox de teste ou observabilidade do RecertificationMailer.
  test.fixme(
    true,
    'requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.',
  );

  test('TC2 — Participant com `recertification_number = 0` em fluxo de aviso de expiração usa template legado', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('E-mail Diferenciado de Reinscrição');
    await allure.story(
      'Participant com `recertification_number = 0` em fluxo de aviso de expiração usa template legado',
    );
    await allure.severity('normal');
    await allure.tag('MAILER_REQUIRED');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: aluno com `recertification_number = 0` e certificado VALID com `expires_at = hoje + 7 dias`',
      async () => {
        // REVISAR: pré-condição de seed DB (recertification_number=0,
        // certificado próximo do vencimento). Requer agent-db para preparar
        // estado — fora do escopo deste spec Playwright.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Disparar manualmente o cron de aviso de expiração que chama `RecertificationMailer#student_email` → worker processa',
      async () => {
        // REVISAR: disparo de cron Sidekiq requer acesso à UI /sidekiq ou
        // rake task. Fora do escopo da fixture Playwright atual.
      },
    );

    await allure.step(
      '3. Inspecionar inbox do aluno → e-mail com assunto `recertification_mailer.expiration_reminder.subject` e corpo do template legado `recertification_mail`',
      async () => {
        // REVISAR: validação do template legado vs novo requer infra de
        // captura indisponível.
      },
    );
  });
});
