import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './gerar-conteudo-ia-sequencia-fixa.shared.data.js';

// ============================================================================
// TCs NÃO automatizáveis como E2E determinístico nesta suíte (decisão do
// usuário 2026-06-05: affordances + fixme nos longos). Cada fixme carrega a
// categoria e o motivo. Detalhe em inputs/recon-gerar-conteudo-ia.md.
//
// Categorias:
//  - [nao-deterministico]   asserção depende de texto livre gerado pela IA
//  - [geracao-longa]        requer geração real de slides/imagem/áudio/render
//  - [seed-ausente]         requer estado pré-gerado inexistente no curso de recon
//  - [seletor-modo-ausente] UI de escolha de modo não observada no recon (REVISAR AT)
//  - [editor-nao-reconhecido] requer editor Plate.js/Fabric.js (fora do recon)
//  - [websocket]            requer inspeção de eventos ActionCable
// ============================================================================

test.describe(suiteData.suiteName, () => {
  test('Tentar gerar etapa fora de ordem - IA oferece gerar anterior', async () => {
    test.fixme(
      true,
      '[nao-deterministico] clicar etapa fora de ordem dispara resposta livre da IA ("preciso do roteiro primeiro"); asserção de chat não-determinística. A ordem fixa em si é coberta por TC1/TC2 (popover).',
    );
  });

  test('Edição manual no Plate.js conclui Roteiro automaticamente', async () => {
    test.fixme(
      true,
      '[editor-nao-reconhecido] requer editor Plate.js (Page) + edição manual + verificação de conclusão automática do roteiro. Editor fora do recon desta suíte (skill testar-plate-editor-twygo).',
    );
  });

  test('Edição manual no Fabric.js conclui Roteiro automaticamente', async () => {
    test.fixme(
      true,
      '[editor-nao-reconhecido] requer editor Fabric.js (Lesson) + edição manual + conclusão automática do roteiro. Editor fora do recon desta suíte.',
    );
  });

  test('Modo "Assistente por etapas" (default smart user)', async () => {
    test.fixme(
      true,
      '[seletor-modo-ausente] seletor de modo (Assistente/Automático) não observado no disparo via popover (recon 2026-06-05); requer geração real. REVISAR com agent-at se o modo existe por outro caminho.',
    );
  });

  test('Modo "Automático pela IA" (light user)', async () => {
    test.fixme(
      true,
      '[seletor-modo-ausente] + [geracao-longa] requer modo automático gerando roteiro→slides→imagem→áudio sem aprovações; modo não observado no recon.',
    );
  });

  test('Validar escolha de modo no primeiro prompt', async () => {
    test.fixme(
      true,
      '[seletor-modo-ausente] UI de escolha de modo (radio/select) não observada no recon; o copiloto dispara autonomamente. REVISAR com agent-at.',
    );
  });

  test('Validar botão "Regerar imagem" por slide individual', async () => {
    test.fixme(
      true,
      '[geracao-longa] + [seed-ausente] requer Lesson com slides e imagens já geradas para exibir o botão "Regerar imagem" por slide.',
    );
  });

  test('Regerar imagem com prompt customizado por cena', async () => {
    test.fixme(
      true,
      '[geracao-longa] + [seed-ausente] requer imagens já geradas; validar resultado de regeneração é não-determinístico (visual).',
    );
  });

  test('Editar texto do roteiro invalida áudio dependente', async () => {
    test.fixme(
      true,
      '[geracao-longa] + [seed-ausente] requer roteiro E áudio já gerados para validar invalidação do áudio após editar o roteiro.',
    );
  });

  test('Badge "áudio desatualizado" exibida após edição de roteiro', async () => {
    test.fixme(
      true,
      '[geracao-longa] + [badge-superseded] requer estado com áudio gerado + roteiro editado; o badge por letra ("U") está superseded (PO 2026-06-05). REVISAR com agent-at.',
    );
  });

  test('Renderização final só via "Publicar alterações"', async () => {
    test.fixme(
      true,
      '[geracao-longa] requer todas as etapas aprovadas + botão "Publicar alterações" (não reconhecido no recon). A presença da etapa "render" na ordem é coberta por TC1.',
    );
  });

  test('Validar bloqueio das atividades durante processo assíncrono', async () => {
    test.fixme(
      true,
      '[geracao-em-andamento] requer geração assíncrona ativa para validar o lock da atividade (edição bloqueada durante o processamento).',
    );
  });

  test('Streaming de geração via ActionCable', async () => {
    test.fixme(
      true,
      '[websocket] requer inspeção de eventos ActionCable (agent_response_chunk / agent_done) durante geração em tempo real.',
    );
  });

  test('Validar aprovação humana antes de persistir em event_contents', async () => {
    test.fixme(
      true,
      '[db+geracao] mistura UI (aprovar) com consulta a event_contents (MySQL). A parte de banco é executor=agent-db (CONTRACT.md); a parte UI requer geração real.',
    );
  });
});
