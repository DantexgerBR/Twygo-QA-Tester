# Trial

Os 4 TCs validam criação/exclusão de trial com painéis pré-definidos:

1. Criação via URL — Super Admin cria trial; painéis pré-configurados aparecem
2. Criação via API — out-of-scope Playwright (teste de API)
3. Exclusão remove dados pré-definidos (SophiaTech)
4. Exclusão remove dados criados pelo Admin

**Bloqueio**: criação/exclusão de trial muda estado global do ambiente
(infra Super Admin) e requer alinhamento com QA Lead sobre revert. Não
seguro rodar em automatizado sem isolamento próprio.

Specs `test.fixme(true, ...)` até estratégia definida.
