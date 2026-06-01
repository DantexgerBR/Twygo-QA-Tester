# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts:57:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="tab-access"]').or(getByRole('tab', { name: /^Acesso$/i })).first()
    - locator resolved to <button role="tab" name="access" type="button" tabindex="-1" data-index="1" aria-disabled="false" id="tabs-:rs:--tab-1" aria-selected="false" data-tab-name="access" data-test-id="tab-access" class="chakra-tabs__tab css-fuqmym" aria-controls="tabs-:rs:--tabpanel-1">Acesso</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="group" class="chakra-form-control css-1kxonj9">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div role="group" class="chakra-form-control css-1kxonj9">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" class="chakra-modal__content-container css-1u2cvaz">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
  13 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div role="group" class="chakra-form-control css-1kxonj9">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div role="group" class="chakra-form-control css-1kxonj9">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="-1" class="chakra-modal__content-container css-1u2cvaz">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="-1" class="chakra-modal__content-container css-1u2cvaz">…</div> from <div class="chakra-portal">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

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
          - heading "Curso Recertificação TC1 w0-1780314110990" [level=2] [ref=e504]
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
                      - text: "807447"
                  - group [ref=e536]:
                    - generic [ref=e538]:
                      - generic [ref=e539]: Nome
                      - generic [ref=e540]: "*"
                    - textbox "Nome *" [active] [ref=e542]:
                      - /placeholder: Nome do curso
                      - text: Curso Recertificação TC1 w0-1780314110990
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
                        - paragraph [ref=f29e2]: Seed automatizado — Curso Recertificação TC1 w0-1780314110990 (createCurso v1.3).
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
  - region "Widget de chat" [ref=e753]:
    - iframe [ref=e754]:
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
  70  |     await acessoTab.waitFor({ state: 'visible', timeout: 20_000 });
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
> 147 |       await acessoTab.click();
      |                       ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  148 |       await this.page
  149 |         .waitForURL(/tab=access/, { timeout: 5_000 })
  150 |         .catch(() => undefined);
  151 |       // Confirma a tab Acesso ficou selected (aria-selected=true).
  152 |       await expect(acessoTab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
  153 |       // Aguarda checkbox "Habilitar reinscrição" renderizar no DOM
  154 |       // (label visível — input é screen-reader-only do Chakra).
  155 |       await this.page
  156 |         .getByText('Habilitar reinscrição', { exact: true })
  157 |         .first()
  158 |         .waitFor({ state: 'visible', timeout: 5_000 })
  159 |         .catch(() => undefined);
  160 |     }
  161 |   }
  162 | 
  163 |   /**
  164 |    * Abre a edição de um conteúdo a partir da listagem clicando no ação
  165 |    * "Editar" do registro com o nome dado. Caminho usado pelos TCs que
  166 |    * descrevem o fluxo "Listagem → Editar" textualmente (TC1, TC4).
  167 |    *
  168 |    * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
  169 |    * "Editar" direto na linha; usa kebab `img "Options"` que abre dropdown
  170 |    * com a ação. Adicionar data-test-id estável no app via PR.
  171 |    */
  172 |   async openEditByName(name: string): Promise<void> {
  173 |     await this.goToContentList();
  174 |     // Filtrar via campo "Pesquise aqui" reduz a lista a 1 row
  175 |     // (mais robusto que getByRole row fuzzy match que pode falhar com
  176 |     // accessible name composto de muitas células). Validado live 2026-05-27.
  177 |     const searchBox = this.page.getByPlaceholder(/Pesquise aqui/i).first();
  178 |     if (await searchBox.isVisible({ timeout: 3_000 }).catch(() => false)) {
  179 |       await searchBox.fill(name);
  180 |       // Aguarda a row aparecer (search filtra incrementalmente).
  181 |       await this.page
  182 |         .getByText(name, { exact: false })
  183 |         .first()
  184 |         .waitFor({ state: 'visible', timeout: 8_000 });
  185 |     }
  186 |     // Localiza a row que contém o nome (mais flexível que getByRole row).
  187 |     const row = this.page
  188 |       .locator('tr, [role="row"]')
  189 |       .filter({ hasText: name })
  190 |       .first();
  191 |     await row.waitFor({ state: 'visible', timeout: 10_000 });
  192 |     await this.clickEditarFromRow(row);
  193 |   }
  194 | 
  195 |   /**
  196 |    * Abre a edição da PRIMEIRA linha de curso visível na listagem.
  197 |    * Usado por TCs cuja pré-condição é só "existe ≥1 curso pré-existente"
  198 |    * (TC1) sem fixar nome específico.
  199 |    *
  200 |    * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
  201 |    * "Editar" direto na linha; usa kebab `img "Options"` que abre
  202 |    * dropdown com a ação "Editar". Adicionar data-test-id estável no app
  203 |    * via PR (`event-row-edit-link` sugerido).
  204 |    */
  205 |   async openEditFromFirstRow(): Promise<void> {
  206 |     await this.goToContentList();
  207 |     // Primeira linha de dados (exclui header em <thead>).
  208 |     const firstRow = this.page.locator('tbody tr').first();
  209 |     await firstRow.waitFor({ state: 'visible', timeout: 10_000 });
  210 |     await this.clickEditarFromRow(firstRow);
  211 |   }
  212 | 
  213 |   /**
  214 |    * Clica em "Editar" dentro de uma linha da listagem. Cobre os 2 padrões
  215 |    * de UI observados no Twygo:
  216 |    *   1. Tela legada (HAML): kebab `img "Options"` → dropdown → "Editar".
  217 |    *   2. Tela facelift: `<a>Editar</a>` direto na célula de ações.
  218 |    *
  219 |    * REVISAR: seletor `img[alt="Options"]` foi descoberto via heal (error-context
  220 |    * de TC1 mostrou `img "Options" [cursor=pointer]` como única affordance de ação).
  221 |    * Substituir por `data-test-id` estável quando dev adicionar (PR pendente).
  222 |    */
  223 |   private async clickEditarFromRow(row: Locator): Promise<void> {
  224 |     // Caminho 1: link "Editar" direto na row (facelift antigo — pode
  225 |     // não existir mais).
  226 |     const directLink = row.getByRole('link', { name: /Editar/i }).first();
  227 |     if (await directLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
  228 |       await directLink.click();
  229 |       await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  230 |       return;
  231 |     }
  232 |     // Caminho 2: more_vert (UI nova facelift, validada live 2026-05-27).
  233 |     // Kebab tem `data-test-id="events-{id}-actions-kebab"` (preferencial),
  234 |     // com fallback pra accessible name "more_vert". Item de edição é
  235 |     // "Gerenciar" mas Chakra renderiza com ícone Material colado: text
  236 |     // content vira "editGerenciar" — regex sem âncoras evita o miss.
  237 |     const moreVertTrigger = row
  238 |       .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
  239 |       .or(row.getByRole('button', { name: 'more_vert' }))
  240 |       .or(row.locator('button:has-text("more_vert")'))
  241 |       .first();
  242 |     if (await moreVertTrigger.isVisible({ timeout: 3_000 }).catch(() => false)) {
  243 |       await moreVertTrigger.scrollIntoViewIfNeeded();
  244 |       await moreVertTrigger.click();
  245 |       const gerenciarItem = this.page
  246 |         .getByRole('menuitem', { name: /Gerenciar/i })
  247 |         .or(this.page.getByRole('menuitem', { name: /Editar/i }))
```