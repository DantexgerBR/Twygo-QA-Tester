# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts:52:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for getByRole('row', { name: /Curso Recertificação TC1 w0-1779882137235/i }).first().locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]').first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Recertificação" [ref=e4]:
        - img "Logo - Recertificação" [ref=e5]
      - img "Fechar menu" [ref=e7]
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
              - generic [ref=e191]: Planos e Metas
            - list [ref=e192]:
              - listitem [ref=e193]:
                - link "track_changes PDI" [ref=e194] [cursor=pointer]:
                  - /url: /o/37048/admin/pdis
                  - generic [ref=e195]:
                    - generic [ref=e197]: track_changes
                    - generic [ref=e198]: PDI
          - listitem [ref=e199]:
            - generic [ref=e201]:
              - generic [ref=e204]: groups
              - generic [ref=e205]:
                - text: Gestão de Time
                - generic [ref=e206]: BETA
            - list [ref=e207]:
              - listitem [ref=e208]:
                - link "trending_up Desenvolvimento" [ref=e209] [cursor=pointer]:
                  - /url: /o/37048/cycles
                  - generic [ref=e210]:
                    - generic [ref=e212]: trending_up
                    - generic [ref=e213]: Desenvolvimento
      - generic [ref=e214]: Recertificação
      - list [ref=e215]:
        - listitem [ref=e216]:
          - generic [ref=e218]:
            - generic [ref=e220]: f
            - generic [ref=e221]: Configurações
          - list [ref=e222]:
            - listitem [ref=e223]:
              - link "e Organização" [ref=e224] [cursor=pointer]:
                - /url: /o/37048/edit
                - generic [ref=e225]:
                  - generic [ref=e227]: e
                  - generic [ref=e228]: Organização
            - listitem [ref=e229]:
              - link " Menu" [ref=e230] [cursor=pointer]:
                - /url: /o/37048/use_modes
                - generic [ref=e231]:
                  - generic [ref=e233]: 
                  - generic [ref=e234]: Menu
            - listitem [ref=e235]:
              - link "electrical_services Integrações" [ref=e236] [cursor=pointer]:
                - /url: /o/37048/integrations
                - generic [ref=e237]:
                  - generic [ref=e239]: electrical_services
                  - generic [ref=e240]: Integrações
            - listitem [ref=e241]:
              - link "flash_auto Piloto automático" [ref=e242] [cursor=pointer]:
                - /url: /o/37048/autopilots
                - generic [ref=e243]:
                  - generic [ref=e245]: flash_auto
                  - generic [ref=e246]: Piloto automático
            - listitem [ref=e247]:
              - link " Regras do Jogo" [ref=e248] [cursor=pointer]:
                - /url: /o/37048/game_rules
                - generic [ref=e249]:
                  - generic [ref=e251]: 
                  - generic [ref=e252]: Regras do Jogo
            - listitem [ref=e253]:
              - link " Comunicação" [ref=e254] [cursor=pointer]:
                - /url: /o/37048/communication
                - generic [ref=e255]:
                  - generic [ref=e257]: 
                  - generic [ref=e258]: Comunicação
            - listitem [ref=e259]:
              - link "sell Cobrança de inscrição" [ref=e260] [cursor=pointer]:
                - /url: /o/37048/payments
                - generic [ref=e261]:
                  - generic [ref=e263]: sell
                  - generic [ref=e264]: Cobrança de inscrição
            - listitem [ref=e265]:
              - link "credit_card Plano e assinatura" [ref=e266] [cursor=pointer]:
                - /url: /o/37048/subscription_plans
                - generic [ref=e267]:
                  - generic [ref=e269]: credit_card
                  - generic [ref=e270]: Plano e assinatura
            - text: s
            - listitem [ref=e271]:
              - link " Segurança NOVO" [ref=e272] [cursor=pointer]:
                - /url: /o/37048/security
                - generic [ref=e273]:
                  - generic [ref=e275]: 
                  - generic [ref=e276]: Segurança NOVO
            - listitem [ref=e277]:
              - link "smart_toy Controle de IA BETA" [ref=e278] [cursor=pointer]:
                - /url: /o/37048/ai_consumption_analysis
                - generic [ref=e279]:
                  - generic [ref=e281]: smart_toy
                  - generic [ref=e282]: Controle de IA BETA
            - listitem [ref=e283]:
              - link "palette Aparência" [ref=e284] [cursor=pointer]:
                - /url: /o/37048/appearance
                - generic [ref=e285]:
                  - generic [ref=e287]: palette
                  - generic [ref=e288]: Aparência
    - generic [ref=e291]:
      - generic [ref=e292]:
        - img [ref=e293]
        - text: Agents Qa
      - img [ref=e295]
  - text: "0"
  - generic [ref=e298]:
    - generic "Logo - Recertificação" [ref=e300]:
      - link "Logo - Recertificação" [ref=e301] [cursor=pointer]:
        - /url: /o/37048/dashboard
        - img "Logo - Recertificação" [ref=e302]
    - generic [ref=e306]:
      - button "Twygo Academy" [ref=e310] [cursor=pointer]:
        - generic [ref=e311]: school
      - generic [ref=e312]:
        - link "7091159 - Agents Qa" [ref=e313] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e314]: Agents Qa
      - button "Administrador G" [ref=e315] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e316]: G
    - text: M * * M * *
  - generic [ref=e319]:
    - generic [ref=e321]:
      - list [ref=e322]:
        - list [ref=e323]:
          - listitem [ref=e324] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e325]:
              - /url: /o/37048/dashboard
              - generic [ref=e326]:
                - generic [ref=e328]: leaderboard
                - generic [ref=e329]: Dashboard
          - listitem [ref=e330] [cursor=pointer]:
            - generic [ref=e332]:
              - generic [ref=e335]: school
              - generic [ref=e336]: Aprendizagem
              - generic [ref=e338]: G
            - list [ref=e339]:
              - listitem [ref=e340]:
                - link "format_list_bulleted_add Conteúdos" [ref=e341]:
                  - /url: /o/37048/events?tab=events
                  - generic [ref=e342]:
                    - generic [ref=e344]: format_list_bulleted_add
                    - generic [ref=e345]: Conteúdos
              - listitem [ref=e346]:
                - link "send Compartilhamentos" [ref=e347]:
                  - /url: /o/37048/shared_events
                  - generic [ref=e348]:
                    - generic [ref=e350]: send
                    - generic [ref=e351]: Compartilhamentos
              - listitem [ref=e352]:
                - link "description Registros BETA" [ref=e353]:
                  - /url: /o/37048/records
                  - generic [ref=e354]:
                    - generic [ref=e356]: description
                    - generic [ref=e357]: Registros
                    - generic [ref=e358]: BETA
              - listitem [ref=e359]:
                - link "workspace_premium Certificados" [ref=e360]:
                  - /url: /o/37048/certificate_models
                  - generic [ref=e361]:
                    - generic [ref=e363]: workspace_premium
                    - generic [ref=e364]: Certificados
              - listitem [ref=e365]:
                - link "browse Modelos de conteúdo" [ref=e366]:
                  - /url: /o/37048/content_models
                  - generic [ref=e367]:
                    - generic [ref=e369]: browse
                    - generic [ref=e370]: Modelos de conteúdo
              - listitem [ref=e371]:
                - link "folder_open Base de conhecimento" [ref=e372]:
                  - /url: /o/37048/knowledge_repositories
                  - generic [ref=e373]:
                    - generic [ref=e375]: folder_open
                    - generic [ref=e376]: Base de conhecimento
          - listitem [ref=e377] [cursor=pointer]:
            - link "group Usuários" [ref=e378]:
              - /url: /o/37048/users
              - generic [ref=e379]:
                - generic [ref=e381]: group
                - generic [ref=e382]: Usuários
          - listitem [ref=e383] [cursor=pointer]:
            - link "work Empresas" [ref=e384]:
              - /url: /o/37048/companies
              - generic [ref=e385]:
                - generic [ref=e387]: work
                - generic [ref=e388]: Empresas
          - listitem [ref=e389] [cursor=pointer]:
            - link "live_help Questionários" [ref=e390]:
              - /url: /o/37048/question_lists
              - generic [ref=e391]:
                - generic [ref=e393]: live_help
                - generic [ref=e394]: Questionários
          - listitem [ref=e395] [cursor=pointer]:
            - link "groups Comunidades" [ref=e396]:
              - /url: /o/37048/feed
              - generic [ref=e397]:
                - generic [ref=e399]: groups
                - generic [ref=e400]: Comunidades
          - listitem [ref=e401] [cursor=pointer]:
            - generic [ref=e403]:
              - generic [ref=e406]: psychology
              - generic [ref=e407]:
                - text: Skills
                - generic [ref=e408]: BETA
              - generic [ref=e410]: G
          - listitem [ref=e411] [cursor=pointer]:
            - generic [ref=e413]:
              - generic [ref=e416]: person_check
              - generic [ref=e417]:
                - text: Continuidade e sucessão
                - generic [ref=e418]: BETA
              - generic [ref=e420]: G
          - listitem [ref=e421] [cursor=pointer]:
            - generic [ref=e423]:
              - generic [ref=e426]: account_tree
              - generic [ref=e427]: Processos
              - generic [ref=e429]: G
          - listitem [ref=e430] [cursor=pointer]:
            - generic [ref=e432]:
              - generic [ref=e435]: monitoring
              - generic [ref=e436]: Planos e Metas
              - generic [ref=e438]: G
          - listitem [ref=e439] [cursor=pointer]:
            - generic [ref=e441]:
              - generic [ref=e444]: groups
              - generic [ref=e445]:
                - text: Gestão de Time
                - generic [ref=e446]: BETA
              - generic [ref=e448]: G
      - generic [ref=e450]: Recertificação
      - list [ref=e451]:
        - listitem [ref=e452] [cursor=pointer]:
          - generic [ref=e454]:
            - generic [ref=e456]: f
            - generic [ref=e457]: Configurações
            - generic [ref=e459]: G
          - text: e    s 
    - generic [ref=e461]:
      - generic [ref=e464]: Conteúdos > Editar curso
      - generic [ref=e471]:
        - generic [ref=e472]:
          - button "Voltar" [ref=e474] [cursor=pointer]:
            - img [ref=e476]
            - text: Voltar
          - heading "Curso Recertificação TC1 w0-1779882137235" [level=2] [ref=e480]
        - generic [ref=e483]:
          - tablist [ref=e484]:
            - tab "Identificação" [selected] [ref=e485] [cursor=pointer]
            - tab "Acesso" [ref=e486] [cursor=pointer]
            - tab "Banner" [ref=e487] [cursor=pointer]
            - tab "Aprovação" [ref=e488] [cursor=pointer]
            - tab "Cobrança" [ref=e489] [cursor=pointer]
            - tab "Localização" [ref=e490] [cursor=pointer]
            - tab "Dashboard" [ref=e491] [cursor=pointer]
            - tab "Compartilhar" [ref=e492] [cursor=pointer]
          - tabpanel "Identificação" [ref=e494]:
            - generic [ref=e496]:
              - generic [ref=e497]:
                - generic [ref=e499]:
                  - heading "Dados" [level=2] [ref=e501]:
                    - generic [ref=e503]: Dados
                  - group [ref=e505]:
                    - generic [ref=e508]: Código
                    - textbox "Código" [disabled] [ref=e510]:
                      - /placeholder: Digite o código
                      - text: "807021"
                  - group [ref=e512]:
                    - generic [ref=e514]:
                      - generic [ref=e515]: Nome
                      - generic [ref=e516]: "*"
                    - textbox "Nome *" [active] [ref=e518]:
                      - /placeholder: Nome do curso
                      - text: Curso Recertificação TC1 w0-1779882137235
                    - paragraph [ref=e521]: 41 / 250
                  - group [ref=e523]:
                    - generic [ref=e525]:
                      - generic [ref=e526]: Tipo de experiência
                      - generic [ref=e527]: "*"
                      - img [ref=e529]
                    - generic [ref=e531]:
                      - log [ref=e533]
                      - generic [ref=e534]:
                        - generic [ref=e535]:
                          - generic [ref=e536]: Suite Everton CSV
                          - combobox [ref=e538]
                        - generic [ref=e539]:
                          - img [ref=e541]
                          - img [ref=e545]
                    - paragraph [ref=e550]: 17 / 30
                  - group [ref=e552]:
                    - generic [ref=e554]:
                      - generic [ref=e555]: Classificação
                      - img [ref=e557]
                    - generic [ref=e559]:
                      - log [ref=e561]
                      - generic [ref=e562]:
                        - generic [ref=e563]:
                          - generic [ref=e564]: Digite ou selecione a classificação
                          - combobox [ref=e566]
                        - img [ref=e570]
                  - group [ref=e573]:
                    - generic [ref=e575]:
                      - generic [ref=e576]: Situação
                      - generic [ref=e577]: "*"
                    - generic [ref=e579]:
                      - combobox "Situação *" [ref=e580]:
                        - option "Em desenvolvimento" [selected]
                        - option "Liberado"
                        - option "Suspenso"
                      - generic:
                        - img
                  - group [ref=e583]:
                    - checkbox "Restringir período de acesso" [ref=e585]
                    - generic [ref=e589]: Restringir período de acesso
                  - group [ref=e591]:
                    - generic [ref=e593]:
                      - generic [ref=e594]: Quem pode ver (visualização)
                      - generic [ref=e595]: "*"
                      - img [ref=e597]
                    - generic [ref=e600]:
                      - combobox "Quem pode ver (visualização) *" [ref=e601]:
                        - option "Inscritos"
                        - option "Colaborador"
                        - option "Usuários" [selected]
                        - option "Público"
                      - generic:
                        - img
                  - group [ref=e603]:
                    - generic [ref=e605]:
                      - generic [ref=e606]: Carga horária
                      - img [ref=e608]
                    - textbox "Carga horária" [ref=e611]:
                      - /placeholder: HH:MM:SS
                  - group [ref=e614]:
                    - generic [ref=e616]:
                      - generic [ref=e617]: Descrição
                      - generic [ref=e618]: "*"
                    - application "Editor de Rich Text, description" [ref=e619]:
                      - group "Barra de Ferramentas do Editor":
                        - toolbar [ref=e620]:
                          - button "Negrito" [ref=e621]
                          - button "Itálico" [ref=e623]
                          - button "Sublinhado" [ref=e625]
                          - separator [ref=e627]
                          - button "Lista numerada" [ref=e628]
                          - button "Lista sem números" [ref=e630]
                          - separator [ref=e632]
                          - button "Tamanho" [ref=e633]:
                            - generic [ref=e634]: Tamanho
                          - button "Fonte" [ref=e637]:
                            - generic [ref=e638]: Fonte
                          - button "Alinhar Esquerda" [ref=e641]
                          - button "Centralizado" [ref=e643]
                          - button "Alinhar Direita" [ref=e645]
                          - button "Justificar" [ref=e647]
                          - button "Cor do Texto" [ref=e649]
                          - separator [ref=e652]
                          - button "Tabela" [ref=e653]
                          - button "Código-Fonte" [ref=e655]:
                            - generic [ref=e657]: Código-Fonte
                          - separator [ref=e658]
                          - button "Imagem" [ref=e659]
                        - toolbar "Inserir" [ref=e661]:
                          - button "Tabela" [ref=e662]
                        - toolbar "Links" [ref=e664]:
                          - button "Inserir/Editar Link" [ref=e665]
                          - button "Remover Link" [disabled] [ref=e667]
                      - iframe [ref=e669]:
                        - paragraph [ref=f29e2]: Seed automatizado — Curso Recertificação TC1 w0-1779882137235 (createCurso v1.3).
                  - group [ref=e671]:
                    - generic [ref=e674]: Categorias
                    - generic [ref=e675]:
                      - log [ref=e677]
                      - generic [ref=e678]:
                        - generic [ref=e679]:
                          - generic [ref=e680]: Escreva os nomes das categorias separadas por vírgula
                          - combobox [ref=e682]
                        - img [ref=e686]
                  - group [ref=e689]:
                    - generic [ref=e691]:
                      - generic [ref=e692]: Enviar informação ao concluir a primeira atividade
                      - img [ref=e694]
                    - generic [ref=e697]:
                      - combobox "Enviar informação ao concluir a primeira atividade" [ref=e698]:
                        - option "Sim"
                        - option "Não" [selected]
                      - generic:
                        - img
                  - generic [ref=e700]:
                    - generic [ref=e702]:
                      - generic [ref=e703]: Competências relacionadas
                      - img [ref=e705]
                    - paragraph [ref=e708] [cursor=pointer]: Clique para selecionar as competências
                - separator [ref=e710]
              - generic [ref=e713]:
                - heading "Chat" [level=2] [ref=e715]:
                  - generic [ref=e717]: Chat
                - group [ref=e719]:
                  - checkbox "Habilitar chat no conteúdo" [ref=e721]
                  - generic [ref=e725]: Habilitar chat no conteúdo
              - generic [ref=e726]:
                - button "Salvar" [ref=e727] [cursor=pointer]
                - button "Cancelar" [ref=e728] [cursor=pointer]
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
  - region "Widget de chat" [ref=e729]:
    - iframe [ref=e730]:
      - button "Abrir chat ao vivo" [ref=f19e5]:
        - img [ref=f19e8]
        - img [ref=f19e15]
