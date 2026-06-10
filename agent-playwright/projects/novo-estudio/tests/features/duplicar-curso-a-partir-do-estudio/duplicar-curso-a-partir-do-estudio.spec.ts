import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './duplicar-curso-a-partir-do-estudio.shared.data.js';

// ============================================================================
// Suíte #R16 — "Duplicar curso a partir do Estúdio" / "Salvar como novo" (1.16).
//
// Os 12 TCs partem TODOS do botão "Salvar como novo" no menu secundário do topo
// do Estúdio. Recon read-only 2026-06-09 (org 37061, curso 807533) confirmou
// que NÃO existe: 0 ocorrências de "Salvar como novo"/"Publicar"/"Duplicar" e
// nenhum "menu secundário" no topo (só abas + Voltar + Abrir copiloto). Feature
// NÃO implementada nesta entrega (não é bug) — #R16 é P3 "se der tempo" no
// Discovery. Evidência: inputs/recon-duplicar-curso.md +
// outputs/novo-estudio/recon-1.16-estudio.png. Tracking: card 19720.
//
// Categorias de fixme:
//  - [feature-ausente]  botão/menu "Salvar como novo" inexistente na 37061
//  - [dep-externa]      mesmo com a feature, exige simular falha (TC12)
// ============================================================================

test.describe(suiteData.suiteName, () => {
  test('Botão "Salvar como novo" visível no menu secundário do topo', async () => {
    test.fixme(
      true,
      `[feature-ausente] não há botão "Salvar como novo" nem menu secundário no topo do Estúdio (org 37061, recon ${suiteData.reconDate}) — raiz de toda a suíte. Card ${suiteData.trackingCard}.`,
    );
  });

  test('Botão visível apenas em cursos já criados', async () => {
    test.fixme(true, '[feature-ausente] o botão "Salvar como novo" não existe em nenhum estado (curso já criado incluído).');
  });

  test('Botão NÃO visível em curso novo em branco', async () => {
    test.fixme(true, '[feature-ausente] não há botão "Salvar como novo" para validar ocultação; a feature inexiste.');
  });

  test('Click dispara job assíncrono de cópia', async () => {
    test.fixme(true, '[feature-ausente] sem o botão "Salvar como novo" não há job de cópia disparável.');
  });

  test('Novo Event criado com nome sufixo "(cópia)"', async () => {
    test.fixme(true, '[feature-ausente] a cópia com sufixo "(cópia)" pressupõe o fluxo de duplicação, inexistente.');
  });

  test('EventContents e assets copiados', async () => {
    test.fixme(true, '[feature-ausente] cópia de atividades/assets pressupõe o job de duplicação, inexistente.');
  });

  test('Questions e QuestionLists associadas copiadas', async () => {
    test.fixme(true, '[feature-ausente] cópia de questionários pressupõe o job de duplicação, inexistente.');
  });

  test('Banner, certificado e modelo de marca copiados', async () => {
    test.fixme(true, '[feature-ausente] cópia de configs visuais pressupõe o job de duplicação, inexistente.');
  });

  test('Histórico de chat NÃO é copiado', async () => {
    test.fixme(true, '[feature-ausente] validar que o chat não é copiado pressupõe o job de duplicação, inexistente.');
  });

  test('Inscrições, pagamentos, métricas NÃO copiados', async () => {
    test.fixme(true, '[feature-ausente] validar a não-cópia de dados sensíveis pressupõe o job de duplicação, inexistente.');
  });

  test('Redirect para Estúdio do novo curso ao concluir', async () => {
    test.fixme(true, '[feature-ausente] o redirect pós-cópia pressupõe o job de duplicação, inexistente.');
  });

  test('Atomicidade: falha no meio gera rollback ou estado consistente', async () => {
    test.fixme(
      true,
      '[feature-ausente] + [dep-externa] pressupõe o job de duplicação (inexistente) + curso com 100 atividades + simular falha forçada na atividade 80.',
    );
  });
});
