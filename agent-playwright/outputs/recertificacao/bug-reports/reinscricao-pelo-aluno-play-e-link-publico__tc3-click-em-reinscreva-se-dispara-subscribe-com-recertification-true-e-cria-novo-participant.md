# [inconclusivo] TC3 — Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição pelo Aluno (Play e Link Público)
- **TC**: TC3 — Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant
- **Spec**: `projects/recertificacao/tests/features/reinscricao-pelo-aluno-play-e-link-publico/tc3-click-reinscreva-se-dispara-subscribe.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\PlayPage.ts:88:25`
- **Status**: failed (25292ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso → botão "Reinscreva-se" visível — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('button', { name: /Reinscreva-se/i }).first()
  Expected: visible
  Timeout: 15000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/play/event/1` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-7fa9d-rue-e-cria-novo-participant-chromium/trace.zip)

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