# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\layout-das-abas\toolbar-sticky-rolar.spec.ts >> Layout das abas >> Toolbar permanece fixa ao rolar a área de layout
- Location: projects\widgets\tests\features\layout-das-abas\toolbar-sticky-rolar.spec.ts:14:3

# Error details

```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://widgets.stage.twygoead.com/o/36988/panels/new", waiting until "load"

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
      - generic [ref=e297]: Add Panel
      - generic [ref=e305]:
        - generic [ref=e306]:
          - button "Voltar" [ref=e308] [cursor=pointer]:
            - img [ref=e310]
            - text: Voltar
          - heading "Adicionar painel" [level=2] [ref=e313]
        - generic [ref=e315]:
          - tablist [ref=e316]:
            - tab "Identificação" [selected] [ref=e317] [cursor=pointer]
            - tab "Layouts" [disabled] [ref=e318]
          - tabpanel "Identificação" [ref=e320]:
            - generic [ref=e321]:
              - generic [ref=e325]:
                - group [ref=e327]:
                  - generic [ref=e329]:
                    - generic [ref=e330]: Nome
                    - generic [ref=e331]: "*"
                  - textbox [ref=e333]
                - generic [ref=e335]:
                  - generic [ref=e338]: Descrição
                  - generic [ref=e340]:
                    - toolbar [ref=e341]:
                      - generic [ref=e342]:
                        - generic [ref=e343]:
                          - generic [ref=e345]:
                            - button [disabled]:
                              - img
                            - button [disabled]:
                              - img
                          - group [ref=e349]:
                            - radio "Parágrafo" [ref=e350] [cursor=pointer]:
                              - generic [ref=e351]: Parágrafo
                              - generic [ref=e352]:
                                - img: "true"
                          - generic [ref=e356]:
                            - button [ref=e357] [cursor=pointer]:
                              - img
                            - textbox [ref=e358]: "16"
                            - button [ref=e359] [cursor=pointer]:
                              - img
                          - generic [ref=e362]:
                            - group [ref=e363]:
                              - radio [ref=e364] [cursor=pointer]:
                                - img
                            - group [ref=e365]:
                              - radio [ref=e366] [cursor=pointer]:
                                - img
                            - group [ref=e367]:
                              - radio [ref=e368] [cursor=pointer]:
                                - img
                            - group [ref=e369]:
                              - radio [ref=e370] [cursor=pointer]:
                                - img
                            - group [ref=e371]:
                              - radio [ref=e372] [cursor=pointer]:
                                - img
                          - group [ref=e376]:
                            - radio [ref=e377] [cursor=pointer]:
                              - generic [ref=e378]:
                                - img
                              - generic [ref=e379]:
                                - img: "true"
                        - button "more_horiz" [ref=e380] [cursor=pointer]:
                          - generic [ref=e381]: more_horiz
                    - textbox [ref=e383]:
                      - generic [ref=e387]:
                        - button [ref=e389] [cursor=pointer]:
                          - generic:
                            - img
                        - button [ref=e390] [cursor=pointer]:
                          - button [ref=e391]:
                            - img [ref=e392]
                  - paragraph [ref=e403]: 0 / 500
                - group [ref=e405]:
                  - checkbox "Painel ativo" [checked] [ref=e407]
                  - generic [ref=e411]: Painel ativo
              - generic [ref=e412]:
                - button "Salvar" [ref=e413] [cursor=pointer]
                - button "Cancelar" [ref=e414] [cursor=pointer]
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
  - textbox [ref=e415]
```

# Test source

