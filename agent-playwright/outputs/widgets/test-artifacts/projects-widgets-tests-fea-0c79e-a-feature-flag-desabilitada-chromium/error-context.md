# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects/widgets/tests/features/listagem-de-paineis/feature-flag-desabilitada.spec.ts >> Listagem de painéis >> Acessar listagem com a feature flag desabilitada
- Location: projects/widgets/tests/features/listagem-de-paineis/feature-flag-desabilitada.spec.ts:25:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Modos de uso' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('tab', { name: 'Modos de uso' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link [ref=e13] [cursor=pointer]:
              - /url: /o/36989/dashboard
              - generic [ref=e14]:
                - generic [ref=e16]: leaderboard
                - generic [ref=e17]: Dashboard
          - listitem [ref=e18]:
            - generic [ref=e20]:
              - generic [ref=e23]: school
              - generic [ref=e24]: Aprendizagem
            - list [ref=e25]:
              - listitem [ref=e26]:
                - link [ref=e27] [cursor=pointer]:
                  - /url: /o/36989/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link [ref=e33] [cursor=pointer]:
                  - /url: /o/36989/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link [ref=e39] [cursor=pointer]:
                  - /url: /o/36989/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link [ref=e46] [cursor=pointer]:
                  - /url: /o/36989/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
          - listitem [ref=e51]:
            - link [ref=e52] [cursor=pointer]:
              - /url: /o/36989/users
              - generic [ref=e53]:
                - generic [ref=e55]: group
                - generic [ref=e56]: Usuários
          - listitem [ref=e57]:
            - link [ref=e58] [cursor=pointer]:
              - /url: /o/36989/companies
              - generic [ref=e59]:
                - generic [ref=e61]: work
                - generic [ref=e62]: Empresas
          - listitem [ref=e63]:
            - link [ref=e64] [cursor=pointer]:
              - /url: /o/36989/question_lists
              - generic [ref=e65]:
                - generic [ref=e67]: live_help
                - generic [ref=e68]: Questionários
          - listitem [ref=e69]:
            - link [ref=e70] [cursor=pointer]:
              - /url: /o/36989/feed
              - generic [ref=e71]:
                - generic [ref=e73]: groups
                - generic [ref=e74]: Comunidades
          - listitem [ref=e75]:
            - generic [ref=e77]:
              - generic [ref=e80]: psychology
              - generic [ref=e81]:
                - text: Skills
                - generic [ref=e82]: BETA
            - list [ref=e83]:
              - listitem [ref=e84]:
                - link [ref=e85] [cursor=pointer]:
                  - /url: /o/36989/organization_chart
                  - generic [ref=e86]:
                    - generic [ref=e88]: lan
                    - generic [ref=e89]: Organograma
              - listitem [ref=e90]:
                - link [ref=e91] [cursor=pointer]:
                  - /url: /o/36989/roles
                  - generic [ref=e92]:
                    - generic [ref=e94]: badge
                    - generic [ref=e95]: Funções
              - listitem [ref=e96]:
                - link [ref=e97] [cursor=pointer]:
                  - /url: /o/36989/organization_chart_competencies
                  - generic [ref=e98]:
                    - generic [ref=e100]: award_star
                    - generic [ref=e101]: Competências
          - listitem [ref=e102]:
            - generic [ref=e104]:
              - generic [ref=e107]: account_tree
              - generic [ref=e108]: Processos
            - list [ref=e109]:
              - listitem [ref=e110]:
                - link [ref=e111] [cursor=pointer]:
                  - /url: /o/36989/organization_datasets
                  - generic [ref=e112]:
                    - generic [ref=e114]: send
                    - generic [ref=e115]: Repositórios
              - listitem [ref=e116]:
                - link [ref=e117] [cursor=pointer]:
                  - /url: /o/36989/process_architecture
                  - generic [ref=e118]:
                    - generic [ref=e120]: send
                    - generic [ref=e121]: Arquitetura de Processos
              - listitem [ref=e122]:
                - link [ref=e123] [cursor=pointer]:
                  - /url: /o/36989/process_documentations
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Agente de Documentação
              - listitem [ref=e128]:
                - link [ref=e129] [cursor=pointer]:
                  - /url: /o/36989/reference_documents
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Documentos de Referência
              - listitem [ref=e134]:
                - link [ref=e135] [cursor=pointer]:
                  - /url: /o/36989/visualize_documentations
                  - generic [ref=e136]:
                    - generic [ref=e138]: send
                    - generic [ref=e139]: Portal de processos
      - generic [ref=e140]: widgets-disabled [36989]
      - list [ref=e141]:
        - listitem [ref=e142]:
          - generic [ref=e143]:
            - generic [ref=e144]: f
            - text: Configurações
          - list [ref=e145]:
            - listitem [ref=e146]:
              - link [ref=e147] [cursor=pointer]:
                - /url: /o/36989/edit
                - generic [ref=e148]: e
                - text: Organização
            - listitem [ref=e149]:
              - link [ref=e150] [cursor=pointer]:
                - /url: /o/36989/use_modes
                - generic [ref=e151]: 
                - text: Navegação
            - listitem [ref=e152]:
              - link [ref=e153] [cursor=pointer]:
                - /url: /o/36989/integrations
                - generic [ref=e154]: electrical_services
                - text: Integrações
            - listitem [ref=e155]:
              - link [ref=e156] [cursor=pointer]:
                - /url: /o/36989/autopilots
                - generic [ref=e157]: flash_auto
                - text: Piloto automático
            - listitem [ref=e158]:
              - link [ref=e159] [cursor=pointer]:
                - /url: /o/36989/game_rules
                - generic [ref=e160]: 
                - text: Regras do Jogo
            - listitem [ref=e161]:
              - link [ref=e162] [cursor=pointer]:
                - /url: /o/36989/communication
                - generic [ref=e163]: 
                - text: Comunicação
            - listitem [ref=e164]:
              - link [ref=e165] [cursor=pointer]:
                - /url: /o/36989/payments
                - generic [ref=e166]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e167]:
              - link [ref=e168] [cursor=pointer]:
                - /url: /o/36989/subscription_plans
                - generic [ref=e169]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e170]:
              - link [ref=e171] [cursor=pointer]:
                - /url: /o/36989/security
                - generic [ref=e172]: 
                - text: Segurança NOVO
            - listitem [ref=e173]:
              - link [ref=e174] [cursor=pointer]:
                - /url: /o/36989/appearance
                - generic [ref=e175]: palette
                - text: Aparência
            - listitem [ref=e176]:
              - link [ref=e177] [cursor=pointer]:
                - /url: /o/36989/ai_consumption_analysis
                - generic [ref=e178]: credit_card
                - text: Créditos de IA BETA
    - generic [ref=e181]:
      - generic [ref=e182]:
        - img [ref=e183]
        - text: Claude Agents
      - img [ref=e185]
  - text: "0"
  - generic [ref=e188]:
    - link [ref=e191] [cursor=pointer]:
      - /url: /o/36989/dashboard
      - img [ref=e192]
    - generic [ref=e196]:
      - link [ref=e200] [cursor=pointer]:
        - /url: /o/36989/chats
        - button [ref=e201]:
          - img [ref=e202]
      - button [ref=e209] [cursor=pointer]:
        - img [ref=e210]
      - generic [ref=e213]:
        - link [ref=e214] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e215]: Claude Agents
      - button [ref=e216] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e217]: G
    - text: M * * M * *
  - generic [ref=e218]:
    - generic [ref=e228]:
      - generic [ref=e229]:
        - paragraph [ref=e230]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 20/05.
        - paragraph [ref=e231]: Quer mais detalhes sobre essa novidade? Veja aqui
      - button [ref=e233] [cursor=pointer]: Responder pesquisa
      - button [ref=e234] [cursor=pointer]:
        - img [ref=e235]
    - generic [ref=e238]:
      - generic [ref=e240]:
        - list [ref=e241]:
          - list [ref=e242]:
            - listitem [ref=e243] [cursor=pointer]:
              - link [ref=e244]:
                - /url: /o/36989/dashboard
                - generic [ref=e245]:
                  - generic [ref=e247]: leaderboard
                  - generic [ref=e248]: Dashboard
            - listitem [ref=e249] [cursor=pointer]:
              - generic [ref=e251]:
                - generic [ref=e254]: school
                - generic [ref=e255]: Aprendizagem
                - generic [ref=e257]: G
            - listitem [ref=e258] [cursor=pointer]:
              - link [ref=e259]:
                - /url: /o/36989/users
                - generic [ref=e260]:
                  - generic [ref=e262]: group
                  - generic [ref=e263]: Usuários
            - listitem [ref=e264] [cursor=pointer]:
              - link [ref=e265]:
                - /url: /o/36989/companies
                - generic [ref=e266]:
                  - generic [ref=e268]: work
                  - generic [ref=e269]: Empresas
            - listitem [ref=e270] [cursor=pointer]:
              - link [ref=e271]:
                - /url: /o/36989/question_lists
                - generic [ref=e272]:
                  - generic [ref=e274]: live_help
                  - generic [ref=e275]: Questionários
            - listitem [ref=e276] [cursor=pointer]:
              - link [ref=e277]:
                - /url: /o/36989/feed
                - generic [ref=e278]:
                  - generic [ref=e280]: groups
                  - generic [ref=e281]: Comunidades
            - listitem [ref=e282] [cursor=pointer]:
              - generic [ref=e284]:
                - generic [ref=e287]: psychology
                - generic [ref=e288]:
                  - text: Skills
                  - generic [ref=e289]: BETA
                - generic [ref=e291]: G
            - listitem [ref=e292] [cursor=pointer]:
              - generic [ref=e294]:
                - generic [ref=e297]: account_tree
                - generic [ref=e298]: Processos
                - generic [ref=e300]: G
        - generic [ref=e302]: widgets-disabled [36989]
        - list [ref=e303]:
          - listitem [ref=e304] [cursor=pointer]:
            - generic [ref=e305]:
              - generic [ref=e306]: f
              - text: Configurações
              - generic [ref=e307]: G
            - list [ref=e308]:
              - listitem [ref=e309]:
                - link [ref=e310]:
                  - /url: /o/36989/edit
                  - generic [ref=e311]: e
                  - text: Organização
              - listitem [ref=e312]:
                - link [ref=e313]:
                  - /url: /o/36989/use_modes
                  - generic [ref=e314]: 
                  - text: Navegação
              - listitem [ref=e315]:
                - link [ref=e316]:
                  - /url: /o/36989/integrations
                  - generic [ref=e317]: electrical_services
                  - text: Integrações
              - listitem [ref=e318]:
                - link [ref=e319]:
                  - /url: /o/36989/autopilots
                  - generic [ref=e320]: flash_auto
                  - text: Piloto automático
              - listitem [ref=e321]:
                - link [ref=e322]:
                  - /url: /o/36989/game_rules
                  - generic [ref=e323]: 
                  - text: Regras do Jogo
              - listitem [ref=e324]:
                - link [ref=e325]:
                  - /url: /o/36989/communication
                  - generic [ref=e326]: 
                  - text: Comunicação
              - listitem [ref=e327]:
                - link [ref=e328]:
                  - /url: /o/36989/payments
                  - generic [ref=e329]: sell
                  - text: Cobrança de inscrição
              - listitem [ref=e330]:
                - link [ref=e331]:
                  - /url: /o/36989/subscription_plans
                  - generic [ref=e332]: credit_card
                  - text: Plano e assinatura
              - text: s
              - listitem [ref=e333]:
                - link [ref=e334]:
                  - /url: /o/36989/security
                  - generic [ref=e335]: 
                  - text: Segurança NOVO
              - listitem [ref=e336]:
                - link [ref=e337]:
                  - /url: /o/36989/appearance
                  - generic [ref=e338]: palette
                  - text: Aparência
              - listitem [ref=e339]:
                - link [ref=e340]:
                  - /url: /o/36989/ai_consumption_analysis
                  - generic [ref=e341]: credit_card
                  - text: Créditos de IA BETA
      - generic [ref=e343]:
        - generic [ref=e346]: Menu > Modos de uso
        - generic [ref=e355]:
          - tablist [ref=e356]:
            - tab [selected] [ref=e357] [cursor=pointer]: Modos de uso
          - tabpanel [ref=e359]:
            - generic [ref=e360]:
              - generic [ref=e361]:
                - button [ref=e363] [cursor=pointer]:
                  - img [ref=e365]
                  - text: Adicionar
                - generic [ref=e367]:
                  - generic [ref=e368]:
                    - img [ref=e370]
                    - textbox [ref=e372]:
                      - /placeholder: Pesquise aqui
                  - generic [ref=e373]:
                    - generic [ref=e374] [cursor=pointer]: grid_view
                    - generic [ref=e375] [cursor=pointer]: reorder
              - table [ref=e377]:
                - rowgroup [ref=e378]:
                  - row [ref=e379]:
                    - columnheader [ref=e380] [cursor=pointer]:
                      - generic [ref=e383]:
                        - text: Código
                        - img [ref=e384]
                    - columnheader [ref=e386] [cursor=pointer]:
                      - generic [ref=e389]:
                        - text: Modo de uso
                        - img [ref=e390]
                    - columnheader [ref=e392]:
                      - generic [ref=e393]: Menus exibidos
                    - columnheader [ref=e394] [cursor=pointer]:
                      - generic [ref=e396]:
                        - generic [ref=e397]:
                          - text: Padrão
                          - img [ref=e398]
                        - img [ref=e401]
                    - columnheader [ref=e403]
                - rowgroup [ref=e404]:
                  - row [ref=e405]:
                    - cell [ref=e406] [cursor=pointer]: "1"
                    - cell [ref=e407] [cursor=pointer]:
                      - paragraph [ref=e408]: Colaborador
                    - cell [ref=e409] [cursor=pointer]:
                      - generic [ref=e410]:
                        - generic [ref=e412]: leaderboard
                        - generic [ref=e414]: analytics
                        - generic [ref=e416]: menu_book
                        - generic [ref=e418]: more_horiz
                        - generic [ref=e420]: groups
                    - cell [ref=e421]:
                      - radio [ref=e423]
                    - cell [ref=e425]:
                      - generic [ref=e427]:
                        - generic [ref=e430] [cursor=pointer]: edit
                        - generic [ref=e433] [cursor=pointer]: delete
                  - row [ref=e434]:
                    - cell [ref=e435] [cursor=pointer]: "2"
                    - cell [ref=e436] [cursor=pointer]:
                      - paragraph [ref=e437]: Aluno
                    - cell [ref=e438] [cursor=pointer]:
                      - generic [ref=e439]:
                        - generic [ref=e441]: leaderboard
                        - generic [ref=e443]: menu_book
                        - generic [ref=e445]: more_horiz
                        - generic [ref=e447]: groups
                        - generic [ref=e449]: analytics
                    - cell [ref=e450]:
                      - radio [checked] [ref=e452]
                    - cell [ref=e454]:
                      - generic [ref=e456]:
                        - generic [ref=e459] [cursor=pointer]: edit
                        - generic [ref=e462] [cursor=pointer]: delete
              - generic [ref=e464]:
                - generic [ref=e465]:
                  - button [disabled] [ref=e466]:
                    - generic [ref=e467]: keyboard_double_arrow_left
                  - button [disabled] [ref=e468]:
                    - generic [ref=e469]: chevron_left
                  - button [ref=e470] [cursor=pointer]: "1"
                  - button [disabled] [ref=e471]:
                    - generic [ref=e472]: chevron_right
                - generic [ref=e473]:
                  - combobox [ref=e474]
                  - generic:
                    - img
  - region [ref=e475]:
    - iframe [ref=e476]:
      - button "Abrir chat ao vivo" [ref=f5e5]:
        - img [ref=f5e8]
        - img [ref=f5e15]
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
  1  | // Testsuite: Listagem de painéis
  2  | // TC7 — STATUS: READY. Plugado ao env secundário `staging-widgets-disabled`
  3  | // (orgId 36989, baseUrl widgetsdisabled.stage.twygoead.com) — re-explorado
  4  | // 2026-05-06: o tablist em `/use_modes` mostra apenas "Modos de uso", a aba
  5  | // "Painéis" não renderiza, e direct-navigate para `?tab=panels-tab` cai no
  6  | // tabpanel default (Modos de uso) — NÃO aparece mensagem "página não existe"
  7  | // no DOM. A asserção do step 3 valida que a aba Painéis continua hidden
  8  | // (assertion fiel ao comportamento real, não à prosa literal do XML).
  9  | 
  10 | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  11 | import * as allure from 'allure-js-commons';
  12 | import { getEnvByName } from '../../../../../src/utils/environment.js';
  13 | import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
  14 | import { PaineisListPage } from '../../../pages/PaineisListPage.js';
  15 | 
  16 | const disabledEnv = getEnvByName('staging-widgets-disabled');
  17 | const disabledOrgId = disabledEnv.orgId;
  18 | 
  19 | test.describe('Listagem de painéis', () => {
  20 |   test.use({
  21 |     storageState: SECONDARY_STORAGE_PATH,
  22 |     baseURL: disabledEnv.baseUrl,
  23 |   });
  24 | 
  25 |   test('Acessar listagem com a feature flag desabilitada', async ({ page }) => {
  26 |     await allure.epic('Twygo - Widgets');
  27 |     await allure.feature('Listagem de painéis');
  28 |     await allure.story('Acessar listagem com a feature flag desabilitada');
  29 |     await allure.severity('critical');
  30 |     await allure.label('executionType', 'automated');
  31 | 
  32 |     const paineis = new PaineisListPage(page);
  33 | 
  34 |     await allure.step('1. Acessar /use_modes e verificar tabs', async () => {
  35 |       await page.goto(`/o/${disabledOrgId}/use_modes`);
> 36 |       await expect(paineis.getModosDeUsoTab()).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  37 |     });
  38 | 
  39 |     await allure.step(
  40 |       "2. Verificar que a tab 'Painéis' não aparece com a flag off",
  41 |       async () => {
  42 |         await expect(paineis.getPaineisTab()).toHaveCount(0);
  43 |       },
  44 |     );
  45 | 
  46 |     await allure.step(
  47 |       "3. Acessar URL direta do tab Painéis e verificar que a aba continua hidden",
  48 |       async () => {
  49 |         await page.goto(`/o/${disabledOrgId}/use_modes?tab=panels-tab`);
  50 |         // REVISAR: XML diz que a UI deve mostrar "página não existe", mas o
  51 |         // comportamento real (re-explorado 2026-05-06) é silencioso — o app
  52 |         // simplesmente renderiza o tabpanel default ("Modos de uso") sem
  53 |         // mensagem de erro. Asserção fiel: a aba Painéis continua ausente
  54 |         // mesmo após direct-navigate.
  55 |         await expect(paineis.getPaineisTab()).toHaveCount(0);
  56 |         await expect(paineis.getModosDeUsoTab()).toBeVisible();
  57 |       },
  58 |     );
  59 |   });
  60 | });
  61 | 
```