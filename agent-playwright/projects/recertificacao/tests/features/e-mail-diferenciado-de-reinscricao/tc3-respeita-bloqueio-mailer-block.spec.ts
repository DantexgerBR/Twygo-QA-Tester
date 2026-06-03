import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('E-mail Diferenciado de Reinscrição', () => {
  // Decisão locked do QA (Suite 10): validação do bloqueio mailer_block requer
  // (a) capturar/observar AUSÊNCIA de e-mail dentro de uma janela de tempo,
  // (b) inspecionar logs do Sidekiq filtrando RecertificationMailer. Ambas
  // capacidades dependem de infraestrutura externa (Mailpit/MailHog +
  // Sidekiq UI acessível) não configurada para o projeto Recertificação em
  // staging-base-de-conhecimento.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente via
  // inbox de teste ou observabilidade do RecertificationMailer.
  test.fixme(
    true,
    'requer infra de captura de e-mail (Mailpit/MailHog/letter_opener_web) não configurada para o projeto Recertificação. Validar manualmente via inbox de teste ou observabilidade do RecertificationMailer.',
  );

  test('TC3 — E-mail respeita bloqueio de `organization.mailer_block?`', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('E-mail Diferenciado de Reinscrição');
    await allure.story('E-mail respeita bloqueio de `organization.mailer_block?`');
    await allure.severity('normal');
    await allure.tag('MAILER_REQUIRED');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Pré-condição: organização com `mailer_block = true` → estado preparado',
      async () => {
        // REVISAR: definição de `mailer_block=true` em staging não tem
        // procedimento documentado (MD marca explicitamente "REVISAR: como
        // definir em staging"). Bloqueado por infra + procedimento.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Reinscrever um aluno individualmente pelo fluxo da suíte 2 TC3 → toast de sucesso é exibido',
      async () => {
        // REVISAR: reuso do fluxo da suíte 2 TC3 quando POM
        // ParticipantsPage/PaineisListPage estiver estável para reinscrição.
      },
    );

    await allure.step(
      '3. Aguardar 60 segundos pelo e-mail → nenhum e-mail é recebido na inbox do aluno',
      async () => {
        // REVISAR: assert de AUSÊNCIA exige captura ativa da inbox via API
        // Mailpit/MailHog. Sem infra, não há sinal verificável.
      },
    );

    await allure.step(
      '4. Inspecionar logs do mailer no Sidekiq UI em "/sidekiq" filtrando por "RecertificationMailer" → job completed com tag "skipped: mailer_block?"',
      async () => {
        // REVISAR: navegação até /sidekiq requer credenciais de admin
        // Sidekiq UI e parser de logs. Fora do escopo automatizado.
      },
    );
  });
});
