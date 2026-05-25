# [inconclusivo] Coluna Descrição truncada com tooltip completo (visão Lista)

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-22T12:13:23.587Z · commit 8d4e765_

## Identificação
- **Suite**: Listagem e Menu de Modelos
- **TC**: Coluna Descrição truncada com tooltip completo (visão Lista)
- **Spec**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc04-descricao-truncada-tooltip.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\listagem-e-menu-de-modelos\tc04-descricao-truncada-tooltip.spec.ts:34:54`
- **Status**: failed (22949ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 8d4e765

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar listagem em formato Lista e filtrar por modelo com descrição longa — ✅
  2. 2. Localizar célula de Descrição truncada (texto com "...") — ✅
  3. 3. Hover na célula e validar tooltip com texto completo — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('[role="tooltip"]')
  Expected: visible
  Timeout: 5000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium/trace.zip)

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