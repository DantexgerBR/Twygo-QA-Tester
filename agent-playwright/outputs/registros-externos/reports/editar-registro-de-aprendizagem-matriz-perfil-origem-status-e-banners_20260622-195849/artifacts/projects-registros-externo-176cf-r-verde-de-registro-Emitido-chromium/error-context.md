# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\editar-registro-matriz-perfil-origem-status-banners\tc10-banner-verde-emitido.spec.ts >> Editar registro de aprendizagem (matriz perfil × origem × status e banners) >> Validar banner verde de registro Emitido
- Location: projects\registros-externos\tests\features\editar-registro-matriz-perfil-origem-status-banners\tc10-banner-verde-emitido.spec.ts:11:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Certificado aprovado').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Certificado aprovado').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Registros F2" [ref=e4]:
        - img "Logo - Registros F2" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/37079/dashboard
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
                  - /url: /o/37079/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/37079/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/37079/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/37079/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
              - listitem [ref=e51]:
                - link "folder_open Base de conhecimento" [ref=e52] [cursor=pointer]:
                  - /url: /o/37079/knowledge_repositories
                  - generic [ref=e53]:
                    - generic [ref=e55]: folder_open
                    - generic [ref=e56]: Base de conhecimento
          - listitem [ref=e57]:
            - link "group Usuários" [ref=e58] [cursor=pointer]:
              - /url: /o/37079/users
              - generic [ref=e59]:
                - generic [ref=e61]: group
                - generic [ref=e62]: Usuários
          - listitem [ref=e63]:
            - link "work Empresas" [ref=e64] [cursor=pointer]:
              - /url: /o/37079/companies
              - generic [ref=e65]:
                - generic [ref=e67]: work
                - generic [ref=e68]: Empresas
          - listitem [ref=e69]:
            - link "live_help Questionários" [ref=e70] [cursor=pointer]:
              - /url: /o/37079/question_lists
              - generic [ref=e71]:
                - generic [ref=e73]: live_help
                - generic [ref=e74]: Questionários
          - listitem [ref=e75]:
            - link "groups Comunidades" [ref=e76] [cursor=pointer]:
              - /url: /o/37079/feed
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
                  - /url: /o/37079/organization_chart
                  - generic [ref=e92]:
                    - generic [ref=e94]: lan
                    - generic [ref=e95]: Organograma
              - listitem [ref=e96]:
                - link "badge Funções de negócio" [ref=e97] [cursor=pointer]:
                  - /url: /o/37079/roles
                  - generic [ref=e98]:
                    - generic [ref=e100]: badge
                    - generic [ref=e101]: Funções de negócio
              - listitem [ref=e102]:
                - link "award_star Competências" [ref=e103] [cursor=pointer]:
                  - /url: /o/37079/organization_chart_competencies
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
                  - /url: /o/37079/admin/pdis
                  - generic [ref=e119]:
                    - generic [ref=e121]: track_changes
                    - generic [ref=e122]: PDI
      - generic [ref=e123]: Registros F2
      - list [ref=e124]:
        - listitem [ref=e125]:
          - generic [ref=e127]:
            - generic [ref=e129]: f
            - generic [ref=e130]: Configurações
          - list [ref=e131]:
            - listitem [ref=e132]:
              - link "e Organização" [ref=e133] [cursor=pointer]:
                - /url: /o/37079/edit
                - generic [ref=e134]:
                  - generic [ref=e136]: e
                  - generic [ref=e137]: Organização
            - listitem [ref=e138]:
              - link " Navegação" [ref=e139] [cursor=pointer]:
                - /url: /o/37079/use_modes
                - generic [ref=e140]:
                  - generic [ref=e142]: 
                  - generic [ref=e143]: Navegação
            - listitem [ref=e144]:
              - link "electrical_services Integrações" [ref=e145] [cursor=pointer]:
                - /url: /o/37079/integrations
                - generic [ref=e146]:
                  - generic [ref=e148]: electrical_services
                  - generic [ref=e149]: Integrações
            - listitem [ref=e150]:
              - link "flash_auto Piloto automático" [ref=e151] [cursor=pointer]:
                - /url: /o/37079/autopilots
                - generic [ref=e152]:
                  - generic [ref=e154]: flash_auto
                  - generic [ref=e155]: Piloto automático
            - listitem [ref=e156]:
              - link " Regras do Jogo" [ref=e157] [cursor=pointer]:
                - /url: /o/37079/game_rules
                - generic [ref=e158]:
                  - generic [ref=e160]: 
                  - generic [ref=e161]: Regras do Jogo
            - listitem [ref=e162]:
              - link " Comunicação" [ref=e163] [cursor=pointer]:
                - /url: /o/37079/communication
                - generic [ref=e164]:
                  - generic [ref=e166]: 
                  - generic [ref=e167]: Comunicação
            - listitem [ref=e168]:
              - link "sell Cobrança de inscrição" [ref=e169] [cursor=pointer]:
                - /url: /o/37079/payments
                - generic [ref=e170]:
                  - generic [ref=e172]: sell
                  - generic [ref=e173]: Cobrança de inscrição
            - listitem [ref=e174]:
              - link "credit_card Plano e assinatura" [ref=e175] [cursor=pointer]:
                - /url: /o/37079/subscription_plans
                - generic [ref=e176]:
                  - generic [ref=e178]: credit_card
                  - generic [ref=e179]: Plano e assinatura
            - text: s
            - listitem [ref=e180]:
              - link " Segurança NOVO" [ref=e181] [cursor=pointer]:
                - /url: /o/37079/security
                - generic [ref=e182]:
                  - generic [ref=e184]: 
                  - generic [ref=e185]: Segurança NOVO
            - listitem [ref=e186]:
              - link "smart_toy Controle de IA BETA" [ref=e187] [cursor=pointer]:
                - /url: /o/37079/ai_consumption_analysis
                - generic [ref=e188]:
                  - generic [ref=e190]: smart_toy
                  - generic [ref=e191]: Controle de IA BETA
            - listitem [ref=e192]:
              - link "palette Aparência" [ref=e193] [cursor=pointer]:
                - /url: /o/37079/appearance
                - generic [ref=e194]:
                  - generic [ref=e196]: palette
                  - generic [ref=e197]: Aparência
    - generic [ref=e200]:
      - generic [ref=e201]:
        - img [ref=e202]
        - text: Richard Sebold
      - img [ref=e204]
  - text: "0"
  - generic [ref=e207]:
    - generic "Logo - Registros F2" [ref=e209]:
      - link "Registros F2" [ref=e211] [cursor=pointer]:
        - /url: /o/37079/dashboard
    - generic [ref=e215]:
      - button "Twygo Academy" [ref=e219] [cursor=pointer]:
        - generic [ref=e220]: school
      - link "Open chat" [ref=e224] [cursor=pointer]:
        - /url: /o/37079/chats
        - button "Open chat" [ref=e225]:
          - img [ref=e226]
      - button "Users" [ref=e233] [cursor=pointer]:
        - img [ref=e234]
      - generic [ref=e237]:
        - link "7094579 - Richard Sebold" [ref=e238] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e239]: Richard Sebold
      - button "Administrador G" [ref=e240] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e241]: G
    - text: M * * M * *
  - generic [ref=e244]:
    - generic [ref=e246]:
      - list [ref=e247]:
        - list [ref=e248]:
          - listitem [ref=e249] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e250]:
              - /url: /o/37079/dashboard
              - generic [ref=e251]:
                - generic [ref=e253]: leaderboard
                - generic [ref=e254]: Dashboard
          - listitem [ref=e255] [cursor=pointer]:
            - generic [ref=e257]:
              - generic [ref=e260]: school
              - generic [ref=e261]: Aprendizagem
              - generic [ref=e263]: G
            - list [ref=e264]:
              - listitem [ref=e265]:
                - link "format_list_bulleted_add Conteúdos" [ref=e266]:
                  - /url: /o/37079/events?tab=events
                  - generic [ref=e267]:
                    - generic [ref=e269]: format_list_bulleted_add
                    - generic [ref=e270]: Conteúdos
              - listitem [ref=e271]:
                - link "send Compartilhamentos" [ref=e272]:
                  - /url: /o/37079/shared_events
                  - generic [ref=e273]:
                    - generic [ref=e275]: send
                    - generic [ref=e276]: Compartilhamentos
              - listitem [ref=e277]:
                - link "description Registros BETA" [ref=e278]:
                  - /url: /o/37079/records
                  - generic [ref=e279]:
                    - generic [ref=e281]: description
                    - generic [ref=e282]: Registros
                    - generic [ref=e283]: BETA
              - listitem [ref=e284]:
                - link "workspace_premium Certificados" [ref=e285]:
                  - /url: /o/37079/certificate_models
                  - generic [ref=e286]:
                    - generic [ref=e288]: workspace_premium
                    - generic [ref=e289]: Certificados
              - listitem [ref=e290]:
                - link "folder_open Base de conhecimento" [ref=e291]:
                  - /url: /o/37079/knowledge_repositories
                  - generic [ref=e292]:
                    - generic [ref=e294]: folder_open
                    - generic [ref=e295]: Base de conhecimento
          - listitem [ref=e296] [cursor=pointer]:
            - link "group Usuários" [ref=e297]:
              - /url: /o/37079/users
              - generic [ref=e298]:
                - generic [ref=e300]: group
                - generic [ref=e301]: Usuários
          - listitem [ref=e302] [cursor=pointer]:
            - link "work Empresas" [ref=e303]:
              - /url: /o/37079/companies
              - generic [ref=e304]:
                - generic [ref=e306]: work
                - generic [ref=e307]: Empresas
          - listitem [ref=e308] [cursor=pointer]:
            - link "live_help Questionários" [ref=e309]:
              - /url: /o/37079/question_lists
              - generic [ref=e310]:
                - generic [ref=e312]: live_help
                - generic [ref=e313]: Questionários
          - listitem [ref=e314] [cursor=pointer]:
            - link "groups Comunidades" [ref=e315]:
              - /url: /o/37079/feed
              - generic [ref=e316]:
                - generic [ref=e318]: groups
                - generic [ref=e319]: Comunidades
          - listitem [ref=e320] [cursor=pointer]:
            - generic [ref=e322]:
              - generic [ref=e325]: psychology
              - generic [ref=e326]:
                - text: Skills
                - generic [ref=e327]: BETA
              - generic [ref=e329]: G
          - listitem [ref=e330] [cursor=pointer]:
            - generic [ref=e332]:
              - generic [ref=e335]: monitoring
              - generic [ref=e336]:
                - text: Planos e Metas
                - generic [ref=e337]: BETA
              - generic [ref=e339]: G
      - generic [ref=e341]: Registros F2
      - list [ref=e342]:
        - listitem [ref=e343] [cursor=pointer]:
          - generic [ref=e345]:
            - generic [ref=e347]: f
            - generic [ref=e348]: Configurações
            - generic [ref=e350]: G
          - text: e    s 
    - generic [ref=e352]:
      - generic [ref=e355]: Registros > Editar
      - generic [ref=e362]:
        - generic [ref=e364]:
          - button "Voltar" [ref=e366] [cursor=pointer]:
            - img [ref=e368]
            - text: Voltar
          - heading "QAKPIRT-TC7-w1-1782160082984-7" [level=2] [ref=e372]
        - generic [ref=e376]:
          - generic [ref=e377]:
            - generic [ref=e379]:
              - group [ref=e381]:
                - generic [ref=e383]:
                  - generic [ref=e384]: Website
                  - img [ref=e386]
                - textbox "Website" [ref=e389]:
                  - /placeholder: https://exemplo.com
              - group [ref=e391]:
                - generic [ref=e393]:
                  - paragraph [ref=e394]: Evidência de aprendizagem
                  - img [ref=e396]
                - generic [ref=e398]:
                  - generic [ref=e400]:
                    - paragraph [ref=e401]: Arquivo
                    - generic [ref=e402]:
                      - generic [ref=e403]:
                        - text: "Formato aceito:"
                        - generic [ref=e404]: .pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png.
                      - generic [ref=e405]:
                        - text: "Tamanho máximo:"
                        - generic [ref=e406]: 10 MB.
                      - generic [ref=e407]:
                        - text: "Quantidade máxima:"
                        - generic [ref=e408]: 5 arquivos.
                  - paragraph [ref=e409]: "Dica: envie certificados, listas de presença ou outros comprovantes para que a IA reconheça e preencha os dados automaticamente."
                  - generic [ref=e410] [cursor=pointer]:
                    - generic [ref=e411]: upload_file
                    - paragraph [ref=e412]: Arraste o arquivo ou clique para selecionar
            - separator [ref=e414]
          - generic [ref=e415]:
            - generic [ref=e417]:
              - generic [ref=e419]:
                - generic [ref=e421]:
                  - generic [ref=e422]: Pessoas
                  - generic [ref=e423]: "*"
                  - img [ref=e425]
                - generic [ref=e427]:
                  - paragraph [ref=e428]: QA11 TC3
                  - img
              - group [ref=e430]:
                - generic [ref=e432]:
                  - generic [ref=e433]: Provedor
                  - generic [ref=e434]: "*"
                  - img [ref=e436]
                - generic [ref=e438]:
                  - log [ref=e440]
                  - generic [ref=e441]:
                    - generic [ref=e442]:
                      - generic [ref=e443]: Alura
                      - combobox [ref=e445]
                    - generic [ref=e446]:
                      - img [ref=e448]
                      - img [ref=e452]
              - group [ref=e455]:
                - generic [ref=e457]:
                  - generic [ref=e458]: Conteúdo
                  - generic [ref=e459]: "*"
                  - img [ref=e461]
                - generic [ref=e463]:
                  - log [ref=e465]
                  - generic [ref=e466]:
                    - generic [ref=e467]:
                      - generic [ref=e468]: QAKPIRT-TC7-w1-1782160082984-7
                      - combobox [ref=e470]
                    - generic [ref=e471]:
                      - img [ref=e473]
                      - img [ref=e477]
              - generic [ref=e480]:
                - generic [ref=e483]: Descrição
                - generic [ref=e485]:
                  - toolbar [ref=e486]:
                    - generic [ref=e487]:
                      - generic [ref=e488]:
                        - generic [ref=e490]:
                          - button [disabled]:
                            - img
                          - button [disabled]:
                            - img
                        - button [ref=e494] [cursor=pointer]:
                          - img
                        - group [ref=e498]:
                          - radio "Parágrafo" [ref=e499] [cursor=pointer]:
                            - generic [ref=e500]: Parágrafo
                            - generic [ref=e501]:
                              - img: "true"
                        - generic [ref=e505]:
                          - button [ref=e506] [cursor=pointer]:
                            - img
                          - textbox [ref=e507]: "16"
                          - button [ref=e508] [cursor=pointer]:
                            - img
                      - button "more_horiz" [ref=e509] [cursor=pointer]:
                        - generic [ref=e510]: more_horiz
                  - textbox [ref=e512]:
                    - generic [ref=e516]:
                      - button [ref=e518] [cursor=pointer]:
                        - generic:
                          - img
                      - button [ref=e519] [cursor=pointer]:
                        - button [ref=e520]:
                          - img [ref=e521]
              - group [ref=e531]:
                - generic [ref=e533]:
                  - generic [ref=e534]: Tipo de experiência
                  - generic [ref=e535]: "*"
                  - img [ref=e537]
                - generic [ref=e539]:
                  - log [ref=e541]
                  - generic [ref=e542]:
                    - generic [ref=e543]:
                      - generic [ref=e544]: Curso
                      - combobox [ref=e546]
                    - generic [ref=e547]:
                      - img [ref=e549]
                      - img [ref=e553]
              - group [ref=e556]:
                - generic [ref=e558]:
                  - generic [ref=e559]: Categorias
                  - generic [ref=e560]: "*"
                  - img [ref=e562]
                - generic [ref=e564]:
                  - log [ref=e566]
                  - generic [ref=e567]:
                    - generic [ref=e568]:
                      - generic [ref=e569]:
                        - generic [ref=e570]: Tecnologia
                        - button "Remove Tecnologia" [ref=e571] [cursor=pointer]:
                          - img [ref=e572]
                      - combobox [ref=e575]
                    - generic [ref=e576]:
                      - img [ref=e578]
                      - img [ref=e582]
              - group [ref=e585]:
                - generic [ref=e587]:
                  - generic [ref=e588]: Carga horária
                  - generic [ref=e589]: "*"
                  - img [ref=e591]
                - textbox "Carga horária *" [ref=e594]:
                  - /placeholder: HH:MM:SS
                  - text: 0040:00:00
              - group [ref=e597]:
                - generic [ref=e600]:
                  - text: Desempenho
                  - img [ref=e602]
                - generic [ref=e604]:
                  - spinbutton "Desempenho" [ref=e606]
                  - generic [ref=e607]: "%"
              - group [ref=e610]:
                - generic [ref=e612]:
                  - generic [ref=e613]: Valor do conteúdo
                  - img [ref=e615]
                - textbox "Valor do conteúdo" [ref=e618]:
                  - /placeholder: "Informe o valor investido (ex: 1.500,00)"
            - separator [ref=e620]
          - generic [ref=e623]:
            - heading "Datas" [level=2] [ref=e625]:
              - generic [ref=e627]: Datas
            - group [ref=e629]:
              - generic [ref=e632]: Data de início
              - textbox "Data de início" [ref=e634]:
                - /placeholder: ""
            - group [ref=e636]:
              - generic [ref=e638]:
                - generic [ref=e639]: Data de término
                - generic [ref=e640]: "*"
              - textbox "Data de término *" [ref=e642]:
                - /placeholder: ""
                - text: 2026-05-10
            - group [ref=e644]:
              - generic [ref=e647]: Data de aprovação
              - textbox "Data de aprovação" [ref=e649]:
                - /placeholder: ""
                - text: 2026-06-22
            - group [ref=e651]:
              - generic [ref=e654]: Data do certificado
              - textbox "Data do certificado" [ref=e656]:
                - /placeholder: ""
            - group [ref=e658]:
              - generic [ref=e661]: Data de validade
              - textbox "Data de validade" [ref=e663]:
                - /placeholder: ""
          - generic [ref=e665]:
            - button "Salvar" [ref=e666] [cursor=pointer]
            - button "Cancelar" [ref=e667] [cursor=pointer]
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
  - textbox [ref=e668]
