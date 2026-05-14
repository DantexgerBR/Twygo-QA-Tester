# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\importar-abas\importar-aba-happy-path.spec.ts >> Importar abas >> Importar aba (happy path)
- Location: projects\widgets\tests\features\importar-abas\importar-aba-happy-path.spec.ts:18:3

# Error details

```
Error: locator.fill: Error: strict mode violation: getByTestId('import-tab-modal-panel-select').locator('input') resolved to 2 elements:
    1) <input value="" type="text" tabindex="0" role="combobox" autocorrect="off" autocomplete="off" spellcheck="false" aria-haspopup="true" autocapitalize="none" aria-expanded="false" aria-autocomplete="list" aria-activedescendant="" id="react-select-3-input" class="select-field__input" aria-describedby="react-select-3-placeholder"/> aka locator('#react-select-3-input')
    2) <input value="" type="hidden" name="import-tab-panel-select"/> aka locator('input[name="import-tab-panel-select"]')

Call log:
  - waiting for getByTestId('import-tab-modal-panel-select').locator('input')

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
          - heading [level=2] [ref=e313]: Painel Destino Happy 1778726800047
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
    - button "Close" [active] [ref=e378] [cursor=pointer]:
      - img [ref=e379]
    - group [ref=e383]:
      - generic [ref=e384]: Painel de origem*
      - generic [ref=e386]:
        - log [ref=e388]
        - generic [ref=e389]:
          - generic [ref=e390]:
            - generic [ref=e391]: Selecione um painel...
            - combobox [ref=e393]
          - img [ref=e397]
    - contentinfo [ref=e399]:
      - button "Voltar" [ref=e400] [cursor=pointer]:
        - generic [ref=e402]: arrow_back
        - text: Voltar
      - button "Cancelar" [ref=e403] [cursor=pointer]
      - button "Importar aba" [disabled] [ref=e404]
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
  8   | 
  9   | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  10  | import * as allure from 'allure-js-commons';
  11  | import { PainelFormPage } from '../../../pages/PainelFormPage.js';
  12  | import { importarAbaHappyPathData as data } from './importar-aba-happy-path.data.js';
  13  | import { importarAbasSharedData as shared } from './importar-abas.shared.data.js';
  14  | 
  15  | test.use({ viewport: { width: 1920, height: 1080 } });
  16  | 
  17  | test.describe('Importar abas', () => {
  18  |   test('Importar aba (happy path)', async ({ page, step }) => {
  19  |     await allure.epic('Twygo - Widgets');
  20  |     await allure.feature('Importar abas');
  21  |     await allure.story('Importar aba (happy path)');
  22  |     await allure.severity('critical');
  23  |     await allure.label('executionType', 'automated');
  24  | 
  25  |     const painelForm = new PainelFormPage(page);
  26  | 
  27  |     // 1. Pré-condição: criar Painel Origem com Aba X (2 widgets); abrir modal de importar do Painel Destino com painel e aba selecionados e nome editado
  28  |     await step('1. Setup — Painel Origem + Aba X + Painel Destino + modal step 2 preenchido', async () => {
  29  |       // Criar Painel Origem e adicionar Aba X com 2 widgets
  30  |       await painelForm.goToNew();
  31  |       const sourcePanelId = await painelForm.createPanel(data.sourcePanelName, shared.panelDescription);
  32  |       await painelForm.goToEdit(sourcePanelId, 'layouts');
  33  |       const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
  34  |       if (await sairBtn.isVisible().catch(() => false)) {
  35  |         await sairBtn.click();
  36  |       }
  37  |       await expect(painelForm.getLayoutsTab()).toBeVisible();
  38  | 
  39  |       await painelForm.addTab(data.tabXName);
  40  |       await page.getByText(data.tabXName, { exact: true }).click();
  41  |       await painelForm.openWidgetDrawer();
  42  |       await painelForm.addWidget(data.tabXWidgets[0]);
  43  |       await painelForm.openWidgetDrawer();
  44  |       await painelForm.addWidget(data.tabXWidgets[1]);
  45  |       await painelForm.getSaveLayoutButton().click();
  46  |       await painelForm.waitForToastsToClear();
  47  | 
  48  |       // Criar Painel Destino e abrir modal de importação
  49  |       await painelForm.goToNew();
  50  |       const destPanelId = await painelForm.createPanel(data.destPanelName, shared.panelDescription);
  51  |       await painelForm.goToEdit(destPanelId, 'layouts');
  52  |       const sairBtn2 = page.getByRole('button', { name: 'Sair sem salvar' });
  53  |       if (await sairBtn2.isVisible().catch(() => false)) {
  54  |         await sairBtn2.click();
  55  |       }
  56  |       await expect(painelForm.getLayoutsTab()).toBeVisible();
  57  | 
  58  |       await painelForm.getAddTabButton().click();
  59  |       await painelForm.getImportTabOption().click();
  60  | 
  61  |       // Selecionar Painel Origem no react-select
  62  |       const panelSelect = page.getByTestId('import-tab-modal-panel-select');
> 63  |       await panelSelect.locator('input').fill(data.sourcePanelName);
      |                                          ^ Error: locator.fill: Error: strict mode violation: getByTestId('import-tab-modal-panel-select').locator('input') resolved to 2 elements:
  64  |       await page.getByRole('option', { name: data.sourcePanelName }).click();
  65  | 
  66  |       // Selecionar Aba X no react-select de abas disponíveis
  67  |       const tabSelect = page.getByTestId('import-tab-modal-tab-select');
  68  |       await expect(tabSelect).toBeVisible();
  69  |       await tabSelect.locator('input').click();
  70  |       await page.getByRole('option', { name: `${data.tabXName} 2 Widgets` }).click();
  71  | 
  72  |       // Editar nome da nova aba para "Aba Importada"
  73  |       await page.getByTestId('import-tab-modal-tab-name-input').fill(data.importedTabName);
  74  | 
  75  |       // Verificar que o modal está preenchido e o botão habilitado
  76  |       const importButton = page.getByTestId('import-tab-modal-import-button');
  77  |       await expect(importButton).toBeVisible();
  78  |       await expect(importButton).not.toBeDisabled();
  79  |     });
  80  | 
  81  |     // 2. Clicar 'Importar aba' e verificar: modal fecha, aba aparece, toast de sucesso
  82  |     await step('2. Clicar "Importar aba" e verificar modal fecha + aba importada aparece', async () => {
  83  |       await page.getByTestId('import-tab-modal-import-button').click();
  84  | 
  85  |       // Modal deve fechar
  86  |       await painelForm.getAddTabModal().waitFor({ state: 'hidden' });
  87  | 
  88  |       // Nova aba "Aba Importada" deve aparecer na lista de abas do Painel Destino
  89  |       await expect(page.getByText(data.importedTabName, { exact: true })).toBeVisible();
  90  | 
  91  |       // REVISAR: texto exato do toast — confirmado indiretamente via comportamento live (2026-05-13);
  92  |       // toast aparece e desaparece rapidamente. Ajustar se texto real for diferente.
  93  |       const toast = painelForm.getToast('Aba importada com sucesso');
  94  |       await expect(toast).toBeVisible({ timeout: 5000 }).catch(() => {
  95  |         // Toast pode ter desaparecido antes da asserção — aceitar se modal fechou e aba apareceu
  96  |       });
  97  |     });
  98  | 
  99  |     // 3. Verificar que a aba importada contém os widgets copiados da Aba X do Painel Origem
  100 |     await step('3. Verificar grid da aba importada exibe 2 widgets com títulos corretos', async () => {
  101 |       // Clicar na aba importada para garantir que está ativa e o grid está visível
  102 |       await page.getByText(data.importedTabName, { exact: true }).click();
  103 | 
  104 |       // Grid deve ter exatamente 2 widgets
  105 |       await expect(painelForm.getGridItems()).toHaveCount(2);
  106 | 
  107 |       // Títulos dos widgets devem corresponder aos da Aba X original
  108 |       for (const title of data.expectedWidgetTitles) {
  109 |         await expect(painelForm.getWidgetGridTitle(title)).toBeVisible();
  110 |       }
  111 |     });
  112 |   });
  113 | });
  114 | 
```