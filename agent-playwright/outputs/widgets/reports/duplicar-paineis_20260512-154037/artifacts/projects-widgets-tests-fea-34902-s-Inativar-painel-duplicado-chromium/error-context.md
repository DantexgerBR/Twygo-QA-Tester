# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\duplicar-paineis\inativar-painel-duplicado.spec.ts >> Duplicar painéis >> Inativar painel duplicado
- Location: projects\widgets\tests\features\duplicar-paineis\inativar-painel-duplicado.spec.ts:66:3

# Error details

```
Error: aguardando toggle ou modal após click no switch de "Painel Inativar Dup TC1.6 w2-1778611199479 (cópia)"

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
              - row "Painel Reativar TC4 w3-1778609550044 12/05/2026 edit content_copy delete" [ref=e358]:
                - cell "Painel Reativar TC4 w3-1778609550044" [ref=e359]:
                  - paragraph [ref=e360]: Painel Reativar TC4 w3-1778609550044
                - cell [ref=e361]:
                  - paragraph [ref=e362]
                - cell "12/05/2026" [ref=e363]
                - cell [ref=e364]:
                  - checkbox [checked] [ref=e366]
                - cell "edit content_copy delete" [ref=e369]:
                  - generic [ref=e371]:
                    - generic [ref=e374] [cursor=pointer]: edit
                    - generic [ref=e377] [cursor=pointer]: content_copy
                    - generic [ref=e380] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w0-1778609344876 12/05/2026 edit content_copy delete" [ref=e381]:
                - cell "Painel Reativar TC4 w0-1778609344876" [ref=e382]:
                  - paragraph [ref=e383]: Painel Reativar TC4 w0-1778609344876
                - cell [ref=e384]:
                  - paragraph [ref=e385]
                - cell "12/05/2026" [ref=e386]
                - cell [ref=e387]:
                  - checkbox [checked] [ref=e389]
                - cell "edit content_copy delete" [ref=e392]:
                  - generic [ref=e394]:
                    - generic [ref=e397] [cursor=pointer]: edit
                    - generic [ref=e400] [cursor=pointer]: content_copy
                    - generic [ref=e403] [cursor=pointer]: delete
              - row "Painel Reativar TC4 w0-1778609207561 12/05/2026 edit content_copy delete" [ref=e404]:
                - cell "Painel Reativar TC4 w0-1778609207561" [ref=e405]:
                  - paragraph [ref=e406]: Painel Reativar TC4 w0-1778609207561
                - cell [ref=e407]:
                  - paragraph [ref=e408]
                - cell "12/05/2026" [ref=e409]
                - cell [ref=e410]:
                  - checkbox [checked] [ref=e412]
                - cell "edit content_copy delete" [ref=e415]:
                  - generic [ref=e417]:
                    - generic [ref=e420] [cursor=pointer]: edit
                    - generic [ref=e423] [cursor=pointer]: content_copy
                    - generic [ref=e426] [cursor=pointer]: delete
              - row "Painel Voltar Step 1778597018411 12/05/2026 edit content_copy delete" [ref=e427]:
                - cell "Painel Voltar Step 1778597018411" [ref=e428]:
                  - paragraph [ref=e429]: Painel Voltar Step 1778597018411
                - cell [ref=e430]:
                  - paragraph [ref=e431]
                - cell "12/05/2026" [ref=e432]
                - cell [ref=e433]:
                  - checkbox [checked] [ref=e435]
                - cell "edit content_copy delete" [ref=e438]:
                  - generic [ref=e440]:
                    - generic [ref=e443] [cursor=pointer]: edit
                    - generic [ref=e446] [cursor=pointer]: content_copy
                    - generic [ref=e449] [cursor=pointer]: delete
              - row "Painel Limite Nome Aba 1778597006306 12/05/2026 edit content_copy delete" [ref=e450]:
                - cell "Painel Limite Nome Aba 1778597006306" [ref=e451]:
                  - paragraph [ref=e452]: Painel Limite Nome Aba 1778597006306
                - cell [ref=e453]:
                  - paragraph [ref=e454]
                - cell "12/05/2026" [ref=e455]
                - cell [ref=e456]:
                  - checkbox [checked] [ref=e458]
                - cell "edit content_copy delete" [ref=e461]:
                  - generic [ref=e463]:
                    - generic [ref=e466] [cursor=pointer]: edit
                    - generic [ref=e469] [cursor=pointer]: content_copy
                    - generic [ref=e472] [cursor=pointer]: delete
              - row "Painel Nova Aba 1778596994915 12/05/2026 edit content_copy delete" [ref=e473]:
                - cell "Painel Nova Aba 1778596994915" [ref=e474]:
                  - paragraph [ref=e475]: Painel Nova Aba 1778596994915
                - cell [ref=e476]:
                  - paragraph [ref=e477]
                - cell "12/05/2026" [ref=e478]
                - cell [ref=e479]:
                  - checkbox [checked] [ref=e481]
                - cell "edit content_copy delete" [ref=e484]:
                  - generic [ref=e486]:
                    - generic [ref=e489] [cursor=pointer]: edit
                    - generic [ref=e492] [cursor=pointer]: content_copy
                    - generic [ref=e495] [cursor=pointer]: delete
              - row "Áéíóú ç ñ - _ . / 123 !@# 1778596983923 12/05/2026 edit content_copy delete" [ref=e496]:
                - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596983923" [ref=e497]:
                  - paragraph [ref=e498]: Áéíóú ç ñ - _ . / 123 !@# 1778596983923
                - cell [ref=e499]:
                  - paragraph [ref=e500]
                - cell "12/05/2026" [ref=e501]
                - cell [ref=e502]:
                  - checkbox [checked] [ref=e504]
                - cell "edit content_copy delete" [ref=e507]:
                  - generic [ref=e509]:
                    - generic [ref=e512] [cursor=pointer]: edit
                    - generic [ref=e515] [cursor=pointer]: content_copy
                    - generic [ref=e518] [cursor=pointer]: delete
              - row "Painel Aba Unica 1778596949014 12/05/2026 edit content_copy delete" [ref=e519]:
                - cell "Painel Aba Unica 1778596949014" [ref=e520]:
                  - paragraph [ref=e521]: Painel Aba Unica 1778596949014
                - cell [ref=e522]:
                  - paragraph [ref=e523]
                - cell "12/05/2026" [ref=e524]
                - cell [ref=e525]:
                  - checkbox [checked] [ref=e527]
                - cell "edit content_copy delete" [ref=e530]:
                  - generic [ref=e532]:
                    - generic [ref=e535] [cursor=pointer]: edit
                    - generic [ref=e538] [cursor=pointer]: content_copy
                    - generic [ref=e541] [cursor=pointer]: delete
              - row "Painel Renomear 1778596936523 12/05/2026 edit content_copy delete" [ref=e542]:
                - cell "Painel Renomear 1778596936523" [ref=e543]:
                  - paragraph [ref=e544]: Painel Renomear 1778596936523
                - cell [ref=e545]:
                  - paragraph [ref=e546]
                - cell "12/05/2026" [ref=e547]
                - cell [ref=e548]:
                  - checkbox [checked] [ref=e550]
                - cell "edit content_copy delete" [ref=e553]:
                  - generic [ref=e555]:
                    - generic [ref=e558] [cursor=pointer]: edit
                    - generic [ref=e561] [cursor=pointer]: content_copy
                    - generic [ref=e564] [cursor=pointer]: delete
              - row "Painel TC17 1778596921353 12/05/2026 edit content_copy delete" [ref=e565]:
                - cell "Painel TC17 1778596921353" [ref=e566]:
                  - paragraph [ref=e567]: Painel TC17 1778596921353
                - cell [ref=e568]:
                  - paragraph [ref=e569]
                - cell "12/05/2026" [ref=e570]
                - cell [ref=e571]:
                  - checkbox [checked] [ref=e573]
                - cell "edit content_copy delete" [ref=e576]:
                  - generic [ref=e578]:
                    - generic [ref=e581] [cursor=pointer]: edit
                    - generic [ref=e584] [cursor=pointer]: content_copy
                    - generic [ref=e587] [cursor=pointer]: delete
              - row "Painel TC16 1778596909478 12/05/2026 edit content_copy delete" [ref=e588]:
                - cell "Painel TC16 1778596909478" [ref=e589]:
                  - paragraph [ref=e590]: Painel TC16 1778596909478
                - cell [ref=e591]:
                  - paragraph [ref=e592]
                - cell "12/05/2026" [ref=e593]
                - cell [ref=e594]:
                  - checkbox [checked] [ref=e596]
                - cell "edit content_copy delete" [ref=e599]:
                  - generic [ref=e601]:
                    - generic [ref=e604] [cursor=pointer]: edit
                    - generic [ref=e607] [cursor=pointer]: content_copy
                    - generic [ref=e610] [cursor=pointer]: delete
              - row "Painel Excluir Aba Multi 1778596890745 12/05/2026 edit content_copy delete" [ref=e611]:
                - cell "Painel Excluir Aba Multi 1778596890745" [ref=e612]:
                  - paragraph [ref=e613]: Painel Excluir Aba Multi 1778596890745
                - cell [ref=e614]:
                  - paragraph [ref=e615]
                - cell "12/05/2026" [ref=e616]
                - cell [ref=e617]:
                  - checkbox [checked] [ref=e619]
                - cell "edit content_copy delete" [ref=e622]:
                  - generic [ref=e624]:
                    - generic [ref=e627] [cursor=pointer]: edit
                    - generic [ref=e630] [cursor=pointer]: content_copy
                    - generic [ref=e633] [cursor=pointer]: delete
              - row "Painel de Vendas Q1 1778596878472 Painel para acompanhamento de KPIs de vendas 12/05/2026 edit content_copy delete" [ref=e634]:
                - cell "Painel de Vendas Q1 1778596878472" [ref=e635]:
                  - paragraph [ref=e636]: Painel de Vendas Q1 1778596878472
                - cell "Painel para acompanhamento de KPIs de vendas" [ref=e637]:
                  - paragraph [ref=e638]: Painel para acompanhamento de KPIs de vendas
                - cell "12/05/2026" [ref=e639]
                - cell [ref=e640]:
                  - checkbox [checked] [ref=e642]
                - cell "edit content_copy delete" [ref=e645]:
                  - generic [ref=e647]:
                    - generic [ref=e650] [cursor=pointer]: edit
                    - generic [ref=e653] [cursor=pointer]: content_copy
                    - generic [ref=e656] [cursor=pointer]: delete
              - row "Painel Cancelar Renomear 1778596866066 12/05/2026 edit content_copy delete" [ref=e657]:
                - cell "Painel Cancelar Renomear 1778596866066" [ref=e658]:
                  - paragraph [ref=e659]: Painel Cancelar Renomear 1778596866066
                - cell [ref=e660]:
                  - paragraph [ref=e661]
                - cell "12/05/2026" [ref=e662]
                - cell [ref=e663]:
                  - checkbox [checked] [ref=e665]
                - cell "edit content_copy delete" [ref=e668]:
                  - generic [ref=e670]:
                    - generic [ref=e673] [cursor=pointer]: edit
                    - generic [ref=e676] [cursor=pointer]: content_copy
                    - generic [ref=e679] [cursor=pointer]: delete
              - row "Painel Cancelar Criar Aba 1778596852767 12/05/2026 edit content_copy delete" [ref=e680]:
                - cell "Painel Cancelar Criar Aba 1778596852767" [ref=e681]:
                  - paragraph [ref=e682]: Painel Cancelar Criar Aba 1778596852767
                - cell [ref=e683]:
                  - paragraph [ref=e684]
                - cell "12/05/2026" [ref=e685]
                - cell [ref=e686]:
                  - checkbox [checked] [ref=e688]
                - cell "edit content_copy delete" [ref=e691]:
                  - generic [ref=e693]:
                    - generic [ref=e696] [cursor=pointer]: edit
                    - generic [ref=e699] [cursor=pointer]: content_copy
                    - generic [ref=e702] [cursor=pointer]: delete
              - row "Painel Adicionar Aba 1778596839553 12/05/2026 edit content_copy delete" [ref=e703]:
                - cell "Painel Adicionar Aba 1778596839553" [ref=e704]:
                  - paragraph [ref=e705]: Painel Adicionar Aba 1778596839553
                - cell [ref=e706]:
                  - paragraph [ref=e707]
                - cell "12/05/2026" [ref=e708]
                - cell [ref=e709]:
                  - checkbox [checked] [ref=e711]
                - cell "edit content_copy delete" [ref=e714]:
                  - generic [ref=e716]:
                    - generic [ref=e719] [cursor=pointer]: edit
                    - generic [ref=e722] [cursor=pointer]: content_copy
                    - generic [ref=e725] [cursor=pointer]: delete
              - row "Painel A11y Teclado 1778596826265 12/05/2026 edit content_copy delete" [ref=e726]:
                - cell "Painel A11y Teclado 1778596826265" [ref=e727]:
                  - paragraph [ref=e728]: Painel A11y Teclado 1778596826265
                - cell [ref=e729]:
                  - paragraph [ref=e730]
                - cell "12/05/2026" [ref=e731]
                - cell [ref=e732]:
                  - checkbox [checked] [ref=e734]
                - cell "edit content_copy delete" [ref=e737]:
                  - generic [ref=e739]:
                    - generic [ref=e742] [cursor=pointer]: edit
                    - generic [ref=e745] [cursor=pointer]: content_copy
                    - generic [ref=e748] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778596775612 (cópia) 12/05/2026 edit content_copy delete" [ref=e749]:
                - cell "Painel Inativar Dup TC1.6 w2-1778596775612 (cópia)" [ref=e750]:
                  - paragraph [ref=e751]: Painel Inativar Dup TC1.6 w2-1778596775612 (cópia)
                - cell [ref=e752]:
                  - paragraph [ref=e753]
                - cell "12/05/2026" [ref=e754]
                - cell [ref=e755]:
                  - checkbox [ref=e757]
                - cell "edit content_copy delete" [ref=e760]:
                  - generic [ref=e762]:
                    - generic [ref=e765] [cursor=pointer]: edit
                    - generic [ref=e768] [cursor=pointer]: content_copy
                    - generic [ref=e771] [cursor=pointer]: delete
              - row "Painel Inativar Dup TC1.6 w2-1778596775612 12/05/2026 edit content_copy delete" [ref=e772]:
                - cell "Painel Inativar Dup TC1.6 w2-1778596775612" [ref=e773]:
                  - paragraph [ref=e774]: Painel Inativar Dup TC1.6 w2-1778596775612
                - cell [ref=e775]:
                  - paragraph [ref=e776]
                - cell "12/05/2026" [ref=e777]
                - cell [ref=e778]:
                  - checkbox [checked] [ref=e780]
                - cell "edit content_copy delete" [ref=e783]:
                  - generic [ref=e785]:
                    - generic [ref=e788] [cursor=pointer]: edit
                    - generic [ref=e791] [cursor=pointer]: content_copy
                    - generic [ref=e794] [cursor=pointer]: delete
              - row "Painel Voltar Step 1778596699037 12/05/2026 edit content_copy delete" [ref=e795]:
                - cell "Painel Voltar Step 1778596699037" [ref=e796]:
                  - paragraph [ref=e797]: Painel Voltar Step 1778596699037
                - cell [ref=e798]:
                  - paragraph [ref=e799]
                - cell "12/05/2026" [ref=e800]
                - cell [ref=e801]:
                  - checkbox [checked] [ref=e803]
                - cell "edit content_copy delete" [ref=e806]:
                  - generic [ref=e808]:
                    - generic [ref=e811] [cursor=pointer]: edit
                    - generic [ref=e814] [cursor=pointer]: content_copy
                    - generic [ref=e817] [cursor=pointer]: delete
              - row "Painel Limite Nome Aba 1778596685185 12/05/2026 edit content_copy delete" [ref=e818]:
                - cell "Painel Limite Nome Aba 1778596685185" [ref=e819]:
                  - paragraph [ref=e820]: Painel Limite Nome Aba 1778596685185
                - cell [ref=e821]:
                  - paragraph [ref=e822]
                - cell "12/05/2026" [ref=e823]
                - cell [ref=e824]:
                  - checkbox [checked] [ref=e826]
                - cell "edit content_copy delete" [ref=e829]:
                  - generic [ref=e831]:
                    - generic [ref=e834] [cursor=pointer]: edit
                    - generic [ref=e837] [cursor=pointer]: content_copy
                    - generic [ref=e840] [cursor=pointer]: delete
              - row "Painel Nova Aba 1778596672616 12/05/2026 edit content_copy delete" [ref=e841]:
                - cell "Painel Nova Aba 1778596672616" [ref=e842]:
                  - paragraph [ref=e843]: Painel Nova Aba 1778596672616
                - cell [ref=e844]:
                  - paragraph [ref=e845]
                - cell "12/05/2026" [ref=e846]
                - cell [ref=e847]:
                  - checkbox [checked] [ref=e849]
                - cell "edit content_copy delete" [ref=e852]:
                  - generic [ref=e854]:
                    - generic [ref=e857] [cursor=pointer]: edit
                    - generic [ref=e860] [cursor=pointer]: content_copy
                    - generic [ref=e863] [cursor=pointer]: delete
              - row "Áéíóú ç ñ - _ . / 123 !@# 1778596661735 12/05/2026 edit content_copy delete" [ref=e864]:
                - cell "Áéíóú ç ñ - _ . / 123 !@# 1778596661735" [ref=e865]:
                  - paragraph [ref=e866]: Áéíóú ç ñ - _ . / 123 !@# 1778596661735
                - cell [ref=e867]:
                  - paragraph [ref=e868]
                - cell "12/05/2026" [ref=e869]
                - cell [ref=e870]:
                  - checkbox [checked] [ref=e872]
                - cell "edit content_copy delete" [ref=e875]:
                  - generic [ref=e877]:
                    - generic [ref=e880] [cursor=pointer]: edit
                    - generic [ref=e883] [cursor=pointer]: content_copy
                    - generic [ref=e886] [cursor=pointer]: delete
              - row "Painel TC17 1778595166915 12/05/2026 edit content_copy delete" [ref=e887]:
                - cell "Painel TC17 1778595166915" [ref=e888]:
                  - paragraph [ref=e889]: Painel TC17 1778595166915
                - cell [ref=e890]:
                  - paragraph [ref=e891]
                - cell "12/05/2026" [ref=e892]
                - cell [ref=e893]:
                  - checkbox [checked] [ref=e895]
                - cell "edit content_copy delete" [ref=e898]:
                  - generic [ref=e900]:
                    - generic [ref=e903] [cursor=pointer]: edit
                    - generic [ref=e906] [cursor=pointer]: content_copy
                    - generic [ref=e909] [cursor=pointer]: delete
              - row "Painel TC16 1778595154460 12/05/2026 edit content_copy delete" [ref=e910]:
                - cell "Painel TC16 1778595154460" [ref=e911]:
                  - paragraph [ref=e912]: Painel TC16 1778595154460
                - cell [ref=e913]:
                  - paragraph [ref=e914]
                - cell "12/05/2026" [ref=e915]
                - cell [ref=e916]:
                  - checkbox [checked] [ref=e918]
                - cell "edit content_copy delete" [ref=e921]:
                  - generic [ref=e923]:
                    - generic [ref=e926] [cursor=pointer]: edit
                    - generic [ref=e929] [cursor=pointer]: content_copy
                    - generic [ref=e932] [cursor=pointer]: delete
          - generic [ref=e934]:
            - generic [ref=e935]:
              - button "keyboard_double_arrow_left" [disabled] [ref=e936]:
                - generic [ref=e937]: keyboard_double_arrow_left
              - button "chevron_left" [disabled] [ref=e938]:
                - generic [ref=e939]: chevron_left
              - button "1" [ref=e940] [cursor=pointer]
              - button "2" [ref=e941] [cursor=pointer]
              - button "3" [ref=e942] [cursor=pointer]
              - button "4" [ref=e943] [cursor=pointer]
              - button "5" [ref=e944] [cursor=pointer]
              - button "chevron_right" [ref=e945] [cursor=pointer]:
                - generic [ref=e946]: chevron_right
            - generic [ref=e947]:
              - combobox [ref=e948]:
                - option "25 por página" [selected]
                - option "50 por página"
                - option "100 por página"
              - generic:
                - img
  - region "Widget de chat" [ref=e949]:
    - iframe [ref=e950]:
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
      - status [ref=e951]:
        - generic [ref=e952]:
          - img [ref=e954]
          - generic [ref=e957]: Registro excluído com sucesso!
          - button "Close" [ref=e958] [cursor=pointer]:
            - img [ref=e959]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e961]:
        - generic [ref=e962]:
          - img [ref=e964]
          - generic [ref=e967]: Registro excluído com sucesso!
          - button "Close" [ref=e968] [cursor=pointer]:
            - img [ref=e969]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e971]:
        - generic [ref=e972]:
          - img [ref=e974]
          - generic [ref=e977]: Registro excluído com sucesso!
          - button "Close" [ref=e978] [cursor=pointer]:
            - img [ref=e979]
```

