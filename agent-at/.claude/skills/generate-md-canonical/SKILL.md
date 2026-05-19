---
name: generate-md-canonical
description: Gera o arquivo test-analysis.md (MD canônico — fonte de verdade da AT) seguindo o schema do CONTRACT.md raiz. Lê requisitos_extraidos.md como input, monta frontmatter de projeto, catálogos (Dados de teste / Textos literais / Modais / Endpoints / Campos), e suítes com TCs estruturados. Use APÓS read-docs e definição de estrutura, ANTES de generate-xmind e generate-xml-testlink.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Geração do MD canônico (test-analysis.md)

## Objetivo

Emitir o `test-analysis.md` em `projects/<slug>/output/test-analysis.md`
seguindo o schema definido no [CONTRACT.md raiz](../../../../CONTRACT.md).

Este arquivo é a **fonte de verdade** da AT. XMind e XML TestLink são
gerados a partir dele pelas skills `generate-xmind` e `generate-xml-testlink`.

## Pré-requisitos

- `projects/<slug>/output/requisitos_extraidos.md` já gerado pela skill `read-docs`
- Estrutura de suítes já definida (Etapa 3 do `analyze-test`) e aprovada pelo usuário
- Casos de teste detalhados em mente (Etapa 4 do `analyze-test`)

## Estrutura obrigatória do `test-analysis.md`

Schema completo em [CONTRACT.md §4 e §5](../../../../CONTRACT.md). Resumo:

```markdown
---
contract_version: 1.0
at_version: 1
project: <slug-do-projeto>
project_name: "<Nome do Projeto>"
generated_at: <ISO-8601, ex: 2026-05-18T12:34:00Z>
source_docs:
  - "docs/<nome-do-arquivo>.docx"
  - "docs/<nome-da-planilha>.xlsx"
env: <slug-do-env-principal>           # ex: staging-<slug-projeto>
env_secondary: <slug-do-env-secundario> # opcional
totals:
  suites: <N>
  test_cases: <N>
  steps: <N>
---

# Análise de Teste — <Nome do Projeto>

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default
- `org: secundario` — usada em suítes de bloqueio

### Recursos
- `<chave>`: <valor> (ex: `panelNameFormat`: "Painel TC{n} w{workerIndex}-{timestamp}")

## Textos literais

### Toast — sucesso
- "<texto literal exato>"

### Toast — erro
- "<texto literal exato>"

### Labels e botões
- <local>: "<texto>"

## Modais relevantes

### "<Nome do modal>"
- **Quando aparece**: <gatilho>
- **Header**: "<texto literal>"
- **Body**: "<texto literal>"
- **Botões**: "<botão 1>" / "<botão 2>"

## Endpoints (referência)

| Método | URL | Sucesso | Erro |
|---|---|---|---|
| `PATCH` | `/<recurso>/:id/<acao>` | 200 | 422 "<mensagem>" |

## Campos e validações

| Campo | Tipo | Obrigatório | Limite | Observações |
|---|---|---|---|---|
| <nome> | <tipo> | Sim/Não | <N> | <obs> |

---

---
suite: <Nome da Suíte>
executor: playwright            # playwright | api | db | pentest
org: principal                  # chave simbólica — opcional, default `principal`
playbooks:                      # opcional — slugs canônicos da CONTRACT.md §6
  - <playbook-slug>
preconditions:
  - <pré-condição em estado descritivo>
  - <pré-condição em estado descritivo>
---

# <Nome da Suíte>

## TC1 — <Título do caso>
**Prioridade**: critical | high | medium | low
**Tipo**: ui | api | db | mixed
**Playbooks adicionais**: []

### Objetivo
<Prosa descrevendo o que o TC valida e por quê.>

### Passos
1. <Verbo canônico + nome literal entre aspas> — ex: Clicar no botão "Salvar"
   → <Resultado assertável com texto literal> — ex: Toast exibida: "Salvo com sucesso"
2. ...
   → ...

## TC2 — ...
```

## Regras duras de escrita

