# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts >> Importar abas >> Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres
- Location: projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts:22:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="panel-layout-save-button"]')
    - locator resolved to <button type="button" class="chakra-button css-vda7qx" data-test-id="panel-layout-save-button">Salvar Layout</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-status="success" class="chakra-alert__desc css-161kwbg" id="toast-widget-added-toast-description">Widget adicionado com sucesso</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-status="success" class="chakra-alert__desc css-161kwbg" id="toast-widget-added-toast-description">Widget adicionado com sucesso</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    8 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-status="success" class="chakra-alert__desc css-161kwbg" id="toast-widget-added-toast-description">Widget adicionado com sucesso</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    49 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <iframe allowfullscreen="" title="Widget de chat" id="hubspot-conversations-iframe" data-test-id="chat-widget-iframe" src="https://app.hubspot.com/conversations-visitor/44582593/threads/utk/60829462b6f74dcfb0533f16eacf03a8?uuid=7d8ec8ffe65c4c3ab2f271fba5fab6da&mobile=false&mobileSafari=false&hideWelcomeMessage=false&hstc=122495380.cf5b8e96d467b48d7f09fd8759abb2fd.1778724994349.1778724994349.1778724994349.1&domain=widgets.stage.twygoead.com&inApp53=false&messagesUtk=60829462b6f74dcfb0533f16eacf03a8&url…></iframe> from <div role="region" class="widget-align-right" aria-label="Widget de chat" id="hubspot-messages-iframe-container">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - heading "Painel Origem AutoNome 1778726612747" [level=2] [ref=e313]
        - generic [ref=e315]:
          - tablist [ref=e316]:
            - tab "Identificação" [ref=e317] [cursor=pointer]
            - tab "Layouts" [selected] [ref=e318] [cursor=pointer]
          - tabpanel "Layouts" [ref=e320]:
            - generic [ref=e321]:
              - generic [ref=e323]:
                - generic [ref=e324]:
                  - generic [ref=e325]:
                    - group [ref=e326]:
                      - button "drag_indicator" [ref=e327]:
                        - generic [ref=e328]: drag_indicator
                      - paragraph [ref=e329] [cursor=pointer]: Nova aba
                      - generic [ref=e330]:
                        - button "Renomear" [ref=e331] [cursor=pointer]:
                          - generic [ref=e332]: edit
                        - button "Excluir" [ref=e333] [cursor=pointer]:
                          - generic [ref=e334]: delete
                    - group [ref=e335]:
                      - button "drag_indicator" [ref=e336]:
                        - generic [ref=e337]: drag_indicator
                      - paragraph [ref=e338] [cursor=pointer]: Aba X
                      - generic [ref=e339]:
                        - button "Renomear" [ref=e340] [cursor=pointer]:
                          - generic [ref=e341]: edit
                        - button "Excluir" [ref=e342] [cursor=pointer]:
                          - generic [ref=e343]: delete
                    - button "Adicionar aba" [ref=e344] [cursor=pointer]:
                      - generic [ref=e346]: add
                      - text: Adicionar aba
                  - status [ref=e347]
                - generic [ref=e348]:
                  - button "Adicionar widget" [active] [ref=e349] [cursor=pointer]:
                    - generic [ref=e351]: add
                    - text: Adicionar widget
                  - generic [ref=e352]:
                    - generic [ref=e353]:
                      - 'button "Visualização: Desktop" [ref=e354] [cursor=pointer]':
                        - generic [ref=e355]: desktop_windows
                      - 'button "Visualização: Tablet" [ref=e356] [cursor=pointer]':
                        - generic [ref=e357]: tablet
                      - 'button "Visualização: Mobile" [ref=e358] [cursor=pointer]':
                        - generic [ref=e359]: smartphone
                    - generic [ref=e360]:
                      - paragraph [ref=e361]: Permitir reorganizar widgets
                      - checkbox [ref=e363]
                - generic [ref=e368]:
                  - generic [ref=e370]:
                    - generic [ref=e371]:
                      - generic [ref=e372]:
                        - generic [ref=e373]:
                          - generic [ref=e374]: drag_indicator
                          - paragraph [ref=e375]: 6 col
                        - generic [ref=e377]: pie_chart
                        - paragraph [ref=e378]: Resumo de atividades
                      - generic [ref=e379]:
                        - button "Editar widget" [ref=e380] [cursor=pointer]:
                          - generic [ref=e381]: edit
                        - button "Remover widget" [ref=e382] [cursor=pointer]:
                          - generic [ref=e383]: close
                    - generic [ref=e386]:
                      - generic [ref=e387]:
                        - progressbar [ref=e388]:
                          - img [ref=e389]
                          - generic [ref=e392]: 85%
                        - paragraph [ref=e393]: Certificados concluídos
                      - generic [ref=e394]:
                        - progressbar [ref=e395]:
                          - img [ref=e396]
                          - generic [ref=e399]: 72%
                        - paragraph [ref=e400]: Progresso geral
                      - generic [ref=e401]:
                        - progressbar [ref=e402]:
                          - img [ref=e403]
                          - generic [ref=e406]: 94%
                        - paragraph [ref=e407]: Questionários respondidos
                  - generic [ref=e409]:
                    - generic [ref=e410]:
                      - generic [ref=e411]:
                        - generic [ref=e412]:
                          - generic [ref=e413]: drag_indicator
                          - paragraph [ref=e414]: 6 col
                        - generic [ref=e416]: vital_signs
                        - paragraph [ref=e417]: Conteúdos em andamento
                      - generic [ref=e418]:
                        - button "Editar widget" [ref=e419] [cursor=pointer]:
                          - generic [ref=e420]: edit
                        - button "Remover widget" [ref=e421] [cursor=pointer]:
                          - generic [ref=e422]: close
                    - generic [ref=e425]:
                      - generic [ref=e426]:
                        - generic [ref=e427]:
                          - paragraph [ref=e428]: Desenvolvimento de Software
                          - paragraph [ref=e429]: 75%
                        - progressbar [ref=e431]
                      - generic [ref=e432]:
                        - generic [ref=e433]:
                          - paragraph [ref=e434]: Design Thinking na Prática
                          - paragraph [ref=e435]: 45%
                        - progressbar [ref=e437]
                      - generic [ref=e438]:
                        - generic [ref=e439]:
                          - paragraph [ref=e440]: Análise de Dados com Python
                          - paragraph [ref=e441]: 60%
                        - progressbar [ref=e443]
                      - generic [ref=e444]:
                        - generic [ref=e445]:
                          - paragraph [ref=e446]: Inglês Corporativo
                          - paragraph [ref=e447]: 30%
                        - progressbar [ref=e449]
              - generic [ref=e451]:
                - button "Cancelar" [ref=e452] [cursor=pointer]
                - button "Salvar Layout" [ref=e453] [cursor=pointer]
  - region "Widget de chat" [ref=e454]:
    - iframe [ref=e455]:
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
```

# Test source

```ts
  1   | // spec: projects/widgets/specs/importar-abas-plan.md
  2   | // seed: projects/widgets/tests/features/listagem-de-paineis/validar-componentes-obrigatorios.spec.ts
  3   | 
  4   | // AVISO: o botão "Salvar Layout" não persiste no backend (zero POST/PATCH durante
  5   | // edição — confirmado em trace 2026-05-12). A pré-condição chama getSaveLayoutButton().click()
  6   | // para satisfazer a UI, mas os widgets NÃO são gravados no servidor. O fluxo funciona
  7   | // dentro da mesma sessão browser por estado local. Ver feedback_panel_layout_save_no_persist.md.
  8   | //
  9   | // SELETORES CONFIRMADOS LIVE (2026-05-13, herdados do TC 1.3):
  10  | // - 'Nome da nova aba' input: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')
  11  | // - maxLength=255 enforçado client-side via atributo HTML
  12  | 
  13  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  14  | import * as allure from 'allure-js-commons';
  15  | import { PainelFormPage } from '../../../pages/PainelFormPage.js';
  16  | import { autoPreencherNomeAbaImportadaData as data } from './auto-preencher-nome-aba-importada.data.js';
  17  | import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';
  18  | 
  19  | test.use({ viewport: { width: 1920, height: 1080 } });
  20  | 
  21  | test.describe('Importar abas', () => {
  22  |   test("Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres", async ({
  23  |     page,
  24  |     step,
  25  |   }) => {
  26  |     await allure.epic('Twygo - Widgets');
  27  |     await allure.feature('Importar abas');
  28  |     await allure.story("Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres");
  29  |     await allure.severity('critical');
  30  |     await allure.label('executionType', 'manual');
  31  | 
  32  |     const painelForm = new PainelFormPage(page);
  33  | 
  34  |     // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets); abrir modal de importar do Painel Destino e selecionar Aba X
  35  |     await step('1. Criar Painel Origem com Aba X seedada e abrir modal de importar do Painel Destino', async () => {
  36  |       await painelForm.goToNew();
  37  |       const sourcePanelId = await painelForm.createPanel(data.sourcePanelName, shared.panelDescription);
  38  | 
  39  |       // goToEdit com tab=layouts pode disparar dialog "Sair sem salvar" do Chakra
  40  |       await painelForm.goToEdit(sourcePanelId, 'layouts');
  41  |       const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
  42  |       if (await sairBtn.isVisible().catch(() => false)) {
  43  |         await sairBtn.click();
  44  |       }
  45  |       await expect(painelForm.getLayoutsTab()).toBeVisible();
  46  | 
  47  |       // Aba X com 2 widgets
  48  |       await painelForm.addTab(data.tabXName);
  49  |       await page.getByText(data.tabXName, { exact: true }).click();
  50  |       await painelForm.openWidgetDrawer();
  51  |       await painelForm.addWidget(data.tabXWidgets[0]);
  52  |       await painelForm.openWidgetDrawer();
  53  |       await painelForm.addWidget(data.tabXWidgets[1]);
> 54  |       await painelForm.getSaveLayoutButton().click();
      |                                              ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  55  |       await painelForm.waitForToastsToClear();
  56  | 
  57  |       // Criar Painel Destino, abrir Layouts, abrir modal de importar
  58  |       await painelForm.goToNew();
  59  |       const destPanelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
  60  |       await painelForm.goToEdit(destPanelId, 'layouts');
  61  |       const sairBtn2 = page.getByRole('button', { name: 'Sair sem salvar' });
  62  |       if (await sairBtn2.isVisible().catch(() => false)) {
  63  |         await sairBtn2.click();
  64  |       }
  65  |       await expect(painelForm.getLayoutsTab()).toBeVisible();
  66  | 
  67  |       await painelForm.getAddTabButton().click();
  68  |       await painelForm.getImportTabOption().click();
  69  | 
  70  |       // Selecionar Painel Origem
  71  |       const panelSelect = page.getByTestId('import-tab-modal-panel-select');
  72  |       await panelSelect.locator('input').fill(data.sourcePanelName);
  73  |       await page.getByRole('option', { name: data.sourcePanelName }).click();
  74  | 
  75  |       // Selecionar Aba X (formato "Aba X 2 Widgets" confirmado live)
  76  |       const tabSelect = page.getByTestId('import-tab-modal-tab-select');
  77  |       await expect(tabSelect).toBeVisible();
  78  |       await tabSelect.locator('input').click();
  79  |       await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();
  80  |     });
  81  | 
  82  |     // 2. Verificar preview exibido e botão Importar aba habilitado após seleção
  83  |     await step('2. Verificar preview exibido e botão "Importar aba" habilitado', async () => {
  84  |       const modal = painelForm.getAddTabModal();
  85  |       await expect(modal.getByText('Preview da aba')).toBeVisible();
  86  | 
  87  |       const importButton = page.getByTestId('import-tab-modal-import-button');
  88  |       await expect(importButton).toBeVisible();
  89  |       await expect(importButton).not.toBeDisabled();
  90  |     });
  91  | 
  92  |     // 3. Verificar campo 'Nome da nova aba' tem value auto-preenchido com 'Aba X'
  93  |     await step('3. Verificar auto-preenchimento de "Nome da nova aba" com nome original (Aba X)', async () => {
  94  |       const nomeInput = page
  95  |         .getByTestId('import-tab-modal-tab-name-input')
  96  |         .getByPlaceholder('Digite o nome da aba');
  97  | 
  98  |       await expect(nomeInput).toBeVisible();
  99  |       await expect(nomeInput).toHaveValue(data.tabXName);
  100 |     });
  101 | 
  102 |     // 4. Limpar e preencher com novo nome — verificar aceitação da edição
  103 |     await step('4. Limpar campo e preencher com novo nome "Aba Importada"', async () => {
  104 |       const nomeInput = page
  105 |         .getByTestId('import-tab-modal-tab-name-input')
  106 |         .getByPlaceholder('Digite o nome da aba');
  107 | 
  108 |       await nomeInput.fill(data.newTabName);
  109 |       await expect(nomeInput).toHaveValue(data.newTabName);
  110 |     });
  111 | 
  112 |     // 5. Tentar preencher 256 chars — verificar maxLength=255 enforçado client-side
  113 |     await step('5. Tentar preencher 256 chars e validar limite de 255 (maxLength HTML)', async () => {
  114 |       const nomeInput = page
  115 |         .getByTestId('import-tab-modal-tab-name-input')
  116 |         .getByPlaceholder('Digite o nome da aba');
  117 | 
  118 |       // Browser trunca automaticamente ao maxLength quando fill excede o limite
  119 |       await nomeInput.fill(data.name256Chars);
  120 |       await expect(nomeInput).toHaveValue(data.name255Chars);
  121 |     });
  122 |   });
  123 | });
  124 | 
```