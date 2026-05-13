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
  - generic [ref=e220]:
    - generic [ref=e222]:
      - list [ref=e223]:
        - list [ref=e224]:
          - listitem [ref=e225] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e226]:
              - /url: /o/36988/dashboard
              - generic [ref=e227]:
                - generic [ref=e229]: leaderboard
                - generic [ref=e230]: Dashboard
          - listitem [ref=e231] [cursor=pointer]:
            - generic [ref=e233]:
              - generic [ref=e236]: school
              - generic [ref=e237]: Aprendizagem
              - generic [ref=e239]: G
          - listitem [ref=e240] [cursor=pointer]:
            - link "group Usuários" [ref=e241]:
              - /url: /o/36988/users
              - generic [ref=e242]:
                - generic [ref=e244]: group
                - generic [ref=e245]: Usuários
          - listitem [ref=e246] [cursor=pointer]:
            - link "work Empresas" [ref=e247]:
              - /url: /o/36988/companies
              - generic [ref=e248]:
                - generic [ref=e250]: work
                - generic [ref=e251]: Empresas
          - listitem [ref=e252] [cursor=pointer]:
            - link "live_help Questionários" [ref=e253]:
              - /url: /o/36988/question_lists
              - generic [ref=e254]:
                - generic [ref=e256]: live_help
                - generic [ref=e257]: Questionários
          - listitem [ref=e258] [cursor=pointer]:
            - link "groups Comunidades" [ref=e259]:
              - /url: /o/36988/feed
              - generic [ref=e260]:
                - generic [ref=e262]: groups
                - generic [ref=e263]: Comunidades
          - listitem [ref=e264] [cursor=pointer]:
            - generic [ref=e266]:
              - generic [ref=e269]: psychology
              - generic [ref=e270]:
                - text: Skills
                - generic [ref=e271]: BETA
              - generic [ref=e273]: G
          - listitem [ref=e274] [cursor=pointer]:
            - generic [ref=e276]:
              - generic [ref=e279]: account_tree
              - generic [ref=e280]: Processos
              - generic [ref=e282]: G
      - generic [ref=e284]: widgets [36988]
      - list [ref=e285]:
        - listitem [ref=e286] [cursor=pointer]:
          - generic [ref=e287]:
            - generic [ref=e288]: f
            - text: Configurações
            - generic [ref=e289]: G
          - text: e    s 
    - generic [ref=e291]:
      - generic [ref=e294]: Menu > Modos de uso
      - generic [ref=e303]:
        - tablist [ref=e304]:
          - tab "Modos de uso" [ref=e305] [cursor=pointer]
          - tab "Painéis" [selected] [ref=e306] [cursor=pointer]
        - tabpanel "Painéis" [active] [ref=e308]:
          - generic [ref=e309]:
            - link "Adicionar" [ref=e310] [cursor=pointer]:
              - /url: /o/36988/panels/new
              - button "Adicionar" [ref=e311]:
                - img [ref=e313]
                - text: Adicionar
            - generic [ref=e315]:
              - generic [ref=e316]:
                - img [ref=e318]
                - textbox "Pesquise por nome ou descrição" [ref=e320]
              - generic [ref=e321]:
                - generic [ref=e322] [cursor=pointer]: grid_view
                - generic [ref=e323] [cursor=pointer]: reorder
              - button "Filtro" [ref=e324] [cursor=pointer]:
                - generic [ref=e326]: filter_alt
                - paragraph [ref=e328]: Filtro
          - table [ref=e330]:
            - rowgroup [ref=e331]:
              - row "Nome Descrição Data de criação Ativo?" [ref=e332]:
                - columnheader "Nome" [ref=e333] [cursor=pointer]:
                  - generic [ref=e336]:
                    - text: Nome
                    - img [ref=e337]
                - columnheader "Descrição" [ref=e339]:
                  - generic [ref=e340]: Descrição
                - columnheader "Data de criação" [ref=e341] [cursor=pointer]:
                  - generic [ref=e344]:
                    - text: Data de criação
                    - img [ref=e345]
                - columnheader "Ativo?" [ref=e347] [cursor=pointer]:
                  - generic [ref=e350]:
                    - text: Ativo?
                    - img [ref=e351]
                - columnheader [ref=e353]
            - rowgroup [ref=e354]:
              - row "Painel Persistencia TC5 w0-1778609586661 12/05/2026 edit content_copy delete" [ref=e355]:
                - cell "Painel Persistencia TC5 w0-1778609586661" [ref=e356]:
                  - paragraph [ref=e357]: Painel Persistencia TC5 w0-1778609586661
                - cell [ref=e358]:
                  - paragraph [ref=e359]
                - cell "12/05/2026" [ref=e360]
                - cell [ref=e361]:
                  - checkbox [ref=e363]
                - cell "edit content_copy delete" [ref=e366]:
                  - generic [ref=e368]:
                    - generic [ref=e371] [cursor=pointer]: edit
                    - generic [ref=e374] [cursor=pointer]: content_copy
                    - generic [ref=e377] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w3-1778609550044 12/05/2026 edit content_copy delete" [ref=e378]:
                - cell "Painel Reativar TC4 w3-1778609550044" [ref=e379]:
                  - paragraph [ref=e380]: Painel Reativar TC4 w3-1778609550044
                - cell [ref=e381]:
                  - paragraph [ref=e382]
                - cell "12/05/2026" [ref=e383]
                - cell [ref=e384]:
                  - checkbox [checked] [ref=e386]
                - cell "edit content_copy delete" [ref=e389]:
                  - generic [ref=e391]:
                    - generic [ref=e394] [cursor=pointer]: edit
                    - generic [ref=e397] [cursor=pointer]: content_copy
                    - generic [ref=e400] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w0-1778609344876 12/05/2026 edit content_copy delete" [ref=e401]:
                - cell "Painel Reativar TC4 w0-1778609344876" [ref=e402]:
                  - paragraph [ref=e403]: Painel Reativar TC4 w0-1778609344876
                - cell [ref=e404]:
                  - paragraph [ref=e405]
                - cell "12/05/2026" [ref=e406]
                - cell [ref=e407]:
                  - checkbox [checked] [ref=e409]
                - cell "edit content_copy delete" [ref=e412]:
                  - generic [ref=e414]:
                    - generic [ref=e417] [cursor=pointer]: edit
                    - generic [ref=e420] [cursor=pointer]: content_copy
                    - generic [ref=e423] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w0-1778609207561 12/05/2026 edit content_copy delete" [ref=e424]:
                - cell "Painel Reativar TC4 w0-1778609207561" [ref=e425]:
                  - paragraph [ref=e426]: Painel Reativar TC4 w0-1778609207561
                - cell [ref=e427]:
                  - paragraph [ref=e428]
                - cell "12/05/2026" [ref=e429]
                - cell [ref=e430]:
                  - checkbox [checked] [ref=e432]
                - cell "edit content_copy delete" [ref=e435]:
                  - generic [ref=e437]:
                    - generic [ref=e440] [cursor=pointer]: edit
                    - generic [ref=e443] [cursor=pointer]: content_copy
                    - generic [ref=e446] [cursor=pointer]: delete
              - row "Painel Voltar Step 1778597018411 12/05/2026 edit content_copy delete" [ref=e447]:
                - cell "Painel Voltar Step 1778597018411" [ref=e448]:
                  - paragraph [ref=e449]: Painel Voltar Step 1778597018411
                - cell [ref=e450]:
                  - paragraph [ref=e451]
                - cell "12/05/2026" [ref=e452]
                - cell [ref=e453]:
                  - checkbox [checked] [ref=e455]
                - cell "edit content_copy delete" [ref=e458]:
                  - generic [ref=e460]:
                    - generic [ref=e463] [cursor=pointer]: edit
                    - generic [ref=e466] [cursor=pointer]: content_copy
                    - generic [ref=e469] [cursor=pointer]: delete
              - row "Painel Limite Nome Aba 1778597006306 12/05/2026 edit content_copy delete" [ref=e470]:
                - cell "Painel Limite Nome Aba 1778597006306" [ref=e471]:
                  - paragraph [ref=e472]: Painel Limite Nome Aba 1778597006306
                - cell [ref=e473]:
                  - paragraph [ref=e474]
                - cell "12/05/2026" [ref=e475]
                - cell [ref=e476]:
                  - checkbox [checked] [ref=e478]
                - cell "edit content_copy delete" [ref=e481]:
                  - generic [ref=e483]:
                    - generic [ref=e486] [cursor=pointer]: edit
                    - generic [ref=e489] [cursor=pointer]: content_copy
                    - generic [ref=e492] [cursor=pointer]: delete
              - row "Painel Nova Aba 1778596994915 12/05/2026 edit content_copy delete" [ref=e493]:
                - cell "Painel Nova Aba 1778596994915" [ref=e494]:
                  - paragraph [ref=e495]: Painel Nova Aba 1778596994915
                - cell [ref=e496]:
                  - paragraph [ref=e497]
                - cell "12/05/2026" [ref=e498]
                - cell [ref=e499]:
                  - checkbox [checked] [ref=e501]
                - cell "edit content_copy delete" [ref=e504]:
                  - generic [ref=e506]:
                    - generic [ref=e509] [cursor=pointer]: edit
                    - generic [ref=e512] [cursor=pointer]: content_copy
                    - generic [ref=e515] [cursor=pointer]: delete
              - row "Áéíóú ç ñ - _ . / 123 !@# 1778596983923 12/05/2026 edit content_copy delete" [ref=e516]:
                - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596983923" [ref=e517]:
                  - paragraph [ref=e518]: Áéíóú ç ñ - _ . / 123 !@# 1778596983923
                - cell [ref=e519]:
                  - paragraph [ref=e520]
                - cell "12/05/2026" [ref=e521]
                - cell [ref=e522]:
                  - checkbox [checked] [ref=e524]
                - cell "edit content_copy delete" [ref=e527]:
                  - generic [ref=e529]:
                    - generic [ref=e532] [cursor=pointer]: edit
                    - generic [ref=e535] [cursor=pointer]: content_copy
                    - generic [ref=e538] [cursor=pointer]: delete
              - row "Painel Aba Unica 1778596949014 12/05/2026 edit content_copy delete" [ref=e539]:
                - cell "Painel Aba Unica 1778596949014" [ref=e540]:
                  - paragraph [ref=e541]: Painel Aba Unica 1778596949014
                - cell [ref=e542]:
                  - paragraph [ref=e543]
                - cell "12/05/2026" [ref=e544]
                - cell [ref=e545]:
                  - checkbox [checked] [ref=e547]
                - cell "edit content_copy delete" [ref=e550]:
                  - generic [ref=e552]:
                    - generic [ref=e555] [cursor=pointer]: edit
                    - generic [ref=e558] [cursor=pointer]: content_copy
                    - generic [ref=e561] [cursor=pointer]: delete
              - row "Painel Renomear 1778596936523 12/05/2026 edit content_copy delete" [ref=e562]:
                - cell "Painel Renomear 1778596936523" [ref=e563]:
                  - paragraph [ref=e564]: Painel Renomear 1778596936523
                - cell [ref=e565]:
                  - paragraph [ref=e566]
                - cell "12/05/2026" [ref=e567]
                - cell [ref=e568]:
                  - checkbox [checked] [ref=e570]
                - cell "edit content_copy delete" [ref=e573]:
                  - generic [ref=e575]:
                    - generic [ref=e578] [cursor=pointer]: edit
                    - generic [ref=e581] [cursor=pointer]: content_copy
                    - generic [ref=e584] [cursor=pointer]: delete
              - row "Painel TC17 1778596921353 12/05/2026 edit content_copy delete" [ref=e585]:
                - cell "Painel TC17 1778596921353" [ref=e586]:
                  - paragraph [ref=e587]: Painel TC17 1778596921353
                - cell [ref=e588]:
                  - paragraph [ref=e589]
                - cell "12/05/2026" [ref=e590]
                - cell [ref=e591]:
                  - checkbox [checked] [ref=e593]
                - cell "edit content_copy delete" [ref=e596]:
                  - generic [ref=e598]:
                    - generic [ref=e601] [cursor=pointer]: edit
                    - generic [ref=e604] [cursor=pointer]: content_copy
                    - generic [ref=e607] [cursor=pointer]: delete
              - row "Painel TC16 1778596909478 12/05/2026 edit content_copy delete" [ref=e608]:
                - cell "Painel TC16 1778596909478" [ref=e609]:
                  - paragraph [ref=e610]: Painel TC16 1778596909478
                - cell [ref=e611]:
                  - paragraph [ref=e612]
                - cell "12/05/2026" [ref=e613]
                - cell [ref=e614]:
                  - checkbox [checked] [ref=e616]
                - cell "edit content_copy delete" [ref=e619]:
                  - generic [ref=e621]:
                    - generic [ref=e624] [cursor=pointer]: edit
                    - generic [ref=e627] [cursor=pointer]: content_copy
                    - generic [ref=e630] [cursor=pointer]: delete
              - row "Painel Excluir Aba Multi 1778596890745 12/05/2026 edit content_copy delete" [ref=e631]:
                - cell "Painel Excluir Aba Multi 1778596890745" [ref=e632]:
                  - paragraph [ref=e633]: Painel Excluir Aba Multi 1778596890745
                - cell [ref=e634]:
                  - paragraph [ref=e635]
                - cell "12/05/2026" [ref=e636]
                - cell [ref=e637]:
                  - checkbox [checked] [ref=e639]
                - cell "edit content_copy delete" [ref=e642]:
                  - generic [ref=e644]:
                    - generic [ref=e647] [cursor=pointer]: edit
                    - generic [ref=e650] [cursor=pointer]: content_copy
                    - generic [ref=e653] [cursor=pointer]: delete
              - row "Painel de Vendas Q1 1778596878472 Painel para acompanhamento de KPIs de vendas 12/05/2026 edit content_copy delete" [ref=e654]:
                - cell "Painel de Vendas Q1 1778596878472" [ref=e655]:
                  - paragraph [ref=e656]: Painel de Vendas Q1 1778596878472
                - cell "Painel para acompanhamento de KPIs de vendas" [ref=e657]:
                  - paragraph [ref=e658]: Painel para acompanhamento de KPIs de vendas
                - cell "12/05/2026" [ref=e659]
                - cell [ref=e660]:
                  - checkbox [checked] [ref=e662]
                - cell "edit content_copy delete" [ref=e665]:
                  - generic [ref=e667]:
                    - generic [ref=e670] [cursor=pointer]: edit
                    - generic [ref=e673] [cursor=pointer]: content_copy
                    - generic [ref=e676] [cursor=pointer]: delete
              - row "Painel Cancelar Renomear 1778596866066 12/05/2026 edit content_copy delete" [ref=e677]:
                - cell "Painel Cancelar Renomear 1778596866066" [ref=e678]:
                  - paragraph [ref=e679]: Painel Cancelar Renomear 1778596866066
                - cell [ref=e680]:
                  - paragraph [ref=e681]
                - cell "12/05/2026" [ref=e682]
                - cell [ref=e683]:
                  - checkbox [checked] [ref=e685]
                - cell "edit content_copy delete" [ref=e688]:
                  - generic [ref=e690]:
                    - generic [ref=e693] [cursor=pointer]: edit
                    - generic [ref=e696] [cursor=pointer]: content_copy
                    - generic [ref=e699] [cursor=pointer]: delete
              - row "Painel Cancelar Criar Aba 1778596852767 12/05/2026 edit content_copy delete" [ref=e700]:
                - cell "Painel Cancelar Criar Aba 1778596852767" [ref=e701]:
                  - paragraph [ref=e702]: Painel Cancelar Criar Aba 1778596852767
                - cell [ref=e703]:
                  - paragraph [ref=e704]
                - cell "12/05/2026" [ref=e705]
                - cell [ref=e706]:
                  - checkbox [checked] [ref=e708]
                - cell "edit content_copy delete" [ref=e711]:
                  - generic [ref=e713]:
                    - generic [ref=e716] [cursor=pointer]: edit
                    - generic [ref=e719] [cursor=pointer]: content_copy
                    - generic [ref=e722] [cursor=pointer]: delete
              - row "Painel Adicionar Aba 1778596839553 12/05/2026 edit content_copy delete" [ref=e723]:
                - cell "Painel Adicionar Aba 1778596839553" [ref=e724]:
                  - paragraph [ref=e725]: Painel Adicionar Aba 1778596839553
                - cell [ref=e726]:
                  - paragraph [ref=e727]
                - cell "12/05/2026" [ref=e728]
                - cell [ref=e729]:
                  - checkbox [checked] [ref=e731]
                - cell "edit content_copy delete" [ref=e734]:
                  - generic [ref=e736]:
                    - generic [ref=e739] [cursor=pointer]: edit
                    - generic [ref=e742] [cursor=pointer]: content_copy
                    - generic [ref=e745] [cursor=pointer]: delete
              - row "Painel A11y Teclado 1778596826265 12/05/2026 edit content_copy delete" [ref=e746]:
                - cell "Painel A11y Teclado 1778596826265" [ref=e747]:
                  - paragraph [ref=e748]: Painel A11y Teclado 1778596826265
                - cell [ref=e749]:
                  - paragraph [ref=e750]
                - cell "12/05/2026" [ref=e751]
                - cell [ref=e752]:
                  - checkbox [checked] [ref=e754]
                - cell "edit content_copy delete" [ref=e757]:
                  - generic [ref=e759]:
                    - generic [ref=e762] [cursor=pointer]: edit
                    - generic [ref=e765] [cursor=pointer]: content_copy
                    - generic [ref=e768] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778596775612 (cópia) 12/05/2026 edit content_copy delete" [ref=e769]:
                - cell "Painel Inativar Dup TC1.6 w2-1778596775612 (cópia)" [ref=e770]:
                  - paragraph [ref=e771]: Painel Inativar Dup TC1.6 w2-1778596775612 (cópia)
                - cell [ref=e772]:
                  - paragraph [ref=e773]
                - cell "12/05/2026" [ref=e774]
                - cell [ref=e775]:
                  - checkbox [ref=e777]
                - cell "edit content_copy delete" [ref=e780]:
                  - generic [ref=e782]:
                    - generic [ref=e785] [cursor=pointer]: edit
                    - generic [ref=e788] [cursor=pointer]: content_copy
                    - generic [ref=e791] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778596775612 12/05/2026 edit content_copy delete" [ref=e792]:
                - cell "Painel Inativar Dup TC1.6 w2-1778596775612" [ref=e793]:
                  - paragraph [ref=e794]: Painel Inativar Dup TC1.6 w2-1778596775612
                - cell [ref=e795]:
                  - paragraph [ref=e796]
                - cell "12/05/2026" [ref=e797]
                - cell [ref=e798]:
                  - checkbox [checked] [ref=e800]
                - cell "edit content_copy delete" [ref=e803]:
                  - generic [ref=e805]:
                    - generic [ref=e808] [cursor=pointer]: edit
                    - generic [ref=e811] [cursor=pointer]: content_copy
                    - generic [ref=e814] [cursor=pointer]: delete
              - row "Painel Voltar Step 1778596699037 12/05/2026 edit content_copy delete" [ref=e815]:
                - cell "Painel Voltar Step 1778596699037" [ref=e816]:
                  - paragraph [ref=e817]: Painel Voltar Step 1778596699037
                - cell [ref=e818]:
                  - paragraph [ref=e819]
                - cell "12/05/2026" [ref=e820]
                - cell [ref=e821]:
                  - checkbox [checked] [ref=e823]
                - cell "edit content_copy delete" [ref=e826]:
                  - generic [ref=e828]:
                    - generic [ref=e831] [cursor=pointer]: edit
                    - generic [ref=e834] [cursor=pointer]: content_copy
                    - generic [ref=e837] [cursor=pointer]: delete
              - row "Painel Limite Nome Aba 1778596685185 12/05/2026 edit content_copy delete" [ref=e838]:
                - cell "Painel Limite Nome Aba 1778596685185" [ref=e839]:
                  - paragraph [ref=e840]: Painel Limite Nome Aba 1778596685185
                - cell [ref=e841]:
                  - paragraph [ref=e842]
                - cell "12/05/2026" [ref=e843]
                - cell [ref=e844]:
                  - checkbox [checked] [ref=e846]
                - cell "edit content_copy delete" [ref=e849]:
                  - generic [ref=e851]:
                    - generic [ref=e854] [cursor=pointer]: edit
                    - generic [ref=e857] [cursor=pointer]: content_copy
                    - generic [ref=e860] [cursor=pointer]: delete
              - row "Painel Nova Aba 1778596672616 12/05/2026 edit content_copy delete" [ref=e861]:
                - cell "Painel Nova Aba 1778596672616" [ref=e862]:
                  - paragraph [ref=e863]: Painel Nova Aba 1778596672616
                - cell [ref=e864]:
                  - paragraph [ref=e865]
                - cell "12/05/2026" [ref=e866]
                - cell [ref=e867]:
                  - checkbox [checked] [ref=e869]
                - cell "edit content_copy delete" [ref=e872]:
                  - generic [ref=e874]:
                    - generic [ref=e877] [cursor=pointer]: edit
                    - generic [ref=e880] [cursor=pointer]: content_copy
                    - generic [ref=e883] [cursor=pointer]: delete
              - row "Áéíóú ç ñ - _ . / 123 !@# 1778596661735 12/05/2026 edit content_copy delete" [ref=e884]:
                - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596661735" [ref=e885]:
                  - paragraph [ref=e886]: Áéíóú ç ñ - _ . / 123 !@# 1778596661735
                - cell [ref=e887]:
                  - paragraph [ref=e888]
                - cell "12/05/2026" [ref=e889]
                - cell [ref=e890]:
                  - checkbox [checked] [ref=e892]
                - cell "edit content_copy delete" [ref=e895]:
                  - generic [ref=e897]:
                    - generic [ref=e900] [cursor=pointer]: edit
                    - generic [ref=e903] [cursor=pointer]: content_copy
                    - generic [ref=e906] [cursor=pointer]: delete
              - row "Painel TC17 1778595166915 12/05/2026 edit content_copy delete" [ref=e907]:
                - cell "Painel TC17 1778595166915" [ref=e908]:
                  - paragraph [ref=e909]: Painel TC17 1778595166915
                - cell [ref=e910]:
                  - paragraph [ref=e911]
                - cell "12/05/2026" [ref=e912]
                - cell [ref=e913]:
                  - checkbox [checked] [ref=e915]
                - cell "edit content_copy delete" [ref=e918]:
                  - generic [ref=e920]:
                    - generic [ref=e923] [cursor=pointer]: edit
                    - generic [ref=e926] [cursor=pointer]: content_copy
                    - generic [ref=e929] [cursor=pointer]: delete
          - generic [ref=e931]:
            - generic [ref=e932]:
              - button "keyboard_double_arrow_left" [disabled] [ref=e933]:
                - generic [ref=e934]: keyboard_double_arrow_left
              - button "chevron_left" [disabled] [ref=e935]:
                - generic [ref=e936]: chevron_left
              - button "1" [ref=e937] [cursor=pointer]
              - button "2" [ref=e938] [cursor=pointer]
              - button "3" [ref=e939] [cursor=pointer]
              - button "4" [ref=e940] [cursor=pointer]
              - button "5" [ref=e941] [cursor=pointer]
              - button "chevron_right" [ref=e942] [cursor=pointer]:
                - generic [ref=e943]: chevron_right
            - generic [ref=e944]:
              - combobox [ref=e945]:
                - option "25 por página" [selected]
                - option "50 por página"
                - option "100 por página"
              - generic:
                - img
  - region "Widget de chat" [ref=e946]:
    - iframe [ref=e947]:
      - button "Abrir chat ao vivo" [ref=f47e5]:
        - img [ref=f47e8]
        - img [ref=f47e15]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e948]:
        - generic [ref=e949]:
          - img [ref=e951]
          - generic [ref=e954]: Registro excluído com sucesso!
          - button "Close" [ref=e955] [cursor=pointer]:
            - img [ref=e956]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e958]:
        - generic [ref=e959]:
          - img [ref=e961]
          - generic [ref=e964]: Registro excluído com sucesso!
          - button "Close" [ref=e965] [cursor=pointer]:
            - img [ref=e966]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e968]:
        - generic [ref=e969]:
          - img [ref=e971]
          - generic [ref=e974]: Registro excluído com sucesso!
          - button "Close" [ref=e975] [cursor=pointer]:
            - img [ref=e976]
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