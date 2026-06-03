import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição via API V2', () => {
  // Decisão locked do QA (Suite 05 — MD §781): testa compatibilidade
  // com flag `:recertificacao` OFF. Além de autenticação API V2 não
  // configurada, exige toggle runtime da flag via Flipper (playbook
  // `flipper`).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "validação secundária
  // manual hoje"): habilitar quando o env tiver token API V2 e o
  // playbook flipper for executável em runtime. Validar via Postman/cURL
  // após desativar a flag manualmente no Flipper-UI.
  test.fixme(
    true,
    'requer autenticação API V2 (token Bearer/API key) não configurada para o projeto Recertificação em config/environment.json. Validar manualmente via Postman/cURL ou habilitar quando o env tiver token API V2.',
  );

  test('TC4 — Com flag OFF, parâmetro `recertification` é ignorado silenciosamente', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via API V2');
    await allure.story(
      'Com flag OFF, parâmetro `recertification` é ignorado silenciosamente',
    );
    await allure.severity('normal');
    await allure.tag('API_V2');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` para a organização → Flag fica OFF.',
      async () => {
        // Validação manual: Flipper-UI em /admin/manage/features/recertificacao
        // → Remove actor `Organization;<orgId>` (NUNCA Fully Disable —
        // afeta todas as orgs). Skill `testar-feature-flag-twygo` cobre.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Disparar `POST /api/v2/users/mass` com payload contendo `recertification: true` por item → Response retorna HTTP 200 com sucesso. Sem erro relacionado a feature flag.',
      async () => {
        // Validação manual (Postman/cURL):
        //   curl -X POST https://<host>/api/v2/users/mass \
        //     -H "Authorization: Bearer <token>" \
        //     -H "Content-Type: application/json" \
        //     -d '{"participants":[{"email":"...", "event_id": <id>, "recertification": true}]}'
        // Esperado: HTTP 200 com sucesso. Backend ignora silenciosamente
        // o parâmetro `recertification` (não retorna erro de flag).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Acessar a lista de aprendizagem → Aluno aparece com `recertification_number = 0` (parâmetro foi ignorado).',
      async () => {
        // Validação manual: abrir browser em /learning_students?event_id=<id>
        // e confirmar que o aluno aparece com recertification_number = 0
        // (parâmetro foi ignorado — tratado como inscrição normal).
        //
        // Cleanup pós-teste: re-adicionar actor `Organization;<orgId>` no
        // Flipper-UI pra restaurar estado original (skill
        // `testar-feature-flag-twygo`).
        expect(true).toBe(true);
      },
    );
  });
});
