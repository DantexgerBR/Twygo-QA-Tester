# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\dashboard-visao-do-aluno\exibir-widget-por-aba.spec.ts >> Dashboard - Visão do aluno >> Exibição de um widget por aba
- Location: projects\widgets\tests\features\dashboard-visao-do-aluno\exibir-widget-por-aba.spec.ts:86:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Item Painel WPA w1-1778784497809' })

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
        - generic [ref=e315]: Menu
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
                - row "Painel WC w0-1778784508756 Painel widget customizações 14/05/2026 edit content_copy delete" [ref=e376]:
                  - cell "Painel WC w0-1778784508756" [ref=e377]:
                    - paragraph [ref=e378]: Painel WC w0-1778784508756
                  - cell "Painel widget customizações" [ref=e379]:
                    - paragraph [ref=e380]: Painel widget customizações
                  - cell "14/05/2026" [ref=e381]
                  - cell [ref=e382]:
                    - checkbox [checked] [ref=e384]
                  - cell "edit content_copy delete" [ref=e387]:
                    - generic [ref=e389]:
                      - generic [ref=e392] [cursor=pointer]: edit
                      - generic [ref=e395] [cursor=pointer]: content_copy
                      - generic [ref=e398] [cursor=pointer]: delete
                - row "Painel Widget Ranking 1778773874354 Painel criado pela automação de testes (suíte Adicionar widgets). 14/05/2026 edit content_copy delete" [ref=e399]:
                  - cell "Painel Widget Ranking 1778773874354" [ref=e400]:
                    - paragraph [ref=e401]: Painel Widget Ranking 1778773874354
                  - cell "Painel criado pela automação de testes (suíte Adicionar widgets)." [ref=e402]:
                    - paragraph [ref=e403]: Painel criado pela automação de testes (suíte Adicionar widgets).
                  - cell "14/05/2026" [ref=e404]
                  - cell [ref=e405]:
                    - checkbox [checked] [ref=e407]
                  - cell "edit content_copy delete" [ref=e410]:
                    - generic [ref=e412]:
                      - generic [ref=e415] [cursor=pointer]: edit
                      - generic [ref=e418] [cursor=pointer]: content_copy
                      - generic [ref=e421] [cursor=pointer]: delete
                - row "Painel Voltar Step 1778770336924 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e422]:
                  - cell "Painel Voltar Step 1778770336924" [ref=e423]:
                    - paragraph [ref=e424]: Painel Voltar Step 1778770336924
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e425]:
                    - paragraph [ref=e426]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e427]
                  - cell [ref=e428]:
                    - checkbox [checked] [ref=e430]
                  - cell "edit content_copy delete" [ref=e433]:
                    - generic [ref=e435]:
                      - generic [ref=e438] [cursor=pointer]: edit
                      - generic [ref=e441] [cursor=pointer]: content_copy
                      - generic [ref=e444] [cursor=pointer]: delete
                - row "Painel Destino Preview 1778770294905 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e445]:
                  - cell "Painel Destino Preview 1778770294905" [ref=e446]:
                    - paragraph [ref=e447]: Painel Destino Preview 1778770294905
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e448]:
                    - paragraph [ref=e449]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e450]
                  - cell [ref=e451]:
                    - checkbox [checked] [ref=e453]
                  - cell "edit content_copy delete" [ref=e456]:
                    - generic [ref=e458]:
                      - generic [ref=e461] [cursor=pointer]: edit
                      - generic [ref=e464] [cursor=pointer]: content_copy
                      - generic [ref=e467] [cursor=pointer]: delete
                - row "Painel Origem Preview 1778770294904 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e468]:
                  - cell "Painel Origem Preview 1778770294904" [ref=e469]:
                    - paragraph [ref=e470]: Painel Origem Preview 1778770294904
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e471]:
                    - paragraph [ref=e472]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e473]
                  - cell [ref=e474]:
                    - checkbox [checked] [ref=e476]
                  - cell "edit content_copy delete" [ref=e479]:
                    - generic [ref=e481]:
                      - generic [ref=e484] [cursor=pointer]: edit
                      - generic [ref=e487] [cursor=pointer]: content_copy
                      - generic [ref=e490] [cursor=pointer]: delete
                - row "Painel Sem Selecao 1778770280034 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e491]:
                  - cell "Painel Sem Selecao 1778770280034" [ref=e492]:
                    - paragraph [ref=e493]: Painel Sem Selecao 1778770280034
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e494]:
                    - paragraph [ref=e495]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e496]
                  - cell [ref=e497]:
                    - checkbox [checked] [ref=e499]
                  - cell "edit content_copy delete" [ref=e502]:
                    - generic [ref=e504]:
                      - generic [ref=e507] [cursor=pointer]: edit
                      - generic [ref=e510] [cursor=pointer]: content_copy
                      - generic [ref=e513] [cursor=pointer]: delete
                - row "Painel Destino Importar 1778770236980 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e514]:
                  - cell "Painel Destino Importar 1778770236980" [ref=e515]:
                    - paragraph [ref=e516]: Painel Destino Importar 1778770236980
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e517]:
                    - paragraph [ref=e518]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e519]
                  - cell [ref=e520]:
                    - checkbox [checked] [ref=e522]
                  - cell "edit content_copy delete" [ref=e525]:
                    - generic [ref=e527]:
                      - generic [ref=e530] [cursor=pointer]: edit
                      - generic [ref=e533] [cursor=pointer]: content_copy
                      - generic [ref=e536] [cursor=pointer]: delete
                - row "Painel Origem Importar 1778770236979 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e537]:
                  - cell "Painel Origem Importar 1778770236979" [ref=e538]:
                    - paragraph [ref=e539]: Painel Origem Importar 1778770236979
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e540]:
                    - paragraph [ref=e541]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e542]
                  - cell [ref=e543]:
                    - checkbox [checked] [ref=e545]
                  - cell "edit content_copy delete" [ref=e548]:
                    - generic [ref=e550]:
                      - generic [ref=e553] [cursor=pointer]: edit
                      - generic [ref=e556] [cursor=pointer]: content_copy
                      - generic [ref=e559] [cursor=pointer]: delete
                - row "Painel Destino Categoria 1778770203182 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e560]:
                  - cell "Painel Destino Categoria 1778770203182" [ref=e561]:
                    - paragraph [ref=e562]: Painel Destino Categoria 1778770203182
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e563]:
                    - paragraph [ref=e564]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e565]
                  - cell [ref=e566]:
                    - checkbox [checked] [ref=e568]
                  - cell "edit content_copy delete" [ref=e571]:
                    - generic [ref=e573]:
                      - generic [ref=e576] [cursor=pointer]: edit
                      - generic [ref=e579] [cursor=pointer]: content_copy
                      - generic [ref=e582] [cursor=pointer]: delete
                - row "Painel Origem Categoria 1778770203181 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e583]:
                  - cell "Painel Origem Categoria 1778770203181" [ref=e584]:
                    - paragraph [ref=e585]: Painel Origem Categoria 1778770203181
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e586]:
                    - paragraph [ref=e587]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e588]
                  - cell [ref=e589]:
                    - checkbox [checked] [ref=e591]
                  - cell "edit content_copy delete" [ref=e594]:
                    - generic [ref=e596]:
                      - generic [ref=e599] [cursor=pointer]: edit
                      - generic [ref=e602] [cursor=pointer]: content_copy
                      - generic [ref=e605] [cursor=pointer]: delete
                - row "Painel Destino Happy 1778770167952 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e606]:
                  - cell "Painel Destino Happy 1778770167952" [ref=e607]:
                    - paragraph [ref=e608]: Painel Destino Happy 1778770167952
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e609]:
                    - paragraph [ref=e610]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e611]
                  - cell [ref=e612]:
                    - checkbox [checked] [ref=e614]
                  - cell "edit content_copy delete" [ref=e617]:
                    - generic [ref=e619]:
                      - generic [ref=e622] [cursor=pointer]: edit
                      - generic [ref=e625] [cursor=pointer]: content_copy
                      - generic [ref=e628] [cursor=pointer]: delete
                - row "Painel Origem Happy 1778770167951 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e629]:
                  - cell "Painel Origem Happy 1778770167951" [ref=e630]:
                    - paragraph [ref=e631]: Painel Origem Happy 1778770167951
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e632]:
                    - paragraph [ref=e633]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e634]
                  - cell [ref=e635]:
                    - checkbox [checked] [ref=e637]
                  - cell "edit content_copy delete" [ref=e640]:
                    - generic [ref=e642]:
                      - generic [ref=e645] [cursor=pointer]: edit
                      - generic [ref=e648] [cursor=pointer]: content_copy
                      - generic [ref=e651] [cursor=pointer]: delete
                - row "Painel Destino Editar 1778770125105 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e652]:
                  - cell "Painel Destino Editar 1778770125105" [ref=e653]:
                    - paragraph [ref=e654]: Painel Destino Editar 1778770125105
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e655]:
                    - paragraph [ref=e656]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e657]
                  - cell [ref=e658]:
                    - checkbox [checked] [ref=e660]
                  - cell "edit content_copy delete" [ref=e663]:
                    - generic [ref=e665]:
                      - generic [ref=e668] [cursor=pointer]: edit
                      - generic [ref=e671] [cursor=pointer]: content_copy
                      - generic [ref=e674] [cursor=pointer]: delete
                - row "Painel Origem Editar 1778770125104 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e675]:
                  - cell "Painel Origem Editar 1778770125104" [ref=e676]:
                    - paragraph [ref=e677]: Painel Origem Editar 1778770125104
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e678]:
                    - paragraph [ref=e679]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e680]
                  - cell [ref=e681]:
                    - checkbox [checked] [ref=e683]
                  - cell "edit content_copy delete" [ref=e686]:
                    - generic [ref=e688]:
                      - generic [ref=e691] [cursor=pointer]: edit
                      - generic [ref=e694] [cursor=pointer]: content_copy
                      - generic [ref=e697] [cursor=pointer]: delete
                - row "Painel Cancelar Importar 1778770109124 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e698]:
                  - cell "Painel Cancelar Importar 1778770109124" [ref=e699]:
                    - paragraph [ref=e700]: Painel Cancelar Importar 1778770109124
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e701]:
                    - paragraph [ref=e702]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e703]
                  - cell [ref=e704]:
                    - checkbox [checked] [ref=e706]
                  - cell "edit content_copy delete" [ref=e709]:
                    - generic [ref=e711]:
                      - generic [ref=e714] [cursor=pointer]: edit
                      - generic [ref=e717] [cursor=pointer]: content_copy
                      - generic [ref=e720] [cursor=pointer]: delete
                - row "Painel Destino AutoNome 1778770074579 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e721]:
                  - cell "Painel Destino AutoNome 1778770074579" [ref=e722]:
                    - paragraph [ref=e723]: Painel Destino AutoNome 1778770074579
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e724]:
                    - paragraph [ref=e725]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e726]
                  - cell [ref=e727]:
                    - checkbox [checked] [ref=e729]
                  - cell "edit content_copy delete" [ref=e732]:
                    - generic [ref=e734]:
                      - generic [ref=e737] [cursor=pointer]: edit
                      - generic [ref=e740] [cursor=pointer]: content_copy
                      - generic [ref=e743] [cursor=pointer]: delete
                - row "Painel Origem AutoNome 1778770074578 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e744]:
                  - cell "Painel Origem AutoNome 1778770074578" [ref=e745]:
                    - paragraph [ref=e746]: Painel Origem AutoNome 1778770074578
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e747]:
                    - paragraph [ref=e748]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e749]
                  - cell [ref=e750]:
                    - checkbox [checked] [ref=e752]
                  - cell "edit content_copy delete" [ref=e755]:
                    - generic [ref=e757]:
                      - generic [ref=e760] [cursor=pointer]: edit
                      - generic [ref=e763] [cursor=pointer]: content_copy
                      - generic [ref=e766] [cursor=pointer]: delete
                - row "Painel Destino Importar 1778770059795 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e767]:
                  - cell "Painel Destino Importar 1778770059795" [ref=e768]:
                    - paragraph [ref=e769]: Painel Destino Importar 1778770059795
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e770]:
                    - paragraph [ref=e771]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e772]
                  - cell [ref=e773]:
                    - checkbox [checked] [ref=e775]
                  - cell "edit content_copy delete" [ref=e778]:
                    - generic [ref=e780]:
                      - generic [ref=e783] [cursor=pointer]: edit
                      - generic [ref=e786] [cursor=pointer]: content_copy
                      - generic [ref=e789] [cursor=pointer]: delete
                - row "Painel Destino Editar 1778769972615 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e790]:
                  - cell "Painel Destino Editar 1778769972615" [ref=e791]:
                    - paragraph [ref=e792]: Painel Destino Editar 1778769972615
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e793]:
                    - paragraph [ref=e794]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e795]
                  - cell [ref=e796]:
                    - checkbox [checked] [ref=e798]
                  - cell "edit content_copy delete" [ref=e801]:
                    - generic [ref=e803]:
                      - generic [ref=e806] [cursor=pointer]: edit
                      - generic [ref=e809] [cursor=pointer]: content_copy
                      - generic [ref=e812] [cursor=pointer]: delete
                - row "Painel Origem Editar 1778769972614 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e813]:
                  - cell "Painel Origem Editar 1778769972614" [ref=e814]:
                    - paragraph [ref=e815]: Painel Origem Editar 1778769972614
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e816]:
                    - paragraph [ref=e817]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e818]
                  - cell [ref=e819]:
                    - checkbox [checked] [ref=e821]
                  - cell "edit content_copy delete" [ref=e824]:
                    - generic [ref=e826]:
                      - generic [ref=e829] [cursor=pointer]: edit
                      - generic [ref=e832] [cursor=pointer]: content_copy
                      - generic [ref=e835] [cursor=pointer]: delete
                - row "Painel Destino Preview 1778769895874 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e836]:
                  - cell "Painel Destino Preview 1778769895874" [ref=e837]:
                    - paragraph [ref=e838]: Painel Destino Preview 1778769895874
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e839]:
                    - paragraph [ref=e840]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e841]
                  - cell [ref=e842]:
                    - checkbox [checked] [ref=e844]
                  - cell "edit content_copy delete" [ref=e847]:
                    - generic [ref=e849]:
                      - generic [ref=e852] [cursor=pointer]: edit
                      - generic [ref=e855] [cursor=pointer]: content_copy
                      - generic [ref=e858] [cursor=pointer]: delete
                - row "Painel Voltar Step 1778769911878 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e859]:
                  - cell "Painel Voltar Step 1778769911878" [ref=e860]:
                    - paragraph [ref=e861]: Painel Voltar Step 1778769911878
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e862]:
                    - paragraph [ref=e863]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e864]
                  - cell [ref=e865]:
                    - checkbox [checked] [ref=e867]
                  - cell "edit content_copy delete" [ref=e870]:
                    - generic [ref=e872]:
                      - generic [ref=e875] [cursor=pointer]: edit
                      - generic [ref=e878] [cursor=pointer]: content_copy
                      - generic [ref=e881] [cursor=pointer]: delete
                - row "Painel Destino Importar 1778769880199 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e882]:
                  - cell "Painel Destino Importar 1778769880199" [ref=e883]:
                    - paragraph [ref=e884]: Painel Destino Importar 1778769880199
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e885]:
                    - paragraph [ref=e886]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e887]
                  - cell [ref=e888]:
                    - checkbox [checked] [ref=e890]
                  - cell "edit content_copy delete" [ref=e893]:
                    - generic [ref=e895]:
                      - generic [ref=e898] [cursor=pointer]: edit
                      - generic [ref=e901] [cursor=pointer]: content_copy
                      - generic [ref=e904] [cursor=pointer]: delete
                - row "Painel Origem Preview 1778769895873 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e905]:
                  - cell "Painel Origem Preview 1778769895873" [ref=e906]:
                    - paragraph [ref=e907]: Painel Origem Preview 1778769895873
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e908]:
                    - paragraph [ref=e909]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e910]
                  - cell [ref=e911]:
                    - checkbox [checked] [ref=e913]
                  - cell "edit content_copy delete" [ref=e916]:
                    - generic [ref=e918]:
                      - generic [ref=e921] [cursor=pointer]: edit
                      - generic [ref=e924] [cursor=pointer]: content_copy
                      - generic [ref=e927] [cursor=pointer]: delete
                - row "Painel Sem Selecao 1778769895502 Painel criado pela automação de testes (suíte Importar abas). 14/05/2026 edit content_copy delete" [ref=e928]:
                  - cell "Painel Sem Selecao 1778769895502" [ref=e929]:
                    - paragraph [ref=e930]: Painel Sem Selecao 1778769895502
                  - cell "Painel criado pela automação de testes (suíte Importar abas)." [ref=e931]:
                    - paragraph [ref=e932]: Painel criado pela automação de testes (suíte Importar abas).
                  - cell "14/05/2026" [ref=e933]
                  - cell [ref=e934]:
                    - checkbox [checked] [ref=e936]
                  - cell "edit content_copy delete" [ref=e939]:
                    - generic [ref=e941]:
                      - generic [ref=e944] [cursor=pointer]: edit
                      - generic [ref=e947] [cursor=pointer]: content_copy
                      - generic [ref=e950] [cursor=pointer]: delete
            - generic [ref=e952]:
              - generic [ref=e953]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e954]:
                  - generic [ref=e955]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e956]:
                  - generic [ref=e957]: chevron_left
                - button "1" [ref=e958] [cursor=pointer]
                - button "2" [ref=e959] [cursor=pointer]
                - button "3" [ref=e960] [cursor=pointer]
                - button "4" [ref=e961] [cursor=pointer]
                - button "5" [ref=e962] [cursor=pointer]
                - button "chevron_right" [ref=e963] [cursor=pointer]:
                  - generic [ref=e964]: chevron_right
              - generic [ref=e965]:
                - combobox [ref=e966]:
                  - option "25 por página" [selected]
                  - option "50 por página"
                  - option "100 por página"
                - generic:
                  - img
  - region "Widget de chat" [ref=e967]:
    - iframe [ref=e968]:
      - button "Abrir chat ao vivo" [ref=f34e5]:
        - img [ref=f34e8]
        - img [ref=f34e15]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e969]:
        - generic [ref=e970]:
          - img [ref=e972]
          - generic [ref=e975]: Registro excluído com sucesso!
          - button "Close" [ref=e976] [cursor=pointer]:
            - img [ref=e977]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e979]:
        - generic [ref=e980]:
          - img [ref=e982]
          - generic [ref=e985]: Registro excluído com sucesso!
          - button "Close" [ref=e986] [cursor=pointer]:
            - img [ref=e987]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e989]:
        - generic [ref=e990]:
          - img [ref=e992]
          - generic [ref=e995]: Registro excluído com sucesso!
          - button "Close" [ref=e996] [cursor=pointer]:
            - img [ref=e997]
