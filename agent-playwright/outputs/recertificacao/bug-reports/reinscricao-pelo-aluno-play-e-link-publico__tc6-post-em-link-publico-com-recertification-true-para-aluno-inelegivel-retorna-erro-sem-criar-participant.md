# [spec-fragil] TC6 — POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição pelo Aluno (Play e Link Público)
- **TC**: TC6 — POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant
- **Spec**: `projects/recertificacao/tests/features/reinscricao-pelo-aluno-play-e-link-publico/tc6-post-link-publico-aluno-inelegivel-erro.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\PublicLinkPage.ts:81:22`
- **Status**: failed (18258ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Preparar payload de aluno inelegível (em andamento, sem expiração) no POST com `?recertification=true` → payload pronto — ✅
  2. 2. Disparar `POST /play/{packageSlug}/course_registrations?recertification=true` → HTTP 422 com mensagem de erro — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  Call log:
    - waiting for getByLabel(/e-?mail/i).first() to be visible
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/play/pacote-recertificacao-staging/course_registrations?recertification=true` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/test-failed-1.png)
- [error-context](../test-artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-7b9af--erro-sem-criar-participant-chromium/trace.zip)

### IDs envolvidos
- orgId: 37007

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **baixa** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._