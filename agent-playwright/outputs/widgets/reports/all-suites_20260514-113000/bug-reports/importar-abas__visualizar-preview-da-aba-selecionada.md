# [spec-fragil] Visualizar preview da aba selecionada

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-14T11:25:31.293Z · commit d6a17ed_

## Identificação
- **Suite**: Importar abas
- **TC**: Visualizar preview da aba selecionada
- **Spec**: `projects/widgets/tests/features/importar-abas/visualizar-preview-aba.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\visualizar-preview-aba.spec.ts:116:69`
- **Status**: failed (39670ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: d6a17ed

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Painel Origem com Aba X e Aba Y seedadas — ✅
  2. 2. Criar Painel Destino e selecionar Painel Origem no modal de importar aba — ✅
  3. 3. Selecionar Aba X e verificar preview da aba no modal — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true })
  Expected: visible
  Error: strict mode violation: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true }) resolved to 2 elements:
      1) <p class="chakra-text css-qqfgvy">Aba X</p> aka getByTestId('import-tab-modal-tab-select').getByText('Aba X', { exact: true })
      2) <p class="chakra-text css-qqfgvy">Aba X</p> aka getByText('Aba X').nth(2)
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |

### Attachments
- ![step-01-1-Criar-Painel-Origem-com-Aba-X-e-Aba-Y-seedadas](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/attachments/step-01-1-Criar-Painel-Origem-com-Aba-X-e-Aba-Y-seedadas-86d52b526bb5d5e84b520db10ff4cd945f17d469.png)
- ![step-02-2-Criar-Painel-Destino-e-selecionar-Painel-Origem-no-modal-d](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/attachments/step-02-2-Criar-Painel-Destino-e-selecionar-Painel-Origem-no-modal-d-d4c0391ead71bf586c82a96838bc87296b3dc912.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium/trace.zip)

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