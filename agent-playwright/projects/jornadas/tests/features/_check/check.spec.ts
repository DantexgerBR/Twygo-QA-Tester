// TEMPORÁRIO — confere e limpa órfãos deixados pelas novas suítes. Apagar depois.
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import { JourneyListPage } from '../../../pages/JourneyListPage.js';
import { acessoData as data } from '../acesso-e-regras-de-inscricao/acesso-e-regras-de-inscricao.data.js';

const ORFA = /^Jornada (TC\d|PROBE|EVID|PREDEPLOY|PROBECR)/;

test('CHECK/CLEANUP órfãos', async ({ page }) => {
  test.setTimeout(700_000);
  const listagem = new JourneyListPage(page, data.ambiente);
  for (let volta = 1; volta <= 15; volta++) {
    await listagem.goto();
    await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => null);
    await page.waitForTimeout(1_500);
    const celulas = page.locator('tbody tr td:first-child');
    const nomes: string[] = [];
    for (let i = 0; i < (await celulas.count()); i++) {
      const t = (await celulas.nth(i).innerText().catch(() => '')).trim();
      if (t) nomes.push(t);
    }
    if (volta === 1) console.log(`listagem: ${nomes.length} → ${JSON.stringify(nomes)}`);
    const alvo = nomes.find((n) => ORFA.test(n));
    if (!alvo) { console.log(`volta ${volta}: sem órfãs ✅`); break; }
    console.log(`  apagando órfã "${alvo}"`);
    await listagem.excluirPorNome_safe(alvo);
  }
  await listagem.goto();
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => null);
  await page.waitForTimeout(1_500);
  const restantes = await page.getByText(ORFA).count();
  console.log(`RESTANTES órfãs: ${restantes}`);
  expect(restantes).toBe(0);
});
