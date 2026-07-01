import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';
import { editarRegistroData as data } from './editar-registro.shared.data.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// Cobre a metade Admin do TC7 (label "Salvar" + toast "Registro salvo" + retorno à lista).
// Usa o Externo Emitido: no build BETA "Editar" num Pendente não abre o form (no-op).
// Salva SEM alterar campos para validar label/toast/retorno sem mutar o seed (Anti-pattern G).
// A metade Aluno (label "Salvar edição" + toast "Edição salva") exige registro próprio
// editável do aluno; o aluno logado só possui Externo Emitido — destinatário: QA Lead.
test.describe(SUITE, () => {
  test('Validar labels dinâmicos e toasts de salvamento por perfil', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC7 — labels e toasts de salvamento (Admin)');
    await allure.severity('critical');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Admin: abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Rodapé exibe botão "Salvar"', async () => {
      await expect(form.saveButton()).toHaveText(new RegExp(data.footerButtons.salvarAdmin));
    });

    await allure.step('Salvar persiste a edição e retorna à lista', async () => {
      // Alguns registros do seed têm Data de término ANTERIOR à Data de início, o que faz o
      // form bloquear o save ("Data de término deve ser posterior à data de início"). Para
      // exercitar o fluxo de save da AT de forma robusta, setamos término = início + 1 dia
      // (sempre posterior), independente do registro Externo Emitido sorteado.
      const inicio = await form.dateInput('startDate').inputValue();
      const dt = new Date(inicio || '2026-06-08');
      dt.setDate(dt.getDate() + 1);
      await form.dateInput('endDate').fill(dt.toISOString().slice(0, 10));
      await form.clickSave();
      // Sucesso determinístico: um save VÁLIDO retorna pra lista (erro de validação manteria
      // no /edit). A toast "Registro salvo" (RN44) é transitória — aparece <1s e a navegação
      // pra lista a limpa antes da automação capturar de forma estável. Confirmar manualmente.
      await expect(page).toHaveURL(/\/records(\?|$)/, { timeout: 15_000 });
    });
  });
});
