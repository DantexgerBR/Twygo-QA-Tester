# CONTRACT.md — Contrato entre agentes do monorepo twygo-agents-qa

> **Status:** v1 — escopo focado em `agent-at` → `agent-playwright`.
> Seções marcadas **[V2]** / **[V3]** documentam o caminho futuro mas
> **não são vinculantes ainda** — implementadas conforme novos agentes
> entrarem (`agent-api`, `agent-db` ativado, `agent-pentest`,
> `agent-tasks-qa`).
>
> **Versões do contrato em uso**:
> - **1.0** — versão original (2026-05-18). ATs antigas (Base de Conhecimento,
>   Modelos atual) declaram `contract_version: 1.0` e seguem regras dela.
> - **1.1** — hardening de cobertura (2026-05-22). Introduz validação RN→TC,
>   cobertura ampliada de cenários negativos, combinatórias mínimas e
>   ativação automática do recon de protótipo. **Aplicada a projetos novos
>   por escolha explícita** (`contract_version: 1.1` no frontmatter).
>   ATs antigas em `1.0` continuam válidas — migração é opt-in. Detalhes na §15.
> - **1.2** — consolidação de testes de API em `agent-playwright` (2026-05-27).
>   Remove `executor: api` da enum (agent-api separado foi avaliado e descartado);
>   testes de API rodam no `agent-playwright` via `request` fixture em
>   `tests/api/`. Introduz convenção de separar TCs UI+API em 2 TCs.
>   Detalhes na §16.

> **Quem precisa ler este documento:**
> - Quem mantém `agent-at` (escreve neste contrato como produtor)
> - Quem mantém `agent-playwright` / `agent-db` / agentes futuros (consome este contrato)
> - QA Lead avaliando proposta de novo agente

---

## 1. Propósito

Este contrato define **o formato canônico de Análise de Teste (AT)** produzido
por `agent-at` e consumido pelos agentes executores do monorepo.

Resolve 3 problemas identificados em 2026-05:

1. **Passo manual XMind → XML TestLink fragmenta o pipeline.** QA exporta no
   XMind Desktop; esquecer = consumidores rodam contra AT antiga.
2. **`requisitos_extraidos.md` fica órfão.** Textos literais, modais, campos
   ricos catalogados, mas só o XML chega ao Playwright.
3. **Skills "playbook Twygo" sem trigger explícito.** ~25% das skills do
   Playwright dependem de inferência por prosa, levando a misses.

A solução: **MD canônico como fonte de verdade textual** + XMind/XML como
**derivados gerados automaticamente** para preservar fluxo manual TestLink.

---

## 2. Modelo de fonte de verdade

```
                  agent-at
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
  test-analysis.md  .xmind   .xml (TestLink)
  ↑ canônico        ↑ visualização    ↑ ponte fluxo manual
  ↑ commit'ed       ↑ commit'ed        ↑ commit'ed
                    ↑ regenerável      ↑ regenerável
                    a partir do MD     a partir do MD
                     │
                     ▼
         consumidores (Playwright, [V2] API, DB, Pentest)
         leem APENAS o .md
```

**Regras duras:**

1. **MD canônico é a única fonte de verdade.** Edições manuais autorizadas
   apenas no MD — nunca no XMind ou XML diretamente.
2. **XMind e XML são derivados.** `agent-at` regenera ambos sempre que o MD
   muda. QA pode abrir XMind Desktop apenas pra **visualizar**, não pra editar.
3. **Consumidores (Playwright e demais) leem só o MD.** Parser dedicado, sem
   dependência de XML TestLink.
4. **Fluxo manual TestLink permanece idêntico.** QA importa o `.xml` no
   TestLink Web, executa manual, registra resultados. Nada muda.
5. **Executor primário só aparece no MD.** XMind e XML não carregam essa
   informação (decisão 2026-05-18) — fluxo manual é agnóstico de agente.

---

## 3. Estrutura de pastas e arquivos

### 3.1 No `agent-at` (produtor)

```
agent-at/
├── projects/                                  # 1 subpasta por projeto Twygo (NOVO)
│   └── <slug>/
│       ├── project.config.json                # nome, env-alvo, fonte de docs
│       ├── docs/                              # Discovery, Spike, Quebra (deste projeto)
│       │   ├── *.docx
│       │   └── *.xlsx
│       └── output/
│           ├── test-analysis.md               # ← canônico, fonte de verdade
│           ├── Analise_Teste_<Projeto>.xmind  # derivado, regenerado a cada `at`
│           ├── Analise_Teste_<Projeto>.xml    # derivado, regenerado a cada `at`
│           ├── requisitos_extraidos.md        # opcional — complementar (raw extract)
│           └── generate_xmind.py              # script gerador (referência)
├── template/template.xmind                    # template base (compartilhado)
└── .claude/skills/
```

Notas:

- `agent-at/projects/<slug>/` é **simétrico** ao `agent-playwright/projects/<slug>/`. Isso destrava paralelismo (2 ATs em projetos diferentes ao mesmo tempo) e elimina o problema da pasta `docs/` mono-projeto.
- `test-analysis.md` tem **nome fixo** (não inclui slug do projeto no nome do arquivo). O slug já está no path. Isso facilita scripts de cópia entre agentes.
- `Analise_Teste_<Projeto>.xmind` e `.xml` mantêm o nome legível por humano (TestLink import).

### 3.2 No `agent-playwright` (consumidor)

```
agent-playwright/projects/<slug>/
├── project.config.json
├── inputs/
│   ├── test-analysis.md      # ← cópia do MD canônico (NOVO em v1)
│   └── (XML legado durante migração — pode coexistir)
├── specs/
├── tests/features/
├── pages/
└── data/
```

A cópia do MD do `agent-at/projects/<slug>/output/` para
`agent-playwright/projects/<slug>/inputs/` acontece por script
(`agent-at/scripts/publish.sh`) ou cópia manual. Não há import direto entre
agentes (preserva regra de isolamento — comunicação por filesystem).

