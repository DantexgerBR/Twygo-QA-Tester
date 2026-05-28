# [inconclusivo] TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-27T18:30:37.996Z · commit 4bdfeb1_

## Identificação
- **Suite**: Isolamento de Progresso, Score e Attendance por Inscrição
- **TC**: TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição
- **Spec**: `projects/recertificacao/tests/features/isolamento-de-progresso-score-e-attendance-por-inscricao/tc1-progresso-score-attendance-zerados.spec.ts`
- **Erro em**: `C:\TwygoQA\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\isolamento-de-progresso-score-e-attendance-por-inscricao\tc1-progresso-score-attendance-zerados.spec.ts:112:11`
- **Status**: failed (13285ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.richard@claude.com
- **Browser**: chromium
- **Build/commit**: 4bdfeb1

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Reinscrever o aluno aprovado (progress=100, cert Emitido, recertification_number=0) → novo participant com recertification_number=1 — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: BUG DE PRODUTO: POST /api/v1/o/37048/contents/806755/event_participants retornou 422 ao reinscrever aluno elegível (aprovado, 100%, cert Emitido, recertification_number=0) com a flag :recertificacao ON e o switch has_recertification ON. Body: {"data":null,"message":"Error Inesperado","status":422}. Reinscrição individual quebrada no env 37048 — corrigir o endpoint.
  
  expect(received).toBeLessThan(expected)
  
  Expected: < 400
  Received:   422
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| POST | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/contents/806755/event_participants` | **422** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

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