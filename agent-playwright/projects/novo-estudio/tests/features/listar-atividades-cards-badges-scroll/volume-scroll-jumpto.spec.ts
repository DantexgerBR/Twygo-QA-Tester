import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

// TCs que exigem curso com VOLUME alto de atividades (pré-condição do AT):
// scroll infinito (50/página), performance (3000+), jump-to para posições 150/75
// (200/100 atividades). O curso de recon (807533) tem 12 → inviável criar
// centenas/milhares via UI. Destinatário: QA Lead (criar seed via DB/bulk) →
// categoria `seed-ausente` (§7.6 F). O COMPONENTE jump-to em si é coberto por
// TC27 (verde); aqui o que falta é o comportamento sob volume.
test.describe(suiteData.suiteName, () => {
  test('Validar scroll infinito carrega próxima página de 50 atividades', async () => {
    test.fixme(
      true,
      '[seed-ausente] requer curso com 50+ atividades p/ disparar paginação do scroll infinito; recon tem 12.',
    );
  });

  test('Validar performance da lista com 3000+ atividades', async () => {
    test.fixme(
      true,
      '[seed-ausente] requer curso com 3000+ atividades; inviável via UI — seed por DB/bulk.',
    );
  });

  test('Validar botão "Ir para atividade X"', async () => {
    test.fixme(
      true,
      '[seed-ausente] AT exige 200+ atividades e jump p/ posição 150; recon tem 12. Componente coberto por TC27.',
    );
  });

  test('Validar que jump-to rola até o card correto', async () => {
    test.fixme(
      true,
      '[seed-ausente] AT exige 100+ atividades e jump p/ posição 75; recon tem 12. Componente coberto por TC27.',
    );
  });
});
