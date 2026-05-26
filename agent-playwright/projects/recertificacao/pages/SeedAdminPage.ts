import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { ProfileSwitcher } from '../../../src/pages/ProfileSwitcher.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { dismissCommonModals, safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object de **provisionamento de seed via UI admin** para o projeto
 * Recertificação. Centraliza criação/limpeza de recursos pré-condição
 * (curso, trilha, pacote, usuário aluno, matrícula) que antes eram
 * placeholders em `.data.ts` (incidente 2026-05-26 — 25 fixmes "seed
 * inválido"). Skill canônica: `provisionar-seed`.
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
   * Localizador do textarea/input de "Descrição" no form de evento.
   * REVISAR-RECON-LIVE: descrição em HAML legado costuma ser `<textarea
   * id="event_description">`. Em React pode ser rich-text Plate (skill
   * `testar-plate-editor-twygo`) — neste caso `fill` direto não funciona.
   * Por ora, só usa o campo plain; se for Plate, caller pode pular.
   */
  private getDescriptionInput(): Locator {
    // REVISAR: aguardando data-test-id estável.
    return this.page
      .locator('#event_description, #learning_path_description')
      .or(this.page.getByLabel(/^Descrição$/i))
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
   * Cria um curso (`Event::KIND_COURSE`) via UI admin.
   *
   * Rota: `/o/{orgId}/events/new` — form Rails/HAML legado (default no
   * Twygo até 2026-05). Pós-save redireciona para `/e/{id}/edit`.
   *
   * @param data.name             obrigatório, worker-isolated recomendado
   * @param data.hasRecertification se `true`, liga o switch antes de salvar
   * @param data.description      opcional, ignora se form usa rich-text Plate
   * @returns eventId real capturado de `page.url()` após save
   */
  async createCurso(data: {
    name: string;
    hasRecertification?: boolean;
    description?: string;
  }): Promise<number> {
    await this.ensureAdminProfile();
    await safeGoto(this.page, `/o/${getOrgId()}/events/new`);
    await this.getNameInput().waitFor({ state: 'visible', timeout: 15_000 });
    await this.getNameInput().fill(data.name);
    if (data.description) {
      // REVISAR-RECON-LIVE: se o produto migrou a descrição para rich-text
      // Plate, `fill` falha — caller que precise descrição rica deve
      // estender este Page Object com helper Plate-aware (skill
      // `testar-plate-editor-twygo`). Hoje assume textarea/input plain.
      const desc = this.getDescriptionInput();
      if (await desc.isVisible().catch(() => false)) {
        await desc.fill(data.description);
      }
    }
    if (data.hasRecertification === true) {
      await this.setHabilitarReinscricao(true);
    }
    await this.submitAndWaitForEditUrl();
    return this.extractEventIdFromUrl();
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
           
          console.warn(
            `[deleteCursoByIdSafe] Botão "Excluir" não encontrado para curso id=${id}. ` +
              `Possível mudança de UI ou curso já deletado — cleanup no-op.`,
          );
          return;
        }
        await actionsTrigger.click();
        await this.page
          .getByRole('menuitem', { name: /^Excluir$/i })
          .first()
          .click();
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
           
          console.warn(
            `[deleteUsuarioByEmailSafe] Trigger de ações não encontrado para "${email}".`,
          );
          return;
        }
        await actions.click();
        await this.page
          .getByRole('menuitem', { name: /^Excluir$/i })
          .first()
          .click();
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
       
      console.warn(
        `[deleteUsuarioByEmailSafe] Falha ao deletar "${email}": ${(err as Error).message}`,
      );
    }
  }

  // ============================================================
  // Matrícula (participant num evento)
  // ============================================================

  /**
   * Cria matrícula (participant) num evento via UI admin.
   *
   * Fluxo (inferido do MD §321 + LearningStudentsPage):
   *   1. Acessa `/o/{orgId}/events/{eventId}/learning_students`
   *   2. Clica em "Adicionar aluno" (botão geralmente no topo direito)
   *   3. Modal/drawer abre — preenche email, nome, opcional CPF
   *   4. Salvar → participant criado, redirect ou modal fecha
   *
   * REVISAR-RECON-LIVE: o trigger "Adicionar aluno" pode ter rotulações
   * diferentes ("Inscrever aluno", "Matricular"). Validar texto exato
   * via recon antes da primeira execução real.
   *
   * Idealmente o usuário deveria existir antes — se não existir, o
   * Twygo cria usuário + matrícula no mesmo fluxo (RN admin pode ter
   * "Convidar e matricular"). Esse helper assume o caminho "matricular
   * usuário novo via form embutido" que cobre ambos os casos.
   *
   * @returns participantId e userId capturados via Network ou URL.
   *          **LIMITAÇÃO v1**: captura via URL pós-save pode não conter
   *          os ids; nesse caso, retornamos `participantId: 0, userId: 0`
   *          com warning — caller usa email como handle pra cleanup.
   */
  async criarAlunoMatriculado(_data: {
    eventId: number;
    email: string;
    name: string;
    cpf?: string;
  }): Promise<{ participantId: number; userId: number }> {
    // REVISAR-RECON-LIVE: fluxo completo de "Adicionar aluno" no
    // learning_students não foi mapeado live. As 3 hipóteses principais:
    //   (a) Botão "Adicionar aluno" → modal Chakra com form inline
    //       (criar usuário + matricular num único submit)
    //   (b) Botão "Adicionar aluno" → drawer com busca por user existente
    //       (precisa criar user antes via criarUsuarioAluno)
    //   (c) Link para nova página `/learning_students/new?event_id={id}`
    //
    // Sem validação live, não dá pra emitir código que casa com a UI
    // real — risco de gerar spec que vai falhar em todos os 25+ TCs
    // que dependem desse helper. Marcar como não-implementado e exigir
    // recon live antes do primeiro uso.
    throw new Error(
      '[SeedAdminPage.criarAlunoMatriculado] fluxo de "Adicionar aluno" na ' +
        'listagem learning_students não foi confirmado via recon live. ' +
        'Hipóteses: (a) modal inline criar+matricular, (b) drawer com busca ' +
        'de user existente, (c) nova rota /learning_students/new?event_id=X. ' +
        'Validar live antes do primeiro uso e implementar o caminho real. ' +
        'Workaround temporário: usar `POST /api/v1/contents/{eventId}/event_participants` ' +
        'via page.request (mencionado em test-analysis.md §1423 e similares) ' +
        'em vez do fluxo UI.',
    );
  }

  /**
   * Desinscreve participant de um evento. Necessário ANTES de deletar
   * o evento, senão produto pode bloquear delete com erro "evento tem
   * participants" (similar a modal "Painel em uso" — skill
   * `limpar-dados-de-teste-twygo`).
   *
   * Ordem canônica em afterAll:
   *   1. desinscreverParticipantSafe(participantId, eventId)
   *   2. deleteUsuarioByEmailSafe(email)
   *   3. deleteCursoByIdSafe(eventId)
   *
   * Fluxo (inferido):
   *   1. Acessa learning_students do evento
   *   2. Localiza row do participant
   *   3. Menu de ações da row → "Desinscrever" ou "Remover"
   *   4. Confirma modal
   *
   * REVISAR-RECON-LIVE: texto exato da ação ("Desinscrever", "Remover",
   * "Excluir") não confirmado. Tentamos as 3 variantes via regex.
   */
  async desinscreverParticipantSafe(
    _participantId: number,
    eventId: number,
  ): Promise<void> {
    try {
      await safeGoto(
        this.page,
        `/o/${getOrgId()}/events/${eventId}/learning_students`,
      );
      // REVISAR-RECON-LIVE: sem participantId mapeando para data-item-id
      // estável na row, e sem garantia de que `_participantId` casa com
      // algum atributo da DOM, este helper precisaria identificar o
      // participant via email. O caller (afterAll) normalmente tem o
      // email — refatorar a assinatura para receber email em vez de
      // participantId, ou aceitar ambos.
      //
      // Como criarAlunoMatriculado() está marcado not-implemented,
      // este desinscreverParticipantSafe também não tem caminho ativo
      // de teste — mantemos como TODO consciente. Quando
      // criarAlunoMatriculado for implementado e retornar participantId
      // real, ajustar este método para usar o id em data-item-id da row.
       
      console.warn(
        '[desinscreverParticipantSafe] não implementado — precisa recon live ' +
          'do fluxo "Desinscrever participant" + identificação da row por ' +
          'participantId. Refatorar para aceitar email como handle.',
      );
    } catch (err) {
       
      console.warn(
        `[desinscreverParticipantSafe] Falha em event=${eventId}: ${(err as Error).message}`,
      );
    }
  }
}
