import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('E-mail Diferenciado de Reinscrição', () => {
  // Decisão locked do QA (Suite 10): validação de internacionalização do
  // mailer requer captura do e-mail enviado e inspeção do assunto/corpo
  // em cada locale (pt-BR, en, es, fr → fallback). Não há infraestrutura
  // de captura (Mailpit/MailHog/letter_opener_web) configurada para o
  // projeto Recertificação em staging-base-de-conhecimento.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente via
  // inbox de teste ou observabilidade do RecertificationMailer.
  test.fixme(
    true,
    'requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.',
  );

  test('TC4 — E-mail respeita locale do aluno (pt-BR/en/es)', async ({ page }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('E-mail Diferenciado de Reinscrição');
    await allure.story('E-mail respeita locale do aluno (pt-BR/en/es)');
    await allure.severity('normal');
    await allure.tag('MAILER_REQUIRED');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Configurar locale do aluno para "pt-BR" (perfil do usuário) → estado preparado',
      async () => {
        // REVISAR: alteração de locale via perfil de usuário é automatizável
        // (UserProfilePage), mas a validação principal (corpo do e-mail em
        // pt-BR) depende de infra externa.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Reinscrever o aluno e aguardar e-mail → e-mail recebido com texto em português brasileiro',
      async () => {
        // REVISAR-I18N: validação de strings PT-BR contra
        // recertification_mailer.reenrollment.subject (locale pt-BR).
      },
    );

    await allure.step(
      '3. Repetir para "en" e "es" usando alunos com locales correspondentes → e-mail recebido nos idiomas respectivos',
      async () => {
        // REVISAR-I18N: matriz multi-locale exige N alunos com locale distinto.
        // Sem captura de inbox, cobertura impossível.
      },
    );

    await allure.step(
      '4. Configurar locale "fr" (não oficialmente suportado) e reinscrever → e-mail recebido em inglês (fallback `en` do Rails)',
      async () => {
        // REVISAR: validação do fallback Rails (`fallbacks: [:en]`) exige
        // inspeção do assunto efetivo — bloqueado por infra ausente.
      },
    );
  });
});
