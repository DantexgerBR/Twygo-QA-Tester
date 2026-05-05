# Permitir a visualizacao da politica de creditos de IA + Runner

## Application Overview

Testsuite: Permitir a visualizacao da politica de creditos de IA + Runner. Projeto: Twygo Gestao de Creditos de IA - Fase 2. Destino final: specs/permitir-a-visualizacao-da-politica-de-creditos-de-ia-runner/plan.md (mover apos criacao do diretorio). A tela /o/36602/ai_consumption_analysis exibe uma tabela de consumo aproximado de creditos de IA por tipo de acao na aba Politica de creditos de IA. Os dois testcases validam: (1) as 7 linhas de indexacao de conteudo com valores e descricoes; (2) a linha do agente de atendimento. Pre-condicoes nao automatizadas: acesso SuperAdmin, contrato com Agente de atendimento habilitado, feature flag analise_creditos_ia_beta_test habilitada, runner executado. Login via storageState global (outputs/.auth/storage.json). URL final apos clicar no tab: ?tab=ai_credits_policy. IDs das linhas: indexacao de conteudo = 61 (Video), 62 (Texto), 63 (PDF), 64 (Imagem), 65 (PPTX), 66 (CSV), 67 (DOCX); agente de atendimento = 68. Padrao data-test-id: ai-credits-policy-{title|credits|description}-{id}. Container tabela: ai-consumption-analysis-ai-credits-policy-table-container. Botao ajuda: ai-consumption-analysis-ai-credits-policy-help-button.

## Test Scenarios

### 1. Permitir a visualizacao da politica de creditos de IA + Runner

**Seed:** `tests/seed.spec.ts`

#### 1.1. Politica de creditos de IA - Indexacao de conteudo + RUNNER

**File:** `tests/features/permitir-a-visualizacao-da-politica-de-creditos-de-ia-runner/indexacao-conteudo-runner.spec.ts`

**Steps:**
  1. SETUP ALLURE: import * as allure from 'allure-js-commons' (NAO allure-playwright). No corpo do test(): await allure.epic('Twygo - Gestao de Creditos de IA - Fase 2'); await allure.feature('Permitir a visualizacao da politica de creditos de IA + Runner'); await allure.story('Politica de creditos de IA - Indexacao de conteudo + RUNNER'); await allure.severity('critical'). importance=3 = critical.
    - expect: Annotations Allure configuradas corretamente
  2. NAVEGACAO: await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=policy'). NAO fazer login manual - storageState ja carregado pelo global-setup via use.storageState no playwright.config.ts.
    - expect: URL contem /o/36602/ai_consumption_analysis
    - expect: Nao redireciona para /users/login
  3. ATIVAR TAB: await page.getByRole('tab', { name: 'Politica de creditos de IA' }).click(). Aguardar container: await expect(page.getByTestId('ai-consumption-analysis-ai-credits-policy-table-container')).toBeVisible(). O tab Extrato e selecionado por padrao ao acessar a URL mesmo com ?tab=policy.
    - expect: Tab com role=tab name='Politica de creditos de IA' clicado com sucesso
    - expect: data-test-id='ai-consumption-analysis-ai-credits-policy-table-container' visivel apos clique
    - expect: URL muda para ?tab=ai_credits_policy
  4. VERIFICAR CABECALHOS: await expect(page.getByRole('columnheader', { name: 'Acao' })).toBeVisible(); await expect(page.getByRole('columnheader', { name: 'Creditos aproximados' })).toBeVisible(); await expect(page.getByRole('columnheader', { name: 'Descricao' })).toBeVisible().
    - expect: Coluna 'Acao' visivel
    - expect: Coluna 'Creditos aproximados' visivel
    - expect: Coluna 'Descricao' visivel
  5. allure.step('1. Verificar linha Video'): Indexacao de conteudo - Video (60 minutos). Locators com getByTestId() usando atributo data-test-id (configurado em playwright.config.ts use.testIdAttribute='data-test-id'): page.getByTestId('ai-credits-policy-title-61'), page.getByTestId('ai-credits-policy-credits-61'), page.getByTestId('ai-credits-policy-description-61'). Asserções: toContainText('Indexacao de conteudo - Video (60 minutos)'), toContainText('~2000-2400'), toContainText('Sincronizacao de videos para aprendizado da IA').
    - expect: ai-credits-policy-title-61 contem 'Indexacao de conteudo - Video (60 minutos)'
    - expect: ai-credits-policy-credits-61 contem '~2000-2400'
    - expect: ai-credits-policy-description-61 contem 'Sincronizacao de videos para aprendizado da IA'
  6. allure.step('1. Verificar linha Texto'): Indexacao de conteudo - Texto (10.000 caracteres). Locators: getByTestId('ai-credits-policy-title-62'), getByTestId('ai-credits-policy-credits-62'), getByTestId('ai-credits-policy-description-62'). Asserções: toContainText('Indexacao de conteudo - Texto (10.000 caracteres)'), toContainText('~80-120'), toContainText('Sincronizacao de conteudo em texto para aprendizado da IA').
    - expect: ai-credits-policy-title-62 contem 'Indexacao de conteudo - Texto (10.000 caracteres)'
    - expect: ai-credits-policy-credits-62 contem '~80-120'
    - expect: ai-credits-policy-description-62 contem 'Sincronizacao de conteudo em texto para aprendizado da IA'
  7. allure.step('1. Verificar linha PDF'): Indexacao de conteudo - PDF (100 paginas). Locators: getByTestId('ai-credits-policy-title-63'), getByTestId('ai-credits-policy-credits-63'), getByTestId('ai-credits-policy-description-63'). Asserções: toContainText('Indexacao de conteudo - PDF (100 paginas)'), toContainText('~20-40'), toContainText('Sincronizacao de arquivos PDF para aprendizado da IA').
    - expect: ai-credits-policy-title-63 contem 'Indexacao de conteudo - PDF (100 paginas)'
    - expect: ai-credits-policy-credits-63 contem '~20-40'
    - expect: ai-credits-policy-description-63 contem 'Sincronizacao de arquivos PDF para aprendizado da IA'
  8. allure.step('1. Verificar linha Imagem'): Indexacao de conteudo - Imagem (10 imagens). Locators: getByTestId('ai-credits-policy-title-64'), getByTestId('ai-credits-policy-credits-64'), getByTestId('ai-credits-policy-description-64'). Asserções: toContainText('Indexacao de conteudo - Imagem (10 imagens)'), toContainText('~1-3'), toContainText('Sincronizacao de imagens para aprendizado da IA').
    - expect: ai-credits-policy-title-64 contem 'Indexacao de conteudo - Imagem (10 imagens)'
    - expect: ai-credits-policy-credits-64 contem '~1-3'
    - expect: ai-credits-policy-description-64 contem 'Sincronizacao de imagens para aprendizado da IA'
  9. allure.step('1. Verificar linha PPTX'): Indexacao de conteudo - PPTX (8 slides). Locators: getByTestId('ai-credits-policy-title-65'), getByTestId('ai-credits-policy-credits-65'), getByTestId('ai-credits-policy-description-65'). Asserções: toContainText('Indexacao de conteudo - PPTX (8 slides)'), toContainText('~3-8'), toContainText('Sincronizacao de arquivos PPT para aprendizado da IA').
    - expect: ai-credits-policy-title-65 contem 'Indexacao de conteudo - PPTX (8 slides)'
    - expect: ai-credits-policy-credits-65 contem '~3-8'
    - expect: ai-credits-policy-description-65 contem 'Sincronizacao de arquivos PPT para aprendizado da IA'
  10. allure.step('1. Verificar linha CSV'): Indexacao de conteudo - CSV (150 linhas). Locators: getByTestId('ai-credits-policy-title-66'), getByTestId('ai-credits-policy-credits-66'), getByTestId('ai-credits-policy-description-66'). Asserções: toContainText('Indexacao de conteudo - CSV (150 linhas)'), toContainText('~1-3'), toContainText('Sincronizacao de arquivos CSV para aprendizado da IA').
    - expect: ai-credits-policy-title-66 contem 'Indexacao de conteudo - CSV (150 linhas)'
    - expect: ai-credits-policy-credits-66 contem '~1-3'
    - expect: ai-credits-policy-description-66 contem 'Sincronizacao de arquivos CSV para aprendizado da IA'
  11. allure.step('1. Verificar linha DOCX'): Indexacao de conteudo - DOCX (100 paginas). Locators: getByTestId('ai-credits-policy-title-67'), getByTestId('ai-credits-policy-credits-67'), getByTestId('ai-credits-policy-description-67'). Asserções: toContainText('Indexacao de conteudo - DOCX (100 paginas)'), toContainText('~20-40'), toContainText('Sincronizacao de arquivos DOC para aprendizado da IA').
    - expect: ai-credits-policy-title-67 contem 'Indexacao de conteudo - DOCX (100 paginas)'
    - expect: ai-credits-policy-credits-67 contem '~20-40'
    - expect: ai-credits-policy-description-67 contem 'Sincronizacao de arquivos DOC para aprendizado da IA'