```

# Test source

```ts
  73  | 
  74  |   /**
  75  |    * Navega pra tab "Acesso" do form de edição facelift. No facelift,
  76  |    * o checkbox "Habilitar reinscrição" vive nessa tab (validado live
  77  |    * 2026-05-27 — seção "Inscrição" → "Permitir registro de inscrição por").
  78  |    * No HAML legado não há tabs; helper é no-op.
  79  |    *
  80  |    * Aguarda o tabpanel ativar (URL atualiza pra `?tab=access` e role
  81  |    * tabpanel "Acesso" fica selected).
  82  |    */
  83  |   async goToAcessoTab(): Promise<void> {
  84  |     const acessoTab = this.page.getByRole('tab', { name: /^Acesso$/i }).first();
  85  |     if (await acessoTab.isVisible({ timeout: 2_000 }).catch(() => false)) {
  86  |       await acessoTab.click();
  87  |       await this.page
  88  |         .waitForURL(/tab=access/, { timeout: 5_000 })
  89  |         .catch(() => undefined);
  90  |       // Aguarda tabpanel renderizar (checkbox "Habilitar reinscrição" tem
  91  |       // que estar no DOM antes do próximo step).
  92  |       await this.page
  93  |         .getByRole('tabpanel', { name: /^Acesso$/i })
  94  |         .waitFor({ state: 'visible', timeout: 5_000 })
  95  |         .catch(() => undefined);
  96  |     }
  97  |   }
  98  | 
  99  |   /**
  100 |    * Abre a edição de um conteúdo a partir da listagem clicando no ação
  101 |    * "Editar" do registro com o nome dado. Caminho usado pelos TCs que
  102 |    * descrevem o fluxo "Listagem → Editar" textualmente (TC1, TC4).
  103 |    *
  104 |    * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
  105 |    * "Editar" direto na linha; usa kebab `img "Options"` que abre dropdown
  106 |    * com a ação. Adicionar data-test-id estável no app via PR.
  107 |    */
  108 |   async openEditByName(name: string): Promise<void> {
  109 |     await this.goToContentList();
  110 |     const row = this.page.getByRole('row', { name: new RegExp(name, 'i') }).first();
  111 |     await row.waitFor({ state: 'visible' });
  112 |     await this.clickEditarFromRow(row);
  113 |   }
  114 | 
  115 |   /**
  116 |    * Abre a edição da PRIMEIRA linha de curso visível na listagem.
  117 |    * Usado por TCs cuja pré-condição é só "existe ≥1 curso pré-existente"
  118 |    * (TC1) sem fixar nome específico.
  119 |    *
  120 |    * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
  121 |    * "Editar" direto na linha; usa kebab `img "Options"` que abre
  122 |    * dropdown com a ação "Editar". Adicionar data-test-id estável no app
  123 |    * via PR (`event-row-edit-link` sugerido).
  124 |    */
  125 |   async openEditFromFirstRow(): Promise<void> {
  126 |     await this.goToContentList();
  127 |     // Primeira linha de dados (exclui header em <thead>).
  128 |     const firstRow = this.page.locator('tbody tr').first();
  129 |     await firstRow.waitFor({ state: 'visible', timeout: 10_000 });
  130 |     await this.clickEditarFromRow(firstRow);
  131 |   }
  132 | 
  133 |   /**
  134 |    * Clica em "Editar" dentro de uma linha da listagem. Cobre os 2 padrões
  135 |    * de UI observados no Twygo:
  136 |    *   1. Tela legada (HAML): kebab `img "Options"` → dropdown → "Editar".
  137 |    *   2. Tela facelift: `<a>Editar</a>` direto na célula de ações.
  138 |    *
  139 |    * REVISAR: seletor `img[alt="Options"]` foi descoberto via heal (error-context
  140 |    * de TC1 mostrou `img "Options" [cursor=pointer]` como única affordance de ação).
  141 |    * Substituir por `data-test-id` estável quando dev adicionar (PR pendente).
  142 |    */
  143 |   private async clickEditarFromRow(row: Locator): Promise<void> {
  144 |     // Caminho 1: link "Editar" direto na row (facelift antigo — pode
  145 |     // não existir mais).
  146 |     const directLink = row.getByRole('link', { name: /Editar/i }).first();
  147 |     if (await directLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
  148 |       await directLink.click();
  149 |       await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  150 |       return;
  151 |     }
  152 |     // Caminho 2: more_vert (UI nova facelift, validada live 2026-05-26).
  153 |     // O menu abre 11 opções; o item de edição agora se chama "Gerenciar"
  154 |     // (não "Editar"). Skill provisionar-seed v1.3 documenta.
  155 |     const moreVertTrigger = row
  156 |       .getByRole('button', { name: 'more_vert' })
  157 |       .first();
  158 |     if (await moreVertTrigger.isVisible({ timeout: 2_000 }).catch(() => false)) {
  159 |       await moreVertTrigger.click();
  160 |       const gerenciarItem = this.page
  161 |         .getByRole('menuitem', { name: /^Gerenciar$/i })
  162 |         .or(this.page.getByRole('menuitem', { name: /^Editar$/i }))
  163 |         .first();
  164 |       await gerenciarItem.waitFor({ state: 'visible', timeout: 5_000 });
  165 |       await gerenciarItem.click();
  166 |       await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  167 |       return;
  168 |     }
  169 |     // Caminho 3: kebab Options legado HAML (`img[alt="Options"]`).
  170 |     const optionsTrigger = row
  171 |       .locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]')
  172 |       .first();
