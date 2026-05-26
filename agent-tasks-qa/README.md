# Agente Tasks-QA — Quebra de Atividades de QA (Twygo)

Agente automatizado para **planejamento e refinamento** de projetos de QA: lê documentos de requisitos (Discoveries, Spikes, Especificações) e a planilha de quebra de Dev, e gera duas planilhas `.xlsx` com **atividades de QA estruturadas e estimadas** — prontas para importação no sistema de gestão de projetos da Twygo.

> **Quem é o público deste README?** Estagiários, QAs novos no time, ou qualquer pessoa começando a usar o agente. Para detalhes técnicos, ver [CLAUDE.md](CLAUDE.md).

---

## Sumário

1. [O que ele faz e quando usar](#o-que-ele-faz-e-quando-usar)
2. [Pré-requisitos](#pré-requisitos)
3. [Setup (primeira vez)](#setup-primeira-vez)
4. [Fluxo de uso para um projeto novo](#fluxo-de-uso-para-um-projeto-novo)
5. [Estrutura de pastas](#estrutura-de-pastas)
6. [Comandos disponíveis](#comandos-disponíveis)
7. [O que sai na planilha](#o-que-sai-na-planilha)
8. [Conexão com os outros agentes](#conexão-com-os-outros-agentes)
9. [Troubleshooting comum](#troubleshooting-comum)
10. [Onde aprender mais](#onde-aprender-mais)

---

## O que ele faz e quando usar

**Em uma frase:** você joga Discovery + planilha de quebra de Dev em `docs/` → o agente lê tudo, quebra as atividades de QA em itens correspondentes, estima o esforço de cada um (Playwright) e gera duas planilhas `.xlsx` prontas para importação.

### Use este agente quando:
- Está em **reunião de planejamento/refinamento** de um projeto Twygo novo.
- Recebeu o Discovery (.docx) e a planilha "Quebra de atividades" (.xlsx) com as atividades de Dev já estimadas.
- Precisa entregar a **quebra das atividades de QA** com estimativas em horas.

### NÃO use este agente para:
- Criar casos de teste detalhados → use [agent-at](../agent-at/) (gera XMind).
- Executar testes → use [agent-playwright](../agent-playwright/) (UI) ou [agent-db](../agent-db/) (banco).
- Editar planilhas manualmente — abra a saída no Excel/Sheets para revisão final.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Onde baixar |
|---|---|---|
| **Claude Code CLI** | latest | https://code.claude.com/ |
| **Python** | 3.10+ | https://python.org/ |
| **Excel / LibreOffice / Sheets** *(para abrir as planilhas geradas)* | qualquer | — |

---

## Setup (primeira vez)

```bash
cd agent-tasks-qa

# 1. (Opcional) ambiente virtual Python
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Subir o Claude Code
claude
```

O Claude Code carrega automaticamente o `CLAUDE.md` e as skills locais em `.claude/skills/`.

---

## Fluxo de uso para um projeto novo

### 1. Depositar a documentação

Coloque **todos** os arquivos de entrada na pasta `docs/`:

```
docs/
├── [Discovery] <Nome do Projeto>.docx        # obrigatório
├── Quebra de atividades - <Projeto>.xlsx     # obrigatório (aba dev-qa)
└── (opcional) link de protótipo no chat       # Figma / Vercel
```

> **Limpe a pasta entre projetos** — o agente lê tudo que estiver lá.

### 2. Disparar a quebra

Dentro do Claude Code:

```
/break-qa-tasks
```

A skill orquestra o fluxo:

1. Verifica `docs/` e `output/`.
2. Lê o Discovery/Spike e a planilha de Dev (via `/read-inputs`).
3. Estrutura as atividades de QA (agrupamento/desmembramento + nomenclatura + descrição).
4. Lê a estrutura de `../agent-playwright/` para calibrar estimativas.
5. Aplica a tabela base de estimativas, ajustando para reutilização de código existente.
6. Gera as duas planilhas (via `/generate-qa-sheet`).
7. Apresenta o resumo em tabela Markdown.

### 3. Resultado

```
output/
├── QA_Atividades_<NomeProjeto>_Complementada.xlsx   # Dev + QA
├── QA_Only_<NomeProjeto>.xlsx                       # apenas QA
└── (auxiliares de debug podem aparecer)
```

### 4. Revisar e importar

Abra os `.xlsx` no Excel/LibreOffice/Sheets, revise estimativas, ajuste títulos/descrições se necessário e importe no gestor de projetos da Twygo.

> Se uma estimativa parecer fora da curva, peça ajustes ao agente: "Reduza a estimativa de QA 2.3 para 4h porque já temos page object de listagem".

---

## Estrutura de pastas

```
agent-tasks-qa/
├── CLAUDE.md                  # Especificação técnica do agente
├── README.md                  # Este arquivo
├── requirements.txt           # openpyxl, python-docx, docx2txt
│
├── docs/                      # Entrada — Discovery + planilha de Dev (você deposita aqui)
├── output/                    # Saída — planilhas .xlsx geradas (gitignored)
│
└── .claude/
    └── skills/
        ├── break-qa-tasks/             # Skill principal (fluxo completo)
        ├── read-inputs/                # Lê .docx + .xlsx e extrai RNs/atividades
        ├── generate-qa-sheet/          # Gera as duas planilhas .xlsx
        └── twygo-tasks-conventions/    # Convenções (auto-carregada)
```

---

## Comandos disponíveis

Dentro do Claude Code (modo interativo):

| Comando | O que faz |
|---|---|
| `/break-qa-tasks` | **Fluxo completo** — lê inputs, quebra atividades, gera planilhas |
| `/read-inputs` | Apenas leitura/interpretação dos arquivos de `docs/` |
| `/generate-qa-sheet` | Apenas geração das planilhas (após atividades já definidas) |

> A skill `twygo-tasks-conventions` é auto-carregada — não precisa ser chamada.

---

## O que sai na planilha

### Planilha Completa (Dev + QA)

Preserva todas as atividades originais da planilha de Dev (Desenvolvimento, Spike, Testes de mesa) e **substitui** as atividades de QA pelas geradas pelo agente. Inclui também as atividades finais fixas.

### Planilha QA-Only

Contém apenas atividades dos seguintes tipos:

- `Análise de testes` (estimativa 8h–16h, proporcional ao volume de RNs)
- `Execução de testes` (uma por bloco/funcionalidade — ver tabela em [CLAUDE.md](CLAUDE.md))
- `Reteste` — Repasse (sem estimativa, executado só se houver retrabalho)
- `Documentação` — Usabilidade + Vídeo (sem estimativa)
- `Indiretos - Cerimonias da Equipe` — Review (sem estimativa)
- `Deploy` — 1h fixo
- `Total` (linha de fechamento)

Colunas das duas planilhas (na ordem):

`Tipo da atividade` | `Título da atividade` | `Descrição` | `Esforço estimado` | `Início estimado` | `Término estimado` | `Responsável`

Os campos `Início estimado`, `Término estimado` e `Responsável` saem em branco (são preenchidos manualmente no gestor de projetos).

---

## Conexão com os outros agentes

```
┌──────────────────┐  docs/ (.docx +    ┌──────────────────┐  .xlsx     ┌──────────────────┐
│ Reunião de       │  .xlsx de Dev)     │ agent-tasks-qa   │  pronta    │ Sistema de       │
│ planejamento     │ ─────────────────► │  (este agente)   │ ─────────► │ gestão de proj.  │
└──────────────────┘                    └──────────────────┘            └──────────────────┘
                                                  │
                                                  │  contexto sobre estimativas
                                                  ▼
                                          ┌──────────────────┐
                                          │ agent-playwright │
                                          │ (estrutura de    │
                                          │  testes lida     │
                                          │  para calibrar)  │
                                          └──────────────────┘
```

- **Entrada**: documentos do projeto (Discovery + planilha de Dev).
- **Saída**: duas `.xlsx` em `output/` para importação no gestor da Twygo.
- **Leitura cruzada**: o agente **lê** (read-only) a estrutura de `../agent-playwright/` para calibrar estimativas considerando reutilização de page objects, fixtures e helpers.
- **Stateless**: nenhuma escrita ou import direto de outros agentes — comunicação apenas por filesystem.

---

## Troubleshooting comum

### `Pasta docs/ vazia` ao executar `/break-qa-tasks`
Deposite os arquivos de entrada em `docs/` antes de chamar o comando. O agente vai aguardar.

### Documento não tem RNs numeradas
O agente vai inferir as regras a partir do texto livre e **alertar** que você precisa validar. Reveja o resumo final antes de importar.

### Planilha não tem aba `produto` ou `account_id` numérico
Os campos de metadados saem em branco e o agente **alerta**. Preencha manualmente no gestor de projetos.

### Estimativas estão muito altas ou muito baixas
Peça ao agente para recalibrar mencionando o que já existe: "QA 1.1 deveria ser 2h, já temos page object de listagem com paginação no agent-playwright".

### Pasta `output/` tem arquivos de projeto antigo
O agente sobrescreve os arquivos da execução atual, mas pode coexistir com projetos antigos. Para evitar confusão, mova arquivos antigos antes de executar.

### Atividade transversal (Banco Histórico/Logs/Trial) saiu agrupada
Bug. As convenções do agente proíbem isso ([CLAUDE.md §Estruturação](CLAUDE.md)). Peça regeneração explícita.

---

## Onde aprender mais

| Documento | Quando ler |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Antes de modificar o agente — regras de estruturação, estimativas, planilhas |
| [.claude/skills/](.claude/skills/) | Skills disponíveis e como funcionam |

Documentação dos outros agentes:
- [agent-at](../agent-at/README.md) — análise de teste (gera XMind/XML)
- [agent-playwright](../agent-playwright/README.md) — execução E2E (UI)
- [agent-db](../agent-db/README.md) — validações em banco (em construção)
