/**
 * Dados compartilhados pela suíte de marca d'água em vídeo.
 * Constantes específicas de cada TC ficam em <tc>.data.ts ao lado do spec.
 */

export const marcaDaguaSharedData = {
  /** Evento principal — "Construindo times de alta performance" */
  eventoId: 787696,

  /** Evento destino — para duplicação (TC-1598) */
  eventoDestinoId: 787697,

  /** Atividade de vídeo interno com marca d'água configurada */
  atividadeVideoId: 9280032,

  /** Atividade de vídeo externo (youtube/vimeo) — sem opção de marca */
  atividadeExternoId: 9187421,

  /** Atividade de vídeo no evento destino */
  atividadeVideoDestinoId: 9280224,

  /** Org principal */
  orgId: 36675,

  /** Tipos de mídia que NÃO expõem a seção de marca d'água */
  tiposSemMarcaDagua: [
    { valor: 'text', rotulo: 'Texto' },
    { valor: 'page', rotulo: 'Página' },
    { valor: 'lesson', rotulo: 'Aula' },
    { valor: 'pdf', rotulo: 'PDF Estampado' },
    { valor: 'external', rotulo: 'Vídeo Externo' },
    { valor: 'questions', rotulo: 'Questionário' },
    { valor: 'scorm', rotulo: 'Scorm' },
    { valor: 'games', rotulo: 'Games' },
  ],
} as const;
