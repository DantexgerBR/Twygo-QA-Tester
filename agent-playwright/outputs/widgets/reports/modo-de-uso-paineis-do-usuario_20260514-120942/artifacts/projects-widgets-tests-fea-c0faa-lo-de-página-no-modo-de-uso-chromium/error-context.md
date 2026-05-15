# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\modo-de-uso-paineis-do-usuario\selecionar-paineis-usuario-modelo-pagina.spec.ts >> Modo de uso - Painéis do usuário >> Selecionar 'Painéis do usuário' como modelo de página no modo de uso
- Location: projects\widgets\tests\features\modo-de-uso-paineis-do-usuario\selecionar-paineis-usuario-modelo-pagina.spec.ts:27:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[id^="react-select-"][id$="-option-0"]').first()

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
      - generic [ref=e297]: Menu > Modo de uso > Editar modo de uso
      - generic [ref=e305]:
        - generic [ref=e306]:
          - button "Voltar" [ref=e308] [cursor=pointer]:
            - img [ref=e310]
            - text: Voltar
          - heading "Colaborador" [level=2] [ref=e313]
        - generic [ref=e315]:
          - tablist [ref=e316]:
            - tab "Identificação" [ref=e317] [cursor=pointer]
            - tab "Menu" [selected] [ref=e318] [cursor=pointer]
            - tab "Acesso" [ref=e319] [cursor=pointer]
            - tab "Feriados" [ref=e320] [cursor=pointer]
          - tabpanel "Menu" [ref=e322]:
            - generic [ref=e323]:
              - button "Adicionar" [ref=e325] [cursor=pointer]:
                - img [ref=e327]
                - text: Adicionar
              - table [ref=e329]:
                - rowgroup [ref=e330]:
                  - row "Menus exibidos Modelo de página Página inicial Menu habilitado" [ref=e331]:
                    - columnheader [ref=e332]
                    - columnheader "Menus exibidos" [ref=e333]:
                      - generic [ref=e334]: Menus exibidos
                    - columnheader "Modelo de página" [ref=e335]:
                      - generic [ref=e336]: Modelo de página
                    - columnheader "Página inicial" [ref=e337]:
                      - generic [ref=e338]:
                        - text: Página inicial
                        - img [ref=e340]
                    - columnheader "Menu habilitado" [ref=e342]:
                      - generic [ref=e343]:
                        - text: Menu habilitado
                        - img [ref=e345]
                    - columnheader [ref=e347]
                - rowgroup [ref=e348]:
                  - row "leaderboard Dashboard Dashboard edit Delete" [ref=e349]:
                    - cell [ref=e350]:
                      - img [ref=e351]
                    - cell "leaderboard Dashboard" [ref=e353]:
                      - generic [ref=e354]:
                        - generic [ref=e355]: leaderboard
                        - paragraph [ref=e356]: Dashboard
                    - cell "Dashboard" [ref=e357]
                    - cell [ref=e358]:
                      - radio [checked] [ref=e360]
                    - cell [ref=e362]:
                      - checkbox [checked] [disabled] [ref=e364]
                    - cell "edit Delete" [ref=e367]:
                      - generic [ref=e368]:
                        - generic [ref=e371] [cursor=pointer]: edit
                        - generic [ref=e374] [cursor=pointer]: Delete
                  - row "analytics Equipe Equipe edit Delete" [ref=e375]:
                    - cell [ref=e376]:
                      - img [ref=e377]
                    - cell "analytics Equipe" [ref=e379]:
                      - generic [ref=e380]:
                        - generic [ref=e381]: analytics
                        - paragraph [ref=e382]: Equipe
                    - cell "Equipe" [ref=e383]
                    - cell [ref=e384]:
                      - radio [ref=e386]
                    - cell [ref=e388]:
                      - checkbox [checked] [ref=e390]
                    - cell "edit Delete" [ref=e393]:
                      - generic [ref=e394]:
                        - generic [ref=e397] [cursor=pointer]: edit
                        - generic [ref=e400] [cursor=pointer]: Delete
                  - row "menu_book Meus Cursos Meus Cursos edit Delete" [ref=e401]:
                    - cell [ref=e402]:
                      - img [ref=e403]
                    - cell "menu_book Meus Cursos" [ref=e405]:
                      - generic [ref=e406]:
                        - generic [ref=e407]: menu_book
                        - paragraph [ref=e408]: Meus Cursos
                    - cell "Meus Cursos" [ref=e409]
                    - cell [ref=e410]:
                      - radio [ref=e412]
                    - cell [ref=e414]:
                      - checkbox [checked] [ref=e416]
                    - cell "edit Delete" [ref=e419]:
                      - generic [ref=e420]:
                        - generic [ref=e423] [cursor=pointer]: edit
                        - generic [ref=e426] [cursor=pointer]: Delete
                  - row "play_circle Catálogo de conteúdos Catálogo de conteúdos edit Delete" [ref=e427]:
                    - cell [ref=e428]:
                      - img [ref=e429]
                    - cell "play_circle Catálogo de conteúdos" [ref=e431]:
                      - generic [ref=e432]:
                        - generic [ref=e433]: play_circle
                        - paragraph [ref=e434]: Catálogo de conteúdos
                    - cell "Catálogo de conteúdos" [ref=e435]
                    - cell [ref=e436]:
                      - radio [ref=e438]
                    - cell [ref=e440]:
                      - checkbox [ref=e442]
                    - cell "edit Delete" [ref=e445]:
                      - generic [ref=e446]:
                        - generic [ref=e449] [cursor=pointer]: edit
                        - generic [ref=e452] [cursor=pointer]: Delete
                  - row "more_horiz Minhas Trilhas Minhas Trilhas edit Delete" [ref=e453]:
                    - cell [ref=e454]:
                      - img [ref=e455]
                    - cell "more_horiz Minhas Trilhas" [ref=e457]:
                      - generic [ref=e458]:
                        - generic [ref=e459]: more_horiz
                        - paragraph [ref=e460]: Minhas Trilhas
                    - cell "Minhas Trilhas" [ref=e461]
                    - cell [ref=e462]:
                      - radio [ref=e464]
                    - cell [ref=e466]:
                      - checkbox [checked] [ref=e468]
                    - cell "edit Delete" [ref=e471]:
                      - generic [ref=e472]:
                        - generic [ref=e475] [cursor=pointer]: edit
                        - generic [ref=e478] [cursor=pointer]: Delete
                  - row "groups Comunidades Comunidades edit Delete" [ref=e479]:
                    - cell [ref=e480]:
                      - img [ref=e481]
                    - cell "groups Comunidades" [ref=e483]:
                      - generic [ref=e484]:
                        - generic [ref=e485]: groups
                        - paragraph [ref=e486]: Comunidades
                    - cell "Comunidades" [ref=e487]
                    - cell [ref=e488]:
                      - radio [ref=e490]
                    - cell [ref=e492]:
                      - checkbox [checked] [ref=e494]
                    - cell "edit Delete" [ref=e497]:
                      - generic [ref=e498]:
                        - generic [ref=e501] [cursor=pointer]: edit
                        - generic [ref=e504] [cursor=pointer]: Delete
              - generic [ref=e505]:
                - button "Salvar" [ref=e506] [cursor=pointer]
                - button "Cancelar" [ref=e507] [cursor=pointer]
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
  1  | // spec: projects/widgets/specs/modo-de-uso-paineis-do-usuario-plan.md
  2  | // seed: tests/seed.spec.ts
  3  | 
  4  | // TC 1.1 — usa painel 'Painel Aluno' existente no env staging-widgets
  5  | // (evita orphan pollution). Cleanup via disassociatePanelFromMenu_safe
  6  | // no afterEach.
  7  | 
  8  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  9  | import * as allure from 'allure-js-commons';
  10 | import { PaineisListPage } from '../../../pages/PaineisListPage.js';
  11 | import { dismissCommonModals } from '../../../../../src/utils/modals.js';
  12 | import { getOrgId } from '../../../../../src/utils/environment.js';
  13 | import { selecionarPaineisUsuarioModeloPaginaData as data } from './selecionar-paineis-usuario-modelo-pagina.data.js';
  14 | 
  15 | test.use({ viewport: { width: 1920, height: 1080 } });
  16 | 
  17 | test.describe('Modo de uso - Painéis do usuário', () => {
  18 |   let itemName: string;
  19 | 
  20 |   test.afterEach(async ({ page }) => {
  21 |     if (itemName) {
  22 |       const paineis = new PaineisListPage(page);
  23 |       await paineis.disassociatePanelFromMenu_safe(data.panelName, data.useModeId, itemName);
  24 |     }
  25 |   });
  26 | 
  27 |   test("Selecionar 'Painéis do usuário' como modelo de página no modo de uso", async ({
  28 |     page,
  29 |     step,
  30 |   }) => {
  31 |     await allure.epic('Twygo - Widgets');
  32 |     await allure.feature('Modo de uso - Painéis do usuário');
  33 |     await allure.story("Selecionar 'Painéis do usuário' como modelo de página no modo de uso");
  34 |     await allure.severity('critical');
  35 |     await allure.label('executionType', 'manual');
  36 | 
  37 |     const paineis = new PaineisListPage(page);
  38 |     itemName = `${data.itemNamePrefix} ${Date.now()}`.slice(0, 25);
  39 | 
  40 |     await step('1. Setup — navegar ao form de novo item de menu', async () => {
  41 |       await page.goto(`/o/${getOrgId()}/use_modes/${data.useModeId}/use_mode_itens/new`);
  42 |       await dismissCommonModals(page);
  43 | 
  44 |       await expect(paineis.getMenuItemNameInput()).toBeVisible();
  45 |       await expect(paineis.getMenuItemPageModelSelect()).toBeVisible();
  46 |       // Espaço só aparece após escolher user_panels
  47 |       await expect(paineis.getMenuItemPanelChooser()).toBeHidden();
  48 |     });
  49 | 
  50 |     await step('2. Preencher Nome do menu', async () => {
  51 |       await paineis.getMenuItemNameInput().fill(itemName);
  52 |       await expect(paineis.getMenuItemNameInput()).toHaveValue(itemName);
  53 |     });
  54 | 
  55 |     await step("3. Selecionar 'Painéis do usuário' no Modelo de página", async () => {
  56 |       await paineis.getMenuItemPageModelSelect().selectOption('user_panels');
  57 |       await expect(paineis.getMenuItemPanelChooser()).toBeVisible();
  58 |     });
  59 | 
  60 |     await step("4. Escolher 'Painel Aluno' no campo Espaço e salvar", async () => {
  61 |       // Abrir dropdown e filtrar pelo nome
  62 |       await paineis.getMenuItemPanelChooser().click();
  63 |       await paineis.getMenuItemPanelChooserInput().fill(data.panelName);
  64 | 
  65 |       // Selecionar primeira opção visível (filtrada)
  66 |       const firstOption = page.locator('[id^="react-select-"][id$="-option-0"]').first();
> 67 |       await firstOption.click();
     |                         ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  68 | 
  69 |       await paineis.getMenuItemSubmitButton().click();
  70 | 
  71 |       // Redirect para /use_modes/{useModeId}/edit?tab=items
  72 |       await expect(page).toHaveURL(/\/use_modes\/\d+\/edit\?tab=items/);
  73 | 
  74 |       // Item aparece na tabela
  75 |       await expect(paineis.getMenuItemRowByName(itemName)).toBeVisible();
  76 |     });
  77 |   });
  78 | });
  79 | 
```