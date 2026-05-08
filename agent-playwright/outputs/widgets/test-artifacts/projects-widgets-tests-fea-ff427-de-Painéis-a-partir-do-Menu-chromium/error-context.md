# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects/widgets/tests/features/listagem-de-paineis/acessar-listagem-paineis-menu.spec.ts >> Listagem de painéis >> Acessar a listagem de Painéis a partir do Menu
- Location: projects/widgets/tests/features/listagem-de-paineis/acessar-listagem-paineis-menu.spec.ts:9:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#menu a[name="settings-main-menu"]')
    - locator resolved to <a name="settings-main-menu">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-wl0d9u">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-wl0d9u">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    57 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="-1" class="chakra-modal__content-container css-wl0d9u">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

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
                - /url: /o/36988/appearance
                - generic [ref=e175]: palette
                - text: Aparência
            - listitem [ref=e176]:
              - link [ref=e177] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e178]: credit_card
                - text: Créditos de IA BETA
    - generic [ref=e181]:
      - generic [ref=e182]:
        - img [ref=e183]
        - text: Claude Agents
      - img [ref=e185]
  - text: "0"
  - generic [ref=e188]:
    - link [ref=e191] [cursor=pointer]:
      - /url: /o/36988/dashboard
      - img [ref=e192]
    - generic [ref=e196]:
      - link [ref=e200] [cursor=pointer]:
        - /url: /o/36988/chats
        - button [ref=e201]:
          - img [ref=e202]
      - button [ref=e209] [cursor=pointer]:
        - img [ref=e210]
      - generic [ref=e213]:
        - link [ref=e214] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e215]: Claude Agents
      - button [ref=e216] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e217]: G
    - text: M * * M * *
  - generic [ref=e218]:
    - generic [ref=e228]:
      - generic [ref=e229]:
        - paragraph [ref=e230]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 20/05.
        - paragraph [ref=e231]: Quer mais detalhes sobre essa novidade? Veja aqui
      - button [ref=e233] [cursor=pointer]: Responder pesquisa
      - button [ref=e234] [cursor=pointer]:
        - img [ref=e235]
    - generic [ref=e238]:
      - generic [ref=e240]:
        - list [ref=e241]:
          - list [ref=e242]:
            - listitem [ref=e243] [cursor=pointer]:
              - link [ref=e244]:
                - /url: /o/36988/dashboard
                - generic [ref=e245]:
                  - generic [ref=e247]: leaderboard
                  - generic [ref=e248]: Dashboard
            - listitem [ref=e249] [cursor=pointer]:
              - generic [ref=e251]:
                - generic [ref=e254]: school
                - generic [ref=e255]: Aprendizagem
                - generic [ref=e257]: G
            - listitem [ref=e258] [cursor=pointer]:
              - link [ref=e259]:
                - /url: /o/36988/users
                - generic [ref=e260]:
                  - generic [ref=e262]: group
                  - generic [ref=e263]: Usuários
            - listitem [ref=e264] [cursor=pointer]:
              - link [ref=e265]:
                - /url: /o/36988/companies
                - generic [ref=e266]:
                  - generic [ref=e268]: work
                  - generic [ref=e269]: Empresas
            - listitem [ref=e270] [cursor=pointer]:
              - link [ref=e271]:
                - /url: /o/36988/question_lists
                - generic [ref=e272]:
                  - generic [ref=e274]: live_help
                  - generic [ref=e275]: Questionários
            - listitem [ref=e276] [cursor=pointer]:
              - link [ref=e277]:
                - /url: /o/36988/feed
                - generic [ref=e278]:
                  - generic [ref=e280]: groups
                  - generic [ref=e281]: Comunidades
            - listitem [ref=e282] [cursor=pointer]:
              - generic [ref=e284]:
                - generic [ref=e287]: psychology
                - generic [ref=e288]:
                  - text: Skills
                  - generic [ref=e289]: BETA
                - generic [ref=e291]: G
            - listitem [ref=e292] [cursor=pointer]:
              - generic [ref=e294]:
                - generic [ref=e297]: account_tree
                - generic [ref=e298]: Processos
                - generic [ref=e300]: G
        - generic [ref=e302]: widgets [36988]
        - list [ref=e303]:
          - listitem [ref=e304] [cursor=pointer]:
            - generic [ref=e305]:
              - generic [ref=e306]: f
              - text: Configurações
              - generic [ref=e307]: G
            - text: e    s 
      - generic [ref=e309]:
        - generic [ref=e314]: Dashboard
        - generic [ref=e320]:
          - button [ref=e322] [cursor=pointer]:
            - generic [ref=e323]: 
          - generic [ref=e324]:
            - generic [ref=e326]:
              - heading [level=3] [ref=e328]: Resumo das atividades
              - generic [ref=e330]:
                - generic [ref=e332]:
                  - generic [ref=e336]: 0%
                  - generic [ref=e337]: Certificados
                - generic [ref=e339]:
                  - generic [ref=e343]: 0%
                  - generic [ref=e344]: Progresso
                - generic [ref=e346]:
                  - generic [ref=e350]: 0%
                  - generic [ref=e351]: Questionários
            - generic [ref=e353]:
              - heading [level=3] [ref=e355]: Dados do ambiente
              - generic [ref=e358]:
                - generic [ref=e360]:
                  - generic [ref=e361]:
                    - text: Carga horária
                    - link [ref=e362] [cursor=pointer]:
                      - /url: javascript:void(0);
                      - generic [ref=e363]: M
                  - generic [ref=e364]:
                    - generic [ref=e366]:
                      - strong [ref=e367]: 0s
                      - generic [ref=e368]: Planejadas
                    - generic [ref=e370]:
                      - strong [ref=e371]: 0s
                      - generic [ref=e372]: Realizadas
                - generic [ref=e374]:
                  - generic [ref=e375]:
                    - text: Inscrições
                    - link [ref=e376] [cursor=pointer]:
                      - /url: javascript:void(0);
                      - generic [ref=e377]: M
                  - generic [ref=e380]:
                    - strong [ref=e381]: "0"
                    - generic [ref=e382]: Inscrições
          - generic [ref=e383]:
            - generic [ref=e385]:
              - heading [level=3] [ref=e387]:
                - text: Conteúdos mais populares
                - generic [ref=e388]: Matrículas
              - generic [ref=e389]:
                - paragraph [ref=e390]: Nenhum conteúdo para mostrar.
                - paragraph [ref=e391]:
                  - link [ref=e392] [cursor=pointer]:
                    - /url: /o/36988/events?tab=events
                    - text: + Adicionar
            - generic [ref=e394]:
              - heading [level=3] [ref=e396]:
                - text: Conteúdos em andamento
                - generic [ref=e397]: Progresso
              - generic [ref=e398]:
                - paragraph [ref=e399]: Nenhum conteúdo para mostrar.
                - paragraph [ref=e400]:
                  - link [ref=e401] [cursor=pointer]:
                    - /url: /o/36988/events?tab=events
                    - text: + Adicionar
  - region [ref=e402]:
    - iframe [ref=e403]:
      - button "Abrir chat ao vivo" [ref=f5e5]:
        - img [ref=f5e8]
        - img [ref=f5e15]
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
  - dialog "Close sofia Em uma escala de 1 a 10, o quanto você indicaria a Twygo a um amigo ou familiar?" [ref=e406]:
    - banner [ref=e407]:
      - button "Close" [active] [ref=e408] [cursor=pointer]:
        - img [ref=e409]
      - img "sofia" [ref=e411]
      - generic [ref=e412]: Em uma escala de 1 a 10, o quanto você indicaria a Twygo a um amigo ou familiar?
    - generic [ref=e413]:
      - generic [ref=e414]:
        - button "1" [ref=e416] [cursor=pointer]
        - button "2" [ref=e418] [cursor=pointer]
        - button "3" [ref=e420] [cursor=pointer]
        - button "4" [ref=e422] [cursor=pointer]
        - button "5" [ref=e424] [cursor=pointer]
        - button "6" [ref=e426] [cursor=pointer]
        - button "7" [ref=e428] [cursor=pointer]
        - button "8" [ref=e430] [cursor=pointer]
        - button "9" [ref=e432] [cursor=pointer]
        - button "10" [ref=e434] [cursor=pointer]
      - group [ref=e436]:
        - generic [ref=e438]: Justifique por favor.
        - textbox "Justifique por favor." [ref=e439]:
          - /placeholder: Opcional
    - contentinfo [ref=e440]:
      - generic [ref=e441]:
        - button "Salvar" [ref=e442] [cursor=pointer]
        - button "Pergunte depois" [ref=e443] [cursor=pointer]
    - paragraph [ref=e445]: Pesquisa realizada apenas com usuários administradores.
