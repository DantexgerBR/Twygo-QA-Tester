import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';

const SUITE = 'KPI cards como filtro de status (Aluno)';

// fixme (pendente de verificação — bloqueado por instabilidade do env, 2026-06-22).
// RN 28: APLICAR um filtro do drawer e verificar que (a) o número do KPI não reage
// e (b) a lista mostra a interseção card+drawer.
//
// EVOLUÇÃO desta sessão:
//   - SEED resolvido: o env passou a ter registros (3 de origem "Externo"), então
//     há massa para um filtro atuar.
//   - MECANISMO: o drawer NÃO está vazio — "Filtros padrão/compartilhados/Meus"
//     ficam vazios, mas o botão "Novo" abre o modo de Edição de filtro (mesmo
//     componente da skill testar-filtro-drawer-twygo: #form-filter-*,
//     #menu-button-plus-options-filters, #form-filter-apply) onde se cria um
//     filtro por coluna (ex.: Origem = Externo). É esse o caminho a implementar.
//   - BLOQUEIO atual: a faixa de KPIs/drawer do env registrosf2.stage hidrata de
//     forma INTERMITENTE (renderizou no TC10 mas falhou em 6 recons seguidos) por
//     contenção da sessão paralela (1-sessão-por-user) + carga do staging. Não deu
//     para reconhecer as colunas/IDs exatos do drawer de Registros nem verificar.
//   - Usuário dedicado (qakpitc8session2@twygotest.com, env staging-registros-
//     externos-s2) NÃO serve: usuário recém-criado renderiza "Meu Histórico" em
//     branco (sem a faixa) — só usuário estabelecido renderiza o app de Registros.
//
// PRÓXIMO PASSO (quando o env estiver estável e SEM sessão paralela no mesmo user):
//   1. Recon: drawer → "Novo" → "Opções de filtro" → colunas reais de Registros
//      (Origem/Provedor/Status/Tipo) + tipo de input de cada uma.
//   2. Implementar applyColumnFilter(column, value) no MeuHistoricoPage (espelhar
//      PaineisListPage.applyColumnFilter; IDs do componente são canônicos).
//   3. Tirar este fixme e:
//      noteCount = getCount('pending'); clickCard('pending');
//      openFilterDrawer(); applyColumnFilter('Origem','Externo');
//      expect(getCount('pending')).toBe(noteCount)            // RN 28: KPI não reage
//      // + lista = interseção (Pendentes ∩ Origem=Externo).
test.describe(SUITE, () => {
  test.fixme(
    'Validar independência da contagem em relação ao drawer de filtros',
    async ({ page }) => {
      const meuHistorico = new MeuHistoricoPage(page);
      await allure.epic('Twygo - Registros de Aprendizagem');
      await allure.feature(SUITE);
      await allure.story('Validar independência da contagem em relação ao drawer de filtros');

      const pendentesAntes = await meuHistorico.goto().then(() => meuHistorico.getCount('pending'));
      await meuHistorico.clickCard('pending');
      await meuHistorico.openFilterDrawer();
      await meuHistorico.applyDefaultFilter('Expirados');
      expect(await meuHistorico.getCount('pending')).toBe(pendentesAntes);
    },
  );
});
