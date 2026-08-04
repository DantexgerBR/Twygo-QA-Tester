import { expect, type Locator, type Page } from '@playwright/test';
import { getBaseUrl, getEnvByName, getOrgId } from '../../../src/utils/environment.js';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Listagem de Jornadas Padrão. Existe sobretudo pelo `excluirPorNome_safe`: toda suíte de Jornadas
 * precisa de jornada SALVA (as tabs do form são progressivas — só liberam após o save), então toda
 * suíte cria estado e precisa devolver o ambiente ao lugar (skill limpar-dados-de-teste-twygo).
 */
export class JourneyListPage {
  constructor(
    private readonly page: Page,
    private readonly environmentName: string,
  ) {}

  private url(): string {
    const env = getEnvByName(this.environmentName);
    const orgId = env.orgId ?? getOrgId();
    return new URL(`/o/${orgId}/journeys`, env.baseUrl || getBaseUrl()).toString();
  }

  async goto(): Promise<void> {
    await safeGoto(this.page, this.url());
  }

  linhaPorNome(nome: string): Locator {
    return this.page.locator('tr', { has: this.page.getByText(nome, { exact: true }) }).first();
  }

  /** Cabeçalhos da tabela, na ordem. O último vem vazio: ações não têm cabeçalho (regra da AT). */
  async colunas(): Promise<string[]> {
    const th = this.page.locator('thead th');
    const out: string[] = [];
    for (let i = 0; i < (await th.count()); i++) {
      out.push((await th.nth(i).innerText().catch(() => '')).replace(/\s+/g, ' ').trim());
    }
    return out;
  }

  /** Card de dashboard pelo título ("Situação das Jornadas", "Distribuição dos Inscritos"...). */
  getDashboard(titulo: string): Locator {
    return this.page.getByText(titulo, { exact: false }).first();
  }

  /**
   * ⚠️ A AT chama o campo de "Buscar", mas o placeholder real é **"Pesquise pelo nome da jornada"** e o
   * id é `#play-interest-search` (componente compartilhado com o Play). Não existe `input[type=search]`
   * nem placeholder com "Buscar" na página — medido em 03/08. Procurar por "Buscar" dá timeout de 30s.
   */
  getBuscaInput(): Locator {
    return this.page.locator('#play-interest-search').or(this.page.getByPlaceholder(/Pesquise pelo nome/i)).first();
  }

  getFiltrosButton(): Locator {
    return this.page.getByRole('button', { name: /filtr/i }).first();
  }

  /** Ações da linha são ÍCONES `[data-icon]`, não `<button>` — `getByRole('button')` acha zero. */
  getAcaoLinha(nome: string, acao: 'edit' | 'content_copy' | 'delete'): Locator {
    return this.linhaPorNome(nome).locator(`[data-icon="${acao}"]`).first();
  }

  /** Valor da coluna "Inscrições" da linha — usado pra provar que a cópia nasce com 0. */
  async inscricoesDe(nome: string): Promise<string> {
    const celula = this.linhaPorNome(nome).locator('[data-test-id^="journeys-subscriptions-total-"]');
    return (await celula.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  }

  async buscar(termo: string): Promise<void> {
    const b = this.getBuscaInput();
    await b.click();
    await b.press('ControlOrMeta+a');
    await b.press('Delete');
    if (termo) await b.pressSequentially(termo);
    await this.page.waitForTimeout(2_500); // a listagem filtra com debounce
  }

  /**
   * Apaga a jornada e CONFIRMA que saiu da listagem. Nunca estoura se ela já não existe — cleanup
   * roda em `finally`, e cleanup que quebra esconde o erro real do teste.
   *
   * ⚠️ Dois detalhes medidos em 03/08, ambos contraintuitivos:
   *  - as ações da linha são ícones `[data-icon]`, não `<button>` (`getByRole('button')` acha ZERO);
   *  - o ícone só responde a **clique real** — `dispatchEvent('click')` não abre o modal (o oposto do
   *    switch Chakra do form, onde só `dispatchEvent` funciona);
   *  - o botão de confirmação do modal é **"Continuar"**, não "Excluir"/"Confirmar".
   */
  async excluirPorNome_safe(nome: string): Promise<void> {
    await this.goto();
    const linha = this.linhaPorNome(nome);
    // ⚠️ ESPERAR a linha, não só contar. A versão anterior fazia `if (!count()) return` logo após o
    // goto: a tabela ainda não tinha renderizado, count dava 0 e o cleanup saía CALADO. Resultado
    // medido em 03/08: 7 jornadas órfãs na org com todas as sondas imprimindo "CLEANUP ok".
    const apareceu = await linha.waitFor({ state: 'visible', timeout: 20_000 }).then(() => true, () => false);
    if (!apareceu) {
      // Barulho de propósito: cleanup que não acha o que criou é defeito, não caminho normal.
      console.warn(`[cleanup] jornada "${nome}" não apareceu na listagem em 20s — pode ter ficado órfã.`);
      return;
    }

    await linha.locator('[data-icon="delete"]').first().click();
    const modal = this.page.locator('.chakra-modal__content').first();
    await expect(modal).toBeVisible({ timeout: 15_000 });
    const botoes = modal.getByRole('button');
    for (let i = 0; i < (await botoes.count()); i++) {
      const texto = ((await botoes.nth(i).innerText().catch(() => '')) || '').trim();
      if (texto && !/cancelar|fechar|voltar|não/i.test(texto)) {
        await botoes.nth(i).click();
        break;
      }
    }
    await expect(modal).toBeHidden({ timeout: 15_000 });
    await this.goto();
    await expect(this.page.getByText(nome, { exact: true })).toHaveCount(0, { timeout: 15_000 });
  }
}
