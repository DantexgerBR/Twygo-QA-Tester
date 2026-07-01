import { resolve } from 'node:path';

export const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

export const provedoresData = {
  epic: 'Twygo - Registros de Aprendizagem',
  suiteName: 'CRUD de Provedores e bloqueio de exclusão com vínculo',
  // Fixture "com vínculo" confirmada em probe 2026-06-25: Alura = 198 registros
  // vinculados (FGV = 1). Usada read-only no TC9 e como provedor inativável no TC7.
  linkedProvider: 'Alura',
  expectedColumns: ['Nome', 'Website', 'Descrição', 'Ativo', 'Criado em'],
} as const;

/** Nome worker-isolated para provedores criados pelos testes (cleanup por nome). */
export function makeName(tc: string, worker: number): string {
  return `Prov ${tc} w${worker}-${Date.now()}`;
}
