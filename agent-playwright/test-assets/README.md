# test-assets/

Arquivos compartilhados entre projetos para testes que precisam de inputs
binários (uploads, comparação visual, importação de arquivos, etc.).

**Audiência**: planner, generator, healer. Use o helper tipado
[`src/utils/test-assets.ts`](../src/utils/test-assets.ts) — nunca hardcode
paths para esta pasta nos specs/Page Objects.

## Estrutura

```
test-assets/
└── uploads/
    ├── images/       # JPG, PNG (+ formatos não suportados para teste negativo)
    ├── documents/    # PDF, DOCX, PPTX (+ formatos não suportados)
    └── media/        # MP3, MP4 (entram pela aba "Fontes" no Twygo)
```

Conforme novas necessidades aparecerem (ex.: seeds, payloads, baselines
visuais), adicionar subpastas-irmãs (`seeds/`, `payloads/`, etc.) e
documentar aqui — não dentro de `src/` (binários não pertencem a "source code").

## Catálogo (arquivos atualmente depositados)

> Última auditoria do FS: 2026-05-20. Tabela reflete o que está **no disco**,
> não o que o AT idealmente pede. Veja "Discrepâncias com o AT" abaixo.
>
> Helper TS: `src/utils/test-assets.ts`. Chaves descritivas, filenames "humanos".

### `uploads/documents/`

| Filename | Formato | Tamanho | Chave no helper | Propósito |
|---|---|---|---|---|
| `GRAMMAR e QUICK TIPS.pdf` | PDF | ~1.1 MB | `pdfValidIndexable` | TC1 Fontes — happy-path PDF (texto real, indexação) |
| `Músicas em Inglês.docx` | DOCX | ~41 KB | `docxValid` | TC2 Fontes — happy-path DOCX (texto real) |
| `GMUD_troca_de_ambiente_chat_notificacao.pptx` | PPTX | ~2.0 MB | `pptxValid` | Cobertura PPTX (sem TC dedicado no AT atual) |
| `Nova Pasta Compactada.zip` | ZIP | 22 bytes | `unsupportedExe` + `images.unsupportedBmp` | TC3 Fontes/Mídia — formato fora da lista aceita |
| `Teste - Aquivo para validar erros CSV.csv` | CSV | ~24 KB | `unsupportedCsv` | Alternativa ao ZIP para "formato não suportado" |

### `uploads/images/`

| Filename | Formato | Tamanho | Chave no helper | Propósito |
|---|---|---|---|---|
| `anel.jpg` | JPG | ~199 KB | `jpgValidSmall` | TC2 Mídia — happy-path JPG |
| `colibri-de-cores-vivas-na-natureza.jpg` | JPG | ~16 MB | `jpgValidNearLimit` | JPG maior (não chega aos 50MB do limite) |
| `Cursos Udemy.png` | PNG | ~1.1 MB | `pngValid` | TC1 Mídia — happy-path PNG |
| `playwritgh.png` | PNG | ~158 KB | `pngValidSmall` | PNG pequeno alternativo |

### `uploads/media/`

| Filename | Formato | Tamanho | Chave no helper | Propósito |
|---|---|---|---|---|
| `Xmind - Converter arquivo.mp4` | MP4 | ~5 MB | `mp4Valid` | Happy-path MP4 (entra por aba Fontes) |
| `GIF.mp4` | MP4 | ~2.8 MB | `mp4Small` | MP4 pequeno |
| `Comando ANALYZE.mp4` | MP4 | ~28 MB | `mp4Medium` | MP4 médio |
| `Gabriela Rocha - Teu Santo Nome (Ao Vivo).mp3` | MP3 | ~10 MB | `mp3Valid` | Happy-path MP3 |
| `Gabriela Rocha - Atos 2.mp3` | MP3 | ~17 MB | `mp3Large` | MP3 maior |

## Discrepâncias com o AT (precisam de depósito de arquivos)

O AT espera os seguintes arquivos que **ainda não foram depositados** (ou tem
substituto imperfeito). Pra cobertura ideal, depositar:

| Esperado pelo AT | Tamanho esperado | Substituto atual | Substituto OK? |
|---|---|---|---|
| `documento-teste.pdf` | 5 MB | `GRAMMAR e QUICK TIPS.pdf` 1.1 MB | ⚠️ Funciona (happy-path), mas indexação tem menos texto |
| `documento-teste.docx` | 3 MB | `Músicas em Inglês.docx` 41 KB | ⚠️ Funciona, mas pequeno |
| `executavel-teste.exe` | — | ZIP 22 bytes | ✅ Ambos fora da lista aceita |
| `documento-grande.pdf` | 60 MB | **PENDENTE** (placeholder `TODO-pdf-oversized.pdf`) | ❌ TC4 Fontes segue `fixme` até depositar PDF/MP4 entre 50–100 MB |
| `imagem-teste.png` | 2 MB | `Cursos Udemy.png` 1.1 MB | ✅ |
| `imagem-teste.jpg` | — | `anel.jpg` 199 KB | ✅ |
| (BMP unsupported pra mídia) | — | ZIP de documents/ | ⚠️ Funciona, mas semanticamente cross-categoria |
| (imagem >50 MB) | 51 MB | **PENDENTE** (placeholder `TODO-png-oversized.png`) | ❌ TC4 Mídia segue `fixme` até depositar imagem entre 50–100 MB |

### Banner de Jornada Padrão — projeto `jornadas` (auditado 2026-08-04)

O AT de `jornadas` (suíte "Banners da Jornada Padrão", 3 casos) nomeia **11 arquivos literais**.
Metade tem substituto semântico entre os assets já catalogados — mesmo critério do `unsupportedExe`:
o que o TC valida é a **categoria** do arquivo, não o nome. A outra metade precisa de depósito porque
o **nome ou os bytes SÃO o caso de teste**.

