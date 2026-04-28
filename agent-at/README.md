# Agente de Análise de Teste (AT) - Twygo

Agente automatizado para criação de cenários e casos de teste em formato XMind, pronto para importação no TestLink.

## Requisitos

- [Claude Code](https://code.claude.com/) com licença ativa
- XMind desktop (para visualizar os arquivos gerados)
- Python 3.x (disponível no ambiente do Claude Code)

## Estrutura do Projeto

```
twygo-qa-agent/
├── CLAUDE.md                          # Configurações globais do agente
├── README.md                          # Este arquivo
├── docs/                              # Depositar arquivos de entrada aqui
├── output/                            # Arquivos gerados pelo agente
├── template/                          # Template XMind base
│   └── template.xmind                 # (copiar seu arquivo de template aqui)
└── .claude/
    └── skills/
        ├── analyze-test/              # Skill principal (fluxo completo)
        │   ├── SKILL.md
        │   ├── examples/              # Exemplos de casos de teste
        │   │   ├── ui_example.md
        │   │   ├── api_example.md
        │   │   └── bloqueio_example.md
        │   └── scripts/
        │       └── generate_xmind.py  # Script Python base
        ├── read-docs/                 # Skill de leitura de documentos
        │   └── SKILL.md
        ├── generate-xmind/            # Skill de geração do XMind
        │   └── SKILL.md
        └── twygo-qa-conventions/      # Convenções de QA (carregado automaticamente)
            └── SKILL.md
```

## Como Usar

### Setup Inicial (apenas uma vez)

1. Clonar ou copiar este projeto para o seu ambiente
2. Copiar o arquivo XMind de template para `template/template.xmind`
3. Abrir o projeto no Claude Code

### Para Cada Novo Projeto

1. Depositar os arquivos de documentação na pasta `docs/`:
   - Documentação do projeto (Discovery/Spike `.docx`)
   - Planilha de quebra de atividades (`.xlsx`)
   - Arquivos complementares (migrations `.rb`, responses `.json`, etc.)

2. No Claude Code, executar:
   ```
   /analyze-test
   ```

3. O agente irá:
   - Ler todos os arquivos de `docs/`
   - Extrair requisitos e textos literais
   - Criar suítes e casos de teste detalhados
   - Gerar o arquivo XMind em `output/`

4. Revisar o XMind gerado e solicitar ajustes se necessário

### Skills Disponíveis

| Comando | Descrição |
|---------|-----------|
| `/analyze-test` | Fluxo completo de análise de teste |
| `/read-docs` | Apenas leitura e interpretação dos documentos |
| `/generate-xmind` | Apenas geração do arquivo XMind (após casos já definidos) |

A skill `twygo-qa-conventions` é carregada automaticamente pelo Claude quando relevante.

## Tipos de Projeto Suportados

- **UI/Funcional**: Validações de interface, campos, componentes, navegação
- **API**: Endpoints REST, status codes, payloads, autenticação
- **Bloqueio/Contrato**: Modais de bloqueio, downgrade, Super Admin
- **SSO/Integração**: Login SSO, sincronização, workers
- **Misto**: Combinação dos tipos acima
