# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\duplicar-paineis\duplicar-painel-varias-abas-widgets.spec.ts >> Duplicar painéis >> Duplicar painel próprio com várias abas e widgets
- Location: projects\widgets\tests\features\duplicar-paineis\duplicar-painel-varias-abas-widgets.spec.ts:83:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByTestId('tabs-navigation-add-button')

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
  - generic [ref=e223]:
    - generic [ref=e225]:
      - list [ref=e226]:
        - list [ref=e227]:
          - listitem [ref=e228] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e229]:
              - /url: /o/36988/dashboard
              - generic [ref=e230]:
                - generic [ref=e232]: leaderboard
                - generic [ref=e233]: Dashboard
          - listitem [ref=e234] [cursor=pointer]:
            - generic [ref=e236]:
              - generic [ref=e239]: school
              - generic [ref=e240]: Aprendizagem
              - generic [ref=e242]: G
          - listitem [ref=e243] [cursor=pointer]:
            - link "group Usuários" [ref=e244]:
              - /url: /o/36988/users
              - generic [ref=e245]:
                - generic [ref=e247]: group
                - generic [ref=e248]: Usuários
          - listitem [ref=e249] [cursor=pointer]:
            - link "work Empresas" [ref=e250]:
              - /url: /o/36988/companies
              - generic [ref=e251]:
                - generic [ref=e253]: work
                - generic [ref=e254]: Empresas
          - listitem [ref=e255] [cursor=pointer]:
            - link "live_help Questionários" [ref=e256]:
              - /url: /o/36988/question_lists
              - generic [ref=e257]:
                - generic [ref=e259]: live_help
                - generic [ref=e260]: Questionários
          - listitem [ref=e261] [cursor=pointer]:
            - link "groups Comunidades" [ref=e262]:
              - /url: /o/36988/feed
              - generic [ref=e263]:
                - generic [ref=e265]: groups
                - generic [ref=e266]: Comunidades
          - listitem [ref=e267] [cursor=pointer]:
            - generic [ref=e269]:
              - generic [ref=e272]: psychology
              - generic [ref=e273]:
                - text: Skills
                - generic [ref=e274]: BETA
              - generic [ref=e276]: G
          - listitem [ref=e277] [cursor=pointer]:
            - generic [ref=e279]:
              - generic [ref=e282]: account_tree
              - generic [ref=e283]: Processos
              - generic [ref=e285]: G
      - generic [ref=e287]: widgets [36988]
      - list [ref=e288]:
        - listitem [ref=e289] [cursor=pointer]:
          - generic [ref=e290]:
            - generic [ref=e291]: f
            - text: Configurações
            - generic [ref=e292]: G
          - text: e    s 
    - generic [ref=e294]:
      - generic [ref=e297]: Menu > Modos de uso
      - generic [ref=e306]:
        - tablist [ref=e307]:
          - tab "Modos de uso" [ref=e308] [cursor=pointer]
          - tab "Painéis" [selected] [ref=e309] [cursor=pointer]
        - tabpanel "Painéis" [active] [ref=e311]:
          - generic [ref=e312]:
            - link "Adicionar" [ref=e313] [cursor=pointer]:
              - /url: /o/36988/panels/new
              - button "Adicionar" [ref=e314]:
                - img [ref=e316]
                - text: Adicionar
            - generic [ref=e318]:
              - generic [ref=e319]:
                - img [ref=e321]
                - textbox "Pesquise por nome ou descrição" [ref=e323]
              - generic [ref=e324]:
                - generic [ref=e325] [cursor=pointer]: grid_view
                - generic [ref=e326] [cursor=pointer]: reorder
              - button "Filtro" [ref=e327] [cursor=pointer]:
                - generic [ref=e329]: filter_alt
                - paragraph [ref=e331]: Filtro
          - table [ref=e333]:
            - rowgroup [ref=e334]:
              - row "Nome Descrição Data de criação Ativo?" [ref=e335]:
                - columnheader "Nome" [ref=e336] [cursor=pointer]:
                  - generic [ref=e339]:
                    - text: Nome
                    - img [ref=e340]
                - columnheader "Descrição" [ref=e342]:
                  - generic [ref=e343]: Descrição
                - columnheader "Data de criação" [ref=e344] [cursor=pointer]:
                  - generic [ref=e347]:
                    - text: Data de criação
                    - img [ref=e348]
                - columnheader "Ativo?" [ref=e350] [cursor=pointer]:
                  - generic [ref=e353]:
                    - text: Ativo?
                    - img [ref=e354]
                - columnheader [ref=e356]
            - rowgroup [ref=e357]:
              - row "Painel Inativar Dup TC1.6 w2-1778611199479 (cópia) 12/05/2026 edit content_copy delete" [ref=e358]:
                - cell "Painel Inativar Dup TC1.6 w2-1778611199479 (cópia)" [ref=e359]:
                  - paragraph [ref=e360]: Painel Inativar Dup TC1.6 w2-1778611199479 (cópia)
                - cell [ref=e361]
                - cell "12/05/2026" [ref=e362]
                - cell [ref=e363]:
                  - checkbox [ref=e365]
                - cell "edit content_copy delete" [ref=e368]:
                  - generic [ref=e370]:
                    - generic [ref=e373] [cursor=pointer]: edit
                    - generic [ref=e376] [cursor=pointer]: content_copy
                    - generic [ref=e379] [cursor=pointer]: delete
              - row "Painel TC1.5 Excluir Duplicado w0-1778611198795 (cópia) 12/05/2026 edit content_copy delete" [ref=e380]:
                - cell "Painel TC1.5 Excluir Duplicado w0-1778611198795 (cópia)" [ref=e381]:
                  - paragraph [ref=e382]: Painel TC1.5 Excluir Duplicado w0-1778611198795 (cópia)
                - cell [ref=e383]
                - cell "12/05/2026" [ref=e384]
                - cell [ref=e385]:
                  - checkbox [ref=e387]
                - cell "edit content_copy delete" [ref=e390]:
                  - generic [ref=e392]:
                    - generic [ref=e395] [cursor=pointer]: edit
                    - generic [ref=e398] [cursor=pointer]: content_copy
                    - generic [ref=e401] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778611199479 12/05/2026 edit content_copy delete" [ref=e402]:
                - cell "Painel Inativar Dup TC1.6 w2-1778611199479" [ref=e403]:
                  - paragraph [ref=e404]: Painel Inativar Dup TC1.6 w2-1778611199479
                - cell [ref=e405]
                - cell "12/05/2026" [ref=e406]
                - cell [ref=e407]:
                  - checkbox [checked] [ref=e409]
                - cell "edit content_copy delete" [ref=e412]:
                  - generic [ref=e414]:
                    - generic [ref=e417] [cursor=pointer]: edit
                    - generic [ref=e420] [cursor=pointer]: content_copy
                    - generic [ref=e423] [cursor=pointer]: delete
              - row "Painel TC1.5 Excluir Duplicado w0-1778611198795 12/05/2026 edit content_copy delete" [ref=e424]:
                - cell "Painel TC1.5 Excluir Duplicado w0-1778611198795" [ref=e425]:
                  - paragraph [ref=e426]: Painel TC1.5 Excluir Duplicado w0-1778611198795
                - cell [ref=e427]
                - cell "12/05/2026" [ref=e428]
                - cell [ref=e429]:
                  - checkbox [checked] [ref=e431]
                - cell "edit content_copy delete" [ref=e434]:
                  - generic [ref=e436]:
                    - generic [ref=e439] [cursor=pointer]: edit
                    - generic [ref=e442] [cursor=pointer]: content_copy
                    - generic [ref=e445] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w3-1778609550044 12/05/2026 edit content_copy delete" [ref=e446]:
                - cell "Painel Reativar TC4 w3-1778609550044" [ref=e447]:
                  - paragraph [ref=e448]: Painel Reativar TC4 w3-1778609550044
                - cell [ref=e449]:
                  - paragraph [ref=e450]
                - cell "12/05/2026" [ref=e451]
                - cell [ref=e452]:
                  - checkbox [checked] [ref=e454]
                - cell "edit content_copy delete" [ref=e457]:
                  - generic [ref=e459]:
                    - generic [ref=e462] [cursor=pointer]: edit
                    - generic [ref=e465] [cursor=pointer]: content_copy
                    - generic [ref=e468] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w0-1778609344876 12/05/2026 edit content_copy delete" [ref=e469]:
                - cell "Painel Reativar TC4 w0-1778609344876" [ref=e470]:
                  - paragraph [ref=e471]: Painel Reativar TC4 w0-1778609344876
                - cell [ref=e472]:
                  - paragraph [ref=e473]
                - cell "12/05/2026" [ref=e474]
                - cell [ref=e475]:
                  - checkbox [checked] [ref=e477]
                - cell "edit content_copy delete" [ref=e480]:
                  - generic [ref=e482]:
                    - generic [ref=e485] [cursor=pointer]: edit
                    - generic [ref=e488] [cursor=pointer]: content_copy
                    - generic [ref=e491] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w0-1778609207561 12/05/2026 edit content_copy delete" [ref=e492]:
                - cell "Painel Reativar TC4 w0-1778609207561" [ref=e493]:
                  - paragraph [ref=e494]: Painel Reativar TC4 w0-1778609207561
                - cell [ref=e495]:
                  - paragraph [ref=e496]
                - cell "12/05/2026" [ref=e497]
                - cell [ref=e498]:
                  - checkbox [checked] [ref=e500]
                - cell "edit content_copy delete" [ref=e503]:
                  - generic [ref=e505]:
                    - generic [ref=e508] [cursor=pointer]: edit
                    - generic [ref=e511] [cursor=pointer]: content_copy
                    - generic [ref=e514] [cursor=pointer]: delete
              - row "Painel Voltar Step 1778597018411 12/05/2026 edit content_copy delete" [ref=e515]:
                - cell "Painel Voltar Step 1778597018411" [ref=e516]:
                  - paragraph [ref=e517]: Painel Voltar Step 1778597018411
                - cell [ref=e518]:
                  - paragraph [ref=e519]
                - cell "12/05/2026" [ref=e520]
                - cell [ref=e521]:
                  - checkbox [checked] [ref=e523]
                - cell "edit content_copy delete" [ref=e526]:
                  - generic [ref=e528]:
                    - generic [ref=e531] [cursor=pointer]: edit
                    - generic [ref=e534] [cursor=pointer]: content_copy
                    - generic [ref=e537] [cursor=pointer]: delete
              - row "Painel Limite Nome Aba 1778597006306 12/05/2026 edit content_copy delete" [ref=e538]:
                - cell "Painel Limite Nome Aba 1778597006306" [ref=e539]:
                  - paragraph [ref=e540]: Painel Limite Nome Aba 1778597006306
                - cell [ref=e541]:
                  - paragraph [ref=e542]
                - cell "12/05/2026" [ref=e543]
                - cell [ref=e544]:
                  - checkbox [checked] [ref=e546]
                - cell "edit content_copy delete" [ref=e549]:
                  - generic [ref=e551]:
                    - generic [ref=e554] [cursor=pointer]: edit
                    - generic [ref=e557] [cursor=pointer]: content_copy
                    - generic [ref=e560] [cursor=pointer]: delete
              - row "Painel Nova Aba 1778596994915 12/05/2026 edit content_copy delete" [ref=e561]:
                - cell "Painel Nova Aba 1778596994915" [ref=e562]:
                  - paragraph [ref=e563]: Painel Nova Aba 1778596994915
                - cell [ref=e564]:
                  - paragraph [ref=e565]
                - cell "12/05/2026" [ref=e566]
                - cell [ref=e567]:
                  - checkbox [checked] [ref=e569]
                - cell "edit content_copy delete" [ref=e572]:
                  - generic [ref=e574]:
                    - generic [ref=e577] [cursor=pointer]: edit
                    - generic [ref=e580] [cursor=pointer]: content_copy
                    - generic [ref=e583] [cursor=pointer]: delete
              - row "Áéíóú ç ñ - _ . / 123 !@# 1778596983923 12/05/2026 edit content_copy delete" [ref=e584]:
                - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596983923" [ref=e585]:
                  - paragraph [ref=e586]: Áéíóú ç ñ - _ . / 123 !@# 1778596983923
                - cell [ref=e587]:
                  - paragraph [ref=e588]
                - cell "12/05/2026" [ref=e589]
                - cell [ref=e590]:
                  - checkbox [checked] [ref=e592]
                - cell "edit content_copy delete" [ref=e595]:
                  - generic [ref=e597]:
                    - generic [ref=e600] [cursor=pointer]: edit
                    - generic [ref=e603] [cursor=pointer]: content_copy
                    - generic [ref=e606] [cursor=pointer]: delete
              - row "Painel Aba Unica 1778596949014 12/05/2026 edit content_copy delete" [ref=e607]:
                - cell "Painel Aba Unica 1778596949014" [ref=e608]:
                  - paragraph [ref=e609]: Painel Aba Unica 1778596949014
                - cell [ref=e610]:
                  - paragraph [ref=e611]
                - cell "12/05/2026" [ref=e612]
                - cell [ref=e613]:
                  - checkbox [checked] [ref=e615]
                - cell "edit content_copy delete" [ref=e618]:
                  - generic [ref=e620]:
                    - generic [ref=e623] [cursor=pointer]: edit
                    - generic [ref=e626] [cursor=pointer]: content_copy
                    - generic [ref=e629] [cursor=pointer]: delete
              - row "Painel Renomear 1778596936523 12/05/2026 edit content_copy delete" [ref=e630]:
                - cell "Painel Renomear 1778596936523" [ref=e631]:
                  - paragraph [ref=e632]: Painel Renomear 1778596936523
                - cell [ref=e633]:
                  - paragraph [ref=e634]
                - cell "12/05/2026" [ref=e635]
                - cell [ref=e636]:
                  - checkbox [checked] [ref=e638]
                - cell "edit content_copy delete" [ref=e641]:
                  - generic [ref=e643]:
                    - generic [ref=e646] [cursor=pointer]: edit
                    - generic [ref=e649] [cursor=pointer]: content_copy
                    - generic [ref=e652] [cursor=pointer]: delete
              - row "Painel TC17 1778596921353 12/05/2026 edit content_copy delete" [ref=e653]:
                - cell "Painel TC17 1778596921353" [ref=e654]:
                  - paragraph [ref=e655]: Painel TC17 1778596921353
                - cell [ref=e656]:
                  - paragraph [ref=e657]
                - cell "12/05/2026" [ref=e658]
                - cell [ref=e659]:
                  - checkbox [checked] [ref=e661]
                - cell "edit content_copy delete" [ref=e664]:
                  - generic [ref=e666]:
                    - generic [ref=e669] [cursor=pointer]: edit
                    - generic [ref=e672] [cursor=pointer]: content_copy
                    - generic [ref=e675] [cursor=pointer]: delete
              - row "Painel TC16 1778596909478 12/05/2026 edit content_copy delete" [ref=e676]:
                - cell "Painel TC16 1778596909478" [ref=e677]:
                  - paragraph [ref=e678]: Painel TC16 1778596909478
                - cell [ref=e679]:
                  - paragraph [ref=e680]
                - cell "12/05/2026" [ref=e681]
                - cell [ref=e682]:
                  - checkbox [checked] [ref=e684]
                - cell "edit content_copy delete" [ref=e687]:
                  - generic [ref=e689]:
                    - generic [ref=e692] [cursor=pointer]: edit
                    - generic [ref=e695] [cursor=pointer]: content_copy
                    - generic [ref=e698] [cursor=pointer]: delete
              - row "Painel Excluir Aba Multi 1778596890745 12/05/2026 edit content_copy delete" [ref=e699]:
                - cell "Painel Excluir Aba Multi 1778596890745" [ref=e700]:
                  - paragraph [ref=e701]: Painel Excluir Aba Multi 1778596890745
                - cell [ref=e702]:
                  - paragraph [ref=e703]
                - cell "12/05/2026" [ref=e704]
                - cell [ref=e705]:
                  - checkbox [checked] [ref=e707]
                - cell "edit content_copy delete" [ref=e710]:
                  - generic [ref=e712]:
                    - generic [ref=e715] [cursor=pointer]: edit
                    - generic [ref=e718] [cursor=pointer]: content_copy
                    - generic [ref=e721] [cursor=pointer]: delete
              - row "Painel de Vendas Q1 1778596878472 Painel para acompanhamento de KPIs de vendas 12/05/2026 edit content_copy delete" [ref=e722]:
                - cell "Painel de Vendas Q1 1778596878472" [ref=e723]:
                  - paragraph [ref=e724]: Painel de Vendas Q1 1778596878472
                - cell "Painel para acompanhamento de KPIs de vendas" [ref=e725]:
                  - paragraph [ref=e726]: Painel para acompanhamento de KPIs de vendas
                - cell "12/05/2026" [ref=e727]
                - cell [ref=e728]:
                  - checkbox [checked] [ref=e730]
                - cell "edit content_copy delete" [ref=e733]:
                  - generic [ref=e735]:
                    - generic [ref=e738] [cursor=pointer]: edit
                    - generic [ref=e741] [cursor=pointer]: content_copy
                    - generic [ref=e744] [cursor=pointer]: delete
              - row "Painel Cancelar Renomear 1778596866066 12/05/2026 edit content_copy delete" [ref=e745]:
                - cell "Painel Cancelar Renomear 1778596866066" [ref=e746]:
                  - paragraph [ref=e747]: Painel Cancelar Renomear 1778596866066
                - cell [ref=e748]:
                  - paragraph [ref=e749]
                - cell "12/05/2026" [ref=e750]
                - cell [ref=e751]:
                  - checkbox [checked] [ref=e753]
                - cell "edit content_copy delete" [ref=e756]:
                  - generic [ref=e758]:
                    - generic [ref=e761] [cursor=pointer]: edit
                    - generic [ref=e764] [cursor=pointer]: content_copy
                    - generic [ref=e767] [cursor=pointer]: delete
              - row "Painel Cancelar Criar Aba 1778596852767 12/05/2026 edit content_copy delete" [ref=e768]:
                - cell "Painel Cancelar Criar Aba 1778596852767" [ref=e769]:
                  - paragraph [ref=e770]: Painel Cancelar Criar Aba 1778596852767
                - cell [ref=e771]:
                  - paragraph [ref=e772]
                - cell "12/05/2026" [ref=e773]
                - cell [ref=e774]:
                  - checkbox [checked] [ref=e776]
                - cell "edit content_copy delete" [ref=e779]:
                  - generic [ref=e781]:
                    - generic [ref=e784] [cursor=pointer]: edit
                    - generic [ref=e787] [cursor=pointer]: content_copy
                    - generic [ref=e790] [cursor=pointer]: delete
              - row "Painel Adicionar Aba 1778596839553 12/05/2026 edit content_copy delete" [ref=e791]:
                - cell "Painel Adicionar Aba 1778596839553" [ref=e792]:
                  - paragraph [ref=e793]: Painel Adicionar Aba 1778596839553
                - cell [ref=e794]:
                  - paragraph [ref=e795]
                - cell "12/05/2026" [ref=e796]
                - cell [ref=e797]:
                  - checkbox [checked] [ref=e799]
                - cell "edit content_copy delete" [ref=e802]:
                  - generic [ref=e804]:
                    - generic [ref=e807] [cursor=pointer]: edit
                    - generic [ref=e810] [cursor=pointer]: content_copy
                    - generic [ref=e813] [cursor=pointer]: delete
              - row "Painel A11y Teclado 1778596826265 12/05/2026 edit content_copy delete" [ref=e814]:
                - cell "Painel A11y Teclado 1778596826265" [ref=e815]:
                  - paragraph [ref=e816]: Painel A11y Teclado 1778596826265
                - cell [ref=e817]:
                  - paragraph [ref=e818]
                - cell "12/05/2026" [ref=e819]
                - cell [ref=e820]:
                  - checkbox [checked] [ref=e822]
                - cell "edit content_copy delete" [ref=e825]:
                  - generic [ref=e827]:
                    - generic [ref=e830] [cursor=pointer]: edit
                    - generic [ref=e833] [cursor=pointer]: content_copy
                    - generic [ref=e836] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778596775612 (cópia) 12/05/2026 edit content_copy delete" [ref=e837]:
                - cell "Painel Inativar Dup TC1.6 w2-1778596775612 (cópia)" [ref=e838]:
                  - paragraph [ref=e839]: Painel Inativar Dup TC1.6 w2-1778596775612 (cópia)
                - cell [ref=e840]:
                  - paragraph [ref=e841]
                - cell "12/05/2026" [ref=e842]
                - cell [ref=e843]:
                  - checkbox [ref=e845]
                - cell "edit content_copy delete" [ref=e848]:
                  - generic [ref=e850]:
                    - generic [ref=e853] [cursor=pointer]: edit
                    - generic [ref=e856] [cursor=pointer]: content_copy
                    - generic [ref=e859] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778596775612 12/05/2026 edit content_copy delete" [ref=e860]:
                - cell "Painel Inativar Dup TC1.6 w2-1778596775612" [ref=e861]:
                  - paragraph [ref=e862]: Painel Inativar Dup TC1.6 w2-1778596775612
                - cell [ref=e863]:
                  - paragraph [ref=e864]
                - cell "12/05/2026" [ref=e865]
                - cell [ref=e866]:
                  - checkbox [checked] [ref=e868]
                - cell "edit content_copy delete" [ref=e871]:
                  - generic [ref=e873]:
                    - generic [ref=e876] [cursor=pointer]: edit
                    - generic [ref=e879] [cursor=pointer]: content_copy
                    - generic [ref=e882] [cursor=pointer]: delete
              - row "Painel Voltar Step 1778596699037 12/05/2026 edit content_copy delete" [ref=e883]:
                - cell "Painel Voltar Step 1778596699037" [ref=e884]:
                  - paragraph [ref=e885]: Painel Voltar Step 1778596699037
                - cell [ref=e886]:
                  - paragraph [ref=e887]
                - cell "12/05/2026" [ref=e888]
                - cell [ref=e889]:
                  - checkbox [checked] [ref=e891]
                - cell "edit content_copy delete" [ref=e894]:
                  - generic [ref=e896]:
                    - generic [ref=e899] [cursor=pointer]: edit
                    - generic [ref=e902] [cursor=pointer]: content_copy
                    - generic [ref=e905] [cursor=pointer]: delete
              - row "Painel Limite Nome Aba 1778596685185 12/05/2026 edit content_copy delete" [ref=e906]:
                - cell "Painel Limite Nome Aba 1778596685185" [ref=e907]:
                  - paragraph [ref=e908]: Painel Limite Nome Aba 1778596685185
                - cell [ref=e909]:
                  - paragraph [ref=e910]
                - cell "12/05/2026" [ref=e911]
                - cell [ref=e912]:
                  - checkbox [checked] [ref=e914]
                - cell "edit content_copy delete" [ref=e917]:
                  - generic [ref=e919]:
                    - generic [ref=e922] [cursor=pointer]: edit
                    - generic [ref=e925] [cursor=pointer]: content_copy
                    - generic [ref=e928] [cursor=pointer]: delete
          - generic [ref=e930]:
            - generic [ref=e931]:
              - button "keyboard_double_arrow_left" [disabled] [ref=e932]:
                - generic [ref=e933]: keyboard_double_arrow_left
              - button "chevron_left" [disabled] [ref=e934]:
                - generic [ref=e935]: chevron_left
              - button "1" [ref=e936] [cursor=pointer]
              - button "2" [ref=e937] [cursor=pointer]
              - button "3" [ref=e938] [cursor=pointer]
              - button "4" [ref=e939] [cursor=pointer]
              - button "5" [ref=e940] [cursor=pointer]
              - button "chevron_right" [ref=e941] [cursor=pointer]:
                - generic [ref=e942]: chevron_right
            - generic [ref=e943]:
              - combobox [ref=e944]:
                - option "25 por página" [selected]
                - option "50 por página"
                - option "100 por página"
              - generic:
                - img
  - region "Widget de chat" [ref=e945]:
    - iframe [ref=e946]:
      - button "Abrir chat ao vivo" [ref=f5e5]:
        - img [ref=f5e8]
        - img [ref=f5e15]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e947]:
        - generic [ref=e948]:
          - img [ref=e950]
          - generic [ref=e953]: Registro excluído com sucesso!
          - button "Close" [ref=e954] [cursor=pointer]:
            - img [ref=e955]
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
```

# Test source

```ts
  101 |     return Number(match[1]);
  102 |   }
  103 | 
  104 |   // ---------- Aba Layouts: navegação de abas ----------
  105 | 
  106 |   getAddTabButton(): Locator {
  107 |     return this.page.getByTestId('tabs-navigation-add-button');
  108 |   }
  109 | 
  110 |   /**
  111 |    * Localiza o "chip" de uma aba pelo seu nome dentro do tabpanel Layouts.
  112 |    * O nome é renderizado como `<p>` (paragraph role) na barra de abas. O
  113 |    * `.locator('..')` sobe pra raiz do chip pra escopo de Renomear/Excluir.
  114 |    */
  115 |   getTabChip(tabName: string): Locator {
  116 |     return this.page
  117 |       .getByRole('tabpanel', { name: 'Layouts' })
  118 |       .locator('xpath=.//p[normalize-space()=' + JSON.stringify(tabName) + ']/ancestor::*[self::div or self::li][1]');
  119 |   }
  120 | 
  121 |   getRenameTabButton(tabName: string): Locator {
  122 |     return this.getTabChip(tabName).getByRole('button', { name: 'Renomear' });
  123 |   }
  124 | 
  125 |   getDeleteTabButton(tabName: string): Locator {
  126 |     return this.getTabChip(tabName).getByRole('button', { name: 'Excluir' });
  127 |   }
  128 | 
  129 |   // ---------- Modal Renomear aba ----------
  130 | 
  131 |   getRenameModal(): Locator {
  132 |     return this.page.getByRole('dialog').filter({ hasText: 'Renomear aba' });
  133 |   }
  134 | 
  135 |   getRenameModalInput(): Locator {
  136 |     return this.getRenameModal().locator('input').first();
  137 |   }
  138 | 
  139 |   getRenameModalSubmit(): Locator {
  140 |     return this.getRenameModal().getByRole('button', { name: 'Renomear' });
  141 |   }
  142 | 
  143 |   getRenameModalCancel(): Locator {
  144 |     return this.getRenameModal().getByRole('button', { name: 'Cancelar' });
  145 |   }
  146 | 
  147 |   async openRenameModal(tabName: string): Promise<void> {
  148 |     await this.getRenameTabButton(tabName).click();
  149 |     await this.getRenameModal().waitFor();
  150 |   }
  151 | 
  152 |   // ---------- Modal Adicionar nova aba (2 steps) ----------
  153 | 
  154 |   getAddTabModal(): Locator {
  155 |     return this.page.getByRole('dialog').filter({ hasText: 'Adicionar nova aba' });
  156 |   }
  157 | 
  158 |   getCreateNewTabOption(): Locator {
  159 |     return this.page.getByTestId('add-tab-type-modal-create-new-button');
  160 |   }
  161 | 
  162 |   getImportTabOption(): Locator {
  163 |     return this.page.getByTestId('add-tab-type-modal-import-button');
  164 |   }
  165 | 
  166 |   getAddTabTypeCancel(): Locator {
  167 |     return this.page.getByTestId('add-tab-type-modal-cancel-button');
  168 |   }
  169 | 
  170 |   // Step 2 — Criar nova aba (form)
  171 |   /**
  172 |    * Input "Nome da aba" do step 2. Sem data-test-id/aria-label; o elemento
  173 |    * é renderizado como `textbox "Digite o nome da aba"` — placeholder é o
  174 |    * accessible name. Confirmado no DOM live (2026-05-11).
  175 |    */
  176 |   getCreateTabNameInput(): Locator {
  177 |     return this.getAddTabModal().getByPlaceholder('Digite o nome da aba');
  178 |   }
  179 | 
  180 |   getCreateTabCategorySelect(): Locator {
  181 |     return this.getAddTabModal().getByRole('combobox');
  182 |   }
  183 | 
  184 |   getCreateTabBackButton(): Locator {
  185 |     return this.page.getByTestId('create-tab-modal-back-button');
  186 |   }
  187 | 
  188 |   getCreateTabCancelButton(): Locator {
  189 |     return this.page.getByTestId('create-tab-modal-cancel-button');
  190 |   }
  191 | 
  192 |   getCreateTabSubmitButton(): Locator {
  193 |     return this.page.getByTestId('create-tab-modal-create-button');
  194 |   }
  195 | 
  196 |   /**
  197 |    * Fluxo completo "Adicionar aba → Criar nova aba → preencher → submeter".
  198 |    * Após retornar, a aba `tabName` está visível na navegação.
  199 |    */
  200 |   async addTab(tabName: string): Promise<void> {
> 201 |     await this.getAddTabButton().click();
      |                                  ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  202 |     await this.getCreateNewTabOption().click();
  203 |     await this.getCreateTabNameInput().fill(tabName);
  204 |     await this.getCreateTabSubmitButton().click();
  205 |     await this.getAddTabModal().waitFor({ state: 'hidden' });
  206 |     await expect(this.page.getByText(tabName, { exact: true })).toBeVisible();
  207 |   }
  208 | 
  209 |   // ---------- Salvar Layout ----------
  210 | 
  211 |   getSaveLayoutButton(): Locator {
  212 |     return this.page.locator('[data-test-id="panel-layout-save-button"]');
  213 |   }
  214 | 
  215 |   getCancelLayoutButton(): Locator {
  216 |     return this.page.locator('[data-test-id="panel-layout-cancel-button"]');
  217 |   }
  218 | 
  219 |   // ---------- Widgets (drawer + grid) ----------
  220 | 
  221 |   /**
  222 |    * Botão "Adicionar widget" no header da aba Layouts. Quando o grid está
  223 |    * vazio o app também renderiza um botão equivalente em `widgets-grid-
  224 |    * empty-state-add-button` — preferimos sempre o do header pra simplicidade.
  225 |    */
  226 |   getAddWidgetButton(): Locator {
  227 |     return this.page.locator('[data-test-id="widgets-grid-add-button"]');
  228 |   }
  229 | 
  230 |   getEmptyStateAddWidgetButton(): Locator {
  231 |     return this.page.locator('[data-test-id="widgets-grid-empty-state-add-button"]');
  232 |   }
  233 | 
  234 |   getWidgetDrawer(): Locator {
  235 |     return this.page.locator('[data-test-id="widget-selector-drawer"]');
  236 |   }
  237 | 
  238 |   getWidgetDrawerCloseButton(): Locator {
  239 |     return this.page.locator('[data-test-id="widget-selector-drawer-close"]');
  240 |   }
  241 | 
  242 |   getWidgetDrawerSearch(): Locator {
  243 |     return this.page.locator('[data-test-id="widget-selector-search"]');
  244 |   }
  245 | 
  246 |   getWidgetDrawerFilterToggle(): Locator {
  247 |     return this.page.locator('[data-test-id="widget-selector-filter-toggle"]');
  248 |   }
  249 | 
  250 |   /**
  251 |    * Input combobox do multi-select "Categorias" no painel Filtros do drawer.
  252 |    * É um react-select — o id `widget-filter-categories` é estável e o role
  253 |    * `combobox` está no próprio input. O `<div placeholder>` ao redor
  254 |    * intercepta pointer events; clicar no input direto abre o dropdown.
  255 |    * Confirmado live 2026-05-12.
  256 |    */
  257 |   getCategoriesMultiselectInput(): Locator {
  258 |     return this.page.locator('#widget-filter-categories');
  259 |   }
  260 | 
  261 |   /**
  262 |    * Abre o dropdown do multi-select Categorias e seleciona uma opção pelo
  263 |    * nome exato (ex: 'Aprendizagem', 'Todos'). O click no input abre as
  264 |    * opções como elementos com role=option.
  265 |    */
  266 |   async selectCategoryFilter(name: 'Aprendizagem' | 'Todos'): Promise<void> {
  267 |     await this.getCategoriesMultiselectInput().click();
  268 |     await this.page.getByRole('option', { name, exact: true }).click();
  269 |   }
  270 | 
  271 |   /**
  272 |    * Group da categoria. `category` aceita o slug usado no DOM (ex: 'learning').
  273 |    * O XML chama de "Aprendizagem" → mapping ocorre na asserção do spec.
  274 |    */
  275 |   getWidgetCategoryGroup(category: 'learning'): Locator {
  276 |     return this.page.locator(`[data-test-id="widget-category-group-${category}"]`);
  277 |   }
  278 | 
  279 |   /** IDs canônicos dos widgets de Aprendizagem (validados ao vivo 2026-05-11). */
  280 |   static readonly WIDGET_IDS = {
  281 |     activity_summary: { title: 'Resumo de atividades', category: 'Aprendizagem' },
  282 |     in_progress_contents: { title: 'Conteúdos em andamento', category: 'Aprendizagem' },
  283 |     ranking: { title: 'Ranking', category: 'Aprendizagem' },
  284 |     my_certificates: { title: 'Meus certificados', category: 'Aprendizagem' },
  285 |   } as const;
  286 | 
  287 |   getWidgetCard(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
  288 |     return this.page.locator(`[data-test-id="widget-catalog-card-${id}"]`);
  289 |   }
  290 | 
  291 |   getWidgetCardProfile(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
  292 |     return this.page.locator(`[data-test-id="widget-catalog-profile-${id}"]`);
  293 |   }
  294 | 
  295 |   getWidgetCardCategoryLabel(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
  296 |     return this.page.locator(`[data-test-id="widget-catalog-category-${id}-learning"]`);
  297 |   }
  298 | 
  299 |   /**
  300 |    * Abre o drawer de seleção de widgets a partir do header ou do empty
  301 |    * state, conforme o estado atual do grid.
```