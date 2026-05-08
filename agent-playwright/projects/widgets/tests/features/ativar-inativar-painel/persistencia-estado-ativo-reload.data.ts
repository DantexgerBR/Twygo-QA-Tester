/**
 * Dados específicos do testcase "Verificar persistência do estado Ativo
 * após reload". Convenção: §3.1 do CLAUDE.md.
 *
 * `panelName` aponta para um painel desassociado do seed (validado live
 * em 2026-05-06: toggle imediato, sem modal de bloqueio). Se virar
 * associado no futuro, o teste quebra com o modal — healer deve trocar
 * para outro painel desassociado E atualizar o nome aqui (não no spec).
 *
 * Painel 30 escolhido para minimizar conflito com TC1/TC2 (que tocam em
 * "Painel QA Teste") e com suítes anteriores que tendem a operar em
 * Painel 1..N.
 */
export const persistenciaEstadoAtivoReloadData = {
  panelName: 'Painel 30',
} as const;
