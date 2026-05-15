# [spec-fragil] Transição: flag desabilitada -> habilitada

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-15T12:56:12.487Z · commit 718b219_

## Identificação
- **Suite**: Feature flag
- **TC**: Transição: flag desabilitada -> habilitada
- **Spec**: `projects/widgets/tests/features/feature-flag/transicao-flag-off-on.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\feature-flag\transicao-flag-off-on.spec.ts:46:45`
- **Status**: failed (17429ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 718b219

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Estado inicial: flag off, aba Painéis oculta — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toHaveCount(expected) failed
  
  Locator:  getByRole('tab', { name: 'Painéis' })
  Expected: 0
  Received: 1
  Timeout:  10000ms
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/error-context.md)
- [error-context](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/trace.zip)

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