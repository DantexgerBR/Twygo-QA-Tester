---
name: escopar-sidebar-menu-twygo
description: Sidebar do Twygo renderiza items DUPLICADOS (versão desktop + versão mobile/colapsada). Seletor não-escopado como `page.getByRole('link', { name: /Aprendizagem/ })` viola strict-mode com "resolved to 2 elements". Sempre escopar pelo container `#menu` (sidebar principal). Use ao gerar/healear spec Twygo que clica em qualquer link do sidebar lateral (Dashboard, Aprendizagem, Configurações, Usuários, etc).
version: 1.0.0
---

# escopar-sidebar-menu-twygo

## Sintoma

Spec falha com strict-mode violation ao tentar clicar item do sidebar:

```
Error: strict mode violation: getByRole('link', { name: /Modelos de conteúdo/ }) resolved to 2 elements:
    1) <a id="content_models" name="content_models-menu" href="/o/37007/content_models" class="menu-target submenu-content-models">…</a>
       aka getByRole('link', { name: 'browse Modelos de conteúdo' }).first()
    2) <a id="content_models" name="content_models-menu" href="/o/37007/content_models" class="menu-target submenu-content-models">…</a>
       aka locator('#menu').getByRole('link', { name: 'browse Modelos de conteúdo' })
```

## Causa

O Twygo renderiza o sidebar em **duas versões simultâneas no DOM**:
- Versão desktop (sidebar expandido à esquerda) — dentro de `#menu`
- Versão mobile (drawer colapsado) — fora de `#menu`, em outro container

Ambas têm o **mesmo id** (HTML inválido tecnicamente, mas o app funciona).

## Padrão canônico

Sempre escopar com `#menu`:

```ts
// ✅ Certo — sempre escopado
await page.locator('#menu a#content_models').click();
await page.locator('#menu a#learning').click();

// ❌ Errado — strict-mode violation
await page.getByRole('link', { name: /Modelos de conteúdo/ }).click();

// ❌ Errado paliativo — `.first()` esconde o problema
await page.getByRole('link', { name: /Modelos de conteúdo/ }).first().click();
```

## Por que `.first()` não é bom paliativo

`.first()` sempre pega o **primeiro no DOM**, que é tipicamente o desktop. Mas:
- Quebra silenciosamente se o app mudar a ordem (mobile primeiro em algum redesign)
- Esconde o sinal de strict-mode (que é informativo: "tem duplicidade aqui")

Preferir `#menu` ancestor — explicitamente declara qual sidebar.

## IDs canônicos do sidebar Twygo

Catálogo confirmado em recon (org admin):

| Texto/Item | id | href |
|---|---|---|
| Dashboard | `dashboard` | `/o/{orgId}/dashboard` |
| Aprendizagem (expander) | `learning` | (sem href — ver [[clicar-parent-expander-sem-href-twygo]]) |
| Conteúdos | (TBD) | `/o/{orgId}/events?tab=events` |
| Modelos de conteúdo | `content_models` | `/o/{orgId}/content_models` |
| Base de conhecimento | (TBD) | `/o/{orgId}/knowledge_repositories` |
| Usuários | (TBD) | `/o/{orgId}/users` |
| Configurações (expander) | (TBD) | (sem href) |
| Aparência | (TBD) | `/o/{orgId}/appearance` |

Expandir esse catálogo conforme outros projetos forem cobrindo o sidebar.

## Page Object pattern

```ts
// src/pages/TwygoSidebar.ts (genérico — usar como base)
async clickSidebarItem(itemId: string): Promise<void> {
  await this.page.locator(`#menu a#${itemId}`).click();
}
```

## Anti-pattern

- Selecionar por classe (`menu-target`) — múltiplos items têm essa classe, igualmente ambíguo.
- Selecionar por texto via `getByText('Modelos de conteúdo')` — também duplica entre desktop/mobile.
- Hardcode `nth(0)` ou `nth(1)` — frágil a reorders no DOM.

## Relacionado

- [[clicar-parent-expander-sem-href-twygo]] — items parent sem href exigem `dispatchEvent`
- [[navegar-admin-dashboard-twygo]] — sidebar admin só aparece em `/o/{orgId}/dashboard`, não `/play`
- [[criar-spec-resiliente-twygo]] — princípios gerais de seletores estáveis
