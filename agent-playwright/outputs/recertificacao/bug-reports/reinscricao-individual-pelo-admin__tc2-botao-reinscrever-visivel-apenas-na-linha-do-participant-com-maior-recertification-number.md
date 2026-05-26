# [inconclusivo] TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição Individual pelo Admin
- **TC**: TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number
- **Spec**: `projects/recertificacao/tests/features/reinscricao-individual-pelo-admin/tc2-botao-reinscrever-apenas-maior-recertification-number.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\reinscricao-individual-pelo-admin\tc2-botao-reinscrever-apenas-maior-recertification-number.spec.ts:37:11`
- **Status**: failed (13391ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição (seed): aluno multi-reinscrição com participants 0 e 1 — ✅
  2. 2. Acessar a lista de aprendizagem → Listagem padrão exibe APENAS a inscrição com maior recertification_number — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('tbody tr').filter({ hasText: 'aluno.multi.reinscricao@example.com' }).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/trace.zip)

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