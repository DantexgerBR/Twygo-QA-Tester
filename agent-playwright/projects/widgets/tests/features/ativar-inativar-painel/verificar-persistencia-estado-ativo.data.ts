/**
 * Dados específicos do TC5 "Verificar persistência do estado Ativo após
 * reload". Convenção: §3.1 do CLAUDE.md.
 *
 * useModeIds documentam o env (não usados diretamente no spec — TC5 é
 * estado-local, sem associação a modos de uso).
 */
export const data = {
  useModeIds: [70077, 70078] as const,
} as const;
