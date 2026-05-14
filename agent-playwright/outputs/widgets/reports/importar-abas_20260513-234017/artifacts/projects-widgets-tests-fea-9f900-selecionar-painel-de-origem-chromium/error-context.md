# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\importar-abas\tentar-importar-sem-painel.spec.ts >> Importar abas >> Tentar importar sem selecionar painel de origem
- Location: projects\widgets\tests\features\importar-abas\tentar-importar-sem-painel.spec.ts:16:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByTestId('tabs-navigation-add-button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - widgets [36988]" [ref=e4]:
        - img "Logo - widgets [36988]" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/36988/dashboard
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
                  - /url: /o/36988/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/36988/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/36988/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/36988/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
          - listitem [ref=e51]:
            - link "group Usuários" [ref=e52] [cursor=pointer]:
              - /url: /o/36988/users
              - generic [ref=e53]:
                - generic [ref=e55]: group
                - generic [ref=e56]: Usuários
          - listitem [ref=e57]:
            - link "work Empresas" [ref=e58] [cursor=pointer]:
              - /url: /o/36988/companies
              - generic [ref=e59]:
                - generic [ref=e61]: work
                - generic [ref=e62]: Empresas
          - listitem [ref=e63]:
            - link "live_help Questionários" [ref=e64] [cursor=pointer]:
              - /url: /o/36988/question_lists
              - generic [ref=e65]:
                - generic [ref=e67]: live_help
                - generic [ref=e68]: Questionários
          - listitem [ref=e69]:
            - link "groups Comunidades" [ref=e70] [cursor=pointer]:
              - /url: /o/36988/feed
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
                - link "lan Organograma" [ref=e85] [cursor=pointer]:
                  - /url: /o/36988/organization_chart
                  - generic [ref=e86]:
                    - generic [ref=e88]: lan
                    - generic [ref=e89]: Organograma
              - listitem [ref=e90]:
                - link "badge Funções" [ref=e91] [cursor=pointer]:
                  - /url: /o/36988/roles
                  - generic [ref=e92]:
                    - generic [ref=e94]: badge
                    - generic [ref=e95]: Funções
              - listitem [ref=e96]:
                - link "award_star Competências" [ref=e97] [cursor=pointer]:
                  - /url: /o/36988/organization_chart_competencies
                  - generic [ref=e98]:
                    - generic [ref=e100]: award_star
                    - generic [ref=e101]: Competências
          - listitem [ref=e102]:
            - generic [ref=e104]:
              - generic [ref=e107]: account_tree
              - generic [ref=e108]: Processos
            - list [ref=e109]:
              - listitem [ref=e110]:
                - link "send Repositórios" [ref=e111] [cursor=pointer]:
                  - /url: /o/36988/organization_datasets
                  - generic [ref=e112]:
                    - generic [ref=e114]: send
                    - generic [ref=e115]: Repositórios
              - listitem [ref=e116]:
                - link "send Arquitetura de Processos" [ref=e117] [cursor=pointer]:
                  - /url: /o/36988/process_architecture
                  - generic [ref=e118]:
                    - generic [ref=e120]: send
                    - generic [ref=e121]: Arquitetura de Processos
              - listitem [ref=e122]:
                - link "send Agente de Documentação" [ref=e123] [cursor=pointer]:
                  - /url: /o/36988/process_documentations
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Agente de Documentação
              - listitem [ref=e128]:
                - link "send Documentos de Referência" [ref=e129] [cursor=pointer]:
                  - /url: /o/36988/reference_documents
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Documentos de Referência
              - listitem [ref=e134]:
                - link "send Portal de processos" [ref=e135] [cursor=pointer]:
                  - /url: /o/36988/visualize_documentations
                  - generic [ref=e136]:
                    - generic [ref=e138]: send
                    - generic [ref=e139]: Portal de processos
      - generic [ref=e140]: widgets [36988]
      - list [ref=e141]:
        - listitem [ref=e142]:
          - generic [ref=e143]:
            - generic [ref=e144]: f
            - text: Configurações
          - list [ref=e145]:
            - listitem [ref=e146]:
              - link "e Organização" [ref=e147] [cursor=pointer]:
                - /url: /o/36988/edit
                - generic [ref=e148]: e
                - text: Organização
            - listitem [ref=e149]:
              - link " Menu" [ref=e150] [cursor=pointer]:
                - /url: /o/36988/use_modes
                - generic [ref=e151]: 
                - text: Menu
            - listitem [ref=e152]:
              - link "electrical_services Integrações" [ref=e153] [cursor=pointer]:
                - /url: /o/36988/integrations
                - generic [ref=e154]: electrical_services
                - text: Integrações
            - listitem [ref=e155]:
              - link "flash_auto Piloto automático" [ref=e156] [cursor=pointer]:
                - /url: /o/36988/autopilots
                - generic [ref=e157]: flash_auto
                - text: Piloto automático
            - listitem [ref=e158]:
              - link " Regras do Jogo" [ref=e159] [cursor=pointer]:
                - /url: /o/36988/game_rules
                - generic [ref=e160]: 
                - text: Regras do Jogo
            - listitem [ref=e161]:
              - link " Comunicação" [ref=e162] [cursor=pointer]:
                - /url: /o/36988/communication
                - generic [ref=e163]: 
                - text: Comunicação
            - listitem [ref=e164]:
              - link "sell Cobrança de inscrição" [ref=e165] [cursor=pointer]:
                - /url: /o/36988/payments
                - generic [ref=e166]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e167]:
              - link "credit_card Plano e assinatura" [ref=e168] [cursor=pointer]:
                - /url: /o/36988/subscription_plans
                - generic [ref=e169]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e170]:
              - link " Segurança NOVO" [ref=e171] [cursor=pointer]:
                - /url: /o/36988/security
                - generic [ref=e172]: 
                - text: Segurança NOVO
            - listitem [ref=e173]:
              - link "smart_toy Controle de IA BETA" [ref=e174] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e175]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e176]:
              - link "palette Aparência" [ref=e177] [cursor=pointer]:
                - /url: /o/36988/appearance
                - generic [ref=e178]: palette
                - text: Aparência
            - listitem [ref=e179]:
              - link "smart_toy Controle de IA BETA" [ref=e180] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e181]: smart_toy
                - text: Controle de IA BETA
    - generic [ref=e184]:
      - generic [ref=e185]:
        - img [ref=e186]
        - text: Claude Agents
      - img [ref=e188]
  - text: "0"
  - generic [ref=e191]:
    - generic "Logo - widgets [36988]" [ref=e193]:
      - link "Logo - widgets [36988]" [ref=e194] [cursor=pointer]:
        - /url: /o/36988/dashboard
        - img "Logo - widgets [36988]" [ref=e195]
    - generic [ref=e199]:
      - link "Open chat" [ref=e203] [cursor=pointer]:
        - /url: /o/36988/chats
        - button "Open chat" [ref=e204]:
          - img [ref=e205]
      - button "Users" [ref=e212] [cursor=pointer]:
        - img [ref=e213]
      - generic [ref=e216]:
        - link "7089491 - Claude Agents" [ref=e217] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e218]: Claude Agents
      - button "Administrador G" [ref=e219] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e220]: G
    - text: M * * M * *
  - generic [ref=e223]:
    - generic [ref=e225]:
      - list [ref=e226]:
        - list [ref=e227]:
          - listitem [ref=e228] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e229]:
              - /url: /o/36988/dashboard
              - generic [ref=e230]:
                - generic [ref=e232]: leaderboard
                - generic [ref=e233]: Dashboard
          - listitem [ref=e234] [cursor=pointer]:
            - generic [ref=e236]:
              - generic [ref=e239]: school
              - generic [ref=e240]: Aprendizagem
              - generic [ref=e242]: G
          - listitem [ref=e243] [cursor=pointer]:
            - link "group Usuários" [ref=e244]:
              - /url: /o/36988/users
              - generic [ref=e245]:
                - generic [ref=e247]: group
                - generic [ref=e248]: Usuários
          - listitem [ref=e249] [cursor=pointer]:
            - link "work Empresas" [ref=e250]:
              - /url: /o/36988/companies
              - generic [ref=e251]:
                - generic [ref=e253]: work
                - generic [ref=e254]: Empresas
          - listitem [ref=e255] [cursor=pointer]:
            - link "live_help Questionários" [ref=e256]:
              - /url: /o/36988/question_lists
              - generic [ref=e257]:
                - generic [ref=e259]: live_help
                - generic [ref=e260]: Questionários
          - listitem [ref=e261] [cursor=pointer]:
            - link "groups Comunidades" [ref=e262]:
              - /url: /o/36988/feed
              - generic [ref=e263]:
                - generic [ref=e265]: groups
                - generic [ref=e266]: Comunidades
          - listitem [ref=e267] [cursor=pointer]:
            - generic [ref=e269]:
              - generic [ref=e272]: psychology
              - generic [ref=e273]:
                - text: Skills
                - generic [ref=e274]: BETA
              - generic [ref=e276]: G
          - listitem [ref=e277] [cursor=pointer]:
            - generic [ref=e279]:
              - generic [ref=e282]: account_tree
              - generic [ref=e283]: Processos
              - generic [ref=e285]: G
      - generic [ref=e287]: widgets [36988]
      - list [ref=e288]:
        - listitem [ref=e289] [cursor=pointer]:
          - generic [ref=e290]:
            - generic [ref=e291]: f
            - text: Configurações
            - generic [ref=e292]: G
          - text: e    s 
    - generic [ref=e294]:
      - generic [ref=e297]: Edit Panel
      - generic [ref=e305]:
        - generic [ref=e306]:
          - button "Voltar" [ref=e308] [cursor=pointer]:
            - img [ref=e310]
            - text: Voltar
          - heading "Painel Sem Selecao 1778726329387" [level=2] [ref=e313]
        - generic [ref=e315]:
          - tablist [ref=e316]:
            - tab "Identificação" [selected] [ref=e317] [cursor=pointer]
            - tab "Layouts" [ref=e318] [cursor=pointer]
          - tabpanel "Identificação" [ref=e320]:
            - generic [ref=e321]:
              - generic [ref=e325]:
                - group [ref=e327]:
                  - generic [ref=e329]:
                    - generic [ref=e330]: Nome
                    - generic [ref=e331]: "*"
                  - textbox [ref=e333]: Painel Sem Selecao 1778726329387
                  - paragraph [ref=e336]: 32 / 250
                - generic [ref=e338]:
                  - generic [ref=e341]: Descrição
                  - generic [ref=e343]:
                    - toolbar [ref=e344]:
                      - generic [ref=e345]:
                        - generic [ref=e346]:
                          - generic [ref=e348]:
                            - button [disabled]:
                              - img
                            - button [disabled]:
                              - img
                          - group [ref=e352]:
                            - radio "Parágrafo" [ref=e353] [cursor=pointer]:
                              - generic [ref=e354]: Parágrafo
                              - generic [ref=e355]:
                                - img: "true"
                          - generic [ref=e359]:
                            - button [ref=e360] [cursor=pointer]:
                              - img
                            - textbox [ref=e361]: "16"
                            - button [ref=e362] [cursor=pointer]:
                              - img
                          - generic [ref=e365]:
                            - group [ref=e366]:
                              - radio [ref=e367] [cursor=pointer]:
                                - img
                            - group [ref=e368]:
                              - radio [ref=e369] [cursor=pointer]:
                                - img
                            - group [ref=e370]:
                              - radio [ref=e371] [cursor=pointer]:
                                - img
                            - group [ref=e372]:
                              - radio [ref=e373] [cursor=pointer]:
                                - img
                            - group [ref=e374]:
                              - radio [ref=e375] [cursor=pointer]:
                                - img
                          - group [ref=e379]:
                            - radio [ref=e380] [cursor=pointer]:
                              - generic [ref=e381]:
                                - img
                              - generic [ref=e382]:
                                - img: "true"
                        - button "more_horiz" [ref=e383] [cursor=pointer]:
                          - generic [ref=e384]: more_horiz
                    - textbox [ref=e385]:
                      - generic [ref=e386]:
                        - generic [ref=e389]:
                          - button [ref=e391] [cursor=pointer]:
                            - generic:
                              - img
                          - button [ref=e392] [cursor=pointer]:
                            - button [ref=e393]:
                              - img [ref=e394]
                        - generic [ref=e404]: Painel criado pela automação de testes (suíte Importar abas).
                  - paragraph [ref=e407]: 61 / 500
                - group [ref=e409]:
                  - checkbox "Painel ativo" [checked] [ref=e411]
                  - generic [ref=e415]: Painel ativo
              - generic [ref=e416]:
                - button "Salvar" [ref=e417] [cursor=pointer]
                - button "Cancelar" [ref=e418] [cursor=pointer]
  - region "Widget de chat" [ref=e419]:
    - iframe [ref=e420]:
      - generic [ref=f34e2]:
        - generic [ref=f34e6]:
          - button "Abrir chat ao vivo" [ref=f34e7]:
            - img "Avatar de Sophia" [ref=f34e12]
            - generic [ref=f34e13]: Estamos prontos para te atender no que você precisar, viu?! 🤩
          - button "Fechar página de boas-vindas" [ref=f34e14]:
            - img [ref=f34e16]
        - button "Abrir chat ao vivo" [ref=f34e23]:
          - img [ref=f34e26]
          - img [ref=f34e33]
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
  - textbox [ref=e421]
