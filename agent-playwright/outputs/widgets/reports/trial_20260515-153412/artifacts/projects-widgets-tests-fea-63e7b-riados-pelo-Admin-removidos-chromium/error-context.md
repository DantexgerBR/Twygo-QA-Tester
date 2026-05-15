# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\trial\exclusao-trial-dados-admin.spec.ts >> Trial >> Exclusão de trial: dados criados pelo Admin removidos
- Location: projects\widgets\tests\features\trial\exclusao-trial-dados-admin.spec.ts:32:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('tbody tr[data-item-name="Painel do Admin Trial w2-1778869943667"]')
Expected: 0
Received: 1
Timeout:  60000ms

Call log:
  - Expect "toHaveCount" with timeout 60000ms
  - waiting for locator('tbody tr[data-item-name="Painel do Admin Trial w2-1778869943667"]')
    63 × locator resolved to 1 element
       - unexpected value "1"

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
      - generic [ref=e169]:
        - link "7089417 - Trial-AgentsQA 5" [ref=e170] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e171]: Trial-AgentsQA 5
      - button "Administrador G" [ref=e172] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e173]: G
    - text: M * * M * *
  - generic [ref=e174]:
    - generic [ref=e175]:
      - alert [ref=e179]:
        - generic [ref=e180]:
          - img [ref=e182]
          - generic [ref=e184]: Você ainda tem 1679 dias para testar a Twygo. Para não perder os dados do seu teste e continuar usando a plataforma, faça contato com o nosso time comercial.
        - button "Contato" [ref=e185] [cursor=pointer]
        - button "Close" [ref=e186] [cursor=pointer]:
          - img [ref=e187]
      - generic [ref=e190] [cursor=pointer]:
        - img [ref=e191]
        - img "twygo-logo" [ref=e193]
    - generic [ref=e195]:
      - generic [ref=e197]:
        - list [ref=e198]:
          - list [ref=e199]:
            - listitem [ref=e200] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e201]:
                - /url: /o/36981/dashboard
                - generic [ref=e202]:
                  - generic [ref=e204]: leaderboard
                  - generic [ref=e205]: Dashboard
            - listitem [ref=e206] [cursor=pointer]:
              - generic [ref=e208]:
                - generic [ref=e211]: school
                - generic [ref=e212]: Aprendizagem
                - generic [ref=e214]: G
            - listitem [ref=e215] [cursor=pointer]:
              - link "group Usuários" [ref=e216]:
                - /url: /o/36981/users
                - generic [ref=e217]:
                  - generic [ref=e219]: group
                  - generic [ref=e220]: Usuários
            - listitem [ref=e221] [cursor=pointer]:
              - link "work Empresas" [ref=e222]:
                - /url: /o/36981/companies
                - generic [ref=e223]:
                  - generic [ref=e225]: work
                  - generic [ref=e226]: Empresas
            - listitem [ref=e227] [cursor=pointer]:
              - link "live_help Questionários" [ref=e228]:
                - /url: /o/36981/question_lists
                - generic [ref=e229]:
                  - generic [ref=e231]: live_help
                  - generic [ref=e232]: Questionários
            - listitem [ref=e233] [cursor=pointer]:
              - link "groups Comunidades" [ref=e234]:
                - /url: /o/36981/feed
                - generic [ref=e235]:
                  - generic [ref=e237]: groups
                  - generic [ref=e238]: Comunidades
            - listitem [ref=e239] [cursor=pointer]:
              - generic [ref=e241]:
                - generic [ref=e244]: psychology
                - generic [ref=e245]:
                  - text: Skills
                  - generic [ref=e246]: BETA
                - generic [ref=e248]: G
        - generic [ref=e250]: Trial-AgentsQA 5
        - list [ref=e251]:
          - listitem [ref=e252] [cursor=pointer]:
            - generic [ref=e253]:
              - generic [ref=e254]: f
              - text: Configurações
              - generic [ref=e255]: G
            - text: e    s 
      - generic [ref=e257]:
        - generic [ref=e260]: Menu
        - generic [ref=e269]:
          - tablist [ref=e270]:
            - tab "Modos de uso" [ref=e271] [cursor=pointer]
            - tab "Painéis" [selected] [ref=e272] [cursor=pointer]
          - tabpanel "Painéis" [active] [ref=e274]:
            - generic [ref=e275]:
              - link "Adicionar" [ref=e276] [cursor=pointer]:
                - /url: /o/36981/panels/new
                - button "Adicionar" [ref=e277]:
                  - img [ref=e279]
                  - text: Adicionar
              - generic [ref=e281]:
                - generic [ref=e282]:
                  - img [ref=e284]
                  - textbox "Pesquise por nome ou descrição" [ref=e286]
                - generic [ref=e287]:
                  - generic [ref=e288] [cursor=pointer]: grid_view
                  - generic [ref=e289] [cursor=pointer]: reorder
                - button "Filtro" [ref=e290] [cursor=pointer]:
                  - generic [ref=e292]: filter_alt
                  - paragraph [ref=e294]: Filtro
            - table [ref=e296]:
              - rowgroup [ref=e297]:
                - row "Nome Descrição Data de criação Ativo?" [ref=e298]:
                  - columnheader "Nome" [ref=e299] [cursor=pointer]:
                    - generic [ref=e302]:
                      - text: Nome
                      - img [ref=e303]
                  - columnheader "Descrição" [ref=e305]:
                    - generic [ref=e306]: Descrição
                  - columnheader "Data de criação" [ref=e307] [cursor=pointer]:
                    - generic [ref=e310]:
                      - text: Data de criação
                      - img [ref=e311]
                  - columnheader "Ativo?" [ref=e313] [cursor=pointer]:
                    - generic [ref=e316]:
                      - text: Ativo?
                      - img [ref=e317]
                  - columnheader [ref=e319]
              - rowgroup [ref=e320]:
                - row "Painel do Admin Trial w2-1778869943667 15/05/2026 edit content_copy delete" [ref=e321]:
                  - cell "Painel do Admin Trial w2-1778869943667" [ref=e322]:
                    - paragraph [ref=e323]: Painel do Admin Trial w2-1778869943667
                  - cell [ref=e324]
                  - cell "15/05/2026" [ref=e325]
                  - cell [ref=e326]:
                    - checkbox [checked] [ref=e328]
                  - cell "edit content_copy delete" [ref=e331]:
                    - generic [ref=e333]:
                      - generic [ref=e336] [cursor=pointer]: edit
                      - generic [ref=e339] [cursor=pointer]: content_copy
                      - generic [ref=e342] [cursor=pointer]: delete
                - row "Painel do Admin Trial w2-1778868040225 15/05/2026 edit content_copy delete" [ref=e343]:
                  - cell "Painel do Admin Trial w2-1778868040225" [ref=e344]:
                    - paragraph [ref=e345]: Painel do Admin Trial w2-1778868040225
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
                - row "Painel do Admin Trial w0-1778867868567 15/05/2026 edit content_copy delete" [ref=e366]:
                  - cell "Painel do Admin Trial w0-1778867868567" [ref=e367]:
                    - paragraph [ref=e368]: Painel do Admin Trial w0-1778867868567
                  - cell [ref=e369]
                  - cell "15/05/2026" [ref=e370]
                  - cell [ref=e371]:
                    - checkbox [checked] [ref=e373]
                  - cell "edit content_copy delete" [ref=e376]:
                    - generic [ref=e378]:
                      - generic [ref=e381] [cursor=pointer]: edit
                      - generic [ref=e384] [cursor=pointer]: content_copy
                      - generic [ref=e387] [cursor=pointer]: delete
            - generic [ref=e389]:
              - generic [ref=e390]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e391]:
                  - generic [ref=e392]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e393]:
                  - generic [ref=e394]: chevron_left
                - button "1" [ref=e395] [cursor=pointer]
                - button "chevron_right" [disabled] [ref=e396]:
                  - generic [ref=e397]: chevron_right
              - generic [ref=e398]:
                - combobox [ref=e399]:
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
  1  | // spec: testsuite XML "Trial" → testcase "Exclusão de trial: dados criados pelo Admin removidos"
  2  | // seed: tests/seed.spec.ts
  3  | //
  4  | // Destrutivo: marca opção "Todas informações (pré-definidas e criadas pelos
  5  | // administradores)" — zera o tenant inteiro. Após esta run, o env (orgId 36981
  6  | // / trial-agentsqa-other) precisa ser re-provisionado — ver skill
  7  | // `provisionar-trial-projeto-twygo`.
  8  | 
  9  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  10 | import * as allure from 'allure-js-commons';
  11 | import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
  12 | import { PaineisListPage } from '../../../pages/PaineisListPage.js';
  13 | import { dismissCommonModals } from '../../../../../src/utils/modals.js';
  14 | import { TRIAL, adminTrialData } from './exclusao-trial-dados-admin.data.js';
  15 | 
  16 | test.describe('Trial', () => {
  17 |   test.use({
  18 |     baseURL: TRIAL.url,
  19 |     storageState: { cookies: [], origins: [] },
  20 |   });
  21 | 
  22 |   test.beforeEach(async ({ page }) => {
  23 |     await page.goto('/users/login');
  24 |     await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
  25 |     await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
  26 |     await page.getByRole('button', { name: 'Entrar' }).click();
  27 |     await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), {
  28 |       timeout: 30_000,
  29 |     });
  30 |   });
  31 | 
  32 |   test('Exclusão de trial: dados criados pelo Admin removidos', async ({ page, step }, testInfo) => {
  33 |     await allure.epic('Twygo - Widgets');
  34 |     await allure.feature('Trial');
  35 |     await allure.story('Exclusão de trial: dados criados pelo Admin removidos');
  36 |     await allure.severity('normal');
  37 | 
  38 |     // PaineisListPage navega via `/o/{orgId}/...`. Sem override, usaria
  39 |     // getOrgId() (env principal 36988) em vez do orgId da Trial — bug
  40 |     // latente confirmado no trace 2026-05-15. Padrão herdado da skill
  41 |     // `testar-ambientes-adicionais-twygo` (constructor orgIdOverride).
  42 |     const paineis = new PaineisListPage(page, String(TRIAL.orgId));
  43 |     const sophia = new SophiaWidget(page);
  44 |     // Nome único por run — bug-produto da exclusão Sophia (opção "Todas
  45 |     // informações" não remove painéis admin) acumula órfãos entre runs.
  46 |     // Suffix worker+timestamp isola este test. Ver
  47 |     // `testar-exclusao-dados-trial-twygo` §"Bug-produto confirmado".
  48 |     const adminPanelName = `${adminTrialData.adminPanelNameBase} w${testInfo.workerIndex}-${Date.now()}`;
  49 | 
  50 |     await step('Pré: Admin cria painel manual', async () => {
  51 |       await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
  52 |       await dismissCommonModals(page);
  53 |       await paineis.createPanel({ name: adminPanelName });
  54 |       // createPanel redireciona pra /panels/{id}/edit — voltar pra listagem para validar.
  55 |       await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
  56 |       await dismissCommonModals(page);
  57 |       await paineis.setViewMode('lista');
  58 |       await expect(paineis.getRowByItemName(adminPanelName)).toBeVisible();
  59 |     });
  60 | 
  61 |     await step('1. Executar rotina de exclusão (Sophia → Excluir informações → Todas informações)', async () => {
  62 |       await sophia.openDeleteModal();
  63 |       await sophia.selectOnly('all');
  64 |       await sophia.confirmDelete();
  65 |     });
  66 | 
  67 |     await step('2. Verificar base após exclusão — painel do Admin removido junto com pré-definidos', async () => {
  68 |       await page.goto(`/o/${TRIAL.orgId}/use_modes?tab=panels-tab`);
  69 |       await dismissCommonModals(page);
  70 |       await paineis.setViewMode('lista');
  71 |       // BUG-PRODUTO CONFIRMADO (2026-05-15 via Network probe): a request
  72 |       // `DELETE /api/v1/o/{orgId}/delete_trial_data` é disparada pelo
  73 |       // backend mas painéis admin sobrevivem. XML diz que deveriam ser
  74 |       // removidos junto com pré-definidos. Spec vermelho aqui é SINAL
  75 |       // CORRETO até produto corrigir. Timeout 60s mantido como cinto de
  76 |       // segurança (caso comportamento mude pra async no futuro).
  77 |       // Ver skill `testar-exclusao-dados-trial-twygo` §"Bug-produto confirmado".
> 78 |       await expect(paineis.getRowByItemName(adminPanelName)).toHaveCount(0, {
     |                                                              ^ Error: expect(locator).toHaveCount(expected) failed
  79 |         timeout: 60_000,
  80 |       });
  81 |     });
  82 |   });
  83 | });
  84 | 
```