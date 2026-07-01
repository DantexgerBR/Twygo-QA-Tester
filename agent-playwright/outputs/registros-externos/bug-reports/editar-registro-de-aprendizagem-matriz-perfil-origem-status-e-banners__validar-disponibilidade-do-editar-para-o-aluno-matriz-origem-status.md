# [inconclusivo] Validar disponibilidade do "Editar" para o Aluno (matriz origem × status)

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-22T20:23:42.894Z · commit 1d6a322_

## Identificação
- **Suite**: Editar registro de aprendizagem (matriz perfil × origem × status e banners)
- **TC**: Validar disponibilidade do "Editar" para o Aluno (matriz origem × status)
- **Spec**: `projects/registros-externos/tests/features/editar-registro-matriz-perfil-origem-status-banners/tc1-disponibilidade-editar-aluno.spec.ts`
- **Erro em**: `D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\editar-registro-matriz-perfil-origem-status-banners\tc1-disponibilidade-editar-aluno.spec.ts:38:66`
- **Status**: failed (27024ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: richard.sebold@twygo.com
- **Browser**: chromium
- **Build/commit**: 1d6a322

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. Entrar como Colaborador e abrir "Meu histórico" — ✅
  2. Menu 3-pontos de um registro Externo Emitido — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: menu observado: [Editar, Excluir, Visualizar, Evidências, Histórico]
  
  expect(received).not.toContain(expected) // indexOf
  
  Expected value: not "Editar"
  Received array:     ["Editar", "Excluir", "Visualizar", "Evidências", "Histórico"]
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-ae6ca-uno-matriz-origem-×-status--chromium/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-ae6ca-uno-matriz-origem-×-status--chromium/video-1.webm)
- [video](../test-artifacts/projects-registros-externo-ae6ca-uno-matriz-origem-×-status--chromium/video.webm)
- [error-context](../test-artifacts/projects-registros-externo-ae6ca-uno-matriz-origem-×-status--chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-ae6ca-uno-matriz-origem-×-status--chromium/trace.zip)

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