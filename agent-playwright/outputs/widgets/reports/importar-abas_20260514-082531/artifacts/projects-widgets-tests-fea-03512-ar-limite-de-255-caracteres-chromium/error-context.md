# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts >> Importar abas >> Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres
- Location: projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')

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
          - heading [level=2] [ref=e313]: Painel Destino AutoNome 1778757836804
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
              - generic "Painel Origem AutoNome 1778757836803" [ref=e392]
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
  54  |       await painelForm.getSaveLayoutButton().click();
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
  72  |       await panelSelect.locator('input[role="combobox"]').fill(data.sourcePanelName);
  73  |       await page.getByRole('option', { name: data.sourcePanelName }).click();
  74  | 
  75  |       // Selecionar Aba X (formato "Aba X 2 Widgets" confirmado live)
  76  |       const tabSelect = page.getByTestId('import-tab-modal-tab-select');
  77  |       await expect(tabSelect).toBeVisible();
  78  |       await tabSelect.locator('input[role="combobox"]').click();
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
> 98  |       await expect(nomeInput).toBeVisible();
      |                               ^ Error: expect(locator).toBeVisible() failed
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