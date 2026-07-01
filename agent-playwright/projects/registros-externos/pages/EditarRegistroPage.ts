import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Page Object da suíte "Editar registro de aprendizagem".
 *
 * Cobre a lista de Registros (visão Admin `/records` e visão Aluno
 * `?in_use_mode_layout=true`) e o form de edição (`/records/{id}/edit`).
 *
 * Seletores estáveis catalogados no recon
 * (`inputs/recon-editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners.md`):
 * - kebab da linha: `records-{recordId}-actions-kebab`
 * - badge de origem: `record-origin-badge-{external|internal}`
 * - badge de situação do certificado: `record-certificate-situation-badge-{recordId}`
 * - rodapé do form: `record-form-save-button` / `record-form-cancel-button`
 * - campo Pessoas: `people-selector-input`
 *
 * Os itens de menu "Editar" e "Excluir" NÃO têm testId — só texto.
 */
/**
 * Esconde o widget de chat HubSpot (`#hubspot-messages-iframe-container`), que carrega
 * no canto inferior direito e intercepta pointer events de botões ali (kebab das últimas
 * linhas, rodapé). Ver skill `debugar-chat-widget-hubspot`. Idempotente e silencioso.
 */
async function hideChatWidget(page: Page): Promise<void> {
  // Injeta CSS `!important` em vez de `style.display` inline: o widget recarrega o iframe
  // (inclusive ao navegar pro form /edit) e sobrescreveria o inline. A regra de folha de
  // estilo persiste e mata a interceptação de pointer events de forma estável.
  await page
    .addStyleTag({
      content:
        '#hubspot-messages-iframe-container,#hubspot-conversations-iframe{display:none!important;pointer-events:none!important;visibility:hidden!important;}',
    })
    .catch(() => {});
}

export type RecordOrigin = 'external' | 'internal';

export interface RecordRow {
  recordId: string;
  origin: RecordOrigin | string;
  /** Texto do badge "Situação do certificado" (Emitido / Pendente / Recusado / Expirado / Substituído). */
  certStatus: string;
  content: string;
}

export class RegistrosListPage {
  constructor(private readonly page: Page) {}

  private adminUrl(): string {
    return `/o/${getOrgId()}/records`;
  }

  private alunoUrl(): string {
    return `/o/${getOrgId()}/records?in_use_mode_layout=true`;
  }

  /** Lista da visão Admin (Aprendizagem > Registros). Tolera 503 transitório do nginx. */
  async gotoAdmin(): Promise<void> {
    await this.gotoWithRetry(this.adminUrl());
  }

  /** Lista da visão Aluno (Meu histórico) — escopada ao usuário logado. */
  async gotoAluno(): Promise<void> {
    await this.gotoWithRetry(this.alunoUrl());
  }

  private async gotoWithRetry(url: string): Promise<void> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await safeGoto(this.page, url);
      const ok = await this.page
        .locator('table tbody tr')
        .first()
        .isVisible({ timeout: 12_000 })
        .catch(() => false);
      if (ok) {
        await hideChatWidget(this.page);
        return;
      }
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3_000));
    }
    await expect(this.page.locator('table tbody tr').first()).toBeVisible({ timeout: 15_000 });
    await hideChatWidget(this.page);
  }

  /** Varre a tabela e devolve origem/situação/conteúdo por recordId. */
  async scanRows(): Promise<RecordRow[]> {
    return this.page.evaluate(() => {
      const out: RecordRow[] = [];
      document.querySelectorAll('table tbody tr').forEach((tr) => {
        const kebab = tr.querySelector('[data-test-id$="-actions-kebab"]');
        if (!kebab) return;
        const recordId = (kebab.getAttribute('data-test-id') || '')
          .replace('records-', '')
          .replace('-actions-kebab', '');
        const originEl = tr.querySelector('[data-test-id^="record-origin-badge-"]');
        const origin = (originEl?.getAttribute('data-test-id') || '').replace('record-origin-badge-', '');
        const certEl = tr.querySelector('[data-test-id^="record-certificate-situation-badge-"]');
        const certStatus = (certEl?.textContent || '').replace(/\s+/g, ' ').trim();
        const cells = Array.from(tr.querySelectorAll('td')).map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim());
        const content = cells.find((c) => c && !/^(public|home|Externo|Interno|more_vert)$/i.test(c)) || cells[1] || '';
        out.push({ recordId, origin, certStatus, content });
      });
      return out as RecordRow[];
    }) as Promise<RecordRow[]>;
  }

  /**
   * Espera os badges de "Situação do certificado" popularem. No Stage eles carregam de forma
   * assíncrona (e às vezes não renderizam sob degradação do env — ver recon). Sem isso,
   * `findRecordId` por status corre antes do dado existir e devolve null.
   */
  async waitForCertBadges(): Promise<void> {
    await expect
      .poll(
        () =>
          this.page
            .locator('[data-test-id^="record-certificate-situation-badge-"]')
            .evaluateAll((els) => els.filter((e) => (e.textContent || '').trim()).length)
            .catch(() => 0),
        {
          timeout: 20_000,
          message: 'badges de "Situação do certificado" não renderizaram (possível degradação do env)',
        },
      )
      .toBeGreaterThan(0);
  }

  /** Primeiro recordId que casa origem + status do certificado (case-insensitive). */
  async findRecordId(origin: RecordOrigin, certStatus: string): Promise<string | null> {
    await this.waitForCertBadges();
    const rows = await this.scanRows();
    const hit = rows.find(
      (r) => r.origin === origin && new RegExp(certStatus, 'i').test(r.certStatus),
    );
    return hit?.recordId ?? null;
  }

  /**
   * Localiza um recordId pela substring de texto da linha (ex.: o conteúdo "Minicurso"),
   * opcionalmente filtrando por origem. Mais robusto que `findRecordId` porque NÃO depende
   * do badge de "Situação do certificado", que no Stage carrega de forma assíncrona/instável
   * (KPI counts e cert-situation às vezes não renderizam — ver recon).
   */
  async findRecordByText(substring: string, origin?: RecordOrigin): Promise<string | null> {
    return this.page.evaluate(
      ({ substring, origin }) => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        for (const tr of rows) {
          const kebab = tr.querySelector('[data-test-id$="-actions-kebab"]');
          if (!kebab) continue;
          if (!(tr.textContent || '').includes(substring)) continue;
          if (origin) {
            const og = (tr.querySelector('[data-test-id^="record-origin-badge-"]')?.getAttribute('data-test-id') || '')
              .replace('record-origin-badge-', '');
            if (og !== origin) continue;
          }
          return (kebab.getAttribute('data-test-id') || '').replace('records-', '').replace('-actions-kebab', '');
        }
        return null;
      },
      { substring, origin },
    ) as Promise<string | null>;
  }

  /** Primeiro recordId de origem `internal`. */
  async findInternal(): Promise<string | null> {
    const rows = await this.scanRows();
    return rows.find((r) => r.origin === 'internal')?.recordId ?? null;
  }

  kebab(recordId: string): Locator {
    return this.page.locator(`[data-test-id="records-${recordId}-actions-kebab"]`);
  }

  /** Abre o menu 3-pontos e devolve os rótulos dos itens (sem o prefixo de ícone). */
  async menuItems(recordId: string): Promise<string[]> {
    await hideChatWidget(this.page);
    const kebab = this.kebab(recordId);
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();
    const menu = this.page.locator('[role="menu"]:visible, .chakra-menu__menu-list:visible');
    await expect(menu.first()).toBeVisible({ timeout: 8_000 });
    const raw = await menu.locator('[role="menuitem"], button, a').allInnerTexts();
    await this.page.keyboard.press('Escape').catch(() => {});
    await expect(menu.first()).toBeHidden({ timeout: 5_000 }).catch(() => {});
    // "edit Editar" → "Editar": tira o ligature do ícone (1ª palavra minúscula técnica).
    return raw
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .map((s) => s.replace(/^[a-z_]+\s+/, ''));
  }

  /** Abre o form de edição via kebab → "Editar" e espera a rota /edit. */
  async openEdit(recordId: string): Promise<void> {
    await hideChatWidget(this.page);
    const kebab = this.kebab(recordId);
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();
    await this.page.getByRole('menuitem', { name: /Editar/ }).first().click();
    await this.page.waitForURL(/\/records\/\d+\/edit/, { timeout: 20_000 });
    await expect(this.page.getByTestId('record-form-save-button')).toBeVisible({ timeout: 20_000 });
    // O widget de chat recarrega na rota /edit — re-suprime pra não interceptar o rodapé.
    await hideChatWidget(this.page);
  }
}

