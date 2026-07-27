---
name: analyze-test
description: Orquestra o fluxo completo de Análise de Teste (AT). Lê documentação da pasta projects/<slug>/docs/, cria cenários e casos de teste, e gera 3 arquivos sincronizados em projects/<slug>/output/ — test-analysis.md (canônico, fonte de verdade), .xmind (visualização derivada) e .xml TestLink (importação manual derivada). Use quando o usuário solicitar criação de análise de teste para um projeto novo.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Análise de Teste (AT) — Fluxo Completo

Você é o agente de AT da Twygo. Siga este fluxo ao ser invocado.

**Convenção de progresso**: sempre que uma etapa abaixo tiver uma linha
`=== Fase N: ... ===`, escreva essa linha EXATA como texto da sua resposta
(sozinha, antes de agir na etapa) — não a omita e não parafraseie. Um
sistema de progresso ao vivo no `agent-ui` lê essas linhas.

> **Mudança importante (v1 do CONTRACT.md, 2026-05-18)**: o fluxo agora
> produz o **MD canônico** (`test-analysis.md`) como fonte de verdade,
> e gera XMind + XML TestLink como **derivados automáticos**. O fluxo
> manual de QA (importação no TestLink) continua 100% inalterado — só
> deixou de exigir export manual pelo XMind Desktop.

## Etapa 1: Identificação do projeto

=== Fase 1: Identificação do projeto ===

1. Identificar o slug do projeto:
   - Flag `--project <slug>` (se invocado por script)
   - Variável `PROJECT=<slug>`
   - Auto-detect: se há exatamente 1 projeto em `projects/`, usar ele
   - Erro explícito: listar projetos disponíveis e pedir slug
2. Verificar se `projects/<slug>/docs/` contém arquivos. Se vazia,
   solicitar ao usuário que deposite docs e aguardar.
3. Verificar se `template/template.xmind` existe (compartilhado entre
   todos os projetos). Se não, solicitar ao usuário.
4. Criar `projects/<slug>/output/` se não existir. Limpar arquivos
   anteriores se houver.

## Etapa 2: Leitura e interpretação dos documentos

=== Fase 2: Leitura de documentação ===

Invocar a skill `/read-docs` para ler e interpretar todos os arquivos da
pasta `projects/<slug>/docs/`. Ao final, um arquivo
`projects/<slug>/output/requisitos_extraidos.md` será gerado com todas as
informações consolidadas (intermediário — input do `generate-md-canonical`).

## Etapa 2.5: Recon de protótipo (CONTRACT.md v1.1: AUTOMÁTICA)

=== Fase 3: Recon de protótipo ===

A partir de `contract_version: 1.1`, esta etapa é **default automática
com fallback gracioso** (Opção C aprovada em 2026-05-22). Histórico
mostrou que opt-in não foi usado — projetos pularam recon e bugs reais
escaparam.

### Quando roda automaticamente

Se `agent-at/projects/<slug>/project.config.json` tem `prototypeUrl`
preenchido, a Etapa 2.5 invoca `/recon-prototipo` automaticamente entre
`read-docs` e o planejamento da estrutura.

### Fallback gracioso

Falhas conhecidas **não travam** o `/analyze-test`:

| Falha | Comportamento |
|---|---|
| MCP playwright não disponível | SKIP + warning "iniciar Claude Code dentro de agent-at/" |
| Protótipo exige login (Figma File privado) | SKIP + warning "login required" |
| Timeout > 30s | SKIP + warning "timeout" |
| `prototypeUrl` ausente | SKIP silencioso |

Em todos os casos, `/analyze-test` prossegue. AT terá `// REVISAR-FIGMA`
nos catálogos não cobertos.

### Override manual

- Setar `prototypeUrl: null` no `project.config.json`
- Rodar `/analyze-test --no-recon`

### Skill agora chamada `/recon-prototipo`

Renomeada de `/recon-visual` em v1.1 para refletir escopo (protótipos,
não Stage). Campo `figmaPrototype` continua aceito como alias de
`prototypeUrl` (compatibilidade com configs 1.0).

A skill produz `projects/<slug>/output/recon-prototipo.md` consumido
pelo `/generate-md-canonical` para preencher os catálogos do MD canônico
sem inferência. Status do recon (`complete`/`partial`/`skipped`) fica no
header do arquivo.

### Cache inteligente

Recon roda apenas se cache > 7 dias OU `prototypeUrl` mudou. Override:
flag `--refresh-recon`.

### Escopo

**Apenas protótipos**. **NÃO acessa Stage real** — recon de Stage fica
para `agent-playwright/.claude/skills/twygo-recon` durante execução.
Razão: ATs podem ser produzidas antes do Stage estar pronto; fonte
autoritativa de design é Discovery + protótipo.

