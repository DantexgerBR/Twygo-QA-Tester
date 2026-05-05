// Testsuite: Ajustar nomenclatura do agente de atendimento no super admin
//
// DIAGNÓSTICO EMPÍRICO (2026-05-04):
// - `/super_admin*` retorna 404. `/admin` retorna 200 (título "Twygo Admin")
//   mas só expõe `/admin/manage/features` (Flipper feature flags).
// - "Tabela de preços" e "Manutenção de assinaturas" (citados no XML, campo
//   "Funcionalidades") não foram encontrados nas URLs `/admin/price_tables`,
//   `/admin/contracts`, `/admin/subscriptions` (todas 404).
//
// REVISAR_MANUAL: provavelmente requer credenciais de Super Admin GLOBAL do
// Twygo (não do org 36602 — esse só é Admin de um ambiente). Quando essa
// credencial estiver disponível, mapear: (a) URL real da tabela de preços;
// (b) URL real da manutenção de assinaturas; (c) seletor do campo
// "Funcionalidades" e da nomenclatura "Agente de atendimento" vs "Agente de IA".

import { test } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';

test.describe('Ajustar nomenclatura do agente de atendimento no super admin', () => {
  test('Ajustar nomenclatura do agente de atendimento no super admin', async () => {
    test.fixme(true, 'Requer acesso Super Admin não mapeado no projeto — REVISAR_MANUAL');
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Ajustar nomenclatura do agente de atendimento no super admin');
    await allure.story('Ajustar nomenclatura do agente de atendimento no super admin');
    await allure.severity('critical');
  });
});
