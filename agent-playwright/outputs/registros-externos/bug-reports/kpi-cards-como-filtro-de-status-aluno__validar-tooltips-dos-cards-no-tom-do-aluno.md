# [inconclusivo] Validar tooltips dos cards no tom do Aluno

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-22T17:35:53.022Z · commit 1d6a322_

## Identificação
- **Suite**: KPI cards como filtro de status (Aluno)
- **TC**: Validar tooltips dos cards no tom do Aluno
- **Spec**: `projects/registros-externos/tests/features/kpi-cards-filtro-status-aluno/validar-tooltips-dos-cards-no-tom-do-aluno.spec.ts`
- **Erro em**: `D:\novo-estudio-twygo\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\kpi-cards-filtro-status-aluno\validar-tooltips-dos-cards-no-tom-do-aluno.spec.ts:31:57`
- **Status**: failed (8596ms)

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
  2. 2. Tooltip do card "Emitidos" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toBe(expected) // Object.is equality
  
  Expected: "Certificados emitidos e dentro do prazo de validade."
  Received: "Registros com certificado emitido e válido."
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=treinamentos&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-b1a1d-s-dos-cards-no-tom-do-Aluno-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-b1a1d-s-dos-cards-no-tom-do-Aluno-chromium/video.webm)
- [video](../test-artifacts/projects-registros-externo-b1a1d-s-dos-cards-no-tom-do-Aluno-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-registros-externo-b1a1d-s-dos-cards-no-tom-do-Aluno-chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-b1a1d-s-dos-cards-no-tom-do-Aluno-chromium/trace.zip)

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