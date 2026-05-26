// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Worker - Migração de painéis', () => {
  test('Worker cria painel padrão para organização sem painel pré-existente', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: testa worker backend (Sidekiq) — validar via agent-db ou backend test suite (RSpec/equivalente). Ver _README.md desta pasta. Destinatário: QA Lead.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Worker - Migração de painéis');
    await allure.story('Worker cria painel padrão para organização sem painel pré-existente');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Worker executa e cria painel padrão', async () => {
      // Pertence ao agent-db ou backend suite
      expect(true).toBe(true);
    });
  });
});
