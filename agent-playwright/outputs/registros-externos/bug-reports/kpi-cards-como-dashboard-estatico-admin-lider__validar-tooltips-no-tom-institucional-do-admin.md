# [inconclusivo] Validar tooltips no tom institucional do Admin

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-22T20:13:22.740Z · commit 1d6a322_

## Identificação
- **Suite**: KPI cards como dashboard estático (Admin/Líder)
- **TC**: Validar tooltips no tom institucional do Admin
- **Spec**: `projects/registros-externos/tests/features/kpi-cards-dashboard-estatico-admin-lider/validar-tooltips-no-tom-institucional-do-admin.spec.ts`
- **Erro em**: `D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\kpi-cards-dashboard-estatico-admin-lider\validar-tooltips-no-tom-institucional-do-admin.spec.ts:27:54`
- **Status**: failed (12672ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: richard.sebold@twygo.com
- **Browser**: chromium
- **Build/commit**: 1d6a322

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar "Aprendizagem > Registros" como Admin — ✅
  2. 2. Tooltip do card "Emitidos" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toBe(expected) // Object.is equality
  
  Expected: "Registros aprovados e dentro do prazo de validade na organização."
  Received: "Registros com certificado emitido e válido."
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../C:/Users/richa/.claude/jobs/b80b2ee8/tmp/final-art/projects-registros-externo-b015c--tom-institucional-do-Admin-chromium/test-failed-1.png)
- [video](../C:/Users/richa/.claude/jobs/b80b2ee8/tmp/final-art/projects-registros-externo-b015c--tom-institucional-do-Admin-chromium/video-1.webm)
- [video](../C:/Users/richa/.claude/jobs/b80b2ee8/tmp/final-art/projects-registros-externo-b015c--tom-institucional-do-Admin-chromium/video.webm)
- [error-context](../C:/Users/richa/.claude/jobs/b80b2ee8/tmp/final-art/projects-registros-externo-b015c--tom-institucional-do-Admin-chromium/error-context.md)
- [trace](../C:/Users/richa/.claude/jobs/b80b2ee8/tmp/final-art/projects-registros-externo-b015c--tom-institucional-do-Admin-chromium/trace.zip)

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