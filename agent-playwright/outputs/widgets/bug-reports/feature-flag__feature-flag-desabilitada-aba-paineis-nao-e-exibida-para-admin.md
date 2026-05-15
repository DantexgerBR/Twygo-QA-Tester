# [spec-fragil] Feature flag desabilitada - aba 'Painéis' não é exibida para Admin

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-15T16:02:22.762Z · commit f0907b3_

## Identificação
- **Suite**: Feature flag
- **TC**: Feature flag desabilitada - aba 'Painéis' não é exibida para Admin
- **Spec**: `projects/widgets/tests/features/feature-flag/flag-desabilitada-aba-paineis-nao-exibida.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\feature-flag\flag-desabilitada-aba-paineis-nao-exibida.spec.ts:46:45`
- **Status**: failed (16160ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: f0907b3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar /use_modes no env com flag desabilitada — ✅
  2. 2. Verificar que a aba 'Painéis' NÃO aparece (R1 — ocultação total) — ❌ **falhou aqui**
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
- ![step-01-1-Acessar-use_modes-no-env-com-flag-desabilitada](../test-artifacts/projects-widgets-tests-fea-8f70e-is-não-é-exibida-para-Admin-chromium/attachments/step-01-1-Acessar-use-modes-no-env-com-flag-desabilitada-f807c2c3b0b26e88c74cffea4e82b0b46f931d9c.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-8f70e-is-não-é-exibida-para-Admin-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-8f70e-is-não-é-exibida-para-Admin-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-8f70e-is-não-é-exibida-para-Admin-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-8f70e-is-não-é-exibida-para-Admin-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-8f70e-is-não-é-exibida-para-Admin-chromium/trace.zip)

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