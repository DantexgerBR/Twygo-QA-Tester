import { expect, type Page } from '@playwright/test';
import { dismissCommonModals } from '../../../src/utils/modals.js';
import { JourneyIdentificationPage } from '../pages/JourneyIdentificationPage.js';
import { JourneySchedulePage } from '../pages/JourneySchedulePage.js';
import { JourneyListPage } from '../pages/JourneyListPage.js';

/** Abas do form de Jornada Padrão → `data-test-id` (do recon; conferidos ao vivo em 03/08). */
export const ABAS = {
  identificacao: 'tab-identification',
  acesso: 'tab-access',
  banner: 'tab-banner',
  cronograma: 'tab-schedule',
  aprovacao: 'tab-approval',
  time: 'tab-team',
  inscricao: 'tab-subscription',
  aprendizagem: 'tab-learning',
  acoesAutomaticas: 'tab-automatic_actions',
} as const;

/**
 * Abre uma aba do form pelo `data-test-id`, esperando ela deixar de estar `disabled`.
 *
 * ⚠️ NÃO usar `clickTabWhenEnabled(page, 'Cronograma')` (que busca por `getByRole('tab', {name})`)
 * aqui: a barra de abas ROLA horizontalmente (existem `tabs-scroll-left`/`tabs-scroll-right`) e a busca
 * por nome acessível falhou com *element(s) not found* em 3 runs de 03/08, de forma intermitente. Os
 * `data-test-id` das 9 abas estão sempre no DOM — é o ancoradouro estável.
 *
 * O `toBeEnabled` continua necessário: a aba nasce `disabled` e só libera após o save
 * (skill testar-tabs-progressivas-twygo).
 */
/**
 * Fecha os avisos que a Twygo sobe sozinha no meio da sessão e que **interceptam pointer events**.
 *
 * `dismissCommonModals` (src/utils/modals.ts) cobre o NPS "Sofia" — procura "Pergunte depois". Mas em
 * 03/08 apareceu OUTRO: `dialog "sofia — Quatro novidades para facilitar o seu dia a dia"`, um carrossel
 * de novidades com iframes do YouTube dentro, que a helper da casa não conhece e que só fecha pelo
 * `button "Close"`. Ele bloqueou cliques diferentes em 3 runs seguidos (aba, Salvar, campo Duração) e
 * foi a causa real do que eu vinha tratando como "flakiness sob paralelismo".
 *
 * Idempotente e tolerante: se não houver aviso, não faz nada.
 */
export async function fecharAvisosTwygo(page: Page): Promise<void> {
  await dismissCommonModals(page).catch(() => null);
  const aviso = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'Close' }) });
  for (let i = 0; i < 3; i++) {
    if (!(await aviso.first().isVisible().catch(() => false))) return;
    await aviso.first().getByRole('button', { name: 'Close' }).click({ timeout: 5_000 }).catch(() => null);
    await expect(aviso.first()).toBeHidden({ timeout: 10_000 }).catch(() => null);
  }
}

export async function abrirAba(page: Page, aba: (typeof ABAS)[keyof typeof ABAS]): Promise<void> {
  // Dispensa ANTES do clique: `safeGoto` já dispensa na navegação, mas trocar de aba não navega, e o
  // aviso pode ter subido no meio do teste.
  await fecharAvisosTwygo(page);
  const tab = page.getByTestId(aba);
  await expect(tab).toBeEnabled({ timeout: 60_000 });
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 15_000 });
}

export type ContextoJornada = {
  nome: string;
  id: string;
  identificacao: JourneyIdentificationPage;
  cronograma: JourneySchedulePage;
  listagem: JourneyListPage;
};

/**
 * Cria uma Jornada Padrão, roda o corpo do teste e APAGA no fim.
 *
 * Existe porque as tabs do form são progressivas: `Acesso`, `Cronograma`, `Banner` etc. nascem
 * `disabled` e só liberam depois do save (skill testar-tabs-progressivas-twygo). Ou seja, toda suíte
 * além de "Identificação" cria estado — e por isso precisa devolver o ambiente ao lugar
 * (skill limpar-dados-de-teste-twygo).
 *
 * Cleanup em `finally` e NÃO em `afterAll` de propósito: em 03/08 dois testes morreram no teardown do
 * `exploratory-fixture` (timeout), e mesmo assim a org ficou limpa porque o `finally` roda antes.
 */
export async function comJornada(
  page: Page,
  ambiente: string,
  rotulo: string,
  workerIndex: number,
  corpo: (ctx: ContextoJornada) => Promise<void>,
): Promise<void> {
  const identificacao = new JourneyIdentificationPage(page, ambiente);
  const cronograma = new JourneySchedulePage(page);
  const listagem = new JourneyListPage(page, ambiente);
  // Nome único por worker: a org é compartilhada e runs concorrem.
  const nome = `Jornada ${rotulo} w${workerIndex}-${Date.now()}`;
  const id = await identificacao.criar(nome);
  try {
    await corpo({ nome, id, identificacao, cronograma, listagem });
  } finally {
    await listagem.excluirPorNome_safe(nome);
  }
}

/**
 * Jornada com uma fase e N tarefas — massa mínima para as regras que dependem de "período das tarefas"
 * (recálculo de duração, linha de base, reagendamento).
 *
 * Devolve a **SOMA** dos períodos, que é o valor que a especificação manda aparecer em "Duração" com o
 * switch de prolongamento ativo (`docs/especificacao.docx` §4.1.2: *"calculado automaticamente somando
 * os períodos das tarefas configuradas no cronograma"*). Passe 2+ durações para o teste distinguir SOMA
 * de MAIOR PERÍODO — com uma tarefa só as duas leituras dão o mesmo número, e foi assim que a AT
 * conseguiu documentar "maior período" sem ninguém notar.
 */
export async function semearCronograma(
  ctx: ContextoJornada,
  duracoesDias: number[],
  nomes: { fase?: string; tarefa?: string } = {},
): Promise<number> {
  const fase = nomes.fase ?? 'Fase seed';
  const base = nomes.tarefa ?? 'Tarefa seed';
  await ctx.cronograma.abrir();
  await ctx.cronograma.adicionarFase(fase, 1, Math.max(...duracoesDias));
  let dia = 1;
  for (const [i, duracao] of duracoesDias.entries()) {
    await ctx.cronograma.adicionarTarefa(`${base} ${i + 1}`, { fase, diaInicio: dia, duracao, tipo: 'manual' });
    dia += duracao;
  }
  return duracoesDias.reduce((a, b) => a + b, 0);
}