### 3.3 Convenção de naming (enforçada)

| Artefato | Path canônico (slug = variável; resto fixo) |
|---|---|
| MD canônico (origem) | `agent-at/projects/<slug>/output/test-analysis.md` |
| MD canônico (cópia consumida) | `agent-playwright/projects/<slug>/inputs/test-analysis.md` |
| XMind derivado | `agent-at/projects/<slug>/output/Analise_Teste_<NomeLegível>.xmind` |
| XML TestLink | `agent-at/projects/<slug>/output/Analise_Teste_<NomeLegível>.xml` |
| Configuração do projeto (AT) | `agent-at/projects/<slug>/project.config.json` |
| Configuração do projeto (PW) | `agent-playwright/projects/<slug>/project.config.json` |

`<slug>`: lowercase, hífens, sem acentos. Ex.: `widgets`, `creditos-fase-02`.

---

## 4. Schema do MD canônico — `test-analysis.md`

O documento tem **3 níveis de frontmatter YAML**:

1. **Frontmatter de projeto** (raiz do arquivo)
2. **Cabeçalho de cada suíte** (delimitado por `---` no corpo)
3. **Metadados de cada TC** (linhas estruturadas após o título)

E seções de catálogo (textos, modais, dados) que substituem o
`requisitos_extraidos.md` órfão.

### 4.1 Frontmatter de projeto (raiz)

```yaml
---
# Identidade
contract_version: 1.0                     # versão deste CONTRACT.md
at_version: 1                             # incrementa quando AT regenera (changelog implícito)
project: widgets                          # slug — bate com pasta
project_name: "Painéis dos Usuários (Widgets)"
generated_at: 2026-05-18T12:34:00Z
generated_by: agent-at@<git-sha-curto>    # rastreabilidade

# Fontes
source_docs:
  - "docs/[Discovery] Painéis dos Usuários (Widgets) – v01 23.03.2026.docx"
  - "docs/Quebra de atividades - Painéis dos usuários (Widgets).xlsx"

# Ambiente alvo (consumidores leem isso para escolher config)
env: staging-widgets                      # bate com agent-playwright/config/environment.json
env_secondary: staging-widgets-disabled   # opcional — para testes de bloqueio

# Cobertura (calculado pelo agent-at — informativo)
totals:
  suites: 8
  test_cases: 25
  steps: 87
---
```

**Campos obrigatórios:** `contract_version`, `at_version`, `project`,
`project_name`, `generated_at`, `env`, `totals`.

**Campos opcionais:** `generated_by`, `source_docs`, `env_secondary`.

### 4.2 Cabeçalho de suíte

