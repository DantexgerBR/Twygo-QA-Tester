// MD canônico §"Trial - Cópia e exclusão de base de conhecimento" — TC1
// seed: tests/seed.spec.ts

import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial - Cópia e exclusão de base de conhecimento', () => {
  // fixme: dupla pré-condição ausente —
  //   (a) Trial dedicada do projeto NÃO provisionada
  //       (projects/base-de-conhecimento/data/trial-env.json não existe).
  //       Skill: provisionar-trial-projeto-twygo (playbook interativo de 8 passos
  //       com 4 pausas manuais: DB update, email unlock, feature flags, contrato).
  //   (b) Org modelo staging-base-de-conhecimento está sem repositórios seedados
  //       (confirmado live 2026-05-19 — empty state em /knowledge_repositories).
  //       Sem dados na origem, não dá pra validar herança na Trial.
  // QA: rodar playbook de provisionamento + seedar org modelo → remover fixme.
  test.fixme('TC1 — Trial criada herda repositórios da organização modelo', async () => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Trial - Cópia e exclusão de base de conhecimento');
    await allure.story('TC1 — Trial criada herda repositórios da organização modelo');
    await allure.severity('critical');
  });
});
