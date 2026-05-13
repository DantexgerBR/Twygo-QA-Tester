# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\ativar-inativar-painel\ativar-painel-previamente-inativo.spec.ts >> Ativar / Inativar painel >> Ativar um painel previamente inativo
- Location: projects\widgets\tests\features\ativar-inativar-painel\ativar-painel-previamente-inativo.spec.ts:67:3

# Error details

```
Error: aguardando toggle ou modal após click no switch de "Painel Ativar TC2 w0-1778634638418"

expect(received).not.toBe(expected) // Object.is equality

Expected: not "pending"

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
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
                - row "Painel Vinculado TC3 w2-1778634638397 12/05/2026 edit content_copy delete" [ref=e376]:
                  - cell "Painel Vinculado TC3 w2-1778634638397" [ref=e377]:
                    - paragraph [ref=e378]: Painel Vinculado TC3 w2-1778634638397
                  - cell [ref=e379]
                  - cell "12/05/2026" [ref=e380]
                  - cell [ref=e381]:
                    - checkbox [checked] [ref=e383]
                  - cell "edit content_copy delete" [ref=e386]:
                    - generic [ref=e388]:
                      - generic [ref=e391] [cursor=pointer]: edit
                      - generic [ref=e394] [cursor=pointer]: content_copy
                      - generic [ref=e397] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w3-1778634638423 12/05/2026 edit content_copy delete" [ref=e398]:
                  - cell "Painel Reativar TC4 w3-1778634638423" [ref=e399]:
                    - paragraph [ref=e400]: Painel Reativar TC4 w3-1778634638423
                  - cell [ref=e401]
                  - cell "12/05/2026" [ref=e402]
                  - cell [ref=e403]:
                    - checkbox [checked] [ref=e405]
                  - cell "edit content_copy delete" [ref=e408]:
                    - generic [ref=e410]:
                      - generic [ref=e413] [cursor=pointer]: edit
                      - generic [ref=e416] [cursor=pointer]: content_copy
                      - generic [ref=e419] [cursor=pointer]: delete
                - row "Painel Inativar TC1 w1-1778634638397 12/05/2026 edit content_copy delete" [ref=e420]:
                  - cell "Painel Inativar TC1 w1-1778634638397" [ref=e421]:
                    - paragraph [ref=e422]: Painel Inativar TC1 w1-1778634638397
                  - cell [ref=e423]
                  - cell "12/05/2026" [ref=e424]
                  - cell [ref=e425]:
                    - checkbox [checked] [ref=e427]
                  - cell "edit content_copy delete" [ref=e430]:
                    - generic [ref=e432]:
                      - generic [ref=e435] [cursor=pointer]: edit
                      - generic [ref=e438] [cursor=pointer]: content_copy
                      - generic [ref=e441] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w3-1778634467008 12/05/2026 edit content_copy delete" [ref=e442]:
                  - cell "Painel Reativar TC4 w3-1778634467008" [ref=e443]:
                    - paragraph [ref=e444]: Painel Reativar TC4 w3-1778634467008
                  - cell [ref=e445]
                  - cell "12/05/2026" [ref=e446]
                  - cell [ref=e447]:
                    - checkbox [checked] [ref=e449]
                  - cell "edit content_copy delete" [ref=e452]:
                    - generic [ref=e454]:
                      - generic [ref=e457] [cursor=pointer]: edit
                      - generic [ref=e460] [cursor=pointer]: content_copy
                      - generic [ref=e463] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778634004421 12/05/2026 edit content_copy delete" [ref=e464]:
                  - cell "Painel Reativar TC4 w0-1778634004421" [ref=e465]:
                    - paragraph [ref=e466]: Painel Reativar TC4 w0-1778634004421
                  - cell [ref=e467]
                  - cell "12/05/2026" [ref=e468]
                  - cell [ref=e469]:
                    - checkbox [checked] [ref=e471]
                  - cell "edit content_copy delete" [ref=e474]:
                    - generic [ref=e476]:
                      - generic [ref=e479] [cursor=pointer]: edit
                      - generic [ref=e482] [cursor=pointer]: content_copy
                      - generic [ref=e485] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778633775029 12/05/2026 edit content_copy delete" [ref=e486]:
                  - cell "Painel Reativar TC4 w0-1778633775029" [ref=e487]:
                    - paragraph [ref=e488]: Painel Reativar TC4 w0-1778633775029
                  - cell [ref=e489]
                  - cell "12/05/2026" [ref=e490]
                  - cell [ref=e491]:
                    - checkbox [checked] [ref=e493]
                  - cell "edit content_copy delete" [ref=e496]:
                    - generic [ref=e498]:
                      - generic [ref=e501] [cursor=pointer]: edit
                      - generic [ref=e504] [cursor=pointer]: content_copy
                      - generic [ref=e507] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778633630455 12/05/2026 edit content_copy delete" [ref=e508]:
                  - cell "Painel Reativar TC4 w0-1778633630455" [ref=e509]:
                    - paragraph [ref=e510]: Painel Reativar TC4 w0-1778633630455
                  - cell [ref=e511]
                  - cell "12/05/2026" [ref=e512]
                  - cell [ref=e513]:
                    - checkbox [checked] [ref=e515]
                  - cell "edit content_copy delete" [ref=e518]:
                    - generic [ref=e520]:
                      - generic [ref=e523] [cursor=pointer]: edit
                      - generic [ref=e526] [cursor=pointer]: content_copy
                      - generic [ref=e529] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778633415233 12/05/2026 edit content_copy delete" [ref=e530]:
                  - cell "Painel Reativar TC4 w0-1778633415233" [ref=e531]:
                    - paragraph [ref=e532]: Painel Reativar TC4 w0-1778633415233
                  - cell [ref=e533]
                  - cell "12/05/2026" [ref=e534]
                  - cell [ref=e535]:
                    - checkbox [checked] [ref=e537]
                  - cell "edit content_copy delete" [ref=e540]:
                    - generic [ref=e542]:
                      - generic [ref=e545] [cursor=pointer]: edit
                      - generic [ref=e548] [cursor=pointer]: content_copy
                      - generic [ref=e551] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778632538968 12/05/2026 edit content_copy delete" [ref=e552]:
                  - cell "Painel Reativar TC4 w0-1778632538968" [ref=e553]:
                    - paragraph [ref=e554]: Painel Reativar TC4 w0-1778632538968
                  - cell [ref=e555]
                  - cell "12/05/2026" [ref=e556]
                  - cell [ref=e557]:
                    - checkbox [checked] [ref=e559]
                  - cell "edit content_copy delete" [ref=e562]:
                    - generic [ref=e564]:
                      - generic [ref=e567] [cursor=pointer]: edit
                      - generic [ref=e570] [cursor=pointer]: content_copy
                      - generic [ref=e573] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778615916835 12/05/2026 edit content_copy delete" [ref=e574]:
                  - cell "Painel Reativar TC4 w0-1778615916835" [ref=e575]:
                    - paragraph [ref=e576]: Painel Reativar TC4 w0-1778615916835
                  - cell [ref=e577]
                  - cell "12/05/2026" [ref=e578]
                  - cell [ref=e579]:
                    - checkbox [checked] [ref=e581]
                  - cell "edit content_copy delete" [ref=e584]:
                    - generic [ref=e586]:
                      - generic [ref=e589] [cursor=pointer]: edit
                      - generic [ref=e592] [cursor=pointer]: content_copy
                      - generic [ref=e595] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778615348360 12/05/2026 edit content_copy delete" [ref=e596]:
                  - cell "Painel Reativar TC4 w0-1778615348360" [ref=e597]:
                    - paragraph [ref=e598]: Painel Reativar TC4 w0-1778615348360
                  - cell [ref=e599]
                  - cell "12/05/2026" [ref=e600]
                  - cell [ref=e601]:
                    - checkbox [checked] [ref=e603]
                  - cell "edit content_copy delete" [ref=e606]:
                    - generic [ref=e608]:
                      - generic [ref=e611] [cursor=pointer]: edit
                      - generic [ref=e614] [cursor=pointer]: content_copy
                      - generic [ref=e617] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778615045115 12/05/2026 edit content_copy delete" [ref=e618]:
                  - cell "Painel Reativar TC4 w0-1778615045115" [ref=e619]:
                    - paragraph [ref=e620]: Painel Reativar TC4 w0-1778615045115
                  - cell [ref=e621]
                  - cell "12/05/2026" [ref=e622]
                  - cell [ref=e623]:
                    - checkbox [checked] [ref=e625]
                  - cell "edit content_copy delete" [ref=e628]:
                    - generic [ref=e630]:
                      - generic [ref=e633] [cursor=pointer]: edit
                      - generic [ref=e636] [cursor=pointer]: content_copy
                      - generic [ref=e639] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778613180097 12/05/2026 edit content_copy delete" [ref=e640]:
                  - cell "Painel Reativar TC4 w0-1778613180097" [ref=e641]:
                    - paragraph [ref=e642]: Painel Reativar TC4 w0-1778613180097
                  - cell [ref=e643]
                  - cell "12/05/2026" [ref=e644]
                  - cell [ref=e645]:
                    - checkbox [checked] [ref=e647]
                  - cell "edit content_copy delete" [ref=e650]:
                    - generic [ref=e652]:
                      - generic [ref=e655] [cursor=pointer]: edit
                      - generic [ref=e658] [cursor=pointer]: content_copy
                      - generic [ref=e661] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778613012728 12/05/2026 edit content_copy delete" [ref=e662]:
                  - cell "Painel Reativar TC4 w0-1778613012728" [ref=e663]:
                    - paragraph [ref=e664]: Painel Reativar TC4 w0-1778613012728
                  - cell [ref=e665]
                  - cell "12/05/2026" [ref=e666]
                  - cell [ref=e667]:
                    - checkbox [checked] [ref=e669]
                  - cell "edit content_copy delete" [ref=e672]:
                    - generic [ref=e674]:
                      - generic [ref=e677] [cursor=pointer]: edit
                      - generic [ref=e680] [cursor=pointer]: content_copy
                      - generic [ref=e683] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778612845321 12/05/2026 edit content_copy delete" [ref=e684]:
                  - cell "Painel Reativar TC4 w0-1778612845321" [ref=e685]:
                    - paragraph [ref=e686]: Painel Reativar TC4 w0-1778612845321
                  - cell [ref=e687]:
                    - paragraph [ref=e688]
                  - cell "12/05/2026" [ref=e689]
                  - cell [ref=e690]:
                    - checkbox [checked] [ref=e692]
                  - cell "edit content_copy delete" [ref=e695]:
                    - generic [ref=e697]:
                      - generic [ref=e700] [cursor=pointer]: edit
                      - generic [ref=e703] [cursor=pointer]: content_copy
                      - generic [ref=e706] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w3-1778609550044 12/05/2026 edit content_copy delete" [ref=e707]:
                  - cell "Painel Reativar TC4 w3-1778609550044" [ref=e708]:
                    - paragraph [ref=e709]: Painel Reativar TC4 w3-1778609550044
                  - cell [ref=e710]:
                    - paragraph [ref=e711]
                  - cell "12/05/2026" [ref=e712]
                  - cell [ref=e713]:
                    - checkbox [checked] [ref=e715]
                  - cell "edit content_copy delete" [ref=e718]:
                    - generic [ref=e720]:
                      - generic [ref=e723] [cursor=pointer]: edit
                      - generic [ref=e726] [cursor=pointer]: content_copy
                      - generic [ref=e729] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778609344876 12/05/2026 edit content_copy delete" [ref=e730]:
                  - cell "Painel Reativar TC4 w0-1778609344876" [ref=e731]:
                    - paragraph [ref=e732]: Painel Reativar TC4 w0-1778609344876
                  - cell [ref=e733]:
                    - paragraph [ref=e734]
                  - cell "12/05/2026" [ref=e735]
                  - cell [ref=e736]:
                    - checkbox [checked] [ref=e738]
                  - cell "edit content_copy delete" [ref=e741]:
                    - generic [ref=e743]:
                      - generic [ref=e746] [cursor=pointer]: edit
                      - generic [ref=e749] [cursor=pointer]: content_copy
                      - generic [ref=e752] [cursor=pointer]: delete
                - row "Painel Reativar TC4 w0-1778609207561 12/05/2026 edit content_copy delete" [ref=e753]:
                  - cell "Painel Reativar TC4 w0-1778609207561" [ref=e754]:
                    - paragraph [ref=e755]: Painel Reativar TC4 w0-1778609207561
                  - cell [ref=e756]:
                    - paragraph [ref=e757]
                  - cell "12/05/2026" [ref=e758]
                  - cell [ref=e759]:
                    - checkbox [checked] [ref=e761]
                  - cell "edit content_copy delete" [ref=e764]:
                    - generic [ref=e766]:
                      - generic [ref=e769] [cursor=pointer]: edit
                      - generic [ref=e772] [cursor=pointer]: content_copy
                      - generic [ref=e775] [cursor=pointer]: delete
                - row "Painel Voltar Step 1778597018411 12/05/2026 edit content_copy delete" [ref=e776]:
                  - cell "Painel Voltar Step 1778597018411" [ref=e777]:
                    - paragraph [ref=e778]: Painel Voltar Step 1778597018411
                  - cell [ref=e779]:
                    - paragraph [ref=e780]
                  - cell "12/05/2026" [ref=e781]
                  - cell [ref=e782]:
                    - checkbox [checked] [ref=e784]
                  - cell "edit content_copy delete" [ref=e787]:
                    - generic [ref=e789]:
                      - generic [ref=e792] [cursor=pointer]: edit
                      - generic [ref=e795] [cursor=pointer]: content_copy
                      - generic [ref=e798] [cursor=pointer]: delete
                - row "Painel Limite Nome Aba 1778597006306 12/05/2026 edit content_copy delete" [ref=e799]:
                  - cell "Painel Limite Nome Aba 1778597006306" [ref=e800]:
                    - paragraph [ref=e801]: Painel Limite Nome Aba 1778597006306
                  - cell [ref=e802]:
                    - paragraph [ref=e803]
                  - cell "12/05/2026" [ref=e804]
                  - cell [ref=e805]:
                    - checkbox [checked] [ref=e807]
                  - cell "edit content_copy delete" [ref=e810]:
                    - generic [ref=e812]:
                      - generic [ref=e815] [cursor=pointer]: edit
                      - generic [ref=e818] [cursor=pointer]: content_copy
                      - generic [ref=e821] [cursor=pointer]: delete
                - row "Painel Nova Aba 1778596994915 12/05/2026 edit content_copy delete" [ref=e822]:
                  - cell "Painel Nova Aba 1778596994915" [ref=e823]:
                    - paragraph [ref=e824]: Painel Nova Aba 1778596994915
                  - cell [ref=e825]:
                    - paragraph [ref=e826]
                  - cell "12/05/2026" [ref=e827]
                  - cell [ref=e828]:
                    - checkbox [checked] [ref=e830]
                  - cell "edit content_copy delete" [ref=e833]:
                    - generic [ref=e835]:
                      - generic [ref=e838] [cursor=pointer]: edit
                      - generic [ref=e841] [cursor=pointer]: content_copy
                      - generic [ref=e844] [cursor=pointer]: delete
                - row "Áéíóú ç ñ - _ . / 123 !@# 1778596983923 12/05/2026 edit content_copy delete" [ref=e845]:
                  - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596983923" [ref=e846]:
                    - paragraph [ref=e847]: Áéíóú ç ñ - _ . / 123 !@# 1778596983923
                  - cell [ref=e848]:
                    - paragraph [ref=e849]
                  - cell "12/05/2026" [ref=e850]
                  - cell [ref=e851]:
                    - checkbox [checked] [ref=e853]
                  - cell "edit content_copy delete" [ref=e856]:
                    - generic [ref=e858]:
                      - generic [ref=e861] [cursor=pointer]: edit
                      - generic [ref=e864] [cursor=pointer]: content_copy
                      - generic [ref=e867] [cursor=pointer]: delete
                - row "Painel Aba Unica 1778596949014 12/05/2026 edit content_copy delete" [ref=e868]:
                  - cell "Painel Aba Unica 1778596949014" [ref=e869]:
                    - paragraph [ref=e870]: Painel Aba Unica 1778596949014
                  - cell [ref=e871]:
                    - paragraph [ref=e872]
                  - cell "12/05/2026" [ref=e873]
                  - cell [ref=e874]:
                    - checkbox [checked] [ref=e876]
                  - cell "edit content_copy delete" [ref=e879]:
                    - generic [ref=e881]:
                      - generic [ref=e884] [cursor=pointer]: edit
                      - generic [ref=e887] [cursor=pointer]: content_copy
                      - generic [ref=e890] [cursor=pointer]: delete
                - row "Painel Renomear 1778596936523 12/05/2026 edit content_copy delete" [ref=e891]:
                  - cell "Painel Renomear 1778596936523" [ref=e892]:
                    - paragraph [ref=e893]: Painel Renomear 1778596936523
                  - cell [ref=e894]:
                    - paragraph [ref=e895]
                  - cell "12/05/2026" [ref=e896]
                  - cell [ref=e897]:
                    - checkbox [checked] [ref=e899]
                  - cell "edit content_copy delete" [ref=e902]:
                    - generic [ref=e904]:
                      - generic [ref=e907] [cursor=pointer]: edit
                      - generic [ref=e910] [cursor=pointer]: content_copy
                      - generic [ref=e913] [cursor=pointer]: delete
                - row "Painel TC17 1778596921353 12/05/2026 edit content_copy delete" [ref=e914]:
                  - cell "Painel TC17 1778596921353" [ref=e915]:
                    - paragraph [ref=e916]: Painel TC17 1778596921353
                  - cell [ref=e917]:
                    - paragraph [ref=e918]
                  - cell "12/05/2026" [ref=e919]
                  - cell [ref=e920]:
                    - checkbox [checked] [ref=e922]
                  - cell "edit content_copy delete" [ref=e925]:
                    - generic [ref=e927]:
                      - generic [ref=e930] [cursor=pointer]: edit
                      - generic [ref=e933] [cursor=pointer]: content_copy
                      - generic [ref=e936] [cursor=pointer]: delete
            - generic [ref=e938]:
              - generic [ref=e939]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e940]:
                  - generic [ref=e941]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e942]:
                  - generic [ref=e943]: chevron_left
                - button "1" [ref=e944] [cursor=pointer]
                - button "2" [ref=e945] [cursor=pointer]
                - button "3" [ref=e946] [cursor=pointer]
                - button "4" [ref=e947] [cursor=pointer]
                - button "5" [ref=e948] [cursor=pointer]
                - button "chevron_right" [ref=e949] [cursor=pointer]:
                  - generic [ref=e950]: chevron_right
              - generic [ref=e951]:
                - combobox [ref=e952]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - region "Widget de chat" [ref=e953]:
    - iframe [ref=e954]:
      - generic [ref=f5e2]:
        - generic [ref=f5e6]:
          - button "Abrir chat ao vivo" [ref=f5e7]:
            - img "Avatar de Sophia" [ref=f5e12]
            - generic [ref=f5e13]: Estamos prontos para te atender no que você precisar, viu?! 🤩
          - button "Fechar página de boas-vindas" [ref=f5e14]:
            - img [ref=f5e16]
        - button "Abrir chat ao vivo" [ref=f5e23]:
          - img [ref=f5e26]
          - img [ref=f5e33]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e955]:
        - generic [ref=e956]:
          - img [ref=e958]
          - generic [ref=e961]: Registro excluído com sucesso!
          - button "Close" [ref=e962] [cursor=pointer]:
            - img [ref=e963]
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
```

