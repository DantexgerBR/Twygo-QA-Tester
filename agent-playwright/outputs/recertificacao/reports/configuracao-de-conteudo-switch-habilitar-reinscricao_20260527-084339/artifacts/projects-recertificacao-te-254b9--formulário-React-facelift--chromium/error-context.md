# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc5-paridade-haml-react.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc5-paridade-haml-react.spec.ts:45:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('checkbox', { name: /Habilitar reinscrição/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('checkbox', { name: /Habilitar reinscrição/i })

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
          - heading "Curso Recertificação TC5 w3-1779882137306" [level=2] [ref=e480]
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
                      - text: "807022"
                  - group [ref=e512]:
                    - generic [ref=e514]:
                      - generic [ref=e515]: Nome
                      - generic [ref=e516]: "*"
                    - textbox "Nome *" [active] [ref=e518]:
                      - /placeholder: Nome do curso
                      - text: Curso Recertificação TC5 w3-1779882137306
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
                        - paragraph [ref=f19e2]: Seed automatizado — Curso Recertificação TC5 w3-1779882137306 (createCurso v1.3).
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
  - region "Widget de chat" [ref=e730]:
    - iframe [ref=e731]:
      - button "Abrir chat ao vivo" [ref=f20e5]:
        - img [ref=f20e8]
        - img [ref=f20e15]
```

# Test source

```ts
  1  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2  | import * as allure from 'allure-js-commons';
  3  | import { resolve } from 'node:path';
  4  | import { ContentEditPage } from '../../../pages/ContentEditPage.js';
  5  | import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';
  6  | 
  7  | const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
  8  | 
  9  | test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  10 |   // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  11 |   // beforeAll cria curso com defaults (has_recertification=false por
  12 |   // omissão). O TC toggla o switch entre as 2 telas (HAML legado `/e/{id}/edit`
  13 |   // e React facelift `/contents/{id}/edit`) e valida paridade do
  14 |   // atributo `events.has_recertification`. afterAll deleta o curso.
  15 |   let cursoId: number;
  16 |   let cursoName: string;
  17 | 
  18 |   test.beforeAll(async ({ browser }, testInfo) => {
  19 |     cursoName = `Curso Recertificação TC5 w${testInfo.workerIndex}-${Date.now()}`;
  20 |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  21 |     const page = await context.newPage();
  22 |     try {
  23 |       const seed = new SeedAdminPage(page);
  24 |       cursoId = await seed.createCurso({
  25 |         name: cursoName,
  26 |         hasRecertification: false,
  27 |       });
  28 |     } finally {
  29 |       await context.close();
  30 |     }
  31 |   });
  32 | 
  33 |   test.afterAll(async ({ browser }) => {
  34 |     if (!cursoId) return;
  35 |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  36 |     const page = await context.newPage();
  37 |     try {
  38 |       const seed = new SeedAdminPage(page);
  39 |       await seed.deleteCursoByIdSafe(cursoId);
  40 |     } finally {
  41 |       await context.close();
  42 |     }
  43 |   });
  44 | 
  45 |   test('TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)', async ({
  46 |     page,
  47 |   }) => {
  48 |     await allure.epic('Twygo - Recertificação');
  49 |     await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
  50 |     await allure.story(
  51 |       'Paridade do switch entre formulário HAML e formulário React (facelift)',
  52 |     );
  53 |     await allure.severity('normal');
  54 | 
  55 |     const contentEdit = new ContentEditPage(page);
  56 | 
  57 |     await allure.step(
  58 |       '1. Editar o curso na tela HAML, ativar o switch e salvar → has_recertification = true',
  59 |       async () => {
  60 |         await contentEdit.openEditHamlById(cursoId);
> 61 |         await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  62 |         await contentEdit.setHabilitarReinscricao(true);
  63 |         await contentEdit.save();
  64 |         await contentEdit.expectSaveSuccess();
  65 |       },
  66 |     );
  67 | 
  68 |     await allure.step(
  69 |       '2. Acessar o MESMO curso pela tela React → switch carrega ligado (tab "Acesso")',
  70 |       async () => {
  71 |         await contentEdit.openEditReactById(cursoId);
  72 |         // Switch vive na tab "Acesso" do facelift (não na "Identificação").
  73 |         await contentEdit.goToAcessoTab();
  74 |         await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
  75 |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
  76 |       },
  77 |     );
  78 | 
  79 |     await allure.step('3. Desativar o switch na tela React e salvar', async () => {
  80 |       await contentEdit.setHabilitarReinscricao(false);
  81 |       await contentEdit.save();
  82 |       await contentEdit.expectSaveSuccess();
  83 |     });
  84 | 
  85 |     await allure.step(
  86 |       '4. Recarregar a edição na tela HAML → switch aparece desligado (mesma coluna gravada)',
  87 |       async () => {
  88 |         await contentEdit.openEditHamlById(cursoId);
  89 |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
  90 |       },
  91 |     );
  92 |   });
  93 | });
  94 | 
```