# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\base-de-conhecimento\tests\features\listagem-basica-de-repositorios\tc2-validar-colunas-obrigatorias.spec.ts >> Listagem básica de repositórios >> TC2 — Validar colunas obrigatórias da listagem
- Location: projects\base-de-conhecimento\tests\features\listagem-basica-de-repositorios\tc2-validar-colunas-obrigatorias.spec.ts:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('columnheader', { name: 'Categoria' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('columnheader', { name: 'Categoria' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Twygo" [ref=e4]:
        - img "Logo - Twygo" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/36675/dashboard
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
                  - /url: /o/36675/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/36675/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "workspace_premium Certificados" [ref=e39] [cursor=pointer]:
                  - /url: /o/36675/certificate_models
                  - generic [ref=e40]:
                    - generic [ref=e42]: workspace_premium
                    - generic [ref=e43]: Certificados
              - listitem [ref=e44]:
                - link "browse Modelos de conteúdo" [ref=e45] [cursor=pointer]:
                  - /url: /o/36675/content_models
                  - generic [ref=e46]:
                    - generic [ref=e48]: browse
                    - generic [ref=e49]: Modelos de conteúdo
              - listitem [ref=e50]:
                - link "folder_open Base de conhecimento" [ref=e51] [cursor=pointer]:
                  - /url: /o/36675/knowledge_repositories
                  - generic [ref=e52]:
                    - generic [ref=e54]: folder_open
                    - generic [ref=e55]: Base de conhecimento
          - listitem [ref=e56]:
            - link "book Biblioteca" [ref=e57] [cursor=pointer]:
              - /url: /o/36675/events/?tab=libraries
              - generic [ref=e58]:
                - generic [ref=e60]: book
                - generic [ref=e61]: Biblioteca
          - listitem [ref=e62]:
            - link "group Usuários" [ref=e63] [cursor=pointer]:
              - /url: /o/36675/users
              - generic [ref=e64]:
                - generic [ref=e66]: group
                - generic [ref=e67]: Usuários
          - listitem [ref=e68]:
            - link "work Empresas" [ref=e69] [cursor=pointer]:
              - /url: /o/36675/companies
              - generic [ref=e70]:
                - generic [ref=e72]: work
                - generic [ref=e73]: Empresas
          - listitem [ref=e74]:
            - generic [ref=e76]:
              - generic [ref=e79]: live_help
              - generic [ref=e80]: Questionários
            - list [ref=e81]:
              - listitem [ref=e82]:
                - link "edit_note Provas" [ref=e83] [cursor=pointer]:
                  - /url: /o/36675/exams
                  - generic [ref=e84]:
                    - generic [ref=e86]: edit_note
                    - generic [ref=e87]: Provas
              - listitem [ref=e88]:
                - link "poll Pesquisas" [ref=e89] [cursor=pointer]:
                  - /url: /o/36675/surveys
                  - generic [ref=e90]:
                    - generic [ref=e92]: poll
                    - generic [ref=e93]: Pesquisas
              - listitem [ref=e94]:
                - link "fact_check Avaliações" [ref=e95] [cursor=pointer]:
                  - /url: /o/36675/assessments
                  - generic [ref=e96]:
                    - generic [ref=e98]: fact_check
                    - generic [ref=e99]: Avaliações
          - listitem [ref=e100]:
            - link "groups Comunidades" [ref=e101] [cursor=pointer]:
              - /url: /o/36675/feed
              - generic [ref=e102]:
                - generic [ref=e104]: groups
                - generic [ref=e105]: Comunidades
          - listitem [ref=e106]:
            - generic [ref=e108]:
              - generic [ref=e111]: psychology
              - generic [ref=e112]:
                - text: Skills
                - generic [ref=e113]: BETA
            - list [ref=e114]:
              - listitem [ref=e115]:
                - link "lan Organograma" [ref=e116] [cursor=pointer]:
                  - /url: /o/36675/organization_chart
                  - generic [ref=e117]:
                    - generic [ref=e119]: lan
                    - generic [ref=e120]: Organograma
              - listitem [ref=e121]:
                - link "badge Funções de negócio" [ref=e122] [cursor=pointer]:
                  - /url: /o/36675/roles
                  - generic [ref=e123]:
                    - generic [ref=e125]: badge
                    - generic [ref=e126]: Funções de negócio
              - listitem [ref=e127]:
                - link "award_star Competências" [ref=e128] [cursor=pointer]:
                  - /url: /o/36675/organization_chart_competencies
                  - generic [ref=e129]:
                    - generic [ref=e131]: award_star
                    - generic [ref=e132]: Competências
          - listitem [ref=e133]:
            - generic [ref=e135]:
              - generic [ref=e138]: monitoring
              - generic [ref=e139]:
                - text: Planos e Metas
                - generic [ref=e140]: BETA
            - list [ref=e141]:
              - listitem [ref=e142]:
                - link "track_changes PDI" [ref=e143] [cursor=pointer]:
                  - /url: /o/36675/admin/pdis
                  - generic [ref=e144]:
                    - generic [ref=e146]: track_changes
                    - generic [ref=e147]: PDI
          - listitem [ref=e148]:
            - generic [ref=e150]:
              - generic [ref=e153]: groups
              - generic [ref=e154]:
                - text: Gestão de Time
                - generic [ref=e155]: BETA
            - list [ref=e156]:
              - listitem [ref=e157]:
                - link "trending_up Desenvolvimento" [ref=e158] [cursor=pointer]:
                  - /url: /o/36675/cycles
                  - generic [ref=e159]:
                    - generic [ref=e161]: trending_up
                    - generic [ref=e162]: Desenvolvimento
              - listitem [ref=e163]:
                - link "feedback Feedbacks e anotações" [ref=e164] [cursor=pointer]:
                  - /url: /o/36675/feedback_log
                  - generic [ref=e165]:
                    - generic [ref=e167]: feedback
                    - generic [ref=e168]: Feedbacks e anotações
      - generic [ref=e169]: Twygo
      - list [ref=e170]:
        - listitem [ref=e171]:
          - generic [ref=e173]:
            - generic [ref=e175]: f
            - generic [ref=e176]: Configurações
          - list [ref=e177]:
            - listitem [ref=e178]:
              - link "e Organização" [ref=e179] [cursor=pointer]:
                - /url: /o/36675/edit
                - generic [ref=e180]:
                  - generic [ref=e182]: e
                  - generic [ref=e183]: Organização
            - listitem [ref=e184]:
              - link " Menu" [ref=e185] [cursor=pointer]:
                - /url: /o/36675/use_modes
                - generic [ref=e186]:
                  - generic [ref=e188]: 
                  - generic [ref=e189]: Menu
            - listitem [ref=e190]:
              - link "electrical_services Integrações" [ref=e191] [cursor=pointer]:
                - /url: /o/36675/integrations
                - generic [ref=e192]:
                  - generic [ref=e194]: electrical_services
                  - generic [ref=e195]: Integrações
            - listitem [ref=e196]:
              - link "flash_auto Piloto automático" [ref=e197] [cursor=pointer]:
                - /url: /o/36675/autopilots
                - generic [ref=e198]:
                  - generic [ref=e200]: flash_auto
                  - generic [ref=e201]: Piloto automático
            - listitem [ref=e202]:
              - link " Regras do Jogo" [ref=e203] [cursor=pointer]:
                - /url: /o/36675/game_rules
                - generic [ref=e204]:
                  - generic [ref=e206]: 
                  - generic [ref=e207]: Regras do Jogo
            - listitem [ref=e208]:
              - link " Comunicação" [ref=e209] [cursor=pointer]:
                - /url: /o/36675/communication
                - generic [ref=e210]:
                  - generic [ref=e212]: 
                  - generic [ref=e213]: Comunicação
            - listitem [ref=e214]:
              - link "sell Cobrança de inscrição" [ref=e215] [cursor=pointer]:
                - /url: /o/36675/payments
                - generic [ref=e216]:
                  - generic [ref=e218]: sell
                  - generic [ref=e219]: Cobrança de inscrição
            - listitem [ref=e220]:
              - link "credit_card Plano e assinatura" [ref=e221] [cursor=pointer]:
                - /url: /o/36675/subscription_plans
                - generic [ref=e222]:
                  - generic [ref=e224]: credit_card
                  - generic [ref=e225]: Plano e assinatura
            - text: s
            - listitem [ref=e226]:
              - link " Segurança NOVO" [ref=e227] [cursor=pointer]:
                - /url: /o/36675/security
                - generic [ref=e228]:
                  - generic [ref=e230]: 
                  - generic [ref=e231]: Segurança NOVO
            - listitem [ref=e232]:
              - link "smart_toy Controle de IA BETA" [ref=e233] [cursor=pointer]:
                - /url: /o/36675/ai_consumption_analysis
                - generic [ref=e234]:
                  - generic [ref=e236]: smart_toy
                  - generic [ref=e237]: Controle de IA BETA
            - listitem [ref=e238]:
              - link "palette Aparência" [ref=e239] [cursor=pointer]:
                - /url: /o/36675/appearance
                - generic [ref=e240]:
                  - generic [ref=e242]: palette
                  - generic [ref=e243]: Aparência
    - generic [ref=e246]:
      - generic [ref=e247]:
        - img [ref=e248]
        - text: Dante de Oliveira Tavares
      - img [ref=e250]
  - text: "0"
  - generic [ref=e253]:
    - generic "Logo - Twygo" [ref=e255]:
      - link "Twygo" [ref=e257] [cursor=pointer]:
        - /url: /o/36675/dashboard
    - generic [ref=e261]:
      - button "Twygo Academy" [ref=e265] [cursor=pointer]:
        - generic [ref=e266]: school
      - link "Open chat" [ref=e270] [cursor=pointer]:
        - /url: /o/36675/chats
        - button "Open chat" [ref=e271]:
          - img [ref=e272]
      - button "Users" [ref=e279] [cursor=pointer]:
        - img [ref=e280]
      - generic [ref=e283]:
        - link "6811621 - Dante de Oliveira Tavares" [ref=e284] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e285]: Dante de Oliveira Tavares
      - button "Administrador G" [ref=e286] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e287]: G
    - text: M * * M * *
  - generic [ref=e288]:
    - alert [ref=e293]:
      - generic [ref=e294]:
        - img [ref=e296]
        - generic [ref=e298]: Aviso de manutenção programada. A plataforma ficará indisponível no sábado (25/07/26) das 16:00 horas até às 23:59 horas, para a realização de melhorias, atualizações de segurança e otimização do sistema.
      - button "Close" [ref=e299] [cursor=pointer]:
        - img [ref=e300]
    - generic [ref=e303]:
      - generic [ref=e304]:
        - button "Expandir ou retrair menu" [ref=e305] [cursor=pointer]:
          - generic [ref=e306]: menu_open
        - generic [ref=e307]:
          - list [ref=e308]:
            - list [ref=e309]:
              - listitem [ref=e310] [cursor=pointer]:
                - link "leaderboard Dashboard" [ref=e311]:
                  - /url: /o/36675/dashboard
                  - generic [ref=e312]:
                    - generic [ref=e314]: leaderboard
                    - generic [ref=e315]: Dashboard
              - listitem [ref=e316] [cursor=pointer]:
                - generic [ref=e318]:
                  - generic [ref=e321]: school
                  - generic [ref=e322]: Aprendizagem
                  - generic [ref=e324]: G
                - list [ref=e325]:
                  - listitem [ref=e326]:
                    - link "format_list_bulleted_add Conteúdos" [ref=e327]:
                      - /url: /o/36675/events?tab=events
                      - generic [ref=e328]:
                        - generic [ref=e330]: format_list_bulleted_add
                        - generic [ref=e331]: Conteúdos
                  - listitem [ref=e332]:
                    - link "send Compartilhamentos" [ref=e333]:
                      - /url: /o/36675/shared_events
                      - generic [ref=e334]:
                        - generic [ref=e336]: send
                        - generic [ref=e337]: Compartilhamentos
                  - listitem [ref=e338]:
                    - link "workspace_premium Certificados" [ref=e339]:
                      - /url: /o/36675/certificate_models
                      - generic [ref=e340]:
                        - generic [ref=e342]: workspace_premium
                        - generic [ref=e343]: Certificados
                  - listitem [ref=e344]:
                    - link "browse Modelos de conteúdo" [ref=e345]:
                      - /url: /o/36675/content_models
                      - generic [ref=e346]:
                        - generic [ref=e348]: browse
                        - generic [ref=e349]: Modelos de conteúdo
                  - listitem [ref=e350]:
                    - link "folder_open Base de conhecimento" [ref=e351]:
                      - /url: /o/36675/knowledge_repositories
                      - generic [ref=e352]:
                        - generic [ref=e354]: folder_open
                        - generic [ref=e355]: Base de conhecimento
              - listitem [ref=e356] [cursor=pointer]:
                - link "book Biblioteca" [ref=e357]:
                  - /url: /o/36675/events/?tab=libraries
                  - generic [ref=e358]:
                    - generic [ref=e360]: book
                    - generic [ref=e361]: Biblioteca
              - listitem [ref=e362] [cursor=pointer]:
                - link "group Usuários" [ref=e363]:
                  - /url: /o/36675/users
                  - generic [ref=e364]:
                    - generic [ref=e366]: group
                    - generic [ref=e367]: Usuários
              - listitem [ref=e368] [cursor=pointer]:
                - link "work Empresas" [ref=e369]:
                  - /url: /o/36675/companies
                  - generic [ref=e370]:
                    - generic [ref=e372]: work
                    - generic [ref=e373]: Empresas
              - listitem [ref=e374] [cursor=pointer]:
                - generic [ref=e376]:
                  - generic [ref=e379]: live_help
                  - generic [ref=e380]: Questionários
                  - generic [ref=e382]: G
              - listitem [ref=e383] [cursor=pointer]:
                - link "groups Comunidades" [ref=e384]:
                  - /url: /o/36675/feed
                  - generic [ref=e385]:
                    - generic [ref=e387]: groups
                    - generic [ref=e388]: Comunidades
              - listitem [ref=e389] [cursor=pointer]:
                - generic [ref=e391]:
                  - generic [ref=e394]: psychology
                  - generic [ref=e395]:
                    - text: Skills
                    - generic [ref=e396]: BETA
                  - generic [ref=e398]: G
              - listitem [ref=e399] [cursor=pointer]:
                - generic [ref=e401]:
                  - generic [ref=e404]: monitoring
                  - generic [ref=e405]:
                    - text: Planos e Metas
                    - generic [ref=e406]: BETA
                  - generic [ref=e408]: G
              - listitem [ref=e409] [cursor=pointer]:
                - generic [ref=e411]:
                  - generic [ref=e414]: groups
                  - generic [ref=e415]:
                    - text: Gestão de Time
                    - generic [ref=e416]: BETA
                  - generic [ref=e418]: G
          - generic [ref=e420]: Twygo
          - list [ref=e421]:
            - listitem [ref=e422] [cursor=pointer]:
              - generic [ref=e424]:
                - generic [ref=e426]: f
                - generic [ref=e427]: Configurações
                - generic [ref=e429]: G
              - text: e    s 
      - generic [ref=e431]:
        - generic [ref=e434]: Base de conhecimento
        - generic [ref=e441]:
          - heading "Base de conhecimento" [level=1] [ref=e442]
          - generic [ref=e443]:
            - generic [ref=e444]:
              - link "Adicionar" [ref=e445] [cursor=pointer]:
                - /url: /o/36675/knowledge_repositories/new
                - button "Adicionar" [ref=e446]:
                  - img [ref=e448]
                  - text: Adicionar
              - button "ios_share Extrair dados" [ref=e450] [cursor=pointer]:
                - generic [ref=e451]: ios_share
                - text: Extrair dados
              - generic [ref=e452]:
                - generic [ref=e453]:
                  - img [ref=e455]
                  - textbox "Pesquise por nome ou descrição" [ref=e457]
                - button [ref=e458] [cursor=pointer]:
                  - generic [ref=e460]: filter_alt
                - button "Limpar filtro" [ref=e461] [cursor=pointer]:
                  - generic [ref=e463]: filter_alt_off
                  - generic [ref=e464]: Limpar filtro
            - table [ref=e466]:
              - rowgroup [ref=e467]:
                - row "Nome Descrição Bases sem fontes Bases sem recursos" [ref=e468]:
                  - columnheader "Nome" [ref=e469] [cursor=pointer]:
                    - generic [ref=e472]:
                      - text: Nome
                      - img [ref=e473]
                  - columnheader "Descrição" [ref=e475] [cursor=pointer]:
                    - generic [ref=e478]:
                      - text: Descrição
                      - img [ref=e479]
                  - columnheader "Bases sem fontes" [ref=e481] [cursor=pointer]:
                    - generic [ref=e484]:
                      - text: Bases sem fontes
                      - img [ref=e485]
                  - columnheader "Bases sem recursos" [ref=e487] [cursor=pointer]:
                    - generic [ref=e490]:
                      - text: Bases sem recursos
                      - img [ref=e491]
                  - columnheader [ref=e493]
              - rowgroup [ref=e494]:
                - row [ref=e495]:
                  - cell "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" [ref=e496]:
                    - paragraph [ref=e497]: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  - cell [ref=e498]:
                    - paragraph [ref=e499]: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  - cell "✓" [ref=e500]:
                    - paragraph [ref=e501]: ✓
                  - cell "✓" [ref=e502]:
                    - paragraph [ref=e503]: ✓
                  - cell "edit delete" [ref=e504]:
                    - generic [ref=e506]:
                      - generic [ref=e509] [cursor=pointer]: edit
                      - generic [ref=e512] [cursor=pointer]: delete
                - row "jiu jitsu asd — ✓ edit delete" [ref=e513]:
                  - cell "jiu jitsu" [ref=e514]:
                    - paragraph [ref=e515]: jiu jitsu
                  - cell "asd" [ref=e516]:
                    - paragraph [ref=e517]: asd
                  - cell "—" [ref=e518]:
                    - paragraph [ref=e519]: —
                  - cell "✓" [ref=e520]:
                    - paragraph [ref=e521]: ✓
                  - cell "edit delete" [ref=e522]:
                    - generic [ref=e524]:
                      - generic [ref=e527] [cursor=pointer]: edit
                      - generic [ref=e530] [cursor=pointer]: delete
                - row "tetete tetete ✓ ✓ edit delete" [ref=e531]:
                  - cell "tetete" [ref=e532]:
                    - paragraph [ref=e533]: tetete
                  - cell "tetete" [ref=e534]:
                    - paragraph [ref=e535]: tetete
                  - cell "✓" [ref=e536]:
                    - paragraph [ref=e537]: ✓
                  - cell "✓" [ref=e538]:
                    - paragraph [ref=e539]: ✓
                  - cell "edit delete" [ref=e540]:
                    - generic [ref=e542]:
                      - generic [ref=e545] [cursor=pointer]: edit
                      - generic [ref=e548] [cursor=pointer]: delete
                - row "TESTE_AUTOMACAO_BUGS_BC Descrição atualizada pela automação — teste de loading infinito — — edit delete" [ref=e549]:
                  - cell "TESTE_AUTOMACAO_BUGS_BC" [ref=e550]:
                    - paragraph [ref=e551]: TESTE_AUTOMACAO_BUGS_BC
                  - cell "Descrição atualizada pela automação — teste de loading infinito" [ref=e552]:
                    - paragraph [ref=e553]: Descrição atualizada pela automação — teste de loading infinito
                  - cell "—" [ref=e554]:
                    - paragraph [ref=e555]: —
                  - cell "—" [ref=e556]:
                    - paragraph [ref=e557]: —
                  - cell "edit delete" [ref=e558]:
                    - generic [ref=e560]:
                      - generic [ref=e563] [cursor=pointer]: edit
                      - generic [ref=e566] [cursor=pointer]: delete
            - generic [ref=e568]:
              - generic [ref=e569]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e570]:
                  - generic [ref=e571]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e572]:
                  - generic [ref=e573]: chevron_left
                - button "1" [ref=e574] [cursor=pointer]
                - button "chevron_right" [disabled] [ref=e575]:
                  - generic [ref=e576]: chevron_right
              - generic [ref=e577]:
                - combobox [ref=e578]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
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
  1  | // spec: projects/base-de-conhecimento/specs/listagem-basica-de-repositorios-plan.md
  2  | // seed: tests/seed.spec.ts
  3  | 
  4  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  5  | import * as allure from 'allure-js-commons';
  6  | import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
  7  | import { tc2Data as data } from './tc2-validar-colunas-obrigatorias.data.js';
  8  | 
  9  | test.describe('Listagem básica de repositórios', () => {
  10 |   test('TC2 — Validar colunas obrigatórias da listagem', async ({ page }) => {
  11 |     await allure.epic('Twygo - Base de Conhecimento');
  12 |     await allure.feature('Listagem básica de repositórios');
  13 |     await allure.story('TC2 — Validar colunas obrigatórias da listagem');
  14 |     await allure.severity('critical');
  15 | 
  16 |     const listPage = new KnowledgeRepositoryListPage(page);
  17 | 
  18 |     // 1. Navegar diretamente para a listagem de repositórios
  19 |     await allure.step('1. Navegar para /o/{orgId}/knowledge_repositories e verificar container', async () => {
  20 |       await listPage.goToList();
  21 |       await expect(page).toHaveURL(/knowledge_repositories/);
  22 |       await expect(listPage.getListContainer()).toBeVisible();
  23 |     });
  24 | 
  25 |     // 2. Verificar presença das colunas obrigatórias
  26 |     await allure.step('2. Verificar colunas obrigatórias: Nome, Descrição, Categoria, Classificação', async () => {
  27 |       for (const coluna of data.colunasObrigatorias) {
  28 |         await expect(
  29 |           page.getByRole('columnheader', { name: coluna }),
> 30 |         ).toBeVisible();
     |           ^ Error: expect(locator).toBeVisible() failed
  31 |       }
  32 |     });
  33 | 
  34 |     // Validação de botões Editar/Excluir por linha NÃO faz parte do escopo
  35 |     // primário deste TC (que valida só as colunas). Botões são DIVs com ids
  36 |     // dinâmicos (#knowledge_repositories-{id}-edit-element-1-button-0) — sua
  37 |     // presença é verificada implicitamente pela API REST do POM (cleanup).
  38 |     // Mantido sem step 3: TC verde valida exatamente o que o MD pede.
  39 |   });
  40 | });
  41 | 
```