# Test source

```ts
  404 | 
  405 |   /**
  406 |    * Botão numerado de página (1-based — `#page-button-1` é a página 1).
  407 |    * REVISAR: aguardando data-test-id "paineis-list-pagination-page-{n}".
  408 |    */
  409 |   getPageButton(pageNum: number): Locator {
  410 |     return this.page.locator(`#page-button-${pageNum}`);
  411 |   }
  412 | 
  413 |   async goToNextPage(): Promise<void> {
  414 |     await this.getNextPageButton().click();
  415 |   }
  416 | 
  417 |   async goToPreviousPage(): Promise<void> {
  418 |     await this.getPreviousPageButton().click();
  419 |   }
  420 | 
  421 |   // ---------- Estado de bloqueio por contrato/flag (TC7 — referência) ----------
  422 | 
  423 |   /**
  424 |    * Mantido como referência para TC7 (feature flag desabilitada). A UI atual
  425 |    * (pós-liberação na org 36988) NÃO renderiza este card. Útil só se outra
  426 |    * org/env reproduzir o estado bloqueado.
  427 |    */
  428 |   getContractBlockCard(): Locator {
  429 |     return this.page.getByTestId('integrations-contract-block-card');
  430 |   }
  431 | 
  432 |   getContractBlockTitle(): Locator {
  433 |     return this.page.getByTestId('integrations-contract-block-card-title');
  434 |   }
  435 | 
  436 |   // ---------- Linhas por NOME (suite Ativar / Inativar painel) ----------
  437 | 
  438 |   /**
  439 |    * Retorna a `<tr>` da listagem em modo Lista cujo `<p>` da primeira coluna
  440 |    * tem texto EXATAMENTE igual a `name`. Match exato via regex é obrigatório:
  441 |    * `hasText: string` faz substring match, então buscar "Painel X" também
  442 |    * casaria a linha "Painel X (cópia)" — quebra strict-mode na suite
  443 |    * Duplicar painéis. Regex com `^...$` força match exato.
  444 |    * REVISAR: aguardando data-test-id "paineis-list-row-{paineId}".
  445 |    */
  446 |   getRowByName(name: string): Locator {
  447 |     const exactRe = new RegExp(`^${escapeRegex(name)}$`);
  448 |     return this.page
  449 |       .locator('tbody tr')
  450 |       .filter({ has: this.page.locator('td:first-child p', { hasText: exactRe }) });
  451 |   }
  452 | 
  453 |   /**
  454 |    * Checkbox da coluna "Ativo?" da linha cujo nome é `{name}`. O elemento é
  455 |    * `<input id="panel-situation-{paineId}" type="checkbox">` (id estável
  456 |    * descoberto live em 2026-05-06). O input em si tem `clip: rect(0,0,0,0)`
  457 |    * — para CLICK use `getRowActiveSwitchLabelByName`; este locator serve a
  458 |    * asserções (`toBeChecked()`) que leem state via attribute.
  459 |    * REVISAR: aguardando data-test-id "paineis-list-row-{paineId}-active-switch".
  460 |    */
  461 |   getRowActiveSwitchByName(name: string): Locator {
  462 |     return this.getRowByName(name).locator('input[type="checkbox"]');
  463 |   }
  464 | 
  465 |   /**
  466 |    * Label clicável (chakra-switch) que envolve o `<input>` do switch da linha
  467 |    * `{name}`. Necessário porque o input é hidden (clip 1×1 px) — click
  468 |    * direto no input falha em actionability. O `<label class="chakra-switch">`
  469 |    * captura o click e dispara o toggle do input via DOM.
  470 |    *
  471 |    * NOTA: tentei trocar pra `.chakra-switch__track` (alinhar com fluxo manual
  472 |    * via Jam 12/05/2026), mas o track não passou no actionability check do
  473 |    * Playwright em headless — TC1/TC2/TC5 falhavam com toggle 'pending'.
  474 |    * O label-wrapper funciona consistente — mantido.
  475 |    */
  476 |   getRowActiveSwitchLabelByName(name: string): Locator {
  477 |     return this.getRowByName(name).locator('label.chakra-switch');
  478 |   }
  479 | 
  480 |   /**
  481 |    * Lê o estado atual do switch da linha `{name}`. Usa o atributo do DOM
  482 |    * (não evaluate) — o `<input>` chakra mantém o property `checked`
  483 |    * sincronizado com o state interno.
  484 |    */
  485 |   async getActiveStateByName(name: string): Promise<boolean> {
  486 |     return this.getRowActiveSwitchByName(name).isChecked();
  487 |   }
  488 | 
  489 |   /**
  490 |    * Click no label do switch da linha `{name}` e aguarda mudança de estado.
  491 |    * Para painel SEM associação a modos de uso, o estado muda imediatamente.
  492 |    * Para painel ASSOCIADO, abre modal de bloqueio e o estado NÃO muda — use
  493 |    * `getBlockedModal()` para asserir nesse caso.
  494 |    */
  495 |   async toggleActiveByName(name: string): Promise<void> {
  496 |     const before = await this.getActiveStateByName(name);
  497 |     // NPS pode reaparecer por inactivity entre `goToList` (que já dismiss-a)
  498 |     // e o click no switch. Sem isso o click cai no overlay e o polling
  499 |     // termina em "pending" (nem toggled nem modal de bloqueio aparecem).
  500 |     await dismissCommonModals(this.page);
  501 |     await this.getRowActiveSwitchLabelByName(name).click();
  502 |     // Aguarda either: state mudou (caso normal) OU modal de bloqueio apareceu.
  503 |     // Polling baseado em condição (regra dura #1).
> 504 |     await expect
      |     ^ Error: aguardando toggle ou modal após click no switch de "Painel Ativar TC2 w0-1778634638418"
  505 |       .poll(
  506 |         async () => {
  507 |           const dialogVisible = await this.getBlockedModal()
  508 |             .isVisible()
  509 |             .catch(() => false);
  510 |           if (dialogVisible) return 'modal';
  511 |           const after = await this.getActiveStateByName(name);
  512 |           return after !== before ? 'toggled' : 'pending';
  513 |         },
  514 |         {
  515 |           timeout: 5_000,
  516 |           message: `aguardando toggle ou modal após click no switch de "${name}"`,
  517 |         },
  518 |       )
  519 |       .not.toBe('pending');
  520 |   }
  521 | 
  522 |   /**
  523 |    * Garante que o painel `{name}` esteja ATIVO (checked). No-op se já estiver.
  524 |    * Usado em pre-conditions de TC1 e em cleanup de TC1/TC2 (`afterEach`)
  525 |    * para isolamento entre runs paralelos. **NÃO** trata o caso de painel
  526 |    * associado (modal de bloqueio) — caller é responsável por garantir que
  527 |    * `{name}` é um painel desassociado.
  528 |    */
  529 |   async ensureActive(name: string): Promise<void> {
  530 |     if (!(await this.getActiveStateByName(name))) {
  531 |       await this.toggleActiveByName(name);
  532 |     }
  533 |   }
  534 | 
  535 |   /**
  536 |    * Garante que o painel `{name}` esteja INATIVO (unchecked). No-op se já
  537 |    * estiver. Usado em pre-condition de TC2.
  538 |    */
  539 |   async ensureInactive(name: string): Promise<void> {
  540 |     if (await this.getActiveStateByName(name)) {
  541 |       await this.toggleActiveByName(name);
  542 |     }
  543 |   }
  544 | 
  545 |   // ---------- Modal de bloqueio (TC3) ----------
  546 |   // Confirmado live 2026-05-06 com auto-seed via UI (associação painel↔menu
  547 |   // funcional após deploy de "Painéis do usuário" no `<select id="page_model">`):
  548 |   // ao clicar no switch "Ativo?" de painel ASSOCIADO a 1+ menus, abre
  549 |   // `<div role="dialog" class="chakra-modal__content">` com:
  550 |   // - Header literal: "Painel em uso" (precedido do ícone material "warning")
  551 |   // - Body literal: "Não é possível desabilitar pois existem menus
  552 |   //   configurados que estão utilizando este painel no modo de uso." +
  553 |   //   lista de cada menu vinculado no formato "Nome do menu: <itemName>
  554 |   //   Modo de uso: <useModeName>".
  555 |   // - Footer: botão "Entendi" com `data-test-id="panel-in-use-modal-confirm"`
  556 |   //   (único data-test-id real descoberto na UI da listagem até hoje).
  557 | 
  558 |   /**
  559 |    * Modal informativo "Painel em uso" que aparece ao tentar inativar painel
  560 |    * vinculado a 1+ menus de modos de uso. Ancoramos pelo botão estável
  561 |    * `[data-test-id="panel-in-use-modal-confirm"]` subindo até o
  562 |    * `.chakra-modal__content` para evitar o falso positivo do popover de
  563 |    * Notificações (que também é `role="dialog"` mas é Chakra Popover, não Modal).
  564 |    * REVISAR: aguardando data-test-id no container do modal em si.
  565 |    */
  566 |   getInactivationBlockedModal(): Locator {
  567 |     return this.page
  568 |       .locator('.chakra-modal__content')
  569 |       .filter({ has: this.page.locator('[data-test-id="panel-in-use-modal-confirm"]') });
  570 |   }
  571 | 
  572 |   getInactivationBlockedModalTitle(): Locator {
  573 |     return this.getInactivationBlockedModal().locator('header.chakra-modal__header');
  574 |   }
  575 | 
  576 |   getInactivationBlockedModalBody(): Locator {
  577 |     return this.getInactivationBlockedModal().locator('.chakra-modal__body');
  578 |   }
  579 | 
  580 |   /**
  581 |    * Botão "Entendi" — único confirm do modal. Texto literal "Entendi" e
  582 |    * `data-test-id` estável.
  583 |    */
  584 |   getInactivationBlockedModalCloseButton(): Locator {
  585 |     return this.page.locator('[data-test-id="panel-in-use-modal-confirm"]');
  586 |   }
  587 | 
  588 |   async closeInactivationBlockedModal(): Promise<void> {
  589 |     await this.getInactivationBlockedModalCloseButton().click();
  590 |     await expect(this.getInactivationBlockedModal()).not.toBeVisible();
  591 |   }
  592 | 
  593 |   // ---------- Aliases legados (TC4 ainda referencia getBlockedModal*) ----------
  594 |   // Mantidos enquanto TC4 estiver `BLOCKED-BY-SEED`. Quando TC4 for
  595 |   // reescrito, migrar pra `getInactivationBlockedModal*` ou criar `getReactivationBlockedModal*`
  596 |   // se o modal de TC4 (reativar menu vinculado a painel inativo) tiver
  597 |   // estrutura diferente — ainda não validado live.
  598 | 
  599 |   getBlockedModal(): Locator {
  600 |     return this.getInactivationBlockedModal();
  601 |   }
  602 | 
  603 |   getBlockedModalTitle(): Locator {
  604 |     return this.getInactivationBlockedModalTitle();
```