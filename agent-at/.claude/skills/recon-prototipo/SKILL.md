---
name: recon-prototipo
description: Reconhecimento visual de protótipos navegáveis (Figma Make, Figma público, Vercel, qualquer URL renderizável) via playwright-mcp em headless. Substitui a antiga `recon-visual`. Em CONTRACT.md v1.1+, é invocada AUTOMATICAMENTE pela Etapa 2.5 do /analyze-test quando `prototypeUrl` está preenchido em project.config.json — com fallback gracioso (timeout/login/MCP indisponível → skip + warning, AT prossegue). NÃO acessa Stage real (responsabilidade do agent-playwright).
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep
---

# Recon de Protótipo — Twygo (v1.1)

## Por que esta skill existe

Histórico mostrou que recon **opt-in** não funcionou: nos projetos Base
de Conhecimento e Modelos, o recon foi pulado em ambos. O Bug 2 do
exploratório de Modelos (filtros divergentes do spec) teria sido pego
se recon tivesse rodado e comparado protótipo com a Especificação.

Em CONTRACT.md v1.1 (2026-05-22), a skill passa a ser **default
automática com fallback gracioso** (Opção C aprovada). Renomeada de
`recon-visual` para `recon-prototipo` (escopo mais claro).

Detalhe em [CONTRACT.md §15](../../../../CONTRACT.md).

## Escopo

**Apenas protótipos navegáveis públicos**:
- Figma Make (`figma.com/make/...`)
- Figma File público (`figma.com/file/...` sem auth)
- Vercel (`*.vercel.app/...`)
- POCs hospedadas (GitHub Pages, Netlify, etc.)
- Qualquer URL HTML/JS renderizável no Chrome **sem login**

**NÃO acessa Stage real**. Recon de Stage durante execução é
responsabilidade do `agent-playwright/.claude/skills/twygo-recon`.

## Pré-requisitos

- `agent-at/.mcp.json` com `playwright` MCP em modo `--headless` (já configurado em 2026-05-19)
- Chrome instalado na máquina
- Node 20+
- `prototypeUrl` preenchido em `agent-at/projects/<slug>/project.config.json`
- Sessão Claude Code iniciada **dentro de `agent-at/`** (para MCP local
  carregar)

## Modo de operação (v1.1)

| Modo | Quando | Comportamento |
|---|---|---|
| **Auto** | Invocada pela Etapa 2.5 do `/analyze-test` quando `prototypeUrl` está preenchido | Executa com fallback gracioso. Falha → skip + warning, AT prossegue |
| **Manual** | `/recon-prototipo --project <slug>` direto | Igual ao Auto, mas usuário escolhe rodar |
| **Skip** | Flag `--no-recon` no `/analyze-test` OU `prototypeUrl` ausente | Pula. AT terá `// REVISAR-FIGMA` em catálogos |

## Fluxo da skill (com gates de proteção)

```
┌─ Início ─────────────────────────────────────────────┐
│ 1. Ler project.config.json                            │
│    - prototypeUrl ausente? → SKIP + log               │
│                                                         │
│ 2. Pre-flight: handshake MCP playwright                │
│    - mcp__playwright__* não disponível? → SKIP        │
│      + warning "MCP não carregado; iniciar Claude     │
│      Code dentro de agent-at/"                        │
│                                                         │
│ 3. Detectar handler por host                           │
│    - figma.com/make/* → handler Figma Make            │
│    - *.vercel.app/* → handler Vercel                  │
│    - figma.com/file/* → tenta acesso público          │
│    - default → handler genérico                       │
│                                                         │
│ 4. Navegar (browser_navigate)                          │
│    - HTTP 401/403/login redirect? → SKIP + warning    │
│    - Timeout > 30s? → SKIP + warning                  │
│                                                         │
│ 5. Aguardar carregamento (browser_wait_for)            │
│    - Figma Make: time=15s                              │
│    - Vercel/genérico: time=5-8s                        │
│    - Snapshot vazio após wait? → tenta wait extra      │
│                                                         │
│ 6. Capturar snapshot + screenshot por tela mínima      │
│    - Lista de telas configurada em project.config OU  │
│      heurística "listagem, criação, edição, modais"   │
│    - Erro em tela X? → continua com as outras         │
│                                                         │
│ 7. Salvar output/recon-prototipo.md                    │
│    - Header com status (complete/partial/skipped)     │
│    - skip_reason se aplicável                          │
│                                                         │
│ 8. Encerrar browser (browser_close)                    │
└──────────────────────────────────────────────────────┘
```

## Configuração de telas mínimas (project.config.json)

Em v1.1, projetos podem listar telas relevantes:

```json
{
  "name": "Modelos de conteúdo",
  "slug": "modelos",
  "environment": "staging-base-de-conhecimento",
  "prototypeUrl": "https://prototipo-base-de-conhecimento-ge2y9l6c2.vercel.app",
  "prototypeScreens": [
    "listagem",
    "criação - aba identificação",
    "criação - aba estrutura",
    "criação - aba imagem",
    "modal de preview",
    "modal de exclusão",
    "drawer de filtros"
  ]
}
```

