/**
 * Dados específicos do TC1 — "Opção 'Substituído' aparece no filtro avançado
 * de Status do certificado com flag ON".
 *
 * Pré-condição declarada no MD (suite 09):
 *  - Feature flag `:recertificacao` ATIVA
 *  - Lista de aprendizagem em "/learning_students" para um curso pré-existente
 *
 * Usa `fixedSeed.emptyCursoId` (curso permanente do env staging-recertificacao,
 * orgId 37048). O filtro avançado renderiza mesmo sem participants — o teste
 * só inspeciona o dropdown de opções de Status, não o conteúdo da lista.
 */
import { fixedSeed } from '../../../data/fixed-seed.data.js';

export const tc1Data = {
  eventId: fixedSeed.emptyCursoId,
  optionLabel: 'Substituído',
} as const;
