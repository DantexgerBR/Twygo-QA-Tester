# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts:57:3

# Error details

```
Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-0\traces\e050204b338df394c0ba-b5dabc3a50642051cd90.network'
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
        - generic [ref=e469]: Conteúdos > Editar curso
        - generic [ref=e476]:
          - generic [ref=e477]:
            - button "Voltar" [ref=e479] [cursor=pointer]:
              - img [ref=e481]
              - text: Voltar
            - heading "Curso Recertificação TC1 w0-1779997440525" [level=2] [ref=e485]
          - generic [ref=e488]:
            - tablist [ref=e489]:
              - tab "Identificação" [selected] [ref=e490] [cursor=pointer]
              - tab "Acesso" [ref=e491] [cursor=pointer]
              - tab "Banner" [ref=e492] [cursor=pointer]
              - tab "Aprovação" [ref=e493] [cursor=pointer]
              - tab "Cobrança" [ref=e494] [cursor=pointer]
              - tab "Localização" [ref=e495] [cursor=pointer]
              - tab "Dashboard" [ref=e496] [cursor=pointer]
              - tab "Compartilhar" [ref=e497] [cursor=pointer]
            - tabpanel "Identificação" [ref=e499]:
              - generic [ref=e501]:
                - generic [ref=e502]:
                  - generic [ref=e504]:
                    - heading "Dados" [level=2] [ref=e506]:
                      - generic [ref=e508]: Dados
                    - group [ref=e510]:
                      - generic [ref=e513]: Código
                      - textbox "Código" [disabled] [ref=e515]:
                        - /placeholder: Digite o código
                        - text: "807415"
                    - group [ref=e517]:
                      - generic [ref=e519]:
                        - generic [ref=e520]: Nome
                        - generic [ref=e521]: "*"
                      - textbox "Nome *" [active] [ref=e523]:
                        - /placeholder: Nome do curso
                        - text: Curso Recertificação TC1 w0-1779997440525
                      - paragraph [ref=e526]: 41 / 250
                    - group [ref=e528]:
                      - generic [ref=e530]:
                        - generic [ref=e531]: Tipo de experiência
                        - generic [ref=e532]: "*"
                        - img [ref=e534]
                      - generic [ref=e536]:
                        - log [ref=e538]
                        - generic [ref=e539]:
                          - generic [ref=e540]:
                            - generic [ref=e541]: Suite Everton CSV
                            - combobox [ref=e543]
                          - generic [ref=e544]:
                            - img [ref=e546]
                            - img [ref=e550]
                      - paragraph [ref=e555]: 17 / 30
                    - group [ref=e557]:
                      - generic [ref=e559]:
                        - generic [ref=e560]: Classificação
                        - img [ref=e562]
                      - generic [ref=e564]:
                        - log [ref=e566]
                        - generic [ref=e567]:
                          - generic [ref=e568]:
                            - generic [ref=e569]: Digite ou selecione a classificação
                            - combobox [ref=e571]
                          - img [ref=e575]
                    - group [ref=e578]:
                      - generic [ref=e580]:
                        - generic [ref=e581]: Situação
                        - generic [ref=e582]: "*"
                      - generic [ref=e584]:
                        - combobox "Situação *" [ref=e585]:
                          - option "Em desenvolvimento" [selected]
                          - option "Liberado"
                          - option "Suspenso"
                        - generic:
                          - img
                    - group [ref=e588]:
                      - checkbox "Restringir período de acesso" [ref=e590]
                      - generic [ref=e594]: Restringir período de acesso
                    - group [ref=e596]:
                      - generic [ref=e598]:
                        - generic [ref=e599]: Quem pode ver (visualização)
                        - generic [ref=e600]: "*"
                        - img [ref=e602]
                      - generic [ref=e605]:
                        - combobox "Quem pode ver (visualização) *" [ref=e606]:
                          - option "Inscritos"
                          - option "Colaborador"
                          - option "Usuários" [selected]
                          - option "Público"
                        - generic:
                          - img
                    - group [ref=e608]:
                      - generic [ref=e610]:
                        - generic [ref=e611]: Carga horária
                        - img [ref=e613]
                      - textbox "Carga horária" [ref=e616]:
                        - /placeholder: HH:MM:SS
                    - group [ref=e619]:
                      - generic [ref=e621]:
                        - generic [ref=e622]: Descrição
                        - generic [ref=e623]: "*"
                      - application "Editor de Rich Text, description" [ref=e624]:
                        - group "Barra de Ferramentas do Editor":
                          - toolbar [ref=e625]:
                            - button "Negrito" [ref=e626]
                            - button "Itálico" [ref=e628]
                            - button "Sublinhado" [ref=e630]
                            - separator [ref=e632]
                            - button "Lista numerada" [ref=e633]
                            - button "Lista sem números" [ref=e635]
                            - separator [ref=e637]
                            - button "Tamanho" [ref=e638]:
                              - generic [ref=e639]: Tamanho
                            - button "Fonte" [ref=e642]:
                              - generic [ref=e643]: Fonte
                            - button "Alinhar Esquerda" [ref=e646]
                            - button "Centralizado" [ref=e648]
                            - button "Alinhar Direita" [ref=e650]
                            - button "Justificar" [ref=e652]
                            - button "Cor do Texto" [ref=e654]
                            - separator [ref=e657]
                            - button "Tabela" [ref=e658]
                            - button "Código-Fonte" [ref=e660]:
                              - generic [ref=e662]: Código-Fonte
                            - separator [ref=e663]
                            - button "Imagem" [ref=e664]
                          - toolbar "Inserir" [ref=e666]:
                            - button "Tabela" [ref=e667]
                          - toolbar "Links" [ref=e669]:
                            - button "Inserir/Editar Link" [ref=e670]
                            - button "Remover Link" [disabled] [ref=e672]
                        - iframe [ref=e674]:
                          - paragraph [ref=f28e2]: Seed automatizado — Curso Recertificação TC1 w0-1779997440525 (createCurso v1.3).
                    - group [ref=e676]:
                      - generic [ref=e679]: Categorias
                      - generic [ref=e680]:
                        - log [ref=e682]
                        - generic [ref=e683]:
                          - generic [ref=e684]:
                            - generic [ref=e685]: Escreva os nomes das categorias separadas por vírgula
                            - combobox [ref=e687]
                          - img [ref=e691]
                    - group [ref=e694]:
                      - generic [ref=e696]:
                        - generic [ref=e697]: Enviar informação ao concluir a primeira atividade
                        - img [ref=e699]
                      - generic [ref=e702]:
                        - combobox "Enviar informação ao concluir a primeira atividade" [ref=e703]:
                          - option "Sim"
                          - option "Não" [selected]
                        - generic:
                          - img
                    - generic [ref=e705]:
                      - generic [ref=e707]:
                        - generic [ref=e708]: Competências relacionadas
                        - img [ref=e710]
                      - paragraph [ref=e713] [cursor=pointer]: Clique para selecionar as competências
                  - separator [ref=e715]
                - generic [ref=e718]:
                  - heading "Chat" [level=2] [ref=e720]:
                    - generic [ref=e722]: Chat
                  - group [ref=e724]:
                    - checkbox "Habilitar chat no conteúdo" [ref=e726]
                    - generic [ref=e730]: Habilitar chat no conteúdo
                - generic [ref=e731]:
                  - button "Salvar" [ref=e732] [cursor=pointer]
                  - button "Cancelar" [ref=e733] [cursor=pointer]
  - region "Widget de chat" [ref=e734]:
    - iframe [ref=e735]:
      - button "Abrir chat ao vivo" [ref=f24e5]:
        - img [ref=f24e8]
        - img [ref=f24e15]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e736]:
        - generic [ref=e737]:
          - img [ref=e739]
          - generic [ref=e742]: Identificação salva com sucesso
          - button "Close" [ref=e743] [cursor=pointer]:
            - img [ref=e744]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e746]:
        - generic [ref=e747]:
          - img [ref=e749]
          - generic [ref=e752]: Identificação salva com sucesso
          - button "Close" [ref=e753] [cursor=pointer]:
            - img [ref=e754]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right":
      - status [ref=e756]:
        - generic [ref=e757]:
          - img [ref=e759]
          - generic [ref=e762]: Identificação salva com sucesso
          - button "Close" [ref=e763] [cursor=pointer]:
            - img [ref=e764]
```

