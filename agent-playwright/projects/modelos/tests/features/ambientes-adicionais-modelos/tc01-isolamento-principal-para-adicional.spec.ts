import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-21): suite requer env adicional pareado.
// Audit do config/environment.json:
//   - staging-base-de-conhecimento (principal): EXISTE ✓
//   - staging-base-de-conhecimento-aditional: NÃO EXISTE
// Apenas widgets tem env adicional configurado (staging-widgets-aditional).
//
// Pra destravar:
//   1. DevOps provisionar tenant pareado em base-de-conhecimento (subdomain
//      "adicional.basedeconhecimento.stage.twygoead.com" no mesmo padrão).
//   2. Adicionar entrada em config/environment.json (pattern staging-{slug}-aditional).
//   3. Adicionar credenciais no .env.example + .env.
//   4. Ativar feature flag modelos_de_conteudo na org do env adicional.
// Após isso, spec implementaria:
//   - Criar modelo no principal via UI (ContentModelEditPage + Kit seedado)
//   - Trocar storageState pra env adicional (skill testar-ambientes-adicionais-twygo)
//   - Navegar listagem do adicional + assertar modelo principal NÃO aparece
// Destinatário: DevOps + QA Lead.
test.describe.fixme('Ambientes adicionais - Modelos', () => {
  test('Modelos criados no principal não aparecem no adicional', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Ambientes adicionais - Modelos');
    await allure.story('Modelos criados no principal não aparecem no adicional');
    await allure.severity('critical');

    await expect(page).toHaveURL(/.*/);
  });
});
