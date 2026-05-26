# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\criacao-de-design-de-aula\tc02-salvar-aula-dados-validos.spec.ts >> Criação de Design de Aula >> Salvar Aula com dados válidos
- Location: projects\modelos\tests\features\criacao-de-design-de-aula\tc02-salvar-aula-dados-validos.spec.ts:8:3

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /template_designs\/new/
Received string: "https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/template_designs/new?kind=lesson"
Timeout: 10000ms

Call log:
  - Expect "not toHaveURL" with timeout 10000ms
    13 × unexpected value "https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/template_designs/new?kind=lesson"

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
            - link "group Usuários" [ref=e58] [cursor=pointer]:
              - /url: /o/37007/users
              - generic [ref=e59]:
                - generic [ref=e61]: group
                - generic [ref=e62]: Usuários
          - listitem [ref=e63]:
            - link "work Empresas" [ref=e64] [cursor=pointer]:
              - /url: /o/37007/companies
              - generic [ref=e65]:
                - generic [ref=e67]: work
                - generic [ref=e68]: Empresas
          - listitem [ref=e69]:
            - link "live_help Questionários" [ref=e70] [cursor=pointer]:
              - /url: /o/37007/question_lists
              - generic [ref=e71]:
                - generic [ref=e73]: live_help
                - generic [ref=e74]: Questionários
          - listitem [ref=e75]:
            - link "groups Comunidades" [ref=e76] [cursor=pointer]:
              - /url: /o/37007/feed
              - generic [ref=e77]:
                - generic [ref=e79]: groups
                - generic [ref=e80]: Comunidades
          - listitem [ref=e81]:
            - generic [ref=e83]:
              - generic [ref=e86]: psychology
              - generic [ref=e87]:
                - text: Skills
                - generic [ref=e88]: BETA
            - list [ref=e89]:
              - listitem [ref=e90]:
                - link "lan Organograma" [ref=e91] [cursor=pointer]:
                  - /url: /o/37007/organization_chart
                  - generic [ref=e92]:
                    - generic [ref=e94]: lan
                    - generic [ref=e95]: Organograma
              - listitem [ref=e96]:
                - link "badge Funções de negócio" [ref=e97] [cursor=pointer]:
                  - /url: /o/37007/roles
                  - generic [ref=e98]:
                    - generic [ref=e100]: badge
                    - generic [ref=e101]: Funções de negócio
              - listitem [ref=e102]:
                - link "award_star Competências" [ref=e103] [cursor=pointer]:
                  - /url: /o/37007/organization_chart_competencies
                  - generic [ref=e104]:
                    - generic [ref=e106]: award_star
                    - generic [ref=e107]: Competências
          - listitem [ref=e108]:
            - generic [ref=e110]:
              - generic [ref=e113]: account_tree
              - generic [ref=e114]: Processos
            - list [ref=e115]:
              - listitem [ref=e116]:
                - link "send Repositórios" [ref=e117] [cursor=pointer]:
                  - /url: /o/37007/organization_datasets
                  - generic [ref=e118]:
                    - generic [ref=e120]: send
                    - generic [ref=e121]: Repositórios
              - listitem [ref=e122]:
                - link "send Arquitetura de Processos" [ref=e123] [cursor=pointer]:
                  - /url: /o/37007/process_architecture
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Arquitetura de Processos
              - listitem [ref=e128]:
                - link "send Agente de Documentação" [ref=e129] [cursor=pointer]:
                  - /url: /o/37007/process_documentations
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Agente de Documentação
              - listitem [ref=e134]:
                - link "send Documentos de Referência" [ref=e135] [cursor=pointer]:
                  - /url: /o/37007/reference_documents
                  - generic [ref=e136]:
                    - generic [ref=e138]: send
                    - generic [ref=e139]: Documentos de Referência
              - listitem [ref=e140]:
                - link "send Portal de processos" [ref=e141] [cursor=pointer]:
                  - /url: /o/37007/visualize_documentations
                  - generic [ref=e142]:
                    - generic [ref=e144]: send
                    - generic [ref=e145]: Portal de processos
      - generic [ref=e146]: Base de conhecimento
      - list [ref=e147]:
        - listitem [ref=e148]:
          - generic [ref=e149]:
            - generic [ref=e150]: f
            - text: Configurações
          - list [ref=e151]:
            - listitem [ref=e152]:
              - link "e Organização" [ref=e153] [cursor=pointer]:
                - /url: /o/37007/edit
                - generic [ref=e154]: e
                - text: Organização
            - listitem [ref=e155]:
              - link " Menu" [ref=e156] [cursor=pointer]:
                - /url: /o/37007/use_modes
                - generic [ref=e157]: 
                - text: Menu
            - listitem [ref=e158]:
              - link "electrical_services Integrações" [ref=e159] [cursor=pointer]:
                - /url: /o/37007/integrations
                - generic [ref=e160]: electrical_services
                - text: Integrações
            - listitem [ref=e161]:
              - link "flash_auto Piloto automático" [ref=e162] [cursor=pointer]:
                - /url: /o/37007/autopilots
                - generic [ref=e163]: flash_auto
                - text: Piloto automático
            - listitem [ref=e164]:
              - link " Regras do Jogo" [ref=e165] [cursor=pointer]:
                - /url: /o/37007/game_rules
                - generic [ref=e166]: 
                - text: Regras do Jogo
            - listitem [ref=e167]:
              - link " Comunicação" [ref=e168] [cursor=pointer]:
                - /url: /o/37007/communication
                - generic [ref=e169]: 
                - text: Comunicação
            - listitem [ref=e170]:
              - link "sell Cobrança de inscrição" [ref=e171] [cursor=pointer]:
                - /url: /o/37007/payments
                - generic [ref=e172]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e173]:
              - link "credit_card Plano e assinatura" [ref=e174] [cursor=pointer]:
                - /url: /o/37007/subscription_plans
                - generic [ref=e175]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e176]:
              - link " Segurança NOVO" [ref=e177] [cursor=pointer]:
                - /url: /o/37007/security
                - generic [ref=e178]: 
                - text: Segurança NOVO
            - listitem [ref=e179]:
              - link "smart_toy Controle de IA BETA" [ref=e180] [cursor=pointer]:
                - /url: /o/37007/ai_consumption_analysis
                - generic [ref=e181]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e182]:
              - link "palette Aparência" [ref=e183] [cursor=pointer]:
                - /url: /o/37007/appearance
                - generic [ref=e184]: palette
                - text: Aparência
    - generic [ref=e187]:
      - generic [ref=e188]:
        - img [ref=e189]
        - text: Base de conhecimento
      - img [ref=e191]
  - text: "0"
  - generic [ref=e194]:
    - generic "Logo - Base de conhecimento" [ref=e196]:
      - link "Base de conhecimento" [ref=e198] [cursor=pointer]:
        - /url: /o/37007/dashboard
    - generic [ref=e202]:
      - button "Twygo Academy" [ref=e206] [cursor=pointer]:
        - generic [ref=e207]: school
      - link "Open chat" [ref=e211] [cursor=pointer]:
        - /url: /o/37007/chats
        - button "Open chat" [ref=e212]:
          - img [ref=e213]
      - button "Users" [ref=e220] [cursor=pointer]:
        - img [ref=e221]
      - generic [ref=e224]:
        - link "7089847 - Base de conhecimento" [ref=e225] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e226]: Base de conhecimento
      - button "Administrador G" [ref=e227] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e228]: G
    - text: M * * M * *
  - generic [ref=e229]:
    - generic [ref=e234]:
      - generic [ref=e236]:
        - generic [ref=e239]:
          - generic [ref=e240]:
            - paragraph [ref=e241]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 22/05.
            - paragraph [ref=e242]: Quer mais detalhes sobre essa novidade? Veja aqui
          - button "Responder pesquisa" [ref=e244] [cursor=pointer]
          - button "Close" [ref=e245] [cursor=pointer]:
            - img [ref=e246]
        - generic [ref=e250]:
          - generic [ref=e251]:
            - paragraph [ref=e252]: Você está no modo BETA da funcionalidade Painéis do usuário, que estará disponível até dia 29/05.
            - paragraph [ref=e253]: Quer relembrar os detalhes dessa novidade? Veja aqui — Beta aceito por agents.qa@claude.com
          - generic [ref=e254]:
            - button "Interromper BETA teste" [ref=e255] [cursor=pointer]
            - button "Responder pesquisa" [ref=e256] [cursor=pointer]
          - button "Close" [ref=e257] [cursor=pointer]:
            - img [ref=e258]
      - button "next" [ref=e263] [cursor=pointer]:
        - img [ref=e264]
    - generic [ref=e267]:
      - generic [ref=e269]:
        - list [ref=e270]:
          - list [ref=e271]:
            - listitem [ref=e272] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e273]:
                - /url: /o/37007/dashboard
                - generic [ref=e274]:
                  - generic [ref=e276]: leaderboard
                  - generic [ref=e277]: Dashboard
            - listitem [ref=e278] [cursor=pointer]:
              - generic [ref=e280]:
                - generic [ref=e283]: school
                - generic [ref=e284]: Aprendizagem
                - generic [ref=e286]: G
              - list [ref=e287]:
                - listitem [ref=e288]:
                  - link "format_list_bulleted_add Conteúdos" [ref=e289]:
                    - /url: /o/37007/events?tab=events
                    - generic [ref=e290]:
                      - generic [ref=e292]: format_list_bulleted_add
                      - generic [ref=e293]: Conteúdos
                - listitem [ref=e294]:
                  - link "send Compartilhamentos" [ref=e295]:
                    - /url: /o/37007/shared_events
                    - generic [ref=e296]:
                      - generic [ref=e298]: send
                      - generic [ref=e299]: Compartilhamentos
                - listitem [ref=e300]:
                  - link "description Registros BETA" [ref=e301]:
                    - /url: /o/37007/records
                    - generic [ref=e302]:
                      - generic [ref=e304]: description
                      - generic [ref=e305]: Registros
                      - generic [ref=e306]: BETA
                - listitem [ref=e307]:
                  - link "workspace_premium Certificados" [ref=e308]:
                    - /url: /o/37007/certificate_models
                    - generic [ref=e309]:
                      - generic [ref=e311]: workspace_premium
                      - generic [ref=e312]: Certificados
                - listitem [ref=e313]:
                  - link "browse Modelos de conteúdo" [ref=e314]:
                    - /url: /o/37007/content_models
                    - generic [ref=e315]:
                      - generic [ref=e317]: browse
                      - generic [ref=e318]: Modelos de conteúdo
            - listitem [ref=e319] [cursor=pointer]:
              - link "group Usuários" [ref=e320]:
                - /url: /o/37007/users
                - generic [ref=e321]:
                  - generic [ref=e323]: group
                  - generic [ref=e324]: Usuários
            - listitem [ref=e325] [cursor=pointer]:
              - link "work Empresas" [ref=e326]:
                - /url: /o/37007/companies
                - generic [ref=e327]:
                  - generic [ref=e329]: work
                  - generic [ref=e330]: Empresas
            - listitem [ref=e331] [cursor=pointer]:
              - link "live_help Questionários" [ref=e332]:
                - /url: /o/37007/question_lists
                - generic [ref=e333]:
                  - generic [ref=e335]: live_help
                  - generic [ref=e336]: Questionários
            - listitem [ref=e337] [cursor=pointer]:
              - link "groups Comunidades" [ref=e338]:
                - /url: /o/37007/feed
                - generic [ref=e339]:
                  - generic [ref=e341]: groups
                  - generic [ref=e342]: Comunidades
            - listitem [ref=e343] [cursor=pointer]:
              - generic [ref=e345]:
                - generic [ref=e348]: psychology
                - generic [ref=e349]:
                  - text: Skills
                  - generic [ref=e350]: BETA
                - generic [ref=e352]: G
            - listitem [ref=e353] [cursor=pointer]:
              - generic [ref=e355]:
                - generic [ref=e358]: account_tree
                - generic [ref=e359]: Processos
                - generic [ref=e361]: G
        - generic [ref=e363]: Base de conhecimento
        - list [ref=e364]:
          - listitem [ref=e365] [cursor=pointer]:
            - generic [ref=e366]:
              - generic [ref=e367]: f
              - text: Configurações
              - generic [ref=e368]: G
            - text: e    s 
      - generic [ref=e370]:
        - generic [ref=e373]: Modelos de conteúdo > Novo design
        - generic [ref=e380]:
          - generic [ref=e381]:
            - button "Voltar" [ref=e383] [cursor=pointer]:
              - img [ref=e385]
              - text: Voltar
            - heading "Novo design — Aula" [level=2] [ref=e388]
          - generic [ref=e391]:
            - tablist [ref=e392]:
              - tab "Identificação" [selected] [ref=e393] [cursor=pointer]
              - tab "Design" [disabled] [ref=e394]:
                - generic [ref=e395]: Design
            - tabpanel "Identificação" [ref=e397]:
              - generic [ref=e399]:
                - generic [ref=e402]:
                  - group [ref=e404]:
                    - generic [ref=e406]:
                      - generic [ref=e407]: Nome
                      - generic [ref=e408]: "*"
                    - 'textbox "Ex: Slide de abertura institucional" [active] [ref=e410]'
                    - generic [ref=e413]: Informe o nome
                  - group [ref=e415]:
                    - generic [ref=e417]:
                      - generic [ref=e418]: Tipo
                      - img [ref=e420]
                    - generic [ref=e422]:
                      - log [ref=e424]
                      - generic [ref=e425]:
                        - generic [ref=e426]:
                          - generic [ref=e427]: Introdução
                          - combobox [ref=e429]
                        - generic [ref=e430]:
                          - img [ref=e432]
                          - img [ref=e436]
                  - generic [ref=e439]:
                    - generic [ref=e441]:
                      - generic [ref=e442]: Instruções de estrutura para a IA
                      - generic [ref=e443]: "*"
                      - img [ref=e445]
                    - textbox [ref=e449]
                    - paragraph [ref=e453]: 142 / 500
                  - generic [ref=e455]:
                    - generic [ref=e457]:
                      - generic [ref=e458]: Instruções de conteúdo para a IA
                      - img [ref=e460]
                    - textbox [ref=e464]
                    - paragraph [ref=e468]: 206 / 500
                  - group [ref=e470]:
                    - generic [ref=e473]:
                      - text: Sequência
                      - generic [ref=e474]: "*"
                      - img [ref=e476]
                    - generic [ref=e478]:
                      - spinbutton "Sequência *" [ref=e479]: "1"
                      - generic [ref=e480]:
                        - button [ref=e481] [cursor=pointer]:
                          - img [ref=e482]
                        - button [disabled] [ref=e484]:
                          - img [ref=e485]
                - generic [ref=e487]:
                  - button "Cancelar" [ref=e488] [cursor=pointer]
                  - button "Salvar" [ref=e489] [cursor=pointer]
  - region "Widget de chat" [ref=e490]:
    - iframe [ref=e491]:
      - button "Abrir chat ao vivo" [ref=f29e5]:
        - img [ref=f29e8]
        - img [ref=f29e15]
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
  3  | import { DesignLessonEditPage } from '../../../pages/DesignLessonEditPage.js';
  4  | 
  5  | test.describe('Criação de Design de Aula', () => {
  6  |   const designName = `Aula TC2 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;
  7  | 
  8  |   test('Salvar Aula com dados válidos', async ({ page }) => {
  9  |     await allure.epic('Twygo - Modelos de conteúdo');
  10 |     await allure.feature('Criação de Design de Aula');
  11 |     await allure.story('Salvar Aula com dados válidos');
  12 |     await allure.severity('critical');
  13 | 
  14 |     const dl = new DesignLessonEditPage(page);
  15 | 
  16 |     await allure.step('1. Abrir tela de criação Aula', async () => {
  17 |       await dl.gotoFromFirstModel();
  18 |     });
  19 | 
  20 |     await allure.step('2-4. Preencher Nome + Tipo "Introdução" + Sequência', async () => {
  21 |       await dl.nameInput().fill(designName);
  22 |       await dl.selectTipo('Introdução');
  23 |       await dl.sequenceInput().fill('1');
  24 |     });
  25 | 
  26 |     await allure.step('5. Salvar e validar redirect pra aba Design da Aula', async () => {
  27 |       await dl.save();
  28 |       await Promise.race([
  29 |         page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 }).catch(() => undefined),
  30 |         page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).waitFor({ timeout: 15_000 }).catch(() => undefined),
  31 |       ]);
> 32 |       await expect(page).not.toHaveURL(/template_designs\/new/);
     |                              ^ Error: expect(page).not.toHaveURL(expected) failed
  33 |     });
  34 |   });
  35 | });
  36 | 
```