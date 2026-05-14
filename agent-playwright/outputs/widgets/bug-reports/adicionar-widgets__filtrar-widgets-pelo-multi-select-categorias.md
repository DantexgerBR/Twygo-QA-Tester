# [spec-fragil] Filtrar widgets pelo multi select 'Categorias'

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T01:49:33.463Z · commit 9f15489_

## Identificação
- **Suite**: Adicionar widgets
- **TC**: Filtrar widgets pelo multi select 'Categorias'
- **Spec**: `projects/widgets/tests/features/adicionar-widgets/filtrar-widgets-categorias.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\pages\PainelFormPage.ts:98:21`
- **Status**: failed (37044ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 9f15489

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. Pré-condição: criar painel e abrir drawer — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
  =========================== logs ===========================
  waiting for navigation until "load"
  ============================================================
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/trace.zip)

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