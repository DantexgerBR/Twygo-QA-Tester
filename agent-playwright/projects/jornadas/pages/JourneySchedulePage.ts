import { expect, type Locator, type Page } from '@playwright/test';
import { ABAS, abrirAba } from '../utils/journey-lifecycle.js';

export type TipoTarefa = 'learning' | 'appointment' | 'manual' | 'message';

/**
 * Aba "Cronograma" (Kanban por dia ordinal) do form de Jornada Padrão. Só existe em jornada JÁ SALVA
 * (tabs progressivas). Locators medidos ao vivo em 03/08.
 *
 * Existe sobretudo como SEED: várias suítes da AT (recálculo de duração, linha de base, reagendamento,
 * interação do aluno) pressupõem jornada com fase e tarefa de período conhecido. Sem isso os TCs só
 * conseguem asserção vazia — o TC9 passava com `duração >= 0`, que não prova recálculo nenhum.
 */
export class JourneySchedulePage {
  constructor(private readonly page: Page) {}

  async abrir(): Promise<void> {
    await abrirAba(this.page, ABAS.cronograma);
    await expect(this.page.getByTestId('journey-schedule-add-menu-button')).toBeVisible({ timeout: 30_000 });
  }

  /**
   * "Adicionar" é um MENU: revela `journey-schedule-add-phase` e `journey-schedule-add-task`. Os itens
   * respondem a clique real (medido — 0→8 e 0→17 campos visíveis), então NÃO precisa de dispatchEvent
   * aqui, ao contrário do switch da Identificação.
   */
  private async abrirFormulario(alvo: 'phase' | 'task'): Promise<Locator> {
    await this.page.getByTestId('journey-schedule-add-menu-button').click();
    const item = this.page.getByTestId(`journey-schedule-add-${alvo}`);
    await expect(item).toBeVisible({ timeout: 15_000 });
    await item.click();
    const form = this.page.getByTestId(`journey-${alvo}-form`);
    await expect(form).toBeVisible({ timeout: 30_000 });
    return form;
  }

  /**
   * ⚠️ `#start_day`, `#duration` e `#journey_task_end_day` são ids COMPARTILHADOS entre o form de fase
   * e o de tarefa. Sempre escopar pelo form visível, senão o locator vira strict-mode violation quando
   * os dois já existirem no DOM.
   */
  private async preencherPeriodo(form: Locator, diaInicio: number, duracao: number): Promise<void> {
    for (const [sel, valor] of [['#start_day', diaInicio], ['#duration', duracao]] as const) {
      const campo = form.locator(sel);
      await campo.click();
      await campo.press('ControlOrMeta+a');
      await campo.press('Delete');
      await campo.pressSequentially(String(valor));
      await campo.blur();
    }
  }

  private async salvar(): Promise<void> {
    await this.page.getByTestId('journey-schedule-form-save-button').click();
    // O form fecha ao salvar; se continuar aberto, algo foi rejeitado e o teste deve ver isso agora.
    await expect(this.page.getByTestId('journey-schedule-form-save-button')).toBeHidden({ timeout: 30_000 });
  }

  async adicionarFase(nome: string, diaInicio = 1, duracao = 1): Promise<void> {
    const form = await this.abrirFormulario('phase');
    await form.locator('#journey-phase-name-input').fill(nome);
    await this.preencherPeriodo(form, diaInicio, duracao);
    await this.salvar();
  }

  /** `duracao` em dias é o que alimenta o recálculo de duração da jornada (TC9). */
  async adicionarTarefa(
    nome: string,
    opts: { fase?: string; diaInicio?: number; duracao?: number; tipo?: TipoTarefa } = {},
  ): Promise<void> {
    const { fase, diaInicio = 1, duracao = 1, tipo = 'manual' } = opts;
    const form = await this.abrirFormulario('task');
    await form.locator('#journey-task-name-input').fill(nome);
    if (fase) await form.locator('#journey_phase_id').selectOption({ label: fase });
    await this.preencherPeriodo(form, diaInicio, duracao);
    await this.page.getByTestId(`journey-task-type-${tipo}-card`).click();
    await this.salvar();
  }

  /** Texto auxiliar do período — literal que a AT documenta ("Esta tarefa será executada no Xº dia..."). */
  getPeriodHelperText(): Locator {
    return this.page.getByText(/Esta (fase|tarefa) será executada (no \d+º dia|do \d+º dia ao \d+º dia) da jornada\./);
  }

  // --- Formulários abertos (fase/tarefa) — para as suítes de Cadastro de fases e Cadastro de tarefas ---

  /** Abre o form e devolve o escopo. Público porque as suítes de cadastro testam o form em si. */
  async abrirFormFase(): Promise<Locator> {
    return this.abrirFormulario('phase');
  }

  async abrirFormTarefa(): Promise<Locator> {
    return this.abrirFormulario('task');
  }

  getFormSaveButton(): Locator {
    return this.page.getByTestId('journey-schedule-form-save-button');
  }

  getFormCancelButton(): Locator {
    return this.page.getByTestId('journey-schedule-form-cancel-button');
  }

  /** Erro de campo do Chakra — escopar por texto, nunca genérico (erros de outros campos ficam na tela). */
  getFieldError(trecho: string): Locator {
    return this.page.locator('.chakra-form__error-message').filter({ hasText: trecho });
  }

  /**
   * "Dia de término": calculado a partir de início + duração e **sempre desabilitado** (medido:
   * início 2 + duração 3 → "4", `disabled=true`).
   */
  getEndDayInput(form: Locator): Locator {
    return form.locator('#journey_task_end_day');
  }

  getTaskTypeCard(tipo: TipoTarefa): Locator {
    return this.page.getByTestId(`journey-task-type-${tipo}-card`);
  }

  /** Critérios de conclusão — só aparecem no tipo Aprendizagem (medido). */
  getCompletionRadio(criterio: 'progress' | 'workload' | 'contents-count'): Locator {
    return this.page.getByTestId(`journey-task-completion-${criterio}-radio`);
  }

  /** Campo "Local/link" — exclusivo do tipo Compromisso (medido). */
  getLocationInput(): Locator {
    return this.page.locator('#journey-task-location-input');
  }

  /**
   * Edita campo numérico do form como um usuário faria. Necessário porque estes campos SANITIZAM a
   * entrada (medido 03/08: dia de início "0" → "1", progresso "0" → "1") e `fill()` concatena por
   * causa do sanitizador — o mesmo problema do campo Duração da Identificação.
   */
  async preencherCampo(form: Locator, seletor: string, valor: string): Promise<void> {
    const campo = form.locator(seletor);
    await campo.click();
    await campo.press('ControlOrMeta+a');
    await campo.press('Delete');
    if (valor) await campo.pressSequentially(valor);
    await campo.blur();
  }

  getDayColumn(dia: number): Locator {
    return this.page.getByTestId(`timeline-schedule-cell-day-${dia}`);
  }
}
