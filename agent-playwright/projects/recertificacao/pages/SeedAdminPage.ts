import type { Page } from '@playwright/test';
import { SeedAdminPageBase } from '../../../src/pages/SeedAdminPageBase.js';
import { ContentEditPage } from './ContentEditPage.js';
import { LearningStudentsPage } from './LearningStudentsPage.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { dismissCommonModals, safeGoto } from '../../../src/utils/modals.js';

/**
 * **SeedAdminPage do projeto Recertificação** — estende
 * [[SeedAdminPageBase]] (genérico Twygo em `src/pages/`) e adiciona
 * helpers específicos do domínio Recertificação:
 *
 *  - `setHasRecertification`: liga/desliga `events.has_recertification`
 *    via tab Acesso do facelift (delega em `ContentEditPage` per-projeto).
 *    Pré-condição: feature flag `:recertificacao` ATIVA na org.
 *  - `expirarCertificadoDoAluno`: dispara fluxo RN 22 (ciclo de cert
 *    substituído) via UI menu kebab "Expirar certificado" do
 *    `LearningStudentsPage`.
 *  - `set<Banner|Cobranca|CriterioAprovacao|QuemPodeVer|HabilitarChat|
 *     Localizacao|Compartilhamento>`: configuradores de tabs do form
 *    facelift que delegam em `ContentEditPage` (per-projeto). São
 *    funcionalmente genéricos Twygo, mas seu uso por fixture é
 *    específico do projeto Recertificação por enquanto. Se outro
 *    projeto precisar, candidatos a migrar pra Base junto com
 *    `ContentEditPage` extraído.
 *
 * **Como criar SeedAdminPage de outro projeto**:
 *
 * ```ts
 * // projects/<seu-projeto>/pages/SeedAdminPage.ts
 * import { SeedAdminPageBase } from '../../../src/pages/SeedAdminPageBase.js';
 *
 * export class SeedAdminPage extends SeedAdminPageBase {
 *   // adiciona apenas os helpers específicos do seu projeto.
 *   // métodos genéricos (createCurso, matricularAluno, etc) você herda
 *   // grátis do Base — não precisa redefinir.
 * }
 * ```
 *
 * Se o projeto não precisar de helpers específicos, pode até pular
 * subclasse e instanciar `SeedAdminPageBase` direto.
 *
 * Skill canônica: [[provisionar-seed]] v2.1+ §"Como projeto novo herda
 * o pool".
 */
