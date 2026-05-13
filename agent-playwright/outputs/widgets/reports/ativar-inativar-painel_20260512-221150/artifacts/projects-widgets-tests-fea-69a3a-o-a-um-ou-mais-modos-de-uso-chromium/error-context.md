# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\ativar-inativar-painel\tentar-inativar-painel-associado.spec.ts >> Ativar / Inativar painel >> Tentar inativar painel associado a um ou mais modos de uso
- Location: projects\widgets\tests\features\ativar-inativar-painel\tentar-inativar-painel-associado.spec.ts:108:3

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
  - generic [ref=e221]:
    - generic [ref=e231]:
      - generic [ref=e232]:
        - paragraph [ref=e233]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 22/05.
        - paragraph [ref=e234]: Quer mais detalhes sobre essa novidade? Veja aqui
      - button "Responder pesquisa" [ref=e236] [cursor=pointer]
      - button "Close" [ref=e237] [cursor=pointer]:
        - img [ref=e238]
    - generic [ref=e241]:
      - generic [ref=e243]:
        - list [ref=e244]:
          - list [ref=e245]:
            - listitem [ref=e246] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e247]:
                - /url: /o/36988/dashboard
                - generic [ref=e248]:
                  - generic [ref=e250]: leaderboard
                  - generic [ref=e251]: Dashboard
            - listitem [ref=e252] [cursor=pointer]:
              - generic [ref=e254]:
                - generic [ref=e257]: school
                - generic [ref=e258]: Aprendizagem
                - generic [ref=e260]: G
            - listitem [ref=e261] [cursor=pointer]:
              - link "group Usuários" [ref=e262]:
                - /url: /o/36988/users
                - generic [ref=e263]:
                  - generic [ref=e265]: group
                  - generic [ref=e266]: Usuários
            - listitem [ref=e267] [cursor=pointer]:
              - link "work Empresas" [ref=e268]:
                - /url: /o/36988/companies
                - generic [ref=e269]:
                  - generic [ref=e271]: work
                  - generic [ref=e272]: Empresas
            - listitem [ref=e273] [cursor=pointer]:
              - link "live_help Questionários" [ref=e274]:
                - /url: /o/36988/question_lists
                - generic [ref=e275]:
                  - generic [ref=e277]: live_help
                  - generic [ref=e278]: Questionários
            - listitem [ref=e279] [cursor=pointer]:
              - link "groups Comunidades" [ref=e280]:
                - /url: /o/36988/feed
                - generic [ref=e281]:
                  - generic [ref=e283]: groups
                  - generic [ref=e284]: Comunidades
            - listitem [ref=e285] [cursor=pointer]:
              - generic [ref=e287]:
                - generic [ref=e290]: psychology
                - generic [ref=e291]:
                  - text: Skills
                  - generic [ref=e292]: BETA
                - generic [ref=e294]: G
            - listitem [ref=e295] [cursor=pointer]:
              - generic [ref=e297]:
                - generic [ref=e300]: account_tree
                - generic [ref=e301]: Processos
                - generic [ref=e303]: G
        - generic [ref=e305]: widgets [36988]
        - list [ref=e306]:
          - listitem [ref=e307] [cursor=pointer]:
            - generic [ref=e308]:
              - generic [ref=e309]: f
              - text: Configurações
              - generic [ref=e310]: G
            - text: e    s 
      - generic [ref=e312]:
        - generic [ref=e315]: Menu > Modos de uso
        - generic [ref=e324]:
          - tablist [ref=e325]:
            - tab "Modos de uso" [ref=e326] [cursor=pointer]
            - tab "Painéis" [selected] [ref=e327] [cursor=pointer]
          - tabpanel "Painéis" [active] [ref=e329]:
            - generic [ref=e330]:
              - link "Adicionar" [ref=e331] [cursor=pointer]:
                - /url: /o/36988/panels/new
                - button "Adicionar" [ref=e332]:
                  - img [ref=e334]
                  - text: Adicionar
              - generic [ref=e336]:
                - generic [ref=e337]:
                  - img [ref=e339]
                  - textbox "Pesquise por nome ou descrição" [ref=e341]
                - generic [ref=e342]:
                  - generic [ref=e343] [cursor=pointer]: grid_view
                  - generic [ref=e344] [cursor=pointer]: reorder
                - button "Filtro" [ref=e345] [cursor=pointer]:
                  - generic [ref=e347]: filter_alt
                  - paragraph [ref=e349]: Filtro
            - table [ref=e351]:
              - rowgroup [ref=e352]:
                - row "Nome Descrição Data de criação Ativo?" [ref=e353]:
                  - columnheader "Nome" [ref=e354] [cursor=pointer]:
                    - generic [ref=e357]:
                      - text: Nome
                      - img [ref=e358]
                  - columnheader "Descrição" [ref=e360]:
                    - generic [ref=e361]: Descrição
                  - columnheader "Data de criação" [ref=e362] [cursor=pointer]:
                    - generic [ref=e365]:
                      - text: Data de criação
                      - img [ref=e366]
                  - columnheader "Ativo?" [ref=e368] [cursor=pointer]:
                    - generic [ref=e371]:
                      - text: Ativo?
                      - img [ref=e372]
                  - columnheader [ref=e374]
              - rowgroup [ref=e375]:
                - row "Painel Reativar TC4 w3-1778634638423 12/05/2026 edit content_copy delete" [ref=e376]:
                  - cell "Painel Reativar TC4 w3-1778634638423" [ref=e377]:
                    - paragraph [ref=e378]: Painel Reativar TC4 w3-1778634638423
                  - cell [ref=e379]
                  - cell "12/05/2026" [ref=e380]
                  - cell [ref=e381]:
                    - checkbox [checked] [ref=e383]
                  - cell "edit content_copy delete" [ref=e386]:
                    - generic [ref=e388]:
                      - generic [ref=e391] [cursor=pointer]: edit
                      - generic [ref=e394] [cursor=pointer]: content_copy
                      - generic [ref=e397] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w3-1778634467008 12/05/2026 edit content_copy delete" [ref=e398]:
                  - cell "Painel Reativar TC4 w3-1778634467008" [ref=e399]:
                    - paragraph [ref=e400]: Painel Reativar TC4 w3-1778634467008
                  - cell [ref=e401]
                  - cell "12/05/2026" [ref=e402]
                  - cell [ref=e403]:
                    - checkbox [checked] [ref=e405]
                  - cell "edit content_copy delete" [ref=e408]:
                    - generic [ref=e410]:
                      - generic [ref=e413] [cursor=pointer]: edit
                      - generic [ref=e416] [cursor=pointer]: content_copy
                      - generic [ref=e419] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778634004421 12/05/2026 edit content_copy delete" [ref=e420]:
                  - cell "Painel Reativar TC4 w0-1778634004421" [ref=e421]:
                    - paragraph [ref=e422]: Painel Reativar TC4 w0-1778634004421
                  - cell [ref=e423]
                  - cell "12/05/2026" [ref=e424]
                  - cell [ref=e425]:
                    - checkbox [checked] [ref=e427]
                  - cell "edit content_copy delete" [ref=e430]:
                    - generic [ref=e432]:
                      - generic [ref=e435] [cursor=pointer]: edit
                      - generic [ref=e438] [cursor=pointer]: content_copy
                      - generic [ref=e441] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778633775029 12/05/2026 edit content_copy delete" [ref=e442]:
                  - cell "Painel Reativar TC4 w0-1778633775029" [ref=e443]:
                    - paragraph [ref=e444]: Painel Reativar TC4 w0-1778633775029
                  - cell [ref=e445]
                  - cell "12/05/2026" [ref=e446]
                  - cell [ref=e447]:
                    - checkbox [checked] [ref=e449]
                  - cell "edit content_copy delete" [ref=e452]:
                    - generic [ref=e454]:
                      - generic [ref=e457] [cursor=pointer]: edit
                      - generic [ref=e460] [cursor=pointer]: content_copy
                      - generic [ref=e463] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778633630455 12/05/2026 edit content_copy delete" [ref=e464]:
                  - cell "Painel Reativar TC4 w0-1778633630455" [ref=e465]:
                    - paragraph [ref=e466]: Painel Reativar TC4 w0-1778633630455
                  - cell [ref=e467]
                  - cell "12/05/2026" [ref=e468]
                  - cell [ref=e469]:
                    - checkbox [checked] [ref=e471]
                  - cell "edit content_copy delete" [ref=e474]:
                    - generic [ref=e476]:
                      - generic [ref=e479] [cursor=pointer]: edit
                      - generic [ref=e482] [cursor=pointer]: content_copy
                      - generic [ref=e485] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778633415233 12/05/2026 edit content_copy delete" [ref=e486]:
                  - cell "Painel Reativar TC4 w0-1778633415233" [ref=e487]:
                    - paragraph [ref=e488]: Painel Reativar TC4 w0-1778633415233
                  - cell [ref=e489]
                  - cell "12/05/2026" [ref=e490]
                  - cell [ref=e491]:
                    - checkbox [checked] [ref=e493]
                  - cell "edit content_copy delete" [ref=e496]:
                    - generic [ref=e498]:
                      - generic [ref=e501] [cursor=pointer]: edit
                      - generic [ref=e504] [cursor=pointer]: content_copy
                      - generic [ref=e507] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778632538968 12/05/2026 edit content_copy delete" [ref=e508]:
                  - cell "Painel Reativar TC4 w0-1778632538968" [ref=e509]:
                    - paragraph [ref=e510]: Painel Reativar TC4 w0-1778632538968
                  - cell [ref=e511]
                  - cell "12/05/2026" [ref=e512]
                  - cell [ref=e513]:
                    - checkbox [checked] [ref=e515]
                  - cell "edit content_copy delete" [ref=e518]:
                    - generic [ref=e520]:
                      - generic [ref=e523] [cursor=pointer]: edit
                      - generic [ref=e526] [cursor=pointer]: content_copy
                      - generic [ref=e529] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778615916835 12/05/2026 edit content_copy delete" [ref=e530]:
                  - cell "Painel Reativar TC4 w0-1778615916835" [ref=e531]:
                    - paragraph [ref=e532]: Painel Reativar TC4 w0-1778615916835
                  - cell [ref=e533]
                  - cell "12/05/2026" [ref=e534]
                  - cell [ref=e535]:
                    - checkbox [checked] [ref=e537]
                  - cell "edit content_copy delete" [ref=e540]:
                    - generic [ref=e542]:
                      - generic [ref=e545] [cursor=pointer]: edit
                      - generic [ref=e548] [cursor=pointer]: content_copy
                      - generic [ref=e551] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778615348360 12/05/2026 edit content_copy delete" [ref=e552]:
                  - cell "Painel Reativar TC4 w0-1778615348360" [ref=e553]:
                    - paragraph [ref=e554]: Painel Reativar TC4 w0-1778615348360
                  - cell [ref=e555]
                  - cell "12/05/2026" [ref=e556]
                  - cell [ref=e557]:
                    - checkbox [checked] [ref=e559]
                  - cell "edit content_copy delete" [ref=e562]:
                    - generic [ref=e564]:
                      - generic [ref=e567] [cursor=pointer]: edit
                      - generic [ref=e570] [cursor=pointer]: content_copy
                      - generic [ref=e573] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778615045115 12/05/2026 edit content_copy delete" [ref=e574]:
                  - cell "Painel Reativar TC4 w0-1778615045115" [ref=e575]:
                    - paragraph [ref=e576]: Painel Reativar TC4 w0-1778615045115
                  - cell [ref=e577]
                  - cell "12/05/2026" [ref=e578]
                  - cell [ref=e579]:
                    - checkbox [checked] [ref=e581]
                  - cell "edit content_copy delete" [ref=e584]:
                    - generic [ref=e586]:
                      - generic [ref=e589] [cursor=pointer]: edit
                      - generic [ref=e592] [cursor=pointer]: content_copy
                      - generic [ref=e595] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778613180097 12/05/2026 edit content_copy delete" [ref=e596]:
                  - cell "Painel Reativar TC4 w0-1778613180097" [ref=e597]:
                    - paragraph [ref=e598]: Painel Reativar TC4 w0-1778613180097
                  - cell [ref=e599]
                  - cell "12/05/2026" [ref=e600]
                  - cell [ref=e601]:
                    - checkbox [checked] [ref=e603]
                  - cell "edit content_copy delete" [ref=e606]:
                    - generic [ref=e608]:
                      - generic [ref=e611] [cursor=pointer]: edit
                      - generic [ref=e614] [cursor=pointer]: content_copy
                      - generic [ref=e617] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778613012728 12/05/2026 edit content_copy delete" [ref=e618]:
                  - cell "Painel Reativar TC4 w0-1778613012728" [ref=e619]:
                    - paragraph [ref=e620]: Painel Reativar TC4 w0-1778613012728
                  - cell [ref=e621]
                  - cell "12/05/2026" [ref=e622]
                  - cell [ref=e623]:
                    - checkbox [checked] [ref=e625]
                  - cell "edit content_copy delete" [ref=e628]:
                    - generic [ref=e630]:
                      - generic [ref=e633] [cursor=pointer]: edit
                      - generic [ref=e636] [cursor=pointer]: content_copy
                      - generic [ref=e639] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778612845321 12/05/2026 edit content_copy delete" [ref=e640]:
                  - cell "Painel Reativar TC4 w0-1778612845321" [ref=e641]:
                    - paragraph [ref=e642]: Painel Reativar TC4 w0-1778612845321
                  - cell [ref=e643]:
                    - paragraph [ref=e644]
                  - cell "12/05/2026" [ref=e645]
                  - cell [ref=e646]:
                    - checkbox [checked] [ref=e648]
                  - cell "edit content_copy delete" [ref=e651]:
                    - generic [ref=e653]:
                      - generic [ref=e656] [cursor=pointer]: edit
                      - generic [ref=e659] [cursor=pointer]: content_copy
                      - generic [ref=e662] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w3-1778609550044 12/05/2026 edit content_copy delete" [ref=e663]:
                  - cell "Painel Reativar TC4 w3-1778609550044" [ref=e664]:
                    - paragraph [ref=e665]: Painel Reativar TC4 w3-1778609550044
                  - cell [ref=e666]:
                    - paragraph [ref=e667]
                  - cell "12/05/2026" [ref=e668]
                  - cell [ref=e669]:
                    - checkbox [checked] [ref=e671]
                  - cell "edit content_copy delete" [ref=e674]:
                    - generic [ref=e676]:
                      - generic [ref=e679] [cursor=pointer]: edit
                      - generic [ref=e682] [cursor=pointer]: content_copy
                      - generic [ref=e685] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778609344876 12/05/2026 edit content_copy delete" [ref=e686]:
                  - cell "Painel Reativar TC4 w0-1778609344876" [ref=e687]:
                    - paragraph [ref=e688]: Painel Reativar TC4 w0-1778609344876
                  - cell [ref=e689]:
                    - paragraph [ref=e690]
                  - cell "12/05/2026" [ref=e691]
                  - cell [ref=e692]:
                    - checkbox [checked] [ref=e694]
                  - cell "edit content_copy delete" [ref=e697]:
                    - generic [ref=e699]:
                      - generic [ref=e702] [cursor=pointer]: edit
                      - generic [ref=e705] [cursor=pointer]: content_copy
                      - generic [ref=e708] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778609207561 12/05/2026 edit content_copy delete" [ref=e709]:
                  - cell "Painel Reativar TC4 w0-1778609207561" [ref=e710]:
                    - paragraph [ref=e711]: Painel Reativar TC4 w0-1778609207561
                  - cell [ref=e712]:
                    - paragraph [ref=e713]
                  - cell "12/05/2026" [ref=e714]
                  - cell [ref=e715]:
                    - checkbox [checked] [ref=e717]
                  - cell "edit content_copy delete" [ref=e720]:
                    - generic [ref=e722]:
                      - generic [ref=e725] [cursor=pointer]: edit
                      - generic [ref=e728] [cursor=pointer]: content_copy
                      - generic [ref=e731] [cursor=pointer]: delete
                - row "Painel Voltar Step 1778597018411 12/05/2026 edit content_copy delete" [ref=e732]:
                  - cell "Painel Voltar Step 1778597018411" [ref=e733]:
                    - paragraph [ref=e734]: Painel Voltar Step 1778597018411
                  - cell [ref=e735]:
                    - paragraph [ref=e736]
                  - cell "12/05/2026" [ref=e737]
                  - cell [ref=e738]:
                    - checkbox [checked] [ref=e740]
                  - cell "edit content_copy delete" [ref=e743]:
                    - generic [ref=e745]:
                      - generic [ref=e748] [cursor=pointer]: edit
                      - generic [ref=e751] [cursor=pointer]: content_copy
                      - generic [ref=e754] [cursor=pointer]: delete
                - row "Painel Limite Nome Aba 1778597006306 12/05/2026 edit content_copy delete" [ref=e755]:
                  - cell "Painel Limite Nome Aba 1778597006306" [ref=e756]:
                    - paragraph [ref=e757]: Painel Limite Nome Aba 1778597006306
                  - cell [ref=e758]:
                    - paragraph [ref=e759]
                  - cell "12/05/2026" [ref=e760]
                  - cell [ref=e761]:
                    - checkbox [checked] [ref=e763]
                  - cell "edit content_copy delete" [ref=e766]:
                    - generic [ref=e768]:
                      - generic [ref=e771] [cursor=pointer]: edit
                      - generic [ref=e774] [cursor=pointer]: content_copy
                      - generic [ref=e777] [cursor=pointer]: delete
                - row "Painel Nova Aba 1778596994915 12/05/2026 edit content_copy delete" [ref=e778]:
                  - cell "Painel Nova Aba 1778596994915" [ref=e779]:
                    - paragraph [ref=e780]: Painel Nova Aba 1778596994915
                  - cell [ref=e781]:
                    - paragraph [ref=e782]
                  - cell "12/05/2026" [ref=e783]
                  - cell [ref=e784]:
                    - checkbox [checked] [ref=e786]
                  - cell "edit content_copy delete" [ref=e789]:
                    - generic [ref=e791]:
                      - generic [ref=e794] [cursor=pointer]: edit
                      - generic [ref=e797] [cursor=pointer]: content_copy
                      - generic [ref=e800] [cursor=pointer]: delete
                - row "Áéíóú ç ñ - _ . / 123 !@# 1778596983923 12/05/2026 edit content_copy delete" [ref=e801]:
                  - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596983923" [ref=e802]:
                    - paragraph [ref=e803]: Áéíóú ç ñ - _ . / 123 !@# 1778596983923
                  - cell [ref=e804]:
                    - paragraph [ref=e805]
                  - cell "12/05/2026" [ref=e806]
                  - cell [ref=e807]:
                    - checkbox [checked] [ref=e809]
                  - cell "edit content_copy delete" [ref=e812]:
                    - generic [ref=e814]:
                      - generic [ref=e817] [cursor=pointer]: edit
                      - generic [ref=e820] [cursor=pointer]: content_copy
                      - generic [ref=e823] [cursor=pointer]: delete
                - row "Painel Aba Unica 1778596949014 12/05/2026 edit content_copy delete" [ref=e824]:
                  - cell "Painel Aba Unica 1778596949014" [ref=e825]:
                    - paragraph [ref=e826]: Painel Aba Unica 1778596949014
                  - cell [ref=e827]:
                    - paragraph [ref=e828]
                  - cell "12/05/2026" [ref=e829]
                  - cell [ref=e830]:
                    - checkbox [checked] [ref=e832]
                  - cell "edit content_copy delete" [ref=e835]:
                    - generic [ref=e837]:
                      - generic [ref=e840] [cursor=pointer]: edit
                      - generic [ref=e843] [cursor=pointer]: content_copy
                      - generic [ref=e846] [cursor=pointer]: delete
                - row "Painel Renomear 1778596936523 12/05/2026 edit content_copy delete" [ref=e847]:
                  - cell "Painel Renomear 1778596936523" [ref=e848]:
                    - paragraph [ref=e849]: Painel Renomear 1778596936523
                  - cell [ref=e850]:
                    - paragraph [ref=e851]
                  - cell "12/05/2026" [ref=e852]
                  - cell [ref=e853]:
                    - checkbox [checked] [ref=e855]
                  - cell "edit content_copy delete" [ref=e858]:
                    - generic [ref=e860]:
                      - generic [ref=e863] [cursor=pointer]: edit
                      - generic [ref=e866] [cursor=pointer]: content_copy
                      - generic [ref=e869] [cursor=pointer]: delete
                - row "Painel TC17 1778596921353 12/05/2026 edit content_copy delete" [ref=e870]:
                  - cell "Painel TC17 1778596921353" [ref=e871]:
                    - paragraph [ref=e872]: Painel TC17 1778596921353
                  - cell [ref=e873]:
                    - paragraph [ref=e874]
                  - cell "12/05/2026" [ref=e875]
                  - cell [ref=e876]:
                    - checkbox [checked] [ref=e878]
                  - cell "edit content_copy delete" [ref=e881]:
                    - generic [ref=e883]:
                      - generic [ref=e886] [cursor=pointer]: edit
                      - generic [ref=e889] [cursor=pointer]: content_copy
                      - generic [ref=e892] [cursor=pointer]: delete
                - row "Painel TC16 1778596909478 12/05/2026 edit content_copy delete" [ref=e893]:
                  - cell "Painel TC16 1778596909478" [ref=e894]:
                    - paragraph [ref=e895]: Painel TC16 1778596909478
                  - cell [ref=e896]:
                    - paragraph [ref=e897]
                  - cell "12/05/2026" [ref=e898]
                  - cell [ref=e899]:
                    - checkbox [checked] [ref=e901]
                  - cell "edit content_copy delete" [ref=e904]:
                    - generic [ref=e906]:
                      - generic [ref=e909] [cursor=pointer]: edit
                      - generic [ref=e912] [cursor=pointer]: content_copy
                      - generic [ref=e915] [cursor=pointer]: delete
                - row "Painel Excluir Aba Multi 1778596890745 12/05/2026 edit content_copy delete" [ref=e916]:
                  - cell "Painel Excluir Aba Multi 1778596890745" [ref=e917]:
                    - paragraph [ref=e918]: Painel Excluir Aba Multi 1778596890745
                  - cell [ref=e919]:
                    - paragraph [ref=e920]
                  - cell "12/05/2026" [ref=e921]
                  - cell [ref=e922]:
                    - checkbox [checked] [ref=e924]
                  - cell "edit content_copy delete" [ref=e927]:
                    - generic [ref=e929]:
                      - generic [ref=e932] [cursor=pointer]: edit
                      - generic [ref=e935] [cursor=pointer]: content_copy
                      - generic [ref=e938] [cursor=pointer]: delete
            - generic [ref=e940]:
              - generic [ref=e941]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e942]:
                  - generic [ref=e943]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e944]:
                  - generic [ref=e945]: chevron_left
                - button "1" [ref=e946] [cursor=pointer]
                - button "2" [ref=e947] [cursor=pointer]
                - button "3" [ref=e948] [cursor=pointer]
                - button "4" [ref=e949] [cursor=pointer]
                - button "5" [ref=e950] [cursor=pointer]
                - button "chevron_right" [ref=e951] [cursor=pointer]:
                  - generic [ref=e952]: chevron_right
              - generic [ref=e953]:
                - combobox [ref=e954]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - region "Widget de chat" [ref=e955]:
    - iframe [ref=e956]:
      - generic [ref=f62e2]:
        - generic [ref=f62e6]:
          - button "Abrir chat ao vivo" [ref=f62e7]:
            - img "Avatar de Sophia" [ref=f62e12]
            - generic [ref=f62e13]: Estamos prontos para te atender no que você precisar, viu?! 🤩
          - button "Fechar página de boas-vindas" [ref=f62e14]:
            - img [ref=f62e16]
        - button "Abrir chat ao vivo" [ref=f62e23]:
          - img [ref=f62e26]
          - img [ref=f62e33]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e957]:
        - generic [ref=e958]:
          - img [ref=e960]
          - generic [ref=e963]: Registro excluído com sucesso!
          - button "Close" [ref=e964] [cursor=pointer]:
            - img [ref=e965]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e967]:
        - generic [ref=e968]:
          - img [ref=e970]
          - generic [ref=e973]: Registro excluído com sucesso!
          - button "Close" [ref=e974] [cursor=pointer]:
            - img [ref=e975]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e977]:
        - generic [ref=e978]:
          - img [ref=e980]
          - generic [ref=e983]: Registro excluído com sucesso!
          - button "Close" [ref=e984] [cursor=pointer]:
            - img [ref=e985]
