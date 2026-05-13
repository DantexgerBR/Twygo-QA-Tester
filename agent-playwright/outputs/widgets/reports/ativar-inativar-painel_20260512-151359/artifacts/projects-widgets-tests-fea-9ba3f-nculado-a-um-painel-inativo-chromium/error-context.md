# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\ativar-inativar-painel\tentar-reativar-modo-uso-painel-inativo.spec.ts >> Ativar / Inativar painel >> Tentar reativar modo de uso vinculado a um painel inativo
- Location: projects\widgets\tests\features\ativar-inativar-painel\tentar-reativar-modo-uso-painel-inativo.spec.ts:114:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
              - link "palette Aparência" [ref=e174] [cursor=pointer]:
                - /url: /o/36988/appearance
                - generic [ref=e175]: palette
                - text: Aparência
            - listitem [ref=e176]:
              - link "smart_toy Controle de IA BETA" [ref=e177] [cursor=pointer]:
                - /url: /o/36988/ai_consumption_analysis
                - generic [ref=e178]: smart_toy
                - text: Controle de IA BETA
    - generic [ref=e181]:
      - generic [ref=e182]:
        - img [ref=e183]
        - text: Claude Agents
      - img [ref=e185]
  - text: "0"
  - generic [ref=e188]:
    - generic "Logo - widgets [36988]" [ref=e190]:
      - link "Logo - widgets [36988]" [ref=e191] [cursor=pointer]:
        - /url: /o/36988/dashboard
        - img "Logo - widgets [36988]" [ref=e192]
    - generic [ref=e196]:
      - link "Open chat" [ref=e200] [cursor=pointer]:
        - /url: /o/36988/chats
        - button "Open chat" [ref=e201]:
          - img [ref=e202]
      - button "Users" [ref=e209] [cursor=pointer]:
        - img [ref=e210]
      - generic [ref=e213]:
        - link "7089491 - Claude Agents" [ref=e214] [cursor=pointer]:
          - /url: javascript:void(0);
        - generic [ref=e215]: Claude Agents
      - button "Administrador G" [ref=e216] [cursor=pointer]:
        - text: Administrador
        - generic [ref=e217]: G
    - text: M * * M * *
  - generic [ref=e220]:
    - generic [ref=e222]:
      - list [ref=e223]:
        - list [ref=e224]:
          - listitem [ref=e225] [cursor=pointer]:
            - link "leaderboard Dashboard" [ref=e226]:
              - /url: /o/36988/dashboard
              - generic [ref=e227]:
                - generic [ref=e229]: leaderboard
                - generic [ref=e230]: Dashboard
          - listitem [ref=e231] [cursor=pointer]:
            - generic [ref=e233]:
              - generic [ref=e236]: school
              - generic [ref=e237]: Aprendizagem
              - generic [ref=e239]: G
          - listitem [ref=e240] [cursor=pointer]:
            - link "group Usuários" [ref=e241]:
              - /url: /o/36988/users
              - generic [ref=e242]:
                - generic [ref=e244]: group
                - generic [ref=e245]: Usuários
          - listitem [ref=e246] [cursor=pointer]:
            - link "work Empresas" [ref=e247]:
              - /url: /o/36988/companies
              - generic [ref=e248]:
                - generic [ref=e250]: work
                - generic [ref=e251]: Empresas
          - listitem [ref=e252] [cursor=pointer]:
            - link "live_help Questionários" [ref=e253]:
              - /url: /o/36988/question_lists
              - generic [ref=e254]:
                - generic [ref=e256]: live_help
                - generic [ref=e257]: Questionários
          - listitem [ref=e258] [cursor=pointer]:
            - link "groups Comunidades" [ref=e259]:
              - /url: /o/36988/feed
              - generic [ref=e260]:
                - generic [ref=e262]: groups
                - generic [ref=e263]: Comunidades
          - listitem [ref=e264] [cursor=pointer]:
            - generic [ref=e266]:
              - generic [ref=e269]: psychology
              - generic [ref=e270]:
                - text: Skills
                - generic [ref=e271]: BETA
              - generic [ref=e273]: G
          - listitem [ref=e274] [cursor=pointer]:
            - generic [ref=e276]:
              - generic [ref=e279]: account_tree
              - generic [ref=e280]: Processos
              - generic [ref=e282]: G
      - generic [ref=e284]: widgets [36988]
      - list [ref=e285]:
        - listitem [ref=e286] [cursor=pointer]:
          - generic [ref=e287]:
            - generic [ref=e288]: f
            - text: Configurações
            - generic [ref=e289]: G
          - text: e    s 
    - generic [ref=e291]:
      - generic [ref=e294]: Menu > Modo de uso > Editar modo de uso
      - generic [ref=e302]:
        - generic [ref=e303]:
          - button "Voltar" [ref=e305] [cursor=pointer]:
            - img [ref=e307]
            - text: Voltar
          - heading "Colaborador" [level=2] [ref=e310]
        - generic [ref=e312]:
          - tablist [ref=e313]:
            - tab "Identificação" [ref=e314] [cursor=pointer]
            - tab "Menu" [selected] [ref=e315] [cursor=pointer]
            - tab "Acesso" [ref=e316] [cursor=pointer]
            - tab "Feriados" [ref=e317] [cursor=pointer]
          - tabpanel "Menu" [ref=e319]:
            - generic [ref=e320]:
              - button "Adicionar" [ref=e322] [cursor=pointer]:
                - img [ref=e324]
                - text: Adicionar
              - table [ref=e326]:
                - rowgroup [ref=e327]:
                  - row "Menus exibidos Modelo de página Página inicial Menu habilitado" [ref=e328]:
                    - columnheader [ref=e329]
                    - columnheader "Menus exibidos" [ref=e330]:
                      - generic [ref=e331]: Menus exibidos
                    - columnheader "Modelo de página" [ref=e332]:
                      - generic [ref=e333]: Modelo de página
                    - columnheader "Página inicial" [ref=e334]:
                      - generic [ref=e335]:
                        - text: Página inicial
                        - img [ref=e337]
                    - columnheader "Menu habilitado" [ref=e339]:
                      - generic [ref=e340]:
                        - text: Menu habilitado
                        - img [ref=e342]
                    - columnheader [ref=e344]
                - rowgroup [ref=e345]:
                  - row "leaderboard Dashboard Dashboard edit Delete" [ref=e346]:
                    - cell [ref=e347]:
                      - img [ref=e348]
                    - cell "leaderboard Dashboard" [ref=e350]:
                      - generic [ref=e351]:
                        - generic [ref=e352]: leaderboard
                        - paragraph [ref=e353]: Dashboard
                    - cell "Dashboard" [ref=e354]
                    - cell [ref=e355]:
                      - radio [checked] [ref=e357]
                    - cell [ref=e359]:
                      - checkbox [checked] [disabled] [ref=e361]
                    - cell "edit Delete" [ref=e364]:
                      - generic [ref=e365]:
                        - generic [ref=e368] [cursor=pointer]: edit
                        - generic [ref=e371] [cursor=pointer]: Delete
                  - row "analytics Equipe Equipe edit Delete" [ref=e372]:
                    - cell [ref=e373]:
                      - img [ref=e374]
                    - cell "analytics Equipe" [ref=e376]:
                      - generic [ref=e377]:
                        - generic [ref=e378]: analytics
                        - paragraph [ref=e379]: Equipe
                    - cell "Equipe" [ref=e380]
                    - cell [ref=e381]:
                      - radio [ref=e383]
                    - cell [ref=e385]:
                      - checkbox [checked] [ref=e387]
                    - cell "edit Delete" [ref=e390]:
                      - generic [ref=e391]:
                        - generic [ref=e394] [cursor=pointer]: edit
                        - generic [ref=e397] [cursor=pointer]: Delete
                  - row "menu_book Meus Cursos Meus Cursos edit Delete" [ref=e398]:
                    - cell [ref=e399]:
                      - img [ref=e400]
                    - cell "menu_book Meus Cursos" [ref=e402]:
                      - generic [ref=e403]:
                        - generic [ref=e404]: menu_book
                        - paragraph [ref=e405]: Meus Cursos
                    - cell "Meus Cursos" [ref=e406]
                    - cell [ref=e407]:
                      - radio [ref=e409]
                    - cell [ref=e411]:
                      - checkbox [checked] [ref=e413]
                    - cell "edit Delete" [ref=e416]:
                      - generic [ref=e417]:
                        - generic [ref=e420] [cursor=pointer]: edit
                        - generic [ref=e423] [cursor=pointer]: Delete
                  - row "play_circle Catálogo de conteúdos Catálogo de conteúdos edit Delete" [ref=e424]:
                    - cell [ref=e425]:
                      - img [ref=e426]
                    - cell "play_circle Catálogo de conteúdos" [ref=e428]:
                      - generic [ref=e429]:
                        - generic [ref=e430]: play_circle
                        - paragraph [ref=e431]: Catálogo de conteúdos
                    - cell "Catálogo de conteúdos" [ref=e432]
                    - cell [ref=e433]:
                      - radio [ref=e435]
                    - cell [ref=e437]:
                      - checkbox [ref=e439]
                    - cell "edit Delete" [ref=e442]:
                      - generic [ref=e443]:
                        - generic [ref=e446] [cursor=pointer]: edit
                        - generic [ref=e449] [cursor=pointer]: Delete
                  - row "more_horiz Minhas Trilhas Minhas Trilhas edit Delete" [ref=e450]:
                    - cell [ref=e451]:
                      - img [ref=e452]
                    - cell "more_horiz Minhas Trilhas" [ref=e454]:
                      - generic [ref=e455]:
                        - generic [ref=e456]: more_horiz
                        - paragraph [ref=e457]: Minhas Trilhas
                    - cell "Minhas Trilhas" [ref=e458]
                    - cell [ref=e459]:
                      - radio [ref=e461]
                    - cell [ref=e463]:
                      - checkbox [checked] [ref=e465]
                    - cell "edit Delete" [ref=e468]:
                      - generic [ref=e469]:
                        - generic [ref=e472] [cursor=pointer]: edit
                        - generic [ref=e475] [cursor=pointer]: Delete
                  - row "groups Comunidades Comunidades edit Delete" [ref=e476]:
                    - cell [ref=e477]:
                      - img [ref=e478]
                    - cell "groups Comunidades" [ref=e480]:
                      - generic [ref=e481]:
                        - generic [ref=e482]: groups
                        - paragraph [ref=e483]: Comunidades
                    - cell "Comunidades" [ref=e484]
                    - cell [ref=e485]:
                      - radio [ref=e487]
                    - cell [ref=e489]:
                      - checkbox [checked] [ref=e491]
                    - cell "edit Delete" [ref=e494]:
                      - generic [ref=e495]:
                        - generic [ref=e498] [cursor=pointer]: edit
                        - generic [ref=e501] [cursor=pointer]: Delete
                  - row "play_circle Item Painel Vinculado TC3 Painéis do usuário edit Delete" [ref=e502]:
                    - cell [ref=e503]:
                      - img [ref=e504]
                    - cell "play_circle Item Painel Vinculado TC3" [ref=e506]:
                      - generic [ref=e507]:
                        - generic [ref=e508]: play_circle
                        - paragraph [ref=e509]: Item Painel Vinculado TC3
                    - cell "Painéis do usuário" [ref=e510]
                    - cell [ref=e511]:
                      - radio [ref=e513]
                    - cell [ref=e515]:
                      - checkbox [checked] [ref=e517]
                    - cell "edit Delete" [ref=e520]:
                      - generic [ref=e521]:
                        - generic [ref=e524] [cursor=pointer]: edit
                        - generic [ref=e527] [cursor=pointer]: Delete
              - generic [ref=e528]:
                - button "Salvar" [ref=e529] [cursor=pointer]
                - button "Cancelar" [ref=e530] [cursor=pointer]
  - region "Widget de chat" [ref=e531]:
    - iframe [ref=e532]:
      - button "Abrir chat ao vivo" [ref=f17e5]:
        - img [ref=f17e8]
        - img [ref=f17e15]
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
  759 |    */
  760 |   async deletePanelByName(name: string): Promise<void> {
  761 |     // Garante modo Lista antes de buscar — `getRowByName` casa em `tbody tr`,
  762 |     // que só existe em modo Lista. Em viewport menor (default ~1280×720,
  763 |     // como em afterAll/beforeAll sem test.use), o default é Cards e a row
  764 |     // não aparece. setViewMode é idempotente (no-op se já está em Lista).
  765 |     await this.setViewMode('lista');
  766 |     const row = this.getRowByName(name);
  767 |     await row.locator('[data-icon="delete"]').click();
  768 |     await this.getDeleteConfirmModal().waitFor();
  769 |     await this.getDeleteConfirmButton().click();
  770 |     await expect(row).toHaveCount(0, {
  771 |       timeout: 10_000,
  772 |     });
  773 |   }
  774 | 
  775 |   /**
  776 |    * Versão tolerante a falhas — não estoura se o painel já foi deletado ou
  777 |    * nunca foi criado. Usado em `afterAll` para cleanup robusto: se o teste
  778 |    * falhou antes de criar o painel, o cleanup vira no-op em vez de
  779 |    * mascarar o erro original do teste.
  780 |    */
  781 |   async deletePanelByNameSafe(name: string): Promise<void> {
  782 |     try {
  783 |       await this.setViewMode('lista');
  784 |       const row = this.getRowByName(name);
  785 |       const exists = (await row.count()) > 0;
  786 |       if (!exists) {
  787 |         // eslint-disable-next-line no-console -- diagnóstico em afterAll
  788 |         console.warn(`[deletePanelByNameSafe] painel "${name}" não existe — cleanup no-op`);
  789 |         return;
  790 |       }
  791 |       await this.deletePanelByName(name);
  792 |     } catch (err) {
  793 |       // eslint-disable-next-line no-console -- diagnóstico em afterAll
  794 |       console.warn(
  795 |         `[deletePanelByNameSafe] falha ao deletar "${name}": ${(err as Error).message}`,
  796 |       );
  797 |     }
  798 |   }
  799 | 
  800 |   // ---------- Associação painel↔menu de modo de uso (TC3) ----------
  801 |   // Validado live 2026-05-06 (após deploy da opção "Painéis do usuário" no
  802 |   // `<select id="page_model">`). Estrutura do form de novo item de menu:
  803 |   // - URL: /o/{orgId}/use_modes/{useModeId}/use_mode_itens/new
  804 |   // - Campo Nome: `<input id="title" placeholder="Nome do menu">` (obrigatório)
  805 |   // - Campo Ícone: grid de `<i class="material-symbols-outlined">` — ícone
  806 |   //   default é selecionado automaticamente pelo backend (não precisa clicar)
  807 |   //   se o usuário não escolher; campo é obrigatório por label mas o submit
  808 |   //   passa sem click manual no item.
  809 |   // - Campo Modelo de página: `<select id="page_model">` com option
  810 |   //   `value="user_panels"` (texto "Painéis do usuário") — última posição.
  811 |   // - Quando page_model="user_panels": aparece group "Espaço*" com
  812 |   //   react-select de container `#panel` e input `input[id^="react-select-"][id$="-input"]`.
  813 |   //   Filtro client-side por substring; opções têm id `react-select-{N}-option-{idx}`.
  814 |   // - Salvar: botão `#use-model-submit` (texto "Salvar") faz POST e
  815 |   //   redireciona para `/use_modes/{useModeId}/edit?tab=items`.
  816 |   //
  817 |   // Disassociação = excluir o item de menu via ícone Delete da row do item:
  818 |   // - Row na tabela de items tem `data-item-name="{itemName}"`.
  819 |   // - Ícone Delete: `<span class="material-symbols-outlined">Delete</span>` na
  820 |   //   última coluna da row (texto literal "Delete", não "delete" minúsculo —
  821 |   //   é o nome do ícone Material Symbols).
  822 |   // - Click abre `<div role="alertdialog">` com `#modal-delete-confirm`
  823 |   //   (texto "Excluir") e `#modal-delete-cancel`.
  824 | 
  825 |   /**
  826 |    * Cria item de menu vinculado ao painel `panelName` no modo de uso
  827 |    * `useModeId`. Se `itemName` não for fornecido, gera baseado no panelName.
  828 |    *
  829 |    * Pré-condição: painel `panelName` já existe e está ativo. Se o nome não
  830 |    * for único, o react-select pode resolver a primeira ocorrência — caller
  831 |    * deve garantir unicidade (TC3 usa nome worker-isolated com timestamp).
  832 |    */
  833 |   async associatePanelToMenu(
  834 |     panelName: string,
  835 |     useModeId: number,
  836 |     itemName?: string,
  837 |   ): Promise<void> {
  838 |     const finalItemName = itemName ?? `Item ${panelName}`;
  839 |     await this.page.goto(
  840 |       `/o/${getOrgId()}/use_modes/${useModeId}/use_mode_itens/new`,
  841 |     );
  842 |     // Mesmo motivo de openNewPanelForm: NPS pode interceptar o submit
  843 |     // (`#use-model-submit`) via chakra-portal. Ver skill `fechar-modais-twygo`.
  844 |     await dismissCommonModals(this.page);
  845 |     await this.getMenuItemNameInput().waitFor();
  846 |     await this.getMenuItemNameInput().fill(finalItemName);
  847 |     await this.getMenuItemPageModelSelect().selectOption('user_panels');
  848 |     // O react-select container `#panel` só renderiza após page_model="user_panels".
  849 |     // Aguardamos visibilidade antes de clicar — sem waitForTimeout (regra dura #1).
  850 |     await this.getMenuItemPanelChooser().waitFor();
  851 |     await this.getMenuItemPanelChooser().click();
  852 |     // Filtro client-side: digitar o nome do painel restringe options ao alvo.
  853 |     await this.getMenuItemPanelChooserInput().fill(panelName);
  854 |     // A primeira (e única, pós-filtro) option tem id `react-select-{N}-option-0`.
  855 |     // O `{N}` é dinâmico (incrementa por mount do react-select); ancoramos pelo
  856 |     // suffix `-option-0` em qualquer combobox aberto.
  857 |     await this.page.locator('[id^="react-select-"][id$="-option-0"]').first().click();
  858 |     await this.getMenuItemSubmitButton().click();
> 859 |     await this.page.waitForURL(
      |                     ^ TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
  860 |       new RegExp(`/use_modes/${useModeId}/edit\\?tab=items`),
  861 |     );
  862 |     // Click no Salvar do menu edit comita ordem/flags (PATCH bulk_update).
  863 |     // CRÍTICO: esperar a resposta — sem isso o request fica em flight e o
  864 |     // `ctx.close()` do `beforeAll` aborta (status -1), deixando a associação
  865 |     // em estado parcial. Sintoma observado: `GET /panels/{id}/linked_menus`
  866 |     // depois retorna 500 e a UI inativa o painel direto sem modal de bloqueio.
  867 |     await Promise.all([
  868 |       this.page.waitForResponse(
  869 |         (r) =>
  870 |           r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
  871 |           r.request().method() === 'PATCH',
  872 |       ),
  873 |       this.getMenuItemSubmitButton().click(),
  874 |     ]);
  875 |   }
  876 | 
  877 |   /**
  878 |    * Remove o item de menu cujo nome é `itemName` do modo de uso `useModeId`.
  879 |    * Se `itemName` não fornecido, usa o mesmo padrão de `associatePanelToMenu`
  880 |    * (`Item ${panelName}`).
  881 |    */
  882 |   async disassociatePanelFromMenu(
  883 |     panelName: string,
  884 |     useModeId: number,
  885 |     itemName?: string,
  886 |   ): Promise<void> {
  887 |     const finalItemName = itemName ?? `Item ${panelName}`;
  888 |     await this.page.goto(
  889 |       `/o/${getOrgId()}/use_modes/${useModeId}/edit?tab=items`,
  890 |     );
  891 |     const row = this.getMenuItemRowByName(finalItemName);
  892 |     await row.waitFor();
  893 |     await this.getMenuItemDeleteIcon(finalItemName).click();
  894 |     await this.getMenuItemDeleteConfirmButton().waitFor();
  895 |     await this.getMenuItemDeleteConfirmButton().click();
  896 |     await expect(row).toHaveCount(0, { timeout: 10_000 });
  897 |     // Mesma armadilha do `associatePanelToMenu`: o click final dispara um
  898 |     // PATCH `bulk_update` async. Sem esperar a resposta, `ctx.close()` do
  899 |     // afterAll aborta o request e a desassociação fica parcial — gerando
  900 |     // estado órfão que polui o tenant entre runs.
  901 |     await Promise.all([
  902 |       this.page.waitForResponse(
  903 |         (r) =>
  904 |           r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
  905 |           r.request().method() === 'PATCH',
  906 |       ),
  907 |       this.getMenuItemSubmitButton().click(),
  908 |     ]);
  909 |   }
  910 | 
  911 |   /**
  912 |    * Versão tolerante a falhas — usado em `afterAll` para cleanup robusto.
  913 |    * Se o item já foi deletado ou nunca foi criado, vira no-op em vez de
  914 |    * mascarar a falha original do teste.
  915 |    */
  916 |   async disassociatePanelFromMenu_safe(
  917 |     panelName: string,
  918 |     useModeId: number,
  919 |     itemName?: string,
  920 |   ): Promise<void> {
  921 |     const finalItemName = itemName ?? `Item ${panelName}`;
  922 |     try {
  923 |       await this.page.goto(
  924 |         `/o/${getOrgId()}/use_modes/${useModeId}/edit?tab=items`,
  925 |       );
  926 |       const row = this.getMenuItemRowByName(finalItemName);
  927 |       const exists = (await row.count()) > 0;
  928 |       if (!exists) {
  929 |         // eslint-disable-next-line no-console -- diagnóstico em afterAll
  930 |         console.warn(
  931 |           `[disassociatePanelFromMenu_safe] item "${finalItemName}" não existe no menu ${useModeId} — cleanup no-op`,
  932 |         );
  933 |         return;
  934 |       }
  935 |       await this.disassociatePanelFromMenu(panelName, useModeId, itemName);
  936 |     } catch (err) {
  937 |       // eslint-disable-next-line no-console -- diagnóstico em afterAll
  938 |       console.warn(
  939 |         `[disassociatePanelFromMenu_safe] falha ao desassociar "${finalItemName}" de ${useModeId}: ${(err as Error).message}`,
  940 |       );
  941 |     }
  942 |   }
  943 | 
  944 |   // ---------- Form de item de menu (auxiliares de associação) ----------
  945 | 
  946 |   getMenuItemNameInput(): Locator {
  947 |     // REVISAR: aguardando data-test-id "use-mode-item-form-name-input";
  948 |     // fallback usa id estável `#title` (descoberto live 2026-05-06).
  949 |     return this.page.locator('#title');
  950 |   }
  951 | 
  952 |   getMenuItemPageModelSelect(): Locator {
  953 |     // REVISAR: aguardando data-test-id "use-mode-item-form-page-model-select".
  954 |     // Atributo name + id são ambos `page_model` no `<select>` real.
  955 |     return this.page.locator('#page_model');
  956 |   }
  957 | 
  958 |   /**
  959 |    * Container clicável do react-select que aparece quando page_model="user_panels".
```