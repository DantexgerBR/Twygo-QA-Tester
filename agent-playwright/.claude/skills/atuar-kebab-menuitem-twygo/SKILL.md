---
name: atuar-kebab-menuitem-twygo
description: Itens do menu kebab (3 pontos / Chakra menu) das listagens Twygo, quando renderizados perto da borda direita da viewport, fazem o `.click()` do Playwright FALHAR silenciosamente — o menu fica aberto, só aparece o tooltip, e nenhuma ação dispara. Isso gera FALSO-NEGATIVO ("o item não faz nada") em revalidação de bug. Padrão canônico = `dispatchEvent('click')` no menuitem (contorna actionability/hit-test) OU confirmar que o menu FECHOU antes de cravar veredito. Use ao testar/healear ações de kebab (Visualizar, Avaliar, Histórico, Excluir...) e ao revalidar qualquer bug do tipo "clicar no item não faz nada".
version: 1.0.0
---

# Atuar item de menu kebab (3 pontos) Twygo

## Sintoma

`page.getByRole('menuitem', { name: 'X' }).click()` (ou `.click()` em qualquer
locator do item) **retorna sem erro**, mas:

- o menu **continua aberto**;
- aparece só o **tooltip** do item (hover);
- **nenhuma ação** dispara (URL não muda, sem nova aba, sem form).

É fácil concluir "o item não tem handler / está quebrado". **Quase sempre é
falso** — é o Playwright que não conseguiu **atuar** o item.

## Causa

O menu kebab das listagens Twygo abre ancorado ao botão de 3 pontos, que fica
na **última coluna, à direita**. Itens do menu (especialmente os de baixo, como
"Visualizar"/"Evidências") caem **perto da borda direita da viewport**. O
hit-test de actionability do Playwright não consegue completar o clique ali — o
evento vira hover (tooltip) e não ativa o `onClick` do React. O item do **topo**
do menu (ex. "Editar") costuma passar, o que mascara o problema e leva a um
diagnóstico errado ("só o Visualizar está quebrado").

## Caso real (2026-06-30)

Revalidação do P1 do card 19895 (1.8 — "Visualizar"). Checagem automatizada
reportou **"ainda presente"** (Visualizar sem ação) por 2 execuções. O
screenshot pós-clique mostrava o **menu aberto + tooltip "Visualizar"** — ou
seja, o clique nunca atuou. O "Editar" (topo do menu) passava e servia de
"controle", reforçando o falso diagnóstico. O QA testou **manualmente** e o
Visualizar **abriu** a tela (`/records/{id}/edit?mode=view`, form em modo
leitura). Atuando via `dispatchEvent('click')`, a ação disparou normalmente —
confirmando que era **artefato de automação**, não bug de produto.

## Padrão canônico — atuar via dispatchEvent

Mesma família da skill [[clicar-parent-expander-sem-href-twygo]]: dispara o
handler React direto, ignorando actionability/hit-test.

```ts
// Em vez de menuitem.click() (que pode não atuar perto da borda):
await page.evaluate(() => {
  const item = [...document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] button')]
    .find((el) => /Visualizar/i.test(el.textContent || '') && el.getBoundingClientRect().width > 0);
  item?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
});
```

- Escope ao **menu aberto** (`[role="menu"]` visível) para não pegar itens de
  outras linhas (o DOM Twygo monta o menu de TODAS as linhas — ver
  [[seletores-visiveis-twygo]]).
- Para POMs, encapsule num método (ex. `clickRowMenuItemByDispatch`) — não
  espalhe `evaluate` pelos specs (Anti-pattern C do §7.6).

### Alternativa: confirmar atuação após o `.click()`

Se preferir manter `.click()`, **prove que atuou** antes de seguir/cravar:

```ts
await menuitem.click();
// o menu DEVE fechar quando o item é atuado:
await expect(page.locator('[role="menu"]:visible')).toHaveCount(0, { timeout: 3_000 });
```

Se o menu não fechou, o clique não atuou → caia para `dispatchEvent`.

## Regra de revalidação (anti-falso-negativo)

Ao revalidar um bug do tipo **"clicar no item não faz nada"** (kebab, dropdown,
menu Chakra), **NUNCA** conclua "sem ação" só porque URL/estado não mudou.
Primeiro **confirme a atuação**:

1. O menu **fechou** após o clique? Se não, o clique não atuou.
2. Não confiar em "item de controle do topo passou" como prova de que o
   componente funciona — a posição na viewport muda o resultado.
3. Atuar via `dispatchEvent('click')` e só então comparar o resultado.
4. Se possível, **cruzar com clique humano real** (o QA) — clique humano atua
   onde o `.click()` do Playwright falha.

Cruza com [[debugar-bug-produto-stale]]: antes de cobrar dev por "handler não
conectado", garanta que o seu clique realmente disparou o handler.

## Anti-patterns

- ❌ Cravar "item X do kebab não tem ação" a partir de `.click()` que não fechou o menu.
- ❌ Usar o item do topo ("Editar") como "controle" e assumir que o componente todo funciona.
- ❌ `waitForTimeout` esperando a ação "aparecer" — a ação nunca dispara se o clique não atuou; o problema é a atuação, não o tempo.

## Relacionadas

- [[clicar-parent-expander-sem-href-twygo]] — mesma técnica (`dispatchEvent`) para `<a>` de expander de sidebar sem href.
- [[seletores-visiveis-twygo]] — escopar ao menu/linha visível (o DOM duplica menus de todas as linhas).
- [[debugar-bug-produto-stale]] — revalidar bug stale sem cravar por artefato de automação.
