# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts:59:3

# Error details

```
Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-2\traces\2ab4896513641b86a513-385b09b41406719da092.network'
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "The page you were looking for doesn't exist." [level=1] [ref=e3]
  - paragraph [ref=e4]: You may have mistyped the address or the page may have moved.
```

# Test source

```ts
  1   | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2   | import * as allure from 'allure-js-commons';
  3   | import { resolve } from 'node:path';
  4   | import { ContentEditPage } from '../../../pages/ContentEditPage.js';
  5   | import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';
  6   | 
  7   | const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
  8   | 
  9   | test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  10  |   // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  11  |   // beforeAll cria curso com defaults, depois abre edit e liga o switch
  12  |   // "Habilitar reinscrição" (que vive em tab posterior do form facelift,
  13  |   // NÃO no form de criação). A parte "com participants reinscritos"
  14  |   // ainda NÃO é coberta — helper canônico `SeedAdminPage.matricularAluno`
  15  |   // foi implementado em 2026-05-27 (skill v1.3 §"Matrícula de aluno"),
  16  |   // mas o TC4 ainda só usa createCurso. Refatorar quando o spec for
  17  |   // expandido pra cobrir cenário composto com participants reinscritos.
  18  |   // Por ora, o teste valida apenas que desativar o switch não dispara
  19  |   // modal/aviso de bloqueio (parte do RN 2.3).
  20  |   let cursoId: number;
  21  |   let cursoName: string;
  22  | 
  23  |   test.beforeAll(async ({ browser }, testInfo) => {
  24  |     cursoName = `Curso Recertificação TC4 w${testInfo.workerIndex}-${Date.now()}`;
  25  |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  26  |     const page = await context.newPage();
  27  |     try {
  28  |       const seed = new SeedAdminPage(page);
  29  |       cursoId = await seed.createCurso({ name: cursoName });
  30  |       // Ligar o switch "Habilitar reinscrição" via ContentEditPage —
  31  |       // skill v1.3 documenta que o switch NÃO está no form de criação
  32  |       // (vive em tab posterior do edit).
  33  |       const contentEdit = new ContentEditPage(page);
  34  |       await contentEdit.openEditById(cursoId);
  35  |       await contentEdit.setHabilitarReinscricao(true);
  36  |       await contentEdit.save();
  37  |       await contentEdit.expectSaveSuccess();
  38  |       // Re-grava storage atualizado pra evitar session race entre o
  39  |       // contexto do seed e o `page` fixture do test (Twygo regenera
  40  |       // session_id após operações de criação/save).
  41  |       await context.storageState({ path: STORAGE_PATH });
  42  |     } finally {
> 43  |       await context.close();
      |                     ^ Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-2\traces\2ab4896513641b86a513-385b09b41406719da092.network'
  44  |     }
  45  |   });
  46  | 
  47  |   test.afterAll(async ({ browser }) => {
  48  |     if (!cursoId) return;
  49  |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  50  |     const page = await context.newPage();
  51  |     try {
  52  |       const seed = new SeedAdminPage(page);
  53  |       await seed.deleteCursoByIdSafe(cursoId);
  54  |     } finally {
  55  |       await context.close();
  56  |     }
  57  |   });
  58  | 
  59  |   test('TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso', async ({
  60  |     page,
  61  |   }) => {
  62  |     await allure.epic('Twygo - Recertificação');
  63  |     await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
  64  |     await allure.story(
  65  |       'Desativar o switch em curso com participants reinscritos é permitido sem aviso',
  66  |     );
  67  |     await allure.severity('critical');
  68  | 
  69  |     const contentEdit = new ContentEditPage(page);
  70  | 
  71  |     await allure.step(
  72  |       '1. Pré-condição: curso com `has_recertification = true` (criado no beforeAll)',
  73  |       async () => {
  74  |         // REVISAR: validação cross-suite com Suite 02 — testar com participants
  75  |         // reinscritos via `SeedAdminPage.matricularAluno` (já implementado;
  76  |         // ver Page Object). Refatorar TC pra invocar matricularAluno +
  77  |         // simular reinscrição quando expandir cobertura.
  78  |         await allure.tag('REVIEW_NEEDED');
  79  |         // Switch vive na tab "Acesso" do facelift.
  80  |         await contentEdit.openEditByIdInAcessoTab(cursoId);
  81  |         await expect(contentEdit.getHabilitarReinscricaoVisible()).toBeVisible();
  82  |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
  83  |       },
  84  |     );
  85  | 
  86  |     await allure.step(
  87  |       '2. Acessar a edição deste curso → página é exibida com switch ligado',
  88  |       async () => {
  89  |         // Estado já validado no passo 1; aqui apenas reafirma URL/visibilidade
  90  |         // para registrar o passo separadamente no relatório Allure.
  91  |         await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  92  |       },
  93  |     );
  94  | 
  95  |     await allure.step(
  96  |       '3. Clicar no switch para desligar → nenhum modal de confirmação aparece',
  97  |       async () => {
  98  |         await contentEdit.setHabilitarReinscricao(false);
  99  |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
  100 |         // RN 2.3 — não deve haver modal/aviso bloqueante.
  101 |         await expect(page.getByRole('dialog')).toBeHidden();
  102 |       },
  103 |     );
  104 | 
  105 |     await allure.step(
  106 |       '4. Clicar em "Salvar" → curso é salvo; histórico (recertification_number) preservado',
  107 |       async () => {
  108 |         await contentEdit.save();
  109 |         await contentEdit.expectSaveSuccess();
  110 | 
  111 |         // Reabre para confirmar persistência do switch OFF (tab "Acesso").
  112 |         await contentEdit.openEditByIdInAcessoTab(cursoId);
  113 |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
  114 | 
  115 |         // REVISAR: assertion `participants.recertification_number > 0` no banco
  116 |         // é verificação DB pura — fora do escopo Playwright (ver
  117 |         // CONTRACT.md §validador secundário).
  118 |         await allure.tag('NEEDS_DB_TEST');
  119 |       },
  120 |     );
  121 |   });
  122 | });
  123 | 
```