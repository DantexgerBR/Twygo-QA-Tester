# [inconclusivo] TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição via Importação CSV
- **TC**: TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON
- **Spec**: `projects/recertificacao/tests/features/reinscricao-via-importacao-csv/tc1-coluna-reinscrever-template-csv-flag-on.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\reinscricao-via-importacao-csv\tc1-coluna-reinscrever-template-csv-flag-on.spec.ts:27:59`
- **Status**: failed (13156ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a página de importação de participants em "/o/{orgId}/events/{eventId}/import_participants" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('link', { name: /Baixar template( CSV)?|Download template/i }).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/import_participants` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/trace.zip)

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