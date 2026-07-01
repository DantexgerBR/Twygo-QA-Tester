/**
 * Dados compartilhados pela suíte "Extração de dados e evidências (assíncrona
 * com modal de atenção)".
 *
 * Suíte majoritariamente READ/trigger: dispara extrações (jobs assíncronos que
 * geram e-mail + notificação) mas NÃO muta registros. Por convenção do projeto
 * registros-externos não há cleanup (ver memory sem-cleanup-seed-persistente);
 * disparar uma extração não deixa orphan na listagem.
 *
 * Textos literais conferidos contra o test-analysis.md (§ "Textos literais").
 */
export const extracaoData = {
  suiteName: 'Extração de dados e evidências (assíncrona com modal de atenção)',
  epic: 'Twygo - Registros de Aprendizagem',

  /** Toasts esperados (AT RN 80) — `{N}`/`{comEv}`/`{semEv}` são dinâmicos → assert por regex. */
  toast: {
    dadosCsv: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i,
    evidencias: /Extra[çc][ãa]o iniciada: baixando evid[êe]ncias de \d+ registros \(\d+ sem evid[êe]ncia ignorados\)\./i,
    evidenciasGenerico: /Extra[çc][ãa]o iniciada/i,
  },

  /** Flash inline pós-disparo de Dados (AT TC4 passo 4). */
  flashProcessando: /Sua extra[çc][ãa]o est[áa] sendo processada\. Voc[êe] receber[áa] uma notifica[çc][ãa]o quando estiver pronta\./i,

  /** Corpo do modal "Atenção" (AT RN 78 / TC5). `{N} de {M}` dinâmicos. */
  modalAtencaoBody: /\d+ de \d+ registros no escopo n[ãa]o t[êe]m evid[êe]ncia anexada\. Eles ser[ãa]o ignorados na extra[çc][ãa]o\./i,
} as const;
