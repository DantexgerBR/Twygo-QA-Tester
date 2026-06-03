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
      - generic [ref=e335]:
        - link "7091159 - Agents QA" [ref=e336] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e337]: Agents QA
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
            - list [ref=e362]:
              - listitem [ref=e363]:
                - link "format_list_bulleted_add Conteúdos" [ref=e364]:
                  - /url: /o/37048/events?tab=events
                  - generic [ref=e365]:
                    - generic [ref=e367]: format_list_bulleted_add
                    - generic [ref=e368]: Conteúdos
              - listitem [ref=e369]:
                - link "send Compartilhamentos" [ref=e370]:
                  - /url: /o/37048/shared_events
                  - generic [ref=e371]:
                    - generic [ref=e373]: send
                    - generic [ref=e374]: Compartilhamentos
              - listitem [ref=e375]:
                - link "description Registros BETA" [ref=e376]:
                  - /url: /o/37048/records
                  - generic [ref=e377]:
                    - generic [ref=e379]: description
                    - generic [ref=e380]: Registros
                    - generic [ref=e381]: BETA
              - listitem [ref=e382]:
                - link "workspace_premium Certificados" [ref=e383]:
                  - /url: /o/37048/certificate_models
                  - generic [ref=e384]:
                    - generic [ref=e386]: workspace_premium
                    - generic [ref=e387]: Certificados
              - listitem [ref=e388]:
                - link "browse Modelos de conteúdo" [ref=e389]:
                  - /url: /o/37048/content_models
                  - generic [ref=e390]:
                    - generic [ref=e392]: browse
                    - generic [ref=e393]: Modelos de conteúdo
              - listitem [ref=e394]:
                - link "folder_open Base de conhecimento" [ref=e395]:
                  - /url: /o/37048/knowledge_repositories
                  - generic [ref=e396]:
                    - generic [ref=e398]: folder_open
                    - generic [ref=e399]: Base de conhecimento
          - listitem [ref=e400] [cursor=pointer]:
            - link "group Usuários" [ref=e401]:
              - /url: /o/37048/users
              - generic [ref=e402]:
                - generic [ref=e404]: group
                - generic [ref=e405]: Usuários
          - listitem [ref=e406] [cursor=pointer]:
            - link "work Empresas" [ref=e407]:
              - /url: /o/37048/companies
              - generic [ref=e408]:
                - generic [ref=e410]: work
                - generic [ref=e411]: Empresas
          - listitem [ref=e412] [cursor=pointer]:
            - link "live_help Questionários" [ref=e413]:
              - /url: /o/37048/question_lists
              - generic [ref=e414]:
                - generic [ref=e416]: live_help
                - generic [ref=e417]: Questionários
          - listitem [ref=e418] [cursor=pointer]:
            - link "groups Comunidades" [ref=e419]:
              - /url: /o/37048/feed
              - generic [ref=e420]:
                - generic [ref=e422]: groups
                - generic [ref=e423]: Comunidades
          - listitem [ref=e424] [cursor=pointer]:
            - generic [ref=e426]:
              - generic [ref=e429]: psychology
              - generic [ref=e430]:
                - text: Skills
                - generic [ref=e431]: BETA
              - generic [ref=e433]: G
          - listitem [ref=e434] [cursor=pointer]:
            - generic [ref=e436]:
              - generic [ref=e439]: person_check
              - generic [ref=e440]:
                - text: Continuidade e sucessão
                - generic [ref=e441]: BETA
              - generic [ref=e443]: G
          - listitem [ref=e444] [cursor=pointer]:
            - generic [ref=e446]:
              - generic [ref=e449]: account_tree
              - generic [ref=e450]: Processos
              - generic [ref=e452]: G
          - listitem [ref=e453] [cursor=pointer]:
            - generic [ref=e455]:
              - generic [ref=e458]: monitoring
              - generic [ref=e459]:
                - text: Planos e Metas
                - generic [ref=e460]: BETA
              - generic [ref=e462]: G
          - listitem [ref=e463] [cursor=pointer]:
            - generic [ref=e465]:
              - generic [ref=e468]: groups
              - generic [ref=e469]:
                - text: Gestão de Time
                - generic [ref=e470]: BETA
              - generic [ref=e472]: G
      - generic [ref=e474]: Recertificação
      - list [ref=e475]:
        - listitem [ref=e476] [cursor=pointer]:
          - generic [ref=e478]:
            - generic [ref=e480]: f
            - generic [ref=e481]: Configurações
            - generic [ref=e483]: G
          - text: e    s 
    - generic [ref=e485]:
      - generic [ref=e488]: Conteúdos > Editar curso
      - generic [ref=e495]:
        - generic [ref=e496]:
          - button "Voltar" [ref=e498] [cursor=pointer]:
            - img [ref=e500]
            - text: Voltar
          - heading "Curso Recertificação TC4 w2-1780314110919" [level=2] [ref=e504]
        - generic [ref=e507]:
          - tablist [ref=e508]:
            - tab "Identificação" [selected] [ref=e509] [cursor=pointer]
            - tab "Acesso" [ref=e510] [cursor=pointer]
            - tab "Banner" [ref=e511] [cursor=pointer]
            - tab "Aprovação" [ref=e512] [cursor=pointer]
            - tab "Cobrança" [ref=e513] [cursor=pointer]
            - tab "Localização" [ref=e514] [cursor=pointer]
            - tab "Dashboard" [ref=e515] [cursor=pointer]
            - tab "Compartilhar" [ref=e516] [cursor=pointer]
          - tabpanel "Identificação" [ref=e518]:
            - generic [ref=e520]:
              - generic [ref=e521]:
                - generic [ref=e523]:
                  - heading "Dados" [level=2] [ref=e525]:
                    - generic [ref=e527]: Dados
                  - group [ref=e529]:
                    - generic [ref=e532]: Código
                    - textbox "Código" [disabled] [ref=e534]:
                      - /placeholder: Digite o código
                      - text: "807448"
                  - group [ref=e536]:
                    - generic [ref=e538]:
                      - generic [ref=e539]: Nome
                      - generic [ref=e540]: "*"
                    - textbox "Nome *" [active] [ref=e542]:
                      - /placeholder: Nome do curso
                      - text: Curso Recertificação TC4 w2-1780314110919
                    - paragraph [ref=e545]: 41 / 250
                  - group [ref=e547]:
                    - generic [ref=e549]:
                      - generic [ref=e550]: Tipo de experiência
                      - generic [ref=e551]: "*"
                      - img [ref=e553]
                    - generic [ref=e555]:
                      - log [ref=e557]
                      - generic [ref=e558]:
                        - generic [ref=e559]:
                          - generic [ref=e560]: Suite Everton CSV
                          - combobox [ref=e562]
                        - generic [ref=e563]:
                          - img [ref=e565]
                          - img [ref=e569]
                    - paragraph [ref=e574]: 17 / 30
                  - group [ref=e576]:
                    - generic [ref=e578]:
                      - generic [ref=e579]: Classificação
                      - img [ref=e581]
                    - generic [ref=e583]:
                      - log [ref=e585]
                      - generic [ref=e586]:
                        - generic [ref=e587]:
                          - generic [ref=e588]: Digite ou selecione a classificação
                          - combobox [ref=e590]
                        - img [ref=e594]
                  - group [ref=e597]:
                    - generic [ref=e599]:
                      - generic [ref=e600]: Situação
                      - generic [ref=e601]: "*"
                    - generic [ref=e603]:
                      - combobox "Situação *" [ref=e604]:
                        - option "Em desenvolvimento" [selected]
                        - option "Liberado"
                        - option "Suspenso"
                      - generic:
                        - img
                  - group [ref=e607]:
                    - checkbox "Restringir período de acesso" [ref=e609]
                    - generic [ref=e613]: Restringir período de acesso
                  - group [ref=e615]:
                    - generic [ref=e617]:
                      - generic [ref=e618]: Quem pode ver (visualização)
                      - generic [ref=e619]: "*"
                      - img [ref=e621]
                    - generic [ref=e624]:
                      - combobox "Quem pode ver (visualização) *" [ref=e625]:
                        - option "Inscritos"
                        - option "Colaborador"
                        - option "Usuários" [selected]
                        - option "Público"
                      - generic:
                        - img
                  - group [ref=e627]:
                    - generic [ref=e629]:
                      - generic [ref=e630]: Carga horária
                      - img [ref=e632]
                    - textbox "Carga horária" [ref=e635]:
                      - /placeholder: HH:MM:SS
                  - group [ref=e638]:
                    - generic [ref=e640]:
                      - generic [ref=e641]: Descrição
                      - generic [ref=e642]: "*"
                    - application "Editor de Rich Text, description" [ref=e643]:
                      - group "Barra de Ferramentas do Editor":
                        - toolbar [ref=e644]:
                          - button "Negrito" [ref=e645]
                          - button "Itálico" [ref=e647]
                          - button "Sublinhado" [ref=e649]
                          - separator [ref=e651]
                          - button "Lista numerada" [ref=e652]
                          - button "Lista sem números" [ref=e654]
                          - separator [ref=e656]
                          - button "Tamanho" [ref=e657]:
                            - generic [ref=e658]: Tamanho
                          - button "Fonte" [ref=e661]:
                            - generic [ref=e662]: Fonte
                          - button "Alinhar Esquerda" [ref=e665]
                          - button "Centralizado" [ref=e667]
                          - button "Alinhar Direita" [ref=e669]
                          - button "Justificar" [ref=e671]
                          - button "Cor do Texto" [ref=e673]
                          - separator [ref=e676]
                          - button "Tabela" [ref=e677]
                          - button "Código-Fonte" [ref=e679]:
                            - generic [ref=e681]: Código-Fonte
                          - separator [ref=e682]
                          - button "Imagem" [ref=e683]
                        - toolbar "Inserir" [ref=e685]:
                          - button "Tabela" [ref=e686]
                        - toolbar "Links" [ref=e688]:
                          - button "Inserir/Editar Link" [ref=e689]
                          - button "Remover Link" [disabled] [ref=e691]
                      - iframe [ref=e693]:
                        - paragraph [ref=f27e2]: Seed automatizado — Curso Recertificação TC4 w2-1780314110919 (createCurso v1.3).
                  - group [ref=e695]:
                    - generic [ref=e698]: Categorias
                    - generic [ref=e699]:
                      - log [ref=e701]
                      - generic [ref=e702]:
                        - generic [ref=e703]:
                          - generic [ref=e704]: Escreva os nomes das categorias separadas por vírgula
                          - combobox [ref=e706]
                        - img [ref=e710]
                  - group [ref=e713]:
                    - generic [ref=e715]:
                      - generic [ref=e716]: Enviar informação ao concluir a primeira atividade
                      - img [ref=e718]
                    - generic [ref=e721]:
                      - combobox "Enviar informação ao concluir a primeira atividade" [ref=e722]:
                        - option "Sim"
                        - option "Não" [selected]
                      - generic:
                        - img
                  - generic [ref=e724]:
                    - generic [ref=e726]:
                      - generic [ref=e727]: Competências relacionadas
                      - img [ref=e729]
                    - paragraph [ref=e732] [cursor=pointer]: Clique para selecionar as competências
                - separator [ref=e734]
              - generic [ref=e737]:
                - heading "Chat" [level=2] [ref=e739]:
                  - generic [ref=e741]: Chat
                - group [ref=e743]:
                  - checkbox "Habilitar chat no conteúdo" [ref=e745]
                  - generic [ref=e749]: Habilitar chat no conteúdo
              - generic [ref=e750]:
                - button "Salvar" [ref=e751] [cursor=pointer]
                - button "Cancelar" [ref=e752] [cursor=pointer]
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
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - region "Widget de chat" [ref=e753]:
    - iframe [ref=e754]:
      - button "Abrir chat ao vivo" [ref=f20e5]:
        - img [ref=f20e8]
        - img [ref=f20e15]
