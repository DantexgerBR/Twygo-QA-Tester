# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\importar-abas\visualizar-preview-aba.spec.ts >> Importar abas >> Visualizar preview da aba selecionada
- Location: projects\widgets\tests\features\importar-abas\visualizar-preview-aba.spec.ts:24:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true })
Expected: visible
Error: strict mode violation: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true }) resolved to 2 elements:
    1) <p class="chakra-text css-qqfgvy">Aba X</p> aka getByTestId('import-tab-modal-tab-select').getByText('Aba X', { exact: true })
    2) <p class="chakra-text css-qqfgvy">Aba X</p> aka getByText('Aba X').nth(2)

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link [ref=e13] [cursor=pointer]:
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
                - link [ref=e27] [cursor=pointer]:
                  - /url: /o/36988/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link [ref=e33] [cursor=pointer]:
                  - /url: /o/36988/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link [ref=e39] [cursor=pointer]:
                  - /url: /o/36988/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link [ref=e46] [cursor=pointer]:
                  - /url: /o/36988/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
          - listitem [ref=e51]:
            - link [ref=e52] [cursor=pointer]:
              - /url: /o/36988/users
              - generic [ref=e53]:
                - generic [ref=e55]: group
                - generic [ref=e56]: Usuários
          - listitem [ref=e57]:
            - link [ref=e58] [cursor=pointer]:
              - /url: /o/36988/companies
              - generic [ref=e59]:
                - generic [ref=e61]: work
                - generic [ref=e62]: Empresas
          - listitem [ref=e63]:
            - link [ref=e64] [cursor=pointer]:
              - /url: /o/36988/question_lists
              - generic [ref=e65]:
                - generic [ref=e67]: live_help
                - generic [ref=e68]: Questionários
          - listitem [ref=e69]:
            - link [ref=e70] [cursor=pointer]:
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
                - link [ref=e85] [cursor=pointer]:
                  - /url: /o/36988/organization_chart
                  - generic [ref=e86]:
                    - generic [ref=e88]: lan
                    - generic [ref=e89]: Organograma
              - listitem [ref=e90]:
                - link [ref=e91] [cursor=pointer]:
                  - /url: /o/36988/roles
                  - generic [ref=e92]:
                    - generic [ref=e94]: badge
                    - generic [ref=e95]: Funções
              - listitem [ref=e96]:
                - link [ref=e97] [cursor=pointer]:
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
                - link [ref=e111] [cursor=pointer]:
                  - /url: /o/36988/organization_datasets
                  - generic [ref=e112]:
                    - generic [ref=e114]: send
                    - generic [ref=e115]: Repositórios
              - listitem [ref=e116]:
                - link [ref=e117] [cursor=pointer]:
                  - /url: /o/36988/process_architecture
                  - generic [ref=e118]:
                    - generic [ref=e120]: send
                    - generic [ref=e121]: Arquitetura de Processos
              - listitem [ref=e122]:
                - link [ref=e123] [cursor=pointer]:
                  - /url: /o/36988/process_documentations
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Agente de Documentação
              - listitem [ref=e128]:
                - link [ref=e129] [cursor=pointer]:
                  - /url: /o/36988/reference_documents
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Documentos de Referência
              - listitem [ref=e134]:
                - link [ref=e135] [cursor=pointer]:
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
              - link [ref=e147] [cursor=pointer]:
                - /url: /o/36988/edit
                - generic [ref=e148]: e
                - text: Organização
            - listitem [ref=e149]:
              - link [ref=e150] [cursor=pointer]:
                - /url: /o/36988/use_modes
                - generic [ref=e151]: 
                - text: Menu
            - listitem [ref=e152]:
              - link [ref=e153] [cursor=pointer]:
                - /url: /o/36988/integrations
                - generic [ref=e154]: electrical_services
                - text: Integrações
            - listitem [ref=e155]:
              - link [ref=e156] [cursor=pointer]:
                - /url: /o/36988/autopilots
                - generic [ref=e157]: flash_auto
                - text: Piloto automático
            - listitem [ref=e158]:
              - link [ref=e159] [cursor=pointer]:
                - /url: /o/36988/game_rules
                - generic [ref=e160]: 
                - text: Regras do Jogo
            - listitem [ref=e161]:
              - link [ref=e162] [cursor=pointer]:
                - /url: /o/36988/communication
                - generic [ref=e163]: 
                - text: Comunicação
            - listitem [ref=e164]:
              - link [ref=e165] [cursor=pointer]:
                - /url: /o/36988/payments
                - generic [ref=e166]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e167]:
              - link [ref=e168] [cursor=pointer]:
                - /url: /o/36988/subscription_plans
                - generic [ref=e169]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e170]:
              - link [ref=e171] [cursor=pointer]:
                - /url: /o/36988/security
                - generic [ref=e172]: 
                - text: Segurança NOVO
            - listitem [ref=e173]:
              - link [ref=e174] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e175]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e176]:
              - link [ref=e177] [cursor=pointer]:
                - /url: /o/36988/appearance
                - generic [ref=e178]: palette
                - text: Aparência
            - listitem [ref=e179]:
              - link [ref=e180] [cursor=pointer]:
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
    - link [ref=e194] [cursor=pointer]:
      - /url: /o/36988/dashboard
      - img [ref=e195]
    - generic [ref=e199]:
      - link [ref=e203] [cursor=pointer]:
        - /url: /o/36988/chats
        - button [ref=e204]:
          - img [ref=e205]
      - button [ref=e212] [cursor=pointer]:
        - img [ref=e213]
      - generic [ref=e216]:
        - link [ref=e217] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e218]: Claude Agents
      - button [ref=e219] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e220]: G
    - text: M * * M * *
  - generic [ref=e223]:
    - generic [ref=e225]:
      - list [ref=e226]:
        - list [ref=e227]:
          - listitem [ref=e228] [cursor=pointer]:
            - link [ref=e229]:
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
            - link [ref=e244]:
              - /url: /o/36988/users
              - generic [ref=e245]:
                - generic [ref=e247]: group
                - generic [ref=e248]: Usuários
          - listitem [ref=e249] [cursor=pointer]:
            - link [ref=e250]:
              - /url: /o/36988/companies
              - generic [ref=e251]:
                - generic [ref=e253]: work
                - generic [ref=e254]: Empresas
          - listitem [ref=e255] [cursor=pointer]:
            - link [ref=e256]:
              - /url: /o/36988/question_lists
              - generic [ref=e257]:
                - generic [ref=e259]: live_help
                - generic [ref=e260]: Questionários
          - listitem [ref=e261] [cursor=pointer]:
            - link [ref=e262]:
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
          - button [ref=e308] [cursor=pointer]:
            - img [ref=e310]
            - text: Voltar
          - heading [level=2] [ref=e313]: Painel Destino Preview 1778757889297
        - generic [ref=e315]:
          - tablist [ref=e316]:
            - tab [ref=e317] [cursor=pointer]: Identificação
            - tab [selected] [ref=e318] [cursor=pointer]: Layouts
          - tabpanel "Layouts" [ref=e320]:
            - generic [ref=e321]:
              - generic [ref=e323]:
                - generic [ref=e324]:
                  - generic [ref=e325]:
                    - group [ref=e326]:
                      - button [ref=e327]:
                        - generic [ref=e328]: drag_indicator
                      - paragraph [ref=e329] [cursor=pointer]: Nova aba
                      - generic [ref=e330]:
                        - button [ref=e331] [cursor=pointer]:
                          - generic [ref=e332]: edit
                        - button [disabled] [ref=e333]:
                          - generic [ref=e334]: delete
                    - button [ref=e335] [cursor=pointer]:
                      - generic [ref=e337]: add
                      - text: Adicionar aba
                  - status [ref=e338]
                - generic [ref=e339]:
                  - button [ref=e340] [cursor=pointer]:
                    - generic [ref=e342]: add
                    - text: Adicionar widget
                  - generic [ref=e343]:
                    - generic [ref=e344]:
                      - button [ref=e345] [cursor=pointer]:
                        - generic [ref=e346]: desktop_windows
                      - button [ref=e347] [cursor=pointer]:
                        - generic [ref=e348]: tablet
                      - button [ref=e349] [cursor=pointer]:
                        - generic [ref=e350]: smartphone
                    - generic [ref=e351]:
                      - paragraph [ref=e352]: Permitir reorganizar widgets
                      - checkbox [ref=e354]
                - generic [ref=e360]:
                  - generic [ref=e362]: add
                  - paragraph [ref=e363]: Nenhum widget adicionado
                  - paragraph [ref=e364]: Clique no botão "Adicionar Widget" para começar a montar sua tela personalizada
                  - button [ref=e365] [cursor=pointer]:
                    - generic [ref=e367]: add
                    - text: Adicionar Widget
              - generic [ref=e369]:
                - button [ref=e370] [cursor=pointer]: Cancelar
                - button [ref=e371] [cursor=pointer]: Salvar Layout
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
  - dialog "Adicionar nova aba Importe uma aba de outro painel" [ref=e374]:
    - banner [ref=e375]:
      - paragraph [ref=e376]: Adicionar nova aba
      - paragraph [ref=e377]: Importe uma aba de outro painel
    - button "Close" [ref=e378] [cursor=pointer]:
      - img [ref=e379]
    - generic [ref=e382]:
      - group [ref=e383]:
        - generic [ref=e384]: Painel de origem*
        - generic [ref=e386]:
          - log [ref=e388]
          - generic [ref=e389]:
            - generic [ref=e390]:
              - generic "Painel Origem Preview 1778757889296" [ref=e392]
              - combobox [ref=e394]
            - generic [ref=e395]:
              - img [ref=e397]
              - img [ref=e401]
      - group [ref=e403]:
        - generic [ref=e404]: Aba disponível*
        - generic [ref=e406]:
          - log [ref=e408]: option Aba X, selected.
          - generic [ref=e409]:
            - generic [ref=e410]:
              - generic [ref=e412]:
                - paragraph [ref=e413]: Aba X
                - generic [ref=e414]: 2 Widgets
              - combobox [active] [ref=e416]
            - generic [ref=e417]:
              - img [ref=e419]
              - img [ref=e423]
      - generic [ref=e425]:
        - paragraph [ref=e426]: Preview da aba
        - generic [ref=e427]:
          - generic [ref=e428]:
            - paragraph [ref=e429]: "Nome:"
            - paragraph [ref=e430]: Aba X
          - generic [ref=e431]:
            - paragraph [ref=e432]: "Widgets:"
            - paragraph [ref=e433]: "2"
          - generic [ref=e434]:
            - paragraph [ref=e435]: "Widgets inclusos:"
            - generic [ref=e436]:
              - generic [ref=e437]:
                - generic [ref=e438]: pie_chart
                - paragraph [ref=e439]: Resumo de atividades
              - generic [ref=e440]:
                - generic [ref=e441]: vital_signs
                - paragraph [ref=e442]: Conteúdos em andamento
      - group [ref=e443]:
        - generic [ref=e444]: Nome da nova aba*
        - textbox "Digite o nome da aba" [ref=e445]: Aba X
      - group [ref=e446]:
        - generic [ref=e447]: Categoria*
        - generic [ref=e448]:
          - combobox [ref=e449]:
            - option "Aprendizagem" [selected]
          - generic:
            - img
    - contentinfo [ref=e450]:
      - button "Voltar" [ref=e451] [cursor=pointer]:
        - generic [ref=e453]: arrow_back
        - text: Voltar
      - button "Cancelar" [ref=e454] [cursor=pointer]
      - button "Importar aba" [ref=e455] [cursor=pointer]
