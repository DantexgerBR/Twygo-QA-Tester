# Worker - Migração de painéis

**Estes testes NÃO deveriam viver no agent-playwright.** Os 3 TCs testam
um worker backend (Sidekiq/equivalente) que:

1. Cria painel padrão para organização sem painel pré-existente
2. Não duplica painel quando organização já possui (idempotência)
3. Cria shared events necessários para widgets do painel padrão

A validação correta é **estado de banco + logs**, não UI. Caminho certo:

- **agent-db** (Python — validações em banco): testar criação/idempotência
  no nível dos registros (panels, use_mode_itens, shared_events).
- Backend test suite (RSpec/equivalente) executando o worker e
  validando logs/estado.

Por enquanto os 3 specs estão como `test.fixme(true, '...')`. Destinatário:
QA Lead — alinhar com time qual agente assume estes TCs e migrar.
