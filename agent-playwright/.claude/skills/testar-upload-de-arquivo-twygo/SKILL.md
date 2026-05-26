---
name: testar-upload-de-arquivo-twygo
description: Como testar fluxos Twygo de upload de arquivo via front (PDF, DOCX, JPG, PNG). Cobre catálogo compartilhado em `test-assets/uploads/`, helper tipado `uploadFixtures` em `src/utils/test-assets.ts`, padrão Playwright `setInputFiles()` para `<input type="file">` (funciona mesmo com input hidden/display:none — não precisa clicar no botão), await de indexação assíncrona (Base de Conhecimento e similares), cleanup obrigatório em `afterAll` (deletar arquivo subido), e anti-patterns (gerar arquivo em runtime, hardcodar path, mockar fs.writeFile). Use sempre que XML descrever upload de arquivo OU asserção sobre conteúdo indexado após upload.
version: 1.0.0
---

# testar-upload-de-arquivo-twygo

## Semântica Twygo

Twygo usa **Chakra UI** (React) para forms. Inputs de upload renderizam
como `<input type="file">` **frequentemente `display:none`** ou
`opacity:0`, escondido atrás de um botão estilizado ("Selecionar arquivo",
"Adicionar fonte", "Carregar imagem"). O click no botão dispara o file
dialog do SO.

**Implicação pra Playwright**: NÃO precisa clicar no botão. Playwright
`page.locator('input[type=file]').setInputFiles(path)` funciona mesmo com
o input invisível — bypassa o dialog do SO e injeta o arquivo direto.

## Catálogo de fixtures disponíveis

Catálogo descritivo em [`test-assets/README.md`](../../../test-assets/README.md).
Entrada tipada em [`src/utils/test-assets.ts`](../../../src/utils/test-assets.ts).

| Categoria | Chave | Uso típico |
|---|---|---|
| `images` | `jpgValidSmall` | Happy-path upload de imagem (dentro do limite, folga) |
| `images` | `jpgValidNearLimit` | Borda inferior — valida que o limite não bloqueia abaixo dele |
| `images` | `pngValid` | Cobertura de formato PNG happy-path |
| `images` | `pngOversized` | Teste negativo — exceder limite |
| `images` | `unsupportedBmp` | Teste negativo — formato fora da lista |
| `documents` | `pdfValidIndexable` | PDF com texto real — happy-path + valida indexação |
| `documents` | `docxValid` | DOCX com texto real |
| `documents` | `pdfOversized` | Teste negativo — exceder limite |
| `documents` | `unsupportedTxt` | Teste negativo — formato fora da lista |

## Padrão Page Object canônico

```ts
// projects/<slug>/pages/UploadFormPage.ts
import type { Locator, Page } from '@playwright/test';
import { uploadFixtures } from '../../../src/utils/test-assets.js';

export class UploadFormPage {
  readonly fileInput: Locator;
  readonly successToast: Locator;
  readonly indexationStatus: Locator;

  constructor(readonly page: Page) {
    // Selecionar input direto, NÃO o botão visível. setInputFiles funciona
    // mesmo com input display:none — não precisa clicar no botão antes.
    this.fileInput = page.locator('input[type="file"]');
    this.successToast = page.getByRole('status').filter({ hasText: /sucesso/i });
    this.indexationStatus = page.getByTestId('indexation-status'); // ajustar pro test-id real
  }

  async uploadPdfIndexable(): Promise<void> {
    await this.fileInput.setInputFiles(uploadFixtures.documents.pdfValidIndexable);
  }

  async uploadOversizedPdf(): Promise<void> {
    await this.fileInput.setInputFiles(uploadFixtures.documents.pdfOversized);
  }

  async waitForIndexation(timeoutMs = 30_000): Promise<void> {
    // Indexação é assíncrona — backend processa em segundo plano.
    // Asserção polling até status mudar de "Processando" → "Indexado".
    await this.indexationStatus.filter({ hasText: 'Indexado' }).waitFor({ timeout: timeoutMs });
  }
}
```

E no spec:

```ts
test('upload de PDF dentro do limite com indexação', async ({ page }) => {
  const uploadPage = new UploadFormPage(page);
  await page.goto(`/o/${getOrgId()}/knowledge_repositories/new`);

  await uploadPage.uploadPdfIndexable();
  await expect(uploadPage.successToast).toBeVisible();
  await uploadPage.waitForIndexation();
});
```

## Gotchas conhecidos

### 1. Múltiplos `<input type="file">` na mesma página

Algumas telas Twygo têm 2+ inputs (ex.: form de repositório com aba
"Fontes" e aba "Mídia", cada uma com seu próprio input). `page.locator('input[type=file]')`
ambíguo dispara erro de "strict mode violation".

