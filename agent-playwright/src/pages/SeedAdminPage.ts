import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { ProfileSwitcher } from './ProfileSwitcher.js';
import { getBaseUrl, getOrgId } from '../utils/environment.js';
import { dismissCommonModals, safeGoto } from '../utils/modals.js';

/**
 * Page Object de **provisionamento de seed via UI admin**, compartilhado por
 * qualquer projeto. Centraliza criação/limpeza de recursos pré-condição
 * (curso, trilha, pacote, usuário aluno, matrícula) que antes eram
 * placeholders em `.data.ts` (incidente 2026-05-26 no projeto Recertificação —
 * 25 fixmes "seed inválido"). Skill canônica: `provisionar-seed`.
 *
 * Padrão de uso:
 *
 * ```ts
 * test.beforeAll(async ({ browser }) => {
 *   const ctx = await browser.newContext({ storageState: STORAGE_PATH });
 *   const page = await ctx.newPage();
 *   const seed = new SeedAdminPage(page);
 *   cursoId = await seed.createCurso({ name, hasRecertification: true });
 *   await ctx.close();
 * });
 *
 * test.afterAll(async ({ browser }) => {
 *   const ctx = await browser.newContext({ storageState: STORAGE_PATH });
 *   const page = await ctx.newPage();
 *   const seed = new SeedAdminPage(page);
 *   await seed.deleteCursoByIdSafe(cursoId);
 *   await ctx.close();
 * });
 * ```
 *
 * ───────────────────────────────────────────────────────────────────────
 * ROTAS DESCOBERTAS / INFERIDAS (consolidação 2026-05-26)
 * ───────────────────────────────────────────────────────────────────────
 *
 * Recon live via `planner_setup_page` falhou (seed.spec.ts default não
 * marcado como seed do plugin oficial) e via chrome-devtools-mcp idem
 * (cookies separados do Playwright — sem storageState compartilhado).
 * As rotas abaixo vêm de fontes documentais validadas no monorepo:
 *
 *  - `ContentEditPage.ts` (edit canônico): `/e/{id}/edit` (HAML) e
 *    `/contents/{id}/edit` (React facelift). Ambos editam a mesma entidade
 *    `Event` (RN 2.1 do MD).
 *  - `LearningStudentsPage.ts`: `/o/{orgId}/events/{eventId}/learning_students`.
 *  - `PaineisListPage.ts` (padrão monorepo para CRUD admin): rota
 *    `/o/{orgId}/{recurso}/new` → POST → redirect `/{recurso}/{id}/edit`.
 *  - `test-analysis.md` §62-78: tipos canônicos `Event::KIND_COURSE`,
 *    `Event::KIND_LEARNING_PATH`, `ContentKind.package`.
 *
 * | Recurso | Rota CREATE (UI) | Pós-save (URL canônica) |
 * |---|---|---|
 * | Curso (KIND_COURSE) | `/o/{orgId}/events/new` | `/e/{id}/edit` ou `/contents/{id}/edit` |
 * | Trilha (KIND_LEARNING_PATH) | `/o/{orgId}/events/new?kind=learning_path` | idem |
 * | Pacote (ContentKind.package) | `/o/{orgId}/contents/packages/new` | `/contents/{id}/edit` (REVISAR) |
 * | Usuário aluno | `/o/{orgId}/users/new` | `/users/{id}/edit` (REVISAR) |
 * | Matrícula (participant) | via listagem `/events/{id}/learning_students` + botão "Adicionar aluno" | redirect ou modal (REVISAR) |
 *
 * **Quando rodar o primeiro beforeAll real**: validar URL pós-save e
 * ajustar os regex de `waitForURL` se necessário. Cada método marca
 * `// REVISAR-RECON-LIVE` no ponto da inferência.
 *
 * ───────────────────────────────────────────────────────────────────────
 * CONVENÇÕES (seguidas literalmente do CLAUDE.md §7.5/§7.6 + skills)
 * ───────────────────────────────────────────────────────────────────────
 *
 *  - `safeGoto` em TODAS as navegações (regra dura meta-monorepo: cobre
 *    NPS Sofia + outros modais oportunistas).
 *  - `getOrgId()` em TODAS as URLs — NUNCA literal de orgId.
 *  - Switch Chakra "Habilitar reinscrição": skill `interagir-switch-chakra-twygo`
 *    (label.chakra-switch + `data-checked` + scroll+force click).
 *  - Toast Chakra com `.first()` (skill `testar-toast-chakra-twygo`).
 *  - Variants `*_safe` SEMPRE — aceitam ID inexistente sem throw
 *    (idempotência em afterAll). Skill `limpar-dados-de-teste-twygo`.
 *  - Capturar ID real de `page.url()` após save — nunca placeholder.
 *  - `// REVISAR` em locator heurístico (sem `data-test-id` estável)
 *    pedindo ao dev adicionar testId via PR separado.
 */
export class SeedAdminPage extends BasePage {
  readonly path = '';
  private readonly profileSwitcher: ProfileSwitcher;
  private adminContextReady = false;

  constructor(page: Page) {
    super(page);
    this.profileSwitcher = new ProfileSwitcher(page);
  }

  // ============================================================
  // Helpers internos
  // ============================================================

  /**
   * Garante que o contexto ativo é "Administrador" antes de qualquer
   * operação de seed (criar/deletar curso/trilha/pacote/usuário). User
   * de teste do projeto Recertificação loga em perfil **Aluno** por
   * default (diagnóstico live 2026-05-26: botão de perfil renderiza
   * "Aluno G", URL pós-login `/play?menu_id=play`, sidebar com Meus
   * Cursos/Comunidades/Equipe sem opção admin). Sem essa troca, GET
   * `/o/{orgId}/events/new` é rejeitado pelo backend Rails ("The change
   * you wanted was rejected" — sintoma do CSRF/authorization quando
   * perfil ativo não tem permissão CRUD de evento).
   *
   * Idempotente: se já está em Administrador, no-op (cache local +
   * `ProfileSwitcher.getCurrentProfile` confirmando).
   *
   * Skill canônica: `trocar-perfil-twygo`.
   */
  private async ensureAdminProfile(): Promise<void> {
    if (this.adminContextReady) return;
    // Pré-condição: ProfileSwitcher.open() exige uma página Twygo carregada
    // com o trigger `button.menu-target` visível. Se a página atual é
    // `about:blank` (newContext recém-aberto), navegar para landing primeiro.
    if (
      this.page.url() === 'about:blank' ||
      this.page.url() === 'chrome://newtab/'
    ) {
      await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
    }
    // Diagnóstico live 2026-05-26: `switchToViaUrl('Administrador')`
    // (page.goto direto pra `/o/{orgId}/events?tab=events&profile=admin`) NÃO
    // muda o perfil de sessão — apenas navega. Backend continua com perfil
    // Aluno e rejeita POSTs CRUD ("The change you wanted was rejected").
    // O switch real exige click no link do popover (handler JS dispara
    // troca de session/cookies). Por isso usamos `switchTo` aqui (popover
    // path), não `switchToViaUrl`. Skill: trocar-perfil-twygo.
    await this.profileSwitcher.switchTo('Administrador');
    this.adminContextReady = true;
  }

