# [spec-fragil] Transição: flag desabilitada -> habilitada

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-15T15:33:33.845Z · commit f0907b3_

## Identificação
- **Suite**: Feature flag
- **TC**: Transição: flag desabilitada -> habilitada
- **Spec**: `projects/widgets/tests/features/feature-flag/transicao-flag-off-on.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\feature-flag\transicao-flag-off-on.spec.ts:62:45`
- **Status**: failed (19297ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: f0907b3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 0. Setup: contrato ON (plan), flag OFF (estado inicial do TC) — ✅
  2. 1. Estado inicial: flag off, aba Painéis oculta — ❌ **falhou aqui**
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
- ![step-01-0-Setup-contrato-ON-plan-flag-OFF-estado-inicial-do-TC](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/attachments/step-01-0-Setup-contrato-ON-plan-flag-OFF-estado-inicial-do-TC-fe4493d8e747eaae06430c5c4cd0364a1b7f2fec.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/video.webm)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-08ad4-g-desabilitada---habilitada-chromium/test-failed-3.png)
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