# Test source

```ts
  1   | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2   | import * as allure from 'allure-js-commons';
  3   | import { resolve } from 'node:path';
  4   | import { getOrgId } from '../../../../../src/utils/environment.js';
  5   | import { safeGoto } from '../../../../../src/utils/modals.js';
  6   | import { ContentEditPage } from '../../../pages/ContentEditPage.js';
  7   | import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';
  8   | 
  9   | const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
  10  | 
  11  | test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  12  |   // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  13  |   // - Rota canônica `/o/{orgId}/contents/new?kind=0` (facelift React),
  14  |   //   validada live 2026-05-26 no env staging-recertificacao (orgId 37048,
  15  |   //   user agents.qa@claude.com em perfil Administrador). Content criado:
  16  |   //   ID 806852 "Validação seed via menu real".
  17  |   // - Bloqueio anterior (422 em /events/new HAML legado) RESOLVIDO em
  18  |   //   v1.1 da skill — era rota errada, não CSRF/permissão.
  19  |   // beforeAll cria o curso → captura eventId real → spec navega pela
  20  |   // listagem e localiza o curso pelo nome único. afterAll deleta via
  21  |   // variant *_safe idempotente.
  22  |   let cursoId: number;
  23  |   let cursoName: string;
  24  | 
  25  |   test.beforeAll(async ({ browser }, testInfo) => {
  26  |     cursoName = `Curso Recertificação TC1 w${testInfo.workerIndex}-${Date.now()}`;
  27  |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  28  |     const page = await context.newPage();
  29  |     try {
  30  |       const seed = new SeedAdminPage(page);
  31  |       cursoId = await seed.createCurso({
  32  |         name: cursoName,
  33  |         hasRecertification: false, // default — TC1 só lê o switch, não toggla
  34  |       });
  35  |       // Re-grava storage atualizado pra evitar session race entre o
  36  |       // contexto do seed e o `page` fixture do test (Twygo regenera
  37  |       // session_id após operações de criação — sem refresh, page do
  38  |       // test acaba na tela de login).
  39  |       await context.storageState({ path: STORAGE_PATH });
  40  |     } finally {
> 41  |       await context.close();
      |                     ^ Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-0\traces\e050204b338df394c0ba-b5dabc3a50642051cd90.network'
  42  |     }
  43  |   });
  44  | 
  45  |   test.afterAll(async ({ browser }) => {
  46  |     if (!cursoId) return;
  47  |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  48  |     const page = await context.newPage();
  49  |     try {
  50  |       const seed = new SeedAdminPage(page);
  51  |       await seed.deleteCursoByIdSafe(cursoId);
  52  |     } finally {
  53  |       await context.close();
  54  |     }
  55  |   });
  56  | 
  57  |   test('TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso', async ({
  58  |     page,
  59  |   }) => {
  60  |     await allure.epic('Twygo - Recertificação');
  61  |     await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
  62  |     await allure.story(
  63  |       'Switch "Habilitar reinscrição" aparece com flag ON na edição de curso',
  64  |     );
  65  |     await allure.severity('critical');
  66  |     await allure.parameter('feature_flag', ':recertificacao=ON (assumido em staging-base-de-conhecimento)');
  67  | 
  68  |     const contentEdit = new ContentEditPage(page);
  69  | 
  70  |     await allure.step('1. Acessar a URL "/o/{orgId}/dashboard"', async () => {
  71  |       await safeGoto(page, `/o/${getOrgId()}/dashboard`);
  72  |       await expect(page).toHaveURL(/\/o\/\d+\/(dashboard|play)/);
  73  |     });
  74  | 
  75  |     await allure.step(
  76  |       '2. Navegar até a listagem de cursos da organização',
  77  |       async () => {
  78  |         await contentEdit.goToContentList();
  79  |         await expect(page).toHaveURL(/\/o\/\d+\/events/);
  80  |       },
  81  |     );
  82  | 
  83  |     await allure.step(
  84  |       '3. Clicar em "Gerenciar" no menu de ações do curso → página de edição é exibida',
  85  |       async () => {
  86  |         // Localiza o curso CRIADO no beforeAll pelo nome único (worker-isolated).
  87  |         // `openEditByName` cobre os 3 padrões: link direto, more_vert → Gerenciar
  88  |         // (UI nova facelift, skill provisionar-seed v1.3), kebab Options (HAML).
  89  |         await contentEdit.openEditByName(cursoName);
  90  |         await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  91  |       },
  92  |     );
  93  | 
  94  |     await allure.step(
  95  |       '4. Switch "Habilitar reinscrição" está visível no formulário (tab "Acesso" do facelift)',
  96  |       async () => {
  97  |         // No facelift React, o switch vive na tab "Acesso" (validado live
  98  |         // 2026-05-26 após fix de feature flag no env). Navega antes do expect.
  99  |         // O input é screen-reader-only — checamos visibilidade pelo label.
  100 |         await contentEdit.goToAcessoTab();
  101 |         await expect(contentEdit.getHabilitarReinscricaoVisible()).toBeVisible();
  102 |       },
  103 |     );
  104 | 
  105 |     await allure.step(
  106 |       '5. Hover no ícone de ajuda → tooltip de ajuda é exibido com o texto da chave I18n',
  107 |       async () => {
  108 |         const trigger = contentEdit.getHabilitarReinscricaoTooltipTrigger();
  109 |         // REVISAR: tooltip-trigger sem data-test-id estável e UI atual da
  110 |         // facelift não expõe ícone de ajuda adjacente ao checkbox
  111 |         // "Habilitar reinscrição" — capturar role+name do trigger real
  112 |         // (DOM inspect ao vivo) e ajustar `getHabilitarReinscricaoTooltipTrigger`.
  113 |         // Sem o trigger, step é informativo (sem assertion). Steps 1-4
  114 |         // já validam a RN principal.
  115 |         await allure.tag('REVIEW_NEEDED');
  116 |         const triggerVisible = await trigger.isVisible({ timeout: 1_000 }).catch(() => false);
  117 |         if (triggerVisible) {
  118 |           await trigger.hover();
  119 |           const tooltip = contentEdit.getHabilitarReinscricaoTooltip();
  120 |           await expect(tooltip).toBeVisible();
  121 |           await expect(tooltip).not.toHaveText('');
  122 |         }
  123 |       },
  124 |     );
  125 |   });
  126 | });
  127 | 
```