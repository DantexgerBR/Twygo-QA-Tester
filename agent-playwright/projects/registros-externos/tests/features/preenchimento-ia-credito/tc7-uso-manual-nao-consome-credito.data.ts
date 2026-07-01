/**
 * Dados do TC7 — preenchimento MANUAL (sem IA). O registro NÃO é persistido
 * (o POST de criação é abortado no spec) porque um registro manual auto-aprova
 * e fica indeletável nesta org (bug de produto — ver cabeçalho do spec). Logo
 * não há marker de cleanup; `content` é só um rótulo fixo pro campo Conteúdo.
 */
export const tc7Data = {
  content: 'QA-TC7-MANUAL (não persistido)',
  experience: 'Curso',
  category: 'Tecnologia',
  workload: '40:00:00',
  endDate: '2026-05-10',
  provider: 'Alura',
} as const;