  /**
   * Extrai o eventId da URL após o save (regex cobre HAML `/e/{id}/edit`
   * e React `/contents/{id}/edit`). Lança erro detalhado se a URL não
   * casar — facilita diagnóstico quando o produto troca a rota.
   */
  private extractEventIdFromUrl(): number {
    const url = this.page.url();
    const m = url.match(/\/(?:e|contents)\/(\d+)\/edit/);
    if (!m) {
      throw new Error(
        `[SeedAdminPage] Falha ao extrair eventId da URL após save. ` +
          `URL atual: "${url}". Esperado padrão "/e/{id}/edit" ou ` +
          `"/contents/{id}/edit". Validar live se a rota mudou.`,
      );
    }
    return Number(m[1]);
  }

  /**
   * Abre um popper Chakra (kebab/ações) e clica no menuitem indicado.
   *
   * Usa `dispatchEvent('click')` em vez de `.click()` no menuitem: o clique
   * com mouse simulado do Playwright, mesmo mirando a coordenada certa (bbox
   * do elemento correto, confirmado via trace), **não gera nenhum evento
   * `click` no documento** nesse popper específico — reproduzido ao vivo em
   * 2026-07-29 com um listener de captura em `document` (zero eventos
   * capturados, embora `aria-expanded` do trigger confirme o menu seguir
   * aberto). Suspeita: o movimento de mouse do Playwright antes do clique
   * dispara um gesto de arraste nativo do Chromium sobre o menuitem, que
   * suprime o `click` (o "fantasma" do texto do item flutuando sobre a
   * linha vizinha no screenshot de falha é consistente com um drag ghost
   * nativo). `dispatchEvent` insere o evento diretamente, sem simulação de
   * mouse — testado ao vivo e confirmado disparar a navegação normalmente.
   */
  private async clickMenuItemAfterOpening(trigger: Locator, itemName: RegExp): Promise<void> {
    await trigger.click();
    const item = this.page.getByRole('menuitem', { name: itemName }).first();
    await item.waitFor({ state: 'visible', timeout: 10_000 });
    await item.dispatchEvent('click');
  }

  /**
   * Localizador do input de "Nome" no form de evento (curso/trilha) e
   * no form de pacote. REVISAR-RECON-LIVE: rota `/events/new` usa HAML
   * com `<input id="event_name">` (padrão Rails) ou React `getByLabel('Nome')`.
   * Tentamos os 2 com fallback documentado.
   */
  private getNameInput(): Locator {
    // REVISAR: aguardando data-test-id estável `event-form-name-input`.
    // Fallback 1: id legado HAML do Rails (`event_name`/`learning_path_name`).
    // Fallback 2: label semântico (React/Chakra). `.or()` resolve o
    // primeiro que estiver visível.
    return this.page
      .locator('#event_name, #learning_path_name, [data-test-id="event-form-name-input"]')
      .or(this.page.getByLabel(/^Nome$/i))
      .first();
  }

  /**
   * Botão "Salvar" do form. Cobre input[type="submit"] (HAML) e
   * button (React) via role.
   */
  private getSaveButton(): Locator {
    return this.page.getByRole('button', { name: /^Salvar$/ }).first();
  }

  /**
   * Switch "Habilitar reinscrição" — label.chakra-switch (skill
   * `interagir-switch-chakra-twygo`). Idempotente: só clica se o estado
   * atual difere do desejado. Tolerante se o switch não estiver visível
   * (flag `:recertificacao` OFF na org → não renderiza).
   */
  private async setHabilitarReinscricao(enabled: boolean): Promise<void> {
    // REVISAR: aguardando data-test-id `event-has-recertification-switch`.
    // Hoje usa fallback semântico via role+name (igual ContentEditPage).
    const checkbox = this.page.getByRole('checkbox', {
      name: /Habilitar reinscrição/i,
    });
    const label = this.page
      .locator('label.chakra-switch')
      .filter({ has: checkbox })
      .first();
    // Tolerância: se a flag :recertificacao está OFF, o switch não
    // renderiza — beforeAll que pede `hasRecertification` em env com
    // flag OFF não deveria estar rodando. Mas no caminho normal (flag
    // ON), aguardamos visibilidade curta antes de toggle.
    const visible = await label.waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    if (!visible) {
      throw new Error(
        '[SeedAdminPage.setHabilitarReinscricao] Switch "Habilitar reinscrição" ' +
          'não está visível no form. Verifique se a feature flag :recertificacao ' +
          'está ATIVA na org. Skill: testar-feature-flag-twygo.',
      );
    }
    const isOn = (await label.getAttribute('data-checked')) !== null;
    if (isOn !== enabled) {
      await label.scrollIntoViewIfNeeded();
      await label.click({ force: true });
    }
  }

  /**
   * Submete o form e aguarda redirect canônico `/e/{id}/edit` ou
   * `/contents/{id}/edit`. Cobre o caso de o produto exibir modal
   * intermediário (NPS) re-rodando dismiss antes do click.
   */
  private async submitAndWaitForEditUrl(): Promise<void> {
    // Defesa em profundidade contra NPS que pode renderizar entre o
    // fill do form e o click do Salvar (padrão consolidado em
    // `PaineisListPage.submitNewPanelForm` — gera modal NPS por
    // inactivity).
    await dismissCommonModals(this.page);
    await this.getSaveButton().click();
    await this.page.waitForURL(/\/(e|contents)\/\d+\/edit/, { timeout: 30_000 });
  }

  // ============================================================
  // Cursos (Event::KIND_COURSE)
  // ============================================================

