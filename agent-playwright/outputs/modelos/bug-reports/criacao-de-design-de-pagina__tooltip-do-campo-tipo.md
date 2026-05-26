# [spec-fragil] Tooltip do campo Tipo

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-22T21:32:27.610Z · commit 83d0916_

## Identificação
- **Suite**: Criação de Design de Página
- **TC**: Tooltip do campo Tipo
- **Spec**: `projects/modelos/tests/features/criacao-de-design-de-pagina/tc04-tooltip-campo-tipo.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\DesignPageEditPage.ts:30:60`
- **Status**: failed (44719ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 83d0916

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir tela de criação Página — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('[data-test-id="tab-design"]')
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-8d1bd-ágina-Tooltip-do-campo-Tipo-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-8d1bd-ágina-Tooltip-do-campo-Tipo-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-8d1bd-ágina-Tooltip-do-campo-Tipo-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-8d1bd-ágina-Tooltip-do-campo-Tipo-chromium/trace.zip)

### IDs envolvidos
- orgId: 37007

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