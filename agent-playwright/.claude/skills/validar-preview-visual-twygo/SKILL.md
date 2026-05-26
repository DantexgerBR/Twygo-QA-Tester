---
name: validar-preview-visual-twygo
description: Padrão canônico de validação visual de imagens em Twygo — broken images, naturalWidth>0, request HTTP 200. Substitui asserts genéricos `toBeVisible()` em `<img>` que passam mesmo quando a imagem está quebrada. Use ao gerar specs Playwright para TCs cujo "Resultado esperado" envolve thumb/imagem/preview/avatar/banner sendo exibido(a) corretamente. Introduzida pelo CONTRACT.md v1.1 §1.2.
version: 1.0.0
---

# Validar Preview Visual — Twygo

## Por que esta skill existe

Asserts funcionais com `expect(img).toBeVisible()` **passam mesmo quando a
imagem está quebrada** (`<img src="...">` com 404 retorna elemento visível
no DOM, só sem pixels renderizados). Esse foi um dos 5 bugs detectados no
repasse exploratório do projeto Modelos que escapou da automação: previews
de modelos/designs quebraram em produção mas Playwright não pegou.

Detalhe em [CONTRACT.md §15](../../../../CONTRACT.md).

## Quando usar

Use SEMPRE que a AT documentar resultado esperado envolvendo qualquer um:

- "Thumb do modelo é exibida"
- "Preview do design carrega"
- "Imagem do card aparece"
- "Avatar do usuário é exibido"
- "Banner é renderizado"
- "Logo do kit de marca aparece"
- "Ícone customizado é exibido"

E SEMPRE que houver elemento `<img>` cujo carregamento é parte do critério
de aceite do TC.

## Padrão canônico

### Helper proposto: `expectImageLoaded(locator, options?)`

A ser adicionado em `agent-playwright/src/utils/visualAsserts.ts`:

```typescript
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export interface ExpectImageLoadedOptions {
  timeout?: number;        // default 5000ms
  expectMinWidth?: number; // default 1 (qualquer dimensão > 0)
  expectStatus?: number;   // default 200; permite ranges via expectStatusOk: true
  expectStatusOk?: boolean; // se true, aceita 2xx (sem ser specific)
}

export async function expectImageLoaded(
  locator: Locator,
  options: ExpectImageLoadedOptions = {},
): Promise<void> {
  const { timeout = 5000, expectMinWidth = 1 } = options;

  // 1. Elemento visível
  await expect(locator).toBeVisible({ timeout });

  // 2. Atributo src definido
  const src = await locator.getAttribute('src');
  expect(src, 'img sem atributo src').toBeTruthy();

  // 3. Carregamento completo (complete + naturalWidth > 0)
  // Excluí SVG inline (naturalWidth = 0 por design)
  await expect
    .poll(
      async () =>
        locator.evaluate((img: HTMLImageElement) => ({
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          tagName: img.tagName,
        })),
      {
        message: `Imagem não carregou (broken src ou 4xx/5xx em ${src})`,
        timeout,
      },
    )
    .toMatchObject({
      complete: true,
      naturalWidth: expect.toBeGreaterThanOrEqual(expectMinWidth),
    });
}
```

### Uso típico no spec

```typescript
import { expectImageLoaded } from '../../../../../src/utils/visualAsserts.js';

test('Card do modelo exibe thumb carregada', async ({ page }) => {
  await safeGoto(page, `/o/${getOrgId()}/content_templates`);
  const card = page.getByRole('article').filter({ hasText: 'Modelo X' }).first();
  const thumb = card.getByRole('img').first();

  await expectImageLoaded(thumb, { timeout: 8000 });
});
```

### Validação adicional: request HTTP

Para projetos com alta criticidade visual, capturar resposta de rede em
paralelo:

```typescript
test('Preview do design retorna 200 e renderiza', async ({ page }) => {
  const imagePromise = page.waitForResponse(
    resp => resp.url().includes('/previews/') && resp.request().resourceType() === 'image',
    { timeout: 10_000 },
  );

  await page.getByRole('button', { name: 'Preview' }).click();
  const imageResp = await imagePromise;
  expect(imageResp.status(), `preview retornou ${imageResp.status()}`).toBe(200);

  const modal = page.getByRole('dialog');
  const previewImg = modal.getByRole('img').first();
  await expectImageLoaded(previewImg);
});
```

## Anti-pattern proibido

```typescript
// ❌ NÃO FAZER — passa com imagem quebrada
await expect(card.getByRole('img')).toBeVisible();
```

```typescript
// ✅ FAZER
await expectImageLoaded(card.getByRole('img'));
```

## Edge cases conhecidos

| Caso | Tratamento |
|---|---|
| SVG inline (`<svg>` em vez de `<img>`) | `expectImageLoaded` detecta tagName e pula naturalWidth (SVG inline = 0 por design). Validar via `toBeVisible()` apenas. |
| Lazy loading (`loading="lazy"`) | Imagem só carrega ao entrar viewport. Adicionar `await locator.scrollIntoViewIfNeeded()` antes do helper. |
| Imagem de fundo CSS (`background-image`) | Não é `<img>` — usar `getComputedStyle` ou screenshot comparison. Não coberto por esta skill. |
| Placeholder propositais (sistema usa imagem placeholder enquanto carrega) | Diferenciar via `data-test-id` (`avatar-placeholder` vs `avatar-real`). Asserir só no real. |
| CDN com cache agressivo | Cache pode dar 200 falso. Adicionar `?_cb=${Date.now()}` em ambientes de teste se necessário. |

## Integração com fixture exploratória

A fixture exploratória (`exploratory-fixture.ts`) tem probe `brokenImages: true`
que já detecta automaticamente. Esta skill **complementa** a probe:

- **Probe exploratória**: detecção PASSIVA (registra como warning no relatório)
- **Esta skill**: asserção ATIVA (faz o teste falhar quando crítico)

Use a skill para imagens **críticas ao TC**. A probe pega imagens secundárias
que aparecem na navegação mas não são alvo do TC.

## Quando NÃO usar

- TC puramente funcional (sem componente visual no critério de aceite)
- Imagem decorativa (logo do header, ícones de UI) — não é alvo do TC
- Visual regression (screenshot comparison) — fora do escopo desta skill;
  ver roadmap futuro de visual testing

## Política CONTRACT.md v1.1

Esta skill é **opt-in via playbook** `preview-visual` no frontmatter da
suíte:

```yaml
---
suite: Preview de Modelos e Designs
executor: playwright
playbooks: [preview-visual, toast-chakra]
---
```

Generator deve usar `expectImageLoaded` em TCs cujo resultado esperado
envolve carregamento de imagem **quando o playbook está declarado**.

## Referências

- [CONTRACT.md §15](../../../../CONTRACT.md) — versão 1.1
- [agent-playwright/src/fixtures/exploratory-fixture.ts](../../../src/fixtures/exploratory-fixture.ts) — fixture com probe `brokenImages`
- Bug detectado no exploratório de Modelos (2026-05-22) — motivação desta skill
