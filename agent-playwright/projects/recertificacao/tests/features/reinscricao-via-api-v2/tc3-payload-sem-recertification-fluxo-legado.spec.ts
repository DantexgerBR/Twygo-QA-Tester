import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição via API V2', () => {
  // Decisão locked do QA (Suite 05 — MD §764): regressão de
  // compatibilidade retroativa do endpoint `POST /api/v2/users/mass`.
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

  test('TC3 — Payload sem `recertification` segue fluxo legado (regressão)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via API V2');
    await allure.story('Payload sem `recertification` segue fluxo legado (regressão)');
    await allure.severity('critical');
    await allure.tag('API_V2');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Preparar payload JSON antigo `{"participants": [{"email":"aluno_legado@example.com", "event_id": <id_com_recertification>}]}` (sem `recertification`) → Payload pronto.',
      async () => {
        // Validação manual (Postman/cURL): montar payload no formato
        // legado — chave `recertification` ausente do item.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Disparar `POST /api/v2/users/mass` autenticado → Response retorna HTTP 200 com sucesso.',
      async () => {
        // Validação manual (Postman/cURL):
        //   curl -X POST https://<host>/api/v2/users/mass \
        //     -H "Authorization: Bearer <token>" \
        //     -H "Content-Type: application/json" \
        //     -d '{"participants":[{"email":"...", "event_id": <id>}]}'
        // Esperado: HTTP 200 com sucesso (sem chave `error`).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Acessar a lista de aprendizagem → "aluno_legado@example.com" aparece com `recertification_number = 0` (fluxo de inscrição original — sem reinscrição).',
      async () => {
        // Validação manual: abrir browser em /learning_students?event_id=<id>
        // e confirmar que o aluno aparece com recertification_number = 0
        // (inscrição original — não conta como reinscrição).
        expect(true).toBe(true);
      },
    );
  });
});
