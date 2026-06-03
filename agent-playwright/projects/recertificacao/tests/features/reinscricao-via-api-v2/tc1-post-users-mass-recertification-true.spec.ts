import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição via API V2', () => {
  // Decisão locked do QA (Suite 05 — MD §712): suite testa endpoint
  // `POST /api/v2/users/mass` com payload `recertification=true`. Mesmo
  // que Playwright tenha APIRequestContext, autenticação API V2 (token
  // Bearer/API key) não está configurada em `config/environment.json`
  // para o projeto Recertificação — só temos credenciais de browser.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): habilitar quando o env tiver token API V2 ou abrir
  // task de infra pra expor o token via .env. Validar via Postman/cURL.
  test.fixme(
    true,
    'requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.',
  );

  test('TC1 — POST /api/v2/users/mass com `recertification=true` cria participants reinscritos', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via API V2');
    await allure.story(
      'POST /api/v2/users/mass com `recertification=true` cria participants reinscritos',
    );
    await allure.severity('critical');
    await allure.tag('API_V2');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Preparar payload JSON `{"participants": [{"email":"aluno1@example.com", "event_id": <id_com_recertification>, "recertification": true}]}` → Payload pronto.',
      async () => {
        // Validação manual (Postman/cURL): montar payload conforme
        // contrato da API V2, usando event_id de curso com
        // has_recertification = true.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Disparar `POST /api/v2/users/mass` com o payload, autenticado com token de admin → Response retorna HTTP 200 ou 207 (multi-status).',
      async () => {
        // Validação manual (Postman/cURL):
        //   curl -X POST https://<host>/api/v2/users/mass \
        //     -H "Authorization: Bearer <token>" \
        //     -H "Content-Type: application/json" \
        //     -d '{"participants":[{...}]}'
        // Esperado: HTTP 200 ou 207.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Inspecionar o corpo da resposta → Item correspondente ao aluno aparece com status de sucesso, sem erro.',
      async () => {
        // Validação manual: inspecionar response body — array de
        // resultados deve trazer o item do aluno1@example.com com
        // status de sucesso (sem chave `error`).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '4. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" → "aluno1@example.com" aparece com `recertification_number = N+1`, `progress_score = 0`, status "Pendente".',
      async () => {
        // Validação manual: abrir browser em /learning_students?event_id=<id>
        // e confirmar que o aluno aparece com recertification_number
        // incrementado (N+1), progress_score = 0 e status "Pendente".
        expect(true).toBe(true);
      },
    );
  });
});
