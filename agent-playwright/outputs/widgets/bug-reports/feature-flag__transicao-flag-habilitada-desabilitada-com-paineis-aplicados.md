# [spec-fragil] Transição: flag habilitada -> desabilitada com painéis aplicados

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-15T15:55:04.139Z · commit f0907b3_

## Identificação
- **Suite**: Feature flag
- **TC**: Transição: flag habilitada -> desabilitada com painéis aplicados
- **Spec**: `projects/widgets/tests/features/feature-flag/transicao-flag-on-off-com-paineis.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\pages\PaineisListPage.ts:134:59`
- **Status**: failed (54966ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: f0907b3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Habilitar contrato + flag via Super Admin/Flipper — ✅
  2. 2. Descobrir useModeId Aluno + limpar items órfãos — ✅
  3. 3. Admin: criar painel + associar ao useMode Aluno — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByRole('tab', { name: 'Painéis' }) to be visible
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![step-01-1-Habilitar-contrato-flag-via-Super-Admin-Flipper](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/attachments/step-01-1-Habilitar-contrato-flag-via-Super-Admin-Flipper-9bf8d8b06bf95e4a5d250250decc249db93c1ca9.png)
- ![step-02-2-Descobrir-useModeId-Aluno-limpar-items-rf-os](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/attachments/step-02-2-Descobrir-useModeId-Aluno-limpar-items-rf-os-4dabdb10f1e58cc92e429f8bc999e7de2b59c0b9.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/video.webm)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-2.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-4.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-8.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-6.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-5.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/test-failed-7.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-47f22-itada-com-painéis-aplicados-chromium/trace.zip)

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