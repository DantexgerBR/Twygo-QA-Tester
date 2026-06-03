# [inconclusivo] TC2 — Aluno NÃO reinscrito (recertification_number = 0) mantém progresso histórico após deploy

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Isolamento de Progresso, Score e Attendance por Inscrição
- **TC**: TC2 — Aluno NÃO reinscrito (recertification_number = 0) mantém progresso histórico após deploy
- **Spec**: `projects/recertificacao/tests/features/isolamento-de-progresso-score-e-attendance-por-inscricao/tc2-progresso-historico-mantido-recertification-zero.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\isolamento-de-progresso-score-e-attendance-por-inscricao\tc2-progresso-historico-mantido-recertification-zero.spec.ts:60:36`
- **Status**: failed (13449ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: aluno pré-deploy com `recertification_number = 0`, `progress_score = 100`, e registros em `event_content_users` com `event_participant_id IS NULL` → Estado preparado em staging — ✅
  2. 2. Login com este aluno e acessar a página do curso no Play → Banner exibe progresso `100%` (mantido do histórico) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByText(/100\s?%/).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-53d5c-resso-histórico-após-deploy-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-53d5c-resso-histórico-após-deploy-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-53d5c-resso-histórico-após-deploy-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-53d5c-resso-histórico-após-deploy-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-53d5c-resso-histórico-após-deploy-chromium/trace.zip)

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