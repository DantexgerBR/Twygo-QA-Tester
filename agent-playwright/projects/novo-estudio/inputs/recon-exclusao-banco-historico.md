# Recon — QA 1.18 "Exclusão do Banco Histórico" (Tipo: db)

**Data**: 2026-06-09 · **Org**: 37061 · **Card**: 19722 · **Modo**: análise de
viabilidade (não há acesso a banco para executar).

## TC1 — o que pede

Validar que, ao **excluir uma organização**, os registros são apagados das
tabelas: `studio_generation_partitions`, `activity_summaries`,
`org_generation_preferences`, `user_course_preferences`, `conversations`,
`messages`, `event_contents` (MySQL/PostgreSQL) + `studio_checkpoints`,
`messages` (DynamoDB).

> Nota: a AT mistura "MySQL" (objetivo) e "PostgreSQL" (passos) para as mesmas
> tabelas — inconsistência a revisar com o AT/dev.

## Bloqueios (3 independentes)

1. **Exclusão destrutiva**: o TC pressupõe uma org já excluída. Excluir é
   destrutivo — inviável na 37061 (org principal). Exigiria provisionar org
   Trial descartável, povoar com dados de Estúdio, excluí-la, então verificar.
2. **Multi-banco**: tabelas em MySQL + PostgreSQL + DynamoDB. Sem acesso a
   PostgreSQL nem DynamoDB neste agente.
3. **Sem acesso a banco**: `agent-playwright/.env` não tem `DB_*_RC`; `agent-db`
   é esqueleto. Não há conexão read-only configurada aqui.

## Veredito (a alinhar com João — solicitante)

**❌ Bloqueado — não executável neste ambiente.** Executor real é `agent-db`
(CONTRACT.md) quando houver acesso aos 3 bancos + uma org descartável excluída.
1 spec gerado em `test.fixme`. **Execução**: 1 skipped.

> Relacionada: a suíte "Tabelas do Banco de Dados" (TC1–TC9, [Validação Manual]
> DESCRIBE) também depende de acesso a banco. A suíte "Tabela de Logs" está
> ⛔ BLOQUEADA na AT (logging não implementado, dev Jeiel 08/06).