```

# Test source

```ts
  1   | import { expect, type Locator, type Page } from '@playwright/test';
  2   | import { getOrgId } from '../../../src/utils/environment.js';
  3   | import { dismissCommonModals } from '../../../src/utils/modals.js';
  4   | 
  5   | /**
  6   |  * Page Object da listagem de Painéis (módulo Widgets).
  7   |  *
  8   |  * URL canônica: `/o/{orgId}/use_modes?tab=panels-tab`
  9   |  *
  10  |  * Observações de contrato (re-exploradas em 2026-05-06 com seed de 30 painéis
  11  |  * na org 36988 do env `staging`):
  12  |  * - O componente NÃO é um web-component `<list-control>` literal — é uma
  13  |  *   estrutura de divs Chakra UI. Asserções de "listagem renderizou" devem
  14  |  *   usar os sub-componentes (search input, add button) como prova.
  15  |  * - A listagem da aba Painéis NÃO compartilha estrutura com a aba irmã
  16  |  *   "Modos de uso" (que usa um componente legado de cards).
  17  |  * - **Toggle Lista/Cards EXISTE**: dois `<span>` Material Symbols dentro do
  18  |  *   mesmo container — `#grid-view-icon` (`data-icon="grid_view"`) muda para
  19  |  *   cards e `#list-icon` (`data-icon="reorder"`) muda para lista. O modo
  20  |  *   ativo se distingue pela cor do ícone (mais escura quando ativo).
  21  |  * - **Default no viewport 1920x1080 é Lista** (tabela com `<table>` Chakra).
  22  |  *   Em viewports menores o default pode ser cards — por isso specs que
  23  |  *   dependem de modo determinístico fazem `test.use({ viewport: 1920x1080 })`
  24  |  *   e chamam `setViewMode('lista'|'cards')` explicitamente.
  25  |  * - **Colunas em modo Lista** (re-confirmado 2026-05-06): Nome, Descrição,
  26  |  *   Data de criação, Ativo? (com `?`), e um `<th>` vazio para Ações.
  27  |  *   **Provedora NÃO existe** (XML descrevia coluna inexistente).
  28  |  * - **Colunas ordenáveis**: apenas 3 — Nome, Data de criação, Ativo. Cada
  29  |  *   uma tem um SVG indicador com id estável (`panels-order-by-name`,
  30  |  *   `panels-order-by-created_at`, `panels-order-by-is_active`). A classe do
  31  |  *   SVG é hashada (Chakra `css-*`); para asserções de sort use comparação
  32  |  *   de texto das linhas em vez do indicador visual.
  33  |  * - **Coluna Ativo é checkbox**: `<input type="checkbox">` sem `role="switch"`.
  34  |  * - **Paginação** existe e é interativa quando há >25 painéis (re-confirmado
  35  |  *   2026-05-06 com seed de 30 painéis: chevron_right enabled, página 2
  36  |  *   acessível). IDs estáveis: `first-page-button`, `previous-page-button`,
  37  |  *   `page-button-N`, `next-page-button`.
  38  |  * - **Ações por linha/card**: cada item expõe três ícones com IDs do tipo
  39  |  *   `panels-{id}-edit-element-1-button-0` (editar), `panels-{id}-custom-element-1-button-1`
  40  |  *   (duplicar/content_copy), `panels-{id}-destroy-element-1-button-2` (excluir).
  41  |  *
  42  |  * Status data-test-id: NENHUM elemento da listagem tem `data-test-id` ainda
  43  |  * (PR pendente para o time de dev — ver plano em `specs/`). Fallbacks usam
  44  |  * id estável (`#page-breadcrumb`, `#open-filter`, `#panels-add-button`,
  45  |  * `#first-page-button`, etc.), `getByRole`, `getByPlaceholder`. Cada uso
  46  |  * fica marcado com `// REVISAR: aguardando data-test-id`.
  47  |  */
  48  | 
  49  | // Escape user-provided text antes de injetar em RegExp literal.
  50  | const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  51  | 
  52  | export class PaineisListPage {
  53  |   constructor(private readonly page: Page) {}
  54  | 
  55  |   // ---------- Navegação ----------
  56  | 
  57  |   /**
  58  |    * Acessa a listagem via UI: sidebar "Menu" → tab "Modos de uso" (default)
  59  |    * → tab "Painéis". Usado pelo TC1 que valida o caminho de navegação real.
  60  |    */
  61  |   async openByMenu(): Promise<void> {
  62  |     await this.openAdminContext();
  63  |     await this.clickMenuLink();
  64  |     await this.getModosDeUsoTab().waitFor();
  65  |     await this.getPaineisTab().click();
  66  |     await this.page.waitForURL(/tab=panels-tab/);
  67  |   }
  68  | 
  69  |   /**
  70  |    * Garante que a página está em contexto admin (sidebar com link "Menu"
  71  |    * presente). Necessário porque storageState sozinho não navega — testes
  72  |    * iniciam em about:blank.
  73  |    */
  74  |   async openAdminContext(): Promise<void> {
  75  |     if (!this.page.url().includes(`/o/${getOrgId()}/`)) {
  76  |       await this.page.goto(`/o/${getOrgId()}/dashboard`);
  77  |     }
  78  |   }
  79  | 
  80  |   /**
  81  |    * Clica no link "Menu" da sidebar e aguarda a navegação para `/use_modes`.
  82  |    * REVISAR: aguardando data-test-id no link "Menu" da sidebar.
  83  |    * Fluxo real (sidebar desktop, viewport 1280): o link "Menu" vive dentro
  84  |    * do submenu "Configurações" que é `display: none` até o primeiro click no
  85  |    * próprio item "Configurações". Sem expandir antes, `.click()` no link
  86  |    * Menu trava no actionability (elemento existe mas tem bbox 0x0).
  87  |    * Escopamos tudo a `#menu` (container desktop) — o DOM mobile duplica
  88  |    * `id="navigation-menu"` em `.mobile-nav` mas fica off-screen no viewport
  89  |    * de teste e roubaria o `.first()`.
  90  |    */
  91  |   async clickMenuLink(): Promise<void> {
> 92  |     await this.page.locator('#menu a[name="settings-main-menu"]').click();
      |                                                                   ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  93  |     await this.page.locator('#menu a#navigation-menu').click();
  94  |     await this.page.waitForURL(/\/use_modes/);
  95  |     await dismissCommonModals(this.page);
  96  |     // O React/Chakra pinta `aria-selected=true` na tab ativa em 2 tempos
  97  |     // (URL muda antes da re-renderização). Aguardar o atributo evita race
  98  |     // com asserções `.toHaveAttribute('aria-selected', 'true')` no spec.
  99  |     await this.page
  100 |       .getByRole('tab', { name: 'Modos de uso', selected: true })
  101 |       .waitFor({ timeout: 15_000 });
  102 |   }
  103 | 
  104 |   /**
  105 |    * Atalho: navega direto para a rota com `?tab=panels-tab`. Usado por
  106 |    * todos os TCs que não testam o caminho de navegação em si.
  107 |    *
  108 |    * Aguarda só a visibilidade da tab — não o `aria-selected=true`. Specs
  109 |    * que exigem o estado selected fazem assertion explícita; aqui o waitFor
  110 |    * sem `selected: true` evita timeout de 30s+ enquanto o React pinta o
  111 |    * atributo (data carrega em paralelo, ~2 tempos de render).
  112 |    */
  113 |   async goToList(): Promise<void> {
  114 |     await this.page.goto(`/o/${getOrgId()}/use_modes?tab=panels-tab`);
  115 |     // NPS Sofia + outros modais oportunistas — fechar antes de qualquer
  116 |     // ação na listagem. Sem isso, click no toggle/edit cai no overlay
  117 |     // do dialog (regra dura: NUNCA `force:true` pra resolver isso, sempre
  118 |     // dismiss explícito). Ver skill `fechar-modais-twygo`.
  119 |     await dismissCommonModals(this.page);
  120 |     await this.page.getByRole('tab', { name: 'Painéis' }).waitFor();
  121 |   }
  122 | 
  123 |   // ---------- Container / cabeçalho ----------
  124 | 
  125 |   getBreadcrumb(): Locator {
  126 |     // REVISAR: aguardando data-test-id "page-title-breadcrumb"; fallback usa
  127 |     // id estável "page-breadcrumb" (re-confirmado 2026-05-06).
  128 |     return this.page.locator('#page-breadcrumb');
  129 |   }
  130 | 
  131 |   getModosDeUsoTab(): Locator {
  132 |     // REVISAR: aguardando data-test-id "use-modes-tab-modos-de-uso"
  133 |     return this.page.getByRole('tab', { name: 'Modos de uso' });
  134 |   }
  135 | 
  136 |   getPaineisTab(): Locator {
  137 |     // REVISAR: aguardando data-test-id "use-modes-tab-paineis"
  138 |     return this.page.getByRole('tab', { name: 'Painéis' });
  139 |   }
  140 | 
  141 |   // ---------- Componentes obrigatórios da listagem (TC2) ----------
  142 | 
  143 |   getAddButton(): Locator {
  144 |     // REVISAR: aguardando data-test-id "paineis-list-add-button"; o markup
  145 |     // real é `<a href=".../panels/new"><button id="panels-add-button">Adicionar</button></a>`.
  146 |     // O `<a>` é a âncora estável para asserções de visibilidade/click; a
  147 |     // navegação é feita pelo `<a>` quando o `<button>` interno é acionado.
  148 |     return this.page.locator('a[href*="/panels/new"]');
  149 |   }
  150 | 
  151 |   /**
  152 |    * Mesmo botão "+ Adicionar", mas retorna o `<button id="panels-add-button">`
  153 |    * INTERNO (filho do `<a>`). É este o elemento que recebe foco por Tab/Shift+Tab
  154 |    * — o `<a>` wrapper não é focável diretamente. Usado pelo TC8 (acessibilidade
  155 |    * por teclado) para asserção `toBeFocused()`. REVISAR: aguardando
  156 |    * data-test-id "paineis-list-add-button-focusable".
  157 |    */
  158 |   getAddButtonFocusable(): Locator {
  159 |     return this.page.locator('#panels-add-button');
  160 |   }
  161 | 
  162 |   getFilterButton(): Locator {
  163 |     // REVISAR: aguardando data-test-id "paineis-list-filter-button";
  164 |     // fallback usa id estável "open-filter" — botão NOVO observado live,
  165 |     // não estava no XML.
  166 |     return this.page.locator('#open-filter');
  167 |   }
  168 | 
  169 |   getSearchInput(): Locator {
  170 |     // REVISAR: aguardando data-test-id "paineis-list-search-input";
  171 |     // placeholder real (re-confirmado 2026-05-06): "Pesquise por nome ou
  172 |     // descrição" — NÃO é "Pesquise aqui" como o XML insinuava.
  173 |     return this.page.getByPlaceholder('Pesquise por nome ou descrição');
  174 |   }
  175 | 
  176 |   // ---------- Empty state (org sem painéis) ----------
  177 | 
  178 |   getEmptyStateText(): Locator {
  179 |     // REVISAR: aguardando data-test-id "paineis-list-empty-state".
  180 |     // Usado apenas em envs com 0 painéis cadastrados — staging atual tem 30
  181 |     // painéis seedados, então este locator não resolve no estado normal.
  182 |     return this.page.getByText('Não há dados para exibir');
  183 |   }
  184 | 
  185 |   // ---------- Listagem em cards (default observado live) ----------
  186 | 
  187 |   /**
  188 |    * Locator que casa todos os botões "edit" dos cards — um por card. Ancora
  189 |    * estável usando o id `panels-{paineId}-edit-element-1-button-0` (id real
  190 |    * gerado pelo backend; o segmento `-edit-element-1-button-0` é constante).
  191 |    * REVISAR: aguardando data-test-id "paineis-list-card-{idx}".
  192 |    */
```