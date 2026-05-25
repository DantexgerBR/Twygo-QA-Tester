# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc04-descricao-truncada-tooltip.spec.ts >> Listagem e Menu de Modelos >> Coluna Descrição truncada com tooltip completo (visão Lista)
- Location: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc04-descricao-truncada-tooltip.spec.ts:7:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="tooltip"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[role="tooltip"]')

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
                - link "badge Funções de negócio" [ref=e103] [cursor=pointer]:
                  - /url: /o/37007/roles
                  - generic [ref=e104]:
                    - generic [ref=e106]: badge
                    - generic [ref=e107]: Funções de negócio
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
                  - textbox "Pesquise aqui pelo nome do modelo" [active] [ref=e415]: Modelo Seed Descricao Longa
                - generic [ref=e416]:
                  - generic [ref=e417] [cursor=pointer]: grid_view
                  - generic [ref=e418] [cursor=pointer]: reorder
                - button "Filtro" [ref=e419] [cursor=pointer]:
                  - generic [ref=e421]: filter_alt
                  - paragraph [ref=e423]: Filtro
            - table [ref=e425]:
              - rowgroup [ref=e426]:
                - row "Nome Descrição Provedor Designs Aplicação Situação Atualizado em" [ref=e427]:
                  - columnheader "Nome" [ref=e428] [cursor=pointer]:
                    - generic [ref=e431]:
                      - text: Nome
                      - img [ref=e432]
                  - columnheader "Descrição" [ref=e434]:
                    - generic [ref=e435]: Descrição
                  - columnheader "Provedor" [ref=e436]:
                    - generic [ref=e437]: Provedor
                  - columnheader "Designs" [ref=e438]:
                    - generic [ref=e439]: Designs
                  - columnheader "Aplicação" [ref=e440]:
                    - generic [ref=e441]: Aplicação
                  - columnheader "Situação" [ref=e442] [cursor=pointer]:
                    - generic [ref=e445]:
                      - text: Situação
                      - img [ref=e446]
                  - columnheader "Atualizado em" [ref=e448] [cursor=pointer]:
                    - generic [ref=e451]:
                      - text: Atualizado em
                      - img [ref=e452]
                  - columnheader [ref=e454]
              - rowgroup [ref=e455]:
                - row "Este modelo possui designs pendentes de regeneração. Acesse a aba design e clique no botão 'Regerar designs'. Modelo Seed Descricao Longa 1779281852898 Modelo seedado com descricao maior que 50 caracter... — 38 Sem uso 22/05/2026 - 08:41 visibility edit content_copy delete" [ref=e456]:
                  - cell "Este modelo possui designs pendentes de regeneração. Acesse a aba design e clique no botão 'Regerar designs'. Modelo Seed Descricao Longa 1779281852898" [ref=e457] [cursor=pointer]:
                    - generic [ref=e458]:
                      - img "Este modelo possui designs pendentes de regeneração. Acesse a aba design e clique no botão 'Regerar designs'." [ref=e459]:
                        - img [ref=e460]
                      - paragraph [ref=e462]: Modelo Seed Descricao Longa 1779281852898
                  - cell "Modelo seedado com descricao maior que 50 caracter..." [ref=e463]:
                    - paragraph [ref=e464]: Modelo seedado com descricao maior que 50 caracter...
                  - cell "—" [ref=e465]:
                    - paragraph [ref=e466]: —
                  - cell "38" [ref=e467]:
                    - paragraph [ref=e468]: "38"
                  - cell "Sem uso" [ref=e469]:
                    - paragraph [ref=e470]: Sem uso
                  - cell [ref=e471]:
                    - checkbox [checked] [ref=e473]
                  - cell "22/05/2026 - 08:41" [ref=e476] [cursor=pointer]:
                    - generic [ref=e477]: 22/05/2026 - 08:41
                  - cell "visibility edit content_copy delete" [ref=e478]:
                    - generic [ref=e480]:
                      - generic [ref=e483] [cursor=pointer]: visibility
                      - generic [ref=e486] [cursor=pointer]: edit
                      - generic [ref=e489] [cursor=pointer]: content_copy
                      - generic [ref=e492] [cursor=pointer]: delete
            - generic [ref=e494]:
              - generic [ref=e495]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e496]:
                  - generic [ref=e497]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e498]:
                  - generic [ref=e499]: chevron_left
                - button "1" [ref=e500] [cursor=pointer]
                - button "chevron_right" [disabled] [ref=e501]:
                  - generic [ref=e502]: chevron_right
              - generic [ref=e503]:
                - combobox [ref=e504]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - region "Widget de chat" [ref=e505]:
    - iframe [ref=e506]:
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
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as allure from 'allure-js-commons';
  3  | import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
  4  | import { tc04Data } from './tc04-descricao-truncada-tooltip.data.js';
  5  | 
  6  | test.describe('Listagem e Menu de Modelos', () => {
  7  |   test('Coluna Descrição truncada com tooltip completo (visão Lista)', async ({ page }) => {
  8  |     await allure.epic('Twygo - Modelos de conteúdo');
  9  |     await allure.feature('Listagem e Menu de Modelos');
  10 |     await allure.story('Coluna Descrição truncada com tooltip completo (visão Lista)');
  11 |     await allure.severity('normal');
  12 | 
  13 |     const modelos = new ContentModelsListPage(page);
  14 | 
  15 |     await allure.step('1. Acessar listagem em formato Lista e filtrar por modelo com descrição longa', async () => {
  16 |       await modelos.goToList();
  17 |       await modelos.expectListingLoaded();
  18 |       await modelos.switchToListView();
  19 |       await modelos.expectListColumnsVisible();
  20 |       await modelos.searchByName(tc04Data.seedNamePrefix);
  21 |     });
  22 | 
  23 |     await allure.step('2. Localizar célula de Descrição truncada (texto com "...")', async () => {
  24 |       // REVISAR: célula da Descrição não tem testId — usar role=cell com texto truncado.
  25 |       // Heurística: textContent inclui reticências (...) quando truncado em 50 chars.
  26 |       const descCell = page.getByRole('cell').filter({ hasText: /\.{3}/ }).first();
  27 |       await expect(descCell).toBeVisible({ timeout: 10_000 });
  28 |     });
  29 | 
  30 |     await allure.step('3. Hover na célula e validar tooltip com texto completo', async () => {
  31 |       const descCell = page.getByRole('cell').filter({ hasText: /\.{3}/ }).first();
  32 |       await descCell.hover();
  33 |       // REVISAR: tooltip Chakra usa role="tooltip" no DOM portal — pode levar até 1s pra aparecer
> 34 |       await expect(page.locator('[role="tooltip"]')).toBeVisible({ timeout: 5_000 });
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  35 |     });
  36 |   });
  37 | });
  38 | 
```