---
name: clicar-parent-expander-sem-href-twygo
description: Itens parent do sidebar Twygo (Aprendizagem, Configurações, Processos, Skills) são `<a id="...">` SEM href — expandem submenu via JS. `getByRole('link')` falha porque ARIA exige href pra um `<a>` ser "role=link". Click normal pode travar (overlay invisível). Padrão canônico = `dispatchEvent('click')` que contorna actionability e dispara o handler React direto. Use ao gerar/healear spec que precisa expandir submenu lateral pra acessar item filho.
version: 1.0.0
---

# clicar-parent-expander-sem-href-twygo

## Sintoma

Spec falha esperando clicar um item PARENT do sidebar (não terminal). Dois sintomas comuns:

**1) Locator não encontra**:
```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /Aprendizagem/i })
```

**2) Locator encontra mas click trava**:
```
Call log:
  - waiting for locator('#menu a#learning')
  - locator resolved to <a id="learning" name="learning" class="item-submenu-flex">…</a>
  - attempting click action
    - element is visible, enabled and stable
TimeoutError: locator.click: Timeout 30000ms exceeded.
```

## Causa

Items parent do sidebar Twygo são `<a id="learning">` (entre outros) **sem atributo `href`**. No DOM:

```html
<a id="learning" name="learning" class="item-submenu-flex">
  <span>school</span>
  Aprendizagem
</a>
```

Implicações:
1. **ARIA não considera link**: por spec ARIA, `<a>` sem href é `role="generic"`, não `role="link"`. Logo `getByRole('link')` falha.
2. **Twygo intercepta o click** via JS pra expandir o submenu (não é navegação). Pode haver overlay invisível ou state machine que bloqueia o click "real" do Playwright.

`dispatchEvent('click')` resolve ambos:
- Não exige actionability check do Playwright (bypass)
- Dispara evento React direto, que o handler de expansão consome normalmente

## Padrão canônico

```ts
// ✅ Certo
await page.locator('#menu a#learning').dispatchEvent('click');

// ✅ Aguarda submenu expandir (item filho aparecer visível)
await expect(page.locator('#menu a#content_models')).toBeVisible({ timeout: 10_000 });

// ❌ Errado — ARIA não considera link
await page.getByRole('link', { name: /Aprendizagem/ }).click();

// ❌ Errado — click padrão trava
await page.locator('#menu a#learning').click();

// ❌ Errado — force:true também trava em alguns casos
await page.locator('#menu a#learning').click({ force: true });
```

## Catálogo de parent expanders confirmados

| Item | id | Filhos do submenu |
|---|---|---|
| **Aprendizagem** | `learning` | content_models, events, knowledge_repositories, etc. |
| **Configurações** | (TBD — em outros projetos) | edit, use_modes, integrations, etc. |
| **Skills** | (TBD — BETA) | (subitens TBD) |
| **Processos** | (TBD) | organization_chart, repositories, etc. |

Sempre escopar com `#menu` ancestor (ver [[escopar-sidebar-menu-twygo]]).

## Page Object pattern

```ts
// src/pages/TwygoSidebar.ts ou Page Object específico
async expandSidebarSection(parentId: string): Promise<void> {
  await this.page.locator(`#menu a#${parentId}`).dispatchEvent('click');
}
```

## Por que `dispatchEvent` funciona quando `force: true` não funciona

- `force: true` faz o Playwright **ignorar** o actionability check, MAS ainda envia um evento de mouse real ao browser. Se o handler do app for sensível a coordenadas exatas, hit-test ou outro detalhe, pode falhar.
- `dispatchEvent('click')` despacha um **evento sintético** direto no elemento. React/JS handler escuta o evento normalmente. Não passa por hit-test do browser. Mais robusto pra expanders que não dependem de event.target/event.coords.

## Trade-offs

- `dispatchEvent` não simula interação humana completa (sem hover/mousedown/mouseup antes). Para tests de **interação real** (drag&drop, hover-then-click), preferir click normal.
- Para parent expanders do sidebar (apenas dispatch o handler de toggle), `dispatchEvent` é o padrão correto e estável.

## Relacionado

- [[escopar-sidebar-menu-twygo]] — sempre escopar com `#menu`
- [[criar-spec-resiliente-twygo]] — princípios anti-flakiness
- [[debugar-via-network-e-console]] — quando click silencia, abrir Network primeiro
