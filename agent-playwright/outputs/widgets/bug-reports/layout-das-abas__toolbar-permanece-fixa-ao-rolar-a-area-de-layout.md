# [spec-fragil] Toolbar permanece fixa ao rolar a área de layout

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-14T12:56:29.019Z · commit 3eafe19_

## Identificação
- **Suite**: Layout das abas
- **TC**: Toolbar permanece fixa ao rolar a área de layout
- **Spec**: `projects/widgets/tests/features/layout-das-abas/toolbar-sticky-rolar.spec.ts`
- **Erro em**: `C:\Claude\Widgets\twygo-agents-qa\agent-playwright\projects\widgets\pages\PainelFormPage.ts:42:21`
- **Status**: failed (38797ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 3eafe19

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — painel com 4 widgets para gerar altura suficiente pra scroll — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: page.goto: Timeout 30000ms exceeded.
  Call log:
    - navigating to "https://widgets.stage.twygoead.com/o/36988/panels/new", waiting until "load"
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **500** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-960fe-a-ao-rolar-a-área-de-layout-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-960fe-a-ao-rolar-a-área-de-layout-chromium/video.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-960fe-a-ao-rolar-a-área-de-layout-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-960fe-a-ao-rolar-a-área-de-layout-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-960fe-a-ao-rolar-a-área-de-layout-chromium/trace.zip)

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