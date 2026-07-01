import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

test.describe(SUITE, () => {
  // fixme: afordância inexistente no build — o recon ao vivo (2026-06-29) NÃO
  // encontrou o ícone sparkle de crédito na TopBar (só box/chat/bell/avatar).
  // Sem o sparkle não há como alternar com/sem crédito pela UI nem validar
  // cores/tooltip/propagação. Destinatário: produto — confirmar se a
  // afordância existe nesta versão. Matriz F do CLAUDE.md §7.6.
  test.fixme('Validar toggle de crédito de IA na TopBar', async () => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar toggle de crédito de IA na TopBar');
    await allure.severity('normal');
    // afordância ausente: sparkle de crédito não existe na TopBar deste build.
  });
});
