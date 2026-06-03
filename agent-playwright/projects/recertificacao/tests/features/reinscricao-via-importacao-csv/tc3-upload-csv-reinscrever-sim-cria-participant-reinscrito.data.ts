/**
 * Dados específicos do TC3 — "Upload de CSV com `Reinscrever=SIM` para
 * usuário existente cria participant reinscrito".
 *
 * Pré-condições declaradas no MD (Suite 04):
 *  - Curso com `has_recertification = true` pré-existente.
 *  - Aluno elegível pré-cadastrado e com inscrição concluída no curso (para
 *    bypassar o erro `:in_use`).
 *
 * Convenção de e-mail worker-isolated: aluno fictício pré-existente do seed
 * é reutilizado entre runs (mesmo e-mail). O backend incrementa
 * `recertification_number` a cada upload SIM — então cada run cria 1 novo
 * participant para o mesmo aluno. Sem cleanup direto (Anti-pattern G se
 * fosse criação de recurso). Cleanup completo via DB; UI não expõe deletar
 * participants reinscritos individualmente.
 *
 * REVISAR-SEED: validar email + eventId antes da primeira execução.
 */
export const tc3Data = {
  eventId: 2,
  // Aluno pré-cadastrado e inscrito no curso. REVISAR-SEED.
  alunoElegivelEmail: 'aluno-elegivel-tc3@example.com',
  alunoElegivelNome: 'Aluno Elegível TC3',
  // CSV content montado in-line (sem arquivo no disco — buffer via setInputFiles).
  // REVISAR-FIGMA: ordem/nome das colunas do template ainda não confirmado.
  // Assumimos `Nome,Email,Reinscrever` como header mínimo do template.
  csvContent: `Nome,Email,Reinscrever
Aluno Elegível TC3,aluno-elegivel-tc3@example.com,SIM`,
  csvFileName: 'participants-reenroll-tc3.csv',
} as const;
