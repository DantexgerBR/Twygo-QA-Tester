# Configurar a indexação - CURSO Período

## Application Overview

Suite: Configurar a utilização da indexação de conteúdo por ambiente. Testcase: Configurar a indexação - CURSO Período. Tela de edição de ambiente adicional independente `_Ambiente` (envId=36799) em Créditos de IA > Configurações > aba Configurações > botão Editar. URL: /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Pré-condições: usuário SuperAdmin com contrato Agente de atendimento e feature flag `analise_creditos_ia_beta_test` habilitada. BLOQUEIO ATUAL: todos os ambientes do stage10 apresentam sincronização de conteúdo em andamento (`[role="alert"][data-status="warning"]`), o que torna todos os controles da seção de Indexação de conteúdo visualmente desabilitados via Chakra UI `group [disabled]`. O toggle "Indexação de conteúdo" (`ai-consumption-settings-content-indexing-master-switch`) e o sub-toggle "Período" (`ai-consumption-settings-content-indexing-specific-period-switch`) estão renderizados mas não respondem a cliques. Os campos Data inicial e Data final são renderizados condicionalmente apenas quando `index_specific_period=true` - portanto não aparecem no DOM enquanto a sincronização bloqueia a interação. Os test-ids dos campos de data foram mapeados via análise do bundle JavaScript `ai-consumption-analysis-edit-lkJ0THDp.min.js`.

## Test Scenarios