Se `prototypeScreens` não fornecido, skill usa heurística "listagem +
criação + edição + 1 modal" como mínimo.

## Handlers por host

### `figma.com/make/*` — Figma Make

SPA pesada — espera mais (15s mínimo). Componentes não-padrão (texto
vira `<span>` sem semantic). Capturar screenshot além de snapshot para
ter referência visual de modais.

### `*.vercel.app/*` — Vercel SPA

Mais leve. SPA padrão (React/Next.js). Geralmente tem navegação via
links HTML (mais fácil de explorar via `browser_click`). Wait time
5-8s.

### `figma.com/file/*` — Figma File

Pode redirecionar para login. Detectar via URL pós-navegação. Se
redirecionou para login → SKIP gracioso com `skip_reason:
"login_required"`.

### Genérico

Wait time 8s. Tenta navegação se houver links visíveis no snapshot
inicial.

## Estrutura do `output/recon-prototipo.md`

```markdown
---
status: complete | partial | skipped
skip_reason: null | "login_required" | "timeout" | "mcp_unavailable" | "no_url"
prototype_url: https://...
host_handler: figma-make | vercel | figma-file | generic
captured_screens: N
skipped_screens: M
captured_at: 2026-05-22T14:30:00Z
---

# Recon Visual — <Nome do Projeto>

## 1. Hierarquia de navegação
- Menu lateral: "..." → submenu "..."
- Breadcrumb: "..."

## 2. Textos literais por tela

### Listagem
- Título da página: "..."
- Botão de criação: "..."
- Colunas: [...]

### Formulário — Aba <Nome>
- Campos:
  | Label | Tipo | Obrigatório | Limite | Placeholder |
  |---|---|---|---|---|

[... outras telas]

## 3. Modais detectados

### "<Nome do modal>"
- Header: "..."
- Body: "..."
- Botões: "..." / "..."

## 4. Toasts e mensagens

## 5. Opções de dropdowns

## 6. Divergência protótipo vs Discovery

| Item | Discovery diz | Protótipo mostra | Resolução |
|---|---|---|---|
| ... | ... | ... | Seguir protótipo (mais recente) |

## 7. Notas e limitações do recon
```

## Cache inteligente

- Se já existe `output/recon-prototipo.md` E foi gerado < 7 dias atrás E
  `prototype_url` é o mesmo → **reusa** sem perguntar (modo silencioso
  em CI)
- Se modo interativo: pergunta "Reusar cache (gerado em X) ou refazer?"
- Se `prototype_url` mudou → **refaz**
- Se cache > 7 dias → **refaz** (assume que protótipo evoluiu)
- Override: flag `--refresh-recon` força regeneração

## Validação pós-recon

- Conferir que header tem `status`
- Se `status: complete` → AT terá menos `// REVISAR-FIGMA`
- Se `status: partial` ou `skipped` → AT vai conter `// REVISAR-FIGMA` ainda; validator aceita esses warnings sem bloquear

## Anti-patterns

### A. Não-headless

Browser visível durante recon atrapalha o usuário (memória persistente
`feedback_browser_headless`).

```json
// ❌ NÃO FAZER
"args": ["-y", "@playwright/mcp@latest"]
```

```json
// ✅ FAZER
"args": ["-y", "@playwright/mcp@latest", "--headless"]
```

### B. Acessar Stage durante AT

Fora do escopo desta skill. Stage é responsabilidade do
`agent-playwright/.claude/skills/twygo-recon` durante execução.

### C. Tentar login em protótipo Figma fechado

Não usar credenciais Figma pessoais. Se protótipo exige login →
SKIP gracioso.

## Política CONTRACT.md v1.1

Skill é **default automática** quando `prototypeUrl` está preenchido.
Para desativar:

- Setar `prototypeUrl: null` no `project.config.json`
- Rodar `/analyze-test --no-recon`

Falhas (timeout, login, MCP off) NÃO travam o `/analyze-test` — geram
warning no relatório final.

## Migração de `recon-visual` (v1.0) para `recon-prototipo` (v1.1)

Diferenças:

| Aspecto | recon-visual (v1.0) | recon-prototipo (v1.1) |
|---|---|---|
| Nome | recon-visual | recon-prototipo |
| Default | Opt-in explícito | Auto quando prototypeUrl preenchido |
| Fallback | N/A (não rodava) | Gracioso (skip + warning) |
| Handlers por host | Genérico | figma-make, vercel, figma-file, generic |
| Telas mínimas | Heurística | `prototypeScreens` no config OU heurística |
| Cache | Sem | 7 dias TTL com refresh por URL change |

Skills/configs antigas continuam funcionando (campo `figmaPrototype` é
alias de `prototypeUrl`).

## Referências

- [CONTRACT.md §15](../../../../CONTRACT.md) — versão 1.1
- [agent-at/.mcp.json](../../../.mcp.json) — registro do playwright-mcp headless
- [agent-playwright/.claude/skills/twygo-recon](../../../../agent-playwright/.claude/skills/twygo-recon/SKILL.md) — skill análoga no Playwright (para Stage)
- Bug 2 detectado em Modelos (2026-05-22) — motivação da automação default
