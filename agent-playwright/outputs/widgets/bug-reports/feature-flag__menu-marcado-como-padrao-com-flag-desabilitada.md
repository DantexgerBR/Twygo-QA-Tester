# [spec-fragil] Menu marcado como 'Padrão' com flag desabilitada

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-15T15:33:33.845Z · commit f0907b3_

## Identificação
- **Suite**: Feature flag
- **TC**: Menu marcado como 'Padrão' com flag desabilitada
- **Spec**: `projects/widgets/tests/features/feature-flag/menu-padrao-com-flag-desabilitada.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\feature-flag\menu-padrao-com-flag-desabilitada.spec.ts:116:10`
- **Status**: failed (67717ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: f0907b3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Habilitar contrato + flag — ✅
  2. 2. Descobrir useModeId Aluno + limpar órfãos — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: locator.waitFor: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByRole('tab', { name: 'Painéis' }) to be visible
  
  
  Call Log:
  - Timeout 60000ms exceeded while waiting on the predicate
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![step-01-1-Habilitar-contrato-flag](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/attachments/step-01-1-Habilitar-contrato-flag-5ea293beab5af2d20cd89e5fbe90a9a8a5670bf4.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/video.webm)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-2.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-4.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-8.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-6.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-5.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/test-failed-7.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-2653f-adrão-com-flag-desabilitada-chromium/trace.zip)

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