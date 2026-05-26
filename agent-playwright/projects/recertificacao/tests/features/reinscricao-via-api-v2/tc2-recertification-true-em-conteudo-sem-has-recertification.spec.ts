import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição via API V2', () => {
  // Decisão locked do QA (Suite 05 — MD §745): suite testa endpoint
  // `POST /api/v2/users/mass` com payload misto (válido + inválido).
  // Autenticação API V2 (token Bearer/API key) não está configurada em
  // `config/environment.json` para o projeto Recertificação.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): habilitar quando o env tiver token API V2. Validar
  // via Postman/cURL.
  test.fixme(
    true,
    'requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.',
  );

  test('TC2 — Item com `recertification=true` em curso com `has_recertification=false` retorna erro por item (HTTP 207)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via API V2');
    await allure.story(
      'Item com `recertification=true` em curso com `has_recertification=false` retorna erro por item (HTTP 207)',
    );
    await allure.severity('normal');
    await allure.tag('API_V2');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Preparar payload JSON com 2 items: item A `{"email":"aluno_valido@example.com", "event_id": <id_com_recertification>, "recertification": true}`; item B `{"email":"aluno_invalido@example.com", "event_id": <id_SEM_recertification>, "recertification": true}` → Payload pronto.',
      async () => {
        // Validação manual (Postman/cURL): montar payload misto. Item A
        // referencia curso com has_recertification=true; item B
        // referencia curso com has_recertification=false.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Disparar `POST /api/v2/users/mass` autenticado → Response retorna HTTP 207 (multi-status).',
      async () => {
        // Validação manual (Postman/cURL):
        //   curl -X POST https://<host>/api/v2/users/mass \
        //     -H "Authorization: Bearer <token>" \
        //     -H "Content-Type: application/json" \
        //     -d '{"participants":[<itemA>, <itemB>]}'
        // Esperado: HTTP 207 (multi-status).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Inspecionar o corpo da resposta → Array de resultados: item A com sucesso e participant criado; item B com erro estruturado contendo chave I18n `reenroll_participant.errors.recertification_disabled_for_event`.',
      async () => {
        // Validação manual: inspecionar response body — array deve ter
        // 2 entradas:
        //   - item A: { status: "success", participant: {...} }
        //   - item B: { status: "error", error:
        //       "reenroll_participant.errors.recertification_disabled_for_event" }
        expect(true).toBe(true);
      },
    );
  });
});
