# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\isolamento-de-progresso-score-e-attendance-por-inscricao\tc1-progresso-score-attendance-zerados.spec.ts >> Isolamento de Progresso, Score e Attendance por Inscrição >> TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição
- Location: projects\recertificacao\tests\features\isolamento-de-progresso-score-e-attendance-por-inscricao\tc1-progresso-score-attendance-zerados.spec.ts:59:3

# Error details

```
Error: BUG DE PRODUTO: POST /api/v1/o/37048/contents/806755/event_participants retornou 422 ao reinscrever aluno elegível (aprovado, 100%, cert Emitido, recertification_number=0) com a flag :recertificacao ON e o switch has_recertification ON. Body: {"data":null,"message":"Error Inesperado","status":422}. Reinscrição individual quebrada no env 37048 — corrigir o endpoint.

expect(received).toBeLessThan(expected)

Expected: < 400
Received:   422
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Recertificação" [ref=e4]:
        - img "Logo - Recertificação" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/37048/dashboard
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
                  - /url: /o/37048/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/37048/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/37048/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/37048/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
              - listitem [ref=e51]:
                - link "browse Modelos de conteúdo" [ref=e52] [cursor=pointer]:
                  - /url: /o/37048/content_models
                  - generic [ref=e53]:
                    - generic [ref=e55]: browse
                    - generic [ref=e56]: Modelos de conteúdo
              - listitem [ref=e57]:
                - link "folder_open Base de conhecimento" [ref=e58] [cursor=pointer]:
                  - /url: /o/37048/knowledge_repositories
                  - generic [ref=e59]:
                    - generic [ref=e61]: folder_open
                    - generic [ref=e62]: Base de conhecimento
          - listitem [ref=e63]:
            - link "group Usuários" [ref=e64] [cursor=pointer]:
              - /url: /o/37048/users
              - generic [ref=e65]:
                - generic [ref=e67]: group
                - generic [ref=e68]: Usuários
          - listitem [ref=e69]:
            - link "work Empresas" [ref=e70] [cursor=pointer]:
              - /url: /o/37048/companies
              - generic [ref=e71]:
                - generic [ref=e73]: work
                - generic [ref=e74]: Empresas
          - listitem [ref=e75]:
            - link "live_help Questionários" [ref=e76] [cursor=pointer]:
              - /url: /o/37048/question_lists
              - generic [ref=e77]:
                - generic [ref=e79]: live_help
                - generic [ref=e80]: Questionários
          - listitem [ref=e81]:
            - link "groups Comunidades" [ref=e82] [cursor=pointer]:
              - /url: /o/37048/feed
              - generic [ref=e83]:
                - generic [ref=e85]: groups
                - generic [ref=e86]: Comunidades
          - listitem [ref=e87]:
            - generic [ref=e89]:
              - generic [ref=e92]: psychology
              - generic [ref=e93]:
                - text: Skills
                - generic [ref=e94]: BETA
            - list [ref=e95]:
              - listitem [ref=e96]:
                - link "lan Organograma" [ref=e97] [cursor=pointer]:
                  - /url: /o/37048/organization_chart
                  - generic [ref=e98]:
                    - generic [ref=e100]: lan
                    - generic [ref=e101]: Organograma
              - listitem [ref=e102]:
                - link "badge Funções de negócio" [ref=e103] [cursor=pointer]:
                  - /url: /o/37048/roles
                  - generic [ref=e104]:
                    - generic [ref=e106]: badge
                    - generic [ref=e107]: Funções de negócio
              - listitem [ref=e108]:
                - link "award_star Competências" [ref=e109] [cursor=pointer]:
                  - /url: /o/37048/organization_chart_competencies
                  - generic [ref=e110]:
                    - generic [ref=e112]: award_star
                    - generic [ref=e113]: Competências
          - listitem [ref=e114]:
            - generic [ref=e116]:
              - generic [ref=e119]: person_check
              - generic [ref=e120]:
                - text: Continuidade e sucessão
                - generic [ref=e121]: BETA
            - list [ref=e122]:
              - listitem [ref=e123]:
                - link "pie_chart Dashboard geral" [ref=e124] [cursor=pointer]:
                  - /url: /o/37048/succession_dashboards
                  - generic [ref=e125]:
                    - generic [ref=e127]: pie_chart
                    - generic [ref=e128]: Dashboard geral
              - listitem [ref=e129]:
                - link "person Análise individual" [ref=e130] [cursor=pointer]:
                  - /url: /o/37048/succession_people_analysis
                  - generic [ref=e131]:
                    - generic [ref=e133]: person
                    - generic [ref=e134]: Análise individual
              - listitem [ref=e135]:
                - link "vital_signs Ações de resposta" [ref=e136] [cursor=pointer]:
                  - /url: /o/37048/succession_actions
                  - generic [ref=e137]:
                    - generic [ref=e139]: vital_signs
                    - generic [ref=e140]: Ações de resposta
              - listitem [ref=e141]:
                - link "instant_mix Parâmetros" [ref=e142] [cursor=pointer]:
                  - /url: /o/37048/succession_initiatives
                  - generic [ref=e143]:
                    - generic [ref=e145]: instant_mix
                    - generic [ref=e146]: Parâmetros
          - listitem [ref=e147]:
            - generic [ref=e149]:
              - generic [ref=e152]: account_tree
              - generic [ref=e153]: Processos
            - list [ref=e154]:
              - listitem [ref=e155]:
                - link "send Repositórios" [ref=e156] [cursor=pointer]:
                  - /url: /o/37048/organization_datasets
                  - generic [ref=e157]:
                    - generic [ref=e159]: send
                    - generic [ref=e160]: Repositórios
              - listitem [ref=e161]:
                - link "send Arquitetura de Processos" [ref=e162] [cursor=pointer]:
                  - /url: /o/37048/process_architecture
                  - generic [ref=e163]:
                    - generic [ref=e165]: send
                    - generic [ref=e166]: Arquitetura de Processos
              - listitem [ref=e167]:
                - link "send Agente de Documentação" [ref=e168] [cursor=pointer]:
                  - /url: /o/37048/process_documentations
                  - generic [ref=e169]:
                    - generic [ref=e171]: send
                    - generic [ref=e172]: Agente de Documentação
              - listitem [ref=e173]:
                - link "send Documentos de Referência" [ref=e174] [cursor=pointer]:
                  - /url: /o/37048/reference_documents
                  - generic [ref=e175]:
                    - generic [ref=e177]: send
                    - generic [ref=e178]: Documentos de Referência
              - listitem [ref=e179]:
                - link "send Portal de processos" [ref=e180] [cursor=pointer]:
                  - /url: /o/37048/visualize_documentations
                  - generic [ref=e181]:
                    - generic [ref=e183]: send
                    - generic [ref=e184]: Portal de processos
          - listitem [ref=e185]:
            - generic [ref=e187]:
              - generic [ref=e190]: monitoring
              - generic [ref=e191]:
                - text: Planos e Metas
                - generic [ref=e192]: BETA
            - list [ref=e193]:
              - listitem [ref=e194]:
                - link "track_changes PDI" [ref=e195] [cursor=pointer]:
                  - /url: /o/37048/admin/pdis
                  - generic [ref=e196]:
                    - generic [ref=e198]: track_changes
                    - generic [ref=e199]: PDI
          - listitem [ref=e200]:
            - generic [ref=e202]:
              - generic [ref=e205]: groups
              - generic [ref=e206]:
                - text: Gestão de Time
                - generic [ref=e207]: BETA
            - list [ref=e208]:
              - listitem [ref=e209]:
                - link "trending_up Desenvolvimento" [ref=e210] [cursor=pointer]:
                  - /url: /o/37048/cycles
                  - generic [ref=e211]:
                    - generic [ref=e213]: trending_up
                    - generic [ref=e214]: Desenvolvimento
              - listitem [ref=e215]:
                - link "feedback Feedbacks e anotações" [ref=e216] [cursor=pointer]:
                  - /url: /o/37048/feedback_log
                  - generic [ref=e217]:
                    - generic [ref=e219]: feedback
                    - generic [ref=e220]: Feedbacks e anotações
      - generic [ref=e221]: Recertificação
      - list [ref=e222]:
        - listitem [ref=e223]:
          - generic [ref=e225]:
            - generic [ref=e227]: f
            - generic [ref=e228]: Configurações
          - list [ref=e229]:
            - listitem [ref=e230]:
              - link "e Organização" [ref=e231] [cursor=pointer]:
                - /url: /o/37048/edit
                - generic [ref=e232]:
                  - generic [ref=e234]: e
                  - generic [ref=e235]: Organização
            - listitem [ref=e236]:
              - link " Menu" [ref=e237] [cursor=pointer]:
                - /url: /o/37048/use_modes
                - generic [ref=e238]:
                  - generic [ref=e240]: 
                  - generic [ref=e241]: Menu
            - listitem [ref=e242]:
              - link "electrical_services Integrações" [ref=e243] [cursor=pointer]:
                - /url: /o/37048/integrations
                - generic [ref=e244]:
                  - generic [ref=e246]: electrical_services
                  - generic [ref=e247]: Integrações
            - listitem [ref=e248]:
              - link "flash_auto Piloto automático" [ref=e249] [cursor=pointer]:
                - /url: /o/37048/autopilots
                - generic [ref=e250]:
                  - generic [ref=e252]: flash_auto
                  - generic [ref=e253]: Piloto automático
            - listitem [ref=e254]:
              - link " Regras do Jogo" [ref=e255] [cursor=pointer]:
                - /url: /o/37048/game_rules
                - generic [ref=e256]:
                  - generic [ref=e258]: 
                  - generic [ref=e259]: Regras do Jogo
            - listitem [ref=e260]:
              - link " Comunicação" [ref=e261] [cursor=pointer]:
                - /url: /o/37048/communication
                - generic [ref=e262]:
                  - generic [ref=e264]: 
                  - generic [ref=e265]: Comunicação
            - listitem [ref=e266]:
              - link "sell Cobrança de inscrição" [ref=e267] [cursor=pointer]:
                - /url: /o/37048/payments
                - generic [ref=e268]:
                  - generic [ref=e270]: sell
                  - generic [ref=e271]: Cobrança de inscrição
            - listitem [ref=e272]:
              - link "credit_card Plano e assinatura" [ref=e273] [cursor=pointer]:
                - /url: /o/37048/subscription_plans
                - generic [ref=e274]:
                  - generic [ref=e276]: credit_card
                  - generic [ref=e277]: Plano e assinatura
            - text: s
            - listitem [ref=e278]:
              - link " Segurança NOVO" [ref=e279] [cursor=pointer]:
                - /url: /o/37048/security
                - generic [ref=e280]:
                  - generic [ref=e282]: 
                  - generic [ref=e283]: Segurança NOVO
            - listitem [ref=e284]:
              - link "smart_toy Controle de IA BETA" [ref=e285] [cursor=pointer]:
                - /url: /o/37048/ai_consumption_analysis
                - generic [ref=e286]:
                  - generic [ref=e288]: smart_toy
                  - generic [ref=e289]: Controle de IA BETA
            - listitem [ref=e290]:
              - link "palette Aparência" [ref=e291] [cursor=pointer]:
                - /url: /o/37048/appearance
                - generic [ref=e292]:
                  - generic [ref=e294]: palette
                  - generic [ref=e295]: Aparência
    - generic [ref=e298]:
      - generic [ref=e299]:
        - img [ref=e300]
        - text: Agents Richard
      - img [ref=e302]
  - text: "0"
  - generic [ref=e305]:
    - generic "Logo - Recertificação" [ref=e307]:
      - link "Logo - Recertificação" [ref=e308] [cursor=pointer]:
        - /url: /o/37048/dashboard
        - img "Logo - Recertificação" [ref=e309]
    - generic [ref=e313]:
      - button "Twygo Academy" [ref=e317] [cursor=pointer]:
        - generic [ref=e318]: school
      - link "Open chat" [ref=e322] [cursor=pointer]:
        - /url: /o/37048/chats
        - button "Open chat" [ref=e323]:
          - img [ref=e324]
      - button "Users" [ref=e331] [cursor=pointer]:
        - img [ref=e332]
      - generic [ref=e335]:
        - link "7091726 - Agents Richard" [ref=e336] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e337]: Agents Richard
      - button "Administrador G" [ref=e338] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e339]: G
    - text: M * * M * *
  - generic [ref=e342]:
    - generic [ref=e344]:
      - list [ref=e345]:
        - list [ref=e346]:
          - listitem [ref=e347] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e348]:
              - /url: /o/37048/dashboard
              - generic [ref=e349]:
                - generic [ref=e351]: leaderboard
                - generic [ref=e352]: Dashboard
          - listitem [ref=e353] [cursor=pointer]:
            - generic [ref=e355]:
              - generic [ref=e358]: school
              - generic [ref=e359]: Aprendizagem
              - generic [ref=e361]: G
          - listitem [ref=e362] [cursor=pointer]:
            - link "group Usuários" [ref=e363]:
              - /url: /o/37048/users
              - generic [ref=e364]:
                - generic [ref=e366]: group
                - generic [ref=e367]: Usuários
          - listitem [ref=e368] [cursor=pointer]:
            - link "work Empresas" [ref=e369]:
              - /url: /o/37048/companies
              - generic [ref=e370]:
                - generic [ref=e372]: work
                - generic [ref=e373]: Empresas
          - listitem [ref=e374] [cursor=pointer]:
            - link "live_help Questionários" [ref=e375]:
              - /url: /o/37048/question_lists
              - generic [ref=e376]:
                - generic [ref=e378]: live_help
                - generic [ref=e379]: Questionários
          - listitem [ref=e380] [cursor=pointer]:
            - link "groups Comunidades" [ref=e381]:
              - /url: /o/37048/feed
              - generic [ref=e382]:
                - generic [ref=e384]: groups
                - generic [ref=e385]: Comunidades
          - listitem [ref=e386] [cursor=pointer]:
            - generic [ref=e388]:
              - generic [ref=e391]: psychology
              - generic [ref=e392]:
                - text: Skills
                - generic [ref=e393]: BETA
              - generic [ref=e395]: G
          - listitem [ref=e396] [cursor=pointer]:
            - generic [ref=e398]:
              - generic [ref=e401]: person_check
              - generic [ref=e402]:
                - text: Continuidade e sucessão
                - generic [ref=e403]: BETA
              - generic [ref=e405]: G
          - listitem [ref=e406] [cursor=pointer]:
            - generic [ref=e408]:
              - generic [ref=e411]: account_tree
              - generic [ref=e412]: Processos
              - generic [ref=e414]: G
          - listitem [ref=e415] [cursor=pointer]:
            - generic [ref=e417]:
              - generic [ref=e420]: monitoring
              - generic [ref=e421]:
                - text: Planos e Metas
                - generic [ref=e422]: BETA
              - generic [ref=e424]: G
          - listitem [ref=e425] [cursor=pointer]:
            - generic [ref=e427]:
              - generic [ref=e430]: groups
              - generic [ref=e431]:
                - text: Gestão de Time
                - generic [ref=e432]: BETA
              - generic [ref=e434]: G
      - generic [ref=e436]: Recertificação
      - list [ref=e437]:
        - listitem [ref=e438] [cursor=pointer]:
          - generic [ref=e440]:
            - generic [ref=e442]: f
            - generic [ref=e443]: Configurações
            - generic [ref=e445]: G
          - text: e    s 
    - generic [ref=e447]:
      - generic [ref=e450]: Lista de conteúdos > Aprendizagem
      - generic [ref=e454]:
        - generic [ref=e456]:
          - button "Voltar" [ref=e458] [cursor=pointer]:
            - img [ref=e460]
            - text: Voltar
          - heading "Construindo times de alta performance" [level=2] [ref=e464]
        - generic [ref=e467]:
          - tablist [ref=e468]:
            - tab "Aprendizagem" [selected] [ref=e469] [cursor=pointer]
            - tab "Respostas de questionário" [ref=e470] [cursor=pointer]
          - tabpanel "Aprendizagem" [ref=e472]:
            - generic [ref=e474]:
              - generic [ref=e476] [cursor=pointer]:
                - generic [ref=e477]: data_exploration
                - paragraph [ref=e478]: Ver dashboard completo
              - generic [ref=e479]:
                - button "Chamada" [ref=e481] [cursor=pointer]
                - button "Ações em massa" [ref=e482] [cursor=pointer]
                - button "ios_share Extrair dados" [ref=e483] [cursor=pointer]:
                  - generic [ref=e484]: ios_share
                  - text: Extrair dados
                - generic [ref=e485]:
                  - generic [ref=e486]:
                    - img [ref=e488]
                    - textbox "Pesquise aqui" [ref=e490]
                  - generic [ref=e491]:
                    - generic [ref=e492] [cursor=pointer]: grid_view
                    - generic [ref=e493] [cursor=pointer]: reorder
                  - button "Filtro" [ref=e494] [cursor=pointer]:
                    - generic [ref=e496]: filter_alt
                    - paragraph [ref=e498]: Filtro
              - table [ref=e500]:
                - rowgroup [ref=e501]:
                  - row "Participante Progresso Desempenho Pontuação Aprovação Certificado" [ref=e502]:
                    - columnheader [ref=e503]:
                      - checkbox [ref=e506]
                    - columnheader "Participante" [ref=e508] [cursor=pointer]:
                      - generic [ref=e511]:
                        - text: Participante
                        - img [ref=e512]
                    - columnheader "Progresso" [ref=e514] [cursor=pointer]:
                      - generic [ref=e517]:
                        - text: Progresso
                        - img [ref=e518]
                    - columnheader "Desempenho" [ref=e520] [cursor=pointer]:
                      - generic [ref=e523]:
                        - text: Desempenho
                        - img [ref=e524]
                    - columnheader "Pontuação" [ref=e526] [cursor=pointer]:
                      - generic [ref=e529]:
                        - text: Pontuação
                        - img [ref=e530]
                    - columnheader "Aprovação" [ref=e532] [cursor=pointer]:
                      - generic [ref=e535]:
                        - text: Aprovação
                        - img [ref=e536]
                    - columnheader "Certificado" [ref=e538] [cursor=pointer]:
                      - generic [ref=e541]:
                        - text: Certificado
                        - img [ref=e542]
                    - columnheader [ref=e544]
                - rowgroup [ref=e545]:
                  - row "avatar Recertificação Ever 1 recertificacaoever1@twygo.com 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e546]:
                    - cell [ref=e547]:
                      - checkbox [ref=e549]
                    - cell "avatar Recertificação Ever 1 recertificacaoever1@twygo.com" [ref=e551] [cursor=pointer]:
                      - generic [ref=e552]:
                        - img "avatar" [ref=e555]
                        - paragraph [ref=e559]:
                          - paragraph [ref=e560]: Recertificação Ever 1
                          - text: recertificacaoever1@twygo.com
                    - cell "100 100%" [ref=e561] [cursor=pointer]:
                      - generic [ref=e562]:
                        - progressbar [ref=e564]
                        - paragraph [ref=e565]: 100%
                    - cell "100.0%" [ref=e566] [cursor=pointer]:
                      - generic [ref=e567]: 100.0%
                    - cell "120" [ref=e568] [cursor=pointer]:
                      - generic [ref=e569]: "120"
                    - cell [ref=e570]:
                      - checkbox [checked] [ref=e572]
                    - cell "Emitido visibility download" [ref=e575]:
                      - generic [ref=e576]:
                        - generic [ref=e578] [cursor=pointer]:
                          - img [ref=e579]
                          - paragraph [ref=e581]: Emitido
                        - generic [ref=e582] [cursor=pointer]: visibility
                        - generic [ref=e583] [cursor=pointer]: download
                    - cell "more_vert" [ref=e584]:
                      - button "more_vert" [expanded] [ref=e588] [cursor=pointer]:
                        - generic:
                          - generic: more_vert
                  - row "avatar Julia Oliveira julia@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e589]:
                    - cell [ref=e590]:
                      - checkbox [ref=e592]
                    - cell "avatar Julia Oliveira julia@sophia.tech.com.br" [ref=e594] [cursor=pointer]:
                      - generic [ref=e595]:
                        - img "avatar" [ref=e598]
                        - paragraph [ref=e602]:
                          - paragraph [ref=e603]: Julia Oliveira
                          - text: julia@sophia.tech.com.br
                    - cell "100 100%" [ref=e604] [cursor=pointer]:
                      - generic [ref=e605]:
                        - progressbar [ref=e607]
                        - paragraph [ref=e608]: 100%
                    - cell "100.0%" [ref=e609] [cursor=pointer]:
                      - generic [ref=e610]: 100.0%
                    - cell "120" [ref=e611] [cursor=pointer]:
                      - generic [ref=e612]: "120"
                    - cell [ref=e613]:
                      - checkbox [checked] [ref=e615]
                    - cell "Emitido visibility download" [ref=e618]:
                      - generic [ref=e619]:
                        - generic [ref=e621] [cursor=pointer]:
                          - img [ref=e622]
                          - paragraph [ref=e624]: Emitido
                        - generic [ref=e625] [cursor=pointer]: visibility
                        - generic [ref=e626] [cursor=pointer]: download
                    - cell "more_vert" [ref=e627]:
                      - button "more_vert" [ref=e631] [cursor=pointer]:
                        - generic:
                          - generic: more_vert
                  - row "avatar Vanessa Pereira vanessa@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e632]:
                    - cell [ref=e633]:
                      - checkbox [ref=e635]
                    - cell "avatar Vanessa Pereira vanessa@sophia.tech.com.br" [ref=e637] [cursor=pointer]:
                      - generic [ref=e638]:
                        - img "avatar" [ref=e641]
                        - paragraph [ref=e645]:
                          - paragraph [ref=e646]: Vanessa Pereira
                          - text: vanessa@sophia.tech.com.br
                    - cell "100 100%" [ref=e647] [cursor=pointer]:
                      - generic [ref=e648]:
                        - progressbar [ref=e650]
                        - paragraph [ref=e651]: 100%
                    - cell "100.0%" [ref=e652] [cursor=pointer]:
                      - generic [ref=e653]: 100.0%
                    - cell "120" [ref=e654] [cursor=pointer]:
                      - generic [ref=e655]: "120"
                    - cell [ref=e656]:
                      - checkbox [checked] [ref=e658]
                    - cell "Emitido visibility download" [ref=e661]:
                      - generic [ref=e662]:
                        - generic [ref=e664] [cursor=pointer]:
                          - img [ref=e665]
                          - paragraph [ref=e667]: Emitido
                        - generic [ref=e668] [cursor=pointer]: visibility
                        - generic [ref=e669] [cursor=pointer]: download
                    - cell "more_vert" [ref=e670]:
                      - button "more_vert" [ref=e674] [cursor=pointer]:
                        - generic:
                          - generic: more_vert
                  - row "avatar Gabriel Souza gabriel@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e675]:
                    - cell [ref=e676]:
                      - checkbox [ref=e678]
                    - cell "avatar Gabriel Souza gabriel@sophia.tech.com.br" [ref=e680] [cursor=pointer]:
                      - generic [ref=e681]:
                        - img "avatar" [ref=e684]
                        - paragraph [ref=e688]:
                          - paragraph [ref=e689]: Gabriel Souza
                          - text: gabriel@sophia.tech.com.br
                    - cell "100 100%" [ref=e690] [cursor=pointer]:
                      - generic [ref=e691]:
                        - progressbar [ref=e693]
                        - paragraph [ref=e694]: 100%
                    - cell "100.0%" [ref=e695] [cursor=pointer]:
                      - generic [ref=e696]: 100.0%
                    - cell "120" [ref=e697] [cursor=pointer]:
                      - generic [ref=e698]: "120"
                    - cell [ref=e699]:
                      - checkbox [checked] [ref=e701]
                    - cell "Emitido visibility download" [ref=e704]:
                      - generic [ref=e705]:
                        - generic [ref=e707] [cursor=pointer]:
                          - img [ref=e708]
                          - paragraph [ref=e710]: Emitido
                        - generic [ref=e711] [cursor=pointer]: visibility
                        - generic [ref=e712] [cursor=pointer]: download
                    - cell "more_vert" [ref=e713]:
                      - button "more_vert" [ref=e717] [cursor=pointer]:
                        - generic:
                          - generic: more_vert
                  - row "avatar Carla Silva carla@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e718]:
                    - cell [ref=e719]:
                      - checkbox [ref=e721]
                    - cell "avatar Carla Silva carla@sophia.tech.com.br" [ref=e723] [cursor=pointer]:
                      - generic [ref=e724]:
                        - img "avatar" [ref=e727]
                        - paragraph [ref=e731]:
                          - paragraph [ref=e732]: Carla Silva
                          - text: carla@sophia.tech.com.br
                    - cell "100 100%" [ref=e733] [cursor=pointer]:
                      - generic [ref=e734]:
                        - progressbar [ref=e736]
                        - paragraph [ref=e737]: 100%
                    - cell "100.0%" [ref=e738] [cursor=pointer]:
                      - generic [ref=e739]: 100.0%
                    - cell "120" [ref=e740] [cursor=pointer]:
                      - generic [ref=e741]: "120"
                    - cell [ref=e742]:
                      - checkbox [checked] [ref=e744]
                    - cell "Emitido visibility download" [ref=e747]:
                      - generic [ref=e748]:
                        - generic [ref=e750] [cursor=pointer]:
                          - img [ref=e751]
                          - paragraph [ref=e753]: Emitido
                        - generic [ref=e754] [cursor=pointer]: visibility
                        - generic [ref=e755] [cursor=pointer]: download
                    - cell "more_vert" [ref=e756]:
                      - button "more_vert" [ref=e760] [cursor=pointer]:
                        - generic:
                          - generic: more_vert
                  - row "avatar Danilo Marques danilo@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e761]:
                    - cell [ref=e762]:
                      - checkbox [ref=e764]
                    - cell "avatar Danilo Marques danilo@sophia.tech.com.br" [ref=e766] [cursor=pointer]:
                      - generic [ref=e767]:
                        - img "avatar" [ref=e770]
                        - paragraph [ref=e774]:
                          - paragraph [ref=e775]: Danilo Marques
                          - text: danilo@sophia.tech.com.br
                    - cell "100 100%" [ref=e776] [cursor=pointer]:
                      - generic [ref=e777]:
                        - progressbar [ref=e779]
                        - paragraph [ref=e780]: 100%
                    - cell "100.0%" [ref=e781] [cursor=pointer]:
                      - generic [ref=e782]: 100.0%
                    - cell "120" [ref=e783] [cursor=pointer]:
                      - generic [ref=e784]: "120"
                    - cell [ref=e785]:
                      - checkbox [checked] [ref=e787]
                    - cell "Emitido visibility download" [ref=e790]:
                      - generic [ref=e791]:
                        - generic [ref=e793] [cursor=pointer]:
                          - img [ref=e794]
                          - paragraph [ref=e796]: Emitido
                        - generic [ref=e797] [cursor=pointer]: visibility
                        - generic [ref=e798] [cursor=pointer]: download
                    - cell "more_vert" [ref=e799]:
                      - button "more_vert" [ref=e803] [cursor=pointer]:
                        - generic:
                          - generic: more_vert
              - generic [ref=e805]:
                - generic [ref=e806]:
                  - button "keyboard_double_arrow_left" [disabled] [ref=e807]:
                    - generic [ref=e808]: keyboard_double_arrow_left
                  - button "chevron_left" [disabled] [ref=e809]:
                    - generic [ref=e810]: chevron_left
                  - button "1" [ref=e811] [cursor=pointer]
                  - button "chevron_right" [disabled] [ref=e812]:
                    - generic [ref=e813]: chevron_right
                - generic [ref=e814]:
                  - combobox [ref=e815]:
                    - option "25 por página" [selected]
                    - option "50 por página"
                    - option "100 por página"
                  - generic:
                    - img
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e816]:
        - generic [ref=e817]:
          - img [ref=e819]
          - generic [ref=e822]: Erro ao reinscrever participante
          - button "Close" [ref=e823] [cursor=pointer]:
            - img [ref=e824]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e826]:
        - generic [ref=e827]:
          - img [ref=e829]
          - generic [ref=e832]: Erro ao reinscrever participante
          - button "Close" [ref=e833] [cursor=pointer]:
            - img [ref=e834]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e836]:
        - generic [ref=e837]:
          - img [ref=e839]
          - generic [ref=e842]: Erro ao reinscrever participante
          - button "Close" [ref=e843] [cursor=pointer]:
            - img [ref=e844]
  - generic:
    - menu [ref=e847]:
      - menuitem "Expirar certificado" [ref=e848] [cursor=pointer]:
        - generic [ref=e850]:
          - img [ref=e854]
          - text: Expirar certificado
      - menuitem "Histórico de aprendizagem" [ref=e856] [cursor=pointer]:
        - generic [ref=e858]:
          - img [ref=e862]
          - text: Histórico de aprendizagem
      - menuitem "Histórico de certificado" [ref=e864] [cursor=pointer]:
        - generic [ref=e866]:
          - img [ref=e870]
          - text: Histórico de certificado
      - menuitem "emoji_events Pontuação" [ref=e872] [cursor=pointer]:
        - generic [ref=e874]:
          - generic [ref=e876]: emoji_events
          - text: Pontuação
      - menuitem "mail Enviar e-mail" [ref=e877] [cursor=pointer]:
        - generic [ref=e879]:
          - generic [ref=e881]: mail
          - text: Enviar e-mail
      - menuitem "chat_add_on Comentários" [ref=e882] [cursor=pointer]:
        - generic [ref=e884]:
          - generic [ref=e888]: chat_add_on
          - text: Comentários
      - menuitem "Registros de acesso" [ref=e889] [cursor=pointer]:
        - generic [ref=e891]:
          - img [ref=e895]
          - text: Registros de acesso
      - menuitem "replay Iniciar reinscrição" [active] [ref=e897] [cursor=pointer]:
        - generic [ref=e899]:
          - generic [ref=e901]: replay
          - text: Iniciar reinscrição
    - generic:
      - generic:
        - tooltip "Iniciar reinscrição"
  - generic:
    - img [ref=e904] [cursor=pointer]
    - img [ref=e908] [cursor=pointer]
    - img [ref=e912] [cursor=pointer]
    - generic [ref=e914] [cursor=pointer]: emoji_events
    - generic [ref=e915] [cursor=pointer]: mail
    - generic [ref=e918] [cursor=pointer]: chat_add_on
    - img [ref=e921] [cursor=pointer]
    - generic [ref=e923] [cursor=pointer]: replay
  - generic:
    - img [ref=e926] [cursor=pointer]
    - img [ref=e930] [cursor=pointer]
    - img [ref=e934] [cursor=pointer]
    - generic [ref=e936] [cursor=pointer]: emoji_events
    - generic [ref=e937] [cursor=pointer]: mail
    - generic [ref=e940] [cursor=pointer]: chat_add_on
    - img [ref=e943] [cursor=pointer]
    - generic [ref=e945] [cursor=pointer]: replay
  - generic:
    - img [ref=e948] [cursor=pointer]
    - img [ref=e952] [cursor=pointer]
    - img [ref=e956] [cursor=pointer]
    - generic [ref=e958] [cursor=pointer]: emoji_events
    - generic [ref=e959] [cursor=pointer]: mail
    - generic [ref=e962] [cursor=pointer]: chat_add_on
    - img [ref=e965] [cursor=pointer]
    - generic [ref=e967] [cursor=pointer]: replay
  - generic:
    - img [ref=e970] [cursor=pointer]
    - img [ref=e974] [cursor=pointer]
    - img [ref=e978] [cursor=pointer]
    - generic [ref=e980] [cursor=pointer]: emoji_events
    - generic [ref=e981] [cursor=pointer]: mail
    - generic [ref=e984] [cursor=pointer]: chat_add_on
    - img [ref=e987] [cursor=pointer]
    - generic [ref=e989] [cursor=pointer]: replay
  - generic:
    - img [ref=e992] [cursor=pointer]
    - img [ref=e996] [cursor=pointer]
    - img [ref=e1000] [cursor=pointer]
    - generic [ref=e1002] [cursor=pointer]: emoji_events
    - generic [ref=e1003] [cursor=pointer]: mail
    - generic [ref=e1006] [cursor=pointer]: chat_add_on
    - img [ref=e1009] [cursor=pointer]
    - generic [ref=e1011] [cursor=pointer]: replay
```

