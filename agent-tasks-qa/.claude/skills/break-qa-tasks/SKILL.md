---
name: break-qa-tasks
description: Orquestra o fluxo completo de quebra de atividades de QA para reuniões de planejamento. Lê documentação de projects/<slug>/docs/ (Discovery/Spike .docx e planilha de Dev .xlsx), gera atividades de QA com estimativas baseadas em Playwright, e produz duas planilhas .xlsx em projects/<slug>/output/. Use quando o usuário solicitar quebra de atividades de QA para um novo projeto Twygo.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Quebra de Atividades de QA — Fluxo Completo

Você é o agente Tasks-QA da Twygo. Siga este fluxo ao ser invocado:

## Etapa 0: Descobrir o projeto ativo

Antes de tudo, resolver o `<slug>` do projeto (mesma convenção de `agent-at` e
`agent-playwright`). Todos os caminhos do fluxo são **relativos a
`projects/<slug>/`**:

1. Flag `--project <slug>` passada na invocação → usa esse slug.
2. Variável de ambiente `PROJECT=<slug>`.
3. Auto-detect: se há **exatamente 1** subpasta em `projects/`, usa ela.
4. Erro explícito: listar as subpastas de `projects/` e pedir a flag `--project`.

> **Legado**: se não houver `projects/` (repositório antigo) mas existir
> `docs/` na raiz, opere no modo plano antigo (`docs/` + `output/` na raiz) e
> **alerte** que o projeto deveria migrar para `projects/<slug>/`.

A partir daqui, `<slug>` está resolvido e usado em todos os caminhos.

## Etapa 1: Verificação do Ambiente

1. Verificar se `projects/<slug>/docs/` contém arquivos. Se vazia, solicitar ao usuário que deposite os arquivos e aguardar.
2. Verificar se existe pelo menos um `.docx` (documento de requisitos) e um `.xlsx` (planilha de Dev). Se faltar algum, informar e aguardar.
3. Criar `projects/<slug>/output/` se não existir. **Não apagar** arquivos de projetos antigos automaticamente — apenas sobrescrever os do projeto atual.

## Etapa 2: Leitura dos Inputs

Invocar a skill `/read-inputs` para ler todos os arquivos da pasta `projects/<slug>/docs/`. Ao final, você terá em memória (ou em `projects/<slug>/output/inputs_extraidos.md` se persistido):

- **RNs**: ID + texto de cada Regra de Negócio
- **Atividades de Dev**: tipo, título, descrição (com RNs associadas), esforço, bloco
- **Estrutura de blocos**: Bloco 1 = X, Bloco 2 = Y, ...
- **Metadados do produto**: `account_id`, `folder_id`, nome do projeto (da aba `produto`)
- **Atividades transversais identificadas**: Banco Histórico, Logs, Trial, Feature flag, Ambientes adicionais

## Etapa 3: Leitura da Estrutura de Testes Existente (calibração)

Antes de aplicar a tabela base de estimativas, **ler a estrutura de `../agent-playwright/`** para entender o que já existe e calibrar para mais ou para menos:

```
Glob: ../agent-playwright/src/**/*.ts                  → page objects, fixtures, helpers
Glob: ../agent-playwright/projects/*/specs/**/*.spec.ts → specs já implementadas
Read: ../agent-playwright/CLAUDE.md                    → convenções e padrões
```

Anotar:
- Quais page objects já existem (evita reescrever)
- Que fixtures de feature flag, trial, banco histórico estão disponíveis
- Padrão de granularidade dos testes (`test()` por cenário vs. `describe()`)

> Esta leitura é **read-only**. Não modificar nada em `agent-playwright/`.

## Etapa 4: Estruturação das Atividades de QA

Para cada atividade de Dev da planilha, decidir:

### 4.1 Agrupar / Desmembrar

| Caso | Decisão |
|---|---|
| Formulário com múltiplas abas | 1 atividade de QA **por aba** |
| Dois fluxos distintos (Aula + Página, Listagem + Cadastro) | 1 atividade de QA **por fluxo** |
| Funcionalidade simples coesa (filtros, busca) | **1 única** atividade de QA |
| Banco Histórico / Logs / Trial / Feature flag / Ambientes adicionais | Atividades **separadas**, nunca agrupadas |

### 4.2 Nomear

- Com bloco definido: `QA [Bloco].[Num] - [Nome da Funcionalidade]`
- Sem bloco (transversais): `QA x.x - [Nome]`
- Espelhar o número do bloco da atividade Dev correspondente.

### 4.3 Descrever (template obrigatório)

```
Relacionado a: [ID(s) do Dev — ex: Dev 1.1, Dev 1.2]
RNs: [Lista de RNs cobertas — ex: RN 1, RN 2.1, RN 5]

Validar:
* [Ponto de validação 1 — específico, mensurável]
* [Ponto de validação 2]
* [...]
```

Os pontos de validação devem ser extraídos do texto das RNs e da descrição da atividade de Dev — **nunca genéricos** ("validar funcionamento", "testar tudo").

## Etapa 5: Estimar Esforço

Aplicar a tabela base, **ajustando** com base na Etapa 3:

