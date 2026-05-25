# Logs

Os 9 TCs validam logs do sistema de auditoria após ações UI (criar/editar/
excluir painel/aba/widget). Cada TC executa uma ação UI (testável Playwright)
+ acessa **"tela de logs do sistema (admin de logs)"** — esta UI não está
mapeada no agent atualmente.

**Pendente alinhamento com QA Lead**:
- Existe UI de admin de logs no Twygo? Qual a rota?
- A validação dos campos do log (user_id, organization_id, IP, timestamp,
  diff de campos) deveria viver no agent-playwright OU no agent-db?

Todos os specs com `test.fixme(true, ...)` até confirmação. Quando a rota
de admin de logs for mapeada, ou quando ficar decidido que valida via DB,
mover os TCs apropriadamente.
