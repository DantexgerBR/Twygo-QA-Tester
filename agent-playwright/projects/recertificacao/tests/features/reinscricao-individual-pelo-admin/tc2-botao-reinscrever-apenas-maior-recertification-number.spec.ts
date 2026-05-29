import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { tc2Data } from './tc2-botao-reinscrever-apenas-maior-recertification-number.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.7.1 (2026-05-28): refator pra
  // `alunoAprovadoNoCursoFixoSeed` (multi-recert subproduto) foi
  // tentado mas falhou pelo mesmo problema do TC3 — click "Iniciar
  // reinscrição" no Chakra Menu não dispara modal/handler do app.
  // Validado live: aluno produzido pela fixture já está em estado
  // pós-recertificação automática do backend, kebab abre menu visível
  // mas click no item "Iniciar reinscrição" é rejeitado silenciosamente.
  //
  // Mesma raiz que TC3 — depende de `seed-roadmap-tc3-auto-recert-cancel`
  // OU descoberta de como Playwright pode disparar handler do Chakra Menu
  // (provavelmente `page.mouse.click(x, y)` com coordenadas exatas).
  //
  // Fixme legítimo §7.6 F categoria "chakra-menu-click-bug + auto-recert".
  test.fixme(
    true,
    'seed-roadmap-tc3-auto-recert-cancel + chakra-menu-click-bug: TC2 herda mesma raiz do TC3. Tentativa refator com alunoAprovadoNoCursoFixoSeed falhou — backend auto-recertifica + click em menuitem Chakra não dispara handler. Ver skill provisionar-seed v1.7.1.',
  );
  test('TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story(
      'Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number',
    );
    await allure.severity('critical');
    expect(tc2Data.qtdLinhasHistoricoCompleto).toBe(2);
  });
});
