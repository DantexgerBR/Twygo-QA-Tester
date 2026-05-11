# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-associado-modal.spec.ts >> Ativar / Inativar painel >> Tentar inativar painel associado a modos de uso exibe modal de bloqueio
- Location: projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-associado-modal.spec.ts:102:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.chakra-modal__content').filter({ has: locator('[data-test-id="panel-in-use-modal-confirm"]') })

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - link "palette Aparência" [ref=e174] [cursor=pointer]:
                - /url: /o/36988/appearance
                - generic [ref=e175]: palette
                - text: Aparência
            - listitem [ref=e176]:
              - link "smart_toy Controle de IA BETA" [ref=e177] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e178]: smart_toy
                - text: Controle de IA BETA
    - generic [ref=e181]:
      - generic [ref=e182]:
        - img [ref=e183]
        - text: Claude Agents
      - img [ref=e185]
  - text: "0"
  - generic [ref=e188]:
    - generic "Logo - widgets [36988]" [ref=e190]:
      - link "Logo - widgets [36988]" [ref=e191] [cursor=pointer]:
        - /url: /o/36988/dashboard
        - img "Logo - widgets [36988]" [ref=e192]
    - generic [ref=e196]:
      - link "Open chat" [ref=e200] [cursor=pointer]:
        - /url: /o/36988/chats
        - button "Open chat" [ref=e201]:
          - img [ref=e202]
      - button "Users" [ref=e209] [cursor=pointer]:
        - img [ref=e210]
      - generic [ref=e213]:
        - link "7089491 - Claude Agents" [ref=e214] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e215]: Claude Agents
      - button "Administrador G" [ref=e216] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e217]: G
    - text: M * * M * *
  - generic [ref=e218]:
    - generic [ref=e228]:
      - generic [ref=e229]:
        - paragraph [ref=e230]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 20/05.
        - paragraph [ref=e231]: Quer mais detalhes sobre essa novidade? Veja aqui
      - button "Responder pesquisa" [ref=e233] [cursor=pointer]
      - button "Close" [ref=e234] [cursor=pointer]:
        - img [ref=e235]
    - generic [ref=e238]:
      - generic [ref=e240]:
        - list [ref=e241]:
          - list [ref=e242]:
            - listitem [ref=e243] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e244]:
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
              - link "group Usuários" [ref=e259]:
                - /url: /o/36988/users
                - generic [ref=e260]:
                  - generic [ref=e262]: group
                  - generic [ref=e263]: Usuários
            - listitem [ref=e264] [cursor=pointer]:
              - link "work Empresas" [ref=e265]:
                - /url: /o/36988/companies
                - generic [ref=e266]:
                  - generic [ref=e268]: work
                  - generic [ref=e269]: Empresas
            - listitem [ref=e270] [cursor=pointer]:
              - link "live_help Questionários" [ref=e271]:
                - /url: /o/36988/question_lists
                - generic [ref=e272]:
                  - generic [ref=e274]: live_help
                  - generic [ref=e275]: Questionários
            - listitem [ref=e276] [cursor=pointer]:
              - link "groups Comunidades" [ref=e277]:
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
        - generic [ref=e312]: Menu > Modos de uso
        - generic [ref=e321]:
          - tablist [ref=e322]:
            - tab "Modos de uso" [ref=e323] [cursor=pointer]
            - tab "Painéis" [selected] [ref=e324] [cursor=pointer]
          - tabpanel "Painéis" [active] [ref=e326]:
            - generic [ref=e327]:
              - link "Adicionar" [ref=e328] [cursor=pointer]:
                - /url: /o/36988/panels/new
                - button "Adicionar" [ref=e329]:
                  - img [ref=e331]
                  - text: Adicionar
              - generic [ref=e333]:
                - generic [ref=e334]:
                  - img [ref=e336]
                  - textbox "Pesquise por nome ou descrição" [ref=e338]
                - generic [ref=e339]:
                  - generic [ref=e340] [cursor=pointer]: grid_view
                  - generic [ref=e341] [cursor=pointer]: reorder
                - button "Filtro" [ref=e342] [cursor=pointer]:
                  - generic [ref=e344]: filter_alt
                  - paragraph [ref=e346]: Filtro
            - table [ref=e348]:
              - rowgroup [ref=e349]:
                - row "Nome Descrição Data de criação Ativo?" [ref=e350]:
                  - columnheader "Nome" [ref=e351] [cursor=pointer]:
                    - generic [ref=e354]:
                      - text: Nome
                      - img [ref=e355]
                  - columnheader "Descrição" [ref=e357]:
                    - generic [ref=e358]: Descrição
                  - columnheader "Data de criação" [ref=e359] [cursor=pointer]:
                    - generic [ref=e362]:
                      - text: Data de criação
                      - img [ref=e363]
                  - columnheader "Ativo?" [ref=e365] [cursor=pointer]:
                    - generic [ref=e368]:
                      - text: Ativo?
                      - img [ref=e369]
                  - columnheader [ref=e371]
              - rowgroup [ref=e372]:
                - row "Painel Voltar Step 1778530717113 11/05/2026 edit content_copy delete" [ref=e373]:
                  - cell "Painel Voltar Step 1778530717113" [ref=e374]:
                    - paragraph [ref=e375]: Painel Voltar Step 1778530717113
                  - cell [ref=e376]:
                    - paragraph [ref=e377]
                  - cell "11/05/2026" [ref=e378]
                  - cell [ref=e379]:
                    - checkbox [checked] [ref=e381]
                  - cell "edit content_copy delete" [ref=e384]:
                    - generic [ref=e386]:
                      - generic [ref=e389] [cursor=pointer]: edit
                      - generic [ref=e392] [cursor=pointer]: content_copy
                      - generic [ref=e395] [cursor=pointer]: delete
                - row "Painel Limite Nome Aba 1778530711806 11/05/2026 edit content_copy delete" [ref=e396]:
                  - cell "Painel Limite Nome Aba 1778530711806" [ref=e397]:
                    - paragraph [ref=e398]: Painel Limite Nome Aba 1778530711806
                  - cell [ref=e399]:
                    - paragraph [ref=e400]
                  - cell "11/05/2026" [ref=e401]
                  - cell [ref=e402]:
                    - checkbox [checked] [ref=e404]
                  - cell "edit content_copy delete" [ref=e407]:
                    - generic [ref=e409]:
                      - generic [ref=e412] [cursor=pointer]: edit
                      - generic [ref=e415] [cursor=pointer]: content_copy
                      - generic [ref=e418] [cursor=pointer]: delete
                - row "Painel Nova Aba 1778530706198 11/05/2026 edit content_copy delete" [ref=e419]:
                  - cell "Painel Nova Aba 1778530706198" [ref=e420]:
                    - paragraph [ref=e421]: Painel Nova Aba 1778530706198
                  - cell [ref=e422]:
                    - paragraph [ref=e423]
                  - cell "11/05/2026" [ref=e424]
                  - cell [ref=e425]:
                    - checkbox [checked] [ref=e427]
                  - cell "edit content_copy delete" [ref=e430]:
                    - generic [ref=e432]:
                      - generic [ref=e435] [cursor=pointer]: edit
                      - generic [ref=e438] [cursor=pointer]: content_copy
                      - generic [ref=e441] [cursor=pointer]: delete
                - row "Áéíóú ç ñ - _ . / 123 !@# 1778530703649 11/05/2026 edit content_copy delete" [ref=e442]:
                  - cell "Áéíóú ç ñ - _ . / 123 !@# 1778530703649" [ref=e443]:
                    - paragraph [ref=e444]: Áéíóú ç ñ - _ . / 123 !@# 1778530703649
                  - cell [ref=e445]:
                    - paragraph [ref=e446]
                  - cell "11/05/2026" [ref=e447]
                  - cell [ref=e448]:
                    - checkbox [checked] [ref=e450]
                  - cell "edit content_copy delete" [ref=e453]:
                    - generic [ref=e455]:
                      - generic [ref=e458] [cursor=pointer]: edit
                      - generic [ref=e461] [cursor=pointer]: content_copy
                      - generic [ref=e464] [cursor=pointer]: delete
                - row "Painel Aba Unica 1778530691373 11/05/2026 edit content_copy delete" [ref=e465]:
                  - cell "Painel Aba Unica 1778530691373" [ref=e466]:
                    - paragraph [ref=e467]: Painel Aba Unica 1778530691373
                  - cell [ref=e468]:
                    - paragraph [ref=e469]
                  - cell "11/05/2026" [ref=e470]
                  - cell [ref=e471]:
                    - checkbox [checked] [ref=e473]
                  - cell "edit content_copy delete" [ref=e476]:
                    - generic [ref=e478]:
                      - generic [ref=e481] [cursor=pointer]: edit
                      - generic [ref=e484] [cursor=pointer]: content_copy
                      - generic [ref=e487] [cursor=pointer]: delete
                - row "Painel Renomear 1778530678012 11/05/2026 edit content_copy delete" [ref=e488]:
                  - cell "Painel Renomear 1778530678012" [ref=e489]:
                    - paragraph [ref=e490]: Painel Renomear 1778530678012
                  - cell [ref=e491]:
                    - paragraph [ref=e492]
                  - cell "11/05/2026" [ref=e493]
                  - cell [ref=e494]:
                    - checkbox [checked] [ref=e496]
                  - cell "edit content_copy delete" [ref=e499]:
                    - generic [ref=e501]:
                      - generic [ref=e504] [cursor=pointer]: edit
                      - generic [ref=e507] [cursor=pointer]: content_copy
                      - generic [ref=e510] [cursor=pointer]: delete
                - row "Painel Excluir Aba Multi 1778530675971 11/05/2026 edit content_copy delete" [ref=e511]:
                  - cell "Painel Excluir Aba Multi 1778530675971" [ref=e512]:
                    - paragraph [ref=e513]: Painel Excluir Aba Multi 1778530675971
                  - cell [ref=e514]:
                    - paragraph [ref=e515]
                  - cell "11/05/2026" [ref=e516]
                  - cell [ref=e517]:
                    - checkbox [checked] [ref=e519]
                  - cell "edit content_copy delete" [ref=e522]:
                    - generic [ref=e524]:
                      - generic [ref=e527] [cursor=pointer]: edit
                      - generic [ref=e530] [cursor=pointer]: content_copy
                      - generic [ref=e533] [cursor=pointer]: delete
                - row "Painel Cancelar Renomear 1778530675050 11/05/2026 edit content_copy delete" [ref=e534]:
                  - cell "Painel Cancelar Renomear 1778530675050" [ref=e535]:
                    - paragraph [ref=e536]: Painel Cancelar Renomear 1778530675050
                  - cell [ref=e537]:
                    - paragraph [ref=e538]
                  - cell "11/05/2026" [ref=e539]
                  - cell [ref=e540]:
                    - checkbox [checked] [ref=e542]
                  - cell "edit content_copy delete" [ref=e545]:
                    - generic [ref=e547]:
                      - generic [ref=e550] [cursor=pointer]: edit
                      - generic [ref=e553] [cursor=pointer]: content_copy
                      - generic [ref=e556] [cursor=pointer]: delete
                - row "Painel Adicionar Aba 1778530658927 11/05/2026 edit content_copy delete" [ref=e557]:
                  - cell "Painel Adicionar Aba 1778530658927" [ref=e558]:
                    - paragraph [ref=e559]: Painel Adicionar Aba 1778530658927
                  - cell [ref=e560]:
                    - paragraph [ref=e561]
                  - cell "11/05/2026" [ref=e562]
                  - cell [ref=e563]:
                    - checkbox [checked] [ref=e565]
                  - cell "edit content_copy delete" [ref=e568]:
                    - generic [ref=e570]:
                      - generic [ref=e573] [cursor=pointer]: edit
                      - generic [ref=e576] [cursor=pointer]: content_copy
                      - generic [ref=e579] [cursor=pointer]: delete
                - row "Painel A11y Teclado 1778530658924 11/05/2026 edit content_copy delete" [ref=e580]:
                  - cell "Painel A11y Teclado 1778530658924" [ref=e581]:
                    - paragraph [ref=e582]: Painel A11y Teclado 1778530658924
                  - cell [ref=e583]:
                    - paragraph [ref=e584]
                  - cell "11/05/2026" [ref=e585]
                  - cell [ref=e586]:
                    - checkbox [checked] [ref=e588]
                  - cell "edit content_copy delete" [ref=e591]:
                    - generic [ref=e593]:
                      - generic [ref=e596] [cursor=pointer]: edit
                      - generic [ref=e599] [cursor=pointer]: content_copy
                      - generic [ref=e602] [cursor=pointer]: delete
                - row "Painel Cancelar Criar Aba 1778530658924 11/05/2026 edit content_copy delete" [ref=e603]:
                  - cell "Painel Cancelar Criar Aba 1778530658924" [ref=e604]:
                    - paragraph [ref=e605]: Painel Cancelar Criar Aba 1778530658924
                  - cell [ref=e606]:
                    - paragraph [ref=e607]
                  - cell "11/05/2026" [ref=e608]
                  - cell [ref=e609]:
                    - checkbox [checked] [ref=e611]
                  - cell "edit content_copy delete" [ref=e614]:
                    - generic [ref=e616]:
                      - generic [ref=e619] [cursor=pointer]: edit
                      - generic [ref=e622] [cursor=pointer]: content_copy
                      - generic [ref=e625] [cursor=pointer]: delete
                - row "Painel Voltar Step 1778529456525 11/05/2026 edit content_copy delete" [ref=e626]:
                  - cell "Painel Voltar Step 1778529456525" [ref=e627]:
                    - paragraph [ref=e628]: Painel Voltar Step 1778529456525
                  - cell [ref=e629]:
                    - paragraph [ref=e630]
                  - cell "11/05/2026" [ref=e631]
                  - cell [ref=e632]:
                    - checkbox [checked] [ref=e634]
                  - cell "edit content_copy delete" [ref=e637]:
                    - generic [ref=e639]:
                      - generic [ref=e642] [cursor=pointer]: edit
                      - generic [ref=e645] [cursor=pointer]: content_copy
                      - generic [ref=e648] [cursor=pointer]: delete
                - row "Painel Limite Nome Aba 1778529455531 11/05/2026 edit content_copy delete" [ref=e649]:
                  - cell "Painel Limite Nome Aba 1778529455531" [ref=e650]:
                    - paragraph [ref=e651]: Painel Limite Nome Aba 1778529455531
                  - cell [ref=e652]:
                    - paragraph [ref=e653]
                  - cell "11/05/2026" [ref=e654]
                  - cell [ref=e655]:
                    - checkbox [checked] [ref=e657]
                  - cell "edit content_copy delete" [ref=e660]:
                    - generic [ref=e662]:
                      - generic [ref=e665] [cursor=pointer]: edit
                      - generic [ref=e668] [cursor=pointer]: content_copy
                      - generic [ref=e671] [cursor=pointer]: delete
                - row "Áéíóú ç ñ - _ . / 123 !@# 1778529452815 11/05/2026 edit content_copy delete" [ref=e672]:
                  - cell "Áéíóú ç ñ - _ . / 123 !@# 1778529452815" [ref=e673]:
                    - paragraph [ref=e674]: Áéíóú ç ñ - _ . / 123 !@# 1778529452815
                  - cell [ref=e675]:
                    - paragraph [ref=e676]
                  - cell "11/05/2026" [ref=e677]
                  - cell [ref=e678]:
                    - checkbox [checked] [ref=e680]
                  - cell "edit content_copy delete" [ref=e683]:
                    - generic [ref=e685]:
                      - generic [ref=e688] [cursor=pointer]: edit
                      - generic [ref=e691] [cursor=pointer]: content_copy
                      - generic [ref=e694] [cursor=pointer]: delete
                - row "Painel Nova Aba 1778529452954 11/05/2026 edit content_copy delete" [ref=e695]:
                  - cell "Painel Nova Aba 1778529452954" [ref=e696]:
                    - paragraph [ref=e697]: Painel Nova Aba 1778529452954
                  - cell [ref=e698]:
                    - paragraph [ref=e699]
                  - cell "11/05/2026" [ref=e700]
                  - cell [ref=e701]:
                    - checkbox [checked] [ref=e703]
                  - cell "edit content_copy delete" [ref=e706]:
                    - generic [ref=e708]:
                      - generic [ref=e711] [cursor=pointer]: edit
                      - generic [ref=e714] [cursor=pointer]: content_copy
                      - generic [ref=e717] [cursor=pointer]: delete
                - row "Painel Aba Unica 1778529440030 11/05/2026 edit content_copy delete" [ref=e718]:
                  - cell "Painel Aba Unica 1778529440030" [ref=e719]:
                    - paragraph [ref=e720]: Painel Aba Unica 1778529440030
                  - cell [ref=e721]:
                    - paragraph [ref=e722]
                  - cell "11/05/2026" [ref=e723]
                  - cell [ref=e724]:
                    - checkbox [checked] [ref=e726]
                  - cell "edit content_copy delete" [ref=e729]:
                    - generic [ref=e731]:
                      - generic [ref=e734] [cursor=pointer]: edit
                      - generic [ref=e737] [cursor=pointer]: content_copy
                      - generic [ref=e740] [cursor=pointer]: delete
                - row "Painel de Vendas Q1 1778529425452 Painel para acompanhamento de KPIs de vendas 11/05/2026 edit content_copy delete" [ref=e741]:
                  - cell "Painel de Vendas Q1 1778529425452" [ref=e742]:
                    - paragraph [ref=e743]: Painel de Vendas Q1 1778529425452
                  - cell "Painel para acompanhamento de KPIs de vendas" [ref=e744]:
                    - paragraph [ref=e745]: Painel para acompanhamento de KPIs de vendas
                  - cell "11/05/2026" [ref=e746]
                  - cell [ref=e747]:
                    - checkbox [checked] [ref=e749]
                  - cell "edit content_copy delete" [ref=e752]:
                    - generic [ref=e754]:
                      - generic [ref=e757] [cursor=pointer]: edit
                      - generic [ref=e760] [cursor=pointer]: content_copy
                      - generic [ref=e763] [cursor=pointer]: delete
                - row "Painel Excluir Aba Multi 1778529425824 11/05/2026 edit content_copy delete" [ref=e764]:
                  - cell "Painel Excluir Aba Multi 1778529425824" [ref=e765]:
                    - paragraph [ref=e766]: Painel Excluir Aba Multi 1778529425824
                  - cell [ref=e767]:
                    - paragraph [ref=e768]
                  - cell "11/05/2026" [ref=e769]
                  - cell [ref=e770]:
                    - checkbox [checked] [ref=e772]
                  - cell "edit content_copy delete" [ref=e775]:
                    - generic [ref=e777]:
                      - generic [ref=e780] [cursor=pointer]: edit
                      - generic [ref=e783] [cursor=pointer]: content_copy
                      - generic [ref=e786] [cursor=pointer]: delete
                - row "Painel Renomear 1778529425840 11/05/2026 edit content_copy delete" [ref=e787]:
                  - cell "Painel Renomear 1778529425840" [ref=e788]:
                    - paragraph [ref=e789]: Painel Renomear 1778529425840
                  - cell [ref=e790]:
                    - paragraph [ref=e791]
                  - cell "11/05/2026" [ref=e792]
                  - cell [ref=e793]:
                    - checkbox [checked] [ref=e795]
                  - cell "edit content_copy delete" [ref=e798]:
                    - generic [ref=e800]:
                      - generic [ref=e803] [cursor=pointer]: edit
                      - generic [ref=e806] [cursor=pointer]: content_copy
                      - generic [ref=e809] [cursor=pointer]: delete
                - row "Painel Cancelar Renomear 1778529423923 11/05/2026 edit content_copy delete" [ref=e810]:
                  - cell "Painel Cancelar Renomear 1778529423923" [ref=e811]:
                    - paragraph [ref=e812]: Painel Cancelar Renomear 1778529423923
                  - cell [ref=e813]:
                    - paragraph [ref=e814]
                  - cell "11/05/2026" [ref=e815]
                  - cell [ref=e816]:
                    - checkbox [checked] [ref=e818]
                  - cell "edit content_copy delete" [ref=e821]:
                    - generic [ref=e823]:
                      - generic [ref=e826] [cursor=pointer]: edit
                      - generic [ref=e829] [cursor=pointer]: content_copy
                      - generic [ref=e832] [cursor=pointer]: delete
                - row "Painel A11y Teclado 1778529409492 11/05/2026 edit content_copy delete" [ref=e833]:
                  - cell "Painel A11y Teclado 1778529409492" [ref=e834]:
                    - paragraph [ref=e835]: Painel A11y Teclado 1778529409492
                  - cell [ref=e836]:
                    - paragraph [ref=e837]
                  - cell "11/05/2026" [ref=e838]
                  - cell [ref=e839]:
                    - checkbox [checked] [ref=e841]
                  - cell "edit content_copy delete" [ref=e844]:
                    - generic [ref=e846]:
                      - generic [ref=e849] [cursor=pointer]: edit
                      - generic [ref=e852] [cursor=pointer]: content_copy
                      - generic [ref=e855] [cursor=pointer]: delete
                - row "Painel Adicionar Aba 1778529409505 11/05/2026 edit content_copy delete" [ref=e856]:
                  - cell "Painel Adicionar Aba 1778529409505" [ref=e857]:
                    - paragraph [ref=e858]: Painel Adicionar Aba 1778529409505
                  - cell [ref=e859]:
                    - paragraph [ref=e860]
                  - cell "11/05/2026" [ref=e861]
                  - cell [ref=e862]:
                    - checkbox [checked] [ref=e864]
                  - cell "edit content_copy delete" [ref=e867]:
                    - generic [ref=e869]:
                      - generic [ref=e872] [cursor=pointer]: edit
                      - generic [ref=e875] [cursor=pointer]: content_copy
                      - generic [ref=e878] [cursor=pointer]: delete
                - row "Painel Cancelar Criar Aba 1778529409516 11/05/2026 edit content_copy delete" [ref=e879]:
                  - cell "Painel Cancelar Criar Aba 1778529409516" [ref=e880]:
                    - paragraph [ref=e881]: Painel Cancelar Criar Aba 1778529409516
                  - cell [ref=e882]:
                    - paragraph [ref=e883]
                  - cell "11/05/2026" [ref=e884]
                  - cell [ref=e885]:
                    - checkbox [checked] [ref=e887]
                  - cell "edit content_copy delete" [ref=e890]:
                    - generic [ref=e892]:
                      - generic [ref=e895] [cursor=pointer]: edit
                      - generic [ref=e898] [cursor=pointer]: content_copy
                      - generic [ref=e901] [cursor=pointer]: delete
                - row "Painel Voltar Step 1778526840443 11/05/2026 edit content_copy delete" [ref=e902]:
                  - cell "Painel Voltar Step 1778526840443" [ref=e903]:
                    - paragraph [ref=e904]: Painel Voltar Step 1778526840443
                  - cell [ref=e905]:
                    - paragraph [ref=e906]
                  - cell "11/05/2026" [ref=e907]
                  - cell [ref=e908]:
                    - checkbox [checked] [ref=e910]
                  - cell "edit content_copy delete" [ref=e913]:
                    - generic [ref=e915]:
                      - generic [ref=e918] [cursor=pointer]: edit
                      - generic [ref=e921] [cursor=pointer]: content_copy
                      - generic [ref=e924] [cursor=pointer]: delete
                - row "Painel Limite Nome Aba 1778526839568 11/05/2026 edit content_copy delete" [ref=e925]:
                  - cell "Painel Limite Nome Aba 1778526839568" [ref=e926]:
                    - paragraph [ref=e927]: Painel Limite Nome Aba 1778526839568
                  - cell [ref=e928]:
                    - paragraph [ref=e929]
                  - cell "11/05/2026" [ref=e930]
                  - cell [ref=e931]:
                    - checkbox [checked] [ref=e933]
                  - cell "edit content_copy delete" [ref=e936]:
                    - generic [ref=e938]:
                      - generic [ref=e941] [cursor=pointer]: edit
                      - generic [ref=e944] [cursor=pointer]: content_copy
                      - generic [ref=e947] [cursor=pointer]: delete
            - generic [ref=e949]:
              - generic [ref=e950]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e951]:
                  - generic [ref=e952]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e953]:
                  - generic [ref=e954]: chevron_left
                - button "1" [ref=e955] [cursor=pointer]
                - button "2" [ref=e956] [cursor=pointer]
                - button "3" [ref=e957] [cursor=pointer]
                - button "4" [ref=e958] [cursor=pointer]
                - button "chevron_right" [ref=e959] [cursor=pointer]:
                  - generic [ref=e960]: chevron_right
              - generic [ref=e961]:
                - combobox [ref=e962]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - region "Widget de chat" [ref=e963]:
    - iframe [ref=e964]:
      - button "Abrir chat ao vivo" [ref=f59e5]:
        - img [ref=f59e8]
        - img [ref=f59e15]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e965]:
        - generic [ref=e966]:
          - img [ref=e968]
          - generic [ref=e971]: Registro excluído com sucesso!
          - button "Close" [ref=e972] [cursor=pointer]:
            - img [ref=e973]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e975]:
        - generic [ref=e976]:
          - img [ref=e978]
          - generic [ref=e981]: Registro excluído com sucesso!
          - button "Close" [ref=e982] [cursor=pointer]:
            - img [ref=e983]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e985]:
        - generic [ref=e986]:
          - img [ref=e988]
          - generic [ref=e991]: Registro excluído com sucesso!
          - button "Close" [ref=e992] [cursor=pointer]:
            - img [ref=e993]
