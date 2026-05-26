import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { safeGoto } from '../utils/modals.js';

/**
 * Flipper Admin UI (`/admin/manage/features/<flag>`).
 *
 * Twygo monta a gem `flipper-ui` em `/admin/manage`. Cada feature flag é
 * controlada por uma página com a estrutura padrão Flipper:
 *
 *  - heading h4 com o nome da flag (ex `paineis_do_usuario_beta_test`)
 *  - status text (` Conditionally enabled` / ` Disabled` / ` Fully enabled`)
 *  - bloco "Enabled for N actors" + `Add an actor` + lista heading/Remove
 *  - bloco "No groups enabled" / "Enabled for X% of actors" / `Fully Enable` / `Disable`
 *  - Danger Zone com `Delete`
 *
 * Cada actor segue o formato `MODEL_NAME;ID` — para Twygo é sempre
 * `Organization;<orgId>`. Adicionar uma org à lista de actors HABILITA
 * a flag para aquela org; remover DESABILITA.
 *
 * **Pré-condição**: usuário logado com flag de acesso elevado no tenant
 * (path `/admin/manage/features` retorna 404 para users normais). Em
 * `staging-widgets-disabled`, `claude@teste.com` está elevado — usar
 * `SECONDARY_STORAGE_PATH` do globalSetup.
 *
 * **Regras duras** (ver skill `testar-feature-flag-twygo`):
 *  - NUNCA clicar `Fully Enable` / `Disable` no nível da flag — afeta TODAS
 *    as orgs do banco. Usar apenas `addActor`/`removeActor` no escopo da org.
 *  - NUNCA clicar `Delete` na Danger Zone — remove a flag do sistema.
 *  - Specs que mudam estado da flag DEVEM reverter no `afterAll` (estado
 *    Flipper é compartilhado entre runs E entre projetos).
 *
 * Validado live 2026-05-15 em
 * `https://widgetsdisabled.stage.twygoead.com/admin/manage/features/paineis_do_usuario_beta_test`.
 */
