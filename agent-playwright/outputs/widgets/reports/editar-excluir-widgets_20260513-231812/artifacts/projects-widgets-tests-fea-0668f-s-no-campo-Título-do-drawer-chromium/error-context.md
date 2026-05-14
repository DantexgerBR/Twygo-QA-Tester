# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\editar-excluir-widgets\limite-titulo-drawer-widget.spec.ts >> Editar/Excluir widgets >> Limite de 255 caracteres no campo 'Título' do drawer
- Location: projects\widgets\tests\features\editar-excluir-widgets\limite-titulo-drawer-widget.spec.ts:12:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="widgets-grid-empty-state-add-button"]')

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
          - heading [level=2] [ref=e313]: Painel Limite Titulo 1778725011774
        - generic [ref=e315]:
          - tablist [ref=e316]:
            - tab [selected] [ref=e317] [cursor=pointer]: Identificação
            - tab [ref=e318] [cursor=pointer]: Layouts
          - tabpanel [ref=e320]:
            - generic [ref=e321]:
              - generic [ref=e325]:
                - group [ref=e327]:
                  - generic [ref=e329]:
                    - generic [ref=e330]: Nome
                    - generic [ref=e331]: "*"
                  - textbox [ref=e333]: Painel Limite Titulo 1778725011774
                  - paragraph [ref=e336]: 34 / 250
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
                            - radio [ref=e353] [cursor=pointer]:
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
                        - button [ref=e383] [cursor=pointer]:
                          - generic [ref=e384]: more_horiz
                    - textbox [ref=e385]:
                      - generic [ref=e389]:
                        - button [ref=e391] [cursor=pointer]:
                          - generic:
                            - img
                        - button [ref=e392] [cursor=pointer]:
                          - button [ref=e393]:
                            - img [ref=e394]
                  - paragraph [ref=e405]: 0 / 500
                - group [ref=e407]:
                  - checkbox [checked] [ref=e409]
                  - generic [ref=e413]: Painel ativo
              - generic [ref=e414]:
                - button [ref=e415] [cursor=pointer]: Salvar
                - button [ref=e416] [cursor=pointer]: Cancelar
  - region [ref=e417]:
    - iframe [ref=e418]:
      - generic [ref=f20e2]:
        - generic [ref=f20e6]:
          - button "Abrir chat ao vivo" [ref=f20e7]:
            - img "Avatar de Sophia" [ref=f20e12]
            - generic [ref=f20e13]: Estamos prontos para te atender no que você precisar, viu?! 🤩
          - button "Fechar página de boas-vindas" [ref=f20e14]:
            - img [ref=f20e16]
        - button "Abrir chat ao vivo" [ref=f20e23]:
          - img [ref=f20e26]
          - img [ref=f20e33]
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
  - textbox [ref=e419]
  - dialog "Tem certeza que deseja sair?" [ref=e422]:
    - banner [ref=e423]: Tem certeza que deseja sair?
    - button "Close" [active] [ref=e424] [cursor=pointer]:
      - img [ref=e425]
    - paragraph [ref=e428]: Caso tenha alterações, elas não serão salvas.
    - contentinfo [ref=e429]:
      - generic [ref=e430]:
        - button "Cancelar" [ref=e431] [cursor=pointer]
        - button "Sair sem salvar" [ref=e432] [cursor=pointer]
        - button "Sair e salvar" [ref=e433] [cursor=pointer]