| Esperado pelo AT | Chave no helper | Substituto atual | Substituto OK? |
|---|---|---|---|
| `banner-valido.png` | `images.bannerValid` | `Cursos Udemy.png` 1.1 MB | ✅ o TC valida upload aceito |
| `banner-novo.png` | `images.bannerNew` | `playwritgh.png` 158 KB | ✅ e **tem** que diferir do anterior (caso "trocar banner") |
| `banner-invalido.txt` | `images.bannerUnsupportedTxt` | CSV ~24 KB | ✅ texto fora da lista aceita |
| `banner.exe` | `images.bannerExe` | ZIP 22 bytes | ✅ mesma substituição já usada em `unsupportedExe` |
| `banner-acima-limite.png` | `images.bannerOversized` | `colibri-de-cores-vivas-na-natureza.jpg` ~16 MB | ✅ **limite do banner é 10 MB**, medido ao vivo no modal ("Tamanho máximo: 10 MB", 04/08). O JPG de 16 MB já excede, e `.jpg` está entre os formatos aceitos (`.jpg`/`.jpeg`/`.png`, lidos na tela). **Não precisa de depósito** — e NÃO é o mesmo gap do `pngOversized`, que é >50 MB pro limite de Mídia |
| `banner.png.exe` | `images.bannerDoubleExtension` | **PENDENTE** | ❌ extensão dupla é o caso de teste |
| `banner` (sem extensão) | `images.bannerNoExtension` | **PENDENTE** | ❌ ausência de extensão é o caso |
| `banner.PNG` (MIME real de imagem) | `images.bannerUppercaseExt` | **PENDENTE** | ❌ nome em maiúscula é o caso |
| `executavel.png` (MIME executável) | `images.bannerMimeMismatch` | **PENDENTE** | ❌ divergência nome×conteúdo é o caso |
| `banner-vazio.png` | `images.bannerEmpty` | **PENDENTE** | ❌ 0 bytes |
| `banner-minimo.png` | `images.bannerMinimal` | **PENDENTE** | ❌ valor de borda (mínimo aceito) — `playwritgh.png` 158 KB não expressa |

Sobram **5** `PENDENTE`, todos **triviais de derivar** de um PNG válido (copiar/renomear/truncar), mas o
depósito é **manual**: Anti-pattern H proíbe gerar fixture em runtime.

**Do campo, medido ao vivo em 04/08/2026** (modal "Personalizar imagem" da aba Banner): aceita
`.jpg`, `.jpeg`, `.png`; **tamanho máximo 10 MB**; a tela mostra *dimensões recomendadas* mas **não
declara mínimo** — então o caso `banner-minimo.png` da AT pode não ter borda inferior real pra validar.
Confirmar com produto antes de depositar arquivo pra ele.

> ⚠️ **O passo 4 de "Como adicionar um novo arquivo" (abaixo) não funciona como está escrito.**
> `agent-playwright/.gitignore:86` tem `test-assets/uploads/**`, então **`git commit` não leva binário
> de fixture**. Só `README.md` e os 3 `.gitkeep` são versionados. Na prática o depósito é **por
> máquina**, e este catálogo é o contrato que diz o que depositar. Quem chegar num checkout novo tem
> **zero** asset (medido em 04/08/2026: `find test-assets/uploads -type f ! -name .gitkeep` = 0), e
> nesse estado **toda** suíte de upload — não só a de banner — está inexecutável. Decidir de que lado
> corrigir (remover o ignore e versionar, adotar Git LFS, ou trocar o passo 4 por instrução de
> depósito) é decisão do TL.

> **Limite GitHub**: arquivos individuais devem ser ≤100 MB (hard limit) e
> idealmente ≤50 MB (soft warning). Pra cobertura "oversized" (>50 MB) sem
> ultrapassar 100 MB, escolher arquivos entre 51–99 MB.

## Como adicionar um novo arquivo

1. Coloque o binário na subpasta correta (`uploads/images/`, `uploads/documents/` ou `uploads/media/`).
2. Atualize a tabela acima com **tamanho exato** e propósito.
3. Adicione ou ajuste a entrada em [`src/utils/test-assets.ts`](../src/utils/test-assets.ts).
4. Commit. Specs novos importam via `import { uploadFixtures } from '...'`.

## Indexação assíncrona (Base de Conhecimento e similares)

Para specs que validam **indexação** após upload (não apenas o upload em si),
o PDF/DOCX precisa ter **texto real legível** (não páginas em branco, nem só
imagem). Sem texto, a indexação não tem o que extrair.

O PDF e DOCX atualmente depositados têm texto real — assertions de
indexação devem funcionar.

## Tamanho dos arquivos e git

Total atual na pasta `uploads/`: **~63 MB**.
Implicações:
- Maior arquivo individual hoje: `Comando ANALYZE.mp4` (28 MB) — bem abaixo do
  soft warning de 50 MB do GitHub.
- Pra fixtures oversized (>50 MB), depositar entre 51–99 MB (abaixo do hard
  limit de 100 MB do GitHub). Acima disso, considerar Git LFS — mas exige
  setup do TL/DevOps + cliente LFS em cada máquina.

## Anti-patterns

Ver **Anti-pattern H** em `agent-playwright/CLAUDE.md §7.6`:
- ❌ `fs.writeFileSync()` em runtime para gerar fixture
- ❌ Hardcode de path tipo `'./test-assets/uploads/...'` no spec
- ✅ `import { uploadFixtures } from '../../../src/utils/test-assets.js'`

Ver também a skill [`testar-upload-de-arquivo-twygo`](../.claude/skills/testar-upload-de-arquivo-twygo/SKILL.md)
para o padrão completo de specs de upload.
