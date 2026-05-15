# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\trial\exclusao-trial-dados-sophiatech.spec.ts >> Trial >> Exclusão de trial: dados pré-definidos da SophiaTech removidos
- Location: projects\widgets\tests\features\trial\exclusao-trial-dados-sophiatech.spec.ts:33:3

# Error details

```
Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).

expect(received).toBeLessThan(expected)

Expected: < 4
Received:   4
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Trial-AgentsQA 5" [ref=e4]:
        - img "Logo - Trial-AgentsQA 5" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/36981/dashboard
              - generic [ref=e14]:
                - generic [ref=e16]: leaderboard
                - generic [ref=e17]: Dashboard
          - listitem [ref=e18]:
            - generic [ref=e20]:
              - generic [ref=e23]: school
              - generic [ref=e24]: Aprendizagem
            - list [ref=e25]:
              - listitem [ref=e26]:
                - link "format_list_bulleted_add Conteúdos" [ref=e27] [cursor=pointer]:
                  - /url: /o/36981/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/36981/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "workspace_premium Certificados" [ref=e39] [cursor=pointer]:
                  - /url: /o/36981/certificate_models
                  - generic [ref=e40]:
                    - generic [ref=e42]: workspace_premium
                    - generic [ref=e43]: Certificados
          - listitem [ref=e44]:
            - link "group Usuários" [ref=e45] [cursor=pointer]:
              - /url: /o/36981/users
              - generic [ref=e46]:
                - generic [ref=e48]: group
                - generic [ref=e49]: Usuários
          - listitem [ref=e50]:
            - link "work Empresas" [ref=e51] [cursor=pointer]:
              - /url: /o/36981/companies
              - generic [ref=e52]:
                - generic [ref=e54]: work
                - generic [ref=e55]: Empresas
          - listitem [ref=e56]:
            - link "live_help Questionários" [ref=e57] [cursor=pointer]:
              - /url: /o/36981/question_lists
              - generic [ref=e58]:
                - generic [ref=e60]: live_help
                - generic [ref=e61]: Questionários
          - listitem [ref=e62]:
            - link "groups Comunidades" [ref=e63] [cursor=pointer]:
              - /url: /o/36981/feed
              - generic [ref=e64]:
                - generic [ref=e66]: groups
                - generic [ref=e67]: Comunidades
          - listitem [ref=e68]:
            - generic [ref=e70]:
              - generic [ref=e73]: psychology
              - generic [ref=e74]:
                - text: Skills
                - generic [ref=e75]: BETA
            - list [ref=e76]:
              - listitem [ref=e77]:
                - link "lan Organograma" [ref=e78] [cursor=pointer]:
                  - /url: /o/36981/organization_chart
                  - generic [ref=e79]:
                    - generic [ref=e81]: lan
                    - generic [ref=e82]: Organograma
              - listitem [ref=e83]:
                - link "badge Funções" [ref=e84] [cursor=pointer]:
                  - /url: /o/36981/roles
                  - generic [ref=e85]:
                    - generic [ref=e87]: badge
                    - generic [ref=e88]: Funções
              - listitem [ref=e89]:
                - link "award_star Competências" [ref=e90] [cursor=pointer]:
                  - /url: /o/36981/organization_chart_competencies
                  - generic [ref=e91]:
                    - generic [ref=e93]: award_star
                    - generic [ref=e94]: Competências
      - generic [ref=e95]: Trial-AgentsQA 5
      - list [ref=e96]:
        - listitem [ref=e97]:
          - generic [ref=e98]:
            - generic [ref=e99]: f
            - text: Configurações
          - list [ref=e100]:
            - listitem [ref=e101]:
              - link "e Organização" [ref=e102] [cursor=pointer]:
                - /url: /o/36981/edit
                - generic [ref=e103]: e
                - text: Organização
            - listitem [ref=e104]:
              - link " Menu" [ref=e105] [cursor=pointer]:
                - /url: /o/36981/use_modes
                - generic [ref=e106]: 
                - text: Menu
            - listitem [ref=e107]:
              - link "electrical_services Integrações" [ref=e108] [cursor=pointer]:
                - /url: /o/36981/integrations
                - generic [ref=e109]: electrical_services
                - text: Integrações
            - listitem [ref=e110]:
              - link "flash_auto Piloto automático" [ref=e111] [cursor=pointer]:
                - /url: /o/36981/autopilots
                - generic [ref=e112]: flash_auto
                - text: Piloto automático
            - listitem [ref=e113]:
              - link " Regras do Jogo" [ref=e114] [cursor=pointer]:
                - /url: /o/36981/game_rules
                - generic [ref=e115]: 
                - text: Regras do Jogo
            - listitem [ref=e116]:
              - link " Comunicação" [ref=e117] [cursor=pointer]:
                - /url: /o/36981/communication
                - generic [ref=e118]: 
                - text: Comunicação
            - listitem [ref=e119]:
              - link "sell Cobrança de inscrição" [ref=e120] [cursor=pointer]:
                - /url: /o/36981/payments
                - generic [ref=e121]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e122]:
              - link "credit_card Plano e assinatura" [ref=e123] [cursor=pointer]:
                - /url: /o/36981/subscription_plans
                - generic [ref=e124]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e125]:
              - link " Segurança NOVO" [ref=e126] [cursor=pointer]:
                - /url: /o/36981/security
                - generic [ref=e127]: 
                - text: Segurança NOVO
            - listitem [ref=e128]:
              - link "palette Aparência" [ref=e129] [cursor=pointer]:
                - /url: /o/36981/appearance
                - generic [ref=e130]: palette
                - text: Aparência
            - listitem [ref=e131]:
              - link "smart_toy Controle de IA BETA" [ref=e132] [cursor=pointer]:
                - /url: /o/36981/ai_consumption_analysis
                - generic [ref=e133]: smart_toy
                - text: Controle de IA BETA
    - generic [ref=e136]:
      - generic [ref=e137]:
        - img [ref=e138]
        - text: Trial-AgentsQA 5
      - img [ref=e140]
  - text: "0"
  - generic [ref=e143]:
    - generic "Logo - Trial-AgentsQA 5" [ref=e145]:
      - link "Trial-AgentsQA 5" [ref=e147] [cursor=pointer]:
        - /url: /o/36981/dashboard
    - generic [ref=e151]:
      - link "Open chat" [ref=e155] [cursor=pointer]:
        - /url: /o/36981/chats
        - button "Open chat" [ref=e156]:
          - img [ref=e157]
      - button "Users" [ref=e164] [cursor=pointer]:
        - img [ref=e165]
      - generic [ref=e168]:
        - link "7089417 - Trial-AgentsQA 5" [ref=e169] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e170]: Trial-AgentsQA 5
      - button "Administrador G" [ref=e171] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e172]: G
    - text: M * * M * *
  - generic [ref=e173]:
    - generic [ref=e174]:
      - alert [ref=e178]:
        - generic [ref=e179]:
          - img [ref=e181]
          - generic [ref=e183]: Você ainda tem 1679 dias para testar a Twygo. Para não perder os dados do seu teste e continuar usando a plataforma, faça contato com o nosso time comercial.
        - button "Contato" [ref=e184] [cursor=pointer]
        - button "Close" [ref=e185] [cursor=pointer]:
          - img [ref=e186]
      - generic [ref=e189] [cursor=pointer]:
        - img [ref=e190]
        - img "twygo-logo" [ref=e192]
    - generic [ref=e194]:
      - generic [ref=e196]:
        - list [ref=e197]:
          - list [ref=e198]:
            - listitem [ref=e199] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e200]:
                - /url: /o/36981/dashboard
                - generic [ref=e201]:
                  - generic [ref=e203]: leaderboard
                  - generic [ref=e204]: Dashboard
            - listitem [ref=e205] [cursor=pointer]:
              - generic [ref=e207]:
                - generic [ref=e210]: school
                - generic [ref=e211]: Aprendizagem
                - generic [ref=e213]: G
            - listitem [ref=e214] [cursor=pointer]:
              - link "group Usuários" [ref=e215]:
                - /url: /o/36981/users
                - generic [ref=e216]:
                  - generic [ref=e218]: group
                  - generic [ref=e219]: Usuários
            - listitem [ref=e220] [cursor=pointer]:
              - link "work Empresas" [ref=e221]:
                - /url: /o/36981/companies
                - generic [ref=e222]:
                  - generic [ref=e224]: work
                  - generic [ref=e225]: Empresas
            - listitem [ref=e226] [cursor=pointer]:
              - link "live_help Questionários" [ref=e227]:
                - /url: /o/36981/question_lists
                - generic [ref=e228]:
                  - generic [ref=e230]: live_help
                  - generic [ref=e231]: Questionários
            - listitem [ref=e232] [cursor=pointer]:
              - link "groups Comunidades" [ref=e233]:
                - /url: /o/36981/feed
                - generic [ref=e234]:
                  - generic [ref=e236]: groups
                  - generic [ref=e237]: Comunidades
            - listitem [ref=e238] [cursor=pointer]:
              - generic [ref=e240]:
                - generic [ref=e243]: psychology
                - generic [ref=e244]:
                  - text: Skills
                  - generic [ref=e245]: BETA
                - generic [ref=e247]: G
        - generic [ref=e249]: Trial-AgentsQA 5
        - list [ref=e250]:
          - listitem [ref=e251] [cursor=pointer]:
            - generic [ref=e252]:
              - generic [ref=e253]: f
              - text: Configurações
              - generic [ref=e254]: G
            - text: e    s 
      - generic [ref=e256]:
        - generic [ref=e259]: Menu
        - generic [ref=e268]:
          - tablist [ref=e269]:
            - tab "Modos de uso" [ref=e270] [cursor=pointer]
            - tab "Painéis" [selected] [ref=e271] [cursor=pointer]
          - tabpanel "Painéis" [active] [ref=e273]:
            - generic [ref=e274]:
              - link "Adicionar" [ref=e275] [cursor=pointer]:
                - /url: /o/36981/panels/new
                - button "Adicionar" [ref=e276]:
                  - img [ref=e278]
                  - text: Adicionar
              - generic [ref=e280]:
                - generic [ref=e281]:
                  - img [ref=e283]
                  - textbox "Pesquise por nome ou descrição" [ref=e285]
                - generic [ref=e286]:
                  - generic [ref=e287] [cursor=pointer]: grid_view
                  - generic [ref=e288] [cursor=pointer]: reorder
                - button "Filtro" [ref=e289] [cursor=pointer]:
                  - generic [ref=e291]: filter_alt
                  - paragraph [ref=e293]: Filtro
            - table [ref=e295]:
              - rowgroup [ref=e296]:
                - row "Nome Descrição Data de criação Ativo?" [ref=e297]:
                  - columnheader "Nome" [ref=e298] [cursor=pointer]:
                    - generic [ref=e301]:
                      - text: Nome
                      - img [ref=e302]
                  - columnheader "Descrição" [ref=e304]:
                    - generic [ref=e305]: Descrição
                  - columnheader "Data de criação" [ref=e306] [cursor=pointer]:
                    - generic [ref=e309]:
                      - text: Data de criação
                      - img [ref=e310]
                  - columnheader "Ativo?" [ref=e312] [cursor=pointer]:
                    - generic [ref=e315]:
                      - text: Ativo?
                      - img [ref=e316]
                  - columnheader [ref=e318]
              - rowgroup [ref=e319]:
                - row "Painel do Admin Trial 15/05/2026 edit content_copy delete" [ref=e320]:
                  - cell "Painel do Admin Trial" [ref=e321]:
                    - paragraph [ref=e322]: Painel do Admin Trial
                  - cell [ref=e323]:
                    - paragraph [ref=e324]
                  - cell "15/05/2026" [ref=e325]
                  - cell [ref=e326]:
                    - checkbox [checked] [ref=e328]
                  - cell "edit content_copy delete" [ref=e331]:
                    - generic [ref=e333]:
                      - generic [ref=e336] [cursor=pointer]: edit
                      - generic [ref=e339] [cursor=pointer]: content_copy
                      - generic [ref=e342] [cursor=pointer]: delete
                - row "Painel do Admin Trial 15/05/2026 edit content_copy delete" [ref=e343]:
                  - cell "Painel do Admin Trial" [ref=e344]:
                    - paragraph [ref=e345]: Painel do Admin Trial
                  - cell [ref=e346]:
                    - paragraph [ref=e347]
                  - cell "15/05/2026" [ref=e348]
                  - cell [ref=e349]:
                    - checkbox [checked] [ref=e351]
                  - cell "edit content_copy delete" [ref=e354]:
                    - generic [ref=e356]:
                      - generic [ref=e359] [cursor=pointer]: edit
                      - generic [ref=e362] [cursor=pointer]: content_copy
                      - generic [ref=e365] [cursor=pointer]: delete
                - row "Painel do Admin Trial 15/05/2026 edit content_copy delete" [ref=e366]:
                  - cell "Painel do Admin Trial" [ref=e367]:
                    - paragraph [ref=e368]: Painel do Admin Trial
                  - cell [ref=e369]
                  - cell "15/05/2026" [ref=e370]
                  - cell [ref=e371]:
                    - checkbox [checked] [ref=e373]
                  - cell "edit content_copy delete" [ref=e376]:
                    - generic [ref=e378]:
                      - generic [ref=e381] [cursor=pointer]: edit
                      - generic [ref=e384] [cursor=pointer]: content_copy
                      - generic [ref=e387] [cursor=pointer]: delete
                - row "Painel do Admin Trial 15/05/2026 edit content_copy delete" [ref=e388]:
                  - cell "Painel do Admin Trial" [ref=e389]:
                    - paragraph [ref=e390]: Painel do Admin Trial
                  - cell [ref=e391]:
                    - paragraph [ref=e392]
                  - cell "15/05/2026" [ref=e393]
                  - cell [ref=e394]:
                    - checkbox [checked] [ref=e396]
                  - cell "edit content_copy delete" [ref=e399]:
                    - generic [ref=e401]:
                      - generic [ref=e404] [cursor=pointer]: edit
                      - generic [ref=e407] [cursor=pointer]: content_copy
                      - generic [ref=e410] [cursor=pointer]: delete
            - generic [ref=e412]:
              - generic [ref=e413]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e414]:
                  - generic [ref=e415]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e416]:
                  - generic [ref=e417]: chevron_left
                - button "1" [ref=e418] [cursor=pointer]
                - button "chevron_right" [disabled] [ref=e419]:
                  - generic [ref=e420]: chevron_right
              - generic [ref=e421]:
                - combobox [ref=e422]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1  | // spec: testsuite XML "Trial" → testcase "Exclusão de trial: dados pré-definidos da SophiaTech removidos"
  2  | // seed: tests/seed.spec.ts
  3  | //
  4  | // Destrutivo: zera dados pré-definidos da Trial. Após esta run, o env
  5  | // (orgId 36981 / trial-agentsqa-other) precisa ser re-provisionado para
  6  | // novas execuções — ver skill `provisionar-trial-projeto-twygo`.
  7  | 
  8  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  9  | import * as allure from 'allure-js-commons';
  10 | import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
  11 | import { PaineisListPage } from '../../../pages/PaineisListPage.js';
  12 | import { dismissCommonModals } from '../../../../../src/utils/modals.js';
  13 | import { TRIAL } from './exclusao-trial-dados-sophiatech.data.js';
  14 | 
  15 | test.describe('Trial', () => {
  16 |   // Login explícito autorizado para Trial — globalSetup cobre só env principal/secundário
  17 |   // do projeto. Ver `testar-exclusao-dados-trial-twygo` §"Storage state da Trial".
  18 |   test.use({
  19 |     baseURL: TRIAL.url,
  20 |     storageState: { cookies: [], origins: [] },
  21 |   });
  22 | 
  23 |   test.beforeEach(async ({ page }) => {
  24 |     await page.goto('/users/login');
  25 |     await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
  26 |     await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
  27 |     await page.getByRole('button', { name: 'Entrar' }).click();
  28 |     await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), {
  29 |       timeout: 30_000,
  30 |     });
  31 |   });
  32 | 
  33 |   test('Exclusão de trial: dados pré-definidos da SophiaTech removidos', async ({
  34 |     page,
  35 |     step,
  36 |   }) => {
  37 |     await allure.epic('Twygo - Widgets');
  38 |     await allure.feature('Trial');
  39 |     await allure.story('Exclusão de trial: dados pré-definidos da SophiaTech removidos');
  40 |     await allure.severity('critical');
  41 | 
  42 |     const paineis = new PaineisListPage(page);
  43 |     const sophia = new SophiaWidget(page);
  44 | 
  45 |     let initialCount = 0;
  46 | 
  47 |     await step('Pré: contar painéis pré-definidos atuais', async () => {
  48 |       await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
  49 |       await dismissCommonModals(page);
  50 |       await paineis.setViewMode('lista');
  51 |       // `getRowCount` conta a row "Não há dados para exibir" como 1 — usar
  52 |       // o getter de empty-state pra detectar Trial drenada antes de seguir.
  53 |       const isEmpty = (await paineis.getEmptyStateText().count()) > 0;
  54 |       initialCount = isEmpty ? 0 : await paineis.getRowCount();
  55 |       test.skip(
  56 |         initialCount === 0,
  57 |         'Trial sem painéis pré-definidos — re-provisione via `provisionar-trial-projeto-twygo`.',
  58 |       );
  59 |     });
  60 | 
  61 |     await step('1. Executar rotina de exclusão (Sophia → Excluir informações → SophiaTech)', async () => {
  62 |       await sophia.openDeleteModal();
  63 |       await sophia.selectOnly('sophiatech');
  64 |       await sophia.confirmDelete();
  65 |     });
  66 | 
  67 |     await step('2. Verificar base após exclusão — registros SophiaTech removidos', async () => {
  68 |       await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
  69 |       await dismissCommonModals(page);
  70 |       await paineis.setViewMode('lista');
  71 |       const finalCount = await paineis.getRowCount();
  72 |       expect(
  73 |         finalCount,
  74 |         `Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=${initialCount}, final=${finalCount}).`,
> 75 |       ).toBeLessThan(initialCount);
     |         ^ Error: Após exclusão de pré-definidos, contagem de painéis deve diminuir (inicial=4, final=4).
  76 |     });
  77 |   });
  78 | });
  79 | 
```