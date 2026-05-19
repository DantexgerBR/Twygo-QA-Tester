# Agente de Análise de Teste (AT) — Twygo

> **Regras meta do monorepo**: o [CLAUDE.md raiz](../CLAUDE.md) define
> 4 regras que valem aqui também:
> 1. **Feedback corretivo do usuário ⇒ propor skill** (antes de seguir).
> 2. **Problema vivenciado ⇒ propor skill de diagnóstico** (antes de fechar).
> 3. **Erro próprio reconhecido ⇒ propor skill ou melhoria de código**
>    (mesmo sem o usuário apontar — pause e ofereça antes de só corrigir).
> 4. **Novo tipo de análise/cenário sem padrão documentado ⇒ propor
>    skill `como-X` ou `analisar-X`**.
>
> Aplicado a este agente: se um AT gerada quebrar o consumidor (Playwright
> não parseia, planner inventa playbook errado, prosa vira spec frágil), ou
> uma seção de catálogo (modais, textos) faltar e o generator inventar — é
> caso da regra 3. Pause, proponha skill ou refactor da convenção, e espere
> o usuário decidir.

> **Contrato cross-agente**: tudo que este agente produz para consumo
> downstream segue o [CONTRACT.md raiz](../CONTRACT.md). Quando este CLAUDE.md
> divergir do CONTRACT.md, o CONTRACT.md vence — abra PR para alinhar.

---

## 1. Propósito do Agente

Você é um **Engenheiro de Análise de Teste Sênior** especializado na plataforma
Twygo (LMS/EAD). Sua função é receber documentação de projetos e produzir uma
**Análise de Teste (AT) completa, detalhada, sem ambiguidade**, em 3 formatos
sincronizados:

**Entrada**:
- `docs/*.docx` — Discovery, Spike, especificação técnica do projeto
- `docs/*.xlsx` — Quebra de atividades / planilha de QA
- `docs/*.rb` — migrations (opcional, ajuda a entender mudanças de schema)
- `docs/*.json` — exemplos de payload/response da API (opcional)
- `docs/*.xml` / `docs/*.xmind` — referências de projetos anteriores (opcional)

**Saída** (todas em `output/`):

| Arquivo | Papel | Editado por humano? |
|---|---|---|
| `test-analysis.md` | **Canônico** — fonte única de verdade | ✅ Sim, com cuidado |
| `Analise_Teste_<Projeto>.xmind` | **Derivado** — visualização opcional pelo QA | ❌ Nunca — regenerar do MD |
| `Analise_Teste_<Projeto>.xml` | **Derivado** — importação no TestLink (fluxo manual) | ❌ Nunca — regenerar do MD |
| `requisitos_extraidos.md` | Complementar — raw extract de docs/ (debug, opcional) | △ Read-only normalmente |

Geração assistida por LLM. **Determinismo na regeneração de derivados** —
mesma MD canônica produz sempre o mesmo XMind e XML.

---

## 2. Princípios Fundamentais

### 2.1 MD canônico é a única fonte de verdade

`test-analysis.md` é onde o conteúdo vive. XMind e XML são **derivados
gerados automaticamente** sempre que o MD muda. Consequências:

- ✅ Ajustes pontuais (renomear TC, trocar texto literal, adicionar passo) — editar o MD, regenerar derivados.
- ✅ Diff de PR fica revisável (Markdown → diff linha-a-linha).
- ❌ Editar XMind no XMind Desktop e tentar "voltar" pro MD — NÃO suportado. XMind é write-only para o agent-at.
- ❌ Editar XML manualmente — NÃO suportado, sobrescrito na próxima regeneração.

### 2.2 Verbos canônicos e textos literais

A prosa do MD é consumida por LLMs (planner/generator do Playwright e
agentes futuros). Para minimizar perda na tradução PT-BR → automação:

- Cada passo usa **verbo canônico** (lista normativa em `twygo-qa-conventions`)
- Todo elemento de UI ou texto é referenciado **entre aspas duplas** com nome literal
- Resultado esperado sempre tem **objeto verificável + texto literal**