#### 1.2. Politica de creditos de IA - agente de atendimento + RUNNER

**File:** `tests/features/permitir-a-visualizacao-da-politica-de-creditos-de-ia-runner/agente-atendimento-runner.spec.ts`

**Steps:**
  1. SETUP ALLURE: import * as allure from 'allure-js-commons'. No corpo do test(): await allure.epic('Twygo - Gestao de Creditos de IA - Fase 2'); await allure.feature('Permitir a visualizacao da politica de creditos de IA + Runner'); await allure.story('Politica de creditos de IA - agente de atendimento + RUNNER'); await allure.severity('critical'). importance=3 = critical.
    - expect: Annotations Allure configuradas corretamente
  2. NAVEGACAO: await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=policy'). NAO fazer login manual - storageState ja carregado pelo global-setup.
    - expect: URL contem /o/36602/ai_consumption_analysis
    - expect: Nao redireciona para /users/login
  3. ATIVAR TAB: await page.getByRole('tab', { name: 'Politica de creditos de IA' }).click(). Aguardar container: await expect(page.getByTestId('ai-consumption-analysis-ai-credits-policy-table-container')).toBeVisible(). O tab Extrato e selecionado por padrao ao acessar a URL mesmo com ?tab=policy.
    - expect: Tab 'Politica de creditos de IA' ativo apos clique
    - expect: data-test-id='ai-consumption-analysis-ai-credits-policy-table-container' visivel
    - expect: URL muda para ?tab=ai_credits_policy
  4. allure.step('1. Verificar linha Agente de atendimento'): Agente de atendimento Resposta (ID=68). Locators: page.getByTestId('ai-credits-policy-title-68'), page.getByTestId('ai-credits-policy-credits-68'), page.getByTestId('ai-credits-policy-description-68'). ATENCAO: o titulo real usa travessao U+2013 'Agente de atendimento – Resposta'. Usar toContainText parcial para evitar fragilidade: toContainText('Agente de atendimento'). Asserções completas: toContainText('Agente de atendimento'), toContainText('~3-10'), toContainText('Cada resposta gerada pelo assistente virtual').
    - expect: ai-credits-policy-title-68 contem 'Agente de atendimento'
    - expect: ai-credits-policy-credits-68 contem '~3-10'
    - expect: ai-credits-policy-description-68 contem 'Cada resposta gerada pelo assistente virtual'