  /**
   * Cria um curso (`Event::KIND_COURSE` / `kind=0`) via UI admin.
   *
   * **Rota canônica facelift React** (skill `provisionar-seed` v1.3,
   * validada live 2026-05-26): `/o/{orgId}/contents/new?kind=0`.
   * Pós-save redireciona para `/contents/{id}/edit`.
   *
   * **NÃO** usar `/o/{orgId}/events/new` (rota HAML legada) — retorna
   * HTTP 422 silencioso ("The change you wanted was rejected"). A rota
   * HAML ainda renderiza o form, mas o POST `/e` está desativado pra
   * admins no facelift novo.
   *
   * Form facelift exige (validado live):
   *  - Nome * (textbox com asterisco no accessible name)
   *  - Tipo de experiência * (combobox autocomplete — env precisa ter
   *    ≥1 cadastrado; em `staging-recertificacao` existe "Suite Everton CSV")
   *  - Descrição * (rich-text dentro de `<iframe title="Editor de Rich Text">`)
   *  - Situação * (default "Em desenvolvimento" — não mexer)
   *  - Quem pode ver * (default "Usuários" — não mexer)
   *
   * @param data.name             obrigatório, worker-isolated recomendado
   * @param data.tipoExperiencia  opcional; se omitido, escolhe a primeira
   *                              opção da listbox do combobox
   * @param data.description      opcional; default = texto auto-gerado
   * @param data.hasRecertification **DEPRECATED/NO-OP** — switch "Habilitar
   *                              reinscrição" no facelift NÃO está na tab
   *                              "Identificação" do form de CRIAÇÃO; vive
   *                              em tab posterior do form de EDIÇÃO
   *                              (provavelmente "Aprovação", a confirmar
   *                              via recon live). Caller que precise `true`
   *                              deve chamar `ContentEditPage.setHabilitarReinscricao(true)`
   *                              + `save()` após `createCurso` retornar.
   * @returns eventId real capturado de `page.url()` após save
   */
  async createCurso(data: {
    name: string;
    hasRecertification?: boolean;
    description?: string;
    tipoExperiencia?: string;
  }): Promise<number> {
    if (data.hasRecertification === true) {
      // eslint-disable-next-line no-console -- aviso útil em seed
      console.warn(
        '[SeedAdminPage.createCurso] hasRecertification=true é NO-OP no v1.3 ' +
          '(switch vive em tab posterior do edit, não no form de criação). ' +
          'Ative manualmente: contentEditPage.setHabilitarReinscricao(true) + save() após o create.',
      );
    }

    await this.ensureAdminProfile();
    await safeGoto(this.page, `/o/${getOrgId()}/contents/new?kind=0`);

    // 1. Nome (obrigatório)
    const nameInput = this.page.getByRole('textbox', { name: /^Nome \*/ });
    await nameInput.waitFor({ state: 'visible', timeout: 15_000 });
    await nameInput.fill(data.name);

    // 2. Tipo de experiência (obrigatório, combobox autocomplete).
    // O label do form facelift NÃO tem `htmlFor` vinculando ao input
    // — `getByLabel` falha. O texto "Digite ou selecione..." é
    // aria-describedby (não placeholder). Estratégia robusta: seletor
    // por atributos do DOM. "Tipo de experiência" é o 1º combobox
    // autocomplete no form Identificação (vem antes de Classificação
    // e Categorias, que também são autocomplete).
    // REVISAR: aguardando data-test-id estável `event-form-type-combobox`.
    const tipoCombobox = this.page
      .locator('input[role="combobox"][aria-autocomplete="list"]')
      .first();
    await tipoCombobox.waitFor({ state: 'visible', timeout: 10_000 });
    await tipoCombobox.click();
    const tipoOpcao = data.tipoExperiencia
      ? this.page.getByRole('option', { name: data.tipoExperiencia, exact: true })
      : this.page.getByRole('listbox').getByRole('option').first();
    await tipoOpcao.waitFor({ state: 'visible', timeout: 5_000 });
    await tipoOpcao.click();

    // 3. Descrição (obrigatório, rich-text dentro de iframe).
    // `fill` no body do iframe muta o DOM mas NÃO dispara onChange do
    // componente React — backend valida e devolve "Descrição é
    // obrigatório". Precisa simular digitação real: click pra focar,
    // pressSequentially pra disparar input events, blur (Tab) pra
    // disparar onBlur/validação.
    const descricaoText =
      data.description ?? `Seed automatizado — ${data.name} (createCurso v1.3).`;
    const descricaoFrame = this.page.frameLocator(
      'iframe[title^="Editor de Rich Text"]',
    );
    const descricaoBody = descricaoFrame.locator('body');
    await descricaoBody.click();
    await descricaoBody.pressSequentially(descricaoText, { delay: 10 });
    // Blur disparando onChange do wrapper React (sem isso, validação inline
    // "Descrição é obrigatório" persiste).
    await this.page.keyboard.press('Tab');

    // 4. Situação e Quem pode ver: defaults OK ("Em desenvolvimento" / "Usuários").

    // 5. Salvar
    await dismissCommonModals(this.page);
    await this.getSaveButton().click();
    await this.page.waitForURL(/\/o\/\d+\/contents\/\d+\/edit/, {
      timeout: 30_000,
    });

    return this.extractEventIdFromUrl();
  }

  // ============================================================
  // Configuração de atividades / publicação
  // ============================================================

