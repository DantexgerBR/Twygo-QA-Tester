# [inconclusivo] Filtrar modelos por Situação via drawer

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-21T21:07:44.597Z · commit f90ba01_

## Identificação
- **Suite**: Filtros e Busca - Modelos
- **TC**: Filtrar modelos por Situação via drawer
- **Spec**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc02-filtrar-por-situacao-via-drawer.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:101:71`
- **Status**: failed (10068ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f90ba01

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar listagem e abrir drawer de filtros — ✅
  2. 2. Aplicar filtro padrão "Modelos ativos" — ✅
  3. 3. Validar drawer fechou e #clear-filter ficou visível — ❌ **falhou aqui**
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
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium/trace.zip)

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