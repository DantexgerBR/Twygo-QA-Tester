# [spec-fragil] TC5 — Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Reinscrição via Importação CSV
- **TC**: TC5 — Linha com `Reinscrever=SIM` em conteúdo com `has_recertification=false` registra erro estruturado
- **Spec**: `projects/recertificacao/tests/features/reinscricao-via-importacao-csv/tc5-linha-sim-conteudo-sem-has-recertification-erro.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\CsvImportPage.ts:150:5`
- **Status**: failed (33854ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: curso "Curso sem Reinscrição" com `has_recertification = false` pré-existe — ✅
  2. 2. Preparar CSV com 1 linha contendo email de aluno existente + Reinscrever=SIM — ✅
  3. 3. Fazer upload na página de importação → upload aceito, worker processa — ❌ **falhou aqui**
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
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/3/import_participants` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-6cec0-e-registra-erro-estruturado-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-6cec0-e-registra-erro-estruturado-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-6cec0-e-registra-erro-estruturado-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-6cec0-e-registra-erro-estruturado-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-6cec0-e-registra-erro-estruturado-chromium/trace.zip)

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