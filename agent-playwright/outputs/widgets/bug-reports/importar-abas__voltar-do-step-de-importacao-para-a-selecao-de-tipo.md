# [spec-fragil] Voltar do step de importação para a seleção de tipo

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T02:40:16.706Z · commit 72ab290_

## Identificação
- **Suite**: Importar abas
- **TC**: Voltar do step de importação para a seleção de tipo
- **Spec**: `projects/widgets/tests/features/importar-abas/voltar-step-importacao.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\voltar-step-importacao.spec.ts:32:42`
- **Status**: failed (42015ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 72ab290

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar painel, abrir Layouts e navegar até o step 2 de "Importar de outro painel" — ❌ **falhou aqui**
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
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-fbd59-ação-para-a-seleção-de-tipo-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-fbd59-ação-para-a-seleção-de-tipo-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-fbd59-ação-para-a-seleção-de-tipo-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-fbd59-ação-para-a-seleção-de-tipo-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-fbd59-ação-para-a-seleção-de-tipo-chromium/trace.zip)

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