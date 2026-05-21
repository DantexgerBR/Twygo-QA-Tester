# [spec-fragil] Clicar "Regerar todos" inicia processo assíncrono

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-20T21:13:45.144Z · commit 3ae8e4e_

## Identificação
- **Suite**: Sincronização e Regeração de Previews
- **TC**: Clicar "Regerar todos" inicia processo assíncrono
- **Spec**: `projects/modelos/tests/features/sincronizacao-e-regeracao-de-previews/tc03-clicar-regerar-todos-toast.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:183:63`
- **Status**: failed (42807ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 3ae8e4e

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar aba Design do modelo (com Kit recém-alterado) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('[data-test-id="tab-structure"]')
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-afa22--inicia-processo-assíncrono-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-afa22--inicia-processo-assíncrono-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-afa22--inicia-processo-assíncrono-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-afa22--inicia-processo-assíncrono-chromium/trace.zip)

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