```

# Test source

```ts
  1  | // spec: projects/widgets/specs/importar-abas-plan.md
  2  | // seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts
  3  | 
  4  | // Cenário negativo — Painel de origem vazio: valida estado inicial do modal
  5  | // step 2 antes de qualquer seleção (sem painel → sem aba → botão disabled).
  6  | 
  7  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  8  | import * as allure from 'allure-js-commons';
  9  | import { PainelFormPage } from '../../../pages/PainelFormPage.js';
  10 | import { tentarImportarSemPainelData as data } from './tentar-importar-sem-painel.data.js';
  11 | import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';
  12 | 
  13 | test.use({ viewport: { width: 1920, height: 1080 } });
  14 | 
  15 | test.describe('Importar abas', () => {
  16 |   test('Tentar importar sem selecionar painel de origem', async ({ page, step }) => {
  17 |     await allure.epic('Twygo - Widgets');
  18 |     await allure.feature('Importar abas');
  19 |     await allure.story('Tentar importar sem selecionar painel de origem');
  20 |     await allure.severity('normal');
  21 |     await allure.label('executionType', 'manual');
  22 | 
  23 |     const painelForm = new PainelFormPage(page);
  24 | 
  25 |     // 1. Pré-condição: criar painel; abrir modal step 2 SEM selecionar painel
  26 |     await step('1. Criar painel e abrir modal step 2 de importar (sem seleção)', async () => {
  27 |       await painelForm.goToNew();
  28 |       const panelId = await painelForm.createPanel(data.panelName, shared.panelDescription);
  29 |       await painelForm.goToEdit(panelId, 'layouts');
  30 | 
> 31 |       await painelForm.getAddTabButton().click();
     |                                          ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  32 |       await painelForm.getImportTabOption().click();
  33 | 
  34 |       const modal = painelForm.getAddTabModal();
  35 |       await expect(modal).toBeVisible();
  36 |       await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();
  37 | 
  38 |       // Painel de origem vazio (placeholder visível)
  39 |       const panelSelect = page.getByTestId('import-tab-modal-panel-select');
  40 |       await expect(panelSelect).toBeVisible();
  41 |       await expect(panelSelect.getByText('Selecione um painel...')).toBeVisible();
  42 |     });
  43 | 
  44 |     // 2. Verificar campos secundários ocultos antes de seleção de painel
  45 |     await step("2. Verificar que 'Aba disponível' não aparece enquanto Painel de origem estiver vazio", async () => {
  46 |       await expect(page.getByTestId('import-tab-modal-tab-select')).toBeHidden();
  47 | 
  48 |       // 'Nome da nova aba' container também só aparece após seleção de aba
  49 |       // (confirmado live: aparece em TC 1.3/1.4 após Aba X selecionada)
  50 |       await expect(page.getByTestId('import-tab-modal-tab-name-input')).toBeHidden();
  51 |     });
  52 | 
  53 |     // 3. Verificar botão 'Importar aba' disabled
  54 |     await step("3. Verificar botão 'Importar aba' está DISABLED sem painel selecionado", async () => {
  55 |       const importButton = page.getByTestId('import-tab-modal-import-button');
  56 |       await expect(importButton).toBeVisible();
  57 |       await expect(importButton).toBeDisabled();
  58 |     });
  59 |   });
  60 | });
  61 | 
```