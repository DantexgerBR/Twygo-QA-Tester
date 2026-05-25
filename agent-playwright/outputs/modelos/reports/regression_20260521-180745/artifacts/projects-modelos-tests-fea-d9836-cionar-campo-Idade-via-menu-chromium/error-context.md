# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\criacao-de-modelo-aba-estilo-do-conteudo\tc02-adicionar-campo-idade.spec.ts >> Criação de Modelo - Aba Estilo do Conteúdo >> Adicionar campo Idade via menu
- Location: projects\modelos\tests\features\criacao-de-modelo-aba-estilo-do-conteudo\tc02-adicionar-campo-idade.spec.ts:6:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-style-add-more-data-button"]')
    - locator resolved to <button disabled type="button" aria-haspopup="menu" aria-expanded="false" id="menu-button-:r1j:" aria-controls="menu-list-:r1j:" data-test-id="content-models-style-add-more-data-button" class="chakra-button chakra-menu__menu-button css-7vf75e">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    57 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Base de conhecimento" [ref=e4]:
        - img "Logo - Base de conhecimento" [ref=e5]
      - img "Fechar menu" [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/37007/dashboard
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
                  - /url: /o/37007/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/37007/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/37007/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/37007/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
              - listitem [ref=e51]:
                - link "browse Modelos de conteúdo" [ref=e52] [cursor=pointer]:
                  - /url: /o/37007/content_models
                  - generic [ref=e53]:
                    - generic [ref=e55]: browse
                    - generic [ref=e56]: Modelos de conteúdo
              - listitem [ref=e57]:
                - link "folder_open Base de conhecimento" [ref=e58] [cursor=pointer]:
                  - /url: /o/37007/knowledge_repositories
                  - generic [ref=e59]:
                    - generic [ref=e61]: folder_open
                    - generic [ref=e62]: Base de conhecimento
          - listitem [ref=e63]:
            - link "group Usuários" [ref=e64] [cursor=pointer]:
              - /url: /o/37007/users
              - generic [ref=e65]:
                - generic [ref=e67]: group
                - generic [ref=e68]: Usuários
          - listitem [ref=e69]:
            - link "work Empresas" [ref=e70] [cursor=pointer]:
              - /url: /o/37007/companies
              - generic [ref=e71]:
                - generic [ref=e73]: work
                - generic [ref=e74]: Empresas
          - listitem [ref=e75]:
            - link "live_help Questionários" [ref=e76] [cursor=pointer]:
              - /url: /o/37007/question_lists
              - generic [ref=e77]:
                - generic [ref=e79]: live_help
                - generic [ref=e80]: Questionários
          - listitem [ref=e81]:
            - link "groups Comunidades" [ref=e82] [cursor=pointer]:
              - /url: /o/37007/feed
              - generic [ref=e83]:
                - generic [ref=e85]: groups
                - generic [ref=e86]: Comunidades
          - listitem [ref=e87]:
            - generic [ref=e89]:
              - generic [ref=e92]: psychology
              - generic [ref=e93]:
                - text: Skills
                - generic [ref=e94]: BETA
            - list [ref=e95]:
              - listitem [ref=e96]:
                - link "lan Organograma" [ref=e97] [cursor=pointer]:
                  - /url: /o/37007/organization_chart
                  - generic [ref=e98]:
                    - generic [ref=e100]: lan
                    - generic [ref=e101]: Organograma
              - listitem [ref=e102]:
                - link "badge Funções" [ref=e103] [cursor=pointer]:
                  - /url: /o/37007/roles
                  - generic [ref=e104]:
                    - generic [ref=e106]: badge
                    - generic [ref=e107]: Funções
              - listitem [ref=e108]:
                - link "award_star Competências" [ref=e109] [cursor=pointer]:
                  - /url: /o/37007/organization_chart_competencies
                  - generic [ref=e110]:
                    - generic [ref=e112]: award_star
                    - generic [ref=e113]: Competências
          - listitem [ref=e114]:
            - generic [ref=e116]:
              - generic [ref=e119]: account_tree
              - generic [ref=e120]: Processos
            - list [ref=e121]:
              - listitem [ref=e122]:
                - link "send Repositórios" [ref=e123] [cursor=pointer]:
                  - /url: /o/37007/organization_datasets
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Repositórios
              - listitem [ref=e128]:
                - link "send Arquitetura de Processos" [ref=e129] [cursor=pointer]:
                  - /url: /o/37007/process_architecture
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Arquitetura de Processos
              - listitem [ref=e134]:
                - link "send Agente de Documentação" [ref=e135] [cursor=pointer]:
                  - /url: /o/37007/process_documentations
                  - generic [ref=e136]:
                    - generic [ref=e138]: send
                    - generic [ref=e139]: Agente de Documentação
              - listitem [ref=e140]:
                - link "send Documentos de Referência" [ref=e141] [cursor=pointer]:
                  - /url: /o/37007/reference_documents
                  - generic [ref=e142]:
                    - generic [ref=e144]: send
                    - generic [ref=e145]: Documentos de Referência
              - listitem [ref=e146]:
                - link "send Portal de processos" [ref=e147] [cursor=pointer]:
                  - /url: /o/37007/visualize_documentations
                  - generic [ref=e148]:
                    - generic [ref=e150]: send
                    - generic [ref=e151]: Portal de processos
      - generic [ref=e152]: Base de conhecimento
      - list [ref=e153]:
        - listitem [ref=e154]:
          - generic [ref=e155]:
            - generic [ref=e156]: f
            - text: Configurações
          - list [ref=e157]:
            - listitem [ref=e158]:
              - link "e Organização" [ref=e159] [cursor=pointer]:
                - /url: /o/37007/edit
                - generic [ref=e160]: e
                - text: Organização
            - listitem [ref=e161]:
              - link " Menu" [ref=e162] [cursor=pointer]:
                - /url: /o/37007/use_modes
                - generic [ref=e163]: 
                - text: Menu
            - listitem [ref=e164]:
              - link "electrical_services Integrações" [ref=e165] [cursor=pointer]:
                - /url: /o/37007/integrations
                - generic [ref=e166]: electrical_services
                - text: Integrações
            - listitem [ref=e167]:
              - link "flash_auto Piloto automático" [ref=e168] [cursor=pointer]:
                - /url: /o/37007/autopilots
                - generic [ref=e169]: flash_auto
                - text: Piloto automático
            - listitem [ref=e170]:
              - link " Regras do Jogo" [ref=e171] [cursor=pointer]:
                - /url: /o/37007/game_rules
                - generic [ref=e172]: 
                - text: Regras do Jogo
            - listitem [ref=e173]:
              - link " Comunicação" [ref=e174] [cursor=pointer]:
                - /url: /o/37007/communication
                - generic [ref=e175]: 
                - text: Comunicação
            - listitem [ref=e176]:
              - link "sell Cobrança de inscrição" [ref=e177] [cursor=pointer]:
                - /url: /o/37007/payments
                - generic [ref=e178]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e179]:
              - link "credit_card Plano e assinatura" [ref=e180] [cursor=pointer]:
                - /url: /o/37007/subscription_plans
                - generic [ref=e181]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e182]:
              - link " Segurança NOVO" [ref=e183] [cursor=pointer]:
                - /url: /o/37007/security
                - generic [ref=e184]: 
                - text: Segurança NOVO
            - listitem [ref=e185]:
              - link "smart_toy Controle de IA BETA" [ref=e186] [cursor=pointer]:
                - /url: /o/37007/ai_consumption_analysis
                - generic [ref=e187]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e188]:
              - link "palette Aparência" [ref=e189] [cursor=pointer]:
                - /url: /o/37007/appearance
                - generic [ref=e190]: palette
                - text: Aparência
    - generic [ref=e193]:
      - generic [ref=e194]:
        - img [ref=e195]
        - text: Base de conhecimento
      - img [ref=e197]
  - text: "0"
  - generic [ref=e200]:
    - generic "Logo - Base de conhecimento" [ref=e202]:
      - link "Base de conhecimento" [ref=e204] [cursor=pointer]:
        - /url: /o/37007/dashboard
    - generic [ref=e208]:
      - button "Twygo Academy" [ref=e212] [cursor=pointer]:
        - generic [ref=e213]: school
      - link "Open chat" [ref=e217] [cursor=pointer]:
        - /url: /o/37007/chats
        - button "Open chat" [ref=e218]:
          - img [ref=e219]
      - button "Users" [ref=e226] [cursor=pointer]:
        - img [ref=e227]
      - generic [ref=e230]:
        - link "7089847 - Base de conhecimento" [ref=e231] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e232]: Base de conhecimento
      - button "Administrador G" [ref=e233] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e234]: G
    - text: M * * M * *
  - generic [ref=e235]:
    - generic [ref=e240]:
      - generic [ref=e242]:
        - generic [ref=e245]:
          - generic [ref=e246]:
            - paragraph [ref=e247]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 22/05.
            - paragraph [ref=e248]: Quer mais detalhes sobre essa novidade? Veja aqui
          - button "Responder pesquisa" [ref=e250] [cursor=pointer]
          - button "Close" [ref=e251] [cursor=pointer]:
            - img [ref=e252]
        - generic [ref=e256]:
          - generic [ref=e257]:
            - paragraph [ref=e258]: Você está no modo BETA da funcionalidade Painéis do usuário, que estará disponível até dia 29/05.
            - paragraph [ref=e259]: Quer relembrar os detalhes dessa novidade? Veja aqui — Beta aceito por agents.qa@claude.com
          - generic [ref=e260]:
            - button "Interromper BETA teste" [ref=e261] [cursor=pointer]
            - button "Responder pesquisa" [ref=e262] [cursor=pointer]
          - button "Close" [ref=e263] [cursor=pointer]:
            - img [ref=e264]
      - button "next" [ref=e269] [cursor=pointer]:
        - img [ref=e270]
    - generic [ref=e273]:
      - generic [ref=e275]:
        - list [ref=e276]:
          - list [ref=e277]:
            - listitem [ref=e278] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e279]:
                - /url: /o/37007/dashboard
                - generic [ref=e280]:
                  - generic [ref=e282]: leaderboard
                  - generic [ref=e283]: Dashboard
            - listitem [ref=e284] [cursor=pointer]:
              - generic [ref=e286]:
                - generic [ref=e289]: school
                - generic [ref=e290]: Aprendizagem
                - generic [ref=e292]: G
              - list [ref=e293]:
                - listitem [ref=e294]:
                  - link "format_list_bulleted_add Conteúdos" [ref=e295]:
                    - /url: /o/37007/events?tab=events
                    - generic [ref=e296]:
                      - generic [ref=e298]: format_list_bulleted_add
                      - generic [ref=e299]: Conteúdos
                - listitem [ref=e300]:
                  - link "send Compartilhamentos" [ref=e301]:
                    - /url: /o/37007/shared_events
                    - generic [ref=e302]:
                      - generic [ref=e304]: send
                      - generic [ref=e305]: Compartilhamentos
                - listitem [ref=e306]:
                  - link "description Registros BETA" [ref=e307]:
                    - /url: /o/37007/records
                    - generic [ref=e308]:
                      - generic [ref=e310]: description
                      - generic [ref=e311]: Registros
                      - generic [ref=e312]: BETA
                - listitem [ref=e313]:
                  - link "workspace_premium Certificados" [ref=e314]:
                    - /url: /o/37007/certificate_models
                    - generic [ref=e315]:
                      - generic [ref=e317]: workspace_premium
                      - generic [ref=e318]: Certificados
                - listitem [ref=e319]:
                  - link "browse Modelos de conteúdo" [ref=e320]:
                    - /url: /o/37007/content_models
                    - generic [ref=e321]:
                      - generic [ref=e323]: browse
                      - generic [ref=e324]: Modelos de conteúdo
                - listitem [ref=e325]:
                  - link "folder_open Base de conhecimento" [ref=e326]:
                    - /url: /o/37007/knowledge_repositories
                    - generic [ref=e327]:
                      - generic [ref=e329]: folder_open
                      - generic [ref=e330]: Base de conhecimento
            - listitem [ref=e331] [cursor=pointer]:
              - link "group Usuários" [ref=e332]:
                - /url: /o/37007/users
                - generic [ref=e333]:
                  - generic [ref=e335]: group
                  - generic [ref=e336]: Usuários
            - listitem [ref=e337] [cursor=pointer]:
              - link "work Empresas" [ref=e338]:
                - /url: /o/37007/companies
                - generic [ref=e339]:
                  - generic [ref=e341]: work
                  - generic [ref=e342]: Empresas
            - listitem [ref=e343] [cursor=pointer]:
              - link "live_help Questionários" [ref=e344]:
                - /url: /o/37007/question_lists
                - generic [ref=e345]:
                  - generic [ref=e347]: live_help
                  - generic [ref=e348]: Questionários
            - listitem [ref=e349] [cursor=pointer]:
              - link "groups Comunidades" [ref=e350]:
                - /url: /o/37007/feed
                - generic [ref=e351]:
                  - generic [ref=e353]: groups
                  - generic [ref=e354]: Comunidades
            - listitem [ref=e355] [cursor=pointer]:
              - generic [ref=e357]:
                - generic [ref=e360]: psychology
                - generic [ref=e361]:
                  - text: Skills
                  - generic [ref=e362]: BETA
                - generic [ref=e364]: G
            - listitem [ref=e365] [cursor=pointer]:
              - generic [ref=e367]:
                - generic [ref=e370]: account_tree
                - generic [ref=e371]: Processos
                - generic [ref=e373]: G
        - generic [ref=e375]: Base de conhecimento
        - list [ref=e376]:
          - listitem [ref=e377] [cursor=pointer]:
            - generic [ref=e378]:
              - generic [ref=e379]: f
              - text: Configurações
              - generic [ref=e380]: G
            - text: e    s 
      - generic [ref=e382]:
        - generic [ref=e385]: Modelos de conteúdo > Editar modelo
        - generic [ref=e392]:
          - generic [ref=e393]:
            - button "Voltar" [ref=e395] [cursor=pointer]:
              - img [ref=e397]
              - text: Voltar
            - heading "Editar modelo de conteúdo" [level=2] [ref=e400]
          - generic [ref=e403]:
            - tablist [ref=e404]:
              - tab "Identificação" [ref=e405] [cursor=pointer]
              - tab "Estilo" [active] [selected] [ref=e406] [cursor=pointer]
              - tab "Estrutura" [ref=e407] [cursor=pointer]
              - tab "Imagem" [ref=e408] [cursor=pointer]
              - tab "Áudio" [ref=e409] [cursor=pointer]
              - tab "Design" [ref=e410] [cursor=pointer]
              - tab "Compartilhar" [ref=e411] [cursor=pointer]
            - tabpanel "Estilo" [ref=e413]:
              - generic [ref=e415]:
                - generic [ref=e416]:
                  - button "Adicionar mais dados" [disabled] [ref=e418]:
                    - generic [ref=e420]: add
                    - generic: Adicionar mais dados
                  - generic [ref=e423]:
                    - generic [ref=e426]:
                      - generic [ref=e427]:
                        - generic [ref=e429]: Idade
                        - button "Remover Idade" [ref=e430] [cursor=pointer]:
                          - generic [ref=e431]: delete
                      - group [ref=e433]:
                        - 'textbox "Ex: 18-25 anos, 26-35 anos, Todas as idades..." [ref=e435]': arroz
                        - paragraph [ref=e438]: 5 / 250
                    - generic [ref=e441]:
                      - generic [ref=e442]:
                        - generic [ref=e444]: Dificuldade
                        - button "Remover Dificuldade" [ref=e445] [cursor=pointer]:
                          - generic [ref=e446]: delete
                      - group [ref=e448]:
                        - 'textbox "Ex: Iniciante, Intermediário, Avançado..." [ref=e450]': "123"
                        - paragraph [ref=e453]: 3 / 250
                    - generic [ref=e456]:
                      - generic [ref=e457]:
                        - generic [ref=e459]: Tom de voz
                        - button "Remover Tom de voz" [ref=e460] [cursor=pointer]:
                          - generic [ref=e461]: delete
                      - group [ref=e463]:
                        - 'textbox "Ex: Formal, Casual, Motivacional, Técnico..." [ref=e465]': batata doce
                        - paragraph [ref=e468]: 11 / 250
                    - generic [ref=e471]:
                      - generic [ref=e472]:
                        - generic [ref=e474]: Perfil do público
                        - button "Remover Perfil do público" [ref=e475] [cursor=pointer]:
                          - generic [ref=e476]: delete
                      - group [ref=e478]:
                        - 'textbox "Ex: Profissionais em início de liderança..." [ref=e480]': buffalos africanos
                        - paragraph [ref=e483]: 18 / 250
                    - generic [ref=e486]:
                      - generic [ref=e487]:
                        - generic [ref=e489]: Idioma
                        - button "Remover Idioma" [ref=e490] [cursor=pointer]:
                          - generic [ref=e491]: delete
                      - group [ref=e493]:
                        - generic [ref=e495]:
                          - combobox [ref=e496]:
                            - option "Selecione o idioma"
                            - option "Português" [selected]
                            - option "Inglês"
                            - option "Espanhol"
                          - generic:
                            - img
                    - generic [ref=e499]:
                      - generic [ref=e500]:
                        - generic [ref=e502]: Informações adicionais
                        - button "Remover Informações adicionais" [ref=e503] [cursor=pointer]:
                          - generic [ref=e504]: delete
                      - group [ref=e506]:
                        - 'textbox "Ex: Informações específicas sobre o contexto, requisitos especiais, metodologia preferida..." [ref=e507]': oq sera q rola se eu preencher os campos dessa forma?
                        - paragraph [ref=e510]: 53 / 2500
                - button "Salvar" [ref=e512] [cursor=pointer]
  - region "Widget de chat" [ref=e513]:
    - iframe [ref=e514]:
      - button "Abrir chat ao vivo" [ref=f19e5]:
        - img [ref=f19e8]
        - img [ref=f19e15]
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
  62  |   }
  63  | 
  64  |   // Botões
  65  |   saveButton(): Locator {
  66  |     return this.page.locator('[data-test-id="content-models-identification-submit-button"]');
  67  |   }
  68  | 
  69  |   backButton(): Locator {
  70  |     return this.page.locator('#content-models-form-back-button');
  71  |   }
  72  | 
  73  |   // Salvar via JS click (botão fica no canto inferior direito, coberto pelo chat widget HubSpot).
  74  |   async save(): Promise<void> {
  75  |     const btn = this.saveButton();
  76  |     await btn.scrollIntoViewIfNeeded();
  77  |     await btn.evaluate((el: HTMLButtonElement) => el.click());
  78  |   }
  79  | 
  80  |   // Preenchimento Kit de marca via keyboard (dropdown react-select)
  81  |   async selectKitDeMarca(option?: string): Promise<void> {
  82  |     const input = this.kitDeMarcaInput();
  83  |     await input.focus();
  84  |     if (option) {
  85  |       await input.fill(option);
  86  |       await this.page.waitForTimeout(300);
  87  |     }
  88  |     await this.page.keyboard.press('ArrowDown');
  89  |     await this.page.waitForTimeout(200);
  90  |     await this.page.keyboard.press('Enter');
  91  |     await this.page.waitForTimeout(300);
  92  |   }
  93  | 
  94  |   // Fluxo completo de criação (TC1 happy path)
  95  |   async fillIdentificationAndSave(opts: {
  96  |     nome: string;
  97  |     descricao?: string;
  98  |     kitDeMarca?: string;
  99  |   }): Promise<void> {
  100 |     await this.nameInput().fill(opts.nome);
  101 |     if (opts.descricao) {
  102 |       await this.descriptionTextarea().fill(opts.descricao);
  103 |     }
  104 |     await this.selectKitDeMarca(opts.kitDeMarca);
  105 |     await this.save();
  106 |   }
  107 | 
  108 |   // Badge "Dica" (só renderiza na criação — RN 9)
  109 |   dicaBadge(): Locator {
  110 |     return this.page.locator('[data-test-id="content-models-duplicate-tip-alert"]');
  111 |   }
  112 | 
  113 |   // Toast Chakra (sucesso/erro)
  114 |   toastSuccess(): Locator {
  115 |     return this.page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).first();
  116 |   }
  117 | 
  118 |   // ─── Aba Estilo ───
  119 |   async gotoEditStyleTab(id: number | string): Promise<void> {
  120 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models/${id}/edit?tab=style`);
  121 |     await expect(this.page.locator('[data-test-id="tab-style"]')).toHaveAttribute(
  122 |       'aria-selected',
  123 |       'true',
  124 |       { timeout: 15_000 },
  125 |     );
  126 |   }
  127 | 
  128 |   // Abre edição do 1º modelo da listagem e troca pra aba style.
  129 |   // Mais robusto que hardcodar ID (que muda entre envs).
  130 |   async gotoFirstModelEditStyle(): Promise<void> {
  131 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  132 |     await this.page.waitForTimeout(1500);
  133 |     const editIcon = this.page
  134 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  135 |       .first();
  136 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  137 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  138 |     // Click tab style
  139 |     await this.page.locator('[data-test-id="tab-style"]').click();
  140 |     await expect(this.page.locator('[data-test-id="tab-style"]')).toHaveAttribute(
  141 |       'aria-selected',
  142 |       'true',
  143 |       { timeout: 10_000 },
  144 |     );
  145 |   }
  146 | 
  147 |   styleAddMoreDataButton(): Locator {
  148 |     return this.page.locator('[data-test-id="content-models-style-add-more-data-button"]');
  149 |   }
  150 | 
  151 |   styleAddOptionByTestId = {
  152 |     'Idade': 'content-models-style-add-style-age-range',
  153 |     'Dificuldade': 'content-models-style-add-style-difficulty',
  154 |     'Tom de voz': 'content-models-style-add-style-voice-tone',
  155 |     'Perfil do público': 'content-models-style-add-style-audience-profile',
  156 |     'Idioma': 'content-models-style-add-style-language',
  157 |     'Informações adicionais': 'content-models-style-add-style-additional-info',
  158 |   } as const;
  159 | 
  160 |   async openStyleAddMenu(): Promise<void> {
  161 |     // Botão fica próximo ao centro/topo da aba — não precisa de força
> 162 |     await this.styleAddMoreDataButton().click();
      |                                         ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  163 |     // Espera ao menos 1 menuitem aparecer
  164 |     await expect(
  165 |       this.page.locator('[data-test-id="content-models-style-add-style-age-range"]'),
  166 |     ).toBeVisible({ timeout: 5_000 });
  167 |   }
  168 | 
  169 |   async clickStyleAddOption(option: keyof typeof this.styleAddOptionByTestId): Promise<void> {
  170 |     const tid = this.styleAddOptionByTestId[option];
  171 |     await this.page.locator(`[data-test-id="${tid}"]`).click();
  172 |   }
  173 | 
  174 |   // ─── Aba Estrutura ───
  175 |   async gotoFirstModelEditStructure(): Promise<void> {
  176 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  177 |     await this.page.waitForTimeout(1500);
  178 |     const editIcon = this.page
  179 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  180 |       .first();
  181 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  182 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  183 |     await this.page.locator('[data-test-id="tab-structure"]').click();
  184 |     await expect(this.page.locator('[data-test-id="tab-structure"]')).toHaveAttribute(
  185 |       'aria-selected',
  186 |       'true',
  187 |       { timeout: 10_000 },
  188 |     );
  189 |   }
  190 | 
  191 |   // Tipo de estrutura: <select id="structure_type"> nativo.
  192 |   // (htmlFor do label aponta pra "content-models-structure-type-select" que não
  193 |   // existe no DOM — divergência AT vs UI; o select real usa id snake_case.)
  194 |   tipoEstruturaSelect(): Locator {
  195 |     return this.page.locator('#structure_type');
  196 |   }
  197 | 
  198 |   async selectTipoEstrutura(label: 'Atividades sequenciais (1 nível)' | 'Atividades agrupadas por módulos (2 níveis)'): Promise<void> {
  199 |     await this.tipoEstruturaSelect().selectOption({ label });
  200 |     await this.page.waitForTimeout(500);
  201 |   }
  202 | 
  203 |   async tipoEstruturaOptions(): Promise<string[]> {
  204 |     return this.tipoEstruturaSelect().locator('option').allTextContents();
  205 |   }
  206 | 
  207 |   // Carga horária: <select id="structure_workload"> nativo. UI mostra labels CURTOS
  208 |   // ("Micro", "Curto", etc) — AT documentou completos ("Micro (30s a 5min)") por
  209 |   // engano. AT canônico será atualizado pra refletir UI real.
  210 |   cargaHorariaSelect(): Locator {
  211 |     return this.page.locator('#structure_workload');
  212 |   }
  213 | 
  214 |   async cargaHorariaOptionsLabels(): Promise<string[]> {
  215 |     return this.cargaHorariaSelect().locator('option').allTextContents();
  216 |   }
  217 | 
  218 |   cargaHorariaOptions = ['Micro', 'Curto', 'Médio', 'Estendido', 'Longo'] as const;
  219 | 
  220 |   // Switches da aba Estrutura
  221 |   incluirQuestionariosSwitch(): Locator {
  222 |     return this.page.locator('label[for="structure_include_quiz"]');
  223 |   }
  224 |   incluirQuestionariosChecked(): Promise<boolean> {
  225 |     return this.page.locator('#structure_include_quiz').isChecked();
  226 |   }
  227 | 
  228 |   incluirProvaFinalSwitch(): Locator {
  229 |     return this.page.locator('label[for="structure_include_final_exam"]');
  230 |   }
  231 |   incluirProvaFinalChecked(): Promise<boolean> {
  232 |     return this.page.locator('#structure_include_final_exam').isChecked();
  233 |   }
  234 | 
  235 |   atividadesPorModuloInput(): Locator {
  236 |     return this.page.locator('#structure_activities_count');
  237 |   }
  238 | 
  239 |   structureSaveButton(): Locator {
  240 |     return this.page.locator('[data-test-id="content-models-structure-submit-button"]');
  241 |   }
  242 | 
  243 |   async structureSave(): Promise<void> {
  244 |     const btn = this.structureSaveButton();
  245 |     await btn.scrollIntoViewIfNeeded();
  246 |     await btn.evaluate((el: HTMLButtonElement) => el.click());
  247 |   }
  248 | 
  249 |   // ─── Aba Imagem ───
  250 |   async gotoFirstModelEditImage(): Promise<void> {
  251 |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  252 |     await this.page.waitForTimeout(1500);
  253 |     const editIcon = this.page
  254 |       .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
  255 |       .first();
  256 |     await editIcon.evaluate((el: HTMLElement) => el.click());
  257 |     await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
  258 |     await this.page.locator('[data-test-id="tab-image"]').click();
  259 |     await expect(this.page.locator('[data-test-id="tab-image"]')).toHaveAttribute(
  260 |       'aria-selected',
  261 |       'true',
  262 |       { timeout: 10_000 },
```