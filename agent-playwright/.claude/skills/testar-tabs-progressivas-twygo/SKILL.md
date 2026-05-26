---
name: testar-tabs-progressivas-twygo
description: Como interagir com tabs Chakra/role="tab" em formulários Twygo que são **progressivas** — tabs subsequentes só ficam habilitadas após o save do passo anterior (knowledge_repositories form, painel form, créditos IA). Sintoma típico: `TimeoutError: locator.click: Timeout 30000ms exceeded — waiting for getByRole('tab', { name: 'Fontes de conhecimento' })`. Causa NÃO é Web Component sem role — são `<button role="tab">` Chakra padrão, mas com `disabled=""` HTML enquanto save anterior não completa. Skill cobre helper canônico `clickTabWhenEnabled`, padrão de seed via API REST (`apiRequest`) pra evitar bulk lento via UI, e padrão `expect(modal).toBeHidden()` pra higiene de fim de fluxo. Use sempre que um spec/POM Twygo chama `.click()` em tab `role="tab"` OU quando uma suíte faz `for/loop` criando N entidades via UI.
version: 1.0.0
---

# testar-tabs-progressivas-twygo

## Sintoma canônico

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Fontes de conhecimento' })
```

Frequente em:
- `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/*.spec.ts`
- `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/*.spec.ts`
- Qualquer spec que clique em tab logo após `clickSalvar()` num form com tabs progressivas

## Causa raiz REAL (validada via chrome-devtools-mcp 2026-05-24)

As tabs são `<button role="tab">` **Chakra padrão**, com aria correto:

```html
<button role="tab" aria-selected="true"  ...>Identificação</button>
<button role="tab" aria-selected="false" disabled="">Fontes de conhecimento</button>
<button role="tab" aria-selected="false" disabled="">Recursos de mídia</button>
```

`getByRole('tab')` enxerga as 3 perfeitamente. **O problema é o `disabled=""`** HTML attribute. Playwright `.click()` faz actionability check que inclui "elemento não está disabled" — espera até 30s pra ficar enabled. Sob carga/hidratação lenta do React, o `disabled` demora a sair mesmo após `URL` ter mudado pra `/edit`.

**NÃO é Web Component**, não é `role` faltando, não é a11y tree quebrado. É race condition entre `save→redirect→re-render` e `.click()` do spec.

## Solução em 3 padrões

### Padrão 1 — `clickTabWhenEnabled` (resolve o bug imediato)

❌ **Anti-pattern** (24+ call sites antigos no monorepo):

```ts
await page.getByRole('tab', { name: 'Fontes de conhecimento' }).click();
```

✅ **Padrão canônico** (helper em `src/utils/tabs.ts`):

```ts
import { clickTabWhenEnabled } from '../../../src/utils/tabs.js';

await clickTabWhenEnabled(page, 'Fontes de conhecimento');
```

Helper internamente:
```ts
const tab = scope.getByRole('tab', { name });
await expect(tab).toBeEnabled({ timeout });  // ← espera o disabled sair
await tab.click();
```

**Quando passar `{ selected: true }`**: o passo seguinte do spec interage IMEDIATAMENTE com conteúdo da tab. O `selected: true` valida `aria-selected="true"` depois do click — garante que o tabpanel correspondente já está renderizado:

```ts
await clickTabWhenEnabled(page, 'Recursos de mídia', { selected: true });
await expect(page.getByText('PNG, JPG')).toBeVisible();
```

**Ancorar em scope quando há múltiplos tablists** (raro mas acontece em modais sobre páginas com tabs):

```ts
const dialog = page.getByRole('dialog', { name: /Importar/i });
await clickTabWhenEnabled(dialog, 'Sources');
```

### Padrão 2 — Seed via API REST (resolve bulk lento via UI)

❌ **Anti-pattern**: criar 10 entidades clicando no form 10 vezes (~3-5 min, acumula estado sujo, race conditions amplificadas):

```ts
for (let i = 0; i < 10; i++) {
  await formPage.goToCreate();
  await formPage.fillName(`Repo ${i}`);
  await formPage.clickSalvar();
  // ...
}
```

✅ **Padrão canônico** (helper em `src/utils/api.ts`):

```ts
import { apiRequest } from '../../../src/utils/api.js';

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext({ storageState: STORAGE });
  const page = await ctx.newPage();
  await page.goto('/');  // page precisa estar autenticada pra CSRF
  for (let i = 0; i < 10; i++) {
    const { ok, body } = await apiRequest(page, 'POST', `/api/v1/o/${orgId}/knowledge_repositories`, {
      knowledge_repository: { name: `Repo ${i}`, description: 'seed' },
    });
    if (!ok) throw new Error(`Seed falhou: ${body}`);
  }
  await ctx.close();
});
```

Tempo: ~3s vs ~3-5min. Sem flakiness de UI. Estado limpo entre testes (cada teste cria os próprios via API e limpa via API).

**Quando NÃO usar seed via API**: o teste valida **o fluxo da UI de criação**. Aí caminho via UI é o objeto do teste — não vale atalhar.

**Como descobrir o payload exato** quando a documentação da API Twygo está incompleta:
1. Abrir DevTools no env vivo, tab Network filtrando "Fetch/XHR".
2. Criar 1 entidade manualmente via UI.
3. Copiar o request POST que aparece (path + body).
4. Replicar no `apiRequest`.

### Padrão 3 — `expect(modal).toBeHidden()` (higiene de fim de fluxo)

Após fechar modal/drawer com click no Cancelar/X/overlay, **aguardar ele sair do DOM** antes de continuar. Modal "fantasma" no DOM atrasa interações subsequentes:

```ts
await modal.getByRole('button', { name: 'Cancelar' }).click();
await expect(modal).toBeHidden();  // ← garante que sumiu antes do próximo passo
await page.getByRole('button', { name: 'Próximo' }).click();
```

## API completa do `clickTabWhenEnabled`

```ts
export async function clickTabWhenEnabled(
  scope: Page | Locator,
  name: string | RegExp,
  opts: {
    timeout?: number;   // default 30_000 — cap pro toBeEnabled
    selected?: boolean; // default false — valida aria-selected="true" pós-click
  } = {},
): Promise<void>
```

## API completa do `apiRequest`

```ts
export async function apiRequest(
  page: Page,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,            // relativo ao baseURL — começa com `/`
  body?: unknown,          // objeto JS; stringificado + Content-Type JSON
): Promise<{ status: number; ok: boolean; body: string }>
```

Retorna body como string crua — parsear com `JSON.parse()` quando esperar JSON. Sem parse automático pra não engolir respostas non-JSON (HTML de erro 500, redirect login).

## Tabela "Sintoma → Causa → Fix"

| Sintoma | Causa | Fix |
|---|---|---|
| `locator.click: Timeout 30s` em `getByRole('tab', { name: 'X' })` | Tab `disabled=""` após save anterior — race com re-render React | `clickTabWhenEnabled(page, 'X')` (Padrão 1) |
| Suite bulk de 10 entidades roda 5min e fica flaky | Estado sujo + 10 ciclos completos de form na UI | Seed via `apiRequest` (Padrão 2) |
| Spec falha no 2º passo logo após fechar modal | Modal "fantasma" ainda no DOM, intercepta clicks | `expect(modal).toBeHidden()` (Padrão 3) |
| Tab clica mas conteúdo do tabpanel não renderiza | Tab clicou mas selected ainda não trocou | `clickTabWhenEnabled(page, 'X', { selected: true })` |
| Strict mode em `getByRole('tab')` resolved to N | Múltiplos tablists no DOM (modal + page) | Ancorar em scope: `clickTabWhenEnabled(dialog, 'X')` |

## Anti-patterns

- ❌ `await page.getByRole('tab', { name: 'X' }).click()` — sempre falha quando tab está disabled mid-fluxo
- ❌ Loop de criação via UI em `beforeAll/beforeEach` quando uma API REST está disponível
- ❌ Esperar modal fechar com `page.waitForTimeout(500)` em vez de `expect(modal).toBeHidden()`
- ❌ Duplicar `fetch + CSRF + credentials` em vários specs em vez de usar `apiRequest`
- ❌ Tentar resolver com locator alternativo (`getByText`, CSS) quando o problema é actionability — vai ter o mesmo timeout

## Catálogo de retrofit

Call sites `getByRole('tab').click()` que devem migrar pra `clickTabWhenEnabled`:

| Arquivo | Linha | Tab |
|---|---|---|
| `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/validar-exibicao-formatos-aceitos.spec.ts` | 46 | "Fontes de conhecimento" |
| `projects/base-de-conhecimento/tests/features/fontes-de-conhecimento-upload-de-documentos/tentar-upload-acima-do-limite.spec.ts` | 43 | "Fontes de conhecimento" |
| `projects/base-de-conhecimento/tests/features/recursos-de-midia-upload-de-imagens/*.spec.ts` (5 arquivos) | ~44 | "Recursos de mídia" |
| `projects/creditos-fase-02/tests/features/permitir-a-visualizacao-da-politica-de-creditos-de-ia-runner/indexacao-conteudo-runner.spec.ts` | 82 | "Política de créditos de IA" |
| `projects/creditos-fase-02/tests/features/permitir-a-visualizacao-da-politica-de-creditos-de-ia-runner/agente-atendimento-runner.spec.ts` | 25 | "Política de créditos de IA" |
| `projects/base-de-conhecimento/pages/KnowledgeRepositoryFormPage.ts:goToSources()/goToResources()` | — | (se houver método interno) |

Call sites `getByRole('tab').waitFor()` em POMs **não precisam migrar** — `waitFor` não checa actionability, só visibility. Mas se o POM tem método que clica em tab, migrar o método.

Call sites `expect(getByRole('tab')).toBeVisible()` ou `.toHaveAttribute()` **não precisam migrar** — não fazem actionability check.

Migrar gradualmente, typecheck após cada batch.

## Ação no produto (médio prazo)

Skill resolve o sintoma. Pra eliminar permanentemente:

1. **Pedir ao time de produto** pra remover `disabled=""` das tabs durante save in-flight; usar `aria-busy` ou estado de loading visual no lugar.
2. **Adicionar `data-test-id`** explícito nas tabs (`tab-identification`, `tab-sources`, `tab-resources`) — referenciados no JSDoc do POM mas **inexistentes no DOM atual** (validado 2026-05-24).
3. Skill mantém-se útil mesmo após (1) e (2) — outros formulários Twygo podem ter o mesmo padrão.

## Skills relacionadas

- [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md) — Princípio 2 (timeouts pós-hydration) e 6 (escopo pra strict-mode). Esta skill é o análogo específico pra `role="tab"` com disabled.
- [`safe-reload-twygo`](../safe-reload-twygo/SKILL.md) — quando o problema é evento `load` em vez de actionability.
- [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md) — primeira parada quando o sintoma é click sem efeito; ajuda a distinguir actionability vs backend lento.
- [`limpar-dados-de-teste-twygo`](../limpar-dados-de-teste-twygo/SKILL.md) — bulk-create via API REST funciona bem com cleanup via API REST (mesmo helper `apiRequest`).
