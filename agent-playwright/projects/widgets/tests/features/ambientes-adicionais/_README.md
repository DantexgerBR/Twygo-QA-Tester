# Ambientes adicionais

Os 3 TCs validam funcionalidade de Painéis em **ambientes adicionais**
(multi-tenant — uma org pode ter "ambientes adicionais" além do principal):

1. Funcionalidade disponível em ambiente adicional
2. Isolamento de dados (painéis do principal não aparecem no adicional)
3. Modo de uso configurado em ambiente adicional usa painel local

**Bloqueio**: nenhum dos 4 envs configurados (`staging`, `staging-without-credits`,
`staging-widgets`, `staging-widgets-disabled`) representa um ambiente
adicional dentro de uma org existente. A infraestrutura de "ambiente
adicional" não está mapeada no agente.

Specs com `test.fixme(true, ...)` aguardando DevOps configurar env
adicional OU QA Lead confirmar caminho de criação de ambiente.
