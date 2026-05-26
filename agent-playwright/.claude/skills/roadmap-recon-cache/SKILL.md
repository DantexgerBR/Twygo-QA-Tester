---
name: roadmap-recon-cache
description: Design doc — propõe migrar `inputs/recon-<slug>.md` (artefato git) pra `outputs/<slug>/recon-cache/<slug>.md` (cache regenerável com TTL). Não é skill executável — é especificação pra o time pegar e implementar quando alinhar. Use quando alguém perguntar "por que recon vive em git?" ou "como evitamos recon stale?".
version: 0.1.0-design
---

# roadmap-recon-cache (DESIGN, não-implementado)

Especificação pra reformar como o `twygo-recon` persiste e consome dados.
Não é código — é o contrato pra quando alguém pegar a tarefa.

## Status

🟡 **Design aprovado, implementação pendente**. Conversado em 2026-05-08
com o user. Item #2 do roadmap "reformas de agente" da branch
`chore/agentes-qa-overhaul`.

## Problema (estado atual)

Hoje `npm run agent:recon -- --suite "<X>"` escreve em
`projects/<slug>/inputs/recon-<slug-suite>.md`. Esse caminho está sob
`inputs/`, que é **rastreado pelo git** (junto com `Analise_Teste_*.xml`,
fonte de verdade do AT).

Consequências:

1. **Recon vira artefato versionado** — PR de geração de specs traz junto
   um markdown longo (300-800 linhas com test-ids/labels) que ninguém
   revisa, mas infla diff.
2. **Stale silencioso** — UI Twygo muda → recon ficou velho → planner
   consome dado errado → spec gerado vira lixo. Sem TTL, sem detecção.
3. **Conflito com fonte de verdade** — `inputs/` deveria conter só o que
   vem do AT. Recon é autogerado, mistura de naturezas no mesmo diretório
   confunde leitor.

## Proposta

Mover recon pra **cache regenerável com TTL** em `outputs/`, paralelo ao
storageState (`outputs/.auth/`).

### Estrutura nova

```
outputs/
├── .auth/
│   └── storage.json
├── <slug-projeto>/
│   ├── recon-cache/                       # ← novo
│   │   ├── _meta.json                      # índice + TTLs
│   │   └── <slug-suite>.md                 # 1 arquivo por testsuite
│   ├── reports/
│   ├── allure-report/
│   └── ...
└── ...
```

`projects/<slug>/inputs/` volta a conter **só** XML(s) do AT + opcionalmente
o `.xlsx` de Quebra (já é o caso na prática — recon foi a exceção).

### Formato `_meta.json`

```jsonc
{
  "generatedAt": "2026-05-08T14:30:00Z",
  "ttlHours": 168,                          // 7 dias default
  "suites": {
    "listagem-de-paineis": {
      "generatedAt": "2026-05-08T14:30:00Z",
      "twygoCommitSha": null,                // futuro: rastrear versão da UI
      "filename": "listagem-de-paineis.md",
      "stale": false                         // calculado em runtime, não persistido
    }
  }
}
```

### Formato do `<slug-suite>.md`

Adicionar header de metadados (parsed pelo orchestrator):

```markdown
<!--
recon-cache
generatedAt: 2026-05-08T14:30:00Z
suite: Listagem de painéis
slug: listagem-de-paineis
ttlHours: 168
twygoBaseUrl: <baseUrl do env, vem de .env>
-->

# Recon — Listagem de painéis

## Test-IDs encontrados

...
```

### Fluxo de uso

1. **Geração**: `npm run agent:recon -- --project <X> --suite "<Y>"` escreve
   em `outputs/<X>/recon-cache/<slug-Y>.md` e atualiza `_meta.json`.
2. **Consumo (orchestrator Etapa 2.5)**:
   - Procura cache: `outputs/<X>/recon-cache/<slug-Y>.md`
   - Se não existe: pula recon (planner explora live como antes do recon
     existir).
   - Se existe mas stale (`generatedAt + ttlHours < now`): avisa QA, pergunta
     se regenera ou usa stale (default: regenera).
   - Se existe e fresco: carrega no contexto do planner.
3. **Invalidação manual**: `npm run agent:recon:clear -- --project <X>`
   apaga todo o cache do projeto (rare, ex: redesign de UI Twygo).

### TTL

Default: **7 dias (168h)**. Configurável em `project.config.json`:

```jsonc
{
  "recon": {
    "ttlHours": 168,
    "autoRegenerate": false                  // se true, regenera sem perguntar
  }
}
```

## Migração (single PR)

1. Criar `outputs/<slug>/recon-cache/` se não existir (gitignored —
   `outputs/` já está).
2. Atualizar `recon.ts`:
   - Mudar `outputPath = resolveProjectPath('inputs/recon-${slug}.md')`
     pra `getOutputPath('<slug-projeto>/recon-cache/${slug}.md')`.
   - Escrever/atualizar `_meta.json` no mesmo diretório.
   - Adicionar header de metadados ao `.md`.
3. Atualizar `twygo-test-orchestrator/orchestrator.ts`:
   - Etapa 2.5 lê de `outputs/<slug>/recon-cache/` em vez de `projects/<slug>/inputs/`.
   - Verifica TTL.
4. Atualizar `twygo-recon/SKILL.md` com novo path.
5. Atualizar `twygo-test-orchestrator/SKILL.md` Etapa 2.5 com nova lógica
   (cache + TTL).
6. Migrar recons existentes (one-shot): mover
   `projects/*/inputs/recon-*.md` pra `outputs/*/recon-cache/*.md` no
   mesmo PR. **Apagar** os antigos do git no commit (se já estiverem
   commitados).
7. README seção 7.1 atualizada com explicação do cache.

## Trade-offs

| Pro | Contra |
|---|---|
| PR sem inflar de markdown autogerado | Perde "snapshot histórico de UI no commit X" |
| Detecção de stale via TTL | Uma camada nova de config (ttlHours em project.config.json) |
| Limpeza separada (`recon:clear`) | Mais 1 npm script |
| Alinha com `outputs/` como local "tudo gerado" | One-shot migration custosa (~10 arquivos hoje) |

Sobre o "histórico de UI": dá pra resolver com snapshot mensal arquivado
em `docs/recon-snapshots/<YYYY-MM>/` (não-versão-corrente, manualmente
copiado quando o time achar que vale).

## Não-objetivos

- **Não** remover o recon entirely — ele é valor real.
- **Não** mudar formato `.md` (planner já consome esse formato).
- **Não** automaticamente invalidar quando o XML do AT muda — recon é da
  UI, não do XML; relacionados mas independentes.
- **Não** versionar `_meta.json` no git — vive em `outputs/`, gitignored.

## Quando implementar

Sugestão: depois que o validador de heal-diff estiver rodando estável
(item #1 desta branch). Recon-cache é otimização; #1 é proteção.

## Quem implementa

Próximo voluntário do time de QA. Tempo estimado: ~3-4h (recon.ts +
orchestrator + migração + docs).

## Referências

- `.claude/skills/twygo-recon/SKILL.md` — skill atual
- `.claude/skills/twygo-recon/recon.ts` — implementação atual
- `agent-playwright/.claude/skills/twygo-test-orchestrator/SKILL.md` Etapa 2.5
- `src/utils/environment.ts` — `getOutputPath()`, `resolveProjectPath()`
