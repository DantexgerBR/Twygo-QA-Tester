# [spec-fragil] Importar aba (happy path)

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T02:40:16.706Z · commit 72ab290_

## Identificação
- **Suite**: Importar abas
- **TC**: Importar aba (happy path)
- **Spec**: `projects/widgets/tests/features/importar-abas/importar-aba-happy-path.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\pages\PainelFormPage.ts:203:34`
- **Status**: failed (41878ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 72ab290

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — Painel Origem + Aba X + Painel Destino + modal step 2 preenchido — ❌ **falhou aqui**
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
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-97d34-as-Importar-aba-happy-path--chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-97d34-as-Importar-aba-happy-path--chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-97d34-as-Importar-aba-happy-path--chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-97d34-as-Importar-aba-happy-path--chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-97d34-as-Importar-aba-happy-path--chromium/trace.zip)

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