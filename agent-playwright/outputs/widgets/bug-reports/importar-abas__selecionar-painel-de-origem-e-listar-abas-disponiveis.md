# [spec-fragil] Selecionar painel de origem e listar abas disponíveis

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-14T02:47:55.285Z · commit 72ab290_

## Identificação
- **Suite**: Importar abas
- **TC**: Selecionar painel de origem e listar abas disponíveis
- **Spec**: `projects/widgets/tests/features/importar-abas/selecionar-painel-origem-listar-abas.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\selecionar-painel-origem-listar-abas.spec.ts:100:42`
- **Status**: failed (40225ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 72ab290

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Painel Origem com Aba X e Aba Y seedadas — ✅
  2. 2. Criar Painel Destino e abrir modal "Importar de outro painel" (step 2) — ✅
  3. 3. Selecionar painel de origem e verificar campo "Aba disponível" aparece — ❌ **falhou aqui**
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
- ![step-01-1-Criar-Painel-Origem-com-Aba-X-e-Aba-Y-seedadas](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/attachments/step-01-1-Criar-Painel-Origem-com-Aba-X-e-Aba-Y-seedadas-f8336e7d09ebe3246ccf68cc087fe03ddbfcec5e.png)
- ![step-02-2-Criar-Painel-Destino-e-abrir-modal-Importar-de-outro-paine](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/attachments/step-02-2-Criar-Painel-Destino-e-abrir-modal-Importar-de-outro-paine-a579784e1eb3059e0c139507e352b1ff765e0338.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-2e450-m-e-listar-abas-disponíveis-chromium/trace.zip)

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