```

# Test source

```ts
  1   | // BLOCKED-BY-PRODUCT-BUG: feedback_panel_layout_save_no_persist (memory).
  2   | // Re-verificado live 2026-05-14: click em "Salvar Layout" dispara ZERO
  3   | // POST/PATCH ao backend. Abas e widgets adicionados ficam em React state
  4   | // e somem no reload. Aluno acessa painel com apenas a aba default,
  5   | // sem widgets → asserção `toHaveCount(5)` falha vermelha.
  6   | // Quando o produto corrigir o save layout, este spec passa sem mudança.
  7   | //
  8   | // Pré-condições reproduzidas em beforeAll (todas executam, todas SEM
  9   | // efeito no backend exceto criação do painel + associação do menu):
  10  | //   1. Admin cria painel
  11  | //   2. Admin adiciona 4 abas extras → total 5 (não persistem)
  12  | //   3. Admin adiciona 1 widget em cada aba (não persistem)
  13  | //   4. Admin clica "Salvar Layout" (não dispara request)
  14  | //   5. Admin associa painel ao Modo de uso Aluno
  15  | //   6. Spec: switch Aluno → click menu item → painel renderiza com 1 aba
  16  | //      default e 0 widgets → asserção falha = signal pro dev
  17  | 
  18  | import { resolve } from 'node:path';
  19  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  20  | import * as allure from 'allure-js-commons';
  21  | import { PaineisListPage } from '../../../pages/PaineisListPage.js';
  22  | import { PainelFormPage } from '../../../pages/PainelFormPage.js';
  23  | import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
  24  | import { exibirWidgetPorAbaData as data } from './exibir-widget-por-aba.data.js';
  25  | 
  26  | test.use({ viewport: { width: 1920, height: 1080 } });
  27  | 
  28  | const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');
  29  | 
  30  | test.describe('Dashboard - Visão do aluno', () => {
  31  |   let panelName: string;
  32  | 
  33  |   test.beforeAll(async ({ browser }, testInfo) => {
  34  |     panelName = `Painel WPA w${testInfo.workerIndex}-${Date.now()}`;
  35  |     const ctx = await browser.newContext({ storageState: STORAGE_STATE });
  36  |     const page = await ctx.newPage();
  37  |     try {
  38  |       const painelForm = new PainelFormPage(page);
  39  |       await painelForm.goToNew();
  40  |       await painelForm.createPanel(panelName, 'Painel exibir widget por aba');
  41  | 
  42  |       await painelForm.getLayoutsTab().click();
  43  | 
  44  |       // Aba 1 já existe (Nova aba) — adiciona widget.
  45  |       await page.getByText('Nova aba', { exact: true }).click();
  46  |       await painelForm.openWidgetDrawer();
  47  |       await painelForm.addWidget(data.widgetPerTab[0]);
  48  | 
  49  |       // Cria 4 abas extras com 1 widget cada.
  50  |       for (let i = 0; i < data.tabsExtras.length; i++) {
  51  |         const tabName = data.tabsExtras[i]!;
  52  |         const widgetId = data.widgetPerTab[i + 1]!;
  53  |         await painelForm.addTab(tabName);
  54  |         await page.getByText(tabName, { exact: true }).click();
  55  |         await painelForm.openWidgetDrawer();
  56  |         await painelForm.addWidget(widgetId);
  57  |       }
  58  | 
  59  |       await painelForm.waitForToastsToClear();
  60  |       await painelForm.getSaveLayoutButton().click({ force: true });
  61  | 
  62  |       const paineis = new PaineisListPage(page);
  63  |       await paineis.associatePanelToMenu(panelName, data.alunoUseModeId);
  64  |     } finally {
  65  |       await ctx.close();
  66  |     }
  67  |   });
  68  | 
  69  |   test.afterAll(async ({ browser }) => {
  70  |     const ctx = await browser.newContext({ storageState: STORAGE_STATE });
  71  |     const page = await ctx.newPage();
  72  |     try {
  73  |       const paineis = new PaineisListPage(page);
  74  |       await paineis.disassociatePanelFromMenu_safe(panelName, data.alunoUseModeId);
  75  |       await paineis.goToList();
  76  |       await paineis.deletePanelByNameSafe(panelName);
  77  |     } finally {
  78  |       await ctx.close();
  79  |     }
  80  |   });
  81  | 
  82  |   test.afterEach(async ({ page }) => {
  83  |     await new ProfileSwitcher(page).revertToAdminSafe();
  84  |   });
  85  | 
  86  |   test('Exibição de um widget por aba', async ({ page, step }) => {
  87  |     await allure.epic('Twygo - Widgets');
  88  |     await allure.feature('Dashboard - Visão do aluno');
  89  |     await allure.story('Exibição de um widget por aba');
  90  |     await allure.severity('normal');
  91  | 
  92  |     const switcher = new ProfileSwitcher(page);
  93  | 
  94  |     await step('1. Switch para perfil Aluno via popover', async () => {
  95  |       await switcher.switchToViaUrl('Aluno');
  96  |     });
  97  | 
  98  |     await step(`2. Clicar no item de menu "Item ${panelName}"`, async () => {
> 99  |       await page.getByRole('link', { name: `Item ${panelName}` }).click();
      |                                                                   ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  100 |       await page.waitForLoadState('domcontentloaded');
  101 |     });
  102 | 
  103 |     await step('3. Verificar painel renderiza 5 abas', async () => {
  104 |       const tabs = page.getByRole('tab');
  105 |       await expect(tabs).toHaveCount(data.expectedTabsCount);
  106 |     });
  107 |   });
  108 | });
  109 | 
```