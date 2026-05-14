# [bug-produto] Salvar layout pela barra de rodapé

> _Categoria recategorizada manualmente: **bug-produto** (confiança alta) — validada ao vivo via chrome-devtools-mcp em 2026-05-14 (ver bloco "Validação chrome-mcp" abaixo). Categoria automática original do gerador foi "spec-fragil" por erro mecânico ao classificar `toHaveCount(expected) failed` — não captura o sintoma de "ausência de request" no Network._
> _Gerado em 2026-05-14T12:56:29.019Z · commit 3eafe19 · recategorizado 2026-05-14_

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
- **Esperado**: Ao clicar **Salvar Layout** na barra de rodapé com widget adicionado, o backend deve persistir o layout (POST/PATCH em `/api/v1/o/{orgId}/panels/{panelId}` ou endpoint equivalente de layout). Após `page.reload()`, o widget previamente adicionado deve continuar visível no grid (1 item).
- **Observado**: Click em "Salvar Layout" **não dispara nenhum POST/PATCH/PUT pro backend Twygo** — só requests de analytics (Google, HubSpot, LinkedIn, NewRelic, Clarity, Stape) + 1 GET de re-leitura do painel (`GET /api/v1/o/36988/panels/803506`). Após reload, grid retorna vazio ("Nenhum widget adicionado"). Erro do Playwright:
  ```
  Error: expect(locator).toHaveCount(expected) failed
  
  Locator:  locator('[data-test-id^="widgets-grid-item-"]')
  Expected: 1
  Received: 0
  Timeout:  10000ms
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
- panelId da reprodução chrome-mcp: 803506 (`TC8-validacao-mcp-2026-05-14`)

### Validação chrome-mcp (2026-05-14)

Reproduzido ao vivo via `chrome-devtools-mcp` (clique físico via CDP, sem state compartilhado com Playwright):

1. Login em `widgets.stage.twygoead.com` com `claude@teste.com`
2. Criar painel `TC8-validacao-mcp-2026-05-14` → backend retornou `panelId=803506`
3. Abrir aba **Layouts** → grid vazio
4. Clicar **Adicionar Widget** → drawer abre → clicar card "Resumo de atividades" → widget adicionado ao grid, toast "Widget adicionado com sucesso" exibido
5. Clicar **Salvar Layout** no rodapé
6. **Network filtrado por XHR/Fetch (58 requests capturadas)**:
   - Twygo domain: só GET (`/notificate_socket_token`, `/api/v1/o/36988/show_nps_modal`, `/api/v1/o/36988/widgets/catalog`, `/api/v1/o/36988/panels/803506` × 3-4)
   - **Zero POST/PATCH/PUT pra qualquer endpoint Twygo** — somente analytics (Google CCM, GA collect, HubSpot, LinkedIn Insight Tag, NewRelic browser agent, MS Clarity, Stape) e logs de erro/sessão
7. Reload da página → aba Layouts mostra `Nenhum widget adicionado`. Widget previamente clicado **não persistiu**

Conclusão: bug-servidor declarado no comentário do spec (`projects/widgets/tests/features/layout-das-abas/salvar-layout-rodape.spec.ts:4-10`) ainda existe em 2026-05-14. Handler do click "Salvar Layout" no rodapé não dispara a chamada de API que persiste o layout — esse é o sintoma observável no produto.

## Escopo
- **Reproduz em outro usuário?** Sim — reproduzido em `claude@teste.com` (chrome-mcp 2026-05-14) e no usuário do storageState do Playwright (2026-05-13)
- **Reproduz em outro env?** Não testado fora de `staging-widgets` — `[REVISAR isolamento]`
- **Regressão?** Bug introduzido antes de 2026-05-13 (data do comentário no spec) — `[REVISAR — buscar PR/commit que introduziu o handler do botão "Salvar Layout"]`
- **Workaround conhecido**: nenhum — alterações de layout NÃO podem ser persistidas pelo botão do rodapé. Em UIs que oferecem outro caminho de save, o usuário precisa usá-lo (ex: "Sair e salvar" no modal de saída).

## Impacto
- **Severity sugerida**: **alta** (alinhada com `allure.severity('critical')` declarada no spec) — bloqueia totalmente a configuração de Painéis via Layouts pelo fluxo principal do rodapé
- **Impacto qualitativo**: usuário cria painel + monta layout + clica Salvar → vê toast de sucesso → mas todo o trabalho é perdido após qualquer navegação. Sem mensagem de erro visível.

## Destinatário sugerido
**Dev de produto** — área Painéis/Widgets. Causa raiz provável: handler do click no botão `panel-layout-save-button` (rodapé) não está conectado à action de save do redux store / mutation. Procurar componente que renderiza o botão e o handler `onSave` / `onClick` correspondente.

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._