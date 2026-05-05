# Configurar Agente de atendimento

## Application Overview

Suite: Configurar a utilização do agente de atendimento por ambiente. Cobre o testcase "Configurar Agente de atendimento" (importance: crítico, 4 steps). O fluxo verifica o comportamento padrão do toggle "Agente de atendimento" para novos ambientes, a exibição de tooltip e subseção "Fontes de conhecimento", e a restrição de desabilitar o toggle quando ao menos um checkbox de fonte está habilitado. URL canônica de lista: /o/36602/ai_consumption_analysis?tab=settings. URL de edição do ambiente _Ambiente (envId=36799): /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Observações de recon: o toggle "Agente de atendimento" NÃO possui data-test-id próprio no DOM atual — seletor via getByRole('checkbox', { name: 'Agente de atendimento' }). Os checkboxes de "Fontes de conhecimento" (Interna/Externa) não aparecem no snapshot de recon com toggle desabilitado, indicando renderização condicional. Step 4 contém ambiguidade no XML (menciona 'Indexação de conteúdo' mas contexto é 'Agente de atendimento') — marcado REVIEW_NEEDED.

## Test Scenarios

### 1. Configurar a utilização do agente de atendimento por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar Agente de atendimento

**File:** `tests/features/configurar-utilizacao-agente-atendimento-por-ambiente/configurar-agente-de-atendimento.spec.ts`

**Steps:**
  1. Navegar para /o/36602/ai_consumption_analysis?tab=settings e localizar o ambiente '_Ambiente' (envId=36799) na listagem via data-test-id='ai-consumption-analysis-settings-list-container'. Clicar no botão de editar (data-test-id='ai-consumption-analysis-edit-button') correspondente à linha do ambiente _Ambiente para abrir a tela de edição em /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions.
    - expect: A página de edição carrega com URL /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions
    - expect: O heading '_Ambiente' (level 2) está visível na página
    - expect: O toggle 'Agente de atendimento' (getByRole('checkbox', { name: 'Agente de atendimento' })) está DESMARCADO por padrão para o ambiente novo
    - expect: Step 1 do XML confirmado: por default o Agente de atendimento vem DESABILITADO para novos ambientes
  2. Na tela de edição já aberta (/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions), verificar o estado do toggle 'Agente de atendimento' usando getByRole('checkbox', { name: 'Agente de atendimento' }) e checar a propriedade checked.
    - expect: O checkbox 'Agente de atendimento' está desmarcado (checked: false / not.toBeChecked())
    - expect: SUGESTÃO PR SEPARADO: adicionar data-test-id='ai-consumption-settings-attendant-agent-switch' no elemento label wrapping o checkbox (atualmente sem data-test-id no DOM)
    - expect: Step 2 do XML confirmado: toggle desmarcado por padrão
  3. Fazer hover sobre o ícone de tooltip (img adjacente ao label 'Agente de atendimento', localizado via seletor relativo ao checkbox: getByRole('checkbox', { name: 'Agente de atendimento' }).locator('..').locator('img') ou getByText('Agente de atendimento').locator('..').locator('img')) para exibir o texto do tooltip. Em seguida, habilitar o toggle 'Agente de atendimento' (getByRole('checkbox', { name: 'Agente de atendimento' })) e aguardar a renderização condicional da seção 'Fontes de conhecimento'. Verificar a presença dos checkboxes 'Interna' e 'Externa' e seus tooltips.
    - expect: Tooltip do toggle exibe exatamente: 'Agente de atendimento com respostas automatizadas, utilizando fontes de conhecimento configuráveis.'
    - expect: Após habilitar o toggle (checked: true / toBeChecked()), a seção 'Fontes de conhecimento' fica visível
    - expect: Checkbox 'Interna' está presente (getByRole('checkbox', { name: 'Interna' }) ou getByLabel('Interna'))
    - expect: Checkbox 'Externa' está presente (getByRole('checkbox', { name: 'Externa' }) ou getByLabel('Externa'))
    - expect: Cada checkbox de fonte possui ícone de tooltip próprio — verificar texto de cada tooltip via hover
    - expect: SUGESTÃO PR SEPARADO: adicionar data-test-id='ai-consumption-settings-attendant-agent-source-internal' e 'ai-consumption-settings-attendant-agent-source-external'
    - expect: Step 3 do XML confirmado: tooltip + seção Fontes de conhecimento com checkboxes Interna e Externa
  4. // REVIEW_NEEDED — Step 4 do XML menciona 'Indexação de conteúdo' mas o contexto declarado no testcase é 'Agente de atendimento'. Interpretação: com toggle 'Agente de atendimento' HABILITADO e ao menos um dos checkboxes de fonte ('Interna' ou 'Externa') MARCADO, tentar desabilitar o toggle 'Agente de atendimento' clicando em getByRole('checkbox', { name: 'Agente de atendimento' }). Aguardar possível feedback do sistema (alert, toast ou impedimento silencioso).
    - expect: O sistema NÃO permite desmarcar o toggle 'Agente de atendimento' enquanto há fontes dependentes habilitadas
    - expect: O toggle permanece MARCADO (toBeChecked()) após a tentativa de desmarcação
    - expect: // REVIEW_NEEDED: confirmar mecanismo de bloqueio — pode ser sync alert modal (como 'Indexação de conteúdo'), toast de erro, ou impedimento silencioso no DOM. Verificar texto exato da mensagem de validação em execução ao vivo
    - expect: // REVIEW_NEEDED: confirmar se a ambiguidade do XML ('Indexação de conteúdo' vs 'Agente de atendimento') representa um copy-paste error no XML ou comportamento compartilhado
    - expect: Step 4 do XML: toggle permanece marcado, sistema não permite desmarcar com dependentes ativos
