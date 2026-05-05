# Histórico do agente de atendimento

## Application Overview

Módulo Créditos de IA do Twygo — aba "Extrato" (URL: /o/36602/ai_consumption_analysis?tab=consumption). Exibe demonstrativo de uso mensal (saldo inicial, renovação, crédito utilizado, saldo final) e tabela de histórico de consumo com colunas: Data, Ação realizada, Usuário, Créditos de IA, Operação, Fonte e Expiração. Permite navegar entre meses e ordenar colunas da tabela. Autenticação via storageState global — sem fluxo de login.

## Test Scenarios

### 1. Visualizar histórico de consumo da indexação e do agente de atendimento

**Seed:** `tests/seed.spec.ts`

#### 1.1. Histórico do agente de atendimento

**File:** `tests/features/visualizar-historico-de-consumo-da-indexacao-e-do-agente-de-atendimento/historico-do-agente-de-atendimento.spec.ts`

**Steps:**
  1. Navegar diretamente para `/o/36602/ai_consumption_analysis?tab=consumption` usando storageState já autenticado (sem login). Aguardar que a aba Extrato esteja visível e o contêiner principal carregue.
    - expect: A URL final contém `?tab=consumption`
    - expect: O elemento com data-testid `ai-consumption-analysis-extract-tab` está visível
    - expect: O título `Demonstrativo de uso de créditos de IA` (data-testid `ai-consumption-statement-title`) está visível
    - expect: O resumo do Pacote de créditos (data-testid `credit-package-summary-container`) está visível com as linhas: Saldo inicial, (+) Renovação mensal, (-) Crédito utilizado, Saldo final
    - expect: O card Saldo final total (data-testid `ai-consumption-total-final-balance-card`) está visível com um valor numérico
  2. Verificar a presença e a ordem das colunas do cabeçalho da tabela de histórico dentro do contêiner data-testid `ai-consumption-analysis-extract-table-container`.
    - expect: A tabela de histórico está visível dentro do contêiner `ai-consumption-analysis-extract-table-container`
    - expect: As colunas existem na seguinte ordem exata: 'Data', 'Ação realizada', 'Usuário', 'Créditos de IA', 'Operação', 'Fonte', 'Expiração'
    - expect: Nenhuma coluna faltando ou fora de ordem
  3. Verificar que existe ao menos um registro de 'agente de atendimento' na tabela de histórico — localizar uma linha cujo valor na coluna 'Ação realizada' seja exatamente 'agente de atendimento'. [REVIEW_NEEDED: este step pressupõe que já existem registros de agente de atendimento gerados previamente no ambiente de stage; caso a tabela esteja vazia, o teste deve ser executado somente após disparar uma interação com o agente de atendimento.]
    - expect: Existe ao menos uma linha na tabela com 'Ação realizada' = 'agente de atendimento'
    - expect: A coluna 'Data' dessa linha exibe data e hora (formato esperado: dd/mm/aaaa hh:mm ou equivalente PT-BR)
    - expect: As demais colunas da linha (Usuário, Créditos de IA, Operação, Fonte, Expiração) estão preenchidas com valores não vazios
  4. Clicar no cabeçalho da coluna 'Ação realizada' para ordenar a tabela em ordem crescente (A→Z). Aguardar a resposta da tabela.
    - expect: A tabela re-renderiza com os registros ordenados crescentemente pelo valor da coluna 'Ação realizada' (A→Z)
    - expect: Indicador visual de ordenação crescente aparece no cabeçalho da coluna (ícone de seta para cima ou equivalente)
    - expect: Os dados das outras colunas de cada linha permanecem consistentes com seus respectivos registros
  5. Clicar novamente no cabeçalho da coluna 'Ação realizada' para inverter para ordem decrescente (Z→A). Aguardar a resposta da tabela.
    - expect: A tabela re-renderiza com os registros ordenados decrescentemente pelo valor da coluna 'Ação realizada' (Z→A)
    - expect: Indicador visual de ordenação decrescente aparece no cabeçalho da coluna (ícone de seta para baixo ou equivalente)
    - expect: Os dados das outras colunas de cada linha permanecem consistentes com seus respectivos registros
  6. [REVIEW_NEEDED] Verificar que registros gerados por um ambiente herdado (com toggle 'Herdar configurações do principal' ativo, ex.: envId 36799 conforme recon da aba Configurações) aparecem no histórico do Extrato do ambiente principal (org 36602) quando a ação foi originada pelo agente de atendimento. Este step requer: (a) confirmar que o ambiente alvo está configurado como herdado na aba Configurações, (b) confirmar que uma interação com o agente de atendimento foi disparada nesse sub-ambiente, (c) verificar que o registro aparece na tabela do ambiente principal. Dependência: dados de teste pré-existentes no stage ou fixture de setup dedicada.
    - expect: Ao menos um registro da tabela com 'Ação realizada' = 'agente de atendimento' reflete consumo originado por um ambiente herdado
    - expect: O campo 'Fonte' ou 'Usuário' da linha identifica o sub-ambiente de origem
    - expect: O registro aparece no Extrato do ambiente principal (org 36602) sem necessidade de acessar o sub-ambiente
  7. [REVIEW_NEEDED] Verificar que registros gerados por um ambiente independente (com toggle 'Herdar configurações do principal' inativo) aparecem no Extrato próprio daquele ambiente, e não no do ambiente principal, quando a ação foi originada pelo agente de atendimento. Este step requer: (a) confirmar que o ambiente alvo está configurado como independente na aba Configurações, (b) confirmar que uma interação com o agente de atendimento foi disparada nesse sub-ambiente, (c) navegar para o Extrato do sub-ambiente e verificar que o registro aparece lá; (d) confirmar que ele não duplica no principal. Dependência: dados de teste pré-existentes no stage ou fixture de setup dedicada.
    - expect: O Extrato do ambiente independente exibe o registro de agente de atendimento disparado nele
    - expect: O registro NÃO aparece no Extrato do ambiente principal (org 36602)
    - expect: A separação de histórico entre ambientes independentes e principal está funcionando corretamente
