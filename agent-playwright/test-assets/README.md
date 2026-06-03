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