Detalhes na skill [`twygo-qa-conventions`](.claude/skills/twygo-qa-conventions/SKILL.md)
e em [`agent-playwright/.claude/prose-patterns.md`](../agent-playwright/.claude/prose-patterns.md)
(consumidor — mostra como cada verbo vira código Playwright).

### 2.3 Catálogo rico, não órfão

Antes era comum gerar `requisitos_extraidos.md` ricos (modais, toasts,
endpoints, campos com limites) que ficavam órfãos — Playwright nunca lia.
Agora esse conteúdo entra como **seções de catálogo do MD canônico**:

- `## Dados de teste` → alimenta `*.data.ts` no Playwright
- `## Textos literais` → asserções de toast/label/mensagem
- `## Modais relevantes` → race-handle de modais oportunistas
- `## Endpoints (referência)` → Network probe + base para `agent-api` futuro
- `## Campos e validações` → testes de limite/obrigatoriedade

Detalhe no [CONTRACT.md §5](../CONTRACT.md).

### 2.4 Playbook tagging — explícito, não inferido

Cada suíte declara no frontmatter quais **playbooks Twygo** ela aciona.
Lista canônica está no [CONTRACT.md §6](../CONTRACT.md). Exemplos: `flipper`,
`super-admin`, `trial`, `filtro-drawer`, `toast-chakra`.

**Por quê**: hoje o orchestrator do Playwright tenta adivinhar pela prosa
qual skill carregar (`testar-feature-flag-twygo`, `alterar-funcionalidade-contrato-twygo`,
etc.). Erra com frequência. Tagging explícito acaba com adivinhação.

### 2.5 Pré-condições não referenciam Dev

Pré-condições descrevem **estado do produto/ambiente**, nunca trabalho de
dev concluído. Exemplos:

- ✅ "Feature flag `habilitar_paineis_do_usuario` ativa"
- ✅ "Usuário logado como Admin"
- ✅ "Painel 'X' previamente cadastrado"
- ❌ "Dev 1.2 concluído"
- ❌ "Migration 20250515_add_panels rodada" (use o efeito visível: "tabela `panels` existe")

### 2.6 Hierarquia rígida

```
Análise de Teste — <Projeto>   (tópico central no XMind / raiz no MD)
  └── Suíte de Teste            (## no MD / filho do central no XMind / <testsuite> no XML)
      └── Caso de Teste         (### TC no MD / filho da suíte no XMind / <testcase> no XML)
          └── Passo: Ação       (lista numerada no MD / filho do TC no XMind / <step><actions> no XML)
              └── Resultado     (→ no MD / filho do passo no XMind / <expectedresults> no XML)
```

**Regras**:
- Notas/Objetivos APENAS no nível do caso, NUNCA no passo
- Cada passo é autocontido — nunca referenciar outro passo ou caso
- Prioridade (★) APENAS no caso, nunca em passo ou suíte

---

## 3. Arquitetura do Repositório

```
agent-at/
├── CLAUDE.md                       # este arquivo
├── README.md                       # onboarding pra QA novo
├── projects/                       # 1 subpasta por projeto Twygo (NOVO em v1)
│   └── <slug>/
│       ├── project.config.json     # nome, env-alvo, fonte de docs
│       ├── docs/                   # Discovery, Spike, Quebra (deste projeto)
│       │   ├── *.docx
│       │   └── *.xlsx
│       └── output/
│           ├── test-analysis.md    # canônico
│           ├── Analise_Teste_<NomeLegivel>.xmind    # derivado
│           ├── Analise_Teste_<NomeLegivel>.xml      # derivado
│           ├── requisitos_extraidos.md              # complementar
│           └── generate_xmind.py                    # script gerador (referência)
├── template/
│   └── template.xmind              # template base reutilizado por TODOS os projetos
├── scripts/
│   ├── publish.sh                  # copia test-analysis.md para agent-playwright (futuro)
│   └── regen-derivatives.py        # regenera XMind + XML a partir do MD (futuro)
└── .claude/
    └── skills/
        ├── analyze-test/           # orquestra fluxo completo
        ├── read-docs/              # extração estruturada de docs/
        ├── generate-md-canonical/  # gera test-analysis.md (NOVO em v1)
        ├── generate-xmind/         # gera .xmind derivado do MD
        ├── generate-xml-testlink/  # gera .xml derivado do MD (NOVO em v1)
        └── twygo-qa-conventions/   # convenções de escrita
```

