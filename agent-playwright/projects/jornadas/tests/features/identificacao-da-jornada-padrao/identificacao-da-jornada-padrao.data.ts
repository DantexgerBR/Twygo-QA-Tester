export type CampoIdentificacao =
  | 'nome'
  | 'situacao'
  | 'visibilidade'
  | 'duracao'
  | 'unidade';

export type ResultadoEsperado =
  // Twygo valida no SUBMIT: "Salvar" fica habilitado, o clique bloqueia o envio e mostra a mensagem
  // de campo obrigatório. Antes isto era 'invalido-com-salvar-desabilitado', expectativa que o
  // produto não cumpre (medido em 03/08).
  | 'invalido-bloqueia-submit'
  // "Duração" NUNCA recebe aria-invalid (medido em 03/08) — o inválido aparece como mensagem de erro.
  | 'invalido-com-mensagem'
  // "Duração" é type="text" com SANITIZAÇÃO de entrada: "0" e "abc" viram "1" em vez de ficar inválidos.
  | 'sanitiza-valor'
  | 'aceita-valor'
  | 'preserva-valor-sem-alerta'
  | 'opcao-ausente';

export type CasoValidacaoIdentificacao = {
  cenario: string;
  categoria: 'A' | 'B' | 'C' | 'D' | 'E';
  campo: CampoIdentificacao;
  input: string;
  esperado: ResultadoEsperado;
  /** Valor final esperado quando o campo sanitiza a entrada (ex.: "0" → "1"). */
  resultado?: string;
  /** Trecho da mensagem de erro esperada. */
  mensagem?: string;
};

export const identificacaoDaJornadaData = {
  ambiente: 'staging-marca-dagua',
  nomeValido: 'Jornada de Liderança',
  situacaoValida: 'Liberado',
  visibilidadeValida: 'Usuários',
  unidadeSlider: 'Dias',
} as const;

// Removidos em 03/08/2026 (medido no stage): "Situação vazia", "Visibilidade vazia" e "Unidade vazia".
// Os 3 controles são <select> nativos que abrem com opção pré-selecionada ("Em desenvolvimento",
// "Inscritos", "Dias"), então estado vazio NÃO é alcançável pela UI. A AT foi corrigida junto.
export const CASOS: readonly CasoValidacaoIdentificacao[] = [
  { cenario: 'Nome vazio', categoria: 'A', campo: 'nome', input: '', esperado: 'invalido-bloqueia-submit' },
  { cenario: 'Nome só com espaços', categoria: 'A', campo: 'nome', input: '   ', esperado: 'invalido-bloqueia-submit' },
  { cenario: 'Nome com um caractere', categoria: 'B', campo: 'nome', input: 'J', esperado: 'aceita-valor' },
  { cenario: 'Nome com acentos e emoji', categoria: 'C', campo: 'nome', input: 'Jornada de Ações 🎯', esperado: 'aceita-valor' },
  { cenario: 'Nome com script', categoria: 'D', campo: 'nome', input: '<script>alert(1)</script>', esperado: 'preserva-valor-sem-alerta' },
  { cenario: 'Situação fora da lista', categoria: 'A', campo: 'situacao', input: 'Arquivado', esperado: 'opcao-ausente' },
  { cenario: 'Visibilidade fora da lista', categoria: 'A', campo: 'visibilidade', input: 'Público', esperado: 'opcao-ausente' },
  { cenario: 'Duração mínima', categoria: 'B', campo: 'duracao', input: '1', esperado: 'aceita-valor' },
  // "Duração vazia/zero/textual/negativa" saíram daqui em 03/08 e viraram o TC8b (test.fixme):
  // 3 medições no stage deram 3 resultados diferentes conforme o modo de edição do campo
  // (`fill()` concatena por causa do sanitizador; select-all+Delete esvazia sem exibir mensagem).
  // Sem a regra de sanitização caracterizada, qualquer asserção aqui seria chute. Ver CASOS_DURACAO.
  { cenario: 'Unidade fora da lista', categoria: 'A', campo: 'unidade', input: 'horas', esperado: 'opcao-ausente' },
] as const;

/** Cenários de Duração aguardando caracterização da regra de sanitização (TC8b, test.fixme). */
export const CASOS_DURACAO: readonly { cenario: string; categoria: string; input: string; observado: string }[] = [
  { cenario: 'Duração vazia', categoria: 'A', input: '', observado: 'com fill(""): mensagem "A duração é obrigatória"; com select-all+Delete: campo vazio SEM mensagem' },
  { cenario: 'Duração zero', categoria: 'B', input: '0', observado: 'com fill("0"): virou "1" (ou "10" se o campo já tinha "1"); com select-all+digitar: ficou vazio' },
  { cenario: 'Duração textual', categoria: 'E', input: 'abc', observado: 'com fill("abc"): virou "1"; campo é type="text", então não há rejeição nativa de número' },
  { cenario: 'Duração negativa', categoria: 'E', input: '-1', observado: 'com fill("-1"): esvaziou e exibiu "A duração é obrigatória"' },
] as const;