> 173 |     await optionsTrigger.waitFor({ state: 'visible', timeout: 5_000 });
      |                          ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  174 |     await optionsTrigger.click();
  175 |     const editarItem = this.page
  176 |       .getByRole('menuitem', { name: /^Editar$/i })
  177 |       .or(this.page.getByRole('link', { name: /^Editar$/i }))
  178 |       .first();
  179 |     await editarItem.waitFor({ state: 'visible', timeout: 5_000 });
  180 |     await editarItem.click();
  181 |     await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  182 |   }
  183 | 
  184 |   // ─── Switch "Habilitar reinscrição" ─────────────────────────────────
  185 | 
  186 |   /**
  187 |    * Locator do `<label>` do switch Chakra "Habilitar reinscrição".
  188 |    * Preferimos o role `checkbox` (semântico, estável entre HAML e React),
  189 |    * mas o click subsequente é via `setSwitch` no label — ver skill
  190 |    * `interagir-switch-chakra-twygo`.
  191 |    *
  192 |    * REVISAR: aguardando `data-test-id` estável (`event-has-recertification-switch`
  193 |    * sugerido). Quando o atributo for adicionado no app, trocar este getter.
  194 |    */
  195 |   getHabilitarReinscricaoSwitch(): Locator {
  196 |     // Fallback semântico — funciona em HAML e React enquanto o data-test-id
  197 |     // não existe. Atalho para o role+name canônico definido pela prosa do MD.
  198 |     return this.page.getByRole('checkbox', { name: /Habilitar reinscrição/i });
  199 |   }
  200 | 
  201 |   /**
  202 |    * Locator do `<label>` (não do `<input>`) — necessário para click no
  203 |    * switch Chakra (skill `interagir-switch-chakra-twygo`). Caminho: subir
  204 |    * pro ancestor `<label>` que envolve o input oculto.
  205 |    */
  206 |   getHabilitarReinscricaoSwitchLabel(): Locator {
  207 |     return this.page
  208 |       .locator('label.chakra-switch')
  209 |       .filter({ has: this.getHabilitarReinscricaoSwitch() });
  210 |   }
  211 | 
  212 |   /**
  213 |    * Locator do ícone de ajuda do switch — geralmente um `<button>` ou
  214 |    * `<span>` com role `button` adjacente ao label, com aria-label ou
  215 |    * tooltip key. Capturamos via filtro pelo label irmão.
  216 |    *
  217 |    * REVISAR: sem `data-test-id` no app hoje; fallback usa proximidade do
  218 |    * label. Quando o data-test-id `event-has-recertification-help-icon`
  219 |    * for adicionado, trocar este getter.
  220 |    */
  221 |   getHabilitarReinscricaoTooltipTrigger(): Locator {
  222 |     // Tooltip-trigger é o ícone/botão sibling do label do switch.
  223 |     return this.page
  224 |       .locator(':is(button, span, [role="button"])')
  225 |       .filter({ has: this.page.locator('[aria-describedby], [data-tooltip], svg') })
  226 |       .filter({
  227 |         has: this.page.locator(
  228 |           'xpath=ancestor::*[self::div or self::label][.//text()[contains(., "Habilitar reinscrição")]]',
  229 |         ),
  230 |       })
  231 |       .first();
  232 |   }
  233 | 
  234 |   /**
  235 |    * Texto visível do tooltip após hover no ícone de ajuda. O texto vem
  236 |    * da chave I18n `activerecord.attributes.event.has_recertification_tooltip`.
  237 |    *
  238 |    * REVISAR-FIGMA: texto exato do tooltip ainda não confirmado — capturamos
  239 |    * o role `tooltip` que aparece após hover.
  240 |    */
  241 |   getHabilitarReinscricaoTooltip(): Locator {
  242 |     return this.page.getByRole('tooltip').first();
  243 |   }
  244 | 
  245 |   /**
  246 |    * Estado atual do checkbox "Habilitar reinscrição". No facelift v1.3+,
  247 |    * é um checkbox HTML padrão (não Chakra switch) — `isChecked()` direto.
  248 |    * Navega proativamente pra tab "Acesso" no facelift antes de checar.
  249 |    */
  250 |   async isHabilitarReinscricaoOn(): Promise<boolean> {
  251 |     if (/\/contents\/\d+\/edit/.test(this.page.url())) {
  252 |       await this.goToAcessoTab();
  253 |     }
  254 |     const checkbox = this.getHabilitarReinscricaoSwitch();
  255 |     if ((await checkbox.count()) === 0) return false;
  256 |     return checkbox.isChecked();
  257 |   }
  258 | 
  259 |   /**
  260 |    * Idempotente: só toggla se o estado atual diverge do desejado.
  261 |    * Validado live 2026-05-27 — "Habilitar reinscrição" é checkbox HTML
  262 |    * padrão na tab "Acesso", seção "Permitir registro de inscrição por"
  263 |    * (não Chakra switch como assumido em v1.0/v1.1 da skill).
  264 |    */
  265 |   async setHabilitarReinscricao(enabled: boolean): Promise<void> {
  266 |     // No facelift React, checkbox vive na tab "Acesso" — navega
  267 |     // proativamente. Em HAML legado (`/e/{id}/edit`) helper é no-op.
  268 |     if (/\/contents\/\d+\/edit/.test(this.page.url())) {
  269 |       await this.goToAcessoTab();
  270 |     }
  271 |     const checkbox = this.getHabilitarReinscricaoSwitch();
  272 |     await checkbox.waitFor({ state: 'visible', timeout: 10_000 });
  273 |     if (enabled) {
```