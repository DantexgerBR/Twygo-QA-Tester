# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\atualizacao-kpis-tempo-real\tc4-decremento-kpi-apos-excluir.spec.ts >> Atualização de KPIs em tempo real (ações, expiração e batch) >> Validar decremento do KPI após Excluir
- Location: projects\registros-externos\tests\features\atualizacao-kpis-tempo-real\tc4-decremento-kpi-apos-excluir.spec.ts:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="alertdialog"], [role="dialog"], .chakra-modal__content').filter({ hasText: /Excluir registro|desfeita|Tem certeza|Confirmação/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[role="alertdialog"], [role="dialog"], .chakra-modal__content').filter({ hasText: /Excluir registro|desfeita|Tem certeza|Confirmação/i }).first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Registros F2" [ref=e4]:
        - img "Logo - Registros F2" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/37079/dashboard
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
                  - /url: /o/37079/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/37079/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/37079/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/37079/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
              - listitem [ref=e51]:
                - link "folder_open Base de conhecimento" [ref=e52] [cursor=pointer]:
                  - /url: /o/37079/knowledge_repositories
                  - generic [ref=e53]:
                    - generic [ref=e55]: folder_open
                    - generic [ref=e56]: Base de conhecimento
          - listitem [ref=e57]:
            - link "group Usuários" [ref=e58] [cursor=pointer]:
              - /url: /o/37079/users
              - generic [ref=e59]:
                - generic [ref=e61]: group
                - generic [ref=e62]: Usuários
          - listitem [ref=e63]:
            - link "work Empresas" [ref=e64] [cursor=pointer]:
              - /url: /o/37079/companies
              - generic [ref=e65]:
                - generic [ref=e67]: work
                - generic [ref=e68]: Empresas
          - listitem [ref=e69]:
            - link "live_help Questionários" [ref=e70] [cursor=pointer]:
              - /url: /o/37079/question_lists
              - generic [ref=e71]:
                - generic [ref=e73]: live_help
                - generic [ref=e74]: Questionários
          - listitem [ref=e75]:
            - link "groups Comunidades" [ref=e76] [cursor=pointer]:
              - /url: /o/37079/feed
              - generic [ref=e77]:
                - generic [ref=e79]: groups
                - generic [ref=e80]: Comunidades
          - listitem [ref=e81]:
            - generic [ref=e83]:
              - generic [ref=e86]: psychology
              - generic [ref=e87]:
                - text: Skills
                - generic [ref=e88]: BETA
            - list [ref=e89]:
              - listitem [ref=e90]:
                - link "lan Organograma" [ref=e91] [cursor=pointer]:
                  - /url: /o/37079/organization_chart
                  - generic [ref=e92]:
                    - generic [ref=e94]: lan
                    - generic [ref=e95]: Organograma
              - listitem [ref=e96]:
                - link "badge Funções de negócio" [ref=e97] [cursor=pointer]:
                  - /url: /o/37079/roles
                  - generic [ref=e98]:
                    - generic [ref=e100]: badge
                    - generic [ref=e101]: Funções de negócio
              - listitem [ref=e102]:
                - link "award_star Competências" [ref=e103] [cursor=pointer]:
                  - /url: /o/37079/organization_chart_competencies
                  - generic [ref=e104]:
                    - generic [ref=e106]: award_star
                    - generic [ref=e107]: Competências
          - listitem [ref=e108]:
            - generic [ref=e110]:
              - generic [ref=e113]: monitoring
              - generic [ref=e114]:
                - text: Planos e Metas
                - generic [ref=e115]: BETA
            - list [ref=e116]:
              - listitem [ref=e117]:
                - link "track_changes PDI" [ref=e118] [cursor=pointer]:
                  - /url: /o/37079/admin/pdis
                  - generic [ref=e119]:
                    - generic [ref=e121]: track_changes
                    - generic [ref=e122]: PDI
      - generic [ref=e123]: Registros F2
      - list [ref=e124]:
        - listitem [ref=e125]:
          - generic [ref=e127]:
            - generic [ref=e129]: f
            - generic [ref=e130]: Configurações
          - list [ref=e131]:
            - listitem [ref=e132]:
              - link "e Organização" [ref=e133] [cursor=pointer]:
                - /url: /o/37079/edit
                - generic [ref=e134]:
                  - generic [ref=e136]: e
                  - generic [ref=e137]: Organização
            - listitem [ref=e138]:
              - link " Navegação" [ref=e139] [cursor=pointer]:
                - /url: /o/37079/use_modes
                - generic [ref=e140]:
                  - generic [ref=e142]: 
                  - generic [ref=e143]: Navegação
            - listitem [ref=e144]:
              - link "electrical_services Integrações" [ref=e145] [cursor=pointer]:
                - /url: /o/37079/integrations
                - generic [ref=e146]:
                  - generic [ref=e148]: electrical_services
                  - generic [ref=e149]: Integrações
            - listitem [ref=e150]:
              - link "flash_auto Piloto automático" [ref=e151] [cursor=pointer]:
                - /url: /o/37079/autopilots
                - generic [ref=e152]:
                  - generic [ref=e154]: flash_auto
                  - generic [ref=e155]: Piloto automático
            - listitem [ref=e156]:
              - link " Regras do Jogo" [ref=e157] [cursor=pointer]:
                - /url: /o/37079/game_rules
                - generic [ref=e158]:
                  - generic [ref=e160]: 
                  - generic [ref=e161]: Regras do Jogo
            - listitem [ref=e162]:
              - link " Comunicação" [ref=e163] [cursor=pointer]:
                - /url: /o/37079/communication
                - generic [ref=e164]:
                  - generic [ref=e166]: 
                  - generic [ref=e167]: Comunicação
            - listitem [ref=e168]:
              - link "sell Cobrança de inscrição" [ref=e169] [cursor=pointer]:
                - /url: /o/37079/payments
                - generic [ref=e170]:
                  - generic [ref=e172]: sell
                  - generic [ref=e173]: Cobrança de inscrição
            - listitem [ref=e174]:
              - link "credit_card Plano e assinatura" [ref=e175] [cursor=pointer]:
                - /url: /o/37079/subscription_plans
                - generic [ref=e176]:
                  - generic [ref=e178]: credit_card
                  - generic [ref=e179]: Plano e assinatura
            - text: s
            - listitem [ref=e180]:
              - link " Segurança NOVO" [ref=e181] [cursor=pointer]:
                - /url: /o/37079/security
                - generic [ref=e182]:
                  - generic [ref=e184]: 
                  - generic [ref=e185]: Segurança NOVO
            - listitem [ref=e186]:
              - link "smart_toy Controle de IA BETA" [ref=e187] [cursor=pointer]:
                - /url: /o/37079/ai_consumption_analysis
                - generic [ref=e188]:
                  - generic [ref=e190]: smart_toy
                  - generic [ref=e191]: Controle de IA BETA
            - listitem [ref=e192]:
              - link "palette Aparência" [ref=e193] [cursor=pointer]:
                - /url: /o/37079/appearance
                - generic [ref=e194]:
                  - generic [ref=e196]: palette
                  - generic [ref=e197]: Aparência
    - generic [ref=e200]:
      - generic [ref=e201]:
        - img [ref=e202]
        - text: Richard Sebold
      - img [ref=e204]
  - text: "0"
  - generic [ref=e207]:
    - generic "Logo - Registros F2" [ref=e209]:
      - link "Registros F2" [ref=e211] [cursor=pointer]:
        - /url: /o/37079/dashboard
    - generic [ref=e215]:
      - button "Twygo Academy" [ref=e219] [cursor=pointer]:
        - generic [ref=e220]: school
      - link "Open chat" [ref=e224] [cursor=pointer]:
        - /url: /o/37079/chats
        - button "Open chat" [ref=e225]:
          - img [ref=e226]
      - button "Users" [ref=e233] [cursor=pointer]:
        - img [ref=e234]
      - generic [ref=e237]:
        - link "7094579 - Richard Sebold" [ref=e238] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e239]: Richard Sebold
      - button "Administrador G" [ref=e240] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e241]: G
    - text: M * * M * *
  - generic [ref=e244]:
    - generic [ref=e246]:
      - list [ref=e247]:
        - list [ref=e248]:
          - listitem [ref=e249] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e250]:
              - /url: /o/37079/dashboard
              - generic [ref=e251]:
                - generic [ref=e253]: leaderboard
                - generic [ref=e254]: Dashboard
          - listitem [ref=e255] [cursor=pointer]:
            - generic [ref=e257]:
              - generic [ref=e260]: school
              - generic [ref=e261]: Aprendizagem
              - generic [ref=e263]: G
            - list [ref=e264]:
              - listitem [ref=e265]:
                - link "format_list_bulleted_add Conteúdos" [ref=e266]:
                  - /url: /o/37079/events?tab=events
                  - generic [ref=e267]:
                    - generic [ref=e269]: format_list_bulleted_add
                    - generic [ref=e270]: Conteúdos
              - listitem [ref=e271]:
                - link "send Compartilhamentos" [ref=e272]:
                  - /url: /o/37079/shared_events
                  - generic [ref=e273]:
                    - generic [ref=e275]: send
                    - generic [ref=e276]: Compartilhamentos
              - listitem [ref=e277]:
                - link "description Registros BETA" [ref=e278]:
                  - /url: /o/37079/records
                  - generic [ref=e279]:
                    - generic [ref=e281]: description
                    - generic [ref=e282]: Registros
                    - generic [ref=e283]: BETA
              - listitem [ref=e284]:
                - link "workspace_premium Certificados" [ref=e285]:
                  - /url: /o/37079/certificate_models
                  - generic [ref=e286]:
                    - generic [ref=e288]: workspace_premium
                    - generic [ref=e289]: Certificados
              - listitem [ref=e290]:
                - link "folder_open Base de conhecimento" [ref=e291]:
                  - /url: /o/37079/knowledge_repositories
                  - generic [ref=e292]:
                    - generic [ref=e294]: folder_open
                    - generic [ref=e295]: Base de conhecimento
          - listitem [ref=e296] [cursor=pointer]:
            - link "group Usuários" [ref=e297]:
              - /url: /o/37079/users
              - generic [ref=e298]:
                - generic [ref=e300]: group
                - generic [ref=e301]: Usuários
          - listitem [ref=e302] [cursor=pointer]:
            - link "work Empresas" [ref=e303]:
              - /url: /o/37079/companies
              - generic [ref=e304]:
                - generic [ref=e306]: work
                - generic [ref=e307]: Empresas
          - listitem [ref=e308] [cursor=pointer]:
            - link "live_help Questionários" [ref=e309]:
              - /url: /o/37079/question_lists
              - generic [ref=e310]:
                - generic [ref=e312]: live_help
                - generic [ref=e313]: Questionários
          - listitem [ref=e314] [cursor=pointer]:
            - link "groups Comunidades" [ref=e315]:
              - /url: /o/37079/feed
              - generic [ref=e316]:
                - generic [ref=e318]: groups
                - generic [ref=e319]: Comunidades
          - listitem [ref=e320] [cursor=pointer]:
            - generic [ref=e322]:
              - generic [ref=e325]: psychology
              - generic [ref=e326]:
                - text: Skills
                - generic [ref=e327]: BETA
              - generic [ref=e329]: G
          - listitem [ref=e330] [cursor=pointer]:
            - generic [ref=e332]:
              - generic [ref=e335]: monitoring
              - generic [ref=e336]:
                - text: Planos e Metas
                - generic [ref=e337]: BETA
              - generic [ref=e339]: G
      - generic [ref=e341]: Registros F2
      - list [ref=e342]:
        - listitem [ref=e343] [cursor=pointer]:
          - generic [ref=e345]:
            - generic [ref=e347]: f
            - generic [ref=e348]: Configurações
            - generic [ref=e350]: G
          - text: e    s 
    - generic [ref=e352]:
      - generic [ref=e357]: Registros
      - generic [ref=e366]:
        - tablist [ref=e367]:
          - tab "Registros" [selected] [ref=e368] [cursor=pointer]
          - tab "Provedores" [ref=e369] [cursor=pointer]
        - tabpanel "Registros" [ref=e371]:
          - generic [ref=e372]:
            - generic [ref=e374]:
              - generic [ref=e375]:
                - img [ref=e376]
                - paragraph [ref=e378]: "247"
              - paragraph [ref=e379]: Emitidos
            - generic [ref=e381]:
              - generic [ref=e382]:
                - img [ref=e383]
                - paragraph [ref=e385]: "12"
              - paragraph [ref=e386]: Expirados
            - generic [ref=e388]:
              - generic [ref=e389]:
                - img [ref=e390]
                - paragraph [ref=e392]: "81"
              - paragraph [ref=e393]: Pendentes
            - generic [ref=e395]:
              - generic [ref=e396]:
                - img [ref=e397]
                - paragraph [ref=e399]: "13"
              - paragraph [ref=e400]: Recusados
          - generic [ref=e401]:
            - generic [ref=e402]: schedule
            - paragraph [ref=e403]: "Carga horária total: 10237 horas"
          - generic [ref=e404]:
            - generic [ref=e405]:
              - link "Adicionar" [ref=e406] [cursor=pointer]:
                - /url: /o/37079/records/new
                - button "Adicionar" [ref=e407]:
                  - img [ref=e409]
                  - text: Adicionar
              - button "Ações em massa" [ref=e411] [cursor=pointer]
              - button "ios_share Extrair dados" [ref=e413] [cursor=pointer]:
                - generic [ref=e414]: ios_share
                - text: Extrair dados
              - generic [ref=e415]:
                - generic [ref=e416]:
                  - img [ref=e418]
                  - textbox "Pesquise por pessoa, conteúdo ou provedor" [ref=e420]
                - generic [ref=e421]:
                  - generic [ref=e422] [cursor=pointer]: grid_view
                  - generic [ref=e423] [cursor=pointer]: reorder
                - button "Filtro" [ref=e424] [cursor=pointer]:
                  - generic [ref=e426]: filter_alt
                  - paragraph [ref=e428]: Filtro
            - table [ref=e430]:
              - rowgroup [ref=e431]:
                - row "Pessoa Conteúdo Origem Criado por Experiência Provedor Website Evidências Carga horária Situação Situação do certificado" [ref=e432]:
                  - columnheader [ref=e433]:
                    - checkbox [ref=e436]
                  - columnheader "Pessoa" [ref=e438] [cursor=pointer]:
                    - generic [ref=e441]:
                      - text: Pessoa
                      - img [ref=e442]
                  - columnheader "Conteúdo" [ref=e444] [cursor=pointer]:
                    - generic [ref=e447]:
                      - text: Conteúdo
                      - img [ref=e448]
                  - columnheader "Origem" [ref=e450] [cursor=pointer]:
                    - generic [ref=e452]:
                      - generic [ref=e453]:
                        - text: Origem
                        - img [ref=e454]
                      - img [ref=e457]
                  - columnheader "Criado por" [ref=e459] [cursor=pointer]:
                    - generic [ref=e462]:
                      - text: Criado por
                      - img [ref=e463]
                  - columnheader "Experiência" [ref=e465] [cursor=pointer]:
                    - generic [ref=e467]:
                      - generic [ref=e468]:
                        - text: Experiência
                        - img [ref=e469]
                      - img [ref=e472]
                  - columnheader "Provedor" [ref=e474] [cursor=pointer]:
                    - generic [ref=e476]:
                      - generic [ref=e477]:
                        - text: Provedor
                        - img [ref=e478]
                      - img [ref=e481]
                  - columnheader "Website" [ref=e483]:
                    - generic [ref=e484]: Website
                  - columnheader "Evidências" [ref=e485]:
                    - generic [ref=e486]: Evidências
                  - columnheader "Carga horária" [ref=e487] [cursor=pointer]:
                    - generic [ref=e489]:
                      - generic [ref=e490]:
                        - text: Carga horária
                        - img [ref=e491]
                      - img [ref=e494]
                  - columnheader "Situação" [ref=e496] [cursor=pointer]:
                    - generic [ref=e499]:
                      - text: Situação
                      - img [ref=e500]
                  - columnheader "Situação do certificado" [ref=e502] [cursor=pointer]:
                    - generic [ref=e504]:
                      - generic [ref=e505]:
                        - text: Situação do certificado
                        - img [ref=e506]
                      - img [ref=e509]
                  - columnheader [ref=e511]
              - rowgroup [ref=e512]:
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC4-w0-1782159997177 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e513]:
                  - cell [ref=e514]:
                    - checkbox [ref=e516]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e518]:
                    - generic [ref=e520]:
                      - img [ref=e523]
                      - paragraph [ref=e525]:
                        - paragraph [ref=e526]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC4-w0-1782159997177" [ref=e527]:
                    - paragraph [ref=e528]: QAKPIRT-TC4-w0-1782159997177
                  - cell "public Externo" [ref=e529]:
                    - generic [ref=e532]:
                      - generic [ref=e533]: public
                      - paragraph [ref=e534]: Externo
                  - cell "Richard Sebold" [ref=e535]:
                    - paragraph [ref=e536]: Richard Sebold
                  - cell "Curso" [ref=e537]:
                    - paragraph [ref=e538]: Curso
                  - cell "Alura" [ref=e539]:
                    - paragraph [ref=e541]: Alura
                  - cell "-" [ref=e542]:
                    - paragraph [ref=e544]: "-"
                  - cell "-" [ref=e545]:
                    - paragraph [ref=e547]: "-"
                  - cell "40h" [ref=e548]
                  - cell "Aprovado" [ref=e549]:
                    - paragraph [ref=e552]: Aprovado
                  - cell "Emitido" [ref=e553]:
                    - paragraph [ref=e556]: Emitido
                  - cell "more_vert" [ref=e557]:
                    - button "more_vert" [expanded] [ref=e561] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC3-w0-1782159976042 public Externo Richard Sebold Curso Alura - - 40h Aprovado Recusado more_vert" [ref=e562]:
                  - cell [ref=e563]:
                    - checkbox [ref=e565]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e567]:
                    - generic [ref=e569]:
                      - img [ref=e572]
                      - paragraph [ref=e574]:
                        - paragraph [ref=e575]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC3-w0-1782159976042" [ref=e576]:
                    - paragraph [ref=e577]: QAKPIRT-TC3-w0-1782159976042
                  - cell "public Externo" [ref=e578]:
                    - generic [ref=e581]:
                      - generic [ref=e582]: public
                      - paragraph [ref=e583]: Externo
                  - cell "Richard Sebold" [ref=e584]:
                    - paragraph [ref=e585]: Richard Sebold
                  - cell "Curso" [ref=e586]:
                    - paragraph [ref=e587]: Curso
                  - cell "Alura" [ref=e588]:
                    - paragraph [ref=e590]: Alura
                  - cell "-" [ref=e591]:
                    - paragraph [ref=e593]: "-"
                  - cell "-" [ref=e594]:
                    - paragraph [ref=e596]: "-"
                  - cell "40h" [ref=e597]
                  - cell "Aprovado" [ref=e598]:
                    - paragraph [ref=e601]: Aprovado
                  - cell "Recusado" [ref=e602]:
                    - paragraph [ref=e605]: Recusado
                  - cell "more_vert" [ref=e606]:
                    - button "more_vert" [ref=e610] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC2-w0-1782159955200 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e611]:
                  - cell [ref=e612]:
                    - checkbox [ref=e614]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e616]:
                    - generic [ref=e618]:
                      - img [ref=e621]
                      - paragraph [ref=e623]:
                        - paragraph [ref=e624]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC2-w0-1782159955200" [ref=e625]:
                    - paragraph [ref=e626]: QAKPIRT-TC2-w0-1782159955200
                  - cell "public Externo" [ref=e627]:
                    - generic [ref=e630]:
                      - generic [ref=e631]: public
                      - paragraph [ref=e632]: Externo
                  - cell "Richard Sebold" [ref=e633]:
                    - paragraph [ref=e634]: Richard Sebold
                  - cell "Curso" [ref=e635]:
                    - paragraph [ref=e636]: Curso
                  - cell "Alura" [ref=e637]:
                    - paragraph [ref=e639]: Alura
                  - cell "-" [ref=e640]:
                    - paragraph [ref=e642]: "-"
                  - cell "-" [ref=e643]:
                    - paragraph [ref=e645]: "-"
                  - cell "40h" [ref=e646]
                  - cell "Aprovado" [ref=e647]:
                    - paragraph [ref=e650]: Aprovado
                  - cell "Emitido" [ref=e651]:
                    - paragraph [ref=e654]: Emitido
                  - cell "more_vert" [ref=e655]:
                    - button "more_vert" [ref=e659] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "dev teste devtestes@teste.com QAKPIRT-TC1-w0-1782159931405 public Externo Richard Sebold Curso Alura - - 40h Aprovado Pendente more_vert" [ref=e660]:
                  - cell [ref=e661]:
                    - checkbox [ref=e663]
                  - cell "dev teste devtestes@teste.com" [ref=e665]:
                    - generic [ref=e667]:
                      - img [ref=e670]
                      - paragraph [ref=e672]:
                        - paragraph [ref=e673]: dev teste
                        - text: devtestes@teste.com
                  - cell "QAKPIRT-TC1-w0-1782159931405" [ref=e674]:
                    - paragraph [ref=e675]: QAKPIRT-TC1-w0-1782159931405
                  - cell "public Externo" [ref=e676]:
                    - generic [ref=e679]:
                      - generic [ref=e680]: public
                      - paragraph [ref=e681]: Externo
                  - cell "Richard Sebold" [ref=e682]:
                    - paragraph [ref=e683]: Richard Sebold
                  - cell "Curso" [ref=e684]:
                    - paragraph [ref=e685]: Curso
                  - cell "Alura" [ref=e686]:
                    - paragraph [ref=e688]: Alura
                  - cell "-" [ref=e689]:
                    - paragraph [ref=e691]: "-"
                  - cell "-" [ref=e692]:
                    - paragraph [ref=e694]: "-"
                  - cell "40h" [ref=e695]
                  - cell "Aprovado" [ref=e696]:
                    - paragraph [ref=e699]: Aprovado
                  - cell "Pendente" [ref=e700]:
                    - paragraph [ref=e703]: Pendente
                  - cell "more_vert" [ref=e704]:
                    - button "more_vert" [ref=e708] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-7 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e709]:
                  - cell [ref=e710]:
                    - checkbox [ref=e712]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e714]:
                    - generic [ref=e716]:
                      - img [ref=e719]
                      - paragraph [ref=e721]:
                        - paragraph [ref=e722]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-7" [ref=e723]:
                    - paragraph [ref=e724]: QAKPIRT-TC7-w1-1782159768881-7
                  - cell "public Externo" [ref=e725]:
                    - generic [ref=e728]:
                      - generic [ref=e729]: public
                      - paragraph [ref=e730]: Externo
                  - cell "Richard Sebold" [ref=e731]:
                    - paragraph [ref=e732]: Richard Sebold
                  - cell "Curso" [ref=e733]:
                    - paragraph [ref=e734]: Curso
                  - cell "Alura" [ref=e735]:
                    - paragraph [ref=e737]: Alura
                  - cell "-" [ref=e738]:
                    - paragraph [ref=e740]: "-"
                  - cell "-" [ref=e741]:
                    - paragraph [ref=e743]: "-"
                  - cell "40h" [ref=e744]
                  - cell "Aprovado" [ref=e745]:
                    - paragraph [ref=e748]: Aprovado
                  - cell "Emitido" [ref=e749]:
                    - paragraph [ref=e752]: Emitido
                  - cell "more_vert" [ref=e753]:
                    - button "more_vert" [ref=e757] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-3 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e758]:
                  - cell [ref=e759]:
                    - checkbox [ref=e761]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e763]:
                    - generic [ref=e765]:
                      - img [ref=e768]
                      - paragraph [ref=e770]:
                        - paragraph [ref=e771]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-3" [ref=e772]:
                    - paragraph [ref=e773]: QAKPIRT-TC7-w1-1782159768881-3
                  - cell "public Externo" [ref=e774]:
                    - generic [ref=e777]:
                      - generic [ref=e778]: public
                      - paragraph [ref=e779]: Externo
                  - cell "Richard Sebold" [ref=e780]:
                    - paragraph [ref=e781]: Richard Sebold
                  - cell "Curso" [ref=e782]:
                    - paragraph [ref=e783]: Curso
                  - cell "Alura" [ref=e784]:
                    - paragraph [ref=e786]: Alura
                  - cell "-" [ref=e787]:
                    - paragraph [ref=e789]: "-"
                  - cell "-" [ref=e790]:
                    - paragraph [ref=e792]: "-"
                  - cell "40h" [ref=e793]
                  - cell "Aprovado" [ref=e794]:
                    - paragraph [ref=e797]: Aprovado
                  - cell "Emitido" [ref=e798]:
                    - paragraph [ref=e801]: Emitido
                  - cell "more_vert" [ref=e802]:
                    - button "more_vert" [ref=e806] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-4 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e807]:
                  - cell [ref=e808]:
                    - checkbox [ref=e810]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e812]:
                    - generic [ref=e814]:
                      - img [ref=e817]
                      - paragraph [ref=e819]:
                        - paragraph [ref=e820]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-4" [ref=e821]:
                    - paragraph [ref=e822]: QAKPIRT-TC7-w1-1782159768881-4
                  - cell "public Externo" [ref=e823]:
                    - generic [ref=e826]:
                      - generic [ref=e827]: public
                      - paragraph [ref=e828]: Externo
                  - cell "Richard Sebold" [ref=e829]:
                    - paragraph [ref=e830]: Richard Sebold
                  - cell "Curso" [ref=e831]:
                    - paragraph [ref=e832]: Curso
                  - cell "Alura" [ref=e833]:
                    - paragraph [ref=e835]: Alura
                  - cell "-" [ref=e836]:
                    - paragraph [ref=e838]: "-"
                  - cell "-" [ref=e839]:
                    - paragraph [ref=e841]: "-"
                  - cell "40h" [ref=e842]
                  - cell "Aprovado" [ref=e843]:
                    - paragraph [ref=e846]: Aprovado
                  - cell "Emitido" [ref=e847]:
                    - paragraph [ref=e850]: Emitido
                  - cell "more_vert" [ref=e851]:
                    - button "more_vert" [ref=e855] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-5 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e856]:
                  - cell [ref=e857]:
                    - checkbox [ref=e859]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e861]:
                    - generic [ref=e863]:
                      - img [ref=e866]
                      - paragraph [ref=e868]:
                        - paragraph [ref=e869]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-5" [ref=e870]:
                    - paragraph [ref=e871]: QAKPIRT-TC7-w1-1782159768881-5
                  - cell "public Externo" [ref=e872]:
                    - generic [ref=e875]:
                      - generic [ref=e876]: public
                      - paragraph [ref=e877]: Externo
                  - cell "Richard Sebold" [ref=e878]:
                    - paragraph [ref=e879]: Richard Sebold
                  - cell "Curso" [ref=e880]:
                    - paragraph [ref=e881]: Curso
                  - cell "Alura" [ref=e882]:
                    - paragraph [ref=e884]: Alura
                  - cell "-" [ref=e885]:
                    - paragraph [ref=e887]: "-"
                  - cell "-" [ref=e888]:
                    - paragraph [ref=e890]: "-"
                  - cell "40h" [ref=e891]
                  - cell "Aprovado" [ref=e892]:
                    - paragraph [ref=e895]: Aprovado
                  - cell "Emitido" [ref=e896]:
                    - paragraph [ref=e899]: Emitido
                  - cell "more_vert" [ref=e900]:
                    - button "more_vert" [ref=e904] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-6 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e905]:
                  - cell [ref=e906]:
                    - checkbox [ref=e908]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e910]:
                    - generic [ref=e912]:
                      - img [ref=e915]
                      - paragraph [ref=e917]:
                        - paragraph [ref=e918]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-6" [ref=e919]:
                    - paragraph [ref=e920]: QAKPIRT-TC7-w1-1782159768881-6
                  - cell "public Externo" [ref=e921]:
                    - generic [ref=e924]:
                      - generic [ref=e925]: public
                      - paragraph [ref=e926]: Externo
                  - cell "Richard Sebold" [ref=e927]:
                    - paragraph [ref=e928]: Richard Sebold
                  - cell "Curso" [ref=e929]:
                    - paragraph [ref=e930]: Curso
                  - cell "Alura" [ref=e931]:
                    - paragraph [ref=e933]: Alura
                  - cell "-" [ref=e934]:
                    - paragraph [ref=e936]: "-"
                  - cell "-" [ref=e937]:
                    - paragraph [ref=e939]: "-"
                  - cell "40h" [ref=e940]
                  - cell "Aprovado" [ref=e941]:
                    - paragraph [ref=e944]: Aprovado
                  - cell "Emitido" [ref=e945]:
                    - paragraph [ref=e948]: Emitido
                  - cell "more_vert" [ref=e949]:
                    - button "more_vert" [ref=e953] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-1 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e954]:
                  - cell [ref=e955]:
                    - checkbox [ref=e957]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e959]:
                    - generic [ref=e961]:
                      - img [ref=e964]
                      - paragraph [ref=e966]:
                        - paragraph [ref=e967]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-1" [ref=e968]:
                    - paragraph [ref=e969]: QAKPIRT-TC7-w1-1782159768881-1
                  - cell "public Externo" [ref=e970]:
                    - generic [ref=e973]:
                      - generic [ref=e974]: public
                      - paragraph [ref=e975]: Externo
                  - cell "Richard Sebold" [ref=e976]:
                    - paragraph [ref=e977]: Richard Sebold
                  - cell "Curso" [ref=e978]:
                    - paragraph [ref=e979]: Curso
                  - cell "Alura" [ref=e980]:
                    - paragraph [ref=e982]: Alura
                  - cell "-" [ref=e983]:
                    - paragraph [ref=e985]: "-"
                  - cell "-" [ref=e986]:
                    - paragraph [ref=e988]: "-"
                  - cell "40h" [ref=e989]
                  - cell "Aprovado" [ref=e990]:
                    - paragraph [ref=e993]: Aprovado
                  - cell "Emitido" [ref=e994]:
                    - paragraph [ref=e997]: Emitido
                  - cell "more_vert" [ref=e998]:
                    - button "more_vert" [ref=e1002] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159768881-2 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1003]:
                  - cell [ref=e1004]:
                    - checkbox [ref=e1006]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1008]:
                    - generic [ref=e1010]:
                      - img [ref=e1013]
                      - paragraph [ref=e1015]:
                        - paragraph [ref=e1016]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159768881-2" [ref=e1017]:
                    - paragraph [ref=e1018]: QAKPIRT-TC7-w1-1782159768881-2
                  - cell "public Externo" [ref=e1019]:
                    - generic [ref=e1022]:
                      - generic [ref=e1023]: public
                      - paragraph [ref=e1024]: Externo
                  - cell "Richard Sebold" [ref=e1025]:
                    - paragraph [ref=e1026]: Richard Sebold
                  - cell "Curso" [ref=e1027]:
                    - paragraph [ref=e1028]: Curso
                  - cell "Alura" [ref=e1029]:
                    - paragraph [ref=e1031]: Alura
                  - cell "-" [ref=e1032]:
                    - paragraph [ref=e1034]: "-"
                  - cell "-" [ref=e1035]:
                    - paragraph [ref=e1037]: "-"
                  - cell "40h" [ref=e1038]
                  - cell "Aprovado" [ref=e1039]:
                    - paragraph [ref=e1042]: Aprovado
                  - cell "Emitido" [ref=e1043]:
                    - paragraph [ref=e1046]: Emitido
                  - cell "more_vert" [ref=e1047]:
                    - button "more_vert" [ref=e1051] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC6-w1-1782159747804-3 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1052]:
                  - cell [ref=e1053]:
                    - checkbox [ref=e1055]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1057]:
                    - generic [ref=e1059]:
                      - img [ref=e1062]
                      - paragraph [ref=e1064]:
                        - paragraph [ref=e1065]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC6-w1-1782159747804-3" [ref=e1066]:
                    - paragraph [ref=e1067]: QAKPIRT-TC6-w1-1782159747804-3
                  - cell "public Externo" [ref=e1068]:
                    - generic [ref=e1071]:
                      - generic [ref=e1072]: public
                      - paragraph [ref=e1073]: Externo
                  - cell "Richard Sebold" [ref=e1074]:
                    - paragraph [ref=e1075]: Richard Sebold
                  - cell "Curso" [ref=e1076]:
                    - paragraph [ref=e1077]: Curso
                  - cell "Alura" [ref=e1078]:
                    - paragraph [ref=e1080]: Alura
                  - cell "-" [ref=e1081]:
                    - paragraph [ref=e1083]: "-"
                  - cell "-" [ref=e1084]:
                    - paragraph [ref=e1086]: "-"
                  - cell "40h" [ref=e1087]
                  - cell "Aprovado" [ref=e1088]:
                    - paragraph [ref=e1091]: Aprovado
                  - cell "Emitido" [ref=e1092]:
                    - paragraph [ref=e1095]: Emitido
                  - cell "more_vert" [ref=e1096]:
                    - button "more_vert" [ref=e1100] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC6-w1-1782159747804-4 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1101]:
                  - cell [ref=e1102]:
                    - checkbox [ref=e1104]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1106]:
                    - generic [ref=e1108]:
                      - img [ref=e1111]
                      - paragraph [ref=e1113]:
                        - paragraph [ref=e1114]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC6-w1-1782159747804-4" [ref=e1115]:
                    - paragraph [ref=e1116]: QAKPIRT-TC6-w1-1782159747804-4
                  - cell "public Externo" [ref=e1117]:
                    - generic [ref=e1120]:
                      - generic [ref=e1121]: public
                      - paragraph [ref=e1122]: Externo
                  - cell "Richard Sebold" [ref=e1123]:
                    - paragraph [ref=e1124]: Richard Sebold
                  - cell "Curso" [ref=e1125]:
                    - paragraph [ref=e1126]: Curso
                  - cell "Alura" [ref=e1127]:
                    - paragraph [ref=e1129]: Alura
                  - cell "-" [ref=e1130]:
                    - paragraph [ref=e1132]: "-"
                  - cell "-" [ref=e1133]:
                    - paragraph [ref=e1135]: "-"
                  - cell "40h" [ref=e1136]
                  - cell "Aprovado" [ref=e1137]:
                    - paragraph [ref=e1140]: Aprovado
                  - cell "Emitido" [ref=e1141]:
                    - paragraph [ref=e1144]: Emitido
                  - cell "more_vert" [ref=e1145]:
                    - button "more_vert" [ref=e1149] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC6-w1-1782159747804-5 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1150]:
                  - cell [ref=e1151]:
                    - checkbox [ref=e1153]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1155]:
                    - generic [ref=e1157]:
                      - img [ref=e1160]
                      - paragraph [ref=e1162]:
                        - paragraph [ref=e1163]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC6-w1-1782159747804-5" [ref=e1164]:
                    - paragraph [ref=e1165]: QAKPIRT-TC6-w1-1782159747804-5
                  - cell "public Externo" [ref=e1166]:
                    - generic [ref=e1169]:
                      - generic [ref=e1170]: public
                      - paragraph [ref=e1171]: Externo
                  - cell "Richard Sebold" [ref=e1172]:
                    - paragraph [ref=e1173]: Richard Sebold
                  - cell "Curso" [ref=e1174]:
                    - paragraph [ref=e1175]: Curso
                  - cell "Alura" [ref=e1176]:
                    - paragraph [ref=e1178]: Alura
                  - cell "-" [ref=e1179]:
                    - paragraph [ref=e1181]: "-"
                  - cell "-" [ref=e1182]:
                    - paragraph [ref=e1184]: "-"
                  - cell "40h" [ref=e1185]
                  - cell "Aprovado" [ref=e1186]:
                    - paragraph [ref=e1189]: Aprovado
                  - cell "Emitido" [ref=e1190]:
                    - paragraph [ref=e1193]: Emitido
                  - cell "more_vert" [ref=e1194]:
                    - button "more_vert" [ref=e1198] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC6-w1-1782159747804-1 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1199]:
                  - cell [ref=e1200]:
                    - checkbox [ref=e1202]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1204]:
                    - generic [ref=e1206]:
                      - img [ref=e1209]
                      - paragraph [ref=e1211]:
                        - paragraph [ref=e1212]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC6-w1-1782159747804-1" [ref=e1213]:
                    - paragraph [ref=e1214]: QAKPIRT-TC6-w1-1782159747804-1
                  - cell "public Externo" [ref=e1215]:
                    - generic [ref=e1218]:
                      - generic [ref=e1219]: public
                      - paragraph [ref=e1220]: Externo
                  - cell "Richard Sebold" [ref=e1221]:
                    - paragraph [ref=e1222]: Richard Sebold
                  - cell "Curso" [ref=e1223]:
                    - paragraph [ref=e1224]: Curso
                  - cell "Alura" [ref=e1225]:
                    - paragraph [ref=e1227]: Alura
                  - cell "-" [ref=e1228]:
                    - paragraph [ref=e1230]: "-"
                  - cell "-" [ref=e1231]:
                    - paragraph [ref=e1233]: "-"
                  - cell "40h" [ref=e1234]
                  - cell "Aprovado" [ref=e1235]:
                    - paragraph [ref=e1238]: Aprovado
                  - cell "Emitido" [ref=e1239]:
                    - paragraph [ref=e1242]: Emitido
                  - cell "more_vert" [ref=e1243]:
                    - button "more_vert" [ref=e1247] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC6-w1-1782159747804-2 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1248]:
                  - cell [ref=e1249]:
                    - checkbox [ref=e1251]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1253]:
                    - generic [ref=e1255]:
                      - img [ref=e1258]
                      - paragraph [ref=e1260]:
                        - paragraph [ref=e1261]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC6-w1-1782159747804-2" [ref=e1262]:
                    - paragraph [ref=e1263]: QAKPIRT-TC6-w1-1782159747804-2
                  - cell "public Externo" [ref=e1264]:
                    - generic [ref=e1267]:
                      - generic [ref=e1268]: public
                      - paragraph [ref=e1269]: Externo
                  - cell "Richard Sebold" [ref=e1270]:
                    - paragraph [ref=e1271]: Richard Sebold
                  - cell "Curso" [ref=e1272]:
                    - paragraph [ref=e1273]: Curso
                  - cell "Alura" [ref=e1274]:
                    - paragraph [ref=e1276]: Alura
                  - cell "-" [ref=e1277]:
                    - paragraph [ref=e1279]: "-"
                  - cell "-" [ref=e1280]:
                    - paragraph [ref=e1282]: "-"
                  - cell "40h" [ref=e1283]
                  - cell "Aprovado" [ref=e1284]:
                    - paragraph [ref=e1287]: Aprovado
                  - cell "Emitido" [ref=e1288]:
                    - paragraph [ref=e1291]: Emitido
                  - cell "more_vert" [ref=e1292]:
                    - button "more_vert" [ref=e1296] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC5-w1-1782159715876 public Externo Richard Sebold Curso Alura - - 40h Aprovado Expirado more_vert" [ref=e1297]:
                  - cell [ref=e1298]:
                    - checkbox [ref=e1300]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1302]:
                    - generic [ref=e1304]:
                      - img [ref=e1307]
                      - paragraph [ref=e1309]:
                        - paragraph [ref=e1310]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC5-w1-1782159715876" [ref=e1311]:
                    - paragraph [ref=e1312]: QAKPIRT-TC5-w1-1782159715876
                  - cell "public Externo" [ref=e1313]:
                    - generic [ref=e1316]:
                      - generic [ref=e1317]: public
                      - paragraph [ref=e1318]: Externo
                  - cell "Richard Sebold" [ref=e1319]:
                    - paragraph [ref=e1320]: Richard Sebold
                  - cell "Curso" [ref=e1321]:
                    - paragraph [ref=e1322]: Curso
                  - cell "Alura" [ref=e1323]:
                    - paragraph [ref=e1325]: Alura
                  - cell "-" [ref=e1326]:
                    - paragraph [ref=e1328]: "-"
                  - cell "-" [ref=e1329]:
                    - paragraph [ref=e1331]: "-"
                  - cell "40h" [ref=e1332]
                  - cell "Aprovado" [ref=e1333]:
                    - paragraph [ref=e1336]: Aprovado
                  - cell "Expirado" [ref=e1337]:
                    - paragraph [ref=e1340]: Expirado
                  - cell "more_vert" [ref=e1341]:
                    - button "more_vert" [ref=e1345] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC4-w0-1782159682818 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1346]:
                  - cell [ref=e1347]:
                    - checkbox [ref=e1349]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1351]:
                    - generic [ref=e1353]:
                      - img [ref=e1356]
                      - paragraph [ref=e1358]:
                        - paragraph [ref=e1359]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC4-w0-1782159682818" [ref=e1360]:
                    - paragraph [ref=e1361]: QAKPIRT-TC4-w0-1782159682818
                  - cell "public Externo" [ref=e1362]:
                    - generic [ref=e1365]:
                      - generic [ref=e1366]: public
                      - paragraph [ref=e1367]: Externo
                  - cell "Richard Sebold" [ref=e1368]:
                    - paragraph [ref=e1369]: Richard Sebold
                  - cell "Curso" [ref=e1370]:
                    - paragraph [ref=e1371]: Curso
                  - cell "Alura" [ref=e1372]:
                    - paragraph [ref=e1374]: Alura
                  - cell "-" [ref=e1375]:
                    - paragraph [ref=e1377]: "-"
                  - cell "-" [ref=e1378]:
                    - paragraph [ref=e1380]: "-"
                  - cell "40h" [ref=e1381]
                  - cell "Aprovado" [ref=e1382]:
                    - paragraph [ref=e1385]: Aprovado
                  - cell "Emitido" [ref=e1386]:
                    - paragraph [ref=e1389]: Emitido
                  - cell "more_vert" [ref=e1390]:
                    - button "more_vert" [ref=e1394] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC3-w0-1782159660429 public Externo Richard Sebold Curso Alura - - 40h Aprovado Recusado more_vert" [ref=e1395]:
                  - cell [ref=e1396]:
                    - checkbox [ref=e1398]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1400]:
                    - generic [ref=e1402]:
                      - img [ref=e1405]
                      - paragraph [ref=e1407]:
                        - paragraph [ref=e1408]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC3-w0-1782159660429" [ref=e1409]:
                    - paragraph [ref=e1410]: QAKPIRT-TC3-w0-1782159660429
                  - cell "public Externo" [ref=e1411]:
                    - generic [ref=e1414]:
                      - generic [ref=e1415]: public
                      - paragraph [ref=e1416]: Externo
                  - cell "Richard Sebold" [ref=e1417]:
                    - paragraph [ref=e1418]: Richard Sebold
                  - cell "Curso" [ref=e1419]:
                    - paragraph [ref=e1420]: Curso
                  - cell "Alura" [ref=e1421]:
                    - paragraph [ref=e1423]: Alura
                  - cell "-" [ref=e1424]:
                    - paragraph [ref=e1426]: "-"
                  - cell "-" [ref=e1427]:
                    - paragraph [ref=e1429]: "-"
                  - cell "40h" [ref=e1430]
                  - cell "Aprovado" [ref=e1431]:
                    - paragraph [ref=e1434]: Aprovado
                  - cell "Recusado" [ref=e1435]:
                    - paragraph [ref=e1438]: Recusado
                  - cell "more_vert" [ref=e1439]:
                    - button "more_vert" [ref=e1443] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC2-w0-1782159639469 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1444]:
                  - cell [ref=e1445]:
                    - checkbox [ref=e1447]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1449]:
                    - generic [ref=e1451]:
                      - img [ref=e1454]
                      - paragraph [ref=e1456]:
                        - paragraph [ref=e1457]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC2-w0-1782159639469" [ref=e1458]:
                    - paragraph [ref=e1459]: QAKPIRT-TC2-w0-1782159639469
                  - cell "public Externo" [ref=e1460]:
                    - generic [ref=e1463]:
                      - generic [ref=e1464]: public
                      - paragraph [ref=e1465]: Externo
                  - cell "Richard Sebold" [ref=e1466]:
                    - paragraph [ref=e1467]: Richard Sebold
                  - cell "Curso" [ref=e1468]:
                    - paragraph [ref=e1469]: Curso
                  - cell "Alura" [ref=e1470]:
                    - paragraph [ref=e1472]: Alura
                  - cell "-" [ref=e1473]:
                    - paragraph [ref=e1475]: "-"
                  - cell "-" [ref=e1476]:
                    - paragraph [ref=e1478]: "-"
                  - cell "40h" [ref=e1479]
                  - cell "Aprovado" [ref=e1480]:
                    - paragraph [ref=e1483]: Aprovado
                  - cell "Emitido" [ref=e1484]:
                    - paragraph [ref=e1487]: Emitido
                  - cell "more_vert" [ref=e1488]:
                    - button "more_vert" [ref=e1492] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "dev teste devtestes@teste.com QAKPIRT-TC1-w0-1782159615873 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1493]:
                  - cell [ref=e1494]:
                    - checkbox [ref=e1496]
                  - cell "dev teste devtestes@teste.com" [ref=e1498]:
                    - generic [ref=e1500]:
                      - img [ref=e1503]
                      - paragraph [ref=e1505]:
                        - paragraph [ref=e1506]: dev teste
                        - text: devtestes@teste.com
                  - cell "QAKPIRT-TC1-w0-1782159615873" [ref=e1507]:
                    - paragraph [ref=e1508]: QAKPIRT-TC1-w0-1782159615873
                  - cell "public Externo" [ref=e1509]:
                    - generic [ref=e1512]:
                      - generic [ref=e1513]: public
                      - paragraph [ref=e1514]: Externo
                  - cell "Richard Sebold" [ref=e1515]:
                    - paragraph [ref=e1516]: Richard Sebold
                  - cell "Curso" [ref=e1517]:
                    - paragraph [ref=e1518]: Curso
                  - cell "Alura" [ref=e1519]:
                    - paragraph [ref=e1521]: Alura
                  - cell "-" [ref=e1522]:
                    - paragraph [ref=e1524]: "-"
                  - cell "-" [ref=e1525]:
                    - paragraph [ref=e1527]: "-"
                  - cell "40h" [ref=e1528]
                  - cell "Aprovado" [ref=e1529]:
                    - paragraph [ref=e1532]: Aprovado
                  - cell "Emitido" [ref=e1533]:
                    - paragraph [ref=e1536]: Emitido
                  - cell "more_vert" [ref=e1537]:
                    - button "more_vert" [ref=e1541] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159497828-3 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1542]:
                  - cell [ref=e1543]:
                    - checkbox [ref=e1545]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1547]:
                    - generic [ref=e1549]:
                      - img [ref=e1552]
                      - paragraph [ref=e1554]:
                        - paragraph [ref=e1555]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159497828-3" [ref=e1556]:
                    - paragraph [ref=e1557]: QAKPIRT-TC7-w1-1782159497828-3
                  - cell "public Externo" [ref=e1558]:
                    - generic [ref=e1561]:
                      - generic [ref=e1562]: public
                      - paragraph [ref=e1563]: Externo
                  - cell "Richard Sebold" [ref=e1564]:
                    - paragraph [ref=e1565]: Richard Sebold
                  - cell "Curso" [ref=e1566]:
                    - paragraph [ref=e1567]: Curso
                  - cell "Alura" [ref=e1568]:
                    - paragraph [ref=e1570]: Alura
                  - cell "-" [ref=e1571]:
                    - paragraph [ref=e1573]: "-"
                  - cell "-" [ref=e1574]:
                    - paragraph [ref=e1576]: "-"
                  - cell "40h" [ref=e1577]
                  - cell "Aprovado" [ref=e1578]:
                    - paragraph [ref=e1581]: Aprovado
                  - cell "Emitido" [ref=e1582]:
                    - paragraph [ref=e1585]: Emitido
                  - cell "more_vert" [ref=e1586]:
                    - button "more_vert" [ref=e1590] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159497828-4 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1591]:
                  - cell [ref=e1592]:
                    - checkbox [ref=e1594]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1596]:
                    - generic [ref=e1598]:
                      - img [ref=e1601]
                      - paragraph [ref=e1603]:
                        - paragraph [ref=e1604]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159497828-4" [ref=e1605]:
                    - paragraph [ref=e1606]: QAKPIRT-TC7-w1-1782159497828-4
                  - cell "public Externo" [ref=e1607]:
                    - generic [ref=e1610]:
                      - generic [ref=e1611]: public
                      - paragraph [ref=e1612]: Externo
                  - cell "Richard Sebold" [ref=e1613]:
                    - paragraph [ref=e1614]: Richard Sebold
                  - cell "Curso" [ref=e1615]:
                    - paragraph [ref=e1616]: Curso
                  - cell "Alura" [ref=e1617]:
                    - paragraph [ref=e1619]: Alura
                  - cell "-" [ref=e1620]:
                    - paragraph [ref=e1622]: "-"
                  - cell "-" [ref=e1623]:
                    - paragraph [ref=e1625]: "-"
                  - cell "40h" [ref=e1626]
                  - cell "Aprovado" [ref=e1627]:
                    - paragraph [ref=e1630]: Aprovado
                  - cell "Emitido" [ref=e1631]:
                    - paragraph [ref=e1634]: Emitido
                  - cell "more_vert" [ref=e1635]:
                    - button "more_vert" [ref=e1639] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159497828-5 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1640]:
                  - cell [ref=e1641]:
                    - checkbox [ref=e1643]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1645]:
                    - generic [ref=e1647]:
                      - img [ref=e1650]
                      - paragraph [ref=e1652]:
                        - paragraph [ref=e1653]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159497828-5" [ref=e1654]:
                    - paragraph [ref=e1655]: QAKPIRT-TC7-w1-1782159497828-5
                  - cell "public Externo" [ref=e1656]:
                    - generic [ref=e1659]:
                      - generic [ref=e1660]: public
                      - paragraph [ref=e1661]: Externo
                  - cell "Richard Sebold" [ref=e1662]:
                    - paragraph [ref=e1663]: Richard Sebold
                  - cell "Curso" [ref=e1664]:
                    - paragraph [ref=e1665]: Curso
                  - cell "Alura" [ref=e1666]:
                    - paragraph [ref=e1668]: Alura
                  - cell "-" [ref=e1669]:
                    - paragraph [ref=e1671]: "-"
                  - cell "-" [ref=e1672]:
                    - paragraph [ref=e1674]: "-"
                  - cell "40h" [ref=e1675]
                  - cell "Aprovado" [ref=e1676]:
                    - paragraph [ref=e1679]: Aprovado
                  - cell "Emitido" [ref=e1680]:
                    - paragraph [ref=e1683]: Emitido
                  - cell "more_vert" [ref=e1684]:
                    - button "more_vert" [ref=e1688] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
                - row "QA11 TC3 qa11tc342816@twygotest.com QAKPIRT-TC7-w1-1782159497828-6 public Externo Richard Sebold Curso Alura - - 40h Aprovado Emitido more_vert" [ref=e1689]:
                  - cell [ref=e1690]:
                    - checkbox [ref=e1692]
                  - cell "QA11 TC3 qa11tc342816@twygotest.com" [ref=e1694]:
                    - generic [ref=e1696]:
                      - img [ref=e1699]
                      - paragraph [ref=e1701]:
                        - paragraph [ref=e1702]: QA11 TC3
                        - text: qa11tc342816@twygotest.com
                  - cell "QAKPIRT-TC7-w1-1782159497828-6" [ref=e1703]:
                    - paragraph [ref=e1704]: QAKPIRT-TC7-w1-1782159497828-6
                  - cell "public Externo" [ref=e1705]:
                    - generic [ref=e1708]:
                      - generic [ref=e1709]: public
                      - paragraph [ref=e1710]: Externo
                  - cell "Richard Sebold" [ref=e1711]:
                    - paragraph [ref=e1712]: Richard Sebold
                  - cell "Curso" [ref=e1713]:
                    - paragraph [ref=e1714]: Curso
                  - cell "Alura" [ref=e1715]:
                    - paragraph [ref=e1717]: Alura
                  - cell "-" [ref=e1718]:
                    - paragraph [ref=e1720]: "-"
                  - cell "-" [ref=e1721]:
                    - paragraph [ref=e1723]: "-"
                  - cell "40h" [ref=e1724]
                  - cell "Aprovado" [ref=e1725]:
                    - paragraph [ref=e1728]: Aprovado
                  - cell "Emitido" [ref=e1729]:
                    - paragraph [ref=e1732]: Emitido
                  - cell "more_vert" [ref=e1733]:
                    - button "more_vert" [ref=e1737] [cursor=pointer]:
                      - generic:
                        - generic: more_vert
            - generic [ref=e1739]:
              - generic [ref=e1740]:
                - button "keyboard_double_arrow_left" [disabled] [ref=e1741]:
                  - generic [ref=e1742]: keyboard_double_arrow_left
                - button "chevron_left" [disabled] [ref=e1743]:
                  - generic [ref=e1744]: chevron_left
                - button "1" [ref=e1745] [cursor=pointer]
                - button "2" [ref=e1746] [cursor=pointer]
                - button "3" [ref=e1747] [cursor=pointer]
                - button "4" [ref=e1748] [cursor=pointer]
                - button "5" [ref=e1749] [cursor=pointer]
                - button "chevron_right" [ref=e1750] [cursor=pointer]:
                  - generic [ref=e1751]: chevron_right
              - generic [ref=e1752]:
                - combobox [ref=e1753]:
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
  - menu [ref=e1755]:
    - menuitem "edit Editar" [ref=e1756] [cursor=pointer]:
      - generic [ref=e1758]:
        - generic [ref=e1760]: edit
        - text: Editar
    - menuitem "delete Excluir" [active] [ref=e1761] [cursor=pointer]:
      - generic [ref=e1763]:
        - generic [ref=e1765]: delete
        - text: Excluir
    - menuitem "visibility Visualizar" [ref=e1766] [cursor=pointer]:
      - generic [ref=e1768]:
        - generic [ref=e1770]: visibility
        - text: Visualizar
    - menuitem "description Evidências" [ref=e1771] [cursor=pointer]:
      - generic [ref=e1773]:
        - generic [ref=e1775]: description
        - text: Evidências
    - menuitem "history Histórico" [ref=e1776] [cursor=pointer]:
      - generic [ref=e1778]:
        - generic [ref=e1780]: history
        - text: Histórico
  - generic:
    - generic [ref=e1781] [cursor=pointer]: edit
    - generic [ref=e1782] [cursor=pointer]: delete
    - generic [ref=e1783] [cursor=pointer]: visibility
    - generic [ref=e1784] [cursor=pointer]: description
    - generic [ref=e1785] [cursor=pointer]: history
  - generic:
    - generic [ref=e1786] [cursor=pointer]: edit
    - generic [ref=e1787] [cursor=pointer]: delete
    - generic [ref=e1788] [cursor=pointer]: visibility
    - generic [ref=e1789] [cursor=pointer]: description
    - generic [ref=e1790] [cursor=pointer]: history
  - generic:
    - generic [ref=e1791] [cursor=pointer]: rate_review
    - generic [ref=e1792] [cursor=pointer]: edit
    - generic [ref=e1793] [cursor=pointer]: delete
    - generic [ref=e1794] [cursor=pointer]: visibility
    - generic [ref=e1795] [cursor=pointer]: description
    - generic [ref=e1796] [cursor=pointer]: history
  - generic:
    - generic [ref=e1797] [cursor=pointer]: edit
    - generic [ref=e1798] [cursor=pointer]: delete
    - generic [ref=e1799] [cursor=pointer]: visibility
    - generic [ref=e1800] [cursor=pointer]: description
    - generic [ref=e1801] [cursor=pointer]: history
  - generic:
    - generic [ref=e1802] [cursor=pointer]: edit
    - generic [ref=e1803] [cursor=pointer]: delete
    - generic [ref=e1804] [cursor=pointer]: visibility
    - generic [ref=e1805] [cursor=pointer]: description
    - generic [ref=e1806] [cursor=pointer]: history
  - generic:
    - generic [ref=e1807] [cursor=pointer]: edit
    - generic [ref=e1808] [cursor=pointer]: delete
    - generic [ref=e1809] [cursor=pointer]: visibility
    - generic [ref=e1810] [cursor=pointer]: description
    - generic [ref=e1811] [cursor=pointer]: history
  - generic:
    - generic [ref=e1812] [cursor=pointer]: edit
    - generic [ref=e1813] [cursor=pointer]: delete
    - generic [ref=e1814] [cursor=pointer]: visibility
    - generic [ref=e1815] [cursor=pointer]: description
    - generic [ref=e1816] [cursor=pointer]: history
  - generic:
    - generic [ref=e1817] [cursor=pointer]: edit
    - generic [ref=e1818] [cursor=pointer]: delete
    - generic [ref=e1819] [cursor=pointer]: visibility
    - generic [ref=e1820] [cursor=pointer]: description
    - generic [ref=e1821] [cursor=pointer]: history
  - generic:
    - generic [ref=e1822] [cursor=pointer]: edit
    - generic [ref=e1823] [cursor=pointer]: delete
    - generic [ref=e1824] [cursor=pointer]: visibility
    - generic [ref=e1825] [cursor=pointer]: description
    - generic [ref=e1826] [cursor=pointer]: history
  - generic:
    - generic [ref=e1827] [cursor=pointer]: edit
    - generic [ref=e1828] [cursor=pointer]: delete
    - generic [ref=e1829] [cursor=pointer]: visibility
    - generic [ref=e1830] [cursor=pointer]: description
    - generic [ref=e1831] [cursor=pointer]: history
  - generic:
    - generic [ref=e1832] [cursor=pointer]: edit
    - generic [ref=e1833] [cursor=pointer]: delete
    - generic [ref=e1834] [cursor=pointer]: visibility
    - generic [ref=e1835] [cursor=pointer]: description
    - generic [ref=e1836] [cursor=pointer]: history
  - generic:
    - generic [ref=e1837] [cursor=pointer]: edit
    - generic [ref=e1838] [cursor=pointer]: delete
    - generic [ref=e1839] [cursor=pointer]: visibility
    - generic [ref=e1840] [cursor=pointer]: description
    - generic [ref=e1841] [cursor=pointer]: history
  - generic:
    - generic [ref=e1842] [cursor=pointer]: edit
    - generic [ref=e1843] [cursor=pointer]: delete
    - generic [ref=e1844] [cursor=pointer]: visibility
    - generic [ref=e1845] [cursor=pointer]: description
    - generic [ref=e1846] [cursor=pointer]: history
  - generic:
    - generic [ref=e1847] [cursor=pointer]: edit
    - generic [ref=e1848] [cursor=pointer]: delete
    - generic [ref=e1849] [cursor=pointer]: visibility
    - generic [ref=e1850] [cursor=pointer]: description
    - generic [ref=e1851] [cursor=pointer]: history
  - generic:
    - generic [ref=e1852] [cursor=pointer]: edit
    - generic [ref=e1853] [cursor=pointer]: delete
    - generic [ref=e1854] [cursor=pointer]: visibility
    - generic [ref=e1855] [cursor=pointer]: description
    - generic [ref=e1856] [cursor=pointer]: history
  - generic:
    - generic [ref=e1857] [cursor=pointer]: edit
    - generic [ref=e1858] [cursor=pointer]: delete
    - generic [ref=e1859] [cursor=pointer]: visibility
    - generic [ref=e1860] [cursor=pointer]: description
    - generic [ref=e1861] [cursor=pointer]: history
  - generic:
    - generic [ref=e1862] [cursor=pointer]: edit
    - generic [ref=e1863] [cursor=pointer]: delete
    - generic [ref=e1864] [cursor=pointer]: visibility
    - generic [ref=e1865] [cursor=pointer]: description
    - generic [ref=e1866] [cursor=pointer]: history
  - generic:
    - generic [ref=e1867] [cursor=pointer]: edit
    - generic [ref=e1868] [cursor=pointer]: delete
    - generic [ref=e1869] [cursor=pointer]: visibility
    - generic [ref=e1870] [cursor=pointer]: description
    - generic [ref=e1871] [cursor=pointer]: history
  - generic:
    - generic [ref=e1872] [cursor=pointer]: edit
    - generic [ref=e1873] [cursor=pointer]: delete
    - generic [ref=e1874] [cursor=pointer]: visibility
    - generic [ref=e1875] [cursor=pointer]: description
    - generic [ref=e1876] [cursor=pointer]: history
  - generic:
    - generic [ref=e1877] [cursor=pointer]: edit
    - generic [ref=e1878] [cursor=pointer]: delete
    - generic [ref=e1879] [cursor=pointer]: visibility
    - generic [ref=e1880] [cursor=pointer]: description
    - generic [ref=e1881] [cursor=pointer]: history
  - generic:
    - generic [ref=e1882] [cursor=pointer]: edit
    - generic [ref=e1883] [cursor=pointer]: delete
    - generic [ref=e1884] [cursor=pointer]: visibility
    - generic [ref=e1885] [cursor=pointer]: description
    - generic [ref=e1886] [cursor=pointer]: history
  - generic:
    - generic [ref=e1887] [cursor=pointer]: edit
    - generic [ref=e1888] [cursor=pointer]: delete
    - generic [ref=e1889] [cursor=pointer]: visibility
    - generic [ref=e1890] [cursor=pointer]: description
    - generic [ref=e1891] [cursor=pointer]: history
  - generic:
    - generic [ref=e1892] [cursor=pointer]: edit
    - generic [ref=e1893] [cursor=pointer]: delete
    - generic [ref=e1894] [cursor=pointer]: visibility
    - generic [ref=e1895] [cursor=pointer]: description
    - generic [ref=e1896] [cursor=pointer]: history
  - generic:
    - generic [ref=e1897] [cursor=pointer]: edit
    - generic [ref=e1898] [cursor=pointer]: delete
    - generic [ref=e1899] [cursor=pointer]: visibility
    - generic [ref=e1900] [cursor=pointer]: description
    - generic [ref=e1901] [cursor=pointer]: history
