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
        - text: Agents QA
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
        - link "7091159 - Agents QA" [ref=e336] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e337]: Agents QA
      - button "Administrador G" [ref=e338] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e339]: G
    - text: M * * M * *
  - generic [ref=e340]:
    - generic [ref=e350]:
      - generic [ref=e351]:
        - paragraph [ref=e352]: Você está no modo BETA da funcionalidade Painéis do usuário, que estará disponível até dia 29/05.
        - paragraph [ref=e353]: Quer relembrar os detalhes dessa novidade? Veja aqui — Beta aceito por agents.qa@claude.com
      - generic [ref=e354]:
        - button "Interromper BETA teste" [ref=e355] [cursor=pointer]
        - button "Responder pesquisa" [ref=e356] [cursor=pointer]
      - button "Close" [ref=e357] [cursor=pointer]:
        - img [ref=e358]
    - generic [ref=e361]:
      - generic [ref=e363]:
        - list [ref=e364]:
          - list [ref=e365]:
            - listitem [ref=e366] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e367]:
                - /url: /o/37048/dashboard
                - generic [ref=e368]:
                  - generic [ref=e370]: leaderboard
                  - generic [ref=e371]: Dashboard
            - listitem [ref=e372] [cursor=pointer]:
              - generic [ref=e374]:
                - generic [ref=e377]: school
                - generic [ref=e378]: Aprendizagem
                - generic [ref=e380]: G
            - listitem [ref=e381] [cursor=pointer]:
              - link "group Usuários" [ref=e382]:
                - /url: /o/37048/users
                - generic [ref=e383]:
                  - generic [ref=e385]: group
                  - generic [ref=e386]: Usuários
            - listitem [ref=e387] [cursor=pointer]:
              - link "work Empresas" [ref=e388]:
                - /url: /o/37048/companies
                - generic [ref=e389]:
                  - generic [ref=e391]: work
                  - generic [ref=e392]: Empresas
            - listitem [ref=e393] [cursor=pointer]:
              - link "live_help Questionários" [ref=e394]:
                - /url: /o/37048/question_lists
                - generic [ref=e395]:
                  - generic [ref=e397]: live_help
                  - generic [ref=e398]: Questionários
            - listitem [ref=e399] [cursor=pointer]:
              - link "groups Comunidades" [ref=e400]:
                - /url: /o/37048/feed
                - generic [ref=e401]:
                  - generic [ref=e403]: groups
                  - generic [ref=e404]: Comunidades
            - listitem [ref=e405] [cursor=pointer]:
              - generic [ref=e407]:
                - generic [ref=e410]: psychology
                - generic [ref=e411]:
                  - text: Skills
                  - generic [ref=e412]: BETA
                - generic [ref=e414]: G
            - listitem [ref=e415] [cursor=pointer]:
              - generic [ref=e417]:
                - generic [ref=e420]: person_check
                - generic [ref=e421]:
                  - text: Continuidade e sucessão
                  - generic [ref=e422]: BETA
                - generic [ref=e424]: G
            - listitem [ref=e425] [cursor=pointer]:
              - generic [ref=e427]:
                - generic [ref=e430]: account_tree
                - generic [ref=e431]: Processos
                - generic [ref=e433]: G
            - listitem [ref=e434] [cursor=pointer]:
              - generic [ref=e436]:
                - generic [ref=e439]: monitoring
                - generic [ref=e440]:
                  - text: Planos e Metas
                  - generic [ref=e441]: BETA
                - generic [ref=e443]: G
            - listitem [ref=e444] [cursor=pointer]:
              - generic [ref=e446]:
                - generic [ref=e449]: groups
                - generic [ref=e450]:
                  - text: Gestão de Time
                  - generic [ref=e451]: BETA
                - generic [ref=e453]: G
        - generic [ref=e455]: Recertificação
        - list [ref=e456]:
          - listitem [ref=e457] [cursor=pointer]:
            - generic [ref=e459]:
              - generic [ref=e461]: f
              - generic [ref=e462]: Configurações
              - generic [ref=e464]: G
            - text: e    s 
      - generic [ref=e466]:
        - generic [ref=e469]: Lista de conteúdos > Aprendizagem
        - generic [ref=e473]:
          - generic [ref=e475]:
            - button "Voltar" [ref=e477] [cursor=pointer]:
              - img [ref=e479]
              - text: Voltar
            - heading "Construindo times de alta performance" [level=2] [ref=e483]
          - generic [ref=e486]:
            - tablist [ref=e487]:
              - tab "Aprendizagem" [selected] [ref=e488] [cursor=pointer]
              - tab "Respostas de questionário" [ref=e489] [cursor=pointer]
            - tabpanel "Aprendizagem" [ref=e491]:
              - generic [ref=e493]:
                - generic [ref=e495] [cursor=pointer]:
                  - generic [ref=e496]: data_exploration
                  - paragraph [ref=e497]: Ver dashboard completo
                - generic [ref=e498]:
                  - button "Chamada" [ref=e500] [cursor=pointer]
                  - button "Ações em massa" [ref=e501] [cursor=pointer]
                  - button "ios_share Extrair dados" [ref=e502] [cursor=pointer]:
                    - generic [ref=e503]: ios_share
                    - text: Extrair dados
                  - generic [ref=e504]:
                    - generic [ref=e505]:
                      - img [ref=e507]
                      - textbox "Pesquise aqui" [ref=e509]
                    - generic [ref=e510]:
                      - generic [ref=e511] [cursor=pointer]: grid_view
                      - generic [ref=e512] [cursor=pointer]: reorder
                    - button "Filtro" [ref=e513] [cursor=pointer]:
                      - generic [ref=e515]: filter_alt
                      - paragraph [ref=e517]: Filtro
                - table [ref=e519]:
                  - rowgroup [ref=e520]:
                    - row "Participante Progresso Desempenho Pontuação Aprovação Certificado" [ref=e521]:
                      - columnheader [ref=e522]:
                        - checkbox [ref=e525]
                      - columnheader "Participante" [ref=e527] [cursor=pointer]:
                        - generic [ref=e530]:
                          - text: Participante
                          - img [ref=e531]
                      - columnheader "Progresso" [ref=e533] [cursor=pointer]:
                        - generic [ref=e536]:
                          - text: Progresso
                          - img [ref=e537]
                      - columnheader "Desempenho" [ref=e539] [cursor=pointer]:
                        - generic [ref=e542]:
                          - text: Desempenho
                          - img [ref=e543]
                      - columnheader "Pontuação" [ref=e545] [cursor=pointer]:
                        - generic [ref=e548]:
                          - text: Pontuação
                          - img [ref=e549]
                      - columnheader "Aprovação" [ref=e551] [cursor=pointer]:
                        - generic [ref=e554]:
                          - text: Aprovação
                          - img [ref=e555]
                      - columnheader "Certificado" [ref=e557] [cursor=pointer]:
                        - generic [ref=e560]:
                          - text: Certificado
                          - img [ref=e561]
                      - columnheader [ref=e563]
                  - rowgroup [ref=e564]:
                    - row "avatar Aluno TC4 rec-v2-tc4-w3-1779968485862@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e565]:
                      - cell [ref=e566]:
                        - checkbox [ref=e568]
                      - cell "avatar Aluno TC4 rec-v2-tc4-w3-1779968485862@example.com" [ref=e570] [cursor=pointer]:
                        - generic [ref=e571]:
                          - img "avatar" [ref=e574]
                          - paragraph [ref=e578]:
                            - paragraph [ref=e579]: Aluno TC4
                            - text: rec-v2-tc4-w3-1779968485862@example.com
                      - cell "0 0%" [ref=e580] [cursor=pointer]:
                        - generic [ref=e581]:
                          - generic [ref=e582]:
                            - progressbar
                          - paragraph [ref=e583]: 0%
                      - cell "0.0%" [ref=e584] [cursor=pointer]:
                        - generic [ref=e585]: 0.0%
                      - cell "0" [ref=e586] [cursor=pointer]:
                        - generic [ref=e587]: "0"
                      - cell [ref=e588]:
                        - checkbox [ref=e590]
                      - cell "hourglass_empty Pendente" [ref=e593]:
                        - generic [ref=e595] [cursor=pointer]:
                          - generic [ref=e596]: hourglass_empty
                          - paragraph [ref=e597]: Pendente
                      - cell "more_vert" [ref=e598]:
                        - button "more_vert" [ref=e602] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC1 rec-v2-tc1-w0-1779968482874@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e603]:
                      - cell [ref=e604]:
                        - checkbox [ref=e606]
                      - cell "avatar Aluno TC1 rec-v2-tc1-w0-1779968482874@example.com" [ref=e608] [cursor=pointer]:
                        - generic [ref=e609]:
                          - img "avatar" [ref=e612]
                          - paragraph [ref=e616]:
                            - paragraph [ref=e617]: Aluno TC1
                            - text: rec-v2-tc1-w0-1779968482874@example.com
                      - cell "0 0%" [ref=e618] [cursor=pointer]:
                        - generic [ref=e619]:
                          - generic [ref=e620]:
                            - progressbar
                          - paragraph [ref=e621]: 0%
                      - cell "0.0%" [ref=e622] [cursor=pointer]:
                        - generic [ref=e623]: 0.0%
                      - cell "0" [ref=e624] [cursor=pointer]:
                        - generic [ref=e625]: "0"
                      - cell [ref=e626]:
                        - checkbox [ref=e628]
                      - cell "hourglass_empty Pendente" [ref=e631]:
                        - generic [ref=e633] [cursor=pointer]:
                          - generic [ref=e634]: hourglass_empty
                          - paragraph [ref=e635]: Pendente
                      - cell "more_vert" [ref=e636]:
                        - button "more_vert" [ref=e640] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC3 rec-v2-tc3-w2-1779968482822@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e641]:
                      - cell [ref=e642]:
                        - checkbox [ref=e644]
                      - cell "avatar Aluno TC3 rec-v2-tc3-w2-1779968482822@example.com" [ref=e646] [cursor=pointer]:
                        - generic [ref=e647]:
                          - img "avatar" [ref=e650]
                          - paragraph [ref=e654]:
                            - paragraph [ref=e655]: Aluno TC3
                            - text: rec-v2-tc3-w2-1779968482822@example.com
                      - cell "0 0%" [ref=e656] [cursor=pointer]:
                        - generic [ref=e657]:
                          - generic [ref=e658]:
                            - progressbar
                          - paragraph [ref=e659]: 0%
                      - cell "0.0%" [ref=e660] [cursor=pointer]:
                        - generic [ref=e661]: 0.0%
                      - cell "0" [ref=e662] [cursor=pointer]:
                        - generic [ref=e663]: "0"
                      - cell [ref=e664]:
                        - checkbox [ref=e666]
                      - cell "hourglass_empty Pendente" [ref=e669]:
                        - generic [ref=e671] [cursor=pointer]:
                          - generic [ref=e672]: hourglass_empty
                          - paragraph [ref=e673]: Pendente
                      - cell "more_vert" [ref=e674]:
                        - button "more_vert" [ref=e678] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC4 rec-v2-tc4-w3-1779968390793@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e679]:
                      - cell [ref=e680]:
                        - checkbox [ref=e682]
                      - cell "avatar Aluno TC4 rec-v2-tc4-w3-1779968390793@example.com" [ref=e684] [cursor=pointer]:
                        - generic [ref=e685]:
                          - img "avatar" [ref=e688]
                          - paragraph [ref=e692]:
                            - paragraph [ref=e693]: Aluno TC4
                            - text: rec-v2-tc4-w3-1779968390793@example.com
                      - cell "0 0%" [ref=e694] [cursor=pointer]:
                        - generic [ref=e695]:
                          - generic [ref=e696]:
                            - progressbar
                          - paragraph [ref=e697]: 0%
                      - cell "0.0%" [ref=e698] [cursor=pointer]:
                        - generic [ref=e699]: 0.0%
                      - cell "0" [ref=e700] [cursor=pointer]:
                        - generic [ref=e701]: "0"
                      - cell [ref=e702]:
                        - checkbox [ref=e704]
                      - cell "hourglass_empty Pendente" [ref=e707]:
                        - generic [ref=e709] [cursor=pointer]:
                          - generic [ref=e710]: hourglass_empty
                          - paragraph [ref=e711]: Pendente
                      - cell "more_vert" [ref=e712]:
                        - button "more_vert" [ref=e716] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC1 rec-v2-tc1-w0-1779968387496@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e717]:
                      - cell [ref=e718]:
                        - checkbox [ref=e720]
                      - cell "avatar Aluno TC1 rec-v2-tc1-w0-1779968387496@example.com" [ref=e722] [cursor=pointer]:
                        - generic [ref=e723]:
                          - img "avatar" [ref=e726]
                          - paragraph [ref=e730]:
                            - paragraph [ref=e731]: Aluno TC1
                            - text: rec-v2-tc1-w0-1779968387496@example.com
                      - cell "0 0%" [ref=e732] [cursor=pointer]:
                        - generic [ref=e733]:
                          - generic [ref=e734]:
                            - progressbar
                          - paragraph [ref=e735]: 0%
                      - cell "0.0%" [ref=e736] [cursor=pointer]:
                        - generic [ref=e737]: 0.0%
                      - cell "0" [ref=e738] [cursor=pointer]:
                        - generic [ref=e739]: "0"
                      - cell [ref=e740]:
                        - checkbox [ref=e742]
                      - cell "hourglass_empty Pendente" [ref=e745]:
                        - generic [ref=e747] [cursor=pointer]:
                          - generic [ref=e748]: hourglass_empty
                          - paragraph [ref=e749]: Pendente
                      - cell "more_vert" [ref=e750]:
                        - button "more_vert" [ref=e754] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC3 rec-v2-tc3-w2-1779968387496@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e755]:
                      - cell [ref=e756]:
                        - checkbox [ref=e758]
                      - cell "avatar Aluno TC3 rec-v2-tc3-w2-1779968387496@example.com" [ref=e760] [cursor=pointer]:
                        - generic [ref=e761]:
                          - img "avatar" [ref=e764]
                          - paragraph [ref=e768]:
                            - paragraph [ref=e769]: Aluno TC3
                            - text: rec-v2-tc3-w2-1779968387496@example.com
                      - cell "0 0%" [ref=e770] [cursor=pointer]:
                        - generic [ref=e771]:
                          - generic [ref=e772]:
                            - progressbar
                          - paragraph [ref=e773]: 0%
                      - cell "0.0%" [ref=e774] [cursor=pointer]:
                        - generic [ref=e775]: 0.0%
                      - cell "0" [ref=e776] [cursor=pointer]:
                        - generic [ref=e777]: "0"
                      - cell [ref=e778]:
                        - checkbox [ref=e780]
                      - cell "hourglass_empty Pendente" [ref=e783]:
                        - generic [ref=e785] [cursor=pointer]:
                          - generic [ref=e786]: hourglass_empty
                          - paragraph [ref=e787]: Pendente
                      - cell "more_vert" [ref=e788]:
                        - button "more_vert" [ref=e792] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC4 rec-v2-tc4-w0-1779967924600@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e793]:
                      - cell [ref=e794]:
                        - checkbox [ref=e796]
                      - cell "avatar Aluno TC4 rec-v2-tc4-w0-1779967924600@example.com" [ref=e798] [cursor=pointer]:
                        - generic [ref=e799]:
                          - img "avatar" [ref=e802]
                          - paragraph [ref=e806]:
                            - paragraph [ref=e807]: Aluno TC4
                            - text: rec-v2-tc4-w0-1779967924600@example.com
                      - cell "0 0%" [ref=e808] [cursor=pointer]:
                        - generic [ref=e809]:
                          - generic [ref=e810]:
                            - progressbar
                          - paragraph [ref=e811]: 0%
                      - cell "0.0%" [ref=e812] [cursor=pointer]:
                        - generic [ref=e813]: 0.0%
                      - cell "0" [ref=e814] [cursor=pointer]:
                        - generic [ref=e815]: "0"
                      - cell [ref=e816]:
                        - checkbox [ref=e818]
                      - cell "hourglass_empty Pendente" [ref=e821]:
                        - generic [ref=e823] [cursor=pointer]:
                          - generic [ref=e824]: hourglass_empty
                          - paragraph [ref=e825]: Pendente
                      - cell "more_vert" [ref=e826]:
                        - button "more_vert" [ref=e830] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC1 rec-v2-tc1-w0-1779945314383@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e831]:
                      - cell [ref=e832]:
                        - checkbox [ref=e834]
                      - cell "avatar Aluno TC1 rec-v2-tc1-w0-1779945314383@example.com" [ref=e836] [cursor=pointer]:
                        - generic [ref=e837]:
                          - img "avatar" [ref=e840]
                          - paragraph [ref=e844]:
                            - paragraph [ref=e845]: Aluno TC1
                            - text: rec-v2-tc1-w0-1779945314383@example.com
                      - cell "0 0%" [ref=e846] [cursor=pointer]:
                        - generic [ref=e847]:
                          - generic [ref=e848]:
                            - progressbar
                          - paragraph [ref=e849]: 0%
                      - cell "0.0%" [ref=e850] [cursor=pointer]:
                        - generic [ref=e851]: 0.0%
                      - cell "0" [ref=e852] [cursor=pointer]:
                        - generic [ref=e853]: "0"
                      - cell [ref=e854]:
                        - checkbox [ref=e856]
                      - cell "hourglass_empty Pendente" [ref=e859]:
                        - generic [ref=e861] [cursor=pointer]:
                          - generic [ref=e862]: hourglass_empty
                          - paragraph [ref=e863]: Pendente
                      - cell "more_vert" [ref=e864]:
                        - button "more_vert" [ref=e868] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC3 rec-v2-tc3-w2-1779945314354@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e869]:
                      - cell [ref=e870]:
                        - checkbox [ref=e872]
                      - cell "avatar Aluno TC3 rec-v2-tc3-w2-1779945314354@example.com" [ref=e874] [cursor=pointer]:
                        - generic [ref=e875]:
                          - img "avatar" [ref=e878]
                          - paragraph [ref=e882]:
                            - paragraph [ref=e883]: Aluno TC3
                            - text: rec-v2-tc3-w2-1779945314354@example.com
                      - cell "0 0%" [ref=e884] [cursor=pointer]:
                        - generic [ref=e885]:
                          - generic [ref=e886]:
                            - progressbar
                          - paragraph [ref=e887]: 0%
                      - cell "0.0%" [ref=e888] [cursor=pointer]:
                        - generic [ref=e889]: 0.0%
                      - cell "0" [ref=e890] [cursor=pointer]:
                        - generic [ref=e891]: "0"
                      - cell [ref=e892]:
                        - checkbox [ref=e894]
                      - cell "hourglass_empty Pendente" [ref=e897]:
                        - generic [ref=e899] [cursor=pointer]:
                          - generic [ref=e900]: hourglass_empty
                          - paragraph [ref=e901]: Pendente
                      - cell "more_vert" [ref=e902]:
                        - button "more_vert" [ref=e906] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC3 rec-v2-tc3-w2-1779944816696@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e907]:
                      - cell [ref=e908]:
                        - checkbox [ref=e910]
                      - cell "avatar Aluno TC3 rec-v2-tc3-w2-1779944816696@example.com" [ref=e912] [cursor=pointer]:
                        - generic [ref=e913]:
                          - img "avatar" [ref=e916]
                          - paragraph [ref=e920]:
                            - paragraph [ref=e921]: Aluno TC3
                            - text: rec-v2-tc3-w2-1779944816696@example.com
                      - cell "0 0%" [ref=e922] [cursor=pointer]:
                        - generic [ref=e923]:
                          - generic [ref=e924]:
                            - progressbar
                          - paragraph [ref=e925]: 0%
                      - cell "0.0%" [ref=e926] [cursor=pointer]:
                        - generic [ref=e927]: 0.0%
                      - cell "0" [ref=e928] [cursor=pointer]:
                        - generic [ref=e929]: "0"
                      - cell [ref=e930]:
                        - checkbox [ref=e932]
                      - cell "hourglass_empty Pendente" [ref=e935]:
                        - generic [ref=e937] [cursor=pointer]:
                          - generic [ref=e938]: hourglass_empty
                          - paragraph [ref=e939]: Pendente
                      - cell "more_vert" [ref=e940]:
                        - button "more_vert" [ref=e944] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC1 rec-v2-tc1-w0-1779944816668@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e945]:
                      - cell [ref=e946]:
                        - checkbox [ref=e948]
                      - cell "avatar Aluno TC1 rec-v2-tc1-w0-1779944816668@example.com" [ref=e950] [cursor=pointer]:
                        - generic [ref=e951]:
                          - img "avatar" [ref=e954]
                          - paragraph [ref=e958]:
                            - paragraph [ref=e959]: Aluno TC1
                            - text: rec-v2-tc1-w0-1779944816668@example.com
                      - cell "0 0%" [ref=e960] [cursor=pointer]:
                        - generic [ref=e961]:
                          - generic [ref=e962]:
                            - progressbar
                          - paragraph [ref=e963]: 0%
                      - cell "0.0%" [ref=e964] [cursor=pointer]:
                        - generic [ref=e965]: 0.0%
                      - cell "0" [ref=e966] [cursor=pointer]:
                        - generic [ref=e967]: "0"
                      - cell [ref=e968]:
                        - checkbox [ref=e970]
                      - cell "hourglass_empty Pendente" [ref=e973]:
                        - generic [ref=e975] [cursor=pointer]:
                          - generic [ref=e976]: hourglass_empty
                          - paragraph [ref=e977]: Pendente
                      - cell "more_vert" [ref=e978]:
                        - button "more_vert" [ref=e982] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC1 rec-v2-tc1@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e983]:
                      - cell [ref=e984]:
                        - checkbox [ref=e986]
                      - cell "avatar Aluno TC1 rec-v2-tc1@example.com" [ref=e988] [cursor=pointer]:
                        - generic [ref=e989]:
                          - img "avatar" [ref=e992]
                          - paragraph [ref=e996]:
                            - paragraph [ref=e997]: Aluno TC1
                            - text: rec-v2-tc1@example.com
                      - cell "0 0%" [ref=e998] [cursor=pointer]:
                        - generic [ref=e999]:
                          - generic [ref=e1000]:
                            - progressbar
                          - paragraph [ref=e1001]: 0%
                      - cell "0.0%" [ref=e1002] [cursor=pointer]:
                        - generic [ref=e1003]: 0.0%
                      - cell "0" [ref=e1004] [cursor=pointer]:
                        - generic [ref=e1005]: "0"
                      - cell [ref=e1006]:
                        - checkbox [ref=e1008]
                      - cell "hourglass_empty Pendente" [ref=e1011]:
                        - generic [ref=e1013] [cursor=pointer]:
                          - generic [ref=e1014]: hourglass_empty
                          - paragraph [ref=e1015]: Pendente
                      - cell "more_vert" [ref=e1016]:
                        - button "more_vert" [ref=e1020] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Aluno TC3 rec-v2-tc3@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e1021]:
                      - cell [ref=e1022]:
                        - checkbox [ref=e1024]
                      - cell "avatar Aluno TC3 rec-v2-tc3@example.com" [ref=e1026] [cursor=pointer]:
                        - generic [ref=e1027]:
                          - img "avatar" [ref=e1030]
                          - paragraph [ref=e1034]:
                            - paragraph [ref=e1035]: Aluno TC3
                            - text: rec-v2-tc3@example.com
                      - cell "0 0%" [ref=e1036] [cursor=pointer]:
                        - generic [ref=e1037]:
                          - generic [ref=e1038]:
                            - progressbar
                          - paragraph [ref=e1039]: 0%
                      - cell "0.0%" [ref=e1040] [cursor=pointer]:
                        - generic [ref=e1041]: 0.0%
                      - cell "0" [ref=e1042] [cursor=pointer]:
                        - generic [ref=e1043]: "0"
                      - cell [ref=e1044]:
                        - checkbox [ref=e1046]
                      - cell "hourglass_empty Pendente" [ref=e1049]:
                        - generic [ref=e1051] [cursor=pointer]:
                          - generic [ref=e1052]: hourglass_empty
                          - paragraph [ref=e1053]: Pendente
                      - cell "more_vert" [ref=e1054]:
                        - button "more_vert" [ref=e1058] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Validacao Curl validacao-api-rec-20260528-015348@example.com 0 0% 0.0% 0 hourglass_empty Pendente more_vert" [ref=e1059]:
                      - cell [ref=e1060]:
                        - checkbox [ref=e1062]
                      - cell "avatar Validacao Curl validacao-api-rec-20260528-015348@example.com" [ref=e1064] [cursor=pointer]:
                        - generic [ref=e1065]:
                          - img "avatar" [ref=e1068]
                          - paragraph [ref=e1072]:
                            - paragraph [ref=e1073]: Validacao Curl
                            - text: validacao-api-rec-20260528-015348@example.com
                      - cell "0 0%" [ref=e1074] [cursor=pointer]:
                        - generic [ref=e1075]:
                          - generic [ref=e1076]:
                            - progressbar
                          - paragraph [ref=e1077]: 0%
                      - cell "0.0%" [ref=e1078] [cursor=pointer]:
                        - generic [ref=e1079]: 0.0%
                      - cell "0" [ref=e1080] [cursor=pointer]:
                        - generic [ref=e1081]: "0"
                      - cell [ref=e1082]:
                        - checkbox [ref=e1084]
                      - cell "hourglass_empty Pendente" [ref=e1087]:
                        - generic [ref=e1089] [cursor=pointer]:
                          - generic [ref=e1090]: hourglass_empty
                          - paragraph [ref=e1091]: Pendente
                      - cell "more_vert" [ref=e1092]:
                        - button "more_vert" [ref=e1096] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Recertificação Ever 1 recertificacaoever1@twygo.com 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e1097]:
                      - cell [ref=e1098]:
                        - checkbox [ref=e1100]
                      - cell "avatar Recertificação Ever 1 recertificacaoever1@twygo.com" [ref=e1102] [cursor=pointer]:
                        - generic [ref=e1103]:
                          - img "avatar" [ref=e1106]
                          - paragraph [ref=e1110]:
                            - paragraph [ref=e1111]: Recertificação Ever 1
                            - text: recertificacaoever1@twygo.com
                      - cell "100 100%" [ref=e1112] [cursor=pointer]:
                        - generic [ref=e1113]:
                          - progressbar [ref=e1115]
                          - paragraph [ref=e1116]: 100%
                      - cell "100.0%" [ref=e1117] [cursor=pointer]:
                        - generic [ref=e1118]: 100.0%
                      - cell "120" [ref=e1119] [cursor=pointer]:
                        - generic [ref=e1120]: "120"
                      - cell [ref=e1121]:
                        - checkbox [checked] [ref=e1123]
                      - cell "Emitido visibility download" [ref=e1126]:
                        - generic [ref=e1127]:
                          - generic [ref=e1129] [cursor=pointer]:
                            - img [ref=e1130]
                            - paragraph [ref=e1132]: Emitido
                          - generic [ref=e1133] [cursor=pointer]: visibility
                          - generic [ref=e1134] [cursor=pointer]: download
                      - cell "more_vert" [ref=e1135]:
                        - button "more_vert" [expanded] [ref=e1139] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Julia Oliveira julia@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e1140]:
                      - cell [ref=e1141]:
                        - checkbox [ref=e1143]
                      - cell "avatar Julia Oliveira julia@sophia.tech.com.br" [ref=e1145] [cursor=pointer]:
                        - generic [ref=e1146]:
                          - img "avatar" [ref=e1149]
                          - paragraph [ref=e1153]:
                            - paragraph [ref=e1154]: Julia Oliveira
                            - text: julia@sophia.tech.com.br
                      - cell "100 100%" [ref=e1155] [cursor=pointer]:
                        - generic [ref=e1156]:
                          - progressbar [ref=e1158]
                          - paragraph [ref=e1159]: 100%
                      - cell "100.0%" [ref=e1160] [cursor=pointer]:
                        - generic [ref=e1161]: 100.0%
                      - cell "120" [ref=e1162] [cursor=pointer]:
                        - generic [ref=e1163]: "120"
                      - cell [ref=e1164]:
                        - checkbox [checked] [ref=e1166]
                      - cell "Emitido visibility download" [ref=e1169]:
                        - generic [ref=e1170]:
                          - generic [ref=e1172] [cursor=pointer]:
                            - img [ref=e1173]
                            - paragraph [ref=e1175]: Emitido
                          - generic [ref=e1176] [cursor=pointer]: visibility
                          - generic [ref=e1177] [cursor=pointer]: download
                      - cell "more_vert" [ref=e1178]:
                        - button "more_vert" [ref=e1182] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Vanessa Pereira vanessa@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e1183]:
                      - cell [ref=e1184]:
                        - checkbox [ref=e1186]
                      - cell "avatar Vanessa Pereira vanessa@sophia.tech.com.br" [ref=e1188] [cursor=pointer]:
                        - generic [ref=e1189]:
                          - img "avatar" [ref=e1192]
                          - paragraph [ref=e1196]:
                            - paragraph [ref=e1197]: Vanessa Pereira
                            - text: vanessa@sophia.tech.com.br
                      - cell "100 100%" [ref=e1198] [cursor=pointer]:
                        - generic [ref=e1199]:
                          - progressbar [ref=e1201]
                          - paragraph [ref=e1202]: 100%
                      - cell "100.0%" [ref=e1203] [cursor=pointer]:
                        - generic [ref=e1204]: 100.0%
                      - cell "120" [ref=e1205] [cursor=pointer]:
                        - generic [ref=e1206]: "120"
                      - cell [ref=e1207]:
                        - checkbox [checked] [ref=e1209]
                      - cell "Emitido visibility download" [ref=e1212]:
                        - generic [ref=e1213]:
                          - generic [ref=e1215] [cursor=pointer]:
                            - img [ref=e1216]
                            - paragraph [ref=e1218]: Emitido
                          - generic [ref=e1219] [cursor=pointer]: visibility
                          - generic [ref=e1220] [cursor=pointer]: download
                      - cell "more_vert" [ref=e1221]:
                        - button "more_vert" [ref=e1225] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Gabriel Souza gabriel@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e1226]:
                      - cell [ref=e1227]:
                        - checkbox [ref=e1229]
                      - cell "avatar Gabriel Souza gabriel@sophia.tech.com.br" [ref=e1231] [cursor=pointer]:
                        - generic [ref=e1232]:
                          - img "avatar" [ref=e1235]
                          - paragraph [ref=e1239]:
                            - paragraph [ref=e1240]: Gabriel Souza
                            - text: gabriel@sophia.tech.com.br
                      - cell "100 100%" [ref=e1241] [cursor=pointer]:
                        - generic [ref=e1242]:
                          - progressbar [ref=e1244]
                          - paragraph [ref=e1245]: 100%
                      - cell "100.0%" [ref=e1246] [cursor=pointer]:
                        - generic [ref=e1247]: 100.0%
                      - cell "120" [ref=e1248] [cursor=pointer]:
                        - generic [ref=e1249]: "120"
                      - cell [ref=e1250]:
                        - checkbox [checked] [ref=e1252]
                      - cell "Emitido visibility download" [ref=e1255]:
                        - generic [ref=e1256]:
                          - generic [ref=e1258] [cursor=pointer]:
                            - img [ref=e1259]
                            - paragraph [ref=e1261]: Emitido
                          - generic [ref=e1262] [cursor=pointer]: visibility
                          - generic [ref=e1263] [cursor=pointer]: download
                      - cell "more_vert" [ref=e1264]:
                        - button "more_vert" [ref=e1268] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Carla Silva carla@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e1269]:
                      - cell [ref=e1270]:
                        - checkbox [ref=e1272]
                      - cell "avatar Carla Silva carla@sophia.tech.com.br" [ref=e1274] [cursor=pointer]:
                        - generic [ref=e1275]:
                          - img "avatar" [ref=e1278]
                          - paragraph [ref=e1282]:
                            - paragraph [ref=e1283]: Carla Silva
                            - text: carla@sophia.tech.com.br
                      - cell "100 100%" [ref=e1284] [cursor=pointer]:
                        - generic [ref=e1285]:
                          - progressbar [ref=e1287]
                          - paragraph [ref=e1288]: 100%
                      - cell "100.0%" [ref=e1289] [cursor=pointer]:
                        - generic [ref=e1290]: 100.0%
                      - cell "120" [ref=e1291] [cursor=pointer]:
                        - generic [ref=e1292]: "120"
                      - cell [ref=e1293]:
                        - checkbox [checked] [ref=e1295]
                      - cell "Emitido visibility download" [ref=e1298]:
                        - generic [ref=e1299]:
                          - generic [ref=e1301] [cursor=pointer]:
                            - img [ref=e1302]
                            - paragraph [ref=e1304]: Emitido
                          - generic [ref=e1305] [cursor=pointer]: visibility
                          - generic [ref=e1306] [cursor=pointer]: download
                      - cell "more_vert" [ref=e1307]:
                        - button "more_vert" [ref=e1311] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                    - row "avatar Danilo Marques danilo@sophia.tech.com.br 100 100% 100.0% 120 Emitido visibility download more_vert" [ref=e1312]:
                      - cell [ref=e1313]:
                        - checkbox [ref=e1315]
                      - cell "avatar Danilo Marques danilo@sophia.tech.com.br" [ref=e1317] [cursor=pointer]:
                        - generic [ref=e1318]:
                          - img "avatar" [ref=e1321]
                          - paragraph [ref=e1325]:
                            - paragraph [ref=e1326]: Danilo Marques
                            - text: danilo@sophia.tech.com.br
                      - cell "100 100%" [ref=e1327] [cursor=pointer]:
                        - generic [ref=e1328]:
                          - progressbar [ref=e1330]
                          - paragraph [ref=e1331]: 100%
                      - cell "100.0%" [ref=e1332] [cursor=pointer]:
                        - generic [ref=e1333]: 100.0%
                      - cell "120" [ref=e1334] [cursor=pointer]:
                        - generic [ref=e1335]: "120"
                      - cell [ref=e1336]:
                        - checkbox [checked] [ref=e1338]
                      - cell "Emitido visibility download" [ref=e1341]:
                        - generic [ref=e1342]:
                          - generic [ref=e1344] [cursor=pointer]:
                            - img [ref=e1345]
                            - paragraph [ref=e1347]: Emitido
                          - generic [ref=e1348] [cursor=pointer]: visibility
                          - generic [ref=e1349] [cursor=pointer]: download
                      - cell "more_vert" [ref=e1350]:
                        - button "more_vert" [ref=e1354] [cursor=pointer]:
                          - generic:
                            - generic: more_vert
                - generic [ref=e1356]:
                  - generic [ref=e1357]:
                    - button "keyboard_double_arrow_left" [disabled] [ref=e1358]:
                      - generic [ref=e1359]: keyboard_double_arrow_left
                    - button "chevron_left" [disabled] [ref=e1360]:
                      - generic [ref=e1361]: chevron_left
                    - button "1" [ref=e1362] [cursor=pointer]
                    - button "chevron_right" [disabled] [ref=e1363]:
                      - generic [ref=e1364]: chevron_right
                  - generic [ref=e1365]:
                    - combobox [ref=e1366]:
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
  - generic:
    - generic [ref=e1367] [cursor=pointer]: workspace_premium
    - img [ref=e1370] [cursor=pointer]
    - img [ref=e1374] [cursor=pointer]
    - generic [ref=e1376] [cursor=pointer]: emoji_events
    - generic [ref=e1377] [cursor=pointer]: mail
    - generic [ref=e1380] [cursor=pointer]: chat_add_on
    - img [ref=e1383] [cursor=pointer]
    - generic [ref=e1385] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1386] [cursor=pointer]: workspace_premium
    - img [ref=e1389] [cursor=pointer]
    - img [ref=e1393] [cursor=pointer]
    - generic [ref=e1395] [cursor=pointer]: emoji_events
    - generic [ref=e1396] [cursor=pointer]: mail
    - generic [ref=e1399] [cursor=pointer]: chat_add_on
    - img [ref=e1402] [cursor=pointer]
    - generic [ref=e1404] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1405] [cursor=pointer]: workspace_premium
    - img [ref=e1408] [cursor=pointer]
    - img [ref=e1412] [cursor=pointer]
    - generic [ref=e1414] [cursor=pointer]: emoji_events
    - generic [ref=e1415] [cursor=pointer]: mail
    - generic [ref=e1418] [cursor=pointer]: chat_add_on
    - img [ref=e1421] [cursor=pointer]
    - generic [ref=e1423] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1424] [cursor=pointer]: workspace_premium
    - img [ref=e1427] [cursor=pointer]
    - img [ref=e1431] [cursor=pointer]
    - generic [ref=e1433] [cursor=pointer]: emoji_events
    - generic [ref=e1434] [cursor=pointer]: mail
    - generic [ref=e1437] [cursor=pointer]: chat_add_on
    - img [ref=e1440] [cursor=pointer]
    - generic [ref=e1442] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1443] [cursor=pointer]: workspace_premium
    - img [ref=e1446] [cursor=pointer]
    - img [ref=e1450] [cursor=pointer]
    - generic [ref=e1452] [cursor=pointer]: emoji_events
    - generic [ref=e1453] [cursor=pointer]: mail
    - generic [ref=e1456] [cursor=pointer]: chat_add_on
    - img [ref=e1459] [cursor=pointer]
    - generic [ref=e1461] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1462] [cursor=pointer]: workspace_premium
    - img [ref=e1465] [cursor=pointer]
    - img [ref=e1469] [cursor=pointer]
    - generic [ref=e1471] [cursor=pointer]: emoji_events
    - generic [ref=e1472] [cursor=pointer]: mail
    - generic [ref=e1475] [cursor=pointer]: chat_add_on
    - img [ref=e1478] [cursor=pointer]
    - generic [ref=e1480] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1481] [cursor=pointer]: workspace_premium
    - img [ref=e1484] [cursor=pointer]
    - img [ref=e1488] [cursor=pointer]
    - generic [ref=e1490] [cursor=pointer]: emoji_events
    - generic [ref=e1491] [cursor=pointer]: mail
    - generic [ref=e1494] [cursor=pointer]: chat_add_on
    - img [ref=e1497] [cursor=pointer]
    - generic [ref=e1499] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1500] [cursor=pointer]: workspace_premium
    - img [ref=e1503] [cursor=pointer]
    - img [ref=e1507] [cursor=pointer]
    - generic [ref=e1509] [cursor=pointer]: emoji_events
    - generic [ref=e1510] [cursor=pointer]: mail
    - generic [ref=e1513] [cursor=pointer]: chat_add_on
    - img [ref=e1516] [cursor=pointer]
    - generic [ref=e1518] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1519] [cursor=pointer]: workspace_premium
    - img [ref=e1522] [cursor=pointer]
    - img [ref=e1526] [cursor=pointer]
    - generic [ref=e1528] [cursor=pointer]: emoji_events
    - generic [ref=e1529] [cursor=pointer]: mail
    - generic [ref=e1532] [cursor=pointer]: chat_add_on
    - img [ref=e1535] [cursor=pointer]
    - generic [ref=e1537] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1538] [cursor=pointer]: workspace_premium
    - img [ref=e1541] [cursor=pointer]
    - img [ref=e1545] [cursor=pointer]
    - generic [ref=e1547] [cursor=pointer]: emoji_events
    - generic [ref=e1548] [cursor=pointer]: mail
    - generic [ref=e1551] [cursor=pointer]: chat_add_on
    - img [ref=e1554] [cursor=pointer]
    - generic [ref=e1556] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1557] [cursor=pointer]: workspace_premium
    - img [ref=e1560] [cursor=pointer]
    - img [ref=e1564] [cursor=pointer]
    - generic [ref=e1566] [cursor=pointer]: emoji_events
    - generic [ref=e1567] [cursor=pointer]: mail
    - generic [ref=e1570] [cursor=pointer]: chat_add_on
    - img [ref=e1573] [cursor=pointer]
    - generic [ref=e1575] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1576] [cursor=pointer]: workspace_premium
    - img [ref=e1579] [cursor=pointer]
    - img [ref=e1583] [cursor=pointer]
    - generic [ref=e1585] [cursor=pointer]: emoji_events
    - generic [ref=e1586] [cursor=pointer]: mail
    - generic [ref=e1589] [cursor=pointer]: chat_add_on
    - img [ref=e1592] [cursor=pointer]
    - generic [ref=e1594] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1595] [cursor=pointer]: workspace_premium
    - img [ref=e1598] [cursor=pointer]
    - img [ref=e1602] [cursor=pointer]
    - generic [ref=e1604] [cursor=pointer]: emoji_events
    - generic [ref=e1605] [cursor=pointer]: mail
    - generic [ref=e1608] [cursor=pointer]: chat_add_on
    - img [ref=e1611] [cursor=pointer]
    - generic [ref=e1613] [cursor=pointer]: replay
  - generic:
    - generic [ref=e1614] [cursor=pointer]: workspace_premium
    - img [ref=e1617] [cursor=pointer]
    - img [ref=e1621] [cursor=pointer]
    - generic [ref=e1623] [cursor=pointer]: emoji_events
    - generic [ref=e1624] [cursor=pointer]: mail
    - generic [ref=e1627] [cursor=pointer]: chat_add_on
    - img [ref=e1630] [cursor=pointer]
    - generic [ref=e1632] [cursor=pointer]: replay
  - generic:
    - menu [ref=e1634]:
      - menuitem "Expirar certificado" [ref=e1635] [cursor=pointer]:
        - generic [ref=e1637]:
          - img [ref=e1641]
          - text: Expirar certificado
      - menuitem "Histórico de aprendizagem" [ref=e1643] [cursor=pointer]:
        - generic [ref=e1645]:
          - img [ref=e1649]
          - text: Histórico de aprendizagem
      - menuitem "Histórico de certificado" [ref=e1651] [cursor=pointer]:
        - generic [ref=e1653]:
          - img [ref=e1657]
          - text: Histórico de certificado
      - menuitem "emoji_events Pontuação" [ref=e1659] [cursor=pointer]:
        - generic [ref=e1661]:
          - generic [ref=e1663]: emoji_events
          - text: Pontuação
      - menuitem "mail Enviar e-mail" [ref=e1664] [cursor=pointer]:
        - generic [ref=e1666]:
          - generic [ref=e1668]: mail
          - text: Enviar e-mail
      - menuitem "chat_add_on Comentários" [ref=e1669] [cursor=pointer]:
        - generic [ref=e1671]:
          - generic [ref=e1675]: chat_add_on
          - text: Comentários
      - menuitem "Registros de acesso" [ref=e1676] [cursor=pointer]:
        - generic [ref=e1678]:
          - img [ref=e1682]
          - text: Registros de acesso
      - menuitem "replay Iniciar reinscrição" [active] [ref=e1684] [cursor=pointer]:
        - generic [ref=e1686]:
          - generic [ref=e1688]: replay
          - text: Iniciar reinscrição
    - generic:
      - generic:
        - tooltip "Iniciar reinscrição"
  - generic:
    - img [ref=e1691] [cursor=pointer]
    - img [ref=e1695] [cursor=pointer]
    - img [ref=e1699] [cursor=pointer]
    - generic [ref=e1701] [cursor=pointer]: emoji_events
    - generic [ref=e1702] [cursor=pointer]: mail
    - generic [ref=e1705] [cursor=pointer]: chat_add_on
    - img [ref=e1708] [cursor=pointer]
    - generic [ref=e1710] [cursor=pointer]: replay
  - generic:
    - img [ref=e1713] [cursor=pointer]
    - img [ref=e1717] [cursor=pointer]
    - img [ref=e1721] [cursor=pointer]
    - generic [ref=e1723] [cursor=pointer]: emoji_events
    - generic [ref=e1724] [cursor=pointer]: mail
    - generic [ref=e1727] [cursor=pointer]: chat_add_on
    - img [ref=e1730] [cursor=pointer]
    - generic [ref=e1732] [cursor=pointer]: replay
  - generic:
    - img [ref=e1735] [cursor=pointer]
    - img [ref=e1739] [cursor=pointer]
    - img [ref=e1743] [cursor=pointer]
    - generic [ref=e1745] [cursor=pointer]: emoji_events
    - generic [ref=e1746] [cursor=pointer]: mail
    - generic [ref=e1749] [cursor=pointer]: chat_add_on
    - img [ref=e1752] [cursor=pointer]
    - generic [ref=e1754] [cursor=pointer]: replay
  - generic:
    - img [ref=e1757] [cursor=pointer]
    - img [ref=e1761] [cursor=pointer]
    - img [ref=e1765] [cursor=pointer]
    - generic [ref=e1767] [cursor=pointer]: emoji_events
    - generic [ref=e1768] [cursor=pointer]: mail
    - generic [ref=e1771] [cursor=pointer]: chat_add_on
    - img [ref=e1774] [cursor=pointer]
    - generic [ref=e1776] [cursor=pointer]: replay
  - generic:
    - img [ref=e1779] [cursor=pointer]
    - img [ref=e1783] [cursor=pointer]
    - img [ref=e1787] [cursor=pointer]
    - generic [ref=e1789] [cursor=pointer]: emoji_events
    - generic [ref=e1790] [cursor=pointer]: mail
    - generic [ref=e1793] [cursor=pointer]: chat_add_on
    - img [ref=e1796] [cursor=pointer]
    - generic [ref=e1798] [cursor=pointer]: replay
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