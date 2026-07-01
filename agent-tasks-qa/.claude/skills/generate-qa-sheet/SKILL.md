---
name: generate-qa-sheet
description: Gera os dois arquivos .xlsx finais de quebra de atividades — Planilha Completa (Dev + QA) e Planilha QA-Only — em projects/<slug>/output/, usando a lista de atividades produzida pela skill /break-qa-tasks. Aplica colunas obrigatórias, atividades finais fixas e descrições padrão.
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Geração das Planilhas de Saída

## Objetivo

Gerar dois arquivos `.xlsx` em `projects/<slug>/output/`:

1. **`QA_Atividades_<NomeProjeto>_Complementada.xlsx`** — Dev + QA (planilha completa para o gestor de projetos).
2. **`QA_Only_<NomeProjeto>.xlsx`** — apenas QA (para revisões focadas).

> O diretório de saída é informado pela `/break-qa-tasks` via
> `--output-dir projects/<slug>/output`. O default `output/` do script é
> apenas fallback do modo legado.

## Como Funciona

1. A skill `/break-qa-tasks` consolida em memória:
   - Atividades originais da planilha de Dev (preservar: Desenvolvimento, Spike, Teste de mesa)
   - Atividades de QA geradas (Análise de testes, Execução de testes)
   - Atividades finais fixas (Reteste, Documentação, Indiretos, Deploy, Total)
2. Esta skill recebe essa lista e gera os dois `.xlsx` usando `openpyxl`.
3. O template das atividades fixas vive em [`templates/qa_activities_template.json`](templates/qa_activities_template.json).

## Script Base

O script `scripts/generate_qa_sheet.py` recebe os dados via JSON na entrada (stdin ou arquivo temporário) e gera os arquivos. Estrutura esperada:

```python
{
    "projeto": "Modelos de Conteúdo",
    "atividades_dev_originais": [          # preservar (não-QA) da planilha original
        {"tipo": "Desenvolvimento", "titulo": "...", "descricao": "...", "esforco": 16},
        # ...
    ],
    "atividades_qa": [                     # geradas pelo agente
        {"tipo": "Análise de testes", "titulo": "Análise de testes",
         "descricao": "<descrição padrão>", "esforco": 12},
        {"tipo": "Execução de testes", "titulo": "QA 1.1 - Listagem Básica",
         "descricao": "Relacionado a: Dev 1.1\nRNs: RN 1, RN 2\n\nValidar:\n* ...",
         "esforco": 4},
        # ...
    ],
    "atividades_finais": [                 # vem direto do template (skill carrega)
        # ver templates/qa_activities_template.json
    ],
}
```

## Estrutura das Colunas (ambos os arquivos)

Cabeçalho na linha 1, dados a partir da linha 2:

| Col A | Col B | Col C | Col D | Col E | Col F | Col G |
|---|---|---|---|---|---|---|
| Tipo da atividade | Título da atividade | Descrição | Esforço estimado | Início estimado | Término estimado | Responsável |

- `Esforço estimado`: número (sem `h`)
- `Início estimado`, `Término estimado`, `Responsável`: sempre vazios na saída

## Conteúdo das Planilhas

### Arquivo 1 — Planilha Completa (Dev + QA)

Ordem das linhas:

1. **Header** (linha 1)
2. **Atividades originais não-QA** (Desenvolvimento, Spike, Teste de mesa) — na ordem em que apareciam na planilha original
3. **Análise de testes** — primeira atividade de QA
4. **Execuções de testes** — em ordem de bloco (1.1, 1.2, …, 2.1, …, x.x no final)
5. **Atividades finais fixas** (na ordem do template)

### Arquivo 2 — Planilha QA-Only

Mesmo header, mas filtrando apenas:
- `Análise de testes`
- `Execução de testes`
- `Reteste`
- `Documentação`
- `Indiretos - Cerimonias da Equipe`
- `Deploy`
- `Total`

## Template das Atividades Finais

Manter em [`templates/qa_activities_template.json`](templates/qa_activities_template.json):

```json
[
  {
    "tipo": "Reteste",
    "titulo": "Repasse",
    "descricao": "Execução desta atividade será apenas se BUG's críticos e/ou muitos retrabalhos | Pode ser cancelada | Validar principalmente fluxos principais / ótimos | Última atividade de teste, alocada após conclusão de todos os testes (execução + retrabalhos)",
    "esforco": null
  },
  {
    "tipo": "Documentação",
    "titulo": "Usabilidade",
    "descricao": "Atividade destinada a criação de documentação de apoio para o time de suporte sobre as funcionalidades, configurações",
    "esforco": null
  },
  {
    "tipo": "Documentação",
    "titulo": "Vídeo",
    "descricao": "Obs.: 5 dias corridos antes da data de entrega (prazo para edição vídeo pelo time de Marketing)",
    "esforco": null
  },
  {
    "tipo": "Indiretos - Cerimonias da Equipe",
    "titulo": "Review",
    "descricao": "Review",
    "esforco": null
  },
  {
    "tipo": "Deploy",
    "titulo": "Gerar versão para Deploy (dd/mm)",
    "descricao": "Gerar versão para deploy",
    "esforco": 1
  },
  {
    "tipo": "Total",
    "titulo": "",
    "descricao": "",
    "esforco": null
  }
]
```

## Descrição Padrão da Análise de Testes

```
- Mapa mental (utilizando estrutura para conversão em .xml, com suítes, casos de testes - título, objetivo, pré-requisitos -, passos e resultado esperado)
- Converter .xmind para .xml
- Preparar estrutura (suítes de testes) e importar casos de testes para Testlink
- Criar plano de testes/baselines
- Adicionar e atribuir casos para execução
```

## Regras Técnicas Críticas

1. **Não incluir "Buffer de retrabalho"** — descontinuado.
2. **Esforço estimado** sempre numérico (int ou float). Para atividades sem estimativa (Reteste, Documentação, Review, Total), deixar a célula vazia.
3. **Ordem importa** — atividades finais sempre na ordem do template.
4. **Nome do arquivo**: substituir caracteres especiais no nome do projeto por `_` (ex: "Modelos de Conteúdo" → `Modelos_de_Conteudo`).
5. **Sobrescrever** arquivos do projeto atual — não criar timestamps.

## Após Gerar

1. Contar total de linhas em cada arquivo (excluindo header e Total).
2. Calcular soma de `Esforço estimado` apenas para Execução de testes e Deploy.
3. Apresentar resumo ao usuário (caminho dos arquivos + totais).

## Script auxiliar

- [scripts/generate_qa_sheet.py](scripts/generate_qa_sheet.py) — gera ambos os `.xlsx` via openpyxl.
