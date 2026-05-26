import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Isolamento de Progresso, Score e Attendance por Inscrição', () => {
  // Decisão locked do QA (Suite 11 — MD §1358): validação 100% no banco +
  // Rails uniqueness validator (`validates :email, uniqueness: { scope:
  // [:event_id, :recertification_number] }` no modelo EventParticipant).
  // Sem UI envolvida — Playwright não tem como capturar a validação Rails
  // nem inspecionar `ActiveRecord::RecordInvalid`.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): agent-db ainda não implementado (V2 do CONTRACT.md
  // cobrirá agent-db invocado como sub-rotina). Validar manualmente via
  // Rails console executando EventParticipant.create! em sequência.
  test.fixme(
    true,
    'requer validação direta no banco + Rails uniqueness validator — DB-pure. Validar manualmente via Rails console executando EventParticipant.create! em sequência.',
  );

  test('TC4 — Validações Rails de email/cpf escopam por `[:event_id, :recertification_number]`', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature(
      'Isolamento de Progresso, Score e Attendance por Inscrição',
    );
    await allure.story(
      'Validações Rails de email/cpf escopam por `[:event_id, :recertification_number]`',
    );
    await allure.severity('normal');
    await allure.tag('DB_PURE');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Via Rails console, criar participant com email "teste@example.com" e `recertification_number = 0` no curso X → Participant criado com sucesso',
      async () => {
        // Validação manual (Rails console):
        //   EventParticipant.create!(
        //     email: 'teste@example.com',
        //     event_id: X,
        //     recertification_number: 0,
        //     # ...demais atributos obrigatórios
        //   )
        // Esperado: participant criado com sucesso (id != nil).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Criar segundo participant com mesmo email e `recertification_number = 1` no MESMO curso → Participant criado com sucesso (validação aceita porque scope inclui `recertification_number`)',
      async () => {
        // Validação manual (Rails console):
        //   EventParticipant.create!(
        //     email: 'teste@example.com',
        //     event_id: X,
        //     recertification_number: 1,
        //     # ...demais atributos obrigatórios
        //   )
        // Esperado: participant criado com sucesso. A validação Rails
        //   validates :email, uniqueness: {
        //     scope: [:event_id, :recertification_number]
        //   }
        // ACEITA porque o scope inclui `recertification_number` — mesmo
        // email no mesmo event_id é permitido em recertification_numbers
        // diferentes.
        //
        // Aplicar mesmo raciocínio para CPF se o modelo validar CPF com
        // mesmo scope.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Tentar criar terceiro participant com mesmo email e `recertification_number = 1` no mesmo curso (duplicata exata) → Falha com validação de uniqueness',
      async () => {
        // Validação manual (Rails console):
        //   EventParticipant.create!(
        //     email: 'teste@example.com',
        //     event_id: X,
        //     recertification_number: 1,
        //     # ...demais atributos
        //   )
        // Esperado: ActiveRecord::RecordInvalid
        //          Validation failed: Email já está em uso
        //          (ou equivalente em I18n).
        //
        // Diferença do TC3: aqui o gate é o validator Rails (camada de
        // app), não o índice único do banco. Ambos cobrem invariantes
        // complementares — TC3 valida defesa no DB (constraint),
        // TC4 valida defesa no model (validator + I18n message).
        expect(true).toBe(true);
      },
    );
  });
});
