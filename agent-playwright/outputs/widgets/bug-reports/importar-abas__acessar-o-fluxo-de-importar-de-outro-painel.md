# [inconclusivo] Acessar o fluxo de Importar de outro painel

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-14T02:40:16.706Z · commit 72ab290_

## Identificação
- **Suite**: Importar abas
- **TC**: Acessar o fluxo de Importar de outro painel
- **Spec**: `projects/widgets/tests/features/importar-abas/acessar-fluxo-importar-painel.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\acessar-fluxo-importar-painel.spec.ts:30:50`
- **Status**: failed (23837ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 72ab290

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Painel Destino e abrir tab Layouts — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByTestId('tabs-navigation-add-button')
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-cfe25-de-Importar-de-outro-painel-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-cfe25-de-Importar-de-outro-painel-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-cfe25-de-Importar-de-outro-painel-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-cfe25-de-Importar-de-outro-painel-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-cfe25-de-Importar-de-outro-painel-chromium/trace.zip)

### IDs envolvidos
- orgId: 36988

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