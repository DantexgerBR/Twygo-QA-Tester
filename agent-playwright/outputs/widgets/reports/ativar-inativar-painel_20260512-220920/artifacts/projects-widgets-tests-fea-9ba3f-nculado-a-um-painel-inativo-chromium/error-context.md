# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\ativar-inativar-painel\tentar-reativar-modo-uso-painel-inativo.spec.ts >> Ativar / Inativar painel >> Tentar reativar modo de uso vinculado a um painel inativo
- Location: projects\widgets\tests\features\ativar-inativar-painel\tentar-reativar-modo-uso-painel-inativo.spec.ts:124:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - widgets [36988]" [ref=e4]:
        - img "Logo - widgets [36988]" [ref=e5]
      - img [ref=e7]
    - generic [ref=e9]:
      - list [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - link "leaderboard Dashboard" [ref=e13] [cursor=pointer]:
              - /url: /o/36988/dashboard
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
                  - /url: /o/36988/events?tab=events
                  - generic [ref=e28]:
                    - generic [ref=e30]: format_list_bulleted_add
                    - generic [ref=e31]: Conteúdos
              - listitem [ref=e32]:
                - link "send Compartilhamentos" [ref=e33] [cursor=pointer]:
                  - /url: /o/36988/shared_events
                  - generic [ref=e34]:
                    - generic [ref=e36]: send
                    - generic [ref=e37]: Compartilhamentos
              - listitem [ref=e38]:
                - link "description Registros BETA" [ref=e39] [cursor=pointer]:
                  - /url: /o/36988/records
                  - generic [ref=e40]:
                    - generic [ref=e42]: description
                    - generic [ref=e43]: Registros
                    - generic [ref=e44]: BETA
              - listitem [ref=e45]:
                - link "workspace_premium Certificados" [ref=e46] [cursor=pointer]:
                  - /url: /o/36988/certificate_models
                  - generic [ref=e47]:
                    - generic [ref=e49]: workspace_premium
                    - generic [ref=e50]: Certificados
          - listitem [ref=e51]:
            - link "group Usuários" [ref=e52] [cursor=pointer]:
              - /url: /o/36988/users
              - generic [ref=e53]:
                - generic [ref=e55]: group
                - generic [ref=e56]: Usuários
          - listitem [ref=e57]:
            - link "work Empresas" [ref=e58] [cursor=pointer]:
              - /url: /o/36988/companies
              - generic [ref=e59]:
                - generic [ref=e61]: work
                - generic [ref=e62]: Empresas
          - listitem [ref=e63]:
            - link "live_help Questionários" [ref=e64] [cursor=pointer]:
              - /url: /o/36988/question_lists
              - generic [ref=e65]:
                - generic [ref=e67]: live_help
                - generic [ref=e68]: Questionários
          - listitem [ref=e69]:
            - link "groups Comunidades" [ref=e70] [cursor=pointer]:
              - /url: /o/36988/feed
              - generic [ref=e71]:
                - generic [ref=e73]: groups
                - generic [ref=e74]: Comunidades
          - listitem [ref=e75]:
            - generic [ref=e77]:
              - generic [ref=e80]: psychology
              - generic [ref=e81]:
                - text: Skills
                - generic [ref=e82]: BETA
            - list [ref=e83]:
              - listitem [ref=e84]:
                - link "lan Organograma" [ref=e85] [cursor=pointer]:
                  - /url: /o/36988/organization_chart
                  - generic [ref=e86]:
                    - generic [ref=e88]: lan
                    - generic [ref=e89]: Organograma
              - listitem [ref=e90]:
                - link "badge Funções" [ref=e91] [cursor=pointer]:
                  - /url: /o/36988/roles
                  - generic [ref=e92]:
                    - generic [ref=e94]: badge
                    - generic [ref=e95]: Funções
              - listitem [ref=e96]:
                - link "award_star Competências" [ref=e97] [cursor=pointer]:
                  - /url: /o/36988/organization_chart_competencies
                  - generic [ref=e98]:
                    - generic [ref=e100]: award_star
                    - generic [ref=e101]: Competências
          - listitem [ref=e102]:
            - generic [ref=e104]:
              - generic [ref=e107]: account_tree
              - generic [ref=e108]: Processos
            - list [ref=e109]:
              - listitem [ref=e110]:
                - link "send Repositórios" [ref=e111] [cursor=pointer]:
                  - /url: /o/36988/organization_datasets
                  - generic [ref=e112]:
                    - generic [ref=e114]: send
                    - generic [ref=e115]: Repositórios
              - listitem [ref=e116]:
                - link "send Arquitetura de Processos" [ref=e117] [cursor=pointer]:
                  - /url: /o/36988/process_architecture
                  - generic [ref=e118]:
                    - generic [ref=e120]: send
                    - generic [ref=e121]: Arquitetura de Processos
              - listitem [ref=e122]:
                - link "send Agente de Documentação" [ref=e123] [cursor=pointer]:
                  - /url: /o/36988/process_documentations
                  - generic [ref=e124]:
                    - generic [ref=e126]: send
                    - generic [ref=e127]: Agente de Documentação
              - listitem [ref=e128]:
                - link "send Documentos de Referência" [ref=e129] [cursor=pointer]:
                  - /url: /o/36988/reference_documents
                  - generic [ref=e130]:
                    - generic [ref=e132]: send
                    - generic [ref=e133]: Documentos de Referência
              - listitem [ref=e134]:
                - link "send Portal de processos" [ref=e135] [cursor=pointer]:
                  - /url: /o/36988/visualize_documentations
                  - generic [ref=e136]:
                    - generic [ref=e138]: send
                    - generic [ref=e139]: Portal de processos
      - generic [ref=e140]: widgets [36988]
      - list [ref=e141]:
        - listitem [ref=e142]:
          - generic [ref=e143]:
            - generic [ref=e144]: f
            - text: Configurações
          - list [ref=e145]:
            - listitem [ref=e146]:
              - link "e Organização" [ref=e147] [cursor=pointer]:
                - /url: /o/36988/edit
                - generic [ref=e148]: e
                - text: Organização
            - listitem [ref=e149]:
              - link " Menu" [ref=e150] [cursor=pointer]:
                - /url: /o/36988/use_modes
                - generic [ref=e151]: 
                - text: Menu
            - listitem [ref=e152]:
              - link "electrical_services Integrações" [ref=e153] [cursor=pointer]:
                - /url: /o/36988/integrations
                - generic [ref=e154]: electrical_services
                - text: Integrações
            - listitem [ref=e155]:
              - link "flash_auto Piloto automático" [ref=e156] [cursor=pointer]:
                - /url: /o/36988/autopilots
                - generic [ref=e157]: flash_auto
                - text: Piloto automático
            - listitem [ref=e158]:
              - link " Regras do Jogo" [ref=e159] [cursor=pointer]:
                - /url: /o/36988/game_rules
                - generic [ref=e160]: 
                - text: Regras do Jogo
            - listitem [ref=e161]:
              - link " Comunicação" [ref=e162] [cursor=pointer]:
                - /url: /o/36988/communication
                - generic [ref=e163]: 
                - text: Comunicação
            - listitem [ref=e164]:
              - link "sell Cobrança de inscrição" [ref=e165] [cursor=pointer]:
                - /url: /o/36988/payments
                - generic [ref=e166]: sell
                - text: Cobrança de inscrição
            - listitem [ref=e167]:
              - link "credit_card Plano e assinatura" [ref=e168] [cursor=pointer]:
                - /url: /o/36988/subscription_plans
                - generic [ref=e169]: credit_card
                - text: Plano e assinatura
            - text: s
            - listitem [ref=e170]:
              - link " Segurança NOVO" [ref=e171] [cursor=pointer]:
                - /url: /o/36988/security
                - generic [ref=e172]: 
                - text: Segurança NOVO
            - listitem [ref=e173]:
              - link "smart_toy Controle de IA BETA" [ref=e174] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e175]: smart_toy
                - text: Controle de IA BETA
            - listitem [ref=e176]:
              - link "palette Aparência" [ref=e177] [cursor=pointer]:
                - /url: /o/36988/appearance
                - generic [ref=e178]: palette
                - text: Aparência
            - listitem [ref=e179]:
              - link "smart_toy Controle de IA BETA" [ref=e180] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e181]: smart_toy
                - text: Controle de IA BETA
    - generic [ref=e184]:
      - generic [ref=e185]:
        - img [ref=e186]
        - text: Claude Agents
      - img [ref=e188]
  - text: "0"
  - generic [ref=e191]:
    - generic "Logo - widgets [36988]" [ref=e193]:
      - link "Logo - widgets [36988]" [ref=e194] [cursor=pointer]:
        - /url: /o/36988/dashboard
        - img "Logo - widgets [36988]" [ref=e195]
    - generic [ref=e199]:
      - link "Open chat" [ref=e203] [cursor=pointer]:
        - /url: /o/36988/chats
        - button "Open chat" [ref=e204]:
          - img [ref=e205]
      - button "Users" [ref=e212] [cursor=pointer]:
        - img [ref=e213]
      - generic [ref=e216]:
        - link "7089491 - Claude Agents" [ref=e217] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e218]: Claude Agents
      - button "Administrador G" [ref=e219] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e220]: G
    - text: M * * M * *
  - generic [ref=e221]:
    - generic [ref=e231]:
      - generic [ref=e232]:
        - paragraph [ref=e233]: Você está no modo BETA da funcionalidade Controle de créditos de IA. Essa funcionalidade estará disponível para você até dia 22/05.
        - paragraph [ref=e234]: Quer mais detalhes sobre essa novidade? Veja aqui
      - button "Responder pesquisa" [ref=e236] [cursor=pointer]
      - button "Close" [ref=e237] [cursor=pointer]:
        - img [ref=e238]
    - generic [ref=e241]:
      - generic [ref=e243]:
        - list [ref=e244]:
          - list [ref=e245]:
            - listitem [ref=e246] [cursor=pointer]:
              - link "leaderboard Dashboard" [ref=e247]:
                - /url: /o/36988/dashboard
                - generic [ref=e248]:
                  - generic [ref=e250]: leaderboard
                  - generic [ref=e251]: Dashboard
            - listitem [ref=e252] [cursor=pointer]:
              - generic [ref=e254]:
                - generic [ref=e257]: school
                - generic [ref=e258]: Aprendizagem
                - generic [ref=e260]: G
            - listitem [ref=e261] [cursor=pointer]:
              - link "group Usuários" [ref=e262]:
                - /url: /o/36988/users
                - generic [ref=e263]:
                  - generic [ref=e265]: group
                  - generic [ref=e266]: Usuários
            - listitem [ref=e267] [cursor=pointer]:
              - link "work Empresas" [ref=e268]:
                - /url: /o/36988/companies
                - generic [ref=e269]:
                  - generic [ref=e271]: work
                  - generic [ref=e272]: Empresas
            - listitem [ref=e273] [cursor=pointer]:
              - link "live_help Questionários" [ref=e274]:
                - /url: /o/36988/question_lists
                - generic [ref=e275]:
                  - generic [ref=e277]: live_help
                  - generic [ref=e278]: Questionários
            - listitem [ref=e279] [cursor=pointer]:
              - link "groups Comunidades" [ref=e280]:
                - /url: /o/36988/feed
                - generic [ref=e281]:
                  - generic [ref=e283]: groups
                  - generic [ref=e284]: Comunidades
            - listitem [ref=e285] [cursor=pointer]:
              - generic [ref=e287]:
                - generic [ref=e290]: psychology
                - generic [ref=e291]:
                  - text: Skills
                  - generic [ref=e292]: BETA
                - generic [ref=e294]: G
            - listitem [ref=e295] [cursor=pointer]:
              - generic [ref=e297]:
                - generic [ref=e300]: account_tree
                - generic [ref=e301]: Processos
                - generic [ref=e303]: G
        - generic [ref=e305]: widgets [36988]
        - list [ref=e306]:
          - listitem [ref=e307] [cursor=pointer]:
            - generic [ref=e308]:
              - generic [ref=e309]: f
              - text: Configurações
              - generic [ref=e310]: G
            - text: e    s 
      - generic [ref=e312]:
        - generic [ref=e315]: Menu > Modo de uso > Editar modo de uso
        - generic [ref=e323]:
          - generic [ref=e324]:
            - button "Voltar" [ref=e326] [cursor=pointer]:
              - img [ref=e328]
              - text: Voltar
            - heading "Colaborador" [level=2] [ref=e331]
          - generic [ref=e333]:
            - tablist [ref=e334]:
              - tab "Identificação" [ref=e335] [cursor=pointer]
              - tab "Menu" [selected] [ref=e336] [cursor=pointer]
              - tab "Acesso" [ref=e337] [cursor=pointer]
              - tab "Feriados" [ref=e338] [cursor=pointer]
            - tabpanel "Menu" [ref=e340]:
              - generic [ref=e341]:
                - button "Adicionar" [ref=e343] [cursor=pointer]:
                  - img [ref=e345]
                  - text: Adicionar
                - table [ref=e347]:
                  - rowgroup [ref=e348]:
                    - row "Menus exibidos Modelo de página Página inicial Menu habilitado" [ref=e349]:
                      - columnheader [ref=e350]
                      - columnheader "Menus exibidos" [ref=e351]:
                        - generic [ref=e352]: Menus exibidos
                      - columnheader "Modelo de página" [ref=e353]:
                        - generic [ref=e354]: Modelo de página
                      - columnheader "Página inicial" [ref=e355]:
                        - generic [ref=e356]:
                          - text: Página inicial
                          - img [ref=e358]
                      - columnheader "Menu habilitado" [ref=e360]:
                        - generic [ref=e361]:
                          - text: Menu habilitado
                          - img [ref=e363]
                      - columnheader [ref=e365]
                  - rowgroup [ref=e366]:
                    - row "leaderboard Dashboard Dashboard edit Delete" [ref=e367]:
                      - cell [ref=e368]:
                        - img [ref=e369]
                      - cell "leaderboard Dashboard" [ref=e371]:
                        - generic [ref=e372]:
                          - generic [ref=e373]: leaderboard
                          - paragraph [ref=e374]: Dashboard
                      - cell "Dashboard" [ref=e375]
                      - cell [ref=e376]:
                        - radio [checked] [ref=e378]
                      - cell [ref=e380]:
                        - checkbox [checked] [disabled] [ref=e382]
                      - cell "edit Delete" [ref=e385]:
                        - generic [ref=e386]:
                          - generic [ref=e389] [cursor=pointer]: edit
                          - generic [ref=e392] [cursor=pointer]: Delete
                    - row "analytics Equipe Equipe edit Delete" [ref=e393]:
                      - cell [ref=e394]:
                        - img [ref=e395]
                      - cell "analytics Equipe" [ref=e397]:
                        - generic [ref=e398]:
                          - generic [ref=e399]: analytics
                          - paragraph [ref=e400]: Equipe
                      - cell "Equipe" [ref=e401]
                      - cell [ref=e402]:
                        - radio [ref=e404]
                      - cell [ref=e406]:
                        - checkbox [checked] [ref=e408]
                      - cell "edit Delete" [ref=e411]:
                        - generic [ref=e412]:
                          - generic [ref=e415] [cursor=pointer]: edit
                          - generic [ref=e418] [cursor=pointer]: Delete
                    - row "menu_book Meus Cursos Meus Cursos edit Delete" [ref=e419]:
                      - cell [ref=e420]:
                        - img [ref=e421]
                      - cell "menu_book Meus Cursos" [ref=e423]:
                        - generic [ref=e424]:
                          - generic [ref=e425]: menu_book
                          - paragraph [ref=e426]: Meus Cursos
                      - cell "Meus Cursos" [ref=e427]
                      - cell [ref=e428]:
                        - radio [ref=e430]
                      - cell [ref=e432]:
                        - checkbox [checked] [ref=e434]
                      - cell "edit Delete" [ref=e437]:
                        - generic [ref=e438]:
                          - generic [ref=e441] [cursor=pointer]: edit
                          - generic [ref=e444] [cursor=pointer]: Delete
                    - row "play_circle Catálogo de conteúdos Catálogo de conteúdos edit Delete" [ref=e445]:
                      - cell [ref=e446]:
                        - img [ref=e447]
                      - cell "play_circle Catálogo de conteúdos" [ref=e449]:
                        - generic [ref=e450]:
                          - generic [ref=e451]: play_circle
                          - paragraph [ref=e452]: Catálogo de conteúdos
                      - cell "Catálogo de conteúdos" [ref=e453]
                      - cell [ref=e454]:
                        - radio [ref=e456]
                      - cell [ref=e458]:
                        - checkbox [ref=e460]
                      - cell "edit Delete" [ref=e463]:
                        - generic [ref=e464]:
                          - generic [ref=e467] [cursor=pointer]: edit
                          - generic [ref=e470] [cursor=pointer]: Delete
                    - row "more_horiz Minhas Trilhas Minhas Trilhas edit Delete" [ref=e471]:
                      - cell [ref=e472]:
                        - img [ref=e473]
                      - cell "more_horiz Minhas Trilhas" [ref=e475]:
                        - generic [ref=e476]:
                          - generic [ref=e477]: more_horiz
                          - paragraph [ref=e478]: Minhas Trilhas
                      - cell "Minhas Trilhas" [ref=e479]
                      - cell [ref=e480]:
                        - radio [ref=e482]
                      - cell [ref=e484]:
                        - checkbox [checked] [ref=e486]
                      - cell "edit Delete" [ref=e489]:
                        - generic [ref=e490]:
                          - generic [ref=e493] [cursor=pointer]: edit
                          - generic [ref=e496] [cursor=pointer]: Delete
                    - row "groups Comunidades Comunidades edit Delete" [ref=e497]:
                      - cell [ref=e498]:
                        - img [ref=e499]
                      - cell "groups Comunidades" [ref=e501]:
                        - generic [ref=e502]:
                          - generic [ref=e503]: groups
                          - paragraph [ref=e504]: Comunidades
                      - cell "Comunidades" [ref=e505]
                      - cell [ref=e506]:
                        - radio [ref=e508]
                      - cell [ref=e510]:
                        - checkbox [checked] [ref=e512]
                      - cell "edit Delete" [ref=e515]:
                        - generic [ref=e516]:
                          - generic [ref=e519] [cursor=pointer]: edit
                          - generic [ref=e522] [cursor=pointer]: Delete
                    - row "analytics painel inativo Painéis do usuário edit Delete" [ref=e523]:
                      - cell [ref=e524]:
                        - img [ref=e525]
                      - cell "analytics painel inativo" [ref=e527]:
                        - generic [ref=e528]:
                          - generic [ref=e529]: analytics
                          - paragraph [ref=e530]: painel inativo
                      - cell "Painéis do usuário" [ref=e531]
                      - cell [ref=e532]:
                        - radio [ref=e534]
                      - cell [ref=e536]:
                        - checkbox [ref=e538]
                      - cell "edit Delete" [ref=e541]:
                        - generic [ref=e542]:
                          - generic [ref=e545] [cursor=pointer]: edit
                          - generic [ref=e548] [cursor=pointer]: Delete
                - generic [ref=e549]:
                  - button "Salvar" [active] [ref=e550] [cursor=pointer]
                  - button "Cancelar" [ref=e551] [cursor=pointer]
  - region "Widget de chat" [ref=e552]:
    - iframe [ref=e553]:
      - generic [ref=f34e2]:
        - generic [ref=f34e6]:
          - button "Abrir chat ao vivo" [ref=f34e7]:
            - img "Avatar de Sophia" [ref=f34e12]
            - generic [ref=f34e13]: Estamos prontos para te atender no que você precisar, viu?! 🤩
          - button "Fechar página de boas-vindas" [ref=f34e14]:
            - img [ref=f34e16]
        - button "Abrir chat ao vivo" [ref=f34e23]:
          - img [ref=f34e26]
          - img [ref=f34e33]
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
  778 |    * Versão tolerante a falhas — não estoura se o painel já foi deletado ou
  779 |    * nunca foi criado. Usado em `afterAll` para cleanup robusto: se o teste
  780 |    * falhou antes de criar o painel, o cleanup vira no-op em vez de
  781 |    * mascarar o erro original do teste.
  782 |    */
  783 |   async deletePanelByNameSafe(name: string): Promise<void> {
  784 |     try {
  785 |       await this.setViewMode('lista');
  786 |       const row = this.getRowByName(name);
  787 |       const exists = (await row.count()) > 0;
  788 |       if (!exists) {
  789 |         // eslint-disable-next-line no-console -- diagnóstico em afterAll
  790 |         console.warn(`[deletePanelByNameSafe] painel "${name}" não existe — cleanup no-op`);
  791 |         return;
  792 |       }
  793 |       await this.deletePanelByName(name);
  794 |     } catch (err) {
  795 |       // eslint-disable-next-line no-console -- diagnóstico em afterAll
  796 |       console.warn(
  797 |         `[deletePanelByNameSafe] falha ao deletar "${name}": ${(err as Error).message}`,
  798 |       );
  799 |     }
  800 |   }
  801 | 
  802 |   // ---------- Associação painel↔menu de modo de uso (TC3) ----------
  803 |   // Validado live 2026-05-06 (após deploy da opção "Painéis do usuário" no
  804 |   // `<select id="page_model">`). Estrutura do form de novo item de menu:
  805 |   // - URL: /o/{orgId}/use_modes/{useModeId}/use_mode_itens/new
  806 |   // - Campo Nome: `<input id="title" placeholder="Nome do menu">` (obrigatório)
  807 |   // - Campo Ícone: grid de `<i class="material-symbols-outlined">` — ícone
  808 |   //   default é selecionado automaticamente pelo backend (não precisa clicar)
  809 |   //   se o usuário não escolher; campo é obrigatório por label mas o submit
  810 |   //   passa sem click manual no item.
  811 |   // - Campo Modelo de página: `<select id="page_model">` com option
  812 |   //   `value="user_panels"` (texto "Painéis do usuário") — última posição.
  813 |   // - Quando page_model="user_panels": aparece group "Espaço*" com
  814 |   //   react-select de container `#panel` e input `input[id^="react-select-"][id$="-input"]`.
  815 |   //   Filtro client-side por substring; opções têm id `react-select-{N}-option-{idx}`.
  816 |   // - Salvar: botão `#use-model-submit` (texto "Salvar") faz POST e
  817 |   //   redireciona para `/use_modes/{useModeId}/edit?tab=items`.
  818 |   //
  819 |   // Disassociação = excluir o item de menu via ícone Delete da row do item:
  820 |   // - Row na tabela de items tem `data-item-name="{itemName}"`.
  821 |   // - Ícone Delete: `<span class="material-symbols-outlined">Delete</span>` na
  822 |   //   última coluna da row (texto literal "Delete", não "delete" minúsculo —
  823 |   //   é o nome do ícone Material Symbols).
  824 |   // - Click abre `<div role="alertdialog">` com `#modal-delete-confirm`
  825 |   //   (texto "Excluir") e `#modal-delete-cancel`.
  826 | 
  827 |   /**
  828 |    * Cria item de menu vinculado ao painel `panelName` no modo de uso
  829 |    * `useModeId`. Se `itemName` não for fornecido, gera baseado no panelName.
  830 |    *
  831 |    * Pré-condição: painel `panelName` já existe e está ativo. Se o nome não
  832 |    * for único, o react-select pode resolver a primeira ocorrência — caller
  833 |    * deve garantir unicidade (TC3 usa nome worker-isolated com timestamp).
  834 |    */
  835 |   async associatePanelToMenu(
  836 |     panelName: string,
  837 |     useModeId: number,
  838 |     itemName?: string,
  839 |   ): Promise<void> {
  840 |     const finalItemName = itemName ?? `Item ${panelName}`;
  841 |     await this.page.goto(
  842 |       `/o/${getOrgId()}/use_modes/${useModeId}/use_mode_itens/new`,
  843 |     );
  844 |     // Mesmo motivo de openNewPanelForm: NPS pode interceptar o submit
  845 |     // (`#use-model-submit`) via chakra-portal. Ver skill `fechar-modais-twygo`.
  846 |     await dismissCommonModals(this.page);
  847 |     await this.getMenuItemNameInput().waitFor();
  848 |     await this.getMenuItemNameInput().fill(finalItemName);
  849 |     await this.getMenuItemPageModelSelect().selectOption('user_panels');
  850 |     // O react-select container `#panel` só renderiza após page_model="user_panels".
  851 |     // Aguardamos visibilidade antes de clicar — sem waitForTimeout (regra dura #1).
  852 |     await this.getMenuItemPanelChooser().waitFor();
  853 |     await this.getMenuItemPanelChooser().click();
  854 |     // Filtro client-side: digitar o nome do painel restringe options ao alvo.
  855 |     await this.getMenuItemPanelChooserInput().fill(panelName);
  856 |     // A primeira (e única, pós-filtro) option tem id `react-select-{N}-option-0`.
  857 |     // O `{N}` é dinâmico (incrementa por mount do react-select); ancoramos pelo
  858 |     // suffix `-option-0` em qualquer combobox aberto.
  859 |     await this.page.locator('[id^="react-select-"][id$="-option-0"]').first().click();
  860 |     await this.getMenuItemSubmitButton().click();
  861 |     // Produto pode exibir modal "Modelo de página duplicado" se o useMode já
  862 |     // tem outro item usando page_model="user_panels" (cenário típico quando
  863 |     // TC3 e TC4 rodam na mesma suite, OU quando o env acumulou orphans de
  864 |     // execuções anteriores). Aceitamos clicando no botão de confirmação.
  865 |     // Selector: button id prefix `duplicated-page-` (confirmado via Jam
  866 |     // 12/05/2026), MAS o modal pode ter X-close + Salvar com o mesmo
  867 |     // prefix — filtra por texto "Salvar" pra não dismissar sem confirmar.
  868 |     // Timeout 5s — headed mode renderiza mais devagar que headless.
  869 |     const duplicateConfirmBtn = this.page
  870 |       .locator('[id^="duplicated-page-"]')
  871 |       .filter({ hasText: /^salvar$/i });
  872 |     try {
  873 |       await duplicateConfirmBtn.first().waitFor({ state: 'visible', timeout: 5_000 });
  874 |       await duplicateConfirmBtn.first().click();
  875 |     } catch {
  876 |       // Sem modal de duplicação — redirect direto. No-op intencional.
  877 |     }
> 878 |     await this.page.waitForURL(
      |                     ^ TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
  879 |       new RegExp(`/use_modes/${useModeId}/edit\\?tab=items`),
  880 |     );
  881 |     // NOTA (12/05/2026): aqui antigamente havia um segundo `getMenuItemSubmitButton().click()`
  882 |     // (Salvar no editor) com waitForResponse do bulk_update — tentativa de
  883 |     // workaround pro bug `GET /panels/{id}/linked_menus 500` do TC3. Trace
  884 |     // de 12/05/2026 mostrou que o workaround não funciona (500 acontece
  885 |     // mesmo após o save), e o save extra estava DIFERENCIANDO o fluxo
  886 |     // automatizado do manual descrito pelo QA Lead — que faz apenas um
  887 |     // Salvar único (após o toggle de menu, não logo após a criação).
  888 |     // Removido pra alinhar com o fluxo manual validado.
  889 |   }
  890 | 
  891 |   /**
  892 |    * Remove o item de menu cujo nome é `itemName` do modo de uso `useModeId`.
  893 |    * Se `itemName` não fornecido, usa o mesmo padrão de `associatePanelToMenu`
  894 |    * (`Item ${panelName}`).
  895 |    */
  896 |   async disassociatePanelFromMenu(
  897 |     panelName: string,
  898 |     useModeId: number,
  899 |     itemName?: string,
  900 |   ): Promise<void> {
  901 |     const finalItemName = itemName ?? `Item ${panelName}`;
  902 |     await this.page.goto(
  903 |       `/o/${getOrgId()}/use_modes/${useModeId}/edit?tab=items`,
  904 |     );
  905 |     const row = this.getMenuItemRowByName(finalItemName);
  906 |     await row.waitFor();
  907 |     await this.getMenuItemDeleteIcon(finalItemName).click();
  908 |     await this.getMenuItemDeleteConfirmButton().waitFor();
  909 |     await this.getMenuItemDeleteConfirmButton().click();
  910 |     await expect(row).toHaveCount(0, { timeout: 10_000 });
  911 |     // Mesma armadilha do `associatePanelToMenu`: o click final dispara um
  912 |     // PATCH `bulk_update` async. Sem esperar a resposta, `ctx.close()` do
  913 |     // afterAll aborta o request e a desassociação fica parcial — gerando
  914 |     // estado órfão que polui o tenant entre runs.
  915 |     await Promise.all([
  916 |       this.page.waitForResponse(
  917 |         (r) =>
  918 |           r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
  919 |           r.request().method() === 'PATCH',
  920 |       ),
  921 |       this.getMenuItemSubmitButton().click(),
  922 |     ]);
  923 |   }
  924 | 
  925 |   /**
  926 |    * Versão tolerante a falhas — usado em `afterAll` para cleanup robusto.
  927 |    * Se o item já foi deletado ou nunca foi criado, vira no-op em vez de
  928 |    * mascarar a falha original do teste.
  929 |    */
  930 |   async disassociatePanelFromMenu_safe(
  931 |     panelName: string,
  932 |     useModeId: number,
  933 |     itemName?: string,
  934 |   ): Promise<void> {
  935 |     const finalItemName = itemName ?? `Item ${panelName}`;
  936 |     try {
  937 |       await this.page.goto(
  938 |         `/o/${getOrgId()}/use_modes/${useModeId}/edit?tab=items`,
  939 |       );
  940 |       const row = this.getMenuItemRowByName(finalItemName);
  941 |       const exists = (await row.count()) > 0;
  942 |       if (!exists) {
  943 |         // eslint-disable-next-line no-console -- diagnóstico em afterAll
  944 |         console.warn(
  945 |           `[disassociatePanelFromMenu_safe] item "${finalItemName}" não existe no menu ${useModeId} — cleanup no-op`,
  946 |         );
  947 |         return;
  948 |       }
  949 |       await this.disassociatePanelFromMenu(panelName, useModeId, itemName);
  950 |     } catch (err) {
  951 |       // eslint-disable-next-line no-console -- diagnóstico em afterAll
  952 |       console.warn(
  953 |         `[disassociatePanelFromMenu_safe] falha ao desassociar "${finalItemName}" de ${useModeId}: ${(err as Error).message}`,
  954 |       );
  955 |     }
  956 |   }
  957 | 
  958 |   // ---------- Form de item de menu (auxiliares de associação) ----------
  959 | 
  960 |   getMenuItemNameInput(): Locator {
  961 |     // REVISAR: aguardando data-test-id "use-mode-item-form-name-input";
  962 |     // fallback usa id estável `#title` (descoberto live 2026-05-06).
  963 |     return this.page.locator('#title');
  964 |   }
  965 | 
  966 |   getMenuItemPageModelSelect(): Locator {
  967 |     // REVISAR: aguardando data-test-id "use-mode-item-form-page-model-select".
  968 |     // Atributo name + id são ambos `page_model` no `<select>` real.
  969 |     return this.page.locator('#page_model');
  970 |   }
  971 | 
  972 |   /**
  973 |    * Container clicável do react-select que aparece quando page_model="user_panels".
  974 |    * O container tem id estável `#panel` (descoberto live). O `<input>` interno
  975 |    * tem id dinâmico `react-select-{N}-input` que muda entre re-mounts do
  976 |    * componente — por isso ancoramos no container, não no input.
  977 |    */
  978 |   getMenuItemPanelChooser(): Locator {
```