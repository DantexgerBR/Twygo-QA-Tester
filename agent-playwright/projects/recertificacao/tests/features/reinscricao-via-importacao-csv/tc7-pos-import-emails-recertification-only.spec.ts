import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição via Importação CSV', () => {
  // Decisão locked do QA (Suite 04 — TC7): validação do escopo de disparo de
  // e-mails pós-import requer captura do e-mail (assunto + template). Não há
  // infraestrutura de captura (Mailpit/MailHog/letter_opener_web) configurada
  // para o projeto Recertificação em staging-base-de-conhecimento. Cross-suite
  // com Suite 10 (E-mail Diferenciado de Reinscrição), que tem o mesmo bloqueio.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente via
  // inbox de teste ou observabilidade do RecertificationMailer.
  test.fixme(
    true,
    'cross-suite com Suite 10 (Mailer) — requer infra de captura de e-mail. Validar manualmente.',
  );

  test('TC7 — Pós-importação, e-mails são enviados APENAS para participants com `recertification_number > 0` criados nesta execução', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story(
      'Pós-importação, e-mails são enviados APENAS para participants com `recertification_number > 0` criados nesta execução',
    );
    await allure.severity('normal');
    await allure.tag('CROSS_SUITE_MAILER');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Preparar CSV com 3 linhas: A (Reinscrever=SIM user existente — cria reinscrito), B (Reinscrever=NÃO user existente — não cria), C (Reinscrever=SIM user novo — cria com recertification_number=0)',
      async () => {
        // Validação manual: montar CSV com as 3 linhas conforme prosa do MD.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Fazer upload e aguardar processamento → worker processa as 3 linhas',
      async () => {
        // Validação manual: subir CSV pela tela de import. Aguardar conclusão
        // do worker `CsvImportEventParticipantWorker`.
      },
    );

    await allure.step(
      '3. Inspecionar inboxes dos 3 alunos → apenas A recebe e-mail com assunto `recertification_mailer.reenrollment.subject` (template `reenrollment_mail`); B e C não recebem este e-mail diferenciado',
      async () => {
        // REVISAR: requer poll na inbox via API Mailpit/MailHog. Bloqueado por
        // infra ausente em staging-base-de-conhecimento. Cross-suite com Suite 10.
      },
    );
  });
});
