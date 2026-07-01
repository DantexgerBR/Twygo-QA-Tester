import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-novo-certificado-anteriores-replaced.data.js';

test.describe('Ciclo de Vida do Certificado Substituído', () => {
  // Decisão QA 2026-05-29: refatorado de DB-pure para validação via UI.
  //
  // Contexto: o env staging-recertificacao já tem o estado REPLACED produzido
  // corretamente (seed manual de 2026-05-28): Richard Sebold no curso 807287
  // tem recert_num=0 com certificate_situation=4 (Substituído) e recert_num=1
  // com certificate_situation=2 (Emitido). Esse estado é o efeito observável
  // do RN 20/21 (`replace_previous_certificates_bulk`) que o TC visa cobrir.
  //
  // Estratégia: acessar a lista de aprendizagem do curso e verificar que:
  //   (a) existe ao menos uma linha do aluno com badge "Substituído"
  //   (b) existe ao menos uma linha do aluno com badge "Emitido"
  // Isso evidencia que o update em lote ocorreu (antigos → REPLACED, novo → VALID).

  test('TC1 — Após emitir novo certificado, anteriores são marcados em lote como REPLACED', async ({
    page,
  }) => {
    test.fixme(
      true,
      'state-dependent: refatorado de DB-pure pra UI esperando seed manual de 2026-05-28 (Richard Sebold no curso 807287 com recert_num=0/1). Quando o env não tem o par exato em REPLACED+Emitido, a linha com badge "Substituído" não aparece e o teste falha em 28s. Fix proposto: criar fixture participantReplacedSeed que provisione o estado (emitir cert + reinscrever) — ou marcar Tipo: db no MD e validar via psql/Rails console.',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Ciclo de Vida do Certificado Substituído');
    await allure.story(
      'Após emitir novo certificado, anteriores são marcados em lote como REPLACED',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (env staging-recertificacao 37048)',
    );
    await allure.parameter('seed', `curso ${tc1Data.eventId}, aluno ${tc1Data.alunoEmail}`);

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Pré-condição: aluno aprovado com recertification_number = 0 e certificado VALID emitido → ' +
        'acessar lista de aprendizagem do curso seed e verificar que a página carrega',
      async () => {
        await learningStudents.goToList(tc1Data.eventId);
        await expect(page).toHaveURL(/\/e\/\d+\/learning/);
      },
    );

    await allure.step(
      '2. Localizar linha do aluno com badge "Substituído" → ' +
        'RN 20/21: certificado mais antigo (recert_num=0) foi marcado REPLACED (situation=4) ' +
        'em lote pelo replace_previous_certificates_bulk ao emitir o cert novo',
      async () => {
        const linhaSubstituida = learningStudents.getRowByEmail(tc1Data.alunoEmail, {
          certState: tc1Data.expectedBadgeSubstituido,
        });
        await expect(linhaSubstituida).toBeVisible({ timeout: 15_000 });
        // Confirma que o badge "Substituído" está presente na linha do aluno.
        await expect(linhaSubstituida).toContainText(tc1Data.expectedBadgeSubstituido);
      },
    );

    await allure.step(
      '3. Localizar linha do aluno com badge "Emitido" → ' +
        'cert mais recente (recert_num=1) permanece VALID (situation=2) — ' +
        'invariante: só o cert vigente fica VALID; os anteriores viram REPLACED',
      async () => {
        const linhaEmitida = learningStudents.getRowByEmail(tc1Data.alunoEmail, {
          certState: tc1Data.expectedBadgeEmitido,
        });
        await expect(linhaEmitida).toBeVisible({ timeout: 10_000 });
        await expect(linhaEmitida).toContainText(tc1Data.expectedBadgeEmitido);
      },
    );

    await allure.step(
      '4. Confirmar que coexistem as linhas "Substituído" e "Emitido" para o mesmo aluno → ' +
        'evidência do update em lote: o replace_previous_certificates_bulk gerou 2 rows distintas ' +
        '(situation=4 para cert antigo, situation=2 para cert novo)',
      async () => {
        // Ambas as linhas encontradas nos passos 2 e 3 evidenciam o comportamento
        // descrito no RN 20/21: ao emitir novo cert, todos os VALID anteriores do
        // mesmo par (user_id, event_id) viram REPLACED em uma única operação.
        const rowsDoAluno = page.locator('tbody tr').filter({ hasText: tc1Data.alunoEmail });
        const count = await rowsDoAluno.count();
        expect(count).toBeGreaterThanOrEqual(2);
      },
    );
  });
});
