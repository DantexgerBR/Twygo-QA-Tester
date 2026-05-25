# [inconclusivo] Duplicar design individual

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-20T20:16:19.927Z · commit 03b9fa7_

## Identificação
- **Suite**: Ações Duplicar e Drag and Drop
- **TC**: Duplicar design individual
- **Spec**: `projects/modelos/tests/features/acoes-duplicar-e-drag-and-drop/tc02-duplicar-design-individual.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\acoes-duplicar-e-drag-and-drop\tc02-duplicar-design-individual.spec.ts:40:74`
- **Status**: failed (29465ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 03b9fa7

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar aba Design do modelo — ✅
  2. 2. Duplicar 1º design (icon content_copy) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: esperava ao menos 1 card extra após duplicar
  
  expect(received).toBeGreaterThanOrEqual(expected)
  
  Expected: >= 26
  Received:    25
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-58f7a--Duplicar-design-individual-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-58f7a--Duplicar-design-individual-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-58f7a--Duplicar-design-individual-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-58f7a--Duplicar-design-individual-chromium/trace.zip)

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