export class FlipperAdminPage extends BasePage {
  readonly path = '/admin/manage/features';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navega até a página da feature flag específica. Usa `safeGoto` —
   * o Flipper Admin é uma tela bootstrap simples sem React/Chakra, mas
   * `safeGoto` ainda é obrigatório para tratar NPS/Sofia (que NÃO aparece
   * em /admin/* mas a regra dura do monorepo é universal).
   */
  async gotoFeature(flag: string): Promise<void> {
    await safeGoto(this.page, `${this.path}/${flag}`);
    await this.featureHeading(flag).waitFor({ state: 'visible', timeout: 10_000 });
  }

  /** Heading h4 com o nome da feature flag. Usado para confirmar carregamento. */
  featureHeading(flag: string): Locator {
    return this.page.getByRole('heading', { name: flag, level: 4 });
  }

  /**
   * Heading da seção "Enabled for N actors". Útil para asserções de
   * quantidade.
   */
  enabledForActorsHeading(): Locator {
    return this.page.getByRole('heading', { name: /Enabled for \d+ actors?/i, level: 6 });
  }

  /** Botão "Add an actor" — colapsado por default. */
  addActorToggle(): Locator {
    return this.page.getByRole('button', { name: 'Add an actor' });
  }

  /**
   * Input revelado após click no toggle. Flipper UI v1.3 renderiza como
   * `<input type="text" name="value" placeholder="MODEL_NAME;ID">` dentro
   * do form Add. CADA form de Remove TAMBÉM tem `<input name="value"
   * type="hidden">` com o actor — por isso filtramos `type="text"`
   * explicitamente. Sem isso, locator bate 1 + N (Add + cada Remove).
   */
  addActorInput(): Locator {
    return this.page.locator('form[action$="/actors"] input[name="value"][type="text"]');
  }

  /** Botão de submit do form (nome diferente do toggle: `Add Actor` em CamelCase). */
  addActorSubmit(): Locator {
    return this.page.getByRole('button', { name: 'Add Actor', exact: true });
  }

  /**
   * Heading h6 com o nome do actor (`Organization;36989`). Flipper UI
   * v1.3 renderiza com whitespace/newlines em volta do texto — usamos
   * `locator('h6').filter({ hasText })` que normaliza, em vez de
   * `getByRole('heading', exact:true)` que pode falhar com whitespace.
   * `hasText` busca substring exata após normalização — não bate outros
   * actors porque cada h6 contém apenas o nome do próprio actor.
   */
  actorHeading(actor: string): Locator {
    return this.page.locator('h6').filter({ hasText: actor });
  }

  /**
   * Botão `Remove` adjacente ao heading do actor. Flipper UI v1.3
   * renderiza cada actor como `<h6>Organization;X</h6>` seguido (sibling)
   * de um `<form>` contendo input hidden com `value="Organization;X"` e
   * `<button>Remove</button>`. O input hidden é o seletor estável — não
   * depende de DOM-walking frágil.
   */
  actorRemoveButton(actor: string): Locator {
    return this.page
      .locator(`form:has(input[value="${actor}"])`)
      .getByRole('button', { name: 'Remove', exact: true });
  }

  /** True sse o actor está na lista de actors habilitados. */
  async isActorEnabled(actor: string): Promise<boolean> {
    return (await this.actorHeading(actor).count()) > 0;
  }

  /**
   * Adiciona actor à lista submetendo o form Add via `form.submit()` JS
   * direto, em vez de fill + click. O click em `<input type="submit">`
   * mostrou-se inconfiável no Flipper UI v1.3 (submit dispatchou request
   * sem o payload completo em alguns casos). `form.submit()` reaproveita
   * o `authenticity_token` Rails CSRF + `operation=enable` hidden +
   * preenche `value` em runtime — caminho que funcionou em recon
   * manual via DevTools.
   *
   * NÃO é idempotente — se actor já está, Flipper aceita silencioso mas
   * heading pré-existente passa o waitFor sem detectar duplicata. Use
   * `ensureActorEnabled` para fluxo seguro.
   */
  async addActor(actor: string): Promise<void> {
    const responsePromise = this.page.waitForResponse(
      (resp) => resp.url().includes('/actors') && resp.request().method() === 'POST',
      { timeout: 15_000 },
    );
    const result = await this.page.evaluate((actorVal) => {
      const addInput = document.querySelector<HTMLInputElement>(
        'form[action$="/actors"] input[type="text"][name="value"]',
      );
      if (!addInput) return { ok: false, error: 'Add form input not found' };
      const form = addInput.closest('form');
      if (!form) return { ok: false, error: 'Add form parent not found' };
      addInput.value = actorVal;
      form.submit();
      return { ok: true };
    }, actor);
    if (!result.ok) {
      throw new Error(`Flipper addActor: ${result.error}`);
    }
    const response = await responsePromise;
    if (!response.ok() && response.status() !== 302 && response.status() !== 303) {
      throw new Error(
        `Flipper POST /actors retornou ${response.status()} ao adicionar ${actor} — ` +
          `provável CSRF/auth. Verifique storageState e flag elevada do user.`,
      );
    }
    // POST 2xx/3xx é confirmação suficiente de que o estado foi
    // persistido no DB Flipper. O re-render UI pode atrasar por cache
    // ou navegação assíncrona, mas o backend já mudou. Esperar o
    // heading no DOM atual aqui adiciona flakiness sem ganho.
  }

  /**
   * Remove actor da lista submetendo o form Remove via `form.submit()`.
   * Localiza o form pelo `<input type="hidden" value="Organization;X">`
   * presente apenas no form da própria org.
   *
   * NÃO é idempotente — se actor não está, joga. Use `ensureActorDisabled`.
   */
  async removeActor(actor: string): Promise<void> {
    const responsePromise = this.page.waitForResponse(
      (resp) => resp.url().includes('/actors') && resp.request().method() === 'POST',
      { timeout: 15_000 },
    );
    const result = await this.page.evaluate((actorVal) => {
      const escaped = actorVal.replace(/"/g, '\\"');
      const hidden = document.querySelector(
        `form[action$="/actors"] input[type="hidden"][value="${escaped}"]`,
      );
      if (!hidden) return { ok: false, error: 'Remove form not found' };
      const form = hidden.closest('form');
      if (!form) return { ok: false, error: 'Remove form parent not found' };
      form.submit();
      return { ok: true };
    }, actor);
    if (!result.ok) {
      throw new Error(`Flipper removeActor: ${result.error}`);
    }
    const response = await responsePromise;
    if (!response.ok() && response.status() !== 302 && response.status() !== 303) {
      throw new Error(
        `Flipper POST /actors retornou ${response.status()} ao remover ${actor}.`,
      );
    }
  }

  /**
   * Garante que o actor está habilitado. Idempotente — no-op se já está.
   * Retorna `true` se uma alteração foi feita, `false` se já estava no
   * estado desejado. Use o boolean no `afterAll` para reverter só se
   * o setup mexeu.
   */
  async ensureActorEnabled(actor: string): Promise<boolean> {
    if (await this.isActorEnabled(actor)) return false;
    await this.addActor(actor);
    return true;
  }

  /** Garante que o actor NÃO está habilitado. Idempotente. */
  async ensureActorDisabled(actor: string): Promise<boolean> {
    if (!(await this.isActorEnabled(actor))) return false;
    await this.removeActor(actor);
    return true;
  }
}
