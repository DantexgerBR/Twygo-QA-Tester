import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-22): seletor canônico do botão "Inserir espaço reservado
// para IA" no toolbar do Plate Editor ainda não confirmado via audit MCP.
// Destinatário: planner+generator em sessão livre OU audit MCP dedicado.
test.describe.fixme('Criação de Design de Página', () => {
  test('Plate Editor — inserir espaço reservado para IA', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Plate Editor — inserir espaço reservado para IA');
    await allure.severity('critical');

    // Implementação parcial — necessária após audit do toolbar:
    //   1. await dp.gotoFromFirstModel()
    //   2. Preencher Nome + Tipo + Sequência + Salvar Identificação
    //   3. Click botão "Inserir espaço reservado para IA" (seletor a confirmar)
    //   4. Preencher textarea "Inserir conteúdo IA para validação automatizada"
    //   5. Click "Confirmar"
    //   6. Validar nó inserido no editor com prompt visível
    await expect(page).toHaveURL(/.*/);
  });
});
