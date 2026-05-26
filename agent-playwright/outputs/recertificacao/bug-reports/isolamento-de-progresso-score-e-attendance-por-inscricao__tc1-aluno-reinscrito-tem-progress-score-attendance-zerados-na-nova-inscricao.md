# [inconclusivo] TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Isolamento de Progresso, Score e Attendance por Inscrição
- **TC**: TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição
- **Spec**: `projects/recertificacao/tests/features/isolamento-de-progresso-score-e-attendance-por-inscricao/tc1-progresso-score-attendance-zerados.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\isolamento-de-progresso-score-e-attendance-por-inscricao\tc1-progresso-score-attendance-zerados.spec.ts:64:37`
- **Status**: failed (13460ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Reinscrever o aluno aprovado pelo fluxo da suíte 2 TC3 → Novo participant criado com `recertification_number = 1` — ✅
  2. 2. Login com o aluno e acessar a página do curso no Play → Banner do curso exibe progresso `0%` (NÃO 100% do anterior). Status "Pendente" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByText(/0\s?%/).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-490eb-e-zerados-na-nova-inscrição-chromium/trace.zip)

### IDs envolvidos
- orgId: 37007

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