---
name: analyze-test-plan
description: Primeira metade do fluxo de Análise de Teste (AT) — lê documentação do projeto, roda recon de protótipo (se configurado) e propõe a estrutura de suítes, SEM escrever casos de teste ainda. Grava projects/<slug>/output/estrutura-proposta.md pra revisão humana antes de continuar com /analyze-test. Use quando o agent-ui disparar a Fase 1 (proposta de estrutura) do fluxo headless de AT.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Análise de Teste (AT) — Fase 1: Proposta de Estrutura

Você é o agente de AT da Twygo. Esta skill faz a PRIMEIRA METADE do fluxo
completo de `/analyze-test` — pára depois de propor a estrutura de suítes,
SEM escrever casos de teste. Alguém (humano, via o agent-ui) vai revisar
essa proposta antes de continuar com `/analyze-test`, que completa o resto.

**Convenção de progresso**: sempre que uma etapa abaixo tiver uma linha
`=== Fase N: ... ===`, escreva essa linha EXATA como texto da sua resposta
(sozinha, antes de agir na etapa) — não a omita e não parafraseie. Um
sistema de progresso ao vivo no `agent-ui` lê essas linhas.

## Etapa 1: Identificação do projeto

=== Fase 1: Identificação do projeto ===

1. Identificar o slug do projeto:
   - Flag `--project <slug>` (se invocado por script)
   - Variável `PROJECT=<slug>`
   - Auto-detect: se há exatamente 1 projeto em `projects/`, usar ele
   - Erro explícito: listar projetos disponíveis e parar (não adianta
     pedir input interativamente — esta skill roda headless)
2. Verificar se `projects/<slug>/docs/` contém arquivos. Se vazia, PARAR
   e informar que precisa depositar docs antes de continuar.
3. Criar `projects/<slug>/output/` se não existir.

## Etapa 2: Leitura e interpretação dos documentos

=== Fase 2: Leitura de documentação ===

Invocar a skill `/read-docs` pra ler e interpretar todos os arquivos de
`projects/<slug>/docs/`. Ao final, `projects/<slug>/output/requisitos_extraidos.md`
terá todas as informações consolidadas.

## Etapa 2.5: Recon de protótipo (se configurado)

=== Fase 3: Recon de protótipo ===

Igual à Etapa 2.5 do `/analyze-test` completo (ver
`../analyze-test/SKILL.md`): se `project.config.json` tem
`prototypeUrl`/`figmaPrototype` preenchido, invocar `/recon-prototipo`.
Fallback gracioso se MCP indisponível, login exigido ou timeout — NUNCA
travar esta skill por causa do recon (rodando headless, é ainda mais
provável que o MCP não esteja disponível — trate como skip normal).

## Etapa 3: Proposta de estrutura de suítes

=== Fase 4: Proposta de estrutura ===

Com base nos requisitos extraídos (e no recon, se houver):

1. Se houver planilha de quebra de atividades: filtrar atividades do tipo
   "Execução de testes". Cada atividade = 1 suíte.
2. Se não houver planilha: criar suítes baseadas nos agrupamentos lógicos
   da documentação.
3. Se houver apenas uma atividade: criar uma suíte única.
4. Títulos das suítes devem ser descritivos, sem prefixos como
   "[Projeto] QA X.X -".

Para cada suíte, decidir (mesmos critérios do CONTRACT.md §6 usado pelo
`/analyze-test` completo):
- **Executor primário** (`playwright`/`api`/`db`/`pentest`)
- **Playbooks Twygo** aplicáveis
- **Org alvo** (`principal`/`secundario`/`trial-<projeto>` etc.)
- **Pré-condições** (estado de ambiente, dados, feature flags, perfil)

**NÃO escrever casos de teste individuais nesta fase** — só a estrutura.

## Etapa 4: Gravar a proposta

=== Fase 5: Gravando proposta ===

Gravar `projects/<slug>/output/estrutura-proposta.md` neste formato exato
(o campo `aprovada` sempre começa `false` — vira `true` quando o QA aprovar
pelo agent-ui):

```markdown
---
aprovada: false
project: <slug>
generated_at: <ISO timestamp>
---

# Proposta de Estrutura — <Nome do Projeto>

## Suíte: <Nome da suíte 1>
- **Executor:** playwright
- **Playbooks:** flipper
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:exemplo` ativa
  - Pelo menos 1 curso pré-existente

## Suíte: <Nome da suíte 2>
...
```

Ao terminar, informar em texto simples (sem pausar esperando resposta):
quantidade de suítes propostas + caminho do arquivo gravado. **Esta skill
TERMINA aqui** — não continua pra escrita de casos (isso é o
`/analyze-test`, disparado separadamente quando a proposta estiver
aprovada).
