# Banco histórico

Os 3 TCs testam o worker **HistoricBaseCron**:

1. Exclui registros de `panel_tabs` e `panel_widgets` da organização
2. Preserva registros de outras organizações (isolamento por organization_id)
3. Registra log de tabelas processadas (auditoria)

Out-of-scope para Playwright (igual aos workers de Migração/Reversão).
Pertence ao **agent-db** ou backend test suite. Specs como `test.fixme`
aguardando QA Lead migrar.