export class SeedAdminPage extends SeedAdminPageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Liga/desliga o switch `events.has_recertification` via UI admin do
   * facelift React. Delega em [[ContentEditPage]] — preserva POM
   * (não duplica locator `#has_recertification`). Caller fixture usa
   * este atalho pra evitar boilerplate de "abrir edit + tab Acesso +
   * toggle + save".
   *
   * Pré-condições:
   *  - Feature flag `:recertificacao` ATIVA na org (kill switch RN 1) —
   *    sem ela, switch não renderiza e `setHabilitarReinscricao` falha
   *    com timeout no waitFor do label visível.
   *  - User admin logado com perfil Administrador (garantido por
   *    `ensureAdminProfile` interno).
   *
   * Idempotente: `setHabilitarReinscricao` só toggla se o estado
   * atual diverge do desejado. Validado live 2026-05-27 — switch é
   * checkbox HTML padrão (`input#has_recertification` screen-reader-only
   * com label visível `.chakra-checkbox`) na tab Acesso, seção
   * "Permitir registro de inscrição por".
   *
   * Skill: provisionar-seed v1.6 §"Habilitar recertification em curso seed".
   */
  async setHasRecertification(
    eventId: number,
    enabled: boolean,
  ): Promise<void> {
    await this.ensureAdminProfile();
    const editPage = new ContentEditPage(this.page);
    await editPage.openEditByIdInAcessoTab(eventId);
    await editPage.setHabilitarReinscricao(enabled);
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Expira o certificado de um aluno aprovado num curso. Atalho de seed
   * pro fluxo UI:
   *   1. Abre `/e/{cursoId}/learning`
   *   2. Localiza a linha do aluno com cert EMITIDO (filtra por certState
   *      pra ignorar linhas Pendente/Outro estado do mesmo aluno)
   *   3. Abre menu kebab → "Expirar certificado" → confirma
   *
   * Pré-condição: aluno deve ter cert emitido no curso. Pós-condição:
   * `certificate_situation` vira `expired` no DB, aluno fica em estado
   * "elegível por cert expirado" (Suite 2 TC1 estado b).
   *
   * Skill: provisionar-seed v1.7.0 §"Expirar certificado de aluno aprovado".
   */
  async expirarCertificadoDoAluno(data: {
    cursoId: number;
    alunoEmail: string;
  }): Promise<void> {
    await this.ensureAdminProfile();
    const learning = new LearningStudentsPage(this.page);
    await learning.goToList(data.cursoId);
    await learning.expirarCertificadoDoAluno(data.alunoEmail, {
      certState: 'Emitido',
    });
  }

  /**
   * Configura banner do curso (upload de imagem). Tab "Banner".
   *
   * REVISAR-RECON-LIVE: estrutura da tab Banner não confirmada. Assume
   * `<input type="file">` aceitando imagens. Pode ter regiões diferentes
   * (banner mobile vs desktop). Validar via recon ao consumir.
   *
   * @param imagemPath caminho absoluto pra imagem (use helpers de
   *                   `src/utils/test-assets.ts`, skill `testar-upload-de-arquivo-twygo`)
   */
  async setBanner(eventId: number, imagemPath: string): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=banner`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Banner');
    const fileInput = this.page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10_000 });
    await fileInput.setInputFiles(imagemPath);
    await this.page.waitForTimeout(2_000);
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Configura cobrança do curso (preço + gateway). Tab "Cobrança".
   *
   * REVISAR-RECON-LIVE: tab Cobrança exige config de gateway no env
   * (chave de API). Sem gateway configurado, a tab pode estar bloqueada
   * ou exibir mensagem "Configurar gateway". Validar via recon antes
   * do primeiro consumidor.
   */
  async setCobranca(
    eventId: number,
    data: { preco: number; gatewayName?: string },
  ): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=billing`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Cobrança');
    const precoInput = this.page
      .getByLabel(/(Preço|Valor)/i)
      .or(this.page.getByRole('spinbutton').first())
      .first();
    await precoInput.waitFor({ state: 'visible', timeout: 10_000 });
    await precoInput.fill(data.preco.toFixed(2));
    if (data.gatewayName) {
      const gateway = this.page
        .getByLabel(/(Gateway|Forma de pagamento)/i)
        .first();
      if (await gateway.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await gateway.click();
        await this.page
          .getByRole('option', { name: data.gatewayName, exact: true })
          .click();
      }
    }
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Configura o "Critério de aprovação" do curso (percentual mínimo de
   * progresso/nota pra emitir certificado). Tab "Aprovação" do facelift.
   *
   * REVISAR-RECON-LIVE: assumindo input numérico com label/placeholder
   * "Critério de aprovação" ou similar. Validar via spec piloto antes
   * do primeiro consumidor.
   */
  async setCriterioAprovacao(
    eventId: number,
    percentual: number,
  ): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=approval`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Aprovação');
    const input = this.page
      .getByLabel(/(Critério de aprovação|Percentual mínimo|Aprovação mínima)/i)
      .or(this.page.getByRole('spinbutton').first())
      .first();
    await input.waitFor({ state: 'visible', timeout: 10_000 });
    await input.fill(String(percentual));
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Configura "Quem pode ver" (visibilidade/audiência) do curso. Tab
   * "Identificação" do facelift — combobox com opções tipo:
   * `Inscritos | Colaborador | Usuários | Público`.
   */
  async setQuemPodeVer(
    eventId: number,
    audiencia: 'Inscritos' | 'Colaborador' | 'Usuários' | 'Público',
  ): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=identification`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Identificação');
    const combobox = this.page
      .getByLabel(/(Quem pode ver|Visibilidade|Audiência)/i)
      .or(
        this.page
          .locator('input[role="combobox"][aria-autocomplete="list"]')
          .nth(1),
      )
      .first();
    await combobox.waitFor({ state: 'visible', timeout: 10_000 });
    await combobox.click();
    await this.page
      .getByRole('option', { name: audiencia, exact: true })
      .click();
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Liga/desliga o checkbox "Habilitar chat no conteúdo". Tab
   * "Identificação" — checkbox HTML padrão (name=`enable_twygo_chat`,
   * validado live 2026-05-28 via recon).
   */
  async setHabilitarChat(eventId: number, enabled: boolean): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=identification`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Identificação');
    const checkbox = this.page.locator('#enable_twygo_chat');
    await checkbox.waitFor({ state: 'attached', timeout: 10_000 });
    if (enabled) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Configura modalidade na tab "Localização" (Presencial/Online/Híbrido).
   */
  async setLocalizacao(
    eventId: number,
    options: { modalidade: 'Presencial' | 'Online' | 'Híbrido' },
  ): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=location`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Localização');
    const radio = this.page
      .getByRole('radio', { name: options.modalidade })
      .first();
    if (await radio.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await radio.check();
    } else {
      const combobox = this.page
        .getByLabel(/(Modalidade|Tipo)/i)
        .first();
      await combobox.click();
      await this.page
        .getByRole('option', { name: options.modalidade })
        .click();
    }
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }

  /**
   * Configura compartilhamento (gerar/ler link público). Tab "Compartilhar".
   *
   * REVISAR-RECON-LIVE: estrutura exata da tab Compartilhar não confirmada.
   */
  async setCompartilhamento(
    eventId: number,
    options: { linkPublico: boolean },
  ): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/contents/${eventId}/edit?tab=share`,
    );
    const editPage = new ContentEditPage(this.page);
    await editPage.goToTab('Compartilhar');
    const toggle = this.page
      .getByRole('switch', { name: /(Link público|Compartilhar publicamente|Tornar público)/i })
      .or(
        this.page.getByRole('checkbox', {
          name: /(Link público|Compartilhar publicamente)/i,
        }),
      )
      .first();
    await toggle.waitFor({ state: 'attached', timeout: 10_000 });
    if (options.linkPublico) {
      await toggle.check();
    } else {
      await toggle.uncheck();
    }
    await dismissCommonModals(this.page);
    await editPage.save();
    await editPage.expectSaveSuccess();
  }
}
