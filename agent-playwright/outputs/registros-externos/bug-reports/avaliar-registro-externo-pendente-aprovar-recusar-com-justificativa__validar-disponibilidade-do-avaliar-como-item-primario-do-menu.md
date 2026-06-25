# [inconclusivo] Validar disponibilidade do "Avaliar" como item primário do menu

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-25T20:15:00.266Z · commit e6637f3_

## Identificação
- **Suite**: Avaliar registro externo pendente (Aprovar/Recusar com justificativa)
- **TC**: Validar disponibilidade do "Avaliar" como item primário do menu
- **Spec**: `projects/registros-externos/tests/features/avaliar-registro-externo-pendente/tc1-disponibilidade-avaliar-no-menu.spec.ts`
- **Erro em**: `D:\Estudo\Programação\cursor\twygo-work\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc1-disponibilidade-avaliar-no-menu.spec.ts:42:112`
- **Status**: failed (13540ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: dante.tavares@twygo.com
- **Browser**: chromium
- **Build/commit**: e6637f3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. Pré: criar registro Externo Pendente — ✅
  2. 1. Menu do Externo Pendente: "Avaliar" primário, sem Editar/Excluir (RN50) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: RN50: Externo Pendente não deve ter Editar/Excluir (achou: edit
  Editar, delete
  Excluir)
  
  expect(received).toEqual(expected) // deep equality
  
  - Expected  - 1
  + Received  + 6
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/video-1.webm)
- [video](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/video.webm)
- [error-context](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-804be--como-item-primário-do-menu-chromium/trace.zip)

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