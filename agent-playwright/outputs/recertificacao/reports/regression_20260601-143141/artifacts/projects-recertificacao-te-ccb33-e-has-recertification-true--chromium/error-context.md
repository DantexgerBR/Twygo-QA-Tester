# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc3-ativar-e-salvar-persiste.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC3 — Ativar e salvar o switch persiste `has_recertification = true`
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc3-ativar-e-salvar-persiste.spec.ts:50:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: /^Acesso$/i }).or(locator('[data-test-id="tab-access"]')).first() to be visible

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
          - heading "Curso Recertificação TC3 w1-1780334783505" [level=2] [ref=e505]
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
                      - text: "807476"
                  - group [ref=e537]:
                    - generic [ref=e539]:
                      - generic [ref=e540]: Nome
                      - generic [ref=e541]: "*"
                    - textbox "Nome *" [active] [ref=e543]:
                      - /placeholder: Nome do curso
                      - text: Curso Recertificação TC3 w1-1780334783505
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
                        - paragraph [ref=f21e2]: Seed automatizado — Curso Recertificação TC3 w1-1780334783505 (createCurso v1.3).
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
```

# Test source

```ts
  1   | import type { Locator, Page } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | import { BasePage } from '../../../src/pages/BasePage.js';
  4   | import { getOrgId } from '../../../src/utils/environment.js';
  5   | import { dismissCommonModals, safeGoto } from '../../../src/utils/modals.js';
  6   | 
  7   | /**
  8   |  * Page Object da tela de edição de Conteúdo (curso / trilha) no Twygo.
  9   |  *
  10  |  * Há DUAS rotas para a mesma entidade, conforme MD §RN 2.1:
  11  |  *  - Tela HAML legada:   `/e/{eventId}/edit`
  12  |  *  - Tela React facelift: `/contents/{eventId}/edit`
  13  |  *
  14  |  * Ambas escrevem na mesma coluna `events.has_recertification`. O switch
  15  |  * "Habilitar reinscrição" só aparece quando a feature flag `:recertificacao`
  16  |  * está ATIVA na organização (RN 1 — kill switch global).
  17  |  *
  18  |  * Convenções aplicadas:
  19  |  *  - `safeGoto` em todas as navegações (regra dura meta-monorepo: cobre NPS
  20  |  *    Sofia + outros modais oportunistas que travam o evento `load`).
  21  |  *  - Switch Chakra: padrão `setSwitch` (skill `interagir-switch-chakra-twygo`)
  22  |  *    — `scrollIntoViewIfNeeded` + `click({ force: true })` no label,
  23  |  *    idempotente via comparação de estado antes do toggle.
  24  |  *  - `data-checked` no label como fonte de verdade do estado (em vez de
  25  |  *    `toBeChecked()`, que resolve no `<input>` interno oculto).
  26  |  */
  27  | export class ContentEditPage extends BasePage {
  28  |   readonly path = '';
  29  | 
  30  |   constructor(page: Page) {
  31  |     super(page);
  32  |   }
  33  | 
  34  |   // ─── Navegação ──────────────────────────────────────────────────────
  35  | 
  36  |   /**
  37  |    * Listagem de conteúdos (cursos) da organização do env atual.
  38  |    * URL canônica facelift: `/o/{orgId}/events?tab=events&profile=admin`.
  39  |    * Sem `?tab=events`, Twygo serve UI Materialize legada (⚙️ engrenagem
  40  |    * por row) ao invés da UI Chakra nova (botão `more_vert`/kebab).
  41  |    * Validado live 2026-05-27 — `clickEditarFromRow` Caminho 2 depende
  42  |    * do data-test-id `events-{id}-actions-kebab` que só existe no facelift.
  43  |    */
  44  |   async goToContentList(): Promise<void> {
  45  |     await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events&profile=admin`);
  46  |   }
  47  | 
  48  |   /** Edição HAML (formulário legado `_form_details.haml`). */
  49  |   async openEditHamlById(eventId: number | string): Promise<void> {
  50  |     await safeGoto(this.page, `/e/${eventId}/edit`);
  51  |   }
  52  | 
  53  |   /** Edição React (formulário facelift `event-form.tsx`). */
  54  |   async openEditReactById(eventId: number | string): Promise<void> {
  55  |     await safeGoto(this.page, `/contents/${eventId}/edit?tab=identification`);
  56  |   }
  57  | 
  58  |   /** Edição React abrindo direto na tab "Acesso" (`?tab=access`). */
  59  |   async openEditReactAccessById(eventId: number | string): Promise<void> {
  60  |     await safeGoto(this.page, `/contents/${eventId}/edit`);
  61  |     // Twygo facelift processa `?tab=access` de forma inconsistente entre
  62  |     // initial load e re-render — abre na Identificação e às vezes não
  63  |     // commuta. Estratégia robusta: ignorar query param e clicar na tab
  64  |     // explicitamente. Aguarda tabs renderizarem (até 20s pra cobrir
  65  |     // carregamento lento + React lazy chunks).
  66  |     const acessoTab = this.page
  67  |       .getByRole('tab', { name: /^Acesso$/i })
  68  |       .or(this.page.locator('[data-test-id="tab-access"]'))
  69  |       .first();
> 70  |     await acessoTab.waitFor({ state: 'visible', timeout: 20_000 });
      |                     ^ TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
  71  |     await acessoTab.click();
  72  |     await expect(acessoTab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
  73  |     // Aguarda o label visível do checkbox-alvo renderizar.
  74  |     await this.page
  75  |       .getByText('Habilitar reinscrição', { exact: true })
  76  |       .first()
  77  |       .waitFor({ state: 'visible', timeout: 10_000 });
  78  |   }
  79  | 
  80  |   /**
  81  |    * Default canônico de "abrir edição" usado pelos specs. Aponta para
  82  |    * a tela React (facelift) — única que renderiza o switch "Habilitar
  83  |    * reinscrição" (na tab "Acesso", validado live 2026-05-26 após fix
  84  |    * de feature flag no env). TC5 usa explicitamente os 2 helpers acima
  85  |    * para validar paridade HAML/React.
  86  |    */
  87  |   async openEditById(eventId: number | string): Promise<void> {
  88  |     await this.openEditReactById(eventId);
  89  |   }
  90  | 
  91  |   /**
  92  |    * Atalho: abre edit (facelift) já navegando pra tab "Acesso" — usada
  93  |    * pelos TCs que validam o switch "Habilitar reinscrição". Navegação
  94  |    * direta via `?tab=access` em vez de click na tab (evita race com
  95  |    * inicialização do React form).
  96  |    */
  97  |   async openEditByIdInAcessoTab(eventId: number | string): Promise<void> {
  98  |     await this.openEditReactAccessById(eventId);
  99  |   }
  100 | 
  101 |   /**
  102 |    * Navega pra qualquer tab do form de edição facelift por nome legível.
  103 |    * Implementação genérica que cobre as 8 tabs canônicas:
  104 |    * `Identificação | Acesso | Banner | Aprovação | Cobrança | Localização |
  105 |    * Dashboard | Compartilhar`.
  106 |    *
  107 |    * Estratégia: click via `getByRole('tab', { name })` (exact regex). Se a
  108 |    * tab tem data-test-id estável (ex: `tab-access`), preferir esse seletor
  109 |    * em método dedicado (como `goToAcessoTab`). Este helper é fallback
  110 |    * pra tabs sem testId mapeado.
  111 |    */
  112 |   async goToTab(
  113 |     tabName:
  114 |       | 'Identificação'
  115 |       | 'Acesso'
  116 |       | 'Banner'
  117 |       | 'Aprovação'
  118 |       | 'Cobrança'
  119 |       | 'Localização'
  120 |       | 'Dashboard'
  121 |       | 'Compartilhar',
  122 |   ): Promise<void> {
  123 |     const tab = this.page
  124 |       .getByRole('tab', { name: new RegExp(`^${tabName}$`, 'i') })
  125 |       .first();
  126 |     await tab.waitFor({ state: 'visible', timeout: 10_000 });
  127 |     if (await tab.getAttribute('aria-selected') === 'true') return;
  128 |     await tab.click();
  129 |     await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
  130 |   }
  131 | 
  132 |   /**
  133 |    * Navega pra tab "Acesso" do form de edição facelift. No facelift,
  134 |    * o checkbox "Habilitar reinscrição" vive nessa tab (validado live
  135 |    * 2026-05-27 — seção "Inscrição" → "Permitir registro de inscrição por").
  136 |    * No HAML legado não há tabs; helper é no-op.
  137 |    *
  138 |    * Tab tem data-test-id estável `tab-access` (validado live 2026-05-27).
  139 |    * Aguarda o tab ficar selected + URL atualizar.
  140 |    */
  141 |   async goToAcessoTab(): Promise<void> {
  142 |     const acessoTab = this.page
  143 |       .locator('[data-test-id="tab-access"]')
  144 |       .or(this.page.getByRole('tab', { name: /^Acesso$/i }))
  145 |       .first();
  146 |     if (await acessoTab.isVisible({ timeout: 2_000 }).catch(() => false)) {
  147 |       // Modal beta-end pode reaparecer no /contents/{id}/edit após o
  148 |       // createCurso (validado live 2026-06-01: portal Chakra intercepta
  149 |       // click na tab Acesso). Dismiss antes + aguarda portal sumir.
  150 |       await dismissCommonModals(this.page, { initialWaitMs: 1_500 });
  151 |       await this.page
  152 |         .locator('.chakra-portal:has(#chakra-modal--body-beta-end-modal)')
  153 |         .waitFor({ state: 'hidden', timeout: 5_000 })
  154 |         .catch(() => null);
  155 |       await acessoTab.click();
  156 |       await this.page
  157 |         .waitForURL(/tab=access/, { timeout: 5_000 })
  158 |         .catch(() => undefined);
  159 |       // Confirma a tab Acesso ficou selected (aria-selected=true).
  160 |       await expect(acessoTab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
  161 |       // Aguarda checkbox "Habilitar reinscrição" renderizar no DOM
  162 |       // (label visível — input é screen-reader-only do Chakra).
  163 |       await this.page
  164 |         .getByText('Habilitar reinscrição', { exact: true })
  165 |         .first()
  166 |         .waitFor({ state: 'visible', timeout: 5_000 })
  167 |         .catch(() => undefined);
  168 |     }
  169 |   }
  170 | 
```