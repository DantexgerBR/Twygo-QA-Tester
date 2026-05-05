// spec: specs/politica-creditos-ia-runner.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

const ORG_ID = getOrgId();
const POLICY_PATH = `/o/${ORG_ID}/ai_consumption_analysis?tab=policy`;

const INDEXACAO_ROWS: Array<{
  id: number;
  label: string;
  title: string;
  credits: string;
  description: string;
}> = [
  {
    id: 61,
    label: 'Vídeo',
    title: 'Indexação de conteúdo - Vídeo (60 minutos)',
    credits: '~2000-2400',
    description: 'Sincronização de vídeos para aprendizado da IA',
  },
  {
    id: 62,
    label: 'Texto',
    title: 'Indexação de conteúdo - Texto (10.000 caracteres)',
    credits: '~80-120',
    description: 'Sincronização de conteúdo em texto para aprendizado da IA',
  },
  {
    id: 63,
    label: 'PDF',
    title: 'Indexação de conteúdo - PDF (100 páginas)',
    credits: '~20-40',
    description: 'Sincronização de arquivos PDF para aprendizado da IA',
  },
  {
    id: 64,
    label: 'Imagem',
    title: 'Indexação de conteúdo - Imagem (10 imagens)',
    credits: '~1-3',
    description: 'Sincronização de imagens para aprendizado da IA',
  },
  {
    id: 65,
    label: 'PPTX',
    title: 'Indexação de conteúdo - PPTX (8 slides)',
    credits: '~3-8',
    description: 'Sincronização de arquivos PPT para aprendizado da IA',
  },
  {
    id: 66,
    label: 'CSV',
    title: 'Indexação de conteúdo - CSV (150 linhas)',
    credits: '~1-3',
    description: 'Sincronização de arquivos CSV para aprendizado da IA',
  },
  {
    id: 67,
    label: 'DOCX',
    title: 'Indexação de conteúdo - DOCX (100 páginas)',
    credits: '~20-40',
    description: 'Sincronização de arquivos DOC para aprendizado da IA',
  },
];

test.describe('Permitir a visualização da política de créditos de IA + Runner', () => {
  test('Política de créditos de IA - Indexação de conteúdo + RUNNER', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Permitir a visualização da política de créditos de IA + Runner');
    await allure.story('Política de créditos de IA - Indexação de conteúdo + RUNNER');
    await allure.severity('critical');

    await page.goto(POLICY_PATH);
    await dismissCommonModals(page);

    // Hard expects: bloqueiam o resto do teste se falharem (não faz sentido validar
    // linhas se a tabela não está visível).
    await page.getByRole('tab', { name: 'Política de créditos de IA' }).click();
    await expect(
      page.getByTestId('ai-consumption-analysis-ai-credits-policy-table-container'),
    ).toBeVisible();

    // Soft expects: permitem que TODAS as 7 linhas sejam validadas no mesmo run,
    // acumulando falhas em vez de parar na primeira diferença.
    for (let i = 0; i < INDEXACAO_ROWS.length; i++) {
      const row = INDEXACAO_ROWS[i];
      await allure.step(`${i + 1}. Verificar linha ${row.label}`, async () => {
        await expect.soft(page.getByTestId(`ai-credits-policy-title-${row.id}`)).toContainText(row.title);
        await expect.soft(page.getByTestId(`ai-credits-policy-credits-${row.id}`)).toContainText(row.credits);
        await expect.soft(page.getByTestId(`ai-credits-policy-description-${row.id}`)).toContainText(
          row.description,
        );
      });
    }
  });
});
