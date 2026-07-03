---
name: interagir-chakra-live-mcp-evaluate
description: Ao validar Twygo AO VIVO pelo twy_playwright MCP (não em spec .ts), o `browser_click` frequentemente NÃO togglea controles Chakra controlados por React (checkbox com span visual que intercepta, botão que abre drawer/modal) — o clique "roda" sem erro mas o estado não muda. E `browser_take_screenshot` quase nunca pega toast transitório (~4s) por causa da latência de round-trip entre chamadas MCP. Padrão canônico: dirigir via `browser_evaluate` (input.click()/btn.click() com o setter nativo do React) e capturar texto+estilo do toast DENTRO de um único evaluate. Use em validação interativa de retrabalho/PR via MCP, não na geração de specs.
version: 1.0.0
---

# interagir-chakra-live-mcp-evaluate

Complementa `interagir-switch-chakra-twygo` e `testar-toast-chakra-twygo` (que
cobrem o lado **spec .ts** — locator.click, force, POM). Esta cobre o lado
**validação ao vivo via twy_playwright MCP**, onde as ferramentas são
`browser_click`, `browser_take_screenshot`, `browser_evaluate`.

## Sintoma 1 — `browser_click` não togglea checkbox/não abre drawer Chakra

`browser_click` num checkbox Chakra "roda" (retorna o JS `page.locator(...).click()`
sem erro) mas o estado **não muda**. Ou dá timeout com:

```
<span aria-hidden="true" class="chakra-checkbox__control"> ... intercepts pointer events
```

Estrutura: `<label><input class="chakra-checkbox__input" (oculto)><span class="chakra-checkbox__control"></label>`.
Clicar a célula, o `<span>` control, ou o `<input>` via `browser_click` **não** dispara
o `onChange` do React de forma confiável neste app. O mesmo vale pro botão
"Ações em massa" (drawer) e "Confirmar" — o `browser_click` às vezes togglea
aberto→fechado ou simplesmente não aciona o handler.

### Fix: dirigir via `browser_evaluate` + `.click()` no elemento real

```js
// checkbox — dispara o onChange do React
() => {
  const input = document.querySelector('#td-select-3 input[type=checkbox]');
  if (input && !input.checked) input.click();   // input.click() aciona o React onChange
  return { checked: input.checked };
}
```

```js
// botão que abre drawer/modal
() => {
  const btn = [...document.querySelectorAll('button')]
    .find(b => /ações em massa/i.test(b.textContent) && b.offsetParent !== null);
  btn.click();
  return new Promise(r => setTimeout(() =>
    r({ open: !!document.querySelector('#action-mass-select-options') }), 700));
}
```

- **`<select>` nativo** (dropdown de ação): aí `browser_select_option` funciona
  normal — é elemento nativo, não Chakra controlado. Use-o.
- **Textarea/input controlado** (ex.: Justificativa da recusa): setar `.value`
  direto NÃO dispara o React. Use o setter nativo + eventos:

```js
() => {
  const ta = document.querySelector('.chakra-modal__content textarea');
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  setter.call(ta, 'Justificativa QA');
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  ta.dispatchEvent(new Event('change', { bubbles: true }));
  return { filled: ta.value };
}
```

- **Confirme o estado sempre** (`input.checked`, `select.value`, header
  indeterminado) antes de seguir — o `browser_click` mente "ok".

## Sintoma 2 — `browser_take_screenshot` nunca pega o toast

Toast Chakra some em ~4-5s. Entre o `browser_evaluate` que detecta o toast e o
`browser_take_screenshot` seguinte há **round-trip de vários segundos** — o toast
já sumiu quando o screenshot dispara. Screenshots consecutivos vêm sempre "limpos".

### Fix: capturar texto + estilo DENTRO de um único `browser_evaluate`

Faça clicar-confirmar + esperar o toast + ler tudo no mesmo evaluate — sem
depender de screenshot separado:

```js
() => {
  const confirm = [...document.querySelectorAll('button')]
    .find(b => /^confirmar$/i.test(b.textContent.trim()) && b.offsetParent !== null);
  confirm.click();
  return new Promise(res => {
    let t = 0;
    const iv = setInterval(() => {
      t++;
      const toast = [...document.querySelectorAll('.chakra-toast, [id^=toast-]')]
        .find(el => /em andamento/i.test(el.innerText));
      if (toast) {
        clearInterval(iv);
        const box = toast.querySelector('[data-status]') || toast.firstElementChild || toast;
        const cs = getComputedStyle(box);
        res({
          text: toast.innerText,
          linhas: toast.innerText.split('\n').filter(Boolean).length,
          dataStatus: box.getAttribute('data-status'),   // "info" = azul, "success" = verde
          bg: cs.backgroundColor, fontFamily: cs.fontFamily,
        });
      } else if (t > 60) { clearInterval(iv); res({ err: 'toast sumiu' }); }
    }, 80);
  });
}
```

Isso prova conteúdo (texto, nº de linhas) **e** estilo (cor via `data-status`,
`background`, fonte) — o que um screenshot provaria, mas de forma confiável.
Ref real: toast `info` Twygo = `data-status="info"`, `bg rgb(190,227,248)`, `Lato`.

- Screenshot de **estados persistentes** (drawer aberto, modal de confirmação,
  painel de Notificações) funciona normal — o problema é só o toast transitório.
- Precisa da evidência **visual** do toast mesmo assim? Não persiga com
  screenshot separado; o registro do texto+estilo do evaluate é a evidência.

## Por que esta skill existe

2026-07-03, validação do PR #10978 (ação em massa em Registros, org 37079). O
`browser_click` não marcava os checkboxes de seleção nem abria o drawer "Ações
em massa" (Chakra controlado); resolvido com `input.click()`/`btn.click()` via
`browser_evaluate`. E os 3 toasts "em andamento" (Aprovar/Recusar/Excluir)
sumiram antes de todo `browser_take_screenshot` (latência de round-trip);
capturados exatos lendo texto+estilo dentro do evaluate. Sem esse padrão, cada
validação ao vivo de UI Chakra via MCP re-descobre isso do zero (perdi ~10min
tentando clicar/screenshotar antes de cair no evaluate).
