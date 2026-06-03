# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\api\reinscricao-via-api-v2.spec.ts >> Reinscrição via API V2 >> TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva
- Location: projects\recertificacao\tests\api\reinscricao-via-api-v2.spec.ts:101:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  17  |  */
  18  | function withUniqueEmail(payload: AttendeesCreatePayload, workerIndex: number): AttendeesCreatePayload {
  19  |   const ts = Date.now();
  20  |   return {
  21  |     ...payload,
  22  |     participants: payload.participants.map(p => ({
  23  |       ...p,
  24  |       email: p.email.replace('@', `-w${workerIndex}-${ts}@`),
  25  |     })),
  26  |   };
  27  | }
  28  | 
  29  | /**
  30  |  * Suite "Reinscrição via API V2" — primeira suite 100% API do monorepo.
  31  |  *
  32  |  * **Histórico**:
  33  |  * - AT original previa endpoint `POST /api/v2/users/mass` com body
  34  |  *   `{participants: [{email, event_id, recertification}]}` — ERRADO.
  35  |  * - Validação live em 2026-05-28 contra recertificacao-testeqa.stage.twygoead.com
  36  |  *   confirmou: endpoint real é `POST /api/v2/attendees`, body `{participants,
  37  |  *   content_ids}`, campo `recertification` aceito silenciosamente (feature
  38  |  *   ainda não publicada pelos devs).
  39  |  * - Spec atualizado para endpoint correto.
  40  |  *
  41  |  * **Pré-condições do env staging-recertificacao** (manuais hoje — TODO popular
  42  |  * `fixed-seed.data.ts`):
  43  |  * - `fixedSeed.cursoComRecertificacaoEventId` ≠ 0 — curso elegível para
  44  |  *   reinscrição. Hoje qualquer curso da org serve (806755 / 806756 / 806757),
  45  |  *   porque `has_recertification` ainda não é setável até feature shipped.
  46  |  * - `fixedSeed.cursoSemRecertificacaoEventId` ≠ 0 — pode ser o mesmo do TC1
  47  |  *   temporariamente (até diferenciação faça sentido)
  48  |  * - Token V2 configurado em `.env` como `API_TOKEN` (modo `fixed_token`)
  49  |  * - Feature flag `:recertificacao` ON na org 37048 (default — para TC4
  50  |  *   inverter temporariamente)
  51  |  *
  52  |  * **Skills relevantes**:
  53  |  * - testar-api-twygo (skill principal)
  54  |  * - provisionar-token-api-twygo (auth headers)
  55  |  * - validar-schema-api-twygo (Ajv + schemas/)
  56  |  * - testar-feature-flag-twygo (TC4 toggle)
  57  |  * - limpar-dados-de-teste-twygo (afterAll cleanup — TODO)
  58  |  */
  59  | 
  60  | test.describe('Reinscrição via API V2', () => {
  61  |   // authHeaders pode ser cached no describe (é só Record<string,string>, sem
  62  |   // estado de Playwright fixture). client precisa ser criado por test —
  63  |   // `request` fixture de `beforeAll` tem escopo diferente de `test()`.
  64  |   let authHeaders: Record<string, string>;
  65  | 
  66  |   test.beforeAll(async () => {
  67  |     // Sentinel — falha cedo com mensagem clara se seed não foi populado
  68  |     if (fixedSeed.cursoComRecertificacaoEventId === 0 || fixedSeed.cursoSemRecertificacaoEventId === 0) {
  69  |       throw new Error(
  70  |         '[Reinscrição via API V2] Seed não populado em fixed-seed.data.ts. ' +
  71  |           'Ver TODOs nos campos cursoComRecertificacaoEventId e cursoSemRecertificacaoEventId. ' +
  72  |           'Para validar o pipeline contra o env real, usar IDs reais do staging-recertificacao ' +
  73  |           '(ex: 806755, 806756, 806757 — qualquer curso serve até feature recertification shippar). ' +
  74  |           'Skill: provisionar-seed.',
  75  |       );
  76  |     }
  77  |     authHeaders = await getApiAuthHeaders();
  78  |   });
  79  | 
  80  |   test('TC1 — POST /api/v2/attendees com recertification=true responde 200 e cria attendee', async ({ request }, testInfo) => {
  81  |     const client = new EventsApiClient(request);
  82  |     const payload = withUniqueEmail(data.payloadTC1, testInfo.workerIndex);
  83  |     const response = await client.createAttendees(payload, authHeaders);
  84  | 
  85  |     expect(response.status()).toBe(200);
  86  | 
  87  |     const body = await response.json();
  88  |     validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC1)');
  89  | 
  90  |     // Validação base: participant inscrito com sucesso no content_id alvo
  91  |     const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
  92  |     const successList = body.participants.success?.[contentIdKey] ?? [];
  93  |     expect(successList).toHaveLength(1);
  94  |     expect(successList[0].email).toBe(payload.participants[0].email);
  95  | 
  96  |     // TODO: quando backend publicar feature `recertification`, adicionar
  97  |     // asserção que confirme que o participant foi criado como REINSCRITO
  98  |     // (ex: GET /api/v2/attendees?user_id=... e verificar recertification_number).
  99  |   });
  100 | 
  101 |   test('TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva', async ({ request }) => {
  102 |     const client = new EventsApiClient(request);
  103 |     const response = await client.createAttendees(data.payloadTC2_misto, authHeaders);
  104 | 
  105 |     // Regra de negócio (validada live 2026-05-28): backend retorna 422 quando
  106 |     // payload pede `recertification: true` para user que NÃO está aprovado na
  107 |     // inscrição anterior. Mensagem exata: "Aluno já inscrito mas não aprovado
  108 |     // — recertificação não criada".
  109 |     expect(response.status()).toBe(422);
  110 | 
  111 |     const body = await response.json();
  112 |     validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC2 mix)');
  113 | 
  114 |     // Espera array de erros por content_id com a mensagem específica
  115 |     const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
  116 |     const errorList = body.participants.error?.[contentIdKey] ?? [];
> 117 |     expect(errorList.length).toBeGreaterThan(0);
      |                              ^ Error: expect(received).toBeGreaterThan(expected)
  118 |     const allErrorMessages = errorList.flatMap(e => e.error ?? []).join(' ');
  119 |     expect(allErrorMessages.toLowerCase()).toContain('não aprovado');
  120 |     expect(allErrorMessages.toLowerCase()).toContain('recertificação não criada');
  121 |   });
  122 | 
  123 |   test('TC3 — Payload sem recertification segue fluxo legado (regressão)', async ({ request }, testInfo) => {
  124 |     const client = new EventsApiClient(request);
  125 |     const payload = withUniqueEmail(data.payloadTC3_legado, testInfo.workerIndex);
  126 |     const response = await client.createAttendees(payload, authHeaders);
  127 | 
  128 |     expect(response.status()).toBe(200);
  129 | 
  130 |     const body = await response.json();
  131 |     validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC3 legado)');
  132 | 
  133 |     const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
  134 |     const successList = body.participants.success?.[contentIdKey] ?? [];
  135 |     expect(successList).toHaveLength(1);
  136 |     expect(successList[0].email).toBe(payload.participants[0].email);
  137 |   });
  138 | 
  139 |   /**
  140 |    * TC4 — cenário "flag OFF". Setup UI no `beforeAll` (chromium.launch manual)
  141 |    * seguindo padrão da skill `testar-api-twygo`. Revert idempotente via
  142 |    * `ensureFlipperActor`.
  143 |    */
  144 |   test.describe('TC4 — Com flag OFF, parâmetro recertification é ignorado silenciosamente', () => {
  145 |     let browser: Browser;
  146 |     let revertFlipper: () => Promise<void>;
  147 | 
  148 |     test.beforeAll(async () => {
  149 |       browser = await chromium.launch();
  150 |       revertFlipper = await ensureFlipperActor(browser, {
  151 |         envName: 'staging-recertificacao',
  152 |         storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage.json'),
  153 |         flag: 'recertificacao',
  154 |         actor: `Organization;${fixedSeed.principalOrgId}`,
  155 |         enabled: false,
  156 |       });
  157 |     });
  158 | 
  159 |     test.afterAll(async () => {
  160 |       await revertFlipper();
  161 |       await browser.close();
  162 |     });
  163 | 
  164 |     test('payload com recertification:true é processado como inscrição normal', async ({ request }, testInfo) => {
  165 |       const client = new EventsApiClient(request);
  166 |       const payload = withUniqueEmail(data.payloadTC4_flagOff, testInfo.workerIndex);
  167 |       const response = await client.createAttendees(payload, authHeaders);
  168 | 
  169 |       expect(response.status()).toBe(200);
  170 | 
  171 |       const body = await response.json();
  172 |       validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC4 flag OFF)');
  173 | 
  174 |       const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
  175 |       const successList = body.participants.success?.[contentIdKey] ?? [];
  176 |       expect(successList).toHaveLength(1);
  177 |       expect(successList[0].email).toBe(payload.participants[0].email);
  178 | 
  179 |       // Garantia: sem erro referenciando feature flag em `errors` (string ou array)
  180 |       const errorsBlob = typeof body.errors === 'string'
  181 |         ? body.errors
  182 |         : JSON.stringify(body.errors);
  183 |       expect(errorsBlob.toLowerCase()).not.toContain('feature_flag');
  184 |       expect(errorsBlob.toLowerCase()).not.toContain('recertificacao_disabled');
  185 |     });
  186 |   });
  187 | });
  188 | 
```