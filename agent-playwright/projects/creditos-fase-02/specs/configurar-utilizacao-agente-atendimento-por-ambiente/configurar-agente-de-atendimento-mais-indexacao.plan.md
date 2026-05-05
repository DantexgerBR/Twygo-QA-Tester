# Configurar Agente de atendimento + Indexação

## Application Overview

Suite: Configurar a utilização do agente de atendimento por ambiente. Testa a tela de edição de configurações de IA de um ambiente secundário (envId 36799), cobrindo habilitar/desabilitar Indexação de conteúdo, marcar individualmente cada Tipo (Curso, Trilha, Pacote) e Asset (Texto, Página, Aula, PDF Estampado, Vídeo, Arquivos) e Status (Em desenvolvimento, Liberados, Suspensos), além de múltiplos checkboxes simultaneamente. Para cada configuração o fluxo UI é: habilitar toggle mestre → marcar checkbox → Salvar → confirmar modal RN37 (créditos). A asserção final via chat IA do aluno é marcada REVIEW_NEEDED pois requer interação com iframe de chat fora do escopo automatizável. Steps 14–16 cobrem desabilitar Indexação, herança de ambiente e independência de ambiente.

## Test Scenarios

### 1. Configurar Agente de atendimento + Indexação

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar Agente de atendimento + Indexação — 16 steps completos

**File:** `tests/features/configurar-utilizacao-agente-atendimento-por-ambiente/configurar-agente-de-atendimento-mais-indexacao.spec.ts`

