---
name: analyze-test
description: Orquestra o fluxo completo de Análise de Teste (AT). Lê documentação da pasta projects/<slug>/docs/, cria cenários e casos de teste, e gera 3 arquivos sincronizados em projects/<slug>/output/ — test-analysis.md (canônico, fonte de verdade), .xmind (visualização derivada) e .xml TestLink (importação manual derivada). Use quando o usuário solicitar criação de análise de teste para um projeto novo.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Análise de Teste (AT) — Fluxo Completo

Você é o agente de AT da Twygo. Siga este fluxo ao ser invocado.

> **Mudança importante (v1 do CONTRACT.md, 2026-05-18)**: o fluxo agora
> produz o **MD canônico** (`test-analysis.md`) como fonte de verdade,
> e gera XMind + XML TestLink como **derivados automáticos**. O fluxo
> manual de QA (importação no TestLink) continua 100% inalterado — só
> deixou de exigir export manual pelo XMind Desktop.

## Etapa 1: Identificação do projeto

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

Invocar a skill `/read-docs` para ler e interpretar todos os arquivos da
pasta `projects/<slug>/docs/`. Ao final, um arquivo
`projects/<slug>/output/requisitos_extraidos.md` será gerado com todas as
informações consolidadas (intermediário — input do `generate-md-canonical`).

## Etapa 3: Definição da estrutura de suítes

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

Apresentar estrutura ao usuário e perguntar se deseja ajustar antes de
prosseguir.

## Etapa 4: Criação dos casos de teste

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

Invocar a skill `/generate-md-canonical` para emitir
`projects/<slug>/output/test-analysis.md` seguindo o schema do CONTRACT.md.

**Esta etapa é a mais importante**: o MD canônico é o artefato consumido
pelo `agent-playwright` (e agentes futuros). XMind e XML são derivados —
se o MD estiver errado, todos os derivados ficam errados.

## Etapa 6: Geração dos derivados (paralelo)

Invocar em sequência (não importa ordem entre eles):

1. `/generate-xmind` — gera `projects/<slug>/output/Analise_Teste_<NomeLegivel>.xmind`
   via script Python `scripts/md_to_xmind.py`
2. `/generate-xml-testlink` — gera `projects/<slug>/output/Analise_Teste_<NomeLegivel>.xml`
   via script Python `scripts/md_to_testlink.py`

Ambos derivados são regerados sempre que o MD canônico muda.

## Etapa 7: Validação cruzada

Confirmar que os 3 arquivos batem entre si:

```bash
# Contagem de testcases — deve ser igual em todos
grep -c "^## TC" projects/<slug>/output/test-analysis.md
grep -c "<testcase " projects/<slug>/output/Analise_Teste_*.xml
# XMind não é trivial de contar sem parser — confiar no print do generate-xmind
```

## Etapa 8: Entrega

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
