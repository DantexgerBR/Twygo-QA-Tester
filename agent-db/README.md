# agent-db — Agente de Validação em Banco de Dados (Twygo QA)

Agente especializado em executar validações diretas em banco de dados
acionadas por casos de teste. Faz parte do monorepo `AgentesQA` ao lado de
`agent-at` (análise de teste) e `agent-playwright` (E2E frontend).

> **Status**: estrutura inicial — skills ainda em esqueleto. Veja
> [CLAUDE.md](CLAUDE.md) para a especificação completa.

## Quando acionar este agente

- Caso de teste exige verificação de **registro/contagem em tabela**
- Validar **integridade de FK / remapeamento** entre organizações
- Conferir **definição de view** (existência, colunas, retorno esperado)
- Comparar dados entre duas orgs (de-para herdado do `migration-validator`)

Casos típicos no projeto **Créditos de IA — Fase 02**:
- `Armazenar logs da indexação e agente de atendimento`
- `Criar view para acompanhamento de consumo de créditos (view interna)`

## Quickstart

```bash
cd agent-db
python -m venv venv && source venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env  # editar com credenciais read-only
python -m src.main --help
```

## Mais

- Especificação técnica: [CLAUDE.md](CLAUDE.md)
- Skills: [.claude/skills/](.claude/skills/)
- Projeto-base de onde herdamos engine e batch validator: [Twygo/migration-validator](https://github.com/Twygo/migration-validator)
