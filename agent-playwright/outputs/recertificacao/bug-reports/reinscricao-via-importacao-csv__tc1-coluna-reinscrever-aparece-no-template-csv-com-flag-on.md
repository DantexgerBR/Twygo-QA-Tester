# [spec-fragil] TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-06-01T17:07:58.465Z · commit 88f26da_

## Identificação
- **Suite**: Reinscrição via Importação CSV
- **TC**: TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON
- **Spec**: `projects/recertificacao/tests/features/reinscricao-via-importacao-csv/tc1-coluna-reinscrever-template-csv-flag-on.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:70:21`
- **Status**: failed (96588ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 88f26da

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
  Call log:
    - waiting for getByRole('tab', { name: /^Acesso$/i }).or(locator('[data-test-id="tab-access"]')).first() to be visible
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/video-1.webm)
- ![screenshot](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/test-failed-2.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/test-failed-3.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/test-failed-4.png)
- [error-context](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-34730-no-template-CSV-com-flag-ON-chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

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