```

# Test source

```ts
  31  | //
  32  | // Quando o item tem translations mas nenhuma com locale 'pt-BR', `find`
  33  | // retorna nil e `nil.title` lança NoMethodError. Itens criados via POST
  34  | // /api/v1/o/{org}/use_modes/{id}/use_mode_itens (que `associatePanelToMenu`
  35  | // faz no beforeAll) caem nesse caso: o GET subsequente em
  36  | // /api/v1/o/{org}/panels/{id}/linked_menus retorna 500 em ~21ms Rails runtime
  37  | // (confirmado via trace 2026-05-11: x-runtime: 0.021308).
  38  | //
  39  | // Sintoma observável: ao clicar no switch "Ativo?" do painel já associado,
  40  | // a UI chama /linked_menus → 500 → trata como "sem menus vinculados" →
  41  | // inativa direto sem mostrar o modal "Painel em uso". A asserção
  42  | // `expect(modal).toBeVisible()` no Step 2 falha por timeout.
  43  | //
  44  | // Cobertura confirmada via traces — o agente faz a parte dele certo:
  45  | //   POST /panels                                       → 201
  46  | //   POST /use_modes/70077/use_mode_itens               → 201
  47  | //   PATCH /use_modes/70077/use_mode_itens/bulk_update  → 200
  48  | //   POST /use_modes/70078/use_mode_itens               → 201
  49  | //   PATCH /use_modes/70078/use_mode_itens/bulk_update  → 200
  50  | //   GET  /panels/{id}/linked_menus                     → 500  ← BUG produto
  51  | //
  52  | // Fix sugerido upstream: `&.title` no find, OU criar translation pt-BR
  53  | // no POST de use_mode_itens. Quando corrigido, este teste passa
  54  | // automaticamente sem mudança no código (era pra ser assim desde o começo).
  55  | //
  56  | // NÃO marcado com `test.describe.fixme` por opção deliberada — bug de
  57  | // produto deve falhar vermelho pra ficar visível no relatório do dev.
  58  | // Ver Anti-pattern F em CLAUDE.md §7.6.
  59  | test.describe('Ativar / Inativar painel', () => {
  60  |   let panelName: string;
  61  | 
  62  |   test.beforeAll(async ({ browser }, testInfo) => {
  63  |     panelName = `Painel Vinculado TC3 w${testInfo.workerIndex}-${Date.now()}`;
  64  |     const ctx = await browser.newContext({
  65  |       storageState: STORAGE_STATE,
  66  |       viewport: { width: 1920, height: 1080 },
  67  |     });
  68  |     const page = await ctx.newPage();
  69  |     try {
  70  |       const paineis = new PaineisListPage(page);
  71  |       await paineis.createPanel({ name: panelName });
  72  |       for (const { id: useModeId } of data.useModes) {
  73  |         await paineis.associatePanelToMenu(panelName, useModeId);
  74  |       }
  75  |     } finally {
  76  |       await ctx.close();
  77  |     }
  78  |   });
  79  | 
  80  |   test.afterAll(async ({ browser }) => {
  81  |     // Cleanup robusto: cada step usa variant `_safe` que vira no-op se o
  82  |     // item/painel não existir, em vez de mascarar a falha original.
  83  |     // ORDEM IMPORTA: desassociar PRIMEIRO; deletePanelByName trava no
  84  |     // modal "Painel em uso" enquanto algum menu estiver vinculado.
  85  |     const ctx = await browser.newContext({
  86  |       storageState: STORAGE_STATE,
  87  |       viewport: { width: 1920, height: 1080 },
  88  |     });
  89  |     const page = await ctx.newPage();
  90  |     try {
  91  |       const paineis = new PaineisListPage(page);
  92  |       for (const { id: useModeId } of data.useModes) {
  93  |         await paineis.disassociatePanelFromMenu_safe(panelName, useModeId);
  94  |       }
  95  |       await paineis.goToList();
  96  |       await paineis.deletePanelByNameSafe(panelName);
  97  |     } finally {
  98  |       await ctx.close();
  99  |     }
  100 |   });
  101 | 
  102 |   test('Tentar inativar painel associado a modos de uso exibe modal de bloqueio', async ({
  103 |     page,
  104 |   }) => {
  105 |     await allure.epic('Twygo - Widgets');
  106 |     await allure.feature('Ativar / Inativar painel');
  107 |     await allure.story(
  108 |       'Tentar inativar painel associado a modos de uso exibe modal de bloqueio',
  109 |     );
  110 |     await allure.severity('critical');
  111 |     await allure.label('executionType', 'automated');
  112 | 
  113 |     const paineis = new PaineisListPage(page);
  114 | 
  115 |     await allure.step(
  116 |       '1. Acessar a aba "Painéis" com o painel vinculado ativo',
  117 |       async () => {
  118 |         await paineis.goToList();
  119 |         await paineis.setViewMode('lista');
  120 |         await expect(paineis.getRowByName(panelName)).toBeVisible();
  121 |         await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
  122 |       },
  123 |     );
  124 | 
  125 |     await allure.step(
  126 |       `2. Clicar no switch "Ativo" da linha "${panelName}" e verificar modal "Painel em uso"`,
  127 |       async () => {
  128 |         // Click direto no label — toggleActiveByName aguardaria toggle OU modal,
  129 |         // aqui queremos garantir que o modal apareça (não o toggle).
  130 |         await paineis.getRowActiveSwitchLabelByName(panelName).click();
> 131 |         await expect(paineis.getInactivationBlockedModal()).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  132 |         await expect(paineis.getInactivationBlockedModalTitle()).toContainText(
  133 |           'Painel em uso',
  134 |         );
  135 |         // O body lista cada menu vinculado — asserimos que ambos os useModes
  136 |         // que associamos no beforeAll aparecem por nome.
  137 |         for (const { label } of data.useModes) {
  138 |           await expect(paineis.getInactivationBlockedModalBody()).toContainText(label);
  139 |         }
  140 |       },
  141 |     );
  142 | 
  143 |     await allure.step(
  144 |       '3. Fechar o modal ("Entendi") e verificar que o switch permanece ativo',
  145 |       async () => {
  146 |         await paineis.closeInactivationBlockedModal();
  147 |         await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
  148 |       },
  149 |     );
  150 |   });
  151 | });
  152 | 
```