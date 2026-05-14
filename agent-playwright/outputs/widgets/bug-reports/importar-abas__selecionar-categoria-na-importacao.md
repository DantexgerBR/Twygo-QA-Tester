# [spec-fragil] Selecionar Categoria na importação

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-14T11:25:31.293Z · commit d6a17ed_

## Identificação
- **Suite**: Importar abas
- **TC**: Selecionar Categoria na importação
- **Spec**: `projects/widgets/tests/features/importar-abas/selecionar-categoria-importacao.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\selecionar-categoria-importacao.spec.ts:81:37`
- **Status**: failed (33219ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: d6a17ed

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — Painel Origem + Painel Destino + Aba X selecionada no modal — ✅
  2. 2. Verificar dropdown 'Categoria' visível com 'Aprendizagem' selecionado por padrão — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByRole('combobox')
  Expected: visible
  Error: strict mode violation: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByRole('combobox') resolved to 3 elements:
      1) <input value="" type="text" tabindex="0" role="combobox" autocorrect="off" autocomplete="off" spellcheck="false" aria-haspopup="true" autocapitalize="none" aria-expanded="false" aria-autocomplete="list" aria-activedescendant="" id="react-select-3-input" class="select-field__input"/> aka locator('#react-select-3-input')
      2) <input class="" value="" type="text" tabindex="0" role="combobox" autocorrect="off" autocomplete="off" spellcheck="false" aria-haspopup="true" autocapitalize="none" aria-e …[+370 chars]
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |

### Attachments
- ![step-01-1-Setup-Painel-Origem-Painel-Destino-Aba-X-selecionada-no-mo](../test-artifacts/projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium/attachments/step-01-1-Setup-Painel-Origem-Painel-Destino-Aba-X-selecionada-no-mo-765f072bf8ffb730b8dea1002f1d39b1997886f2.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium/trace.zip)

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