# [spec-fragil] Cancelar edição com alterações não salvas

> _Categoria confirmada manualmente: **spec-fragil** (confiança alta) — validada ao vivo via chrome-devtools-mcp em 2026-05-14. Causa raiz: handler do `page.once('dialog')` no spec não chama `dismiss()` dentro dele, então o `click()` fica pendurado esperando o beforeunload dialog ser resolvido. UI funciona corretamente — dispara o dialog nativo._
> _Gerado em 2026-05-14T12:56:29.019Z · commit 3eafe19 · revisado e corrigido 2026-05-14_

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
- **Esperado**: Click em "Cancelar" com alterações pendentes dispara beforeunload dialog nativo do browser. Após `dialog.dismiss()`, a navegação é abortada e a URL permanece em `/panels/{id}/edit?tab=layouts`.
- **Observado (UI)**: Comportamento correto — botão `panel-layout-cancel-button` existe (Chakra button "Cancelar"), está visible/enabled/stable, e o click dispara o beforeunload dialog NATIVO. Confirmado live via chrome-devtools-mcp.
- **Observado (spec)**: `locator.click()` não retorna porque o dialog beforeunload bloqueia toda interação até ser resolvido. Handler do `page.once('dialog', () => { dialogTriggered = true })` no spec **não chama `dismiss()` dentro dele** — só marca o boolean. O `dialog.dismiss()` na linha seguinte só roda DEPOIS do `await click()`, que nunca retorna. Logo timeout 30s no click + teardown da fixture exploratória timeout em 120s total.
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for getByTestId('panel-layout-cancel-button')
      - locator resolved to <button type="button" class="chakra-button css-7vf75e" data-test-id="panel-layout-cancel-button">Cancelar</button>
    - attempting click action
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - performing click action  ← TRAVOU AQUI
  Tearing down "exploratory" exceeded the test timeout of 120000ms.
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

### Validação chrome-mcp (2026-05-14)

1. Login em `widgets.stage.twygoead.com` com `claude@teste.com`
2. Reusar painel `TC8-validacao-mcp-2026-05-14` (id=803506), aba Layouts
3. Adicionar widget "Resumo de atividades" → toast OK
4. Click no botão "Cancelar" do rodapé → chrome-mcp retornou:
   ```
   # Open dialog
   beforeunload: .
   Call handle_dialog to handle it before continuing.
   Error: Failed to interact with the element with uid X. The element did not become interactive within the configured timeout.
   ```
5. Confirmação: o dialog beforeunload nativo é disparado corretamente pela UI — chrome-mcp também precisou de `handle_dialog` pra liberar o click. Mesmo padrão que travou o Playwright.

### Fix aplicado (2026-05-14)

Trocar `page.once('dialog', () => { dialogTriggered = true })` por handler que **dismissa o dialog dentro dele mesmo**:

```ts
page.on('dialog', async (dialog) => {
  dialogTriggered = true;
  await dialog.dismiss();
});
await page.getByTestId('panel-layout-cancel-button').click();
```

Padrão canônico do Playwright: handlers de dialog precisam resolver o dialog (`accept` ou `dismiss`) dentro do callback, senão a action que disparou o dialog (click, navigation, etc) trava esperando resolução.

## Escopo
- **Reproduz em outro usuário?** Sim — reproduzido em `claude@teste.com` (chrome-mcp 2026-05-14) e no usuário do storageState do Playwright (2026-05-14 execução original)
- **Reproduz em outro env?** Não testado fora de `staging-widgets`, mas padrão é independente de env (bug de spec, não de produto)
- **Regressão?** Não — spec novo, não houve versão verde antes
- **Workaround**: fix aplicado direto no spec — handler de dialog passou a dismissar inline

## Impacto
- **Severity sugerida**: **baixa** — bug-frágil de spec, não afeta produto. Fix simples (1 bloco de código).
- **Impacto qualitativo**: spec ficava red mesmo com UI 100% correta. Sem fix, o TC9 nunca passaria mesmo em produto perfeito.

## Destinatário sugerido
**QA / autor do spec** — fix já aplicado neste mesmo commit. Vale considerar skill `testar-beforeunload-dialog-twygo` (ou similar) documentando o padrão canônico do handler de dialog inline, para evitar repetir o erro em outros specs que dependam de beforeunload.

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._