# Test source

```ts
  12  |   // BUG DE PRODUTO — validado live 2026-05-27 (env staging-recertificacao 37048):
  13  |   //
  14  |   // A reinscrição individual de um aluno ELEGÍVEL (aprovado, progress=100,
  15  |   // certificado "Emitido", recertification_number=0), com TODAS as pré-condições
  16  |   // satisfeitas — feature flag :recertificacao ON na org + switch "Habilitar
  17  |   // reinscrição" (has_recertification=true) ON no curso — FALHA:
  18  |   //
  19  |   //   POST /api/v1/o/37048/contents/{eventId}/event_participants
  20  |   //   payload: {"recertification":true,"user":{"id":<userId>}}
  21  |   //   → HTTP 422 {"data":null,"message":"Error Inesperado","status":422}
  22  |   //   UI: toast "Erro ao reinscrever participante"; NENHUM participant criado.
  23  |   //
  24  |   // Confirmado como BUG DE PRODUTO (não artefato de automação) via
  25  |   // chrome-devtools-mcp em SESSÃO HUMANA FRESCA (login real, contexto isolado,
  26  |   // SEM storageState reciclado — skill `comparar-chrome-mcp-vs-playwright`):
  27  |   // o mesmo 422 ocorre. Quadrante chrome-mcp ❌ + Playwright ❌ = bug-produto.
  28  |   // Console loga "Failed to load resource: status of 422". x-runtime ~0.55s +
  29  |   // "Error Inesperado" genérico ⇒ exceção server-side no serviço de reinscrição
  30  |   // (dev: grep o x-request-id da resposta nos logs Rails p/ o stack trace).
  31  |   //
  32  |   // Sem a reinscrição funcionar, o isolamento de progresso (RN 27/28) não pode
  33  |   // ocorrer — não há novo participant para isolar. Este TC FALHA VERMELHO no
  34  |   // passo 1 de PROPÓSITO (CLAUDE.md §7.6 F — bug de servidor é falha visível,
  35  |   // NÃO fixme): o dev vê o vermelho, lê esta causa raiz, corrige o endpoint de
  36  |   // reinscrição, e o TC passa sozinho sem mudança no spec.
  37  |   //
  38  |   // ESCOPO: os passos 2-3 do MD (login do ALUNO no Play, banner 0%, avançar
  39  |   // aula até 25%) exigem credencial de aluno não provisionada neste env. A
  40  |   // invariante de isolamento (RN 27/28) é validada admin-side pela coluna
  41  |   // "Progresso" da listagem de Aprendizagem — observável equivalente. Quando o
  42  |   // 422 for corrigido, o passo 1 passa e a validação admin-side (passo 2) roda.
  43  |   // ============================================================================
  44  | 
  45  |   test.beforeAll(async ({ browser }) => {
  46  |     // Pré-condição RN 1: feature flag :recertificacao ON para a org.
  47  |     // Idempotente — no-op se já estiver ON (estado atual do env). Não
  48  |     // revertemos no afterAll: ON é o baseline correto do env dedicado de
  49  |     // recertificação e outras suites de reinscrição dependem dele.
  50  |     await ensureFlipperActor(browser, {
  51  |       envName: 'staging-recertificacao',
  52  |       storageStatePath: STORAGE_PATH,
  53  |       flag: 'recertificacao',
  54  |       actor: `Organization;${getOrgId()}`,
  55  |       enabled: true,
  56  |     });
  57  |   });
  58  | 
  59  |   test('TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição', async ({
  60  |     page,
  61  |   }) => {
  62  |     await allure.epic('Twygo - Recertificação');
  63  |     await allure.feature(
  64  |       'Isolamento de Progresso, Score e Attendance por Inscrição',
  65  |     );
  66  |     await allure.story(
  67  |       'Aluno reinscrito tem progress/score/attendance zerados na nova inscrição',
  68  |     );
  69  |     await allure.severity('critical');
  70  |     await allure.parameter(
  71  |       'curso',
  72  |       `${tc1Data.cursoIsolamentoNomeEsperado} (id ${tc1Data.cursoIsolamentoId})`,
  73  |     );
  74  |     await allure.parameter('aluno_elegivel', tc1Data.alunoElegivelEmail);
  75  | 
  76  |     const learning = new LearningStudentsPage(page);
  77  | 
  78  |     await allure.step(
  79  |       '1. Reinscrever o aluno aprovado (progress=100, cert Emitido, recertification_number=0) → novo participant com recertification_number=1',
  80  |       async () => {
  81  |         await learning.goToList(tc1Data.cursoIsolamentoId);
  82  |         await expect(
  83  |           learning.getRowByEmail(tc1Data.alunoElegivelEmail),
  84  |           `Aluno elegível ${tc1Data.alunoElegivelEmail} deve aparecer na listagem de Aprendizagem do curso ${tc1Data.cursoIsolamentoId}`,
  85  |         ).toBeVisible({ timeout: 15_000 });
  86  | 
  87  |         // "Iniciar reinscrição" dispara POST imediato (sem modal de confirmação).
  88  |         // Capturamos a resposta do endpoint de reinscrição direto — mais
  89  |         // robusto que asserir o toast de erro (que auto-some em ~5s).
  90  |         const [reenrollResponse] = await Promise.all([
  91  |           page.waitForResponse(
  92  |             (r) =>
  93  |               /\/contents\/\d+\/event_participants(?:\?|$)/.test(r.url()) &&
  94  |               r.request().method() === 'POST',
  95  |             { timeout: 20_000 },
  96  |           ),
  97  |           learning.clickReinscrever(tc1Data.alunoElegivelEmail),
  98  |         ]);
  99  | 
  100 |         // RN 27/28: a reinscrição deve criar um novo participant isolado.
  101 |         // BUG ATUAL: o backend responde 422 "Error Inesperado". Esta asserção
  102 |         // FALHA enquanto o bug existir — é o sinal vermelho para o dev (§7.6 F).
  103 |         const reenrollBody = await reenrollResponse.text().catch(() => '');
  104 |         expect(
  105 |           reenrollResponse.status(),
  106 |           `BUG DE PRODUTO: POST ${reenrollResponse.url().replace(/^https?:\/\/[^/]+/, '')} ` +
  107 |             `retornou ${reenrollResponse.status()} ao reinscrever aluno elegível ` +
  108 |             `(aprovado, 100%, cert Emitido, recertification_number=0) com a flag ` +
  109 |             `:recertificacao ON e o switch has_recertification ON. ` +
  110 |             `Body: ${reenrollBody.slice(0, 200)}. ` +
  111 |             `Reinscrição individual quebrada no env 37048 — corrigir o endpoint.`,
> 112 |         ).toBeLessThan(400);
      |           ^ Error: BUG DE PRODUTO: POST /api/v1/o/37048/contents/806755/event_participants retornou 422 ao reinscrever aluno elegível (aprovado, 100%, cert Emitido, recertification_number=0) com a flag :recertificacao ON e o switch has_recertification ON. Body: {"data":null,"message":"Error Inesperado","status":422}. Reinscrição individual quebrada no env 37048 — corrigir o endpoint.
  113 |       },
  114 |     );
  115 | 
  116 |     await allure.step(
  117 |       '2. Validar isolamento (admin-side): novo participant exibe progresso 0% (não 100% do histórico) — RN 27/28',
  118 |       async () => {
  119 |         // Alcançável apenas após o bug 422 ser corrigido (passo 1 verde).
  120 |         // Equivale aos passos 2-3 do MD (visão do aluno no Play): a listagem
  121 |         // default mostra o participant ativo (is_latest_recertification); após
  122 |         // a reinscrição ele começa zerado.
  123 |         const row = learning.getRowByEmail(tc1Data.alunoElegivelEmail);
  124 |         await expect(row).toBeVisible({ timeout: 10_000 });
  125 |         await expect(
  126 |           row,
  127 |           `Novo participant (recertification_number=1) deve exibir progresso ${tc1Data.progressoEsperadoNovoParticipant}%`,
  128 |         ).toContainText(
  129 |           new RegExp(`${tc1Data.progressoEsperadoNovoParticipant}\\s?%`),
  130 |         );
  131 |         await expect(
  132 |           row,
  133 |           'Novo participant não deve exibir 100% (isolado do histórico)',
  134 |         ).not.toContainText(/100\s?%/);
  135 |       },
  136 |     );
  137 |   });
  138 | });
  139 | 
```