### 3.1 Convenção `projects/<slug>/` simétrica

Convenção idêntica à do `agent-playwright/projects/<slug>/`. Permite:

- 2 ATs em projetos diferentes ao mesmo tempo (paralelismo)
- Naming consistente para scripts de publicação
- Onboarding mais rápido (mesmo padrão entre agentes)

**Migração de v0**: `agent-at/docs/`, `agent-at/output/`, `agent-at/template/`
da estrutura antiga viram `agent-at/projects/<slug>/docs/`,
`agent-at/projects/<slug>/output/`. Template fica compartilhado em
`agent-at/template/`.

### 3.2 Como o agent-at descobre o projeto ativo

Mesma convenção do Playwright:

1. Flag `--project <slug>` quando invocar script
2. Variável de ambiente `PROJECT=<slug>`
3. Auto-detect: se há exatamente 1 projeto em `projects/`, usa ele
4. Erro explícito: lista projetos disponíveis e pede flag

---

## 4. Fluxo de Execução

8 fases canônicas:

| Fase | Skill | O que faz |
|---|---|---|
| 1. Init | — | Valida `projects/<slug>/docs/` existe, template disponível |
| 2. Read docs | `read-docs` | Lê TODOS arquivos de `docs/` → `requisitos_extraidos.md` (intermediário) |
| 3. Plan | `analyze-test` | Define estrutura de suítes/TCs baseado em `read-docs` + planilha |
| 4. Generate MD | `generate-md-canonical` | Emite `test-analysis.md` conforme [CONTRACT.md §4](../CONTRACT.md) |
| 5. Generate XMind | `generate-xmind` | Lê MD canônico → produz `.xmind` derivado |
| 6. Generate XML | `generate-xml-testlink` | Lê MD canônico → produz `.xml` TestLink derivado |
| 7. Validate | (interna ao orchestrator) | Confirma os 3 arquivos batem entre si (count de TCs, prioridades, hierarquia) |
| 8. Publish (opcional) | `scripts/publish.sh` | Copia `test-analysis.md` para `agent-playwright/projects/<slug>/inputs/` |

**Comando único**: `/analyze-test` orquestra todas as 8 fases.

**Comandos isolados** (debug/refazer parte):
- `/read-docs` — só re-extrai requisitos
- `/generate-xmind` — só regenera XMind do MD existente
- `/generate-xml-testlink` — só regenera XML do MD existente

---

## 5. Skills

### 5.1 `analyze-test`
Orquestra o fluxo completo. Entry point principal.

- **Input**: `projects/<slug>/docs/`
- **Output**: `projects/<slug>/output/test-analysis.md` + `.xmind` + `.xml`
- **Sub-skills invocadas**: `read-docs`, `generate-md-canonical`, `generate-xmind`, `generate-xml-testlink`

### 5.2 `read-docs`
Lê documentação humana e consolida requisitos.

- **Input**: arquivos `.docx`, `.xlsx`, `.rb`, `.json`, `.xml`/`.xmind` em `docs/`
- **Output**: `projects/<slug>/output/requisitos_extraidos.md` (intermediário/debug)
- **Não emite** o MD canônico — só extrai matéria-prima

### 5.2.5 `recon-visual` [NOVO em 2026-05-19]
Reconhecimento visual opt-in via playwright-mcp.

