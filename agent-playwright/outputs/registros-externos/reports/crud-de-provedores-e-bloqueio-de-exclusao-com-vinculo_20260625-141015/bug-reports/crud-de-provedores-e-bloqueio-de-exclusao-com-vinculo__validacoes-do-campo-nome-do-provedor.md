# [inconclusivo] Validações do campo "Nome" do provedor

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-25T17:10:14.365Z · commit 003cf2c_

## Identificação
- **Suite**: CRUD de Provedores e bloqueio de exclusão com vínculo
- **TC**: Validações do campo "Nome" do provedor
- **Spec**: `projects/registros-externos/tests/features/crud-de-provedores-bloqueio-exclusao-vinculo/tc3-validacoes-campo-nome.spec.ts`
- **Erro em**: `D:\Estudo\Programação\cursor\twygo-work\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\crud-de-provedores-bloqueio-exclusao-vinculo\tc3-validacoes-campo-nome.spec.ts:56:74`
- **Status**: failed (88488ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: dante.tavares@twygo.com
- **Browser**: chromium
- **Build/commit**: 003cf2c

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. Cenário "Vazio" → bloqueado — ✅
  2. Cenário "Só espaços" → bloqueado — ✅
  3. Cenário "1 caractere" → aceito — ✅
  4. Cenário "Acentos" → aceito — ✅
  5. Cenário "Emoji" → aceito — ❌ **falhou aqui**
  6. Cenário "Script tag" → aceito — ✅
  7. Cenário "SQL injection" → aceito — ✅
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: "Emoji" deveria ser aceito
  
  expect(received).toMatch(expected)
  
  Expected pattern: /tab=event-sources-tab/
  Received string:  "https://registrosf2.stage.twygoead.com/o/37079/event_sources/new"
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| POST | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/event_sources` | **500** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/video-1.webm)
- [video](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/video.webm)
- [error-context](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-16a9d-s-do-campo-Nome-do-provedor-chromium/trace.zip)

### IDs envolvidos
- orgId: 37079

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **media** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._