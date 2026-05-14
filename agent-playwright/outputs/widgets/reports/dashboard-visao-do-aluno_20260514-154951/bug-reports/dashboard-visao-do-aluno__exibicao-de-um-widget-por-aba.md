# [spec-fragil] Exibição de um widget por aba

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T18:49:50.620Z · commit 167fabe_

## Identificação
- **Suite**: Dashboard - Visão do aluno
- **TC**: Exibição de um widget por aba
- **Spec**: `projects/widgets/tests/features/dashboard-visao-do-aluno/exibir-widget-por-aba.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\dashboard-visao-do-aluno\exibir-widget-por-aba.spec.ts:99:67`
- **Status**: failed (37305ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 167fabe

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Switch para perfil Aluno via popover — ✅
  2. 2. Clicar no item de menu "Item Painel WPA w1-1778784497809" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByRole('link', { name: 'Item Painel WPA w1-1778784497809' })
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://widgets.stage.twygoead.com/api/v1/o/36988/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | **400** | não | — |
| GET | `https://widgets.stage.twygoead.com/api/v1/o/36988/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/test-finished-1.png)
- ![step-01-1-Switch-para-perfil-Aluno-via-popover](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/attachments/step-01-1-Switch-para-perfil-Aluno-via-popover-c29e484928b10238ea7a42c4cb7e8ed25233eb3d.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/test-failed-2.png)
- [video](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium/trace.zip)

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