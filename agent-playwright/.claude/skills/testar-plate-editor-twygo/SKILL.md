---
name: testar-plate-editor-twygo
description: Padrão canônico de teste do Plate Editor em Twygo — editor rich-text (Plate.js) com customizações (kit de marca, espaços reservados para IA, logos, color picker). Documenta interações internas (inserir bloco, upload, undo/redo, custom plugins) e anti-patterns típicos. Use ao gerar specs Playwright para TCs envolvendo Plate Editor (criação de Design de Página, edição de aula, etc.) — substitui o tratamento "caixa preta" (`Plate Editor é exibido`) por validações detalhadas. Introduzida pelo CONTRACT.md v1.1 §2.1.
version: 1.0.0
---

# Testar Plate Editor — Twygo

## Por que esta skill existe

O Plate Editor é o componente rich-text usado em criação de Design de
Página, edição de aulas, conteúdo de cursos. Tem customizações Twygo
específicas:
- Espaços reservados para IA (placeholder de texto/imagem com prompt)
- Color picker com cores do kit de marca selecionado
- Font selector com fontes do kit de marca
- Logos do kit de marca
- Plugin de imagem com upload

ATs anteriores trataram como caixa preta (`expect(editor).toBeVisible()`),
o que fez bugs de upload + plugin de IA escaparem. Esta skill documenta as
interações internas e seletores canônicos.

Detalhe em [CONTRACT.md §15](../../../../CONTRACT.md).

## Quando usar

Use ao gerar specs Playwright para suítes envolvendo:
- Criação ou edição de **Design de Página** (Modelos de conteúdo)
- Criação ou edição de **Aula** (RN 41+ do projeto Modelos)
- Conteúdo de **páginas Twygo** (PageActivityDrawer)
- Qualquer componente que instancie `<PlateEditor>` ou similar

## Seletores canônicos (Plate.js padrão)

> ⚠️ Plate.js é 3rd party. Seletores podem mudar entre versões. Validar
> via recon antes de adotar.

### Container do editor

```typescript
// Container principal
const editor = page.locator('[role="textbox"][data-slate-editor="true"]');
// OU
const editor = page.locator('.PlateEditor');  // se Twygo expõe className

// Helper canônico (a adicionar em src/pages/PlateEditorPage.ts):
async getEditor(): Promise<Locator> {
  return this.page.locator('[data-slate-editor="true"]').first();
}
```

### Toolbar

```typescript
// Toolbar principal do Plate
const toolbar = page.locator('[role="toolbar"]');

// Botões padrão (texto, formatação)
const boldButton = toolbar.getByRole('button', { name: /negrito|bold/i });
const italicButton = toolbar.getByRole('button', { name: /itálico|italic/i });
```

### Customizações Twygo no editor

```typescript
// Color picker com cores do kit de marca
const colorPickerButton = toolbar.getByRole('button', { name: /cor|color/i });

// Font selector com fontes do kit
const fontSelector = toolbar.getByRole('combobox', { name: /fonte|font/i });

// Botão logo do kit de marca
const logoButton = toolbar.getByRole('button', { name: /logo/i });

// Botão de espaço reservado para IA
const aiSpaceButton = toolbar.getByRole('button', { name: /espaço|IA|placeholder/i });
```

## Interações canônicas

### Inserir texto

```typescript
const editor = await getEditor();
await editor.click();
await editor.fill('Conteúdo do design');
// ou
await editor.type('Conteúdo do design');  // simula digitação
```

### Inserir bloco/elemento (espaço de IA, logo, imagem)

```typescript
// Espaço de IA — abre modal de prompt
await aiSpaceButton.click();
const promptModal = page.getByRole('dialog', { name: /prompt|instruções/i });
await expect(promptModal).toBeVisible();

await promptModal.getByLabel(/descrição/i).fill('Imagem que ilustre o conceito X');
await promptModal.getByRole('button', { name: /confirmar|inserir|salvar/i }).click();

// Validar inserção: bloco aparece no editor
const insertedBlock = editor.locator('[data-ai-placeholder]').last();
await expect(insertedBlock).toBeVisible();
```

### Customização de cor (kit de marca)

```typescript
await colorPickerButton.click();
const colorMenu = page.getByRole('menu');
const corPrimaria = colorMenu.getByRole('menuitem').first();
await corPrimaria.click();

// Validação: texto selecionado ganha cor — verificar via getComputedStyle
const selectedText = editor.locator('span[style*="color"]').first();
const color = await selectedText.evaluate(el => getComputedStyle(el).color);
expect(color).not.toBe('rgb(0, 0, 0)'); // diferente do default preto
```

### Upload de imagem

```typescript
// Plate plugin de imagem
await editor.getByRole('button', { name: /imagem|image/i }).click();

// Pode abrir input file ou drag-and-drop area
const fileInput = page.locator('input[type="file"]').last();
await fileInput.setInputFiles({
  name: 'teste.png',
  mimeType: 'image/png',
  buffer: Buffer.from(fixtureImagePng),
});

// Validar inserção
await expect(editor.locator('img[src*="blob:"]').first()).toBeVisible({ timeout: 10_000 });
```

