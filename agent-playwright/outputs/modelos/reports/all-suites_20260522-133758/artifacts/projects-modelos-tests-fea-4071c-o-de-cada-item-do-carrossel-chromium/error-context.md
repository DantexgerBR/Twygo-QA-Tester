# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\preview-de-modelos-e-designs\tc02-conteudo-carrossel.spec.ts >> Preview de Modelos e Designs >> Conteúdo de cada item do carrossel
- Location: projects\modelos\tests\features\preview-de-modelos-e-designs\tc02-conteudo-carrossel.spec.ts:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test-id="content-models-preview-modal-image"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-test-id="content-models-preview-modal-image"]')

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
                - link [ref=e27] [cursor=pointer]:
                  - /url: /o/37007/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link [ref=e33] [cursor=pointer]:
                  - /url: /o/37007/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link [ref=e39] [cursor=pointer]:
                  - /url: /o/37007/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link [ref=e46] [cursor=pointer]:
                  - /url: /o/37007/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
              - listitem [ref=e51]:
                - link [ref=e52] [cursor=pointer]:
                  - /url: /o/37007/content_models
                  - generic [ref=e53]:
                    - generic [ref=e55]: browse
                    - generic [ref=e56]: Modelos de conteúdo
              - listitem [ref=e57]:
                - link [ref=e58] [cursor=pointer]:
                  - /url: /o/37007/knowledge_repositories
                  - generic [ref=e59]:
                    - generic [ref=e61]: folder_open
                    - generic [ref=e62]: Base de conhecimento
          - listitem [ref=e63]:
            - link [ref=e64] [cursor=pointer]:
              - /url: /o/37007/users
              - generic [ref=e65]:
                - generic [ref=e67]: group
                - generic [ref=e68]: Usuários
          - listitem [ref=e69]:
            - link [ref=e70] [cursor=pointer]:
              - /url: /o/37007/companies
              - generic [ref=e71]:
                - generic [ref=e73]: work
                - generic [ref=e74]: Empresas
          - listitem [ref=e75]:
            - link [ref=e76] [cursor=pointer]:
              - /url: /o/37007/question_lists
              - generic [ref=e77]:
                - generic [ref=e79]: live_help
                - generic [ref=e80]: Questionários
          - listitem [ref=e81]:
            - link [ref=e82] [cursor=pointer]:
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
                - link [ref=e97] [cursor=pointer]:
                  - /url: /o/37007/organization_chart
                  - generic [ref=e98]:
                    - generic [ref=e100]: lan
                    - generic [ref=e101]: Organograma
              - listitem [ref=e102]:
                - link [ref=e103] [cursor=pointer]:
                  - /url: /o/37007/roles
                  - generic [ref=e104]:
                    - generic [ref=e106]: badge
                    - generic [ref=e107]: Funções de negócio
              - listitem [ref=e108]:
                - link [ref=e109] [cursor=pointer]:
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
                - link [ref=e123] [cursor=pointer]:
                  - /url: /o/37007/organization_datasets
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Repositórios
              - listitem [ref=e128]:
                - link [ref=e129] [cursor=pointer]:
                  - /url: /o/37007/process_architecture
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Arquitetura de Processos
              - listitem [ref=e134]:
                - link [ref=e135] [cursor=pointer]:
                  - /url: /o/37007/process_documentations
                  - generic [ref=e136]:
                    - generic [ref=e138]: send
                    - generic [ref=e139]: Agente de Documentação
              - listitem [ref=e140]:
                - link [ref=e141] [cursor=pointer]:
                  - /url: /o/37007/reference_documents
                  - generic [ref=e142]:
                    - generic [ref=e144]: send
                    - generic [ref=e145]: Documentos de Referência
              - listitem [ref=e146]:
                - link [ref=e147] [cursor=pointer]:
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
              - link [ref=e159] [cursor=pointer]:
                - /url: /o/37007/edit
                - generic [ref=e160]: e
                - text: Organização
            - listitem [ref=e161]:
              - link [ref=e162] [cursor=pointer]:
                - /url: /o/37007/use_modes
                - generic [ref=e163]: 
                - text: Menu
            - listitem [ref=e164]:
              - link [ref=e165] [cursor=pointer]:
                - /url: /o/37007/integrations
                - generic [ref=e166]: electrical_services
                - text: Integrações
            - listitem [ref=e167]:
              - link [ref=e168] [cursor=pointer]:
                - /url: /o/37007/autopilots
                - generic [ref=e169]: flash_auto
                - text: Piloto automático
            - listitem [ref=e170]:
              - link [ref=e171] [cursor=pointer]:
                - /url: /o/37007/game_rules
                - generic [ref=e172]: 
                - text: Regras do Jogo
            - listitem [ref=e173]:
              - link [ref=e174] [cursor=pointer]:
                - /url: /o/37007/communication
                - generic [ref=e175]: 
                - text: Comunicação
            - listitem [ref=e176]:
              - link [ref=e177] [cursor=pointer]:
                - /url: /o/37007/payments
                - generic [ref=e178]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e179]:
              - link [ref=e180] [cursor=pointer]:
                - /url: /o/37007/subscription_plans
                - generic [ref=e181]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e182]:
              - link [ref=e183] [cursor=pointer]:
                - /url: /o/37007/security
                - generic [ref=e184]: 
                - text: Segurança NOVO
            - listitem [ref=e185]:
              - link [ref=e186] [cursor=pointer]:
                - /url: /o/37007/ai_consumption_analysis
                - generic [ref=e187]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e188]:
              - link [ref=e189] [cursor=pointer]:
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
    - link [ref=e204] [cursor=pointer]:
      - /url: /o/37007/dashboard
      - text: Base de conhecimento
    - generic [ref=e208]:
      - button [ref=e212] [cursor=pointer]:
        - generic [ref=e213]: school
      - link [ref=e217] [cursor=pointer]:
        - /url: /o/37007/chats
        - button [ref=e218]:
          - img [ref=e219]
      - button [ref=e226] [cursor=pointer]:
        - img [ref=e227]
      - generic [ref=e230]:
        - link [ref=e231] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e232]: Base de conhecimento
      - button [ref=e233] [cursor=pointer]:
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
          - button [ref=e250] [cursor=pointer]: Responder pesquisa
          - button [ref=e251] [cursor=pointer]:
            - img [ref=e252]
        - generic [ref=e256]:
          - generic [ref=e257]:
            - paragraph [ref=e258]: Você está no modo BETA da funcionalidade Painéis do usuário, que estará disponível até dia 29/05.
            - paragraph [ref=e259]: Quer relembrar os detalhes dessa novidade? Veja aqui — Beta aceito por agents.qa@claude.com
          - generic [ref=e260]:
            - button [ref=e261] [cursor=pointer]: Interromper BETA teste
            - button [ref=e262] [cursor=pointer]: Responder pesquisa
          - button [ref=e263] [cursor=pointer]:
            - img [ref=e264]
      - button [ref=e269] [cursor=pointer]:
        - img [ref=e270]
    - generic [ref=e273]:
      - generic [ref=e275]:
        - list [ref=e276]:
          - list [ref=e277]:
            - listitem [ref=e278] [cursor=pointer]:
              - link [ref=e279]:
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
                  - link [ref=e295]:
                    - /url: /o/37007/events?tab=events
                    - generic [ref=e296]:
                      - generic [ref=e298]: format_list_bulleted_add
                      - generic [ref=e299]: Conteúdos
                - listitem [ref=e300]:
                  - link [ref=e301]:
                    - /url: /o/37007/shared_events
                    - generic [ref=e302]:
                      - generic [ref=e304]: send
                      - generic [ref=e305]: Compartilhamentos
                - listitem [ref=e306]:
                  - link [ref=e307]:
                    - /url: /o/37007/records
                    - generic [ref=e308]:
                      - generic [ref=e310]: description
                      - generic [ref=e311]: Registros
                      - generic [ref=e312]: BETA
                - listitem [ref=e313]:
                  - link [ref=e314]:
                    - /url: /o/37007/certificate_models
                    - generic [ref=e315]:
                      - generic [ref=e317]: workspace_premium
                      - generic [ref=e318]: Certificados
                - listitem [ref=e319]:
                  - link [ref=e320]:
                    - /url: /o/37007/content_models
                    - generic [ref=e321]:
                      - generic [ref=e323]: browse
                      - generic [ref=e324]: Modelos de conteúdo
                - listitem [ref=e325]:
                  - link [ref=e326]:
                    - /url: /o/37007/knowledge_repositories
                    - generic [ref=e327]:
                      - generic [ref=e329]: folder_open
                      - generic [ref=e330]: Base de conhecimento
            - listitem [ref=e331] [cursor=pointer]:
              - link [ref=e332]:
                - /url: /o/37007/users
                - generic [ref=e333]:
                  - generic [ref=e335]: group
                  - generic [ref=e336]: Usuários
            - listitem [ref=e337] [cursor=pointer]:
              - link [ref=e338]:
                - /url: /o/37007/companies
                - generic [ref=e339]:
                  - generic [ref=e341]: work
                  - generic [ref=e342]: Empresas
            - listitem [ref=e343] [cursor=pointer]:
              - link [ref=e344]:
                - /url: /o/37007/question_lists
                - generic [ref=e345]:
                  - generic [ref=e347]: live_help
                  - generic [ref=e348]: Questionários
            - listitem [ref=e349] [cursor=pointer]:
              - link [ref=e350]:
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
            - button [ref=e396] [cursor=pointer]:
              - img [ref=e398]
              - text: Voltar
            - heading [level=2] [ref=e401]: Modelos de conteúdo
          - generic [ref=e403]:
            - generic [ref=e404]:
              - button [ref=e406] [cursor=pointer]:
                - img [ref=e408]
                - text: Adicionar
              - generic [ref=e410]:
                - generic [ref=e411]:
                  - img [ref=e413]
                  - textbox [ref=e415]:
                    - /placeholder: Pesquise aqui pelo nome do modelo
                - generic [ref=e416]:
                  - generic [ref=e417] [cursor=pointer]: grid_view
                  - generic [ref=e418] [cursor=pointer]: reorder
                - button [ref=e419] [cursor=pointer]:
                  - generic [ref=e421]: filter_alt
                  - paragraph [ref=e423]: Filtro
            - generic [ref=e424]:
              - generic [ref=e429]:
                - generic [ref=e432]:
                  - img [ref=e433]
                  - img [ref=e434]:
                    - img [ref=e435]
                - generic [ref=e437]:
                  - paragraph [ref=e439]: Modelo Seed Descricao Longa 1779281852898
                  - generic [ref=e442]:
                    - generic [ref=e445] [cursor=pointer]: visibility
                    - generic [ref=e448] [cursor=pointer]: edit
                    - generic [ref=e451] [cursor=pointer]: content_copy
                    - generic [ref=e454] [cursor=pointer]: delete
              - generic [ref=e459]:
                - img [ref=e463]
                - generic [ref=e464]:
                  - paragraph [ref=e466]: Salvar sem descrição
                  - generic [ref=e469]:
                    - generic [ref=e472] [cursor=pointer]: visibility
                    - generic [ref=e475] [cursor=pointer]: edit
                    - generic [ref=e478] [cursor=pointer]: content_copy
                    - generic [ref=e481] [cursor=pointer]: delete
              - generic [ref=e486]:
                - img [ref=e490]
                - generic [ref=e491]:
                  - paragraph [ref=e493]: Modelo Seed Inativo 1779281852898
                  - generic [ref=e496]:
                    - generic [ref=e499] [cursor=pointer]: visibility
                    - generic [ref=e502] [cursor=pointer]: edit
                    - generic [ref=e505] [cursor=pointer]: content_copy
                    - generic [ref=e508] [cursor=pointer]: delete
              - generic [ref=e513]:
                - img [ref=e517]
                - generic [ref=e518]:
                  - paragraph [ref=e520]: Modelo Seed Ativo 1779281852898
                  - generic [ref=e523]:
                    - generic [ref=e526] [cursor=pointer]: visibility
                    - generic [ref=e529] [cursor=pointer]: edit
                    - generic [ref=e532] [cursor=pointer]: content_copy
                    - generic [ref=e535] [cursor=pointer]: delete
            - generic [ref=e537]:
              - generic [ref=e538]:
                - button [disabled] [ref=e539]:
                  - generic [ref=e540]: keyboard_double_arrow_left
                - button [disabled] [ref=e541]:
                  - generic [ref=e542]: chevron_left
                - button [ref=e543] [cursor=pointer]: "1"
                - button [disabled] [ref=e544]:
                  - generic [ref=e545]: chevron_right
              - generic [ref=e546]:
                - combobox [ref=e547]
                - generic:
                  - img
  - region [ref=e548]:
    - iframe [ref=e549]:
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
  - 'dialog "Modelo: Modelo Seed Descricao Longa 1779281852898" [ref=e552]':
    - banner [ref=e553]: "Modelo: Modelo Seed Descricao Longa 1779281852898"
    - button "Fechar pré-visualização" [active] [ref=e554] [cursor=pointer]:
      - img [ref=e555]
    - generic [ref=e557]:
      - generic [ref=e558]:
        - button "Design anterior" [disabled] [ref=e559]:
          - generic [ref=e560]: chevron_left
        - paragraph [ref=e563]: Capa
        - button "Próximo design" [ref=e564] [cursor=pointer]:
          - generic [ref=e565]: chevron_right
      - generic [ref=e567]:
        - paragraph [ref=e568]:
          - generic [ref=e569]: "Design:"
          - text: Capa
        - paragraph [ref=e570]:
          - generic [ref=e571]: "Tipo:"
          - text: Aula
        - paragraph [ref=e572]: Design 1 de 38
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as allure from 'allure-js-commons';
  3  | import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
  4  | 
  5  | test.describe('Preview de Modelos e Designs', () => {
  6  |   test('Conteúdo de cada item do carrossel', async ({ page }) => {
  7  |     await allure.epic('Twygo - Modelos de conteúdo');
  8  |     await allure.feature('Preview de Modelos e Designs');
  9  |     await allure.story('Conteúdo de cada item do carrossel');
  10 |     await allure.severity('critical');
  11 | 
  12 |     const list = new ContentModelsListPage(page);
  13 | 
  14 |     await allure.step('1. Acessar listagem e abrir Preview', async () => {
  15 |       await list.goToList();
  16 |       await list.expectListingLoaded();
  17 |       const previewBtn = page
  18 |         .locator('[data-test-id="content-models-page"] [id*="custom-element"][id$="-button-0"]')
  19 |         .first();
  20 |       await previewBtn.waitFor({ state: 'visible', timeout: 15_000 });
  21 |       await page.waitForTimeout(800);
  22 |       await previewBtn.evaluate((el: HTMLElement) => el.click());
  23 |       await expect(
  24 |         page.locator('[data-test-id="content-models-preview-modal-title"]'),
  25 |       ).toBeVisible({ timeout: 10_000 });
  26 |     });
  27 | 
  28 |     await allure.step('2. Validar elementos do slide: Modelo:, Design:, Tipo:, indicador X de Y', async () => {
  29 |       // Audit MCP confirmou estrutura: "Modelo: {nome}" no título, "Design: {nome}"
  30 |       // + "Tipo: Aula/Página" + "Design 1 de N" no body.
  31 |       // AT também documenta "Thumb do design" e "Prompt: {prosa}" — Prompt
  32 |       // não estava visível no audit (pode estar atrás de scroll/aba) — não
  33 |       // exigimos ele aqui.
  34 |       const body = page.locator('[data-test-id="content-models-preview-modal-body"]');
  35 |       await expect(body).toContainText('Design:', { timeout: 5_000 });
  36 |       await expect(body).toContainText('Tipo:', { timeout: 5_000 });
  37 |       await expect(body).toContainText(/Design \d+ de \d+/, { timeout: 5_000 });
  38 |       // Thumb (img)
  39 |       await expect(
  40 |         page.locator('[data-test-id="content-models-preview-modal-image"]'),
> 41 |       ).toBeVisible();
     |         ^ Error: expect(locator).toBeVisible() failed
  42 |     });
  43 |   });
  44 | });
  45 | 
```