```

# Test source

```ts
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
  304 |    */
  305 |   async openWidgetDrawer(): Promise<void> {
  306 |     const headerBtn = this.getAddWidgetButton();
  307 |     if (await headerBtn.isVisible().catch(() => false)) {
  308 |       await headerBtn.click();
  309 |     } else {
> 310 |       await this.getEmptyStateAddWidgetButton().click();
      |                                                 ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  311 |     }
  312 |     await this.getWidgetDrawer().waitFor();
  313 |   }
  314 | 
  315 |   /**
  316 |    * Click em um card adiciona o widget e fecha o drawer automaticamente
  317 |    * (comportamento confirmado live 2026-05-11). Não há botão "Adicionar"
  318 |    * separado nos cards.
  319 |    */
  320 |   async addWidget(id: keyof typeof PainelFormPage.WIDGET_IDS): Promise<void> {
  321 |     await this.getWidgetCard(id).click();
  322 |     await this.getWidgetDrawer().waitFor({ state: 'hidden' });
  323 |   }
  324 | 
  325 |   /** Items adicionados ao grid (UUIDs dinâmicos). */
  326 |   getGridItems(): Locator {
  327 |     return this.page.locator('[data-test-id^="widgets-grid-item-"]');
  328 |   }
  329 | 
  330 |   getWidgetGridTitle(title: string): Locator {
  331 |     return this.page
  332 |       .locator('[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]')
  333 |       .filter({ hasText: title });
  334 |   }
  335 | 
  336 |   // ---------- Widget actions no grid (lápis/x) ----------
  337 | 
  338 |   /**
  339 |    * Localiza o item do grid (wrapper `widgets-grid-item-{uuid}`) que contém
  340 |    * o widget com o título dado — usado pra escopar os botões edit/remove.
  341 |    * Sobe do `*-title` até o ancestral `widgets-grid-item-*`.
  342 |    */
  343 |   private getWidgetGridItemByTitle(title: string): Locator {
  344 |     return this.page
  345 |       .locator('[data-test-id^="widgets-grid-item-"]')
  346 |       .filter({ has: this.getWidgetGridTitle(title) });
  347 |   }
  348 | 
  349 |   getWidgetEditButton(title: string): Locator {
  350 |     return this.getWidgetGridItemByTitle(title).locator('[data-test-id$="-edit-button"]');
  351 |   }
  352 | 
  353 |   getWidgetRemoveButton(title: string): Locator {
  354 |     return this.getWidgetGridItemByTitle(title).locator('[data-test-id$="-remove-button"]');
  355 |   }
  356 | 
  357 |   // ---------- Drawer "Configurações do widget" ----------
  358 | 
  359 |   getWidgetSettingsDrawer(): Locator {
  360 |     return this.page.getByRole('dialog').filter({ hasText: 'Configurações do widget' });
  361 |   }
  362 | 
  363 |   getWidgetSettingsNameSwitch(): Locator {
  364 |     return this.page.locator('[data-test-id="widget-settings-name-enabled-switch"]');
  365 |   }
  366 | 
  367 |   getWidgetSettingsNameInput(): Locator {
  368 |     return this.page.locator('[data-test-id="widget-settings-name-input"]');
  369 |   }
  370 | 
  371 |   getWidgetSettingsIconSwitch(): Locator {
  372 |     return this.page.locator('[data-test-id="widget-settings-icon-enabled-switch"]');
  373 |   }
  374 | 
  375 |   getWidgetSettingsIconGrid(): Locator {
  376 |     return this.page.locator('[data-test-id="widget-settings-icon-grid"]');
  377 |   }
  378 | 
  379 |   getWidgetSettingsIconOption(iconName: string): Locator {
  380 |     return this.page.locator(`[data-test-id="widget-settings-icon-option-${iconName}"]`);
  381 |   }
  382 | 
  383 |   getWidgetSettingsCancelButton(): Locator {
  384 |     return this.page.locator('[data-test-id="widget-settings-cancel-button"]');
  385 |   }
  386 | 
  387 |   getWidgetSettingsSaveButton(): Locator {
  388 |     return this.page.locator('[data-test-id="widget-settings-save-button"]');
  389 |   }
  390 | 
  391 |   /**
  392 |    * Switch Chakra: o `<label>` intercepta o pointer event do `<input>` interno.
  393 |    * Click direto em role=checkbox dá timeout — usar `.click({ force: true })`
  394 |    * no próprio label. Mantém o estado idempotente: só clica se o estado
  395 |    * atual não bate com o desejado (`data-checked` no label quando ON).
  396 |    */
  397 |   async setSwitch(locator: Locator, on: boolean): Promise<void> {
  398 |     const isOn = (await locator.getAttribute('data-checked')) !== null;
  399 |     if (isOn !== on) {
  400 |       await locator.scrollIntoViewIfNeeded();
  401 |       await locator.click({ force: true });
  402 |     }
  403 |   }
  404 | 
  405 |   async openWidgetSettings(title: string): Promise<void> {
  406 |     await this.getWidgetEditButton(title).click();
  407 |     await this.getWidgetSettingsDrawer().waitFor();
  408 |   }
  409 | 
  410 |   /**
```