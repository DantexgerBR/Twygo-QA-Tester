# [inconclusivo] Validar banner verde de registro Emitido

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-22T20:23:42.894Z · commit 1d6a322_

## Identificação
- **Suite**: Editar registro de aprendizagem (matriz perfil × origem × status e banners)
- **TC**: Validar banner verde de registro Emitido
- **Spec**: `projects/registros-externos/tests/features/editar-registro-matriz-perfil-origem-status-banners/tc10-banner-verde-emitido.spec.ts`
- **Erro em**: `D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\editar-registro-matriz-perfil-origem-status-banners\tc10-banner-verde-emitido.spec.ts:28:48`
- **Status**: failed (39367ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: richard.sebold@twygo.com
- **Browser**: chromium
- **Build/commit**: 1d6a322

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. Admin: abrir "Editar" de um Externo Emitido — ✅
  2. Banner verde "Certificado aprovado" + botão "Histórico" (RN46) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByText('Certificado aprovado').first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-176cf-r-verde-de-registro-Emitido-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-176cf-r-verde-de-registro-Emitido-chromium/video-1.webm)
- [video](../test-artifacts/projects-registros-externo-176cf-r-verde-de-registro-Emitido-chromium/video.webm)
- [error-context](../test-artifacts/projects-registros-externo-176cf-r-verde-de-registro-Emitido-chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-176cf-r-verde-de-registro-Emitido-chromium/trace.zip)

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