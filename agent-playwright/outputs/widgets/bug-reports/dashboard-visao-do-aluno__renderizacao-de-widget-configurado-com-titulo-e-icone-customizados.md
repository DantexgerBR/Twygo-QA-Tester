# [bug-produto] Renderização de widget configurado com título e ícone customizados

> _Categoria override manual 2026-05-14: bug-produto. Auto-classifier marcou "spec-fragil/media" mas audit live via chrome-devtools-mcp confirma bug servidor — ver seção Root Cause abaixo._

## Root Cause (manual)

**Bug primário**: `Save Layout` (botão `[data-test-id="panel-layout-save-button"]`) NÃO dispara request ao backend. Validado live via chrome-devtools-mcp em 2026-05-14: click no botão produz zero POST/PATCH a `/api/v1/o/{org}/panels/{id}`. Apenas GETs 304 (cached) aparecem. Memória relacionada: `feedback_panel_layout_save_no_persist` (2026-05-12 + re-validação 2026-05-14).

Consequência em cadeia para este spec:
1. `beforeAll` cria painel via POST `/panels` (esse PERSISTE — único write request)
2. `beforeAll` adiciona widget no React state via Adicionar Widget (NÃO persiste)
3. `beforeAll` customiza título "Meu Resumo" + ícone "star" no React state (NÃO persiste)
4. `beforeAll` clica Salvar Layout → no-op
5. `beforeAll` associa painel ao Modo de uso Aluno (esse persiste, cria menu item OFF por default)
6. Spec switch para Aluno → menu item não aparece na sidebar (default OFF)
7. Spec falha no step 2 com `TimeoutError waiting for link 'Item Painel WC ...'`

**Bug secundário derivado**: mesmo se o menu item fosse forçado ON pelo spec, a asserção do step 3 (`'Meu Resumo' visible`) falharia, pois o widget customizado nunca persistiu.

**Destinatário do signal**: dev de produto (área painéis/widgets).

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T18:49:50.620Z · commit 167fabe_

## Identificação
- **Suite**: Dashboard - Visão do aluno
- **TC**: Renderização de widget configurado com título e ícone customizados
- **Spec**: `projects/widgets/tests/features/dashboard-visao-do-aluno/widget-customizacoes-aplicadas.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\dashboard-visao-do-aluno\widget-customizacoes-aplicadas.spec.ts:94:67`
- **Status**: failed (37326ms)

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
  2. 2. Clicar no item de menu "Item Painel WC w0-1778784508756" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByRole('link', { name: 'Item Painel WC w0-1778784508756' })
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://widgets.stage.twygoead.com/api/v1/o/36988/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | **400** | não | — |
| GET | `https://widgets.stage.twygoead.com/api/v1/o/36988/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/test-finished-1.png)
- ![step-01-1-Switch-para-perfil-Aluno-via-popover](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/attachments/step-01-1-Switch-para-perfil-Aluno-via-popover-33918a65697780b2f5c89988f0cde7db36b6e14d.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/test-failed-2.png)
- [video](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium/trace.zip)

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