# Configurar a indexação - CURSO Exceções

## Application Overview

Suite de testes para a funcionalidade de Configurar a utilização de indexação de conteúdo por ambiente na plataforma Twygo (stage10.stage.twygoead.com). O fluxo cobre o campo "Exceções" na seção de Indexação de conteúdo dentro de Créditos de IA > Configurações > Editar configuração. O campo Exceções permite selecionar conteúdos que NÃO serão indexados pela IA mesmo que se enquadrem nos outros critérios. A edição só é possível quando não há sincronização em andamento (caso contrário a seção de indexação aparece desabilitada com alerta de aviso). O ambiente de teste é _Ambiente (envId=36799), que é independente (não herda do principal). Ambiente herdado usado no Step 3: Avião (envId=36796, inherit=true).

## Test Scenarios

### 1. Configurar a utilização do indexação de conteúdo por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar a indexação - CURSO Exceções

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-excecoes.spec.ts`

**Steps:**
  1. Pré-condição: Fazer login como SuperAdmin (evertongambeta@gmail.com / 123456) em https://stage10.stage.twygoead.com/users/login e trocar para perfil Administrador via menu de perfil no canto superior direito.
    - expect: A URL deve mudar para /o/36602/events?tab=events&profile=admin confirmando o perfil Administrador ativo.
    - expect: O botão de perfil deve exibir o texto 'Administrador'.
  2. Pré-condição: Navegar para a URL de edição do ambiente _Ambiente: https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions
    - expect: A página deve exibir o heading '_Ambiente' (h2).
    - expect: O breadcrumb deve mostrar 'Créditos de IA > Configurações > Editar configuração'.
    - expect: A seção 'Escolha as funcionalidades de IA a serem liberadas' deve estar visível.
  3. STEP 1 — Verificar presença e estado do campo Exceções: Verificar se o toggle master de Indexação (data-test-id='ai-consumption-settings-content-indexing-master-switch') está habilitado (checked). Se o alerta de sincronização em andamento [role='alert'][data-status='warning'] estiver visível bloqueando a seção, registrar o bloqueio e aguardar resolução ou pular para Step 3/4. Quando a seção de indexação estiver editável e o toggle master estiver ON, verificar o campo Exceções.
    - expect: O campo Exceções deve ser identificado pelo container data-test-id='ai-consumption-settings-content-indexing-exceptions-multiselect'.
    - expect: Dentro do container deve existir um elemento com id='content-indexing-exceptions' (classe 'basic-multi-select-mass').
    - expect: O placeholder do campo deve ser exatamente 'Pesquise por nome ou ID do conteúdo' (verificar via input[role='combobox'] dentro do container, cujo placeholder é referenciado por aria-describedby='react-select-2-placeholder').
    - expect: Acima do campo deve existir o rótulo parágrafo com texto exato 'Conteúdos que não serão indexados' (p.chakra-text).
    - expect: A seção deve exibir o título 'Exceções' seguido de um ícone de interrogação (.tooltip-icon com SVG). O tooltip ao hover deve conter o texto: 'Escolha conteúdos que serão ignorados na indexação. Os conteúdos selecionados não serão indexados, mesmo que se enquadrem em algum dos critérios acima.'
    - expect: O campo deve ser um multiselect (input com role='combobox', aria-haspopup='true', aria-autocomplete='list').
    - expect: Conteúdos selecionados como exceção aparecem como tags removíveis dentro do campo.
    - expect: NOTE: Se sync alert estiver presente, todos os controles de indexação aparecem com atributo disabled. O alerta tem role='alert' data-status='warning' e texto 'Existe uma sincronização de conteúdo em andamento. Aguarde a finalização para editar as configurações de indexação.' — asserir apenas a presença do alerta e do campo (mesmo que desabilitado).
  4. STEP 2 — Interação com multiselect e seleção múltipla de exceções: Com a seção de indexação editável (sem sync em andamento) e toggle master ON, clicar dentro do campo data-test-id='ai-consumption-settings-content-indexing-exceptions-multiselect' para abrir o dropdown. Digitar parte do nome ou ID de um conteúdo do tipo CURSO para filtrar a lista. Selecionar o primeiro resultado para adicioná-lo como exceção (seleção 1). Repetir a busca e selecionar um segundo conteúdo (seleção múltipla). Verificar tags exibidas. Clicar no X de uma das tags para desmarcar. Clicar em Salvar (data-test-id='ai-consumption-settings-edit-save-button'). Se aparecer o modal RN37 de confirmação de créditos, clicar no botão de confirmação (data-test-id='ai-consumption-settings-content-indexing-credits-modal-confirm-button'). Retornar à edição e verificar que a exceção removida não aparece mais salva.
    - expect: Ao clicar no campo, o dropdown deve abrir exibindo opções de conteúdos disponíveis para busca.
    - expect: Digitar texto no input deve filtrar os resultados do dropdown em tempo real.
    - expect: Ao selecionar um conteúdo, ele deve aparecer como uma tag (chip) dentro do campo com botão X para remoção.
    - expect: É possível selecionar múltiplos conteúdos — cada um aparece como tag separada.
    - expect: Ao clicar X em uma tag, o conteúdo deve ser removido do campo de exceções.
    - expect: Após salvar com exceções configuradas, a página deve retornar ao estado salvo sem erros.
    - expect: Se o modal RN37 aparecer, ele deve conter o botão data-test-id='ai-consumption-settings-content-indexing-credits-modal-confirm-button' e ao confirmá-lo a save deve ser processada.
    - expect: Ao reabrir a edição, as exceções salvas devem estar pré-populadas no campo.
    - expect: REVIEW_NEEDED: Validação fim-a-fim — verificar via chat do Agente de Atendimento que apenas os conteúdos listados como exceção estão sendo excluídos da indexação durante sincronização. Essa parte requer validação manual ou integração com o agente de chat de IA.
    - expect: REVIEW_NEEDED: Validar que ao remover um conteúdo da lista de exceções e sincronizar, ele volta a ser indexado se se enquadrar nos critérios ativos.
  5. STEP 3 — Acessar ambiente herdado e verificar configurações herdadas: Navegar para https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings. Localizar a linha do ambiente 'Avião' (envId=36796) que possui o toggle data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-36796' marcado (checked). Clicar no botão de edição (data-test-id='ai-consumption-analysis-edit-button') da linha do 'Avião' para acessar sua edição em /o/36602/ai_consumption_analysis/36796/edit_additional_organization_permissions.
    - expect: Na lista de configurações, o toggle 'Herdar configurações do principal' (data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-36796') deve estar checked (ON) para o ambiente Avião.
    - expect: Ao abrir a edição do ambiente herdado, a página deve exibir o heading 'Avião' (h2).
    - expect: A seção de Indexação de conteúdo deve aparecer — quando em modo herdado, o toggle master de indexação (data-test-id='ai-consumption-settings-content-indexing-master-switch') deve estar visível mas os controles detalhados (Período, Tipo de conteúdo, Tipo de atividade, Situação, Exceções) NÃO devem ser exibidos, indicando herança das configurações do ambiente principal.
    - expect: Se o sync alert estiver presente ([role='alert'][data-status='warning']), asserir o texto do alerta e que os campos de indexação aparecem disabled.
    - expect: REVIEW_NEEDED: Verificar que a IA do Agente de Atendimento do ambiente herdado utiliza os mesmos conteúdos indexados do ambiente principal (incluindo as mesmas exceções configuradas no principal). Esta validação requer inspeção manual no chat de IA do ambiente herdado.
  6. STEP 4 — Acessar ambiente independente e verificar que NÃO herda configurações: Navegar para https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings. Localizar a linha do ambiente '_Ambiente' (envId=36799) que possui o toggle data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-36799' desmarcado (unchecked). Clicar no botão de edição (data-test-id='ai-consumption-analysis-edit-button') da linha do '_Ambiente' para acessar sua edição em /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions.
    - expect: Na lista de configurações, o toggle 'Herdar configurações do principal' (data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-36799') deve estar unchecked (OFF) para o ambiente _Ambiente.
    - expect: Ao abrir a edição do ambiente independente, a página deve exibir o heading '_Ambiente' (h2).
    - expect: A seção de Indexação de conteúdo deve aparecer com os controles completos: toggle master, Período, Tipo de conteúdo, Tipo de atividade, Situação e campo de Exceções (data-test-id='ai-consumption-settings-content-indexing-exceptions-multiselect').
    - expect: O campo de Exceções deve estar presente e configurável independentemente do ambiente principal.
    - expect: Caso o sync alert ([role='alert'][data-status='warning']) esteja presente, os campos aparecem disabled — asserir apenas a estrutura de UI.
    - expect: REVIEW_NEEDED: Verificar via chat do Agente de Atendimento que o ambiente independente utiliza sua própria configuração de indexação (incluindo suas exceções próprias) sem herdar do ambiente principal. Esta validação requer inspeção manual no chat de IA do ambiente _Ambiente.
