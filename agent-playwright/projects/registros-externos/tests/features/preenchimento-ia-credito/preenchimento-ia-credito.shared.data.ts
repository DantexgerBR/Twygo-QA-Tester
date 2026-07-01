import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

/**
 * Dados compartilhados pela suíte QA 1.15 "Preenchimento com IA e crédito de IA"
 * (org principal — staging-registros-edu, org 37093).
 *
 * Veredito de testabilidade (recon-preenchimento-ia.md, sessão 2026-06-29):
 *  - TC2 (sucesso) CONSOME 1 crédito real de IA — rodar 1×, sem retry.
 *  - TC3/TC4 (modais sem crédito) e TC6 (sparkle TopBar) são fixme: sem
 *    afordância de zerar crédito / sparkle inexistente neste build.
 *  - TC1 parcial: card em add (Admin+Aluno) é testável; ausência em
 *    Visualizar/Avaliar exige registro Externo + Pendente seedados (fixme).
 */
const HERE = dirname(fileURLToPath(import.meta.url));

export const preenchimentoIaData = {
  suiteName: 'Preenchimento com IA e crédito de IA (3 estados e modais por perfil)',
  epic: 'Twygo - Registros de Aprendizagem',

  /** PDF de evidência usado nos uploads (criado no recon). */
  evidencePdfPath: resolve(HERE, '../../../data/fixtures/certificado_ia.pdf'),

  /** Textos canônicos (recon 2026-06-29). */
  text: {
    cardTitle: 'Facilite seu trabalho com nossa IA',
    cardDisclaimer: 'A IA pode cometer erros, verifique as informações',
    successToastTitle: 'Campos preenchidos pela IA',
    disabledToast:
      'Essa funcionalidade não foi habilitada para esse ambiente. Ative ou consulte o responsável para liberar o acesso a essa funcionalidade no menu de Créditos de IA.',
    // Texto REAL do produto (recon live 2026-06-29). A AT dizia
    // "Não foi possível preencher com IA. Tente novamente." — divergente.
    errorToastTitle: 'Não foi possível preencher os campos com IA',
    errorToastBody:
      'Houve uma instabilidade momentânea. Você pode completar os campos manualmente ou tentar novamente em instantes.',
  },
} as const;