```

# Test source

```ts
  30  | // retorna nil e `nil.title` lança NoMethodError. Itens criados via POST
  31  | // /api/v1/o/{org}/use_modes/{id}/use_mode_itens (que `associatePanelToMenu`
  32  | // faz no beforeAll) caem nesse caso: o GET subsequente em
  33  | // /api/v1/o/{org}/panels/{id}/linked_menus retorna 500 em ~21ms Rails runtime
  34  | // (trace 2026-05-11: x-runtime: 0.021308).
  35  | //
  36  | // Sintoma observável: ao clicar no switch "Ativo?" do painel já associado,
  37  | // a UI chama /linked_menus → 500 → trata como "sem menus vinculados" →
  38  | // inativa direto sem mostrar o modal "Painel em uso". A asserção
  39  | // `expect(modal).toBeVisible()` no Step 2 falha por timeout.
  40  | //
  41  | // Cobertura confirmada via traces — o agente faz a parte dele certo:
  42  | //   POST /panels                                       → 201
  43  | //   POST /use_modes/70077/use_mode_itens               → 201
  44  | //   PATCH /use_modes/70077/use_mode_itens/bulk_update  → 200
  45  | //   POST /use_modes/70078/use_mode_itens               → 201
  46  | //   PATCH /use_modes/70078/use_mode_itens/bulk_update  → 200
  47  | //   GET  /panels/{id}/linked_menus                     → 500  ← BUG produto
  48  | //
  49  | // Fix sugerido upstream: `&.title` no find, OU criar translation pt-BR
  50  | // no POST de use_mode_itens. Quando corrigido, este teste passa
  51  | // automaticamente sem mudança no código.
  52  | //
  53  | // NÃO marcado com test.fixme por opção deliberada — bug de produto deve
  54  | // falhar vermelho pra ficar visível no relatório do dev. Ver Anti-pattern F
  55  | // em CLAUDE.md §7.6.
  56  | 
  57  | import { resolve } from 'node:path';
  58  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  59  | import * as allure from 'allure-js-commons';
  60  | import { PaineisListPage } from '../../../pages/PaineisListPage.js';
  61  | import { data } from './tentar-inativar-painel-associado.data.js';
  62  | 
  63  | test.use({ viewport: { width: 1920, height: 1080 } });
  64  | 
  65  | const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');
  66  | 
  67  | test.describe('Ativar / Inativar painel', () => {
  68  |   let panelName: string;
  69  | 
  70  |   test.beforeAll(async ({ browser }, testInfo) => {
  71  |     panelName = `Painel Vinculado TC3 w${testInfo.workerIndex}-${Date.now()}`;
  72  |     const ctx = await browser.newContext({
  73  |       storageState: STORAGE_STATE,
  74  |       viewport: { width: 1920, height: 1080 },
  75  |     });
  76  |     const page = await ctx.newPage();
  77  |     try {
  78  |       const paineis = new PaineisListPage(page);
  79  |       await paineis.createPanel({ name: panelName });
  80  |       for (const useModeId of data.useModeIds) {
  81  |         await paineis.associatePanelToMenu(panelName, useModeId);
  82  |       }
  83  |     } finally {
  84  |       await ctx.close();
  85  |     }
  86  |   });
  87  | 
  88  |   test.afterAll(async ({ browser }) => {
  89  |     // ORDEM IMPORTA: desassociar PRIMEIRO; deletePanel trava no modal
  90  |     // "Painel em uso" enquanto algum menu estiver vinculado.
  91  |     const ctx = await browser.newContext({
  92  |       storageState: STORAGE_STATE,
  93  |       viewport: { width: 1920, height: 1080 },
  94  |     });
  95  |     const page = await ctx.newPage();
  96  |     try {
  97  |       const paineis = new PaineisListPage(page);
  98  |       for (const useModeId of data.useModeIds) {
  99  |         await paineis.disassociatePanelFromMenu_safe(panelName, useModeId);
  100 |       }
  101 |       await paineis.goToList();
  102 |       await paineis.deletePanelByNameSafe(panelName);
  103 |     } finally {
  104 |       await ctx.close();
  105 |     }
  106 |   });
  107 | 
  108 |   test('Tentar inativar painel associado a um ou mais modos de uso', async ({ page, step }) => {
  109 |     await allure.epic('Twygo - Widgets');
  110 |     await allure.feature('Ativar / Inativar painel');
  111 |     await allure.story('Tentar inativar painel associado a um ou mais modos de uso');
  112 |     await allure.severity('critical');
  113 |     await allure.label('executionType', 'automated');
  114 | 
  115 |     const paineis = new PaineisListPage(page);
  116 | 
  117 |     // 1. Acessar a aba 'Painéis' em Configurações > Menu
  118 |     await step("1. Acessar a aba 'Painéis' em Configurações > Menu", async () => {
  119 |       await paineis.goToList();
  120 |       await paineis.setViewMode('lista');
  121 |       await expect(paineis.getRowByName(panelName)).toBeVisible();
  122 |       await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
  123 |     });
  124 | 
  125 |     // 2. Clicar no switch da coluna 'Ativo' na linha 'Painel Vinculado'
  126 |     await step("2. Clicar no switch da coluna 'Ativo' na linha 'Painel Vinculado'", async () => {
  127 |       // Click direto no label — toggleActiveByName aguardaria toggle OU modal,
  128 |       // aqui queremos garantir que o modal apareça (não o toggle).
  129 |       await paineis.getRowActiveSwitchLabelByName(panelName).click();
> 130 |       await expect(paineis.getInactivationBlockedModal()).toBeVisible();
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  131 |       await expect(paineis.getInactivationBlockedModalTitle()).toContainText('Painel em uso');
  132 |       await expect(paineis.getInactivationBlockedModalBody()).toContainText('Não é possível desabilitar');
  133 |       for (const { label } of data.useModes) {
  134 |         await expect(paineis.getInactivationBlockedModalBody()).toContainText(label);
  135 |       }
  136 |     });
  137 | 
  138 |     // 3. Clicar no botão 'Fechar'/'Entendi' do modal
  139 |     await step("3. Clicar no botão 'Fechar'/'Entendi' do modal", async () => {
  140 |       await paineis.closeInactivationBlockedModal();
  141 |       await expect(paineis.getInactivationBlockedModal()).toBeHidden();
  142 |       await expect(paineis.getRowActiveSwitchByName(panelName)).toBeChecked();
  143 |     });
  144 |   });
  145 | });
  146 | 
```