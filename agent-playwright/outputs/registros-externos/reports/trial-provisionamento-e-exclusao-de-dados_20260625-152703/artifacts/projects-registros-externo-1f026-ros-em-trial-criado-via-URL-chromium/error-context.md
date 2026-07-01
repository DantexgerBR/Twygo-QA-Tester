# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\trial\tc1-feature-registros-trial-via-url.spec.ts >> Trial (provisionamento e exclusão de dados) >> Validar feature de Registros em trial criado via URL
- Location: projects\registros-externos\tests\features\trial\tc1-feature-registros-trial-via-url.spec.ts:66:3

# Error details

```
Error: Trial deve ter registros pré-definidos da SophiaTech (emitidos > 0)

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - registrostrial" [ref=e4]:
        - img "Logo - registrostrial" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/37078/dashboard
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
                  - /url: /o/37078/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/37078/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/37078/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/37078/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
              - listitem [ref=e51]:
                - link "folder_open Base de conhecimento" [ref=e52] [cursor=pointer]:
                  - /url: /o/37078/knowledge_repositories
                  - generic [ref=e53]:
                    - generic [ref=e55]: folder_open
                    - generic [ref=e56]: Base de conhecimento
          - listitem [ref=e57]:
            - link "group Usuários" [ref=e58] [cursor=pointer]:
              - /url: /o/37078/users
              - generic [ref=e59]:
                - generic [ref=e61]: group
                - generic [ref=e62]: Usuários
          - listitem [ref=e63]:
            - link "work Empresas" [ref=e64] [cursor=pointer]:
              - /url: /o/37078/companies
              - generic [ref=e65]:
                - generic [ref=e67]: work
                - generic [ref=e68]: Empresas
          - listitem [ref=e69]:
            - link "live_help Questionários" [ref=e70] [cursor=pointer]:
              - /url: /o/37078/question_lists
              - generic [ref=e71]:
                - generic [ref=e73]: live_help
                - generic [ref=e74]: Questionários
          - listitem [ref=e75]:
            - link "groups Comunidades" [ref=e76] [cursor=pointer]:
              - /url: /o/37078/feed
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
                  - /url: /o/37078/organization_chart
                  - generic [ref=e92]:
                    - generic [ref=e94]: lan
                    - generic [ref=e95]: Organograma
              - listitem [ref=e96]:
                - link "badge Funções de negócio" [ref=e97] [cursor=pointer]:
                  - /url: /o/37078/roles
                  - generic [ref=e98]:
                    - generic [ref=e100]: badge
                    - generic [ref=e101]: Funções de negócio
              - listitem [ref=e102]:
                - link "award_star Competências" [ref=e103] [cursor=pointer]:
                  - /url: /o/37078/organization_chart_competencies
                  - generic [ref=e104]:
                    - generic [ref=e106]: award_star
                    - generic [ref=e107]: Competências
          - listitem [ref=e108]:
            - generic [ref=e110]:
              - generic [ref=e113]: monitoring
              - generic [ref=e114]:
                - text: Planos e Metas
                - generic [ref=e115]: BETA
            - list [ref=e116]:
              - listitem [ref=e117]:
                - link "track_changes PDI" [ref=e118] [cursor=pointer]:
                  - /url: /o/37078/admin/pdis
                  - generic [ref=e119]:
                    - generic [ref=e121]: track_changes
                    - generic [ref=e122]: PDI
      - generic [ref=e123]: registrostrial
      - list [ref=e124]:
        - listitem [ref=e125]:
          - generic [ref=e127]:
            - generic [ref=e129]: f
            - generic [ref=e130]: Configurações
          - list [ref=e131]:
            - listitem [ref=e132]:
              - link "e Organização" [ref=e133] [cursor=pointer]:
                - /url: /o/37078/edit
                - generic [ref=e134]:
                  - generic [ref=e136]: e
                  - generic [ref=e137]: Organização
            - listitem [ref=e138]:
              - link " Navegação" [ref=e139] [cursor=pointer]:
                - /url: /o/37078/use_modes
                - generic [ref=e140]:
                  - generic [ref=e142]: 
                  - generic [ref=e143]: Navegação
            - listitem [ref=e144]:
              - link "electrical_services Integrações" [ref=e145] [cursor=pointer]:
                - /url: /o/37078/integrations
                - generic [ref=e146]:
                  - generic [ref=e148]: electrical_services
                  - generic [ref=e149]: Integrações
            - listitem [ref=e150]:
              - link "flash_auto Piloto automático" [ref=e151] [cursor=pointer]:
                - /url: /o/37078/autopilots
                - generic [ref=e152]:
                  - generic [ref=e154]: flash_auto
                  - generic [ref=e155]: Piloto automático
            - listitem [ref=e156]:
              - link " Regras do Jogo" [ref=e157] [cursor=pointer]:
                - /url: /o/37078/game_rules
                - generic [ref=e158]:
                  - generic [ref=e160]: 
                  - generic [ref=e161]: Regras do Jogo
            - listitem [ref=e162]:
              - link " Comunicação" [ref=e163] [cursor=pointer]:
                - /url: /o/37078/communication
                - generic [ref=e164]:
                  - generic [ref=e166]: 
                  - generic [ref=e167]: Comunicação
            - listitem [ref=e168]:
              - link "sell Cobrança de inscrição" [ref=e169] [cursor=pointer]:
                - /url: /o/37078/payments
                - generic [ref=e170]:
                  - generic [ref=e172]: sell
                  - generic [ref=e173]: Cobrança de inscrição
            - listitem [ref=e174]:
              - link "credit_card Plano e assinatura" [ref=e175] [cursor=pointer]:
                - /url: /o/37078/subscription_plans
                - generic [ref=e176]:
                  - generic [ref=e178]: credit_card
                  - generic [ref=e179]: Plano e assinatura
            - text: s
            - listitem [ref=e180]:
              - link " Segurança NOVO" [ref=e181] [cursor=pointer]:
                - /url: /o/37078/security
                - generic [ref=e182]:
                  - generic [ref=e184]: 
                  - generic [ref=e185]: Segurança NOVO
            - listitem [ref=e186]:
              - link "smart_toy Controle de IA BETA" [ref=e187] [cursor=pointer]:
                - /url: /o/37078/ai_consumption_analysis
                - generic [ref=e188]:
                  - generic [ref=e190]: smart_toy
                  - generic [ref=e191]: Controle de IA BETA
            - listitem [ref=e192]:
              - link "palette Aparência" [ref=e193] [cursor=pointer]:
                - /url: /o/37078/appearance
                - generic [ref=e194]:
                  - generic [ref=e196]: palette
                  - generic [ref=e197]: Aparência
    - generic [ref=e200]:
      - generic [ref=e201]:
        - img [ref=e202]
        - text: Richard .
      - img [ref=e204]
  - text: "0"
  - generic [ref=e207]:
    - generic "Logo - registrostrial" [ref=e209]:
      - link "registrostrial" [ref=e211] [cursor=pointer]:
        - /url: /o/37078/dashboard
    - generic [ref=e215]:
      - link "Open chat" [ref=e219] [cursor=pointer]:
        - /url: /o/37078/chats
        - button "Open chat" [ref=e220]:
          - img [ref=e221]
      - button "Users" [ref=e228] [cursor=pointer]:
        - img [ref=e229]
      - generic [ref=e233]:
        - link "7094559 - Richard ." [ref=e234] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e235]: Richard .
      - button "Administrador G" [ref=e236] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e237]: G
    - text: M * * M * *
  - generic [ref=e238]:
    - generic [ref=e239]:
      - alert [ref=e243]:
        - generic [ref=e244]:
          - img [ref=e246]
          - generic [ref=e248]: Você ainda tem 362 dias para testar a Twygo. Para não perder os dados do seu teste e continuar usando a plataforma, faça contato com o nosso time comercial.
        - button "Contato" [ref=e249] [cursor=pointer]
        - button "Close" [ref=e250] [cursor=pointer]:
          - img [ref=e251]
      - generic [ref=e254] [cursor=pointer]:
        - img [ref=e255]
        - img "twygo-logo" [ref=e257]
    - generic [ref=e259]:
      - generic [ref=e261]:
        - list [ref=e262]:
          - list [ref=e263]:
            - listitem [ref=e264] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e265]:
                - /url: /o/37078/dashboard
                - generic [ref=e266]:
                  - generic [ref=e268]: leaderboard
                  - generic [ref=e269]: Dashboard
            - listitem [ref=e270] [cursor=pointer]:
              - generic [ref=e272]:
                - generic [ref=e275]: school
                - generic [ref=e276]: Aprendizagem
                - generic [ref=e278]: G
              - list [ref=e279]:
                - listitem [ref=e280]:
                  - link "format_list_bulleted_add Conteúdos" [ref=e281]:
                    - /url: /o/37078/events?tab=events
                    - generic [ref=e282]:
                      - generic [ref=e284]: format_list_bulleted_add
                      - generic [ref=e285]: Conteúdos
                - listitem [ref=e286]:
                  - link "send Compartilhamentos" [ref=e287]:
                    - /url: /o/37078/shared_events
                    - generic [ref=e288]:
                      - generic [ref=e290]: send
                      - generic [ref=e291]: Compartilhamentos
                - listitem [ref=e292]:
                  - link "description Registros BETA" [ref=e293]:
                    - /url: /o/37078/records
                    - generic [ref=e294]:
                      - generic [ref=e296]: description
                      - generic [ref=e297]: Registros
                      - generic [ref=e298]: BETA
                - listitem [ref=e299]:
                  - link "workspace_premium Certificados" [ref=e300]:
                    - /url: /o/37078/certificate_models
                    - generic [ref=e301]:
                      - generic [ref=e303]: workspace_premium
                      - generic [ref=e304]: Certificados
                - listitem [ref=e305]:
                  - link "folder_open Base de conhecimento" [ref=e306]:
                    - /url: /o/37078/knowledge_repositories
                    - generic [ref=e307]:
                      - generic [ref=e309]: folder_open
                      - generic [ref=e310]: Base de conhecimento
            - listitem [ref=e311] [cursor=pointer]:
              - link "group Usuários" [ref=e312]:
                - /url: /o/37078/users
                - generic [ref=e313]:
                  - generic [ref=e315]: group
                  - generic [ref=e316]: Usuários
            - listitem [ref=e317] [cursor=pointer]:
              - link "work Empresas" [ref=e318]:
                - /url: /o/37078/companies
                - generic [ref=e319]:
                  - generic [ref=e321]: work
                  - generic [ref=e322]: Empresas
            - listitem [ref=e323] [cursor=pointer]:
              - link "live_help Questionários" [ref=e324]:
                - /url: /o/37078/question_lists
                - generic [ref=e325]:
                  - generic [ref=e327]: live_help
                  - generic [ref=e328]: Questionários
            - listitem [ref=e329] [cursor=pointer]:
              - link "groups Comunidades" [ref=e330]:
                - /url: /o/37078/feed
                - generic [ref=e331]:
                  - generic [ref=e333]: groups
                  - generic [ref=e334]: Comunidades
            - listitem [ref=e335] [cursor=pointer]:
              - generic [ref=e337]:
                - generic [ref=e340]: psychology
                - generic [ref=e341]:
                  - text: Skills
                  - generic [ref=e342]: BETA
                - generic [ref=e344]: G
            - listitem [ref=e345] [cursor=pointer]:
              - generic [ref=e347]:
                - generic [ref=e350]: monitoring
                - generic [ref=e351]:
                  - text: Planos e Metas
                  - generic [ref=e352]: BETA
                - generic [ref=e354]: G
        - generic [ref=e356]: registrostrial
        - list [ref=e357]:
          - listitem [ref=e358] [cursor=pointer]:
            - generic [ref=e360]:
              - generic [ref=e362]: f
              - generic [ref=e363]: Configurações
              - generic [ref=e365]: G
            - text: e    s 
      - generic [ref=e367]:
        - generic [ref=e372]: Registros
        - generic [ref=e381]:
          - tablist [ref=e382]:
            - tab "Registros" [selected] [ref=e383] [cursor=pointer]
            - tab "Provedores" [ref=e384] [cursor=pointer]
          - tabpanel "Registros" [ref=e386]:
            - generic [ref=e387]:
              - generic [ref=e389]:
                - generic [ref=e390]:
                  - img [ref=e391]
                  - paragraph [ref=e393]: "0"
                - paragraph [ref=e394]: Emitidos
              - generic [ref=e396]:
                - generic [ref=e397]:
                  - img [ref=e398]
                  - paragraph [ref=e400]: "0"
                - paragraph [ref=e401]: Expirados
              - generic [ref=e403]:
                - generic [ref=e404]:
                  - img [ref=e405]
                  - paragraph [ref=e407]: "0"
                - paragraph [ref=e408]: Pendentes
              - generic [ref=e410]:
                - generic [ref=e411]:
                  - img [ref=e412]
                  - paragraph [ref=e414]: "0"
                - paragraph [ref=e415]: Recusados
            - generic [ref=e416]:
              - generic [ref=e417]: schedule
              - paragraph [ref=e418]: "Carga horária total: 0 horas"
            - generic [ref=e419]:
              - generic [ref=e420]:
                - link "Adicionar" [ref=e421] [cursor=pointer]:
                  - /url: /o/37078/records/new
                  - button "Adicionar" [ref=e422]:
                    - img [ref=e424]
                    - text: Adicionar
                - button "Ações em massa" [ref=e426] [cursor=pointer]
                - button "ios_share Extrair dados" [ref=e428] [cursor=pointer]:
                  - generic [ref=e429]: ios_share
                  - text: Extrair dados
                - generic [ref=e430]:
                  - generic [ref=e431]:
                    - img [ref=e433]
                    - textbox "Pesquise por pessoa, conteúdo ou provedor" [ref=e435]
                  - generic [ref=e436]:
                    - generic [ref=e437] [cursor=pointer]: grid_view
                    - generic [ref=e438] [cursor=pointer]: reorder
                  - button "Filtro" [ref=e439] [cursor=pointer]:
                    - generic [ref=e441]: filter_alt
                    - paragraph [ref=e443]: Filtro
              - table [ref=e445]:
                - rowgroup [ref=e446]:
                  - row "Pessoa Conteúdo Origem Criado por Experiência Provedor Website Evidências Carga horária Situação Situação do certificado" [ref=e447]:
                    - columnheader [ref=e448]:
                      - checkbox [ref=e451]
                    - columnheader "Pessoa" [ref=e453] [cursor=pointer]:
                      - generic [ref=e456]:
                        - text: Pessoa
                        - img [ref=e457]
                    - columnheader "Conteúdo" [ref=e459] [cursor=pointer]:
                      - generic [ref=e462]:
                        - text: Conteúdo
                        - img [ref=e463]
                    - columnheader "Origem" [ref=e465] [cursor=pointer]:
                      - generic [ref=e467]:
                        - generic [ref=e468]:
                          - text: Origem
                          - img [ref=e469]
                        - img [ref=e472]
                    - columnheader "Criado por" [ref=e474] [cursor=pointer]:
                      - generic [ref=e477]:
                        - text: Criado por
                        - img [ref=e478]
                    - columnheader "Experiência" [ref=e480] [cursor=pointer]:
                      - generic [ref=e482]:
                        - generic [ref=e483]:
                          - text: Experiência
                          - img [ref=e484]
                        - img [ref=e487]
                    - columnheader "Provedor" [ref=e489] [cursor=pointer]:
                      - generic [ref=e491]:
                        - generic [ref=e492]:
                          - text: Provedor
                          - img [ref=e493]
                        - img [ref=e496]
                    - columnheader "Website" [ref=e498]:
                      - generic [ref=e499]: Website
                    - columnheader "Evidências" [ref=e500]:
                      - generic [ref=e501]: Evidências
                    - columnheader "Carga horária" [ref=e502] [cursor=pointer]:
                      - generic [ref=e504]:
                        - generic [ref=e505]:
                          - text: Carga horária
                          - img [ref=e506]
                        - img [ref=e509]
                    - columnheader "Situação" [ref=e511] [cursor=pointer]:
                      - generic [ref=e514]:
                        - text: Situação
                        - img [ref=e515]
                    - columnheader "Situação do certificado" [ref=e517] [cursor=pointer]:
                      - generic [ref=e519]:
                        - generic [ref=e520]:
                          - text: Situação do certificado
                          - img [ref=e521]
                        - img [ref=e524]
                    - columnheader [ref=e526]
                - rowgroup [ref=e527]:
                  - row "Não há dados para exibir" [ref=e528]:
                    - cell "Não há dados para exibir" [ref=e529]:
                      - generic [ref=e530]: Não há dados para exibir
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
  - generic:
    - generic:
      - tooltip "Registros cujo certificado expirou.": Registros cujo certificado expirou.
```