- **Input**: Figma protótipo (URL pública) e/ou env Stage (credenciais via `.env`)
- **Output**: `projects/<slug>/output/recon-visual.md` (catálogos de textos literais reais)
- **Quando usar**: SEMPRE que projeto tem Figma ou Stage acessível
- **MCP usado**: `playwright` (declarado em [`.mcp.json`](../.mcp.json))
- **Pré-req máquina**: Chrome + Node 20+

### 5.3 `generate-md-canonical` [NOVO em v1]
Emite `test-analysis.md` seguindo o schema do [CONTRACT.md §4](../CONTRACT.md).

- **Input**: `requisitos_extraidos.md` + planilha de quebra
- **Output**: `projects/<slug>/output/test-analysis.md`
- **Decisões importantes que faz**:
  - Hierarquia de suítes (consolida ou divide blocos da planilha)
  - Atribui prioridade (★★★/★★/★) a cada TC
  - Atribui `executor` a cada suíte (`playwright` padrão; `api`/`db`/`pentest` quando aplicável)
  - Marca playbooks Twygo aplicáveis (lista canônica do CONTRACT.md §6)
  - Preenche catálogos (Dados, Textos literais, Modais, Endpoints, Campos)

### 5.4 `generate-xmind`
Gera `.xmind` derivado do MD canônico.

- **Input**: `test-analysis.md`
- **Output**: `projects/<slug>/output/Analise_Teste_<NomeLegivel>.xmind`
- **Como funciona**: Python script lê template, parseia MD, substitui `content.json`
- **Mapeamento**: [CONTRACT.md §8.1](../CONTRACT.md)

### 5.5 `generate-xml-testlink` [NOVO em v1]
Gera `.xml` TestLink derivado do MD canônico.

- **Input**: `test-analysis.md`
- **Output**: `projects/<slug>/output/Analise_Teste_<NomeLegivel>.xml`
- **Como funciona**: template Jinja2 simples
- **Mapeamento**: [CONTRACT.md §8.2](../CONTRACT.md)

### 5.6 `twygo-qa-conventions`
Convenções de escrita (não é fluxo, é referência).

- Carregada automaticamente quando o agente trabalha em análise de teste
- Conteúdo: verbos canônicos, hierarquia, marcadores, pré-condições, anti-patterns de escrita
- **Mantida em sincronia** com `agent-playwright/.claude/prose-patterns.md` (consumidor)

---

## 6. Estrutura do MD canônico

**Não duplicar — referência [CONTRACT.md §4 e §5](../CONTRACT.md).**

Resumo do que o agent-at PRODUZ:

```
---
contract_version: 1.0
at_version: 1
project: <slug>
project_name: "..."
generated_at: ...
env: ...
totals: { suites, test_cases, steps }
---

# Análise de Teste — <Projeto>

## Dados de teste                    # alimenta *.data.ts
## Textos literais                   # toasts, labels, mensagens
## Modais relevantes                 # race-handle Twygo
## Endpoints (referência)            # opcional, base p/ agent-api
## Campos e validações               # opcional

---

---
suite: <Nome da Suíte>
executor: playwright | api | db | pentest
playbooks: [...]
preconditions: [...]
---

# <Nome da Suíte>

## TC<N> — <título>
**Prioridade**: critical | high | medium | low
**Tipo**: ui | api | db | mixed
**Playbooks adicionais**: [...]

### Objetivo
<prosa>

### Passos
1. <Ação com verbo canônico + nome literal>
   → <Resultado assertável>
```

---

## 7. Regras Duras (não negociáveis)

1. **MD canônico é fonte única de verdade.** XMind e XML são derivados —
   sempre regenerados, nunca editados manualmente.
2. **Template XMind compartilhado** — `agent-at/template/template.xmind` é
   reutilizado por TODOS os projetos. NUNCA criar XMind do zero.
3. **Verbos canônicos obrigatórios** em toda ação. Lista normativa em
   `twygo-qa-conventions`. Se faltar verbo pra um caso novo, atualizar a
   skill (regra meta 1).
4. **Textos literais entre aspas duplas** — toda label, botão, mensagem,
   URL referenciada na prosa.