1. **Frontmatter de projeto OBRIGATÓRIO** — todos os campos da §4.1 do CONTRACT.md
2. **Frontmatter de suíte OBRIGATÓRIO** — `suite`, `executor`, `preconditions`
3. **Verbos canônicos** em toda ação — lista em `twygo-qa-conventions §8.1`
4. **Textos literais entre aspas duplas** — todo elemento UI, mensagem, URL
5. **Resultados assertáveis** — objeto verificável + texto literal quando houver
6. **Pré-condições não referenciam Dev** — só estado de ambiente
7. **NÃO inventar campo de frontmatter** — só os documentados no CONTRACT.md
8. **NÃO hardcodar hosts/orgIds reais** — usar chaves simbólicas (`principal`, `secundario`)
9. **Catálogos preenchidos** — se `requisitos_extraidos.md` lista textos/modais/endpoints, copiar para as seções
10. **Catálogo de Modais** — incluir EXATAMENTE título, body e botões com texto literal
11. **Cada passo autocontido** — nunca "repetir passo 3"
12. **Combinar 2 ações num passo é proibido** — quebrar em 2 passos

## Mapeamento de prioridade (decisão 2026-05-19)

4 valores no MD canônico, com mapeamento explícito para os derivados:

| MD `**Prioridade**` | XMind marker | TestLink `<importance>` | Allure severity |
|---|---|---|---|
| `critical` | `priority-1` | `3` | `critical` |
| `high` | `priority-1` | `3` | `normal` |
| `medium` | `priority-2` | `2` | `normal` |
| `low` | `priority-3` | `1` | `minor` |

`critical` e `high` colapsam no mesmo marker XMind (ambos são "alto" do
ponto de vista do QA manual). A granularidade é preservada nos reports
Allure (`critical` vs `normal`).

**Como escolher**:
- `critical` — happy path, fluxos bloqueadores, regras de negócio core
- `high` — validações importantes mas não-bloqueantes do fluxo principal
- `medium` — campos opcionais, cenários alternativos, complementares
- `low` — edge cases, performance, usabilidade, cosméticos

## Playbooks Twygo — tabela canônica com keywords de detecção

Slugs aceitos em `playbooks:` no frontmatter de suíte. Lista completa em
[CONTRACT.md §6](../../../../CONTRACT.md). Esta tabela acrescenta as
**keywords de detecção** (regex case-insensitive) — o validador
`scripts/validate_md_canonical.py` reporta warning se prosa casa o regex
mas o playbook não está declarado.

| Slug | Keyword na prosa (regex) | Quando declarar |
|---|---|---|
| `flipper` | `feature flag\|flipper` | TC depende de toggle de feature flag |
| `super-admin` | `super.?admin\|tabela de preços\|contrato (vigente\|ativo)\|funcionalidade.*(habilitad\|desabilitad)` | TC altera contrato/funcionalidade via Super Admin |
| `trial` | `\btrial\b\|\bicp\b\|excluir informações\|sophia(tech)?` | TC roda em org Trial / valida exclusão Trial |
| `ambientes-adicionais` | `ambiente adicional\|tenant pareado\|sufixo.*aditional` | TC valida isolamento multi-tenant |
| `filtro-drawer` | `drawer\|filtrar\|filtros?\b` | Listagem com filtro via drawer Chakra |
| `toast-chakra` | `toast\|mensagem (de sucesso\|de erro\|exibida)` | TC valida toast Chakra |
| `switch-chakra` | `\bswitch\b\|ativar.*toggle\|desativar.*toggle` | TC interage com switch Chakra |
| `beforeunload` | `cancelar.*(altera\|edição)\|sair.*(altera\|wizard\|edição)\|fechar (modal\|wizard\|edição)` | TC clica "Cancelar" com form sujo |
| `perfil-switch` | `perfil (aluno\|gestor\|instrutor\|colaborador\|administrador)` | TC valida visão de perfil diferente |
| `cleanup-dados` | `\b(criar\|adicionar\|cadastrar)\b\|salvar.*novo\|inserir.*novo` | TC cria/altera estado persistente |

**Como o agent-at decide**: durante `/analyze-test`, para cada suíte, varrer
pré-condições + passos com os regex. Se casa, adicionar o playbook ao
frontmatter da suíte. Playbooks específicos de 1 TC vão no `**Playbooks adicionais**`.

