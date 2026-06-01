---
name: testar-beforeunload-dialog-twygo
description: Specs Twygo que clicam "Cancelar" / "Sair" / botão de saída em forms com alterações pendentes disparam o **beforeunload dialog NATIVO do browser** — não modal Chakra. O `click()` Playwright FICA PENDURADO até o dialog ser resolvido. Handler precisa chamar `dialog.dismiss()` (ou `dialog.accept()`) DENTRO do callback, antes do `click()` retornar. Documenta o padrão canônico, anti-pattern típico (handler que só marca boolean), e validação via chrome-devtools-mcp. Use ao gerar/corrigir specs Twygo que testam "cancelar edição com alterações", "navegação com form dirty", "fechar wizard a meio caminho".
when_to_use: |
  - Spec timeouta em `locator.click()` no botão "Cancelar"/"Sair" de form dirty
  - TC valida "cancelar edição com alterações" / "navegação com form dirty"
  - Wizard/form com alteração pendente que o usuário tenta abandonar
triggers:
  - "beforeunload"
  - "dialog.dismiss"
  - "dialog.accept"
  - "form dirty"
  - "cancelar com alterações"
  - "performing click action"
  - "browser-handle-dialog"
  - "native dialog"
version: 1.0.0
---

# testar-beforeunload-dialog-twygo

## Sintoma canônico

Spec timeouta 30s em um `locator.click()` apesar do botão estar
**visible, enabled e stable**. O Playwright relata que conseguiu fazer
tudo até "performing click action" — e trava ali. Eventualmente toda a
fixture exploratória estoura o timeout total de 120s.

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByTestId('panel-layout-cancel-button')
    - locator resolved to <button … data-test-id="panel-layout-cancel-button">Cancelar</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action  ← TRAVA AQUI
Tearing down "exploratory" exceeded the test timeout of 120000ms.
```

**O elemento está perfeito** — a falha está no que acontece DEPOIS do
click: dispara o beforeunload dialog NATIVO do browser e o `click()`
nunca retorna porque o dialog bloqueia toda interação até ser resolvido.

## Por que acontece

Quando o usuário tenta sair de uma página com `window.onbeforeunload`
configurado (form dirty, layout não salvo, etc), o Chrome/Chromium
emite um dialog **nativo** (não DOM, não Chakra). Em Playwright:

- O dialog dispara o evento `'dialog'` no `page`.
- Toda action subsequente — incluindo o retorno do `click()` que
  disparou o dialog — **fica suspensa** até alguém chamar
  `dialog.accept()` ou `dialog.dismiss()`.
- Se o handler de `'dialog'` só observa (ex: marca uma flag) sem
  resolver o dialog, o click fica eternamente pendurado.
- Esse comportamento é **diferente** do que acontece com modal Chakra
  (modal DOM normal). Lá, o click retorna imediatamente e o modal
  aparece no DOM — você só precisa `expect(modal).toBeVisible()` e
  clicar nos botões dele. **NÃO confundir os dois.**

## Padrão canônico

Handler de dialog precisa **resolver o dialog dentro dele mesmo**, antes
de qualquer `await click()` que o dispare:

```ts
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';

test('Cancelar edição com alterações não salvas', async ({ page, step }) => {
  // ... setup que deixa o form dirty (adicionar widget, etc) ...

  let dialogTriggered = false;

  await step("Clicar 'Cancelar' e capturar beforeunload dialog (dismiss)", async () => {
    // Handler RESOLVE o dialog inline. Sem isso, click() fica pendurado.
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await page.getByTestId('panel-layout-cancel-button').click();

    // Verifica que NÃO navegou (dismiss aborta navegação)
    await expect(page).toHaveURL(/\/panels\/\d+\/edit\?tab=layouts/);
  });

  await step('Validar que dialog beforeunload foi disparado', async () => {
    expect(dialogTriggered).toBe(true);
  });
});
```

### Por que `page.on` e não `page.once`

- `page.on('dialog', ...)` — handler permanece ativo até o fim do teste,
  pega múltiplos beforeunloads se acontecerem (ex.: navegação acidental
  do framework após o click).
- `page.once('dialog', ...)` — só pega o primeiro. Útil quando você quer
  garantir que SÓ esse dialog é tratado e qualquer outro deve falhar o
  teste. Use com cuidado.

Para a maioria dos casos Twygo, `page.on` é mais resiliente.

### Alternativa "accept" (confirmar saída)

Quando o cenário é "confirmar que aceita perder alterações" (em vez de
dismissar e permanecer), trocar o `dismiss` por `accept`:

```ts
page.on('dialog', async (dialog) => {
  await dialog.accept();
});
await page.getByTestId('panel-layout-cancel-button').click();
await expect(page).toHaveURL(/\/panels$/); // navegou pra listagem
```

## Anti-pattern (proibido)

Não fazer isso — handler só marca flag, dismissa DEPOIS:

```ts
// ❌ ERRADO — click() fica 30s pendurado
const dialogPromise = page.waitForEvent('dialog');
page.once('dialog', () => {
  dialogTriggered = true;  // ← só marca, não resolve
});

