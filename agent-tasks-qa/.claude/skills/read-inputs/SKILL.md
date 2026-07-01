---
name: read-inputs
description: Lê e interpreta os documentos de projects/<slug>/docs/ (Discovery/Spike .docx + planilha de Dev .xlsx), extraindo Regras de Negócio numeradas, atividades de Desenvolvimento, estrutura de blocos do projeto e metadados (account_id, folder_id, nome do projeto). Identifica também atividades transversais (Banco Histórico, Logs, Trial, Feature flag).
allowed-tools: Read Write Bash Glob Grep
---

# Leitura e Interpretação dos Inputs

## Objetivo

Ler TODOS os arquivos da pasta `projects/<slug>/docs/` e extrair:

1. **Regras de Negócio (RNs)** do `.docx` — ID + texto
2. **Atividades de Dev** do `.xlsx` (aba `dev-qa`) — tipo, título, descrição, esforço, bloco
3. **Estrutura de blocos** do projeto (Bloco 1 = X, Bloco 2 = Y, …)
4. **Metadados do produto** da aba `produto` da planilha — `account_id`, `folder_id`, nome do projeto
5. **Atividades transversais** sem bloco explícito (Banco Histórico, Logs, Trial, Feature flag, Ambientes adicionais)

Consolidar tudo em memória (ou opcionalmente em `projects/<slug>/output/inputs_extraidos.md` se útil para debug).

## Tipos de Arquivo Suportados

| Extensão | Tipo | O que extrair |
|----------|------|---------------|
| `.docx` | Discovery / Spike / Especificação | RNs numeradas (RN 1, RN 2.1, ...) + texto |
| `.xlsx` | Quebra de atividades de Dev | Aba `dev-qa` + aba `produto` |
| `.pdf` | Doc alternativa de requisitos | Mesmo que .docx (via docx2txt ou similar) |

## Processo de Extração

### Para documentação `.docx` / `.pdf`

Usar o script `scripts/read_requirements.py` (carregado pelo agente quando necessário):

1. Ler o arquivo completo via `python-docx` (ou `docx2txt` como fallback).
2. Buscar padrões de numeração: `RN 1`, `RN 1.1`, `RN 2`, `RN 2.3`, etc.
3. Extrair para cada RN encontrada:
   - ID literal (`RN 1.2`)
   - Texto completo da regra (até a próxima RN ou seção)
4. Identificar **fluxos** mencionados:
   - "Aula", "Página", "Curso", "Modelo" → fluxos comuns Twygo
   - "Banco histórico", "Logs", "Trial", "Feature flag" → transversais
5. Identificar **abas/seções** de formulários (palavras-chave: "aba", "Identificação", "Estilo", "Estrutura", "Imagem", "Áudio", "Design").

> **Se o documento não tiver RNs numeradas**: inferir regras a partir do texto e **marcar com flag `inferida: true`** para alertar o usuário na entrega final.

### Para planilha `.xlsx`

Usar o script `scripts/read_dev_sheet.py`:

1. Abrir o arquivo com `openpyxl` (read-only).
2. **Aba `dev-qa`** (ou primeira aba se nome divergir):
   - Localizar header (linha que contém "Tipo da atividade" e "Título da atividade").
   - Iterar linhas e extrair: `Tipo`, `Título`, `Descrição`, `Esforço estimado`.
   - Filtrar para coletar: `Desenvolvimento`, `Spike`, `Teste de mesa`, `Execução de testes` (se existir), `Análise de testes`.
   - Identificar o **bloco** pelo prefixo do título (ex: `[Criação de novo modelo]` → Bloco 1 se for a primeira ocorrência) ou pelo padrão `Dev 1.1`, `Dev 2.3`.
3. **Aba `produto`**:
   - Buscar linhas/colunas com labels: `account_id`, `folder_id`, nome do projeto.
   - **Ignorar** valores que sejam URLs ou contenham "Link".
   - `account_id` deve ser numérico — se não for, marcar como ausente.
4. Retornar estrutura consolidada.

## Identificação de Atividades Transversais

Marcar como **transversal** (numeração `x.x` na QA) toda atividade Dev que:

- Tem "Banco histórico" / "Banco Histórico" no título
- Tem "Logs" / "Auditoria" / "Registros" no título
- Tem "Trial" no título
- Tem "Feature flag" / "feature flag" no título
- Tem "Ambientes adicionais" / "Beta" / "Launch" no título

Mesmo se a atividade tiver bloco numerado (ex: Dev 4.1 - Banco histórico), **ainda assim** deve ser tratada como transversal na QA (atividade separada e individual).

## Formato de Saída (em memória)

Estrutura JSON-like que a skill `/break-qa-tasks` consome:

```python
{
    "projeto": {
        "nome": "Modelos de Conteúdo",
        "account_id": 12345,           # ou None se ausente
        "folder_id": 678,              # ou None se ausente
    },
    "rns": [
        {"id": "RN 1", "texto": "...", "inferida": False},
        {"id": "RN 2.1", "texto": "...", "inferida": False},
        # ...
    ],
    "blocos": {
        "1": "Criação de novo modelo",
        "2": "Filtros e ações",
        "3": "Kit de marca",
        "4": "Banco histórico",
    },
    "atividades_dev": [
        {
            "tipo": "Desenvolvimento",
            "titulo": "[Criação de novo modelo] Criação da aba \"Identificação\"",
            "descricao": "Implementar formulário... (RN 4, RN 5)",
            "esforco": 16,
            "bloco": "1",
            "id_dev": "Dev 1.1",
            "transversal": False,
        },
        {
            "tipo": "Desenvolvimento",
            "titulo": "Banco histórico",
            "descricao": "...",
            "esforco": 4,
            "bloco": "4",
            "id_dev": "Dev 4.1",
            "transversal": True,
        },
        # ...
    ],
    "alertas": [
        # Mensagens de aviso a propagar para o usuário
        "Documento sem RNs numeradas — regras foram inferidas, validar.",
        "Aba 'produto' não contém account_id numérico.",
    ],
}
```

## Importante

- Usar `python` (não `python3`) no Windows — verificar disponibilidade com `python --version`.
- Se `openpyxl` ou `python-docx` não estiverem instalados, instalar via `pip install -r requirements.txt` (rodar a partir da raiz do agent-tasks-qa).
- Se um arquivo não puder ser lido, **informar ao usuário** e prosseguir com os demais.
- **Não persistir** dados sensíveis (account_id, folder_id) em logs do agente — somente nas planilhas finais.

## Scripts auxiliares

- [scripts/read_requirements.py](scripts/read_requirements.py) — leitura de `.docx` + extração de RNs
- [scripts/read_dev_sheet.py](scripts/read_dev_sheet.py) — leitura de `.xlsx` + extração de atividades
