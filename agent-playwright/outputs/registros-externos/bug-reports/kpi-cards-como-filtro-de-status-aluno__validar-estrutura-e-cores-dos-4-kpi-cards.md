# [inconclusivo] Validar estrutura e cores dos 4 KPI cards

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-22T17:46:13.597Z · commit 1d6a322_

## Identificação
- **Suite**: KPI cards como filtro de status (Aluno)
- **TC**: Validar estrutura e cores dos 4 KPI cards
- **Spec**: `projects/registros-externos/tests/features/kpi-cards-filtro-status-aluno/validar-estrutura-e-cores-dos-4-kpi-cards.spec.ts`
- **Erro em**: `—`
- **Status**: failed (8702ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: richard.sebold@twygo.com
- **Browser**: chromium
- **Build/commit**: 1d6a322

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a tela "Meu histórico" — ✅
  2. 2. Verificar os elementos do card "Emitidos" — ✅
  3. 3. Verificar a cor do donut de cada card — ✅
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\outputs\registros-externos\test-artifacts\.playwright-artifacts-0\traces\e59bb0300de08a7662e2-39335555f837cd78d600-recording6.network'
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=treinamentos&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-90c29-ura-e-cores-dos-4-KPI-cards-chromium/test-finished-1.png)
- [error-context](../test-artifacts/projects-registros-externo-90c29-ura-e-cores-dos-4-KPI-cards-chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-90c29-ura-e-cores-dos-4-KPI-cards-chromium/trace.zip)

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