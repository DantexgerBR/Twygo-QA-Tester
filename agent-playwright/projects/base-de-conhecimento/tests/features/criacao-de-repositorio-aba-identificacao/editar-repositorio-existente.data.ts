// Dados do TC6 — Editar repositório existente
//
// Audit chrome-devtools-mcp 2026-05-21: env staging-base-de-conhecimento tem
// 51 repositórios na API REST (25 visíveis na UI). beforeAll do spec provisiona
// 1 repositório com o nome `repoNameOriginal` antes do test e o afterAll limpa
// via deleteRepositoryByNameSafe usando o nome editado (Anti-pattern G).
//
// Ambos worker-isolated para evitar colisão em runs paralelos.
// Descrição/Categoria/Classificação fixos — só o Nome muda (o que o TC valida).
//
// Toast esperado pós-Salvar confirmado via spec TC1 análogo:
// "Repositório de conhecimento atualizado com sucesso".
// REVISAR-FIGMA: se na edição o toast for diferente do criar, ajustar.
export const tc6DataFactory = (workerIndex: number) => ({
  repoNameOriginal: `Repositório TC6 w${workerIndex}-${Date.now()}`,
  repoNameEditado: `Repositório TC6 editado w${workerIndex}-${Date.now()}`,
  descricao: 'Repositório de teste — TC6 valida fluxo de edição.',
  categoria: 'Geral',
  classificacao: 'Interno',
  toastSucessoEdicao: 'Repositório de conhecimento atualizado com sucesso',
});