  /**
   * Lista as atividades de um curso (id + título + sequence) via página
   * `/e/{eventId}/contents` (admin). Estrutura HAML: `<li class="dd-item"
   * data-id="X" data-title="Y" data-sequence="N">`.
   *
   * Validado live 2026-05-28 no curso 807403.
   */
  async listarAtividades(
    eventId: number,
  ): Promise<Array<{ id: number; title: string; sequence: number }>> {
    await this.ensureAdminProfile();
    await safeGoto(this.page, `/e/${eventId}/contents`);
    return this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('li.dd-item'))
        .filter((li) => li.getAttribute('data-id'))
        .map((li) => ({
          id: Number(li.getAttribute('data-id')),
          title: li.getAttribute('data-title') ?? '',
          sequence: Number(li.getAttribute('data-sequence') ?? 0),
        }));
    });
  }

  /**
   * Ativa "Permitir marcar concluído manualmente" em N atividades de um
   * curso. Cobre os 4 checkboxes do form HAML
   * `/e/{eventId}/contents/{activityId}/edit`:
   *   - `#checkmark` (geral / Aula)
   *   - `#mark_completed_video` (vídeo arquivo)
   *   - `#mark_completed_external` (vídeo externo / YouTube)
   *   - `#mark_completed_scorm` (SCORM)
   *
   * Quando ativos, expõem checkbox "Marcar como concluído" embaixo do
   * player do aluno em `/e/{eventId}/learn` — necessário pra completar
   * atividades vídeo/SCORM/Aula sem assistir até o fim.
   *
   * Validado live 2026-05-28 no curso 807403 — 3 atividades configuradas
   * via MCP (video arquivo 9288023, video externo 9288024, scorm 9288026)
   * antes do pipeline emitir cert 5027067.
   *
   * Skill: provisionar-seed v1.5 §"Atalho descoberto live".
   */
  async configurarMarcarConcluidoManualmente(
    eventId: number,
    activityIds: number[],
  ): Promise<void> {
    await this.ensureAdminProfile();
    for (const activityId of activityIds) {
      await safeGoto(this.page, `/e/${eventId}/contents/${activityId}/edit`);
      // Marcar via click no label (input Materialize/Chakra é hidden).
      for (const cbid of [
        'mark_completed_scorm',
        'mark_completed_video',
        'mark_completed_external',
        'checkmark',
      ]) {
        const cb = this.page.locator(`#${cbid}`);
        const count = await cb.count();
        if (count === 0) continue;
        const checked = await cb.isChecked().catch(() => false);
        if (checked) continue;
        // Click no label associado — Materialize esconde input via CSS clip.
        await this.page
          .locator(`label[for="${cbid}"]`)
          .first()
          .click()
          .catch(() => undefined);
      }
      // Salvar — botão "Salvar" do form Materialize.
      await dismissCommonModals(this.page);
      await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();
      // Volta pra listagem de atividades.
      await this.page
        .waitForURL(/\/e\/\d+\/contents/, { timeout: 15_000 })
        .catch(() => undefined);
    }
  }

  /**
   * Publica um curso (situation: Em desenvolvimento → Liberado) via tab
   * Identificação do form facelift `/contents/{id}/edit?tab=identification`.
   *
   * Pré-condição pro aluno ver e poder acessar o curso (cursos "Em
   * desenvolvimento" só aparecem pro admin).
   *
   * Combobox `Situação *` (uid validado live em ContentEditPage):
   *   - "Em desenvolvimento" (default, value=0)
   *   - "Liberado" (target, value=1)
   *   - "Suspenso" (value=2)
   *
   * Skill: provisionar-seed v1.5 §"Publicação de curso".
   */
  async publicarCurso(eventId: number): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=identification`,
    );
    // Aguarda tab Identificação ativa (default).
    await this.page
      .getByRole('combobox', { name: /Situação \*/ })
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 });
    await this.page
      .getByRole('combobox', { name: /Situação \*/ })
      .first()
      .selectOption('Liberado');
    await dismissCommonModals(this.page);
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();
    // Confirmar via toast "salva com sucesso" ou aguardar que o select
    // permaneça com "Liberado" pós-save.
    await this.page
      .getByText(/salva com sucesso|atualizada com sucesso/i)
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .catch(() => undefined);
  }

  /**
   * Deleta curso por ID. Variant idempotente: aceita ID inexistente
   * (404 / botão ausente) sem throw — afterAll robusto.
   *
   * Padrão de exclusão Twygo (válido para `Event` em HAML e React):
   * abre a edição → botão "Excluir" → modal de confirmação → "Confirmar".
   * Pós-confirmação redireciona para listagem `/o/{orgId}/events`.
   *
   * REVISAR-RECON-LIVE: o botão "Excluir" pode estar em dropdown de
   * "Ações" (kebab) em alguns layouts — fallback tenta os 2 padrões.
   */
  async deleteCursoByIdSafe(id: number): Promise<void> {
    try {
      await this.ensureAdminProfile();
      await safeGoto(this.page, `/o/${getOrgId()}/events/${id}/edit`);
    } catch {
      // safeGoto/ensureAdminProfile pode falhar com 404 — curso já não existe ou
      // sessão expirou. Cleanup idempotente: warn no-op.
      return;
    }
    try {
      // Caminho 1: botão "Excluir" direto na página de edição.
      const directDelete = this.page
        .getByRole('button', { name: /^Excluir$/i })
        .or(this.page.getByRole('link', { name: /^Excluir$/i }))
        .first();
      const directVisible = await directDelete
        .isVisible({ timeout: 3_000 })
        .catch(() => false);

      if (directVisible) {
        await directDelete.click();
      } else {
        // Caminho 2: dropdown "Ações"/"Opções" → "Excluir".
        // REVISAR: aguardando data-test-id `event-edit-actions-trigger`.
        const actionsTrigger = this.page
          .getByRole('button', { name: /(Ações|Opções|Mais opções)/i })
          .first();
        const triggerVisible = await actionsTrigger
          .isVisible({ timeout: 3_000 })
          .catch(() => false);
        if (!triggerVisible) {
          // eslint-disable-next-line no-console -- diagnóstico em afterAll
          console.warn(
            `[deleteCursoByIdSafe] Botão "Excluir" não encontrado para curso id=${id}. ` +
              `Possível mudança de UI ou curso já deletado — cleanup no-op.`,
          );
          return;
        }
        await this.clickMenuItemAfterOpening(actionsTrigger, /^Excluir$/i);
      }
      // Modal de confirmação Chakra/Bootstrap.
      // REVISAR: aguardando data-test-id `event-delete-confirm`.
      const confirm = this.page
        .getByRole('alertdialog')
        .getByRole('button', { name: /^(Confirmar|Excluir|Sim)$/i })
        .or(
          this.page
            .getByRole('dialog')
            .getByRole('button', { name: /^(Confirmar|Excluir|Sim)$/i }),
        )
        .first();
      await confirm.waitFor({ state: 'visible', timeout: 5_000 });
      await confirm.click();
      // Pós-delete redireciona pra listagem.
      await this.page
        .waitForURL(/\/o\/\d+\/events(\?|$|\/)/, { timeout: 15_000 })
        .catch(() => undefined);
    } catch (err) {
      // eslint-disable-next-line no-console -- diagnóstico em afterAll
      console.warn(
        `[deleteCursoByIdSafe] Falha ao deletar curso id=${id}: ${(err as Error).message}`,
      );
    }
  }

  // ============================================================
  // Trilhas (Event::KIND_LEARNING_PATH)
  // ============================================================

  /**
   * Cria uma trilha (`Event::KIND_LEARNING_PATH`) via UI admin.
   *
   * Rota: `/o/{orgId}/events/new?kind=learning_path` (parâmetro `kind`
   * é o padrão Rails para discriminator no `Event` model — RN do MD
   * §77 confirma `Event::KIND_LEARNING_PATH` como o discriminator).
   *
   * REVISAR-RECON-LIVE: a rota exata pode ser `/o/{orgId}/learning_paths/new`
   * (resource separado) em vez de `/events/new?kind=learning_path` (STI).
   * Tentamos `events/new?kind=learning_path` primeiro; se falhar, o
   * caller verá erro 404 em `safeGoto` e o método precisa ser ajustado.
   *
   * @param data.cursosFilhosIds  opcional — ids dos cursos a vincular
   *                              como filhos da trilha. **NÃO IMPLEMENTADO**
   *                              no v1 (wizard multi-step) — lança erro
   *                              se fornecido. Use `addCursoFilhoToTrilha`
   *                              em PR futuro.
   */
  async createTrilha(data: {
    name: string;
    cursosFilhosIds?: number[];
    hasRecertification?: boolean;
  }): Promise<number> {
    if (data.cursosFilhosIds && data.cursosFilhosIds.length > 0) {
      // REVISAR-RECON-LIVE: vincular cursos filhos provavelmente é wizard
      // multi-step com aba "Cursos" pós-save da aba "Identificação".
      // Não tem TC ativo que exija (TCs de cascade dependem de trilha
      // pré-existente que será criada e populada manualmente até esta
      // limitação ser resolvida).
      throw new Error(
        '[SeedAdminPage.createTrilha] cursosFilhosIds ainda não implementado — ' +
          'requer wizard multi-step (aba "Cursos" pós-save). Refatorar quando ' +
          'os TCs de cascade-de-reinscricao-em-trilhas forem migrados.',
      );
    }
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/events/new?kind=learning_path`,
    );
    await this.getNameInput().waitFor({ state: 'visible', timeout: 15_000 });
    await this.getNameInput().fill(data.name);
    if (data.hasRecertification === true) {
      await this.setHabilitarReinscricao(true);
    }
    await this.submitAndWaitForEditUrl();
    return this.extractEventIdFromUrl();
  }

  /**
   * Deleta trilha por ID — mesmo fluxo que `deleteCursoByIdSafe` (trilha
   * é `Event` no backend, então rota de edit e botão Excluir são
   * idênticos). Wrapper alias para legibilidade nos specs.
   */
  async deleteTrilhaByIdSafe(id: number): Promise<void> {
    await this.deleteCursoByIdSafe(id);
  }

  // ============================================================
  // Pacotes (ContentKind.package)
  // ============================================================

  /**
   * Cria pacote (`ContentKind.package`) via UI admin.
   *
   * REVISAR-RECON-LIVE: a rota canônica para criação de pacote em Twygo
   * NÃO foi confirmada via recon live (chrome-devtools sem cookies,
   * planner_setup_page sem seed). Hipóteses (em ordem de probabilidade):
   *   1. `/o/{orgId}/contents/packages/new`
   *   2. `/o/{orgId}/packages/new`
   *   3. `/o/{orgId}/contents/new?kind=package`
   *
   * Como o TC2 da suíte 03 ("Ação NÃO aparece em evento do tipo pacote")
   * precisa de pacote pré-existente com `has_recertification=true`, o
   * cleanup desse TC deve idealmente ser feito por desinscrição dos
   * alunos do pacote — não pela exclusão do pacote em si (que pode
   * cascatear bloqueio se já tiver participants).
   *
   * Vincular cursos ao pacote tipicamente é wizard multi-step (similar
   * a trilha) — NÃO IMPLEMENTADO no v1. Lança erro se `cursosIds` for
   * fornecido.
   */
  async createPacote(_data: {
    name: string;
    cursosIds: number[];
    hasRecertification?: boolean;
  }): Promise<number> {
    throw new Error(
      '[SeedAdminPage.createPacote] rota de criação de pacote não confirmada ' +
        'via recon live (hipóteses: /contents/packages/new, /packages/new, ' +
        '/contents/new?kind=package). Vincular cursos ao pacote é wizard ' +
        'multi-step. Validar live antes da primeira execução do TC2 da suíte 03 ' +
        '— skill provisionar-seed §catálogo "Pacote pré-existente".',
    );
  }

  /**
   * Deleta pacote por ID. Mesmo padrão de `deleteCursoByIdSafe` (pacote
   * provavelmente reusa a rota `/contents/{id}/edit` — `ContentKind` é
   * polimórfico no backend). Wrapper safe — caller pode chamar mesmo
   * que `createPacote` tenha falhado / pacote nunca existido.
   */
  async deletePacoteByIdSafe(id: number): Promise<void> {
    // REVISAR-RECON-LIVE: confirmar que /contents/{id}/edit funciona pra
    // pacote (ou se a rota é /packages/{id}/edit). Tentamos contents
    // primeiro (mais provável dado o naming `ContentKind`).
    try {
      await safeGoto(this.page, `/o/${getOrgId()}/contents/${id}/edit`);
    } catch {
      return;
    }
    // Reusa a lógica de delete do evento — modal de confirmação e
    // redirect têm estrutura idêntica em Twygo.
    await this.deleteCursoByIdSafe(id);
  }

  // ============================================================
  // Usuários aluno
  // ============================================================

  /**
   * Cria usuário aluno via UI admin.
   *
   * Rota: `/o/{orgId}/users/new` (inferida do padrão Rails resource).
   * REVISAR-RECON-LIVE: o form de novo usuário em Twygo geralmente exige
   * (a) email, (b) nome, (c) perfil (aluno por default), (d) opcional
   * CPF/locale. Pós-save redireciona para `/users/{id}/edit` ou
   * listagem `/users`.
   *
   * @returns userId capturado de `page.url()` após save.
   */
  async criarUsuarioAluno(data: {
    email: string;
    name: string;
    cpf?: string;
    locale?: 'pt-BR' | 'en' | 'es';
  }): Promise<number> {
    await this.ensureAdminProfile();
    await safeGoto(this.page, `/o/${getOrgId()}/users/new`);

    // REVISAR: aguardando data-test-id `user-form-{email,name,cpf}-input`.
    // Fallbacks: ids HAML padrão Rails (`user_email`, `user_name`,
    // `user_document_cpf`) com fallback semântico via getByLabel.
    const emailInput = this.page
      .locator('#user_email')
      .or(this.page.getByLabel(/^E-?mail$/i))
      .first();
    await emailInput.waitFor({ state: 'visible', timeout: 15_000 });
    await emailInput.fill(data.email);

    const nameInput = this.page
      .locator('#user_name')
      .or(this.page.getByLabel(/^Nome$/i))
      .first();
    await nameInput.fill(data.name);

    if (data.cpf) {
      // REVISAR-RECON-LIVE: campo CPF pode ter máscara JS — fill direto
      // pode quebrar a máscara. Se quebrar, usar pressSequentially.
      const cpfInput = this.page
        .locator('#user_document_cpf, #user_cpf')
        .or(this.page.getByLabel(/^CPF$/i))
        .first();
      if (await cpfInput.isVisible().catch(() => false)) {
        await cpfInput.fill(data.cpf);
      }
    }

    if (data.locale) {
      // REVISAR-RECON-LIVE: campo locale pode ser select padrão ou react-select.
      const localeSelect = this.page
        .locator('#user_locale')
        .or(this.page.getByLabel(/^(Idioma|Locale)$/i))
        .first();
      if (await localeSelect.isVisible().catch(() => false)) {
        await localeSelect.selectOption(data.locale).catch(() => undefined);
      }
    }

    await dismissCommonModals(this.page);
    await this.getSaveButton().click();
    // Pós-save redireciona pra `/users/{id}/edit` ou `/users` (REVISAR live).
    await this.page.waitForURL(/\/users(\/\d+\/edit|\?|$)/, { timeout: 30_000 });

    const url = this.page.url();
    const m = url.match(/\/users\/(\d+)\/edit/);
    if (m) {
      return Number(m[1]);
    }
    // Se redirecionou pra listagem, tenta encontrar o user pelo email
    // na URL (parâmetro de busca) ou retorna 0 com erro descritivo.
    throw new Error(
      `[SeedAdminPage.criarUsuarioAluno] Não foi possível extrair userId. ` +
        `URL pós-save: "${url}". Esperado "/users/{id}/edit". ` +
        `Possível que o redirect agora vai pra listagem — refatorar pra ` +
        `buscar o user por email na listagem e extrair id da row.`,
    );
  }

  /**
   * Deleta usuário por e-mail (mais robusto que ID — o user real pode
   * ter ID diferente do esperado caso outro spec tenha criado primeiro).
   *
   * Fluxo: listagem `/users` → busca por email → linha → ações → Excluir.
   *
   * REVISAR-RECON-LIVE: a UI de exclusão de usuário pode estar atrás de
   * permissões especiais. Se não houver botão Excluir visível, fazemos
   * cleanup no-op com warning — usuários com email único e timestamped
   * não causam colisão em runs subsequentes (worker-isolated).
   */
  async deleteUsuarioByEmailSafe(email: string): Promise<void> {
    try {
      await this.ensureAdminProfile();
      await safeGoto(this.page, `/o/${getOrgId()}/users`);
      // REVISAR: aguardando data-test-id estável da busca.
      // Fallback: input de busca por placeholder/label.
      const search = this.page
        .getByPlaceholder(/Buscar|Pesquisar/i)
        .or(this.page.getByRole('searchbox'))
        .first();
      if (await search.isVisible().catch(() => false)) {
        await search.fill(email);
        await this.page.waitForLoadState('networkidle').catch(() => undefined);
      }
      const row = this.page
        .locator('tbody tr')
        .filter({ hasText: email })
        .first();
      const rowVisible = await row
        .isVisible({ timeout: 5_000 })
        .catch(() => false);
      if (!rowVisible) {
        // eslint-disable-next-line no-console -- diagnóstico em afterAll
        console.warn(
          `[deleteUsuarioByEmailSafe] Usuário "${email}" não encontrado — cleanup no-op.`,
        );
        return;
      }
      // Tenta delete direto na row ou via dropdown de ações.
      const directDelete = row.locator('[data-icon="delete"]').first();
      if (await directDelete.isVisible().catch(() => false)) {
        await directDelete.click();
      } else {
        const actions = row
          .getByRole('button', { name: /(Ações|Opções|Mais)/i })
          .first();
        if (!(await actions.isVisible().catch(() => false))) {
          // eslint-disable-next-line no-console -- diagnóstico em afterAll
          console.warn(
            `[deleteUsuarioByEmailSafe] Trigger de ações não encontrado para "${email}".`,
          );
          return;
        }
        await this.clickMenuItemAfterOpening(actions, /^Excluir$/i);
      }
      const confirm = this.page
        .getByRole('alertdialog')
        .getByRole('button', { name: /^(Confirmar|Excluir|Sim)$/i })
        .or(
          this.page
            .getByRole('dialog')
            .getByRole('button', { name: /^(Confirmar|Excluir|Sim)$/i }),
        )
        .first();
      await confirm.waitFor({ state: 'visible', timeout: 5_000 });
      await confirm.click();
      // Aguarda row sair da listagem.
      await expect(row).toHaveCount(0, { timeout: 10_000 }).catch(() => undefined);
    } catch (err) {
      // eslint-disable-next-line no-console -- diagnóstico em afterAll
      console.warn(
        `[deleteUsuarioByEmailSafe] Falha ao deletar "${email}": ${(err as Error).message}`,
      );
    }
  }

  // ============================================================
  // Matrícula (participant num evento)
  // ============================================================

  /**
   * Matricula um aluno num conteúdo (curso/trilha/pacote) via drawer
   * client-side do facelift. Validado live 2026-05-27 + skill
   * `provisionar-seed` v1.3 §"Matrícula de aluno".
   *
   * Fluxo canônico (URL NÃO muda durante o drawer):
   *   1. Listagem `/events?tab=events&profile=admin` + busca pelo nome
   *   2. Linha do conteúdo → kebab (more_vert) → "Inscrição"
   *   3. Drawer "Lista de Participantes" abre (3 abas Confirmados/Pendentes/Cancelados)
   *   4. Click "+ Adicionar" → form abre com E-mail/Nome/Sobrenome
   *   5. Salvar → toast "Participante criado com sucesso"
   *
   * App reusa user existente se email bate; senão cria user inline.
   *
   * Pré-condição: user em perfil Administrador (ensureAdminProfile).
   */
  async matricularAluno(data: {
    contentName: string;
    alunoEmail: string;
    alunoFirstName: string;
    alunoLastName: string;
    dataExpiracao?: string;
  }): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events&profile=admin`);

    // Filtra pra reduzir lista a 1 row do conteúdo alvo.
    await this.page.getByPlaceholder(/Pesquise aqui/i).fill(data.contentName);
    const row = this.page.locator('tr, [role="row"]')
      .filter({ hasText: data.contentName })
      .first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });

    // Kebab → Inscrição. Selector preferencial via data-test-id estável.
    const kebab = row
      .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
      .or(row.getByRole('button', { name: 'more_vert' }))
      .first();
    await kebab.scrollIntoViewIfNeeded();
    await this.clickMenuItemAfterOpening(kebab, /Inscrição/i);

    // Tela completa "Detalhes do evento" abre — URL NÃO muda (continua em
    // /events?tab=events). Header "Detalhes do evento" + heading h3
    // "Lista de Participantes" + abas Confirmados/Pendentes/Cancelados +
    // botão "Adicionar" (StaticText sem role, cursor:pointer).
    // Validado live via MCP 2026-05-27.
    await this.page
      .getByRole('heading', { name: /Lista de Participantes/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });

    // Captura contador "Confirmados (N)" ANTES do add — pós-condição é
    // este contador incrementar (não há toast de sucesso visível).
    const confirmadosBefore = await this.contagemConfirmados();

    // "Adicionar" é StaticText (não button) — getByText.first() pega o
    // elemento certo. MCP CDP click funciona; em Playwright, garantir
    // que o elemento esteja visible antes (sem force).
    const addBtn = this.page.getByText('Adicionar', { exact: true }).first();
    await addBtn.waitFor({ state: 'visible', timeout: 5_000 });
    await addBtn.click();

    // Form completo abre — heading h3 "Adicionar" + 20+ campos
    // (Informações Pessoais / Endereço / Dados Profissionais / Senha).
    // 3 campos obrigatórios marcados com *: E-mail / Nome / Sobrenome.
    await this.page
      .getByRole('heading', { name: /^Adicionar$/i })
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 });

    // CLAUDE.md §7.5 — getByLabel(/E-?mail/i) bate em checkbox send_copy
    // ("Desejo receber uma cópia do e-mail"). Usar getByRole('textbox')
    // que filtra só inputs de texto.
    await this.page.getByRole('textbox', { name: /E-?mail\*/i }).first().fill(data.alunoEmail);
    await this.page.getByRole('textbox', { name: /^Nome\*$/i }).fill(data.alunoFirstName);
    await this.page.getByRole('textbox', { name: /^Sobrenome\*$/i }).fill(data.alunoLastName);
    if (data.dataExpiracao) {
      await this.page.getByRole('textbox', { name: /Data de expira/i }).fill(data.dataExpiracao);
    }

    // Salvar (botão "Salvar" — NÃO "Salvar e Novo").
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();

    // Pós-condição: volta pra "Lista de Participantes" com contador
    // "Confirmados (N+1)". Sem toast de sucesso visível no fluxo atual.
    await this.page
      .getByRole('heading', { name: /Lista de Participantes/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    await expect
      .poll(async () => this.contagemConfirmados(), { timeout: 10_000 })
      .toBeGreaterThan(confirmadosBefore);
  }

  /**
   * Variante com SENHA — grava password do aluno permitindo login OAuth
   * (POST /oauth/token grant_type=password) e login UI subsequente.
   * Útil pra seeds que precisam autenticar o aluno em context fresh (ex:
   * completar curso pelo Play como aluno).
   *
   * Características descobertas live (skill provisionar-seed v1.4+):
   *  - Form Materialize tem seção **Senha** colapsada por default
   *    (h3 com onclick `$('.create_password').toggleClass('hidden')`)
   *  - h3 fica em y≈1490px → FORA do viewport padrão (~678 altura)
   *  - `state:'visible'` do Playwright falha pelo viewport check
   *  - `page.locator('h3', { hasText: /^Senha$/ })` quebra (strict mode);
   *    usar `h3:has-text("Senha")` é mais robusto
   *  - Após expand + scroll, inputs `#password` e `#password_confirmation`
   *    ficam visíveis
   *
   * Validado live em tests/setup/seed-aluno-engajamento-completo.spec.ts
   * (cert 5027067 emitido em 2026-05-28 — commit 168ea72).
   */
  async matricularAlunoComSenha(data: {
    contentName: string;
    alunoEmail: string;
    alunoFirstName: string;
    alunoLastName: string;
    alunoSenha: string;
    dataExpiracao?: string;
  }): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events&profile=admin`);

    await this.page.getByPlaceholder(/Pesquise aqui/i).fill(data.contentName);
    const row = this.page.locator('tr, [role="row"]')
      .filter({ hasText: data.contentName })
      .first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });

    const kebab = row
      .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
      .or(row.getByRole('button', { name: 'more_vert' }))
      .first();
    await kebab.scrollIntoViewIfNeeded();
    await this.clickMenuItemAfterOpening(kebab, /Inscrição/i);

    await this.page
      .getByRole('heading', { name: /Lista de Participantes/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });

    const confirmadosBefore = await this.contagemConfirmados();

    const addBtn = this.page.getByText('Adicionar', { exact: true }).first();
    await addBtn.waitFor({ state: 'visible', timeout: 5_000 });
    await addBtn.click();
    await this.page
      .getByRole('heading', { name: /^Adicionar$/i })
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 });

    // Campos obrigatórios (E-mail/Nome/Sobrenome).
    await this.page.getByRole('textbox', { name: /E-?mail\*/i }).first().fill(data.alunoEmail);
    await this.page.getByRole('textbox', { name: /^Nome\*$/i }).fill(data.alunoFirstName);
    await this.page.getByRole('textbox', { name: /^Sobrenome\*$/i }).fill(data.alunoLastName);
    if (data.dataExpiracao) {
      await this.page.getByRole('textbox', { name: /Data de expira/i }).fill(data.dataExpiracao);
    }

    // Expand seção Senha (colapsada). Scroll progressivo força render
    // dos h3 fora do viewport (form Materialize com 20+ campos).
    await this.page.evaluate(async () => {
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    const senhaH3 = this.page.locator('h3:has-text("Senha")').first();
    await senhaH3.scrollIntoViewIfNeeded();
    await senhaH3.click();
    await this.page.locator('#password').waitFor({ state: 'visible', timeout: 5_000 });
    await this.page.locator('#password').fill(data.alunoSenha);
    await this.page.locator('#password_confirmation').fill(data.alunoSenha);

    await dismissCommonModals(this.page);
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();

    await this.page
      .getByRole('heading', { name: /Lista de Participantes/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    await expect
      .poll(async () => this.contagemConfirmados(), { timeout: 10_000 })
      .toBeGreaterThan(confirmadosBefore);
  }

  /**
   * Lê o contador "Confirmados (N)" da aba na tela "Lista de
   * Participantes". Retorna 0 quando ausente/parsing falha — caller
   * usa como baseline pra comparar após inserção.
   */
  private async contagemConfirmados(): Promise<number> {
    const tabText = await this.page
      .getByText(/Confirmados\s*\(\d+\)/i)
      .first()
      .textContent({ timeout: 5_000 })
      .catch(() => '');
    const m = tabText?.match(/\((\d+)\)/);
    return m ? Number(m[1]) : 0;
  }

  /**
   * Cancela matrícula de aluno por email. Drawer Inscrição → linha do
   * aluno na aba Confirmados → "Cancelar" → confirma modal.
   *
   * Idempotente (catch silencioso) — usado em `afterAll`.
   */
  async desmatricularAlunoSafe(data: {
    contentName: string;
    alunoEmail: string;
  }): Promise<void> {
    try {
      await this.ensureAdminProfile();
      await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events&profile=admin`);
      await this.page.getByPlaceholder(/Pesquise aqui/i).fill(data.contentName);
      const row = this.page.locator('tr, [role="row"]')
        .filter({ hasText: data.contentName })
        .first();
      const kebab = row
        .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
        .or(row.getByRole('button', { name: 'more_vert' }))
        .first();
      await this.clickMenuItemAfterOpening(kebab, /Inscrição/i);

      // Drawer abre. Aguarda heading e localiza linha do aluno.
      await this.page
        .getByRole('heading', { name: /Lista de Participantes/i })
        .first()
        .waitFor({ state: 'visible', timeout: 5_000 });
      const alunoRow = this.page.locator('tr, [role="row"]')
        .filter({ hasText: data.alunoEmail })
        .first();
      await alunoRow.getByRole('button', { name: /cancelar/i }).click({ timeout: 5_000 });
      // Confirmar cancelamento se modal aparecer.
      await this.page
        .getByRole('button', { name: /confirmar|sim/i })
        .click({ timeout: 5_000 })
        .catch(() => undefined);
    } catch (err) {
      // eslint-disable-next-line no-console -- diagnóstico em afterAll
      console.warn(
        `[desmatricularAlunoSafe] Falha em "${data.contentName}/${data.alunoEmail}": ${(err as Error).message}`,
      );
    }
  }

  // ============================================================
  // Engajamento do aluno (completar curso → aprovação → cert)
  // ============================================================

  /**
   * Pipeline completo de engajamento do aluno como SEED. Validado live em
   * 2026-05-28 (commit 168ea72 + 019b588 — cert 5027067 emitido).
   *
   * Sequência:
   *   1. Login OAuth (POST /oauth/token grant_type=password) → access_token
   *   2. Login UI em context fresh (sem storageState admin)
   *   3. Acessa `/e/{cursoId}` → APRENDER (+aceita consentimento se houver)
   *   4. Itera cards da sidebar do player + clica checkbox "Marcar como
   *      concluído" em atividades vídeo/SCORM/Aula que tenham config
   *      `Permitir marcar manualmente` ativa
   *   5. Fecha modal "Aprovação atingida" se disparar
   *   6. Poll /api/v2/attendees até `certificates[].length > 0` (~30s)
   *
   * **NOTE**: o seed-aluno DEVE ter senha gravada (via `matricularAlunoComSenha`).
   *
   * @returns `attendee` da API V2 com `certificates[0]` populado se cert foi
   *          emitido, ou `null` se o critério de aprovação do curso não foi
   *          atingido (caller decide se faz fail-loud).
   */
  async completarCursoComoAluno(data: {
    browser: import('@playwright/test').Browser;
    cursoId: number;
    alunoEmail: string;
    alunoSenha: string;
    baseURL?: string;
    apiToken?: string;
    /** Timeout total pra cert (default 60s). */
    certTimeoutMs?: number;
  }): Promise<{
    attendeeId: number | null;
    progress: number;
    approvedAt: string | null;
    certificate: {
      certificate_id: number;
      certificate_situation: string;
      certificate_link: string;
    } | null;
  }> {
    const baseURL = data.baseURL || process.env.API_BASE_URL || getBaseUrl();
    const apiToken = data.apiToken || process.env.API_TOKEN || '';
    const certTimeoutMs = data.certTimeoutMs ?? 60_000;

    // 1. Login UI em context fresh — storageState empty pra não herdar admin.
    const alunoCtx = await data.browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const alunoPage = await alunoCtx.newPage();
    try {
      await safeGoto(alunoPage, '/users/login');
      await alunoPage.getByRole('textbox', { name: 'Login', exact: true }).fill(data.alunoEmail);
      await alunoPage.getByRole('textbox', { name: 'Senha', exact: true }).fill(data.alunoSenha);
      await alunoPage.getByRole('button', { name: 'Entrar', exact: true }).click();
      await alunoPage.waitForURL((url) => !url.pathname.startsWith('/users/login'), {
        timeout: 30_000,
      });

      // 2. Acessa o curso pela rota canônica do facelift.
      await safeGoto(alunoPage, `/e/${data.cursoId}`);

      // 3. Aceitar consentimento (RGPD) + APRENDER.
      const aceitar = alunoPage.getByRole('button', { name: /^Aceitar$/i }).first();
      if (await aceitar.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await aceitar.click();
      }
      await alunoPage.getByRole('button', { name: /^APRENDER$/i }).click();
      await alunoPage.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);

      // 4. Iterar cards de atividade da sidebar (h2 nomes curtos).
      const cards = await alunoPage.evaluate(() =>
        Array.from(document.querySelectorAll('h2'))
          .filter(
            (h) =>
              (h as HTMLElement).offsetParent !== null &&
              (h.textContent || '').trim().length > 0 &&
              (h.textContent || '').trim().length < 50,
          )
          .map((h) => (h.textContent || '').trim()),
      );
      for (const name of cards) {
        const card = alunoPage.locator(`h2:has-text("${name}")`).first();
        try {
          await card.scrollIntoViewIfNeeded({ timeout: 3_000 });
          await card.click({ timeout: 5_000 });
          await alunoPage.waitForTimeout(2_000);
          // Checkbox "Marcar como concluído" — só em vídeo/SCORM/Aula
          // configurados com a opção no admin.
          const completoCheckbox = alunoPage
            .locator(
              'input[type="checkbox"][id*="complet"], label:has-text("Marcar como concluído")',
            )
            .first();
          if (await completoCheckbox.isVisible({ timeout: 1_500 }).catch(() => false)) {
            await completoCheckbox.click({ force: true }).catch(() => undefined);
            await alunoPage.waitForTimeout(1_500);
          }
          // Fecha modal de aprovação se disparar — caller já considera
          // sucesso, mas spec precisa continuar pra completar outras
          // atividades remanescentes (idempotente).
          const aprovacaoModal = alunoPage.getByText(/Aprovação atingida|Parabéns/i).first();
          if (await aprovacaoModal.isVisible({ timeout: 1_000 }).catch(() => false)) {
            await alunoPage
              .getByRole('button', { name: /^Ok$/i })
              .first()
              .click()
              .catch(() => undefined);
          }
        } catch {
          // Card pode estar bloqueado por modal anterior — segue.
        }
      }
    } finally {
      await alunoCtx.close();
    }

    // 5. Poll API V2 /attendees até cert ser emitido (worker async ~30s).
    const lookupCtx = await import('@playwright/test').then((pw) =>
      pw.request.newContext({ baseURL }),
    );
    try {
      const userId = await this.lookupUserIdByEmail({ email: data.alunoEmail, apiToken, baseURL });
      if (!userId) {
        return { attendeeId: null, progress: 0, approvedAt: null, certificate: null };
      }
      const deadline = Date.now() + certTimeoutMs;
      let attendee: any = null;
      while (Date.now() < deadline) {
        const r = await lookupCtx.get(
          `/api/v2/attendees?content_id=${data.cursoId}&user_id=${userId}`,
          { headers: { Authorization: `Bearer ${apiToken}`, Accept: 'application/json' } },
        );
        if (r.ok()) {
          const body = await r.json();
          attendee = body.data?.attendees?.[0];
          if (attendee?.certificates?.length > 0) break;
        }
        await new Promise((resolve) => setTimeout(resolve, 5_000));
      }
      const cert = attendee?.certificates?.[0];
      return {
        attendeeId: attendee?.attendee_id ?? null,
        progress: Number(attendee?.progress ?? 0),
        approvedAt: attendee?.approved_at ?? null,
        certificate: cert
          ? {
              certificate_id: cert.certificate_id,
              certificate_situation: cert.certificate_situation,
              certificate_link: cert.certificate_link,
            }
          : null,
      };
    } finally {
      await lookupCtx.dispose();
    }
  }

  /**
   * Helper privado: resolve user_id pelo email via API V2.
   * Reaproveitado por completarCursoComoAluno (precisa do user_id pro
   * lookup do attendee).
   */
  private async lookupUserIdByEmail(args: {
    email: string;
    apiToken: string;
    baseURL: string;
  }): Promise<number | null> {
    const ctx = await import('@playwright/test').then((pw) =>
      pw.request.newContext({ baseURL: args.baseURL }),
    );
    try {
      const r = await ctx.get(
        `/api/v2/users?email=${encodeURIComponent(args.email)}&page=1&per_page=1`,
        { headers: { Authorization: `Bearer ${args.apiToken}`, Accept: 'application/json' } },
      );
      if (!r.ok()) return null;
      const body = await r.json();
      return body.data?.users?.[0]?.user_id ?? body.data?.users?.[0]?.id ?? null;
    } finally {
      await ctx.dispose();
    }
  }
}
