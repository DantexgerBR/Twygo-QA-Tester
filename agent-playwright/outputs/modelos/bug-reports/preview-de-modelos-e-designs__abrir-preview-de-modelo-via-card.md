# [inconclusivo] Abrir Preview de Modelo via card

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-20T20:40:25.816Z · commit c00bf86_

## Identificação
- **Suite**: Preview de Modelos e Designs
- **TC**: Abrir Preview de Modelo via card
- **Spec**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc01-abrir-preview-modelo-via-card.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:101:71`
- **Status**: failed (13068ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: c00bf86

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar listagem de modelos em Cards — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: esperava ao menos 1 cards, encontrei 0
  
  expect(received).toBeGreaterThanOrEqual(expected)
  
  Expected: >= 1
  Received:    0
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium/trace.zip)

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