```

# Test source

```ts
  1  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2  | import * as allure from 'allure-js-commons';
  3  | import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';
  4  | 
  5  | const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';
  6  | 
  7  | // DIVERGÊNCIA (recon 2026-06-22): o form de edição do registro Externo Emitido NÃO exibe
  8  | // o banner verde "Certificado aprovado" nem o botão "Histórico" da RN46 — não há banner
  9  | // contextual algum no form. Assere a expectativa da AT e falha vermelho.
  10 | test.describe(SUITE, () => {
  11 |   test('Validar banner verde de registro Emitido', async ({ page }) => {
  12 |     await allure.epic('Twygo - Registros de Aprendizagem');
  13 |     await allure.feature(SUITE);
  14 |     await allure.story('TC10 — banner verde de registro Emitido');
  15 |     await allure.severity('normal');
  16 | 
  17 |     const lista = new RegistrosListPage(page);
  18 |     const form = new RegistroFormPage(page);
  19 | 
  20 |     await allure.step('Admin: abrir "Editar" de um Externo Emitido', async () => {
  21 |       await lista.gotoAdmin();
  22 |       const id = await lista.findRecordId('external', 'Emitido');
  23 |       expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
  24 |       await lista.openEdit(id!);
  25 |     });
  26 | 
  27 |     await allure.step('Banner verde "Certificado aprovado" + botão "Histórico" (RN46)', async () => {
> 28 |       await expect(form.greenBanner().first()).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  29 |       await expect(form.historicoButton().first()).toBeVisible();
  30 |     });
  31 |   });
  32 | });
  33 | 
```