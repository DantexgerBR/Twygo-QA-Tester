/**
 * Dados compartilhados da suíte "Editar registro de aprendizagem".
 *
 * As expectativas abaixo são as DOCUMENTADAS pela AT (RN 42–46). O recon de
 * 2026-06-22 mostrou que o build BETA diverge em vários pontos — os specs
 * asseram a expectativa da AT e deixam a divergência aparecer como falha
 * vermelha (Anti-pattern F do CLAUDE.md: produto diverge → red + comentário).
 *
 * Seed do env (org 37079) cobre apenas: Externo+Pendente, Externo+Emitido (do
 * usuário logado) e Interno+Pendente. Demais combinações da matriz não têm
 * seed → `test.fixme("seed ausente: …")`.
 */
export const editarRegistroData = {
  /** Itens esperados no menu 3-pontos (sem prefixo de ícone). */
  menuItems: {
    editar: 'Editar',
    excluir: 'Excluir',
    visualizar: 'Visualizar',
    evidencias: 'Evidências',
    historico: 'Histórico',
    avaliar: 'Avaliar',
  },

  /**
   * Localizadores de seed por TEXTO da linha (estáveis mesmo quando o badge de situação
   * do certificado não renderiza — ver recon). O Externo Emitido do usuário logado é o
   * único registro com conteúdo "Minicurso"; os Externos Pendentes têm prefixo "QA11".
   */
  externoEmitido: {
    content: 'Minicurso',
    provider: 'Nocode',
  },
  externoPendenteHint: 'QA11',

  headers: {
    aluno: 'Editar registro de aprendizagem',
    admin: 'Editar registro',
  },

  footerButtons: {
    salvarEdicaoAluno: 'Salvar edição',
    salvarAdmin: 'Salvar',
  },

  toasts: {
    edicaoSalva: 'Edição salva',
    registroSalvo: 'Registro salvo',
  },

  banners: {
    verdeEmitido: 'Certificado aprovado',
    vermelhoRecusado: 'Registro de aprendizagem recusado',
  },

  validacao: {
    campoObrigatorio: 'Campo obrigatório',
  },
} as const;
