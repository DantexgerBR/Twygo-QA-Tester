# Configurar a indexação - CURSO checkbox

## Application Overview

Plano de testes para a funcionalidade "Configurar a indexação de conteúdo por ambiente" na plataforma Twygo (Créditos de IA - Fase 2). O teste cobre a tela de edição de permissões adicionais do ambiente independente "_Ambiente" (envId=36799), acessível em /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. O módulo permite que o administrador configure quais tipos de conteúdo e situações podem ser indexados pela IA, ativando o toggle mestre de indexação e selecionando checkboxes de tipos de conteúdo (Curso, Trilha, Pacote, Texto, Página, Aula, PDF estampado, Vídeo, Arquivos) e situações (Em desenvolvimento, Liberados, Suspensos). Checkboxes "(não elegível)" — Questionário, Vídeo externo, SCORM, Games — permanecem sempre desabilitados. Ao salvar com o toggle ativo e pelo menos um checkbox marcado, o sistema exibe o modal RN37 "Processo de indexação de conteúdo" (data-test-id: ai-consumption-settings-content-indexing-credits-modal) com botões Cancelar e "Confirmar e iniciar". Após confirmação, a tela retorna ao tab Configurações e, ao reabrir a edição, o container de indexação fica bloqueado com aria-disabled=true e banner de alerta data-status=warning informando sincronização em andamento. Seletores principais mapeados via DOM ao vivo no ambiente de staging (stage10.stage.twygoead.com).

## Test Scenarios

