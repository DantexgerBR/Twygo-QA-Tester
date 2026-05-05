# Configurar a indexação - PACOTE

## Application Overview

Twygo - Gestão de Créditos de IA - Fase 2. Suite: Configurar a utilização da indexação de conteúdo por ambiente. Esta suite cobre a configuração de indexação por tipo de conteúdo PACOTE na tela de edição de configurações de IA por ambiente (/o/{orgId}/ai_consumption_analysis/{envId}/edit_additional_organization_permissions). O fluxo envolve: (1) habilitar o toggle Indexação mestre e marcar o checkbox Pacote em Tipo de conteúdo, salvar e verificar modal RN37 e persistência; (2) verificar que ambiente herdado exibe configurações herdadas do principal; (3) verificar que ambiente independente NÃO herda. Achados exploratórios: NÃO existe sub-multiselect específico para seleção de pacotes individuais — o único multiselect disponível é o de Exceções (data-test-id: ai-consumption-settings-content-indexing-exceptions-multiselect), aplicável a todos os tipos de conteúdo. O sync alert [role='alert'][data-status='warning'] aparece em todos os ambientes e bloqueia clicks normais no form; interação requer force-click ou scroll adequado. Ambientes identificados: independentes com IA ON = _Ambiente (36799), 123 Ambiente (36797), Stage 10.1 Parceira (36690); herdados = Avião (36796), Fenix (36800), Parceira com nome grande (36802).

## Test Scenarios

### 1. Configurar a utilização do indexação de conteúdo por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar a indexação - PACOTE

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-pacote.spec.ts`

**Steps:**
  1. Pré-condição: fazer login como SuperAdmin (evertongambeta@gmail.com / 123456) em https://stage10.stage.twygoead.com/users/login e trocar perfil para Administrador via menu de perfil no topo direito. Confirmar redirecionamento para /o/36602/events.
    - expect: URL contém /o/36602/events
    - expect: Cabeçalho mostra 'Administrador' no botão de perfil
  2. Navegar diretamente para a página de edição de configurações do ambiente independente _Ambiente: https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions
    - expect: URL é /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions
    - expect: Título da página mostra '_Ambiente'
    - expect: Breadcrumb exibe 'Créditos de IA > Configurações > Editar configuração'
    - expect: Seção 'Indexação de conteúdo' está visível com toggle master-switch (data-test-id: ai-consumption-settings-content-indexing-master-switch)
    - expect: Se presente, o sync alert [role='alert'][data-status='warning'] com texto 'Existe uma sincronização de conteúdo em andamento' está visível e deve ser aguardado desaparecer ou aceito como estado normal do ambiente de staging
  3. STEP 1 — Habilitar o toggle Indexação mestre e marcar o checkbox Pacote. Se o toggle master-switch (data-test-id: ai-consumption-settings-content-indexing-master-switch) estiver OFF, clicar nele para ativar. Verificar que o bloco de opções de Tipo de conteúdo se torna visível. Garantir que o checkbox Pacote (data-test-id: ai-consumption-settings-content-indexing-type-package) está MARCADO. Se não estiver, clicar no label para marcá-lo. Observar se algum sub-multiselect específico para seleção de pacotes individuais aparece abaixo de 'Tipo de conteúdo' — conforme análise exploratória, NENHUM sub-multiselect de pacotes existe atualmente; apenas o multiselect de Exceções (data-test-id: ai-consumption-settings-content-indexing-exceptions-multiselect) está presente. Clicar no botão Salvar (data-test-id: ai-consumption-settings-edit-save-button).
    - expect: Toggle master-switch está ON (input checked = true)
    - expect: Checkboxes de Tipo de conteúdo (Curso, Trilha, Pacote) estão visíveis
    - expect: Checkbox Pacote (data-test-id: ai-consumption-settings-content-indexing-type-package) está MARCADO (input checked = true)
    - expect: NENHUM sub-multiselect específico para seleção de pacotes individuais aparece — o único multiselect disponível é o de Exceções (data-test-id: ai-consumption-settings-content-indexing-exceptions-multiselect) — REVISAR: se futura sprint adicionar sub-multiselect de pacotes com data-test-id próprio, mapear aqui
    - expect: Ao clicar Salvar: se a regra de negócio RN37 for acionada (configuração altera créditos ou tipo de indexação), o modal de confirmação RN37 aparece com botão de confirmação (data-test-id: ai-consumption-settings-content-indexing-credits-modal-confirm-button)
    - expect: Após confirmar o modal RN37 (ou se modal não aparecer), o sistema exibe feedback de sucesso (toast de sucesso ou redirecionamento para a lista de configurações)
    - expect: Ao retornar à página de edição do mesmo ambiente, o checkbox Pacote permanece MARCADO (persistência verificada)
    - expect: REVIEW_NEEDED: verificação semântica de que 'o sistema considera todos os pacotes selecionados e todos os conteúdos vinculados a eles, incluindo cursos e trilhas pertencentes a esses pacotes, e que conteúdos fora de pacotes não são considerados' — depende de fluxo fim-a-fim com chat IA
  4. STEP 2 — Acessar um ambiente HERDADO. Navegar para a lista de configurações em https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings. Identificar um ambiente com toggle 'Herdar configurações do principal' ativo (data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-{envId} com input checked = true), por exemplo 'Avião' (envId 36796). Verificar o estado do switch de herança. Clicar no botão de edição deste ambiente (data-test-id: ai-consumption-analysis-edit-button relativo à linha do ambiente herdado). Observar a tela de edição do ambiente herdado.
    - expect: Na lista de configurações, o ambiente herdado (ex: 'Avião', envId 36796) tem o switch 'Herdar configurações do principal' com input checked = true (data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-36796)
    - expect: Na tela de edição do ambiente herdado (URL: /o/36602/ai_consumption_analysis/36796/edit_additional_organization_permissions), o toggle de Indexação de conteúdo reflete as configurações herdadas do ambiente principal
    - expect: Os controles de configuração aparecem no estado configurado pelo principal (ou em modo somente-leitura indicando herança)
    - expect: REVIEW_NEEDED: verificação semântica de que 'IA usa os conteúdos conforme configurado pelo principal herdado' — depende de fluxo fim-a-fim com chat IA
  5. STEP 3 — Acessar um ambiente INDEPENDENTE. Na lista de configurações em https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings, identificar um ambiente com toggle 'Herdar configurações do principal' DESATIVO (data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-{envId} com input checked = false), por exemplo '_Ambiente' (envId 36799) ou '123 Ambiente' (envId 36797). Verificar o estado do switch de herança. Clicar no botão de edição deste ambiente. Observar a tela de edição do ambiente independente.
    - expect: Na lista de configurações, o ambiente independente (ex: '_Ambiente', envId 36799) tem o switch 'Herdar configurações do principal' com input checked = false (data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-36799)
    - expect: Na tela de edição do ambiente independente (URL: /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions), os controles de configuração estão habilitados para edição independente (não em modo somente-leitura por herança)
    - expect: O toggle master-switch de Indexação de conteúdo e os checkboxes de Tipo de conteúdo (incluindo Pacote) podem ser alterados independentemente das configurações do ambiente principal
    - expect: As configurações salvas neste ambiente NÃO afetam os ambientes herdados e vice-versa
    - expect: REVIEW_NEEDED: verificação semântica de que 'IA usa os conteúdos conforme configurado independentemente, sem herança do principal' — depende de fluxo fim-a-fim com chat IA
