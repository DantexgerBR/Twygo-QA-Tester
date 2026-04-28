---
name: read-docs
description: Lê e interpreta todos os arquivos da pasta docs/, extraindo requisitos, textos literais, regras de negócio, campos, endpoints e demais informações relevantes para a análise de teste. Gera um arquivo consolidado de requisitos em output/requisitos_extraidos.md.
allowed-tools: Read Write Bash Glob Grep
---

# Leitura e Interpretação de Documentos

## Objetivo

Ler TODOS os arquivos da pasta `docs/` e extrair informações relevantes para a criação de casos de teste. Consolidar tudo em `output/requisitos_extraidos.md`.

## Tipos de Arquivo Suportados

| Extensão | Tipo | O que extrair |
|----------|------|---------------|
| `.docx` | Discovery / Spike | Regras de negócio, textos de interface, mensagens, campos, fluxos |
| `.xlsx` | Quebra de atividades | Atividades de "Execução de testes" (título + descrição) |
| `.rb` | Migrations | Tabelas criadas/alteradas, colunas, índices, constraints, FKs |
| `.json` | Responses de API | Status codes, mensagens de erro/sucesso, formato de payloads |
| `.xml` | Exemplo TestLink | Estrutura de referência para casos de teste |
| `.xmind` | Exemplo de AT | Estrutura de referência para organização do XMind |

## Processo de Extração

### Para documentação Discovery/Spike (.docx):
1. Ler o documento completo
2. Extrair e listar:
   - **Regras de negócio** (sem incluir numeração RN no XMind final)
   - **Textos literais**: tooltips, placeholders, labels, mensagens de toast (sucesso e erro), títulos de modais, corpos de modais, textos de botões
   - **Campos e tipos**: texto, número, data, select, switch, checkbox, radio, etc.
   - **Limites de caracteres** e validações de cada campo
   - **Endpoints de API**: método HTTP, URL, payload esperado, responses
   - **Feature flags** mencionadas
   - **Perfis de usuário** envolvidos (Admin, Gestor, Instrutor, Aluno, Super Admin)
   - **Fluxos de navegação**: como chegar à funcionalidade

### Para planilha de quebra de atividades (.xlsx):
1. Identificar a aba correta (geralmente "dev-qa" ou a primeira aba)
2. Filtrar atividades onde a coluna "Tipo da atividade" (ou "tipo (*)") = "Execução de testes"
3. Extrair: título da atividade e descrição
4. Listar as suítes de teste na ordem da planilha

### Para migrations (.rb):
1. Identificar tabelas criadas (`create_table`) e alteradas (`add_column`, `add_index`, etc.)
2. Mapear colunas, tipos de dados, constraints (NOT NULL, DEFAULT, FK)
3. Identificar relacionamentos entre tabelas (foreign keys, polimorfismo)

### Para responses de API (.json):
1. Categorizar por endpoint e cenário (sucesso, erro)
2. Extrair status codes, mensagens de erro exatas, formato do body
3. Identificar diferenças entre versões (V1 vs V2, se aplicável)

## Formato de Saída

Gerar o arquivo `output/requisitos_extraidos.md` com a seguinte estrutura:

```markdown
# Requisitos Extraídos - [Nome do Projeto]

## 1. Informações Gerais
- Tipo de projeto: [UI / API / Bloqueio / SSO / Misto]
- Feature flags: [lista]
- Perfis envolvidos: [lista]

## 2. Suítes de Teste (da planilha)
| # | Título | Descrição |
|---|--------|-----------|
| 1 | ...    | ...       |

## 3. Regras de Negócio
[Lista completa das regras extraídas]

## 4. Textos Literais
### Tooltips
### Placeholders
### Labels
### Toast Messages (Sucesso)
### Toast Messages (Erro)
### Modais (Título + Corpo + Botões)
### Mensagens de Validação

## 5. Campos e Validações
| Campo | Tipo | Obrigatório | Limite | Validação |
|-------|------|-------------|--------|-----------|

## 6. Endpoints de API (se aplicável)
| Método | URL | Payload | Sucesso | Erro |
|--------|-----|---------|---------|------|

## 7. Banco de Dados (se migrations fornecido)
### Tabelas Criadas
### Tabelas Alteradas
### Relacionamentos

## 8. Observações Adicionais
[Qualquer informação relevante não categorizada acima]
```

## Importante

- Usar `python3` com `openpyxl` para ler arquivos `.xlsx`
- Usar `python3` com `python-docx` para ler arquivos `.docx` (se necessário)
- Se algum arquivo não puder ser lido, informar ao usuário e prosseguir com os demais
