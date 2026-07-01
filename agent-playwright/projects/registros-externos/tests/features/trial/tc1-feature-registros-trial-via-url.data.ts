/**
 * Dados do TC1 — registro Externo criado pela UI na org Trial.
 * `content` é único por worker+run (projeto registros-externos NÃO faz
 * cleanup — seed/dado criado persiste entre runs; ver memory
 * `registros-externos-sem-cleanup-seed-persistente`). Unicidade evita
 * colisão de strict-mode na asserção da listagem.
 */
export function buildTc1RecordInput(workerIndex: number) {
  const stamp = `w${workerIndex}-${Date.now()}`;
  return {
    contentMarker: `Registro Trial QA TC1 ${stamp}`,
    provider: `Provedor QA Trial ${stamp}`,
    experience: 'Curso',
    category: 'Tecnologia',
    workload: '40:00:00',
    endDate: '2026-05-10',
  } as const;
}