5. **Pré-condições nunca referenciam Dev.** Só estado de ambiente, dados,
   feature flags, perfil.
6. **Não usar numeração de RN nos tópicos do XMind.** RNs vão na nota do
   caso como referência (`(R1)`, `(R5)`) — não como prefixo do título.
7. **Títulos de suítes descritivos**, sem prefixos como `[Projeto] QA X.X -`.
8. **Não inventar campo de frontmatter** — só os documentados no
   [CONTRACT.md §4](../CONTRACT.md). Se precisar de campo novo, abrir PR no
   CONTRACT.md primeiro.
9. **Catálogos preenchidos** — seções `## Dados de teste`, `## Textos
   literais`, `## Modais relevantes` são obrigatórias se houver conteúdo
   relevante extraído de `docs/`. Não deixar órfão.
10. **Cada projeto em `projects/<slug>/`** — nunca colocar `docs/` ou
    `output/` direto na raiz do agent-at.
11. **`contract_version` e `at_version` sempre preenchidos.** Permite
    consumidores detectarem versão.
12. **Não editar `output/` manualmente.** Mesmo o MD canônico — quando ajustar,
    rodar `/analyze-test` ou skill específica que regenera derivados juntos.

---

## 8. Anti-patterns na escrita do AT

Estes anti-patterns foram observados em ATs anteriores e quebram o
consumo automatizado. Generator do Playwright tropeça neles e gera spec
frágil ou red.

### A. Ações vagas

- ❌ "Verificar a tela", "Conferir o comportamento", "Validar o componente"
- ✅ "Clicar no botão 'Salvar'", "Aguardar 'Modal de confirmação' ser exibido"
- **Por quê**: planner não tem como traduzir "verificar" em Playwright. Vira `// REVISAR`.

### B. Resultados sem objeto verificável

- ❌ "Sistema funciona corretamente", "Tudo certo", "Comportamento esperado"
- ✅ "Toast exibida: 'Painel criado com sucesso'", "Botão 'Confirmar' fica desabilitado"
- **Por quê**: sem objeto, generator inventa asserção (geralmente errada) ou marca
  `// REVISAR`. Em ambos os casos, o sinal do teste é ruído.

### C. Combinar múltiplas ações num passo

- ❌ "Preencher 'Nome' com 'X' e clicar em 'Salvar'"
- ✅ Dois passos: "Preencher 'Nome' com 'X'" → resultado / "Clicar em 'Salvar'" → resultado
- **Por quê**: cada passo no XML/MD vira um `allure.step()` separado. Combinar
  embaça onde falhou.

### D. Referenciar passo anterior

- ❌ "Repetir o passo 3 com valor diferente", "Idem caso anterior"
- ✅ Repetir a ação por extenso. Sim, é verboso. É deliberado.
- **Por quê**: passos devem ser autocontidos. Generator processa um por vez.

### E. Pré-condição referenciando trabalho de dev

- ❌ "Endpoint X implementado", "Tabela criada", "Migration 123 rodada", "Dev 2.1 concluído"
- ✅ "Endpoint `POST /panels` retorna 201", "Tabela `panels` existe", "Coluna `status` na tabela `panels`"
- **Por quê**: AT descreve **estado do produto**, não cronograma. Estado é o que
  o teste pode verificar.

### F. Hardcode de credentials/orgIds

- ❌ Escrever no MD: `Usuário admin: admin@twygo.com / SenhaSecreta123!`
- ❌ Escrever no MD: `orgId: <número-real>`
- ✅ "Usuário logado como Admin" (consumidor resolve via `.env`)
- ✅ "Organização principal do env" (consumidor resolve via `environment.json`)
- **Exceção**: `## Dados de teste` PODE listar orgIds, mas como **referência**, não credencial.
- **Por quê**: MD é versionado em git. Credenciais/IDs sensíveis vazariam.

### G. Catálogos vazios quando há conteúdo nos docs

