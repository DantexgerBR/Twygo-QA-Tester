# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\importar-abas\importar-aba-happy-path.spec.ts >> Importar abas >> Importar aba (happy path)
- Location: projects\widgets\tests\features\importar-abas\importar-aba-happy-path.spec.ts:18:3

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
          - heading "Painel Origem Happy 1778726308003" [level=2] [ref=e313]
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
                  - textbox [ref=e333]: Painel Origem Happy 1778726308003
                  - paragraph [ref=e336]: 33 / 250
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
  103 |     return Number(match[1]);
  104 |   }
  105 | 
  106 |   // ---------- Aba Layouts: navegação de abas ----------
  107 | 
  108 |   getAddTabButton(): Locator {
  109 |     return this.page.getByTestId('tabs-navigation-add-button');
  110 |   }
  111 | 
  112 |   /**
  113 |    * Localiza o "chip" de uma aba pelo seu nome dentro do tabpanel Layouts.
  114 |    * O nome é renderizado como `<p>` (paragraph role) na barra de abas. O
  115 |    * `.locator('..')` sobe pra raiz do chip pra escopo de Renomear/Excluir.
  116 |    */
  117 |   getTabChip(tabName: string): Locator {
  118 |     return this.page
  119 |       .getByRole('tabpanel', { name: 'Layouts' })
  120 |       .locator('xpath=.//p[normalize-space()=' + JSON.stringify(tabName) + ']/ancestor::*[self::div or self::li][1]');
  121 |   }
  122 | 
  123 |   getRenameTabButton(tabName: string): Locator {
  124 |     return this.getTabChip(tabName).getByRole('button', { name: 'Renomear' });
  125 |   }
  126 | 
  127 |   getDeleteTabButton(tabName: string): Locator {
  128 |     return this.getTabChip(tabName).getByRole('button', { name: 'Excluir' });
  129 |   }
  130 | 
  131 |   // ---------- Modal Renomear aba ----------
  132 | 
  133 |   getRenameModal(): Locator {
  134 |     return this.page.getByRole('dialog').filter({ hasText: 'Renomear aba' });
  135 |   }
  136 | 
  137 |   getRenameModalInput(): Locator {
  138 |     return this.getRenameModal().locator('input').first();
  139 |   }
  140 | 
  141 |   getRenameModalSubmit(): Locator {
  142 |     return this.getRenameModal().getByRole('button', { name: 'Renomear' });
  143 |   }
  144 | 
  145 |   getRenameModalCancel(): Locator {
  146 |     return this.getRenameModal().getByRole('button', { name: 'Cancelar' });
  147 |   }
  148 | 
  149 |   async openRenameModal(tabName: string): Promise<void> {
  150 |     await this.getRenameTabButton(tabName).click();
  151 |     await this.getRenameModal().waitFor();
  152 |   }
  153 | 
  154 |   // ---------- Modal Adicionar nova aba (2 steps) ----------
  155 | 
  156 |   getAddTabModal(): Locator {
  157 |     return this.page.getByRole('dialog').filter({ hasText: 'Adicionar nova aba' });
  158 |   }
  159 | 
  160 |   getCreateNewTabOption(): Locator {
  161 |     return this.page.getByTestId('add-tab-type-modal-create-new-button');
  162 |   }
  163 | 
  164 |   getImportTabOption(): Locator {
  165 |     return this.page.getByTestId('add-tab-type-modal-import-button');
  166 |   }
  167 | 
  168 |   getAddTabTypeCancel(): Locator {
  169 |     return this.page.getByTestId('add-tab-type-modal-cancel-button');
  170 |   }
  171 | 
  172 |   // Step 2 — Criar nova aba (form)
  173 |   /**
  174 |    * Input "Nome da aba" do step 2. Sem data-test-id/aria-label; o elemento
  175 |    * é renderizado como `textbox "Digite o nome da aba"` — placeholder é o
  176 |    * accessible name. Confirmado no DOM live (2026-05-11).
  177 |    */
  178 |   getCreateTabNameInput(): Locator {
  179 |     return this.getAddTabModal().getByPlaceholder('Digite o nome da aba');
  180 |   }
  181 | 
  182 |   getCreateTabCategorySelect(): Locator {
  183 |     return this.getAddTabModal().getByRole('combobox');
  184 |   }
  185 | 
  186 |   getCreateTabBackButton(): Locator {
  187 |     return this.page.getByTestId('create-tab-modal-back-button');
  188 |   }
  189 | 
  190 |   getCreateTabCancelButton(): Locator {
  191 |     return this.page.getByTestId('create-tab-modal-cancel-button');
  192 |   }
  193 | 
  194 |   getCreateTabSubmitButton(): Locator {
  195 |     return this.page.getByTestId('create-tab-modal-create-button');
  196 |   }
  197 | 
  198 |   /**
  199 |    * Fluxo completo "Adicionar aba → Criar nova aba → preencher → submeter".
  200 |    * Após retornar, a aba `tabName` está visível na navegação.
  201 |    */
  202 |   async addTab(tabName: string): Promise<void> {
> 203 |     await this.getAddTabButton().click();
      |                                  ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  204 |     await this.getCreateNewTabOption().click();
  205 |     await this.getCreateTabNameInput().fill(tabName);
  206 |     await this.getCreateTabSubmitButton().click();
  207 |     await this.getAddTabModal().waitFor({ state: 'hidden' });
  208 |     await expect(this.page.getByText(tabName, { exact: true })).toBeVisible();
  209 |   }
  210 | 
  211 |   // ---------- Salvar Layout ----------
  212 | 
  213 |   getSaveLayoutButton(): Locator {
  214 |     return this.page.locator('[data-test-id="panel-layout-save-button"]');
  215 |   }
  216 | 
  217 |   getCancelLayoutButton(): Locator {
  218 |     return this.page.locator('[data-test-id="panel-layout-cancel-button"]');
  219 |   }
  220 | 
  221 |   // ---------- Widgets (drawer + grid) ----------
  222 | 
  223 |   /**
  224 |    * Botão "Adicionar widget" no header da aba Layouts. Quando o grid está
  225 |    * vazio o app também renderiza um botão equivalente em `widgets-grid-
  226 |    * empty-state-add-button` — preferimos sempre o do header pra simplicidade.
  227 |    */
  228 |   getAddWidgetButton(): Locator {
  229 |     return this.page.locator('[data-test-id="widgets-grid-add-button"]');
  230 |   }
  231 | 
  232 |   getEmptyStateAddWidgetButton(): Locator {
  233 |     return this.page.locator('[data-test-id="widgets-grid-empty-state-add-button"]');
  234 |   }
  235 | 
  236 |   getWidgetDrawer(): Locator {
  237 |     return this.page.locator('[data-test-id="widget-selector-drawer"]');
  238 |   }
  239 | 
  240 |   getWidgetDrawerCloseButton(): Locator {
  241 |     return this.page.locator('[data-test-id="widget-selector-drawer-close"]');
  242 |   }
  243 | 
  244 |   getWidgetDrawerSearch(): Locator {
  245 |     return this.page.locator('[data-test-id="widget-selector-search"]');
  246 |   }
  247 | 
  248 |   getWidgetDrawerFilterToggle(): Locator {
  249 |     return this.page.locator('[data-test-id="widget-selector-filter-toggle"]');
  250 |   }
  251 | 
  252 |   /**
  253 |    * Input combobox do multi-select "Categorias" no painel Filtros do drawer.
  254 |    * É um react-select — o id `widget-filter-categories` é estável e o role
  255 |    * `combobox` está no próprio input. O `<div placeholder>` ao redor
  256 |    * intercepta pointer events; clicar no input direto abre o dropdown.
  257 |    * Confirmado live 2026-05-12.
  258 |    */
  259 |   getCategoriesMultiselectInput(): Locator {
  260 |     return this.page.locator('#widget-filter-categories');
  261 |   }
  262 | 
  263 |   /**
  264 |    * Abre o dropdown do multi-select Categorias e seleciona uma opção pelo
  265 |    * nome exato (ex: 'Aprendizagem', 'Todos'). O click no input abre as
  266 |    * opções como elementos com role=option.
  267 |    */
  268 |   async selectCategoryFilter(name: 'Aprendizagem' | 'Todos'): Promise<void> {
  269 |     await this.getCategoriesMultiselectInput().click();
  270 |     await this.page.getByRole('option', { name, exact: true }).click();
  271 |   }
  272 | 
  273 |   /**
  274 |    * Group da categoria. `category` aceita o slug usado no DOM (ex: 'learning').
  275 |    * O XML chama de "Aprendizagem" → mapping ocorre na asserção do spec.
  276 |    */
  277 |   getWidgetCategoryGroup(category: 'learning'): Locator {
  278 |     return this.page.locator(`[data-test-id="widget-category-group-${category}"]`);
  279 |   }
  280 | 
  281 |   /** IDs canônicos dos widgets de Aprendizagem (validados ao vivo 2026-05-11). */
  282 |   static readonly WIDGET_IDS = {
  283 |     activity_summary: { title: 'Resumo de atividades', category: 'Aprendizagem' },
  284 |     in_progress_contents: { title: 'Conteúdos em andamento', category: 'Aprendizagem' },
  285 |     ranking: { title: 'Ranking', category: 'Aprendizagem' },
  286 |     my_certificates: { title: 'Meus certificados', category: 'Aprendizagem' },
  287 |   } as const;
  288 | 
  289 |   getWidgetCard(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
  290 |     return this.page.locator(`[data-test-id="widget-catalog-card-${id}"]`);
  291 |   }
  292 | 
  293 |   getWidgetCardProfile(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
  294 |     return this.page.locator(`[data-test-id="widget-catalog-profile-${id}"]`);
  295 |   }
  296 | 
  297 |   getWidgetCardCategoryLabel(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
  298 |     return this.page.locator(`[data-test-id="widget-catalog-category-${id}-learning"]`);
  299 |   }
  300 | 
  301 |   /**
  302 |    * Abre o drawer de seleção de widgets a partir do header ou do empty
  303 |    * state, conforme o estado atual do grid.
```