```

# Test source

```ts
  16  | import * as allure from 'allure-js-commons';
  17  | import { PainelFormPage } from '../../../pages/PainelFormPage.js';
  18  | import { visualizarPreviewAbaData as data } from './visualizar-preview-aba.data.js';
  19  | import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';
  20  | 
  21  | test.use({ viewport: { width: 1920, height: 1080 } });
  22  | 
  23  | test.describe('Importar abas', () => {
  24  |   test('Visualizar preview da aba selecionada', async ({ page, step }) => {
  25  |     await allure.epic('Twygo - Widgets');
  26  |     await allure.feature('Importar abas');
  27  |     await allure.story('Visualizar preview da aba selecionada');
  28  |     await allure.severity('critical');
  29  |     await allure.label('executionType', 'manual');
  30  | 
  31  |     const painelForm = new PainelFormPage(page);
  32  | 
  33  |     // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets) + Aba Y (3 widgets)
  34  |     await step('1. Criar Painel Origem com Aba X e Aba Y seedadas', async () => {
  35  |       await painelForm.goToNew();
  36  |       const sourcePanelId = await painelForm.createPanel(data.sourcePanelName, shared.panelDescription);
  37  | 
  38  |       // goToEdit com tab=layouts pode disparar dialog "Sair sem salvar" do Chakra
  39  |       await painelForm.goToEdit(sourcePanelId, 'layouts');
  40  |       const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
  41  |       if (await sairBtn.isVisible().catch(() => false)) {
  42  |         await sairBtn.click();
  43  |       }
  44  |       await expect(painelForm.getLayoutsTab()).toBeVisible();
  45  | 
  46  |       // Criar Aba X e adicionar 2 widgets (activity_summary + in_progress_contents)
  47  |       await painelForm.addTab(data.tabXName);
  48  |       await page.getByText(data.tabXName, { exact: true }).click();
  49  |       await painelForm.openWidgetDrawer();
  50  |       await painelForm.addWidget(data.tabXWidgets[0]);
  51  |       await painelForm.openWidgetDrawer();
  52  |       await painelForm.addWidget(data.tabXWidgets[1]);
  53  |       await painelForm.getSaveLayoutButton().click();
  54  |       await painelForm.waitForToastsToClear();
  55  | 
  56  |       // Criar Aba Y e adicionar 3 widgets (activity_summary + in_progress_contents + ranking)
  57  |       await painelForm.addTab(data.tabYName);
  58  |       await page.getByText(data.tabYName, { exact: true }).click();
  59  |       await painelForm.openWidgetDrawer();
  60  |       await painelForm.addWidget(data.tabYWidgets[0]);
  61  |       await painelForm.openWidgetDrawer();
  62  |       await painelForm.addWidget(data.tabYWidgets[1]);
  63  |       await painelForm.openWidgetDrawer();
  64  |       await painelForm.addWidget(data.tabYWidgets[2]);
  65  |       await painelForm.getSaveLayoutButton().click();
  66  |       await painelForm.waitForToastsToClear();
  67  | 
  68  |       await expect(page.getByText(data.tabXName, { exact: true })).toBeVisible();
  69  |       await expect(page.getByText(data.tabYName, { exact: true })).toBeVisible();
  70  |     });
  71  | 
  72  |     // 2. Criar Painel Destino, abrir step 2 do modal e selecionar Painel Origem
  73  |     await step('2. Criar Painel Destino e selecionar Painel Origem no modal de importar aba', async () => {
  74  |       await painelForm.goToNew();
  75  |       const destPanelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
  76  |       await painelForm.goToEdit(destPanelId, 'layouts');
  77  |       const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
  78  |       if (await sairBtn.isVisible().catch(() => false)) {
  79  |         await sairBtn.click();
  80  |       }
  81  |       await expect(painelForm.getLayoutsTab()).toBeVisible();
  82  | 
  83  |       await painelForm.getAddTabButton().click();
  84  |       await expect(painelForm.getImportTabOption()).toBeVisible();
  85  |       await painelForm.getImportTabOption().click();
  86  | 
  87  |       const modal = painelForm.getAddTabModal();
  88  |       await expect(modal).toBeVisible();
  89  |       await expect(modal.getByText('Importe uma aba de outro painel')).toBeVisible();
  90  | 
  91  |       // Selecionar o Painel Origem no react-select
  92  |       const panelSelect = page.getByTestId('import-tab-modal-panel-select');
  93  |       await panelSelect.locator('input[role="combobox"]').fill(data.sourcePanelName);
  94  |       await page.getByRole('option', { name: data.sourcePanelName }).click();
  95  | 
  96  |       // Campo 'Aba disponível*' deve aparecer após seleção do painel
  97  |       const tabSelect = page.getByTestId('import-tab-modal-tab-select');
  98  |       await expect(tabSelect).toBeVisible();
  99  |     });
  100 | 
  101 |     // 3. Selecionar 'Aba X' no react-select 'Aba disponível' e verificar preview
  102 |     await step('3. Selecionar Aba X e verificar preview da aba no modal', async () => {
  103 |       const tabSelect = page.getByTestId('import-tab-modal-tab-select');
  104 |       const modal = painelForm.getAddTabModal();
  105 | 
  106 |       // Abrir dropdown e selecionar "Aba X 2 Widgets"
  107 |       // Formato "Aba X 2 Widgets" confirmado live em 2026-05-12/13
  108 |       await tabSelect.locator('input[role="combobox"]').click();
  109 |       await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();
  110 | 
  111 |       // Área de preview — sem data-test-id; identificada pelo heading "Preview da aba"
  112 |       await expect(modal.getByText('Preview da aba')).toBeVisible();
  113 | 
  114 |       // Preview exibe nome da aba selecionada
  115 |       await expect(modal.getByText('Nome:')).toBeVisible();
> 116 |       await expect(modal.getByText(data.tabXName, { exact: true })).toBeVisible();
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
  117 | 
  118 |       // Preview exibe quantidade de widgets (2)
  119 |       await expect(modal.getByText('Widgets:')).toBeVisible();
  120 |       await expect(modal.getByText('2', { exact: true })).toBeVisible();
  121 | 
  122 |       // Preview exibe lista dos widgets inclusos — nomes confirmados live via PainelFormPage.WIDGET_IDS
  123 |       await expect(modal.getByText('Widgets inclusos:')).toBeVisible();
  124 |       await expect(modal.getByText('Resumo de atividades')).toBeVisible();
  125 |       await expect(modal.getByText('Conteúdos em andamento')).toBeVisible();
  126 |     });
  127 | 
  128 |     // 4. Verificar campo 'Nome da nova aba' auto-preenchido com nome original
  129 |     await step('4. Verificar campo "Nome da nova aba" auto-preenchido com "Aba X"', async () => {
  130 |       // Container com data-test-id='import-tab-modal-tab-name-input' confirmado via DOM live (2026-05-13)
  131 |       const nomeInput = page
  132 |         .getByTestId('import-tab-modal-tab-name-input')
  133 |         .getByPlaceholder('Digite o nome da aba');
  134 | 
  135 |       await expect(nomeInput).toBeVisible();
  136 |       await expect(nomeInput).toHaveValue(data.tabXName);
  137 |     });
  138 | 
  139 |     // 5. Verificar campo 'Categoria' aparece com opção padrão selecionada
  140 |     await step('5. Verificar campo "Categoria" com opção padrão "Aprendizagem"', async () => {
  141 |       const modal = painelForm.getAddTabModal();
  142 | 
  143 |       // Categoria não tem data-test-id — chakra-select com opção padrão "Aprendizagem"
  144 |       // confirmada via DOM live (select.value="0", options[0].text="Aprendizagem")
  145 |       const categoriaSelect = modal.getByRole('combobox');
  146 |       await expect(categoriaSelect).toBeVisible();
  147 |       await expect(categoriaSelect).toHaveValue('0');
  148 |     });
  149 |   });
  150 | });
  151 | 
```