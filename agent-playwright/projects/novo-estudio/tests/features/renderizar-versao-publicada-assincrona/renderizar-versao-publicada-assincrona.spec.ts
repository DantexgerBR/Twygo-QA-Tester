import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { suiteData } from './renderizar-versao-publicada-assincrona.shared.data.js';

// ============================================================================
// Suíte #R12 — "Renderizar versão publicada de forma assíncrona" (QA 1.12).
//
// Os 12 TCs partem TODOS de "clicar 'Publicar alterações' dispara o job de
// render". Recon read-only em 2026-06-09 (org 37061, curso 807533) confirmou
// que NÃO existe o gatilho na UI do Estúdio: 0 ocorrências de "Publicar" em
// qualquer nó da página; dos 4 botões que a AT espera no topo, só "Visualizar
// como aluno" existe. Feature NÃO implementada nesta entrega (não é bug) —
// #R12 é P2 e, pela RN 46.1, independe do #R8. Detalhe e evidência em
// inputs/recon-renderizar-versao-publicada.md + outputs/novo-estudio/
// recon-1.12-estudio.png. Tracking: card Artia 19716.
//
// Todos os TCs ficam fixme até a feature entrar. Quando o botão "Publicar
// alterações" existir na UI, remover o fixme e implementar — a maioria dos
// passos UI já está descrita aqui. Categorias:
//  - [feature-ausente]  gatilho "Publicar alterações" inexistente na 37061
//  - [dep-externa]      mesmo com a feature, exige painel/serviço externo
//                       (Sidekiq, Bunny.net, caixa de e-mail, falha forçada)
//  - [db]               asserção em banco (executor agent-db — CONTRACT.md)
//  - [bloqueado-logging] logging de auditoria não implementado (já na AT)
// ============================================================================

test.describe(suiteData.suiteName, () => {
  test('Clicar "Publicar alterações" dispara job assíncrono', async () => {
    test.fixme(
      true,
      `[feature-ausente] botão "Publicar alterações" inexistente na UI do Estúdio (org 37061, recon ${suiteData.reconDate}) — raiz de toda a suíte. Card ${suiteData.trackingCard}.`,
    );
  });

  test('Atividade marcada como is_rendering = true durante o job', async () => {
    test.fixme(
      true,
      `[feature-ausente] + [db] SELECT is_rendering FROM event_contents só faz sentido com o job disparado; o gatilho não existe (recon ${suiteData.reconDate}). Parte de banco é executor=agent-db quando a feature entrar.`,
    );
  });

  test('Worker Sidekiq orquestra render + assembly + upload', async () => {
    test.fixme(
      true,
      '[feature-ausente] + [dep-externa] requer o job (inexistente) + painel Sidekiq do Stage, fora do alcance do agente Playwright.',
    );
  });

  test('Upload para Bunny.net e atualização de VideoPlatformData', async () => {
    test.fixme(
      true,
      '[feature-ausente] + [dep-externa] + [db] requer o job (inexistente) + painel Bunny.net + consulta a VideoPlatformData (agent-db).',
    );
  });

  test('Badge "renderizando" + barra de progresso via WebSocket', async () => {
    test.fixme(
      true,
      `[feature-ausente] sem o gatilho de publicação não há estado de renderização; nenhum texto "renderiz…" na página (recon ${suiteData.reconDate}).`,
    );
  });

  test('Instrutor pode editar outras atividades durante render', async () => {
    test.fixme(
      true,
      '[feature-ausente] cenário pressupõe uma atividade em renderização; sem o gatilho de publicação o estado não existe.',
    );
  });

  test('Editar a atividade que está em render é bloqueado', async () => {
    test.fixme(
      true,
      '[feature-ausente] o lock "em renderização" pressupõe o job de render, que não é disparável (gatilho ausente).',
    );
  });

  test('Retentativa automática (1x) com delay em falha', async () => {
    test.fixme(
      true,
      '[feature-ausente] + [dep-externa] requer o job (inexistente) + simular falha intermitente no render + inspeção de logs do Sidekiq.',
    );
  });

  test('Falha definitiva: badge "erro" + notificação por email', async () => {
    test.fixme(
      true,
      '[feature-ausente] + [dep-externa] requer o job (inexistente) + forçar falha definitiva + caixa de e-mail do instrutor + NotificationHistory.',
    );
  });

  test('Logs estruturados em postgres_logs para investigação', async () => {
    test.fixme(
      true,
      '[bloqueado-logging] logging de auditoria do Estúdio (RN 48.3) não implementado — confirmado pelo dev Jeiel Alves em 08/06/2026 ("não tem logs ainda"); postgres_logs não existe. Já marcado ⛔ na AT.',
    );
  });

  test('Aluno passa a consumir nova versão na próxima sessão', async () => {
    test.fixme(
      true,
      '[feature-ausente] sem publicação não há "nova versão renderizada" para o aluno consumir; o gatilho não existe.',
    );
  });

  test('Aluno em meio à aula continua na versão antiga', async () => {
    test.fixme(
      true,
      '[feature-ausente] o comportamento de não-interrupção pressupõe publicar uma nova versão durante a sessão do aluno; gatilho ausente.',
    );
  });
});
