# Configurar a indexação - TRILHA

## Application Overview

Suite de teste para a funcionalidade "Configurar a utilização da indexação de conteúdo por ambiente" na plataforma Twygo (Gestão de Créditos de IA - Fase 2). O testcase cobre a habilitação do tipo de conteúdo TRILHA no painel de configurações de indexação do ambiente _Ambiente (envId=36799), incluindo persistência, modal de créditos (RN37), verificação de bloqueio por sincronização em andamento, comportamento em ambiente herdado e comportamento em ambiente independente. Ambiente: https://stage10.stage.twygoead.com. Perfil: SuperAdmin logado como evertongambeta@gmail.com / 123456 trocado para perfil Administrador antes de cada teste.

## Test Scenarios

### 1. Configurar a utilização do indexação de conteúdo por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar a indexação - TRILHA

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-trilha.spec.ts`

**Steps:**
  1. Navegar para https://stage10.stage.twygoead.com/users/login e preencher Login com 'evertongambeta@gmail.com' e Senha com '123456', em seguida clicar em 'Entrar'.
    - expect: A URL muda para /dashboard_students indicando login bem-sucedido.
  2. Clicar no botão de perfil 'Aluno G' no canto superior direito e selecionar a opção 'Administrador' na lista de perfis.
    - expect: A URL muda para /o/36602/events?tab=events&profile=admin e o botão de perfil passa a exibir 'Administrador G', confirmando troca de perfil.
  3. [STEP 1 - PARTE A: Pré-condição - Sync alert] Navegar diretamente para https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions e verificar se o alerta de sincronização em andamento está presente: elemento [role='alert'][data-status='warning'] com texto 'Existe uma sincronização de conteúdo em andamento. Aguarde a finalização para editar as configurações de indexação.'.
    - expect: Se o alerta de sincronização estiver presente: todos os controles da seção de indexação devem estar desabilitados (disabled), incluindo o master switch [data-test-id='ai-consumption-settings-content-indexing-master-switch'] e o checkbox Trilha [data-test-id='ai-consumption-settings-content-indexing-type-trail']. O teste documenta esse estado como BLOQUEADO — aguardar sincronização finalizar antes de prosseguir.
    - expect: Se o alerta de sincronização NÃO estiver presente: prosseguir para a etapa seguinte.
  4. [STEP 1 - PARTE B: Habilitar master switch se necessário] Verificar se o toggle mestre de indexação [data-test-id='ai-consumption-settings-content-indexing-master-switch'] está habilitado (checked). Se estiver desabilitado (não checked), clicar nele para ativá-lo.
    - expect: O toggle mestre de indexação de conteúdo fica no estado checked/habilitado, revelando os controles filhos de configuração (Período, Tipo de conteúdo, Tipo de atividade, Situação do conteúdo, Exceções).
  5. [STEP 1 - PARTE C: Marcar checkbox Trilha] Na seção 'Tipo de conteúdo', localizar o checkbox 'Trilha' via [data-test-id='ai-consumption-settings-content-indexing-type-trail']. Se o checkbox já estiver marcado (checked), desmarcá-lo primeiro e depois marcá-lo para garantir estado conhecido. Se estiver desmarcado, clicar para marcá-lo.
    - expect: O checkbox Trilha [data-test-id='ai-consumption-settings-content-indexing-type-trail'] fica no estado checked. Não deve aparecer nenhum sub-multiselect de seleção de trilhas específicas — a seleção é global para todas as trilhas disponíveis no ambiente.
  6. [STEP 1 - PARTE D: Salvar configuração] Clicar no botão Salvar [data-test-id='ai-consumption-settings-edit-save-button'].
    - expect: Cenário A (modal RN37 aparece): um modal de confirmação de créditos é exibido. Clicar no botão de confirmação [data-test-id='ai-consumption-settings-content-indexing-credits-modal-confirm-button'] para confirmar a operação.
    - expect: Cenário B (sem modal): o sistema salva diretamente e exibe mensagem de sucesso.
  7. [STEP 1 - PARTE E: Verificar persistência] Após o salvamento bem-sucedido, navegar novamente para https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions para confirmar que a configuração foi persistida.
    - expect: O checkbox Trilha [data-test-id='ai-consumption-settings-content-indexing-type-trail'] deve estar no estado checked após o reload da página.
    - expect: O toggle mestre de indexação [data-test-id='ai-consumption-settings-content-indexing-master-switch'] deve estar no estado checked.
    - expect: REVIEW_NEEDED: A asserção semântica 'sistema considera para indexação todas as trilhas selecionadas e todos os conteúdos vinculados a elas; conteúdos fora de trilhas não devem ser considerados' requer validação de IA fim-a-fim e não pode ser automatizada somente via UI.
  8. [STEP 2: Acessar ambiente herdado] Navegar para https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings e localizar um ambiente com o switch de herança ativo (ex: 'Avião', envId=36796, switch [data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-36796'] no estado ON/checked). Clicar no botão Editar (data-test-id='ai-consumption-analysis-edit-button') correspondente a esse ambiente herdado para acessar sua página de configuração em /o/36602/ai_consumption_analysis/36796/edit_additional_organization_permissions.
    - expect: A página de edição do ambiente herdado é aberta com sucesso.
    - expect: REVIEW_NEEDED: A verificação completa de que 'Configurações herdadas estão ativas e a IA está usando os conteúdos' depende de validação de comportamento de IA fim-a-fim.
  9. [STEP 2 - PARTE B: Verificar indicador de herança no ambiente herdado] Na página de edição do ambiente herdado, verificar se o switch de herança [data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-{envId}'] está no estado ON (checked), indicando que este ambiente herda as configurações do ambiente primário.
    - expect: O switch de herança fica no estado checked (ON), confirmando que o ambiente é herdado.
    - expect: Os controles de configuração de indexação devem refletir as configurações herdadas do ambiente primário — em particular o checkbox Trilha deve estar no mesmo estado que foi configurado no ambiente primário (_Ambiente).
    - expect: Se houver tooltip de bloqueio ao tentar editar controles herdados, este deve ser exibido informando que as configurações são herdadas e não podem ser editadas diretamente neste ambiente.
  10. [STEP 3: Acessar ambiente independente] Retornar para https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings e localizar um ambiente com o switch de herança desligado (ex: '123 Ambiente', envId=36797, switch [data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-36797'] no estado OFF/unchecked). Clicar no botão Editar correspondente a esse ambiente independente para acessar /o/36602/ai_consumption_analysis/36797/edit_additional_organization_permissions.
    - expect: A página de edição do ambiente independente é aberta com sucesso.
    - expect: REVIEW_NEEDED: A verificação de que 'a IA está usando os conteúdos conforme configuração própria do ambiente' requer validação de IA fim-a-fim.
  11. [STEP 3 - PARTE B: Verificar que o ambiente independente NÃO herda] Na página de edição do ambiente independente, verificar o estado do switch de herança [data-test-id='ai-consumption-analysis-settings-inherit-from-primary-switch-{envId}'].
    - expect: O switch de herança fica no estado unchecked (OFF), confirmando que o ambiente é independente e NÃO herda as configurações do ambiente primário.
    - expect: Os controles de configuração de indexação devem estar editáveis (não bloqueados por herança), permitindo configuração própria deste ambiente.
    - expect: O estado do checkbox Trilha [data-test-id='ai-consumption-settings-content-indexing-type-trail'] pode ser diferente do ambiente primário — isso é esperado para ambientes independentes.