Cada suíte abre com um bloco YAML delimitado por `---` (estilo "front matter
local"). Permite metadados estruturados sem misturar com prosa.

```yaml
---
suite: Listagem de painéis
executor: playwright                      # playwright | db | pentest (testes API rodam em playwright/tests/api/ — ver §16)
org: principal                            # chave simbólica — opcional, default `principal`
playbooks:                                # skills Twygo aplicáveis à suíte inteira
  - filtro-drawer
  - toast-chakra
preconditions:                            # pré-condições compartilhadas por todos TCs da suíte
  - Ambiente Stage configurado
  - Funcionalidade 'Gestão de Painéis' habilitada no contrato da organização
  - Feature flag `<nome_da_flag>` ativa na organização
  - Usuário logado como Admin
---

# Listagem de painéis

[TCs da suíte abaixo]
```

**Campos obrigatórios:** `suite`, `executor`, `preconditions`.

**Campos opcionais:**

| Campo | Valores | Significado |
|---|---|---|
| `playbooks` | array de slugs canônicos (§6) | Skills Twygo a carregar como contexto |
| `org` | chave simbólica: `principal` / `secundario` / `trial` / `<nome-projeto>` / outro | Qual organização do env usar. Resolução para orgId concreto fica no consumidor (via `environment.json` + `.env`). Default: `principal` |
| `env_override` | slug do env | Se a suíte roda em env diferente do declarado no frontmatter de projeto |

**Por que `org` é chave simbólica e não orgId numérico:**

- MD canônico é versionado em git — não deve carregar IDs concretos da Twygo
- Cada projeto pode ter orgs próprias configuradas no `.env`/`environment.json`
- Consumidor (Playwright/API/DB) resolve `principal` → orgId via helper na sua stack
- Permite mesma AT rodar em envs diferentes (dev local, stage, hipoteticamente prod read-only) sem mudança no MD

**Convenções de chaves simbólicas:**

| Chave | Semântica |
|---|---|
| `principal` | Org default do env (a maior parte dos casos) |
| `secundario` | Org pareada com sufixo semântico (`-without-credits`, `-disabled`) |
| `trial` | Org Trial dedicada do projeto (ICP "Outros") |
| `<nome-livre>` | Quando o projeto tem múltiplas orgs com papéis distintos; nomes documentados no `project.config.json` do agente consumidor |

### 4.3 Metadados de TC

Cada TC tem título H2 + metadados em linhas estruturadas:

```markdown
## TC1 — Acessar a listagem de Painéis a partir do 'Menu'
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar acesso à listagem e renomeação de menu/breadcrumb (R1).

### Passos
1. Clicar no menu lateral "Menu"
   → Submenu lateral é exibido contendo os itens de navegação.
2. Clicar no submenu "Modos de uso"
   → Sistema redireciona para a tela de Modos de uso e exibe breadcrumb "Navegação > Modos de uso".
3. Clicar na aba "Painéis"
   → Aba "Painéis" fica selecionada e exibe a listagem de painéis.
```

**Campos de TC:**

| Campo | Obrigatório | Valores | Mapeamento |
|---|---|---|---|
| `**Prioridade**` | ✅ | `critical` / `high` / `medium` / `low` | ★★★ / ★★ / ★ / (sem) · XMind: `priority-1/2/3` · TestLink XML: `<importance>3/2/1</importance>` |
| `**Tipo**` | ✅ | `ui` / `api` / `db` / `mixed` | Informativo; auxilia executor a decidir cobertura. **A partir da v1.2**: TC `Tipo: api` em suíte `executor: playwright` vai em `tests/api/`. **TCs UI+API devem ser separados em 2 TCs** (`Tipo: ui` + `Tipo: api`) — ver §16. `Tipo: mixed` reservado para UI+DB (raro). |
| `**Playbooks adicionais**` | ✅ (pode ser `[]`) | array de slugs | Acrescenta aos playbooks da suíte |
| `### Objetivo` | ✅ | prosa | Vira `<summary>` do TestLink + nota do TC no XMind |
| `### Passos` | ✅ | lista numerada `N. Ação\n   → Resultado` | Vira `<step>` do TestLink + filhos do TC no XMind |

### 4.4 Formato de passos

Cada passo é uma entrada de lista numerada onde:

- **Linha 1**: prosa da ação, com **verbo canônico** + **nome literal entre aspas duplas**.
- **Linha 2 (continuação, indentada)**: começa com `→` seguido do resultado esperado, **assertável**.

```markdown
1. Clicar no botão "Salvar layout"
   → Toast exibida: "Layout salvo com sucesso". Modal "Salvar layout" é fechado.
2. Preencher o campo "Nome" com "Painel de testes"
   → Campo "Nome" exibe o texto digitado. Botão "Confirmar" fica habilitado.
```

**Por que essa convenção:** o parser MD do `agent-playwright` extrai `actions`
e `expectedResults` por regex simples (`/^\d+\. (.+)\n\s+→ (.+)$/m`). O
planner/generator lê a prosa exatamente como hoje lê do XML.

### 4.5 Verbos canônicos (lista normativa)

Reaproveitada da skill `twygo-qa-conventions` (não duplica — referencia).
Resumo dos verbos aceitos:

| Tipo | Verbo canônico |
|---|---|
| Navegação URL | "Acessar a URL '/o/{org}/...'" |
| Navegação UI | "Clicar no submenu '...'" / "Clicar na aba '...'" |
| Click | "Clicar no botão '...'" / "Clicar no link '...'" |
| Input | "Preencher o campo '...' com '...'" |
| Select | "Selecionar '...' no dropdown '...'" |
| Check | "Marcar '...'" / "Desmarcar '...'" |
| Switch | "Ativar o switch '...'" / "Desativar o switch '...'" |
| Upload | "Fazer upload do arquivo '...' no campo '...'" |
| Espera | "Aguardar '...' ser exibido" |

Detalhe completo em `agent-at/.claude/skills/twygo-qa-conventions/SKILL.md`.

### 4.6 Resultados assertáveis (lista normativa)

| Padrão | Exemplo |
|---|---|
| Toast | `Toast exibida: "Painel criado com sucesso"` |
| Modal | `Modal "Renomear aba" é exibido` |
| URL | `URL contém '/paineis'` ou `Sistema redireciona para '/paineis'` |
| Visibilidade | `Botão "Adicionar" está desabilitado` / `Coluna "Status" é exibida` |
| Contagem | `Listagem exibe 3 painéis` |
| Texto | `Tooltip exibida: "Edição disponível apenas no modo Desktop"` |

Sempre **objeto verificável + texto literal** quando houver. Anti-pattern:
"Sistema funciona corretamente", "Tela é exibida".

---

## 5. Seções de catálogo do MD canônico

Estas seções vão **antes das suítes** (após o frontmatter de projeto, antes
do primeiro `---` de suíte). Substituem o `requisitos_extraidos.md` órfão.

### 5.1 `## Dados de teste` (alimenta `.data.ts`)

Constantes de domínio que viram `*.data.ts` no Playwright.

```markdown
## Dados de teste

### Organizações (chaves simbólicas — resolvidas pelo consumidor)
- `org: principal` — usada em todas as suítes que não declaram override
- `org: secundario` — usada em suítes de bloqueio (env `*-disabled`)

> Valores concretos (orgIds, hosts) ficam em `agent-<exec>/.env` (gitignored)
> e referenciados em `agent-<exec>/config/environment.json`.

### Recursos para criação
- `panelNameFormat`: "Painel TC{n} w{workerIndex}-{timestamp}"
- `panelDescriptionMaxLength`: 500

### Usuários
- Admin: configurado via `.env` do consumidor (variáveis documentadas no `.env.example`)
```

Generator consulta esta seção pra montar o `<test-case>.data.ts` em vez de
inventar IDs inline.

### 5.2 `## Textos literais`

Strings exatas que os consumidores precisam para assertions.

```markdown
## Textos literais

### Toast — sucesso
- "Painel criado com sucesso"
- "Aba renomeada com sucesso"
- "Layout salvo com sucesso"

### Toast — erro
- "Não foi possível inativar o painel"
- "Nome é obrigatório"

### Labels e botões
- Menu lateral: "Menu" (renomeado de "Navegação")
- Botão de criação: "+ Adicionar"
- Confirmação destrutiva: "Excluir definitivamente"
```

### 5.3 `## Modais relevantes`

Catálogo de modais (título + subtítulo + botões + campos).

```markdown
## Modais relevantes

### "Modelo de página duplicado"
- **Quando aparece**: ao salvar item de menu com `page_model` duplicado no useMode
- **Header**: "Modelo de página duplicado"
- **Body**: "Esta página já foi adicionada na lista de menus deste modo de uso. Deseja adicioná-la novamente?"
- **Botões**: "Salvar" (confirma duplicação) / "Cancelar"

### "Renomear aba"
- **Header**: "Renomear aba"
- **Subtítulo**: "Altere o nome da aba selecionada"
- **Campos**: "Nome da aba" (input, max 255)
- **Botões**: "Cancelar" / "Renomear"
```

### 5.4 `## Endpoints (referência)`

Endpoints relevantes para o projeto.

**Obrigatoriedade (v1.2+)**: quando a AT contém ≥1 TC com `Tipo: api` ou
`Tipo: mixed` (UI+API), esta seção é **obrigatória**. Para ATs sem TC de
API, segue opcional (ajuda Playwright a debugar via Network).

A seção alimenta diretamente os clientes HTTP em
`agent-playwright/projects/<slug>/api/` e os JSON Schemas em
`agent-playwright/projects/<slug>/schemas/`.

```markdown
## Endpoints (referência)

| Método | URL | Sucesso | Erro |
|---|---|---|---|
| `PATCH` | `/panels/:id/change_status` | 200 | 422 "Descrição não pode ficar vazio(a)" |
| `POST` | `/panels` | 201 | 422 (campos obrigatórios) |
| `GET` | `/panels?page=&per_page=` | 200 | 401 |
```

### 5.5 `## Campos e validações` — opcional

Tabela de campos com tipo/limite/obrigatoriedade.

```markdown
## Campos e validações

| Campo | Tipo | Obrigatório | Limite | Observações |
|---|---|---|---|---|
| Nome (Identificação) | input texto | Sim | 255 | trim antes do save |
| Descrição | textarea | Não | 500 | aceita markdown |
```

### 5.6 Ordem canônica das seções

Para parsers determinísticos, a ordem é:

1. Frontmatter de projeto
2. `## Dados de teste` *(opcional)*
3. `## Textos literais` *(opcional)*
4. `## Modais relevantes` *(opcional)*
5. `## Endpoints (referência)` *(opcional)*
6. `## Campos e validações` *(opcional)*
7. Suítes (cada uma com frontmatter local + TCs)

Suítes sempre por último. Tudo entre o frontmatter de projeto e a primeira
suíte é catálogo.

---

## 6. Playbooks Twygo — lista canônica

Slugs aceitos no campo `playbooks:` do frontmatter de suíte/TC. Cada slug
mapeia para uma skill do `agent-playwright`. Quando o orchestrator vê o
playbook declarado, carrega a skill correspondente como contexto antes de
invocar planner/generator.

**Esta lista é o único lugar onde o agent-at "sabe" de skills do
agent-playwright.** Mantém isolamento (agent-at não consome código do
Playwright; só conhece slugs).

| Slug | Skill correspondente (agent-playwright) | Quando usar na AT |
|---|---|---|
| `flipper` | `testar-feature-flag-twygo` | TC depende de toggle de feature flag em runtime |
| `super-admin` | `alterar-funcionalidade-contrato-twygo` | TC depende de alterar contrato/funcionalidade via Super Admin |
| `trial` | `provisionar-trial-projeto-twygo` + `testar-exclusao-dados-trial-twygo` | TC roda em org Trial / valida exclusão de dados Trial |
| `ambientes-adicionais` | `testar-ambientes-adicionais-twygo` | TC valida isolamento entre tenants pareados |
| `filtro-drawer` | `testar-filtro-drawer-twygo` | Listagem com filtro via drawer Chakra |
| `toast-chakra` | `testar-toast-chakra-twygo` | TC valida toast Chakra empilhado |
| `switch-chakra` | `interagir-switch-chakra-twygo` | TC interage com switch Chakra |
| `beforeunload` | `testar-beforeunload-dialog-twygo` | TC clica "Cancelar" com form sujo |
| `perfil-switch` | `trocar-perfil-twygo` | TC valida visão de perfil diferente (Aluno, Gestor) |
| `cleanup-dados` | `limpar-dados-de-teste-twygo` | TC cria/altera estado persistente |

**Como o agent-at decide qual playbook usar**: durante `/analyze-test`,
inspecionando as pré-condições e passos. Skill `read-docs` do agent-at deve
ser atualizada (V1) para inferir playbooks comuns.

**Lista evolutiva**: novos playbooks entram aqui quando uma skill nova é
criada no Playwright. Esta tabela é o **registro autoritativo**.

---

## 7. Convenções de prosa

Não duplicar — esta seção referencia. Verbos canônicos, asserções,
anti-patterns vivem em:

- **`agent-at/.claude/skills/twygo-qa-conventions/SKILL.md`** (escrita)
- **`agent-playwright/.claude/prose-patterns.md`** (consumo / mapeamento PT-BR → Playwright)

**Regra de coerência:** se um padrão de prosa novo for inventado no agent-at,
o time deve atualizar `prose-patterns.md` no mesmo PR. Não pode haver
divergência. Se houver, é um bug a corrigir.

---

## 8. Geração dos derivados (XMind + XML)

Responsabilidade exclusiva do `agent-at`. Consumidores NUNCA geram
derivados — eles só leem o MD.

### 8.1 MD → XMind

Mantém o script atual `agent-at/output/generate_xmind.py` mas adapta a
fonte:

```
Antes (atual):
  Python dict (hard-coded no script) → content.json → .xmind

Depois (v1):
  test-analysis.md → parser MD → dict equivalente → content.json → .xmind
```

Mapeamento:

| MD canônico | Tópico XMind |
|---|---|
| Frontmatter `project_name` | Tópico central |
| `## <suíte>` (frontmatter local) | Filho do central |
| `## TC<N> — <título>` | Filho da suíte + nota = `Objetivo + [PRECONDITIONS]` + marker priority |
| Passo `N. <ação>` | Filho do TC |
| `→ <resultado>` (mesmo passo) | Filho do passo |
| `**Prioridade**: critical` | Marker `priority-1` no TC |

### 8.2 MD → XML TestLink

Template Jinja2 simples (`agent-at/templates/testlink.xml.j2`). Mapeamento:

| MD canônico | XML TestLink |
|---|---|
| `## <suíte>` | `<testsuite name="...">` |
| `## TC<N>` | `<testcase name="...">` |
| `### Objetivo` | `<summary>` |
| Frontmatter de suíte `preconditions:` | `<preconditions>` (juntadas em prosa) |
| `**Prioridade**` | `<importance>3/2/1</importance>` |
| `**Tipo**: ui` → `<execution_type>2</execution_type>` (Automated) | TC tipo UI/API/DB rodável por agente |
| `**Tipo**: mixed` ou ausente → `<execution_type>1</execution_type>` (Manual) | TC que vai pro fluxo manual |
| Passos | `<steps><step><step_number/><actions/><expectedresults/></step></steps>` |

**Não inclui o campo `executor` no XML** (decisão 2026-05-18). XML é
"orquestrador-agnóstico" — fluxo manual via TestLink não precisa saber qual
agente automatizaria.

### 8.3 Compatibilidade TestLink

XML gerado segue schema TestLink padrão. Importação preserva todos os
campos. Não dependemos de `<custom_fields>` em v1.

---

## 9. Versionamento

### 9.1 `at_version` no frontmatter

Inteiro incremental. Convenções:

- **v1** = primeira geração do agent-at para este projeto
- Incrementa quando AT regenera com mudanças (ex.: AT v2 corrige um TC, AT v3 acrescenta suíte nova)
- Não confundir com `contract_version` (versão do CONTRACT.md que o AT segue)

Consumidores leem `at_version` para detectar mudança e re-rodar planner/generator se mudou.

### 9.2 Mudanças cumulativas

Quando o AT é regenerado:

1. Branch nova `feature/at-update-<slug>-v<N>` no monorepo
2. `agent-at` regenera os 3 arquivos (MD + XMind + XML)
3. PR cruzado: AT review (XMind binário ↔ MD diff) + impacto downstream (Playwright)
4. Merge → CI re-roda consumidores afetados

### 9.3 `contract_version`

Incrementa quando este `CONTRACT.md` é alterado de forma incompatível
(campo obrigatório novo, mudança de tipo, remoção de campo). Mudanças
compatíveis (campo opcional novo, esclarecimento) **não** incrementam.

Convenção: SemVer simplificada — `MAJOR.MINOR`. v1.0 atual. v1.1 acrescenta
campo opcional. v2.0 muda algo incompatível.

---

## 10. Como o `agent-playwright` consome o MD canônico [V1]

Substitui o fluxo atual (`twygo-xml-parser` → JSON estruturado). Em v1:

1. **Cópia**: `test-analysis.md` é copiado de `agent-at/projects/<slug>/output/`
   para `agent-playwright/projects/<slug>/inputs/` (manual ou via script).
2. **Parser**: nova skill **`twygo-md-parser`** (substitui `twygo-xml-parser`)
   lê MD → produz JSON estruturalmente equivalente ao atual + campos novos
   (`executor`, `playbooks`, catálogos).
3. **Orchestrator**: `twygo-test-orchestrator` carrega contexto baseado em
   `playbooks` declarados antes de invocar planner/generator. Skills da
   tabela §6 são lidas como contexto.
4. **Restante do pipeline**: idêntico ao atual (planner / generator / execute /
   validate / report / heal).

**Coexistência durante migração**: o `twygo-xml-parser` permanece disponível.
Projetos antigos com XML continuam parseáveis até serem regenerados em MD
pelo agent-at. Sem flag-day forçado.

---

## 11. Roadmap

### [v1.2] Validações secundárias — API inline, DB via subprocess

**API**: validações de API são **inline** no spec do `agent-playwright`, usando
`request` fixture + JSON Schema (Ajv). Sem envelope cross-agente, sem IPC, sem
arquivo intermediário. Exemplo:

```ts
// agent-playwright/projects/<slug>/tests/api/<suite>.spec.ts
import { test, expect } from '@playwright/test';
import { reenrollResponseSchema } from '../../schemas/reenroll-response.schema.json';
import { validateAgainstSchema } from '../../../../src/utils/schema';

test('TC2 — POST /api/v2/users/mass cria participants reinscritos', async ({ request }) => {
  const response = await request.post('/api/v2/users/mass', { data: payload });
  expect([200, 207]).toContain(response.status());
  validateAgainstSchema(await response.json(), reenrollResponseSchema);
});
```

**DB**: validações de DB **continuam via subprocess + filesystem** chamando
`agent-db` (Python). Justificativa: agent-db tem read-only guard, keyset
pagination e comparação por hash que não fazem sentido reimplementar em TS.

Exemplo declarativo na AT (formato preliminar — não vinculante até implementação):

```markdown
## TC3 — Reinscrição em massa grava log em ai_indexing_logs
**Prioridade**: critical
**Tipo**: api
**Validações secundárias** (DB):
  - agent: db
    template: indexing_logs_by_org
    params: {org_id: ${orgId}, since: ${testStartTime}}
    expect:
      count: 1
      columns:
        status: completed
```

**Como roda** (DB apenas):

```
PW spec.ts
  → escreve input em agent-db/inputs/<runId>__<slug>.md
  → executa `python -m agent_db.main --input <path> --out <outpath>`
  → lê report.json em agent-db/outputs/<runId>/
  → incorpora resultado no relatório próprio
```

**Envelope de report comum (DB)**: `{agent: 'db', runId, suite, tc, results: [...], errors: [...]}`.
Permite consolidação por agentes futuros (ex: agent-docs-qa **[V3]**).

**TCs UI+API (mixed)**: a partir da v1.2, **TCs que combinam ações UI e API
devem ser separados em 2 TCs** (`Tipo: ui` + `Tipo: api`), cada um focado num
modo. Não declarar `Tipo: mixed` para UI+API — esse valor fica reservado para
UI+DB (raro, ex: testar trigger Postgres a partir de ação UI). Detalhe em §16.

### [V2] Schema de envelope de report

Cada agente executor primário produz `outputs/<slug>/reports/<runId>/report.json` com schema unificado. Especificação fica pra v2.

### [V3] Suporte a outros agentes

- `agent-tasks-qa`: PRECEDE o agent-at. Output dele é o input que hoje é o `.xlsx` manual de "Quebra de atividades". Schema próprio (TBD).
- `agent-pentest`: executor primário próprio. Categorias OWASP no MD. Provavelmente roda em pipeline separado (semanal/release).
- ~~`agent-api`~~: **descartado em v1.2 (2026-05-27)** — testes de API rodam no `agent-playwright` via `request` fixture. Detalhes em §16.
- `agent-docs-qa`: produtor de documentação de usabilidade para usuário final. Input/output a definir quando criar.

### [V3] Pipelines CI/CD

1 workflow GitHub Actions por agente. Pré-requisito: MD canônico versionado em git (resolvido em v1).

---

## 12. Apêndice — Exemplo completo (recorte)

```markdown
---
contract_version: 1.0
at_version: 1
project: <slug-do-projeto>
project_name: "<Nome do Projeto>"
generated_at: 2026-05-18T12:34:00Z
source_docs:
  - "docs/[Discovery] <Nome do Projeto>.docx"
env: <slug-do-env-principal>           # ex: staging-<slug>
env_secondary: <slug-do-env-secundario> # opcional, ex: staging-<slug>-disabled
totals:
  suites: 8
  test_cases: 25
  steps: 87
---

# Análise de Teste — <Nome do Projeto>

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default
- `org: secundario` — usada em suítes de bloqueio

> orgIds reais resolvidos pelo consumidor via `.env` + `environment.json`.

### Recursos
- `panelNameFormat`: "Painel TC{n} w{workerIndex}-{timestamp}"

## Textos literais

### Toast — sucesso
- "Painel criado com sucesso"
- "Aba renomeada com sucesso"

### Toast — erro
- "Não foi possível inativar o painel"

## Modais relevantes

### "Modelo de página duplicado"
- **Quando aparece**: salvar item de menu com page_model duplicado
- **Header**: "Modelo de página duplicado"
- **Botões**: "Salvar" / "Cancelar"

---

---
suite: Listagem de painéis
executor: playwright
org: principal
playbooks: [filtro-drawer, toast-chakra]
preconditions:
  - Ambiente Stage configurado
  - Feature flag `<nome_da_flag>` ativa na organização do teste
  - Funcionalidade '<Nome da Funcionalidade>' habilitada no contrato da organização
  - Usuário logado como Admin
---

# Listagem de painéis

## TC1 — Acessar a listagem de Painéis a partir do 'Menu'
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Validar acesso à listagem e renomeação de menu/breadcrumb (R1).

### Passos
1. Clicar no menu lateral "Menu"
   → Submenu lateral é exibido contendo os itens de navegação.
2. Clicar no submenu "Modos de uso"
   → Sistema redireciona para a tela de Modos de uso e exibe breadcrumb "Navegação > Modos de uso".
3. Clicar na aba "Painéis"
   → Aba "Painéis" fica selecionada e exibe a listagem de painéis.

## TC2 — Validar componentes obrigatórios da listagem de painéis
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que listagem renderiza todos os componentes obrigatórios da UI.

### Passos
1. Acessar a URL "/o/{defaultOrgId}/paineis"
   → Listagem é exibida com colunas: "Nome", "Status", "Criado em".
2. Verificar o componente de filtro
   → Botão "Filtrar" é exibido. Botão "Limpar filtros" está desabilitado.
```

---

## 15. Versão 1.1 — Hardening de cobertura (2026-05-22)

### Motivação

Auditoria pós-execução do projeto **Modelos de conteúdo** revelou bugs
reais (detectados em repasse exploratório manual) que **não foram pegos**
pela AT + execução automatizada Playwright. 5 padrões sistemáticos
identificados (resumo em [§Decisões 2026-05-22](#13-decisões-registradas)):

1. Validações de campos obrigatórios sub-cobertas (1 TC genérico por aba
   em vez de matriz por campo)
2. Componente de filtro/listagem **divergente da Especificação** no Stage
   — generator se adaptou ao que existia (Stage) em vez de denunciar a
   divergência
3. Falha em **carregamento visual de previews** (broken images) — testes
   funcionais com `toBeVisible()` passam em `<img>` quebrada
4. Upload de arquivos em **componentes complexos** (Plate Editor) — AT
   tratou componente como caixa preta sem validar interações internas
5. Filtros com **múltiplas opções combinadas** não cobertos — testes
   1-dimensionais

v1.1 introduz **5 mudanças vinculantes** + **2 mudanças no fluxo do
agent-at** que atacam diretamente esses padrões.

### Mudanças vinculantes em ATs `contract_version: 1.1`

| Item | Mudança | Onde | Status na 1.1 |
|---|---|---|---|
| 1.1 | Validação RN → TC (cada RN em `requisitos_extraidos.md` precisa de pelo menos 1 TC referenciando) | `validate_md_canonical.py` + schema MD (campo `rns_cobertas` por TC) | **warning** em 1.1 (não bloqueia); pode virar erro em 1.2 |
| 1.2 | Padrão canônico de validação visual para previews/thumbs/imagens | Skill nova `validar-preview-visual-twygo` (opt-in via playbook) | **opt-in** |
| 1.3 | Cobertura mínima de cenários negativos por campo obrigatório (consolidada via matriz data-driven em 1 TC, não N TCs separados) | `validate_md_canonical.py` + skill nova `cenarios-negativos-twygo` | **warning** em 1.1 |
| 2.1 | Padrão canônico de teste do Plate Editor (espaços IA, kit de marca, upload, etc.) | Skill nova `testar-plate-editor-twygo` (opt-in via playbook) | **opt-in** |
| 2.2 | Combinatórias mínimas obrigatórias (1+ TC combinando 2 filtros + busca textual em suítes com playbook `filtro-drawer`) | `validate_md_canonical.py` | **warning** em 1.1 |

### Mudanças no fluxo do agent-at em 1.1

| Item | Mudança | Onde |
|---|---|---|
| Recon-prototipo automático | Etapa 2.5 do `/analyze-test` invoca `/recon-prototipo` automaticamente quando `figmaPrototype` (renomeado para `prototypeUrl`) está preenchido. **Fallback gracioso**: timeout/login/MCP indisponível → skip com warning, AT prossegue | Skill `recon-prototipo` (renomeada de `recon-visual`) + atualização da `analyze-test/SKILL.md` |
| Categorias A-H de cenários negativos | Skill `cenarios-negativos-twygo` documenta 8 categorias obrigatórias (obrigatoriedade, boundary, caracteres, injection, tipo errado, extensão de arquivo, MIME, tamanho de arquivo) + 3 V2 (race, network, estado) | Skill nova |

### Categorias I-K reservadas para V2

Race conditions, network failures e estado inválido permanecem **fora do
escopo da 1.1** — são flaky por natureza e exigem infraestrutura de retry
adequada. Serão habilitadas em versão futura (V2 ou 1.2 conforme prioridade).

### Compatibilidade e migração

- **ATs com `contract_version: 1.0` continuam válidas indefinidamente**
- **Validador roda regras diferentes baseado em `contract_version`**:
  - 1.0: regras originais (anti-patterns A-H + playbooks + catálogos)
  - 1.1: tudo de 1.0 + 5 mudanças vinculantes acima
- **Migração de AT existente** é opt-in:
  1. Editar frontmatter: `contract_version: 1.0` → `1.1`
  2. Adicionar campo `rns_cobertas` por TC (manual ou via skill futura)
  3. Re-rodar `validate_md_canonical.py` e tratar warnings
  4. Skills opt-in (1.2, 2.1) ativam ao declarar playbooks novos
- **Projetos novos**: regerados em 1.1 por default a partir de 2026-05-22

### Versionamento do validator

`validate_md_canonical.py` lê `contract_version` do frontmatter e:
- Se `1.0`: aplica conjunto v1.0 de regras (estado atual)
- Se `1.1`: aplica conjunto v1.0 + regras novas v1.1
- Se outro valor: erro de schema (versão não suportada)

### Schema novo em 1.1

Campos opcionais adicionados (não-breaking para v1.0):

```yaml
# Frontmatter de projeto (raiz)
prototypeUrl: https://figma.com/...      # renomeado de figmaPrototype; mantém alias

# Por TC (dentro de Suíte)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [1, 1.1, 1.2]         # novo em 1.1
**Validation matrix**: [...]            # novo em 1.1 (para data-driven negativos)
```

Em 1.0, esses campos são ignorados silenciosamente (forward-compatibility
implícita). Em 1.1, eles são lidos e validados.

---

## 16. Versão 1.2 — Consolidação de API no agent-playwright (2026-05-27)

### Motivação

Avaliação aprofundada (3 alternativas — agent-api separado / API em
agent-playwright / agent-python unificando DB+API) chegou à conclusão de
que **API testing pertence ao `agent-playwright`**, não a um agente
separado. Principais drivers da decisão:

1. **`APIRequestContext` (request fixture) do Playwright é nativo** e
   designado exatamente para esse caso — TS first-class, sem dependência
   de browser quando rodando em `--project api`.
2. **TCs API Twygo carregam playbooks UI** (Flipper, Super Admin, contrato).
   Exemplo concreto: TC4 da suíte "Reinscrição via API V2" requer toggle
   Flipper antes do POST. `agent-playwright` já tem `FlipperAdminPage`,
   `ensureFlipperActor` e `dismissCommonModals`. Agente separado
   reimplementaria ou faria IPC reverso (anti-pattern).
3. **Zero IPC para API**: validações inline (`request.post()` +
   `validateAgainstSchema(body, schema)`) substituem envelope cross-agente
   especificado em §11 V2. Latência menor, report unificado, traces
   integrados.
4. **Onboarding reduzido**: 2 stacks (TS PW+API + Python DB) em vez de 3
   (TS PW + Python DB + Python/TS API).
5. **`agent-db` permanece em Python** por reuso direto do migration-validator
   (read-only guard, keyset pagination, hash compare). API não tem
   necessidades irreducíveis de Python equivalentes.

### Mudanças vinculantes em ATs `contract_version: 1.2`

| Item | Mudança | Onde | Status na 1.2 |
|---|---|---|---|
| 1.1 | `executor:` enum reduzida — remove `api` | §4.2 | **breaking**: ATs com `executor: api` precisam migrar para `executor: playwright` |
| 1.2 | `## Endpoints (referência)` vira obrigatório quando AT contém ≥1 TC `Tipo: api` ou `mixed (UI+API)` | §5.4 | **obrigatório** |
| 1.3 | TCs UI+API separados em 2 TCs (`Tipo: ui` + `Tipo: api`) — `Tipo: mixed` reservado para UI+DB | §4.3 + §11 | **convenção** |
| 1.4 | Validações secundárias **de API** são inline no spec PW (`request` fixture + Ajv); **de DB** seguem subprocess+filesystem agent-db | §11 | **mudança de fluxo** |

### Convenção de organização no `agent-playwright`

```
agent-playwright/projects/<slug>/
├── tests/
│   ├── features/                  # E2E UI — atual
│   └── api/                       # NOVO em v1.2 — TCs com Tipo: api
├── api/                           # NOVO em v1.2 — clientes HTTP (estilo POM, mas para REST)
│   └── <RecursoApiClient>.ts
├── schemas/                       # NOVO em v1.2 — JSON Schemas para validação de response
│   └── <endpoint>-response.schema.json
└── pages/                         # POMs UI — atual
```

`playwright.config.ts` ganha um `project` adicional:

```ts
projects: [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'api', testMatch: /tests\/api\/.*\.spec\.ts/, use: { baseURL: process.env.API_BASE_URL } },
]
```

### Compatibilidade e migração

- **ATs com `contract_version: 1.0` ou `1.1` continuam válidas**
  indefinidamente. `executor: api` não é usado por nenhuma AT em produção
  no momento (verificado em 2026-05-27 — todas as suítes API atuais usam
  `executor: playwright` com `Tipo: api` por TC).
- **Migração de AT existente para 1.2**:
  1. Editar frontmatter: `contract_version` → `1.2`
  2. Se algum TC tem `Tipo: mixed` cobrindo UI+API, separar em 2 TCs
     (`Tipo: ui` + `Tipo: api`)
  3. Garantir que `## Endpoints (referência)` está preenchida se houver
     TC `Tipo: api`

### Quando agent-api separado seria criado no futuro

A decisão de v1.2 é revertida apenas se ao menos um destes critérios
emergir:

1. Property-based testing (Schemathesis ou equivalente) virar requisito
   recorrente em ≥3 projetos
2. Backend team Twygo passar a escrever testes de API sem aprender TS
3. Volume de testes de API ultrapassar ~200 specs e o report unificado do
   PW ficar inviável
4. Algum projeto exigir rodar API tests em ambiente isolado sem PW (CI
   minimal)

Reavaliação fica em aberto. Não há trabalho ativo previsto.

---

## 13. Decisões registradas

| Data | Decisão | Por quê |
|---|---|---|
| 2026-05-18 | MD canônico como fonte de verdade; XMind/XML são derivados | Destrava agentes futuros; mata passo manual de export; preserva fluxo TestLink |
| 2026-05-18 | Executor primário só no MD, não no XMind/XML | XMind/XML são para fluxo manual — manual é agnóstico de agente automatizado |
| 2026-05-18 | `CONTRACT.md` e `shared/twygo-platform.md` permitidos na raiz | Documentos de contrato cross-agente; preservam regra de isolamento de código |
| 2026-05-18 | Opção C (executor primário + validações secundárias opcionais) | Cobre suítes puras (api/db) e híbridas (UI+DB); preserva isolamento via filesystem |
| 2026-05-18 | agent-docs-qa é produtor de docs de usabilidade, não auditor cross-agente | Esclarecimento do usuário; categoria revisada |
| 2026-05-18 | Campo `org` (chave simbólica) opcional no frontmatter de suíte | Permite suítes do mesmo projeto declararem orgs distintas (principal/secundário/trial). Resolução para orgId concreto fica no consumidor — MD canônico não carrega IDs reais |
| 2026-05-18 | Valores concretos (hosts, orgIds, emails, flags de projeto) NÃO ficam em arquivos versionados cross-agente (CONTRACT.md, shared/twygo-platform.md) | Revisão de segurança — git versionado não deve expor infra interna; valores vivem em `.env` (gitignored) referenciado via `${VAR}` em `environment.json` |
| 2026-05-22 | Introdução de `contract_version: 1.1` (hardening de cobertura) | Auditoria pós-execução do projeto Modelos identificou 5 padrões sistemáticos de bugs reais que passaram pela AT/Playwright automatizado. 5 mudanças vinculantes + 2 mudanças no fluxo do agent-at. Categorias I-K (race/network/estado inválido) reservadas para V2. ATs `1.0` continuam válidas; migração é opt-in. Detalhes em §15. |
| 2026-05-22 | Validador `validate_md_canonical.py` passa a fazer branching de regras por `contract_version` | Permite coexistência sem regressão. ATs antigas seguem regras 1.0; novas usam 1.1 |
| 2026-05-22 | Recon-prototipo automático com fallback gracioso (Opção C) | Histórico mostra que opt-in não foi usado (Base de Conhecimento e Modelos pularam recon). Default automático garante uso, mas fallback (timeout/login/MCP indisponível) impede travamento do fluxo. Override via flag `--no-recon` |
| 2026-05-27 | Introdução de `contract_version: 1.2` — consolidação de API no `agent-playwright`; `agent-api` separado descartado (Opção B em comparativo de 3 alternativas) | Avaliação revelou que (a) `request` fixture do PW cobre o caso nativamente, (b) TCs API Twygo dependem de playbooks UI já canonizados (Flipper, Super Admin), (c) zero IPC para API valida secundárias, (d) onboarding reduzido. agent-db mantido em Python por reuso do migration-validator. Detalhes em §16 |
| 2026-05-27 | TCs UI+API obrigatoriamente separados em 2 TCs (`Tipo: ui` + `Tipo: api`) | Mantém limpa a separação entre `tests/features/` (UI) e `tests/api/` (API). `Tipo: mixed` fica reservado para UI+DB (raro). Caso real: TC1 da suíte Reinscrição via API V2 do Recertificação tem passo UI dentro de TC `Tipo: api` — vai ser separado |
| 2026-05-27 | `## Endpoints (referência)` vira obrigatório quando AT tem ≥1 TC `Tipo: api` | Alimenta diretamente os clientes HTTP em `agent-playwright/projects/<slug>/api/` e os JSON Schemas em `schemas/`. Sem isso, generator inventa endpoints ou força recon caro |

---

## 14. Como propor mudanças neste contrato

1. Abrir PR com mudança no `CONTRACT.md`
2. Incrementar `contract_version` no header se for breaking change
3. Quando mudar, atualizar **todos** os agentes afetados no mesmo PR (ou em PRs cruzados aprovados em paralelo)
4. Discutir com QA Lead antes de fazer mudança breaking
5. Versão antiga continua válida em projetos já versionados — migração é por projeto, não global

---

**Próximas etapas após v1 aceito:**

1. Atualizar `agent-at/CLAUDE.md` para refletir produção do MD canônico + derivados (passa a ter regras duras, anti-patterns, contrato)
2. Atualizar `CLAUDE.md` raiz com mapa do ecossistema + anatomia de agente novo + referência a este CONTRACT.md
3. Atualizar `README.md` raiz para usar tabela genérica (suporta crescer pra 7+ agentes)
4. Criar `shared/twygo-platform.md` extraindo gotchas Twygo do `agent-playwright/CLAUDE.md §7.5`
5. Implementar parser MD no agent-at + script de regeneração de XMind/XML
6. Implementar `twygo-md-parser` no agent-playwright (paralelo ao XML, sem flag-day)
