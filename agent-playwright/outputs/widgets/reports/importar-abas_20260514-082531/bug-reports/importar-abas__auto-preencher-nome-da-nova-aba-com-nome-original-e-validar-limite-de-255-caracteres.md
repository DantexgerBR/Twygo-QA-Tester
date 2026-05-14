# [inconclusivo] Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-14T11:25:31.293Z · commit d6a17ed_

## Identificação
- **Suite**: Importar abas
- **TC**: Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres
- **Spec**: `projects/widgets/tests/features/importar-abas/auto-preencher-nome-aba-importada.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts:98:31`
- **Status**: failed (45477ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: d6a17ed

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Painel Origem com Aba X seedada e abrir modal de importar do Painel Destino — ✅
  2. 2. Verificar preview exibido e botão "Importar aba" habilitado — ✅
  3. 3. Verificar auto-preenchimento de "Nome da nova aba" com nome original (Aba X) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |

### Attachments
- ![step-01-1-Criar-Painel-Origem-com-Aba-X-seedada-e-abrir-modal-de-imp](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/attachments/step-01-1-Criar-Painel-Origem-com-Aba-X-seedada-e-abrir-modal-de-imp-712f6f7df7e1110fa34e77f72e432b16bc184816.png)
- ![step-02-2-Verificar-preview-exibido-e-bot-o-Importar-aba-habilitado](../test-artifacts/projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium/attachments/step-02-2-Verificar-preview-exibido-e-bot-o-Importar-aba-habilitado-d9988d8cda6c7af845cded86b287c0a00a0873bc.png)
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
- **Severity sugerida**: **media** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._