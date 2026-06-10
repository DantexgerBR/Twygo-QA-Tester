import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

// TCs de reorder/reparent via drag-and-drop (dnd-kit). A skill
// testar-estudio-criacao-twygo documenta que `dragTo` não funciona (PointerSensor)
// e que a ZONA de drop decide a semântica (centro=aninha, borda=reordena) — um
// drop impreciso CORROMPE a estrutura do curso COMPARTILHADO para os demais
// specs. Fica bloqueado até haver helper de drag robusto + sandbox de atividades
// descartáveis (ou reset de DB). Categoria `bloqueio-temporario` (§7.6 F).
// Relacionado: TC11 (reorder API) já fixme em add-excluir-atividade.spec.ts.
test.describe(suiteData.suiteName, () => {
  test('Validar recálculo automático de posição numérica após reorder', async () => {
    test.fixme(
      true,
      '[bloqueio-temporario] requer drag robusto (dnd-kit) + sandbox de atividades descartáveis p/ não corromper o curso compartilhado. Ver skill testar-estudio-criacao-twygo.',
    );
  });

  test('Validar drag and drop restrito à janela carregada', async () => {
    test.fixme(
      true,
      '[bloqueio-temporario] requer seed de volume (janela de scroll) + drag robusto + sandbox. Ver skill testar-estudio-criacao-twygo.',
    );
  });

  test('Validar reparentação livre (filho movido para fora do pai)', async () => {
    test.fixme(
      true,
      '[bloqueio-temporario] reparent via drop no centro/borda corrompe estrutura compartilhada; requer sandbox + helper robusto. Ver skill testar-estudio-criacao-twygo.',
    );
  });
});