## Catálogos condicionalmente obrigatórios

As seções de catálogo (CONTRACT.md §5) ficam **obrigatórias** se a prosa
das suítes mencionar a keyword correspondente. O validador reporta **erro**
quando detecta keyword sem catálogo correspondente preenchido.

| Catálogo | Keyword na prosa (regex) |
|---|---|
| `## Textos literais` | `toast\|mensagem (exibida\|de sucesso\|de erro)` |
| `## Modais relevantes` | `\bmodal\b\|\bdiálogo\b\|\bdialog\b` |
| `## Endpoints (referência)` | `\bendpoint\b\|\bPOST /\|\bGET /\|\bPATCH /\|\bDELETE /` |

`## Dados de teste` e `## Campos e validações` são opcionais (sem keyword
obrigatória) — preencher quando houver conteúdo relevante de `docs/`.

## Restrições v1 (CONTRACT.md v1)

- `executor` aceita **apenas** `playwright`. `api`/`db`/`pentest` ficam para V2
  quando os agentes correspondentes rodarem standalone.
- `type` aceita `ui`/`api`/`db`. `mixed` é reservado para V2 (validações
  secundárias).
- Tentar usar valor não-permitido dispara `ValueError` no parser
  (`md_canonical_parser.py`).

## Anti-patterns enforçados pelo validador

| Código | Anti-pattern | Severidade |
|---|---|---|
| A | Ações vagas ("verificar", "validar comportamento") | erro |
| B | Resultados sem objeto verificável ("sistema funciona") | erro |
| C | Combinar 2 ações num passo ("X e Y") | erro |
| D | Referenciar passo anterior ("repetir passo 3") | erro |
| E | Pré-condição citando trabalho de dev | erro |
| F | Hardcode de credenciais/orgIds reais | erro |
| G | Catálogo obrigatório vazio | erro |
| H | Nome de componente interno como asserção | erro |
| (sem código) | Pré-condição "previamente cadastrado" sem instrução de como criar | warning |
| (sem código) | Playbook sugerido por keyword mas não declarado | warning |

## Validação pós-geração — OBRIGATÓRIA antes de gerar derivados

Após escrever o arquivo, rodar 2 verificações **em sequência**:

### 1. Parse estrutural (`md_canonical_parser.py`)

Confirma que o YAML/Markdown está válido e que o schema mínimo bate:

```bash
python scripts/md_canonical_parser.py projects/<slug>/output/test-analysis.md > /tmp/parsed.json
```

Se falhar com `ValueError`, o MD tem erro de schema (executor inválido, type
inválido, frontmatter faltando, passo sem `→`, etc.). Corrigir antes de
prosseguir.

### 2. Validação semântica (`validate_md_canonical.py`)

Detecta anti-patterns A-H + catálogos faltantes + playbooks faltantes:

```bash
python scripts/validate_md_canonical.py projects/<slug>/output/test-analysis.md
```

Saída esperada:
- **0 erros, 0 warnings** → AT pronta para gerar derivados (XMind + XML)
- **Erros** → CORRIGIR e re-validar. Não gerar derivados com erros pendentes.
- **Apenas warnings** → revisar caso a caso. Geralmente vale corrigir
  (especialmente playbook faltante).

Em modo `--strict`, warnings também bloqueiam:

```bash
python scripts/validate_md_canonical.py <md> --strict
```

### 3. Conferências manuais

Após o validador passar:

- Campo `totals` do frontmatter bate com o conteúdo real?
- Todas as suítes têm `suite`, `executor`, `preconditions`?
- Catálogos têm conteúdo coerente com o que está em `requisitos_extraidos.md`?

## Anti-patterns proibidos

Vide [agent-at/CLAUDE.md §8](../../../CLAUDE.md) e tabela §Anti-patterns
enforçados pelo validador acima.
- **H**: Nome de componente interno como asserção

## Output final

`projects/<slug>/output/test-analysis.md` válido conforme schema.

Após esta skill, invocar `/generate-xmind` e `/generate-xml-testlink` para
gerar os derivados.