```ts
  1   | import { expect, type Locator, type Page } from '@playwright/test';
  2   | import { getOrgId } from '../../../src/utils/environment.js';
  3   | import { dismissCommonModals } from '../../../src/utils/modals.js';
  4   | 
  5   | /**
  6   |  * Page Object do formulário de criação/edição de Painel (módulo Widgets).
  7   |  *
  8   |  * URLs canônicas:
  9   |  * - Criação: `/o/{orgId}/panels/new`
  10  |  * - Edição: `/o/{orgId}/panels/{id}/edit` (com `?tab=layouts` para abrir Layouts).
  11  |  *
  12  |  * Estrutura observada ao vivo (2026-05-11 via planner, env `staging-widgets`):
  13  |  *
  14  |  * - Tela tem 2 tabs: **Identificação** (ativa por default) e **Layouts**.
  15  |  *   Layouts inicia desabilitada — só habilita após salvar a Identificação.
  16  |  * - Campo Nome*: `<input id="panel-form-name-input" maxLength="250">`. XML
  17  |  *   documenta 255 mas DOM limita em 250 (REVISAR).
  18  |  * - Campo Descrição: rich-text ProseMirror dentro do tabpanel "Identificação"
  19  |  *   (não é input simples). Contador mostra "X / 500".
  20  |  * - Botão Salvar (Identificação): `data-test-id="panel-form-save-button"`.
  21  |  * - Botão Cancelar (Identificação): `data-test-id="panel-form-cancel-button"`.
  22  |  * - Tab Layouts → renderiza navegação de abas + botão "Adicionar aba"
  23  |  *   (`data-test-id="tabs-navigation-add-button"`). Aba inicial "Nova aba" é
  24  |  *   criada automaticamente.
  25  |  * - Cada aba tem botões `Renomear` (lápis) e `Excluir` (lixeira) sem
  26  |  *   data-test-id — uso `getByRole('button', { name: 'Renomear'|'Excluir' })`
  27  |  *   escopado no grupo da aba. Excluir fica `[disabled]` quando há 1 aba só.
  28  |  * - Modal de Renomear aba: dialog Chakra com input "Nome da aba*" (maxLength=255).
  29  |  * - Modal de Adicionar nova aba: 2 steps.
  30  |  *   - Step 1 (seleção de tipo): botões `add-tab-type-modal-create-new-button`,
  31  |  *     `add-tab-type-modal-import-button`, `add-tab-type-modal-cancel-button`.
  32  |  *   - Step 2 (criar nova): inputs Nome e Categoria; botões
  33  |  *     `create-tab-modal-back-button`, `create-tab-modal-cancel-button`,
  34  |  *     `create-tab-modal-create-button` (este último disabled até preencher Nome).
  35  |  */
  36  | export class PainelFormPage {
  37  |   constructor(private readonly page: Page) {}
  38  | 
  39  |   // ---------- Navegação ----------
  40  | 
  41  |   async goToNew(): Promise<void> {
> 42  |     await this.page.goto(`/o/${getOrgId()}/panels/new`);
      |                     ^ TimeoutError: page.goto: Timeout 30000ms exceeded.
  43  |     await dismissCommonModals(this.page);
  44  |     await this.getIdentificacaoTab().waitFor();
  45  |   }
  46  | 
  47  |   async goToEdit(panelId: number, tab: 'identificacao' | 'layouts' = 'identificacao'): Promise<void> {
  48  |     const suffix = tab === 'layouts' ? '?tab=layouts' : '';
  49  |     await this.page.goto(`/o/${getOrgId()}/panels/${panelId}/edit${suffix}`);
  50  |     await dismissCommonModals(this.page);
  51  |     // App ignora `?tab=layouts` no load inicial — tab Identificação sempre
  52  |     // renderiza selected. Sem click explícito, `tabs-navigation-add-button`
  53  |     // e `widgets-grid-*` não montam. Validado live 2026-05-13 via Playwright MCP.
  54  |     if (tab === 'layouts') {
  55  |       const layoutsTab = this.getLayoutsTab();
  56  |       await layoutsTab.waitFor();
  57  |       const selected = await layoutsTab.getAttribute('aria-selected');
  58  |       if (selected !== 'true') {
  59  |         await layoutsTab.click();
  60  |       }
  61  |     }
  62  |   }
  63  | 
  64  |   // ---------- Aba Identificação ----------
  65  | 
  66  |   getIdentificacaoTab(): Locator {
  67  |     return this.page.getByRole('tab', { name: 'Identificação' });
  68  |   }
  69  | 
  70  |   getLayoutsTab(): Locator {
  71  |     return this.page.getByRole('tab', { name: 'Layouts' });
  72  |   }
  73  | 
  74  |   getNomeInput(): Locator {
  75  |     return this.page.locator('#panel-form-name-input');
  76  |   }
  77  | 
  78  |   /**
  79  |    * Campo Descrição é um ProseMirror rich-text. O contentEditable é o
  80  |    * `[contenteditable="true"]` dentro do tabpanel "Identificação".
  81  |    * REVISAR: aguardando data-test-id estável.
  82  |    */
  83  |   getDescricaoEditor(): Locator {
  84  |     return this.page
  85  |       .getByRole('tabpanel', { name: 'Identificação' })
  86  |       .locator('[contenteditable="true"]')
  87  |       .first();
  88  |   }
  89  | 
  90  |   getSaveButton(): Locator {
  91  |     return this.page.getByTestId('panel-form-save-button');
  92  |   }
  93  | 
  94  |   getCancelButton(): Locator {
  95  |     return this.page.getByTestId('panel-form-cancel-button');
  96  |   }
  97  | 
  98  |   /**
  99  |    * Preenche Nome + Descrição e salva, aguardando redirect para a tela de
  100 |    * edição do painel recém-criado (URL `/panels/{id}/edit`). Retorna o `id`
  101 |    * extraído da URL para uso em cleanup/assertions.
  102 |    */
  103 |   async createPanel(nome: string, descricao?: string): Promise<number> {
  104 |     await this.getNomeInput().fill(nome);
  105 |     if (descricao) {
  106 |       await this.getDescricaoEditor().fill(descricao);
  107 |     }
  108 |     await this.getSaveButton().click();
  109 |     // Save backend pode esticar >30s sob load paralelo; bump pra 60s evita
  110 |     // flakiness intermitente em rodadas full-suite (ver bug 32872141).
  111 |     await this.page.waitForURL(/\/panels\/\d+\/edit/, { timeout: 60_000 });
  112 |     const match = this.page.url().match(/\/panels\/(\d+)\/edit/);
  113 |     if (!match) throw new Error(`Não conseguiu extrair panelId da URL: ${this.page.url()}`);
  114 |     return Number(match[1]);
  115 |   }
  116 | 
  117 |   // ---------- Aba Layouts: navegação de abas ----------
  118 | 
  119 |   getAddTabButton(): Locator {
  120 |     return this.page.getByTestId('tabs-navigation-add-button');
  121 |   }
  122 | 
  123 |   /**
  124 |    * Localiza o "chip" de uma aba pelo seu nome dentro do tabpanel Layouts.
  125 |    * O nome é renderizado como `<p>` (paragraph role) na barra de abas. O
  126 |    * `.locator('..')` sobe pra raiz do chip pra escopo de Renomear/Excluir.
  127 |    */
  128 |   getTabChip(tabName: string): Locator {
  129 |     return this.page
  130 |       .getByRole('tabpanel', { name: 'Layouts' })
  131 |       .locator('xpath=.//p[normalize-space()=' + JSON.stringify(tabName) + ']/ancestor::*[self::div or self::li][1]');
  132 |   }
  133 | 
  134 |   getRenameTabButton(tabName: string): Locator {
  135 |     return this.getTabChip(tabName).getByRole('button', { name: 'Renomear' });
  136 |   }
  137 | 
  138 |   getDeleteTabButton(tabName: string): Locator {
  139 |     return this.getTabChip(tabName).getByRole('button', { name: 'Excluir' });
  140 |   }
  141 | 
  142 |   // ---------- Modal Renomear aba ----------
```