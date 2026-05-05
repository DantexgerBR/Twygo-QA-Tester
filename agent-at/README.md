# Agente AT — Análise de Teste (Twygo)

Agente automatizado para criação de cenários e casos de teste em formato **XMind**, prontos para serem exportados como XML TestLink e consumidos pelo [agent-playwright](../agent-playwright/).

> **Quem é o público deste README?** Estagiários, QAs novos no time, ou qualquer pessoa começando a usar o agente. Para detalhes técnicos do fluxo, ver [CLAUDE.md](CLAUDE.md).

---

## Sumário

1. [O que ele faz e quando usar](#o-que-ele-faz-e-quando-usar)
2. [Pré-requisitos](#pré-requisitos)
3. [Setup (primeira vez)](#setup-primeira-vez)
4. [Fluxo de uso para um projeto novo](#fluxo-de-uso-para-um-projeto-novo)
5. [Estrutura de pastas](#estrutura-de-pastas)
6. [Comandos disponíveis](#comandos-disponíveis)
7. [Tipos de projeto suportados](#tipos-de-projeto-suportados)
8. [Conexão com os outros agentes](#conexão-com-os-outros-agentes)
9. [Troubleshooting comum](#troubleshooting-comum)
10. [Onde aprender mais](#onde-aprender-mais)

---

## O que ele faz e quando usar

**Em uma frase:** você joga documentação de projeto na pasta `docs/` → o agente lê tudo, extrai requisitos, cria cenários e casos de teste detalhados, e gera um arquivo XMind pronto pra importar no TestLink.

### Use este agente quando:
- Recebeu um Discovery (.docx) e/ou Spike de um projeto Twygo novo.
- Recebeu uma planilha "Quebra de atividades" (.xlsx) com os blocos de desenvolvimento.
- Precisa transformar tudo isso em **casos de teste detalhados o suficiente para automação**.

### NÃO use este agente para:
- Executar os testes → use [agent-playwright](../agent-playwright/) (UI) ou [agent-db](../agent-db/) (banco — em construção).
- Editar XMind manualmente (use o XMind Desktop diretamente, não passa por este agente).

---

## Pré-requisitos

| Ferramenta | Versão mínima | Onde baixar |
|---|---|---|
| **Claude Code CLI** | latest | https://code.claude.com/ |
| **XMind Desktop** *(para abrir os arquivos gerados)* | qualquer | https://xmind.app/ |
| **Python 3.x** | 3.10+ | já vem no Claude Code; ou https://python.org/ |

---

## Setup (primeira vez)

```bash
cd agent-at
```

### 1. Confirmar que o template existe

O agente reutiliza um template XMind base em todas as gerações. Confirme que existe:

```
template/template.xmind
```

Se não existir, peça ao time o arquivo e copie pra esse caminho.

### 2. Subir o Claude Code

```bash
claude
```

O Claude Code carrega automaticamente o `CLAUDE.md` e as skills locais em `.claude/skills/`.

---

## Fluxo de uso para um projeto novo

### 1. Depositar a documentação

Coloque **todos** os arquivos de entrada na pasta `docs/`:

```
docs/
├── [Discovery] <Nome do Projeto>.docx     # documentação principal (obrigatório)
├── Quebra de atividades - <Projeto>.xlsx  # planilha de blocos (recomendado)
└── (arquivos complementares opcionais — migrations .rb, responses .json, etc.)
```

> **Limpe a pasta entre projetos** — o agente lê tudo que estiver lá.

### 2. Disparar a análise

Dentro do Claude Code:

```
/analyze-test
```

A skill orquestra o fluxo completo:

1. Verifica `docs/`, `template/` e `output/`
2. Lê e interpreta todos os arquivos de `docs/` (via `/read-docs`)
3. Define estrutura de suítes e casos de teste
4. Gera o XMind em `output/` (via `/generate-xmind`)

### 3. Resultado

```
output/
├── requisitos_extraidos.md       # consolidado de requisitos extraídos da doc
├── Analise_Teste_<Projeto>.xmind # XMind pronto pra abrir e revisar
└── generate_xmind.py             # script Python usado na geração
```

### 4. Revisar e ajustar

Abra o `.xmind` no XMind Desktop, revise cobertura, peça ajustes ao agente se necessário ("ajuste o caso X para incluir validação Y").

### 5. Exportar pra XML TestLink

No próprio XMind Desktop ou via ferramenta da sua escolha, exporte o `.xmind` como XML TestLink. Esse XML é a entrada do [agent-playwright](../agent-playwright/).

---

## Estrutura de pastas

```
agent-at/
├── CLAUDE.md                  # Especificação técnica do agente
├── README.md                  # Este arquivo
│
├── docs/                      # Entrada — documentação do projeto (você deposita aqui)
├── output/                    # Saída — XMind + script + requisitos extraídos (gerado)
├── template/
│   └── template.xmind         # Template base reutilizado em todos os projetos
│
└── .claude/
    └── skills/
        ├── analyze-test/      # Skill principal — fluxo completo
        ├── read-docs/         # Skill de leitura/interpretação dos docs
        ├── generate-xmind/    # Skill de geração do XMind
        └── twygo-qa-conventions/  # Convenções de QA (auto-carregada)
```

---

## Comandos disponíveis

Dentro do Claude Code (modo interativo):

| Comando | O que faz |
|---|---|
| `/analyze-test` | **Fluxo completo** — lê docs, define suítes, gera XMind |
| `/read-docs` | Apenas leitura e interpretação dos documentos (sem gerar XMind) |
| `/generate-xmind` | Apenas geração do XMind (após casos já definidos manualmente) |

> A skill `twygo-qa-conventions` carrega automaticamente quando relevante — não precisa ser chamada.

---

## Tipos de projeto suportados

| Tipo | Exemplos |
|---|---|
| **UI / Funcional** | Validações de tela, campos, componentes, navegação |
| **API** | Endpoints REST, status codes, payloads, autenticação |
| **Bloqueio / Contrato** | Modais de bloqueio, downgrade, Super Admin |
| **SSO / Integração** | Login SSO, sincronização, workers |
| **Misto** | Combinação dos tipos acima |

---

## Conexão com os outros agentes

```
┌────────────┐    docs/      ┌────────┐    XML     ┌──────────────────┐
│  Discovery │  (.docx/      │ agent- │ TestLink   │ agent-playwright │
│  + Spike   │ ───────────►  │  at    │ ─────────► │  (executa UI)    │
└────────────┘   .xlsx)      └────────┘            └──────────────────┘
                                                          │
                                                          │ chama quando
                                                          │ necessário
                                                          ▼
                                                   ┌──────────────┐
                                                   │  agent-db    │
                                                   │ (validações  │
                                                   │   em DB)     │
                                                   └──────────────┘
```

- **Entrada deste agente**: documentação humana (Discovery, Spike, planilha de quebra).
- **Saída deste agente**: XMind → exportado pra XML TestLink → consumido pelo agent-playwright.
- **Handoff**: copie o XML gerado para `agent-playwright/inputs/Analise_Teste_<projeto>.xml` e atualize `agent-playwright/config/project.config.json`.

---

## Troubleshooting comum

### `template/template.xmind não encontrado`
Pegue o template com o time e coloque em `template/template.xmind`. Esse arquivo é o esqueleto reutilizado em todos os projetos.

### Pasta `docs/` tem arquivos de projeto antigo
Limpe `docs/` antes de iniciar projeto novo — o agente lê tudo que estiver lá. Mover pra um backup local ou deletar.

### Casos de teste gerados estão genéricos demais
Verifique se a documentação tem detalhes suficientes (regras de negócio, comportamentos esperados, edge cases). Se a fonte é vaga, peça ao agente: "Refine os casos da suíte X com mais detalhes de validação".

### XMind gerado tem prefixos como "[Projeto] QA X.X -" nas suítes
Bug. As convenções do agente proíbem esses prefixos ([CLAUDE.md §3.7](CLAUDE.md)). Peça regeneração explícita.

---

## Onde aprender mais

| Documento | Quando ler |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Antes de modificar o agente — convenções, regras de QA Twygo |
| [.claude/skills/](.claude/skills/) | Skills disponíveis e como funcionam |

Documentação dos outros agentes:
- [agent-playwright](../agent-playwright/README.md) — execução E2E (UI)
- [agent-db](../agent-db/README.md) — validações em banco (em construção)