### Divergência protótipo vs Discovery

Se o protótipo mostra algo diferente do que a Discovery descreve, o
protótipo é geralmente a fonte mais recente. Documentar a divergência
no recon-prototipo.md §6 e seguir o protótipo, ou perguntar ao QA Lead
se ambíguo.

### Em contract_version 1.0 (legado)

Etapa 2.5 continua **opt-in explícito** (não-automática). Manter
compatibilidade com ATs antigas. Skill ainda existe como
`recon-visual` (alias) ou `recon-prototipo`.

## Etapa 3: Definição da estrutura de suítes

=== Fase 4: Definição da estrutura ===

**Antes de propor a estrutura**: checar se
`projects/<slug>/output/estrutura-proposta.md` existe E tem
`aprovada: true` no frontmatter. Se sim, **pular todo o resto desta
etapa** — usar a estrutura de suítes descrita nesse arquivo tal como
está (não gerar outra, não perguntar nada) e ir direto pra Etapa 4. Se
não existir, ou existir mas `aprovada: false`/ausente, seguir o fluxo
normal abaixo.

Com base nos requisitos extraídos:

1. Se houver **planilha de quebra de atividades**: filtrar atividades do
   tipo "Execução de testes". Cada atividade = 1 suíte. Título da
   atividade = título da suíte.
2. Se **não houver planilha**: criar suítes baseadas nos agrupamentos
   lógicos da documentação.
3. Se houver **apenas uma atividade**: criar uma suíte única com todos
   os casos.
4. Títulos das suítes devem ser **descritivos**, sem prefixos como
   "[Projeto] QA X.X -".

Para cada suíte, decidir:
- **Executor primário** (`playwright` / `api` / `db` / `pentest`) baseado
  na natureza do conteúdo (UI = playwright; endpoints REST = api;
  validações de BD = db; segurança = pentest; misto = playwright + valida
  ções secundárias futuras)
- **Playbooks Twygo** aplicáveis (lista canônica no [CONTRACT.md §6](../../../../CONTRACT.md))
- **Org alvo** (`principal` / `secundario` / `trial-<projeto>` etc.)
- **Pré-condições** (estado de ambiente, dados, feature flags, perfil)

Se estiver rodando interativamente (sessão normal do Claude Code, não
headless): apresentar estrutura ao usuário e perguntar se deseja ajustar
antes de prosseguir. Se rodando headless (via `claude -p`, sem humano na
sessão): gravar a estrutura decidida em
`projects/<slug>/output/estrutura-proposta.md` com `aprovada: false` —
antes de gravar, **leia `../analyze-test-plan/SKILL.md`, Etapa 4, e
reproduza EXATAMENTE o mesmo formato de frontmatter e corpo descrito
lá** — os campos `aprovada`, `project`, `generated_at`, `docs_lidos`,
`docs_pulados` cada um em sua própria linha, sem comentários ou texto
extra na linha do `aprovada` (um parser downstream depende de um match
exato dessa linha pra aprovar a proposta depois). Informar em texto que
a estrutura foi gravada e PARAR aqui — não prosseguir pra Etapa 4 sem
aprovação. Termine sua resposta imediatamente após informar isso — não
chame nenhuma ferramenta (Read/Write/Edit/Bash/Glob/Grep) depois de
gravar o arquivo e escrever a mensagem, e não prossiga para a Etapa 4
nesta mesma sessão.

## Etapa 4: Criação dos casos de teste

=== Fase 5: Criação dos casos de teste ===

Para cada suíte, criar casos de teste seguindo as convenções da skill
`twygo-qa-conventions` (carregada automaticamente). Consultar
`projects/<slug>/output/requisitos_extraidos.md` para textos literais e
regras de negócio.

**Regra fundamental**: NÃO se limitar apenas ao que está na coluna
"descrição" da planilha. A análise deve ser COMPLETA, ROBUSTA e cobrir
TODOS os cenários possíveis, incluindo cenários de falha e tentativas de
forçar erros.

**Compatibilidade com agentes downstream**: os casos serão executados pelo
`agent-playwright` (e futuramente `agent-api`, `agent-db`, `agent-pentest`).
Antes de fechar cada caso, garantir que:
- Toda AÇÃO usa verbo canônico ("Clicar no botão 'X'", "Preencher o campo 'X' com 'Y'")
- Todo RESULTADO ESPERADO é assertável (texto literal entre aspas + elemento alvo)

Ver §8 da skill `twygo-qa-conventions` e CONTRACT.md §4.4-4.6 para detalhes.

Para exemplos de casos bem escritos, consultar:
- [examples/ui_example.md](examples/ui_example.md)
- [examples/api_example.md](examples/api_example.md)
- [examples/bloqueio_example.md](examples/bloqueio_example.md)

