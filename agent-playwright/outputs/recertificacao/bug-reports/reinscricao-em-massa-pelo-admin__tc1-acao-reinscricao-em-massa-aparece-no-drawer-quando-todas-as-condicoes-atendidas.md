# [inconclusivo] TC1 — Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição em Massa pelo Admin
- **TC**: TC1 — Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas
- **Spec**: `projects/recertificacao/tests/features/reinscricao-em-massa-pelo-admin/tc1-acao-aparece-drawer-condicoes-atendidas.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\LearningStudentsPage.ts:320:13`
- **Status**: failed (3339ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}" — ✅
  2. 2. Selecionar 3 alunos clicando nos checkboxes correspondentes → Drawer exibe "3 selecionados" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: selectFirstNStudents: pediu 3 mas só há 0 linhas visíveis. Verifique seed do env / filtros aplicados.
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/3/learning_students` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-62cb6-odas-as-condições-atendidas-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-62cb6-odas-as-condições-atendidas-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-62cb6-odas-as-condições-atendidas-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-62cb6-odas-as-condições-atendidas-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-62cb6-odas-as-condições-atendidas-chromium/trace.zip)

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