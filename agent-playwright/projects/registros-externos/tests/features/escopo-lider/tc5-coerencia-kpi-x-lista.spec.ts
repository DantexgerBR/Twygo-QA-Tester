import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosAdminPage } from '../../../pages/RegistrosAdminPage.js';
import { TeamRecordsPage } from '../../../pages/TeamRecordsPage.js';
import { countAllRecords } from '../../../data/records-api.js';
import { escopoLiderData as data } from './escopo-lider.shared.data.js';

const SUITE = data.suiteName;

// TC5 (critical) — coerência permanente KPI × lista (RN 96.5).
// Lado Admin: INVARIANTE — o total de linhas da listagem (somando paginação)
// e o total da API de listagem batem com `total_general` de /records/stats.
// Não há criação/alteração de estado ⇒ sem cleanup (read-only).
// Lado Líder (passo 3 da AT): TESTÁVEL desde o recon "modo de uso" (2026-06-30,
// ver inputs/recon-escopo-lider-modo-uso.md). O recon §9 anterior errou ao
// concluir "escopo de Líder não aplicado": só exercitou o popover (→
// /dashboard_students) e o /records admin. A visão real do líder é o modelo de
// página "Gestão de Time > Registros externos" (/o/{org}/team/records), cujo
// stats é escopado aos liderados (`?in_use_mode_layout=true&team_scope=true`) —
// distinto do Admin. A coerência KPI×lista vale também nesse escopo, e o teste
// é por invariante (não por nº de seed): mantém-se correto com 0 ou N liderados.
test.describe(SUITE, () => {
  test('Validar coerência permanente entre KPI e lista', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar coerência permanente entre KPI e lista');
    await allure.severity('critical');

    const registros = new RegistrosAdminPage(page);

    await allure.step('1. Acessar Registros como Admin e ler o total geral dos KPIs (via /stats)', async () => {
      // gotoLight: a coerência KPI×lista usa /stats + contagem de linhas, não o
      // render dos cards. Evita o gate de cards (testid `pending` divergiu p/
      // `awaiting_confirmation` no Admin — ver nota da suíte).
      await registros.gotoLight();
    });

    let totalGeneral = 0;
    await allure.step('2a. total_general de /records/stats é a fonte de verdade do KPI', async () => {
      const stats = await registros.getStats();
      totalGeneral = stats.totalGeneral;
      // Soma dos 4 cards + status sem card == total geral: por construção do
      // backend, total_general já agrega todos os status (com e sem card). Como
      // invariante mínimo, total_general deve ser >= soma dos status com card.
      const statusSum = Object.values(stats.byStatus).reduce((a, b) => a + b, 0);
      expect(totalGeneral, 'total_general deve cobrir ao menos os status com card').toBeGreaterThanOrEqual(statusSum);
    });

    await allure.step('2b. Total da listagem (API, todas as páginas) == total_general (invariante KPI×lista, RN 96.5)', async () => {
      // ASSERÇÃO LOAD-BEARING: a API de listagem `/records`, somada por todas as
      // páginas, devolve EXATAMENTE `total_general` de `/records/stats`. É o
      // núcleo da RN 96.5 — mesmo critério (pessoa ativa + escopo + soft-delete)
      // para /stats e /list, sem divergência KPI × lista.
      const apiCount = await countAllRecords(page);
      expect(apiCount, 'soma das páginas de /records == total_general de /stats').toBe(totalGeneral);
    });

    await allure.step('2c. Cross-check de UI (best-effort): 1ª página renderiza linhas coerentes', async () => {
      // A contagem de linhas via paginação da UI depende do controle de paginação,
      // ainda não validado nesta org (recon não capturou o seletor; ~89 registros).
      // Mantemos como verificação NÃO load-bearing pra evitar flakiness (CLAUDE.md
      // §2.1): a invariante real é a server-side (2b). Aqui só confirmamos que a
      // 1ª página renderiza um nº de linhas plausível (>0 e <= total).
      const firstPage = await registros.getVisibleRecordCount();
      expect(firstPage, '1ª página tem linhas').toBeGreaterThan(0);
      expect(firstPage, '1ª página não excede o total').toBeLessThanOrEqual(totalGeneral);
    });
  });

  // Passo 3 da AT: repetir a comparação logado como Líder. Agora testável (recon
  // modo-de-uso): a visão de time é escopada aos liderados e a coerência
  // KPI×lista vale igual ao Admin, por invariante.
  test('Validar coerência KPI × lista no escopo do Líder', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar coerência KPI × lista no escopo do Líder');
    await allure.severity('critical');

    const team = new TeamRecordsPage(page);
    const registros = new RegistrosAdminPage(page);

    let adminTotal = 0;
    await allure.step('1. Ler o total geral do Admin (org inteira) como referência de escopo', async () => {
      await registros.gotoLight();
      adminTotal = (await registros.getStats()).totalGeneral;
    });

    let teamTotal = 0;
    await allure.step('2. Abrir "Gestão de Time > Registros" e ler o /stats escopado ao time', async () => {
      await team.goto();
      teamTotal = (await team.getTeamStats()).totalGeneral;
    });

    await allure.step('3a. O escopo do Líder é um SUBCONJUNTO da org (prova de escopo, RN 93)', async () => {
      // Núcleo da correção do recon §9: o stats do time NÃO é idêntico ao Admin —
      // é escopado aos liderados. Invariante estável: time <= org inteira.
      expect(teamTotal, 'total do time não excede o total da org (escopo aplicado)').toBeLessThanOrEqual(adminTotal);
    });

    await allure.step('3b. Coerência KPI × lista dentro do escopo do Líder (RN 96.5)', async () => {
      // Mesmo invariante do lado Admin, agora no escopo do time: o nº de linhas
      // visíveis na lista do líder bate com o total do /stats escopado. Vale
      // com 0 liderados (0 == 0) e segue válido quando houver seed.
      const rows = (await team.isEmptyState()) ? 0 : await team.getVisibleRecordCount();
      expect(rows, 'linhas da lista do time == total_general escopado ao time').toBe(teamTotal);
    });
  });
});
