# [spec-fragil] Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-14T02:47:55.285Z · commit 72ab290_

## Identificação
- **Suite**: Importar abas
- **TC**: Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres
- **Spec**: `projects/widgets/tests/features/importar-abas/auto-preencher-nome-aba-importada.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts:72:42`
- **Status**: failed (33657ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 72ab290

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Painel Origem com Aba X seedada e abrir modal de importar do Painel Destino — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: locator.fill: Error: strict mode violation: getByTestId('import-tab-modal-panel-select').locator('input') resolved to 2 elements:
      1) <input value="" type="text" tabindex="0" role="combobox" autocorrect="off" autocomplete="off" spellcheck="false" aria-haspopup="true" autocapitalize="none" aria-expanded="false" aria-autocomplete="list" aria-activedescendant="" id="react-select-3-input" class="select-field__input" aria-describedby="react-select-3-placeholder"/> aka locator('#react-select-3-input')
      2) <input value="" type="hidden" name="import-tab-panel-select"/> aka locator('input[name="import-tab-panel-select"]')
  
  Call log:
    - waiting for getByTestId('import-tab-modal-panel-select').locator('input')
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/trace.zip)

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