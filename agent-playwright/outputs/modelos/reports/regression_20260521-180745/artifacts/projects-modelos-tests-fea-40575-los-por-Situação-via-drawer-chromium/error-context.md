# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\filtros-e-busca-modelos\tc02-filtrar-por-situacao-via-drawer.spec.ts >> Filtros e Busca - Modelos >> Filtrar modelos por Situação via drawer
- Location: projects\modelos\tests\features\filtros-e-busca-modelos\tc02-filtrar-por-situacao-via-drawer.spec.ts:6:3

# Error details

```
Error: esperava ao menos 1 cards, encontrei 0

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - generic [ref=e385]: Modelos de conteúdo
        - generic [ref=e393]:
          - generic [ref=e394]:
            - button "Voltar" [ref=e396] [cursor=pointer]:
              - img [ref=e398]
              - text: Voltar
            - heading "Modelos de conteúdo" [level=2] [ref=e401]
          - generic [ref=e403]:
            - generic [ref=e404]:
              - button "Adicionar" [ref=e406] [cursor=pointer]:
                - img [ref=e408]
                - text: Adicionar
              - generic [ref=e410]:
                - generic [ref=e411]:
                  - img [ref=e413]
                  - textbox "Pesquise aqui pelo nome do modelo" [ref=e415]
                - generic [ref=e416]:
                  - generic [ref=e417] [cursor=pointer]: grid_view
                  - generic [ref=e418] [cursor=pointer]: reorder
                - button [ref=e419] [cursor=pointer]:
                  - generic [ref=e421]: filter_alt
                - button "Limpar filtro" [ref=e422] [cursor=pointer]:
                  - generic [ref=e424]: filter_alt_off
                  - generic [ref=e425]: Limpar filtro
            - generic [ref=e426]:
              - generic [ref=e431]:
                - img [ref=e435]
                - generic [ref=e436]:
                  - paragraph [ref=e438]: Salvar sem descrição
                  - generic [ref=e441]:
                    - generic [ref=e444] [cursor=pointer]: visibility
                    - generic [ref=e447] [cursor=pointer]: edit
                    - generic [ref=e450] [cursor=pointer]: content_copy
                    - generic [ref=e453] [cursor=pointer]: delete
              - generic [ref=e458]:
                - generic [ref=e461]:
                  - img [ref=e462]
                  - img "Este modelo possui designs pendentes de regeneração. Acesse a aba design e clique no botão 'Regerar designs'." [ref=e463]:
                    - img [ref=e464]
                - generic [ref=e466]:
                  - paragraph [ref=e468]: Modelo Seed Descricao Longa 1779281852898
                  - generic [ref=e471]:
                    - generic [ref=e474] [cursor=pointer]: visibility
                    - generic [ref=e477] [cursor=pointer]: edit
                    - generic [ref=e480] [cursor=pointer]: content_copy
                    - generic [ref=e483] [cursor=pointer]: delete
              - generic [ref=e488]:
                - img [ref=e492]
                - generic [ref=e493]:
                  - paragraph [ref=e495]: Modelo Seed Ativo 1779281852898
                  - generic [ref=e498]:
                    - generic [ref=e501] [cursor=pointer]: visibility
                    - generic [ref=e504] [cursor=pointer]: edit
                    - generic [ref=e507] [cursor=pointer]: content_copy
                    - generic [ref=e510] [cursor=pointer]: delete
            - generic [ref=e512]:
              - generic [ref=e513]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e514]:
                  - generic [ref=e515]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e516]:
                  - generic [ref=e517]: chevron_left
                - button "1" [ref=e518] [cursor=pointer]
                - button "chevron_right" [disabled] [ref=e519]:
                  - generic [ref=e520]: chevron_right
              - generic [ref=e521]:
                - combobox [ref=e522]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - region "Widget de chat" [ref=e523]:
    - iframe [ref=e524]:
      - generic [ref=f3e2]:
        - generic [ref=f3e6]:
          - button "Abrir chat ao vivo" [ref=f3e7]:
            - img "Avatar de Sophia" [ref=f3e12]
            - generic [ref=f3e13]: Estamos prontos para te atender no que você precisar, viu?! 🤩
          - button "Fechar página de boas-vindas" [ref=f3e14]:
            - img [ref=f3e16]
        - button "Abrir chat ao vivo" [ref=f3e23]:
          - img [ref=f3e26]
          - img [ref=f3e33]
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
  1   | import type { Locator, Page } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | import { safeGoto } from '../../../src/utils/modals.js';
  4   | import { getOrgId } from '../../../src/utils/environment.js';
  5   | 
  6   | export class ContentModelsListPage {
  7   |   constructor(private readonly page: Page) {}
  8   | 
  9   |   // CLAUDE.md §7.5: /play vai pra aluno; admin context exige /o/{orgId}/dashboard.
  10  |   async gotoPlay(): Promise<void> {
  11  |     await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
  12  |   }
  13  | 
  14  |   async goToList(): Promise<void> {
  15  |     await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  16  |   }
  17  | 
  18  |   // Aprendizagem é <a id="learning"> sem href — dispatchEvent contorna actionability.
  19  |   // Sidebar duplica items (mobile+desktop), escopar com #menu.
  20  |   async openAprendizagemMenu(): Promise<void> {
  21  |     await this.page.locator('#menu a#learning').dispatchEvent('click');
  22  |   }
  23  | 
  24  |   async goToModelosFromMenu(): Promise<void> {
  25  |     await this.page.locator('#menu a#content_models').click();
  26  |   }
  27  | 
  28  |   async expectListingLoaded(): Promise<void> {
  29  |     await expect(this.page.getByTestId('content-models-page')).toBeVisible({
  30  |       timeout: 60_000,
  31  |     });
  32  |     await expect(
  33  |       this.page.getByRole('heading', { name: 'Modelos de conteúdo' }),
  34  |     ).toBeVisible({ timeout: 60_000 });
  35  |   }
  36  | 
  37  |   // Botão Adicionar (#content-models-add-button) — redireciona pra /content_models/new
  38  |   addButton(): Locator {
  39  |     return this.page.locator('#content-models-add-button');
  40  |   }
  41  | 
  42  |   async clickAdd(): Promise<void> {
  43  |     await this.addButton().click();
  44  |   }
  45  | 
  46  |   // Input de busca por nome (placeholder "Pesquise aqui pelo nome do modelo")
  47  |   searchInput(): Locator {
  48  |     return this.page.locator('#play-interest-search');
  49  |   }
  50  | 
  51  |   async searchByName(name: string): Promise<void> {
  52  |     await this.searchInput().fill(name);
  53  |     // SPA debounce — espera resultado estabilizar
  54  |     await this.page.waitForTimeout(800);
  55  |   }
  56  | 
  57  |   async clearSearch(): Promise<void> {
  58  |     await this.searchInput().fill('');
  59  |     await this.page.waitForTimeout(800);
  60  |   }
  61  | 
  62  |   // Toggles de visualização — spans com IDs (não buttons).
  63  |   // Quando ativo, classe muda (#grid-view-icon = css-g7ay74 ativo, css-15de166 inativo).
  64  |   gridViewIcon(): Locator {
  65  |     return this.page.locator('#grid-view-icon');
  66  |   }
  67  | 
  68  |   listViewIcon(): Locator {
  69  |     return this.page.locator('#list-icon');
  70  |   }
  71  | 
  72  |   async switchToListView(): Promise<void> {
  73  |     // Click via dispatchEvent — span clicável sem role=button
  74  |     await this.listViewIcon().dispatchEvent('click');
  75  |     await this.page.waitForTimeout(800);
  76  |   }
  77  | 
  78  |   async switchToCardsView(): Promise<void> {
  79  |     await this.gridViewIcon().dispatchEvent('click');
  80  |     await this.page.waitForTimeout(800);
  81  |   }
  82  | 
  83  |   // Cards individuais: cada card tem <p class="chakra-text css-1mjnzuf">{nome}</p>
  84  |   // No estado atual, ID interno é #content_models-{id}-... — usar nome como ancora.
  85  |   cardByName(name: string): Locator {
  86  |     // Container do card é o ancestor mais próximo que tem o p.css-1mjnzuf com o nome
  87  |     return this.page
  88  |       .locator('[data-test-id="content-models-page"] p.css-1mjnzuf')
  89  |       .filter({ hasText: name })
  90  |       .locator('xpath=ancestor::div[contains(@class, "css-fuvrtk")][1]');
  91  |   }
  92  | 
  93  |   // Todos cards visíveis (heurística: container de card = .css-fuvrtk dentro do listing)
  94  |   allCards(): Locator {
  95  |     return this.page.locator('[data-test-id="content-models-page"] .css-fuvrtk');
  96  |   }
  97  | 
  98  |   // Asserção genérica: pelo menos N cards renderizados (invariante por count exato)
  99  |   async expectAtLeastNCards(n: number): Promise<void> {
  100 |     const count = await this.allCards().count();
> 101 |     expect(count, `esperava ao menos ${n} cards, encontrei ${count}`).toBeGreaterThanOrEqual(n);
      |                                                                       ^ Error: esperava ao menos 1 cards, encontrei 0
  102 |   }
  103 | 
  104 |   // Visão Lista — column headers reais da UI (AT documentou "Nome do provedor"
  105 |   // mas a coluna real é "Provedor"; coluna Ações não tem header textual).
  106 |   expectedListColumns = [
  107 |     'Nome',
  108 |     'Descrição',
  109 |     'Provedor',
  110 |     'Designs',
  111 |     'Aplicação',
  112 |     'Situação',
  113 |     'Atualizado em',
  114 |   ];
  115 | 
  116 |   async expectListColumnsVisible(): Promise<void> {
  117 |     for (const col of this.expectedListColumns) {
  118 |       await expect(
  119 |         this.page.getByRole('columnheader', { name: col }),
  120 |       ).toBeVisible({ timeout: 10_000 });
  121 |     }
  122 |   }
  123 | 
  124 |   // Drawer de filtros — segue padrão canônico documentado em
  125 |   // .claude/skills/testar-filtro-drawer-twygo. IDs do componente são
  126 |   // compartilhados entre listagens Twygo.
  127 |   filterButton(): Locator {
  128 |     return this.page.locator('#open-filter');
  129 |   }
  130 | 
  131 |   clearFilterButton(): Locator {
  132 |     return this.page.locator('#clear-filter');
  133 |   }
  134 | 
  135 |   async openFilterDrawer(): Promise<void> {
  136 |     // dispatchEvent contorna overlay invisível do chat widget HubSpot (bottom-right).
  137 |     await this.filterButton().dispatchEvent('click');
  138 |     await expect(
  139 |       this.page.locator('[role="dialog"].chakra-modal__content, .chakra-slide'),
  140 |     ).toBeVisible({ timeout: 10_000 });
  141 |   }
  142 | 
  143 |   // Idempotente: só clica se #clear-filter visível. Aguarda listagem reidratar
  144 |   // (spinner some + cards OU empty state aparece) — sem isso, próximo assert
  145 |   // pode rodar com listagem em loading.
  146 |   async clearFilter(): Promise<void> {
  147 |     const btn = this.clearFilterButton();
  148 |     if (await btn.isVisible().catch(() => false)) {
  149 |       await btn.dispatchEvent('click');
  150 |       await expect(btn).toHaveCount(0, { timeout: 5_000 });
  151 |       await this.waitForListReady();
  152 |     }
  153 |   }
  154 | 
  155 |   // Aguarda listagem terminar reidratação após mudança de filtro/busca.
  156 |   // Spinner Chakra é <div class="chakra-spinner">; some quando dados chegam.
  157 |   async waitForListReady(): Promise<void> {
  158 |     await this.page.locator('.chakra-spinner').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
  159 |     // Listagem renderizada: ou tem card OU empty state "Não há dados"
  160 |     await Promise.race([
  161 |       this.allCards().first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
  162 |       this.page.getByText('Não há dados para exibir').waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
  163 |     ]);
  164 |   }
  165 | 
  166 |   // 4 filtros padrão de Modelos descobertos no recon ao vivo.
  167 |   // Confirma seleção via radio na ordem default-filters-{0,1,2,3}.
  168 |   defaultFilters = {
  169 |     'Modelos ativos': '#default-filters-0',
  170 |     'Modelos inativos': '#default-filters-1',
  171 |     'Modelos próprios': '#default-filters-2',
  172 |     'Modelos de terceiros': '#default-filters-3',
  173 |   } as const;
  174 | 
  175 |   async applyDefaultFilter(name: keyof typeof this.defaultFilters): Promise<void> {
  176 |     // Reabre drawer apenas se não estiver aberto (TC pode chamar openFilterDrawer antes)
  177 |     const drawerOpen = await this.page
  178 |       .locator('[role="dialog"].chakra-modal__content')
  179 |       .isVisible()
  180 |       .catch(() => false);
  181 |     if (!drawerOpen) await this.openFilterDrawer();
  182 |     const radioId = this.defaultFilters[name];
  183 |     await this.page.locator(`label.chakra-radio:has(${radioId})`).click();
  184 |     await this.page.locator('#list-filter-apply').dispatchEvent('click');
  185 |     await expect(this.clearFilterButton()).toBeVisible({ timeout: 10_000 });
  186 |   }
  187 | 
  188 |   // Asserção: drawer modo A (Lista de filtros) com os 4 filtros padrão de Modelos.
  189 |   async expectDefaultFiltersVisible(): Promise<void> {
  190 |     for (const label of Object.keys(this.defaultFilters)) {
  191 |       await expect(
  192 |         this.page.locator('.chakra-modal__content').getByText(label, { exact: true }),
  193 |       ).toBeVisible({ timeout: 5_000 });
  194 |     }
  195 |   }
  196 | }
  197 | 
```