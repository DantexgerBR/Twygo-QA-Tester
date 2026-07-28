# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\base-de-conhecimento\tests\features\listagem-basica-de-repositorios\tc4-validar-empty-state.spec.ts >> Listagem básica de repositórios >> TC4 — Validar empty state quando não há repositórios
- Location: projects\base-de-conhecimento\tests\features\listagem-basica-de-repositorios\tc4-validar-empty-state.spec.ts:44:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Não há dados para exibir')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Não há dados para exibir')

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
                - link "workspace_premium Certificados" [ref=e33] [cursor=pointer]:
                  - /url: /o/36675/certificate_models
                  - generic [ref=e34]:
                    - generic [ref=e36]: workspace_premium
                    - generic [ref=e37]: Certificados
              - listitem [ref=e38]:
                - link "browse Modelos de conteúdo" [ref=e39] [cursor=pointer]:
                  - /url: /o/36675/content_models
                  - generic [ref=e40]:
                    - generic [ref=e42]: browse
                    - generic [ref=e43]: Modelos de conteúdo
              - listitem [ref=e44]:
                - link "folder_open Base de conhecimento" [ref=e45] [cursor=pointer]:
                  - /url: /o/36675/knowledge_repositories
                  - generic [ref=e46]:
                    - generic [ref=e48]: folder_open
                    - generic [ref=e49]: Base de conhecimento
          - listitem [ref=e50]:
            - link "book Biblioteca" [ref=e51] [cursor=pointer]:
              - /url: /o/36675/events/?tab=libraries
              - generic [ref=e52]:
                - generic [ref=e54]: book
                - generic [ref=e55]: Biblioteca
          - listitem [ref=e56]:
            - link "group Usuários" [ref=e57] [cursor=pointer]:
              - /url: /o/36675/users
              - generic [ref=e58]:
                - generic [ref=e60]: group
                - generic [ref=e61]: Usuários
          - listitem [ref=e62]:
            - link "work Empresas" [ref=e63] [cursor=pointer]:
              - /url: /o/36675/companies
              - generic [ref=e64]:
                - generic [ref=e66]: work
                - generic [ref=e67]: Empresas
          - listitem [ref=e68]:
            - generic [ref=e70]:
              - generic [ref=e73]: live_help
              - generic [ref=e74]: Questionários
            - list [ref=e75]:
              - listitem [ref=e76]:
                - link "edit_note Provas" [ref=e77] [cursor=pointer]:
                  - /url: /o/36675/exams
                  - generic [ref=e78]:
                    - generic [ref=e80]: edit_note
                    - generic [ref=e81]: Provas
              - listitem [ref=e82]:
                - link "poll Pesquisas" [ref=e83] [cursor=pointer]:
                  - /url: /o/36675/surveys
                  - generic [ref=e84]:
                    - generic [ref=e86]: poll
                    - generic [ref=e87]: Pesquisas
              - listitem [ref=e88]:
                - link "fact_check Avaliações" [ref=e89] [cursor=pointer]:
                  - /url: /o/36675/assessments
                  - generic [ref=e90]:
                    - generic [ref=e92]: fact_check
                    - generic [ref=e93]: Avaliações
          - listitem [ref=e94]:
            - link "groups Comunidades" [ref=e95] [cursor=pointer]:
              - /url: /o/36675/feed
              - generic [ref=e96]:
                - generic [ref=e98]: groups
                - generic [ref=e99]: Comunidades
          - listitem [ref=e100]:
            - generic [ref=e102]:
              - generic [ref=e105]: psychology
              - generic [ref=e106]:
                - text: Skills
                - generic [ref=e107]: BETA
            - list [ref=e108]:
              - listitem [ref=e109]:
                - link "lan Organograma" [ref=e110] [cursor=pointer]:
                  - /url: /o/36675/organization_chart
                  - generic [ref=e111]:
                    - generic [ref=e113]: lan
                    - generic [ref=e114]: Organograma
              - listitem [ref=e115]:
                - link "badge Funções de negócio" [ref=e116] [cursor=pointer]:
                  - /url: /o/36675/roles
                  - generic [ref=e117]:
                    - generic [ref=e119]: badge
                    - generic [ref=e120]: Funções de negócio
              - listitem [ref=e121]:
                - link "award_star Competências" [ref=e122] [cursor=pointer]:
                  - /url: /o/36675/organization_chart_competencies
                  - generic [ref=e123]:
                    - generic [ref=e125]: award_star
                    - generic [ref=e126]: Competências
          - listitem [ref=e127]:
            - generic [ref=e129]:
              - generic [ref=e132]: monitoring
              - generic [ref=e133]:
                - text: Planos e Metas
                - generic [ref=e134]: BETA
            - list [ref=e135]:
              - listitem [ref=e136]:
                - link "track_changes PDI" [ref=e137] [cursor=pointer]:
                  - /url: /o/36675/admin/pdis
                  - generic [ref=e138]:
                    - generic [ref=e140]: track_changes
                    - generic [ref=e141]: PDI
          - listitem [ref=e142]:
            - generic [ref=e144]:
              - generic [ref=e147]: groups
              - generic [ref=e148]:
                - text: Gestão de Time
                - generic [ref=e149]: BETA
            - list [ref=e150]:
              - listitem [ref=e151]:
                - link "trending_up Desenvolvimento" [ref=e152] [cursor=pointer]:
                  - /url: /o/36675/cycles
                  - generic [ref=e153]:
                    - generic [ref=e155]: trending_up
                    - generic [ref=e156]: Desenvolvimento
              - listitem [ref=e157]:
                - link "feedback Feedbacks e anotações" [ref=e158] [cursor=pointer]:
                  - /url: /o/36675/feedback_log
                  - generic [ref=e159]:
                    - generic [ref=e161]: feedback
                    - generic [ref=e162]: Feedbacks e anotações
      - generic [ref=e163]: Twygo
      - list [ref=e164]:
        - listitem [ref=e165]:
          - generic [ref=e167]:
            - generic [ref=e169]: f
            - generic [ref=e170]: Configurações
          - list [ref=e171]:
            - listitem [ref=e172]:
              - link "e Organização" [ref=e173] [cursor=pointer]:
                - /url: /o/36675/edit
                - generic [ref=e174]:
                  - generic [ref=e176]: e
                  - generic [ref=e177]: Organização
            - listitem [ref=e178]:
              - link " Menu" [ref=e179] [cursor=pointer]:
                - /url: /o/36675/use_modes
                - generic [ref=e180]:
                  - generic [ref=e182]: 
                  - generic [ref=e183]: Menu
            - listitem [ref=e184]:
              - link "electrical_services Integrações" [ref=e185] [cursor=pointer]:
                - /url: /o/36675/integrations
                - generic [ref=e186]:
                  - generic [ref=e188]: electrical_services
                  - generic [ref=e189]: Integrações
            - listitem [ref=e190]:
              - link "flash_auto Piloto automático" [ref=e191] [cursor=pointer]:
                - /url: /o/36675/autopilots
                - generic [ref=e192]:
                  - generic [ref=e194]: flash_auto
                  - generic [ref=e195]: Piloto automático
            - listitem [ref=e196]:
              - link " Regras do Jogo" [ref=e197] [cursor=pointer]:
                - /url: /o/36675/game_rules
                - generic [ref=e198]:
                  - generic [ref=e200]: 
                  - generic [ref=e201]: Regras do Jogo
            - listitem [ref=e202]:
              - link " Comunicação" [ref=e203] [cursor=pointer]:
                - /url: /o/36675/communication
                - generic [ref=e204]:
                  - generic [ref=e206]: 
                  - generic [ref=e207]: Comunicação
            - listitem [ref=e208]:
              - link "sell Cobrança de inscrição" [ref=e209] [cursor=pointer]:
                - /url: /o/36675/payments
                - generic [ref=e210]:
                  - generic [ref=e212]: sell
                  - generic [ref=e213]: Cobrança de inscrição
            - text: s
            - listitem [ref=e214]:
              - link "other_houses Ambientes adicionais" [ref=e215] [cursor=pointer]:
                - /url: /o/36675/additional_environments
                - generic [ref=e216]:
                  - generic [ref=e218]: other_houses
                  - generic [ref=e219]: Ambientes adicionais
            - listitem [ref=e220]:
              - link " Segurança NOVO" [ref=e221] [cursor=pointer]:
                - /url: /o/36675/security
                - generic [ref=e222]:
                  - generic [ref=e224]: 
                  - generic [ref=e225]: Segurança NOVO
            - listitem [ref=e226]:
              - link "smart_toy Controle de IA BETA" [ref=e227] [cursor=pointer]:
                - /url: /o/36675/ai_consumption_analysis
                - generic [ref=e228]:
                  - generic [ref=e230]: smart_toy
                  - generic [ref=e231]: Controle de IA BETA
            - listitem [ref=e232]:
              - link "palette Aparência" [ref=e233] [cursor=pointer]:
                - /url: /o/36675/appearance
                - generic [ref=e234]:
                  - generic [ref=e236]: palette
                  - generic [ref=e237]: Aparência
    - generic [ref=e240]:
      - generic [ref=e241]:
        - img [ref=e242]
        - text: Dante de Oliveira Tavares
      - img [ref=e244]
  - text: "0"
  - generic [ref=e247]:
    - generic "Logo - Twygo" [ref=e249]:
      - link "Twygo" [ref=e251] [cursor=pointer]:
        - /url: /o/36675/dashboard
    - generic [ref=e255]:
      - button "Twygo Academy" [ref=e259] [cursor=pointer]:
        - generic [ref=e260]: school
      - link "Open chat" [ref=e264] [cursor=pointer]:
        - /url: /o/36675/chats
        - button "Open chat" [ref=e265]:
          - img [ref=e266]
      - button "Users" [ref=e273] [cursor=pointer]:
        - img [ref=e274]
      - generic [ref=e277]:
        - link "6811621 - Dante de Oliveira Tavares" [ref=e278] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e279]: Dante de Oliveira Tavares
      - button "Administrador G" [ref=e280] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e281]: G
    - text: M * * M * *
  - generic [ref=e282]:
    - alert [ref=e287]:
      - generic [ref=e288]:
        - img [ref=e290]
        - generic [ref=e292]: Aviso de manutenção programada. A plataforma ficará indisponível no sábado (25/07/26) das 16:00 horas até às 23:59 horas, para a realização de melhorias, atualizações de segurança e otimização do sistema.
      - button "Close" [ref=e293] [cursor=pointer]:
        - img [ref=e294]
    - generic [ref=e297]:
      - generic [ref=e298]:
        - button "Expandir ou retrair menu" [ref=e299] [cursor=pointer]:
          - generic [ref=e300]: menu_open
        - generic [ref=e301]:
          - list [ref=e302]:
            - list [ref=e303]:
              - listitem [ref=e304] [cursor=pointer]:
                - link "leaderboard Dashboard" [ref=e305]:
                  - /url: /o/36675/dashboard
                  - generic [ref=e306]:
                    - generic [ref=e308]: leaderboard
                    - generic [ref=e309]: Dashboard
              - listitem [ref=e310] [cursor=pointer]:
                - generic [ref=e312]:
                  - generic [ref=e315]: school
                  - generic [ref=e316]: Aprendizagem
                  - generic [ref=e318]: G
                - list [ref=e319]:
                  - listitem [ref=e320]:
                    - link "format_list_bulleted_add Conteúdos" [ref=e321]:
                      - /url: /o/36675/events?tab=events
                      - generic [ref=e322]:
                        - generic [ref=e324]: format_list_bulleted_add
                        - generic [ref=e325]: Conteúdos
                  - listitem [ref=e326]:
                    - link "workspace_premium Certificados" [ref=e327]:
                      - /url: /o/36675/certificate_models
                      - generic [ref=e328]:
                        - generic [ref=e330]: workspace_premium
                        - generic [ref=e331]: Certificados
                  - listitem [ref=e332]:
                    - link "browse Modelos de conteúdo" [ref=e333]:
                      - /url: /o/36675/content_models
                      - generic [ref=e334]:
                        - generic [ref=e336]: browse
                        - generic [ref=e337]: Modelos de conteúdo
                  - listitem [ref=e338]:
                    - link "folder_open Base de conhecimento" [ref=e339]:
                      - /url: /o/36675/knowledge_repositories
                      - generic [ref=e340]:
                        - generic [ref=e342]: folder_open
                        - generic [ref=e343]: Base de conhecimento
              - listitem [ref=e344] [cursor=pointer]:
                - link "book Biblioteca" [ref=e345]:
                  - /url: /o/36675/events/?tab=libraries
                  - generic [ref=e346]:
                    - generic [ref=e348]: book
                    - generic [ref=e349]: Biblioteca
              - listitem [ref=e350] [cursor=pointer]:
                - link "group Usuários" [ref=e351]:
                  - /url: /o/36675/users
                  - generic [ref=e352]:
                    - generic [ref=e354]: group
                    - generic [ref=e355]: Usuários
              - listitem [ref=e356] [cursor=pointer]:
                - link "work Empresas" [ref=e357]:
                  - /url: /o/36675/companies
                  - generic [ref=e358]:
                    - generic [ref=e360]: work
                    - generic [ref=e361]: Empresas
              - listitem [ref=e362] [cursor=pointer]:
                - generic [ref=e364]:
                  - generic [ref=e367]: live_help
                  - generic [ref=e368]: Questionários
                  - generic [ref=e370]: G
              - listitem [ref=e371] [cursor=pointer]:
                - link "groups Comunidades" [ref=e372]:
                  - /url: /o/36675/feed
                  - generic [ref=e373]:
                    - generic [ref=e375]: groups
                    - generic [ref=e376]: Comunidades
              - listitem [ref=e377] [cursor=pointer]:
                - generic [ref=e379]:
                  - generic [ref=e382]: psychology
                  - generic [ref=e383]:
                    - text: Skills
                    - generic [ref=e384]: BETA
                  - generic [ref=e386]: G
              - listitem [ref=e387] [cursor=pointer]:
                - generic [ref=e389]:
                  - generic [ref=e392]: monitoring
                  - generic [ref=e393]:
                    - text: Planos e Metas
                    - generic [ref=e394]: BETA
                  - generic [ref=e396]: G
              - listitem [ref=e397] [cursor=pointer]:
                - generic [ref=e399]:
                  - generic [ref=e402]: groups
                  - generic [ref=e403]:
                    - text: Gestão de Time
                    - generic [ref=e404]: BETA
                  - generic [ref=e406]: G
          - generic [ref=e408]: Twygo
          - list [ref=e409]:
            - listitem [ref=e410] [cursor=pointer]:
              - generic [ref=e412]:
                - generic [ref=e414]: f
                - generic [ref=e415]: Configurações
                - generic [ref=e417]: G
              - text: e    s 
      - generic [ref=e419]:
        - generic [ref=e422]: Base de conhecimento
        - generic [ref=e429]:
          - heading "Base de conhecimento" [level=1] [ref=e430]
          - generic [ref=e431]:
            - generic [ref=e432]:
              - link "Adicionar" [ref=e433] [cursor=pointer]:
                - /url: /o/36675/knowledge_repositories/new
                - button "Adicionar" [ref=e434]:
                  - img [ref=e436]
                  - text: Adicionar
              - button "ios_share Extrair dados" [ref=e438] [cursor=pointer]:
                - generic [ref=e439]: ios_share
                - text: Extrair dados
              - generic [ref=e440]:
                - generic [ref=e441]:
                  - img [ref=e443]
                  - textbox "Pesquise por nome ou descrição" [ref=e445]
                - button [ref=e446] [cursor=pointer]:
                  - generic [ref=e448]: filter_alt
                - button "Limpar filtro" [ref=e449] [cursor=pointer]:
                  - generic [ref=e451]: filter_alt_off
                  - generic [ref=e452]: Limpar filtro
            - table [ref=e454]:
              - rowgroup [ref=e455]:
                - row "Nome Descrição Bases sem fontes Bases sem recursos" [ref=e456]:
                  - columnheader "Nome" [ref=e457] [cursor=pointer]:
                    - generic [ref=e460]:
                      - text: Nome
                      - img [ref=e461]
                  - columnheader "Descrição" [ref=e463] [cursor=pointer]:
                    - generic [ref=e466]:
                      - text: Descrição
                      - img [ref=e467]
                  - columnheader "Bases sem fontes" [ref=e469] [cursor=pointer]:
                    - generic [ref=e472]:
                      - text: Bases sem fontes
                      - img [ref=e473]
                  - columnheader "Bases sem recursos" [ref=e475] [cursor=pointer]:
                    - generic [ref=e478]:
                      - text: Bases sem recursos
                      - img [ref=e479]
                  - columnheader [ref=e481]
              - rowgroup [ref=e482]:
                - row [ref=e483]:
                  - cell "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" [ref=e484]:
                    - paragraph [ref=e485]: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  - cell [ref=e486]:
                    - paragraph [ref=e487]: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  - cell "✓" [ref=e488]:
                    - paragraph [ref=e489]: ✓
                  - cell "✓" [ref=e490]:
                    - paragraph [ref=e491]: ✓
                  - cell "edit delete" [ref=e492]:
                    - generic [ref=e494]:
                      - generic [ref=e497] [cursor=pointer]: edit
                      - generic [ref=e500] [cursor=pointer]: delete
                - row "jiu jitsu asd — ✓ edit delete" [ref=e501]:
                  - cell "jiu jitsu" [ref=e502]:
                    - paragraph [ref=e503]: jiu jitsu
                  - cell "asd" [ref=e504]:
                    - paragraph [ref=e505]: asd
                  - cell "—" [ref=e506]:
                    - paragraph [ref=e507]: —
                  - cell "✓" [ref=e508]:
                    - paragraph [ref=e509]: ✓
                  - cell "edit delete" [ref=e510]:
                    - generic [ref=e512]:
                      - generic [ref=e515] [cursor=pointer]: edit
                      - generic [ref=e518] [cursor=pointer]: delete
                - row "tetete tetete ✓ ✓ edit delete" [ref=e519]:
                  - cell "tetete" [ref=e520]:
                    - paragraph [ref=e521]: tetete
                  - cell "tetete" [ref=e522]:
                    - paragraph [ref=e523]: tetete
                  - cell "✓" [ref=e524]:
                    - paragraph [ref=e525]: ✓
                  - cell "✓" [ref=e526]:
                    - paragraph [ref=e527]: ✓
                  - cell "edit delete" [ref=e528]:
                    - generic [ref=e530]:
                      - generic [ref=e533] [cursor=pointer]: edit
                      - generic [ref=e536] [cursor=pointer]: delete
                - row "TESTE_AUTOMACAO_BUGS_BC Descrição atualizada pela automação — teste de loading infinito — — edit delete" [ref=e537]:
                  - cell "TESTE_AUTOMACAO_BUGS_BC" [ref=e538]:
                    - paragraph [ref=e539]: TESTE_AUTOMACAO_BUGS_BC
                  - cell "Descrição atualizada pela automação — teste de loading infinito" [ref=e540]:
                    - paragraph [ref=e541]: Descrição atualizada pela automação — teste de loading infinito
                  - cell "—" [ref=e542]:
                    - paragraph [ref=e543]: —
                  - cell "—" [ref=e544]:
                    - paragraph [ref=e545]: —
                  - cell "edit delete" [ref=e546]:
                    - generic [ref=e548]:
                      - generic [ref=e551] [cursor=pointer]: edit
                      - generic [ref=e554] [cursor=pointer]: delete
            - generic [ref=e556]:
              - generic [ref=e557]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e558]:
                  - generic [ref=e559]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e560]:
                  - generic [ref=e561]: chevron_left
                - button "1" [ref=e562] [cursor=pointer]
                - button "chevron_right" [disabled] [ref=e563]:
                  - generic [ref=e564]: chevron_right
              - generic [ref=e565]:
                - combobox [ref=e566]:
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
  6  | import { getOrgId } from '../../../../../src/utils/environment.js';
  7  | import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
  8  | import { tc4Data as data } from './tc4-validar-empty-state.data.js';
  9  | 
  10 | test.describe('Listagem básica de repositórios', () => {
  11 |   // Antes do TC4, limpa repositórios órfãos via API — garante empty state
  12 |   // determinístico independente de runs anteriores que deixaram lixo.
  13 |   // API REST documentada: GET/DELETE /api/v1/o/:org_id/knowledge_repositories.
  14 |   test.beforeAll(async ({ browser }) => {
  15 |     const ctx = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
  16 |     const page = await ctx.newPage();
  17 |     try {
  18 |       const listPage = new KnowledgeRepositoryListPage(page);
  19 |       await listPage.goToList();
  20 |       const ids = await page.evaluate(() =>
  21 |         Array.from(document.querySelectorAll('[data-item-id]')).map((el) =>
  22 |           el.getAttribute('data-item-id'),
  23 |         ),
  24 |       );
  25 |       for (const id of ids) {
  26 |         if (!id) continue;
  27 |         await page.evaluate(
  28 |           async ({ orgId, id }) => {
  29 |             const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
  30 |             await fetch(`/api/v1/o/${orgId}/knowledge_repositories/${id}`, {
  31 |               method: 'DELETE',
  32 |               headers: { 'X-CSRF-Token': csrf, Accept: 'application/json' },
  33 |               credentials: 'include',
  34 |             });
  35 |           },
  36 |           { orgId: getOrgId(), id },
  37 |         );
  38 |       }
  39 |     } finally {
  40 |       await ctx.close();
  41 |     }
  42 |   });
  43 | 
  44 |   test('TC4 — Validar empty state quando não há repositórios', async ({ page }) => {
  45 |     await allure.epic('Twygo - Base de Conhecimento');
  46 |     await allure.feature('Listagem básica de repositórios');
  47 |     await allure.story('TC4 — Validar empty state quando não há repositórios');
  48 |     await allure.severity('normal');
  49 | 
  50 |     const listPage = new KnowledgeRepositoryListPage(page);
  51 | 
  52 |     // Env staging-base-de-conhecimento já está vazio — navega direto, valida empty state real.
  53 |     await allure.step('1. Navegar para a listagem (env sem repositórios seedados)', async () => {
  54 |       await listPage.goToList();
  55 |       await expect(page).toHaveURL(/knowledge_repositories/);
  56 |       await expect(listPage.getListContainer()).toBeVisible();
  57 |     });
  58 | 
  59 |     await allure.step('2. Verificar exibição do empty state', async () => {
> 60 |       await expect(page.getByText(data.emptyStateText)).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  61 |       const rowCount = await listPage.getRowCount();
  62 |       expect(rowCount, 'Empty state implica 0 linhas de dados').toBe(0);
  63 |     });
  64 |   });
  65 | });
  66 | 
```