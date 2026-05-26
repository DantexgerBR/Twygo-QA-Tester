import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição em Massa pelo Admin', () => {
  // Decisão locked do QA (Suite 03 TC4 — MD §500): idempotência do worker
  // `MassReenrollParticipantsWorker` é validável ao nível DB (contagem de
  // participants antes/depois) + Sidekiq logs. UI só dispara a ação — não
  // há sinal observável diferente entre "worker pulou silenciosamente" e
  // "worker rodou e criou duplicata" sem inspeção DB direta. Cobertura UI
  // dispara é coberta pelo TC3; idempotência é DB-pure.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): habilitar quando agent-db estiver pronto para o
  // validator V2 do contrato.
  test.fixme(
    true,
    'requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente.',
  );

  test('TC4 — Worker é idempotente: alunos já reinscritos na mesma janela são pulados', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição em Massa pelo Admin');
    await allure.story(
      'Worker é idempotente: alunos já reinscritos na mesma janela são pulados',
    );
    await allure.severity('normal');
    await allure.tag('WORKER_VALIDATION');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Executar o fluxo do TC3 reinscrevendo 5 alunos → 5 participants reinscritos criados',
      async () => {
        // Validação manual: rodar TC3 antes ou usar seed com 5 participants
        // já reinscritos via fluxo de massa.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Selecionar os mesmos 5 alunos novamente na listagem → Drawer exibe "5 selecionados"',
      async () => {
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Clicar em "Reinscrição em massa" e confirmar → Toast sem erro visível',
      async () => {
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '4. Aguardar 60s e recarregar → recertification_number INVARIANTE (nenhum incremento)',
      async () => {
        // Validação manual via Rails console:
        //   EventParticipant.where(user_id: [...], event_id: X).group(:user_id).maximum(:recertification_number)
        // Esperado: cada user mantém o mesmo recertification_number do passo 1.
        expect(true).toBe(true);
      },
    );
  });
});
