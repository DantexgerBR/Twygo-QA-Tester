# [inconclusivo] TC2 — Validar colunas obrigatórias da listagem

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-07-23T18:35:01.654Z · commit b735b34_

## Identificação
- **Suite**: Listagem básica de repositórios
- **TC**: TC2 — Validar colunas obrigatórias da listagem
- **Spec**: `projects/base-de-conhecimento/tests/features/listagem-basica-de-repositorios/tc2-validar-colunas-obrigatorias.spec.ts`
- **Erro em**: `D:\Estudo\Programação\cursor\twygo-work\Twygo-QA-Tester\agent-playwright\projects\base-de-conhecimento\tests\features\listagem-basica-de-repositorios\tc2-validar-colunas-obrigatorias.spec.ts:30:11`
- **Status**: failed (49635ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://twygo1772627238.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: dante.tavares@twygo.com
- **Browser**: chromium
- **Build/commit**: b735b34

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Navegar para /o/{orgId}/knowledge_repositories e verificar container — ✅
  2. 2. Verificar colunas obrigatórias: Nome, Descrição, Categoria, Classificação — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('columnheader', { name: 'Categoria' })
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-base-de-conhecime-f1abe-as-obrigatórias-da-listagem-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-base-de-conhecime-f1abe-as-obrigatórias-da-listagem-chromium/video-1.webm)
- [video](../test-artifacts/projects-base-de-conhecime-f1abe-as-obrigatórias-da-listagem-chromium/video.webm)
- [error-context](../test-artifacts/projects-base-de-conhecime-f1abe-as-obrigatórias-da-listagem-chromium/error-context.md)
- [trace](../test-artifacts/projects-base-de-conhecime-f1abe-as-obrigatórias-da-listagem-chromium/trace.zip)

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