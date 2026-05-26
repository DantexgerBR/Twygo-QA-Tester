/**
 * Dados de teste para a suíte "Filtros e busca de repositórios".
 *
 * Seed confirmada live em 2026-05-21 no env staging-base-de-conhecimento (orgId 37007):
 *   - 25+ repositórios cadastrados acumulados de outras suítes (Cobertura Completa,
 *     Upload PDF/DOCX/JPG/PNG, Repo Fonte MP3/MP4/PDF, etc.).
 *   - "Repositório TC1 w2-1779363231364" com Categoria='Geral' e Classificação='Interno'.
 *   - Vários repositórios com Categoria diferente ('Cat w2-...', 'Cat w1-...').
 *
 * 2026-05-21: bug CORS de get_categories_suggest está RESOLVIDO. Porém, um
 * NOVO bug surgiu no fluxo TC2/TC3: GET /knowledge_repositories?...
 * &filter_cache_key=quick_filter:* retorna HTTP 500 (Rails TypeError
 * "no implicit conversion of String into Integer"). POST /filters retorna
 * 200 (filtro salvo), mas a listagem subsequente quebra. Frontend engole
 * silenciosamente. TC2/TC3 ficam FAILING (não fixme) até dev corrigir.
 * Detalhes nos comentários dos respectivos specs.
 *
 * TC4 segue usando filtro padrão "Bases sem fontes" por design (cobre
 * cenário de filtro padrão sem dependência do controller bugado).
 *
 * Seed verificada via API REST 2026-05-21: dos 51 repositórios na lista,
 * apenas 1 tem Categoria='Geral' E Classificação='Interno' simultaneamente
 * — suficiente para TC2/TC3 (asserção é "ao menos 1 linha").
 */
export const filtrosBuscaData = {
  /** Query usada no TC1 — buscar repositório por nome. */
  buscaQuery: 'Repositório TC1',

  /** Nome esperado no resultado da busca TC1. */
  nomesEsperados: ['Repositório TC1'],

  /** Valor de Categoria para filtro (TC2, TC3, TC4). */
  categoriaFiltro: 'Geral',

  /** Valor de Classificação para filtro (TC3). */
  classificacaoFiltro: 'Interno',

  /** Categoria usada no setup do TC4. */
  categoriaParaSetup: 'Geral',

  /**
   * Número mínimo de repositórios esperados na listagem sem filtro.
   * Pré-condição global: a seed do env deve ter ao menos 3 repositórios.
   */
  totalMinimoSemFiltro: 3,
} as const;