```

# Test source

```ts
  81  |     await expect(menu.getByRole('menuitem').first()).toBeVisible({ timeout: 8_000 });
  82  |     return menu;
  83  |   }
  84  | 
  85  |   async clickRowMenuItem(row: Locator, name: RegExp | string): Promise<void> {
  86  |     const menu = await this.openRowMenu(row);
  87  |     await menu.getByRole('menuitem', { name }).first().click();
  88  |   }
  89  | 
  90  |   // ---- Avaliar (Aprovar / Recusar) ----
  91  | 
  92  |   approveButton(): Locator {
  93  |     return this.page.getByTestId('record-form-approve-button');
  94  |   }
  95  | 
  96  |   rejectButton(): Locator {
  97  |     return this.page.getByTestId('record-form-reject-button');
  98  |   }
  99  | 
  100 |   /** Abre o form "Avaliar" da linha (rota `?mode=admin-avaliar`). */
  101 |   async openEvaluate(row: Locator): Promise<void> {
  102 |     await this.clickRowMenuItem(row, /Avaliar/);
  103 |     await this.page.waitForURL(/mode=admin-avaliar/, { timeout: 15_000 });
  104 |     await expect(this.approveButton()).toBeVisible({ timeout: 15_000 });
  105 |   }
  106 | 
  107 |   /** No form Avaliar, aprova o registro. Volta para a lista. */
  108 |   async approve(): Promise<void> {
  109 |     await this.approveButton().click();
  110 |     await this.page.waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), {
  111 |       timeout: 15_000,
  112 |     });
  113 |     await this.expectLoaded();
  114 |   }
  115 | 
  116 |   /** No form Avaliar, recusa com justificativa (modal "Recusar registro"). */
  117 |   async reject(justificativa: string): Promise<void> {
  118 |     await this.rejectButton().click();
  119 |     const modal = this.page
  120 |       .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
  121 |       .filter({ hasText: /Recusar registro/i })
  122 |       .first();
  123 |     await expect(modal).toBeVisible({ timeout: 10_000 });
  124 |     await modal.locator('textarea').first().fill(justificativa);
  125 |     await modal.getByRole('button', { name: /Recusar registro/i }).click();
  126 |     await expect(modal).toBeHidden({ timeout: 10_000 });
  127 |     await this.page
  128 |       .waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), { timeout: 15_000 })
  129 |       .catch(() => undefined);
  130 |     await this.expectLoaded();
  131 |   }
  132 | 
  133 |   // ---- Editar ----
  134 | 
  135 |   saveButton(): Locator {
  136 |     return this.page.getByTestId('record-form-save-button');
  137 |   }
  138 | 
  139 |   /** Abre o form de edição (kebab → Editar) e espera o form carregar. */
  140 |   async openEdit(row: Locator): Promise<void> {
  141 |     await this.clickRowMenuItem(row, /Editar/);
  142 |     await this.page.waitForURL(/\/edit/, { timeout: 15_000 });
  143 |     await expect(this.saveButton()).toBeVisible({ timeout: 15_000 });
  144 |   }
  145 | 
  146 |   /** Define a Data de validade (formato yyyy-mm-dd p/ input date) e salva. */
  147 |   async setExpirationAndSave(isoDate: string): Promise<void> {
  148 |     await this.page.locator('input[name="expirationDate"]').first().fill(isoDate);
  149 |     await this.saveButton().click();
  150 |     await this.page
  151 |       .waitForURL((u) => /\/records(\?|$)/.test(u.toString()) && !/\/edit/.test(u.toString()), { timeout: 15_000 })
  152 |       .catch(() => undefined);
  153 |     await this.expectLoaded();
  154 |   }
  155 | 
  156 |   // ---- Excluir ----
  157 | 
  158 |   /**
  159 |    * Exclui a linha: kebab → Excluir → modal de confirmação → botão de confirmar.
  160 |    * IMPORTANTE: só registros ELEGÍVEIS (Emitido/Recusado/Expirado) são
  161 |    * excluíveis — em Pendente o item "Excluir" fica desabilitado (com tooltip
  162 |    * explicativo) e nenhum click o aciona. Passe sempre uma linha elegível.
  163 |    */
  164 |   async deleteRow(row: Locator): Promise<void> {
  165 |     const menu = await this.openRowMenu(row);
  166 |     // O menuitem "Excluir" tem um tooltip que sobrepõe e intercepta o pointer
  167 |     // (click real não chega ao handler; dispatchEvent só de 'click' também não
  168 |     // dispara — o handler reage à sequência de pointer). Escondemos tooltips
  169 |     // (e o chat widget) via CSS p/ o click real cair no item — padrão hideChatWidget.
  170 |     await this.page
  171 |       .addStyleTag({
  172 |         content:
  173 |           '[role="tooltip"], .chakra-tooltip, #hubspot-messages-iframe-container { display:none !important; pointer-events:none !important; }',
  174 |       })
  175 |       .catch(() => undefined);
  176 |     await menu.getByRole('menuitem', { name: /Excluir/ }).first().click();
  177 |     const modal = this.page
  178 |       .locator('[role="alertdialog"], [role="dialog"], .chakra-modal__content')
  179 |       .filter({ hasText: /Excluir registro|desfeita|Tem certeza|Confirmação/i })
  180 |       .first();
> 181 |     await expect(modal).toBeVisible({ timeout: 10_000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  182 |     await modal.getByRole('button', { name: /^Excluir$|Confirmar/i }).first().click();
  183 |     await expect(modal).toBeHidden({ timeout: 10_000 });
  184 |   }
  185 | 
  186 |   // ---- Ações em massa ----
  187 | 
  188 |   rowCheckbox(row: Locator): Locator {
  189 |     return row.locator('input[type="checkbox"]').first();
  190 |   }
  191 | 
  192 |   async selectRow(row: Locator): Promise<void> {
  193 |     await this.rowCheckbox(row).check({ force: true });
  194 |   }
  195 | 
  196 |   /**
  197 |    * Seleciona até `count` linhas de registros já Emitidos (situação "Emitido"),
  198 |    * excluindo as que contêm `excludeMarker`. Usado no batch parcial (TC7): esses
  199 |    * registros são INELEGÍVEIS para "Aprovar" → entram no ratio "ignorados" sem
  200 |    * sofrer mutação. Devolve quantas linhas foram efetivamente marcadas.
  201 |    */
  202 |   async selectEmittedRows(count: number, excludeMarker: string): Promise<number> {
  203 |     const rows = this.page
  204 |       .locator('table tbody tr')
  205 |       .filter({ hasText: /Emitido/i })
  206 |       .filter({ hasNotText: excludeMarker });
  207 |     const total = await rows.count();
  208 |     const pick = Math.min(count, total);
  209 |     for (let i = 0; i < pick; i++) await this.selectRow(rows.nth(i));
  210 |     return pick;
  211 |   }
  212 | 
  213 |   batchButton(): Locator {
  214 |     return this.page.getByRole('button', { name: /Ações em massa/i });
  215 |   }
  216 | 
  217 |   batchDrawer(): Locator {
  218 |     return this.page.locator('.chakra-modal__content.chakra-slide');
  219 |   }
  220 | 
  221 |   async openBatchDrawer(): Promise<void> {
  222 |     await this.batchButton().click();
  223 |     await expect(this.batchDrawer()).toBeVisible({ timeout: 10_000 });
  224 |   }
  225 | 
  226 |   /**
  227 |    * No drawer de ações em massa: seleciona "Aprovar registros" (campo "Ação" é
  228 |    * <select> nativo, obrigatório e SEM default), garante o escopo "Selecionados",
  229 |    * clica "Executar" e confirma no modal "Confirmação de ação em massa".
  230 |    *
  231 |    * A aprovação em massa é ASSÍNCRONA: o produto emite toasts genéricos
  232 |    * ("Registros aprovados em andamento" → "Ação em massa concluída"), NÃO um
  233 |    * toast com o ratio "N aprovados (M ignorados)" que a AT supunha. Por isso a
  234 |    * validação real é o DELTA do KPI (feita no spec); aqui só disparamos a ação e
  235 |    * esperamos a conclusão. Devolve o texto do(s) toast(s).
  236 |    * (UI usa "Executar"; a AT diz "Aplicar" — divergência registrada no recon.)
  237 |    */
  238 |   async applyBatchApprove(): Promise<string> {
  239 |     const drawer = this.batchDrawer();
  240 |     const select = drawer.locator('select').first();
  241 |     const labels = await select.locator('option').allInnerTexts();
  242 |     const target = labels.find((l) => /aprovar/i.test(l));
  243 |     if (target) await select.selectOption({ label: target });
  244 |     const scope = drawer.getByText('Selecionados', { exact: false }).first();
  245 |     if (await scope.isVisible().catch(() => false)) await scope.click().catch(() => undefined);
  246 |     await drawer.getByRole('button', { name: /Executar|Aplicar/i }).click();
  247 |     const confirm = this.page
  248 |       .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
  249 |       .filter({ hasText: /Confirmação de ação em massa|Tem certeza/i })
  250 |       .first();
  251 |     if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) {
  252 |       await confirm.getByRole('button', { name: /Confirmar/i }).click();
  253 |     }
  254 |     // Toast de disparo (em andamento) e, quando aparecer, o de conclusão.
  255 |     const toast = this.getToast(/aprovad|andamento|conclu/i);
  256 |     await expect(toast).toBeVisible({ timeout: 15_000 });
  257 |     const done = this.getToast(/conclu/i);
  258 |     await done.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => undefined);
  259 |     return (await this.page.locator('.chakra-toast').allInnerTexts().catch(() => []))
  260 |       .join(' | ')
  261 |       .replace(/\s+/g, ' ')
  262 |       .trim();
  263 |   }
  264 | 
  265 |   // ---- Form Adicionar (UI create — usado pelo TC1) ----
  266 | 
  267 |   /** Clica "Adicionar" na lista e espera o form de novo registro carregar. */
  268 |   async openAddForm(): Promise<void> {
  269 |     await this.page.getByRole('button', { name: /^Adicionar$/ }).first().click();
  270 |     await this.page.waitForURL(/\/records\/new/, { timeout: 15_000 });
  271 |     await expect(this.saveButton()).toBeVisible({ timeout: 15_000 });
  272 |   }
  273 | 
  274 |   /** Seleciona uma pessoa pelo drawer "Vincular pessoas" (busca + 1º resultado). */
  275 |   private async pickPerson(query: string): Promise<void> {
  276 |     await this.page.getByTestId('people-selector-input').click();
  277 |     const search = this.page.getByTestId('resource-selector-drawer-search-input');
  278 |     await search.waitFor({ timeout: 10_000 });
  279 |     await search.fill(query);
  280 |     const firstCheckbox = this.page.locator('[data-test-id^="people-selector-checkbox-"]').first();
  281 |     await expect(firstCheckbox).toBeVisible({ timeout: 10_000 });
```