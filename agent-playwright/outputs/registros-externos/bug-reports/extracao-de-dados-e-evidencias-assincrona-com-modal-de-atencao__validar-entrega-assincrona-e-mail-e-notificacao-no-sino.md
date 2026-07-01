# [inconclusivo] Validar entrega assíncrona: e-mail e notificação no sino

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-23T19:40:47.864Z · commit 9da2a1c_

## Identificação
- **Suite**: Extração de dados e evidências (assíncrona com modal de atenção)
- **TC**: Validar entrega assíncrona: e-mail e notificação no sino
- **Spec**: `projects/registros-externos/tests/features/extracao-dados-evidencias-assincrona-modal-atencao/tc7-entrega-assincrona-email-e-sino.spec.ts`
- **Erro em**: `D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\extracao-dados-evidencias-assincrona-modal-atencao\tc7-entrega-assincrona-email-e-sino.spec.ts:28:57`
- **Status**: failed (25652ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: richard.sebold@twygo.com
- **Browser**: chromium
- **Build/commit**: 9da2a1c

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Disparar uma extração de Dados CSV → toast "Extração iniciada" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()
  Expected: visible
  Timeout: 15000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-c83e5--mail-e-notificação-no-sino-chromium-retry2/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-c83e5--mail-e-notificação-no-sino-chromium-retry2/video-1.webm)
- [video](../test-artifacts/projects-registros-externo-c83e5--mail-e-notificação-no-sino-chromium-retry2/video.webm)
- [error-context](../test-artifacts/projects-registros-externo-c83e5--mail-e-notificação-no-sino-chromium-retry2/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-c83e5--mail-e-notificação-no-sino-chromium-retry2/trace.zip)

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