### Undo / Redo

```typescript
await editor.click();
await editor.type('Texto inicial');
await page.keyboard.press('Control+Z');
await expect(editor).toHaveText(''); // ou conteúdo anterior

await page.keyboard.press('Control+Shift+Z'); // ou Control+Y
await expect(editor).toContainText('Texto inicial');
```

### Drag-and-drop de bloco

```typescript
const block1 = editor.locator('[data-slate-node="element"]').first();
const block2 = editor.locator('[data-slate-node="element"]').nth(1);

const block1Handle = block1.locator('[data-slate-drag-handle]');
await block1Handle.dragTo(block2);

// Validar nova ordem
const blockTexts = await editor.locator('[data-slate-node="element"]').allTextContents();
expect(blockTexts[0]).toContain('texto que estava no block2');
```

## Cenários obrigatórios mínimos por suíte de Plate Editor

Quando AT documenta uma suíte de criação/edição via Plate Editor, gerar
**pelo menos** estes TCs:

| # | TC | Por quê |
|---|---|---|
| 1 | Inserir texto básico + salvar | Happy path mínimo |
| 2 | Inserir bloco customizado (logo OU espaço IA) | Valida customizações Twygo |
| 3 | Upload de imagem dentro do editor | Bug 4 do exploratório de Modelos foi exatamente isso |
| 4 | Aplicar cor/fonte do kit de marca | Valida integração com kit |
| 5 | Undo de operação destrutiva | Comportamento básico de editor |
| 6 | Salvar e re-abrir — conteúdo persiste | Persistência |
| 7 | Cenário negativo: upload de tipo inválido (ex: .exe) | Inversão da expectativa do plugin |

## Anti-patterns proibidos

### A. Tratar Plate Editor como caixa preta

```typescript
// ❌ NÃO FAZER
await expect(page.locator('.PlateEditor')).toBeVisible();
// Spec passa sem validar absolutamente nada do editor.
```

```typescript
// ✅ FAZER
const editor = await getEditor();
await editor.fill('Texto de teste');
await expect(editor).toContainText('Texto de teste');
```

### B. Click direto em texto formatado (não clica o bloco interno)

```typescript
// ❌ NÃO FAZER
await editor.locator('span').click(); // pode pegar span genérico de formatação
```

```typescript
// ✅ FAZER
await editor.locator('[data-slate-node="element"]').first().click();
```

### C. Esquecer de aguardar hydration do editor

Plate é React + Slate. Hydration leva 200-500ms após o `domcontentloaded`.

```typescript
// ❌ NÃO FAZER
await page.goto('/edit');
await editor.fill('texto');  // pode falhar — editor ainda renderizando
```

```typescript
// ✅ FAZER
await page.goto('/edit');
await expect(editor).toBeVisible();
await expect(editor).toHaveAttribute('contenteditable', 'true');
await editor.fill('texto');
```

### D. Validar persistência só pelo retorno do botão Salvar

```typescript
// ❌ FRACO — passa mesmo se backend não persistiu
await saveButton.click();
await expect(toast).toBeVisible();
```

```typescript
// ✅ FORTE — re-abre e valida
await saveButton.click();
await expect(toast).toHaveText('Design salvo com sucesso');
await page.reload();
await expect(editor).toContainText('texto que salvei');
```

## Page Object proposto

Criar `agent-playwright/src/pages/PlateEditorPage.ts` com helpers
canônicos. Spec consome o POM:

```typescript
import { PlateEditorPage } from '../../../../../src/pages/PlateEditorPage.js';

test('Criação de design com texto + espaço IA + logo', async ({ page }) => {
  const editor = new PlateEditorPage(page);
  await editor.waitForReady();
  await editor.insertText('Capa do curso');
  await editor.insertAiSpace('Imagem que ilustre o tema');
  await editor.insertLogo({ kit: 'principal' });
  await editor.save();
  // Validações
});
```

## Limitações conhecidas

- **Plate.js** evolui rápido. Validar seletores via recon antes de cada
  suíte nova.
- **Custom plugins Twygo** (espaço IA, logo do kit) podem ter `data-test-id`
  específicos — preferir esses aos seletores Plate genéricos quando
  disponíveis.
- **Hydration**: sempre aguardar `contenteditable="true"` antes de
  interagir.
- **Drag-and-drop em editor** é instável em headless. Usar Playwright
  `dragTo` em vez de simular eventos manualmente.

## Política CONTRACT.md v1.1

Esta skill é **opt-in via playbook** `plate-editor` no frontmatter da
suíte:

```yaml
---
suite: Criação de Design de Página
executor: playwright
playbooks: [plate-editor, toast-chakra, cleanup-dados]
---
```

Generator deve aplicar os 7 cenários mínimos quando o playbook está
declarado.

## Referências

- [CONTRACT.md §15](../../../../CONTRACT.md) — versão 1.1
- [Plate.js docs](https://platejs.org/) — componente base 3rd party
- Bug detectado em Modelos (2026-05-22) — upload no Plate falhou e
  escapou da automação. Motivação desta skill.
