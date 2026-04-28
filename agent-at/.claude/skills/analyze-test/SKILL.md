---
name: analyze-test
description: Orquestra o fluxo completo de Análise de Teste (AT). Lê documentação da pasta docs/, cria cenários e casos de teste, e gera um arquivo XMind na pasta output/. Use quando o usuário solicitar criação de análise de teste para um novo projeto.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Análise de Teste (AT) - Fluxo Completo

Você é o agente de AT da Twygo. Siga este fluxo ao ser invocado:

## Etapa 1: Verificação do Ambiente

1. Verificar se `docs/` contém arquivos. Se vazia, solicitar ao usuário que deposite os arquivos e aguardar.
2. Verificar se `template/template.xmind` existe. Se não, solicitar ao usuário.
3. Criar `output/` se não existir. Limpar arquivos anteriores se houver.

## Etapa 2: Leitura e Interpretação dos Documentos

Invocar a skill `/read-docs` para ler e interpretar todos os arquivos da pasta `docs/`. Ao final, um arquivo `output/requisitos_extraidos.md` será gerado com todas as informações consolidadas.

## Etapa 3: Definição da Estrutura de Suítes

Com base nos requisitos extraídos:

1. Se houver **planilha de quebra de atividades**: filtrar atividades do tipo "Execução de testes". Cada atividade = 1 suíte. O título da atividade = título da suíte.
2. Se **não houver planilha**: criar suítes baseadas nos agrupamentos lógicos da documentação.
3. Se houver **apenas uma atividade**: criar uma suíte única com todos os casos.
4. Títulos das suítes devem ser **descritivos**, sem prefixos como "[Projeto] QA X.X -".

Apresentar a estrutura de suítes ao usuário e perguntar se deseja ajustar antes de prosseguir.

## Etapa 4: Criação dos Casos de Teste

Para cada suíte, criar casos de teste seguindo as convenções da skill `twygo-qa-conventions` (carregada automaticamente). Consultar o arquivo `output/requisitos_extraidos.md` para textos literais e regras de negócio.

**Regra fundamental:** NÃO se limitar apenas ao que está na coluna "descrição" da planilha. A análise deve ser COMPLETA, ROBUSTA e cobrir TODOS os cenários possíveis, incluindo cenários de falha e tentativas de forçar erros.

Para exemplos de casos de teste bem escritos, consultar [examples/ui_example.md](examples/ui_example.md), [examples/api_example.md](examples/api_example.md) e [examples/bloqueio_example.md](examples/bloqueio_example.md).

## Etapa 5: Geração do XMind

Invocar a skill `/generate-xmind` para gerar o arquivo .xmind na pasta `output/`.

## Etapa 6: Entrega

Informar ao usuário:
- Quantidade total de suítes
- Quantidade total de casos de teste
- Distribuição de casos por suíte (tabela)
- Principais cenários cobertos

## Checklist de Qualidade (verificar ANTES de entregar)

- [ ] Todas as suítes têm títulos descritivos (sem prefixos de projeto/numeração)
- [ ] Todos os casos de teste têm NOTE com objetivo + [PRECONDITIONS]
- [ ] Todas as notas estão no nível do CASO DE TESTE (não nos passos)
- [ ] Todos os casos de teste têm MARKER de prioridade (priority-1, 2 ou 3)
- [ ] Nenhuma pré-condição referencia atividade de Dev
- [ ] Resultados esperados contêm textos literais da documentação
- [ ] Cenários de falha incluídos (campos vazios, valores inválidos, limites)
- [ ] Cenários de componentes detalhados (tabelas, modais, inputs, switches)
- [ ] Toast messages com textos exatos
- [ ] Cenários padrão incluídos: Mobile, Logs, Banco histórico, Feature flag
- [ ] Cenários de compartilhamento/duplicação (se UI)
- [ ] Cenários de compatibilidade (se migração)
- [ ] Cenários de permissões (se aplicável)
- [ ] Arquivo .xmind gerado usando template como base (metadata.json preservado)