## Etapa 5: Geração do MD canônico (fonte de verdade)

=== Fase 6: Geração do MD canônico ===

Invocar a skill `/generate-md-canonical` para emitir
`projects/<slug>/output/test-analysis.md` seguindo o schema do CONTRACT.md.

**Esta etapa é a mais importante**: o MD canônico é o artefato consumido
pelo `agent-playwright` (e agentes futuros). XMind e XML são derivados —
se o MD estiver errado, todos os derivados ficam errados.

### 5.1 Validação obrigatória antes de prosseguir

Após emitir o MD, **obrigatoriamente** rodar:

```bash
# 1. Validação estrutural (schema YAML/MD)
python scripts/md_canonical_parser.py projects/<slug>/output/test-analysis.md > /tmp/parsed.json

# 2. Validação semântica (anti-patterns + catálogos + playbooks)
python scripts/validate_md_canonical.py projects/<slug>/output/test-analysis.md
```

- Se o **parser** falhar (`ValueError`): erro de schema. Corrigir e re-rodar.
- Se o **validador** reportar **erros**: anti-pattern A-H ou catálogo
  obrigatório faltando. Corrigir e re-rodar.
- Se houver apenas **warnings**: revisar (geralmente vale corrigir, ex:
  playbook faltante, seed dependency).

**NÃO prosseguir para Etapa 6 com erros pendentes** — os derivados ficarão
com os mesmos problemas, e o agent-playwright marcará `// REVISAR` ou
`test.fixme` durante execução.

## Etapa 6: Geração dos derivados (paralelo)

=== Fase 7: Geração de XMind e XML TestLink ===

Invocar em sequência (não importa ordem entre eles):

1. `/generate-xmind` — gera `projects/<slug>/output/Analise_Teste_<NomeLegivel>.xmind`
   via script Python `scripts/md_to_xmind.py`
2. `/generate-xml-testlink` — gera `projects/<slug>/output/Analise_Teste_<NomeLegivel>.xml`
   via script Python `scripts/md_to_testlink.py`

Ambos derivados são regerados sempre que o MD canônico muda.

## Etapa 7: Validação cruzada

=== Fase 8: Validação cruzada ===

Confirmar que os 3 arquivos batem entre si:

```bash
# Contagem de testcases — deve ser igual em todos
grep -c "^## TC" projects/<slug>/output/test-analysis.md
grep -c "<testcase " projects/<slug>/output/Analise_Teste_*.xml
# XMind não é trivial de contar sem parser — confiar no print do generate-xmind
```

## Etapa 8: Entrega

=== Fase 9: Entrega ===

Informar ao usuário:
- Caminhos dos 3 arquivos gerados
- Quantidade total de suítes e casos de teste
- Distribuição de casos por suíte (tabela)
- Principais cenários cobertos
- **Lembrete**: para o fluxo manual TestLink, importar
  `Analise_Teste_<NomeLegivel>.xml` no TestLink Web. Para automação,
  copiar `test-analysis.md` para `agent-playwright/projects/<slug>/inputs/`.

## Checklist de qualidade (verificar ANTES de entregar)

### Conteúdo
- [ ] Todas as suítes têm títulos descritivos (sem prefixos)
- [ ] Todos os TCs têm `**Prioridade**`, `**Tipo**`, `### Objetivo`, `### Passos`
- [ ] Frontmatter de cada suíte declara `executor` e `preconditions`
- [ ] Playbooks Twygo declarados quando aplicáveis (flipper, super-admin, trial, etc.)
- [ ] Nenhuma pré-condição referencia atividade de Dev
- [ ] Resultados esperados contêm textos literais da documentação
- [ ] Cenários de falha incluídos (campos vazios, valores inválidos, limites)
- [ ] Cenários de componentes detalhados (tabelas, modais, switches)
- [ ] Toast messages com textos exatos
- [ ] Cenários padrão (Mobile, Logs, Banco histórico, Feature flag) quando UI

### Estrutura
- [ ] `test-analysis.md` parseável pelo `md_canonical_parser.py` sem erro
- [ ] `Analise_Teste_*.xmind` gerado a partir do MD (não de dict hardcoded)
- [ ] `Analise_Teste_*.xml` gerado a partir do MD (não manual)
- [ ] Catálogos (`## Dados de teste`, `## Textos literais`, `## Modais relevantes`) preenchidos
- [ ] `contract_version: 1.0` no frontmatter
- [ ] `at_version` incrementado se for regeração

### Segurança
- [ ] Nenhum host real (`<host>.twygoead.com`) hardcoded no MD
- [ ] Nenhum orgId numérico real no MD (usar chaves `principal`/`secundario`)
- [ ] Nenhum email/credencial no MD
