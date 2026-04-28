---
name: twygo-xml-parser
description: Lê um XML em formato TestLink (testsuite > testcase > steps com actions/expectedresults em prosa PT-BR) e produz um JSON estruturado que o orquestrador consome. Não interpreta a prosa — apenas estrutura.
version: 2.0.0
---

# twygo-xml-parser

## Quando usar

Sempre que o agente recebe um arquivo XML de análise de testes (exportado do
TestLink ou gerado pelo agente AT) e precisa convertê-lo para JSON
consumível pelo orquestrador (`twygo-test-orchestrator` — Fase 4).

## Formato do XML de entrada (TestLink)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="">
  <testsuite name="[Projeto] QA 1.1 - Bloco">
    <testcase name="Validar X">
      <summary>Descrição do que o caso valida</summary>
      <preconditions>Texto livre com pré-condições</preconditions>
      <execution_type>1</execution_type>
      <importance>3</importance>
      <steps>
        <step>
          <step_number>1</step_number>
          <actions>Prosa em PT-BR descrevendo a ação</actions>
          <expectedresults>Prosa em PT-BR descrevendo o resultado esperado</expectedresults>
          <execution_type>1</execution_type>
        </step>
      </steps>
    </testcase>
  </testsuite>
</testsuite>
```

Pontos importantes:
- A raiz é sempre `<testsuite>` (mesmo que com `name=""`).
- `<testsuite>` é **recursiva** — pode conter outras `<testsuite>` aninhadas
  (típico: a raiz vazia + uma testsuite por bloco do projeto).
- `<actions>` e `<expectedresults>` são **texto livre** em PT-BR. Não há
  códigos semânticos (não existe `action="fill"` etc.).
- `importance`: 1 (baixa), 2 (média), 3 (alta) — usado para `severity` no
  Allure regressivo.

## Como definir qual XML parsear

Em ordem de prioridade:
1. Caminho passado como argumento CLI: `npm run agent:parse -- caminho/do/projeto.xml`
2. Campo `testAnalysisFile` em `config/project.config.json`.
3. Fallback: `inputs/test-analysis.xml` (não recomendado — explícito é melhor).

## Saída

`outputs/test-analysis.parsed.json` com a forma:

```jsonc
{
  "rootSuite": {
    "name": "",
    "testCases": [],
    "childSuites": [
      {
        "name": "[Kit de marca] QA 1.1 - ...",
        "testCases": [
          {
            "name": "Validar submenu...",
            "summary": "...",
            "preconditions": "...",
            "executionType": 1,
            "importance": 3,
            "steps": [
              {
                "stepNumber": 1,
                "actions": "Acessar o menu 'Configurações'...",
                "expectedResults": "Menu 'Configurações' é expandido...",
                "executionType": 1
              }
            ]
          }
        ],
        "childSuites": []
      }
    ]
  },
  "totals": { "suites": 21, "testCases": 100, "steps": 585 }
}
```

## Limpeza de texto

O parser:
- Decodifica entidades HTML comuns (`&gt;`, `&lt;`, `&amp;`, `&quot;`, `&apos;`, `&nbsp;`).
- Colapsa whitespace (newlines, tabs, runs de espaços) em um único espaço.
- Aplica trim em cada campo de texto.

Resultado: a prosa em `actions`/`expectedResults` chega ao orquestrador limpa
e em uma única linha lógica, pronta para ser interpretada pelo planner.

## Validações

- Se a raiz não for `<testsuite>`, aborta.
- Se nenhum `<testcase>` for encontrado em todo o XML, aborta.
- Se algum `<testcase>` estiver sem `name` ou sem nenhum `<step>`, aborta com
  o caminho da suíte para debug.

## Execução manual

```bash
# usa o testAnalysisFile do project.config.json
npm run agent:parse

# explicita um XML diferente
npm run agent:parse -- inputs/Analise_Teste_OutroProjeto.xml
```

## O que esta skill NÃO faz

- Não interpreta a prosa em `<actions>`/`<expectedresults>`. Isso é trabalho
  do orquestrador (Fase 4) com auxílio do plugin oficial Playwright + MCP.
- Não valida via XSD (não há schema TestLink versionado neste repo). A
  validação aqui é estrutural: well-formedness do XML + presença de
  `<testsuite>`/`<testcase>`/`<step>`.
