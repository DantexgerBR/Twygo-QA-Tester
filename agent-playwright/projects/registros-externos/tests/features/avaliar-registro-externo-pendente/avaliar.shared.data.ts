import { resolve } from 'node:path';

export const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

export const avaliarData = {
  epic: 'Twygo - Registros de Aprendizagem',
  suiteName: 'Avaliar registro externo pendente (Aprovar/Recusar com justificativa)',
} as const;

/** Marker worker-isolado para a massa criada por cada TC (cleanup por marker). */
export function makeMarker(tc: string, worker: number): string {
  return `AV-${tc}-w${worker}-${Date.now()}`;
}