### 1. Configurar a indexação de conteúdo por ambiente - CURSO checkbox

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar a indexação - CURSO checkbox (19 steps)

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-checkbox.spec.ts`

**Steps:**
  1. PRÉ-CONDIÇÃO — Login e navegação. Acesse https://stage10.stage.twygoead.com/users/login, preencha email=evertongambeta@gmail.com / password=123456 e submeta. No menu de perfil (botão 'Aluno G' no canto superior direito), clique em 'Administrador' para trocar para o perfil admin. Confirme que a URL muda para /o/36602/events?tab=events&profile=admin. Em seguida, acesse diretamente /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions (ambiente _Ambiente, envId=36799). PRÉ-CONDIÇÃO ADICIONAL: se o container de indexação exibir aria-disabled=true e o banner 'Existe uma sincronização de conteúdo em andamento', clique em Salvar (data-test-id: ai-consumption-settings-edit-save-button) para fazer um save sem alterações e aguardar redirecionamento; renavegue para a mesma URL. Repita até o container não ter aria-disabled=true. NOTA: o estado 'bloqueado por sync' pode persistir entre runs — nesse caso o teste documenta a presença do banner e aguarda condição antes de prosseguir.
    - expect: URL atual contém /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions
    - expect: Perfil ativo é Administrador (visível na barra superior)
    - expect: Toggle mestre de Indexação de conteúdo (data-test-id: ai-consumption-settings-content-indexing-master-switch) está visível na página
    - expect: Botão Salvar (data-test-id: ai-consumption-settings-edit-save-button) está visível
    - expect: Botão Cancelar (data-test-id: ai-consumption-settings-edit-cancel-button) está visível
  2. STEP 1 — Habilitar toggle Indexação + marcar apenas TEXTO + Salvar. Certifique-se que o toggle mestre (data-test-id: ai-consumption-settings-content-indexing-master-switch, input id: ai-consumption-settings-content-indexing-can-ingest) está DESMARCADO. Se já estiver marcado, desmarque-o. Marque o toggle mestre (clique no label com data-test-id ai-consumption-settings-content-indexing-master-switch). Aguarde a seção de checkboxes de tipos de conteúdo aparecer. Garanta que apenas o checkbox TEXTO (data-test-id do label: ai-consumption-settings-content-indexing-asset-text) esteja marcado — desmarque todos os demais tipos de conteúdo e situações que estiverem marcados. Clique no botão Salvar (data-test-id: ai-consumption-settings-edit-save-button). REVIEW_NEEDED (validação fim-a-fim): Após salvar e confirmar modal, o chat de suporte ao aluno deve responder baseado em indexação apenas de conteúdos do tipo Texto — esta parte não é automatizável nesta suite.
    - expect: Modal 'Processo de indexação de conteúdo' (data-test-id: ai-consumption-settings-content-indexing-credits-modal) aparece com título 'Processo de indexação de conteúdo'
    - expect: Modal exibe aviso sobre tempo de processamento e consumo de créditos
    - expect: Modal exibe box de custo estimado (data-test-id: ai-consumption-settings-content-indexing-credits-summary-box) e saldo atual (data-test-id: ai-consumption-settings-content-indexing-current-balance-text)
    - expect: Botão 'Confirmar e iniciar' (data-test-id: ai-consumption-settings-content-indexing-credits-modal-confirm-button) está visível e habilitado
    - expect: Botão 'Cancelar' (data-test-id: ai-consumption-settings-content-indexing-credits-modal-cancel-button) está visível
    - expect: Ao clicar em 'Confirmar e iniciar', o modal é fechado e a página redireciona para /o/36602/ai_consumption_analysis?tab=settings
    - expect: REVIEW_NEEDED: Validação no chat do aluno de que indexação ocorreu apenas para conteúdo tipo Texto
  3. STEP 2 — Habilitar toggle Indexação + marcar apenas PÁGINA + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre (data-test-id: ai-consumption-settings-content-indexing-master-switch) se estiver desabilitado. Garanta que apenas o checkbox PÁGINA (data-test-id do label: ai-consumption-settings-content-indexing-asset-page) esteja marcado — desmarque todos os demais. Clique em Salvar (data-test-id: ai-consumption-settings-edit-save-button). REVIEW_NEEDED: chat do aluno valida indexação apenas de Página.
    - expect: Modal 'Processo de indexação de conteúdo' (data-test-id: ai-consumption-settings-content-indexing-credits-modal) aparece após clicar Salvar
    - expect: Modal contém botões 'Confirmar e iniciar' e 'Cancelar'
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de indexação apenas para conteúdo tipo Página
  4. STEP 3 — Habilitar toggle Indexação + marcar apenas AULA + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Garanta que apenas o checkbox AULA (data-test-id do label: ai-consumption-settings-content-indexing-asset-lesson) esteja marcado. Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação apenas de Aula.
    - expect: Modal 'Processo de indexação de conteúdo' aparece com dados de custo estimado e saldo
    - expect: Ao confirmar, sistema redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de indexação apenas para conteúdo tipo Aula
  5. STEP 4 — Habilitar toggle Indexação + marcar apenas PDF ESTAMPADO + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Garanta que apenas o checkbox PDF ESTAMPADO (data-test-id do label: ai-consumption-settings-content-indexing-asset-stamped_pdf) esteja marcado. Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação apenas de PDF estampado.
    - expect: Modal RN37 'Processo de indexação de conteúdo' aparece
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de indexação apenas para PDF Estampado
  6. STEP 5 — Habilitar toggle Indexação + marcar apenas VÍDEO + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Garanta que apenas o checkbox VÍDEO (data-test-id do label: ai-consumption-settings-content-indexing-asset-video) esteja marcado. Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação apenas de Vídeo.
    - expect: Modal RN37 aparece com custo estimado e saldo atual
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de indexação apenas para Vídeo
  7. STEP 6 — Habilitar toggle Indexação + marcar apenas ARQUIVOS + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Garanta que apenas o checkbox ARQUIVOS (data-test-id do label: ai-consumption-settings-content-indexing-asset-files) esteja marcado. Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação apenas de Arquivos.
    - expect: Modal RN37 aparece
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de indexação apenas para Arquivos
  8. STEP 7 — Verificar checkboxes '(não elegível)' estão DESABILITADOS. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Se necessário, habilite o toggle mestre para que a seção de tipos fique visível. Localize os 4 checkboxes com label '(não elegível)': Questionário (data-test-id: ai-consumption-settings-content-indexing-asset-assetQuiz-disabled), Vídeo externo (data-test-id: ai-consumption-settings-content-indexing-asset-external_video-disabled), SCORM (data-test-id: ai-consumption-settings-content-indexing-asset-scorm-disabled), Games (data-test-id: ai-consumption-settings-content-indexing-asset-games-disabled). Tente clicar em cada um dos 4 checkboxes. Verifique o atributo 'disabled' em cada input.
    - expect: O checkbox 'Questionário (não elegível)' está presente na tela com label contendo o texto '(não elegível)'
    - expect: O checkbox 'Questionário (não elegível)' tem atributo disabled=true (toBeDisabled() passa)
    - expect: O checkbox 'Vídeo externo (não elegível)' está presente e tem disabled=true
    - expect: O checkbox 'SCORM (não elegível)' está presente e tem disabled=true
    - expect: O checkbox 'Games (não elegível)' está presente e tem disabled=true
    - expect: Nenhum dos 4 checkboxes permite ser marcado — clicar neles não muda o estado checked
  9. STEP 8 — Habilitar toggle Indexação + marcar apenas EM DESENVOLVIMENTO + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Garanta que o checkbox EM DESENVOLVIMENTO (data-test-id do label: ai-consumption-settings-content-indexing-status-development) esteja marcado e os demais checkboxes de situação (Liberados, Suspensos) desmarcados. Pelo menos um tipo de conteúdo deve estar marcado (marque Curso — data-test-id: ai-consumption-settings-content-indexing-type-course — para garantir seleção válida). Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação só de conteúdos em situação 'Em desenvolvimento'.
    - expect: Modal RN37 'Processo de indexação de conteúdo' aparece
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de que indexação ocorreu somente para conteúdos Em Desenvolvimento
  10. STEP 9 — Habilitar toggle Indexação + marcar apenas LIBERADOS + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque o checkbox LIBERADOS (data-test-id do label: ai-consumption-settings-content-indexing-status-released) e desmarque Em Desenvolvimento e Suspensos. Pelo menos um tipo de conteúdo marcado (ex: Curso). Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação só de conteúdos Liberados.
    - expect: Modal RN37 aparece
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de que indexação ocorreu somente para conteúdos Liberados
  11. STEP 10 — Habilitar toggle Indexação + marcar apenas SUSPENSOS + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque o checkbox SUSPENSOS (data-test-id do label: ai-consumption-settings-content-indexing-status-suspended) e desmarque Em Desenvolvimento e Liberados. Pelo menos um tipo de conteúdo marcado (ex: Curso). Clique em Salvar. REVIEW_NEEDED: chat do aluno valida indexação só de conteúdos Suspensos.
    - expect: Modal RN37 aparece
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: REVIEW_NEEDED: Validação no chat do aluno de que indexação ocorreu somente para conteúdos Suspensos
  12. STEP 11 — Marcar MAIS DE UM checkbox de tipo de conteúdo + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque os seguintes checkboxes de tipo de conteúdo: TEXTO (ai-consumption-settings-content-indexing-asset-text) E PÁGINA (ai-consumption-settings-content-indexing-asset-page) E AULA (ai-consumption-settings-content-indexing-asset-lesson). Mantenha pelo menos um checkbox de situação marcado (ex: Liberados). Clique em Salvar. Confirme o modal RN37. Navegue de volta para a edição e confirme que os 3 checkboxes ainda estão marcados (persistência). REVIEW_NEEDED: chat do aluno confirma que indexação ocorreu para múltiplos tipos de conteúdo simultaneamente.
    - expect: Modal RN37 aparece após salvar com múltiplas seleções
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: Ao reabrir edição (após sync concluir), os 3 checkboxes (Texto, Página, Aula) permanecem marcados — estado persiste corretamente
    - expect: REVIEW_NEEDED: Validação no chat do aluno de que múltiplos tipos foram indexados
  13. STEP 12 — Marcar TODOS os checkboxes elegíveis + Salvar. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque TODOS os checkboxes de tipo de conteúdo elegíveis: CURSO (ai-consumption-settings-content-indexing-type-course), TRILHA (ai-consumption-settings-content-indexing-type-trail), PACOTE (ai-consumption-settings-content-indexing-type-package), TEXTO (ai-consumption-settings-content-indexing-asset-text), PÁGINA (ai-consumption-settings-content-indexing-asset-page), AULA (ai-consumption-settings-content-indexing-asset-lesson), PDF ESTAMPADO (ai-consumption-settings-content-indexing-asset-stamped_pdf), VÍDEO (ai-consumption-settings-content-indexing-asset-video), ARQUIVOS (ai-consumption-settings-content-indexing-asset-files). Marque TODOS os checkboxes de situação: EM DESENVOLVIMENTO (ai-consumption-settings-content-indexing-status-development), LIBERADOS (ai-consumption-settings-content-indexing-status-released), SUSPENSOS (ai-consumption-settings-content-indexing-status-suspended). Clique em Salvar.
    - expect: Modal RN37 aparece com todos os checkboxes selecionados
    - expect: O custo estimado exibido no modal é compatível com seleção total
    - expect: Ao confirmar, redireciona para tab Configurações
    - expect: Ao reabrir edição (após sync), todos os 9 tipos elegíveis e 3 situações permanecem marcados (persistência total)
  14. STEP 13 — Marcar checkboxes → indexar → desmarcar → indexar de novo. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque CURSO (ai-consumption-settings-content-indexing-type-course) e LIBERADOS (ai-consumption-settings-content-indexing-status-released). Clique em Salvar e confirme o modal RN37. Aguarde redirecionamento para tab Configurações. Reabra a edição. Desmarque o checkbox CURSO. Clique em Salvar novamente e confirme o modal RN37. Verifique persistência do estado desmarcado. REVIEW_NEEDED: Criar curso do tipo TEXTO sobre 'Pirâmides do Egito' e verificar via chat do aluno que conteúdo não é mais indexado após desmarcar — esta parte não é automatizável nesta suite.
    - expect: Após primeiro save: modal RN37 aparece, ao confirmar redireciona para Configurações
    - expect: Ao reabrir edição: CURSO está marcado (persiste do step anterior ao sync concluir)
    - expect: Após desmarcar CURSO e salvar: modal RN37 aparece novamente
    - expect: Ao reabrir edição após segundo save: CURSO está desmarcado (persistência do estado desmarcado)
    - expect: REVIEW_NEEDED: Criação de curso TEXTO sobre Pirâmides do Egito e validação via chat do aluno
  15. STEP 14 — Marcar checkbox CURSO + Salvar + confirmar modal RN37. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque apenas o checkbox CURSO (data-test-id do label: ai-consumption-settings-content-indexing-type-course). Garanta que pelo menos um checkbox de situação esteja marcado (ex: Liberados). Clique em Salvar (data-test-id: ai-consumption-settings-edit-save-button). REVIEW_NEEDED: chat do aluno valida indexação de CURSO.
    - expect: Modal 'Processo de indexação de conteúdo' (data-test-id: ai-consumption-settings-content-indexing-credits-modal) aparece
    - expect: Título do modal é 'Processo de indexação de conteúdo'
    - expect: Modal exibe aviso sobre tempo de processamento e consumo de créditos de IA
    - expect: Box de custo estimado (data-test-id: ai-consumption-settings-content-indexing-credits-summary-box) exibe valores
    - expect: Saldo atual (data-test-id: ai-consumption-settings-content-indexing-current-balance-text) exibe créditos disponíveis
    - expect: Ao clicar 'Confirmar e iniciar' (data-test-id: ai-consumption-settings-content-indexing-credits-modal-confirm-button), modal é fechado
    - expect: Redireciona para /o/36602/ai_consumption_analysis?tab=settings
    - expect: REVIEW_NEEDED: Validação via chat do aluno de que indexação de CURSO ocorreu
  16. STEP 15 — Verificar BLOQUEIO DA TELA após salvar e iniciar indexação. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Habilite o toggle mestre. Marque alguns checkboxes (ex: CURSO e TEXTO). Clique em Salvar. No modal RN37, clique em 'Confirmar e iniciar'. Aguarde redirecionamento para tab Configurações. Reabra imediatamente a edição navegando para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions.
    - expect: Ao reabrir a edição enquanto sincronização está em andamento: o container da seção de indexação exibe aria-disabled='true' (getByTestId verificando a stack com aria-disabled)
    - expect: O toggle mestre (data-test-id: ai-consumption-settings-content-indexing-master-switch) não pode ser clicado — tentativa de click resulta em timeout/elemento not enabled
    - expect: Os checkboxes de tipo de conteúdo e situação ficam inacessíveis (não interativos)
    - expect: A tela está efetivamente bloqueada para edição das configurações de indexação até a sincronização terminar
  17. STEP 16 — Verificar TARJA AMARELA (banner de warning) indicando indexação em andamento. Após confirmar save com indexação (conforme Step 15), reabra a edição em /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions imediatamente.
    - expect: Um alerta/banner com data-status='warning' e role='alert' está visível na seção de indexação
    - expect: O texto do banner contém a mensagem 'Existe uma sincronização de conteúdo em andamento. Aguarde a finalização para editar as configurações de indexação.' (ou texto similar indicando indexação em curso)
    - expect: O banner é visível antes de qualquer interação com a página
    - expect: A cor do banner é amarela/warning (chakra-alert com data-status=warning)
  18. STEP 17 — Desmarcar TODOS os checkboxes → verificar auto-desativação do toggle mestre. Navegue para /o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions. Aguarde o sync terminar (banner de warning deve sumir ou container não deve ter aria-disabled=true). Habilite o toggle mestre se não estiver habilitado. Marque pelo menos 2 checkboxes de tipo de conteúdo (ex: CURSO e TEXTO). Desmarque um a um todos os checkboxes de tipo de conteúdo. Observe o estado do toggle mestre (data-test-id: ai-consumption-settings-content-indexing-master-switch, input id: ai-consumption-settings-content-indexing-can-ingest) após desmarcar o ÚLTIMO checkbox elegível.
    - expect: Enquanto pelo menos 1 checkbox de tipo está marcado, o toggle mestre permanece habilitado (checked=true)
    - expect: Ao desmarcar o ÚLTIMO checkbox de tipo de conteúdo elegível: o toggle mestre 'Indexação de conteúdo' é AUTOMATICAMENTE desabilitado (checked passa para false sem necessidade de click manual)
    - expect: O toggle mestre mostra visualmente estado OFF após auto-desativação
    - expect: Este comportamento de UX é verificável via: expect(page.locator('#ai-consumption-settings-content-indexing-can-ingest')).not.toBeChecked()
  19. STEP 18 — Verificar ambiente HERDADO: herança bloqueia edição independente. Navegue para /o/36602/ai_consumption_analysis?tab=settings (tab Configurações). Localize na tabela um ambiente com herança habilitada — ex: 'Avião' (envId=36796, data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-36796 com data-checked presente). Observe a coluna 'Herdar configurações do principal' para esse ambiente. Clique no botão edit (data-test-id: ai-consumption-analysis-edit-button) da linha do ambiente herdado. Na tela de edição do ambiente herdado, verifique como as configurações de indexação são apresentadas.
    - expect: Na tabela de Configurações, o toggle 'Herdar configurações do principal' do ambiente Avião (data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-36796) está visualmente no estado ON (data-checked presente no label)
    - expect: A tela de edição do ambiente herdado (ex: /o/36602/ai_consumption_analysis/36796/edit_additional_organization_permissions) carrega sem erro
    - expect: Na tela de edição do ambiente herdado: os checkboxes de tipo de conteúdo (ai-consumption-settings-content-indexing-type-course, etc.) NÃO estão presentes ou estão bloqueados — indicando que as configurações são herdadas do ambiente principal
    - expect: O toggle mestre de indexação (ai-consumption-settings-content-indexing-master-switch) está presente mas não permite edição independente (ou está bloqueado via aria-disabled)
  20. STEP 19 — Verificar ambiente INDEPENDENTE: não herda configurações. Navegue para /o/36602/ai_consumption_analysis?tab=settings. Localize na tabela o ambiente '_Ambiente' (envId=36799). Observe a coluna 'Herdar configurações do principal' para esse ambiente. Clique em edit (data-test-id: ai-consumption-analysis-edit-button) da linha _Ambiente.
    - expect: Na tabela de Configurações, o toggle 'Herdar configurações do principal' do ambiente _Ambiente (data-test-id: ai-consumption-analysis-settings-inherit-from-primary-switch-36799) está no estado OFF (sem data-checked)
    - expect: A tela de edição do _Ambiente (/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions) exibe TODOS os checkboxes de tipo de conteúdo e situação quando o toggle mestre está habilitado: Curso (ai-consumption-settings-content-indexing-type-course), Trilha (ai-consumption-settings-content-indexing-type-trail), Pacote (ai-consumption-settings-content-indexing-type-package), Texto (ai-consumption-settings-content-indexing-asset-text), Página (ai-consumption-settings-content-indexing-asset-page), Aula (ai-consumption-settings-content-indexing-asset-lesson), PDF estampado (ai-consumption-settings-content-indexing-asset-stamped_pdf), Vídeo (ai-consumption-settings-content-indexing-asset-video), Arquivos (ai-consumption-settings-content-indexing-asset-files), Em desenvolvimento (ai-consumption-settings-content-indexing-status-development), Liberados (ai-consumption-settings-content-indexing-status-released), Suspensos (ai-consumption-settings-content-indexing-status-suspended)
    - expect: O ambiente independente permite configurar checkboxes de forma autônoma, sem herdar do ambiente principal
    - expect: Após alterar configurações e salvar, as mudanças afetam apenas o _Ambiente, não outros ambientes