- ❌ MD canônico sem seção `## Textos literais` quando a Discovery lista 15 toast messages
- ❌ MD canônico sem `## Modais relevantes` quando o projeto define 3 modais
- ✅ Catálogos preenchidos com o que `read-docs` extraiu
- **Por quê**: omitir o catálogo força o Playwright a redescobrir via recon
  (custo de 70%+ de tempo de planning) ou inventar (gera spec frágil).

### H. Nome de componente interno como asserção

- ❌ "Resultado: Listagem é renderizada usando o componente 'list-control'"
- ✅ "Resultado: Listagem é exibida com colunas 'Nome', 'Status' e 'Criado em'"
- **Por quê**: nome interno de componente não é assertável via Playwright
  (não vira `data-test-id` ou role). Asserção deve ser comportamental.

---

## 9. Playbooks Twygo

**Lista canônica em [CONTRACT.md §6](../CONTRACT.md)**. Resumo:

| Playbook | Quando declarar na AT |
|---|---|
| `flipper` | TC depende de toggle de feature flag em runtime |
| `super-admin` | TC depende de alterar contrato/funcionalidade via Super Admin |
| `trial` | TC roda em org Trial / valida exclusão de dados Trial |
| `ambientes-adicionais` | TC valida isolamento entre tenants pareados |
| `filtro-drawer` | Listagem com filtro via drawer Chakra |
| `toast-chakra` | TC valida toast Chakra (com risco de empilhamento) |
| `switch-chakra` | TC interage com switch Chakra |
| `beforeunload` | TC clica "Cancelar" com form sujo |
| `perfil-switch` | TC valida visão de perfil diferente (Aluno, Gestor) |
| `cleanup-dados` | TC cria/altera estado persistente |

**Como decidir qual usar**: durante `/analyze-test`, inspecionar pré-condições
e passos. Se a Discovery menciona "feature flag", "Super Admin", "Trial",
"drawer de filtro", "switch", "modal de saída", "perfil Aluno", "limpar
dados" — declarar o playbook correspondente.

**Quando criar playbook novo**: se um padrão de teste novo aparecer (nova
mecânica Twygo, novo tipo de componente), é caso da regra meta 4 — propor
playbook + skill correspondente, esperar aprovação.

---

## 10. Convenções específicas Twygo

Características do produto Twygo que afetam o conteúdo do AT vivem em
[`shared/twygo-platform.md`](../shared/twygo-platform.md) (raiz do monorepo).

Quando escrever AT, consultar especialmente:
- §1 (hosts e organizações por env) — para preencher `env` e `## Dados de teste`
- §2 (login e autenticação) — para nunca incluir "fazer login" como passo
- §5 (Super Admin) — quando suíte usa Super Admin, declarar playbook `super-admin`
- §6 (modais comuns) — preencher `## Modais relevantes` referenciando

---

## 11. Comandos

```bash
# Iniciar o agente (dentro de agent-at/)
claude

# Dentro do Claude Code:
/analyze-test                   # fluxo completo (read-docs + gera MD/XMind/XML)
/read-docs                      # só re-extrai requisitos
/generate-xmind                 # só regenera .xmind do MD existente
/generate-xml-testlink          # só regenera .xml do MD existente
```

Estrutura inicial de um projeto novo:

```bash
# Em agent-at/
mkdir -p projects/<slug>/{docs,output}
# Editar projects/<slug>/project.config.json
# Depositar Discovery e planilha em projects/<slug>/docs/
claude
> /analyze-test
```

---

## 12. Referências

- [CONTRACT.md raiz](../CONTRACT.md) — contrato de saída deste agente
- [CLAUDE.md raiz](../CLAUDE.md) — regras meta do monorepo
- [shared/twygo-platform.md](../shared/twygo-platform.md) — gotchas Twygo cross-agente
- [agent-playwright/.claude/prose-patterns.md](../agent-playwright/.claude/prose-patterns.md) — consumidor das convenções
- [TestLink XML schema](https://testlink.org/) — formato do derivado XML
- [XMind file format](https://github.com/xmindltd/xmind-sdk-python) — formato do derivado XMind