await page.getByTestId('panel-layout-cancel-button').click();  // ← TRAVA

const dialog = await dialogPromise;
await dialog.dismiss();  // ← nunca chega aqui
```

Esse foi exatamente o bug do TC9 `cancelar-edicao-com-alteracoes.spec.ts`
investigado em 2026-05-14 via chrome-devtools-mcp.

Da mesma forma, **NÃO assumir que o dialog é Chakra/DOM** — buscar por
`page.getByRole('dialog')` ou `page.locator('.chakra-modal')` vai vir
vazio porque o beforeunload nativo NÃO existe no DOM, só no nível do
browser.

## Como diferenciar beforeunload nativo de modal Chakra

| Sinal | beforeunload nativo | Modal Chakra DOM |
|---|---|---|
| `page.on('dialog', ...)` dispara? | ✅ Sim | ❌ Não |
| `page.getByRole('dialog')` encontra? | ❌ Não (sem DOM) | ✅ Sim |
| `click()` retorna logo? | ❌ Trava até resolver | ✅ Sim |
| Pode ler/clicar botões internos? | ❌ Não — accept/dismiss only | ✅ Sim |
| Exemplo Twygo | "Cancelar" no layout sujo (Painéis) | "Tem certeza que deseja sair?" ao trocar tab |

**Caso curioso Twygo**: o app tem AMBOS — quando você troca de aba
(Identificação ↔ Layouts) com alterações pendentes, aparece **modal
Chakra** ("Tem certeza que deseja sair?"). Mas quando clica em
"Cancelar" do rodapé, aparece o **beforeunload nativo**. Não generalizar
o padrão de um pro outro.

## Validação via chrome-devtools-mcp (diagnóstico)

Quando suspeitar que a falha é desse tipo, reproduzir o cenário no
chrome-mcp confirma rápido:

1. Navegar pro form e deixar dirty (adicionar widget, etc).
2. `mcp__chrome-devtools__click` no botão "Cancelar"/"Sair".
3. Se a tool retornar:
   ```
   # Open dialog
   beforeunload: .
   Call handle_dialog to handle it before continuing.
   Error: Failed to interact with the element ... timeout.
   ```
   **É beforeunload nativo confirmado**. O chrome-mcp também precisa de
   `handle_dialog` pra liberar — mesmo padrão que trava o Playwright.

4. Chamar `mcp__chrome-devtools__handle_dialog` com `action: 'dismiss'`
   pra liberar.

## Exemplo já validado no codebase

`projects/widgets/tests/features/layout-das-abas/cancelar-edicao-com-alteracoes.spec.ts`
(linhas 42-55) — versão corrigida em commit `b78c35e`. Re-run pós-fix:
1 passed em ~1min. Validação independente em chrome-mcp confirmou que a
UI funciona corretamente — fix foi 100% no spec.

## Anti-patterns relacionados

- ❌ **Tentar capturar o beforeunload via DOM** — `getByRole('dialog')`,
  `locator('.chakra-modal')`, etc. Não existe no DOM.
- ❌ **Usar `page.waitForEvent('dialog')` SEM handler ativo** — funciona
  mas é mais frágil. O timeout do `waitForEvent` é independente do
  `click()`, dá margem pra ordering bugs. Prefira `page.on`.
- ❌ **Esperar que o spec passe sem registrar handler** — se NENHUM
  handler estiver registrado, Playwright **dismissa automaticamente** o
  dialog. Mas você perde a capacidade de afirmar que ele apareceu, e
  o teste vira "click + assert URL" sem cobertura do `beforeunload` em si.

## Notas

- **Specs hand-written em `tests/auth/`** que navegam após login não
  costumam disparar beforeunload (login não deixa form dirty).
- **Specs em `projects/widgets/tests/features/layout-das-abas/`** são os
  candidatos mais frequentes — Layouts dirty + botões "Cancelar"/"Sair".
- **`fixtures/exploratory-fixture.ts`** intercepta `page.on` próprio pra
  rastrear console errors etc. — não conflita com `page.on('dialog')`
  porque o evento é diferente.
- Quando o `gerar-bug-report-de-tc-red` classificar como "spec-fragil"
  com sintoma "timeout no click do botão Cancelar/Sair", esta skill é
  o primeiro lugar pra checar antes de chutar fix em locator/timing.

## Referências

- [Playwright Dialog API](https://playwright.dev/docs/api/class-dialog)
- [Playwright Page.on('dialog')](https://playwright.dev/docs/api/class-page#page-event-dialog)
- CLAUDE.md raiz §"Regra: page.goto + dismissCommonModals ⇒ obrigatório
  pareados" — padrão análogo pra modais oportunistas (NPS Sofia)
- Skill `fechar-modais-twygo` — para modais Chakra (não beforeunload)
- Skill `comparar-chrome-mcp-vs-playwright` — fluxo de validação live