```

# Test source

```ts
  271 |   /**
  272 |    * Locator do checkbox HTML "Habilitar reinscrição" — no facelift v1.3+
  273 |    * é `<input id="has_recertification">` envolvido em `<label class="chakra-checkbox">`.
  274 |    * O input em si é screen-reader-only (1×13px com clip CSS); o label
  275 |    * visível tem text "Habilitar reinscrição".
  276 |    *
  277 |    * Para `.check()/.uncheck()/.isChecked()` retornamos o input (Playwright
  278 |    * resolve actionability via label automaticamente). Para `toBeVisible`
  279 |    * use [[getHabilitarReinscricaoVisible]] que pega o label.
  280 |    *
  281 |    * REVISAR: aguardando `data-test-id` estável (`event-has-recertification-checkbox`
  282 |    * sugerido). Validado live 2026-05-27 com input#has_recertification.
  283 |    */
  284 |   getHabilitarReinscricaoSwitch(): Locator {
  285 |     return this.page.locator('#has_recertification');
  286 |   }
  287 | 
  288 |   /**
  289 |    * Locator do label visível "Habilitar reinscrição" — use para
  290 |    * `toBeVisible` (o input em si é screen-reader-only e falha visibility).
  291 |    */
  292 |   getHabilitarReinscricaoVisible(): Locator {
  293 |     return this.page
  294 |       .locator('label.chakra-checkbox')
  295 |       .filter({ has: this.page.locator('#has_recertification') })
  296 |       .first();
  297 |   }
  298 | 
  299 |   /**
  300 |    * Locator do `<label>` (não do `<input>`) — necessário para click no
  301 |    * switch Chakra (skill `interagir-switch-chakra-twygo`). Caminho: subir
  302 |    * pro ancestor `<label>` que envolve o input oculto.
  303 |    */
  304 |   getHabilitarReinscricaoSwitchLabel(): Locator {
  305 |     return this.page
  306 |       .locator('label.chakra-switch')
  307 |       .filter({ has: this.getHabilitarReinscricaoSwitch() });
  308 |   }
  309 | 
  310 |   /**
  311 |    * Locator do ícone de ajuda do switch — geralmente um `<button>` ou
  312 |    * `<span>` com role `button` adjacente ao label, com aria-label ou
  313 |    * tooltip key. Capturamos via filtro pelo label irmão.
  314 |    *
  315 |    * REVISAR: sem `data-test-id` no app hoje; fallback usa proximidade do
  316 |    * label. Quando o data-test-id `event-has-recertification-help-icon`
  317 |    * for adicionado, trocar este getter.
  318 |    */
  319 |   getHabilitarReinscricaoTooltipTrigger(): Locator {
  320 |     // Tooltip-trigger é o ícone/botão sibling do label do switch.
  321 |     return this.page
  322 |       .locator(':is(button, span, [role="button"])')
  323 |       .filter({ has: this.page.locator('[aria-describedby], [data-tooltip], svg') })
  324 |       .filter({
  325 |         has: this.page.locator(
  326 |           'xpath=ancestor::*[self::div or self::label][.//text()[contains(., "Habilitar reinscrição")]]',
  327 |         ),
  328 |       })
  329 |       .first();
  330 |   }
  331 | 
  332 |   /**
  333 |    * Texto visível do tooltip após hover no ícone de ajuda. O texto vem
  334 |    * da chave I18n `activerecord.attributes.event.has_recertification_tooltip`.
  335 |    *
  336 |    * REVISAR-FIGMA: texto exato do tooltip ainda não confirmado — capturamos
  337 |    * o role `tooltip` que aparece após hover.
  338 |    */
  339 |   getHabilitarReinscricaoTooltip(): Locator {
  340 |     return this.page.getByRole('tooltip').first();
  341 |   }
  342 | 
  343 |   /**
  344 |    * Estado atual do checkbox "Habilitar reinscrição". No facelift v1.3+,
  345 |    * é um checkbox HTML padrão (não Chakra switch) — `isChecked()` direto.
  346 |    * Navega proativamente pra tab "Acesso" no facelift antes de checar.
  347 |    */
  348 |   async isHabilitarReinscricaoOn(): Promise<boolean> {
  349 |     if (/\/contents\/\d+\/edit/.test(this.page.url())) {
  350 |       await this.goToAcessoTab();
  351 |     }
  352 |     const checkbox = this.getHabilitarReinscricaoSwitch();
  353 |     if ((await checkbox.count()) === 0) return false;
  354 |     return checkbox.isChecked();
  355 |   }
  356 | 
  357 |   /**
  358 |    * Idempotente: só toggla se o estado atual diverge do desejado.
  359 |    * Validado live 2026-05-27 — "Habilitar reinscrição" é checkbox HTML
  360 |    * (input#has_recertification screen-reader-only com label.chakra-checkbox
  361 |    * visível). Tab Acesso, seção "Permitir registro de inscrição por".
  362 |    */
  363 |   async setHabilitarReinscricao(enabled: boolean): Promise<void> {
  364 |     // No facelift React, checkbox vive na tab "Acesso" — navega
  365 |     // proativamente. Em HAML legado (`/e/{id}/edit`) helper é no-op.
  366 |     if (/\/contents\/\d+\/edit/.test(this.page.url())) {
  367 |       await this.goToAcessoTab();
  368 |     }
  369 |     // Aguarda o LABEL visível antes de tocar no input (input é
  370 |     // screen-reader-only, waitFor('visible') no input timeoutaria).
> 371 |     await this.getHabilitarReinscricaoVisible().waitFor({
      |                                                 ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  372 |       state: 'visible',
  373 |       timeout: 10_000,
  374 |     });
  375 |     const checkbox = this.getHabilitarReinscricaoSwitch();
  376 |     if (enabled) {
  377 |       await checkbox.check();
  378 |     } else {
  379 |       await checkbox.uncheck();
  380 |     }
  381 |   }
  382 | 
  383 |   // ─── Submit / mensagens ─────────────────────────────────────────────
  384 | 
  385 |   getSaveButton(): Locator {
  386 |     // Tela HAML usa <input type="submit" value="Salvar">; React usa <button>Salvar</button>.
  387 |     // role=button cobre os dois.
  388 |     return this.page.getByRole('button', { name: /^Salvar$/ }).first();
  389 |   }
  390 | 
  391 |   async save(): Promise<void> {
  392 |     await this.getSaveButton().click();
  393 |   }
  394 | 
  395 |   /**
  396 |    * Aguarda confirmação de save bem-sucedido. Twygo usa toast Chakra +
  397 |    * redirect para a listagem (variando entre HAML/React). Asserta a
  398 |    * primeira condição que aparecer (toast OU URL de listagem).
  399 |    *
  400 |    * REVISAR-FIGMA: texto exato do toast de sucesso ainda não confirmado.
  401 |    */
  402 |   async expectSaveSuccess(): Promise<void> {
  403 |     // Toast Chakra de sucesso (status=success) — primeiro sinal pós-submit.
  404 |     const toast = this.page
  405 |       .locator('.chakra-toast, [role="status"]')
  406 |       .filter({ hasText: /salv|sucesso/i })
  407 |       .first();
  408 |     await expect
  409 |       .poll(async () => {
  410 |         const toastVisible = await toast.isVisible().catch(() => false);
  411 |         const url = this.page.url();
  412 |         return (
  413 |           toastVisible ||
  414 |           /\/o\/\d+\/events(\?|$)/.test(url) ||
  415 |           /\/(e\/\d+\/edit|contents\/\d+\/edit)/.test(url)
  416 |         );
  417 |       })
  418 |       .toBe(true);
  419 |   }
  420 | }
  421 | 
```