**Steps:**
  1. Navegar para a URL de edição do ambiente 36799: `/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions`. Verificar se há sync alert via `editPage.isSyncBlocking()`. Se sync bloqueante, marcar step como bloqueado e encerrar o teste antecipadamente (skip).
    - expect: A página de edição do ambiente carrega com o heading '_Ambiente'.
    - expect: O toggle `editPage.contentIndexingMasterSwitch` é visível na seção 'Indexação de conteúdo'.
    - expect: Se `isSyncBlocking()` retornar true, o sync alert com texto definido em `SYNC_ALERT_TEXT` é visível e o teste é abortado.
  2. STEP 1 — Tipo CURSO: Habilitar toggle mestre de Indexação (`editPage.contentIndexingMasterSwitch`) se não estiver ativo. Marcar apenas `editPage.typeCourse`. Clicar em `editPage.saveButton`.
    - expect: Toggle `contentIndexingMasterSwitch` fica checked (input interno `contentIndexingMasterInput` retorna checked === true).
    - expect: Checkbox `typeCourse` fica marcado.
    - expect: Modal RN37 (`editPage.creditsModal`) exibe resumo de créditos em `editPage.creditsModalSummary` e saldo atual em `editPage.creditsModalCurrentBalance`.
    - expect: REVIEW_NEEDED: No chat IA do aluno, verificar que o agente responde usando conteúdos do tipo Curso.
  3. Confirmar o modal RN37 clicando em `editPage.creditsModalConfirm`. Aguardar modal fechar e página retornar ao estado salvo.
    - expect: Modal fecha (`editPage.creditsModal` não está visível).
    - expect: Navegação retorna ou estado salvo é confirmado (URL permanece na edit page ou retorna à lista).
  4. STEP 2 — Tipo TRILHA: Abrir novamente a edição (ou permanecer na tela se ainda aberta). Habilitar toggle mestre se necessário. Desmarcar `editPage.typeCourse`. Marcar apenas `editPage.typeTrail`. Salvar e confirmar modal RN37.
    - expect: Checkbox `typeTrail` fica marcado; `typeCourse` desmarcado.
    - expect: Modal RN37 aparece e é confirmado com sucesso.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando conteúdos do tipo Trilha.
  5. STEP 3 — Tipo PACOTE: Desmarcar `editPage.typeTrail`. Marcar apenas `editPage.typePackage`. Salvar e confirmar modal RN37.
    - expect: Checkbox `typePackage` marcado; demais Tipo desmarcados.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando conteúdos do tipo Pacote.
  6. STEP 4 — Asset TEXTO: Desmarcar `editPage.typePackage`. Marcar apenas `editPage.assetText`. Salvar e confirmar modal RN37.
    - expect: Checkbox `assetText` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando ativos do tipo Texto.
  7. STEP 5 — Asset PÁGINA: Desmarcar `editPage.assetText`. Marcar apenas `editPage.assetPage`. Salvar e confirmar modal RN37.
    - expect: Checkbox `assetPage` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando ativos do tipo Página.
  8. STEP 6 — Asset AULA: Desmarcar `editPage.assetPage`. Marcar apenas `editPage.assetLesson`. Salvar e confirmar modal RN37.
    - expect: Checkbox `assetLesson` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando ativos do tipo Aula.
  9. STEP 7 — Asset PDF ESTAMPADO: Desmarcar `editPage.assetLesson`. Marcar apenas `editPage.assetStampedPdf`. Salvar e confirmar modal RN37.
    - expect: Checkbox `assetStampedPdf` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando ativos do tipo PDF Estampado.
  10. STEP 8 — Asset VÍDEO: Desmarcar `editPage.assetStampedPdf`. Marcar apenas `editPage.assetVideo`. Salvar e confirmar modal RN37.
    - expect: Checkbox `assetVideo` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando ativos do tipo Vídeo.
  11. STEP 9 — Asset ARQUIVO: Desmarcar `editPage.assetVideo`. Marcar apenas `editPage.assetFiles`. Salvar e confirmar modal RN37.
    - expect: Checkbox `assetFiles` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando ativos do tipo Arquivo.
  12. STEP 10 — Status EM DESENVOLVIMENTO: Desmarcar `editPage.assetFiles`. Marcar apenas `editPage.statusDevelopment`. Salvar e confirmar modal RN37.
    - expect: Checkbox `statusDevelopment` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde indexando apenas conteúdos Em desenvolvimento.
  13. STEP 11 — Status LIBERADOS: Desmarcar `editPage.statusDevelopment`. Marcar apenas `editPage.statusReleased`. Salvar e confirmar modal RN37.
    - expect: Checkbox `statusReleased` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde indexando apenas conteúdos Liberados.
  14. STEP 12 — Status SUSPENSOS: Desmarcar `editPage.statusReleased`. Marcar apenas `editPage.statusSuspended`. Salvar e confirmar modal RN37.
    - expect: Checkbox `statusSuspended` marcado.
    - expect: Modal RN37 confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde indexando apenas conteúdos Suspensos.
  15. STEP 13 — MAIS DE UM CHECKBOX: Habilitar toggle mestre. Marcar simultaneamente `editPage.typeCourse`, `editPage.typeTrail`, `editPage.assetText`, `editPage.assetVideo`, `editPage.statusReleased`. Salvar e confirmar modal RN37.
    - expect: Todos os cinco checkboxes selecionados ficam marcados ao mesmo tempo.
    - expect: Modal RN37 aparece refletindo configuração combinada e é confirmado.
    - expect: REVIEW_NEEDED: Chat IA do aluno responde usando combinação dos tipos/assets/status selecionados.
  16. STEP 14 — DESABILITAR Indexação: Clicar em `editPage.contentIndexingMasterSwitch` para desativar o toggle mestre. Verificar que os sub-campos (checkboxes Tipo, Asset, Status, período) ficam ocultos/desabilitados. Salvar e confirmar modal RN37 se exibido.
    - expect: Input `contentIndexingMasterInput` fica unchecked.
    - expect: Checkboxes de Tipo/Asset/Status não são mais visíveis ou ficam desabilitados.
    - expect: Salvar (e confirmar modal se aparecer) executa com sucesso.
    - expect: REVIEW_NEEDED: Chat IA do aluno NÃO retorna textos de conteúdo, pois nada está indexado.
  17. STEP 15 — Ambiente HERDADO: Navegar para `/o/36602/ai_consumption_analysis?tab=settings`. Localizar um ambiente com herança ativa usando `settingsPage.inheritSwitch(<envId>)` (verificar toggle inherit checked). Tentar clicar no botão de edição do ambiente herdado via `settingsPage.editButtonForEnv(<envId>)` ou navegar diretamente à URL de edição. Verificar tooltip de bloqueio na tela de edição.
    - expect: O toggle `inheritFromPrimarySwitch-<envId>` está marcado como ativo (herdado).
    - expect: Na tela de edição, os controles de Indexação apresentam tooltip com texto `INHERITED_EDIT_BLOCK_TOOLTIP` ('Este ambiente está herdando configurações do ambiente principal. Desative a herança para editar.').
    - expect: Os controles de Indexação estão bloqueados para edição enquanto herança está ativa.
    - expect: REVIEW_NEEDED: Chat IA do aluno do ambiente herdado usa as configurações do ambiente principal.
  18. STEP 16 — Ambiente INDEPENDENTE: Navegar para a tela de edição de um ambiente com herança DESATIVADA (toggle `inheritFromPrimarySwitch` desmarcado). Verificar que os controles de Indexação estão editáveis e não exibem tooltip de bloqueio. Confirmar que alterações salvas neste ambiente NÃO afetam o ambiente principal.
    - expect: Toggle `inheritFromPrimarySwitch-<envId>` está desmarcado (ambiente independente).
    - expect: Todos os controles da seção Indexação estão habilitados para edição.
    - expect: Tooltip de bloqueio (`INHERITED_EDIT_BLOCK_TOOLTIP`) NÃO é exibido.
    - expect: Após salvar configuração diferente da do ambiente principal, a lista de configurações mostra valores distintos por ambiente.
    - expect: REVIEW_NEEDED: Chat IA do aluno do ambiente independente usa APENAS as configurações próprias deste ambiente, sem herdar do principal.
