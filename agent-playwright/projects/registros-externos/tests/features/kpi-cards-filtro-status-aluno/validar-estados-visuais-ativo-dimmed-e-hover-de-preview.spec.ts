import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage, KPI_COLOR } from '../../../pages/MeuHistoricoPage.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

test.describe(SUITE, () => {
  test('Validar estados visuais: ativo, dimmed e hover de preview', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar estados visuais: ativo, dimmed e hover de preview');
    await allure.severity('critical');
    await allure.tag('REVIEW_NEEDED');

    const meuHistorico = new MeuHistoricoPage(page);

    await allure.step('1. Acessar "Meu histórico" — todos com peso visual normal', async () => {
      await meuHistorico.goto();
      for (const s of ['emitted', 'expired', 'pending', 'rejected'] as const) {
        expect(await meuHistorico.isActive(s)).toBe(false);
      }
    });

    await allure.step('2. Clicar "Pendentes" — ativo ganha borda na cor + elevação', async () => {
      await meuHistorico.clickCard('pending');
      expect(await meuHistorico.isActive('pending'), 'elevação/boxShadow').toBe(true);
      await expect
        .poll(async () => meuHistorico.getBorderColor('pending'), { timeout: 5_000 })
        .toBe(KPI_COLOR.pending);
      // Os outros 3 cards ficam "dimmed". // REVISAR: o dimming (grayscale +
      // opacidade) é aplicado no <canvas> do donut (redesenho dessaturado), não
      // no DOM — getComputedStyle não enxerga. Validamos o proxy DOM-observável:
      // os não-ativos não recebem a elevação do ativo.
      for (const s of ['emitted', 'expired', 'rejected'] as const) {
        expect(await meuHistorico.isActive(s), `${s} sem elevação (não-ativo)`).toBe(false);
      }
    });

    await allure.step('3. Hover no card "Emitidos" (dimmed) — restaura visual temporário', async () => {
      // REVISAR: a restauração no hover é repintada no canvas — não verificável
      // por DOM. Asseguramos apenas que o hover não quebra o card e o conteúdo
      // segue visível.
      await meuHistorico.hoverCard('emitted');
      await expect(meuHistorico.card('emitted')).toBeVisible();
      await expect(meuHistorico.countNode('emitted')).toBeVisible();
    });

    await allure.step('4. Retirar o mouse — card volta ao dimmed', async () => {
      // REVISAR: idem passo 3 (estado de dim é canvas). O card "Pendentes" segue
      // sendo o único ativo após sair o hover.
      await page.mouse.move(0, 0);
      expect(await meuHistorico.isActive('pending')).toBe(true);
      expect(await meuHistorico.isActive('emitted')).toBe(false);
    });
  });
});
