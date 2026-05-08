# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects/widgets/tests/features/listagem-de-paineis/alternar-lista-cards.spec.ts >> Listagem de painéis >> Alternar entre visualização em lista e cards
- Location: projects/widgets/tests/features/listagem-de-paineis/alternar-lista-cards.spec.ts:15:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Painéis' }) to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link [ref=e13] [cursor=pointer]:
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
                - link [ref=e27] [cursor=pointer]:
                  - /url: /o/36988/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link [ref=e33] [cursor=pointer]:
                  - /url: /o/36988/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link [ref=e39] [cursor=pointer]:
                  - /url: /o/36988/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link [ref=e46] [cursor=pointer]:
                  - /url: /o/36988/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
          - listitem [ref=e51]:
            - link [ref=e52] [cursor=pointer]:
              - /url: /o/36988/users
              - generic [ref=e53]:
                - generic [ref=e55]: group
                - generic [ref=e56]: Usuários
          - listitem [ref=e57]:
            - link [ref=e58] [cursor=pointer]:
              - /url: /o/36988/companies
              - generic [ref=e59]:
                - generic [ref=e61]: work
                - generic [ref=e62]: Empresas
          - listitem [ref=e63]:
            - link [ref=e64] [cursor=pointer]:
              - /url: /o/36988/question_lists
              - generic [ref=e65]:
                - generic [ref=e67]: live_help
                - generic [ref=e68]: Questionários
          - listitem [ref=e69]:
            - link [ref=e70] [cursor=pointer]:
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
                - link [ref=e85] [cursor=pointer]:
                  - /url: /o/36988/organization_chart
                  - generic [ref=e86]:
                    - generic [ref=e88]: lan
                    - generic [ref=e89]: Organograma
              - listitem [ref=e90]:
                - link [ref=e91] [cursor=pointer]:
                  - /url: /o/36988/roles
                  - generic [ref=e92]:
                    - generic [ref=e94]: badge
                    - generic [ref=e95]: Funções
              - listitem [ref=e96]:
                - link [ref=e97] [cursor=pointer]:
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
                - link [ref=e111] [cursor=pointer]:
                  - /url: /o/36988/organization_datasets
                  - generic [ref=e112]:
                    - generic [ref=e114]: send
                    - generic [ref=e115]: Repositórios
              - listitem [ref=e116]:
                - link [ref=e117] [cursor=pointer]:
                  - /url: /o/36988/process_architecture
                  - generic [ref=e118]:
                    - generic [ref=e120]: send
                    - generic [ref=e121]: Arquitetura de Processos
              - listitem [ref=e122]:
                - link [ref=e123] [cursor=pointer]:
                  - /url: /o/36988/process_documentations
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Agente de Documentação
              - listitem [ref=e128]:
                - link [ref=e129] [cursor=pointer]:
                  - /url: /o/36988/reference_documents
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Documentos de Referência
              - listitem [ref=e134]:
                - link [ref=e135] [cursor=pointer]:
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
              - link [ref=e147] [cursor=pointer]:
                - /url: /o/36988/edit
                - generic [ref=e148]: e
                - text: Organização
            - listitem [ref=e149]:
              - link [ref=e150] [cursor=pointer]:
                - /url: /o/36988/use_modes
                - generic [ref=e151]: 
                - text: Menu
            - listitem [ref=e152]:
              - link [ref=e153] [cursor=pointer]:
                - /url: /o/36988/integrations
                - generic [ref=e154]: electrical_services
                - text: Integrações
            - listitem [ref=e155]:
              - link [ref=e156] [cursor=pointer]:
                - /url: /o/36988/autopilots
                - generic [ref=e157]: flash_auto
                - text: Piloto automático
            - listitem [ref=e158]:
              - link [ref=e159] [cursor=pointer]:
                - /url: /o/36988/game_rules
                - generic [ref=e160]: 
                - text: Regras do Jogo
            - listitem [ref=e161]:
              - link [ref=e162] [cursor=pointer]:
                - /url: /o/36988/communication
                - generic [ref=e163]: 
                - text: Comunicação
            - listitem [ref=e164]:
              - link [ref=e165] [cursor=pointer]:
                - /url: /o/36988/payments
                - generic [ref=e166]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e167]:
              - link [ref=e168] [cursor=pointer]:
                - /url: /o/36988/subscription_plans
                - generic [ref=e169]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e170]:
              - link [ref=e171] [cursor=pointer]:
                - /url: /o/36988/security
                - generic [ref=e172]: 
                - text: Segurança NOVO
            - listitem [ref=e173]:
              - link [ref=e174] [cursor=pointer]:
                - /url: /o/36988/appearance
                - generic [ref=e175]: palette
                - text: Aparência
            - listitem [ref=e176]:
              - link [ref=e177] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e178]: credit_card
                - text: Créditos de IA BETA
    - generic [ref=e181]:
      - generic [ref=e182]:
        - img [ref=e183]
        - text: Claude Agents
      - img [ref=e185]
  - text: "0"
  - generic [ref=e188]:
    - link [ref=e191] [cursor=pointer]:
      - /url: /o/36988/dashboard
      - img [ref=e192]
    - generic [ref=e196]:
      - link [ref=e200] [cursor=pointer]:
        - /url: /o/36988/chats
        - button [ref=e201]:
          - img [ref=e202]
      - button [ref=e209] [cursor=pointer]:
        - img [ref=e210]
      - generic [ref=e213]:
        - link [ref=e214] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e215]: Claude Agents
      - button [ref=e216] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e217]: G
    - text: M * * M * *
  - generic [ref=e218]:
    - generic [ref=e228]:
      - generic [ref=e229]:
        - paragraph [ref=e230]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 20/05.
        - paragraph [ref=e231]: Quer mais detalhes sobre essa novidade? Veja aqui
      - button [ref=e233] [cursor=pointer]: Responder pesquisa
      - button [ref=e234] [cursor=pointer]:
        - img [ref=e235]
    - generic [ref=e238]:
      - generic [ref=e240]:
        - list [ref=e241]:
          - list [ref=e242]:
            - listitem [ref=e243] [cursor=pointer]:
              - link [ref=e244]:
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
              - link [ref=e259]:
                - /url: /o/36988/users
                - generic [ref=e260]:
                  - generic [ref=e262]: group
                  - generic [ref=e263]: Usuários
            - listitem [ref=e264] [cursor=pointer]:
              - link [ref=e265]:
                - /url: /o/36988/companies
                - generic [ref=e266]:
                  - generic [ref=e268]: work
                  - generic [ref=e269]: Empresas
            - listitem [ref=e270] [cursor=pointer]:
              - link [ref=e271]:
                - /url: /o/36988/question_lists
                - generic [ref=e272]:
                  - generic [ref=e274]: live_help
                  - generic [ref=e275]: Questionários
            - listitem [ref=e276] [cursor=pointer]:
              - link [ref=e277]:
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
            - tab [ref=e323] [cursor=pointer]: Modos de uso
            - tab [selected] [ref=e324] [cursor=pointer]: Painéis
          - tabpanel [ref=e326]:
            - generic [ref=e327]:
              - link [ref=e328] [cursor=pointer]:
                - /url: /o/36988/panels/new
                - button [ref=e329]:
                  - img [ref=e331]
                  - text: Adicionar
              - generic [ref=e333]:
                - generic [ref=e334]:
                  - img [ref=e336]
                  - textbox [ref=e338]:
                    - /placeholder: Pesquise por nome ou descrição
                - generic [ref=e339]:
                  - generic [ref=e340] [cursor=pointer]: grid_view
                  - generic [ref=e341] [cursor=pointer]: reorder
                - button [ref=e342] [cursor=pointer]:
                  - generic [ref=e344]: filter_alt
                - button [ref=e345] [cursor=pointer]:
                  - generic [ref=e347]: filter_alt_off
                  - generic [ref=e348]: Limpar filtro
            - table [ref=e350]:
              - rowgroup [ref=e351]:
                - row [ref=e352]:
                  - columnheader [ref=e353] [cursor=pointer]:
                    - generic [ref=e356]:
                      - text: Nome
                      - img [ref=e357]
                  - columnheader [ref=e359]:
                    - generic [ref=e360]: Descrição
                  - columnheader [ref=e361] [cursor=pointer]:
                    - generic [ref=e364]:
                      - text: Data de criação
                      - img [ref=e365]
                  - columnheader [ref=e367] [cursor=pointer]:
                    - generic [ref=e370]:
                      - text: Ativo?
                      - img [ref=e371]
                  - columnheader [ref=e373]
              - rowgroup [ref=e374]:
                - row [ref=e375]:
                  - cell [ref=e376]:
                    - paragraph [ref=e377]: AddAba w0-1778198016325
                  - cell [ref=e378]:
                    - paragraph [ref=e379]: Auto-seed test panel
                  - cell [ref=e380]: 07/05/2026
                  - cell [ref=e381]:
                    - checkbox [checked] [ref=e383]
                  - cell [ref=e386]:
                    - generic [ref=e388]:
                      - generic [ref=e391] [cursor=pointer]: edit
                      - generic [ref=e394] [cursor=pointer]: content_copy
                      - generic [ref=e397] [cursor=pointer]: delete
                - row [ref=e398]:
                  - cell [ref=e399]:
                    - paragraph [ref=e400]: Painel 16
                  - cell [ref=e401]:
                    - paragraph [ref=e402]: Descrição Painel 16
                  - cell [ref=e403]: 06/05/2026
                  - cell [ref=e404]:
                    - checkbox [checked] [ref=e406]
                  - cell [ref=e409]:
                    - generic [ref=e411]:
                      - generic [ref=e414] [cursor=pointer]: edit
                      - generic [ref=e417] [cursor=pointer]: content_copy
                      - generic [ref=e420] [cursor=pointer]: delete
                - row [ref=e421]:
                  - cell [ref=e422]:
                    - paragraph [ref=e423]: Painel 30
                  - cell [ref=e424]:
                    - paragraph [ref=e425]: Descrição Painel 30
                  - cell [ref=e426]: 06/05/2026
                  - cell [ref=e427]:
                    - checkbox [checked] [ref=e429]
                  - cell [ref=e432]:
                    - generic [ref=e434]:
                      - generic [ref=e437] [cursor=pointer]: edit
                      - generic [ref=e440] [cursor=pointer]: content_copy
                      - generic [ref=e443] [cursor=pointer]: delete
                - row [ref=e444]:
                  - cell [ref=e445]:
                    - paragraph [ref=e446]: Painel 29
                  - cell [ref=e447]:
                    - paragraph [ref=e448]: Descrição Painel 29
                  - cell [ref=e449]: 06/05/2026
                  - cell [ref=e450]:
                    - checkbox [checked] [ref=e452]
                  - cell [ref=e455]:
                    - generic [ref=e457]:
                      - generic [ref=e460] [cursor=pointer]: edit
                      - generic [ref=e463] [cursor=pointer]: content_copy
                      - generic [ref=e466] [cursor=pointer]: delete
                - row [ref=e467]:
                  - cell [ref=e468]:
                    - paragraph [ref=e469]: Painel 28
                  - cell [ref=e470]:
                    - paragraph [ref=e471]: Descrição Painel 28
                  - cell [ref=e472]: 06/05/2026
                  - cell [ref=e473]:
                    - checkbox [checked] [ref=e475]
                  - cell [ref=e478]:
                    - generic [ref=e480]:
                      - generic [ref=e483] [cursor=pointer]: edit
                      - generic [ref=e486] [cursor=pointer]: content_copy
                      - generic [ref=e489] [cursor=pointer]: delete
                - row [ref=e490]:
                  - cell [ref=e491]:
                    - paragraph [ref=e492]: Painel 27
                  - cell [ref=e493]:
                    - paragraph [ref=e494]: Descrição Painel 27
                  - cell [ref=e495]: 06/05/2026
                  - cell [ref=e496]:
                    - checkbox [checked] [ref=e498]
                  - cell [ref=e501]:
                    - generic [ref=e503]:
                      - generic [ref=e506] [cursor=pointer]: edit
                      - generic [ref=e509] [cursor=pointer]: content_copy
                      - generic [ref=e512] [cursor=pointer]: delete
                - row [ref=e513]:
                  - cell [ref=e514]:
                    - paragraph [ref=e515]: Painel 26
                  - cell [ref=e516]:
                    - paragraph [ref=e517]: Descrição Painel 26
                  - cell [ref=e518]: 06/05/2026
                  - cell [ref=e519]:
                    - checkbox [checked] [ref=e521]
                  - cell [ref=e524]:
                    - generic [ref=e526]:
                      - generic [ref=e529] [cursor=pointer]: edit
                      - generic [ref=e532] [cursor=pointer]: content_copy
                      - generic [ref=e535] [cursor=pointer]: delete
                - row [ref=e536]:
                  - cell [ref=e537]:
                    - paragraph [ref=e538]: Painel 25
                  - cell [ref=e539]:
                    - paragraph [ref=e540]: Descrição Painel 25
                  - cell [ref=e541]: 06/05/2026
                  - cell [ref=e542]:
                    - checkbox [checked] [ref=e544]
                  - cell [ref=e547]:
                    - generic [ref=e549]:
                      - generic [ref=e552] [cursor=pointer]: edit
                      - generic [ref=e555] [cursor=pointer]: content_copy
                      - generic [ref=e558] [cursor=pointer]: delete
                - row [ref=e559]:
                  - cell [ref=e560]:
                    - paragraph [ref=e561]: Painel 24
                  - cell [ref=e562]:
                    - paragraph [ref=e563]: Descrição Painel 24
                  - cell [ref=e564]: 06/05/2026
                  - cell [ref=e565]:
                    - checkbox [checked] [ref=e567]
                  - cell [ref=e570]:
                    - generic [ref=e572]:
                      - generic [ref=e575] [cursor=pointer]: edit
                      - generic [ref=e578] [cursor=pointer]: content_copy
                      - generic [ref=e581] [cursor=pointer]: delete
                - row [ref=e582]:
                  - cell [ref=e583]:
                    - paragraph [ref=e584]: Painel 23
                  - cell [ref=e585]:
                    - paragraph [ref=e586]: Descrição Painel 23
                  - cell [ref=e587]: 06/05/2026
                  - cell [ref=e588]:
                    - checkbox [checked] [ref=e590]
                  - cell [ref=e593]:
                    - generic [ref=e595]:
                      - generic [ref=e598] [cursor=pointer]: edit
                      - generic [ref=e601] [cursor=pointer]: content_copy
                      - generic [ref=e604] [cursor=pointer]: delete
                - row [ref=e605]:
                  - cell [ref=e606]:
                    - paragraph [ref=e607]: Painel 22
                  - cell [ref=e608]:
                    - paragraph [ref=e609]: Descrição Painel 22
                  - cell [ref=e610]: 06/05/2026
                  - cell [ref=e611]:
                    - checkbox [checked] [ref=e613]
                  - cell [ref=e616]:
                    - generic [ref=e618]:
                      - generic [ref=e621] [cursor=pointer]: edit
                      - generic [ref=e624] [cursor=pointer]: content_copy
                      - generic [ref=e627] [cursor=pointer]: delete
                - row [ref=e628]:
                  - cell [ref=e629]:
                    - paragraph [ref=e630]: Painel 21
                  - cell [ref=e631]:
                    - paragraph [ref=e632]: Descrição Painel 21
                  - cell [ref=e633]: 06/05/2026
                  - cell [ref=e634]:
                    - checkbox [checked] [ref=e636]
                  - cell [ref=e639]:
                    - generic [ref=e641]:
                      - generic [ref=e644] [cursor=pointer]: edit
                      - generic [ref=e647] [cursor=pointer]: content_copy
                      - generic [ref=e650] [cursor=pointer]: delete
                - row [ref=e651]:
                  - cell [ref=e652]:
                    - paragraph [ref=e653]: Painel 20
                  - cell [ref=e654]:
                    - paragraph [ref=e655]: Descrição Painel 20
                  - cell [ref=e656]: 06/05/2026
                  - cell [ref=e657]:
                    - checkbox [checked] [ref=e659]
                  - cell [ref=e662]:
                    - generic [ref=e664]:
                      - generic [ref=e667] [cursor=pointer]: edit
                      - generic [ref=e670] [cursor=pointer]: content_copy
                      - generic [ref=e673] [cursor=pointer]: delete
                - row [ref=e674]:
                  - cell [ref=e675]:
                    - paragraph [ref=e676]: Painel 19
                  - cell [ref=e677]:
                    - paragraph [ref=e678]: Descrição Painel 19
                  - cell [ref=e679]: 06/05/2026
                  - cell [ref=e680]:
                    - checkbox [checked] [ref=e682]
                  - cell [ref=e685]:
                    - generic [ref=e687]:
                      - generic [ref=e690] [cursor=pointer]: edit
                      - generic [ref=e693] [cursor=pointer]: content_copy
                      - generic [ref=e696] [cursor=pointer]: delete
                - row [ref=e697]:
                  - cell [ref=e698]:
                    - paragraph [ref=e699]: Painel 18
                  - cell [ref=e700]:
                    - paragraph [ref=e701]: Descrição Painel 18
                  - cell [ref=e702]: 06/05/2026
                  - cell [ref=e703]:
                    - checkbox [checked] [ref=e705]
                  - cell [ref=e708]:
                    - generic [ref=e710]:
                      - generic [ref=e713] [cursor=pointer]: edit
                      - generic [ref=e716] [cursor=pointer]: content_copy
                      - generic [ref=e719] [cursor=pointer]: delete
                - row [ref=e720]:
                  - cell [ref=e721]:
                    - paragraph [ref=e722]: Painel 17
                  - cell [ref=e723]:
                    - paragraph [ref=e724]: Descrição Painel 17
                  - cell [ref=e725]: 06/05/2026
                  - cell [ref=e726]:
                    - checkbox [checked] [ref=e728]
                  - cell [ref=e731]:
                    - generic [ref=e733]:
                      - generic [ref=e736] [cursor=pointer]: edit
                      - generic [ref=e739] [cursor=pointer]: content_copy
                      - generic [ref=e742] [cursor=pointer]: delete
                - row [ref=e743]:
                  - cell [ref=e744]:
                    - paragraph [ref=e745]: Painel 15
                  - cell [ref=e746]:
                    - paragraph [ref=e747]: Descrição Painel 15
                  - cell [ref=e748]: 06/05/2026
                  - cell [ref=e749]:
                    - checkbox [checked] [ref=e751]
                  - cell [ref=e754]:
                    - generic [ref=e756]:
                      - generic [ref=e759] [cursor=pointer]: edit
                      - generic [ref=e762] [cursor=pointer]: content_copy
                      - generic [ref=e765] [cursor=pointer]: delete
                - row [ref=e766]:
                  - cell [ref=e767]:
                    - paragraph [ref=e768]: Painel 14
                  - cell [ref=e769]:
                    - paragraph [ref=e770]: Descrição Painel 14
                  - cell [ref=e771]: 06/05/2026
                  - cell [ref=e772]:
                    - checkbox [checked] [ref=e774]
                  - cell [ref=e777]:
                    - generic [ref=e779]:
                      - generic [ref=e782] [cursor=pointer]: edit
                      - generic [ref=e785] [cursor=pointer]: content_copy
                      - generic [ref=e788] [cursor=pointer]: delete
                - row [ref=e789]:
                  - cell [ref=e790]:
                    - paragraph [ref=e791]: Painel 13
                  - cell [ref=e792]:
                    - paragraph [ref=e793]: Descrição Painel 13
                  - cell [ref=e794]: 06/05/2026
                  - cell [ref=e795]:
                    - checkbox [checked] [ref=e797]
                  - cell [ref=e800]:
                    - generic [ref=e802]:
                      - generic [ref=e805] [cursor=pointer]: edit
                      - generic [ref=e808] [cursor=pointer]: content_copy
                      - generic [ref=e811] [cursor=pointer]: delete
                - row [ref=e812]:
                  - cell [ref=e813]:
                    - paragraph [ref=e814]: Painel 12
                  - cell [ref=e815]:
                    - paragraph [ref=e816]: Descrição Painel 12
                  - cell [ref=e817]: 06/05/2026
                  - cell [ref=e818]:
                    - checkbox [checked] [ref=e820]
                  - cell [ref=e823]:
                    - generic [ref=e825]:
                      - generic [ref=e828] [cursor=pointer]: edit
                      - generic [ref=e831] [cursor=pointer]: content_copy
                      - generic [ref=e834] [cursor=pointer]: delete
                - row [ref=e835]:
                  - cell [ref=e836]:
                    - paragraph [ref=e837]: Painel 11
                  - cell [ref=e838]:
                    - paragraph [ref=e839]: Descrição Painel 11
                  - cell [ref=e840]: 06/05/2026
                  - cell [ref=e841]:
                    - checkbox [checked] [ref=e843]
                  - cell [ref=e846]:
                    - generic [ref=e848]:
                      - generic [ref=e851] [cursor=pointer]: edit
                      - generic [ref=e854] [cursor=pointer]: content_copy
                      - generic [ref=e857] [cursor=pointer]: delete
                - row [ref=e858]:
                  - cell [ref=e859]:
                    - paragraph [ref=e860]: Painel 10
                  - cell [ref=e861]:
                    - paragraph [ref=e862]: Descrição Painel 10
                  - cell [ref=e863]: 06/05/2026
                  - cell [ref=e864]:
                    - checkbox [checked] [ref=e866]
                  - cell [ref=e869]:
                    - generic [ref=e871]:
                      - generic [ref=e874] [cursor=pointer]: edit
                      - generic [ref=e877] [cursor=pointer]: content_copy
                      - generic [ref=e880] [cursor=pointer]: delete
                - row [ref=e881]:
                  - cell [ref=e882]:
                    - paragraph [ref=e883]: Painel 9
                  - cell [ref=e884]:
                    - paragraph [ref=e885]: Descrição Painel 9
                  - cell [ref=e886]: 06/05/2026
                  - cell [ref=e887]:
                    - checkbox [checked] [ref=e889]
                  - cell [ref=e892]:
                    - generic [ref=e894]:
                      - generic [ref=e897] [cursor=pointer]: edit
                      - generic [ref=e900] [cursor=pointer]: content_copy
                      - generic [ref=e903] [cursor=pointer]: delete
                - row [ref=e904]:
                  - cell [ref=e905]:
                    - paragraph [ref=e906]: Painel 8
                  - cell [ref=e907]:
                    - paragraph [ref=e908]: Descrição Painel 8
                  - cell [ref=e909]: 06/05/2026
                  - cell [ref=e910]:
                    - checkbox [checked] [ref=e912]
                  - cell [ref=e915]:
                    - generic [ref=e917]:
                      - generic [ref=e920] [cursor=pointer]: edit
                      - generic [ref=e923] [cursor=pointer]: content_copy
                      - generic [ref=e926] [cursor=pointer]: delete
                - row [ref=e927]:
                  - cell [ref=e928]:
                    - paragraph [ref=e929]: Painel 7
                  - cell [ref=e930]:
                    - paragraph [ref=e931]: Descrição Painel 7
                  - cell [ref=e932]: 06/05/2026
                  - cell [ref=e933]:
                    - checkbox [checked] [ref=e935]
                  - cell [ref=e938]:
                    - generic [ref=e940]:
                      - generic [ref=e943] [cursor=pointer]: edit
                      - generic [ref=e946] [cursor=pointer]: content_copy
                      - generic [ref=e949] [cursor=pointer]: delete
            - generic [ref=e951]:
              - generic [ref=e952]:
                - button [disabled] [ref=e953]:
                  - generic [ref=e954]: keyboard_double_arrow_left
                - button [disabled] [ref=e955]:
                  - generic [ref=e956]: chevron_left
                - button [ref=e957] [cursor=pointer]: "1"
                - button [ref=e958] [cursor=pointer]: "2"
                - button [ref=e959] [cursor=pointer]:
                  - generic [ref=e960]: chevron_right
              - generic [ref=e961]:
                - combobox [ref=e962]
                - generic:
                  - img
  - region [ref=e963]:
    - iframe [ref=e964]:
      - button "Abrir chat ao vivo" [ref=f3e5]:
        - img [ref=f3e8]
        - img [ref=f3e15]
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
  20  |  *   ativo se distingue pela cor do ícone (mais escura quando ativo).
  21  |  * - **Default no viewport 1920x1080 é Lista** (tabela com `<table>` Chakra).
  22  |  *   Em viewports menores o default pode ser cards — por isso specs que
  23  |  *   dependem de modo determinístico fazem `test.use({ viewport: 1920x1080 })`
  24  |  *   e chamam `setViewMode('lista'|'cards')` explicitamente.
  25  |  * - **Colunas em modo Lista** (re-confirmado 2026-05-06): Nome, Descrição,
  26  |  *   Data de criação, Ativo? (com `?`), e um `<th>` vazio para Ações.
  27  |  *   **Provedora NÃO existe** (XML descrevia coluna inexistente).
  28  |  * - **Colunas ordenáveis**: apenas 3 — Nome, Data de criação, Ativo. Cada
  29  |  *   uma tem um SVG indicador com id estável (`panels-order-by-name`,
  30  |  *   `panels-order-by-created_at`, `panels-order-by-is_active`). A classe do
  31  |  *   SVG é hashada (Chakra `css-*`); para asserções de sort use comparação
  32  |  *   de texto das linhas em vez do indicador visual.
  33  |  * - **Coluna Ativo é checkbox**: `<input type="checkbox">` sem `role="switch"`.
  34  |  * - **Paginação** existe e é interativa quando há >25 painéis (re-confirmado
  35  |  *   2026-05-06 com seed de 30 painéis: chevron_right enabled, página 2
  36  |  *   acessível). IDs estáveis: `first-page-button`, `previous-page-button`,
  37  |  *   `page-button-N`, `next-page-button`.
  38  |  * - **Ações por linha/card**: cada item expõe três ícones com IDs do tipo
  39  |  *   `panels-{id}-edit-element-1-button-0` (editar), `panels-{id}-custom-element-1-button-1`
  40  |  *   (duplicar/content_copy), `panels-{id}-destroy-element-1-button-2` (excluir).
  41  |  *
  42  |  * Status data-test-id: NENHUM elemento da listagem tem `data-test-id` ainda
  43  |  * (PR pendente para o time de dev — ver plano em `specs/`). Fallbacks usam
  44  |  * id estável (`#page-breadcrumb`, `#open-filter`, `#panels-add-button`,
  45  |  * `#first-page-button`, etc.), `getByRole`, `getByPlaceholder`. Cada uso
  46  |  * fica marcado com `// REVISAR: aguardando data-test-id`.
  47  |  */
  48  | 
  49  | // Escape user-provided text antes de injetar em RegExp literal.
  50  | const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  51  | 
  52  | export class PaineisListPage {
  53  |   constructor(private readonly page: Page) {}
  54  | 
  55  |   // ---------- Navegação ----------
  56  | 
  57  |   /**
  58  |    * Acessa a listagem via UI: sidebar "Menu" → tab "Modos de uso" (default)
  59  |    * → tab "Painéis". Usado pelo TC1 que valida o caminho de navegação real.
  60  |    */
  61  |   async openByMenu(): Promise<void> {
  62  |     await this.openAdminContext();
  63  |     await this.clickMenuLink();
  64  |     await this.getModosDeUsoTab().waitFor();
  65  |     await this.getPaineisTab().click();
  66  |     await this.page.waitForURL(/tab=panels-tab/);
  67  |   }
  68  | 
  69  |   /**
  70  |    * Garante que a página está em contexto admin (sidebar com link "Menu"
  71  |    * presente). Necessário porque storageState sozinho não navega — testes
  72  |    * iniciam em about:blank.
  73  |    */
  74  |   async openAdminContext(): Promise<void> {
  75  |     if (!this.page.url().includes(`/o/${getOrgId()}/`)) {
  76  |       await this.page.goto(`/o/${getOrgId()}/dashboard`);
  77  |     }
  78  |   }
  79  | 
  80  |   /**
  81  |    * Clica no link "Menu" da sidebar e aguarda a navegação para `/use_modes`.
  82  |    * REVISAR: aguardando data-test-id no link "Menu" da sidebar.
  83  |    * Fluxo real (sidebar desktop, viewport 1280): o link "Menu" vive dentro
  84  |    * do submenu "Configurações" que é `display: none` até o primeiro click no
  85  |    * próprio item "Configurações". Sem expandir antes, `.click()` no link
  86  |    * Menu trava no actionability (elemento existe mas tem bbox 0x0).
  87  |    * Escopamos tudo a `#menu` (container desktop) — o DOM mobile duplica
  88  |    * `id="navigation-menu"` em `.mobile-nav` mas fica off-screen no viewport
  89  |    * de teste e roubaria o `.first()`.
  90  |    */
  91  |   async clickMenuLink(): Promise<void> {
  92  |     await this.page.locator('#menu a[name="settings-main-menu"]').click();
  93  |     await this.page.locator('#menu a#navigation-menu').click();
  94  |     await this.page.waitForURL(/\/use_modes/);
  95  |     await dismissCommonModals(this.page);
  96  |     // O React/Chakra pinta `aria-selected=true` na tab ativa em 2 tempos
  97  |     // (URL muda antes da re-renderização). Aguardar o atributo evita race
  98  |     // com asserções `.toHaveAttribute('aria-selected', 'true')` no spec.
  99  |     await this.page
  100 |       .getByRole('tab', { name: 'Modos de uso', selected: true })
  101 |       .waitFor({ timeout: 15_000 });
  102 |   }
  103 | 
  104 |   /**
  105 |    * Atalho: navega direto para a rota com `?tab=panels-tab`. Usado por
  106 |    * todos os TCs que não testam o caminho de navegação em si.
  107 |    *
  108 |    * Aguarda só a visibilidade da tab — não o `aria-selected=true`. Specs
  109 |    * que exigem o estado selected fazem assertion explícita; aqui o waitFor
  110 |    * sem `selected: true` evita timeout de 30s+ enquanto o React pinta o
  111 |    * atributo (data carrega em paralelo, ~2 tempos de render).
  112 |    */
  113 |   async goToList(): Promise<void> {
  114 |     await this.page.goto(`/o/${getOrgId()}/use_modes?tab=panels-tab`);
  115 |     // NPS Sofia + outros modais oportunistas — fechar antes de qualquer
  116 |     // ação na listagem. Sem isso, click no toggle/edit cai no overlay
  117 |     // do dialog (regra dura: NUNCA `force:true` pra resolver isso, sempre
  118 |     // dismiss explícito). Ver skill `fechar-modais-twygo`.
  119 |     await dismissCommonModals(this.page);
> 120 |     await this.page.getByRole('tab', { name: 'Painéis' }).waitFor();
      |                                                           ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  121 |   }
  122 | 
  123 |   // ---------- Container / cabeçalho ----------
  124 | 
  125 |   getBreadcrumb(): Locator {
  126 |     // REVISAR: aguardando data-test-id "page-title-breadcrumb"; fallback usa
  127 |     // id estável "page-breadcrumb" (re-confirmado 2026-05-06).
  128 |     return this.page.locator('#page-breadcrumb');
  129 |   }
  130 | 
  131 |   getModosDeUsoTab(): Locator {
  132 |     // REVISAR: aguardando data-test-id "use-modes-tab-modos-de-uso"
  133 |     return this.page.getByRole('tab', { name: 'Modos de uso' });
  134 |   }
  135 | 
  136 |   getPaineisTab(): Locator {
  137 |     // REVISAR: aguardando data-test-id "use-modes-tab-paineis"
  138 |     return this.page.getByRole('tab', { name: 'Painéis' });
  139 |   }
  140 | 
  141 |   // ---------- Componentes obrigatórios da listagem (TC2) ----------
  142 | 
  143 |   getAddButton(): Locator {
  144 |     // REVISAR: aguardando data-test-id "paineis-list-add-button"; o markup
  145 |     // real é `<a href=".../panels/new"><button id="panels-add-button">Adicionar</button></a>`.
  146 |     // O `<a>` é a âncora estável para asserções de visibilidade/click; a
  147 |     // navegação é feita pelo `<a>` quando o `<button>` interno é acionado.
  148 |     return this.page.locator('a[href*="/panels/new"]');
  149 |   }
  150 | 
  151 |   /**
  152 |    * Mesmo botão "+ Adicionar", mas retorna o `<button id="panels-add-button">`
  153 |    * INTERNO (filho do `<a>`). É este o elemento que recebe foco por Tab/Shift+Tab
  154 |    * — o `<a>` wrapper não é focável diretamente. Usado pelo TC8 (acessibilidade
  155 |    * por teclado) para asserção `toBeFocused()`. REVISAR: aguardando
  156 |    * data-test-id "paineis-list-add-button-focusable".
  157 |    */
  158 |   getAddButtonFocusable(): Locator {
  159 |     return this.page.locator('#panels-add-button');
  160 |   }
  161 | 
  162 |   getFilterButton(): Locator {
  163 |     // REVISAR: aguardando data-test-id "paineis-list-filter-button";
  164 |     // fallback usa id estável "open-filter" — botão NOVO observado live,
  165 |     // não estava no XML.
  166 |     return this.page.locator('#open-filter');
  167 |   }
  168 | 
  169 |   getSearchInput(): Locator {
  170 |     // REVISAR: aguardando data-test-id "paineis-list-search-input";
  171 |     // placeholder real (re-confirmado 2026-05-06): "Pesquise por nome ou
  172 |     // descrição" — NÃO é "Pesquise aqui" como o XML insinuava.
  173 |     return this.page.getByPlaceholder('Pesquise por nome ou descrição');
  174 |   }
  175 | 
  176 |   // ---------- Empty state (org sem painéis) ----------
  177 | 
  178 |   getEmptyStateText(): Locator {
  179 |     // REVISAR: aguardando data-test-id "paineis-list-empty-state".
  180 |     // Usado apenas em envs com 0 painéis cadastrados — staging atual tem 30
  181 |     // painéis seedados, então este locator não resolve no estado normal.
  182 |     return this.page.getByText('Não há dados para exibir');
  183 |   }
  184 | 
  185 |   // ---------- Listagem em cards (default observado live) ----------
  186 | 
  187 |   /**
  188 |    * Locator que casa todos os botões "edit" dos cards — um por card. Ancora
  189 |    * estável usando o id `panels-{paineId}-edit-element-1-button-0` (id real
  190 |    * gerado pelo backend; o segmento `-edit-element-1-button-0` é constante).
  191 |    * REVISAR: aguardando data-test-id "paineis-list-card-{idx}".
  192 |    */
  193 |   private getCardEditButtons(): Locator {
  194 |     return this.page.locator('[id^="panels-"][id$="-edit-element-1-button-0"]');
  195 |   }
  196 | 
  197 |   /**
  198 |    * Container do grid de cards. Re-confirmado 2026-05-06: cada card tem um
  199 |    * `<p>Painel N</p>` como nome e três ícones (edit/content_copy/delete).
  200 |    * Implementação evita classes Chakra hashadas (css-*) que mudam entre
  201 |    * builds. Em vez disso, ancora no tabpanel filtrado por presença de cards.
  202 |    * REVISAR: aguardando data-test-id "paineis-list-cards-container".
  203 |    */
  204 |   getCardsContainer(): Locator {
  205 |     return this.page
  206 |       .locator('[role="tabpanel"]')
  207 |       .filter({ has: this.getCardEditButtons().first() });
  208 |   }
  209 | 
  210 |   async getCardCount(): Promise<number> {
  211 |     return this.getCardEditButtons().count();
  212 |   }
  213 | 
  214 |   // ---------- View mode toggle (TC4) ----------
  215 | 
  216 |   /**
  217 |    * Retorna o `<span>` Material Symbols clicável do toggle:
  218 |    * - `'cards'` → `#grid-view-icon` (`data-icon="grid_view"`)
  219 |    * - `'lista'` → `#list-icon` (`data-icon="reorder"`)
  220 |    *
```