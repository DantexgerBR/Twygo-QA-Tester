# [inconclusivo] Validar extração de dados CSV com toast de variação

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-23T19:40:47.864Z · commit 9da2a1c_

## Identificação
- **Suite**: Extração de dados e evidências (assíncrona com modal de atenção)
- **TC**: Validar extração de dados CSV com toast de variação
- **Spec**: `projects/registros-externos/tests/features/extracao-dados-evidencias-assincrona-modal-atencao/tc4-extracao-dados-csv-toast.spec.ts`
- **Erro em**: `D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\extracao-dados-evidencias-assincrona-modal-atencao\tc4-extracao-dados-csv-toast.spec.ts:32:39`
- **Status**: failed (21287ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: richard.sebold@twygo.com
- **Browser**: chromium
- **Build/commit**: 9da2a1c

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1-2. Abrir o drawer na tela Admin Registros — ✅
  2. 3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeHidden() failed
  
  Locator:  locator('.chakra-modal__content.chakra-slide')
  Expected: hidden
  Received: visible
  Timeout:  10000ms
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-a294b-s-CSV-com-toast-de-variação-chromium-retry2/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-a294b-s-CSV-com-toast-de-variação-chromium-retry2/video-1.webm)
- [video](../test-artifacts/projects-registros-externo-a294b-s-CSV-com-toast-de-variação-chromium-retry2/video.webm)
- [error-context](../test-artifacts/projects-registros-externo-a294b-s-CSV-com-toast-de-variação-chromium-retry2/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-a294b-s-CSV-com-toast-de-variação-chromium-retry2/trace.zip)

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