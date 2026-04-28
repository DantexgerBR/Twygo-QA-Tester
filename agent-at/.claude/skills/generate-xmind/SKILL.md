---
name: generate-xmind
description: Gera o arquivo .xmind de análise de teste na pasta output/ usando o template da pasta template/. Recebe a estrutura de suítes e casos de teste como script Python e produz o arquivo final. Use após a criação dos casos de teste.
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Geração do Arquivo XMind

## Objetivo

Gerar o arquivo `.xmind` final contendo todos os cenários e casos de teste, utilizando o template existente como base para garantir compatibilidade com o XMind desktop.

## Como Funciona

1. Criar um script Python em `output/generate_xmind.py` com todas as suítes e casos de teste
2. O script usa `template/template.xmind` como base (preserva metadata.json e demais arquivos internos)
3. O script substitui apenas o `content.json` com os novos dados
4. O arquivo final é salvo em `output/Analise_Teste_[NOME_PROJETO].xmind`

## Script Base

O script Python DEVE seguir esta estrutura. O código abaixo contém as funções utilitárias obrigatórias. As suítes e casos de teste devem ser adicionados entre os marcadores indicados.

Usar o script disponível em [scripts/generate_xmind.py](scripts/generate_xmind.py) como base.

## Regras Técnicas Críticas

1. **Template obrigatório**: SEMPRE usar o arquivo `template/template.xmind` como base. NUNCA criar um .xmind do zero.
2. **metadata.json**: O campo "creator" no metadata.json DEVE ser um OBJETO `{"name": "...", "version": "..."}`, NUNCA uma string simples. Ao usar o template, isso é preservado automaticamente.
3. **content.json**: É o único arquivo substituído dentro do .xmind. Contém toda a estrutura de tópicos.
4. **IDs únicos**: Cada tópico deve ter um ID único gerado por `uuid.uuid4()`.
5. **structureClass**: Usar `"org.xmind.ui.map.unbalanced"` para todos os tópicos.

## Hierarquia do content.json

```
Sheet (planilha)
└── rootTopic (tópico central: "Análise de Teste - [NOME DO PROJETO]")
    ├── Suíte 1 (tópico filho)
    │   ├── Caso de Teste 1 (com note + markers)
    │   │   ├── Passo 1: Ação (tópico)
    │   │   │   └── Resultado Esperado (tópico filho)
    │   │   └── Passo 2: Ação (tópico)
    │   │       └── Resultado Esperado (tópico filho)
    │   └── Caso de Teste 2
    │       └── ...
    └── Suíte 2
        └── ...
```

## Formato das Notas (notes)

```json
{
  "notes": {
    "plain": {
      "content": "Objetivo do caso de teste.\n[PRECONDITIONS]\nPré-condição 1\nPré-condição 2"
    }
  }
}
```

**IMPORTANTE**: As notas devem estar APENAS no nível do caso de teste, NUNCA nos subtópicos de passos.

## Formato dos Marcadores (markers)

```json
{
  "markers": [{"markerId": "priority-1"}]
}
```

Valores: `priority-1` (Alto), `priority-2` (Médio), `priority-3` (Baixo).

## Após Gerar

1. Contar o total de casos de teste no script (`grep -c "tc(" output/generate_xmind.py`)
2. Listar a distribuição por suíte
3. Informar ao usuário
