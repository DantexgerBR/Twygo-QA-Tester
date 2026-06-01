# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc4-desativar-com-participants.spec.ts:59:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('label.chakra-checkbox').filter({ has: locator('#has_recertification') }).first() to be visible

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
      - generic [ref=e336]:
        - link "7091159 - Agents QA" [ref=e337] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e338]: Agents QA
      - button "Administrador G" [ref=e339] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e340]: G
    - text: M * * M * *
  - generic [ref=e343]:
    - generic [ref=e345]:
      - list [ref=e346]:
        - list [ref=e347]:
          - listitem [ref=e348] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e349]:
              - /url: /o/37048/dashboard
              - generic [ref=e350]:
                - generic [ref=e352]: leaderboard
                - generic [ref=e353]: Dashboard
          - listitem [ref=e354] [cursor=pointer]:
            - generic [ref=e356]:
              - generic [ref=e359]: school
              - generic [ref=e360]: Aprendizagem
              - generic [ref=e362]: G
            - list [ref=e363]:
              - listitem [ref=e364]:
                - link "format_list_bulleted_add Conteúdos" [ref=e365]:
                  - /url: /o/37048/events?tab=events
                  - generic [ref=e366]:
                    - generic [ref=e368]: format_list_bulleted_add
                    - generic [ref=e369]: Conteúdos
              - listitem [ref=e370]:
                - link "send Compartilhamentos" [ref=e371]:
                  - /url: /o/37048/shared_events
                  - generic [ref=e372]:
                    - generic [ref=e374]: send
                    - generic [ref=e375]: Compartilhamentos
              - listitem [ref=e376]:
                - link "description Registros BETA" [ref=e377]:
                  - /url: /o/37048/records
                  - generic [ref=e378]:
                    - generic [ref=e380]: description
                    - generic [ref=e381]: Registros
                    - generic [ref=e382]: BETA
              - listitem [ref=e383]:
                - link "workspace_premium Certificados" [ref=e384]:
                  - /url: /o/37048/certificate_models
                  - generic [ref=e385]:
                    - generic [ref=e387]: workspace_premium
                    - generic [ref=e388]: Certificados
              - listitem [ref=e389]:
                - link "browse Modelos de conteúdo" [ref=e390]:
                  - /url: /o/37048/content_models
                  - generic [ref=e391]:
                    - generic [ref=e393]: browse
                    - generic [ref=e394]: Modelos de conteúdo
              - listitem [ref=e395]:
                - link "folder_open Base de conhecimento" [ref=e396]:
                  - /url: /o/37048/knowledge_repositories
                  - generic [ref=e397]:
                    - generic [ref=e399]: folder_open
                    - generic [ref=e400]: Base de conhecimento
          - listitem [ref=e401] [cursor=pointer]:
            - link "group Usuários" [ref=e402]:
              - /url: /o/37048/users
              - generic [ref=e403]:
                - generic [ref=e405]: group
                - generic [ref=e406]: Usuários
          - listitem [ref=e407] [cursor=pointer]:
            - link "work Empresas" [ref=e408]:
              - /url: /o/37048/companies
              - generic [ref=e409]:
                - generic [ref=e411]: work
                - generic [ref=e412]: Empresas
          - listitem [ref=e413] [cursor=pointer]:
            - link "live_help Questionários" [ref=e414]:
              - /url: /o/37048/question_lists
              - generic [ref=e415]:
                - generic [ref=e417]: live_help
                - generic [ref=e418]: Questionários
          - listitem [ref=e419] [cursor=pointer]:
            - link "groups Comunidades" [ref=e420]:
              - /url: /o/37048/feed
              - generic [ref=e421]:
                - generic [ref=e423]: groups
                - generic [ref=e424]: Comunidades
          - listitem [ref=e425] [cursor=pointer]:
            - generic [ref=e427]:
              - generic [ref=e430]: psychology
              - generic [ref=e431]:
                - text: Skills
                - generic [ref=e432]: BETA
              - generic [ref=e434]: G
          - listitem [ref=e435] [cursor=pointer]:
            - generic [ref=e437]:
              - generic [ref=e440]: person_check
              - generic [ref=e441]:
                - text: Continuidade e sucessão
                - generic [ref=e442]: BETA
              - generic [ref=e444]: G
          - listitem [ref=e445] [cursor=pointer]:
            - generic [ref=e447]:
              - generic [ref=e450]: account_tree
              - generic [ref=e451]: Processos
              - generic [ref=e453]: G
          - listitem [ref=e454] [cursor=pointer]:
            - generic [ref=e456]:
              - generic [ref=e459]: monitoring
              - generic [ref=e460]:
                - text: Planos e Metas
                - generic [ref=e461]: BETA
              - generic [ref=e463]: G
          - listitem [ref=e464] [cursor=pointer]:
            - generic [ref=e466]:
              - generic [ref=e469]: groups
              - generic [ref=e470]:
                - text: Gestão de Time
                - generic [ref=e471]: BETA
              - generic [ref=e473]: G
      - generic [ref=e475]: Recertificação
      - list [ref=e476]:
        - listitem [ref=e477] [cursor=pointer]:
          - generic [ref=e479]:
            - generic [ref=e481]: f
            - generic [ref=e482]: Configurações
            - generic [ref=e484]: G
          - text: e    s 
    - generic [ref=e486]:
      - generic [ref=e489]: Conteúdos > Editar curso
      - generic [ref=e496]:
        - generic [ref=e497]:
          - button "Voltar" [ref=e499] [cursor=pointer]:
            - img [ref=e501]
            - text: Voltar
          - heading "Curso Recertificação TC4 w2-1780334868817" [level=2] [ref=e505]
        - generic [ref=e508]:
          - tablist [ref=e509]:
            - tab "Identificação" [selected] [ref=e510] [cursor=pointer]
            - tab "Acesso" [ref=e511] [cursor=pointer]
            - tab "Banner" [ref=e512] [cursor=pointer]
            - tab "Aprovação" [ref=e513] [cursor=pointer]
            - tab "Cobrança" [ref=e514] [cursor=pointer]
            - tab "Localização" [ref=e515] [cursor=pointer]
            - tab "Dashboard" [ref=e516] [cursor=pointer]
            - tab "Compartilhar" [ref=e517] [cursor=pointer]
          - tabpanel "Identificação" [ref=e519]:
            - generic [ref=e521]:
              - generic [ref=e522]:
                - generic [ref=e524]:
                  - heading "Dados" [level=2] [ref=e526]:
                    - generic [ref=e528]: Dados
                  - group [ref=e530]:
                    - generic [ref=e533]: Código
                    - textbox "Código" [disabled] [ref=e535]:
                      - /placeholder: Digite o código
                      - text: "807477"
                  - group [ref=e537]:
                    - generic [ref=e539]:
                      - generic [ref=e540]: Nome
                      - generic [ref=e541]: "*"
                    - textbox "Nome *" [active] [ref=e543]:
                      - /placeholder: Nome do curso
                      - text: Curso Recertificação TC4 w2-1780334868817
                    - paragraph [ref=e546]: 41 / 250
                  - group [ref=e548]:
                    - generic [ref=e550]:
                      - generic [ref=e551]: Tipo de experiência
                      - generic [ref=e552]: "*"
                      - img [ref=e554]
                    - generic [ref=e556]:
                      - log [ref=e558]
                      - generic [ref=e559]:
                        - generic [ref=e560]:
                          - generic [ref=e561]: Suite Everton CSV
                          - combobox [ref=e563]
                        - generic [ref=e564]:
                          - img [ref=e566]
                          - img [ref=e570]
                    - paragraph [ref=e575]: 17 / 30
                  - group [ref=e577]:
                    - generic [ref=e579]:
                      - generic [ref=e580]: Classificação
                      - img [ref=e582]
                    - generic [ref=e584]:
                      - log [ref=e586]
                      - generic [ref=e587]:
                        - generic [ref=e588]:
                          - generic [ref=e589]: Digite ou selecione a classificação
                          - combobox [ref=e591]
                        - img [ref=e595]
                  - group [ref=e598]:
                    - generic [ref=e600]:
                      - generic [ref=e601]: Situação
                      - generic [ref=e602]: "*"
                    - generic [ref=e604]:
                      - combobox "Situação *" [ref=e605]:
                        - option "Em desenvolvimento" [selected]
                        - option "Liberado"
                        - option "Suspenso"
                      - generic:
                        - img
                  - group [ref=e608]:
                    - checkbox "Restringir período de acesso" [ref=e610]
                    - generic [ref=e614]: Restringir período de acesso
                  - group [ref=e616]:
                    - generic [ref=e618]:
                      - generic [ref=e619]: Quem pode ver (visualização)
                      - generic [ref=e620]: "*"
                      - img [ref=e622]
                    - generic [ref=e625]:
                      - combobox "Quem pode ver (visualização) *" [ref=e626]:
                        - option "Inscritos"
                        - option "Colaborador"
                        - option "Usuários" [selected]
                        - option "Público"
                      - generic:
                        - img
                  - group [ref=e628]:
                    - generic [ref=e630]:
                      - generic [ref=e631]: Carga horária
                      - img [ref=e633]
                    - textbox "Carga horária" [ref=e636]:
                      - /placeholder: HH:MM:SS
                  - group [ref=e639]:
                    - generic [ref=e641]:
                      - generic [ref=e642]: Descrição
                      - generic [ref=e643]: "*"
                    - application "Editor de Rich Text, description" [ref=e644]:
                      - group "Barra de Ferramentas do Editor":
                        - toolbar [ref=e645]:
                          - button "Negrito" [ref=e646]
                          - button "Itálico" [ref=e648]
                          - button "Sublinhado" [ref=e650]
                          - separator [ref=e652]
                          - button "Lista numerada" [ref=e653]
                          - button "Lista sem números" [ref=e655]
                          - separator [ref=e657]
                          - button "Tamanho" [ref=e658]:
                            - generic [ref=e659]: Tamanho
                          - button "Fonte" [ref=e662]:
                            - generic [ref=e663]: Fonte
                          - button "Alinhar Esquerda" [ref=e666]
                          - button "Centralizado" [ref=e668]
                          - button "Alinhar Direita" [ref=e670]
                          - button "Justificar" [ref=e672]
                          - button "Cor do Texto" [ref=e674]
                          - separator [ref=e677]
                          - button "Tabela" [ref=e678]
                          - button "Código-Fonte" [ref=e680]:
                            - generic [ref=e682]: Código-Fonte
                          - separator [ref=e683]
                          - button "Imagem" [ref=e684]
                        - toolbar "Inserir" [ref=e686]:
                          - button "Tabela" [ref=e687]
                        - toolbar "Links" [ref=e689]:
                          - button "Inserir/Editar Link" [ref=e690]
                          - button "Remover Link" [disabled] [ref=e692]
                      - iframe [ref=e694]:
                        - paragraph [ref=f21e2]: Seed automatizado — Curso Recertificação TC4 w2-1780334868817 (createCurso v1.3).
                  - group [ref=e696]:
                    - generic [ref=e699]: Categorias
                    - generic [ref=e700]:
                      - log [ref=e702]
                      - generic [ref=e703]:
                        - generic [ref=e704]:
                          - generic [ref=e705]: Escreva os nomes das categorias separadas por vírgula
                          - combobox [ref=e707]
                        - img [ref=e711]
                  - group [ref=e714]:
                    - generic [ref=e716]:
                      - generic [ref=e717]: Enviar informação ao concluir a primeira atividade
                      - img [ref=e719]
                    - generic [ref=e722]:
                      - combobox "Enviar informação ao concluir a primeira atividade" [ref=e723]:
                        - option "Sim"
                        - option "Não" [selected]
                      - generic:
                        - img
                  - generic [ref=e725]:
                    - generic [ref=e727]:
                      - generic [ref=e728]: Competências relacionadas
                      - img [ref=e730]
                    - paragraph [ref=e733] [cursor=pointer]: Clique para selecionar as competências
                - separator [ref=e735]
              - generic [ref=e738]:
                - heading "Chat" [level=2] [ref=e740]:
                  - generic [ref=e742]: Chat
                - group [ref=e744]:
                  - checkbox "Habilitar chat no conteúdo" [ref=e746]
                  - generic [ref=e750]: Habilitar chat no conteúdo
              - generic [ref=e751]:
                - button "Salvar" [ref=e752] [cursor=pointer]
                - button "Cancelar" [ref=e753] [cursor=pointer]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - region "Widget de chat" [ref=e754]:
    - iframe [ref=e755]:
      - button "Abrir chat ao vivo" [ref=f19e5]:
        - img [ref=f19e8]
        - img [ref=f19e15]
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
  279 |   /**
  280 |    * Locator do checkbox HTML "Habilitar reinscrição" — no facelift v1.3+
  281 |    * é `<input id="has_recertification">` envolvido em `<label class="chakra-checkbox">`.
  282 |    * O input em si é screen-reader-only (1×13px com clip CSS); o label
  283 |    * visível tem text "Habilitar reinscrição".
  284 |    *
  285 |    * Para `.check()/.uncheck()/.isChecked()` retornamos o input (Playwright
  286 |    * resolve actionability via label automaticamente). Para `toBeVisible`
  287 |    * use [[getHabilitarReinscricaoVisible]] que pega o label.
  288 |    *
  289 |    * REVISAR: aguardando `data-test-id` estável (`event-has-recertification-checkbox`
  290 |    * sugerido). Validado live 2026-05-27 com input#has_recertification.
  291 |    */
  292 |   getHabilitarReinscricaoSwitch(): Locator {
  293 |     return this.page.locator('#has_recertification');
  294 |   }
  295 | 
  296 |   /**
  297 |    * Locator do label visível "Habilitar reinscrição" — use para
  298 |    * `toBeVisible` (o input em si é screen-reader-only e falha visibility).
  299 |    */
  300 |   getHabilitarReinscricaoVisible(): Locator {
  301 |     return this.page
  302 |       .locator('label.chakra-checkbox')
  303 |       .filter({ has: this.page.locator('#has_recertification') })
  304 |       .first();
  305 |   }
  306 | 
  307 |   /**
  308 |    * Locator do `<label>` (não do `<input>`) — necessário para click no
  309 |    * switch Chakra (skill `interagir-switch-chakra-twygo`). Caminho: subir
  310 |    * pro ancestor `<label>` que envolve o input oculto.
  311 |    */
  312 |   getHabilitarReinscricaoSwitchLabel(): Locator {
  313 |     return this.page
  314 |       .locator('label.chakra-switch')
  315 |       .filter({ has: this.getHabilitarReinscricaoSwitch() });
  316 |   }
  317 | 
  318 |   /**
  319 |    * Locator do ícone de ajuda do switch — geralmente um `<button>` ou
  320 |    * `<span>` com role `button` adjacente ao label, com aria-label ou
  321 |    * tooltip key. Capturamos via filtro pelo label irmão.
  322 |    *
  323 |    * REVISAR: sem `data-test-id` no app hoje; fallback usa proximidade do
  324 |    * label. Quando o data-test-id `event-has-recertification-help-icon`
  325 |    * for adicionado, trocar este getter.
  326 |    */
  327 |   getHabilitarReinscricaoTooltipTrigger(): Locator {
  328 |     // Tooltip-trigger é o ícone/botão sibling do label do switch.
  329 |     return this.page
  330 |       .locator(':is(button, span, [role="button"])')
  331 |       .filter({ has: this.page.locator('[aria-describedby], [data-tooltip], svg') })
  332 |       .filter({
  333 |         has: this.page.locator(
  334 |           'xpath=ancestor::*[self::div or self::label][.//text()[contains(., "Habilitar reinscrição")]]',
  335 |         ),
  336 |       })
  337 |       .first();
  338 |   }
  339 | 
  340 |   /**
  341 |    * Texto visível do tooltip após hover no ícone de ajuda. O texto vem
  342 |    * da chave I18n `activerecord.attributes.event.has_recertification_tooltip`.
  343 |    *
  344 |    * REVISAR-FIGMA: texto exato do tooltip ainda não confirmado — capturamos
  345 |    * o role `tooltip` que aparece após hover.
  346 |    */
  347 |   getHabilitarReinscricaoTooltip(): Locator {
  348 |     return this.page.getByRole('tooltip').first();
  349 |   }
  350 | 
  351 |   /**
  352 |    * Estado atual do checkbox "Habilitar reinscrição". No facelift v1.3+,
  353 |    * é um checkbox HTML padrão (não Chakra switch) — `isChecked()` direto.
  354 |    * Navega proativamente pra tab "Acesso" no facelift antes de checar.
  355 |    */
  356 |   async isHabilitarReinscricaoOn(): Promise<boolean> {
  357 |     if (/\/contents\/\d+\/edit/.test(this.page.url())) {
  358 |       await this.goToAcessoTab();
  359 |     }
  360 |     const checkbox = this.getHabilitarReinscricaoSwitch();
  361 |     if ((await checkbox.count()) === 0) return false;
  362 |     return checkbox.isChecked();
  363 |   }
  364 | 
  365 |   /**
  366 |    * Idempotente: só toggla se o estado atual diverge do desejado.
  367 |    * Validado live 2026-05-27 — "Habilitar reinscrição" é checkbox HTML
  368 |    * (input#has_recertification screen-reader-only com label.chakra-checkbox
  369 |    * visível). Tab Acesso, seção "Permitir registro de inscrição por".
  370 |    */
  371 |   async setHabilitarReinscricao(enabled: boolean): Promise<void> {
  372 |     // No facelift React, checkbox vive na tab "Acesso" — navega
  373 |     // proativamente. Em HAML legado (`/e/{id}/edit`) helper é no-op.
  374 |     if (/\/contents\/\d+\/edit/.test(this.page.url())) {
  375 |       await this.goToAcessoTab();
  376 |     }
  377 |     // Aguarda o LABEL visível antes de tocar no input (input é
  378 |     // screen-reader-only, waitFor('visible') no input timeoutaria).
> 379 |     await this.getHabilitarReinscricaoVisible().waitFor({
      |                                                 ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  380 |       state: 'visible',
  381 |       timeout: 10_000,
  382 |     });
  383 |     const checkbox = this.getHabilitarReinscricaoSwitch();
  384 |     if (enabled) {
  385 |       await checkbox.check();
  386 |     } else {
  387 |       await checkbox.uncheck();
  388 |     }
  389 |   }
  390 | 
  391 |   // ─── Submit / mensagens ─────────────────────────────────────────────
  392 | 
  393 |   getSaveButton(): Locator {
  394 |     // Tela HAML usa <input type="submit" value="Salvar">; React usa <button>Salvar</button>.
  395 |     // role=button cobre os dois.
  396 |     return this.page.getByRole('button', { name: /^Salvar$/ }).first();
  397 |   }
  398 | 
  399 |   async save(): Promise<void> {
  400 |     await this.getSaveButton().click();
  401 |   }
  402 | 
  403 |   /**
  404 |    * Aguarda confirmação de save bem-sucedido. Twygo usa toast Chakra +
  405 |    * redirect para a listagem (variando entre HAML/React). Asserta a
  406 |    * primeira condição que aparecer (toast OU URL de listagem).
  407 |    *
  408 |    * REVISAR-FIGMA: texto exato do toast de sucesso ainda não confirmado.
  409 |    */
  410 |   async expectSaveSuccess(): Promise<void> {
  411 |     // Toast Chakra de sucesso (status=success) — primeiro sinal pós-submit.
  412 |     const toast = this.page
  413 |       .locator('.chakra-toast, [role="status"]')
  414 |       .filter({ hasText: /salv|sucesso/i })
  415 |       .first();
  416 |     await expect
  417 |       .poll(async () => {
  418 |         const toastVisible = await toast.isVisible().catch(() => false);
  419 |         const url = this.page.url();
  420 |         return (
  421 |           toastVisible ||
  422 |           /\/o\/\d+\/events(\?|$)/.test(url) ||
  423 |           /\/(e\/\d+\/edit|contents\/\d+\/edit)/.test(url)
  424 |         );
  425 |       })
  426 |       .toBe(true);
  427 |   }
  428 | }
  429 | 
```