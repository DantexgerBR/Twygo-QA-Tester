import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

test.describe(SUITE, () => {
  // fixme: seed ausente — não há afordância na administração da org (37093)
  // para ZERAR o crédito de IA. A aba "Política de créditos de IA" é só uma
  // tabela informativa (`ai-credits-policy-*`), não um controle de saldo.
  // Zerar crédito exige Super Admin/backend. Destinatário: QA Lead/infra.
  // Matriz F do CLAUDE.md §7.6 — categoria "seed ausente".
  test.fixme('Validar estado habilitada + sem crédito no Admin (modal com Contato)', async () => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar estado habilitada + sem crédito no Admin (modal com Contato)');
    await allure.severity('critical');
    // seed ausente: requer org com IA habilitada e crédito ZERADO. Ao acionar
    // "Preencher com IA" deve abrir modal "Limite de créditos atingido"
    // (top-center) com botão "Contato" (roxo) e X de dismiss.
  });
});
