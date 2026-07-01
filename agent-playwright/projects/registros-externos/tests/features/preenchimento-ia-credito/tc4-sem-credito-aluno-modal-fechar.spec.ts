import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

test.describe(SUITE, () => {
  // fixme: seed ausente — mesma causa do TC3 (sem afordância de zerar crédito
  // de IA no admin da org 37093; requer Super Admin/backend). Sem crédito
  // zerado não há como disparar o modal "Limite de créditos atingido" na
  // variação Aluno (corpo curto + botão "Fechar"). Destinatário: QA Lead/infra.
  // Matriz F do CLAUDE.md §7.6 — categoria "seed ausente".
  test.fixme('Validar estado habilitada + sem crédito no Aluno (modal com Fechar)', async () => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar estado habilitada + sem crédito no Aluno (modal com Fechar)');
    await allure.severity('critical');
    // seed ausente: requer org com IA habilitada e crédito ZERADO + perfil
    // Aluno. Modal esperado: "Limite de créditos atingido" com corpo curto
    // "Todos os créditos disponíveis foram utilizados." e botão "Fechar".
  });
});