**Solução**: escopar pelo container/aba ativa:
```ts
const sourcesTab = page.getByTestId('tab-sources');
const fileInput = sourcesTab.locator('input[type="file"]');
```

### 2. Toast de sucesso vs progress indicator

Twygo Chakra costuma renderizar 2 elementos durante upload:
- **Progress bar** durante o transfer
- **Toast** ao concluir

Asserção em progress bar é flaky (some rapidíssimo em arquivo pequeno).
**Asserir no toast**, não no progress.

### 3. Indexação ≠ upload (Base de Conhecimento)

Upload retorna 200 OK quando o arquivo está no S3/storage — **antes** da
indexação rodar. Asserção "indexação completou" precisa aguardar status
mudar via polling (não confiar no toast de upload).

Timeout recomendado: **30s** (default Playwright `expect.timeout` de 5s é
curto demais pra indexação real).

### 4. Backend valida tamanho ANTES de aceitar

Tentativa de upload acima do limite retorna 4xx imediato — o front
mostra mensagem de erro **sem** progress bar. Asserir na mensagem de
erro, não esperar progress.

## Cleanup obrigatório (regra dura §7.6 G)

Upload cria registro persistente na org compartilhada. Sem cleanup,
runs sucessivos acumulam orphans (e podem disparar comportamento de
"limite de armazenamento atingido" mascarando regressões).

```ts
test.afterAll(async ({ browser }) => {
  const context = await browser.newContext({ storageState: STORAGE_PATH });
  const page = await context.newPage();
  try {
    const repo = new KnowledgeRepositoryListPage(page);
    await repo.deleteRepositoryByNameSafe(testRepoName); // variant *_safe — tolera ausência
  } finally {
    await context.close();
  }
});
```

**Anti-pattern G**: `try { await page.delete... } catch {}` inline com a
`page` do test (já fechada) — sempre criar contexto fresco.

## Anti-patterns específicos de upload

### ❌ Gerar arquivo em runtime

```ts
// ❌ ANTI-PATTERN — não-determinístico, suja working dir, vaza pro git
import { writeFileSync } from 'node:fs';
const tmpPath = '/tmp/test.pdf';
writeFileSync(tmpPath, Buffer.from('fake pdf'));
await fileInput.setInputFiles(tmpPath);
```

Use o catálogo `uploadFixtures` em `src/utils/test-assets.ts`.

### ❌ Hardcodar path para `test-assets/`

```ts
// ❌ ANTI-PATTERN — typo só quebra em runtime, sem autocomplete
await fileInput.setInputFiles('./test-assets/uploads/documents/pdf-valid.pdf');
```

Use a entrada tipada:
```ts
// ✅
import { uploadFixtures } from '../../../src/utils/test-assets.js';
await fileInput.setInputFiles(uploadFixtures.documents.pdfValidIndexable);
```

### ❌ Clicar no botão visível ANTES do setInputFiles

```ts
// ❌ ANTI-PATTERN — dispara file dialog do SO, que Playwright NÃO controla por padrão
await page.getByRole('button', { name: 'Selecionar arquivo' }).click();
await fileInput.setInputFiles(uploadFixtures.images.pngValid);
```

`setInputFiles` injeta direto no input — não precisa do click. Click
adicional pode até quebrar (dialog do SO pendente, modal stuck).

### ❌ Mockar `fs.readFile` ou interceptar request de upload

Para CASOS DE TESTE DE UPLOAD, sempre usar arquivo real. Mock só faz
sentido em **testes de outras features** que dependem de "ter algo
subido" mas o upload não é o que está sendo testado — e mesmo aí,
preferir setup de seed via API/DB ao invés de mock no front.

## Quando NÃO usar essa skill

- Spec não envolve `<input type="file">` (ex.: drag-and-drop puro sem
  input nativo). Padrão é diferente — usar `page.dispatchEvent('drop', ...)`.
- Teste de **export** (download) — usar `page.waitForEvent('download')`,
  não `setInputFiles`.
- Mock de upload para focar em outra feature — preferir seed via API
  (`page.request.post(...)`).

## Checklist pré-PR

- [ ] Fixture usada vem de `uploadFixtures.<cat>.<key>`, não path literal
- [ ] Se indexação é validada, fixture tem sufixo `-indexable` (texto real)
- [ ] `afterAll` deleta o registro criado (regra dura §7.6 G)
- [ ] Cleanup usa variant `*_safe` do POM (tolera ausência se test falhou antes do upload)
- [ ] Asserções de progress evitadas — assertar em toast/status final
- [ ] Timeout de indexação aumentado para ≥30s quando aplicável
- [ ] Sem `writeFileSync` ou geração de arquivo em runtime no spec