### 1. Configurar a utilização da indexação de conteúdo por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar a indexação - CURSO Período

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-periodo.spec.ts`

**Steps:**
  1. Fazer login como SuperAdmin: navegar para https://stage10.stage.twygoead.com/users/login, preencher Login com 'evertongambeta@gmail.com' e Senha com '123456', clicar em 'Entrar'. Aguardar redirecionamento para /dashboard_students. Clicar no botão de perfil 'Aluno G' e selecionar o link 'Administrador' no dropdown.
    - expect: URL deve mudar para /o/36602/events?tab=events&profile=admin
    - expect: Botão de perfil exibe 'Administrador G'
  2. Navegar diretamente para a tela de edição do ambiente independente `_Ambiente` (envId=36799): acessar https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Verificar se a tarja de sincronização está presente (`[role='alert'][data-status='warning']`).
    - expect: Título da página exibe '_Ambiente' via `heading '_Ambiente' [level=2]`
    - expect: SE a tarja de sincronização estiver presente (seletor `[role='alert'][data-status='warning']` com texto 'Existe uma sincronização de conteúdo em andamento...'), anotar bloqueio e aguardar até que desapareça antes de prosseguir - a seção de Indexação de conteúdo fica com `group [disabled]` enquanto a sinc estiver ativa
    - expect: SE sem tarja de sincronização: o toggle mestre Indexação de conteúdo (`getByTestId('ai-consumption-settings-content-indexing-master-switch')`) deve estar visível e interativo
    - expect: O sub-toggle Período (`getByTestId('ai-consumption-settings-content-indexing-specific-period-switch')`) deve estar visível na seção de Indexação. POR PADRÃO (sem configuração prévia) ele deve estar DESABILITADO (unchecked). Asserir: `expect(page.getByTestId('ai-consumption-settings-content-indexing-specific-period-switch').locator('input')).not.toBeChecked()`
  3. Com o toggle mestre Indexação habilitado (se necessário, clicar em `getByTestId('ai-consumption-settings-content-indexing-master-switch')` para habilitá-lo — o que pode disparar o modal RN37 `getByTestId('ai-consumption-settings-content-indexing-credits-modal')`; se modal aparecer, clicar no botão Confirmar `getByTestId('ai-consumption-settings-content-indexing-credits-modal-confirm-button')`). Em seguida, clicar no sub-toggle Período: `getByTestId('ai-consumption-settings-content-indexing-specific-period-switch')`. Observar o estado após o clique.
    - expect: Após habilitar o sub-toggle Período, o campo 'Data inicial' deve aparecer no DOM: `getByTestId('ai-consumption-settings-content-indexing-period-start-date-input')` visível com `type='date'`, label 'Data inicial', marcado como obrigatório (`isRequired=true`)
    - expect: O campo 'Data final' deve aparecer: `getByTestId('ai-consumption-settings-content-indexing-period-end-date-input')` visível com `type='date'`, label 'Data final', NÃO obrigatório
    - expect: Enquanto o sub-toggle Período estiver DESABILITADO, os campos Data inicial e Data final NÃO devem estar presentes no DOM (renderização condicional)
    - expect: A validação das datas só ocorre quando o switch de período está habilitado
  4. Com o sub-toggle Período habilitado e os campos de data visíveis: preencher apenas o campo 'Data inicial' (`getByTestId('ai-consumption-settings-content-indexing-period-start-date-input')`) com uma data válida (ex: '2024-01-01'). Deixar o campo 'Data final' (`getByTestId('ai-consumption-settings-content-indexing-period-end-date-input')`) vazio. Clicar no botão Salvar (`getByTestId('ai-consumption-settings-edit-save-button')`).
    - expect: O formulário deve ser salvo com sucesso (sem erro de validação em 'Data final', pois ela é opcional)
    - expect: O painel de confirmação de datas (`getByTestId('ai-consumption-settings-content-indexing-period-confirmation')`) deve aparecer abaixo dos campos, exibindo a data inicial informada
    - expect: O alerta de período limitado (`getByTestId('ai-consumption-settings-content-indexing-period-limited-alert')`) NÃO deve ser exibido quando apenas a Data inicial está preenchida (sem Data final)
    - expect: A indexação deve considerar apenas conteúdos a partir da data inicial informada, sem data final
  5. Com o sub-toggle Período habilitado: preencher o campo 'Data inicial' com uma data válida (ex: '2024-01-01') E preencher o campo 'Data final' com uma data posterior válida (ex: '2024-12-31'). Observar o comportamento abaixo dos campos.
    - expect: O painel de confirmação de datas (`getByTestId('ai-consumption-settings-content-indexing-period-confirmation')`) deve aparecer abaixo dos campos, exibindo o período com data inicial e data final confirmadas
    - expect: O alerta de período limitado (`getByTestId('ai-consumption-settings-content-indexing-period-limited-alert')`) deve ser exibido quando AMBAS as datas estão preenchidas (período fechado)
    - expect: O alerta deve conter o título 'Atenção ao período limitado' e a mensagem explicando que a IA irá aprender apenas com conteúdos criados neste período específico, e que novos conteúdos criados após a data final ou atualizações em conteúdos existentes não serão considerados
    - expect: Clicar no botão Salvar (`getByTestId('ai-consumption-settings-edit-save-button')`) deve persistir as configurações com sucesso
  6. REVIEW_NEEDED (comportamento backend): Com configurações de período salvas, simular alteração dos filtros/critérios de indexação (ex: desmarcar um tipo de conteúdo como 'Curso' em `getByTestId('ai-consumption-settings-content-indexing-type-course')`, ou alterar o período). Salvar as novas configurações via `getByTestId('ai-consumption-settings-edit-save-button')`. Verificar persistência da alteração (asserção UI alternativa): recarregar a página de edição do ambiente e verificar que os novos valores estão refletidos nos controles.
    - expect: ASSERÇÃO UI ALTERNATIVA: após salvar e recarregar a página, os controles devem refletir os valores recém-salvos (o checkbox 'Curso' deve estar desmarcado se foi desmarcado, o período novo deve estar presente)
    - expect: COMPORTAMENTO BACKEND (REVIEW_NEEDED - requer verificação no banco ou API): conteúdos previamente indexados que saem do escopo da nova configuração devem ser INATIVADOS (não excluídos); ao retornar ao escopo, devem ser REATIVADOS sem nova cobrança de créditos - esta validação não é verificável 100% via UI sem acesso a estado de indexação
  7. Navegar para a tela de Configurações de Créditos de IA: https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings. Identificar um ambiente adicional com 'Herdar configurações' habilitado (switch `ai-consumption-analysis-settings-inherit-from-primary-switch-{envId}` checked=true - ex: 'Avião' envId=36796 ou 'Fenix' envId=36800). Clicar no botão de editar deste ambiente (`getByTestId('ai-consumption-analysis-edit-button')` na linha correspondente).
    - expect: A tela de edição do ambiente herdado deve abrir em /o/36602/ai_consumption_analysis/{envId}/edit_additional_organization_permissions
    - expect: O título deve exibir o nome do ambiente herdado
    - expect: A seção de Indexação de conteúdo deve aparecer com o toggle mestre (`getByTestId('ai-consumption-settings-content-indexing-master-switch')`) visível, porém sem os controles detalhados de sub-configuração (a edição de indexação detalhada é bloqueada para ambientes herdados)
    - expect: REVIEW_NEEDED (IA usando conteúdos): verificar via outro meio (painel de IA ou API) que a IA do ambiente herdado está usando os conteúdos do ambiente principal - esta validação requer estado de indexação ativo
  8. Retornar à tela de Configurações: https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings. Identificar o ambiente independente `_Ambiente` (envId=36799) - confirmar que o switch de herança (`getByTestId('ai-consumption-analysis-settings-inherit-from-primary-switch-36799')`) está DESMARCADO (unchecked). Clicar no botão de editar do `_Ambiente` (`getByTestId('ai-consumption-analysis-edit-button')` na linha de `_Ambiente`).
    - expect: A tela de edição do ambiente independente deve abrir em /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions
    - expect: O título deve exibir '_Ambiente'
    - expect: A seção de Indexação de conteúdo deve apresentar TODOS os controles detalhados (sub-toggle Período, checkboxes de Tipo de conteúdo, Tipo de atividade, Situação do conteúdo, Exceções) - indicando que o ambiente NÃO herda as configurações do principal
    - expect: A edição completa deve estar disponível (sem bloqueio de herança)
    - expect: REVIEW_NEEDED (IA usando conteúdos): verificar via outro meio que a IA do ambiente independente usa apenas os conteúdos próprios indexados, não os do ambiente principal
