# [spec-fragil] Cancelar edição com alterações não salvas

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T12:56:29.019Z · commit 3eafe19_

## Identificação
- **Suite**: Layout das abas
- **TC**: Cancelar edição com alterações não salvas
- **Spec**: `projects/widgets/tests/features/layout-das-abas/cancelar-edicao-com-alteracoes.spec.ts`
- **Erro em**: `C:\Claude\Widgets\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\layout-das-abas\cancelar-edicao-com-alteracoes.spec.ts:49:60`
- **Status**: failed (228761ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 3eafe19

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — painel com 1 widget criando alteração não salva — ✅
  2. 2. Clicar 'Cancelar' e capturar beforeunload dialog nativo (dismiss) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByTestId('panel-layout-cancel-button')
      - locator resolved to <button type="button" class="chakra-button css-7vf75e" data-test-id="panel-layout-cancel-button">Cancelar</button>
    - attempting click action
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |

### Attachments
- ![step-01-1-Setup-painel-com-1-widget-criando-altera-o-n-o-salva](../test-artifacts/projects-widgets-tests-fea-c08c6-o-com-alterações-não-salvas-chromium/attachments/step-01-1-Setup-painel-com-1-widget-criando-altera-o-n-o-salva-c37524779dd363f6f1bb2933982cb80abeabefe9.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-c08c6-o-com-alterações-não-salvas-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-c08c6-o-com-alterações-não-salvas-chromium/trace.zip)

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