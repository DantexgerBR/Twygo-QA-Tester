import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage } from '../../../pages/EditarRegistroPage.js';
import { editarRegistroData as data } from './editar-registro.shared.data.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// Usa expect.soft na matriz pra capturar TODAS as divergências numa única run, em vez
// de parar na primeira. Divergências confirmadas no recon 2026-06-22:
//   - Externo Pendente exibe "Editar" junto de "Avaliar" (AT TC2.4 diz que não deve)
//   - Interno exibe "Editar" (AT TC2.6 diz que não deve)
// O caso Externo Emitido (TC2.1) confere.
test.describe(SUITE, () => {
  test('Validar disponibilidade do "Editar" para o Admin (matriz origem × status)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC2 — disponibilidade do "Editar" para o Admin');
    await allure.severity('critical');

    const lista = new RegistrosListPage(page);
    await allure.step('Abrir "Aprendizagem > Registros" (Admin)', async () => {
      await lista.gotoAdmin();
    });

    await allure.step('Externo Emitido → "Editar" presente, sem "Avaliar" (AT TC2.1)', async () => {
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: Externo Emitido').not.toBeNull();
      const items = await lista.menuItems(id!);
      expect.soft(items, `Emitido: [${items.join(', ')}]`).toContain(data.menuItems.editar);
      expect.soft(items, `Emitido: [${items.join(', ')}]`).not.toContain(data.menuItems.avaliar);
    });

    await allure.step('Externo Pendente → "Avaliar" primário, sem "Editar" (AT TC2.4)', async () => {
      const id = await lista.findRecordId('external', 'Pendente');
      expect(id, 'seed: Externo Pendente').not.toBeNull();
      const items = await lista.menuItems(id!);
      expect.soft(items, `Pendente: [${items.join(', ')}]`).toContain(data.menuItems.avaliar);
      expect.soft(items, `Pendente: [${items.join(', ')}]`).not.toContain(data.menuItems.editar);
    });

    await allure.step('Interno → "Editar" NÃO exibido (AT TC2.6)', async () => {
      const id = await lista.findInternal();
      expect(id, 'seed: Interno').not.toBeNull();
      const items = await lista.menuItems(id!);
      expect.soft(items, `Interno: [${items.join(', ')}]`).not.toContain(data.menuItems.editar);
    });

    // seed ausente: Externo Recusado (TC2.2), Externo Expirado (TC2.3) e
    // Externo Substituído (TC2.5) não existem no env — destinatário: QA Lead.
  });
});