| Tipo | Base | Ajustar para baixo se… | Ajustar para cima se… |
|---|---|---|---|
| Análise de testes | 8h–16h | Poucas RNs (~5–10) e fluxo simples | Muitas RNs (>30) ou regras complexas |
| Listagem simples | 2h–4h | Page object de listagem já existe | Filtros + paginação + ordenação inéditos |
| Formulário/Cadastro | 4h–8h | Fixtures de formulário reutilizáveis | Múltiplas abas + validações complexas |
| Integração/Microserviço | 4h–6h | Mock de fila genérico já existe | Banco vetorial + queue + workers novos |
| Banco Histórico | 2h | Helper de query genérico | Múltiplas tabelas + cascata |
| Trial | 2h | Setup de trial já reutilizável | Trial específico do projeto |
| Logs | 2h | Helper de log query existente | Múltiplas tabelas de log |
| Feature flag | 2h–4h | Fixture de flag on/off pronta | Flag com efeitos colaterais cruzados |
| Ambientes adicionais | 4h | Config de ambiente já parametrizada | Nova variável + secrets novos |
| Deploy | 1h | — (sempre fixo) | — |

> **Análise de testes**: arredondar para múltiplos razoáveis (8h, 10h, 12h, 14h, 16h).

## Etapa 6: Adicionar Atividades Finais (sempre, nesta ordem)

| Tipo | Título | Descrição | Esforço |
|---|---|---|---|
| Reteste | Repasse | *(descrição padrão em twygo-tasks-conventions)* | *(em branco)* |
| Documentação | Usabilidade | *(descrição padrão)* | *(em branco)* |
| Documentação | Vídeo | *(descrição padrão)* | *(em branco)* |
| Indiretos - Cerimonias da Equipe | Review | Review | *(em branco)* |
| Deploy | Gerar versão para Deploy (dd/mm) | Gerar versão para deploy | 1 |
| Total | *(vazio)* | *(vazio)* | *(em branco)* |

## Etapa 7: Tratamento de Casos Especiais (alertar o usuário)

- Atividade Dev menciona "banco histórico" / "logs" / "trial" sem bloco → criar QA `x.x` e **alertar** que o Dev precisa documentar as tabelas impactadas.
- Documento sem RNs numeradas → inferir e **alertar** para validação humana.
- Planilha sem aba `produto` ou sem `account_id` → deixar metadados em branco e **alertar**.
- Atividade Dev é só Spike / Teste de mesa → preservar na Planilha Completa, **não** gerar QA.

## Etapa 8: Geração das Planilhas

Invocar a skill `/generate-qa-sheet` passando:

- Lista de atividades originais da planilha de Dev (preservar tudo, exceto QA antigo)
- Lista de atividades de QA geradas
- Lista de atividades finais fixas
- Nome do projeto (para nome dos arquivos)

> Passar à skill `/generate-qa-sheet` o diretório de saída explícito
> `--output-dir projects/<slug>/output`.

Saída em `projects/<slug>/output/`:
- `QA_Atividades_<NomeProjeto>_Complementada.xlsx`
- `QA_Only_<NomeProjeto>.xlsx`

## Etapa 9: Entrega

Apresentar ao usuário:

1. **Tabela Markdown** com todas as atividades de QA geradas (tipo, título, estimativa)
2. **Totais** por tipo (Análise, Execução, Deploy)
3. **Total de horas de QA**
4. **Alertas** disparados (se houver)
5. **Localização dos arquivos** gerados

Formato sugerido:

```markdown
## Resumo da quebra — <NomeProjeto>

| # | Tipo | Título | Esforço (h) |
|---|------|--------|-------------|
| 1 | Análise de testes | Análise de testes | 12 |
| 2 | Execução de testes | QA 1.1 - Listagem Básica | 4 |
| ... | ... | ... | ... |

**Totais:**
- Análise: 12h
- Execução: 64h (12 atividades)
- Deploy: 1h
- **Total estimado: 77h**

**Alertas:**
- ⚠️ Documento sem RNs numeradas — RNs foram inferidas, validar.
- ⚠️ Aba `produto` sem `account_id` — preencher manualmente no gestor.

**Arquivos:**
- `projects/<slug>/output/QA_Atividades_<NomeProjeto>_Complementada.xlsx`
- `projects/<slug>/output/QA_Only_<NomeProjeto>.xlsx`
```

## Checklist de Qualidade (verificar ANTES de entregar)

- [ ] Todas as atividades de QA têm `Relacionado a:`, `RNs:` e `Validar:` na descrição
- [ ] Pontos de validação são específicos (não "validar funcionamento")
- [ ] Nomenclatura `QA [Bloco].[Num] - ...` para atividades com bloco
- [ ] Transversais usam `QA x.x - ...` e estão **separadas**
- [ ] Nenhuma atividade "Buffer de retrabalho" foi incluída
- [ ] Atividades finais fixas adicionadas na ordem correta
- [ ] Deploy = 1h
- [ ] Estimativas calibradas pela estrutura existente em `agent-playwright/`
- [ ] Casos especiais alertados ao usuário
- [ ] Duas planilhas geradas em `projects/<slug>/output/`
- [ ] Resumo em Markdown apresentado