export class RegistroFormPage {
  constructor(private readonly page: Page) {}

  saveButton(): Locator {
    return this.page.getByTestId('record-form-save-button');
  }

  cancelButton(): Locator {
    return this.page.getByTestId('record-form-cancel-button');
  }

  /** Botão "Excluir" do rodapé (sem testId — só texto). */
  deleteButton(): Locator {
    return this.page.getByRole('button', { name: 'Excluir', exact: true });
  }

  peopleInput(): Locator {
    return this.page.getByTestId('people-selector-input');
  }

  /** Banner verde de registro Emitido (RN46). */
  greenBanner(): Locator {
    return this.page.getByText('Certificado aprovado', { exact: false });
  }

  /** Banner vermelho de registro Recusado (RN46). */
  redBanner(): Locator {
    return this.page.getByText('Registro de aprendizagem recusado', { exact: false });
  }

  historicoButton(): Locator {
    return this.page.getByRole('button', { name: /Histórico/i });
  }

  /**
   * Inputs de data por `name` (mais estável que filtrar por label). Mapa observado no
   * recon: início=startDate, término=endDate, aprovação=approvalDate,
   * certificado=certificateDate, validade=expirationDate.
   */
  dateInput(name: 'startDate' | 'endDate' | 'approvalDate' | 'certificateDate' | 'expirationDate'): Locator {
    return this.page.locator(`input[name="${name}"]`);
  }

  /**
   * O provedor é exibido como chip/texto do combobox (não como `<input value>`), então
   * validamos pré-população do provedor pela presença do texto no form.
   */
  providerText(value: string): Locator {
    return this.page.getByText(value, { exact: false });
  }

  /** Campo de carga horária (input com valor tipo "0001:00:00"). */
  cargaHorariaInput(): Locator {
    return this.page.locator('input[name="workload_seconds"]');
  }

  /** Clica em Salvar re-suprimindo o widget de chat (que intercepta o rodapé do form). */
  async clickSave(): Promise<void> {
    await hideChatWidget(this.page);
    await this.saveButton().click();
  }

  /**
   * Salva e espera a toast informada (ex.: "Registro salvo"). Começa a observar a toast
   * ANTES do click: o save dispara a toast e em seguida navega de volta pra lista, e a toast
   * Chakra é transitória — esperar só depois do click perderia a janela em que ela existe.
   */
  async saveAndExpectToast(toastText: string): Promise<void> {
    await hideChatWidget(this.page);
    const toast = this.page.locator('.chakra-toast').filter({ hasText: toastText }).first();
    const appeared = toast.waitFor({ state: 'visible', timeout: 15_000 }).then(
      () => true,
      () => false,
    );
    await this.saveButton().click();
    expect(await appeared, `toast "${toastText}" não apareceu após salvar`).toBe(true);
  }
}
