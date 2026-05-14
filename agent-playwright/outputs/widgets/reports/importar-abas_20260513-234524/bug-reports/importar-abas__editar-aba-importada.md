# [modal-nao-tratado] Editar aba importada

> _Categoria confiança: **alta** — Click interceptado — overlay/modal por cima do alvo_
> _Gerado em 2026-05-14T02:45:24.199Z · commit 72ab290_

## Identificação
- **Suite**: Importar abas
- **TC**: Editar aba importada
- **Spec**: `projects/widgets/tests/features/importar-abas/editar-aba-importada.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\editar-aba-importada.spec.ts:46:46`
- **Status**: failed (47243ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 72ab290

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — Painel Origem + Painel Destino + importar Aba X como "Aba Importada" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('[data-test-id="panel-layout-save-button"]')
      - locator resolved to <button type="button" class="chakra-button css-vda7qx" data-test-id="panel-layout-save-button">Salvar Layout</button>
    - attempting click action
      2 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium/trace.zip)

### IDs envolvidos
- orgId: 36988

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