import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

/**
 * TC9 (tipo api) — a AT modela o back recusando `ai_fill` com HTTP 403 quando a
 * org está sem a funcionalidade habilitada ou sem crédito (RN 89, validação no
 * back independente do front).
 *
 * RECON 2026-06-29 contradiz o modelo: o endpoint `POST /records/ai_fill` é
 * ASSÍNCRONO e responde **204 (aceito)** — tanto com a funcionalidade desligada
 * quanto com archive_ids vazio. Não há 403 síncrono observável. O gating
 * provavelmente ocorre no PROCESSAMENTO assíncrono (resultado/sem-resultado via
 * toast), não na resposta HTTP. Além disso, o sub-caso "sem crédito" exige zerar
 * crédito de IA, sem afordância no admin da org 37093.
 *
 * fixme legítimo (Anti-pattern F — contrato do XML/AT diverge do produto).
 * Destinatário: QA Lead/AT (reconciliar o modelo) + dev (confirmar se o gating
 * async é o comportamento correto ou se falta validação síncrona no back).
 */
test.describe.fixme(SUITE, () => {
  test('Validar bloqueio no back para request sem requisitos (403) — AT modela 403 síncrono; produto responde 204 assíncrono', async () => {
    // model mismatch: ai_fill é 204 assíncrono; 403 síncrono não existe neste build.
    // sub-caso "sem crédito" também bloqueado (sem afordância p/ zerar crédito).
  });
});
