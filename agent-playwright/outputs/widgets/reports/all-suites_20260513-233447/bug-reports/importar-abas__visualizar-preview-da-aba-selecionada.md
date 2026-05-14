# [spec-fragil] Visualizar preview da aba selecionada

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T02:34:47.109Z · commit 5585714_

## Identificação
- **Suite**: Importar abas
- **TC**: Visualizar preview da aba selecionada
- **Spec**: `projects/widgets/tests/features/importar-abas/visualizar-preview-aba.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\pages\PainelFormPage.ts:203:34`
- **Status**: failed (41988ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 5585714

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Painel Origem com Aba X e Aba Y seedadas — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByTestId('tabs-navigation-add-button')
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/trace.zip)

### IDs envolvidos
- orgId: 36988

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **baixa** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._