# Test source

```ts
  1   | // spec: testsuite "Trial (provisionamento e exclusão de dados)" → TC1
  2   | //       "Validar feature de Registros em trial criado via URL"
  3   | // seed: tests/seed.spec.ts
  4   | //
  5   | // Roda contra a org Trial dedicada (37078) provisionada via fluxo de
  6   | // criação web (a URL de registro é o próprio artefato do passo 1 da AT —
  7   | // a Trial já existe e está provisionada, ver data/trial-env.json). O teste
  8   | // valida que a feature de Registros está OPERANTE na Trial e que um registro
  9   | // Externo pode ser criado pela UI.
  10  | 
  11  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  12  | import * as allure from 'allure-js-commons';
  13  | import { NovoRegistroExternoPage } from '../../../pages/NovoRegistroExternoPage.js';
  14  | import { safeGoto } from '../../../../../src/utils/modals.js';
  15  | import { TRIAL } from './trial.shared.data.js';
  16  | import { buildTc1RecordInput } from './tc1-feature-registros-trial-via-url.data.js';
  17  | 
  18  | const SUITE = 'Trial (provisionamento e exclusão de dados)';
  19  | const STORY = 'TC1 — Validar feature de Registros em trial criado via URL';
  20  | 
  21  | interface RecordStats {
  22  |   by_status: { emitted: number; expired: number; pending: number; rejected: number };
  23  |   total_general: number;
  24  | }
  25  | 
  26  | async function getStats(page: import('@playwright/test').Page): Promise<RecordStats> {
  27  |   const res = await page.request.get(`/api/v1/o/${TRIAL.orgId}/records/stats`, {
  28  |     headers: { Accept: 'application/json' },
  29  |   });
  30  |   const j = await res.json();
  31  |   return (j?.data ?? j) as RecordStats;
  32  | }
  33  | 
  34  | async function listContents(page: import('@playwright/test').Page): Promise<string[]> {
  35  |   const res = await page.request.get(`/api/v1/o/${TRIAL.orgId}/records?per_page=200`, {
  36  |     headers: { Accept: 'application/json' },
  37  |   });
  38  |   const j = await res.json().catch(() => null);
  39  |   const arr = j && (Array.isArray(j.data) ? j.data : j.data?.records ?? j.records ?? []);
  40  |   return (Array.isArray(arr) ? arr : []).map((r: { content?: string }) => r.content ?? '');
  41  | }
  42  | 
  43  | test.describe(SUITE, () => {
  44  |   // Login explícito autorizado para Trial — globalSetup cobre só env principal/secundário
  45  |   // do projeto. Ver `testar-exclusao-dados-trial-twygo` §"Storage state da Trial".
  46  |   test.use({
  47  |     baseURL: TRIAL.url,
  48  |     storageState: { cookies: [], origins: [] },
  49  |   });
  50  | 
  51  |   test.beforeEach(async ({ page }, testInfo) => {
  52  |     testInfo.annotations.push(
  53  |       { type: 'baseURL', description: TRIAL.url },
  54  |       { type: 'orgId', description: String(TRIAL.orgId) },
  55  |       { type: 'emailRef', description: `\${${TRIAL.emailEnvVar}}` },
  56  |       { type: 'passwordRef', description: `\${${TRIAL.passwordEnvVar}}` },
  57  |       { type: 'envLabel', description: 'trial-registros-externos (Trial registros-externos)' },
  58  |     );
  59  |     await page.goto('/users/login');
  60  |     await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
  61  |     await page.getByRole('textbox', { name: 'Senha' }).fill(TRIAL.password);
  62  |     await page.getByRole('button', { name: 'Entrar' }).click();
  63  |     await page.waitForURL((url) => !url.pathname.startsWith('/users/login'), { timeout: 30_000 });
  64  |   });
  65  | 
  66  |   test('Validar feature de Registros em trial criado via URL', async ({ page, step }) => {
  67  |     await allure.epic('Twygo - Registros de Aprendizagem');
  68  |     await allure.feature(SUITE);
  69  |     await allure.story(STORY);
  70  |     await allure.severity('critical');
  71  | 
  72  |     const data = buildTc1RecordInput(test.info().workerIndex);
  73  | 
  74  |     await step('1. Trial provisionada via URL — login do admin disponível', async () => {
  75  |       // O passo "criar org trial pela URL" é o provisionamento (data/trial-env.json).
  76  |       // Aqui validamos o seu efeito: o admin loga e a org responde.
  77  |       await safeGoto(page, `/o/${TRIAL.orgId}/records`);
  78  |       await expect(page).toHaveURL(new RegExp(`/o/${TRIAL.orgId}/records`));
  79  |     });
  80  | 
  81  |     await step('2. Tela Registros carrega com tabs Registros/Provedores + seed SophiaTech', async () => {
  82  |       await expect(page.getByRole('tab', { name: 'Registros' })).toBeVisible();
  83  |       await expect(page.getByRole('tab', { name: 'Provedores' })).toBeVisible();
  84  |       // Seed pré-definido da SophiaTech presente: KPI de emitidos > 0.
  85  |       const stats = await getStats(page);
> 86  |       expect(stats.by_status.emitted, 'Trial deve ter registros pré-definidos da SophiaTech (emitidos > 0)').toBeGreaterThan(0);
      |                                                                                                              ^ Error: Trial deve ter registros pré-definidos da SophiaTech (emitidos > 0)
  87  |     });
  88  | 
  89  |     await step('3. Criar registro Externo pela UI → aparece na lista e KPIs atualizam', async () => {
  90  |       const before = await getStats(page);
  91  | 
  92  |       const form = new NovoRegistroExternoPage(page, TRIAL.orgId);
  93  |       await form.goto();
  94  |       await form.createExternalRecord({
  95  |         provider: data.provider,
  96  |         content: data.contentMarker,
  97  |         experience: data.experience,
  98  |         category: data.category,
  99  |         workload: data.workload,
  100 |         endDate: data.endDate,
  101 |       });
  102 | 
  103 |       // Redirecionou pra listagem; registro persistido e contagem subiu.
  104 |       await expect(page).toHaveURL(new RegExp(`/o/${TRIAL.orgId}/records`));
  105 |       await expect(async () => {
  106 |         const contents = await listContents(page);
  107 |         expect(contents, 'registro criado deve aparecer na listagem').toContain(data.contentMarker);
  108 |         const after = await getStats(page);
  109 |         expect(
  110 |           after.total_general,
  111 |           `total de registros deve aumentar (antes=${before.total_general})`,
  112 |         ).toBeGreaterThan(before.total_general);
  113 |       }).toPass({ timeout: 30_000 });
  114 |     });
  115 |   });
  116 | });
  117 | 
```