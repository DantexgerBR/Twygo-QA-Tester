# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\criacao-de-design-de-pagina\tc03-autofill-tipo-capa.spec.ts >> Criação de Design de Página >> Auto-preenchimento ao selecionar tipo "Capa"
- Location: projects\modelos\tests\features\criacao-de-design-de-pagina\tc03-autofill-tipo-capa.spec.ts:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('0 / 500').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('0 / 500').first()

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
              - generic [ref=e119]: person_check
              - generic [ref=e120]:
                - text: Continuidade e sucessão
                - generic [ref=e121]: BETA
            - list [ref=e122]:
              - listitem [ref=e123]:
                - link "pie_chart Dashboard geral" [ref=e124] [cursor=pointer]:
                  - /url: /o/37007/succession_dashboards
                  - generic [ref=e125]:
                    - generic [ref=e127]: pie_chart
                    - generic [ref=e128]: Dashboard geral
              - listitem [ref=e129]:
                - link "person Análise individual" [ref=e130] [cursor=pointer]:
                  - /url: /o/37007/succession_people_analysis
                  - generic [ref=e131]:
                    - generic [ref=e133]: person
                    - generic [ref=e134]: Análise individual
              - listitem [ref=e135]:
                - link "vital_signs Ações de resposta" [ref=e136] [cursor=pointer]:
                  - /url: /o/37007/succession_actions
                  - generic [ref=e137]:
                    - generic [ref=e139]: vital_signs
                    - generic [ref=e140]: Ações de resposta
              - listitem [ref=e141]:
                - link "instant_mix Parâmetros" [ref=e142] [cursor=pointer]:
                  - /url: /o/37007/succession_initiatives
                  - generic [ref=e143]:
                    - generic [ref=e145]: instant_mix
                    - generic [ref=e146]: Parâmetros
          - listitem [ref=e147]:
            - generic [ref=e149]:
              - generic [ref=e152]: account_tree
              - generic [ref=e153]: Processos
            - list [ref=e154]:
              - listitem [ref=e155]:
                - link "send Repositórios" [ref=e156] [cursor=pointer]:
                  - /url: /o/37007/organization_datasets
                  - generic [ref=e157]:
                    - generic [ref=e159]: send
                    - generic [ref=e160]: Repositórios
              - listitem [ref=e161]:
                - link "send Arquitetura de Processos" [ref=e162] [cursor=pointer]:
                  - /url: /o/37007/process_architecture
                  - generic [ref=e163]:
                    - generic [ref=e165]: send
                    - generic [ref=e166]: Arquitetura de Processos
              - listitem [ref=e167]:
                - link "send Agente de Documentação" [ref=e168] [cursor=pointer]:
                  - /url: /o/37007/process_documentations
                  - generic [ref=e169]:
                    - generic [ref=e171]: send
                    - generic [ref=e172]: Agente de Documentação
              - listitem [ref=e173]:
                - link "send Documentos de Referência" [ref=e174] [cursor=pointer]:
                  - /url: /o/37007/reference_documents
                  - generic [ref=e175]:
                    - generic [ref=e177]: send
                    - generic [ref=e178]: Documentos de Referência
              - listitem [ref=e179]:
                - link "send Portal de processos" [ref=e180] [cursor=pointer]:
                  - /url: /o/37007/visualize_documentations
                  - generic [ref=e181]:
                    - generic [ref=e183]: send
                    - generic [ref=e184]: Portal de processos
          - listitem [ref=e185]:
            - generic [ref=e187]:
              - generic [ref=e190]: monitoring
              - generic [ref=e191]: Planos e Metas
            - list [ref=e192]:
              - listitem [ref=e193]:
                - link "track_changes PDI" [ref=e194] [cursor=pointer]:
                  - /url: /o/37007/admin/pdis
                  - generic [ref=e195]:
                    - generic [ref=e197]: track_changes
                    - generic [ref=e198]: PDI
      - generic [ref=e199]: Base de conhecimento
      - list [ref=e200]:
        - listitem [ref=e201]:
          - generic [ref=e202]:
            - generic [ref=e203]: f
            - text: Configurações
          - list [ref=e204]:
            - listitem [ref=e205]:
              - link "e Organização" [ref=e206] [cursor=pointer]:
                - /url: /o/37007/edit
                - generic [ref=e207]: e
                - text: Organização
            - listitem [ref=e208]:
              - link " Menu" [ref=e209] [cursor=pointer]:
                - /url: /o/37007/use_modes
                - generic [ref=e210]: 
                - text: Menu
            - listitem [ref=e211]:
              - link "electrical_services Integrações" [ref=e212] [cursor=pointer]:
                - /url: /o/37007/integrations
                - generic [ref=e213]: electrical_services
                - text: Integrações
            - listitem [ref=e214]:
              - link "flash_auto Piloto automático" [ref=e215] [cursor=pointer]:
                - /url: /o/37007/autopilots
                - generic [ref=e216]: flash_auto
                - text: Piloto automático
            - listitem [ref=e217]:
              - link " Regras do Jogo" [ref=e218] [cursor=pointer]:
                - /url: /o/37007/game_rules
                - generic [ref=e219]: 
                - text: Regras do Jogo
            - listitem [ref=e220]:
              - link " Comunicação" [ref=e221] [cursor=pointer]:
                - /url: /o/37007/communication
                - generic [ref=e222]: 
                - text: Comunicação
            - listitem [ref=e223]:
              - link "sell Cobrança de inscrição" [ref=e224] [cursor=pointer]:
                - /url: /o/37007/payments
                - generic [ref=e225]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e226]:
              - link "credit_card Plano e assinatura" [ref=e227] [cursor=pointer]:
                - /url: /o/37007/subscription_plans
                - generic [ref=e228]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e229]:
              - link " Segurança NOVO" [ref=e230] [cursor=pointer]:
                - /url: /o/37007/security
                - generic [ref=e231]: 
                - text: Segurança NOVO
            - listitem [ref=e232]:
              - link "smart_toy Controle de IA BETA" [ref=e233] [cursor=pointer]:
                - /url: /o/37007/ai_consumption_analysis
                - generic [ref=e234]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e235]:
              - link "palette Aparência" [ref=e236] [cursor=pointer]:
                - /url: /o/37007/appearance
                - generic [ref=e237]: palette
                - text: Aparência
    - generic [ref=e240]:
      - generic [ref=e241]:
        - img [ref=e242]
        - text: Base de conhecimento
      - img [ref=e244]
  - text: "0"
  - generic [ref=e247]:
    - generic "Logo - Base de conhecimento" [ref=e249]:
      - link "Base de conhecimento" [ref=e251] [cursor=pointer]:
        - /url: /o/37007/dashboard
    - generic [ref=e255]:
      - button "Twygo Academy" [ref=e259] [cursor=pointer]:
        - generic [ref=e260]: school
      - link "Open chat" [ref=e264] [cursor=pointer]:
        - /url: /o/37007/chats
        - button "Open chat" [ref=e265]:
          - img [ref=e266]
      - button "Users" [ref=e273] [cursor=pointer]:
        - img [ref=e274]
      - generic [ref=e277]:
        - link "7089847 - Base de conhecimento" [ref=e278] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e279]: Base de conhecimento
      - button "Administrador G" [ref=e280] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e281]: G
    - text: M * * M * *
  - generic [ref=e282]:
    - generic [ref=e292]:
      - generic [ref=e293]:
        - paragraph [ref=e294]: Você está no modo BETA da funcionalidade Painéis do usuário, que estará disponível até dia 29/05.
        - paragraph [ref=e295]: Quer relembrar os detalhes dessa novidade? Veja aqui — Beta aceito por agents.qa@claude.com
      - generic [ref=e296]:
        - button "Interromper BETA teste" [ref=e297] [cursor=pointer]
        - button "Responder pesquisa" [ref=e298] [cursor=pointer]
      - button "Close" [ref=e299] [cursor=pointer]:
        - img [ref=e300]
    - generic [ref=e303]:
      - generic [ref=e305]:
        - list [ref=e306]:
          - list [ref=e307]:
            - listitem [ref=e308] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e309]:
                - /url: /o/37007/dashboard
                - generic [ref=e310]:
                  - generic [ref=e312]: leaderboard
                  - generic [ref=e313]: Dashboard
            - listitem [ref=e314] [cursor=pointer]:
              - generic [ref=e316]:
                - generic [ref=e319]: school
                - generic [ref=e320]: Aprendizagem
                - generic [ref=e322]: G
              - list [ref=e323]:
                - listitem [ref=e324]:
                  - link "format_list_bulleted_add Conteúdos" [ref=e325]:
                    - /url: /o/37007/events?tab=events
                    - generic [ref=e326]:
                      - generic [ref=e328]: format_list_bulleted_add
                      - generic [ref=e329]: Conteúdos
                - listitem [ref=e330]:
                  - link "send Compartilhamentos" [ref=e331]:
                    - /url: /o/37007/shared_events
                    - generic [ref=e332]:
                      - generic [ref=e334]: send
                      - generic [ref=e335]: Compartilhamentos
                - listitem [ref=e336]:
                  - link "description Registros BETA" [ref=e337]:
                    - /url: /o/37007/records
                    - generic [ref=e338]:
                      - generic [ref=e340]: description
                      - generic [ref=e341]: Registros
                      - generic [ref=e342]: BETA
                - listitem [ref=e343]:
                  - link "workspace_premium Certificados" [ref=e344]:
                    - /url: /o/37007/certificate_models
                    - generic [ref=e345]:
                      - generic [ref=e347]: workspace_premium
                      - generic [ref=e348]: Certificados
                - listitem [ref=e349]:
                  - link "browse Modelos de conteúdo" [ref=e350]:
                    - /url: /o/37007/content_models
                    - generic [ref=e351]:
                      - generic [ref=e353]: browse
                      - generic [ref=e354]: Modelos de conteúdo
                - listitem [ref=e355]:
                  - link "folder_open Base de conhecimento" [ref=e356]:
                    - /url: /o/37007/knowledge_repositories
                    - generic [ref=e357]:
                      - generic [ref=e359]: folder_open
                      - generic [ref=e360]: Base de conhecimento
            - listitem [ref=e361] [cursor=pointer]:
              - link "group Usuários" [ref=e362]:
                - /url: /o/37007/users
                - generic [ref=e363]:
                  - generic [ref=e365]: group
                  - generic [ref=e366]: Usuários
            - listitem [ref=e367] [cursor=pointer]:
              - link "work Empresas" [ref=e368]:
                - /url: /o/37007/companies
                - generic [ref=e369]:
                  - generic [ref=e371]: work
                  - generic [ref=e372]: Empresas
            - listitem [ref=e373] [cursor=pointer]:
              - link "live_help Questionários" [ref=e374]:
                - /url: /o/37007/question_lists
                - generic [ref=e375]:
                  - generic [ref=e377]: live_help
                  - generic [ref=e378]: Questionários
            - listitem [ref=e379] [cursor=pointer]:
              - link "groups Comunidades" [ref=e380]:
                - /url: /o/37007/feed
                - generic [ref=e381]:
                  - generic [ref=e383]: groups
                  - generic [ref=e384]: Comunidades
            - listitem [ref=e385] [cursor=pointer]:
              - generic [ref=e387]:
                - generic [ref=e390]: psychology
                - generic [ref=e391]:
                  - text: Skills
                  - generic [ref=e392]: BETA
                - generic [ref=e394]: G
            - listitem [ref=e395] [cursor=pointer]:
              - generic [ref=e397]:
                - generic [ref=e400]: person_check
                - generic [ref=e401]:
                  - text: Continuidade e sucessão
                  - generic [ref=e402]: BETA
                - generic [ref=e404]: G
            - listitem [ref=e405] [cursor=pointer]:
              - generic [ref=e407]:
                - generic [ref=e410]: account_tree
                - generic [ref=e411]: Processos
                - generic [ref=e413]: G
            - listitem [ref=e414] [cursor=pointer]:
              - generic [ref=e416]:
                - generic [ref=e419]: monitoring
                - generic [ref=e420]: Planos e Metas
                - generic [ref=e422]: G
        - generic [ref=e424]: Base de conhecimento
        - list [ref=e425]:
          - listitem [ref=e426] [cursor=pointer]:
            - generic [ref=e427]:
              - generic [ref=e428]: f
              - text: Configurações
              - generic [ref=e429]: G
            - text: e    s 
      - generic [ref=e431]:
        - generic [ref=e434]: Modelos de conteúdo > Novo design
        - generic [ref=e441]:
          - generic [ref=e443]:
            - button "Voltar" [ref=e445] [cursor=pointer]:
              - img [ref=e447]
              - text: Voltar
            - heading "Novo design — Página" [level=2] [ref=e450]
          - generic [ref=e453]:
            - tablist [ref=e454]:
              - tab "Identificação" [selected] [ref=e455] [cursor=pointer]
              - tab "Design" [disabled] [ref=e456]:
                - generic [ref=e457]: Design
            - tabpanel "Identificação" [ref=e459]:
              - generic [ref=e461]:
                - generic [ref=e464]:
                  - group [ref=e466]:
                    - generic [ref=e468]:
                      - generic [ref=e469]: Nome
                      - generic [ref=e470]: "*"
                    - 'textbox "Ex: Slide de abertura institucional" [ref=e472]'
                  - group [ref=e474]:
                    - generic [ref=e476]:
                      - generic [ref=e477]: Tipo
                      - img [ref=e479]
                    - generic [ref=e481]:
                      - log [ref=e483]
                      - generic [ref=e484]:
                        - generic [ref=e485]:
                          - generic [ref=e486]: Selecione ou digite um tipo
                          - combobox [ref=e488]
                        - img [ref=e492]
                  - generic [ref=e495]:
                    - generic [ref=e497]:
                      - generic [ref=e498]: Instruções de estrutura para a IA
                      - generic [ref=e499]: "*"
                      - img [ref=e501]
                    - textbox [ref=e505]
                  - generic [ref=e508]:
                    - generic [ref=e510]:
                      - generic [ref=e511]: Instruções de conteúdo para a IA
                      - img [ref=e513]
                    - textbox [ref=e517]
                  - group [ref=e520]:
                    - generic [ref=e523]:
                      - text: Sequência
                      - generic [ref=e524]: "*"
                      - img [ref=e526]
                    - generic [ref=e528]:
                      - spinbutton "Sequência *" [ref=e529]: "1"
                      - generic [ref=e530]:
                        - button [ref=e531] [cursor=pointer]:
                          - img [ref=e532]
                        - button [disabled] [ref=e534]:
                          - img [ref=e535]
                - generic [ref=e537]:
                  - button "Cancelar" [ref=e538] [cursor=pointer]
                  - button "Salvar" [ref=e539] [cursor=pointer]
  - region "Widget de chat" [ref=e540]:
    - iframe [ref=e541]:
      - button "Abrir chat ao vivo" [ref=f33e5]:
        - img [ref=f33e8]
        - img [ref=f33e15]
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
  3  | import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';
  4  | 
  5  | test.describe('Criação de Design de Página', () => {
  6  |   test('Auto-preenchimento ao selecionar tipo "Capa"', async ({ page }) => {
  7  |     await allure.epic('Twygo - Modelos de conteúdo');
  8  |     await allure.feature('Criação de Design de Página');
  9  |     await allure.story('Auto-preenchimento ao selecionar tipo "Capa"');
  10 |     await allure.severity('critical');
  11 | 
  12 |     const dp = new DesignPageEditPage(page);
  13 | 
  14 |     await allure.step('1. Abrir tela de criação Página', async () => {
  15 |       await dp.gotoFromFirstModel();
  16 |     });
  17 | 
  18 |     await allure.step('2. Validar contadores zerados ANTES de selecionar Tipo', async () => {
  19 |       // Audit chrome-devtools-mcp 2026-05-20: campos de instruções usam Plate.js
  20 |       // (Slate). textContent retorna vazio mas o contador de chars no rodapé
  21 |       // expõe o conteúdo real. Antes do Tipo, ambos contadores estão em 0/500.
> 22 |       await expect(page.getByText('0 / 500').first()).toBeVisible({ timeout: 10_000 });
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  23 |     });
  24 | 
  25 |     await allure.step('3. Selecionar "Capa" no campo Tipo', async () => {
  26 |       await dp.selectTipo('Capa');
  27 |     });
  28 | 
  29 |     await allure.step('4. Validar auto-fill via contadores Plate (49/500 estrutura + 225/500 conteúdo)', async () => {
  30 |       // Texto canônico Capa = "Usar sempre como primeira parte de qualquer aula."
  31 |       // (49 chars) na instrução de estrutura + ~225 chars na de conteúdo.
  32 |       // Contador acima de 0 confirma auto-fill, sem precisar ler texto do Plate.
  33 |       await expect(page.getByText(/^\d{2,3}\s*\/\s*500$/).first()).toBeVisible({ timeout: 10_000 });
  34 |       // Validação stronger: ambos os campos com conteúdo (não 0/500).
  35 |       const zeroCounters = await page.getByText('0 / 500').count();
  36 |       expect(zeroCounters, 'esperava ambos contadores acima de 0 após auto-fill').toBe(0);
  37 |     });
  38 |   });
  39 | });
  40 | 
```