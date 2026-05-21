# [inconclusivo] Alterar Kit de Marca exibe ícone de alerta no card

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-20T20:54:22.781Z · commit 33f373b_

## Identificação
- **Suite**: Sincronização e Regeração de Previews
- **TC**: Alterar Kit de Marca exibe ícone de alerta no card
- **Spec**: `projects/modelos/tests/features/sincronizacao-e-regeracao-de-previews/tc01-alterar-kit-exibe-alerta.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:21:23`
- **Status**: failed (44821ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 33f373b

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir aba Identificação do 1º modelo — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('[data-test-id="tab-identification"]')
  Expected: visible
  Timeout: 30000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-23d4c-ibe-ícone-de-alerta-no-card-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-23d4c-ibe-ícone-de-alerta-no-card-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-23d4c-ibe-ícone-de-alerta-no-card-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-23d4c-ibe-ícone-de-alerta-no-card-chromium/trace.zip)

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