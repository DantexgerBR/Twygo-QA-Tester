# Worker - Reversão

**Estes testes NÃO deveriam viver no agent-playwright.** Os 3 TCs testam
um worker backend de reversão da migração de painéis:

1. Reversão restaura dashboard padrão anterior
2. Reversão preserva painéis criados manualmente (não apaga)
3. Reversão é idempotente

Caminho certo: agent-db ou backend test suite (RSpec/equivalente).
Specs em `test.fixme(true, '...')` aguardando QA Lead migrar.