# Test source

```ts
  399 |   getFirstPageButton(): Locator {
  400 |     // REVISAR: aguardando data-test-id "paineis-list-pagination-first";
  401 |     // fallback usa id estável `#first-page-button`.
  402 |     return this.page.locator('#first-page-button');
  403 |   }
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
  470 |    */
  471 |   getRowActiveSwitchLabelByName(name: string): Locator {
  472 |     return this.getRowByName(name).locator('label.chakra-switch');
  473 |   }
  474 | 
  475 |   /**
  476 |    * Lê o estado atual do switch da linha `{name}`. Usa o atributo do DOM
  477 |    * (não evaluate) — o `<input>` chakra mantém o property `checked`
  478 |    * sincronizado com o state interno.
  479 |    */
  480 |   async getActiveStateByName(name: string): Promise<boolean> {
  481 |     return this.getRowActiveSwitchByName(name).isChecked();
  482 |   }
  483 | 
  484 |   /**
  485 |    * Click no label do switch da linha `{name}` e aguarda mudança de estado.
  486 |    * Para painel SEM associação a modos de uso, o estado muda imediatamente.
  487 |    * Para painel ASSOCIADO, abre modal de bloqueio e o estado NÃO muda — use
  488 |    * `getBlockedModal()` para asserir nesse caso.
  489 |    */
  490 |   async toggleActiveByName(name: string): Promise<void> {
  491 |     const before = await this.getActiveStateByName(name);
  492 |     // NPS pode reaparecer por inactivity entre `goToList` (que já dismiss-a)
  493 |     // e o click no switch. Sem isso o click cai no overlay e o polling
  494 |     // termina em "pending" (nem toggled nem modal de bloqueio aparecem).
  495 |     await dismissCommonModals(this.page);
  496 |     await this.getRowActiveSwitchLabelByName(name).click();
  497 |     // Aguarda either: state mudou (caso normal) OU modal de bloqueio apareceu.
  498 |     // Polling baseado em condição (regra dura #1).
> 499 |     await expect
      |     ^ Error: aguardando toggle ou modal após click no switch de "Painel Inativar Dup TC1.6 w2-1778611199479 (cópia)"
  500 |       .poll(
  501 |         async () => {
  502 |           const dialogVisible = await this.getBlockedModal()
  503 |             .isVisible()
  504 |             .catch(() => false);
  505 |           if (dialogVisible) return 'modal';
  506 |           const after = await this.getActiveStateByName(name);
  507 |           return after !== before ? 'toggled' : 'pending';
  508 |         },
  509 |         {
  510 |           timeout: 5_000,
  511 |           message: `aguardando toggle ou modal após click no switch de "${name}"`,
  512 |         },
  513 |       )
  514 |       .not.toBe('pending');
  515 |   }
  516 | 
  517 |   /**
  518 |    * Garante que o painel `{name}` esteja ATIVO (checked). No-op se já estiver.
  519 |    * Usado em pre-conditions de TC1 e em cleanup de TC1/TC2 (`afterEach`)
  520 |    * para isolamento entre runs paralelos. **NÃO** trata o caso de painel
  521 |    * associado (modal de bloqueio) — caller é responsável por garantir que
  522 |    * `{name}` é um painel desassociado.
  523 |    */
  524 |   async ensureActive(name: string): Promise<void> {
  525 |     if (!(await this.getActiveStateByName(name))) {
  526 |       await this.toggleActiveByName(name);
  527 |     }
  528 |   }
  529 | 
  530 |   /**
  531 |    * Garante que o painel `{name}` esteja INATIVO (unchecked). No-op se já
  532 |    * estiver. Usado em pre-condition de TC2.
  533 |    */
  534 |   async ensureInactive(name: string): Promise<void> {
  535 |     if (await this.getActiveStateByName(name)) {
  536 |       await this.toggleActiveByName(name);
  537 |     }
  538 |   }
  539 | 
  540 |   // ---------- Modal de bloqueio (TC3) ----------
  541 |   // Confirmado live 2026-05-06 com auto-seed via UI (associação painel↔menu
  542 |   // funcional após deploy de "Painéis do usuário" no `<select id="page_model">`):
  543 |   // ao clicar no switch "Ativo?" de painel ASSOCIADO a 1+ menus, abre
  544 |   // `<div role="dialog" class="chakra-modal__content">` com:
  545 |   // - Header literal: "Painel em uso" (precedido do ícone material "warning")
  546 |   // - Body literal: "Não é possível desabilitar pois existem menus
  547 |   //   configurados que estão utilizando este painel no modo de uso." +
  548 |   //   lista de cada menu vinculado no formato "Nome do menu: <itemName>
  549 |   //   Modo de uso: <useModeName>".
  550 |   // - Footer: botão "Entendi" com `data-test-id="panel-in-use-modal-confirm"`
  551 |   //   (único data-test-id real descoberto na UI da listagem até hoje).
  552 | 
  553 |   /**
  554 |    * Modal informativo "Painel em uso" que aparece ao tentar inativar painel
  555 |    * vinculado a 1+ menus de modos de uso. Ancoramos pelo botão estável
  556 |    * `[data-test-id="panel-in-use-modal-confirm"]` subindo até o
  557 |    * `.chakra-modal__content` para evitar o falso positivo do popover de
  558 |    * Notificações (que também é `role="dialog"` mas é Chakra Popover, não Modal).
  559 |    * REVISAR: aguardando data-test-id no container do modal em si.
  560 |    */
  561 |   getInactivationBlockedModal(): Locator {
  562 |     return this.page
  563 |       .locator('.chakra-modal__content')
  564 |       .filter({ has: this.page.locator('[data-test-id="panel-in-use-modal-confirm"]') });
  565 |   }
  566 | 
  567 |   getInactivationBlockedModalTitle(): Locator {
  568 |     return this.getInactivationBlockedModal().locator('header.chakra-modal__header');
  569 |   }
  570 | 
  571 |   getInactivationBlockedModalBody(): Locator {
  572 |     return this.getInactivationBlockedModal().locator('.chakra-modal__body');
  573 |   }
  574 | 
  575 |   /**
  576 |    * Botão "Entendi" — único confirm do modal. Texto literal "Entendi" e
  577 |    * `data-test-id` estável.
  578 |    */
  579 |   getInactivationBlockedModalCloseButton(): Locator {
  580 |     return this.page.locator('[data-test-id="panel-in-use-modal-confirm"]');
  581 |   }
  582 | 
  583 |   async closeInactivationBlockedModal(): Promise<void> {
  584 |     await this.getInactivationBlockedModalCloseButton().click();
  585 |     await expect(this.getInactivationBlockedModal()).not.toBeVisible();
  586 |   }
  587 | 
  588 |   // ---------- Aliases legados (TC4 ainda referencia getBlockedModal*) ----------
  589 |   // Mantidos enquanto TC4 estiver `BLOCKED-BY-SEED`. Quando TC4 for
  590 |   // reescrito, migrar pra `getInactivationBlockedModal*` ou criar `getReactivationBlockedModal*`
  591 |   // se o modal de TC4 (reativar menu vinculado a painel inativo) tiver
  592 |   // estrutura diferente — ainda não validado live.
  593 | 
  594 |   getBlockedModal(): Locator {
  595 |     return this.getInactivationBlockedModal();
  596 |   }
  597 | 
  598 |   getBlockedModalTitle(): Locator {
  599 |     return this.getInactivationBlockedModalTitle();
```