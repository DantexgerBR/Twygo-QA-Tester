# [spec-fragil] Salvar layout pela barra de rodapé

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-14T12:56:29.019Z · commit 3eafe19_

## Identificação
- **Suite**: Layout das abas
- **TC**: Salvar layout pela barra de rodapé
- **Spec**: `projects/widgets/tests/features/layout-das-abas/salvar-layout-rodape.spec.ts`
- **Erro em**: `C:\Claude\Widgets\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\layout-das-abas\salvar-layout-rodape.spec.ts:63:47`
- **Status**: failed (81083ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 3eafe19

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — painel com 1 widget adicionado, toast limpo — ✅
  2. 2. Clicar 'Salvar Layout' (force:true por causa do iframe HubSpot) — ✅
  3. 3. Recarregar página e validar persistência do layout — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toHaveCount(expected) failed
  
  Locator:  locator('[data-test-id^="widgets-grid-item-"]')
  Expected: 1
  Received: 0
  Timeout:  10000ms
  
  Call log:
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
- ![step-01-1-Setup-painel-com-1-widget-adicionado-toast-limpo](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/attachments/step-01-1-Setup-painel-com-1-widget-adicionado-toast-limpo-68c2e37049641ec93f05f7e3d15be82af529d0e6.png)
- ![step-02-2-Clicar-Salvar-Layout-force-true-por-causa-do-iframe-HubSpo](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/attachments/step-02-2-Clicar-Salvar-Layout-force-true-por-causa-do-iframe-HubSpo-d9416e17614abec6b27fbc41bc26a3c649220219.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-7f9ad-layout-pela-barra-de-rodapé-chromium/trace.zip)

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