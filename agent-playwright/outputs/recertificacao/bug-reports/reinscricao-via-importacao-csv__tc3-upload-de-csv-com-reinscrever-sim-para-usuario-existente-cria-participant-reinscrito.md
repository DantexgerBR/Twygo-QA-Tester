# [spec-fragil] TC3 — Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição via Importação CSV
- **TC**: TC3 — Upload de CSV com `Reinscrever=SIM` para usuário existente cria participant reinscrito
- **Spec**: `projects/recertificacao/tests/features/reinscricao-via-importacao-csv/tc3-upload-csv-reinscrever-sim-cria-participant-reinscrito.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\CsvImportPage.ts:150:5`
- **Status**: failed (33908ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Preparar arquivo "participants-reenroll.csv" com 1 linha contendo o email do "Aluno Elegível" e Reinscrever=SIM — ✅
  2. 2. Acessar a página de importação de participants — ✅
  3. 3. Fazer upload do arquivo "participants-reenroll.csv" → upload aceito + toast "Importação iniciada" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.setInputFiles: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('input[type="file"]').first()
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/2/import_participants` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-feb0b-cria-participant-reinscrito-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-feb0b-cria-participant-reinscrito-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-feb0b-cria-participant-reinscrito-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-feb0b-cria-participant-reinscrito-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-feb0b-cria-participant-reinscrito-chromium/trace.zip)

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